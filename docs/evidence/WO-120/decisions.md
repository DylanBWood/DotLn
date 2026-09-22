# WO-120 decisions

## WO-120-D001

```json
{
  "id": "WO-120-D001",
  "date": "2026-09-22",
  "dispatch": "resume: next",
  "decision": "Record derived allocations in per-order control segments, reuse the worker-store lock across materializers in a launchpad, and activate through the existing resume command. Keep allocated drafts in phase none (displayed as draft) until activation.",
  "evidence": [
    "docs/work-orders/WO-120-derived-work-identity.md",
    "scripts/lib/control.mjs",
    "scripts/lib/control-store.mjs",
    "scripts/lib/config.mjs",
    "packages/skeleton/src/worker-store.ts",
    "packages/skeleton/src/resident-store.ts"
  ],
  "rejected": [
    {
      "option": "NoOp",
      "reason": "Leaves compiled/runtime work without a durable document identity, blocking the WO-100/WO-115 consumers."
    },
    {
      "option": "A separate identity family or lifecycle",
      "reason": "Splits the operator view and duplicates existing lifecycle authority."
    },
    {
      "option": "A separate global allocation journal",
      "reason": "Per-order allocation events retain existing segmented storage, replay and provenance without another journal consumer."
    },
    {
      "option": "Allocate by directory maximum alone",
      "reason": "Cannot replay identity after interrupted file creation and cannot bind retries to their original request."
    }
  ],
  "reopenWhen": "Concurrent callers collide, restart changes an identity, control consumers misclassify drafts, or a consumer requires cross-launchpad allocation. The lock guarantee is for one shared launchpad, not disconnected Git copies."
}
```

## WO-120-D002

```json
{
  "id": "WO-120-D002",
  "kind": "experiment",
  "date": "2026-09-22",
  "dispatch": "resume: next",
  "decision": "Keep the current implementation/check workflow; decline a separate optimization comparison.",
  "question": "Would a separate focused-test timing experiment reduce implementation cost for this new persistence contract?",
  "alternatives": [
    "Time focused versus full checks before implementing the contract",
    "Use focused development checks and the required final gate without a separate timing experiment"
  ],
  "observation": "There is no implemented derived-identity baseline providing equivalent outcomes yet.",
  "budget": {
    "wallSeconds": 60
  },
  "execution": "declined",
  "reason": "A timing comparison before equivalent persistence/restart coverage exists would not establish a safe recurring saving.",
  "cost": {
    "wallSeconds": 35.518,
    "tokens": null,
    "commands": [
      "python3 decision-record creation"
    ],
    "source": "Session transcript timestamps: required writer registration completed at 2026-09-22T01:20:32.742Z; decision preparation and recording completed at 01:21:08.260Z, a 35.518-second window. The broader announcement-to-record interval was 83.873 seconds, including 48.355 seconds of prerequisite role setup excluded from this decision cost. Token attribution unavailable."
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": [
      "No experiment executed"
    ],
    "summary": "Current workflow retained; no saving measured or claimed."
  },
  "outcome": "kept-current",
  "regression": "unknown",
  "history": {
    "lastAdoptedImprovementAt": null,
    "experimentsSinceAdoption": null
  },
  "evidence": [
    "WO-120-D001 source inspection"
  ],
  "rejected": [
    {
      "option": "Run a benchmark now",
      "reason": "No equivalent outcome baseline."
    }
  ],
  "reopenWhen": "Repeated implementation of this path provides comparable passing checks and measurable recurring cost."
}
```

Same-day measurement correction: the initial 0.000119-second value measured only
a prefix of the record-writing script, not decision preparation and recording.
The checked transcript interval above replaces that incomplete measurement and
also exposes the broader elapsed time. No timing experiment ran and no saving
is claimed.

Goal and critical path: durable identity lets future derivation and UI filing enter the same source-to-deliverable workflow. Policy resistance and fixes that fail: preserve lifecycle gates and dependency checks. Commons: one local writer/lock, no delegated agents or new service. Drift to low performance and rule beating: test actual activation, collision refusal, replay, exhaustion and resident restart, not just rendering. Escalation: one allocation event and one existing activation path. Success to the successful: a separate journal was compared and rejected for extra consumers, not familiarity. Shifting the burden: retry recovers an interrupted materialization from retained control evidence. Seeking the wrong goal: identity parity and recoverable work are the outcome, not receipt volume. Naive Interventionism: preserve handwritten paths and IDs, do not change compiler semantic hashing, and scope section validation to generated files until WO-113 owns broader enforcement. NoOp leaves the observed gap.

New required inputs: control/store/config/path/dependency helpers, index/resume consumers, worker lock and resident configuration/status code, relevant configuration/index/resident tests and the gate suite registry. These are implementation dependencies of WO-120.

