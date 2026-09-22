# WO-063 decisions

## WO-063-D001

```json
{
  "id": "WO-063-D001",
  "date": "2026-09-22",
  "dispatch": "resume: next",
  "decision": "Implement a pure lint with an explicit local-check observation and a filesystem adapter reusing checkLocalTerms unchanged. Keep the public vocabulary and conventional type set in docs/control/outward-vocabulary.json, resolved through the configured control root. Commit subjects and PR titles use the same 72-code-point conventional subject profile; branches use type/lowercase-hyphenated-slug; PR bodies receive vocabulary checks only. Local diagnostics retain line/count only; no matched local text, list, hash or raw exception is returned. An absent list yields unavailable, never pass.",
  "evidence": [
    "docs/work-orders/WO-063-outward-artifact-lint.md",
    "docs/product/01-principles.md Principle 16",
    "docs/product/03-architecture.md Platform and instance boundary",
    "docs/work-orders/WO-033-compiled-starter-export.md Phase 2",
    "scripts/lib/terms.mjs: redacted exception contains only file, line and count",
    "scripts/lib/config.mjs: control is a relocatable document root",
    "scripts/github-body.mjs and scripts/test-github-body.mjs: GitHub prose rendering is a separate existing concern"
  ],
  "rejected": [
    {
      "option": "NoOp",
      "reason": "Leaves the outward artifact lint prerequisite of WO-064 absent."
    },
    {
      "option": "Read files inside lintOutwardArtifact",
      "reason": "Would contradict the pure-function objective."
    },
    {
      "option": "Change checkLocalTerms to expose exact matches",
      "reason": "Outside the order and violates its privacy contract; line spans suffice for local findings."
    },
    {
      "option": "Configurable rule language or target Git hook",
      "reason": "Explicitly declined by the order; adds policy machinery or target residue."
    },
    {
      "option": "Apply the GitHub prose soft-wrap checker here",
      "reason": "The order specifies shape and vocabulary, while existing publication tooling already owns rendering."
    }
  ],
  "reopenWhen": "WO-064 integrates the lint, a demonstrated target convention needs another fixed profile, or a public vocabulary entry produces a legitimate target false positive."
}
```

## WO-063-D002

```json
{
  "id": "WO-063-D002",
  "kind": "experiment",
  "date": "2026-09-22",
  "dispatch": "resume: next",
  "decision": "Keep the normal focused-fixture development loop and required npm test; decline a separate timing benchmark.",
  "question": "Would benchmarking a faster fixture loop save work on this new lint?",
  "alternatives": [
    "Benchmark focused versus full fixture commands",
    "Use focused fixtures during development and run the required full gate once ready"
  ],
  "observation": "There is no existing outward-lint fixture suite or repeated iteration baseline to measure before implementation.",
  "budget": {
    "wallSeconds": 60
  },
  "execution": "declined",
  "reason": "A benchmark would measure a newly invented baseline and duplicate the required integration run; no demonstrated recurring saving justifies it.",
  "cost": {
    "wallSeconds": 39.139,
    "tokens": null,
    "commands": [
      "Review the existing test-runner registration and WO-145 experiment record; record this decline"
    ],
    "source": "Wall time from 2026-09-22T01:20:07.400Z through this receipt write; token allocation unavailable."
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": [
      "node --test scripts/test-outward-lint.mjs",
      "npm test"
    ],
    "summary": "No method change or measured saving claimed; required checks retained."
  },
  "outcome": "kept-current",
  "regression": "unknown",
  "history": {
    "lastAdoptedImprovementAt": null,
    "experimentsSinceAdoption": null
  },
  "evidence": [
    "scripts/test-runner.mjs",
    "docs/evidence/WO-145/decisions.md"
  ],
  "rejected": [
    {
      "option": "Run a timing trial",
      "reason": "No current lint baseline exists."
    }
  ],
  "reopenWhen": "Repeated lint development iterations demonstrate a measurable feedback bottleneck."
}
```

