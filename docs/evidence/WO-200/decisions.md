# WO-200 decisions

## WO-200-D001 — Record the collector drift before restoring its bytes

```json
{
  "id": "WO-200-D001",
  "date": "2026-10-12",
  "dispatch": "resume: next",
  "decision": "Record the source drift under WO-107 D001 before changing any implementation bytes, then restore the single comment to its pre-WO-188 bytes and protect the four hashed collectors with dotln-pinned-bytes, exact formatter ignores and a changed-source review row. Commit 1aea2dea of 2026-10-09 changed only the comment in profile.mjs. It moved the collector hash from 1d618f2f6e81f6dcb3b06aba2f9bb525ce50d854d1cf664155f1b75fafde34cd to 8e770e7f454e6878919abfae2f843b52e13ddf8265ebe9594959e72452e64e6c; 36 of 72 retained records still carry the former. The provenance failures span 2026-10-09 through this restoration on 2026-10-12 UTC. Cause class: a repository-wide rewriter reached hash-pinned bytes outside every gate.",
  "evidence": [
    "Before implementation at 2026-10-12T02:42:01.345Z: node scripts/harness.mjs bounded -- node --test corpus/harness/wo107-schema.test.mjs exited 1: 13 tests, 10 pass, 3 fail. Two failures say known collector revision. The third is the separately diagnosed classification fixture drift, not collector drift.",
    "git log --format='%h %ad' --date=short -- corpus/harness/profile.mjs corpus/harness/wo107-records.mjs corpus/harness/wo107-scenarios.mjs corpus/harness/wo107-bounded.mjs: only 1aea2dea (2026-10-09) and 3e29dd9d (2026-10-01). git diff 1aea2dea^ -- corpus/harness/profile.mjs shows only the comment changed from after D007 to after the one-entry classification fix (WO-107 D007).",
    "protocolLineage() before edits reports currentHash 8e770e7f454e6878919abfae2f843b52e13ddf8265ebe9594959e72452e64e6c; reading the committed observations finds 36 initial-protocol records and 36 records with 1d618f2f6e81f6dcb3b06aba2f9bb525ce50d854d1cf664155f1b75fafde34cd.",
    "docs/evidence/WO-107/decisions.md#wo-107-d001",
    "docs/work-orders/WO-200-pinned-collector-bytes-observed.md"
  ],
  "rejected": [
    {"option": "NoOp", "reason": "Leaves reproducible provenance failures and permits another silent rewrite."},
    {"option": "Recollect the baseline or admit a third collector revision", "reason": "The only collector difference is a comment; measurements and classifications did not change. Preserve the recorded evidence and restore the original bytes."},
    {"option": "Exclude all corpus/harness code or hard-code a second path list in commentFiles", "reason": "Ordinary tests and generators still need scanning; the attribute is the declaration."},
    {"option": "Settle WO-105's after-base policy", "reason": "Its independent lane and FUP-d093f77bd927f9dc are outside this order."}
  ],
  "reopenWhen": "A collector needs a semantic edit, a hashed input changes, or executable evidence contradicts exact restoration; record and review provenance before changing pinned bytes."
}
```

Goal alignment: restoring evidence by recollecting it would erase the useful drift diagnosis; preserve the records and reverse only the comment. Broad exclusions would hide ordinary code; declare exactly the hashed files. NoOp leaves the two reproduced provenance failures. The index refresh and dispatch projections preceded this record; no implementation bytes did.

## WO-200-D002 — Operator-authorized classification test repair

