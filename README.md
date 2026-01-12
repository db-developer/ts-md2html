[![npm version](https://img.shields.io/npm/v/ts-md2html?color=blue)](https://www.npmjs.com/package/ts-md2html)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![jsdoc](https://img.shields.io/static/v1?label=jsdoc&message=%20api%20&color=blue)](https://jsdoc.app/)
![Build & Test](https://github.com/db-developer/ts-md2html/actions/workflows/ci.yml/badge.svg)
[![codecov](https://codecov.io/gh/db-developer/ts-md2html/branch/master/graph/badge.svg)](https://codecov.io/gh/db-developer/ts-md2html)

[BOTTOM](#api-reference) [CHANGELOG](CHANGELOG.md) [CONTRIBUTING](CONTRIBUTING.md) [LICENSE](LICENSE)

# ts-md2html

## Motivation

`ts-md2html` provides a simple, reliable way to convert Markdown files into HTML strings in TypeScript projects.  
It is designed as a library rather than a Rollup plugin, giving you full control over when and how Markdown is processed, while maintaining strict UTF-8 validation and optional support for legacy encodings like ISO-8859-1 (mapped to `latin1`).

This library is intentionally small and focused. It is particularly useful when you want to:

- Embed README.md or other documentation directly into your TypeScript project.
- Keep Markdown processing separate from bundling or build logic.
- Ensure reliable encoding handling and HTML output for GFM (GitHub-Flavored Markdown).

It aims to provide a deterministic Markdown → HTML conversion layer, not a framework or extensible rendering engine.

---

## Features

- Converts Markdown files to HTML strings.
- Supports GitHub-Flavored Markdown, including tables, task lists, and strikethroughs.
- Strict UTF-8 validation or explicit encoding support (`utf8`, `latin1`, `iso-8859-1`).
- Lightweight, dependency-minimal TypeScript library.
- Can be easily used in Rollup builds to provide README.md content at runtime.

[Details on AI assistance during development](AI.md)

---

## Under the Hood

`ts-md2html` is built on top of the **unified / remark / rehype** ecosystem.  
This choice favors correctness, extensibility, and long-term maintainability over minimalism.

### Processing Pipeline

Internally, Markdown is converted to HTML using the following pipeline:

1. **`remark-parse`**  
   Parses Markdown into a Markdown AST (MDAST).

2. **`remark-gfm`**  
   Adds GitHub-Flavored Markdown support.

3. **`remark-rehype`**  
   Transforms the Markdown AST into an HTML AST (HAST).

4. **`rehype-stringify`**  
   Serializes the HTML AST into a raw HTML string.

This pipeline is executed via **`unified`**, which acts as the orchestration layer.

### Supported Markdown Features

Out of the box, the following features are supported:

| Feature                    | Supported | Notes |
|----------------------------|-----------|-------|
| CommonMark                 | ✅        | Fully supported via `remark-parse` |
| GitHub-Flavored Markdown   | ✅        | Enabled via `remark-gfm` |
| Tables                     | ✅        | GFM tables |
| Task Lists                 | ✅        | GFM task list items |
| Strikethrough              | ✅        | GFM extension |
| Autolinks                  | ✅        | GFM extension |
| Raw HTML in Markdown       | ⚠️        | Passed through, not sanitized |
| Syntax Highlighting        | ❌        | Intentionally not included |
| HTML Sanitization          | ❌        | Left to downstream tools |

### Extensibility

Although `ts-md2html` exposes a minimal public API, the internal architecture is intentionally aligned with the unified ecosystem.

This means:

- The rendering behavior is **deterministic and well-defined**.
- Advanced users can fork or wrap the library to:
  - Add custom `remark` or `rehype` plugins.
  - Introduce syntax highlighting (e.g. via `rehype-highlight`).
  - Apply HTML sanitization or post-processing.

The library itself deliberately avoids configuration knobs for rendering, keeping the API stable and predictable.  
Styling, wrapping, sanitization, and enrichment are expected to be handled by downstream tooling.

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

### Error Handling

`ts-md2html` follows a strict, explicit error model.  
Errors are **not swallowed, normalized, or wrapped** by the library.

#### Non-existent files

If the provided file path does not exist or is not readable, the underlying filesystem error is propagated unchanged.

Typical error sources:
- `ENOENT` (file not found)
- `EACCES` (permission denied)

This allows calling code (e.g. build tools or CI pipelines) to fail fast and report meaningful diagnostics.

#### Empty files

Empty files are considered valid input.

- An empty Markdown file results in an empty HTML string.
- No error is thrown.

This behavior is intentional and aligns with the principle that *absence of content is not an exceptional condition*.

#### Invalid Markdown

There is no concept of “invalid Markdown” at the parser level.

- The parser operates in a best-effort mode.
- Unsupported or malformed syntax is passed through or ignored according to the CommonMark / GFM specifications.
- No parse errors are thrown for malformed Markdown input.

As a result, HTML output is always produced as long as the input can be decoded as text.

#### Encoding errors

- If an explicit encoding is provided, bytes are interpreted accordingly.
- If no encoding is provided, strict UTF-8 decoding is enforced.

Invalid UTF-8 input without an explicit encoding will result in a decoding error being thrown.  
This prevents silent data corruption and makes encoding issues explicit at build time.

### Error Handling Summary:

- File system errors are propagated.
- Empty input is valid.
- Markdown parsing is tolerant by design.
- Encoding errors are treated as fatal unless explicitly overridden.

---

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

[TOP](#ts-md2html) [CHANGELOG](CHANGELOG.md) [CONTRIBUTING](CONTRIBUTING.md) [LICENSE](LICENSE)