# WO-165 decisions

## WO-165-D001

```json
{
  "id": "WO-165-D001",
  "date": "2026-09-26",
  "dispatch": "resume: next",
  "decision": "Compile every currently supported review route as serial lenses, default to the pinned Claude route, and carry the checklist in residue without changing the feedback protocol or transports.",
  "evidence": [
    "docs/work-orders/WO-165-entropy-review-route-agreement.md",
    "docs/instance/entropy-reducer/runs/REVIEW-003.md ER3-003",
    "docs/instance/entropy-reducer/runs/REFUTATION-004.md ER3-003",
    "packages/skeleton/src/entropy-review-protocol.ts entropyReviewPrompt and validateEntropyReviewRequest",
    "packages/skeleton/src/worker-transport.ts entropyArgs",
    "packages/skeleton/test/entropy-reducer-artifacts.test.ts current identity assertion"
  ],
  "rationale": "Mission and critical path: trustworthy review authority and receipts reduce operator interpretation and rescue in the source-to-deliverable loop. Policy resistance: remove grants the pinned transports cannot exercise. Commons: one read-only review agent, one writer, no descendants; session cap 20. Drift and rule beating: assert actual transport argv, compiled effects, serial Program, prompt checklist and receipt together. Escalation and shifting the burden: use the existing residue field and fake fixture, add no gate or operator intervention. Success to the successful: replace the unused fan-out support instead of preserving it by habit. Seeking the wrong goal: report the actual episode shape rather than nominal parallel capacity. Naive Interventionism: preserve lens content, no-fix bounds, probes, selection and historical receipt bytes; change only current generated artifacts. NoOp retains the reproduced mismatch.",
  "rejected": [
    {
      "option": "Keep the unbound default compile delegating",
      "reason": "All supported routes lack a delegate tool; the historical test actually pins a current hash distinct from immutable historical evidence, so no legacy runtime mode is required."
    },
    {
      "option": "Admit a delegate tool",
      "reason": "Unnecessary authority expansion and feedback behavior change when the existing residue can carry the checklist."
    },
    {
      "option": "Remove lens briefs or rewrite old receipts",
      "reason": "The briefs structure the review and historical receipts judge their original subjects."
    }
  ],
  "reopenWhen": "A separately authorized route supplies a confined delegate tool, or executable evidence shows the serial route loses a required review guarantee."
}
```

## WO-165-D002

```json
{
  "id": "WO-165-D002",
  "date": "2026-09-26",
  "dispatch": "resume: next",
  "kind": "experiment",
  "decision": "Reuse the existing fake-transport fixture; decline a separate economy timing experiment.",
  "question": "Would a separate route fixture harness improve implementation feedback over extending the existing end-to-end fixture?",
  "alternatives": [
    "Extend scripts/test-entropy-review.mjs.",
    "Create and measure a separate route harness."
  ],
  "observation": "The existing fixture already creates isolated repositories, launches fake reviews, files receipts and checks immutable rendering. A separate harness duplicates preparation without evidence of a timing benefit.",
  "budget": {
    "wallSeconds": 120
  },
  "execution": "declined",
  "reason": "The existing fake fixture covers the required route path; another harness duplicates setup with no measured benefit.",
  "cost": {
    "wallSeconds": 0,
    "tokens": null,
    "commands": ["None: separate timing experiment declined before execution"],
    "source": "No timing experiment run; decision recording is part of dispatch cost, whose counters are unavailable."
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": [
      "node scripts/test-entropy-review.mjs"
    ],
    "summary": "Keep the current fixture workflow; no speed improvement claimed."
  },
  "outcome": "kept-current",
  "regression": "unknown",
  "history": {
    "lastAdoptedImprovementAt": null,
    "experimentsSinceAdoption": null
  },
  "evidence": [
    "scripts/test-entropy-review.mjs"
  ],
  "rejected": [
    {
      "option": "Add a second harness",
      "reason": "Duplicates the existing isolated fake-transport path."
    }
  ],
  "reopenWhen": "Measured development feedback cost becomes material or the existing fixture cannot cover route agreement."
}
```

Correction during design: the historical test pins a current compile hash separately from REVIEW-001. The initial idea of retaining a delegating default was unnecessary; historical source and receipt bytes preserve that subject.

## WO-165-D003