```json
{
  "id": "WO-200-D002",
  "date": "2026-10-12",
  "dispatch": "resume: next; operator scope extension",
  "decision": "Extend only the schema-test repair: validate the historical classification fixture exactly and require today's shared fixture to retain WO-107's exact declaration, without changing the pinned collector, its classification validator, the shared fixture or the retained observations. The operator answered 'Extend the test repair scope' to that concrete proposal in this session. Amend the order to replace its instruction that this check remains unchanged; retain all other acceptance obligations.",
  "evidence": [
    "The initial bounded schema run failed its classification-exception case with current hash 541bb6fb6dba2d9d7cd4a7eed61766d151bd4e1e3732a51fd79578f3a0f76a31 rather than historical 335e66e7d907abf7f3ef54cbb606a9bccb6853886adfb31533a97ca02891156a.",
    "git log and git diff 1aea2dea^ -- packages/kernel/test/fixtures/jsonl-protocols.json identify commit 209e2499 (2026-10-11): it adds only the reader-scores non-event declaration; WO-107's entry remains unchanged.",
    "docs/evidence/WO-107/decisions.md#wo-107-d010 names this whole-file pin as an after-base limitation."
  ],
  "rejected": [
    {"option": "Remove the reader-score declaration", "reason": "Would discard a valid sibling change."},
    {"option": "Change validateClassification or its pinned hash", "reason": "Would change collector provenance and invalidate the restoration."},
    {"option": "Skip the test or call its failure a pass", "reason": "Would not establish criterion 1 or protect the historical exception."}
  ],
  "reopenWhen": "Today's WO-107 declaration changes or disappears, or the historical fixture fails its exact validator."
}
```

## WO-200-D003

```json
{
  "id": "WO-200-D003",
  "date": "2026-10-12",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.76.1, the next patch above the observed release baseline v0.76.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.76.0 (local tags)",
    "patch classification declared in docs/work-orders/WO-200-pinned-collector-bytes-observed.md"
  ],
  "rejected": [
    {
      "option": "An activation-completion paragraph in the roadmap",
      "reason": "The tag is the record and the roadmap's release history is generated from tags (WO-086); this decision keeps the base and the classification."
    }
  ],
  "reopenWhen": "The observed baseline or the classification changes before publication; a later collision is recorded as its own decision."
}
```

## WO-200-D004 — Derive the protection sets without moving the pinned inputs

```json
{
  "id": "WO-200-D004",
  "date": "2026-10-12",
  "dispatch": "resume: next",
  "decision": "Both declaration tests derive their anchor from protocolLineage's literal names array without editing the pinned module; the schema case also requires protocolHash's separate literal array to match in order. Compare global tracked Git attributes and exact corpus/harness ignore entries independently against that anchor. Export the existing machinerySources object and compare its raw wo107-schema entry without copying a list into the test. Add one reasoned machinery-coverage exclusion for the schema's runner import: runner-fixtures owns metadata and selection; the collector row retains exactly its five declared sources. Keep this parsing local to the two tests instead of adding collector-test parsing to the runtime runner API.",
  "evidence": [
    "corpus/harness/profile.mjs: protocolLineage's names and protocolHash's array are separate private literals; exporting either would change the pinned hash.",
    "scripts/test-runner.mjs: classified suites merge source declarations; exporting machinerySources exposes the exact contract the order asks to judge.",
    "node scripts/harness.mjs bounded -- node --test --test-name-pattern='WO-174 every machinery suite' scripts/test-runner.test.mjs: 1 pass, 0 fail; no uncovered direct import.",
    "Read-only design worker anchor_audit, selected gpt-6.1-sol / max, recommended the literal source anchor, live-hash cross-check and explicit import exclusion; host effective-effort readback unavailable."
  ],
  "rejected": [
    {"option": "Import the schema test from the document fixture", "reason": "Registers the whole lane in the document gate, violating the requested gate boundary."},
    {"option": "Computed dynamic runner import", "reason": "Would conceal the dependency from direct import coverage."},
    {"option": "New helper module or exported collector API", "reason": "Would widen the five-source selection contract or change the hash-pinned bytes for a test-only need."},
    {"option": "Only compare the declarations to each other", "reason": "Would let all three omit a new hashed input together."}
  ],
  "reopenWhen": "The collector changes its declaration syntax or begins computing its inputs; the literal extraction must fail until an equally direct anchor is reviewed."
}
```

Release impact: application-only patch v0.76.1. No package implementation, package manifest, lockfile or dependency changes; all publication controls remain in place. The authorized product sentence changed the two publication source locks; `npm run publication:check` first reported them stale, then passed after updating only those locks. The corresponding outline topics still point at the same corpus-policy section.

Carry-ins: FUP-8f0561e50754114f and FUP-069dff5d52d98e0d are handled for this lane by changed-collector review selection and the scoped classification-test repair; the registry-construction check and collector-provenance check remain intact and pass in the 14-case run. WO-105's independent policy remains outside this order.

