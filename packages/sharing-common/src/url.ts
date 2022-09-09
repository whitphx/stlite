import { AppData } from "./proto/models";
import { URL_HASH_PREFIX } from "./consts";
import { encodeAppData, decodeAppData } from "./compress";

export function extractAppDataFromUrl(): AppData | null {
  const hashValue = window.location.hash.replace(/^#/, "");
  if (!hashValue.startsWith(URL_HASH_PREFIX)) {
    return null;
  }

  const encodedAppData = hashValue.slice(1);
  return decodeAppData(encodedAppData);
}

export function embedAppDataToUrl(url: string, appData: AppData): string {
  return `${url}#${URL_HASH_PREFIX}${encodeAppData(appData)}`;
}
