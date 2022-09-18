import { AppData } from "./proto/models";
import { URL_HASH_PREFIX } from "./consts";
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
        const lastPathSegment = new URL(url).pathname
          .replace(/\/*$/, "")
          .split("/")
          .slice(-1)[0];
        const filename = lastPathSegment.endsWith(".py")
          ? lastPathSegment
          : "streamlit_app.py";
        const mainScriptPath = filename;

        const appData: AppData = {
          entrypoint: mainScriptPath,
          files: {
            [mainScriptPath]: {
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