## WO-120-D003

```json
{
  "id": "WO-120-D003",
  "date": "2026-09-22",
  "dispatch": "resume: next",
  "decision": "Stage application v0.41.0 and skeleton 0.35.0; keep allocation recovery separate from activation and preserve reviewed authority files.",
  "evidence": [
    "Local annotated release baseline v0.40.2; WO-120 declares minor",
    "packages/skeleton/src/dotln.ts and worker-status.ts add compatible CLI/status behavior",
    "scripts/test-derived-orders.mjs: ten passing fixtures include the complete fail/repair/pass/close lifecycle, concurrent allocation and restart",
    "npm run release -- prepare --local and check-surfaces --local: passed",
    "npm run publication:check: passed after updating section coverage and source locks"
  ],
  "rejected": [
    {
      "option": "Bump unchanged compiler, kernel or console source versions",
      "reason": "Only skeleton behavior changes; console follows its exact dependency pin."
    },
    {
      "option": "Mutate a CompiledProgram after its semantic hash is computed",
      "reason": "Would invalidate artifact identity. The API accepts a WorkOrder and returns the allocated contract for downstream compilation."
    },
    {
      "option": "Restore an initial generated draft when an activated authority disappears",
      "reason": "Could lose reviewed edits. Recovery recreates missing unactivated files only; activated files require recovery of reviewed bytes."
    },
    {
      "option": "Overwrite files on retry",
      "reason": "Human edits must be retained; an edited draft requires explicit resume activation."
    }
  ],
  "reopenWhen": "A supported consumer requires distributed allocation across disconnected launchpads, automatic derivation, or an identity inside an already hashed CompiledProgram. Those require a new bounded contract, not weakening replay or authority checks."
}
```

The first release-prepare call refused the unassigned title without writes. The executor completed the order's authorized version assignment and reran it successfully. Initial standalone resume fixtures inherited the live Codex session and encountered their strict status-key assertion; rerunning with CODEX_THREAD_ID removed passed. The canonical runner already removes that variable. No product defect was inferred from the standalone environment mismatch.

## WO-120-D004

```json
{
  "id": "WO-120-D004",
  "date": "2026-09-22",
  "dispatch": "resume: next; final source review of the derived authority root",
  "decision": "Require authority files to remain physically inside both their configured authority root and the launchpad before direct activation.",
  "evidence": [
    "The new direct-activation fixture failed before the fix: resume activate returned exit 0 for a derived root symlink pointing into a separate synthetic temporary directory.",
    "scripts/lib/paths.mjs previously checked physical containment only against the configured authority root, which could itself point outside the launchpad.",
    "The first product gate was stopped through the canonical evidence --stop command after 50.2 seconds, with no passing check recorded, before editing gate inputs."
  ],
  "rejected": [
    {
      "option": "Rely only on materializeOrder destination checks",
      "reason": "An operator can use resume activate directly on a filed authority."
    },
    {
      "option": "Defer the gap",
      "reason": "The derived-root extension must retain the promised contained authority path."
    }
  ],
  "reopenWhen": "A supported authority intentionally lives outside the launchpad and a separately authorized contract defines how to bind and review it."
}
```

## WO-120-D005

<!-- integration refs/dotln/checkpoint/WO-120/6 -->