```json
{
  "id": "WO-165-D003",
  "date": "2026-09-26",
  "dispatch": "resume: next",
  "decision": "Assign application v0.51.2 and skeleton 0.43.3; regenerate the current compiler/console fixtures and select new authority and artifact-identity editions while retaining historical receipts and other editions.",
  "evidence": [
    "Local latest tag v0.51.1; activation order had no version",
    "docs/evidence/WO-165/route-identities.json",
    "authority-evidence --check detected changed entropy program and unchanged historical subjects",
    "artifact-identity-evidence --check detected stale semantic-hash-inventory",
    "verification-evidence --check and feedback-evidence --check passed",
    "packages/skeleton/src/feedback-audit.ts FEEDBACK_SOURCE_PATHS"
  ],
  "rationale": "The patch corrects an unavailable capability with no new route, dependency or feedback behavior source. Only skeleton source changes; console dependency metadata follows without a console source bump. Compiler fixtures are current projections, not a compiler source change. Authority and artifact output changed and therefore receive immutable new editions; verification and feedback retain passing editions, including their live audit. The refutation plan wording loses its obsolete Program.All explanation without changing selection. Adjacent-0001 pins the planning refuter own role version and tags because inheritance otherwise changed its historical hash; existing authority assertions reproduce its unchanged identity after the pin. This applies D001: smallest reversible correction, unchanged outcome standard, no new process or operator rescue. NoOp leaves stale evidence or unrelated identity drift.",
  "rejected": [
    {
      "option": "Re-mint every edition or run a live feedback episode",
      "reason": "Retained checks pass, feedback protocols/transports are unchanged and version metadata is excluded from behavior identity."
    },
    {
      "option": "Allow planning refuter metadata to drift",
      "reason": "The route correction does not need an unrelated identity change; its existing independent active version already follows the same pattern."
    },
    {
      "option": "Rewrite historical authority outputs",
      "reason": "New editions preserve historical judgments."
    }
  ],
  "reopenWhen": "Integration changes release versions, a retained edition check fails, or a supported route admits delegation."
}
```

## WO-165-D004

```json
{
  "id": "WO-165-D004",
  "date": "2026-09-26",
  "dispatch": "resume: next; operator continue",
  "decision": "Pin mission-check own role version 1, active version 2 and existing tags, and regression-test both derived judges against entry identities.",
  "evidence": [
    "Read-only agent diff review identified missionCheckLoadout inheritance",
    "All entropyReducerLoadout callers are plan-refuter and mission-check",
    "docs/evidence/WO-165/sibling-identities.mjs",
    "docs/evidence/WO-165/sibling-identities.json"
  ],
  "rationale": "Same bounded rationale as D003: the selected route correction must not move unrelated judge identities. The method loads all three entry-source loadouts through Node type stripping, uses identical compiler and unchanged protocols, and compares complete old/current compilation objects. Both agree: plan-refuter fnv1a64:e9f7e0080fcb9810 and mission-check fnv1a64:4c09a5d98f6bc433. Adjacent-0002 was announced, queued and started after the operator said continue; no feedback behavior source changed.",
  "rejected": [
    {
      "option": "Accept inherited identity drift",
      "reason": "Unnecessary downstream change with no review-route benefit."
    },
    {
      "option": "Refactor the shared loadout hierarchy",
      "reason": "Exceeds the bounded fix; explicit own metadata preserves the existing contract."
    }
  ],
  "reopenWhen": "Either judge intentionally changes its own role, active metadata, or contract; update its identity with that change."
}
```

## WO-165-D005

