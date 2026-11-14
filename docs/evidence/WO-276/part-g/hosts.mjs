// Part G, criterion G2: which hosts a record turns on, and this repository's
// emitted surfaces.
//
//   node docs/evidence/WO-276/part-g/hosts.mjs <began>
//
// writes hosts.json: (1) the feature inventory's host rows and the roots of
// the surfaces an emit would write, in two scratch instances whose discovery
// record holds observed versions of both other hosts, the first with no
// election and no attestation, the second with an attestation under one
// host; (2) this repository's harness manifest at <began>, a commit or a
// checkpoint, beside the working tree's and main's: the installed surfaces
// and their hashes.
import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  readFeatureInventory,
  readHostFeatures,
} from "../../../../scripts/lib/features.mjs";
import { harnessInstallation } from "../../../../scripts/lib/harness.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../../../..");
const [began] = process.argv.slice(2);
if (!began) {
  console.error("usage: hosts.mjs <began: a commit or a checkpoint ref>");
  process.exit(2);
}

const put = (base, path, text) => {
  mkdirSync(dirname(join(base, path)), { recursive: true });
  writeFileSync(join(base, path), text);
};
const discovery = JSON.stringify({
  effortReadbackProbe: {
    harnesses: Object.fromEntries(
      ["codex-cli", "copilot-cli"].map((harness) => [
        harness,
        { versions: [{ classification: "observed", value: "1.0.0" }] },
      ]),
    ),
  },
});
const attestation = (harness) =>
  `${JSON.stringify({
    schemaVersion: 1,
    type: "ImplementationReady",
    workOrderId: "WO-001",
    actor: {
      harness,
      harnessVersion: "fixture",
      model: "fixture",
      effort: "max",
      source: "operator-attested",
    },
  })}\n`;
const instance = (name, write) => {
  const base = mkdtempSync(join(tmpdir(), "dotln-part-g-hosts-"));
  try {
    put(base, "dotln.config.json", `${JSON.stringify({ version: 1 })}\n`);
    put(base, "docs/discovery/environment.json", discovery);
    write(base);
    const features = readHostFeatures(base);
    return {
      instance: name,
      hosts: readFeatureInventory(base)
        .filter((row) => row.id.startsWith("host-"))
        .map(({ id, value, source }) => ({ id, value, source })),
      emittedSurfaceRoots: [
        ...new Set(
          harnessInstallation({ features }).files.map(
            (file) => file.path.split("/")[0],
          ),
        ),
      ].sort(),
    };
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
};

const manifestAt = (tree) => {
  const text = tree
    ? execFileSync("git", ["show", `${tree}:.claude/harness-manifest.json`], {
        cwd: root,
        encoding: "utf8",
        maxBuffer: 64_000_000,
      })
    : readFileSync(join(root, ".claude/harness-manifest.json"), "utf8");
  const manifest = JSON.parse(text);
  return Object.assign(
    new Map(manifest.installed.map((row) => [row.path, row.hash])),
    { profiles: manifest.profiles.map((row) => row.profile.profileId) },
  );
};
const commitOf = (tree) =>
  execFileSync("git", ["rev-parse", `${tree}^{commit}`], {
    cwd: root,
    encoding: "utf8",
  }).trim();
const now = manifestAt(null);
const before = manifestAt(began);
const base = manifestAt("main");
const roots = (manifest) =>
  [...new Set([...manifest.keys()].map((path) => path.split("/")[0]))].sort();
const record = {
  what: "Criterion G2. A discovery record's observed versions turn no host on: with no election and no attestation the inventory reports both hosts off and names the record, and an emit writes Claude's surfaces alone; an attestation under a host turns that host on, as at the base. And this repository's emitted surfaces, by its harness manifest, at the tree Part G began on, in the working tree and at main.",
  command: `node docs/evidence/WO-276/part-g/hosts.mjs ${began}`,
  inventories: [
    instance("observed versions, no election, no attestation", () => {}),
    instance("observed versions and an attestation under codex-cli", (base) =>
      put(base, "docs/control/orders/WO-001.jsonl", attestation("codex-cli")),
    ),
  ],
  thisRepository: {
    hosts: readFeatureInventory(root)
      .filter((row) => row.id.startsWith("host-"))
      .map(({ id, value, source }) => ({ id, value, source })),
    began: commitOf(began),
    surfaces: now.size,
    surfaceRoots: roots(now),
    equalToTheTreeThePartBeganOn:
      now.size === before.size &&
      [...now].every(([path, hash]) => before.get(path) === hash),
    profiles: now.profiles,
    // Across the change itself: at main the record's observed versions
    // turned the hosts on, and here an election and the attestations do.
    profilesAtMain: base.profiles,
    surfaceRootsAtMain: roots(base),
    surfacesAtMainMissingNow: [...base.keys()].filter((path) => !now.has(path)),
    surfacesNowMissingAtMain: [...now.keys()].filter((path) => !base.has(path)),
  },
};
writeFileSync(join(here, "hosts.json"), `${JSON.stringify(record, null, 2)}\n`);
console.log(JSON.stringify(record, null, 2));
