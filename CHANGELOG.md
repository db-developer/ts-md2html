[BOTTOM](#100---2026-01-12) [LICENSE](LICENSE) [README](README.md)

# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- No additions yet

### Changed

- No changes yet

### Fixed

- No fixes yet

## [1.1.0] - 2026-01-13

- Fixed bundling for Node environments: Rollup now correctly resolves Node-only exports, 
  preventing runtime errors caused by browser-specific code (e.g., `document` undefined).

## [1.0.0] - 2026-01-12

- Initial version

### Features

- Converts Markdown files to HTML strings.
- Supports GitHub-Flavored Markdown (GFM), including tables, task lists, and strikethrough.
- Enforces strict UTF-8 decoding with hard failure on invalid byte sequences.
- Supports explicit legacy encodings (`utf8`, `latin1`, `iso-8859-1`, mapped to `latin1`).
- Ensures deterministic decoding behavior (no silent character replacement).
- Separates file decoding from Markdown-to-HTML rendering logic.
- Lightweight TypeScript library with minimal dependencies.
- Library-first design (not implemented as a Rollup plugin).
- Suitable for build-time usage (e.g. embedding README.md content in Rollup configurations).
- Returns raw HTML fragments without automatic wrapping or styling.

[TOP](#changelog) [LICENSE](LICENSE) [README](README.md)
