import { AppData } from "./proto/models";
import { URL_HASH_PREFIX } from "./consts";
import { encodeAppData, decodeAppData } from "./compress";

/**
 * JS version of `streamlit.url_util.process_gitblob_url`.
 * https://github.com/streamlit/streamlit/blob/9eb409e9deb44acbaff091f057a68050f0c69451/lib/streamlit/url_util.py#L28
 */
const GITBLOB_RE = new RegExp(
  "(?<base>https://?(gist.)?github.com/)" +
    "(?<account>([\\w.-]+/){1,2})" +
    "(?<blob_or_raw>(blob|raw))?" +
    "(?<suffix>(.+)?)"
);
export function processGitblobUrl(url: string): string {
  const match = GITBLOB_RE.exec(url);
  if (match == null) {
    return url;
  }

  const base = match.groups?.base as string;
  const account = match.groups?.account as string;
  const blobOrRaw = match.groups?.blob_or_raw as string;
  const suffix = match.groups?.suffix as string;

  if (blobOrRaw === "blob") {
    // If it has "blob" in the url, replace this with "raw" and we're done.
    return `${base}${account}raw${suffix}`;
  }
  if (blobOrRaw === "raw") {
    // If it is a "raw" url already, return untouched.
    return url;
  }

  // It's a gist. Just tack "raw" on the end.
  return url + "/raw";
}

function extractScriptUrlAndRequirementsFromHash(
  hashValue: string
): { url: string; requirements: string[] } | null {
  if (hashValue.startsWith("http")) {
    return { url: processGitblobUrl(hashValue), requirements: [] };
  }

  const params = new URLSearchParams(hashValue);
  const url = params.get("url");
  if (url) {
    const requirements = params.getAll("req");

    return { url: processGitblobUrl(url), requirements };
  }

  return null;
}

export function extractAppDataFromUrl(): Promise<AppData> {
  const hashValue = window.location.hash.replace(/^#/, "");
  if (hashValue.startsWith(URL_HASH_PREFIX)) {
    const encodedAppData = hashValue.slice(1);
    const appData = decodeAppData(encodedAppData);
    return Promise.resolve(appData);
  }

  const urlAndReqs = extractScriptUrlAndRequirementsFromHash(hashValue);
  if (urlAndReqs) {
    const { url, requirements } = urlAndReqs;

    return fetch(url)
      .then((res) => res.text())
      .then((content) => {
        const filename = new URL(url).pathname
          .replace(/\/*$/, "")
          .split("/")
          .slice(-1)[0];
        const temp_dir = "/tmp/stlite_download/"; // Ad-hoc dir name
        const main_script_path = temp_dir + filename;

        const appData: AppData = {
          entrypoint: main_script_path,
          files: {
            [main_script_path]: {
              content: {
                $case: "text",
                text: content,
              },
            },
          },
          requirements,
        };
        return appData;
      });
  }

  return Promise.reject();
}

export function embedAppDataToUrl(url: string, appData: AppData): string {
  return `${url}#${URL_HASH_PREFIX}${encodeAppData(appData)}`;
}
