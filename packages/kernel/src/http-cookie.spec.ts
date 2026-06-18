import { describe, expect, test } from "vitest";
import { HttpCookieJar } from "./http-cookie";

const XSRF_HEADER_NAME = "X-XSRF" + "token";

describe("HttpCookieJar", () => {
  test("stores response cookies and sends them on later requests", () => {
    const jar = new HttpCookieJar();
    const headers = new Headers();
    headers.append("set-cookie", "_streamlit_xsrf=2|mask|token|1; Path=/");
    headers.append("set-cookie", "other=value; Path=/");

    jar.storeFromResponse(headers);

    const request = jar.applyToRequest({
      method: "GET",
      path: "/_stcore/health",
      headers: {},
      body: "",
    });

    expect(request.headers.Cookie).toBe(
      "_streamlit_xsrf=2|mask|token|1; other=value",
    );
    expect(request.headers[XSRF_HEADER_NAME]).toBeUndefined();
  });

  test("adds the XSRF header for upload mutations", () => {
    const jar = new HttpCookieJar();
    const headers = new Headers();
    headers.append("set-cookie", "_streamlit_xsrf=2|mask|token|1; Path=/");
    jar.storeFromResponse(headers);

    const request = jar.applyToRequest({
      method: "PUT",
      path: "/_stcore/upload_file/session/file",
      headers: {},
      body: "",
    });

    expect(request.headers.Cookie).toBe("_streamlit_xsrf=2|mask|token|1");
    expect(request.headers[XSRF_HEADER_NAME]).toBe("2|mask|token|1");
    expect(jar.needsXsrfWarmup(request)).toBe(false);
  });

  test("reports when an upload mutation needs XSRF warmup", () => {
    const jar = new HttpCookieJar();

    expect(
      jar.needsXsrfWarmup({
        method: "PUT",
        path: "/_stcore/upload_file/session/file",
        headers: {},
        body: "",
      }),
    ).toBe(true);

    expect(
      jar.needsXsrfWarmup({
        method: "GET",
        path: "/_stcore/health",
        headers: {},
        body: "",
      }),
    ).toBe(false);
  });

  test("does not overwrite an explicit XSRF header", () => {
    const jar = new HttpCookieJar();
    const headers = new Headers();
    headers.append("set-cookie", "_streamlit_xsrf=from-cookie; Path=/");
    jar.storeFromResponse(headers);

    const request = jar.applyToRequest({
      method: "DELETE",
      path: "/_stcore/upload_file/session/file",
      headers: {
        [XSRF_HEADER_NAME]: "from-request",
      },
      body: "",
    });

    expect(request.headers[XSRF_HEADER_NAME]).toBe("from-request");
  });

  test("normalizes an existing cookie header when merging stored cookies", () => {
    const jar = new HttpCookieJar();
    const headers = new Headers();
    headers.append("set-cookie", "_streamlit_xsrf=from-cookie; Path=/");
    jar.storeFromResponse(headers);

    const request = jar.applyToRequest({
      method: "GET",
      path: "/_stcore/health",
      headers: {
        cookie: "from-request=true",
      },
      body: "",
    });

    expect(request.headers.cookie).toBeUndefined();
    expect(request.headers.Cookie).toBe(
      "from-request=true; _streamlit_xsrf=from-cookie",
    );
  });

  test("recovers warmup detection when the XSRF cookie is cleared", () => {
    const jar = new HttpCookieJar();
    const headers = new Headers();
    headers.append("set-cookie", "_streamlit_xsrf=from-cookie; Path=/");
    jar.storeFromResponse(headers);

    const clearingHeaders = new Headers();
    clearingHeaders.append("set-cookie", "_streamlit_xsrf=; Path=/");
    jar.storeFromResponse(clearingHeaders);

    expect(
      jar.needsXsrfWarmup({
        method: "PUT",
        path: "/_stcore/upload_file/session/file",
        headers: {},
        body: "",
      }),
    ).toBe(true);
  });
});
