#!/usr/bin/env node
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function getStreamlitVersion() {
  try {
    const version = execSync('python3 scripts/get-streamlit-version.py', {
      cwd: path.resolve(__dirname, '..'),
      encoding: 'utf8'
    }).trim();
    return version;
  } catch (error) {
    throw new Error(`Failed to get Streamlit version: ${error.message}`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(getStreamlitVersion());
}
