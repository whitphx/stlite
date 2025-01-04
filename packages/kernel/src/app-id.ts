const charset = "abcdefghijklmnopqrstuvwxyz";
const charsetSize = charset.length;

// This is not cryptographically secure, but it's good enough for our use case.
export function generateRandomAppId(length: number): string {
  let id = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charsetSize);
    id += charset[randomIndex];
  }

  return id;
}