Probe setup correction: the first disposable-copy proof compared macOS's `/var` spelling to Git's physical `/private/var` path and stopped before any selection or mutation assertion. The script now resolves the scratch root physically before Git operations; the failed scratch copy was removed. This was a probe setup error, not evidence against the implementation.

Self-review outcome: both independent workers found zero actionable defects; see [self-review.md](self-review.md). The optional historical fixture variable rename was applied. The scratch evidence [scratch-proofs.log](scratch-proofs.log) records twelve expected assertion failures across missing declarations, added/removed input lists and altered/deleted live classification entries; all three positive baselines and all three CLI selection checks passed. The disposable repository was removed and its last commit recorded there. No nested repository was found outside intake when scanning the worktree (dependencies and rebuildable dist excluded).

## WO-200-D005 — Verification: pass VER-001; board the declaration tests' textual reading of the formatter ignore list, which a negation line defeats

```json
{
  "id": "WO-200-D005",
  "date": "2026-10-12",
  "dispatch": "resume: verify; VER-001",
  "kind": "finding",
  "decision": "Pass VER-001: criteria 1 to 5 are met at code identity 1acd288a7b1119d141c3413027731d51b8e9d647d7544562f6bcd682e5ff3cc7. Board F1 (follow-up). Both declaration tests read .prettierignore as text, keeping the lines that start with corpus/harness/, and compare them with protocolLineage's input list; neither asks the formatter whether it ignores those files. Appending the negation line !corpus/harness/profile.mjs makes prettier --file-info report ignored false for profile.mjs, while the schema pinned-bytes case and the comment-labels ignore case both still pass. A later formatter upgrade or a repository-wide format could then rewrite hashed bytes with every gate green, which is the drift this order ends. Route: follow-up. Criterion 2 asks that .prettierignore list the same paths, which still holds under the negation, and main had no such protection, so no criterion and no behavior main had is broken.",
  "evidence": [
    "docs/evidence/WO-200/verification-001-variation-probe.mjs under harness bounded, 2026-10-12T04:02:58.710Z-04:03:00.210Z, exit 0, transcript in docs/evidence/WO-200/verification-001-probes.log (variations.log): with the negation line appended in a scratch clone of the subject, prettier --file-info corpus/harness/profile.mjs prints {\"ignored\":false,\"inferredParser\":\"babel\"}; 'corpus the hashed collector files are exactly the pinned-bytes files' and 'WO-200 every path with dotln-pinned-bytes set is listed in .prettierignore' both exit 0.",
    "Source: corpus/harness/wo107-schema.test.mjs and scripts/test-comment-labels.mjs filter .prettierignore with line.startsWith(\"corpus/harness/\"), so a line beginning with ! is never read.",
    "Controls in the same clone (verification-001-probes.log, mutate.log, 2026-10-12T03:58:37.755Z-03:58:43.100Z): dropping one ignore line (M2) or replacing three ignore lines with the equivalent glob corpus/harness/wo107-*.mjs (M9) fails both cases."
  ],
  "rejected": [
    {
      "option": "Judge criterion 2 unmet",
      "reason": "Criterion 2 and step 6 require that the ignore file list the same paths and that a test compare the lists with the anchor; both hold. The negation is a stronger attack than the criterion names."
    },
    {
      "option": "State the gap only in the report",
      "reason": "A defect met in verification is boarded with a follow-up, not left as a report sentence."
    }
  ],
  "followup": "Assert the formatter's effective exclusion of every collector input. In the comment-labels ignore case (document gate, every run) and the schema pinned-bytes case, resolve each protocolLineage input through Prettier's own ignore resolution (prettier.getFileInfo with ignorePath .prettierignore, or prettier --file-info) and require ignored true. Keep the textual comparison so an extra or missing entry still fails. Regression: the VER-001 variation probe's negation line !corpus/harness/profile.mjs fails both cases.",
  "reopenWhen": "prettier --file-info reports a collector input ignored false while both declaration tests pass, or a repair changes how either test reads .prettierignore."
}
```

## WO-200-D006 — Verification: planning receipt 044's criterion-5 reopening condition for WO-200 has occurred

