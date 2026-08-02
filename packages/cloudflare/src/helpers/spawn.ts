import type { SpawnOptions } from "node:child_process";
import crossSpawn from "cross-spawn";

/**
 * Spawn a command, inherit stdio, and resolve when it exits 0 (reject
 * otherwise). Uses cross-spawn so executable resolution works on Windows
 * (`.exe`/`.cmd`/PATHEXT), which `node:child_process.spawn` does not handle.
 */
export function run(
  command: string,
  args: string[],
  options: SpawnOptions = {},
): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = crossSpawn(command, args, { stdio: "inherit", ...options });
    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (code === 0) {
        resolve();
      } else {
        reject(exitError(command, args, code, signal));
      }
    });
  });
}

/**
 * Like {@link run}, but captures stdout (stderr still inherits) and resolves
 * with it on exit 0.
 */
export function output(
  command: string,
  args: string[],
  options: SpawnOptions = {},
): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = crossSpawn(command, args, {
      stdio: ["inherit", "pipe", "inherit"],
      ...options,
    });
    let stdout = "";
    child.stdout?.on("data", (chunk) => {
      stdout += chunk;
    });
    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(exitError(command, args, code, signal));
      }
    });
  });
}

function exitError(
  command: string,
  args: string[],
  code: number | null,
  signal: NodeJS.Signals | null,
): Error {
  return new Error(
    `${command} ${args.join(" ")} failed${
      signal ? ` with signal ${signal}` : ` with exit code ${code}`
    }`,
  );
}