```json
{
  "id": "WO-120-D005",
  "date": "2026-09-22",
  "dispatch": "worktree integrate WO-120; resume: final review",
  "decision": "Integrate origin/main into the reviewed worktree as a fast-forward, resolve the single authored conflict in docs/product/06-roadmap.md by keeping both release-boundary records and retiming WO-120's stated baseline from v0.40.2 to the v0.40.3 tag this integration brought in, and keep the assigned application version at v0.41.0 because the next minor above v0.40.3 is unchanged. Every carried-forward acceptance claim is re-established on the integrated tree by the reviewer's own product gate rather than inherited from the pre-integration gate.",
  "evidence": [
    "refs/dotln/checkpoint/WO-120/6 (ab762b704dea42f597f4dc9b5ed0b0933c8002af)",
    "base 532059e38ec342b0b501e5ad717b0c6d69d08775",
    "upstream 0a23a611fa2b758e1f66c86a65156429c9f313b3",
    "The merge is a fast-forward: before is an ancestor of upstream, so no merge commit and no rewritten history.",
    "Retained stash a3ac1b011589f1afc674c251c2379071db8a43f4 (WO-120 integrate 2026-09-22); untrackedConflicts empty; receipt stage applied, complete true.",
    "Authored conflict docs/product/06-roadmap.md Release boundary: upstream's WO-063 v0.40.3 record versus this order's WO-120 v0.41.0 record. Both kept; WO-120's baseline sentence retimed to name the v0.40.3 tag.",
    "git tag --sort=-v:refname: v0.40.3 is the highest local tag after the fetch, so the minor above it remains v0.41.0 and no version assignment changed.",
    "Projections resolved by the helper and regenerated, not hand-merged: README.md, docs/control/current.md, both publication edition locks, docs/work-orders/README.md.",
    "Reviewer product gate on the integrated, staged tree: npm test -- --review, 33 passed, 0 failed, 513.315 s, 77 fresh tasks, exit 0, sandbox.inForce false, codeIdentity 8b79bbb74e595f02d49c2feb4abb0f3d5f38d0dba68d47ae6680db708b6616c1, treeHash 24b99454fd6eb30a5807ac0b568c51b5b5c2fc7d, recorded 2026-09-22T02:44:38.903Z.",
    "The executor's and verifier's gates both recorded codeIdentity eb763419feb5b97cd16ff68a0d4ac7b1a6ef460ebda4998934e6cf25f61aa201, computed while this order's three new source files were still untracked; gateCodeIdentity enumerates git ls-files, so neither identity bound scripts/lib/derived-contract.mjs, scripts/lib/derived-orders.mjs or scripts/test-derived-orders.mjs. Staging them first moved the identity, which is why the reviewer's gate is the one publication consumes.",
    "Affected checks printed by the integrate command, all re-run after the source fix: npm run publication:check (274/274 headings, both editions current), node scripts/harness.mjs check (31 generated surfaces), npm run release -- check-surfaces --local (all PASS). npm run plan -- check exits 0; format:check, work-orders index --check and both git diff --check invocations are clean."
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    },
    {
      "option": "Carry the pre-integration gate forward as this review's evidence",
      "reason": "The base moved by three commits, including new machinery from WO-063 that the runner selects. An acceptance claim measured before the move is not a claim about the tree being published."
    },
    {
      "option": "Raise the assigned version because the base moved",
      "reason": "The classification is minor and the next minor above the newly observed v0.40.3 tag is still v0.41.0. Retiming restates the baseline; it does not change the assignment."
    },
    {
      "option": "Drop the upstream WO-063 release-boundary record to resolve the conflict",
      "reason": "Both records are history. The conflict is adjacency in one section, not a contradiction."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification. Also reopen if a newer tag is observed at release close that makes v0.41.0 no longer the next minor."
}
```

Integration date: 2026-09-22. Original base: `532059e38ec342b0b501e5ad717b0c6d69d08775`.
Fetched main: `0a23a611fa2b758e1f66c86a65156429c9f313b3`. Checkpoint: `refs/dotln/checkpoint/WO-120/6`.
Named stash retained: `a3ac1b011589f1afc674c251c2379071db8a43f4` (WO-120 integrate 2026-09-22).
Resolved projections: README.md, docs/control/current.md, docs/publication/everyday-ai-user-toc.md, docs/publication/software-engineer-toc.md, docs/work-orders/README.md.
Release preparation: WO-120 target v0.41.0 remains current; no files changed.
Tag observation: local snapshot only..
Carried-forward claims: completed by the reviewer. All six acceptance criteria are re-established on the
integrated tree by this review's own 33-suite product gate at code identity `8b79bbb7`, not inherited from
the pre-integration gate; the release target is retimed and unchanged at `v0.41.0`; no acceptance claim
rests on a moved base.
Authored conflicts observed: docs/product/06-roadmap.md.
Affected checks were printed by the command and all four were executed and passed; see the evidence list above.

## WO-120-D006

