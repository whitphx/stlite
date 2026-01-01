import { css } from "@emotion/react";

export const documentStyles = css`
  html,
  body {
    height: 100%;
    margin: 0;
  }

  body.embedded {
    overflow: hidden;
  }

  body.embedded:hover {
    overflow: auto;
  }

  @media print {
    html {
      height: 100%;
      /* make background-colors appear by default (e.g. the sidebar background,
       * widget background, multi-select element background, ...) */
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }
  }
`;
