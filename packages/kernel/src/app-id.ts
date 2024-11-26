const charset = "abcdefghijklmnopqrstuvwxyz";
const charsetSize = charset.length;

export function generateRandomAppId(length: number): string {
  let id = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charsetSize);
    id += charset[randomIndex];
  }

  return id;
}