```json
{
  "id": "WO-120-D006",
  "date": "2026-09-22",
  "dispatch": "resume: final review",
  "decision": "Fix, inside this review and inside this order's own diff, the omission of the new intent command from the dotln CLI usage string, and re-run the product gate at the corrected code identity rather than boarding the omission up as a follow-up.",
  "evidence": [
    "packages/skeleton/src/dotln.ts:66-70: the guard is `if (!directory && command !== \"intent\")`, so `dotln` with no arguments, and `dotln <unknown>` without --store, both throw the long usage string. That string listed resident, presence, status, demo, verify-demo and feedback-audit, and not intent.",
    "The fallback message that does name intent, `expected intent, resident, presence, ...`, is only reachable when --store IS supplied with an unrecognised command, so the most common discovery path never showed the new command.",
    "The order delivers `dotln intent` under acceptance criterion 3 and documents it in docs/product/07-execution-guide.md as `npm run dotln -- intent \"Describe the work\"`, so the CLI contradicted its own shipped documentation.",
    "No fixture or test asserts the usage string: grep over scripts/ and packages/ finds the literal only at its two definition sites in packages/skeleton/src/dotln.ts.",
    "Executed after the fix: npm run build, then `node packages/skeleton/dist/src/dotln.js` with no arguments prints the usage string now leading with `dotln intent \"<prose>\"` and exits 1.",
    "Reviewer product gate re-run at the corrected identity: npm test -- --review, 33 passed, 0 failed, 513.315 s, 77 fresh tasks, exit 0, codeIdentity 8b79bbb74e595f02d49c2feb4abb0f3d5f38d0dba68d47ae6680db708b6616c1, recorded 2026-09-22T02:44:38.903Z. The pre-fix gate at codeIdentity ebd37c320c2d6a55e9eebbefd6502d8d87d395a18851ca34c99519b245601dcb also passed 33/0 in 514.634 s, so the fix is not load-bearing for any suite."
  ],
  "rejected": [
    {
      "option": "Board the omission up as a follow-up instead of fixing it",
      "reason": "The skill admits either, but this is a one-line string inside a file the order already changes, with no test dependency and no behavioural path. Boarding it up would defer a completeness gap in the order's own new surface at no saving other than one gate run."
    },
    {
      "option": "Fix it without re-running the product gate",
      "reason": "The edit is tracked non-generated code, so it moves gateCodeIdentity. Publishing against a gate row that did not include the edited bytes would make the row a claim about a tree nobody ran."
    },
    {
      "option": "Also rewrite the usage string's structure or split it per command",
      "reason": "Beyond the bound. The defect is one missing alternative, not the message's shape; restructuring it would be a reviewer-authored change no independent verification saw."
    }
  ],
  "reopenWhen": "Another dotln subcommand is added without appearing in the usage string, or a fixture is added that pins the usage text and disagrees with it."
}
```

The cost of this correction is stated rather than hidden: one additional full product gate, 513 seconds of wall clock, for a help-text line. That is the honest price of fixing source during final review, and it is why the alternative is a legitimate one the skill offers.

## WO-120-D007

```json
{
  "id": "WO-120-D007",
  "date": "2026-09-22",
  "dispatch": "resume: final review",
  "decision": "Record, without repairing it here, that folding the control log re-validates every WorkOrderIdentityAllocated event's embedded authority against the section list hard-coded in scripts/lib/derived-contract.mjs, so a future change to that list can make historical allocation events unfoldable and refuse every control read repository-wide. Carry it as a named follow-up rather than inventing a versioned section contract inside a final review.",
  "evidence": [
    "scripts/lib/control.mjs:60-70: scanControl calls validateAllocation(event) for every WorkOrderIdentityAllocated event it folds.",
    "scripts/lib/derived-contract.mjs:114-138: validateAllocation calls checkGeneratedSections(event.authority, event.workOrderPath), which compares the authority's headings against the module-level `sections` constant and throws when they differ.",
    "scripts/lib/control-store.mjs and scripts/lib/control.mjs foldSegments: a throw from scanControl propagates out of the fold, so it is not scoped to the affected order; resume status --json, the generated index and every lifecycle command read the same fold.",
    "The event embeds the authority bytes as written at allocation time, so the stored bytes are fixed while the constant they are checked against is ordinary source that any later order may edit.",
    "WO-113 is open and owns the broader work-order section contract; its objective explicitly changes the allowed section set, which is the most likely trigger.",
    "Current impact is zero and observed, not assumed: docs/control/orders/ contains no WorkOrderIdentityAllocated event in this repository, so no historical event is exposed today. The risk arrives with the first derived order that is allocated and kept."
  ],
  "rejected": [
    {
      "option": "Stop validating the embedded authority during the fold",
      "reason": "The check is load-bearing today: it is what makes the allocation event a self-describing durable record rather than an unchecked blob, and it is how an edited or forged authority is caught at read time."
    },
    {
      "option": "Add a schemaVersion-keyed section table inside this review",
      "reason": "That is new contract design with its own migration and fixture surface. A reviewer writing it would be the only judge of a change no independent verification saw, and the order's criteria do not ask for it."
    },
    {
      "option": "Leave it as a sentence in FINAL-001 only",
      "reason": "A defect met and not fixed must be reopenable from the order's own decisions file, not only from a review narrative."
    }
  ],
  "followup": "Planner: cut a bounded order that decouples historical WorkOrderIdentityAllocated events from the current section constant, coordinated with WO-113's ownership of the work-order section contract. Scope: give the allocation event's authority check a version the event itself carries, so an event written under one section set keeps folding after the set changes, and make the failure order-scoped rather than fold-wide so one unreadable segment cannot refuse every control read. Acceptance should include a fixture that folds an allocation event whose authority uses a superseded section set, and a fixture proving a genuinely corrupt authority still refuses. Priority: medium before the first derived order is kept in a real control plane; low while none exists.",
  "reopenWhen": "The section list in derived-contract.mjs changes, WO-113 activates, or any WorkOrderIdentityAllocated event is recorded in a control plane that must keep folding across releases."
}
```
