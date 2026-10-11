import { mkdirSync, writeFileSync } from "node:fs";
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
  for (const surface of surfaces)
    for (const [variant, profile] of Object.entries(profiles)) {
      const metadata = { release: "v0.2.1", surface, variant, profile };
      write(
        `docs/publication/examples/${surface}/${variant}.md`,
        `---\n${JSON.stringify(metadata)}\n---\n\nFixture change; no action required.\n`,
      );
    }
}

if (isMainModule(import.meta.url)) seedReaderProfiles(process.argv[2]);
