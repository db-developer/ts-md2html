import   path             from "path";
import { fileURLToPath  } from "url";
import * as md2htmlModule from "../lib/md2html";

/**
 * Ensures that the functions from md2html are properly exported
 * and can be imported without runtime errors.
 * This file tests the existence of all key functions before
 * proceeding to more detailed functional tests.
 */
describe(`Running ${(fileURLToPath(import.meta.url).split(path.sep).join("/").split("/test/")[1] || fileURLToPath(import.meta.url))}`, () => {
  describe("Testing md2html exports", () => {
    test("readTextWithExplicitEncoding should be defined", () => {
      expect(md2htmlModule.readTextWithExplicitEncoding).toBeDefined();
      expect(typeof md2htmlModule.readTextWithExplicitEncoding).toBe("function");
    });

    test("readStrictUtf8 should be defined", () => {
      expect(md2htmlModule.readStrictUtf8).toBeDefined();
      expect(typeof md2htmlModule.readStrictUtf8).toBe("function");
    });

    test("md2html should be defined", () => {
      expect(md2htmlModule.md2html).toBeDefined();
      expect(typeof md2htmlModule.md2html).toBe("function");
    });
  });
});
