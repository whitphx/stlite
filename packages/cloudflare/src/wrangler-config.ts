import { type ParseError, parse as parseJsonc } from "jsonc-parser";

/**
 * Build the output project's wrangler configuration.
 *
 * A project-provided wrangler.jsonc is parsed and merged rather than passed
 * through: the generated Worker cannot function (or cannot function safely)
 * without the settings below, so they are enforced on every build, while
 * user-owned settings (routes, vars, observability, limits, extra bindings)
 * are preserved. Conflicts fail the build with actionable errors instead of
 * producing a broken deployment. Comments in the input are not preserved —
 * the output is plain JSON.
 */
export function buildWranglerConfig({
  workerName,
  durableObject,
  customJsonc,
}: {
  workerName: string;
  durableObject: boolean;
  customJsonc?: string;
}): string {
  let config: Record<string, unknown> = {
    $schema: "node_modules/wrangler/config-schema.json",
  };
  if (customJsonc != null) {
    const parseErrors: ParseError[] = [];
    const parsed = parseJsonc(customJsonc, parseErrors, {
      allowTrailingComma: true,
    });
    if (
      parseErrors.length > 0 ||
      typeof parsed !== "object" ||
      parsed == null
    ) {
      throw new Error(
        "The project's wrangler.jsonc could not be parsed as JSONC.",
      );
    }
    config = { ...config, ...(parsed as Record<string, unknown>) };
  }

  const conflicts: string[] = [];

  config.name ??= workerName;

  // The scaffolded src/entry.py is the only module that exports the Worker
  // classes this runtime needs.
  if (config.main != null && config.main !== "src/entry.py") {
    conflicts.push(
      `"main" must be "src/entry.py" (the scaffolded entry module), got ${JSON.stringify(config.main)}. Put custom Python in your app instead.`,
    );
  }
  config.main = "src/entry.py";

  config.compatibility_date ??= "2026-06-30";

  // python_workers is the runtime itself; the resident Streamlit runtime
  // resolves promises across request contexts by design (the single-flight
  // init awaited by concurrent requests, the retained lifespan task), and
  // workerd's default drops those continuations once the creating request's
  // context dies, wedging later requests — hence
  // no_handle_cross_request_promise_resolution.
  const flags = new Set(
    Array.isArray(config.compatibility_flags)
      ? (config.compatibility_flags as string[])
      : [],
  );
  flags.add("python_workers");
  flags.add("no_handle_cross_request_promise_resolution");
  config.compatibility_flags = [...flags];

  config.observability ??= { enabled: true };

  // Cold start (runtime extraction + Pyodide + Streamlit boot) needs far more
  // CPU than the default budget; this requires the Workers Paid plan. A
  // user-provided limits block is preserved as-is.
  config.limits ??= { cpu_ms: 300000 };

  // The frontend and the packed Python runtime are served from the assets
  // layer. run_worker_first keeps Streamlit's server namespaces — and
  // /_stlite/*, so the packed runtime (including the user's app source) is
  // never directly downloadable as a public static file — routed to the
  // Worker before asset matching.
  const assets =
    typeof config.assets === "object" && config.assets != null
      ? { ...(config.assets as Record<string, unknown>) }
      : {};
  const requireAssetValue = (key: string, required: string) => {
    const value = assets[key];
    if (value != null && value !== required) {
      conflicts.push(
        `"assets.${key}" must be ${JSON.stringify(required)}, got ${JSON.stringify(value)}.`,
      );
    }
    assets[key] = required;
  };
  const directory = assets.directory;
  if (directory != null && directory !== "./assets" && directory !== "assets") {
    conflicts.push(
      `"assets.directory" must be "./assets" (the build writes the frontend and packed runtime there), got ${JSON.stringify(directory)}.`,
    );
  }
  assets.directory = "./assets";
  requireAssetValue("binding", "ASSETS");
  requireAssetValue("not_found_handling", "single-page-application");
  const runWorkerFirst = new Set(
    Array.isArray(assets.run_worker_first)
      ? (assets.run_worker_first as string[])
      : [],
  );
  for (const route of [
    "/_stcore/*",
    "/media/*",
    "/component/*",
    "/app/static/*",
    "/_stlite/*",
  ]) {
    runWorkerFirst.add(route);
  }
  assets.run_worker_first = [...runWorkerFirst];
  config.assets = assets;

  if (durableObject) {
    // Route everything through one Durable Object instance so all requests
    // share a single resident runtime (see stlite_cloudflare/durable.py).
    // SQLite-backed classes are the only kind Python Workers support.
    const durable =
      typeof config.durable_objects === "object" &&
      config.durable_objects != null
        ? { ...(config.durable_objects as Record<string, unknown>) }
        : {};
    const bindings = Array.isArray(durable.bindings)
      ? [...(durable.bindings as Record<string, unknown>[])]
      : [];
    const existing = bindings.find((b) => b.name === "STLITE_SERVER");
    if (existing != null && existing.class_name !== "StliteServer") {
      conflicts.push(
        `The "STLITE_SERVER" Durable Object binding must point at class "StliteServer", got ${JSON.stringify(existing.class_name)}.`,
      );
    }
    if (existing == null) {
      bindings.push({ name: "STLITE_SERVER", class_name: "StliteServer" });
    }
    durable.bindings = bindings;
    config.durable_objects = durable;

    const migrations = Array.isArray(config.migrations)
      ? [...(config.migrations as Record<string, unknown>[])]
      : [];
    const hasStliteMigration = migrations.some((m) =>
      ["new_sqlite_classes", "new_classes"].some(
        (key) =>
          Array.isArray(m[key]) &&
          (m[key] as string[]).includes("StliteServer"),
      ),
    );
    if (!hasStliteMigration) {
      migrations.push({
        tag: "stlite-v1",
        new_sqlite_classes: ["StliteServer"],
      });
    }
    config.migrations = migrations;
  }

  if (conflicts.length > 0) {
    throw new Error(
      `The project's wrangler.jsonc conflicts with settings the generated Worker requires:\n- ${conflicts.join("\n- ")}`,
    );
  }

  return `${JSON.stringify(config, null, 2)}\n`;
}
