// FINAL-001 probe (WO-282 finding F1): what a release's note entries hold for
// an order that commits its reviewed RELEASE-NOTES.md and for one that
// commits none, in a kit root (an instance) and in core's own root. VER-001
// read scripts/release.mjs for this and executed nothing, because no test
// prepares a release in a kit root; this runs the reader itself.
//
// releaseNoteEntries is private to scripts/release.mjs. A load hook, in this
// process only, appends one export to the module's source as it is read, so
// the function runs unchanged and no file of the launchpad is written.
//
// usage: node release-note-entries.mjs <launchpad> <scratch directory> <results.json>
import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { registerHooks } from "node:module";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";

const [launchpad, scratch, output] = process.argv.slice(2);
const releaseUrl = pathToFileURL(join(launchpad, "scripts/release.mjs")).href;
registerHooks({
  load(url, context, nextLoad) {
    const loaded = nextLoad(url, context);
    if (url !== releaseUrl) return loaded;
    return {
      ...loaded,
      source: `${Buffer.from(loaded.source).toString("utf8")}\nexport const probedReleaseNoteEntries = releaseNoteEntries;\n`,
    };
  },
});
const { probedReleaseNoteEntries, activatesNotesContract } = await import(
  releaseUrl
);

const env = {
  ...process.env,
  GIT_CONFIG_NOSYSTEM: "1",
  GIT_CONFIG_GLOBAL: "/dev/null",
};
for (const name of [
  "GIT_DIR",
  "GIT_WORK_TREE",
  "GIT_COMMON_DIR",
  "GIT_INDEX_FILE",
])
  delete env[name];
const git = (root, ...args) =>
  execFileSync(
    "git",
    [
      "-c",
      "user.name=Fixture",
      "-c",
      "user.email=fixture@example.invalid",
      "-c",
      "commit.gpgsign=false",
      "-c",
      "maintenance.auto=false",
      "-c",
      "core.hooksPath=/dev/null",
      ...args,
    ],
    { cwd: root, env, encoding: "utf8" },
  );
const put = (root, path, text) => {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), text);
};
const reviewedNotes = (id) =>
  [
    "## Release overview",
    "",
    `Reviewed overview of ${id}.`,
    "",
    "## Read before upgrading",
    "",
    "None.",
    "",
    "## Substantive changes",
    "",
    `- Reviewed change of ${id}.`,
    "",
    "## Progressive polish",
    "",
    "None.",
    "",
    "## Evidence and compatibility",
    "",
    `Reviewed evidence of ${id}.`,
    "",
  ].join("\n");

/** A repository whose first-parent history holds one commit for each order:
 * its work-order file, the control events through its passing final review
 * and, where `notes` says so, its reviewed release notes. */
const repository = (name, kit, orders) => {
  mkdirSync(scratch, { recursive: true });
  const root = realpathSync(mkdtempSync(join(scratch, `${name}-`)));
  git(root, "init", "-q", "-b", "main");
  if (kit) put(root, "KIT-MANIFEST.json", "{}\n");
  const events = [];
  for (const { id, notes } of orders) {
    const path = `docs/work-orders/${id}-fixture.md`;
    const report = `docs/final-reviews/${id}/FINAL-001.md`;
    const verification = `docs/verifications/${id}/VER-001.md`;
    put(root, path, `# ${id} — The fixture order ${id} (v0.1.0)\n`);
    events.push(
      { type: "WorkOrderActivated", workOrderId: id, workOrderPath: path },
      { type: "ImplementationReady", workOrderId: id },
      {
        type: "VerificationRequested",
        workOrderId: id,
        verificationId: "VER-001",
        reportPath: verification,
      },
      {
        type: "VerificationCompleted",
        workOrderId: id,
        verificationId: "VER-001",
        reportPath: verification,
        verdict: "pass",
      },
      {
        type: "FinalReviewRequested",
        workOrderId: id,
        finalReviewId: "FINAL-001",
        reportPath: report,
      },
      {
        type: "FinalReviewCompleted",
        workOrderId: id,
        finalReviewId: "FINAL-001",
        reportPath: report,
        verdict: "pass",
      },
    );
    put(
      root,
      "docs/control/resume.jsonl",
      events
        .map((event) => JSON.stringify({ schemaVersion: 1, ...event }))
        .join("\n") + "\n",
    );
    if (notes)
      put(root, `docs/final-reviews/${id}/RELEASE-NOTES.md`, reviewedNotes(id));
    git(root, "add", ".");
    git(root, "commit", "-qm", `Merge the reviewed change of ${id}`);
  }
  return root;
};

/** The entries of the whole history, or the refusal the reader throws. */
const read = (root) => {
  try {
    return {
      entries: probedReleaseNoteEntries(root, undefined).map((entry) => ({
        id: entry.id,
        legacy: entry.legacy,
        notesPath: entry.path ?? null,
        overview: entry.sections["Release overview"],
        substantive: entry.sections["Substantive changes"],
      })),
    };
  } catch (error) {
    return { refused: error.message };
  }
};

const roots = [];
const arm = (name, kit, orders) => {
  const root = repository(name, kit, orders);
  roots.push(root);
  return {
    kitRoot: kit,
    orders,
    switchesContract: orders.map(({ id }) => ({
      id,
      activates: activatesNotesContract(root, id),
    })),
    ...read(root),
  };
};
let results;
try {
  results = {
    probe: "docs/evidence/WO-282/final-review-001/release-note-entries.mjs",
    reader:
      "releaseNoteEntries of scripts/release.mjs, exported for this process by a load hook",
    arms: {
      // An instance: one order commits its reviewed notes, one commits none.
      kitNotesAndNone: arm("kit-notes-and-none", true, [
        { id: "WO-002", notes: true },
        { id: "WO-003", notes: false },
      ]),
      // An instance whose own order bears core's number, then an order with
      // no notes: the number switches nothing on, and nothing is refused.
      kitOwnOrderOfCoresNumber: arm("kit-own-number", true, [
        { id: "WO-024", notes: true },
        { id: "WO-025", notes: false },
      ]),
      // Core's own root: the contract is on from WO-024, and an order after
      // it that commits no notes refuses the release.
      coreContractRefuses: arm("core-contract", false, [
        { id: "WO-024", notes: true },
        { id: "WO-025", notes: false },
      ]),
      // Core's own root with both orders' notes committed: both are read.
      coreContractReads: arm("core-reads", false, [
        { id: "WO-024", notes: true },
        { id: "WO-025", notes: true },
      ]),
    },
  };
} finally {
  for (const root of roots) rmSync(root, { recursive: true, force: true });
}
writeFileSync(output, `${JSON.stringify(results, null, 2)}\n`);
console.log(JSON.stringify(results, null, 2));
