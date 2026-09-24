# WO-154 decisions — Evidence editions keyed by behavior and recorded by reference

Dispatch: `resume: next` on 2026-09-24, recorded by the harness before this
procedure loaded. Claude Code 2.1.281 executor, model `claude-opus-5-5[1m]`,
selected effort `xhigh` (`CLAUDE_EFFORT` readback; the effective effort is not
exposed). Authority:
`docs/work-orders/WO-154-evidence-editions-by-reference.md`. Base commit
`75743fd6` (v0.45.0, WO-157), activation checkpoint
`refs/dotln/checkpoint/WO-154/1`.

## WO-154-D001 — Goal alignment, a corrected premise, and the design

```json
{
  "id": "WO-154-D001",
  "date": "2026-09-24",
  "dispatch": "resume: next; WO-154 objective, design and criteria 1-3",
  "decision": "Deliver the order in two parts. (1) By reference: new feedback editions (schema 2) commit the verifier stream with every `{path, contents}` files entry replaced by `{path, blobHash, bytes}` (Git blob identity of the UTF-8 bytes read), rebuilt byte for byte by `feedback-evidence --check` from a hash-matching working-tree file or any Git object with that identity; the two synthesized package projections also name the repository blob they derive from. The live runtime store stays by value, because the verifier's capsule is its only read projection. (2) Behavior key: a schema 2 edition records a behavioral identity over the files the live verifier judged with component release labels normalized, and a pins record over the labelled judged files; staleness and the live-episode requirement follow the behavioral identity plus the regenerated report compared by value apart from its identity fields; a pins-only change keeps the live audit without a re-mint, and `--carry` mints a deterministic edition that names the carried live audit when an edition is wanted. Existing editions keep their bytes and their check path.",
  "goalAlignment": {
    "mission": "Operator flow: every clone, fetch, worktree start and integrating review pays for evidence that restates committed source; every order that bumps a component beside a non-judged source edit pays a live model episode for an unchanged judgment.",
    "criticalPath": "Enabling work, not a critical-path outcome: it removes a recurring per-order cost on the route every later order takes (each close re-mints at least once).",
    "traps": {
      "policyResistance": "The by-reference check and the behavior key are the same guard that exists today (the verifier judged these bytes; nothing else may inherit its verdict), restated with explicit identities; no guard is weakened, so none undoes another.",
      "tragedyOfTheCommons": "Removes shared cost: about 2.1 MB per live edition at today's subject size and one live episode per label-only re-mint.",
      "driftToLowPerformance": "Keeps D010's standard (a judged-source change needs a fresh live audit) and closes a hole the obvious relaxation would open (a policy change hidden inside a compiler bump; see design).",
      "escalation": "Adds no gate and no mandatory re-mint: a pins-only change needs no action, as today. The deterministic carry is available, never required.",
      "successToTheSuccessful": "The declined alternatives are recorded with reasons; the existing Git-history retain path is kept for schema 1 editions rather than extended.",
      "shiftingTheBurden": "Removes the planner's duty to price a live episode into orders whose judged subject changes only by release labels.",
      "ruleBeating": "A forged behavioral identity is refused twice more: the identity must bind the resolved judged files, and each current judged file is compared with what the verifier saw (criterion 3 regression).",
      "seekingTheWrongGoal": "Bytes and episodes are the observed costs; the goal is the unchanged audit guarantee at lower cost, so the check still judges the audit, not the size."
    },
    "naiveInterventionism": "Useful functions kept: immutable editions, the live CLI verifier requirement, the executor/verifier separation, the report-by-value comparison and D010's refusal. Consumers: feedback-evidence --check (gate), the console's pinned self-host case, readers of the edition. Second-order harm: a reader without the Git objects cannot rebuild the bodies (the order's operator-review assumption 1 accepts this). Reversible: schema 2 is additive; a later order can mint by value again. Smallest probe: the census below.",
    "noOp": "Without this order each live edition keeps adding about 2.1 MB (WO-157 revision 002: 2,195,106 bytes across its three files) and label-only re-mints keep paying about 320 s of live episode. Action wins on measured cost; the reopening conditions below would reverse it."
  },
  "evidence": [
    "Premise check, executed 2026-09-24 before any edit: the order's Cost line says the live episode is paid 'for every order whose registered-source change is version pins only (59 editions for 34 orders ... most from component bumps)'. packages/skeleton/src/evidence-editions.mjs `evidenceSourceContent` and `sameEvidenceSourceContent` (since 16ecf2cc, 2026-09-15) already retain the live audit when every registered source is unchanged apart from component release labels, and WO-152 D004 measured that on 2026-09-22 (`feedback-evidence --check` printed 'Retained immutable live feedback audit'); product 07 §Operator-opened planning pass records it. A census over all 81 re-mints (`git log --diff-filter=A` over feedback selfhost-verification.jsonl, each compared with its predecessor across the current registered feedback list under `evidenceSourceContent`) found 0 whose registered-source change was release labels only",
    "Deciding census, executed 2026-09-24: the same 81 re-mints compared by the subject files each edition's verifier actually judged (VerificationOpened.payload.subject.files, report excluded), with release labels normalized: 61 changed a judged file (for example WO-147 revision 001: packages/skeleton/src/worker-store.ts, D010's case), 4 had a byte-identical subject, and 16 differed from their predecessor only in release labels (12 of them since 2026-09-15: WO-067, WO-045 x2, WO-135 r002, WO-139 r001, WO-143 r002, WO-144, WO-145, WO-110, WO-099 r005, WO-150, WO-152). In all 16 the report was identical apart from `subject` and `policyHash`. They were re-minted live because today's retain path needs all ~110 registered sources label-equal, and each of those orders also changed a registered source outside the judged subject (for example WO-150: executor-supports.ts, build.mjs, feedback-evidence.mjs, evidence-sources.mjs)",
    "So the order's saving is real but smaller than its Cost line: about one live episode in five re-mints (12 of 38 in the window since 2026-09-15), not most. The by-reference saving is as stated or larger: WO-157 revision 002's verifier stream is 2,141,113 bytes, of which VerificationOpened is 1,364,809 and CommandPersisted 707,954, nearly all in 101 files entries (52 subject, 49 baseline) and the capsule's copy of the 52 subject entries",
    "Why the behavioral inputs are the judged subject plus the report (the enumeration criterion 2 asks for): the live verifier's verdict is about the files in its capsule (FEEDBACK_SOURCE_PATHS as `readFeedbackSource` projects them, 51 files today) and the report it judged; the regenerated report (policy, ten present/removed fixture runs, context accounting over docs/discovery/environment.json, maturity) executes the whole registered closure, so a registered non-judged source that changes behavior changes the report, which is compared by value. Today's exact path already relies on this: a registered non-judged edit with an unchanged subject and report passes `--check` without a re-mint. Every judged file stays in the identity with only its component release labels normalized; dropping any (worker-store.ts is the D010 example) would let a judged change inherit an older audit",
    "Pins: `feedbackSourceFile` already drops `version` and `license` from the two package projections, so the release labels left in judged files are the `@dotln/*` dependency pins inside `.feedback-source/package-lock.json` and `.feedback-source/packages/skeleton/package.json` and `COMPILER_PACKAGE_VERSION` in packages/compiler/src/artifact-identity.ts; normalization reuses `evidenceSourceContent`, the projection the retain path and the test runner already share",
    "A hole the obvious relaxation opens: `policyHash` embeds `compilerPackageVersion` (packages/compiler/src/feedback.ts, `contents.compilerPackageVersion`), so 'allow policyHash to differ when the compiler label moved' would also admit a compiled-policy change from a non-judged compiler module (normalize.ts, types.ts) that ships with the compiler bump its own edit requires. The check instead compares the audit log's recorded program with the current `personalFeedback()` with only `compilerPackageVersion` and `policyHash` normalized",
    "Where to project: the verifier's capsule is its complete explicit read projection (feedback-selfhost.ts: 'No model filesystem tools'), CommandPersisted carries the capsule, and the kernel log has no hash chain (packages/kernel/src/store.ts `appendEvent`/`decodeLog`), so the recorder projects at `--record-selfhost` and proves the projection rebuilds the store's bytes exactly before writing",
    "Resolution: an economy measurement (D002) resolved 99 of the 101 bodies of WO-157 revision 002 from the object store in one `git cat-file --batch` (6.7 ms); the other two are the synthesized `.feedback-source/` projections, which exist in no tree, hence `derivedFrom`. The judged report entry (docs/evidence/WO-011/feedback.json in the subject) resolves from the edition's own feedback.json by hash. `.gitattributes` defines no filter or eol attribute and core.autocrlf is unset, so the UTF-8 bytes read are the bytes Git stores; the object format is read with `git rev-parse --show-object-format` (sha1 here)"
  ],
  "rejected": [
    {
      "option": "Behavioral identity over every registered feedback source (the list scripts/lib/evidence-sources.mjs keeps)",
      "reason": "It would stale the edition on edits today's exact path admits (a registered non-judged source with an unchanged subject and report) and so demand more live episodes than today; the registered list is the import closure of the edition tooling, not the verifier's subject."
    },
    {
      "option": "The packet's second alternative alone: skip the live episode whenever the regenerated feedback.json differs only in `subject` (D010's comparison)",
      "reason": "WO-147 itself passes that comparison while changing worker-store.ts, a judged file; D010 rejected exactly that inheritance. The comparison is kept as one of three conditions, not the key."
    },
    {
      "option": "Make a deterministic carried re-mint mandatory after every pins-only change",
      "reason": "Today a pins-only change needs no action (WO-152 D004); mandating a re-mint adds an edition, a manifest edit and a console re-pin to nearly every order, the escalation this order exists to remove. The carry stays available and is exercised by the regression."
    },
    {
      "option": "Write references into the live runtime store and resolve them when the host builds the capsule",
      "reason": "It edits verification-host.ts and the recovery comparisons (a registered source of the verification edition too) for no byte saving over projecting at record time."
    },
    {
      "option": "The packets' own declined list (Git LFS or a release asset, in-place compression, retaining only the latest edition outside the tree, a size budget, removing package files from commonSources)",
      "reason": "Recorded in the order's design with reasons: each moves or shrinks the copy, rewrites what an immutable record is, sets a ceiling that never binds, or loses the pins record."
    }
  ],
  "reopenWhen": "A consumer is found that must rebuild edition bodies without the Git objects; a judged-file change is shown to reach the verifier's verdict without changing the regenerated report or a judged file; FEEDBACK_SOURCE_PATHS gains a file whose release label `evidenceSourceContent` does not normalize; or the label-only share of re-mints measured by the census falls to zero under this rule."
}
```

## WO-154-D002 — Economy experiment: how `--check` resolves blob references

```json
{
  "id": "WO-154-D002",
  "kind": "experiment",
  "date": "2026-09-24",
  "dispatch": "resume: next",
  "decision": "Adopt one `git cat-file --batch` process for every reference the working tree cannot supply, after hashing working-tree candidates in process; never one Git process per reference.",
  "question": "A schema 2 edition carries about 100 references. Is resolving them one Git process per reference cheap enough, or does the resolver need a batch?",
  "alternatives": [
    "A: `git cat-file -p <blob>` once per reference",
    "B: one `git cat-file --batch` over all references",
    "C: hash the working-tree file at each reference's path in process and send only the misses to one batch"
  ],
  "observation": "Over the 101 files entries of WO-157 revision 002 (52 subject, 49 baseline), on this machine before any edit: A resolved 99 in 379.7 ms; B resolved 99 in 6.7 ms; C resolved 99 in 6.8 ms with 9 entries falling back to the batch. The two misses in every strategy were `.feedback-source/package-lock.json` and `.feedback-source/packages/skeleton/package.json`, synthesized projections that exist in no tree.",
  "budget": {
    "wallSeconds": 600
  },
  "execution": "run",
  "cost": {
    "wallSeconds": 120,
    "tokens": null,
    "commands": [
      "node <session scratch>/resolve-economy.mjs"
    ],
    "source": "Shell: the probe itself ran 0.43 s real; about two minutes including writing it and recording this entry. Token attribution per command is unavailable."
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": [
      "node scripts/feedback-evidence.mjs --check"
    ],
    "summary": "About 0.37 s saved per `--check` against per-reference processes, which the gate runs at least once per `npm test`; C is kept because the not-yet-committed case needs the working-tree path anyway. The probe also found the two synthesized entries, which set the `derivedFrom` design."
  },
  "outcome": "adopted",
  "regression": false,
  "history": {
    "lastAdoptedImprovementAt": null,
    "experimentsSinceAdoption": null
  },
  "evidence": [
    "docs/evidence/WO-145/decisions.md: trial selection for this support",
    "docs/evidence/WO-157/feedback-002/selfhost-verification.jsonl: the measured subject"
  ],
  "rejected": [
    {
      "option": "A, per-reference processes",
      "reason": "56 times slower for the same result."
    }
  ],
  "reopenWhen": "An edition's reference count grows past a few thousand, or the batch protocol's output shape changes."
}
```

## WO-154-D003 — The receipt-subject group becomes its own patch order

```json
{
  "id": "WO-154-D003",
  "date": "2026-09-24",
  "dispatch": "resume: next; WO-154 design §Second criterion group and criterion 6",
  "decision": "Record the split the order allows: storing each sequenced order by identity and hash in planning refutation receipts is a different seam, so it becomes a patch order of its own and this order delivers the feedback recorder. No receipt, plan-receipts.mjs or plan-subject.mjs byte changes here.",
  "evidence": [
    "scripts/lib/plan-receipts.mjs reads `receipt.subject` by value at 40 sites (git grep -c), among them `criterion(subject, hold)` behind every hold disposition's criterionHash, `isDisposed`, `requireChangedPlanEvidence`, `checkPlanContinuation` and the goal-review evidence path; scripts/lib/entropy-review.mjs, scripts/lib/plan-direct.mjs and scripts/work-orders.mjs read it too. A by-reference subject means hydrating every historical receipt's subject from its revision on each read",
    "scripts/lib/plan-receipts.mjs already rebuilds each receipt's subject with `buildPlanSubject(root, receipt.subject.revision, ...)` and requires equality ('receipt subject does not match committed sources'), so by-reference receipts are feasible, and the receipt digest `receiptHash = sha256(JSON.stringify(payload))` covers the subject, so the shape change is a receipt schema change",
    "REFUTATION-003 ER2-004: the plan check already spends 19.66 s, about 3.9 million statSync calls in plan-subject.mjs; hydration multiplies the subject builds, so that defect's repair and this change interact and belong together",
    "docs/planning/refutations/README.md files receipts as a self-contained pair, the dissenting evidence content-addressed-evidence-inputs lists; relaxing that contract is a planning-surface decision",
    "content-addressed-evidence-inputs operatorReason: 'Priority: the self-host logs (100 of 105 MB) before the refutation receipts (11 MB)'. At this base the self-host logs are 111,065,935 bytes; the receipts' share has not changed shape"
  ],
  "rejected": [
    {
      "option": "Change the receipt subject in this order",
      "reason": "It shares no code with the feedback recorder, changes a separately owned contract and digest, and interacts with the open ER2-004 defect; the order names this split as the alternative."
    }
  ],
  "followup": "Planner: file the receipt-subject group of WO-154 as its own patch order: scripts/lib/plan-receipts.mjs stores each sequenced order by identity and hash, rebuilt from the committed subject at the receipt's revision with the rendered receipt keeping its plain-subject summary; decide it together with ER2-004's plan-subject statSync cost, since hydration multiplies subject builds; existing receipts stay byte-identical and the plan check binds the same subject hash. Priority: medium.",
  "reopenWhen": "The plan check stops rebuilding a receipt's subject from its revision, or the receipts' share of tracked bytes overtakes the self-host logs'."
}
```

The deferred group is `FUP-beb13d8d099d2917` in docs/planning/followups.json.

## WO-154-D004 — The authority edition is not re-minted: it is not stale

```json
{
  "id": "WO-154-D004",
  "date": "2026-09-24",
  "dispatch": "resume: next; WO-154 criterion 7 and non-goal 'the authority edition beyond what the pins record needs'",
  "decision": "Re-mint only the feedback edition. Keep authority at WO-157 revision 002, artifact identity at WO-157 revision 001 and verification at WO-157 revision 001, because each `--check` passes on the final tree. This is a recorded deviation from the letter of criterion 7, which assumed the planned edits to scripts/lib/evidence-sources.mjs would stale the authority edition.",
  "evidence": [
    "The design needs no edit to scripts/lib/evidence-sources.mjs or packages/skeleton/src/evidence-editions.mjs: the recorder's new relative import (./evidence-editions.mjs) is already registered for the feedback family, and `checkEvidenceImports(root, 'feedback')` passes. The only authority-registered sources this order changes are component release labels in package-lock.json and packages/skeleton/package.json",
    "Executed 2026-09-24 after the skeleton bump to 0.39.0 and a rebuild: `node scripts/authority-evidence.mjs --check` exit 0 ('34 bundle comparisons'); `node scripts/artifact-identity-evidence.mjs --check` exit 0; `node scripts/verification-evidence.mjs --check` exit 0; after the console bump (D006) all three pass again inside `npm run test:docs` (21 passed)",
    "docs/evidence/WO-152/decisions.md#wo-152-d004: the precedent for not re-minting an edition whose check passes, because the new record would differ only in labels the tooling normalizes"
  ],
  "rejected": [
    {
      "option": "Re-mint the authority edition anyway to satisfy criterion 7 literally",
      "reason": "It files an edition the check does not need; the non-goal limits the authority edition to what the pins record needs, which is nothing here."
    }
  ],
  "reopenWhen": "Any authority, artifact-identity or verification `--check` fails on this branch or on the integrated tree at final review."
}
```

Correction, 2026-09-24 (repair): the reopening condition held. The VER-001
repair (D011) edits compiler sources that these three editions register, and
all three `--check` runs failed. They are re-minted as WO-154 revision 001
(D013). The reasoning above stays correct for the implementation pass it
judged.

## WO-154-D005 — Release assignment: v0.46.0, skeleton 0.39.0

```json
{
  "id": "WO-154-D005",
  "date": "2026-09-24",
  "dispatch": "resume: next; WO-154 heading 'version assigned at activation' and §Release classification",
  "decision": "Assign application `v0.46.0` under the declared minor classification and move `@dotln/skeleton` from 0.38.0 to 0.39.0 (minor: new exports and a new edition schema), with the console's exact pin and both lockfile locations following. `@dotln/console` moves 0.1.10 to 0.1.11 under D006, because its src changed. Compiler and kernel versions are unchanged.",
  "evidence": [
    "`npm run release -- list`: the latest local tag is `v0.45.0` (WO-157); `release prepare --local` refused the placeholder heading, and scripts/lib/plan-continuation.mjs admits replacing '(version assigned at activation)' with a strict version as an authorized execution amendment (WO-152 D005 did the same)",
    "The worktree at ../DotLn-wo153 records WO-153 active in verification with target `v0.45.1` (patch) and no component bump; a minor above `v0.45.0` does not collide, and final review retimes under the existing classification if main moves",
    "`npm run release -- check-surfaces --local` before the bump: 'FAIL component-version @dotln/skeleton: src changed; observed 0.38.0 ... expected a different version'; compiler, console and kernel 'src unchanged ... no bump required'; after the bump every row passes",
    "`npm run release -- prepare --local` after the heading, README release block and roadmap note: 'WO-154 target v0.46.0 remains current; no files changed'"
  ],
  "rejected": [
    {
      "option": "Bump the console because its self-host fixture is re-pinned",
      "reason": "check-surfaces classifies fixtures and an exact dependency pin as no src change; the console's bump comes from D006's src change instead."
    }
  ],
  "reopenWhen": "Main publishes `v0.46.0`, a skeleton 0.39.0 or a console 0.1.11 before this order closes."
}
```

Correction, 2026-09-24: this entry first recorded the console as unchanged,
which was true when the skeleton bump was made. D006 then changed the
console's src, `check-surfaces` required its bump, and the console moved to
0.1.11; the decision, rejected option and reopening condition above were
amended the same day to match.

Correction, 2026-09-24 (repair): "Compiler and kernel versions are unchanged"
no longer holds. The VER-001 repair (D011) changes compiler src, and
`@dotln/compiler` moves 0.17.0 to 0.18.0 (minor: the new `isCompilerRelease`
export, and assertions that admit a recorded release). `COMPILER_PACKAGE_VERSION`,
both lockfile locations and the skeleton's and console's exact pins follow.
`check-surfaces --local` passes every row. The application stays `v0.46.0`.

## WO-154-D006 — The console rebuilds a schema 2 stream before projecting it

```json
{
  "id": "WO-154-D006",
  "date": "2026-09-24",
  "dispatch": "resume: next; WO-154 criterion 4 (the console's pinned self-host case is re-pinned); Adjacent Repair",
  "decision": "Give readers of committed self-host streams one owner: `feedbackEditionLog` in the new, unjudged packages/skeleton/src/feedback-edition-log.ts follows an edition record's live-audit references (a carried edition keeps its logs in another directory) and rebuilds the verifier stream with the recorder's resolver. The console's collector and the WO-047 scenario test read through it; the console's fixture loader and WO-032 board case rebuild their pinned stream with `editionStream`; `console-fixtures --record-current-selfhost` pins the live audit's paths. Bump `@dotln/console` 0.1.10 to 0.1.11 (patch: collect.ts is not re-exported from the package index).",
  "evidence": [
    "Diagnosed 2026-09-24 before re-pinning, on a fake-transport self-host store projected by reference: `projectAuditLog` accepted the by-reference stream but `projectWorkerStatus` threw 'verification contract: repository file' (packages/compiler/src/verification.ts validates each subject file with exact fields path, contents, mode), so the re-pinned self-host verifier would have rendered as unavailable",
    "After the fix: `node scripts/console-fixtures.mjs --record-current-selfhost` then `--check`: wo009, selfhost, control, refutations and missing all match; the re-pinned selfhost.json and selfhost.txt keep the same count of 'unavailable' fields as before (20 and 21) and both self-host stores are 'available'; the diff is the new episode's labels, timestamps, hashes and event ids",
    "`node --test packages/console/dist/test/*.test.js`: 21 passed, 0 failed, after the WO-032 AC2 case was changed to rebuild the pinned stream (it had failed with 'unavailable' against the by-reference bytes)",
    "`npm run release -- check-surfaces --local`: 'FAIL component-version @dotln/console: src changed' until the bump; passes after",
    "The first `npm test -- --review` (16:25:15Z to 16:30:10Z, 294.32 s) failed one suite: skeleton's 'WO-047 complete Decision bytes match across stored skeleton streams', subtest 'feedback verifier', with the same 'verification contract: repository file', because it replays the current edition's committed stream; after routing it through `feedbackEditionLog` the file passes 31 of 31 (the verifier stream replays 139 complete decisions)",
    "The reader lives outside FEEDBACK_SOURCE_PATHS, so adding it leaves the recorded live audit current; packages/skeleton/src/feedback-selfhost.ts, which is judged, is unchanged since the recording"
  ],
  "rejected": [
    {
      "option": "Relax the verification contract's file shape so projections accept references",
      "reason": "That contract validates what a verifier is given; weakening it to read evidence would change runtime validation for every verification stream."
    },
    {
      "option": "Leave the console reading the committed bytes",
      "reason": "The pinned self-host verifier would render as unavailable, a regression this order causes."
    }
  ],
  "reopenWhen": "Another consumer of docs/evidence feedback streams projects them through the verification contract without rebuilding them first."
}
```

## WO-154-D007 — A pins snapshot keeps a pins-only change from stranding a reference

```json
{
  "id": "WO-154-D007",
  "date": "2026-09-24",
  "dispatch": "resume: next; WO-154 criteria 1 and 2; a defect this order's first recording met",
  "decision": "`--record-selfhost` (and a new `--pins` mode for an existing edition) writes `<edition>/pins/<blobHash>`: the raw bytes behind every judged file that carries a component release label (the repository blob each `.feedback-source/` projection derives from, and packages/compiler/src/artifact-identity.ts), and stores each with `git hash-object -w`. Committed with the edition, the snapshot makes those blobs reachable whatever later commits do to the files; the object write covers the window before the first commit. Revision 001 was repaired in place: the recorded lockfile was rebuilt and accepted only because it hashed to the recorded identity.",
  "evidence": [
    "Observed 2026-09-24: revision 001 was recorded at 16:11Z; the console fix (D006) then required bumping the console, which rewrote package-lock.json; `--check` failed 'feedback evidence is stale: unresolvable edition reference: .feedback-source/package-lock.json', because the lockfile blob the projection names (9150fe7b...) had never been committed, staged or stashed. The judged projection itself was unchanged (it drops workspace versions)",
    "The same stranding follows from final review: scripts/lib/worktree-integration.mjs stashes the uncommitted work, merges main and re-applies it, so a main that moved a dependency pin kept by the projection (a component bump changes the console's `@dotln/skeleton` pin in the lockfile) leaves the recorded lockfile blob in no commit once the stash is dropped; main keeps merge commits (75743fd6 has two parents), so a snapshot committed with the edition stays reachable",
    "Repair: the recorded lockfile is today's lockfile with the console's version at 0.1.10; `git hash-object` of that reconstruction printed 9150fe7ba95fd6dbcebbd2359095200ba3366db0, the recorded `derivedFrom.blobHash`, so the bytes are the recorded ones; `git hash-object -w` stored them and `node scripts/feedback-evidence.mjs --pins` wrote three snapshot files (14,901 + 673 + 2,556 bytes), each hashing to its name; `--check` then printed 'Live feedback audit docs/evidence/WO-154/feedback-001 judged the current source.'",
    "The resolver in packages/skeleton/src/feedback-selfhost.ts is judged by the live audit; putting the snapshot among its candidates would change a judged file after the one authorized live episode, so the snapshot reaches it through the object store instead"
  ],
  "rejected": [
    {
      "option": "Treat an unresolvable reference as the designed outcome and re-record live",
      "reason": "It pays a live episode for a pins-only change, which is the cost this order removes."
    },
    {
      "option": "Keep the pin-bearing entries by value in the verifier stream",
      "reason": "Criterion 1 makes every files entry a reference, and the bodies would appear twice again (opening and capsule)."
    },
    {
      "option": "Change the resolver now and run a second live episode",
      "reason": "Activation authorized one live episode (operator-review assumption 2), and the object-store path gives the same durability."
    }
  ],
  "followup": "Executor of the next order that changes packages/skeleton/src/feedback-selfhost.ts and pays a live feedback self-host episode anyway: add the edition's `pins/` files to `editionBodies`' candidates in `checkFeedbackEdition`, so the snapshot resolves as a working-tree file and `--record-selfhost` no longer needs `git hash-object -w`. Priority: low.",
  "reopenWhen": "A committed schema 2 edition fails `--check` with an unresolvable pin-bearing reference, or a judged file gains a release label outside the snapshot's two kinds."
}
```

The deferred resolver change is `FUP-0c86ada82f559914` in docs/planning/followups.json.

Correction, 2026-09-24 (repair): the follow-up is done in this order under
the operator's authorization (D011). `liveAuditCandidates` gives the resolver
the live audit's `pins/` files, and recording no longer writes objects. The
FUP is allocated to WO-154.

## WO-154-D008 — The re-mint: one live episode, and why each edition changed

```json
{
  "id": "WO-154-D008",
  "date": "2026-09-24",
  "dispatch": "resume: next; WO-154 criterion 7 and operator-review assumption 2",
  "decision": "Select feedback WO-154 revision 001 in docs/evidence/current.json and record it from one live self-host episode on `claude-cli-print` with `claude-sonnet-5` at `xhigh` (the WO-157 D023 selection), after the last judged-file edit; keep the other three editions (D004).",
  "evidence": [
    "Why feedback changed: packages/skeleton/src/feedback-selfhost.ts is a judged file (FEEDBACK_SOURCE_PATHS) and this order edits it beyond any release label, so both the old rule and D001's key require a fresh live audit. The regenerated feedback.json differs from WO-157 revision 002 in exactly one field, `subject` (sha256:a20f72f2... to sha256:b28424ee...); policyHash, fixtures, context and maturity are identical",
    "Order of work: build; the skeleton bump (D005); `authority`, `artifact-identity` and `verification` `--check` all exit 0; `node scripts/feedback-evidence.mjs --write` (1192 fewer instruction bytes); then `DOTLN_LIVE_WORKERS=1 npm run dotln --silent -- feedback-audit --store .runtime/feedback-audit-wo154-r001 --transport claude-cli-print --model claude-sonnet-5 --effort xhigh` from 16:08:27Z to 16:10:41Z: complete on the first attempt, ten fixtures, 1,192 saved instruction bytes, verifier claude-cli-print; 134.33 s real",
    "Episode record: WorkerAttemptStarted to WorkerCompleted 130,122 ms, harness 2.1.281, host-launch selection claude-sonnet-5 / xhigh (effective values unknown); usage row (claude-result-envelope, docs/control/local/process/usage.jsonl): 133,176 ms, 668,112 tokens (13,972 output), USD 1.5389838. WO-157's re-mint took two attempts, 313,450 ms and USD 3.2996838",
    "The verifier's summary: 'Both criteria pass. All 10 units in loadouts/feedback.ts match the 10 present/removed captures in feedback.json ... AC-context arithmetic (2823-1631=1192 bytes) checks out'",
    "`node scripts/feedback-evidence.mjs --record-selfhost .runtime/feedback-audit-wo154-r001`: 'Recorded ... by reference (104029 of 2177908 bytes)'; `--check`: 'Live feedback audit docs/evidence/WO-154/feedback-001 judged the current source.'"
  ],
  "rejected": [
    {
      "option": "Effort max",
      "reason": "WO-100's max attempt reached the transport's 600 s deadline (WO-157 D023); xhigh completed there and here."
    }
  ],
  "reopenWhen": "A judged file changes on this branch after the recording (a new revision is then owed), or final review's integration moves a judged file beyond its release labels."
}
```

## WO-154-D009 — Bytes before and after, and the live-episode rule

```json
{
  "id": "WO-154-D009",
  "date": "2026-09-24",
  "dispatch": "resume: next; WO-154 criterion 5",
  "decision": "Record the measured sizes and the rule change: a schema 2 feedback edition is 177,857 bytes against 2,231,901 for the same live episode by value (92.0% smaller) and against the order's 1.26 MB planning figure (14%); a live episode is owed only when a judged file changes beyond its release labels or the regenerated report changes.",
  "evidence": [
    "`find docs/evidence/WO-154/feedback-001 -type f | xargs wc -c`: edition.json 1,705; feedback.json 17,555; selfhost-audit.jsonl 36,438; selfhost-verification.jsonl 104,029; pins 14,901 + 673 + 2,556; total 177,857",
    "`wc -c .runtime/feedback-audit-wo154-r001/verifier/events.jsonl`: 2,177,908, the stream the edition would have committed by value; with the same feedback.json and audit stream that is 2,231,901",
    "By record type in the committed stream: WorkerHeartbeat 47,892 (129 events), VerificationOpened 30,170, CommandPersisted 20,472; every other type under 1.5 KB",
    "Before, at base 75743fd6: `git ls-tree -r -l HEAD docs/evidence` over feedback*/{feedback.json,selfhost-audit.jsonl,selfhost-verification.jsonl}: 84 editions, 259 files, 114,386,847 bytes, a mean of 1,361,748 per edition; the latest, WO-157 revision 002, is 2,195,106 (its stream 2,141,113); tracked repository 195,571,740 bytes (`git ls-files -z | xargs -0 wc -c`)",
    "Live-episode rule: before, `--check` retained a live audit only when every registered feedback source (about 110 files) was unchanged apart from release labels; after, for schema 2 editions, the behavioral identity over the 51 judged files with labels normalized plus the report compared apart from `subject` and `policyHash` (and the recorded program apart from its compiler label). The census in D001 finds 16 of 81 historical re-mints (12 of the 38 since 2026-09-15) that this rule would have kept without a live episode",
    "Gate: `--check` time unchanged (2.36 s on the schema 2 edition against 2.39 s on WO-157 revision 002 before any edit); resolution itself 13 ms"
  ],
  "rejected": [],
  "reopenWhen": "A later schema 2 edition exceeds about 250 KB, or the heartbeat share grows to dominate it (the next reduction would be heartbeat compaction, outside this order)."
}
```

## WO-154-D010 — VER-001: rebuilt compiler labels prevent audit retention

```json
{
  "id": "WO-154-D010",
  "date": "2026-09-24",
  "dispatch": "resume: verify",
  "decision": "Record VER-001-F1 as a major failure of criterion 2 and route the order to repair. The schema 2 check and carry reject an older live audit after a compiler release-label change is built, even though the behavioral identity is unchanged. The verifier changes no implementation or immutable edition.",
  "evidence": [
    "Independent fixture fetched only refs/dotln/checkpoint/WO-154/3 and its ancestors into a new repository with no object alternates; its packages, scripts, manifests and WO-154 evidence matched the working subject byte for byte. Baseline build and feedback-evidence --check passed, and its references rebuilt the actual 2,177,908-byte live verifier stream exactly",
    "Minimal reproduction: change only COMPILER_PACKAGE_VERSION from 0.17.0 to 0.17.1 in packages/compiler/src/artifact-identity.ts. Before rebuilding, feedback-evidence --check exits 0 and prints Retained live feedback audit. After node scripts/build.mjs exits 0, both --check and --carry docs/evidence/WO-154/feedback-001 --edition WO-998 --revision 001 exit 1 with feedback contract: compiled policy drift. A new process importing the rebuilt modules reports behaviorUnchanged true and pinsChanged true",
    "A broader probe that moved compiler and skeleton manifest/lock labels and rebuilt also failed with the same error; the minimal reproduction isolates the compiler label",
    "packages/skeleton/src/feedback-selfhost.ts:819 replays the historical audit through the current seiriReactor before its labels comparison at 828. reactor.ts:2546 calls assertCompiledFeedback, which recompiles the recorded units with the current COMPILER_PACKAGE_VERSION (packages/compiler/src/feedback.ts:198,217) and rejects the historical version before feedbackPolicyBehavior can compare normalized policies",
    "scripts/test-evidence-sources.mjs:328-334 changes the compiler source label and immediately checks using the pre-existing dist tree. Its pins fixture therefore omits the rebuilding step that exposes this failure",
    "docs/verifications/WO-154/VER-001.md contains the reproduction, acceptance matrix and independent check results"
  ],
  "goalAlignment": {
    "missionAndCriticalPath": "The order removes recurring evidence storage and live-audit cost on the route to independently verified runtime work. A rebuilt pins-only change must retain its audit for that removal to hold.",
    "traps": "Policy resistance and rule beating are material: current replay validation defeats the new label-normalized comparison, while the fixture passes without exercising the rebuilt compiler. Drift to low performance and seeking the wrong goal favor the acceptance behavior over green test counts. Commons and escalation favor one product gate plus bounded isolated probes, without another live episode. Success to the successful does not privilege the new schema over historical validation. Shifting the burden favors repairing the recurring release failure rather than requiring operator rescue.",
    "naiveInterventionism": "Keep historical evidence, runtime validation and source work intact. The smallest useful probe changes one compiler label in a disposable repository and compares before and after build. Repair must preserve behavioral and policy-change refusals.",
    "noOp": "Passing the order would leave a demonstrated failure of its promised pins-only path. Recording a repair finding is warranted; additional unrelated tests or implementation edits by this verifier would not improve independence."
  },
  "rejected": [
    {
      "option": "Pass because npm test and the existing source-only pin fixture are green",
      "reason": "They do not establish retained-audit behavior with the newly built compiler. The independent reproduction fails precisely that required case."
    },
    {
      "option": "Change the replay implementation during verification",
      "reason": "The verifier must judge the implementation independently; the repair belongs to the executor."
    }
  ],
  "followup": "WO-154 executor on resume: fix: resolve VER-001-F1 so a rebuilt compiler release-label-only change can check and deterministically carry the historical live audit without a new episode. Exercise the current compiler and all replay layers reached by that path, preserve refusal of real judged-source and compiled-policy changes, and add a regression that rebuilds after changing labels. Priority: high.",
  "reopenWhen": "Independent execution with rebuilt compiler labels passes --check and --carry without a new live episode, while real behavior and policy changes still fail."
}
```

## WO-154-D011 — VER-001-F1 repair: a compiler release is recorded metadata at every replay layer

```json
{
  "id": "WO-154-D011",
  "date": "2026-09-24",
  "dispatch": "resume: fix; VER-001-F1 and D010's follow-up; the operator's authorization during the repair of one more live feedback self-host episode and of folding in FUP-0c86ada82f559914 (answered in chat, 2026-09-24)",
  "decision": "Repair F1 at the layer that fails: the compiler's `assertCompiledFeedback` and `assertVerificationTask` compare a recorded program or capsule with this compiler's lowering at the release label it records (a new `isCompilerRelease` checks the label's shape); the verification slice adopts a persisted command whose capsule differs from the dispatched one only in that label, rebuilding its continuation from it; `feedback-evidence --check` names the deterministic `--carry` when a compiler release moved `policyHash`, because the console binds the edition's report to the current compiled policy. Fold in FUP-0c86ada82f559914. Bump `@dotln/compiler` 0.17.0 to 0.18.0 (minor: a new export and a wider admission). Re-mint feedback as WO-154 revision 002 with the one authorized live episode after the last judged-file edit, and deterministically re-mint each other edition the repair stales. The order text gains 'Operator authorization — 2026-09-24' and criterion 8, bound by `plan amend-order`.",
  "goalAlignment": {
    "missionAndCriticalPath": "Criterion 2's promise, that a pins-only change costs no live episode, fails at the first compiler bump without this repair. Compiler bumps are routine under opt-out release assignment. Enabling work on the route every later order takes.",
    "traps": {
      "policyResistance": "Every replay layer recompiled at the current label, so a label-normalized comparison in one layer was undone by the next. The repair moves the label to the record at each layer; nothing else is relaxed.",
      "tragedyOfTheCommons": "Removes a shared cost: after this, a compiler bump no longer forces a live re-mint (USD 1.5-3.3 and 130-320 s each), a deterministic verification re-mint, or an 'unavailable' console.",
      "driftToLowPerformance": "The check still refuses a judged-file change and any compiled difference apart from the label (probe 4 below, and the regressions).",
      "escalation": "No new gate. The one new `--check` failure replaces a silent console degradation and a failing console suite with a named remedy that needs no live episode; skeleton and console label bumps still need no action.",
      "successToTheSuccessful": "Schema 1 editions keep their exact path; the admission is the same for every stream, not special to evidence.",
      "shiftingTheBurden": "The executor of a compiler bump runs one deterministic command instead of paying a live episode or asking the operator.",
      "ruleBeating": "The regression rebuilds the compiler, which is where the previous fixture passed without exercising the failure. It also checks the replay test the gate runs, not only the evidence script.",
      "seekingTheWrongGoal": "The goal is the unchanged audit guarantee across releases, measured by replaying the recorded streams under a rebuilt compiler, not by the checker's exit code alone."
    },
    "naiveInterventionism": "Kept: the reactors' drift refusals (everything but the label), live runtime paths (a live host persists exactly what it dispatched, so the adoption branch is inert there), immutable editions and revision 001. Consumers: the feedback and verification slices, the verification protocol's request check, the harness lowering and every caller of the two assertions. Second-order effect: a program recorded under an older release now replays anywhere, which also lets the verification edition survive compiler bumps. Reversible: the assertions can return to the current label. Smallest probe: the disposable copy below.",
    "noOp": "Leaving F1 means every compiler bump still pays a live episode. The order's promised saving would hold only for bumps that leave the compiler alone, and the order fails verification."
  },
  "evidence": [
    "Reproduced 2026-09-24 in a disposable shared clone of the worktree with its own node_modules/@dotln links (the gate fixture's symlinked node_modules resolves @dotln/compiler to the source checkout, so rebuilding a copy never reached the copy's compiler; this is why the earlier fixture missed F1). Built, then changed only COMPILER_PACKAGE_VERSION 0.17.0 to 0.17.1: --check before build exit 0 'Retained'; after node scripts/build.mjs: feedback --check and --carry exit 1 'feedback contract: compiled policy drift' (VER-001-F1). More layers than the report named: the WO-047 stored-stream replay failed 4 of 7 subtests, 'verification' and 'feedback verifier' with 'verification state: persisted compilation drift' and 'feedback audit' with 'compiled policy drift'; console tests failed 5 of 21 and console-fixtures --check failed",
    "Causes, by reading: reactor.ts feedback slice calls assertCompiledFeedback at opening and on every later event, and compileFeedbackAudit asserts again; compileFeedbackUnits embeds COMPILER_PACKAGE_VERSION in the program and its policyHash. The verification slice's dispatch compiles the capsule at the current label and CommandPersisted requires the persisted command to equal it; WorkerAttemptStarted and result admission bind the capsule's inputHash, which covers the label. projectAcceptanceEvidenceMatrices replays the verifier stream through that slice, so --check reaches it right after the audit replay. The console's compiled-mechanisms section requires the edition's feedback.json policyHash to equal compileFeedbackUnits(units).policyHash (packages/console/src/builds.ts)",
    "The schema 1 retain path never replayed (base scripts/feedback-evidence.mjs `preserved` branch asserted only the report apart from identity fields), so F1 is this order's; git log -G COMPILER_PACKAGE_VERSION shows every earlier compiler bump re-minted the editions in the same order, so the verification-replay failure never surfaced",
    "Prototype in the copy with this decision's compiler and reactor edits and the check rule: after the label bump and rebuild, WO-047 replay 7 of 7 using the 0.17.0-recorded WO-154 revision 001 and WO-157 verification streams. To exercise check and carry without a paid episode, the copy only let validateSelfhostEdition accept the fake transport and recorded a fake-transport edition under compiler 0.18.0 (WO-996); then compiler 0.18.1 in source, manifest and lock, rebuilt: --check exit 1 'a compiler release moved the policy hash since docs/evidence/WO-996/feedback-001 ... carry its live audit'; --carry exit 0 writing only edition.json and feedback.json; with it selected, --check 'Carried live feedback audit'; WO-047 replay 7 of 7; console-fixtures --record-current-selfhost and --write, then console tests 21 of 21 with the self-host fixture's 20 'unavailable' fields unchanged. A skeleton-only bump (0.39.0 to 0.39.1 in manifest, lock and the console pin) after rebuild: --check 'Carried ... component release labels moved since', no action. A worker-store.ts edit after rebuild: --check and --carry both 'judged behavior changed since ... (packages/skeleton/src/worker-store.ts)'",
    "Why the label goes to the record rather than a relabeled log: rewriting a recorded stream to the current label would rewrite policyHash, capsule inputHash and the command and result payloads that bind them, which amounts to forging a replayable history; comparing at the recorded label keeps the stream's bytes and still requires every other field to be this compiler's lowering",
    "Every file the fix edits is judged (packages/compiler/src/feedback.ts, packages/compiler/src/verification.ts, packages/skeleton/src/reactor.ts are in FEEDBACK_SOURCE_PATHS), so no correct repair avoids a new live episode; operator-review assumption 2 authorized one, spent by D008; the operator authorized one more and FUP-0c86ada82f559914, whose only deferral reason (D007) was the second episode",
    "D002 is this order's economy experiment; no second experiment is started in the repair"
  ],
  "rejected": [
    {
      "option": "Relabel the recorded streams to the current compiler before replaying them",
      "reason": "Rewrites hashes and payloads the stream binds, and a replay that passes only after rewriting no longer shows what was recorded."
    },
    {
      "option": "Skip replay for a label-only change, as the schema 1 retain path did",
      "reason": "The schema 2 check does not rely on Git history, so skipping replay would let a never-replayed audit log pass. It also leaves the gate's stored-stream replay and the console failing."
    },
    {
      "option": "Add a replay-only flag to the reactors and keep the assertions strict elsewhere",
      "reason": "compileFeedbackAudit, evaluateFeedback and feedbackMaturity assert again inside the same replay, so a flag would have to reach the compiler anyway. Two admission rules for one program would also let a replayed state differ from a live one."
    },
    {
      "option": "Have the console accept a maturity report whose policyHash differs from the current compile",
      "reason": "The report carries no compiler label, so the console could not tell a release move from a policy change without reading the audit log. The deterministic carry gives it a report that matches exactly."
    },
    {
      "option": "Make every pins-only change owe a carry",
      "reason": "D001's rejection still holds for component labels that leave policyHash unchanged, the common case, since no consumer binds them."
    },
    {
      "option": "Board up F1 as a follow-up (the alternative offered to the operator)",
      "reason": "The operator authorized the repair; boarding up would leave criterion 2 failing."
    }
  ],
  "reopenWhen": "A recorded program or capsule is shown to change behavior through a field outside the compiler release label that this comparison admits; a consumer is found that binds an edition's report identity other than policyHash; or a compiler bump after this order still needs a live episode for an unchanged judged behavior."
}
```

## WO-154-D012 — The merged WO-153 is integrated at final review

```json
{
  "id": "WO-154-D012",
  "date": "2026-09-24",
  "dispatch": "resume: fix; the operator's note that the parallel order merged, with integration now or at final review left to the executor",
  "decision": "Leave integrating main to final review, as product 07 §Independent workflows and integration assigns it. The executor makes no branch commit, and integrating now would save no live episode.",
  "evidence": [
    "`git log 75743fd6..main`: WO-153 (v0.45.1) merged as 24aa7237, with skeleton 0.38.1 and re-minted authority and feedback editions; 42 files changed",
    "Judged files changed on main, by FEEDBACK_SOURCE_PATHS: package-lock.json and packages/skeleton/package.json, and only the skeleton release label and the console's pin on it (`git diff 75743fd6 main`). This branch moves the same labels to 0.39.0. The integrated tree therefore differs from the live audit only in labels, which this order's rule retains without a live episode",
    "Main's other code changes (scripts/resume.mjs, packages/skeleton/src/harness-host.ts, harness surfaces) are not judged; v0.46.0 stays above main's v0.45.1"
  ],
  "rejected": [
    {
      "option": "Merge main into the branch now",
      "reason": "It is a branch commit before final review, and it changes no live-episode need."
    }
  ],
  "reopenWhen": "Main gains a judged-file change beyond release labels before final review; the re-mint then owes a fresh live episode at integration."
}
```

## WO-154-D013 — Re-mint after the repair: one live episode, and why each edition changed

```json
{
  "id": "WO-154-D013",
  "date": "2026-09-24",
  "dispatch": "resume: fix; D011 and the operator's authorization of one more live feedback self-host episode",
  "decision": "Select feedback WO-154 revision 002 and authority, artifact identity and verification WO-154 revision 001 in docs/evidence/current.json. Record feedback from one live self-host episode on `claude-cli-print` with `claude-sonnet-5` at `xhigh` after the last judged-file edit. Re-mint the other three deterministically, because the repair edits compiler sources they register. Revision 001 of feedback stays on disk as the record VER-001 judged.",
  "evidence": [
    "Order of work: judged-file edits and the compiler bump; npm run build; harness emit and check --loadout contributor (31 surfaces); harness-context --check (every role within its ceiling); current.json repointed; authority, artifact-identity and verification --write then --check (each passes); release check-surfaces --local (0 FAIL); feedback --write for revision 002; the live episode; --record-selfhost; --check 'Live feedback audit docs/evidence/WO-154/feedback-002 judged the current source.'",
    "Live episode: `DOTLN_LIVE_WORKERS=1 npm run dotln --silent -- feedback-audit --store .runtime/feedback-audit-wo154-r002 --transport claude-cli-print --model claude-sonnet-5 --effort xhigh`, 2026-09-24T17:35:07Z to 17:37:50Z, exit 0 on the first attempt, 163 s wall-clock including the build; ten fixtures, 1,192 saved instruction bytes, verifier claude-cli-print. Effective model and effort are unknown; the store records the host-launch selection",
    "Why each edition changed. Feedback: judged files changed beyond release labels (packages/compiler/src/feedback.ts, packages/compiler/src/verification.ts, packages/skeleton/src/reactor.ts, packages/skeleton/src/feedback-selfhost.ts), so a live audit was owed; revision 002's feedback.json differs from revision 001's only in policyHash (compiler 0.18.0) and subject. Authority, artifact identity and verification: each file of each new edition equals its WO-157 predecessor once 0.17.0/0.18.0 and hashes are normalized, apart from bundle-diff.json's revision label; stale-status.txt is byte-identical",
    "Bytes: `wc -c` over docs/evidence/WO-154/feedback-002: edition.json 1,705; feedback.json 17,555; selfhost-audit.jsonl 36,438; selfhost-verification.jsonl 115,186 (of 2,196,293 by value); pins 14,901 + 673 + 2,556; total 189,014 against 2,250,286 by value (91.6% smaller). The verifier stream is larger than revision 001's 104,029 because this episode recorded more heartbeats"
  ],
  "rejected": [
    {
      "option": "Overwrite revision 001",
      "reason": "Editions are immutable, and VER-001 judged revision 001."
    }
  ],
  "reopenWhen": "A judged file changes on this branch after revision 002, or final review's integration moves a judged file beyond its release labels."
}
```

## WO-154-D014 — WO-154 is the compatibility scope WO-050 D002 reserved

```json
{
  "id": "WO-154-D014",
  "date": "2026-09-24",
  "dispatch": "resume: fix; the operator's confirmation that WO-154 makes the decision to accept recordings made by an older compiler release when nothing but the release differs",
  "decision": "D011's admission is the compatibility decision WO-050 D002 reserved, and the operator confirmed WO-154 makes it. WO-050's byte oracle keeps packages/skeleton/fixtures/wo050-identity.json byte-exact. A successor, wo154-identity.json, names it by sha256 and records every row it changes or removes with its reason, and `reactor-identity.mjs --check` enforces that chain. WO-010, WO-011's verifier and WO-011's audit keep full byte identity with new observations: complete replays instead of frozen refusals. WO-011's self-host verifier leaves the byte oracle, because its full replay costs about 100 s per gate, and a skeleton test asserts it replays to complete. The oracle's digest is streamed a member at a time, reproducing the same bytes, because that full replay is longer than the longest string the runtime builds.",
  "reopens": {
    "decisionId": "WO-050-D002",
    "observation": "Its reopening condition held: obsolete compiled artifact replay received its own scope in WO-154 (D011, bound by plan amend-order and confirmed by the operator). Under the oracle's pinned compiler identity 0.11.1 and under the current 0.18.0, the four streams it froze as refusals replay with zero refusals. WO-010 (recorded under 0.5.0) and WO-011's verifier (0.6.0) each reach complete after 31 decisions, WO-011's audit (0.6.0) reaches its result after 5, and WO-011's self-host verifier (0.6.0) reaches complete after 1,600."
  },
  "evidence": [
    "`node scripts/reactor-identity.mjs --check` failed after D011 on docs/evidence/WO-010/events.jsonl ('full observation length', 1,259,112 against the frozen 53,655); the manifest froze its refusal at evt_5, 'verification state: persisted compilation drift', and WO-050 D002 rejected 'successful old WO-010/011 replay' because 'the old compiled-artifact logs already refuse today'",
    "All 19 rows observed under the 0.11.1 loader with the streamed digest: the 15 rows the change does not touch reproduce their frozen bytes and sha256 exactly, which is the evidence that the streamed digest equals the old single-string digest; the 4 historical rows changed as the reopening observation states",
    "Cost: WO-011's self-host verifier is 1,600 events, 1,578 of them heartbeats; replay takes 123 ms, stringifying the decisions 1,174 ms, and the prefix projections 99,181 ms (quadratic); `--check` with the 18 remaining rows takes 1.7 s",
    "Chain enforcement: in negative controls, an unexplained change to a kept row and a missing reason for a changed row each fail `--check` ('changes exactly when a reason names it'); the manifest was restored byte-identical afterwards",
    "packages/skeleton/test/verification.test.ts replays WO-010, WO-011's verifier and WO-011's self-host verifier to complete with every row verified, and replays the WO-157 verification edition (0.17.0) to its recorded matrix"
  ],
  "rejected": [
    {
      "option": "Rewrite wo050-identity.json",
      "reason": "A historical oracle keeps its bytes. Each authorized change gets a successor chained by hash (WO-157 D022)."
    },
    {
      "option": "Keep WO-011's self-host verifier in the byte oracle",
      "reason": "About 100 s on every gate for a stream whose only frozen identity was a refusal; its replay is asserted in 0.1 s instead."
    },
    {
      "option": "Revert D011 to keep the frozen refusals",
      "reason": "A test oracle is not a reason to keep a defect; the operator confirmed the compatibility decision."
    }
  ],
  "reopenWhen": "A replay admitted by the recorded release is shown to differ in behavior from its recording, or the oracle's remaining cases stop reproducing through the streamed digest."
}
```

## WO-154-D015 — WO-133 D004's rejected option is now the contract

```json
{
  "id": "WO-154-D015",
  "date": "2026-09-24",
  "dispatch": "resume: fix; D014",
  "decision": "Record that production validation now accepts a program or capsule recorded under another compiler release when everything else is the current lowering. WO-133 D004 rejected that pending separate scope, and D011 and D014 give it that scope. D004's other choices stand: compiler purity, the isolated historical loader and current inputs for current-behavior tests.",
  "reopens": {
    "decisionId": "WO-133-D004",
    "observation": "Its reopening condition 'obsolete artifact compatibility receives separate scope' held in WO-154 (D011, D014). assertCompiledFeedback and assertVerificationTask compare at the recorded release, and the frozen oracle has a successor chained by hash rather than being regenerated. The compiler stays pure: purity.test passes among the compiler's 114 tests."
  },
  "evidence": [
    "`node --test packages/compiler/dist/test/*.test.js`: 114 passed, 0 failed, including purity.test and the two WO-154 admission tests",
    "scripts/fixtures/historical-compiler-loader.mjs is unchanged; the oracle still runs under compiler identity 0.11.1"
  ],
  "rejected": [
    {
      "option": "Leave WO-133 D004 unreferenced",
      "reason": "Its rejected option is now the contract; a reader of D004 needs the pointer."
    }
  ],
  "reopenWhen": "The admission is narrowed or withdrawn."
}
```

## WO-154-D016

<!-- integration refs/dotln/checkpoint/WO-154/10 -->

```json
{
  "id": "WO-154-D016",
  "date": "2026-09-24",
  "dispatch": "worktree integrate WO-154",
  "decision": "Draft integration record: preserve both bases and recovery material; reviewer must assess carried-forward claims and complete this record.",
  "evidence": [
    "refs/dotln/checkpoint/WO-154/10",
    "base 75743fd64031e83bb13c3873411fd5ca56cda1c1",
    "upstream 24aa7237a1dc50ee52ddbbffa0d30642ce1327a8"
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-09-24. Original base: `75743fd64031e83bb13c3873411fd5ca56cda1c1`.
Fetched main: `24aa7237a1dc50ee52ddbbffa0d30642ce1327a8`. Checkpoint: `refs/dotln/checkpoint/WO-154/10`.
Named stash retained: `90cc6d5bc01815da6c8bd93d106cbba6abeac619` (WO-154 integrate 2026-09-24).
Resolved projections: .claude/harness-manifest.json, .claude/hooks/commit-msg.mjs, .claude/hooks/concurrent-work-requires-worktrees.mjs, .claude/hooks/finish.mjs, .claude/hooks/no-attribution.mjs, .claude/hooks/no-lint-type-disables-as-fixes.mjs, .claude/hooks/permissions.mjs, .claude/hooks/presence-posttooluse.mjs, .claude/hooks/presence-pretooluse.mjs, .claude/hooks/presence-stop.mjs, .claude/hooks/presence-userpromptsubmit.mjs, .claude/hooks/read-observer.mjs, .claude/hooks/session.mjs, .claude/hooks/write-observer.mjs, README.md, docs/control/current.md, docs/lineage/decisions-index.md, docs/planning/followups.json, docs/publication/everyday-ai-user-toc.md, docs/work-orders/README.md.
Release preparation: WO-154 target v0.46.0 remains current; no files changed.
Tag observation: local snapshot only..
Carried-forward claims (reviewer, `resume: final review`, 2026-09-24): every acceptance claim VER-002 judged is carried with its original evidence, because the integration changed no source file of this order. `main` gained WO-153 (`v0.45.1`, skeleton `0.38.1`, a `harness-host.ts` fix, and the WO-153 authority and feedback editions). The five authored conflicts were resolved by keeping this branch's bytes in `docs/evidence/current.json` (WO-154's four editions), `packages/skeleton/package.json` (`0.39.0`), `packages/console/package.json` and both lockfile hunks (the skeleton pin `0.39.0`), and by keeping both dated activation paragraphs in `docs/product/06-roadmap.md` with WO-154's first. Component versions: skeleton `0.39.0` stays the next minor above the `0.38.1` upstream consumed, so no retime (D005 stands; its reopening condition was not met); compiler `0.18.0` and console `0.1.11` were untouched by `main`; `release prepare --local` reported `WO-154 target v0.46.0 remains current`. The staged diff of tracked code against `main` is the same 53 files, 2,326 insertions and 577 deletions the order had against `75743fd6`.
Evidence editions on the integrated tree: `feedback-evidence --check` passes (`judged the current source`), D012's expectation; artifact identity and verification pass; authority was stale (`bundle-diff.json`: the fourteen hooks were re-emitted after `main`'s `harness-host.ts` change), which is D004's recorded reopening condition for the integrated tree and the outcome WO-153 D007 named, so the reviewer re-minted authority deterministically as `docs/evidence/WO-154/authority/002` (`authority.json` byte-identical to revision 001; `bundle-diff.json` differs in the regenerated hook hashes and the revision label) and selected it in `docs/evidence/current.json`; `--check` passes. No live episode was run.
Register: `FUP-ccaad908fd4c4376` (D010's follow-up for the executor to resolve VER-001-F1) had no disposition although D011 discharged it and VER-002 criterion 8 passed; disposed at this review as `allocated` to WO-154 with the evidence and a reopening condition. The repair had disposed the folded `FUP-0c86ada82f559914` the same way.
Affected checks, executed on the integrated tree: `npm test -- --review` outside the harness sandbox, 34 passed, 0 failed, 293.33 s, 78 fresh tasks, exit 0; `npm run publication:check` PASS with both editions CURRENT; `node scripts/harness.mjs check --loadout contributor` 31 surfaces; `node scripts/harness-context.mjs --check` every set role within its ceiling; `npm run release -- check-surfaces --local` 0 FAIL; `npm run plan -- check` exit 0; `node scripts/check-registrations.mjs` 327 JSONL, 21 stubs; `git diff --check` clean. Acceptance judgment: [FINAL-001](../../final-reviews/WO-154/FINAL-001.md).
Authored conflicts observed: docs/evidence/current.json, docs/product/06-roadmap.md, package-lock.json, packages/console/package.json, packages/skeleton/package.json.
