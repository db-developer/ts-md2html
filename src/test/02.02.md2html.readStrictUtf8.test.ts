import   path             from "path";
import { fileURLToPath  } from "url";
import   fs               from "fs/promises";
import { readStrictUtf8 } from "../lib/md2html";

/**
 * Functional tests for readStrictUtf8.
 *
 * Validates that the function reads UTF-8 files correctly and
 * throws on invalid UTF-8 sequences.
 */
describe(`Running ${(fileURLToPath(import.meta.url).split(path.sep).join("/").split("/test/")[1] || fileURLToPath(import.meta.url))}`, () => {
  describe("Testing readStrictUtf8", () => {

    const tempDir = path.resolve("./src/test/temp");
    const validUtf8File = path.join(tempDir, "valid-utf8.txt");
    const invalidUtf8File = path.join(tempDir, "invalid-utf8.txt");

    beforeAll(async () => {
      await fs.mkdir(tempDir, { recursive: true });
      await fs.writeFile(validUtf8File, "Hello UTF-8 🌍", "utf8");

      // Create a file with invalid UTF-8 bytes
      const buffer = Buffer.from([0xff, 0xfe, 0xfd]);
      await fs.writeFile(invalidUtf8File, buffer);
    });

    afterAll(async () => {
      await fs.rm(tempDir, { recursive: true, force: true });
    });

    test("should read a valid UTF-8 file correctly", async () => {
      const content = await readStrictUtf8(validUtf8File);
      expect(content).toBe("Hello UTF-8 🌍");
    });

    test("should throw an error for invalid UTF-8 file", async () => {
      await expect(readStrictUtf8(invalidUtf8File)).rejects.toThrow();
    });
  });
});
