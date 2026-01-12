import   path            from "path";
import { fileURLToPath } from "url";
import   fs              from "fs/promises";
import { md2html       } from "../lib/md2html";

/**
 * Functional tests for md2html.
 *
 * Validates that the function correctly converts Markdown files
 * to HTML strings, including support for GitHub-Flavored Markdown (GFM).
 */
describe(`Running ${(fileURLToPath(import.meta.url).split(path.sep).join("/").split("/test/")[1] || fileURLToPath(import.meta.url))}`, () => {
  describe("Testing md2html", () => {

    const tempDir = path.resolve("./src/test/temp");
    const simpleMdFile = path.join(tempDir, "simple.md");
    const gfmMdFile = path.join(tempDir, "gfm.md");

    beforeAll(async () => {
      await fs.mkdir(tempDir, { recursive: true });

      // Simple markdown
      await fs.writeFile(simpleMdFile, "# Hello World\nThis is a test.", "utf8");

      // GitHub-Flavored Markdown example
      await fs.writeFile(
        gfmMdFile,
        `# GFM Test

- [x] Task 1
- [ ] Task 2

| Name | Age |
|------|-----|
| Alice | 30 |
| Bob | 25 |

~~Strikethrough~~`,
        "utf8"
      );
    });

    afterAll(async () => {
      await fs.rm(tempDir, { recursive: true, force: true });
    });

    test("should convert simple markdown to HTML", async () => {
      const html = await md2html(simpleMdFile);
      expect(html).toContain("<h1>Hello World</h1>");
      expect(html).toContain("<p>This is a test.</p>");
    });

    test("should convert GitHub-Flavored Markdown to HTML correctly", async () => {
      const html = await md2html(gfmMdFile);
      
      // Task list
      expect(html).toContain('<ul class="contains-task-list">');
      expect(html).toContain('<li class="task-list-item"><input type="checkbox" checked disabled> Task 1</li>');
      expect(html).toContain('<li class="task-list-item"><input type="checkbox" disabled> Task 2</li>');

      // Table
      expect(html).toContain("<table>");
      expect(html).toContain("<thead>");
      expect(html).toContain("<tbody>");
      expect(html).toContain("<td>Alice</td>");
      expect(html).toContain("<td>30</td>");
      expect(html).toContain("<td>Bob</td>");
      expect(html).toContain("<td>25</td>");

      // Strikethrough
      expect(html).toContain("<del>Strikethrough</del>");
    });

    test("should read a file using readTextWithExplicitEncoding when encoding is provided", async () => {
      const fileWithEncoding = path.join(tempDir, "simple.md");
      const html = await md2html(fileWithEncoding, { encoding: "utf8" });
      expect(html).toContain("<h1>Hello World</h1>");
    });

    test("should throw an error for non-existing file", async () => {
      await expect(md2html(path.join(tempDir, "nonexistent.md"))).rejects.toThrow();
    });

  });
});