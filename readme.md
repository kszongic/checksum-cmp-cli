# @kszongic/checksum-cmp-cli

[![npm version](https://img.shields.io/npm/v/@kszongic/checksum-cmp-cli)](https://www.npmjs.com/package/@kszongic/checksum-cmp-cli)
[![license](https://img.shields.io/npm/l/@kszongic/checksum-cmp-cli)](./LICENSE)

> Compare two files by checksum. Zero dependencies.

Quickly verify whether two files are identical by comparing their hashes. Supports MD5, SHA-1, SHA-256, and SHA-512.

## Install

```bash
npm install -g @kszongic/checksum-cmp-cli
```

## Usage

```bash
# Compare two files (default: SHA-256)
checksum-cmp original.zip download.zip

# Use a specific algorithm
checksum-cmp a.bin b.bin --algo md5

# Quiet mode — exit code only (0 = match, 1 = differ)
checksum-cmp a.txt b.txt -q && echo "Match!"
```

## Output

```
SHA256 original.zip: e3b0c44298fc1c149afbf4c8996fb924...
SHA256 download.zip: e3b0c44298fc1c149afbf4c8996fb924...
✓ Match
```

## Options

| Flag | Description |
|------|-------------|
| `--algo, -a` | Hash algorithm: `md5`, `sha1`, `sha256`, `sha512` (default: `sha256`) |
| `--quiet, -q` | Suppress output, use exit code only |
| `--help, -h` | Show help |

## Exit Codes

| Code | Meaning |
|------|---------|
| `0` | Files match |
| `1` | Files differ |
| `2` | Error (missing file, bad algorithm) |

## License

MIT © 2026 kszongic
