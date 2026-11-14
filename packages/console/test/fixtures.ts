import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import type {
  BoardSources,
  DocumentStructure,
  StoreSource,
} from "../src/types.js";
import { editionStream, storeFromLog } from "../src/collect.js";
import { available } from "../src/values.js";

export const root = fileURLToPath(new URL("../../../../", import.meta.url));
export const fixtureRoot = join(root, "packages/console/fixtures");
/** The repository's Markdown reader, as the collector's script runs it: a
 * recorded authored document reaches the board as its structure. */
export const { markdownStructure } = (await import(
  pathToFileURL(join(root, "scripts/lib/markdown-structure.mjs")).href
)) as { markdownStructure: (source: string) => DocumentStructure };
type Input = {
  path: string;
  ref: string;
  format: "json" | "text" | "log" | "markdown";
  sha256: string;
};
type Case = {
  stores?: readonly { id: string; label: string; input: string }[];
  controlLog?: readonly string[];
  refutations?: readonly string[];
} & Readonly<Record<string, unknown>>;
type FixtureManifest = {
  fixtureVersion: string;
  inputs: Record<string, Input>;
  cases: Record<string, Case>;
};
export const readFixtureManifest = (): FixtureManifest =>
  JSON.parse(readFileSync(join(fixtureRoot, "manifest.json"), "utf8"));

/** The recorded manifest with the self-host case's three inputs taken from
 * the feedback edition the evidence selection names now. The recorded case
 * reads a fixed copy; the board's property checks read this as well, so the
 * console is still exercised against live evidence. A schema 2 edition names
 * its live audit, which a carried edition keeps in another directory. */
export async function currentSelfhostManifest(): Promise<FixtureManifest> {
  const { currentEvidence } = (await import(
    pathToFileURL(join(root, "packages/skeleton/src/evidence-editions.mjs"))
      .href
  )) as {
    currentEvidence: (root: string, kind: string) => { directory: string };
  };
  const selected = currentEvidence(root, "feedback");
  const record = join(root, selected.directory, "edition.json");
  const live = existsSync(record)
    ? (
        JSON.parse(readFileSync(record, "utf8")) as {
          liveAudit?: {
            audit: { path: string };
            verification: { path: string };
          };
        }
      ).liveAudit
    : undefined;
  const manifest = readFixtureManifest();
  for (const [key, name, recorded] of [
    ["selfhostAudit", "selfhost-audit.jsonl", live?.audit.path],
    [
      "selfhostVerifier",
      "selfhost-verification.jsonl",
      live?.verification.path,
    ],
    ["maturity", "feedback.json", undefined],
  ] as const) {
    const path = recorded ?? `${selected.directory}/${name}`;
    manifest.inputs[key] = {
      ...manifest.inputs[key]!,
      path,
      ref: path,
      sha256: createHash("sha256")
        .update(readFileSync(join(root, path)))
        .digest("hex"),
    };
  }
  return manifest;
}

export function loadFixture(
  name: string,
  manifest = readFixtureManifest(),
): BoardSources {
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
      value:
        source.format === "json"
          ? (JSON.parse(text) as unknown)
          : source.format === "markdown"
            ? markdownStructure(text)
            : text,
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
          // A schema 2 edition's pinned bytes carry references (WO-154).
          const path = manifest.inputs[store.input]!.path;
          return storeFromLog(
            store.id,
            store.label,
            available(
              input.ref,
              editionStream(root, input.value as string, [
                join(dirname(path), "feedback.json"),
              ]),
            ),
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
