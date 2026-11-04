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
