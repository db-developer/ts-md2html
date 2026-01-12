[![npm version](https://img.shields.io/npm/v/ts-md2html?color=blue)](https://www.npmjs.com/package/ts-md2html)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![jsdoc](https://img.shields.io/static/v1?label=jsdoc&message=%20api%20&color=blue)](https://jsdoc.app/)
![Build & Test](https://github.com/db-developer/ts-md2html/actions/workflows/ci.yml/badge.svg)
[![codecov](https://codecov.io/gh/db-developer/ts-md2html/branch/master/graph/badge.svg)](https://codecov.io/gh/db-developer/ts-md2html)

[BOTTOM](#api-reference) [CHANGELOG](CHANGELOG.md) [LICENSE](LICENSE)

# ts-md2html

## Motivation

`ts-md2html` provides a simple, reliable way to convert Markdown files into HTML strings in TypeScript projects.  
It is designed as a library rather than a Rollup plugin, giving you full control over when and how Markdown is processed, while maintaining strict UTF-8 validation and optional support for legacy encodings like ISO-8859-1 (mapped to `latin1`).

This library is particularly useful when you want to:

- Embed README.md or other documentation directly into your TypeScript project.
- Keep Markdown processing separate from bundling or build logic.
- Ensure reliable encoding handling and HTML output for GFM (GitHub-Flavored Markdown).

---

## Features

- Converts Markdown files to HTML strings.
- Supports GitHub-Flavored Markdown, including tables, task lists, and strikethroughs.
- Strict UTF-8 validation or explicit encoding support (`utf8`, `latin1`, `iso-8859-1`).
- Lightweight, dependency-minimal TypeScript library.
- Can be easily used in Rollup builds to provide README.md content at runtime.

[Details on AI assistance during development](AI.md)

---

## Installation

```bash
npm install ts-md2html
```

or

```bash
yarn add ts-md2html
```

---

## Basic Usage

```ts
import { md2html } from "ts-md2html";

(async () => {
  const html = await md2html("./README.md");
  console.log(html);
})();
```

Optional encoding support:

```ts
const html = await md2html("./README.md", { encoding: "latin1" });
```

This is especially useful when your Markdown contains legacy encodings like ISO-8859-1.

### Rollup projects

You can import ts-md2html directly in your Rollup configuration, for example:

```ts
import { md2html } from "ts-md2html";

const readmeHtml = await md2html("./README.md");
```

This allows you to embed the Markdown content into your code at build-time and use it anywhere in your application.

## API Reference

`md2html(file: string, options?: { encoding?: ExplicitEncoding }): Promise<string>`

- Converts the specified Markdown file to an HTML string.
- `file`: Path to the Markdown file.
- `options.encoding`: Optional. `"utf8" | "latin1" | "iso-8859-1"`. If omitted, strict UTF-8 validation is enforced.
- Returns a `Promise<string>` containing the raw HTML.

`readTextWithExplicitEncoding(file: string, encoding: ExplicitEncoding): Promise<string>`
- Reads a file using the specified encoding.
- Useful for legacy encodings where strict UTF-8 validation is not desired.
- Returns a `Promise<string>` containing the file content.

`readStrictUtf8(file: string): Promise<string>`
- Reads a file enforcing strict UTF-8 validation.
- Throws an error if invalid UTF-8 sequences are detected.
- Returns a `Promise<string>` containing the UTF-8 content.

[TOP](#ts-md2html) [CHANGELOG](CHANGELOG.md) [LICENSE](LICENSE)