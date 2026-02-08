import { readFileSync } from "fs";
import { join } from "path";

function readJson(relPath: string): unknown {
  const p = join(process.cwd(), relPath);
  const raw = readFileSync(p, "utf8");
  return JSON.parse(raw);
}

describe("demo JSON fixtures", () => {
  test("uiProfile.json is valid JSON", () => {
    const v = readJson("src/demo/uiProfile.json");
    expect(v).toBeTruthy();
  });

  test("explanationPayload.json is valid JSON", () => {
    const v = readJson("src/demo/explanationPayload.json");
    expect(v).toBeTruthy();
  });

  test("events.json is valid JSON array", () => {
    const v = readJson("src/demo/events.json");
    expect(Array.isArray(v)).toBe(true);
  });
});