```json
{
  "id": "WO-200-D006",
  "date": "2026-10-12",
  "dispatch": "resume: verify; VER-001",
  "kind": "finding",
  "decision": "Record that the reopening condition of planning receipt 2026-10-11-planning-fb68306765535a9d-044's criterion-5 known issue for WO-200 has occurred: WO-200 activated with D001 naming no consumer of the WO-107 baseline. Route: planning, not blocking. The condition belongs to the planning goal standard, under which risk-reduction work names the blocked outcome it enables. No WO-200 acceptance criterion asks D001 to name a consumer, and VER-001 judges the criteria on their own text. The receipt's other condition, WO-118's activation recorded as delayed by WO-200, is not observed.",
  "evidence": [
    "docs/control/orders/WO-200.jsonl: WorkOrderActivated, recordedAt 2026-10-12T02:40:24.220Z.",
    "grep -n -i consumer over docs/evidence/WO-200/decisions.md (D001 to D004), docs/evidence/WO-200/handoff.md and the order: the only match is the order's Cost line, 'the manual lane run before any consumer of the baseline' (line 29).",
    "The verify briefing's planning receipt 044 known issue for criterion:5 and its Reopen when text."
  ],
  "rejected": [
    {
      "option": "Fail VER-001 on it",
      "reason": "A verdict is bound to the order's criteria, and none requires a named consumer."
    },
    {
      "option": "Name a consumer from verification",
      "reason": "Choosing the outcome the work enables is a planning judgment, and a filed decision is not edited."
    }
  ],
  "followup": "Next planning pass: reopen receipt 044's criterion-5 finding for WO-200 as its condition requires. Name the consumer of the WO-107 baseline or record that none exists, and judge whether WO-118's sequencing still depends on WO-200.",
  "reopenWhen": "A planning pass disposes the reopened finding, or WO-118's activation is recorded as delayed by WO-200's execution or repair."
}
```

## WO-200-D007

<!-- integration refs/dotln/checkpoint/WO-200/6 -->

