import { type ParseError, parse as parseJsonc } from "jsonc-parser";

/**
 * Build the output project's wrangler configuration.
 *
 * A project-provided wrangler.jsonc is parsed and merged rather than passed
 * through: the generated Worker cannot function (or cannot function safely)
 * without the settings enforced below, so they are applied on every build —
 * to the top-level configuration and to every named environment, since
 * environments can override inheritable keys (main, compatibility_flags,
 * assets) and do NOT inherit bindings. User-owned settings (routes, vars,
 * extra bindings, observability, limits, name) are preserved. Conflicts fail
 * the build with actionable errors instead of producing a broken deployment.
 * Comments in the input are not preserved — the output is plain JSON.
 */

const REQUIRED_ROUTES = [
  "/_stcore/*",
  "/media/*",
  "/component/*",
  "/app/static/*",
  "/_stlite/*",
];
// Namespace prefixes that must always reach the Worker: Streamlit's server
// routes, and /_stlite/ so the packed runtime (including the user's app
// source) is never served as a public static file.
const PROTECTED_PREFIXES = [
  "/_stcore/",
  "/media/",
  "/component/",
  "/app/static/",
  "/_stlite/",
];

type Obj = Record<string, unknown>;

function asObject(value: unknown): Obj | null {
  return typeof value === "object" && value != null && !Array.isArray(value)
    ? (value as Obj)
    : null;
}

/**
 * Merge run_worker_first honoring Cloudflare's semantics: boolean `true`
 * routes everything to the Worker (strictly stronger than our route list, so
 * it is preserved as-is); `false` disables Worker-first routing entirely and
 * is rejected; array entries may be glob patterns or `!`-prefixed exception
 * patterns, and exceptions override positive patterns regardless of order —
 * so an exception that can match a protected namespace cannot be fixed by
 * appending positives and is rejected instead.
 */
function mergeRunWorkerFirst(
  value: unknown,
  conflicts: string[],
  where: string,
): true | string[] {
  if (value === true) {
    return true;
  }
  if (value === false) {
    conflicts.push(
      `"${where}" must not be false: the generated Worker requires its server namespaces (${REQUIRED_ROUTES.join(", ")}) to reach the Worker before asset matching. Remove it, or set it to true.`,
    );
    return REQUIRED_ROUTES;
  }
  const userPatterns = Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === "string")
    : [];
  for (const pattern of userPatterns) {
    if (!pattern.startsWith("!")) {
      continue;
    }
    // Overlap test on the pattern's static prefix (everything before the
    // first "*"): conservative — any possible overlap with a protected
    // namespace rejects, including suffix-only globs like "!*.png".
    const prefix = pattern.slice(1).split("*")[0];
    const overlapping = PROTECTED_PREFIXES.filter(
      (protectedPrefix) =>
        protectedPrefix.startsWith(prefix) ||
        prefix.startsWith(protectedPrefix),
    );
    if (overlapping.length > 0) {
      conflicts.push(
        `"${where}" exception pattern ${JSON.stringify(pattern)} could exclude ${overlapping.join(", ")} from the Worker, exposing routes the Worker must serve (exception patterns override positive ones). Narrow the pattern away from these namespaces.`,
      );
    }
  }
  const merged = [...userPatterns];
  for (const route of REQUIRED_ROUTES) {
    if (!merged.includes(route)) {
      merged.push(route);
    }
  }
  return merged;
}

function mergeAssets(value: unknown, conflicts: string[], where: string): Obj {
  const assets = { ...(asObject(value) ?? {}) };
  const requireValue = (key: string, required: string) => {
    const current = assets[key];
    if (current != null && current !== required) {
      conflicts.push(
        `"${where}.${key}" must be ${JSON.stringify(required)}, got ${JSON.stringify(current)}.`,
      );
    }
    assets[key] = required;
  };
  const directory = assets.directory;
  if (directory != null && directory !== "./assets" && directory !== "assets") {
    conflicts.push(
      `"${where}.directory" must be "./assets" (the build writes the frontend and packed runtime there), got ${JSON.stringify(directory)}.`,
    );
  }
  assets.directory = "./assets";
  requireValue("binding", "ASSETS");
  requireValue("not_found_handling", "single-page-application");
  assets.run_worker_first = mergeRunWorkerFirst(
    assets.run_worker_first,
    conflicts,
    `${where}.run_worker_first`,
  );
  return assets;
}

/**
 * Validate and complete `durable_objects.bindings`. Three kinds of binding
 * are distinguished: the generated local StliteServer binding, external
 * bindings referencing another Worker's class via `script_name` (preserved),
 * and other local bindings — rejected, because the generated src/entry.py
 * exports only `Default` (plus `StliteServer` in Durable Object mode), so no
 * other local class can exist.
 */
