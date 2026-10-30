import { mkdirSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { isMainModule } from "./lib/paths.mjs";

// Publication fixtures own their editorial inputs; product checks do not
// depend on the repository's current document choices or historical examples.
export function seedReaderProfiles(root) {
  const surfaces = [
    "prTitle",
    "prBody",
    "commitSubject",
    "releaseNotes",
    "releasePage",
  ];
  const profiles = {
    record: {
      audience: "maintainer",
      density: "record",
      identifiers: "every claim",
      machineDetail: "inline",
      voice: "plain",
    },
    balanced: {
      audience: "contributor",
      density: "account",
      identifiers: "where they help",
      machineDetail: "summarized",
      voice: "plain",
    },
    reader: {
      audience: "newcomer",
      density: "headline",
      identifiers: "none in prose",
      machineDetail: "linked",
      voice: "warm",
    },
  };
  const write = (relative, text) => {
    const destination = join(root, relative);
    mkdirSync(dirname(destination), { recursive: true });
    writeFileSync(destination, text);
  };
  write(
    "docs/control/reader-profiles.json",
    JSON.stringify({
      schemaVersion: 1,
      surfaces: Object.fromEntries(
        surfaces.map((surface) => [surface, profiles.balanced]),
      ),
    }) + "\n",
  );
  const facts = [
    { id: "change", anchor: "Fixture change; no action required." },
  ];
  const hashes = {};
  for (const surface of surfaces) {
    hashes[surface] = {};
    for (const [variant, profile] of Object.entries(profiles)) {
      const metadata = { release: "v0.2.1", surface, variant, profile, facts };
      const source = `---\n${JSON.stringify(metadata)}\n---\n\nFixture change; no action required.\n`;
      write(`docs/publication/examples/${surface}/${variant}.md`, source);
      hashes[surface][variant] =
        `sha256:${createHash("sha256").update(source).digest("hex")}`;
    }
  }
  write(
    "docs/publication/examples/facts.json",
    JSON.stringify({
      release: "v0.2.1",
      surfaces: Object.fromEntries(surfaces.map((surface) => [surface, facts])),
    }) + "\n",
  );
  write(
    "docs/publication/examples/illustrations.json",
    JSON.stringify(
      Object.fromEntries(
        Object.keys(profiles.balanced).map((dimension) => {
          const positions = new Set(
            Object.values(profiles).map((profile) => profile[dimension]),
          );
          if (dimension === "voice") positions.add("expressive");
          return [
            dimension,
            Object.fromEntries(
              [...positions].map((position) => [
                position,
                [
                  `Fixture ${dimension} ${position} first.`,
                  `Fixture ${dimension} ${position} second.`,
                ],
              ]),
            ),
          ];
        }),
      ),
    ) + "\n",
  );
  write(
    "docs/publication/examples/comparison.json",
    JSON.stringify({
      release: "v0.2.1",
      sameFactsAndLimits: true,
      exampleHashes: hashes,
      reviewer: { model: "synthetic fixture", effort: "synthetic fixture" },
    }) + "\n",
  );
}

if (isMainModule(import.meta.url)) seedReaderProfiles(process.argv[2]);
