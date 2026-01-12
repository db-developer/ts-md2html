import   path                           from "path";
import { fileURLToPath                } from "url";
import   fs                             from "fs/promises";
import { readTextWithExplicitEncoding } from "../lib/md2html";

/**
 * Functional tests for readTextWithExplicitEncoding.
 * 
 * These tests validate that the function correctly decodes files
 * with the specified encoding and properly throws on errors.
 */
describe(`Running ${(fileURLToPath(import.meta.url).split(path.sep).join("/").split("/test/")[1] || fileURLToPath(import.meta.url))}`, () => {
  describe("Testing readTextWithExplicitEncoding", () => {

    const tempDir = path.resolve("./src/test/temp");
    const utf8File = path.join(tempDir, "utf8-file.txt");
    const isoFile = path.join(tempDir, "iso-file.txt");
    const latinFile = path.join(tempDir, "latin1-file.txt");

    beforeAll(async () => {
      await fs.mkdir(tempDir, { recursive: true });
      await fs.writeFile(utf8File, "Hello UTF-8 🌍", "utf8");
      // ISO-8859-1 compatible string (äöüß)
      await fs.writeFile(isoFile, "äöüß", "latin1");
      // Write ISO-8859-1 compatible string using 'latin1' encoding
      await fs.writeFile(latinFile, "äöüß", "latin1");
    });

    afterAll(async () => {
      await fs.rm(tempDir, { recursive: true, force: true });
    });

    test("should read a UTF-8 file correctly", async () => {
      const content = await readTextWithExplicitEncoding(utf8File, "utf8");
      expect(content).toBe("Hello UTF-8 🌍");
    });

    test("should read an ISO-8859-1 file correctly", async () => {
      const content = await readTextWithExplicitEncoding(isoFile, "iso-8859-1");
      expect(content).toBe("äöüß");
    });
    
    test("should read a file correctly using 'latin1' encoding", async () => {
      const content = await readTextWithExplicitEncoding(latinFile, "latin1");
      expect(content).toBe("äöüß");
    });

    test("should throw an error for non-existing file", async () => {
      await expect(
        readTextWithExplicitEncoding(path.join(tempDir, "nonexistent.txt"), "utf8")
      ).rejects.toThrow();
    });

    test("should throw an error when trying to read a non-existent file", async () => {
      const nonExistentFile = path.join(tempDir, "does-not-exist.txt");
      await expect(
        readTextWithExplicitEncoding(nonExistentFile, "utf8")
      ).rejects.toThrow();
    });

  });
});
