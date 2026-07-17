import crossSpawn from "cross-spawn";

/**
 * Spawn a command, inherit stdio, and resolve when it exits 0 (reject
 * otherwise). Uses cross-spawn so executable resolution works on Windows
 * (`.exe`/`.cmd`/PATHEXT), which `node:child_process.spawn` does not handle.
 *
 * @param {string} command
 * @param {string[]} args
 * @param {import("node:child_process").SpawnOptions} [options]
 * @returns {Promise<void>}
 */
export function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = crossSpawn(command, args, { stdio: "inherit", ...options });
    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (code === 0) {
        resolve();
      } else {
        reject(
          new Error(
            `${command} ${args.join(" ")} failed${
              signal ? ` with signal ${signal}` : ` with exit code ${code}`
            }`,
          ),
        );
      }
    });
  });
}
