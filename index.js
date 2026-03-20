#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ALGORITHMS = ['md5', 'sha1', 'sha256', 'sha512'];

function usage() {
  console.log(`checksum-cmp — Compare two files by checksum

Usage:
  checksum-cmp <file1> <file2> [--algo <algorithm>] [--quiet]

Algorithms: ${ALGORITHMS.join(', ')} (default: sha256)

Options:
  --algo, -a   Hash algorithm (default: sha256)
  --quiet, -q  Exit code only, no output
  --help, -h   Show this help

Exit codes:
  0  Files match
  1  Files differ
  2  Error (missing file, bad algorithm, etc.)

Examples:
  checksum-cmp original.zip download.zip
  checksum-cmp a.bin b.bin --algo md5
  checksum-cmp a.txt b.txt -q && echo "Match!"
`);
}

function hashFile(filePath, algo) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash(algo);
    const stream = fs.createReadStream(filePath);
    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
}

async function main() {
  const args = process.argv.slice(2);
  let algo = 'sha256';
  let quiet = false;
  const files = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') { usage(); process.exit(0); }
    if (arg === '--quiet' || arg === '-q') { quiet = true; continue; }
    if (arg === '--algo' || arg === '-a') { algo = (args[++i] || '').toLowerCase(); continue; }
    files.push(arg);
  }

  if (files.length !== 2) {
    console.error('Error: exactly two file paths required. Use --help for usage.');
    process.exit(2);
  }

  if (!ALGORITHMS.includes(algo)) {
    console.error(`Error: unsupported algorithm "${algo}". Supported: ${ALGORITHMS.join(', ')}`);
    process.exit(2);
  }

  for (const f of files) {
    if (!fs.existsSync(f)) {
      console.error(`Error: file not found: ${f}`);
      process.exit(2);
    }
  }

  try {
    const [h1, h2] = await Promise.all([hashFile(files[0], algo), hashFile(files[1], algo)]);
    const match = h1 === h2;
    if (!quiet) {
      console.log(`${algo.toUpperCase()} ${path.basename(files[0])}: ${h1}`);
      console.log(`${algo.toUpperCase()} ${path.basename(files[1])}: ${h2}`);
      console.log(match ? '✓ Match' : '✗ Differ');
    }
    process.exit(match ? 0 : 1);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(2);
  }
}

main();