```json
{
  "id": "WO-165-D005",
  "date": "2026-09-26",
  "dispatch": "resume: next; operator requested adversarial subagents",
  "decision": "Qualify the serial receipt phrase as the compiled execution rule, escape custom checklist text, correct artifact migration narration in a fresh edition, and repair the reproduced sparse-array validator hole.",
  "evidence": [
    "Three read-only adversarial reviewers, no descendants; explicit session total three under cap20",
    "Existing blocked-before-census fake fixture and in-memory blocked/failed renderer probes",
    "One multiline custom lensId produced two checklist entries for one Program invocation",
    "A sparse lens array passed map/every and serialized to a null lens; array-only validation also rejects non-array iterables before checking the ceiling",
    "scripts/artifact-identity-evidence.mjs change narration ended at WO-100 despite the WO-165 hash",
    "Entry-source and current sibling identity probes and normalized feedback identity agree"
  ],
  "rationale": "The user requested adversarial improvement. These are current reproducible mismatches with the order objective, not hypothetical new scope. Receipt status is worker-reported and cannot independently prove individual lens completion; the compiled confinement rule remains visible with the required serial phrase. JSON escaping keeps all original structured lens data while preventing extra displayed items. Sparse array members become undefined and fail existing validators; no protocol or feedback behavior source edit is needed. Artifact revision 002 corrects this new evidence narrative while preserving revision 001; authority remains independently checked. D001 goal/trap comparison still applies: stronger negative evidence, unchanged valid behavior, no new authority or gate. NoOp would retain three demonstrably misleading/invalid representations.",
  "rejected": [
    {
      "option": "Treat completed status as independent proof that every lens ran",
      "reason": "The receipt has no per-lens execution witness."
    },
    {
      "option": "Reject all multiline custom brief strings",
      "reason": "Escaping fixes the projection without narrowing valid structured text."
    },
    {
      "option": "Weaken the protocol or rewrite the first artifact edition",
      "reason": "Compiler validation can reject malformed values; immutable evidence receives a new edition."
    }
  ],
  "reopenWhen": "A later route supplies per-lens execution observations, a valid dense brief fails the new checks, or evidence narration again disagrees with recorded identities."
}
```

## WO-165-D006

```json
{
  "id": "WO-165-D006",
  "date": "2026-09-26",
  "dispatch": "resume: verify; independent VER-001",
  "decision": "Pass VER-001 on met criteria 1-5 and board the two minor defects and the non-blocking notes it found, instead of routing a repair. M1: the ENTROPY_REDUCER_ROUTES comment and D001's first rejected-option reason assert, without evidence, that the background route lacks a delegate tool. No WO-165 record engages the planning refutation's known issue on unpinned routes. M2: the WO-165 fixture's residue negative control matches only the removed wording, not delegate language in general. Correction to D001: the background worker's tool surface is session-attested and unobserved, because no filed receipt ran on that route. It compiles serial lenses by rule, not because a delegate tool was observed to be absent.",
  "evidence": [
    "packages/skeleton/src/loadouts/entropy-reducer.ts:894-895 comment 'Every admitted route lacks a delegate tool' over a list that includes background",
    "scripts/lib/entropy-review.mjs:1122-1134 background route prints the prompt for a worker the session spawns; the attested tools are copied from ENTROPY_REVIEW_TOOLS, not observed",
    "docs/instance/entropy-reducer/runs/*.md: all five actor lines read route launched, transport claude-cli-print; no background receipt exists",
    "docs/planning/refutations/2026-09-25-planning-c93346fb3a92bb7f-030.json WO-165 criterion:1 known-issue and its reopenWhen",
    "scripts/test-entropy-review.mjs:1084-1087 regex /fan-out|four-delegate|delegate reads|delegated|Program.All/iu matches the HEAD residue but none of 'Delegate up to four read-only lenses', 'delegate.readonly', '4 delegates-maximum'",
    "docs/verifications/WO-165/VER-001.md criterion judgments and notes N1-N12"
  ],
  "rationale": "Mission and critical path: the order's objective is that the envelope, residue and receipt describe the episode that ran. Both pinned routes reproduce that, and receipts label serial lenses as an execution rule that leaves completion unobserved, so neither defect misdescribes an episode. Policy resistance and escalation: failing on a comment and a regex spends a full repair and re-verification cycle, and no criterion is at stake. Drift to low performance and rule beating: boarding with a named follow-up keeps both defects visible, not waved through. Shifting the burden: the correction to D001 is recorded here now, not left to a later reader. Success to the successful: nothing is preserved by habit. Seeking the wrong goal: the verdict follows the criteria, not an idealized design. Commons: one root writer, four read-only agents under cap 20. Naive Interventionism would have the verifier edit the subject it judges. NoOp would leave an unsupported claim as report prose only, which the verifier duty forbids.",
  "rejected": [
    {
      "option": "Fail VER-001 and route M1 and M2 to resume: fix",
      "reason": "Every criterion is met by independent reproduction; the defects are a source comment, a decision reason and a narrow negative control."
    },
    {
      "option": "Correct the comment or the fixture during verification",
      "reason": "The verifier never edits the implementation it judges."
    },
    {
      "option": "Leave M1 and M2 as report sentences",
      "reason": "A defect met and not fixed needs a structured follow-up."
    }
  ],
  "followup": "WO-165 final review may, within the boy-scout bound, correct M1 (the ENTROPY_REDUCER_ROUTES comment states that the background worker's tool surface is unobserved and serial by compiled rule) and M2 (the residue negative control rejects delegate wording generally, for example /delegat|fan-?out|Program\\.All/iu). Otherwise nominate each through the adjacent queue at close with its VER-001 id. Notes N1-N12 need no change unless their reopening condition is met.",
  "reopenWhen": "An episode runs on the background route or another unpinned route and a delegate tool is observed in its surface, delegate wording returns to the residue, or a note is shown to falsify a criterion."
}
```

