import fs from "node:fs/promises";
import path from "node:path";
import ignore from "ignore";
import { parse as parseToml } from "smol-toml";

/**
 * Exclusions that always apply when packaging the user's project into the
 * Worker: version control, secrets, environments, tool caches, and local
 * build state have no place in a deployed app package regardless of what the
 * project's own ignore file says. Kept to names/dirs (no broad content-type
 * extensions) so legitimate application data is never dropped by accident.
 */
const MANDATORY_EXCLUSIONS = [
  ".git/",
  ".env",
  ".env.*",
  "*.env",
  // Conventional local credential files; narrow names only, never broad
  // content patterns, so legitimate app data cannot be swept up. (The
  // fail-loud credential files — Streamlit/Cloudflare secrets — are handled
  // by CREDENTIAL_PATTERNS below, not silently excluded here.)
  ".netrc",
  ".aws/",
  ".venv/",
  "venv/",
  ".direnv/",
  "node_modules/",
  "__pycache__/",
  ".pytest_cache/",
  ".mypy_cache/",
  ".ruff_cache/",
  ".wrangler/",
  ".venv-workers/",
  ".DS_Store",
  // Build inputs consumed by the scaffold, not app data.
  ".stliteignore",
  "wrangler.jsonc",
];

// Files that would ship local credentials into the deployed Worker and any CI
// artifact if packaged, and .gitignore is deliberately not consulted — so
// their presence anywhere in the packaged tree is a hard, loud error rather
// than a silent exclusion. `.streamlit/secrets.toml` is Streamlit's;
// `.dev.vars` / `.dev.vars.<environment>` are Cloudflare's. The leading
// `**/` matches at ANY depth (a bare `.streamlit/secrets.toml` pattern, with
// its internal slash, would be anchored to the tree root and miss a nested
// `subapp/.streamlit/secrets.toml`). This recursive check — applied to both a
// file's own path and any symlink's resolved target during the mirror walk —
// is the single source of truth for credential-file detection.
const CREDENTIAL_PATTERNS = [
  "**/.streamlit/secrets.toml",
  "**/.dev.vars",
  "**/.dev.vars.*",
];

function credentialFileError(description: string): Error {
  return new Error(
    `The project contains a credential file (${description}), which must never be packaged into the deployed Worker. Remove it from the project directory (or keep it outside the app path). Supply sensitive values as encrypted secrets via \`wrangler secret put\` and plain configuration as vars in wrangler.jsonc; both surface to the app through st.secrets and stlite_cloudflare.get_env().`,
  );
}

/**
 * Streamlit's `secrets.files` config option points the runtime at arbitrary
 * TOML secret files or directories, which the packager cannot classify as
 * secrets by name — a configured `credentials.toml` would mirror into the
 * archive like any app file. This deploy target replaces file-based secrets
 * with the Worker environment entirely, so a custom `secrets.files` is
 * rejected outright rather than resolved.
 */
