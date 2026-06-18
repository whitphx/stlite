import { describe, expect, test } from "vitest";
import { HttpCookieJar } from "./http-cookie";

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
    expect(request.headers["X-Xsrftoken"]).toBeUndefined();
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
    expect(request.headers["X-Xsrftoken"]).toBe("2|mask|token|1");
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
        "X-Xsrftoken": "from-request",
      },
      body: "",
    });

    expect(request.headers["X-Xsrftoken"]).toBe("from-request");
  });
});
