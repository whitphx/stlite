import { useMemo } from "react";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";
let idCounter = 0;

function randomChars(count: number): string {
  const { crypto } = globalThis;
  if (crypto?.getRandomValues) {
    const array = new Uint32Array(count);
    crypto.getRandomValues(array);
    return Array.from(array, (value) => ALPHABET[value % ALPHABET.length]).join(
      "",
    );
  }

  return Array.from(
    { length: count },
    () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)],
  ).join("");
}

export function toAlphabeticString(num: number): string {
  if (num === 0) return "a";
  const chars: string[] = [];
  let n = num;
  while (n > 0) {
    chars.unshift(ALPHABET[n % ALPHABET.length]);
    n = Math.floor(n / ALPHABET.length);
  }
  return chars.join("");
}

// The counter only separates ids within this module instance.
// A separately bundled copy of this package on the same page
// starts its own counter at 0, so random characters follow it.
// The id is not cut to a fixed length.
// A cut would eventually drop the random part and then repeat ids.
export function generateUniqueId(): string {
  return `${toAlphabeticString(idCounter++)}${randomChars(7)}`;
}

export function useUniqueId(): string {
  return useMemo(() => generateUniqueId(), []);
}
