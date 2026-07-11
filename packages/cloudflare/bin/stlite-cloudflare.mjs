#!/usr/bin/env node
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const packageJson = JSON.parse(
  await fs.readFile(path.join(packageRoot, "package.json"), "utf8"),
);

const [command = "help", ...args] = process.argv.slice(2);

try {
  switch (command) {
    case "init":
      await initProject(args);
      break;
    case "build":
      await buildProject(args);
      break;
    case "dev":
      await runWranglerCommand("dev", args);
      break;
    case "deploy":
      await runWranglerCommand("deploy", args);
      break;
    case "clean":
      await cleanProject();
      break;
    case "help":
    case "--help":
    case "-h":
      printHelp();
      break;
    default:
      throw new Error(`Unknown command: ${command}`);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}

async function initProject(args) {
  const targetArg = args.find((arg) => !arg.startsWith("-")) ?? ".";
  const targetDir = path.resolve(process.cwd(), targetArg);
  const templateDir = path.join(packageRoot, "templates", "default");

  await ensureEmptyOrMissing(targetDir);
  await fs.mkdir(targetDir, { recursive: true });
  await copyTemplate(templateDir, targetDir, {
    __PACKAGE_VERSION__: packageJson.version,
    __PROJECT_NAME__: toProjectName(path.basename(targetDir)),
  });

  console.log(`Created stlite Cloudflare project at ${targetDir}`);
  console.log("Next steps:");
  console.log(`  cd ${targetDir}`);
  console.log("  npm install");
  console.log("  npm run dev");
}

async function buildProject(args) {
  const scriptArgs = splitForwardedArgs(args);
  await run(
    "bash",
    [
      path.join(packageRoot, "scripts", "sync-workers-vendor.sh"),
      ...scriptArgs,
    ],
    {
      env: {
        ...process.env,
        STLITE_CLOUDFLARE_PROJECT_DIR: process.cwd(),
        STLITE_CLOUDFLARE_PACKAGE_DIR: packageRoot,
      },
    },
  );
}

async function runWranglerCommand(wranglerCommand, args) {
  const forwardedArgs = splitForwardedArgs(args);
  await buildProject([]);
  await run("npx", ["wrangler", wranglerCommand, ...forwardedArgs]);
}

async function cleanProject() {
  await Promise.all(
    [
      "python_modules",
      ".venv-workers",
      ".pyodide-prebuilt-packages",
      ".stlite-cloudflare-remote-frontend",
    ].map((entry) =>
      fs.rm(path.resolve(process.cwd(), entry), {
        recursive: true,
        force: true,
      }),
    ),
  );
}

function toProjectName(name) {
  const normalized = name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return normalized || "stlite-cloudflare-app";
}

function splitForwardedArgs(args) {
  const separatorIndex = args.indexOf("--");
  return separatorIndex === -1 ? args : args.slice(separatorIndex + 1);
}

async function ensureEmptyOrMissing(targetDir) {
  try {
    const entries = await fs.readdir(targetDir);
    if (entries.length > 0) {
      throw new Error(`Target directory is not empty: ${targetDir}`);
    }
  } catch (error) {
    if (error?.code !== "ENOENT") {
      throw error;
    }
  }
}

async function copyTemplate(sourceDir, targetDir, replacements) {
  const entries = await fs.readdir(sourceDir, { withFileTypes: true });
  await Promise.all(
    entries.map(async (entry) => {
      const sourcePath = path.join(sourceDir, entry.name);
      const targetName =
        entry.name === "_gitignore" ? ".gitignore" : entry.name;
      const targetPath = path.join(targetDir, targetName);
      if (entry.isDirectory()) {
        await fs.mkdir(targetPath, { recursive: true });
        await copyTemplate(sourcePath, targetPath, replacements);
        return;
      }

      const source = await fs.readFile(sourcePath);
      if (isTextTemplate(entry.name)) {
        let text = source.toString("utf8");
        for (const [placeholder, value] of Object.entries(replacements)) {
          text = text.replaceAll(placeholder, value);
        }
        await fs.writeFile(targetPath, text);
      } else {
        await fs.writeFile(targetPath, source);
      }
    }),
  );
}

function isTextTemplate(fileName) {
  return ["_gitignore", ".json", ".jsonc", ".md", ".py", ".toml", ".txt"].some(
    (suffix) => fileName.endsWith(suffix),
  );
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: process.cwd(),
      stdio: "inherit",
      ...options,
    });
    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (code === 0) {
        resolve();
      } else {
        reject(
          new Error(
            `${command} ${args.join(" ")} failed${signal ? ` with signal ${signal}` : ` with exit code ${code}`}`,
          ),
        );
      }
    });
  });
}

function printHelp() {
  console.log(`stlite-cloudflare ${packageJson.version}

Usage:
  stlite-cloudflare init [dir]
  stlite-cloudflare build [-- <extra build args>]
  stlite-cloudflare dev [-- <wrangler args>]
  stlite-cloudflare deploy [-- <wrangler args>]
  stlite-cloudflare clean
`);
}
