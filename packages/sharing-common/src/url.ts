import { AppData } from "./models";
import { URL_HASH_KEY } from "./consts";
import { decodeAppData } from "./compress";

export function getAppDataFromUrl(): AppData | null {
  const hashContent = window.location.hash.replace(/^#/, "");
  const hashParams = new URLSearchParams(hashContent);
  const encoded = hashParams.get(URL_HASH_KEY);
  if (encoded == null) {
    return null;
  }

  return decodeAppData(encoded);
}
