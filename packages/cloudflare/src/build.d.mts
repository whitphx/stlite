export interface CloudflareBuildOptions {
  /** Path to the Streamlit project directory. */
  path: string;
  /** Output directory (default `./dist`). */
  out?: string;
  /** Entry script relative to `path` (default `streamlit_app.py`). */
  entrypoint?: string;
  /** Path to a requirements.txt file (defaults to `<path>/requirements.txt`). */
  requirements?: string;
  /** Worker name for a generated wrangler.jsonc. */
  name?: string;
}

export function build(
  options: CloudflareBuildOptions,
): Promise<{ outDir: string }>;