The mission contribution is a reusable, inspectable boundary check for the first external source-to-deliverable loop; WO-064 owns publication integration. The CLI and pure interface are consumable without this session, and this repository exercises both before export.

Policy resistance is bounded by preserving the local check and publication authority. Commons cost is one small deterministic suite and no agents or dependencies. Drift is checked by explicit negative fixtures and unavailable handling. Escalation is bounded by a fixed profile rather than a rule language. Success to the successful is countered by comparing pure and filesystem approaches. Shifting the burden is reduced by named rules and spans. Rule beating is addressed by CLI, privacy and missing-list fixtures. Seeking the wrong goal is bounded by outward text behavior, with no claim that this order guards remote effects. Naive Interventionism preserves existing GitHub formatting and local-term behavior, adds no target files and keeps the new interface reversible. NoOp leaves the admitted prerequisite absent.

The order predates 2026-09-09: this decisions file and its generated index row discharge the historical ledger write-back under the executor skill.

## WO-063-D003

```json
{
  "id": "WO-063-D003",
  "date": "2026-09-22",
  "dispatch": "resume: next; standing release assignment and required product write-backs",
  "decision": "Complete the missing activation version as application v0.40.3, the next patch above local v0.40.2; leave runtime versions unchanged. Refresh both publication edition locks after the roadmap and Discipline write-backs.",
  "evidence": [
    "git tag --list v* --sort=-v:refname: local v0.40.2 is the highest tag",
    "WO-063 declares patch and no runtime package change",
    "npm run release -- prepare --local: v0.40.3 remains current",
    "npm run plan -- check: release-assignment continuation admitted",
    "npm run publication:check: all 273 headings covered; only the two source locks were stale after the product edits"
  ],
  "rejected": [
    {
      "option": "Leave activation version unassigned",
      "reason": "The standing opt-out default requires a classified release preparation."
    },
    {
      "option": "Bump runtime components",
      "reason": "Only scripts, vocabulary, tests and documentation change."
    },
    {
      "option": "Retain the former publication locks",
      "reason": "Would claim the linked source bytes had not changed."
    }
  ],
  "reopenWhen": "Final review observes a newer published tag and retimes under the same patch classification, or linked product sources change again."
}
```

## WO-063-D004

```json
{
  "id": "WO-063-D004",
  "date": "2026-09-22",
  "dispatch": "resume: next; review of the authored implementation",
  "decision": "Require explicit vocabulary data in the pure function; checkOutwardArtifact and the CLI load the single committed file through docPath. Remove the default static document import.",
  "evidence": [
    "scripts/lib/outward-lint.mjs initially imported ../../docs/control/outward-vocabulary.json even when the CLI selected a relocated control root",
    "scripts/lib/config.mjs and WO-069 establish document-root relocation",
    "scripts/test-outward-lint.mjs now copies the CLI and its module dependencies into a fixture with only records/control, proving it needs no default docs tree"
  ],
  "rejected": [
    {
      "option": "Keep the static JSON import for the default pure call",
      "reason": "Copied tooling would require the original document layout even when all configuration points elsewhere."
    },
    {
      "option": "Duplicate the vocabulary as in-code defaults",
      "reason": "Creates two policy sources and permits drift from the editable committed file."
    }
  ],
  "reopenWhen": "A future packaging contract supplies an explicit compiled policy value without requiring a source document tree."
}
```

## WO-063-D005

