import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { UIProfileSchema } from "../../src/contracts/uiProfile";
import { ExplanationPayloadSchema } from "../../src/contracts/explanationPayload";
import { EventsSchema } from "../../src/contracts/events";

function loadJson(rel: string) {
  const p = resolve(process.cwd(), rel);
  return JSON.parse(readFileSync(p, "utf-8"));
}

describe("contracts: demo fixtures validate", () => {
  it("UIProfile fixture is valid", () => {
    const data = loadJson("src/demo/uiProfile.sample.json");
    const r = UIProfileSchema.safeParse(data);
    if (!r.success) console.error(r.error.format());
    expect(r.success).toBe(true);
  });

  it("explanationPayload fixture is valid", () => {
    const data = loadJson("src/demo/explanationPayload.sample.json");
    const r = ExplanationPayloadSchema.safeParse(data);
    if (!r.success) console.error(r.error.format());
    expect(r.success).toBe(true);
  });

  it("events fixture is valid", () => {
    const data = loadJson("src/demo/events.sample.json");
    const r = EventsSchema.safeParse(data);
    if (!r.success) console.error(r.error.format());
    expect(r.success).toBe(true);
  });
});