function mergeDurableObjectBindings(
  value: unknown,
  conflicts: string[],
  where: string,
  durableObject: boolean,
): Obj {
  const durable = { ...(asObject(value) ?? {}) };
  const bindings = Array.isArray(durable.bindings)
    ? durable.bindings.map((binding) => asObject(binding) ?? {})
    : [];
  const exportedClasses = durableObject ? ["StliteServer"] : [];
  for (const binding of bindings) {
    if (binding.name === "STLITE_SERVER") {
      if (binding.script_name != null || binding.environment != null) {
        conflicts.push(
          `"${where}": the STLITE_SERVER binding must reference this Worker's own StliteServer class, not another Worker/environment (found script_name/environment).`,
        );
      } else if (binding.class_name !== "StliteServer") {
        conflicts.push(
          `"${where}": the STLITE_SERVER binding must point at class "StliteServer", got ${JSON.stringify(binding.class_name)}.`,
        );
      }
      continue;
    }
    if (binding.script_name != null) {
      continue; // External Worker's class: preserved as-is.
    }
    if (!exportedClasses.includes(binding.class_name as string)) {
      conflicts.push(
        `"${where}": binding ${JSON.stringify(binding.name)} references local class ${JSON.stringify(binding.class_name)}, but the generated src/entry.py exports ${exportedClasses.length > 0 ? `only ${exportedClasses.join(", ")}` : "no Durable Object classes"}. Reference another Worker's class with script_name, or remove the binding.`,
      );
    }
  }
  if (
    durableObject &&
    !bindings.some((binding) => binding.name === "STLITE_SERVER")
  ) {
    bindings.push({ name: "STLITE_SERVER", class_name: "StliteServer" });
  }
  if (bindings.length > 0) {
    durable.bindings = bindings;
  }
  return durable;
}

/**
 * Declare the StliteServer Durable Object class at the top level, honoring
 * whichever declaration style the user's config already committed to:
 * wrangler's `exports` map, or the legacy `migrations` array. The two are
 * mutually exclusive, so only the style already in use is extended and both
 * are never emitted together.
 */
function applyDurableObjectDeclaration(config: Obj, conflicts: string[]): void {
  const exportsCfg = asObject(config.exports);
  if (exportsCfg != null && config.migrations != null) {
    conflicts.push(
      `"exports" and "migrations" are mutually exclusive in wrangler configuration; keep only one Durable Object declaration style.`,
    );
    return;
  }

  if (exportsCfg != null) {
    const merged = { ...exportsCfg };
    const existing = asObject(merged.StliteServer);
    if (existing != null) {
      if (existing.type !== "durable-object") {
        conflicts.push(
          `"exports.StliteServer.type" must be "durable-object", got ${JSON.stringify(existing.type)}.`,
        );
      }
      if (existing.storage != null && existing.storage !== "sqlite") {
        conflicts.push(
          `"exports.StliteServer.storage" must be "sqlite" (the generated Durable Object requires SQLite storage), got ${JSON.stringify(existing.storage)}.`,
        );
      }
      if (existing.state != null && existing.state !== "created") {
        conflicts.push(
          `"exports.StliteServer.state" is ${JSON.stringify(existing.state)}, but the generated Worker needs the class live.`,
        );
      }
      merged.StliteServer = {
        ...existing,
        storage: existing.storage ?? "sqlite",
      };
    } else {
      merged.StliteServer = { type: "durable-object", storage: "sqlite" };
    }
    config.exports = merged;
    return;
  }

  const migrations = Array.isArray(config.migrations)
    ? config.migrations.map((migration) => asObject(migration) ?? {})
    : [];
  const seenTags = new Set<string>();
  for (const migration of migrations) {
    const tag = migration.tag;
    if (typeof tag === "string") {
      if (seenTags.has(tag)) {
        conflicts.push(
          `"migrations" contains duplicate tag ${JSON.stringify(tag)}.`,
        );
      }
      seenTags.add(tag);
    }
    if (
      Array.isArray(migration.deleted_classes) &&
      migration.deleted_classes.includes("StliteServer")
    ) {
      conflicts.push(
        `"migrations" deletes class StliteServer, which the generated Worker requires.`,
      );
    }
    if (
      Array.isArray(migration.renamed_classes) &&
      migration.renamed_classes.some(
        (rename) => asObject(rename)?.from === "StliteServer",
      )
    ) {
      conflicts.push(
        `"migrations" renames class StliteServer, which the generated Worker requires under that name.`,
      );
    }
  }
  const declaredSqlite = migrations.some(
    (migration) =>
      Array.isArray(migration.new_sqlite_classes) &&
      migration.new_sqlite_classes.includes("StliteServer"),
  );
  const declaredKv = migrations.some(
    (migration) =>
      Array.isArray(migration.new_classes) &&
      migration.new_classes.includes("StliteServer"),
  );
  if (declaredKv) {
    conflicts.push(
      `"migrations" declares StliteServer via new_classes (key-value storage), but the generated Durable Object requires SQLite storage: move it to new_sqlite_classes.`,
    );
  }
  if (!declaredSqlite && !declaredKv) {
    let tag = "stlite-v1";
    for (let i = 2; seenTags.has(tag); i += 1) {
      tag = `stlite-v${i}`;
    }
    migrations.push({ tag, new_sqlite_classes: ["StliteServer"] });
  }
  config.migrations = migrations;
}