```json
{
  "id": "WO-063-D005",
  "date": "2026-09-22",
  "dispatch": "resume: final review",
  "decision": "Record, without repairing it inside this review, that the WO-140 gate-sandbox fixture's teardown in scripts/test-runner.test.mjs can fail the whole runner-fixtures suite with ENOTEMPTY after its assertions have already passed. It failed the reviewer's first product gate at this order's code identity and did not recur; pass WO-063 on its own acceptance criteria against the second gate at the same identity, and carry the teardown race as a named follow-up rather than patching a shared fixture this review would then certify.",
  "evidence": [
    "Reviewer gate 1, recorded 2026-09-22T02:03:23.082Z at codeIdentity db1c820d26ef9cccd265da9344eea9c16167f720a5b9cf9ac5e358d92faea76f: exitCode 1, 24 of 25 cases exit 0, the single failing case runner-fixtures at 12,307 ms",
    "Its retained output docs/control/local/harness/check-output/1705998863e35ca6186248d428c98ad20643b10a4f697a9cc9fe3c196547da64.log, lines 383-403: 'not ok 44 - WO-140 a partial inside-sandbox row is rejected by every product-gate consumer at the code identity where a full row is accepted', failureType 'hookFailed', error \"ENOTEMPTY, Directory not empty: '/var/folders/m1/v91jv25j7nl21fs2yxgjm3540000gn/T/dotln-gate-sandbox-HzuoRI'\", stack rmSync (node:fs:1566:18) then TestContext.<anonymous> at scripts/test-runner.test.mjs:1308",
    "scripts/test-runner.test.mjs:1303-1309: sandboxFixture registers t.after(() => { chmodSync(denied, 0o755); rmSync(repo, { recursive: true, force: true }); }), and rmSync defaults to maxRetries 0",
    "The abandoned fixture root still exists and retains only .git/objects/pack, so the recursive removal raced with a holder or writer of that path rather than being blocked by the 0o555 denied directory the teardown already re-chmods",
    "node --test --test-name-pattern 'WO-140 a partial inside-sandbox row' scripts/test-runner.test.mjs run alone: 1 passed, 0 failed, 588 ms",
    "Reviewer gate 2, recorded 2026-09-22T02:09:41.684Z at the same codeIdentity db1c820d...: exitCode 0, 25 passed, 0 failed, 284,165 ms, sandbox.inForce false, with outward-lint required and exit 0 in 374 ms",
    "The failing case is outside this order's subject: WO-063's only change to the runner is the five-line outward-lint registration in scripts/test-runner.mjs, and the failure is in WO-140's gate-sandbox fixture in scripts/test-runner.test.mjs, which this order does not touch",
    "Attribution limit: in gate 1 the case started concurrently with skeleton, worktree-integration and local-runner-double, so the added suite's scheduling pressure cannot be excluded as a trigger; this worktree's gate history holds five npm test rows and one failing case, which is too little to call the race pre-existing from the record"
  ],
  "rejected": [
    {
      "option": "Patch the teardown here as bounded boy-scout cleanup, for example an rmSync retry or a gc.auto=0 fixture config",
      "reason": "No root cause was reproduced and no probe demonstrated a fix, so the change would be a guess certified by its own author; the reviewer would also be the only judge of the one edit no independent verification saw."
    },
    {
      "option": "Fail WO-063 into repair",
      "reason": "Every acceptance criterion is met, the failure is a teardown hook in another order's fixture after its assertions passed, and the same code identity produced a clean 25-of-25 gate. Repair would route a shared-fixture race through this order's executor and a fresh verification for a defect that is not its subject."
    },
    {
      "option": "Leave it as a sentence in FINAL-001 only",
      "reason": "A defect met and not fixed must be reopenable from the order's own decisions file, not only from a review narrative."
    }
  ],
  "followup": "Planner: cut a bounded order over the WO-140 gate-sandbox fixture teardown in scripts/test-runner.test.mjs. Scope: identify which process repopulates or holds <fixture>/.git/objects/pack while the t.after hook removes the tree (a lingering child of the fixture's own runGate, or Git background work in the fixture repository), then make the teardown deterministic at the named cause rather than by blanket retry, and prove it with a fixture that reproduces the race under concurrent suite load. Acceptance should include the abandoned-directory symptom: no dotln-gate-sandbox-* root survives a full npm test. Priority: medium; it can fail any product gate for reasons unrelated to the order under review, which is the only kind of failure that has no owner.",
  "reopenWhen": "The same subtest or any other fixture teardown reports ENOTEMPTY in a later gate, or a dotln-gate-sandbox-* root is again left behind by a completed npm test."
}
```
