# @kszongic/checksum-cmp-cli

[![npm version](https://img.shields.io/npm/v/@kszongic/checksum-cmp-cli)](https://www.npmjs.com/package/@kszongic/checksum-cmp-cli)
[![npm downloads](https://img.shields.io/npm/dm/@kszongic/checksum-cmp-cli)](https://www.npmjs.com/package/@kszongic/checksum-cmp-cli)
[![license](https://img.shields.io/npm/l/@kszongic/checksum-cmp-cli)](./LICENSE)
[![node](https://img.shields.io/node/v/@kszongic/checksum-cmp-cli)](https://nodejs.org)
![zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)
![platform](https://img.shields.io/badge/platform-win%20%7C%20mac%20%7C%20linux-blue)

> Compare two files by checksum. Zero dependencies. Cross-platform.

```
$ checksum-cmp original.zip download.zip
SHA256 original.zip: e3b0c44298fc1c149afbf4c8996fb924...
SHA256 download.zip: e3b0c44298fc1c149afbf4c8996fb924...
Match
```

## Why?

You download a binary, an ISO, a release artifact. Is it the same file? Did the transfer corrupt it? Did someone tamper with it?

On Linux you run `sha256sum` on both files and eyeball 128 hex characters. On Windows there is `certutil -hashfile` with completely different syntax. On macOS it is `shasum -a 256`. Three platforms, three commands, zero fun.

**checksum-cmp** gives you one command:

```bash
npx @kszongic/checksum-cmp-cli original.zip download.zip
```

Match or mismatch. Done.

## Install

```bash
npm i -g @kszongic/checksum-cmp-cli
```

Or run without installing:

```bash
npx @kszongic/checksum-cmp-cli file1 file2
```

## Usage

### Compare two files (SHA-256 by default)

```bash
checksum-cmp original.zip download.zip
```

### Choose a hash algorithm

```bash
checksum-cmp a.bin b.bin --algo md5
checksum-cmp a.bin b.bin --algo sha1
checksum-cmp a.bin b.bin --algo sha512
```

### Quiet mode exit code only

```bash
checksum-cmp a.txt b.txt -q && echo "Identical" || echo "Different"
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

## Recipes

### Verify a download

```bash
curl -sLO https://example.com/release-v2.0.tar.gz
checksum-cmp release-v2.0.tar.gz /backups/release-v2.0.tar.gz
```

### CI artifact validation

```yaml
# GitHub Actions - verify deterministic builds
- run: |
    npm run build
    npx @kszongic/checksum-cmp-cli dist/bundle.js expected/bundle.js -q
```

### Backup integrity check

```bash
for f in /data/*.db; do
  checksum-cmp "$f" "/backup/$(basename $f)" || echo "MISMATCH: $f"
done
```

### Quick duplicate detection

```bash
checksum-cmp photo.jpg photo-copy.jpg -q && echo "Duplicate!"
```

### Pre-deploy verification

```bash
checksum-cmp build/app.wasm staging/app.wasm --algo sha512
```

### npm scripts

```json
{
  "scripts": {
    "verify-build": "checksum-cmp dist/bundle.js expected/bundle.js"
  }
}
```

## How It Works

1. Reads both files as streams using Node `crypto.createHash()`
2. Computes the chosen hash (default SHA-256) for each file
3. Compares the hex digests
4. Prints results and exits with the appropriate code

No temp files. No shell piping. Streams mean even multi-GB files work with constant memory.

## Use Cases

- **Download verification** - confirm ISO/binary integrity after transfer
- **Backup auditing** - ensure backup files match their sources
- **Deterministic builds** - CI check that rebuilds produce identical output
- **Duplicate detection** - quickly test if two files are the same
- **Forensics/security** - verify evidence files have not been modified
- **Deployment gates** - confirm the artifact you built is what gets deployed

## Comparison

| Tool | Zero deps | Cross-platform | Compare mode | Quiet/exit code | Install |
|------|-----------|---------------|-------------|----------------|---------|
| **checksum-cmp-cli** | Yes | Win/Mac/Linux | Built-in | Yes | `npx @kszongic/checksum-cmp-cli` |
| `sha256sum` | N/A | Linux/Mac only | Manual diff | No | Built-in (Unix) |
| `certutil -hashfile` | N/A | Windows only | Manual diff | No | Built-in (Win) |
| `diff` | N/A | Yes | Byte-level | Yes | Built-in |
| [hash-file-cli](https://www.npmjs.com/package/@kszongic/hash-file-cli) | Yes | Yes | Single file | No | `npx @kszongic/hash-file-cli` |

## Related Tools

- [@kszongic/hash-file-cli](https://github.com/kszongic/file-hasher-cli) - Hash a single file (MD5/SHA-256/SHA-512)
- [checksum-verify-cli](https://github.com/kszongic/checksum-verify-cli) - Verify a file against a known checksum string
- [string-hash-cli](https://github.com/kszongic/string-hash-cli) - Hash strings from the terminal
- [gzip-cli](https://github.com/kszongic/gzip-cli) - Compress files, then checksum the result
- [glob-size-cli](https://github.com/kszongic/glob-size-cli) - Check file sizes before comparing

## License

MIT 2026 kszongic
