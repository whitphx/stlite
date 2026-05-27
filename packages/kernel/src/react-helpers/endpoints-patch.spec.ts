import { describe, it, expect, beforeEach, vi } from "vitest";
import { DefaultStreamlitEndpoints } from "@streamlit/connection";
import "./endpoints-patch";

function makeEndpoints(): DefaultStreamlitEndpoints {
  const sendClientError = vi.fn();
  return new DefaultStreamlitEndpoints({
    getServerUri: () => undefined,
    csrfEnabled: false,
    sendClientError,
  });
}

describe("checkSourceUrlResponse patch", () => {
  let fetchMock: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchMock = vi.spyOn(globalThis, "fetch");
  });

  it("skips fetch and sendClientError for stlite.invalid URLs", async () => {
    const endpoints = makeEndpoints();
    const sendClientError = vi.spyOn(endpoints, "sendClientErrorToHost");

    await endpoints.checkSourceUrlResponse(
      "https://stlite.invalid/component/pkg.comp/index.html?streamlitUrl=https%3A%2F%2Fexample.com%2F",
      "ComponentRegistry",
      "pkg.comp",
    );

    expect(fetchMock).not.toHaveBeenCalled();
    expect(sendClientError).not.toHaveBeenCalled();
  });

  it("falls through to fetch for non-stlite hosts", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response("", { status: 200, statusText: "OK" }),
    );
    const endpoints = makeEndpoints();
    const sendClientError = vi.spyOn(endpoints, "sendClientErrorToHost");

    await endpoints.checkSourceUrlResponse(
      "https://components.example.com/index.html",
      "ComponentRegistry",
      "pkg.comp",
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "https://components.example.com/index.html",
    );
    expect(sendClientError).not.toHaveBeenCalled();
  });

  it("reports non-OK responses for non-stlite hosts (upstream behavior preserved)", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response("", { status: 404, statusText: "Not Found" }),
    );
    const endpoints = makeEndpoints();
    const sendClientError = vi.spyOn(endpoints, "sendClientErrorToHost");

    await endpoints.checkSourceUrlResponse(
      "https://components.example.com/missing.html",
      "ComponentRegistry",
      "pkg.comp",
    );

    expect(sendClientError).toHaveBeenCalledTimes(1);
    expect(sendClientError).toHaveBeenCalledWith(
      "ComponentRegistry",
      404,
      "Not Found",
      "https://components.example.com/missing.html",
      "pkg.comp",
    );
  });

  it("falls through (does not silently swallow) for malformed URLs", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("Failed to fetch"));
    const endpoints = makeEndpoints();
    const sendClientError = vi.spyOn(endpoints, "sendClientErrorToHost");

    await endpoints.checkSourceUrlResponse(
      "not-a-url",
      "ComponentRegistry",
      "pkg.comp",
    );

    expect(fetchMock).toHaveBeenCalledWith("not-a-url");
    expect(sendClientError).toHaveBeenCalledTimes(1);
  });
});
