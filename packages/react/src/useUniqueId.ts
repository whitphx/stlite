import { useMemo } from "react";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";
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

export function generateUniqueId(length = 8): string {
  if (length <= 0) return "";

  const counterPart = (idCounter++).toString(36);
  const timePart = Date.now().toString(36);
  const base = `${counterPart}${timePart}${randomChars(length)}`;

  if (base.length >= length) {
    return base.slice(0, length);
  }

  return `${base}${randomChars(length - base.length)}`;
}

export function useUniqueId(length = 8): string {
  return useMemo(() => generateUniqueId(length), [length]);
}
