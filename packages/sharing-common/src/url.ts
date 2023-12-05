import { AppData } from "./proto/models";
import { URL_HASH_PREFIX_ENCODED_APPDATA } from "./consts";
import { encodeAppData, decodeAppData } from "./compress";

/**
 * JS version of `streamlit.url_util.process_gitblob_url`.
 * https://github.com/streamlit/streamlit/blob/9eb409e9deb44acbaff091f057a68050f0c69451/lib/streamlit/url_util.py#L28
 */
const GITBLOB_RE = new RegExp(
  "(?<base>https://?(?<gist>gist.)?github.com/)" +
    "(?<account>([\\w.-]+/){1,2})" +
    "(?<blob_or_raw>(blob|raw))?/?" +
    "(?<suffix>(.+)?)"
);
export function processGitblobUrl(url: string): string {
  const match = GITBLOB_RE.exec(url);
  if (match == null) {
    return url;
  }

  const gist = match.groups?.gist as string;
  const account = match.groups?.account as string;
  const blobOrRaw = match.groups?.blob_or_raw as string;
  const suffix = match.groups?.suffix as string;

  // Unlike the original Streamlit, stlite has a problem of CORS,
  // so the URL must be directly replaced to the one pointing to the "githubusercontent.com" domain, which allows cross-origin access.
  if (gist === "gist.") {
    return `https://gist.githubusercontent.com/${account}${suffix}/raw`;
  }
  if (blobOrRaw) {
    return `https://raw.githubusercontent.com/${account}${suffix}`;
  }

  // It's a gist. Just tack "raw" on the end.
  return url + "/raw";
}

export function parseHash(
  hashValue: string
):
  | { url: string; requirements: string[] }
  | { code: string; requirements: string[] }
  | null {
  if (hashValue.startsWith("http")) {
    return { url: processGitblobUrl(hashValue), requirements: [] };
  }

  const params = new URLSearchParams(hashValue);
  const url = params.get("url");
  const code = params.get("code");
  const requirements = params
    .getAll("req")
    .map((r) => r.split(","))
    .flat()
    .map((r) => r.trim())
    .filter((r) => r.length > 0);

  if (code) {
    if (url) {
      console.warn(
        "Both 'url' and 'code' are specified in the URL hash. Ignoring 'url'."
      );
    }
    return { code, requirements };
  } else if (url) {
    return { url: processGitblobUrl(url), requirements };
  }

  return null;
}

async function compileMainScriptAndRequirementsFromHash(
  hashValue: string
): Promise<{ code: string; filename: string; requirements: string[] } | null> {
  const parseResult = parseHash(hashValue);
  if (parseResult == null) {
    return null;
  }

  if ("code" in parseResult) {
    const { code, requirements } = parseResult;
    return { code, filename: "streamlit_app.py", requirements };
  }

  const { url, requirements } = parseResult;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}`);
  }
  const content = await res.text();
  const lastPathSegment = new URL(url).pathname
    .replace(/\/*$/, "")
    .split("/")
    .slice(-1)[0];
  const filename = lastPathSegment.endsWith(".py")
    ? lastPathSegment
    : "streamlit_app.py";
  return { code: content, filename, requirements };
}

export async function extractAppDataFromUrl(): Promise<AppData> {
  const hashValue = window.location.hash.replace(/^#/, "");
  if (hashValue.startsWith(URL_HASH_PREFIX_ENCODED_APPDATA)) {
    const encodedAppData = hashValue.slice(1);
    const appData = decodeAppData(encodedAppData);
    return appData;
  }

  const result = await compileMainScriptAndRequirementsFromHash(hashValue);
  if (result == null) {
    return Promise.reject();
  }

  const { code, filename, requirements } = result;
  return {
    entrypoint: filename,
    files: {
      [filename]: {
        content: {
          $case: "text",
          text: code,
        },
      },
    },
    requirements,
  };
}

export function embedAppDataToUrl(url: string, appData: AppData): string {
  return `${url}#${URL_HASH_PREFIX_ENCODED_APPDATA}${encodeAppData(appData)}`;
}