## WO-165-D007

<!-- integration refs/dotln/checkpoint/WO-165/6 -->

```json
{
  "id": "WO-165-D007",
  "date": "2026-09-26",
  "dispatch": "worktree integrate WO-165; resume: final review",
  "decision": "Integrate main d3768d2d (WO-115, published v0.52.0) into the WO-165 subject at final review and carry every VER-001 claim forward unchanged. The uncommitted branch fast-forwarded from f73b7e18 under the helper's named stash; five bookkeeping conflicts were resolved by hand: the skeleton bump is retimed from 0.43.3 to 0.44.1 over main's 0.44.0 as the same bounded correction (console pin and lockfile follow; console 0.3.0, compiler 0.19.1, kernel 0.6.0 and beacons 0.1.0 are main's values), the authority edition is re-minted as WO-165/002 on the integrated source while artifact identity stays at WO-165/002 and verification and feedback at WO-161/001 and WO-070/001, and the roadmap keeps both orders' activation notes plus the helper's retime note and a dated integration note. release prepare retimed the application target from v0.51.2 to v0.52.1 under the patch classification. main touched none of this order's source surfaces, so no resolution changed behavior, contracts, authority or acceptance, and no repair or new verification is opened.",
  "evidence": [
    "refs/dotln/checkpoint/WO-165/6",
    "base f73b7e184b38de9cab97b4e86c718b6006f6b19d",
    "upstream d3768d2d9df919a3a03678f8308ddbc67c81b4b5",
    "Integration receipt: phase final-review; preservation commit a4bc4d47 (refs/dotln/checkpoint/WO-165/6); base f73b7e18 -> upstream d3768d2d by fast-forward, so mergeCommit is null; stash be6e01e9 (WO-165 integrate 2026-09-26) retained; intake backup verified against the current three intake files; --continue completed all nine regeneration steps with no pending step",
    "Authored conflicts: docs/evidence/current.json, docs/product/06-roadmap.md, package-lock.json, packages/console/package.json, packages/skeleton/package.json; git diff --stat HEAD main over the loadouts, protocol, transport, receipt renderer, fixture, evidence scripts, compiler fixtures, skeleton entropy tests and instance documents is empty",
    "Retimed component: @dotln/skeleton 0.44.1 (main holds 0.44.0 from WO-115); product 07 Independent workflows admits retiming a bump upstream consumed under its declared impact",
    "node scripts/authority-evidence.mjs --check at WO-165/001 on the integrated source: stale WO-165 revision 001 evidence: bundle-diff.json; --write --edition WO-165 --revision 002 recorded 34 bundle comparisons; --check twice: exit 0, byte-identical output, no Retained line; revision 002 differs from 001 only in the bundle comparison's before hashes and label (the integrated harness surface); compatibility, frozen, widening, narrowing, restoration, explicitGrant and projections are equal",
    "Integrated-tree checks: harness check 31 generated surfaces; harness-context --check every ceiling within; release check-surfaces --local 51 PASS 0 FAIL; release prepare --local: v0.52.1 remains current; plan check exit 0; entropy check status ok; meta --check exit 0; publication:check current (30 and 45 linked sections); evidence:artifact, evidence:verification, feedback and evidence:console checks pass; format:check clean; git diff --check clean",
    "Product gate on the integrated tree: recorded in FINAL-001 (npm test -- --review after the last source edit)"
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    },
    {
      "option": "Keep skeleton 0.43.3 or reuse main's 0.44.0",
      "reason": "0.43.3 is below the version main published and 0.44.0 would label two different skeleton sources the same; the retime keeps the declared patch-level impact."
    },
    {
      "option": "Keep authority edition WO-165/001",
      "reason": "Its check fails on the integrated harness surface; an immutable edition is re-minted, never rewritten."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-09-26. Original base: `f73b7e184b38de9cab97b4e86c718b6006f6b19d`.
Fetched main: `d3768d2d9df919a3a03678f8308ddbc67c81b4b5`. Checkpoint: `refs/dotln/checkpoint/WO-165/6`.
Named stash retained: `be6e01e9109cccaff087c6eb070e6a250c569642` (WO-165 integrate 2026-09-26).
Resolved projections: README.md, docs/control/current.md, docs/planning/followups.json, docs/publication/everyday-ai-user-toc.md, docs/work-orders/README.md.
Release preparation: Retimed WO-165: v0.51.2 → v0.52.1.
Files changed:
  docs/work-orders/WO-165-entropy-review-route-agreement.md
  README.md
  docs/product/06-roadmap.md
  docs/final-reviews/WO-165/PR.md
Tag observation: local snapshot only..
Carried-forward claims: VER-001's judgments on criteria 1 to 5, its two minor defects and its twelve notes carry forward unchanged, because main touched no source surface the order cites; the reviewer's own reproductions, checks and gate on the integrated tree are in FINAL-001.
Authored conflicts observed: docs/evidence/current.json, docs/product/06-roadmap.md, package-lock.json, packages/console/package.json, packages/skeleton/package.json.
Affected checks: run by the reviewer on the integrated tree and recorded in this decision's evidence and in FINAL-001.

## WO-165-D008

```json
{
  "id": "WO-165-D008",
  "date": "2026-09-26",
  "dispatch": "resume: final review; FINAL-001",
  "decision": "Correct VER-001's two boarded minor defects within the final review's boy-scout bound, as D006's follow-up invites, instead of nominating them at close. M1: the ENTROPY_REDUCER_ROUTES comment now states that every admitted route compiles serial lenses by rule, that the two pinned CLI routes are observed to pass no delegate tool, that the background worker's tool surface is session-attested and unobserved, and that the fake route is a fixture. M2: the fixture's residue negative control becomes /delegat|fan-?out|Program\\.All/iu, which rejects delegate wording generally. Neither correction changes a compiled byte, a contract, authority or acceptance, so no repair or new verification is opened; D006's follow-up is discharged by this record and FINAL-001.",
  "evidence": [
    "docs/verifications/WO-165/VER-001.md M1 and M2; docs/evidence/WO-165/decisions.md D006 followup",
    "packages/skeleton/src/loadouts/entropy-reducer.ts ENTROPY_REDUCER_ROUTES comment; scripts/test-entropy-review.mjs WO-165 pinned-routes test residue control",
    "Reproduction after the edits: compileReviewerWorkOrder from dist for all four routes yields the recorded after hashes e3505eb7f111ba22, 30c4e134587e445f, e091eca53bad2e11 and 051216f1a90c7998 with resourceLimits {probes: 32}, no delegate effect and an identical residue equal to RESIDUE.md",
    "Control probe: the new regex matches the f73b7e18 residue and each of 'Delegate up to four read-only lenses', 'delegate.readonly' and '4 delegates-maximum', and does not match the current residue; node scripts/test-entropy-review.mjs 21 passed, 0 failed",
    "prettier --check on both files: clean; git diff --check clean"
  ],
  "rationale": "Mission and critical path: the order's objective is that records describe the episode that ran; an unsupported claim in the route comment and a control that matches only the removed spelling are the same drift the order removes. Rule beating and drift to low performance: the stronger control catches delegate wording under any spelling. Naive Interventionism and the reviewer's boundary: a comment and a test regex are not behavioral fixes, the compiled identity is unchanged by reproduction, and a fresh product gate ran on the integrated subject in any case. Commons: no agent, no live episode. NoOp would carry two known records defects to the adjacent queue for a later order to fix at higher cost.",
  "rejected": [
    {
      "option": "Nominate M1 and M2 through the adjacent queue at close",
      "reason": "Both fixes are within the named paths and the boy-scout bound, and the review's gate covers them."
    },
    {
      "option": "Also rewrite D001's rejected-option reason",
      "reason": "D006 records the correction; filed decisions are not rewritten."
    }
  ],
  "reopenWhen": "An episode on the background route or another unpinned route observes a delegate tool in its surface, or delegate wording returns to the residue under a spelling the control misses."
}
```
