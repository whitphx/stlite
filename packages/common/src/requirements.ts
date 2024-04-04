// Ref: https://peps.python.org/pep-0508/#grammar
const FIRST_CHAR_OF_EXTRAS = "[";
const FIRST_CHAR_OF_VERSIONSPEC = "(<=>!~";
const FIRST_CHAR_OF_QUOTED_MARKER = ";";
const FIRST_CHAR_OF_URLSPEC = "@";
const RX_CHAR_FOLLOWING_NAME_WITHOUT_WSP = new RegExp(
  `[${
    FIRST_CHAR_OF_EXTRAS +
    FIRST_CHAR_OF_VERSIONSPEC +
    FIRST_CHAR_OF_QUOTED_MARKER +
    FIRST_CHAR_OF_URLSPEC
  }]`
);
function getPackageName(req: string): string {
  const parts = req.split(RX_CHAR_FOLLOWING_NAME_WITHOUT_WSP);
  return parts[0].trim();
}

export function validateRequirements(requirements: string[]): string[] {
  requirements.forEach((req) => {
    let url: URL;
    try {
      url = new URL(req);
    } catch {
      // `req` is not a URL -> OK
      return;
    }

    // Ref: The scheme checker in the micropip implementation is https://github.com/pyodide/micropip/blob/v0.1.0/micropip/_compat_in_pyodide.py#L23-L26
    if (url.protocol === "emfs:" || url.protocol === "file:") {
      throw new Error(
        `"emfs:" and "file:" protocols are not allowed for the requirement (${req})`
      );
    }
  });

  const validatedRequirements = requirements.filter((req) => {
    const isStreamlit = getPackageName(req) === "streamlit";
    if (isStreamlit) {
      console.warn(
        `Streamlit is specified in the requirements (${req}), but it will be ignored. A built-in version of Streamlit will be used.`
      );
      return false;
    }

    return true;
  });

  return validatedRequirements;
}
