# WO-232 decisions

## WO-232-D001 — Exercise an older exported instance without rewriting its records

```json
{
  "id": "WO-232-D001",
  "date": "2026-10-25",
  "dispatch": "resume: next",
  "decision": "Keep the exported kit and synthetic records in one committed Git bundle, with a second ref carrying the synthetic target history. Generate lifecycle and amendment events through the kit commands. Update a clone with the current kit and compare authored records byte for byte before and after its own checks. Exclude this core-only fixture and suite from kit exports so regeneration never nests a previous bundle.",
  "evidence": [
    "The work order's cited instance passes describe closed amendments, closed self members, moved bound decisions and a provisional target base; README.md records the source-to-shape mapping.",
    "scripts/launchpad.mjs KIT_FILES includes the entire scripts tree unless a path is explicitly excluded; an included history bundle would travel inside the next exported kit.",
    "scripts/test-launchpad-planning.mjs and scripts/test-workstream-pilot.mjs demonstrate scratch source commits, synthetic judgments, local forge transport and the actual target-records command."
  ],
  "rejected": [
    {
      "option": "Records-only bundle with a newly installed kit",
      "reason": "It requires reconstructing the prior kit preimages before an update can be judged. Keeping the exported kit directly exercises the ordinary manifest comparison. The final bundle is 4,174,480 bytes; suite measurements are recorded below."
    },
    {
      "option": "Generate the historical lifecycles at every gate",
      "reason": "The order explicitly reserves regeneration for a newly reported shape; the gate needs only a clone, an update and the instance checks."
    },
    {
      "option": "A kit action edits closed records or withdraws amendments",
      "reason": "The instance owns those records. Narrow reader admissions preserve the existing authorization bindings."
    },
    {
      "option": "NoOp",
      "reason": "The existing fresh-instance fixtures do not exercise the accumulated records that the cited updates refused."
    }
  ],
  "reopenWhen": "An instance reports a shape the manifest lacks, the bundle growth makes full-kit storage material, or a release needs a record field no admission can grandfather."
}
```

## WO-232-D004 — Keep the synthetic judgment's observed subject stable

```json
{
  "id": "WO-232-D004",
  "date": "2026-10-25",
  "dispatch": "resume: next",
  "decision": "Record planning-cost evidence before the synthetic planning judgment, then retain those observations through execution. Have the generator run the planning check before emitting its bundle. Link the checkout's local formatter into scratch installs and require the offered reader bytes after every update. Preserve exported configuration and use the ordinary lifecycle dispatch spelling in synthetic decisions.",
  "evidence": [
    "An initial control retained locally reformatted kit readers. The fixture's node_modules lacked .bin, so its formatter came from the surrounding environment. The suite now rejects any retained offered reader and verifies installed bytes directly.",
    "The corrected-reader control recorded both self members current/stale no but refused planning: observed evidence or goal standard changed. A bounded comparison of the receipt's subject and the fixture HEAD showed equal standards, no observed metrics at judgment, and new lifecycle metrics after the generator's final meta --plan-cost. Retaining the original table removes that unrelated evidence change without relaxing the check.",
    "The final generator completed in 47,633 ms and passed docs-check and refute-plan check before writing the 4,174,480-byte bundle. Its SHA-256 is e5ab2fe0db7a4269730fa13e069a4f3bca87e5cce293802d80f37e081a04f6bf; the manifest records both refs and the scratch source commit.",
    "The first complete gate stopped at configuration-root because the new generator and support file used literal document paths. They now use the shared defaultDocRelative helper for this default-layout fixture. The guard remains unchanged, and the generator was rebuilt successfully after the repair.",
    "Earlier fixture setup failures identified an absent target worktree parent, missing scratch terms file, a replaced export configuration, an invalid synthetic dispatch prefix, and a missing initial committed cost table. These are corrected in the new generator, not changes to existing product policy.",
    "One failed control's document command reached an arbitrary 240-second child timeout while host lanes were occupied. The helper now lets the outer runner own deadlines; elapsed measurements include waiting."
  ],
  "rejected": [
    {
      "option": "Relax goal-evidence equality or rewrite the synthetic receipt after execution",
      "reason": "That would change production policy or conceal a different judged subject. The requested historical shapes do not require new post-judgment observations."
    },
    {
      "option": "Accept an update that leaves a locally edited reader installed",
      "reason": "The control would no longer compare the offered base and head readers."
    }
  ],
  "reopenWhen": "A new historical shape requires genuinely changed planning observations, or the kit changes its dependency-install or file-ownership contract."
}
```

Goal-alignment traps: treating a newer grouping rule as authority to rewrite
closed records, allowing the field exception to hide substantive changes,
and repeatedly rebuilding history inside the gate. The implementation keeps
the update's write boundary, checks rejected mutations, and consumes a
committed bundle. The no-op retains the observed compatibility gap.

The first generator attempt stopped at an intermediate `sync` after both
self orders closed: release-surface selection reported no open order.
The generator now refreshes the three needed indexes at that boundary;
the final fixture has an active target order and still runs ordinary sync.

## WO-232-D002

