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

export function generateUniqueId(length = 8): string {
  if (length <= 0) return "";

  // The counter only separates ids within this module instance.
  // A separately bundled copy of this package on the same page
  // starts its own counter at 0, so the rest has to be random.
  const counterPart = toAlphabeticString(idCounter++);
  const randomLength = Math.max(length - counterPart.length, 0);
  return `${counterPart}${randomChars(randomLength)}`.slice(0, length);
}

export function useUniqueId(length = 8): string {
  return useMemo(() => generateUniqueId(length), [length]);
}
