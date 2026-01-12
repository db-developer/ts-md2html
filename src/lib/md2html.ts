import fs from "node:fs/promises";
import path from "node:path";
import { TextDecoder } from "node:util";

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

export type ExplicitEncoding = "utf8" | "latin1" | "iso-8859-1";

/**
 * Reads a text file using an explicitly specified character encoding.
 *
 * @param file
 * Path to the file to read.
 *
 * @param encoding
 * The encoding to use when decoding the file.
 *
 * @returns
 * The decoded file contents as a string.
 *
 * @remarks
 * This function performs no validation of the decoded content.
 * It is intended for situations where the encoding is known
 * by contract and UTF-8 compliance cannot be assumed.
 */
export async function readTextWithExplicitEncoding(
  file: string,
  encoding: ExplicitEncoding
): Promise<string> {
  // Node.js only supports the following encodings: "utf8" | "utf16le" | "latin1" | "base64" | …
  // Therefore, ISO-8859-1 must be specified as "latin1".
  const nodeEncoding = encoding === "iso-8859-1" ? "latin1" : encoding;
  // This code path intentionally avoids validation.
  // For legacy encodings (e.g. ISO-8859-1), reliable validation
  // is not possible and would create a false sense of safety.
  return fs.readFile(
    path.resolve(file),
    nodeEncoding
  );
}

/**
 * Reads a text file as UTF-8 and validates that it contains only
 * well-formed UTF-8 byte sequences.
 *
 * @param file
 * Path to the file to read.
 *
 * @returns
 * The decoded UTF-8 text.
 *
 * @throws
 * If the file contains invalid UTF-8 byte sequences.
 *
 * @remarks
 * This is the default and recommended decoding strategy.
 * Invalid input causes a hard failure instead of silent replacement.
 */
export async function readStrictUtf8(
  file: string
): Promise<string> {
  const buffer = await fs.readFile(
    path.resolve(file)
  );

  // TextDecoder with `fatal: true` ensures deterministic behavior.
  // Invalid byte sequences cause an exception instead of producing
  // replacement characters (�), which would silently corrupt content.
  return new TextDecoder("utf-8", {
    fatal: true,
  }).decode(buffer);
}

/**
 * Converts a Markdown file to an HTML string.
 *
 * @param file
 * Path to the Markdown file.
 *
 * @param options
 * Optional decoding options.
 *
 * @param options.encoding
 * If provided, the file is decoded using the specified encoding
 * without validation.
 *
 * If omitted, the file is decoded as strict UTF-8 and invalid input
 * will cause this function to throw.
 *
 * @returns
 * The generated HTML as a string.
 *
 * @throws
 * If the Markdown file cannot be read or decoded.
 *
 * @example
 * ```ts
 * const html = await markdownFileToHtml("README.md");
 * ```
 *
 * @example
 * ```ts
 * const html = await markdownFileToHtml("LEGACY.md", {
 *   encoding: "iso-8859-1",
 * });
 * ```
 *
 * @remarks
 * This function performs only the Markdown → HTML transformation.
 * It does not apply HTML wrapping, styling, or post-processing.
 */
export async function md2html(
  file: string,
  options?: {
    encoding?: ExplicitEncoding;
  }
): Promise<string> {

  // Decoding strategy is selected explicitly to avoid ambiguous behavior.
  // - Explicit encoding: interpret bytes as requested.
  // - No encoding: enforce strict UTF-8 with validation.
  const markdown = options?.encoding
    ? await readTextWithExplicitEncoding(
        file,
        options.encoding
      )
    : await readStrictUtf8(file);

  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown);

  // The result is returned as a raw HTML fragment.
  // Wrapping and styling are intentionally left to downstream tools.
  return String(result);
}
