import { useMemo } from "react";

const LOWERCASE_A_CHAR_CODE = 97;
const ALPHABET_LENGTH = 26;

export function generateUniqueId(length = 8): string {
  return Array.from({ length }, () =>
    String.fromCharCode(
      LOWERCASE_A_CHAR_CODE + Math.floor(Math.random() * ALPHABET_LENGTH),
    ),
  ).join("");
}

export function useUniqueId(length = 8): string {
  return useMemo(() => generateUniqueId(length), [length]);
}