```json
{
  "id": "WO-200-D007",
  "date": "2026-10-12",
  "dispatch": "resume: final review; worktree integrate WO-200",
  "decision": "Integration took in nothing: the base and the fetched main are both 73061e52b16d29de0621794f0662a0b50e60d775, origin/main names the same commit, origin lists no wo-200 branch, and the branch carries no commit of its own. The helper checkpointed the work, retained its named stash, re-applied it without an authored conflict and regenerated projections only: the runtime snapshot, the harness bundle and manifest (unchanged against main; harness check passes with 34 surfaces), the control projection, the release preparation (meter and PR stub), this record's stub, the decisions index, register and meta, the work-order index, the sibling registry and the publication locks. Every acceptance claim is carried forward unchanged: VER-001's five criterion judgments and its two boards (D005, a follow-up; D006, a planning record) at code identity 1acd288a7b1119d141c3413027731d51b8e9d647d7544562f6bcd682e5ff3cc7, the executor's zero-finding self-review, and the executor's passing npm test -- --review row at that identity. gateCodeIdentity returns the same identity after integration. Release preparation keeps application v0.76.1 under the order's patch classification: local tags and origin both end at v0.76.0, which names the base commit, and neither lists v0.76.1; package.json and package-lock.json are not in the diff, so no component version or dependency collides. No evidence edition is registered to this order, and the changed files are in no evidence inventory, so integration owes no re-mint.",
  "evidence": [
    "refs/dotln/checkpoint/WO-200/6 (dd19e332e09887e44f5ef8e0fa4d388995b7c6a9); named stash 1c107ab6975a259c22aef6794f1dce19bceb185a (WO-200 integrate 2026-10-12) retained, never popped or dropped",
    "base 73061e52b16d29de0621794f0662a0b50e60d775; upstream 73061e52b16d29de0621794f0662a0b50e60d775; git ls-remote origin refs/heads/main names the same commit and lists no wo-200 branch",
    "gateCodeIdentity after integration: 1acd288a7b1119d141c3413027731d51b8e9d647d7544562f6bcd682e5ff3cc7, equal to VER-001's and the executor's; the executor's npm test row (review selection) at that identity recorded 2026-10-12T03:17:56.952Z: 33 suites, 85 fresh tasks, 1,355.673 s, exit 0",
    "release preparation: WO-200 target v0.76.1 remains current; git tag --list v0.76* names only v0.76.0; git ls-remote --tags origin lists v0.76.0 at 73061e52 and no v0.76.1; package.json and package-lock.json are not in the diff",
    "affected checks on the integrated tree under harness bounded, 2026-10-12T04:26:30Z to 04:26:36Z: npm run publication:check pass (both editions CURRENT, 29 and 45 linked sections); node scripts/harness.mjs check, 34 generated surfaces; npm run release -- check-surfaces --local exit 0 with 57 passing lines; git diff --check clean; npm test -- --review runs in the handoff sequence and FINAL-001 records its row",
    "git diff --quiet main -- .claude/ exits 0 after regeneration: the harness bundle and manifest are unchanged",
    "release preparation: WO-200 target v0.76.1 remains current. Files changed: docs/evidence/WO-200/meta.json, docs/final-reviews/WO-200/PR.md. Meter snapshot: docs/evidence/WO-200/meta.json, 4039 bytes. Tag observation: local snapshot only."
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    },
    {
      "option": "Treat the regenerated meter, index, lock and projection bytes as a new subject",
      "reason": "Reports, indexes and release text change no code identity; product 07 §Independent workflows and integration makes integration bookkeeping no finding."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-12. Original base: `73061e52b16d29de0621794f0662a0b50e60d775`.
Fetched main: `73061e52b16d29de0621794f0662a0b50e60d775`. Checkpoint: `refs/dotln/checkpoint/WO-200/6`.
Named stash retained: `1c107ab6975a259c22aef6794f1dce19bceb185a` (WO-200 integrate 2026-10-12).
Resolved projections: none.
Release preparation: WO-200 target v0.76.1 remains current. Files changed: docs/evidence/WO-200/meta.json, docs/final-reviews/WO-200/PR.md. Meter snapshot: docs/evidence/WO-200/meta.json, 4039 bytes. Tag observation: local snapshot only.
Carried-forward claims: VER-001's five criterion judgments and its two boards (D005, F1 as a follow-up; D006, a planning record), the executor's zero-finding self-review and the executor's passing review row, all at code identity `1acd288a…`, which the integrated tree keeps.
Authored conflicts observed: none.
Affected checks executed on the integrated tree: `npm run publication:check`, `node scripts/harness.mjs check`, `npm run release -- check-surfaces --local` and `git diff --check`, each passing under `harness bounded` between 04:26:30Z and 04:26:36Z; `npm test -- --review` ran in the handoff sequence, and FINAL-001's Executed checks table records its row.

## WO-200-D008 — Final review: pass FINAL-001 at the integrated subject; two carried-in register rows re-deferred by name

```json
{
  "id": "WO-200-D008",
  "date": "2026-10-12",
  "dispatch": "resume: final review; FINAL-001",
  "decision": "Pass FINAL-001. All five criteria, as amended by WO-200-D002, are met at code identity 1acd288a7b1119d141c3413027731d51b8e9d647d7544562f6bcd682e5ff3cc7, the identity VER-001 passed and the integrated tree keeps. This review found no new defect: it reread the whole diff, re-ran the lane (14 of 14), the comment check (548 files, 0 failures), the seven comment fixtures, the WO-174 coverage case and both gate selections, recomputed the collector hash in protocolHash's shape (1d618f2f…), confirmed the four collectors byte-identical to WO-107's commit, and confirmed the attribute set, the formatter's effective ignores and the empty corpus baseline on the real repository. VER-001's F1 (D005, FUP-984094128fe71900) stays boarded: a reviewer writes no behavioral fix, and the negation-line gap breaks no criterion and no behavior main had. Register: FUP-8f0561e50754114f (WO-107 D010) and FUP-069dff5d52d98e0d (manual corpus lanes) were allocated to this order for the WO-107 lane; both are re-deferred, not settled, because WO-200 discharged only part of each. Of D010's follow-up, WO-200 decided the WO-107 lane's after-base rule (a change to the pinned bytes is judged by the wo107-schema review row), repaired the classification self-test to require WO-107's exact declaration while validating the historical fixture, and recorded the rule in SCHEMA-WO-107.md; it did not archive the second collector revision, label the registry self-test as base-only or fix the comparison report's trailing newline, each a change to the hash-pinned bytes this order declines, and WO-105's rule stays on FUP-d093f77bd927f9dc. Of the manual-lane candidate, one of the twelve ungated corpus test files now runs in the review gate when its sources change; the other eleven keep their orders' design. FUP-4c4ad5ef3c88547f (WO-188 D048) is a textual match on scripts/lib/comment-labels.mjs: its FINDING_LABEL token item is a scan-rule change outside this order's surfaces, the executor did not take it up, and its condition (a document gate failing on a comment token) has not occurred; it is left as it is. The two VER-001 boards stay for planning. Planning receipt 044: the criterion-2 known issue is not triggered (no WO-200 surface claims the drift class removed beyond the four attributed files; the PR body and release notes say so), and the criterion-5 condition occurred and is held by D006 (FUP-2eddaaaa1ea5d3c3).",
  "evidence": [
    "docs/final-reviews/WO-200/FINAL-001.md: criterion judgments, the executed-checks table and the findings block ([])",
    "this review's bounded runs, 2026-10-12T04:23:20Z to 04:23:25Z: node --test corpus/harness/wo107-schema.test.mjs 14 pass, 0 fail; node scripts/comment-labels.mjs PASS 548 code files, 81 baselined lines, 0 failures; node --test scripts/test-comment-labels.mjs 7 pass; node --test --test-name-pattern='WO-174 every machinery suite' scripts/test-runner.test.mjs 1 pass; node scripts/test-runner.mjs --review --list names wo107-schema and runner-fixtures; node scripts/test-runner.mjs --list (32 lines) does not name wo107-schema",
    "git diff --stat 3e29dd9d -- the four collectors is empty; SHA-256 over the four files in protocolHash's shape prints 1d618f2f6e81f6dcb3b06aba2f9bb525ce50d854d1cf664155f1b75fafde34cd; git ls-files -z | git check-attr -z --stdin dotln-pinned-bytes reports set for exactly the four; prettier --file-info reports ignored true for the four and false for wo107-schema.test.mjs; docs/control/comment-baseline.json has no corpus entry and equals main",
    "docs/evidence/WO-107/decisions.md#wo-107-d010 followup text, read in full: six asks, of which WO-200 discharges the after-base rule for this lane, the classification self-test and the SCHEMA-WO-107.md record",
    "docs/planning/refutations/2026-10-11-planning-fb68306765535a9d-044.json: the WO-200 entry's criterion-2 and criterion-5 known issues and their reopening conditions",
    "docs/control/orders/WO-200.jsonl: VerificationCompleted reportHash sha256:256e9a11… equals the current SHA-256 of docs/verifications/WO-200/VER-001.md"
  ],
  "rejected": [
    {
      "option": "Settle FUP-8f0561e50754114f onto this order",
      "reason": "Three of D010's six asks (archive protocol 1d618f2f… beside wo107-initial-protocol with validateProvenance accepting archived revisions, label the registry self-test base-only, end the comparison with one newline) remain, and each edits the pinned bytes this order declines; a settled row would hide them."
    },
    {
      "option": "Repair VER-001's F1 in this review",
      "reason": "A reviewer never writes a behavioral fix and certifies it; the edit would change the code identity and lose the passing product gate."
    },
    {
      "option": "Take up WO-188 D048's comment-token item as adjacent cleanup",
      "reason": "It changes which comment tokens the scan refuses, with baseline consequences, and is outside the order's declared surfaces; the Boy Scout bound admits host-reviewed low-risk cleanup, not a rule change."
    },
    {
      "option": "NoOp: fail the review",
      "reason": "Every criterion holds and no behavior main had is broken; failing would send a pre-existing gap through repair and verification and leave 36 committed records without a verifiable provenance."
    }
  ],
  "reopenWhen": "An order edits the WO-107 collector modules and the wo107-schema row does not select or does not fail on it, or a planning pass disposes FUP-8f0561e50754114f, FUP-069dff5d52d98e0d, FUP-984094128fe71900 or FUP-2eddaaaa1ea5d3c3 and finds this record's reading of them wrong."
}
```

Goal alignment: traps weighed were deferring to the passing verification instead of rereading the diff and re-running the lane and selections, widening F1 into a reviewer-written repair, settling the carried-in rows on partial discharge, taking the adjacent comment-token item as cleanup, and sizing the PR title by the previous title; each is named above or in the report. The NoOp (fail) is recorded as rejected. Outcome: matched; the criteria were judged from this review's own runs and VER-001's probes at the same identity, the register rows were disposed by what the change did, and the reviewed work is preserved for the commit series.