async function rejectCustomSecretsFiles(appDir: string): Promise<void> {
  const configText = await fs
    .readFile(path.join(appDir, ".streamlit", "config.toml"), "utf8")
    .catch(() => null);
  if (configText == null) {
    return;
  }
  let config: unknown;
  try {
    config = parseToml(configText);
  } catch (error) {
    throw new Error(
      `.streamlit/config.toml could not be parsed as TOML: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  const secrets = (config as { secrets?: unknown }).secrets;
  if (secrets != null && typeof secrets === "object" && "files" in secrets) {
    throw new Error(
      `.streamlit/config.toml sets secrets.files, which is not supported by this deploy target: the configured secret files would be packaged into the deployed Worker as ordinary app data. Remove the option and supply secrets through Cloudflare bindings instead (encrypted secrets via \`wrangler secret put\`, plain configuration as vars); both surface through st.secrets and stlite_cloudflare.get_env().`,
    );
  }
}

const LARGE_FILE_THRESHOLD = 5 * 1024 * 1024;

export interface AppMirrorSummary {
  fileCount: number;
  totalBytes: number;
  /** Included files at or above LARGE_FILE_THRESHOLD, largest first. */
  largeFiles: { relPath: string; bytes: number }[];
  excludedCount: number;
}

/**
 * Mirror the user's project directory into the vendored app package,
 * applying the mandatory exclusions plus the project's optional
 * `.stliteignore` (gitignore syntax). `excludeDirs` removes specific
 * absolute paths (the output and cache directories) wherever they are.
 */
export async function mirrorAppDir(
  appDir: string,
  destDir: string,
  excludeDirs: string[] = [],
): Promise<AppMirrorSummary> {
  // Two independent matchers: a path is copied only when NEITHER excludes
  // it. Feeding both rule sets into one matcher would let a later
  // .stliteignore negation (e.g. `!.env`) re-include files the mandatory
  // list guarantees are never packaged; kept separate, user negations only
  // act within the user's own patterns.
  const mandatoryMatcher = ignore().add(MANDATORY_EXCLUSIONS);
  const credentialMatcher = ignore().add(CREDENTIAL_PATTERNS);
  const userMatcher = ignore();
  const stliteignorePath = path.join(appDir, ".stliteignore");
  const stliteignore = await fs
    .readFile(stliteignorePath, "utf8")
    .catch(() => null);
  if (stliteignore != null) {
    userMatcher.add(stliteignore);
  }
  const resolvedExcludes = new Set(excludeDirs.map((dir) => path.resolve(dir)));

  await rejectCustomSecretsFiles(appDir);

  await fs.rm(destDir, { recursive: true, force: true });
  await fs.mkdir(destDir, { recursive: true });

  const summary: AppMirrorSummary = {
    fileCount: 0,
    totalBytes: 0,
    largeFiles: [],
    excludedCount: 0,
  };

  const walk = async (relDir: string): Promise<void> => {
    const entries = await fs.readdir(path.join(appDir, relDir), {
      withFileTypes: true,
    });
    for (const entry of entries) {
      const rel = relDir === "" ? entry.name : `${relDir}/${entry.name}`;
      const src = path.join(appDir, relDir, entry.name);
      const matchPath = entry.isDirectory() ? `${rel}/` : rel;
      // Fail loudly on a credential file anywhere in the packaged tree.
      // Excluded directories are never recursed into (below), so credential
      // files inside e.g. node_modules never reach here.
      if (credentialMatcher.ignores(rel)) {
        throw credentialFileError(rel);
      }
      if (
        resolvedExcludes.has(path.resolve(src)) ||
        mandatoryMatcher.ignores(matchPath) ||
        userMatcher.ignores(matchPath)
      ) {
        summary.excludedCount += 1;
        continue;
      }
      if (entry.isDirectory()) {
        await fs.mkdir(path.join(destDir, rel), { recursive: true });
        await walk(rel);
        continue;
      }
      if (entry.isSymbolicLink()) {
        // Symlinks never survive into the package: the Worker-side archive
        // extraction (tarfile filter="data") rejects unsafe links, and a
        // link named like an excluded directory would bypass the dir-pattern
        // exclusions. Safe in-project file links are dereferenced into
        // regular files below; everything else is a hard error.
        const target = await fs.stat(src).catch(() => null);
        if (target == null) {
          throw new Error(`Broken symlink in the project: ${rel}`);
        }
        const [realSrc, realApp] = await Promise.all([
          fs.realpath(src),
          fs.realpath(appDir),
        ]);
        const realRel = path.relative(realApp, realSrc);
        if (realRel.startsWith("..") || path.isAbsolute(realRel)) {
          throw new Error(
            `Symlink resolves outside the project and cannot be packaged: ${rel} -> ${realSrc}`,
          );
        }
        if (target.isDirectory()) {
          throw new Error(
            `Directory symlinks cannot be packaged: ${rel}. Copy the directory into the project instead.`,
          );
        }
        if (!target.isFile()) {
          throw new Error(
            `Symlink does not resolve to a regular file: ${rel} -> ${realSrc}`,
          );
        }
        // Exclusions apply to the resolved target too — otherwise a benign
        // visible name could smuggle an excluded file's content into the
        // package (e.g. public_config.toml -> subapp/.streamlit/secrets.toml).
        const realRelPosix = realRel.split(path.sep).join("/");
        if (credentialMatcher.ignores(realRelPosix)) {
          throw credentialFileError(`${rel} -> ${realRelPosix}`);
        }
        const targetInExcludedDir = [...resolvedExcludes].some(
          (dir) => realSrc === dir || realSrc.startsWith(dir + path.sep),
        );
        if (
          targetInExcludedDir ||
          mandatoryMatcher.ignores(realRelPosix) ||
          userMatcher.ignores(realRelPosix)
        ) {
          throw new Error(
            `Symlink ${rel} resolves to ${realRelPosix}, which is excluded from packaging; its content cannot be included under another name. Remove the symlink or point it at packageable content.`,
          );
        }
        await fs.copyFile(realSrc, path.join(destDir, rel));
      } else if (entry.isFile()) {
        await fs.cp(src, path.join(destDir, rel));
      } else {
        summary.excludedCount += 1;
        continue;
      }
      const { size } = await fs.stat(path.join(destDir, rel));
      summary.fileCount += 1;
      summary.totalBytes += size;
      if (size >= LARGE_FILE_THRESHOLD) {
        summary.largeFiles.push({ relPath: rel, bytes: size });
      }
    }
  };
  await walk("");
  summary.largeFiles.sort((a, b) => b.bytes - a.bytes);
  return summary;
}

export function formatAppMirrorSummary(summary: AppMirrorSummary): string {
  const mib = (bytes: number) => (bytes / 1024 / 1024).toFixed(1);
  const lines = [
    `Packaged app: ${summary.fileCount} files, ${mib(summary.totalBytes)} MiB` +
      (summary.excludedCount > 0
        ? ` (${summary.excludedCount} entries excluded)`
        : ""),
  ];
  for (const { relPath, bytes } of summary.largeFiles) {
    lines.push(`  large file included: ${relPath} (${mib(bytes)} MiB)`);
  }
  return lines.join("\n");
}
