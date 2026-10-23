import {
  readFileSync,
  writeFileSync,
  mkdtempSync,
  mkdirSync,
  rmSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
const root = process.cwd();
const load = (name) => import(pathToFileURL(join(root, name)).href);
const { lintOutwardArtifact } = await load("scripts/lib/outward-lint.mjs");
const { checkOutwardArtifact } = await load("scripts/outward-lint.mjs");
const { lintArtifacts, reviewConfirmation } = await load(
  "scripts/lib/target-publish.mjs",
);
const { digestOf } = await load("scripts/lib/confirm-terms.mjs");
const { composeTargetBody } = await load("scripts/lib/github-body.mjs");
const policy = {
  types: ["fix", "feat", "docs"],
  reviewTerms: ["mask", "launchpad"],
};
const pure = (kind, text, options = {}) =>
  lintOutwardArtifact({
    kind,
    text,
    vocabulary: policy,
    localTerms: { status: "present" },
    target: true,
    ...options,
  });
const rows = [];
const record = (name, observed) => rows.push({ name, observed });
const fixture = mkdtempSync(join(tmpdir(), "wo227-worker-repro-"));
const write = (name, text) => {
  const file = join(fixture, name);
  mkdirSync(join(file, ".."), { recursive: true });
  writeFileSync(file, text);
};
const oldSession = process.env.CODEX_THREAD_ID;
try {
  write("dotln.config.json", JSON.stringify({ version: 1 }));
  write("docs/control/outward-vocabulary.json", JSON.stringify(policy));
  write("docs/control/local/terms.txt", "refuse: CobaltWidget\n");
  record(
    "adversary 1 private term spanning exempt display name still refuses",
    checkOutwardArtifact(fixture, {
      kind: "release-body",
      text: "CobaltWidget ships.",
      exemptText: ["Cobalt"],
      target: true,
    }),
  );
  write("docs/control/local/terms.txt", "");
  const composed = composeTargetBody({
    body: "# Change\r\rKeep the board.\r",
    baseCommit: "a".repeat(40),
    headCommit: "b".repeat(40),
    files: [
      { path: "src/mask.ts", added: 1, deleted: 1 },
      { path: "fixtures/launchpad-board.json", added: 1, deleted: 0 },
    ],
    baseTree: new Set(["src/mask.ts"]),
  });
  record(
    "adversary 2 lone-CR prose retains generated row attribution",
    lintArtifacts(fixture, [{ kind: "pr-body", ...composed }], {
      preview: true,
    }),
  );
  record(
    "adversary 3 three-digit boundary and longer controls",
    ["final-100-percent.png", "review-2026-10-21.md", "ws-2024", "WO-1000"].map(
      (text) => ({ text, findings: pure("pr-body", text).findings }),
    ),
  );
  record(
    "adversary 7 zero-width identifier limitation",
    ["commit", "pr-title", "pr-body"].map((kind) => ({
      kind,
      findings: pure(
        kind,
        kind === "pr-body" ? "WO-\u200b006" : "fix: handle WO-\u200b006",
      ).findings,
    })),
  );
  const unchangedBody = "# Result\n\nThe board is ready.\n";
  const sameDigest = digestOf(unchangedBody);
  record(
    "adversary 9 title review uses composed-body digest by contract",
    ["fix: update mask", "fix: update launchpad"].map((text) =>
      lintArtifacts(
        fixture,
        [
          { kind: "pr-title", text },
          { kind: "pr-body", text: unchangedBody },
        ],
        { confirmTerms: sameDigest },
      ),
    ),
  );
  process.env.CODEX_THREAD_ID = "synthetic-wo227-verifier-journal";
  const key = createHash("sha256")
    .update(process.env.CODEX_THREAD_ID)
    .digest("hex");
  write(
    `docs/control/local/harness/${key}.json`,
    JSON.stringify({ role: "reviewer", workOrder: "WO-999" }),
  );
  write(`docs/control/local/harness/${key}.jsonl`, "");
  const confirmation = reviewConfirmation(
    fixture,
    "WO-999",
    { confirmedDigest: sameDigest, matches: 2 },
    Date.parse("2026-10-22T00:00:00Z"),
    () => {},
  );
  const journal = JSON.parse(
    readFileSync(
      join(fixture, `docs/control/local/harness/${key}.jsonl`),
      "utf8",
    ),
  );
  record("C2 confirmation actually appends a matching journal row", {
    confirmation,
    journal,
    agrees:
      journal.confirmedDigest === confirmation.confirmedDigest &&
      journal.matches === confirmation.matches &&
      JSON.stringify(journal.attestation) ===
        JSON.stringify(confirmation.attestation),
  });
  const source = readFileSync(
    join(root, "scripts/lib/outward-lint.mjs"),
    "utf8",
  );
  const rule =
    '  if (target)\n    for (const [start, end] of formSpans(launchpadIdentifiers))\n      add("identifier.launchpad", start, end);';
  if (source.split(rule).length !== 2)
    throw new Error("the rule-only control must remove exactly one block");
  const baseLike = await import(
    `data:text/javascript;base64,${Buffer.from(source.replace(rule, "")).toString("base64")}`
  );
  const controls = [];
  for (const form of [
    "WO-006",
    "WO-006-D018",
    "FUP-280abd447f789958",
    "VER-001",
    "FINAL-001",
    "REVIEW-007",
    "WS-001",
  ])
    for (const kind of ["branch", "commit", "pr-title", "pr-body"]) {
      const text =
        kind === "branch"
          ? `fix/${form.toLowerCase()}`
          : kind === "pr-body"
            ? form
            : `fix: handle ${form}`;
      const input = {
        kind,
        text,
        vocabulary: policy,
        localTerms: { status: "present" },
        target: true,
      };
      controls.push({
        form,
        kind,
        changedStatus: lintOutwardArtifact(input).status,
        ruleOnlyControlStatus: baseLike.lintOutwardArtifact(input).status,
      });
    }
  record("C1 each form paired with only identifier.launchpad removed", {
    all28Hold:
      controls.length === 28 &&
      controls.every(
        (r) =>
          r.changedStatus === "refused" && r.ruleOnlyControlStatus === "pass",
      ),
    controls,
  });
} finally {
  if (oldSession === undefined) delete process.env.CODEX_THREAD_ID;
  else process.env.CODEX_THREAD_ID = oldSession;
  rmSync(fixture, { recursive: true, force: true });
}
console.log(
  JSON.stringify({ recordedAt: new Date().toISOString(), rows }, null, 2),
);
