import type { HttpRequest } from "./types";

const XSRF_COOKIE_NAME = "_streamlit_xsrf";
const UPLOAD_FILE_ENDPOINT = "/_stcore/upload_file";

function getHeader(
  headers: Record<string, string>,
  targetName: string,
): string | undefined {
  const normalizedTarget = targetName.toLowerCase();
  const entry = Object.entries(headers).find(
    ([name]) => name.toLowerCase() === normalizedTarget,
  );
  return entry?.[1];
}

function hasHeader(
  headers: Record<string, string>,
  targetName: string,
): boolean {
  return getHeader(headers, targetName) !== undefined;
}

function splitSetCookieHeader(header: string): string[] {
  return header.split(/,(?=\s*[^;,]+=)/).map((value) => value.trim());
}

function getSetCookieHeaders(headers: Headers): string[] {
  const headersWithGetSetCookie = headers as Headers & {
    getSetCookie?: () => string[];
  };
  const setCookieHeaders = headersWithGetSetCookie.getSetCookie?.();
  if (setCookieHeaders) {
    return setCookieHeaders;
  }

  const setCookie = headers.get("set-cookie");
  return setCookie ? splitSetCookieHeader(setCookie) : [];
}

function parseSetCookie(header: string): [string, string] | null {
  const pair = header.split(";", 1)[0] ?? "";
  const equalsIndex = pair.indexOf("=");
  if (equalsIndex <= 0) {
    return null;
  }
  return [
    pair.slice(0, equalsIndex).trim(),
    pair.slice(equalsIndex + 1).trim(),
  ];
}

function isUploadMutation(request: HttpRequest): boolean {
  if (request.method !== "PUT" && request.method !== "DELETE") {
    return false;
  }

  const url = new URL(request.path, "http://stlite.local");
  return url.pathname.startsWith(UPLOAD_FILE_ENDPOINT);
}

export class HttpCookieJar {
  private readonly cookies = new Map<string, string>();

  clear(): void {
    this.cookies.clear();
  }

  storeFromResponse(headers: Headers): string[] {
    const storedCookieNames: string[] = [];
    for (const header of getSetCookieHeaders(headers)) {
      const cookie = parseSetCookie(header);
      if (!cookie) {
        continue;
      }
      const [name, value] = cookie;
      this.cookies.set(name, value);
      storedCookieNames.push(name);
    }
    return storedCookieNames;
  }

  getCookieNames(): string[] {
    return Array.from(this.cookies.keys());
  }

  getCookieHeader(): string {
    return Array.from(this.cookies)
      .map(([name, value]) => `${name}=${value}`)
      .join("; ");
  }

  needsXsrfWarmup(request: HttpRequest): boolean {
    return isUploadMutation(request) && !this.cookies.has(XSRF_COOKIE_NAME);
  }

  applyToRequest(request: HttpRequest): HttpRequest {
    const cookieHeader = this.getCookieHeader();
    const xsrfCookie = this.cookies.get(XSRF_COOKIE_NAME);
    if (!cookieHeader && !(xsrfCookie && isUploadMutation(request))) {
      return request;
    }

    const headers = { ...request.headers };
    if (cookieHeader) {
      const existingCookieHeader = getHeader(headers, "cookie");
      headers.Cookie = existingCookieHeader
        ? `${existingCookieHeader}; ${cookieHeader}`
        : cookieHeader;
    }

    if (
      xsrfCookie &&
      isUploadMutation(request) &&
      !hasHeader(headers, "X-Xsrftoken")
    ) {
      headers["X-Xsrftoken"] = xsrfCookie;
    }

    return {
      ...request,
      headers,
    };
  }
}
