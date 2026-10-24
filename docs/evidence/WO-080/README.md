# WO-080 execution evidence

The workstream convention, leading field and generated index now share one
membership contract. The board reads the committed target observation without
opening checkouts. The separate WS-002 track stays outside the serial proposal.

- [Confined synthetic pilot](pilot-confined.txt): D1, D2, the occupied-worktree
  refusal half of D4, and D6 passed; 23.079 seconds of Node suite wall time,
  23.132 seconds including the bounded wrapper. Seatbelt allowed ordinary
  operations and denied writes under the source checkout. This qualifies the
  suite without an outside-sandbox declaration; it is not a live operator run.
- [Board comparison](board-comparison.txt), produced by
  [the comparison script](compare-board.mjs): all five original cases retain
  every original pinned input and reproduce their base JSON, text and HTML
  after removing only the new section. The schema stays byte-identical.
- [Index capture](capture-index.mjs) builds the deterministic two-target,
  three-member fixture and writes the new pinned board input. The index tests
  compare that input with a freshly generated fixture, and cover stale,
  unreadable and self members, membership refusal and separate placement.
- [Decisions](decisions.md) retain the snapshot, card compatibility, shared
  source-reference, synthetic boundary, release and confinement choices.
- [Worker reviews](self-review.md): criteria adversary found zero;
  maintainability improver found one duplicate-edge issue, fixed with a
  regression assertion.
- [Complete review transcript](review-gate.txt): 41 suites passed, zero failed;
  1755.504 seconds, 107 fresh tasks, zero reuse.
- [Fresh product measurement](fresh-product-gate.txt): 35 suites passed, zero
  failed; 1134.406 seconds in the gate row, 1135.28 seconds external elapsed,
  101 fresh tasks, zero reuse. The pilot row took 57.017 seconds. This exceeds
  the original six-minute planning condition; D013 and
  FUP-7f35e50c5d698168 record the observation
  without attributing its cause or claiming a thirty-day median.
- [Gate records](gate-results.json) retain the selected canonical row fields
  and each of the four pilot demonstration results. Both passing runs judge
  the same unchanged code identity and unchanged build output.

The earlier review attempts exposed fixture integration omissions, repaired
under D010–D012: the section expectation and copied CLI inputs, a document
test tag, the upgraded seed list, and the starter's core-only suite table.
Two attempts were stopped after observed failures; one finished unsuccessfully.
The passing complete row above is the implementation evidence.

The first final document run identified the unbound release-header format
correction. D014 records its diagnosis and the execution-amendment binding;
this changes no classification, criterion or product code.

The handoff's final document gate is run after these records are written. Its
canonical row and the lifecycle completion record establish the final state;
these transcripts do not claim that later result before execution.

## Final review

[FINAL-001](../../final-reviews/WO-080/FINAL-001.md) integrated `main` and
took in nothing (both bases `873e8c0c…`; [D018](decisions.md#wo-080-d018)),
read the whole diff, re-ran the affected checks, the board comparison script,
the index check on the real corpus and the `workstream-pilot` and `console`
suites at the integrated tree, and passed at the unchanged code identity with
no finding of its own ([D019](decisions.md#wo-080-d019--final-review-pass-at-the-integrated-identity-ver-001s-f1-and-f2-stay-on-their-rows)).
VER-001's F1 and F2 stay on their rows with their repair rules. The register
held 183 pending rows at the reviewed tree; four are this order's own boarded
decisions and FUP-0126 reads needs-review because product 12's section changed.
