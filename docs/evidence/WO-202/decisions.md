# WO-202 decisions

## WO-202-D001

```json
{
  "id": "WO-202-D001",
  "date": "2026-10-12",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.78.0, the next minor above the observed release baseline v0.77.0, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.77.0 (local tags)",
    "minor classification declared in docs/work-orders/WO-202-planning-machinery-runs-in-an-instance.md"
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

## WO-202-D002

```json
{
  "id": "WO-202-D002",
  "date": "2026-10-12",
  "dispatch": "resume: next",
  "decision": "Keep the base probe and make only absent instance inputs optional.",
  "evidence": [
    "The base command table was recorded before product fixes by npm test -- --only launchpad-planning, using a bounded copy of source at b96a69a6d640046c2dce5653aeb4bcd4249f2b31 with only the new probe and its runner declaration added. All commands ran in one committed fixture export; no root branch commit was made.",
    "commands.json preserves exit codes and output heads. Failed rows were conditions, plan cost/refute/receipt/check, docs-check, publication, lineage, reader and local release-surface reads. Its fix fields map each to the change. The two supplementary operator-control and harness-probe failures were invocation setup, corrected and labeled, not product fixes.",
    "Correction to the order dated 2026-10-11: base plan start, absent follow-up feed, meta, work-order indexes, entropy subject and fake review/receipt already passed. Existing budget loading has fallback defaults; the seed supplies explicit instance ownership rather than repairing a demonstrated budget exception. Base test:docs passed because WO-201 excluded the failing planning rows.",
    "The fixture authored one dated ledger entry and candidate, applied a real follow-up batch, committed its subject/costs, and filed only a synthetic planning judgment. The original fallback ledger had only a title; the new header seed supplies its required statuses. A deliberately split local forbidden term avoids the probe source matching its own terms list.",
    "The kit marker is committed before optional subject handling applies. Absence enters subject/cost hashes. Core adds no empty availability property, preserving historical receipt identity. Malformed declared vision and a dangling symlink retain refusal."
  ],
  "rationale": "This removes the missing-input stops without borrowing core goals or inventing judgments. Goal traps: avoid rule beating by preserving validation of present inputs; avoid shifting the burden through manual seed copying; avoid escalation through a second planning protocol. NoOp leaves the recorded failing rows. The observed successful fixture matches the intended command-parity outcome.",
  "rejected": [
    {
      "option": "Carry core records or synthesize product goals",
      "reason": "Those are instance-owned inputs, and copying them would violate the order and make a misleading planning standard."
    },
    {
      "option": "Change refutation or entropy transport internals",
      "reason": "The base already exercises fake entropy; the planning failure is subject construction. The existing receipt and transport behavior is sufficient."
    }
  ],
  "reopenWhen": "An absent input stops a declared kit command, a present malformed input passes, or core historical receipt identities change."
}
```

## WO-202-D003

```json
{
  "id": "WO-202-D003",
  "date": "2026-10-12",
  "dispatch": "resume: next",
  "decision": "Write five new seeds once, and include the now-supported planning checks in kit gates.",
  "evidence": [
    "launchpad.mjs writes followups.json, doc-ceilings.json, doc-baseline.json, budgets.json and idea-ledger.md beside the sequence seed, outside the manifest. The new budget template has kit defaults and no core acceptances. test-launchpad.mjs mutates all five to sentinels before an update and compares their preserved bytes.",
    "The initial docs probe exposed ceilings, then baseline, and links from carried operating guides into core history. docs-check.mjs excludes manifest-owned guides from local editorial ceilings/link baselines while retaining clean-room home-path checks and validation of instance-authored links. The fixture proves a broken instance link still refuses.",
    "A header-only ledger and a missing work-order map exposed generated links to nonexistent sources; lineage chooses only present source links and work-orders falls back to the seeded sequence. These leave core indexes unchanged.",
    "Publication, docs-check, lineage, plan, plan-refutation-current and reader-profiles now run in kit gates; the client README enumerates them. The new export-based planning suite is core-only because it builds an export from TypeScript source.",
    "Neither edition is an explicit no-editions state. One declared edition stays a validation failure. A fresh reader with no profiles, examples or scores reports no records; present declarations use normal checks."
  ],
  "rationale": "One-time instance defaults are owned locally and updates cannot replace editorial policy or planning history. The README is a manifest-listed kit input. No new dependency or component source changed, so the minor application release does not change component versions.",
  "rejected": [
    {
      "option": "Keep the working commands excluded from kit document gates",
      "reason": "That would leave the instance unable to verify its planning machinery with the same supported checks."
    },
    {
      "option": "Seed core ceilings and a snapshot of core broken-link exceptions",
      "reason": "They are historical policy of another instance; an empty local baseline and explicit carried-guide boundary are smaller and honest."
    }
  ],
  "reopenWhen": "An instance edits or replaces its carried operating guide and needs local editorial/link enforcement, or new planning inputs need a declared instance seed."
}
```

## WO-202-D004

```json
{
  "id": "WO-202-D004",
  "date": "2026-10-12",
  "dispatch": "resume: next",
  "decision": "Close the reader and empty-fold carry-ins with useful diagnostics and no partial writes.",
  "evidence": [
    "FUP-8b8eb522d1d136c0: reader validation first tests the recorded object type. Absent tag objects fail naming release, SHA and git fetch --tags origin; present non-tag objects remain a different error. The synthetic remote fixture removes the tag, proves retained objects still validate, prunes the object, checks the named failure, fetches it and verifies recovery.",
    "FUP-a4b2cdfb03ddbd2e: release and answer entries are checked as objects before property access or maps. Null, scalar and array entries receive contextual Reader profiles errors instead of TypeError; absent and existing score files are unchanged after rejection.",
    "FUP-749c959a41178a3b was met: the base status row exited zero but warned that the absent projection disagreed with an empty fold. resume now treats ENOENT as agreement only for an empty order map; the fixture asserts no warning."
  ],
  "rationale": "Missing immutable evidence still refuses; an operator gets the exact restoring action. No score row is silently counted as verified.",
  "rejected": [
    {
      "option": "Pass with unverifiable scores",
      "reason": "Would need a new separate verdict channel to preserve score accounting; the existing carry-in permits a named diagnostic instead."
    },
    {
      "option": "Treat every object lookup failure as an absent tag",
      "reason": "A present object of the wrong type must retain its integrity refusal."
    }
  ],
  "reopenWhen": "A remote other than origin must restore the recorded tag, or a malformed record still bypasses contextual validation."
}
```

## WO-202-D005

```json
{
  "id": "WO-202-D005",
  "date": "2026-10-12",
  "dispatch": "resume: next",
  "decision": "Qualify the default export and retain the non-default root-resolution remainder explicitly.",
  "evidence": [
    "FUP-a058e82c0bbd9b6d: the fixture runs operator-control status, writing-worker and authority harness-probe report paths, and imports/calls activeGateRuns, writerTeardownBlocker, usageObservation and codexContinuation from the exported build-free sources. These are non-live smoke checks, not provider or interactive qualification.",
    "The default export contains both its scripts and its runtime. This proves an independent exported checkout works; it does not prove a DOTLN_LAUNCHPAD separated from its scripts checkout or relocated roots.",
    "Source inspection retains the older known limitation: packages/skeleton/src/gate-evidence.mjs gateRunsDirectory, writer-teardown.mjs writerTeardownBlocker and packages/compiler/src/codex-continuation.mjs still use docs/control/local/harness. The harness-context, harness-probe, probe-codex-effort and harness-live-smoke/Copilot fixture-root callers named by WO-070-D009 still require separate tool-root qualification. No non-default executable failure is claimed by this order."
  ],
  "rationale": "The carry-in permits recording failures or limitations outside the Boy Scout bound. Resolving these pinned runtime/module identities and all measurement fixtures is larger than the observed planning-input fixes and may change edition inputs. Live probes are explicitly outside this fixture-only order.",
  "rejected": [
    {
      "option": "Call the whole root-resolution follow-up complete from an empty-state smoke",
      "reason": "That would overstate the observations and leave relocated local-lane behavior untested."
    },
    {
      "option": "Change all pinned runtime readers and launch live probes here",
      "reason": "This broadens the source and evidence surface beyond the bounded command-parity work and conflicts with the fixture-only transport limit."
    }
  ],
  "reopenWhen": "An instance uses DOTLN_LAUNCHPAD with a separate scripts checkout or changes document roots before the remainder lands.",
  "reopens": {
    "decisionId": "WO-070-D009",
    "observation": "The separate default export passes; the non-default-root and separate tool-root remainder is retained with an explicit narrower scope."
  },
  "followup": "Finish the non-default plane/kit root-resolution remainder of FUP-a058e82c0bbd9b6d: resolve the ignored local lane and the tool-root versus launchpad-root distinction for gate-evidence, writer-teardown, codex-continuation and the harness-context/probe/effort/live/Copilot fixture callers; preserve build-free module identity. Check with DOTLN_LAUNCHPAD outside the scripts checkout and relocated document roots, with declared runtime/evidence re-mints if required. Priority low; the independent default export is now qualified. No live transport is authorized by this decision."
}
```

## WO-202-D006

```json
{
  "id": "WO-202-D006",
  "date": "2026-10-12",
  "dispatch": "resume: next; fresh executor self-review",
  "decision": "Fix both distinct findings from the two independent order-and-diff reviews before the final gates.",
  "evidence": [
    "The criterion adversary reported one P2 and the design improver two P2s: both identified success claims linked to the failing base commands table; the improver also found that scripts/lib/plan- does not select scripts/lib/planning-conditions.mjs.",
    "Product 07 and product 12 now link commands-final.json. The base table remains unchanged in outcome. Publication locks were refreshed and publication:check passed.",
    "launchpad-planning now explicitly declares scripts/lib/planning-conditions.mjs in machinerySources.",
    "self-review.md records both reports, their dispositions and the four-worker session total. No worker wrote or launched a probe."
  ],
  "rejected": [
    { "option": "Leave the evidence link at the annotated base table", "reason": "The claim is command success; its direct support is the final observed table." },
    { "option": "Rely on another broad source change to select the fixture", "reason": "A later conditions-only edit needs to select its own regression evidence." }
  ],
  "reopenWhen": "A parity claim loses its executed evidence or a command dependency change fails to select the planning fixture."
}
```

## WO-202-D007

```json
{
  "id": "WO-202-D007",
  "date": "2026-10-12",
  "dispatch": "resume: next; full review gate repair",
  "decision": "Keep publication available in kits and correct the regression fixtures and source declarations exposed by the full review.",
  "evidence": [
    "npm test -- --review completed with 36 passing and two failing suites in 1507.31 seconds. launchpad-planning passed; runner-fixtures had two failing cases and launchpad one.",
    "The unavailable-suite cases in test-runner.test.mjs and test-launchpad.mjs still named publication after this order made it supported. They now use release-surfaces, which remains core-only. The export's three kit gates had already passed before the stale negative assertion.",
    "The direct machinery coverage check named harness-probe.mjs and operator-control.mjs as missing from the new suite's declarations. Both were added, along with its four explicit build-free module smoke inputs, so edits to those inputs select the fixture.",
    "A bounded run of the kit --only and every machinery suite cases passed both cases after the repair. The required format, document and full review gates are repeated at the repaired identity."
  ],
  "rejected": [
    { "option": "Restore publication's core-only exclusion", "reason": "That would undo the supported instance command and its document-gate coverage to satisfy an obsolete expectation." },
    { "option": "Suppress the machinery coverage finding", "reason": "The invoked scripts belong in the suite's declared source boundary." }
  ],
  "reopenWhen": "The supported kit suite inventory changes or another direct planning-fixture dependency is not declared."
}
```

## WO-202-D008

```json
{
  "id": "WO-202-D008",
  "date": "2026-10-12",
  "dispatch": "resume: next; unchanged-code gate revalidation",
  "decision": "Retain the supervisor startup timeout as an unresolved observation and revalidate the unchanged code before handoff.",
  "evidence": [
    "The repaired npm test -- --review run completed with 37 passing suites and one failure in 1480.18 seconds. Both suites repaired in D007 passed. Skeleton reported 508 passing cases and one failed case: built CLI supervisors kill their episode group on all terminal signals, with episode group never started from its five-second readiness timer. The first full review had passed skeleton.",
    "The case failed before its process-group and signal assertions. Its finally block kills the known supervisor and a group only after readiness has supplied its identifier. The gate also reported two surviving fixture processes; a post-gate ps lookup found neither PID. The cause of the readiness timeout is not established.",
    "The exact case passed without source changes under node scripts/harness.mjs bounded -- node --test --test-name-pattern='built CLI supervisors kill their episode group' packages/skeleton/dist/test/resident-actors.test.js: one case, 5282 ms, all three terminal signals, no survivor finding.",
    "No timer or assertion was relaxed. The document and complete review gates are rerun at the unchanged source identity; their final outcomes are recorded in handoff.md."
  ],
  "rejected": [
    { "option": "Attribute the timeout to a signal-handling regression", "reason": "The readiness timer failed before signals were exercised, and the isolated case passed." },
    { "option": "Increase the timer or alter runtime code without a demonstrated cause", "reason": "A single unreproduced readiness failure does not establish which change would repair it." },
    { "option": "Use the isolated pass as the full review result", "reason": "The order requires a passing complete review at the current code identity." }
  ],
  "reopenWhen": "The supervisor readiness timeout recurs or a controlled reproduction identifies its cause.",
  "followup": "Investigate the intermittent five-second readiness failure in packages/skeleton/test/resident-actors.test.ts built CLI supervisor signal case, observed during WO-202 full review. Cause unknown; capture supervisor exit/stderr and readiness-file timing, establish a controlled reproduction, then repair the demonstrated cause without weakening signal or descendant-cleanup assertions. Recheck the isolated case and skeleton suite under the full review scheduler. Priority low pending recurrence; no runtime defect is asserted from this observation."
}
```

## WO-202-D009 — Verification: pass VER-001; board the client README's two stale pending-planning sentences

```json
{
  "id": "WO-202-D009",
  "date": "2026-10-12",
  "dispatch": "resume: verify; VER-001",
  "kind": "finding",
  "decision": "Pass VER-001: criteria 1 to 7 are met at code identity 5da914ad2b8b2032c6347690f4ad78e0212585af709ccba85cdfaaa1859f9ebe. Board F1 (follow-up): two older paragraphs of scripts/kit/README.client.md still call instance planning pending. Section 'What runs here, and what does not' (lines 255-256) reads 'Planning commands inside a fresh instance remain pending upstream WO-202'. Section 'Kit files and instance files' (lines 316-317) reads 'Running planning commands inside a fresh kit is a separate pending capability; the upstream WO-202 tracks it.' Both contradict the 'Planning in this instance' section this order adds, and the README is every export's front door. Route: follow-up. Criterion 5 names the content of 'Planning in this instance', which is present and accurate, and main had no instance planning, so no criterion and no behavior main had is broken. F2 to F4 are D010 to D012; the planning record is D013.",
  "evidence": [
    "grep -n WO-202 scripts/kit/README.client.md at the subject: the only hits are lines 256 and 317. HEAD's README has the same two sentences (lines 204 and 265), so the new section was added without revising them.",
    "My fixture export of the subject (committed source copy, launchpad export, commit, npm ci --offline, 2026-10-12): the exported README.md is byte-identical to scripts/kit/README.client.md, and KIT-MANIFEST.json lists scripts/kit/README.client.md."
  ],
  "rejected": [
    {
      "option": "Judge criterion 5 unmet",
      "reason": "Criterion 5 asks what 'Planning in this instance' names and that the README travels manifest-listed; both hold. The stale sentences are in other sections."
    },
    {
      "option": "State the gap only in the report",
      "reason": "A defect met in verification is boarded with a follow-up, not left as a report sentence."
    }
  ],
  "followup": "Before the operator's first export, remove or rewrite the two sentences in scripts/kit/README.client.md that call instance planning pending: 'Planning commands inside a fresh instance remain pending upstream WO-202' (What runs here, and what does not) and 'Running planning commands inside a fresh kit is a separate pending capability; the upstream WO-202 tracks it.' (Kit files and instance files). Keep the console row's unavailability, and name any remaining limit (live transports, the release close) as that limit. Check: neither 'pending upstream WO-202' nor 'WO-202 tracks it' remains in the template; npm test -- --only launchpad and --only launchpad-planning pass. Within the declared surface and the Boy Scout bound.",
  "reopenWhen": "A repair edits scripts/kit/README.client.md, or an exported README still calls instance planning pending."
}
```

## WO-202-D010 — Verification: board the release-surface read, which fails on docs/LEGAL.md once an instance order exists

```json
{
  "id": "WO-202-D010",
  "date": "2026-10-12",
  "dispatch": "resume: verify; VER-001",
  "kind": "finding",
  "decision": "Board F2 (follow-up). The fixture runs npm run release -- check-surfaces --local only with no lifecycle order. There the new kit branch (scripts/release.mjs line 3086) prints 'release surfaces unavailable in this fresh instance'. In my export, after the README's own first-steps item 6 (activate WO-001), the read exits 1 because the seed heading has no version. Core gives the same order-state error before release prepare. With a version in the heading, the read exits 1 on two FAIL lines. One is the release block, order state that release prepare writes. The other is 'license-surfaces docs/LEGAL.md pins: observed docs/LEGAL.md is missing or is not a contained regular file'. docs/LEGAL.md is a core-only input the kit neither seeds nor reports unavailable, so an instance's release-close read fails on it once an order exists. Route: follow-up. Criterion 2 asserts the fresh fixture export, where the read exits 0. The Design excludes performing a release close. The client README already lists release-surfaces as core-only on docs/LEGAL.md, and main failed this read in a kit too.",
  "evidence": [
    "Copy of my fixture export (2026-10-12, under harness bounded). Before activation: check-surfaces --local exits 0 with the unavailable line. After npm run resume -- activate WO-001 docs/work-orders/WO-001-environment-truth.md: exit 1, 'work-order heading must contain exactly one strict vX.Y.Z version'. With the heading set to (v0.1.0): exit 1. The only non-PASS lines are the release-block FAIL and the docs/LEGAL.md pins FAIL.",
    "npm run release -- prepare --local in that copy refuses with 'release prepare requires the selected wo-NNN worktree', so the prepared state was approximated by the version edit alone.",
    "A variant of scripts/test-launchpad-planning.mjs that activates WO-001 and commits before the command list (2026-10-12, under harness bounded): 30 of 31 commands exit 0. The planning list holds after activation; only check-surfaces --local exits 1, on the heading version.",
    "WO-201 VER-002 criterion 2 records the same docs/LEGAL.md pins failure for the release-surfaces suite once the seed heading carries a version."
  ],
  "rejected": [
    {
      "option": "Judge criterion 2 unmet",
      "reason": "The criterion names the fixture export, where the read exits 0, and the order's Design records rather than performs the release close."
    },
    {
      "option": "Ask for the zero-order branch to be removed",
      "reason": "It replaces the base's raw 'invalid current work-order id: none' with a named state, which is correct for a fresh instance."
    }
  ],
  "followup": "Make the local release-surface read hold in an instance with a prepared order. Either the instance owns docs/LEGAL.md (a seed or a declared instance action, with pins from its own license decision), or the read reports docs/LEGAL.md unavailable by name instead of failing on core's pins. Add an export fixture case that activates WO-001, gives it a version and its release block, and runs npm run release -- check-surfaces --local. Coordinate with WO-083, whose real run performs the first instance release close.",
  "reopenWhen": "An instance's release close fails on docs/LEGAL.md, or WO-083 activates before this lands."
}
```

## WO-202-D011 — Verification: board publication:check's absence rule, which does not distinguish an undeclared instance from a core checkout missing its editions

```json
{
  "id": "WO-202-D011",
  "date": "2026-10-12",
  "dispatch": "resume: verify; VER-001",
  "kind": "finding",
  "decision": "Board F3 (follow-up). publication:check's new early exit (scripts/check-publication.mjs line 48) passes whenever both edition files are absent, before any other check and in any checkout. In a core clone of the subject, deleting both edition files exits 0 with 'publication: no editions declared' (main exits 1). That also skips the audience-index coverage and dual-voice checks while the index is present. In my export, a present audience-status-index.md with no editions passes unchecked, and --expect-stale and --print-locks exit 0 with nothing to compare. A partial declaration still fails, but with a raw Node ENOENT stack, as on main, not a named error. Route: follow-up. Criterion 4 asks exactly that no edition files pass, stating none is declared, and that holds. The planning receipt's criterion:4 reopening condition for editions (one file removed) does not occur: one removed file still exits 1 at both the base and the subject.",
  "evidence": [
    "Core clone of the subject in session scratch (2026-10-12, under harness bounded). Intact: exit 0, 254/254 headings indexed. software-engineer-toc.md removed: exit 1, ENOENT stack. Both removed: exit 0, 'publication: no editions declared'. With HEAD's check-publication.mjs and one edition removed: exit 1, ENOENT stack.",
    "My fixture export: with software-engineer-toc.md copied in alone, exit 1 with an ENOENT stack. With only audience-status-index.md copied in: exit 0, 'publication: no editions declared'. --expect-stale and --print-locks with no editions: exit 0 each."
  ],
  "rejected": [
    {
      "option": "Judge criterion 4 unmet",
      "reason": "Its text, 'with no edition files, npm run publication:check passes stating none is declared', holds in every probe."
    },
    {
      "option": "Route the core weakening as blocking",
      "reason": "The order's Design specifies this pass, and main's refusal was an uncaught ENOENT, not a designed check."
    }
  ],
  "followup": "Distinguish an undeclared publication from a missing one in scripts/check-publication.mjs. Pass with 'publication: no editions declared' only when no publication declaration exists: no audience-status-index.md, base outline, dual-voice sample or edition file. When any of them is present, a missing edition fails naming the file instead of raising ENOENT, and --expect-stale with no editions fails. Cases: a core clone with both editions deleted exits 1; a kit holding only the index exits 1 naming the missing editions; a fresh kit still passes.",
  "reopenWhen": "A core checkout passes publication:check without its edition files, or a repair changes the early exit."
}
```

## WO-202-D012 — Verification: board the instance refutation's goal standard, which carries core's purpose and critical-path targets

```json
{
  "id": "WO-202-D012",
  "date": "2026-10-12",
  "dispatch": "resume: verify; VER-001",
  "kind": "finding",
  "decision": "Board F4 (follow-up). In an export, npm run plan -- refute reports the instance's vision, roles, capability table and critical path as unavailable. But the goal-review subject still reads the 'Goal-aligned decisions' section from the carried docs/product/07-execution-guide.md (scripts/lib/plan-subject.mjs line 562). That text states core's purpose and its critical-path targets: product 07 line 69, 'The current critical-path plan targets the always-on runtime, its first real external source change and an independently verified source-to-deliverable loop'. It also links a critical-path file the instance does not have. An instance's refuter therefore judges the instance's orders against core's targets, while the same subject says the instance has declared no critical path. D002's 'without borrowing core goals' does not hold for this input. Route: follow-up. Criterion 2 asks for a prompt built from the export's own sequence and order, which holds (WO-001 and the seeded sequence are in it), and main could not build the prompt in a kit at all.",
  "evidence": [
    "My run of scripts/test-launchpad-planning.mjs at the subject (2026-10-12, under harness bounded, 31 of 31 commands exit 0). The plan -- refute row's goalReview.goalStandard begins '## Goal-aligned decisions' and carries the critical-path sentence above. The subject's standard.unavailable lists docs/product/00-vision.md, docs/product/13-uifa-roles.md and docs/planning/capability-table.md, and its critical path reads 'unavailable: docs/planning/critical-path-2026-09-08.md; this instance has not declared a critical path'."
  ],
  "rejected": [
    {
      "option": "Judge criterion 2 unmet",
      "reason": "The prompt contains the export's own sequence and order, as the criterion states."
    },
    {
      "option": "Prescribe which carried sentences are core-specific",
      "reason": "The carried guide is the instance's operating contract; separating its platform rules from core's targets is a design choice for the repair."
    }
  ],
  "followup": "In a kit, keep core's purpose and critical-path targets out of the instance's refutation goal standard. Either read it from an instance-owned declaration, reported unavailable by name when absent as the critical path already is, or pass only the platform-neutral decision rules of 'Goal-aligned decisions'. State which in the client README's 'Planning in this instance'. Check: in the export fixture the refute prompt names no core critical-path target while plan receipt and plan check still pass, and core's historical subject hashes are unchanged (plan-refutation-current).",
  "reopenWhen": "An instance's first planning pass files a refutation that cites core's critical path, or a repair changes the goal-review subject."
}
```

## WO-202-D013 — Verification: planning receipt 044's criterion:4 reopening condition for WO-202 has occurred through its score-row branch, independently of this order

```json
{
  "id": "WO-202-D013",
  "date": "2026-10-12",
  "dispatch": "resume: verify; VER-001",
  "kind": "finding",
  "decision": "Record that the reopening condition of planning receipt 2026-10-11-planning-fb68306765535a9d-044's criterion:4 known issue for WO-202 has occurred through its score-row branch. In a core clone of the subject, removing one score row from docs/publication/reader-scores.jsonl leaves npm run reader -- check at exit 0. The same probe with main's reader scripts also exits 0, so the behavior predates this order and is not caused by its optional handling. The new no-records path also requires docs/control/reader-profiles.json and docs/publication/examples to be absent, and with every score row removed core still takes the validating path (5 surfaces, 15 examples). The edition branch does not occur: removing one edition file exits 1 at both the base and the subject (D011). The receipt's criterion:2 condition did not occur: the planning suite took 33.15 s in the executor's final review and 40.8 s in my run, below 123.776 s. Route: planning, not blocking.",
  "evidence": [
    "Core clone in session scratch (2026-10-12, under harness bounded). Subject scripts: intact, exit 0 with 10 releases; last row removed, exit 0 with 9; all rows removed, exit 0 with surfaces 5 and figures []. HEAD's reader.mjs and lib/reader-profiles.mjs: intact, exit 0; last row removed, exit 0.",
    "The verify briefing's planning receipt 044 known issues for WO-202, criterion:4 and criterion:2, and their Reopen when text."
  ],
  "rejected": [
    {
      "option": "Fail VER-001 on it",
      "reason": "Criterion 4 holds, and the observed pass is main's behavior, not this change's."
    }
  ],
  "followup": "Next planning pass: reopen receipt 044's criterion:4 known issue for WO-202, as its condition requires. Decide whether npm run reader -- check should know which published releases must carry score rows, so that a missing row fails; that pass predates WO-202. Weigh it with D011's publication absence rule.",
  "reopenWhen": "A planning pass disposes the reopened issue, or a repair changes the reader's no-records path."
}
```

## WO-202-D014

<!-- integration refs/dotln/checkpoint/WO-202/6 -->

```json
{
  "id": "WO-202-D014",
  "date": "2026-10-12",
  "dispatch": "resume: final review; worktree integrate WO-202",
  "decision": "Integration took in nothing: the base and the fetched main are both b96a69a6d640046c2dce5653aeb4bcd4249f2b31, origin/main names the same commit, origin lists no wo-202 branch, and the branch carries no commit of its own. The helper checkpointed the work (refs/dotln/checkpoint/WO-202/6), retained its named stash ca66f29a4e4f7d0de0531ed879399d9dcead6278, took the intake backup from a fresh npm run backup:intake of the three ignored intake files into the session scratch, re-applied the work without an authored conflict and regenerated projections only: the runtime snapshot, the harness bundle and manifest (unchanged against main; harness check passes with 34 surfaces), the control projection, the release preparation (meter and PR stub), this record's stub, the decisions index, register and meta, the work-order index, the sibling registry and the publication locks. Every acceptance claim is carried forward unchanged: VER-001's seven criterion judgments at code identity 5da914ad2b8b2032c6347690f4ad78e0212585af709ccba85cdfaaa1859f9ebe, the executor's passing npm test -- --review row at that identity (2026-10-12T15:21:52.139Z, 38 suites, composed from 88 passing tasks with format and skeleton fresh, exit 0), VER-001's four follow-ups as boarded (D009 to D012) and its planning record (D013), and the executor's self-review (found 3, fixed 3). gateCodeIdentity returned the same identity after integration; the identity moved only afterwards, by this review's own README fix (D015). Release preparation keeps application v0.78.0 under the order's minor classification: local tags and origin both end at v0.77.0, which names the base commit, and neither lists v0.78.0; check-surfaces --local reports no component bump required for any of the six workspaces, and package.json, package-lock.json and packages/*/package.json are not in the diff, so no component version or dependency collides. No evidence edition is registered to this order (scripts, kit templates and documents changed; packages/* did not), so integration owes no re-mint. The printed affected checks all pass on the integrated tree.",
  "evidence": [
    "refs/dotln/checkpoint/WO-202/6",
    "base b96a69a6d640046c2dce5653aeb4bcd4249f2b31",
    "upstream b96a69a6d640046c2dce5653aeb4bcd4249f2b31",
    "git ls-remote origin main wo-202 at 16:53Z: refs/heads/main b96a69a6; no wo-202 ref; git log main..HEAD empty",
    "release preparation: WO-202 target v0.78.0 remains current. Files changed: docs/evidence/WO-202/meta.json, docs/final-reviews/WO-202/PR.md. Meter snapshot: docs/evidence/WO-202/meta.json, 4091 bytes. Tag observation: local snapshot only.",
    "Affected checks under node scripts/harness.mjs bounded, one at a time, 2026-10-12T17:02:29Z to 17:02:44Z, each exit 0: npm run publication:check (254/254 headings; both editions CURRENT, 29 and 45 sections), node scripts/harness.mjs check (34 generated surfaces), npm run release -- check-surfaces --local (release block v0.78.0 against latest local tag v0.77.0; six components src unchanged, no bump required), node scripts/lineage.mjs index --check (170 sections), node scripts/check-publication.mjs --print-locks (both locks equal the committed values), npm run format:check, git diff --check. npm test -- --review is run in the handoff sequence and recorded in FINAL-001.",
    "gateCodeIdentity after integration: 5da914ad2b8b2032c6347690f4ad78e0212585af709ccba85cdfaaa1859f9ebe; git diff --stat main -- .claude .agents .codex is empty"
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    },
    {
      "option": "Treat the regenerated meter, PR stub and indexes as a changed subject",
      "reason": "Product 07 §Independent workflows and integration: regenerating projections is integration bookkeeping and never a finding; no judged code byte changed at integration."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-12. Original base: `b96a69a6d640046c2dce5653aeb4bcd4249f2b31`.
Fetched main: `b96a69a6d640046c2dce5653aeb4bcd4249f2b31`. Checkpoint: `refs/dotln/checkpoint/WO-202/6`.
Named stash retained: `ca66f29a4e4f7d0de0531ed879399d9dcead6278` (WO-202 integrate 2026-10-12).
Intake backup: `DotLn-wo202-intake-20261012T165756Z.zip` in the session scratch (3 files), verified by the helper against the current intake.
Resolved projections: none.
Release preparation: WO-202 target v0.78.0 remains current. Files changed: docs/evidence/WO-202/meta.json, docs/final-reviews/WO-202/PR.md. Meter snapshot: docs/evidence/WO-202/meta.json, 4091 bytes. Tag observation: local snapshot only.
Carried-forward claims: VER-001's seven criterion judgments and the executor's passing review row at code identity `5da914ad…`, which the integrated tree keeps; VER-001's F1 to F4 as boarded (D009 to D012) and its planning record (D013); the executor's self-review (found 3, fixed 3). No acceptance claim changed, because integration changed no judged byte; this review's own README fix (D015) moved the identity afterwards and is covered by the fresh gates in FINAL-001.
Authored conflicts observed: none.
Affected checks: all seven pass on the integrated tree (evidence above); the review gate is in FINAL-001.

## WO-202-D015 — Final review: fix VER-001's F1 in the client README inside the declared surface

```json
{
  "id": "WO-202-D015",
  "date": "2026-10-12",
  "dispatch": "resume: final review; VER-001 F1 (D009, FUP-272d6f1078ad6b3b)",
  "kind": "finding",
  "decision": "Fix VER-001's F1 in this review instead of leaving it boarded: replace the two sentences of scripts/kit/README.client.md that called instance planning pending upstream WO-202. In §What runs here, and what does not, the limits paragraph now says planning commands run here, points to §Planning in this instance and names the three remaining limits as limits: the console-dependent collection of plan conditions, a live refutation or entropy review being the operator's rather than any fixture's, and npm run release -- check-surfaces --local still reading docs/LEGAL.md, which the kit does not seed, once an order carries a version (D010). In §Kit files and instance files, the pending-capability sentence now points to §Planning in this instance for the commands and seeds. This is a documentation change in a surface the order declared (step 8), inside the Boy Scout bound, and it changes no behavior: the fixture reads neither sentence, the WO-201 case asserts the README's lists and table (untouched), and the WO-074 case re-hashes the template. The template is in the code identity, so the identity moves from 5da914ad… to 527e4e17146b12711c9b79b7dd6800bc9227bf1fbac9cf76b418316846a8ff66 and the review gate runs fresh rather than composed; that cost is accepted because the operator exports the first real instance as soon as this order closes, and the README is that instance's front door.",
  "evidence": [
    "grep -n 'WO-202\\|pending upstream\\|tracks it' scripts/kit/README.client.md after the edit: the only hit is the update-preview sentence naming WO-203, which remains true.",
    "node scripts/harness.mjs bounded -- node --test scripts/test-launchpad-planning.mjs at the new identity, 2026-10-12T17:01:27Z to 17:02:11Z: 1 of 1 pass, 42,982 ms; 31 commands exit 0 in 34,123 ms, every command and exit code equal to commands-final.json (one row differs only in the spelling of the entropy fixture's temporary path).",
    "npm run format:check and git diff --check pass after the edit; the launchpad suite (template hash, seed list, update case, WO-201 README assertions) runs fresh in the review gate recorded in FINAL-001."
  ],
  "rejected": [
    {
      "option": "Leave F1 boarded for the next order that edits the template",
      "reason": "The next such order is WO-203, after the operator's first export; the contradiction would ship in that export's front door, and the fix is two sentences in the declared surface."
    },
    {
      "option": "Route F1 through repair and a fresh verification",
      "reason": "It breaks no criterion and no behavior main had; product 07 routes it as a follow-up, and a documentation fix inside the Boy Scout bound needs no behavioral certification."
    },
    {
      "option": "Also seed docs/LEGAL.md or change the release-surface read here",
      "reason": "That is F2's behavioral repair (D010, FUP-a065bc5b99e40660); a reviewer writes no behavioral fix. The README now names the limit instead."
    }
  ],
  "reopenWhen": "An exported README again calls instance planning pending, or the release-surface read changes so that the named limit no longer holds."
}
```

## WO-202-D016 — Final review: pass FINAL-001 at the integrated subject; the allocated rows disposed, the fired trigger re-disposed

```json
{
  "id": "WO-202-D016",
  "date": "2026-10-12",
  "dispatch": "resume: final review; FINAL-001",
  "kind": "finding",
  "decision": "Pass the final review of WO-202 at the integrated subject, code identity 527e4e17146b12711c9b79b7dd6800bc9227bf1fbac9cf76b418316846a8ff66 (VER-001's identity 5da914ad… plus D015's README fix). All seven criteria hold: the base probe table, the fixture's 31 passing commands with the planning branch, the instance-built prompt, the fixture receipt, the passing check, the entropy subject and fake review; the five seeds written once, listed, unlisted in the manifest and untouched by an update; the publication, reader and absent-tag behavior; the README section; the write-backs; and the gates. This review found no new defect beyond VER-001's four follow-ups: F1 is fixed here (D015); F2 (D010), F3 (D011) and F4 (D012) stay boarded as behavioral follow-ups with their register rows untriaged for planning, and D013's planning record stands. Known issues: planning receipt 044's criterion:4 condition occurred through the score-row branch independently of this order (D013), and its criterion:2 condition did not occur (the planning suite took 33.1 s in the executor's row and 43.0 s under this review's bounded run, against 123.776 s). Register: FUP-8b8eb522d1d136c0, FUP-749c959a41178a3b and FUP-a4b2cdfb03ddbd2e are settled by what the change did; FUP-a058e82c0bbd9b6d is settled by the default-export qualification with its non-default remainder re-boarded as FUP-cb5c3b3e7d0b0c0d (D005); FUP-272d6f1078ad6b3b is settled by D015; FUP-1315c82ef74fb832, whose condition (the next order that edits scripts/resume.mjs) fired again, is deferred again with the observation; FUP-b531e850b70f6d4e and FUP-e96221b106cd136a stay open with this order's launchpad task reading (323,617 ms fresh in the executor's first full review, above twice the pre-WO-201 123,776 ms reading) added to planning's bound question; the other 25 textually matched rows are left as they are because this change opened none of their seams and none of their conditions occurred.",
  "evidence": [
    "docs/final-reviews/WO-202/FINAL-001.md: criterion judgments, Executed checks and the findings block",
    "D014 (integration took in nothing) and D015 (the README fix)",
    "VER-001 (pass; D009 to D013) at code identity 5da914ad…, report hash sha256:8bb5da4d… equal to the recorded VerificationCompleted reportHash",
    "This review's bounded run of scripts/test-launchpad-planning.mjs at 527e4e17… (31 of 31 commands exit 0) and the seven affected checks (D014)",
    "The fresh npm run test:docs and npm test -- --review rows at 527e4e17… recorded in FINAL-001's Executed checks after this decision was written"
  ],
  "rejected": [
    {
      "option": "Fail the review on F3 (publication:check passes in a core checkout with both editions deleted)",
      "reason": "Criterion 4 and the Design require the pass with no edition files; main's refusal was an uncaught ENOENT, not a check; product 07 routes a defect outside the criteria that breaks no behavior main had as a follow-up, and D011's repair rule is boarded."
    },
    {
      "option": "Triage F2 to F4 and the D005 remainder here",
      "reason": "They are the order's own boarded follow-ups for planning, not rows this change opened or whose conditions occurred; the final review disposes allocated rows and fired triggers, never widens the order."
    },
    {
      "option": "Reuse the executor's composed review row instead of a fresh gate",
      "reason": "D015 moved the code identity, so no row at this identity exists; the order names npm test -- --review at final review and the handoff sequence runs it."
    }
  ],
  "reopenWhen": "A criterion judged met is shown unmet at this identity, an instance's first planning pass contradicts a parity claim the README or product 07 makes, or a register disposition above is shown wrong."
}
```

## WO-202-D017 — Final review: D008's readiness failure recurred in the fresh review gate; rerun composed, D008 reopened

```json
{
  "id": "WO-202-D017",
  "date": "2026-10-12",
  "dispatch": "resume: final review; FINAL-001 fresh review gate",
  "kind": "finding",
  "decision": "Record the recurrence of D008's supervisor readiness failure and rerun the review gate composed at the unchanged identity. This review's fresh npm test -- --review at code identity 527e4e17146b12711c9b79b7dd6800bc9227bf1fbac9cf76b418316846a8ff66 (90 fresh tasks, 1,456,630 ms, recorded 2026-10-12T17:39:07.349Z) passed 37 of 38 suites; skeleton failed on exactly D008's case, 'WO-184 criterion 17: built CLI supervisors kill their episode group on all terminal signals', with 'episode group never started' after 5,114 ms (its five-second readiness timer), failure kind surviving-process naming two node processes that a ps lookup a minute later did not find, under shared load (host load per CPU 0.98 with four concurrent tasks; the runner's worker-transport deadline was also hit once in that task with cause unestablished). The same case passed in isolation under node scripts/harness.mjs bounded at this identity (exit 0, 5,467 ms). No runtime source changed in this order (packages/* is unchanged against main) and this review changed two README sentences, so the failure is attributed to the known intermittent readiness timeout, not to the subject. The review gate is rerun: the runner composes the 89 passing tasks at this identity and reruns skeleton fresh, the rule the runner-fixtures case 'review composition retains source rows and reruns a task whose latest single-suite execution failed' covers. No timer or assertion is relaxed and no task is bypassed. D008's reopening condition, the timeout recurring, has occurred: this decision reopens it and the register row FUP-3b39865f91df30a7 is set open for planning with the second observation.",
  "evidence": [
    "Gate row npm test at 527e4e17…, gateSelection review, executionMode fresh, exit 1, 1456630 ms, recorded 2026-10-12T17:39:07.349Z: 38 suites, 90 fresh tasks, 37 passed; skeleton 246,674 ms exit 1 with failureKind surviving-process (pids 7583 and 7539), launchpad 315,190 ms exit 0, launchpad-planning 32,977 ms exit 0, runner-fixtures 93,711 ms exit 0.",
    "The skeleton output log (docs/control/local/harness/check-output/344050b0…log) line 1904: not ok 221, duration_ms 5113.93, error 'episode group never started', stack at resident-actors.test.js:37 Timeout._onTimeout; every other skeleton case ok.",
    "ps -p 7583,7539 at 17:40Z: neither process exists.",
    "node scripts/harness.mjs bounded -- node --test --test-name-pattern='built CLI supervisors kill their episode group' packages/skeleton/dist/test/resident-actors.test.js at 17:40:15Z to 17:40:20Z: exit 0, 5,467 ms.",
    "D008: the same case failed once in the executor's second fresh full review (1,480 s) and passed fresh in the composed run (229,886 ms) and in isolation; the executor's first fresh full review (1,507 s) passed it. With this review's run, the case has failed in two of three fresh full reviews of this subject."
  ],
  "rejected": [
    {
      "option": "Accept the failed fresh row because every other suite passed",
      "reason": "Criterion 7 and the order's final criterion need a passing npm test -- --review row at the code identity; the runner's composition supplies one honestly by rerunning the failed task."
    },
    {
      "option": "Increase the readiness timer or change runtime code",
      "reason": "No cause is established and a reviewer writes no behavioral fix; D008's follow-up owns the reproduction."
    },
    {
      "option": "Consume the executor's composed row at 5da914ad…",
      "reason": "D015 moved the identity; a row at another identity is not evidence for this one."
    }
  ],
  "reopenWhen": "The case fails in the composed rerun, or a controlled reproduction identifies the cause.",
  "reopens": {
    "decisionId": "WO-202-D008",
    "observation": "The readiness timeout recurred in WO-202's final-review fresh gate at 527e4e17… under shared load and the isolated case passed again: two failures in three fresh full reviews of this subject. Priority is no longer low pending recurrence."
  }
}
```
