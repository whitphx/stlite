import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SRC_ICON = path.resolve(__dirname, '../src/assets/icon.svg');
const DEST_DIR = path.resolve(__dirname, '../public');

if (!fs.existsSync(DEST_DIR)) {
  fs.mkdirSync(DEST_DIR, { recursive: true });
}

async function generate() {
  console.log(`Generating favicons from ${SRC_ICON}...`);

  // favicon-48x48.png (48x48)
  // sharp usually doesn't support ico output without specific libvips compilation
  // So we generate a PNG instead, which most browsers support as icon.
  await sharp(SRC_ICON)
    .resize(48, 48)
    .toFormat('png')
    .toFile(path.join(DEST_DIR, 'favicon-48x48.png'));
  console.log('Generated favicon-48x48.png');

  // apple-touch-icon.png (180x180)
  await sharp(SRC_ICON)
    .resize(180, 180)
    .toFormat('png')
    .toFile(path.join(DEST_DIR, 'apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png');

  // android-chrome-192x192.png
  await sharp(SRC_ICON)
    .resize(192, 192)
    .toFormat('png')
    .toFile(path.join(DEST_DIR, 'android-chrome-192x192.png'));
  console.log('Generated android-chrome-192x192.png');

  // android-chrome-512x512.png
  await sharp(SRC_ICON)
    .resize(512, 512)
    .toFormat('png')
    .toFile(path.join(DEST_DIR, 'android-chrome-512x512.png'));
  console.log('Generated android-chrome-512x512.png');

  // Copy favicon.svg to public/favicon.svg so it can be served
  // We want to serve the SVG as is.
  fs.copyFileSync(SRC_ICON, path.join(DEST_DIR, 'favicon.svg'));
  console.log('Copied favicon.svg');
}

generate().catch(console.error);