```json
{
  "id": "WO-232-D002",
  "date": "2026-10-25",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.98.0, the next minor above the observed release baseline v0.97.1, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.97.1 (ancestral local release tags, excluding annotated starter refresh tags)",
    "minor classification declared in docs/work-orders/WO-232-a-release-does-not-break-the-instance.md"
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

## WO-232-D003 — Admit grouping metadata without relaxing substantive authority

```json
{
  "id": "WO-232-D003",
  "date": "2026-10-25",
  "dispatch": "resume: next",
  "decision": "Normalize exactly one new leading Workstream line only when the filed amendment source has no such field, preserving all other bytes and line endings. Admit a closed member without the field from its validated workstream document and carry that effective membership into index facts. Read a self member's base and target from the same main ref. Keep a member in at most one workstream.",
  "evidence": [
    "executionAmendmentSource previously normalized only release labels; requireMatchedAmendments checks the historical binding independently of the current judged horizon.",
    "readWorkstreams already receives rows with their control phase, but readTargetFacts selects rows by their workstream grouping; merely suppressing the closed-member refusal would leave its Git observation missing.",
    "The baseline instance-history control reproduces unmatched execution amendment WO-001 and two closed self members marked diverged/stale yes on a branch one commit past main.",
    "scripts/test-plan-refutation.mjs adds changed criterion, objective, dependency and Cost controls plus malformed, duplicate, body and existing-field cases. scripts/test-work-orders.mjs covers closed and open members, contradictory membership and the advanced branch."
  ],
  "rejected": [
    {
      "option": "Normalize all leading metadata or rewrite amendment rows",
      "reason": "Repository, effort, scope and criteria remain part of the approved authority; a grouping exception grants no wider edit."
    },
    {
      "option": "Admit open members without their declaration",
      "reason": "The open order's declaration still drives its active grouping and must agree with the document."
    },
    {
      "option": "Use an activation checkpoint as the self base",
      "reason": "Closed members would remain behind indefinitely; the order explicitly chooses the launchpad base branch as their reference."
    }
  ],
  "reopenWhen": "A supported metadata shape cannot be admitted without hiding an authority change, or a self member gains a separately owned base."
}
```

## WO-232-D005 — Synchronize the incident assertion with publication

```json
{
  "id": "WO-232-D005",
  "date": "2026-10-25",
  "dispatch": "resume: next; Adjacent Repair",
  "decision": "Repair the existing detached-descendant regression test within its current bounded wait: require both process death and the incident file before reading the incident. Retain the memory-budget classification and killed-process assertions. The production guard and time bound remain unchanged.",
  "evidence": [
    "The complete review at code identity f73dc015d8ae1b60ec149fe2ad8f2f164155f0fe3053c7d75a348157dabe6fbe ended with 36 suite groups passed and 6 failed; runner-fixtures failed and its dependent groups were unrun. The duplicate-pruning case passed its stopped-process assertion, then readFileSync at scripts/test-host-guard.test.mjs:770 raised ENOENT for the expected latest incident.",
    "scripts/host-guard.mjs constructs the incident with stopCandidate(candidate), which calls killOwned, and only afterward calls appendIncident. scripts/lib/host-resources.mjs publishes the latest-incident file after writing the host ledger. Process death therefore does not imply that the file is already present.",
    "The isolated original case passed once, which does not disprove this interleaving. The repaired isolated case also passed. The complete gate remains the completion evidence; isolated results do not replace it.",
    "adjacent-0001 records the diagnosed cause, single test-file scope, intent announcement, actor-attested message-boundary check-in and required complete-gate check."
  ],
  "rejected": [
    {
      "option": "Retry the full gate without a change",
      "reason": "The source ordering exposes a concrete synchronization gap; a lucky retry would leave the test race intact."
    },
    {
      "option": "Publish before stopping the over-budget process or remove the incident assertion",
      "reason": "The product should stop the process promptly, and the test must continue to prove the stop's reason and ownership."
    }
  ],
  "reopenWhen": "The guard's incident contract changes, or the bounded wait observes a stopped process without its required incident."
}
```

Correction: an intermediate chat update said the second complete run had no
reported failure after reading only the log tail. The full runner log already
contained the duplicate-pruning failure. Reading its failed result established
the missing-file error above; the update was corrected before any completion
claim. Subsequent gate conclusions use the recorded outcome and failed rows.

The repaired test passed in the next complete run: `runner-fixtures` took
113.62 s, and the complete review finished with 42 suite groups passed and
zero failed. `adjacent-0001` is completed at queue revision 5 with that
passing row as its check evidence.

## WO-232-D006 — Record the fresh suite cost separately from host waiting

```json
{
  "id": "WO-232-D006",
  "date": "2026-10-25",
  "dispatch": "resume: next; complete review",
  "decision": "Retain the committed full-kit history bundle and the core-only update suite. Record its observed task runtime against the order's plain-gate median, while keeping complete-gate elapsed time and host-capacity waiting separate. Regenerate history only when a newly reported shape is added.",
  "evidence": [
    "The final bundle is 4,174,480 bytes. Its generator completed outside the gate in 47.633 s. The final paired control used the same bundle: base exit 1 in 26.412 s, head exit 0 in 25.877 s; controls.json records the digest, reader digests and each command result.",
    "The fresh complete review recorded at 2026-10-25T06:03:04.569Z passed at code identity 1964e7d07ce7b3f247922b3db29c1aaba65a41d57fad333389ad1d6fafd63f5e: 42 required suite groups, 108 fresh tasks, zero reused tasks, zero unrun suites and no failed case. Code identity and build output were unchanged throughout the run.",
    "instance-history passed in 48,028 ms from 2026-10-25T05:50:34.536Z to 2026-10-25T05:51:22.575Z; its scheduler duration was 48,039 ms, including 10 ms of host-lane waiting. It recorded zero excluded evidence reads. Its 48.028 s task runtime is 14.62 percent of the work order's cited 328.6 s plain-gate median.",
    "The complete review took 3,915.159 s. The runner recorded 2,183.083 s of wall time waiting for host lanes: 2,181.959 s behind another checkout and 1.124 s with the holder relation unknown. The critical path did not include instance-history. These are observations from one concurrent run, not a measured additive gate overhead or a new uncontended median.",
    "Evidence reference: host-gate:1964e7d07ce7b3f247922b3db29c1aaba65a41d57fad333389ad1d6fafd63f5e:npm test. The passing row covers the order's product preflight suites and the adjacent test repair."
  ],
  "rejected": [
    {
      "option": "Charge all complete-gate elapsed time to the new suite",
      "reason": "The runner separately observed host-capacity waiting, concurrent work and a critical path through other tasks; this run does not isolate an additive wall-clock cost."
    },
    {
      "option": "Rebuild lifecycle history during each gate or omit the compatibility check",
      "reason": "On-demand generation keeps ordinary gates to the update and instance checks. Omitting the suite retains the reported field-only detection gap."
    }
  ],
  "reopenWhen": "A new reported shape requires regeneration, or repeated comparable measurements show the suite or bundle cost warrants a different representation without losing the update proof."
}
```

## WO-232-D007 — Admit the field without unbinding amendments the previous release bound

```json
{
  "id": "WO-232-D007",
  "date": "2026-10-25",
  "dispatch": "resume: verify",
  "decision": "VER-001 fails on a reproduced regression of behavior main had, which product 07 §Verification review and attack routes as blocking. executionAmendmentMatch now reads the current source through executionAmendmentSource(after, before), which deletes a leading **Workstream:** WS-NNN line whenever the filed source lacked one. The reader of v0.96.0 to v0.97.1 bound amend-order rows over the current source with the line kept, so a binding recorded after an operator added the field together with any non-append change includes the line. The subject's current form drops the line and no longer matches the bound prefix; its legacy form requires that form to begin with the filed source, which a mid-text change breaks. The plan gate then refuses the instance's unchanged records with unmatched execution amendment and offers only withdrawal or restored bytes. That is the failure this order exists to prevent, contrary to its Design (admit, do not migrate) and to the rule its product 07 sentence states. Criterion 3's three named clauses still hold. The verifier leaves the implementation unchanged.",
  "evidence": [
    "docs/evidence/WO-232/verification-001-amendment.mjs, reader arm: a binding computed by the base reader over the field plus an objective change matches under the base reader and fails under the subject's; a field-only base binding matches under both; an objective binding with the field added later matches only under the subject, the intended admission. Exit 1.",
    "The same file, instance arm: a clone of the committed history bundle, with the three base readers installed, WO-001 and WO-002 at their bound bytes and WS-001 reduced to WO-004, binds WO-004's field and grouped objective with amend-order (exit 0) and passes refute-plan check (exit 0). With the subject's readers installed over the same committed records, refute-plan check exits 1: unmatched execution amendment WO-004 row 5; withdraw it explicitly or restore its approved bytes.",
    "scripts/lib/plan-continuation.mjs is the same blob, bdfe1919, at v0.96.0, v0.97.1 and the activation base a81561976c86; plan-receipts.mjs differs between v0.96.0 and the base only in targetOrderPathAdvisories. The Workstream field was introduced at v0.96.0.",
    "The bundle's WO-002 and WO-004 bindings were recorded by the subject's own reader (orderLength 340 and 406 exclude the 23-byte field line), so instance-history cannot observe a binding the previous release made, and its head arm passes on this subject."
  ],
  "rejected": [
    {
      "option": "Follow-up because criterion 3's clauses hold",
      "reason": "Product 07 routes a regression of behavior main had, shown by a probe, as blocking whatever the criterion lines say; the refused shape is reachable through amend-order on every release from v0.96.0 to v0.97.1."
    },
    {
      "option": "Leave withdrawal as the instance's remedy",
      "reason": "The order's Design and Non-goals rule out asking an instance to withdraw or rewrite a binding, and its Read before upgrading says no instance record edit is required."
    }
  ],
  "followup": "WO-232 repair: the amendment match admits every binding the previous release's reader admitted, for example by also accepting the current source without the leading-field normalization, so the normalization only widens what matches. Changed criterion, objective, dependency and Cost bytes after binding still refuse under both readings. Add a plan-refutation case in which a binding computed by the base reader over the field and a mid-text change passes the plan gate under the subject, and keep product 07's and the Read before upgrading's binding sentences true for that shape.",
  "reopenWhen": "verification-001-amendment.mjs exits 0 on the repaired subject and an independent re-verification confirms the base-reader binding and the existing refusal cases."
}
```

## WO-232-D008 — The history fixture holds only fields and bindings its own kit produced

```json
{
  "id": "WO-232-D008",
  "date": "2026-10-25",
  "dispatch": "resume: verify",
  "decision": "Follow-up, not blocking. Criterion 1's four shapes are present, but every WS-001 member declares the field and every amendment in the bundle was bound by the subject's reader. With the base readers installed, the suite's npm run sync and index --check pass, so instance-history does not observe the v0.96.0 refusal of a closed member without the field, and it passed over D007's regression. This breaks no criterion; it is a coverage gap in a declared surface, and an instance of the planning receipt's known issue that regeneration with the current kit can hide shapes only an older kit emitted.",
  "evidence": [
    "The verifier's independent base arm (exerciseHistory with the a81561976c86 readers): npm run sync and npm run work-orders -- index --check exit 0; only plan check and the document gate's plan tasks fail, on WO-001 row 1. controls.json's base arm records the same.",
    "Bundle main: WO-001, WO-002 and WO-004 each carry **Workstream:** WS-001; the WO-002 and WO-004 PlanExecutionAmended rows exclude the field line under the subject's normalization."
  ],
  "rejected": [
    {
      "option": "Block on the coverage gap",
      "reason": "Criterion 1 names shapes (a) to (d), which are present and verifiable; criterion 4's admission is covered by the work-orders-fixtures case."
    }
  ],
  "followup": "WO-232 repair within the Boy Scout bound, or the next planning pass: add a closed self member without the field (the v0.96.0 sync refusal) to the manifest so the suite's base arm fails on it, and decide whether the fixture holds a binding recorded by the previous release's reader (D007's shape), which a generator that binds only with the current kit cannot produce; record the choice in the decisions.",
  "reopenWhen": "A release passes instance-history while an instance reports a refusal on a closed member without the field or on an amendment the previous release bound."
}
```

## WO-232-D009 — Preserve the prior binding representation while adding the field admission

```json
{
  "id": "WO-232-D009",
  "date": "2026-10-25",
  "dispatch": "resume: fix",
  "decision": "Separate release-label normalization from the Workstream admission. Match the stored amendment hash against the release-normalized source with its field retained as well as the source with one newly added exact leading field removed. Return the matching source for the existing appendix check. Keep the legacy activation-label safeguards and the current writer's binding unchanged. The rule is monotone compatibility: a binding admitted by the previous release remains admitted, and the new field reading only adds matches; neither reading admits later substantive changes.",
  "evidence": [
    "VER-001 F1 and D007 select the repair. The baseline plan-continuation.mjs at a81561976c8629834a5a18623b097fa4d7d8681a normalizes the release label using the filed title but retains the Workstream field.",
    "node scripts/harness.mjs bounded -- node docs/evidence/WO-232/verification-001-amendment.mjs reproduced exit 1 at 2026-10-25T12:02:30.177Z: the base-reader field-plus-objective binding matched at the base and failed at the subject; the cloned instance's planning check likewise changed from exit 0 to exit 1 over unchanged records.",
    "The same unchanged probe exited 0 after the repair at 2026-10-25T12:04:14.308Z. Both old-binding cases match under both readers, the later-added-field admission still matches under the subject, and the cloned instance's amendment and both planning checks exit 0.",
    "scripts/test-plan-refutation.mjs now includes independent historical binding bytes for unlabelled, placeholder and versioned filed titles, an approved criterion and objective change, later release retiming, an appended execution record, rejected criterion/objective/dependency/Cost/field mutations and a rejected non-execution appendix. The historical hashes are not computed through the current writer's normalizer. The complete gate judges these cases at handoff."
  ],
  "rejected": [
    {
      "option": "Remove the new field admission or do nothing",
      "reason": "Removing it restores the original closed-order failure; leaving the current reader unchanged preserves the reproduced regression. Both violate the order's compatibility objective."
    },
    {
      "option": "Accept the legacy no-filed-source representation without its safeguards",
      "reason": "It differs for labels appended to originally unlabelled titles and carries separate activation-only constraints. The historical current representation must keep the filed-title context."
    },
    {
      "option": "Withdraw or rewrite the stored amendment",
      "reason": "The instance's approved records did not change, and the work order forbids migration as the remedy."
    }
  ],
  "reopenWhen": "A binding the prior reader accepts is rejected after an update, or either representation admits a post-binding substantive mutation."
}
```

Correction to D003's implementation assumption: removing the field from every
current source was not sufficient to preserve existing bindings. The checked
baseline reader retained it when the amendment was made after grouping. The
repair retains that representation alongside the admission; no filed report
or historical amendment was changed.

Goal alignment: the two traps are losing old authorization while admitting new
metadata, and accepting changed authority through a broad fallback. Matching
both exact representations and retaining the appendix and hash checks addresses
both. NoOp leaves the reproduced update failure. The bounded before/after
probe changes only the subject reader and observes the same stored binding.

The first repair review found a setup error in the three new tests: the
orders declared WS-001 without its document. The run was stopped through
`harness evidence --stop` after the named failure, retaining its failed row
at code identity `542dfed2827e146c08356b98dc3d13faaa17ad9b483c623ea8fd546baffc631d`.
The fixtures now include that document, and the changed-field assertion
tests the matcher directly so a membership error cannot mask its result.
The bounded reproduction selecting those three failed cases passed all three
at 2026-10-25T12:15:26.328Z; it does not replace the fresh complete review.

The fresh complete review passed at 2026-10-25T12:44:55.886Z, code identity
`d96de5ce76ecda1bd3e4ad6b3af637f4fbfa01636ec75e9b9be34d3006950151`:
42 required suite groups, 108 fresh tasks, zero reused tasks, zero failures
and no unrun suite. Code identity and build output stayed unchanged. The
plan-refutation group passed in 71.818 s; the history suite passed in 73.423 s
with zero excluded evidence reads. That history runtime is 22.34 percent of
the order's 328.6 s plain-gate median, not a measurement of additive overhead.
The complete review took 1,699.655 s, including 1.165 s of recorded host-lane
waiting with holder relation unknown. Its critical path did not include the
history suite. The isolated repaired history control took 25.602 s; the
concurrent full run and isolated control are not interchangeable timing arms.
[repair-001-evidence.json](repair-001-evidence.json) retains these observations.
The repair outcome matches the compatibility objective; independent
re-verification remains a separate dispatch.

## WO-232-D010 — Retain the historical bundle and board its next shape expansion

```json
{
  "id": "WO-232-D010",
  "date": "2026-10-25",
  "dispatch": "resume: fix; Adjacent Repair",
  "decision": "Retain the committed bundle's existing bytes and defer D008's fixture expansion to the next planning pass through FUP-912bcf619a547236. The blocking old-binding class receives permanent plan-refutation coverage and the verifier's actual base-reader instance reproduction in this repair. The additional bundle shapes remain a known coverage gap, not a claim that the current bundle exercises them.",
  "evidence": [
    "generate.mjs adds a field to all three WS-001 members and binds WO-002 and WO-004 with the current kit. Its regeneration cannot by itself retain an older reader's field-inclusive binding.",
    "The existing controls require the same bundle to expose both an unmatched WO-001 amendment and two diverged self members at the base. Adding a missing-field member would stop the base index refresh before those facts are observed, so the control needs separate arms as well as a generator change.",
    "D008 and VER-001 F2 expressly allow the next planning pass. The order's Known issues and carry-ins reserves newly reported bundle shapes for that pass; preserving the older bundle retains the existing update proof. The current work-orders-fixtures tests cover the closed missing-field admission independently."
  ],
  "rejected": [
    {
      "option": "Regenerate the bundle with the current kit and call the gap fixed",
      "reason": "That reproduces the current writer's representation and does not create the historical binding the gap names."
    },
    {
      "option": "Add a pinned prior writer and split the bundle control during this repair",
      "reason": "That changes the generator's provenance contract and the paired control's shape. The blocking reader repair is bounded to the existing amendment seam; the expressly permitted follow-up owns the broader fixture representation choice."
    }
  ],
  "reopens": {
    "decisionId": "WO-232-D008",
    "observation": "Repair inspection confirms that the current generator cannot emit the prior writer's binding and that a missing-field member would prevent the existing base index control from observing divergence; the next planning pass should select independently observable arms."
  },
  "reopenWhen": "The next planning pass considers the history fixture, or an instance reports either absent shape before then."
}
```

## WO-232-D011 — Keep amend-order's route for a field-only grouping change

```json
{
  "id": "WO-232-D011",
  "date": "2026-10-25",
  "dispatch": "resume: verify",
  "decision": "VER-002 fails on a reproduced regression of behavior main had, which product 07 §Verification review and attack routes as blocking. amendPlanOrder computes its binding through executionAmendmentSource(current, filed), which now removes one added leading **Workstream:** WS-NNN line whenever the filed source lacked it. When that field is an order's only change from its filed bytes, the binding equals the source hash and amend-order refuses with order has no substantive execution amendment. The plan gate admits the field only for an order that already has a binding, so a judged order with no active amendment that gains only the field still fails with existing work-order bytes changed. On main, amend-order binds that change and the plan gate passes. Under the subject, the operator has no execution route to group a judged order by its field; only a new planning pass clears the gate. The workstream check still requires the field on every open member. VER-001's F1 is repaired: the reader now matches both representations. Criterion 3's named clauses hold. The verifier leaves the implementation unchanged.",
  "evidence": [
    "docs/evidence/WO-232/verification-002-field-only.mjs exits 1. For WO-002 (a closed self member) and WO-004 (an open target member), each withdrawn to its filed bytes plus the one field, the base readers' amend-order exits 0. Under the subject, plan check exits 1 (existing work-order bytes changed), amend-order exits 1 (order has no substantive execution amendment) and plan check still exits 1.",
    "In the same file, the base-bound arm checks the base reader's field-only binding with the subject's readers, and plan check exits 0, so records already bound in the field stay admitted. The control arm checks the filed bytes without the field, and plan check exits 0, so the field is the only cause of the refusal. The base arm's own plan check also refuses the bundle's unrelated WO-001 row 1, which the subject's writer bound. verification-001-amendment.mjs shows that the base reader matches a field-only binding (field alone bound by the base reader: base true).",
    "scripts/lib/plan-receipts.mjs 1478 to 1487: sourceOrderHash = sha256(executionAmendmentSource(filed)), orderHash = sha256(executionAmendmentSource(current, filed)), and the check that they differ. The writer and the gate path do not read the order's phase.",
    "Product 07 (about line 1405) says that changing accepted bytes requires rebinding through amend-order; no subject test or decision covers a field-only amend-order."
  ],
  "rejected": [
    {
      "option": "Follow-up because criterion 3's clauses hold and existing records stay admitted",
      "reason": "Product 07 routes a regression of behavior main had, shown by a probe, as blocking whatever the criterion lines say. Here a gate is left red with no execution remedy, which is the order's own problem class."
    },
    {
      "option": "Leave a planning pass as the only remedy",
      "reason": "Main offers amend-order for an operator-authorized change to a judged order. Requiring a planning pass narrows that route, and the order's Design and Non-goals do not choose it."
    }
  ],
  "followup": "WO-232 repair: an operator who adds only one leading **Workstream:** WS-NNN line to a judged order with no active amendment keeps an execution route that leaves the plan gate green, as main's amend-order did. For example, amend-order binds the retained representation when the field-removed source equals the filed source; the reader already matches that representation. Alternatively, the plan gate admits that exact change without a binding, with the decision recorded. Changed criterion, objective, dependency and Cost bytes still refuse, and amend-order keeps its horizon rule. Add a plan-refutation case for that change on a judged order with no amendment. Keep product 07's rebinding sentence and the Read before upgrading true.",
  "reopenWhen": "verification-002-field-only.mjs exits 0 on the repaired subject, and an independent re-verification confirms the route, the base-bound arm and the existing refusal cases."
}
```

## WO-232-D012 — Retain a grouping-only amendment instead of erasing its change

```json
{
  "id": "WO-232-D012",
  "date": "2026-10-25",
  "dispatch": "resume: fix",
  "decision": "When removing one newly added exact leading Workstream field would leave the release-normalized filed source unchanged, retain the field in executionAmendmentSource. This preserves amend-order's existing authorized execution route for a grouping-only change, including release assignment or retiming beside it. Keep the field-removing representation for substantive amendments, and keep the prior reader's retained representation in the matcher. The invariant is that the grouping admission cannot erase the only change the writer must bind; no new gate exemption, event shape or planning authority is introduced.",
  "evidence": [
    "VER-002 F3 and D011 select this repair. amendPlanOrder hashes executionAmendmentSource(current, filed) and refuses equality with the filed-source hash; executionAppendix still refuses an unbound leading field. The defect is the shared normalizer erasing a writer input that the gate still requires to be bound.",
    "The unchanged verification-002-field-only.mjs exited 1 at 2026-10-25T13:22:14.386Z. For both the closed WO-002 and open WO-004, the subject's amend-order and following plan check exited 1; the base writer bound both, and the base-bound subject checks passed.",
    "The same probe exited 0 at 2026-10-25T13:25:13.137Z after the repair. For both orders, the unbound field still fails the plan check; amend-order now exits 0 and the following plan check exits 0. The base-bound and ungrouped control arms remain passing. The base-only check still reports its unrelated WO-001 binding refusal, as VER-002 explains.",
    "The unchanged verification-001-amendment.mjs exited 0 at 2026-10-25T13:25:54.172Z: both historical field-inclusive bindings and the later-field admission match, and the cloned instance's base amendment and both plan checks pass.",
    "Three permanent plan-refutation cases exercise the actual writer and gate without an existing amendment, using unlabelled, placeholder and versioned filed titles. They include a CRLF source, release-only no-op refusals, repeated authorization, workspace and committed checks, later release retiming and execution records, and rejection of criterion, objective, dependency, Cost, bound-field and non-execution-appendix changes. The earlier CRLF admission assertion now supplies the actual pre-amendment filed body, rather than treating an already approved body as the filed source.",
    "A serial bounded comparison at 2026-10-25T13:28:48.085Z tested the chosen fallback against always retaining the field, using the same synthetic placeholder-title source. Both bind grouping alone and treat a release label alone as no amendment. Only the fallback preserves the prior field-and-body binding bytes. The comparison exited 0 in 66 ms; it measures binding stability, not runtime savings. repair-002-evidence.json records both arms."
  ],
  "rejected": [
    {
      "option": "Admit an unbound grouping-only change directly in the plan gate",
      "reason": "That changes the existing authorization boundary. Restoring the writer's route keeps the recorded decision and the judged-horizon requirement without adding a second exception to continuation."
    },
    {
      "option": "Always retain grouping fields for every newly written amendment",
      "reason": "That changes unrelated field-and-body bindings already emitted by this work order. The narrow fallback preserves those bytes and both existing matching representations."
    },
    {
      "option": "NoOp or require a new planning pass",
      "reason": "Both retain the reproduced regression: an authorized grouping change that main could bind has no execution route."
    }
  ],
  "reopenWhen": "A field-only change on a judged order cannot be bound, a prior binding stops matching, or either matching representation admits a substantive post-binding edit."
}
```

Correction to D009's assumption that the writer could remain unchanged: the
reader repair preserved old bindings but did not test creating a binding when
grouping was the only change. The checked writer and VER-002 probe establish
that the shared normalization erased that change. This repair retains it;
the filed verification reports and historical amendment records stay unchanged.

Goal alignment: erasing the writer's only change and broadening the gate's
unbound admission are the two traps. Retaining the exact field only when its
removal equals the normalized filed source avoids both. NoOp leaves the
observed failure. The before/after probe exercises the same two order phases
and records; the complete review supplies the remaining regression evidence.

The complete review passed at 2026-10-25T13:59:28.292Z, code identity
`d7de382e8b43fe01f8d06c0dc7a8d09b1ee1f78e48b45ad851af6b2a707be760`:
42 required groups, 108 fresh tasks, zero reused tasks, no failures and no
unrun suite. Code identity and build output stayed unchanged. The planning
suite passed in 77.949 s and the history suite in 33.431 s, with zero
excluded evidence reads in the history suite. The complete run took
1,728.364 s, including 1.308 s of recorded host-lane waiting attributed to
an unknown checkout. Its recorded critical-path work and gaps remain in
[repair-002-evidence.json](repair-002-evidence.json); no cause for those
gaps is inferred. The history measurement is 10.17 percent of the cited
328.6 s plain-gate median, not additive gate overhead or a new median.

The saved control's head reader digest still named the first repair, so the
paired control was refreshed after the complete run. At
2026-10-25T14:03:06.915Z it completed successfully: the base arm took
24.572 s and reproduced the named amendment refusal and both false
divergence marks; the repaired head took 24.721 s and passed all five
commands with both self members current, stale no. The committed bundle
is unchanged. These isolated control times and the concurrent history
suite's time are not interchangeable timing arms.

The second executor review traced the normalizer's callers in `scripts/`
and `packages/`, excluding generated `dist`: production calls remain in
`plan-continuation.mjs` and `plan-receipts.mjs`, including source validation
and authorized writebacks. The additional input
`scripts/test-worktree-integration.mjs` checks the frozen Preflight binding
through the same function; its complete-review group passed. The existing
legacy guards and the previous release's retained matching form remain.

FUP-a2fbcef21e8c10e8 is settled by this repair and its executed evidence.
F2 remains boarded as FUP-912bcf619a547236 under D010. The outcome matches
the compatibility objective; independent re-verification remains the next
lifecycle step. No worker was launched during this repair.

## WO-232-D013 — Admit the field over an amendment bound in the legacy representation

```json
{
  "id": "WO-232-D013",
  "date": "2026-10-25",
  "dispatch": "resume: verify",
  "decision": "VER-003 fails criterion 3. executionAmendmentMatch has two representations. The current path removes one added exact leading **Workstream:** WS-NNN line when the filed source lacked it. The legacy path, for rows a pre-v0.51.0 writer bound with an appended release label normalized to the activation placeholder, still reads executionAmendmentSource(after) without the filed source, so it keeps the line inside the bound prefix. An order whose amendment row matches only through the legacy path therefore becomes unmatched when it gains the field, and the plan gate offers only withdrawal. This repository holds such a row: WO-159 (closed, v0.48.0, bound 2026-09-25, filed without the field, absorbed by no later planning receipt). Criterion 3 says requireMatchedAmendments admits the line added after the amendment was bound when the filed order lacked it; the Objective says the plan gate stays green with no withdrawal; product 07 and the Read before upgrading state the same without exception. The activation base refuses this case too, so it is not a regression; it is an unmet criterion in a declared surface, repaired in the order. The verifier leaves the implementation unchanged.",
  "evidence": [
    "docs/evidence/WO-232/verification-003-legacy.mjs exits 1 on the subject. Synthetic legacy row (unlabelled filed title, activated with a label and an appended execution record, bound in the placeholder form): without the field, base and subject match; with the field added later, base and subject both refuse; with the field and a changed objective, both refuse as they should.",
    "In the same run, this repository's WO-159 row (recordedAt 2026-09-25T04:33:50.468Z, zero later planning receipts holding WO-159) matches as is under base and subject and is refused by both once the field is added. The paired control WO-160 (recordedAt 2026-09-25T17:04:23.342Z, current representation, zero later receipts) is refused by base and admitted by the subject once the field is added.",
    "End to end, in a scratch clone of this worktree with its uncommitted subject and build output overlaid, node scripts/refute-plan.mjs check exits 0 as is. With WO-159 given **Workstream:** WS-002 and listed in WS-002's members, it exits 1: unmatched execution amendment WO-159 row 23; withdraw it explicitly or restore its approved bytes. The same edit to WO-160 exits 0. Restored, it exits 0.",
    "Of this repository's 38 live amendment rows (the latest per receipt and order, less WO-111's withdrawn row 22), 37 match the current file in the current representation and one, WO-159, in the legacy representation. amend-order cannot rebind WO-159 because it is outside the judged horizon, which this order keeps."
  ],
  "rejected": [
    {
      "option": "Follow-up because main refuses the same case",
      "reason": "Blocking requires an unmet criterion or a regression. Criterion 3 and the Objective state the admission for an order whose filed source lacked the field, with no representation exception, and a live record in this repository falls outside it."
    },
    {
      "option": "Narrow the documents to the current representation",
      "reason": "That changes what criterion 3 promises rather than meeting it, and the order's purpose is that the field never costs a bound authorization its binding."
    }
  ],
  "followup": "WO-232 repair: the legacy match path admits one added exact leading **Workstream:** WS-NNN line the filed source lacked, exactly as the current path does. For example, remove the field from the placeholder-normalized source before the prefix comparison, without applying the filed-aware label normalization there. Matching may only widen: a legacy row without the field still matches, and changed criterion, objective, dependency and Cost bytes still refuse under every representation. Add a plan-refutation case with a legacy-representation row (unlabelled filed title, activation label, appended execution record) that passes the plan gate after the field is added and refuses a changed objective. Keep product 07 and the Read before upgrading true.",
  "reopenWhen": "verification-003-legacy.mjs exits 0 on the repaired subject, and an independent re-verification confirms the legacy case, the WO-160 control and the existing refusal cases."
}
```

## WO-232-D014 — The malformed-field guard no longer detects a widened field pattern

```json
{
  "id": "WO-232-D014",
  "date": "2026-10-25",
  "dispatch": "resume: verify",
  "decision": "Follow-up, not blocking. D012's writer repair retains the field when removing it leaves the filed source. The malformed-field guard in scripts/test-plan-refutation.mjs (the candidates WS-1, a trailing space, a duplicate and a body field) asserts executionAmendmentSource(candidate, approved) differs from executionAmendmentSource(approved), with the approved body as the filed source. For a candidate whose only change is that line, the retention now makes the two differ whatever the field pattern is, so the guard passes even if the pattern widens. It is the only malformed-field case in the suite. The implementation's pattern is exact and refuses these candidates, so no criterion and no behavior main had is broken.",
  "evidence": [
    "verification-003-legacy.mjs part 3 runs the guard's exact comparison under the subject and under a mutant whose pattern is /^\\*\\*Workstream:\\*\\* WS-\\d+ *(?:\\r?\\n|$)$/u. The guard holds under both. Beside a bound objective change, the subject's matcher refuses WS-1 and the trailing-space field, while the mutant's admits both.",
    "A search of scripts/test-plan-refutation.mjs finds WS-1 and the trailing-space candidate only in that loop (about lines 4040 to 4050). The repair changed the CRLF assertion just after it to pass the pre-amendment filed body, but not the loop."
  ],
  "rejected": [
    {
      "option": "Blocking",
      "reason": "The shipped pattern is exact; the defect is in a test's power to detect a later change, which breaks no criterion."
    }
  ],
  "followup": "WO-232 repair within the Boy Scout bound, or the next order that edits executionAmendmentSource: the malformed-field guard compares against a filed source that differs from the candidate without its line (the pre-amendment filed body, as the CRLF assertion now does), or asserts through matchesExecutionAmendment beside a bound substantive change, so a widened field pattern fails plan-refutation.",
  "reopenWhen": "A widened Workstream field pattern passes the plan-refutation suite, or the guard loop is rewritten."
}
```

## WO-232-D015 — Apply grouping admission independently of historical title formats

```json
{
  "id": "WO-232-D015",
  "date": "2026-10-25",
  "dispatch": "resume: fix; operator direction to address recurring brittle changes",
  "decision": "Separate exact leading-field removal from the writer's field-only retention rule. The reader checks retained and field-removed bytes for both filed-aware and historical placeholder title formats. The writer continues producing the same binding bytes, and the legacy reader retains its filed-prefix and execution-appendix checks. This repairs VER-003 F4 within criterion 3 and the declared amendment surfaces. No binding is rewritten and no unbound grouping change gains authority.",
  "evidence": [
    "The unchanged verification-003-legacy.mjs exited 1 before repair at 2026-10-25T14:41:00.723Z: the synthetic legacy row and WO-159 failed only after adding the field. The same script exited 0 at 2026-10-25T14:44:53.276Z; the objective-change negative control still refused.",
    "The checked writer in plan-receipts.mjs hashes executionAmendmentSource(current, filed). The matcher previously called that writer normalization for the current format but executionAmendmentSource(after) for the legacy format, so grouping and title normalization were coupled inconsistently.",
    "repair-003-compatibility.mjs compared the pre-repair checkpoint with this repair: 216 writer outputs were identical, all 770 previously accepted synthetic matches remained accepted, and 1164 objective-change probes refused. All 38 live repository amendment rows matched with their current bytes and with a later exact grouping field. The bounded run exited 0 at 2026-10-25T14:49:06.278Z.",
    "The unchanged prior-binding and field-only verifier probes exited 0 at 2026-10-25T14:49:26.219Z and 2026-10-25T14:49:46.627Z. The latter still refused unbound grouping, then passed amend-order and the following plan check for both the closed and open order. Its base-only arm retains the unrelated WO-001 refusal documented by VER-002.",
    "The permanent legacy cases now include an activation-only binding without an existing appendix, a CRLF binding with existing evidence, later grouping and release retiming, committed continuation, retained field-inclusive legacy bindings, and refusals of criterion, objective, dependency, Cost and bound evidence edits. Historical binding bytes are constructed independently of the current writer. The activation-only case goes beyond the report's quoted reproduction."
  ],
  "rejected": [
    {
      "option": "Use the writer normalizer for both title formats",
      "reason": "The writer intentionally retains a grouping-only change. Reusing that exception in historical matching would still reject an activation-only legacy binding after a field was added. Reading equivalent historical representations and writing one authorized representation are separate operations."
    },
    {
      "option": "Add a second field-removal pattern only inside the legacy branch",
      "reason": "Duplicating the rule allows the two representations to drift again. One exact byte-preserving helper serves both and leaves the legacy prefix checks visible."
    },
    {
      "option": "NoOp, withdraw the historical binding, or narrow the documented promise",
      "reason": "Each leaves criterion 3 unmet or changes instance-owned authorization to accommodate a core reader defect."
    }
  ],
  "reopenWhen": "Any previous binding stops matching, a writer output changes without a separate decision, or grouping admits an unrelated bound-byte edit."
}
```

Correction to the preceding repair's completeness claim: D012 traced the
normalizer's callers but did not exercise grouping over the legacy title
format. VER-003 and the unchanged probe establish the missing path. This
repair enumerates title and field representations separately and checks the
repository's live rows as well as synthetic cases. The operator's complaint
is treated as direction to address this cause within the existing repair;
it does not authorize an unrelated redesign.

Goal alignment: sharing the writer's retention exception with reading,
duplicating the grouping rule, and testing only the latest failure's shape
would preserve the recurrence risk. The separate removal helper, unchanged
writer comparison and live-record sweep address those traps. NoOp preserves
the observed refusal. Input classification occurs before trailing whitespace
is trimmed, so the exact-field admission cannot acquire a whitespace exception.

## WO-232-D016 — Test malformed fields at the matcher and gate

```json
{
  "id": "WO-232-D016",
  "date": "2026-10-25",
  "dispatch": "resume: fix; adjacent-0003",
  "decision": "Repair VER-003 F5 in scripts/test-plan-refutation.mjs. Keep the original filed source and actual amendment record. Assert malformed leading fields directly through matchesExecutionAmendment so the workstream parser cannot mask a weakened matcher. Exercise the appended body-field candidate separately through checkPlanGate, which owns execution-appendix validation. Add malformed-field matching negatives to the legacy cases.",
  "evidence": [
    "The unchanged VER-003 probe reproduced the weak guard: the existing normalizer comparison held under a widened WS-digit pattern even though the mutant matcher admitted WS-1 and trailing-space fields.",
    "requireMatchedAmendments uses prefix matching, while continuation separately checks appended execution records. checkPlanGate first parses workstream declarations, so an earlier malformed-field refusal can mask a weakened amendment rule. The repaired tests judge the matcher directly for leading metadata and the complete gate for an appended body field.",
    "Adjacent queue revision 11 records the diagnosed cause, named file and complete-review check, the actual intent announcement, an actor-attested message-boundary check-in, and start. The available operator steering asks that recurring brittle failures be addressed."
  ],
  "rejected": [
    {
      "option": "Retain the old comparison with the already-approved body as the filed source",
      "reason": "The writer's field-only fallback makes that assertion insensitive to a widened field pattern."
    },
    {
      "option": "Use only the boolean prefix matcher for every malformed candidate",
      "reason": "The appended body-field case needs the planning gate's separate execution-appendix validation."
    },
    {
      "option": "Use only the full planning gate for malformed leading fields",
      "reason": "The workstream parser can refuse the field before the amendment matcher runs, concealing a regression in the exact-field admission."
    },
    {
      "option": "Defer this test defect",
      "reason": "It is in the exact test surface this repair edits, has a concrete bounded fix, and otherwise leaves the claimed exact-field rule poorly protected."
    }
  ],
  "reopenWhen": "A broadened field pattern passes the repaired gate assertions or any supported binding representation loses its malformed-field refusal."
}
```


The first complete repair review failed at 2026-10-25T15:00:08.263Z,
code identity `28face5f24d803c0a1e2f9c9b8cccdf1e11c2449d485e625bc2118a42b68a8d1`.
Both new legacy cases passed. The malformed-field case failed because the
executor expected an amendment/appendix error but `parseWorkstreamDeclaration`
correctly refused `WS-1` earlier. The correction is to test each boundary
where it acts: direct amendment matching for malformed leading fields and
full continuation for a body field. Broadening the expected error pattern
would mask the weakened-matcher defect, so that option was rejected. The
failed row is retained; no passing complete-review claim is made from it.

The bounded `repair-003-mutation.mjs` comparison passed at
2026-10-25T15:02:32.341Z. The same three permanent tests passed on the
subject and all three failed when only the exact field pattern was widened
to accept arbitrary digit counts and trailing spaces. This confirms both
the original guard and the two legacy guards detect the weakened admission;
it is a focused reproduction and sensitivity check, not a complete-review row.


The fresh complete review passed at 2026-10-25T15:33:24.864Z, code identity
`98839c72b08bb113c1977e1b40484ba33fb4e58b250eab3136a3bcc202df77d4`: 42 required groups,
108 fresh tasks, 0 reused tasks, no failed or unrun task, and unchanged
code identity and build output. The planning suite took 72.660 s and
the history suite 72.610 s. Total review time was
1708.794 s, including 1.175 s of recorded host-lane waiting
whose holder relation was unknown. The history observation is
22.10 percent of the cited 328.6 s plain-gate median; it does not
measure additive gate overhead. The prior repair's complete review took
1,728.364 s; both include work and waiting, without a controlled performance
claim. Expanded regression coverage adds fixture work.

The refreshed paired history control completed at
2026-10-25T15:34:51.275Z. The base arm exited 1 in
25.501 s with the named WO-001 amendment refusal and both false divergence
marks; the head exited 0 in 24.293 s with all five checks passing and both
self members current, stale no. The current reader digests and unchanged
bundle digest are recorded in controls.json. The outcome matches the
compatibility objective. FUP-4c22840b1c8c7133 and FUP-4fe509a1afa404a1 are
settled by the repair and these executed checks. F2 retains its prior
FUP-912bcf619a547236 deferral under D010. No worker was launched during this
repair; independent re-verification remains a separate dispatch.

## WO-232-D017 — Three guards of the Workstream admission lack a permanent case

```json
{
  "id": "WO-232-D017",
  "date": "2026-10-25",
  "dispatch": "resume: verify",
  "decision": "Follow-up, not blocking. VER-004 confirms F4 and F5 repaired and every criterion met. The admission in withoutAddedWorkstream (scripts/lib/plan-continuation.mjs) has three guards besides the exact field pattern: the filed order declares no field, exactly one field was added, and that field lies in the leading header before **Objective:**. The subject implements all three; for each, it refuses an input that a mutant without the guard admits at the matcher. No permanent case protects them: the nine Workstream amendment cases in scripts/test-plan-refutation.mjs pass unchanged under each of the three mutants. The duplicate-field mutant is also masked at the plan gate, where parseWorkstreamDeclaration refuses duplicate lines first; the other two are not. No criterion and no behavior main had is broken, so this is a follow-up under product 07 §Verification review and attack.",
  "evidence": [
    "docs/evidence/WO-232/verification-004-guards.mjs exits 1 on the subject. Part 1 at the matcher, with each implementation binding through its own writer: (i) an order filed with **Workstream:** WS-001, a criterion amendment bound, the field later changed to WS-002; (ii) a field-only amendment bound with WS-001, a second declaration WS-002 added above it; (iii) a criterion amendment bound, a **Workstream:** WS-001 line later inserted between criteria 1 and 2. The subject refuses all three; each guard's mutant admits its case. Part 2 runs the permanent cases whose names begin a field-only Workstream, a previous reader's Workstream, a later leading Workstream and a legacy amendment: 9 pass under the subject and 9 pass under each mutant.",
    "In the same session's probe of six mutants, the cases kill the executor's widened-digit and trailing-space pattern (3 fail), a prefix-only pattern (3 fail) and a legacy branch without field removal (2 fail), so D016's stated repair holds; only these three guards survive.",
    "parseWorkstreamDeclaration (scripts/lib/work-order-workstream.mjs) refuses duplicate **Workstream:** lines in the leading header. It reads only that header, so case (iii)'s body line reaches the matcher alone, and it accepts case (i)'s WS-002 as a well-formed declaration."
  ],
  "rejected": [
    {
      "option": "Blocking",
      "reason": "Each guard holds in the shipped implementation and every criterion is met; a missing regression case breaks no criterion and no behavior main had."
    },
    {
      "option": "No record",
      "reason": "Three of the admission's four conditions would then be unprotected while the order's documents promise exactly one leading field the filed order lacked."
    }
  ],
  "followup": "The next order that edits executionAmendmentSource or withoutAddedWorkstream, or a WO-232 repair if one happens, within the Boy Scout bound: add plan-refutation cases that refuse, through matchesExecutionAmendment or the plan gate, (i) a changed field on an order whose filed source already declared it, beside a bound substantive change; (ii) a second leading declaration added over a binding that retains one field; (iii) a **Workstream:** WS-NNN line added in the body below **Objective:** beside a bound change. Each case must fail when its guard is removed, as verification-004-guards.mjs shows.",
  "reopenWhen": "verification-004-guards.mjs exits 0 on a later subject, or any of the three guards is changed or removed."
}
```

## WO-232-D018 — integrate main at the activation base with nothing taken in

<!-- integration refs/dotln/checkpoint/WO-232/18 -->

```json
{
  "id": "WO-232-D018",
  "date": "2026-10-25",
  "dispatch": "resume: final review; worktree integrate WO-232",
  "decision": "Integrate main at a8156197, the commit the branch already stands on: a no-op merge that took nothing in and met no authored conflict. Every acceptance claim of VER-004 is carried forward unchanged with its original evidence, because the integrated code identity equals the identity the third repair handed off and VER-004 judged, and the passing complete review row at that identity is the row the result consumes; no fresh complete run is owed. Component versions and evidence inputs are unchanged, and v0.98.0 remains the current target.",
  "evidence": [
    "refs/dotln/checkpoint/WO-232/18",
    "base a81561976c8629834a5a18623b097fa4d7d8681a",
    "upstream a81561976c8629834a5a18623b097fa4d7d8681a",
    "release preparation: WO-232 target v0.98.0 remains current. Files changed: docs/evidence/WO-232/meta.json. Meter snapshot: docs/evidence/WO-232/meta.json, 4177 bytes. Tag observation: local snapshot only.",
    "gateCodeIdentity read 98839c72b08bb113c1977e1b40484ba33fb4e58b250eab3136a3bcc202df77d4 at entry, after the integration, after the affected checks and after the single-suite gates: the identity of the complete review row recorded 2026-10-25T15:33:24.864Z (npm test --review, exit 0, 42 required groups, 108 fresh tasks, none reused or unrun, identity and build output unchanged, 1,708.794 s) and of VER-004's subject.",
    "Affected checks at the integrated tree, each exit 0 one at a time under node scripts/harness.mjs bounded --: npm run publication:check (255 of 255 headings; both editions current), node scripts/harness.mjs check (35 generated surfaces), npm run release -- check-surfaces --local, npm run meta -- --check (the five standing budget breaches, 0 reopen candidates); git diff --check clean and npm run format:check pass before and after the integration.",
    "No path under packages/, package.json or package-lock.json differs from main; the newest annotated tag is v0.97.1 locally and at origin, so v0.98.0 collides with nothing. Local main, origin main and HEAD are a8156197.",
    "Preservation commit d1539f5c30c6a6435d0ed884aa9812b6417dec74, no merge commit, named stash 7ddd18e4242babec5f8694880897e40725675cec retained; intake backup DotLn-wo232-intake-20261025T162429Z.zip (3 files) in the DotLn session scratch."
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    },
    {
      "option": "Run a fresh npm test -- --review after the integration",
      "reason": "The identity, not the dispatch time, says what was tested; it is unchanged, so the third repair's passing complete row covers the integrated tree (product 07 §Preflight before the full gate)."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-25. Original base: `a81561976c8629834a5a18623b097fa4d7d8681a`.
Fetched main: `a81561976c8629834a5a18623b097fa4d7d8681a`. Checkpoint: `refs/dotln/checkpoint/WO-232/18`.
Named stash retained: `7ddd18e4242babec5f8694880897e40725675cec` (WO-232 integrate 2026-10-25).
Resolved projections: none.
Release preparation: WO-232 target v0.98.0 remains current. Files changed: docs/evidence/WO-232/meta.json. Meter snapshot: docs/evidence/WO-232/meta.json, 4177 bytes. Tag observation: local snapshot only.
Carried-forward claims: criteria 1 to 7 as VER-004 judged them, at the unchanged code identity `98839c72…`; FINAL-001 reran the four criterion suites (`instance-history`, `plan-refutation`, `work-orders-fixtures` and `index`) as single-suite gates and the five verification probes under the bounded wrapper at the integrated tree, with the same outcomes.
Authored conflicts observed: none.
Affected checks: run at the integrated tree, each exit 0 (the evidence list above).

## WO-232-D019 — final review pass at the integrated identity; VER-004's F6 and VER-001's F2 stay boarded, F6's register row is deferred, and the receipt's known issues are judged

```json
{
  "id": "WO-232-D019",
  "date": "2026-10-25",
  "dispatch": "resume: final review",
  "decision": "FINAL-001 passes WO-232 at code identity 98839c72b08bb113c1977e1b40484ba33fb4e58b250eab3136a3bcc202df77d4 with no finding of its own. Two earlier findings keep their follow-up route. F6 (VER-004): three guards of withoutAddedWorkstream in scripts/lib/plan-continuation.mjs (the filed order declares no field, exactly one field was added, the field lies in the leading header) hold in the shipped code and refuse the inputs the mutants admit, but no permanent plan-refutation case fails when a guard is removed. F2 (VER-001): the committed bundle holds only fields and bindings its own kit produced, so the suite's base arm fails on the amendment and the self members but never on the v0.96.0 refusal of a closed member without the field. Neither breaks a criterion or behavior main had; both are reproduced here (verification-004-guards.mjs exit 1 with the three guards unprotected; the bundle's WS-001 members all carrying the field). This review repairs neither: a reviewer never writes a behavioral fix or a new regression case and certifies it, and a source or test edit would move the identity and owe a fresh complete run over code no verifier judged. F6's register row FUP-c4c7ba9f126d2e4a, untriaged since VER-004, is disposed as deferred to the next order that edits executionAmendmentSource or withoutAddedWorkstream, with D017's reopening condition. F2's row FUP-912bcf619a547236 keeps the deferral the second repair recorded under D010, to the next planning pass. The three rows the change only matched by path (FUP-00af89947ed9099f on plan-continuation.mjs, FUP-7f9a27e6ed6c44b3 on work-orders.mjs and FUP-d0a9719cc2e4ec55 on test-runner.mjs) stay as they are, because none of their seams is touched. Planning receipt 055's nine known issues are judged in the report: two did not occur (the target member reads behind in the committed index and under the suite; cold-start bytes are unchanged because the kit seed is the exported convention README, not a cold-start source); one is answered by product 07's sentence that a necessary migration needs its own planning decision before release; six stand as recorded limitations whose reopening conditions have not occurred (regeneration rebuilds every shape, a self member's cells read current whenever main resolves, no wall-clock ceiling is stated, the admission is a second named-field exception, the suite exercises the opted-in --apply route, and the bundle's text is screened by hand rather than by a gate).",
  "evidence": [
    "docs/final-reviews/WO-232/FINAL-001.md: criterion judgments, the known-issue judgments, the executed-check table and the findings block.",
    "docs/evidence/WO-232/verification-001-amendment.mjs, verification-002-field-only.mjs and verification-003-legacy.mjs rerun under node scripts/harness.mjs bounded -- at the integrated tree: exit 0 each, regression false and unadmitted false; verification-004-guards.mjs exit 1 naming the three unprotected guards; verification-004-matrix.mjs exit 0 with 4,152 writer checks, 0 writer diffs, no wrong row and no regression.",
    "npm test -- --only instance-history (29.60 s, suite 44.53 s), plan-refutation (67.17 s, suite 101.96 s), work-orders-fixtures (26.50 s, suite 42.38 s) and index (2.93 s, suite 37.12 s) at the integrated tree: 8 passed, 0 failed each.",
    "The committed bundle's index page records WO-004 (the target member) integration behind, stale yes, with base 2bdbf8e1 and target c972d40b; VER-001 observed the same cell under the suite's mapped clone, so receipt 055's shape (d) condition (integration unknown) did not occur. npm run meta -- --check reads coldStartBytes 29,584 with delta 0, so its criterion-5 cold-start condition did not occur.",
    "A screen of the changed and new paths and of the bundle's whole history (git log --all -p) for home paths, account names, e-mail addresses and credential shapes found only core's own synthetic test strings carried in the exported kit, the LICENSE copyright line and a public releases link; every bundle commit is authored by the fixture identity at example.invalid.",
    "Product 07 §Independent workflows and integration: a reviewer never writes a behavioral fix and certifies it; §Verification review and attack: a finding outside the criteria that breaks no behavior main had is a follow-up by rule; WO-231-D008 is the precedent for deferring a verifier-minted row to its named owner and leaving a path-matched row alone."
  ],
  "rejected": [
    {
      "option": "Add F6's three regression cases here within the Boy Scout bound",
      "reason": "A test edit moves the code identity and owes a fresh complete run over bytes no verifier judged; the cases are a bounded repair for the next order that edits the admission, as D017 names."
    },
    {
      "option": "List F2 and F6 in this review's findings block as escapes",
      "reason": "The block counts the final review's own findings and its classes measure what escaped verification; both were found and boarded by verification, so they are judged in prose under Earlier findings and the block is empty."
    },
    {
      "option": "Route receipt 055's standing known issues as findings",
      "reason": "Each is a planning observation on the order as filed; none names an unmet criterion or a reproduced regression, and the receipt itself recorded them as known issues with reopening conditions, which the report judges."
    },
    {
      "option": "Resolve FUP-c4c7ba9f126d2e4a as settled",
      "reason": "By the operator's 2026-10-17 direction a boarded row is resolved by a work order; a final review may only defer it with its owner and reopening condition."
    }
  ],
  "reopenWhen": "verification-004-guards.mjs exits 0 on a later subject or any of the three guards is changed or removed (D017's condition); an instance reports a refusal on a closed member without the field or on an amendment the previous release bound while instance-history passed (D008's condition); or a release needs a record field no admission can grandfather."
}
```
