import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import type { BoardSources, StoreSource } from "../src/types.js";
import { storeFromLog } from "../src/collect.js";
import { available } from "../src/values.js";

export const root = fileURLToPath(new URL("../../../../", import.meta.url));
export const fixtureRoot = join(root, "packages/console/fixtures");
type Input = {
  path: string;
  ref: string;
  format: "json" | "text" | "log";
  sha256: string;
};
type Case = {
  stores?: readonly { id: string; label: string; input: string }[];
  controlLog?: readonly string[];
  refutations?: readonly string[];
} & Readonly<Record<string, unknown>>;
export const manifest = JSON.parse(
  readFileSync(join(fixtureRoot, "manifest.json"), "utf8"),
) as {
  fixtureVersion: string;
  inputs: Record<string, Input>;
  cases: Record<string, Case>;
};

export function loadFixture(name: string): BoardSources {
  const fixture = manifest.cases[name];
  assert.ok(fixture, `unknown fixture ${name}`);
  const read = (key: string): { ref: string; value: unknown } => {
    const source = manifest.inputs[key];
    assert.ok(source, `input ${key} is not recorded`);
    assert.ok(
      !source.path.startsWith("/") && !source.path.split("/").includes(".."),
      "fixture inputs are repository-relative",
    );
    const bytes = readFileSync(join(root, source.path));
    assert.equal(
      createHash("sha256").update(bytes).digest("hex"),
      source.sha256,
      `recorded fixture input changed: ${source.path}`,
    );
    const text = bytes.toString("utf8");
    return {
      ref: source.ref,
      value: source.format === "json" ? (JSON.parse(text) as unknown) : text,
    };
  };
  const entries: [string, unknown][] = [];
  for (const [key, value] of Object.entries(fixture)) {
    if (key === "stores") {
      entries.push([
        key,
        fixture.stores!.map((store): StoreSource => {
          const input = read(store.input);
          assert.equal(typeof input.value, "string");
          return storeFromLog(
            store.id,
            store.label,
            available(input.ref, input.value as string),
          );
        }),
      ]);
    } else if (key === "controlLog") {
      entries.push([
        key,
        available(
          "control:canonical-segments",
          fixture.controlLog!.map((input) => {
            const source = read(input);
            assert.equal(typeof source.value, "string");
            return {
              ref: source.ref,
              value: (source.value as string)
                .trimEnd()
                .split("\n")
                .map((line) => JSON.parse(line) as unknown),
            };
          }),
        ),
      ]);
    } else if (key === "refutations") {
      entries.push([
        key,
        available("docs/planning/refutations/", fixture.refutations!.map(read)),
      ]);
    } else {
      assert.equal(typeof value, "string");
      const source = read(value as string);
      entries.push([key, available(source.ref, source.value)]);
    }
  }
  return Object.fromEntries(entries) as BoardSources;
}

export function combinedFixture(): BoardSources {
  const demo = loadFixture("wo009"),
    audit = loadFixture("selfhost");
  return {
    ...demo,
    ...audit,
    ...loadFixture("control"),
    ...loadFixture("refutations"),
    stores: [...demo.stores!, ...audit.stores!],
  };
}
