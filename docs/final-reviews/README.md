# Final-review artifacts

Final review is an evidence-bearing closeout episode after any number of
implementation, verification, and repair loops. Reports are immutable and
numbered per work order:

```text
docs/final-reviews/WO-003/FINAL-001.md
docs/final-reviews/WO-003/FINAL-002.md
```

The reviewer reads the authoritative work order, complete numbered verification
sequence, current diff, executable evidence, and every ideation breakout receipt
plus affected ledger, product, domain, schema, and decision surfaces. It may
make bounded, non-substantive handoff corrections such as wording, links, or
PR metadata and must rerun affected checks. Any correction that changes code,
contracts, acceptance behavior, schema, compatibility, authority, or prior
verification evidence makes the final review fail: repair then returns through
a fresh numbered independent `VER-NNN` before another `FINAL-NNN`. The final
reviewer never implements an acceptance-relevant fix and approves it itself.

A passing report includes the final evidence summary, remaining deviations/open
questions, proposed PR title and body, and confirmation that the branch is ready
for operator review. After committing the reviewed state, the authorized
publish step pushes the WO branch and opens a PR. It never merges that PR; the
operator reviews and merges it. Each failed or repeated final review writes the
next `FINAL-NNN` rather than replacing history.
