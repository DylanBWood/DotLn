// VER-001 probe P3 (WO-282 criterion 3): the register's carry of a re-keyed
// candidate in inputs the executor's case held constant. The case carried a
// settled disposition; these arms carry an allocated one to a filed order,
// edit the source after the carry, hold two retired rows that both match the
// created one, and read this repository's own register in check mode, which
// writes nothing.
//
// usage: node register-carry.mjs <launchpad> <scratch directory> <results.json>
import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";

const [launchpad, scratch, output] = process.argv.slice(2);
const { syncFollowups, planningFollowups, followupStatus, FOLLOWUPS } =
  await import(join(launchpad, "scripts/lib/planning-followups.mjs"));
const { sha256Hex: digest, json } = await import(
  join(launchpad, "scripts/lib/helpers.mjs")
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
const put = (root, path, text) => {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), text);
};
const base = realpathSync(mkdtempSync(join(scratch, "ver-001-p3-")));
const results = [];
const check = (label, pass, detail) =>
  results.push({ label, pass: Boolean(pass), detail });
const sourcePath = "docs/product/candidates.md";
const body =
  "## Candidates\n\n- **Files under `**/*.mjs`.** Keep their public descriptions.\n";
let count = 0;
const fixture = () => {
  const root = join(base, `r${count++}`);
  mkdirSync(root, { recursive: true });
  execFileSync("git", ["init", "-q", "-b", "wo-999"], { cwd: root, env });
  put(root, ".gitignore", "docs/control/local/\n");
  put(root, "CLAUDE.md", "# Probe floor\nPersonal source only.\n");
  put(root, sourcePath, body);
  return root;
};
// The key an earlier reader gave the item, from a shorter title.
const rekey = (entry, title) => {
  entry.key = `candidate:${sourcePath}#candidates::${digest(title)}`;
  entry.id = `FUP-${digest(entry.key).slice(0, 16)}`;
};
const disposition = (status, targets = []) => ({
  sourceRevision: 1,
  status,
  reason: `Probe ${status} disposition.`,
  reopenWhen: "The source changes.",
  targets,
  at: "2026-11-03T00:00:00.000Z",
});
try {
  {
    const root = fixture();
    put(root, "docs/work-orders/WO-777-probe.md", "# WO-777 — Probe target\n");
    const state = syncFollowups(root);
    const old = state.entries[0];
    rekey(old, "Files under `");
    old.dispositions = [disposition("allocated", ["WO-777"])];
    put(root, FOLLOWUPS, json(state));
    const carried = syncFollowups(root);
    const retired = carried.entries.find((entry) => entry.id === old.id);
    const created = carried.entries.find((entry) => entry.id !== old.id);
    const page = planningFollowups(root);
    check(
      "V1: an allocated disposition is carried; the old row is a duplicate of the new one; plan followups counts no needs-review or untriaged row",
      followupStatus(retired) === "duplicate" &&
        retired.dispositions.at(-1).targets[0] === created.id &&
        followupStatus(created) === "allocated" &&
        created.dispositions[0].targets[0] === "WO-777" &&
        page.pending === 0 &&
        !page.counts["needs-review"] &&
        !page.counts.untriaged,
      {
        old: followupStatus(retired),
        new: followupStatus(created),
        counts: page.counts,
        pending: page.pending,
      },
    );
    put(
      root,
      sourcePath,
      body.replace("public descriptions", "public descriptions and examples"),
    );
    const edited = syncFollowups(root);
    const after = edited.entries.find((entry) => entry.id === created.id);
    const added = edited.entries.filter(
      (entry) => entry.id !== old.id && entry.id !== created.id,
    );
    check(
      "V3: a body edit after the carry reopens the carried row for review and creates no row",
      followupStatus(after) === "needs-review" &&
        added.length === 0 &&
        followupStatus(edited.entries.find((entry) => entry.id === old.id)) ===
          "duplicate",
      { new: followupStatus(after), addedRows: added.length },
    );
  }
  {
    const root = fixture();
    const state = syncFollowups(root);
    const first = state.entries[0];
    const second = structuredClone(first);
    rekey(first, "Files under `");
    rekey(second, "Files under");
    first.dispositions = [disposition("settled")];
    second.dispositions = [disposition("declined")];
    state.entries.push(second);
    put(root, FOLLOWUPS, json(state));
    const carried = syncFollowups(root);
    const rows = carried.entries.map((entry) => ({
      row:
        entry.id === first.id
          ? "first"
          : entry.id === second.id
            ? "second"
            : "created",
      status: followupStatus(entry),
      dispositions: entry.dispositions.length,
    }));
    check(
      "V2: two retired rows match one created row; nothing is carried",
      rows.length === 3 &&
        rows.filter(
          ({ row, status }) => row !== "created" && status === "needs-review",
        ).length === 2 &&
        rows.find(({ row }) => row === "created").status === "untriaged",
      rows,
    );
  }
  {
    let outcome;
    try {
      syncFollowups(launchpad, { check: true });
      outcome = "current";
    } catch (error) {
      outcome = error.message;
    }
    check(
      "V4: this repository's register reads current under the carry (check mode)",
      outcome === "current",
      outcome,
    );
  }
} finally {
  rmSync(base, { recursive: true, force: true });
}
const record = {
  probe: "P3 register-carry",
  observedAt: new Date().toISOString(),
  pass: results.every((row) => row.pass),
  results,
};
writeFileSync(output, `${JSON.stringify(record, null, 2)}\n`);
console.log(JSON.stringify(record, null, 1));
process.exitCode = record.pass ? 0 : 1;
