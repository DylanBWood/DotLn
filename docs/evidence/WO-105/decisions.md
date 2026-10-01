# WO-105 decisions

## WO-105-D001

```json
{
  "id": "WO-105-D001",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "decision": "Implement an offline additive crash corpus with seed wo105-crash-20261001, generated store sizes 0/1/8/64 events, a 512-append law, the current demo, retained CRLF and depth-12000 payloads, and at most four signature-distinct tree families. Sweep all UTF-8 byte offsets inclusively; retain compact ranges with a digest of regenerable per-cut records.",
  "evidence": [
    "docs/work-orders/WO-105-crash-shape-corpus.md",
    "packages/kernel/src/store.ts: final LF required, sequential event IDs, iterative payload validation",
    "packages/kernel/src/core.ts: replay and replayOutbox",
    "packages/skeleton/src/scenario.ts: runScenario recovery hook; effect count, dispatch IDs and recovered commands exposed",
    "Base 2b1af1abfd947068c402daa1ee24b447fc81b1af: observed crash opening 16553 bytes / 11 events and demo 23831 bytes / 28 decisions",
    "packages/skeleton/test/scenario.test.ts: WO-029 now compares frozen WO-003 mechanics after removing explicit artifact-identity trace additions"
  ],
  "rejected": [
    {
      "option": "NoOp",
      "reason": "Would not deliver the operator-selected order's persistent classified compatibility material."
    },
    {
      "option": "Modify the store/scenario or wire these tests into npm test",
      "reason": "The order designates read-only oracles and a manual corpus lane."
    },
    {
      "option": "Commit every raw offset row",
      "reason": "Compact lossless offset ranges and a raw-record digest preserve classifications within a 65536-byte observation budget; --records regenerates every row."
    },
    {
      "option": "Add same-signature tree variants",
      "reason": "They consume storage and maintenance without additional observed behavior."
    }
  ],
  "reopenWhen": "A changed decoder/scenario contract, a numbered finding, redundant signatures or measured resource cost invalidates these bounds."
}
```

Mission / critical path: risk-reduction evidence for eventual store compatibility and deferred crash-ambiguity study, not a runtime feature or a claim that WO-009 needs these fixtures. The useful outcome is reproducible classifications a later consumer can run without this session.

System traps: policy resistance and escalation are bounded by leaving shipped code and root test wiring untouched; commons cost is bounded by declared sizes and compact records; drift and rule beating are checked by exhaustive actual hook calls, independently computed prefixes/pending commands, planted failures and byte comparisons. Success to the successful is checked by comparing NoOp and direct calls with the cache alternative. Shifting the burden is reduced by exact regeneration commands. Seeking the wrong goal is checked by signature-distinct families and an explicit evidence-only claim. Naive Interventionism: preserve the existing codec, recovery and oracle fixtures; add reversible files without effects or dependencies. NoOp loses to the selected deliverable, not to a general preference for more tests.

The order's no-product-write-back fence overrides the standing product-document update duty. The lane is discoverable from its manifest; naming it in corpus/README.md and product 03 remains the order's explicit later-documentation question. The read-only historical trace source is a mechanics baseline; today's full golden has 28 decisions, not the historical 21.

## WO-105-D002

```json
{
  "id": "WO-105-D002",
  "kind": "experiment",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "decision": "Keep a real runScenario invocation per crash offset; decline an opening-cache optimization.",
  "question": "Can caching the compiled opening shorten the crash sweep without weakening its evidence?",
  "alternatives": [
    "Call the shipped runScenario hook at every byte offset",
    "Cache or substitute the opening and drive only restore/replay"
  ],
  "observation": "The order explicitly requires runScenario with crashAfterPersist and recoveryLogTransform; a restore-only comparison would change the evidence subject.",
  "budget": {
    "wallSeconds": 120
  },
  "execution": "declined",
  "reason": "The proposed shortcut bypasses part of the required scenario call; no within-scope saving has been established.",
  "cost": {
    "wallSeconds": 62.295,
    "tokens": null,
    "commands": [
      "Read packages/skeleton/src/scenario.ts and scripts/lib/meta.mjs; record this decline"
    ],
    "source": "Measured wall time from the economy decision recording window's start through submission of this record; token allocation unavailable."
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": [
      "node corpus/harness/skeleton-crash-sweep.mjs --seed wo105-crash-20261001"
    ],
    "summary": "Retain the direct hook invocation; no measured performance improvement claimed."
  },
  "outcome": "kept-current",
  "regression": "unknown",
  "history": {
    "lastAdoptedImprovementAt": null,
    "experimentsSinceAdoption": null
  },
  "evidence": [
    "WO-105 objective (f)",
    "packages/skeleton/src/scenario.ts: runScenario"
  ],
  "rejected": [
    {
      "option": "Cache/substitute the opening",
      "reason": "Would bypass the explicitly selected hook contract."
    }
  ],
  "reopenWhen": "A later order authorizes a different sweep entry point with equivalent executable evidence."
}
```

