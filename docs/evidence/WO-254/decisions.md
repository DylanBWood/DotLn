# WO-254 decisions

## WO-254-D001

```json
{
  "id": "WO-254-D001",
  "date": "2026-11-04",
  "dispatch": "planning: standard planning pass + (the 2026-11-03 pass, after its pull request #272 merged); the operator's correction on reading the merged order",
  "decision": "Rewrite the order's Nomination provenance paragraph as a synthesis of the operator's mid-turn messages, naming what each message directed and quoting none of them, so the committed order carries no verbatim operator words; the verbatim capture stays only in ignored intake. No other sentence of the order changes.",
  "evidence": [
    "The clean-room floor in CLAUDE.md: docs/intake/ is ignored, single-copy source material; ordinary raw ideation is synthesized and rewritten, and exact wording is admitted only for an operator-authored public draft explicitly marked ready to file.",
    "The operator's direction of 2026-11-04 on reading the merged #272: the verbatim mid-turn messages in the order's Nomination provenance must not be committed in a public document; the operator asked for every such place to be listed and fixed.",
    "git grep over the tracked documents on 2026-11-04 found the quotes in this order (lines 113 to 117), in the map's candidates of 2026-11-03 (item 4) and in the register row minted from that item; the map and register texts are rewritten in the same change.",
    "The ignored capture docs/intake/planning-dispatch-2026-11-03-recurring-failures.md (SHA-256 4c7e47a6548004d909128fdfcc346663fc419280b798d00abec73d7ffb180f83) keeps the verbatim words; the committed order now points at it and quotes nothing."
  ],
  "rejected": [
    {
      "option": "A second refutation of the changed order",
      "reason": "The change is a bounded, operator-authorized rewrite of one provenance paragraph that adds no scope and alters no criterion, design or step; product 07's execution-amendment route binds the approved bytes to the existing receipt without a new judgment."
    },
    {
      "option": "Leaving the paragraph and rewriting main's history",
      "reason": "A history rewrite of main is the operator's decision and does not remove the words from the merged pull request's record on the forge; the committed text must change regardless."
    }
  ],
  "reopenWhen": "A committed surface anywhere in the repository is found to quote an operator message that was not a public draft marked ready to file.",
  "kind": "correction",
  "misread": "The clean-room floor was read as applying to employer material and private identifiers only, so the operator's own mid-turn words were pasted into the order's provenance as evidence.",
  "meant": "Every operator word outside a public draft marked ready to file is intake: ignored, single-copy, synthesized before it is committed.",
  "changed": "The Nomination provenance paragraph of this order, the map's candidate 4 of 2026-11-03 and the register row's retained text are syntheses; the pass document records the correction."
}
```

## WO-254-D002

```json
{
  "id": "WO-254-D002",
  "date": "2026-11-04",
  "dispatch": "operator override: from 2026-11-04T02:13:34.355Z to 2026-11-04T02:14:13.899Z, during the clean-room correction after the 2026-11-03 pass",
  "decision": "Under the operator's override, rewrite as syntheses the operator quotes held in three hash-bound decision records (WO-181-D008's authorization and constraint fields, WO-233-D001's and WO-235-D001's dispatch fields) and re-bind each by appending the kit's own PlanExecutionAmended event with the rewritten decision's hash, since plan amend-order refuses a closed order outside the judged horizon; the earlier events stay as history and the check validates the latest. Record the override here because no order was selected in the session.",
  "evidence": [
    "The operator's direction of 2026-11-04, repeated across several messages: no operator words are to remain quoted anywhere in the public repository, hash-bound records included.",
    "npm run plan -- amend-order WO-233 WO-233-D001 and WO-235 WO-235-D001 on 2026-11-04: 'execution amendment requires an order in the current judged horizon and an authorization reason'.",
    "scripts/lib/plan-receipts.mjs: validateAmendment checks the decision binding only for an event no later event re-bound ({ decision: !rebound }), so a later PlanExecutionAmended for the same receipt, order and decision supersedes the earlier binding.",
    "The override's advisory at exit: OperatorOverrideRecorded was not appended because a live evidence gate (the resume suite this session ran) refused control writes; this decision is the record the advisory asks for.",
    "Bypassed requirements: the hook's live-gate write refusal for the three decision edits made while the resume suite ran (docs/evidence is not that suite's input), and the records-immutability convention for three closed orders' decisions, on the clean-room floor's authority."
  ],
  "rejected": [
    { "option": "Leave the three quoted phrases in place until a kit change admits re-binding a closed order", "reason": "The operator's direction is that the words leave the repository now; the floor outranks the convention." },
    { "option": "Rewrite the control log's earlier events", "reason": "The control log is append-only; a later event re-binds without touching history." }
  ],
  "reopenWhen": "plan check or test:docs refuses a re-bound decision, or a kit release makes amend-order admit a closed order's clean-room correction so this route is retired.",
  "kind": "override-record"
}
```
