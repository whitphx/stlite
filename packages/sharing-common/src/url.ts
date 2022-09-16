import { AppData } from "./proto/models";
import { URL_HASH_PREFIX } from "./consts";
import { encodeAppData, decodeAppData } from "./compress";

export function extractAppDataFromUrl(): Promise<AppData> {
  const hashValue = window.location.hash.replace(/^#/, "");
  if (hashValue.startsWith(URL_HASH_PREFIX)) {
    const encodedAppData = hashValue.slice(1);
    const appData = decodeAppData(encodedAppData);
    return Promise.resolve(appData);
  }

  if (hashValue.startsWith("http")) {
    const url = hashValue;
    return fetch(url)
      .then((res) => res.text())
      .then((content) => {
        const entrypoint = "app.py"; // TODO
        const appData: AppData = {
          entrypoint,
          files: {
            [entrypoint]: {
              content: {
                $case: "text",
                text: content,
              },
            },
          },
          requirements: [],
        };
        return appData;
      });
  }

  return Promise.reject();
}

export function embedAppDataToUrl(url: string, appData: AppData): string {
  return `${url}#${URL_HASH_PREFIX}${encodeAppData(appData)}`;
}