## WO-105-D003

```json
{
  "id": "WO-105-D003",
  "date": "2026-10-01",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.60.3, the next patch above the observed release baseline v0.60.2, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.60.2 (local tags)",
    "patch classification declared in docs/work-orders/WO-105-crash-shape-corpus.md"
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

## WO-105-D004

```json
{
  "id": "WO-105-D004",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "decision": "Retain the declared exhaustive byte sweeps and four deliberately planted tree shapes; record zero runtime findings in this set. Use a single-command effect bound and separate live/replay checks for tree families.",
  "evidence": [
    "corpus/manifests/WO-105.json: seed wo105-crash-20261001; LF log sizes 0, 338, 2370 and 19282 bytes for 0, 1, 8 and 64 events",
    "Additional store sweep inputs: CRLF 2378 bytes, deep-nesting 24139 bytes, freshly generated canonical demo 23831 bytes; total 72345 cuts",
    "Canonical crash opening: 16553 bytes, 16554 cuts, 12 recovered-prefix outcomes and 16542 loud failures; complete CRLF and depth-12000 mutations recover with one effect and two dispatches",
    "Tree inventory: chain-mixed 6 files / 1 candidate; cycle-mixed 8 / 2; orphan-heavy 12 / 3; source-only 3 / 0; all four complete live/replay and none is excluded",
    "corpus/manifests/WO-105-observations.jsonl: 32485 bytes of classified ranges and family rows; per-offset records regenerate with --records",
    "Planted classifier failures, false trace identity, missing pending commands, duplicate effects and invalid ground truth are rejected by wo105-*.test.mjs"
  ],
  "rejected": [
    {
      "option": "Infer per-command effect safety for arbitrary multi-command recovery",
      "reason": "The shipped fake exposes an aggregate effect count. The declared inputs contain zero or one commandId, so callback counts and dispatch IDs suffice only for that set."
    },
    {
      "option": "Generate random topology without planted family shapes",
      "reason": "Fixed structural templates guarantee chains, reachable and unreachable cycles, orphans, all four fixture classifications and candidate counts; the seed supplies stable generated file identities."
    },
    {
      "option": "Sweep every tree family as another crash log",
      "reason": "The declared crash opening precedes fixture inspection and is identical across these trees; extra sweeps repeat the same cut set. Every family independently completes a live/replay identity check."
    },
    {
      "option": "Add a finding for the executor's incorrect duplicate-trace label",
      "reason": "This was an authored test error, not a shipped behavioral surprise. The shipped core.ts applyCommandResult branch is named dedup, and the corrected assertion passes."
    }
  ],
  "reopenWhen": "A new fixture introduces another commandId, an assertion-tripping family or a changed signature; a store/scenario contract changes; or a downstream consumer needs additional shapes."
}
```

Same-day correction: the first new outbox self-test incorrectly expected the trace branch `duplicate`. Reading `packages/kernel/src/core.ts` `applyCommandResult` confirmed the actual branch is `dedup`; the test was corrected without changing the runtime or recorded observations. The focused rerun passed. No runtime finding numbers were allocated; `findings` is an empty array, scoped to the declared set.

D001's goal/lens comparison remains applicable. The observed benefit is a repeatable 88,899-cut compatibility record, full golden output and four distinct tree signatures. This pins existing behavior; it does not establish new recovery machinery or general crash-after-effect reconciliation. The economy comparison remains declined; no recurring time or token saving is claimed.

## WO-105-D005

```json
{
  "id": "WO-105-D005",
  "date": "2026-10-01",
  "dispatch": "resume: next",
  "decision": "Store the CRLF anomaly in crlf.json as an escaped log string; keep exact decoded bytes, classifications and observation digests unchanged.",
  "evidence": [
    "git diff --check HEAD after staging identified the eight intentional CRLF terminators as trailing whitespace",
    "corpus/fixtures/store/index.json declares json-log-string storage and the decoded log's size and digest",
    "The store generator self-test reconstructs each stored log and compares its bytes and digest with the in-memory fixture"
  ],
  "rejected": [
    {
      "option": "Normalize the anomaly to LF",
      "reason": "Would erase the required CRLF family."
    },
    {
      "option": "Change Git configuration or whitespace attributes",
      "reason": "An encoded fixture meets the same contract without a configuration change or check suppression."
    }
  ],
  "reopenWhen": "A corpus consumer requires raw CRLF files on disk; reconstruct them from the declared string representation before reconsidering committed framing."
}
```

This changes fixture storage only. The original classified observations remain append-only and byte-identical. D001's lenses still apply: preserve the test standard and exact anomaly, without new runtime behavior or recurring operator intervention.

## WO-105-D006

```json
{
  "id": "WO-105-D006",
  "date": "2026-10-01",
  "dispatch": "resume: next; operator memory-pressure alert followed by clarification that a different session caused it",
  "decision": "Stop the active corpus run for the alert, then resume this order with serial test files and a 512 MiB Node V8 old-space limit; run the existing root gates with --serial.",
  "evidence": [
    "The stopped WO-105 sweep showed 157040 KiB resident memory at inspection",
    "A separate WO-102 scratch mutation test showed 25448464 KiB resident memory, then its parent advanced to another case that showed 28508960 KiB; the test parent was also stopped to prevent further launches",
    "The operator clarified that another session caused the pressure",
    "scripts/test-runner.mjs supports --serial without dropping suite coverage"
  ],
  "rejected": [
    {
      "option": "Continue the active sweep during the alert",
      "reason": "The operator's machine stability takes precedence over completing a test run."
    },
    {
      "option": "Change another work order or the shared root test runner",
      "reason": "Neither is part of this corpus deliverable; existing per-run controls suffice for this order."
    }
  ],
  "reopenWhen": "This order's serial capped runs fail or show excessive resident memory; stop and diagnose before raising any limit."
}
```

The heap limit is not a total-process memory cap. No account, global Node or Git setting changed. The interrupted run stays in the append-only transcript and claims no pass. The separate mutation probe's allocation cause was not profiled; its test materializes the full grid and compares full findings arrays, a possible growth path rather than a proved root cause.

The manual root commands use `--serial` for the outer suite scheduler; the runner retains its existing per-suite file concurrency. The lifecycle's inline document check uses its standard scheduler and inherits the same per-Node heap limit. A read-only sample of this order's first root gate and its descendants observed a maximum individual RSS of 154.625 MiB; this is one sample, not a peak-memory guarantee.

## WO-105-D007

```json
{
  "id": "WO-105-D007",
  "date": "2026-10-01",
  "dispatch": "resume: next; handoff follow-up inspection",
  "decision": "Leave the four existing follow-ups on their recorded routes. The matches are on lifecycle projections or shared basenames; this corpus order changes none of their implementation seams and has not observed a reopening condition.",
  "evidence": [
    "npm run adjacent -- list: revision 0, no items",
    "npm run plan -- followups --touching --work-order WO-105: four matches; all four named source decisions read",
    "FUP-b7a66e7a4fa7ad20 / WO-086-D024: decisions.md basename match; release preparation, integration and release-history implementations are unchanged, and local release preparation passed",
    "FUP-50cda1c03ecd8ea8 / WO-171-D014: generated meta.json match; the prune/byte-proof writer is unchanged and no partial-proof condition was encountered",
    "FUP-acfe4bfda716d8fb / WO-158-D008: generated current.md match; usage/actor-attribution implementations are unchanged",
    "FUP-fd05316b6030ef73 / WO-168-D009: README basename matches; the root change is the release claim, and no standing writer sentence is edited",
    "git diff HEAD -- packages package.json package-lock.json scripts .agents .claude corpus/README.md: empty"
  ],
  "rejected": [
    {
      "option": "Expand this order into the four existing repairs",
      "reason": "Textual matches do not open those seams; the authorized additive corpus and its lifecycle records do not require those changes."
    }
  ],
  "reopenWhen": "A named implementation seam is changed or one of the follow-up's recorded conditions is observed."
}
```

## WO-105-D008

```json
{
  "id": "WO-105-D008",
  "date": "2026-10-01",
  "dispatch": "resume: next; operator authorization to install the pinned browser",
  "decision": "Apply the operator's explicit exception to the order's no-install fence: install the pinned Chromium headless shell into this worktree's ignored .runtime/playwright cache, then rerun the required gate. Keep the broader Playwright repair in the separate work order the operator named.",
  "evidence": [
    "First npm test -- --serial: 28 suites passed, browser-evidence failed, 1277.95 seconds; its required local browser cache did not exist",
    "packages/browser-evidence/package.json pins Playwright 1.63.0; its installed browsers.json pins Chromium headless shell revision 1243, version 153.0.8010.12",
    "The operator explicitly instructed this session on 2026-10-01 to install the browser and stated that the wider Playwright issue is being fixed in another work order",
    "Command: PLAYWRIGHT_BROWSERS_PATH=\"$PWD/.runtime/playwright\" NODE_OPTIONS=--max-old-space-size=512 ./node_modules/.bin/playwright install chromium --only-shell"
  ],
  "rejected": [
    {
      "option": "Change browser setup or test behavior in this work order",
      "reason": "The operator assigned that repair elsewhere; this exception authorizes the local pinned installation."
    },
    {
      "option": "Waive the required product gate",
      "reason": "No waiver was authorized, and installing the required browser permits the declared gate to run."
    }
  ],
  "reopenWhen": "The pinned browser changes, the cache is removed, or the gate reports a failure after installation."
}
```

The authorized installation completed: Chromium headless shell revision 1243 and the install command's FFmpeg revision 1011 are in the ignored worktree cache. Package manifests and the lockfile remain unchanged.

## WO-105-D009

```json
{
  "id": "WO-105-D009",
  "date": "2026-10-01",
  "dispatch": "resume: next; documentation-gate diagnosis",
  "decision": "Prepare one explicit non-EventEnvelope registration for the required observations JSONL and await the operator's exception to the existing-file boundary before applying it. Keep the order active; this is neither a waiver nor a completed handoff.",
  "evidence": [
    "After the authorized browser installation, npm test -- --serial passed all 29 suites in 1129.21 seconds at code identity 688508f9a32eda7ba9d2f14bdd37999ce74b914021ff3f2ed724120e7903acf9",
    "npm run test:docs -- --serial passed 23 suites and failed kernel-docs: the store-history check applied decodeLog to corpus/manifests/WO-105-observations.jsonl and rejected $.recording as UNKNOWN_FIELD",
    "packages/kernel/test/store-history.test.ts defaults committed corpus JSONL to EventEnvelope unless explicitly declared as another protocol",
    "packages/kernel/test/fixtures/jsonl-protocols.json already declares ID, Program and mutation corpus records; adding the observations path is the existing mechanism",
    "scripts/lib/evidence-jsonl.mjs confines per-order declarations beneath docs/evidence/WO-NNN, so that mechanism cannot declare a corpus path",
    "A prepared one-line registry patch passes git apply --check; it has not been applied pending the operator's response"
  ],
  "rejected": [
    {
      "option": "Change the decoder or weaken the default event-stream check",
      "reason": "The observations are a different protocol; the decoder and strict default are behaving as designed."
    },
    {
      "option": "Rename or wrap the observations as another fixture format",
      "reason": "The order explicitly requires this append-only JSONL path, and the existing classified records should remain unchanged."
    },
    {
      "option": "Silently edit the existing registry",
      "reason": "The order's design and criterion 6 explicitly restrict existing-file changes to lifecycle records; the scope exception has been requested but not received."
    }
  ],
  "reopenWhen": "The operator answers the pending registration request. An approved registry edit changes the code identity and requires a fresh product gate as well as a passing document gate."
}
```

Same-day correction: the implementation omitted the existing non-event JSONL registration requirement. The document gate and the store-history source establish that omission. The proposed correction uses the existing registry; the corpus observations and the read-only runtime oracles need no change. This pending integration correction stays on the active order and is not a deferred runtime finding.

## WO-105-D010

```json
{
  "id": "WO-105-D010",
  "date": "2026-10-01",
  "dispatch": "resume: next; explicit operator approval of the requested one-line registry exception",
  "decision": "Add one nonEventPaths entry for corpus/manifests/WO-105-observations.jsonl in packages/kernel/test/fixtures/jsonl-protocols.json, amend the order's existing-file boundary to name that sole test-metadata exception, and rerun the required gates before completion.",
  "evidence": [
    "The operator explicitly approved the request to add one line to the existing test registry and finish WO-105 on 2026-10-01",
    "WO-105-D009 records the failing document check, its source-level diagnosis and the prepared one-line patch",
    "The entry declares WO-105 crash-corpus classified observations through the existing registry mechanism",
    "The registry edit changes no decoder, test implementation, package manifest, dependency, runtime oracle or observation bytes"
  ],
  "rejected": [
    {
      "option": "Continue waiting for the already granted exception",
      "reason": "The operator has explicitly authorized the concrete fix; no further approval is needed."
    },
    {
      "option": "Broaden protocol discovery or change corpus storage",
      "reason": "The existing registry resolves the encountered integration failure with the approved one-line change."
    }
  ],
  "reopenWhen": "A required gate identifies another concrete failure, or the observations path or protocol changes."
}
```

D010 supersedes D009's pending-approval disposition. The correction directly unblocks the order's required document check. D001's goal and eight-trap comparison still applies: keep the declared evidence, strict default validation and runtime oracles; use the explicit protocol mechanism and rerun gates at the changed code identity. NoOp would leave a known integration failure; broader intervention has no demonstrated need.

The execution-amendment command was attempted and refused because WO-105 is not in the current judged horizon. The checked latest planning receipt (`2026-09-30-planning-826842218eb333e2-036`) omits WO-105, and `amendPlanOrder` admits only orders in that receipt. `npm run plan -- check` passes with the amended work order. No planning amendment event was invented or manually appended; the operator authorization and the exact boundary exception are recorded here and in the order. The focused store-history check passes after the registry edit: 336 event streams / 16,587 events round-trip byte-identically, with 132 files classified as other protocols.

## WO-105-D011

<!-- integration refs/dotln/checkpoint/WO-105/6 -->

```json
{
  "id": "WO-105-D011",
  "date": "2026-10-01",
  "dispatch": "resume: final review; worktree integrate WO-105",
  "decision": "Integrate main at 85d13906 (WO-102 at v0.60.3, then WO-181 at v0.61.0) into the uncommitted WO-105 worktree by fast-forward, with no authored conflict. WO-102 released v0.60.3, the version WO-105 had prepared, so the application release retimes to v0.61.1 under the recorded patch classification; WO-105 changes no component version, edition or dependency. Upstream changed one oracle the corpus pins (packages/skeleton/src/reactor.ts) and bumped @dotln/compiler 0.21.0 to 0.22.0, whose version string the canonical demo embeds. Every behavioral claim re-ran on the integrated tree and holds; the corpus's base-keyed byte pins do not match there, which D012 judges and boards.",
  "evidence": [
    "refs/dotln/checkpoint/WO-105/6",
    "base 2b1af1abfd947068c402daa1ee24b447fc81b1af",
    "upstream 85d13906a815ba4e0b0e56781434c6a852f6ee04",
    "release preparation: Retimed WO-105: v0.60.3 → v0.61.1 above the observed release baseline v0.61.0. Files changed: docs/work-orders/WO-105-crash-shape-corpus.md, README.md, docs/evidence/WO-105/meta.json, docs/final-reviews/WO-105/PR.md. Meter snapshot: docs/evidence/WO-105/meta.json, 4267 bytes. Tag observation: local snapshot only.",
    "git diff 2b1af1ab 85d13906: no change under packages/kernel/src or to packages/kernel/test/fixtures/jsonl-protocols.json; packages/skeleton/src/reactor.ts sha256 f2e22003… → ba9e8954…; packages/compiler and packages/skeleton package versions 0.21.0 → 0.22.0 and 0.48.0 → 0.49.0; corpus/ gains only WO-102's cadence lane. docs/intake/ holds only tracked .gitkeep files, so no intake backup was required.",
    "git diff --cached refs/dotln/checkpoint/WO-105/3 -- corpus packages/kernel/test/fixtures/jsonl-protocols.json lists only WO-102's upstream files: the WO-105 corpus and the registry line are byte-identical to the subject VER-001 verified.",
    "Integrated tree, 2026-10-01, NODE_OPTIONS=--max-old-space-size=512: npm run build; generate-store-corpus.mjs --check and generate-tree-corpus.mjs --check exit 0; the store sweep (72,345 cuts: 117 clean-prefix, 72,228 loud-failure) and the skeleton sweep (16,554 cuts: 12 recovered-prefix, 16,542 loud-failure; both CRLF and depth-12000 mutations recover) completed with every in-sweep invariant holding and counts and per-offset classifications equal to the manifest; node --test corpus/harness/wo105-*.test.mjs 8 passed, 3 failed on base-keyed hashes (D012).",
    "Affected checks on the integrated tree: npm run publication:check, node scripts/harness.mjs check (31 generated surfaces) and npm run release -- check-surfaces --local (57 PASS, exit 0) pass. npm test -- --review --serial: 30 passed, 0 failed, 1,108.32 s, 75 fresh tasks, code identity a20520b5964bd0e8e0dbfbd9ff23fc5b304017b74ee94dd594e501cfb5900142, recorded 2026-10-01T18:19:36.501Z, run after the order's new files were staged."
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

Integration date: 2026-10-01. Original base: `2b1af1abfd947068c402daa1ee24b447fc81b1af`.
Fetched main: `85d13906a815ba4e0b0e56781434c6a852f6ee04`. Checkpoint: `refs/dotln/checkpoint/WO-105/6`.
Named stash retained: `72900f84b2dc61a6ed85119e1f0fdcb8ace1e206` (WO-105 integrate 2026-10-01).
Resolved projections: README.md, docs/control/current.md, docs/work-orders/README.md.
Release preparation: Retimed WO-105: v0.60.3 → v0.61.1 above the observed release baseline v0.61.0. Files changed: docs/work-orders/WO-105-crash-shape-corpus.md, README.md, docs/evidence/WO-105/meta.json, docs/final-reviews/WO-105/PR.md. Meter snapshot: docs/evidence/WO-105/meta.json, 4267 bytes. Tag observation: local snapshot only.
Carried-forward claims: criteria 1, 5 and 6 rest on the unchanged manifest, seed, fixtures and records, and the store and tree `--check` regenerate byte for byte on the integrated tree. Criteria 2 and 3 re-ran on the integrated tree: both sweeps cover every declared offset with the manifest's counts and classifications, every invariant holds, and the four tree families keep their structural truth, distinct signatures and live/replay identity. Criterion 4's golden is keyed by the order to the base commit and carries forward from VER-001 at `2b1af1ab`; live/replay identity for every tree family holds on the integrated tree. Criterion 7's corpus commands carry forward from the base transcript and VER-001's reproduction; on the integrated tree the golden `--check`, both sweep CLIs and 3 of 11 corpus tests fail only on base-keyed hashes (D012). `npm test`, `npm run test:docs` and `git diff --check` were re-run on the integrated tree. FINAL-001 judged the integrated subject.
Authored conflicts observed: none.
Affected checks are printed by the command; results remain untested until executed.

## WO-105-D012 — final review: the corpus's byte pins are keyed to its base and fail on later main

```json
{
  "id": "WO-105-D012",
  "date": "2026-10-01",
  "dispatch": "resume: final review; FINAL-001; operator choice of pass with a follow-up",
  "decision": "Pass the order and board the base-keyed pins. After integration, the golden fixture, the manifest's lane records and the manifest's oracle hashes no longer match the integrated tree, so the golden --check, both sweep CLIs and three corpus tests exit nonzero. Two upstream changes cause this, and neither is WO-105's. @dotln/compiler moved from 0.21.0 to 0.22.0. Its version string appears 23 times in the demo's LoadoutEquipped payload and in the artifactIdentity envInputs of its decision traces. Replacing 0.21.0 with 0.22.0 in the golden makes its traces, event log and glyph scene equal to the live run byte for byte. WO-181 also changed packages/skeleton/src/reactor.ts, whose hash the golden test pins. Crash-shape behavior is unchanged: both sweeps cover every declared offset with the manifest's counts and per-offset classifications, and every invariant holds. The order keys the golden to its base (objective (e), criterion 4 'at the base commit'), and its evidence gate takes the corpus commands from the base transcript, so this is not an acceptance defect. It does leave a lane whose own commands fail on main with messages that do not name the cause.",
  "evidence": [
    "Integrated tree 85d13906, 2026-10-01: node corpus/harness/generate-golden-corpus.mjs --seed wo105-crash-20261001 --check exits 1 with 'regeneration differs: corpus/fixtures/golden-traces/WO-105-demo-2b1af1ab.json'. The golden and live runs both have 28 decision traces, 28 events and 23,831 log bytes, and the glyph scenes are equal; the first difference is trace 2's artifactIdentity.compilerPackageVersion 0.21.0 → 0.22.0, and after substituting 0.21.0 → 0.22.0 (23 occurrences) the serialized traces, log and glyph scene are equal.",
    "Store sweep on the integrated tree: 72,345 cuts, no silent divergence or boundary failure; compared with the manifest, the only differing field is sweeps[6] (canonical-demo) logSha256 9e818959… → c4431f37….",
    "Skeleton sweep on the integrated tree: 16,554 cuts (12 recovered-prefix, 16,542 loud-failure), all recovery invariants hold; the differing fields are the crash opening's logSha256 and recordsSha256, the traceSha256 of 9 of the 12 recovered cuts (offsets 11,142 through 16,553; the cuts at 0, 211 and 432 are unchanged), and both families' logSha256, traceSha256 and replaySha256.",
    "node --test corpus/harness/wo105-*.test.mjs on the integrated tree: 8 passed; failed are 'golden traces, event log and glyph scene …' (regeneration differs), 'every declared skeleton cut …' and 'every declared store cut …' (deep-equal against the manifest). The manifest pins packages/skeleton/src/reactor.ts at f2e22003…; integrated main has ba9e8954….",
    "docs/work-orders/WO-105-crash-shape-corpus.md objective (e) and criterion 4 key the golden to the base commit; its Evidence gate takes the corpus commands from the transcript under corpus/manifests/runs/ and repeats only npm test and npm run test:docs at final review. corpus/fixtures/golden-traces/WO-105-demo-2b1af1ab.json provenance: 'Run this harness with those package sources to re-derive the golden.'",
    "npm test does not run corpus/harness/wo105-*.test.mjs, and passed on the integrated tree (D011)."
  ],
  "followup": "Next order that edits the WO-105 corpus lane, or the first corpus-policy pass after it merges: decide how the lane behaves after its base. Either run its live comparisons against base sources (for example a worktree at baseCommit with the corpus overlaid), or separate version-bearing artifact-identity fields and oracle hashes from the crash-shape pins, so a sibling's version bump or unrelated reactor change is reported as base drift rather than a regeneration or manifest mismatch. Record the chosen rule in the lane's manifest and in corpus/README.md when the lane is named there.",
  "rejected": [
    {
      "option": "Fail FINAL-001 and route a repair that re-records the corpus at 85d13906",
      "reason": "Every criterion holds against the order as written, and the behavioral claims re-ran green on the integrated tree. A re-recording would fail again at the next compiler or skeleton change, and the operator chose pass with a follow-up in this dispatch."
    },
    {
      "option": "Re-key the golden, manifest and observations in this review",
      "reason": "It edits harness source (BASE) and re-records verified evidence, including the append-only observations; a reviewer does not write a change and certify it."
    },
    {
      "option": "State the drift only in the report",
      "reason": "A limit met in review is boarded here with a follow-up, not left as a report sentence."
    }
  ],
  "reopenWhen": "A later order changes the lane's base handling, re-records it at a new base, or names the lane in corpus/README.md or product 03 §Corpus policy."
}
```

Goal alignment: the order's value is a reproducible crash-shape record that a later store swap or crash-ambiguity study can run, so the question is whether the record still describes the shipped behavior. The integrated sweeps answer it directly (the rule-beating and wrong-goal lenses): every cut keeps its classification, and only identity bytes moved. Fixes that fail and escalation weigh against a repair: re-recording at each new base would chase sibling version bumps. Drift to low performance weighs the other way, because a lane that fails on main without naming the cause invites people to ignore it. The follow-up answers that, and the PR and release notes say plainly that the lane must run at its base until it lands. Naive Interventionism: the verified evidence stays as it is. NoOp would publish the corpus without disclosing that its commands fail on main.