/** Enforced on the top level and on every named environment. */
function applyWorkerSettings(
  target: Obj,
  conflicts: string[],
  {
    durableObject,
    where,
    topLevel,
  }: { durableObject: boolean; where: string; topLevel: boolean },
): void {
  const prefix = where === "" ? "" : `${where}.`;

  // The scaffolded src/entry.py is the only module exporting the Worker
  // classes this runtime needs.
  if (target.main != null && target.main !== "src/entry.py") {
    conflicts.push(
      `"${prefix}main" must be "src/entry.py" (the scaffolded entry module), got ${JSON.stringify(target.main)}. Put custom Python in your app instead.`,
    );
  }
  if (topLevel) {
    target.main = "src/entry.py";
  }

  // python_workers is the runtime itself; the resident Streamlit runtime
  // resolves promises across request contexts by design (the single-flight
  // init awaited by concurrent requests, the retained lifespan task), and
  // workerd's default drops those continuations once the creating request's
  // context dies, wedging later requests — hence
  // no_handle_cross_request_promise_resolution.
  if (topLevel || target.compatibility_flags != null) {
    const flags = new Set(
      Array.isArray(target.compatibility_flags)
        ? (target.compatibility_flags as string[])
        : [],
    );
    flags.add("python_workers");
    flags.add("no_handle_cross_request_promise_resolution");
    target.compatibility_flags = [...flags];
  }

  // The frontend and the packed runtime are served from the assets layer.
  // Environments inherit the top-level assets block unless they override it;
  // an override must satisfy the same requirements.
  if (topLevel || target.assets != null) {
    target.assets = mergeAssets(target.assets, conflicts, `${prefix}assets`);
  }

  // Bindings are NOT inherited by environments, so in Durable Object mode
  // every environment needs its own STLITE_SERVER binding.
  if (durableObject || target.durable_objects != null) {
    target.durable_objects = mergeDurableObjectBindings(
      target.durable_objects,
      conflicts,
      `${prefix}durable_objects`,
      durableObject,
    );
  }
}

export function buildWranglerConfig({
  workerName,
  durableObject,
  customJsonc,
}: {
  workerName: string;
  durableObject: boolean;
  customJsonc?: string;
}): string {
  let config: Obj = {
    $schema: "node_modules/wrangler/config-schema.json",
  };
  if (customJsonc != null) {
    const parseErrors: ParseError[] = [];
    const parsed = parseJsonc(customJsonc, parseErrors, {
      allowTrailingComma: true,
    });
    if (parseErrors.length > 0 || asObject(parsed) == null) {
      throw new Error(
        "The project's wrangler.jsonc could not be parsed as JSONC.",
      );
    }
    config = { ...config, ...(parsed as Obj) };
  }

  const conflicts: string[] = [];

  config.name ??= workerName;
  config.compatibility_date ??= "2026-06-30";
  config.observability ??= { enabled: true };
  // Cold start (runtime extraction + Pyodide + Streamlit boot) needs far more
  // CPU than the default budget; this requires the Workers Paid plan. A
  // user-provided limits block is preserved as-is.
  config.limits ??= { cpu_ms: 300000 };

  applyWorkerSettings(config, conflicts, {
    durableObject,
    where: "",
    topLevel: true,
  });
  if (durableObject) {
    // The class declaration (exports or migrations) is top-level-only in
    // wrangler configuration and covers every environment.
    applyDurableObjectDeclaration(config, conflicts);
  } else if (asObject(config.exports) != null && config.migrations != null) {
    conflicts.push(
      `"exports" and "migrations" are mutually exclusive in wrangler configuration; keep only one Durable Object declaration style.`,
    );
  }

  const envs = asObject(config.env);
  if (envs != null) {
    const mergedEnvs: Obj = {};
    for (const [envName, rawEnv] of Object.entries(envs)) {
      const env = { ...(asObject(rawEnv) ?? {}) };
      applyWorkerSettings(env, conflicts, {
        durableObject,
        where: `env.${envName}`,
        topLevel: false,
      });
      mergedEnvs[envName] = env;
    }
    config.env = mergedEnvs;
  }

  if (conflicts.length > 0) {
    throw new Error(
      `The project's wrangler.jsonc conflicts with settings the generated Worker requires:\n- ${conflicts.join("\n- ")}`,
    );
  }

  return `${JSON.stringify(config, null, 2)}\n`;
}
