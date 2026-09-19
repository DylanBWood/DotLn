import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { inspectLedger, renderIndex, statuses } from "./lineage.mjs";
import { suites } from "./test-runner.mjs";

const header = `# Ledger\n\nStatuses: ${statuses.map((status) => `\`${status}\``).join(" / ")}\n\n`;
const entry = "- **An idea** `adopted` `recovered`\n  - Evidence.\n";
const section = `## 2026-09-19 — Example\n\n${entry}`;
const source = header + section;
const errors = (body) => inspectLedger(header + body).errors.join("\n");

test("index counts lead memberships, wrapped labels and prose-only/reference sections", () => {
  const ledger = inspectLedger(
    header +
      `## Example (2026-09-19)\n\n- **Wrapped\n  title**\n  \`adopted\` \`preserved\` \`operator-directed\`\n  - Inline \`raw\` is not a status.\n\n- \`adopted\`: legacy lead.\n\n## 2026-09-18 — Prose\n\nNo entry here.\n\n## Images (reference corpus)\n\n- **image.png** reference.\n\n## Chat 011\n\n${entry}`,
  );
  assert.deepEqual(ledger.errors, []);
  assert.equal(ledger.counts.adopted, 3);
  assert.equal(ledger.counts.preserved, 1);
  assert.equal(ledger.counts.raw, 0);
  const output = renderIndex(ledger);
  assert.match(output, /Sections: 4\. Idea entries: 3/);
  assert.match(output, /Prose.*prose-only section/);
  assert.match(output, /Images.*reference inventory/);
  assert.match(output, /plain=1#L5/);
});

test("unlabeled entries cannot borrow status from nested evidence or later prose", () => {
  for (const body of [
    "- **Unlabeled**\n  - `adopted` evidence.\n",
    "- **Unlabeled**\n\nLater `adopted` prose.\n",
    "- **Unlabeled** `recovered`\n",
    "- Plain untagged entry.\n",
    "1. **Unlabeled numbered entry**\n",
  ])
    assert.match(
      errors(`## 2026-09-19 — Example\n\n${body}`),
      /unlabeled entry/,
    );
});

test("unknown and duplicate tags fail even beside a recognized lifecycle tag", () => {
  for (const lead of ["`invented`", "`adopted` `invented`"])
    assert.match(
      errors(section.replace("`adopted` `recovered`", lead)),
      /unknown status/,
    );
  assert.match(
    errors(section.replace("`recovered`", "`adopted`")),
    /duplicate entry tag/,
  );
  assert.match(
    inspectLedger(source.replace("Statuses:", "Old statuses:")).errors.join(
      "\n",
    ),
    /Statuses declaration/,
  );
});

test("newest-first dates and both old and founding boundaries are enforced", () => {
  assert.match(
    errors(section + section.replaceAll("2026-09-19", "2026-09-20")),
    /out of newest-first/,
  );
  assert.match(
    errors(section.replace("2026-09-19", "2026-02-30")),
    /valid YYYY-MM-DD/,
  );
  assert.match(
    errors(
      section + "\n## Resolutions of known tensions\n\nSettled.\n" + section,
    ),
    /old boundary/,
  );
  assert.match(
    errors(section + "\n## Images (reference corpus)\n\n" + section),
    /below the founding/,
  );
  assert.match(
    errors(
      section + "\n## Images (reference corpus)\n\n## Forgotten session\n",
    ),
    /below the founding/,
  );
  assert.match(errors(section + "\n## Chat 011\n"), /founding chats/);
  assert.match(
    errors(section + "\n## Images (reference corpus)\n\n## Chat 010\n"),
    /founding chats/,
  );
  assert.deepEqual(inspectLedger(source + "\n" + section).errors, []);
});

test("quoted examples in fences do not become ledger entries or headings", () => {
  assert.deepEqual(
    inspectLedger(source + "\n```md\n## Wrong\n- Untagged\n```\n").errors,
    [],
  );
  assert.match(errors(section + "\n```md\n"), /Unclosed code fence/);
  assert.match(
    errors(
      "## 2026-09-19 — Example\n\n- **Unlabeled**\n```\nevidence\n```\n  `adopted`\n",
    ),
    /unlabeled entry/,
  );
  for (const indent of [" ", "  ", "   "])
    assert.match(
      errors(`## 2026-09-19 — Example\n\n${indent}- **Unlabeled**\n`),
      /column one/,
    );
});

test("CLI generation is deterministic; --check refuses stale output and invalid fixtures without writes", (t) => {
  const root = mkdtempSync(join(tmpdir(), "dotln-lineage-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, "docs/lineage"), { recursive: true });
  const ledger = join(root, "docs/lineage/idea-ledger.md");
  const index = join(root, "docs/lineage/README.md");
  writeFileSync(ledger, source);
  const invocation = `import { main } from ${JSON.stringify(new URL("./lineage.mjs", import.meta.url).href)}; main(process.argv.slice(1), ${JSON.stringify(root)});`;
  const run = (...args) =>
    spawnSync(
      process.execPath,
      ["--input-type=module", "-e", invocation, ...args],
      { encoding: "utf8" },
    );
  assert.equal(run("index").status, 0);
  const generated = readFileSync(index, "utf8");
  assert.equal(run("index", "--check").status, 0);
  assert.equal(run("index").status, 0);
  assert.equal(readFileSync(index, "utf8"), generated);
  writeFileSync(index, "stale\n");
  assert.match(run("index", "--check").stderr, /Stale/);
  assert.equal(readFileSync(index, "utf8"), "stale\n");
  for (const invalid of [
    source.replace("`adopted` `recovered`", ""),
    source.replace("`adopted` `recovered`", "`invented`"),
    source + "\n## Images (reference corpus)\n\n" + section,
  ]) {
    writeFileSync(ledger, invalid);
    assert.notEqual(run("index", "--check").status, 0);
    assert.notEqual(run("index").status, 0);
    assert.equal(readFileSync(index, "utf8"), "stale\n");
  }
  assert.notEqual(run("index", "--unknown").status, 0);
});

test("current index matches independently counted lead statuses and stays outside the product gate", () => {
  const text = readFileSync(
    new URL("../docs/lineage/idea-ledger.md", import.meta.url),
    "utf8",
  );
  const ledger = inspectLedger(text);
  assert.deepEqual(ledger.errors, []);
  // Independent line/lead oracle: grep only adjacent tags after bold titles or
  // legacy tag-prefix leads; never count code examples in entry bodies/header.
  const leads = [
    ...text.matchAll(/^[-*+] (?:\*\*[\s\S]*?\*\*\s*)?((?:`[^`\n]+`\s*)+)/gm),
  ].map((match) => match[1]);
  for (const status of statuses)
    assert.equal(
      ledger.counts[status],
      leads.filter((lead) => lead.includes(`\`${status}\``)).length,
      status,
    );
  assert.equal(
    readFileSync(new URL("../docs/lineage/README.md", import.meta.url), "utf8"),
    renderIndex(ledger),
  );
  for (const name of ["lineage", "lineage-fixtures"]) {
    const suite = suites.find((row) => row.name === name);
    assert.equal(suite.document, true);
    assert.equal(suite.product, false);
  }
  const cli = execFileSync(
    process.execPath,
    ["scripts/lineage.mjs", "index", "--check"],
    { cwd: new URL("../", import.meta.url), encoding: "utf8" },
  );
  assert.match(cli, /PASS lineage index/);
});
