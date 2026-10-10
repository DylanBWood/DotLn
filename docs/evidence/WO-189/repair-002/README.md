# WO-189 — Markdown repair evidence

Dispatch: `resume: fix`, repairing VER-002 F1 under criterion 5.

The rule and alternatives are in
[D017](../decisions.md#wo-189-d017--repair-one-markdown-grammar-for-sentences-and-headings).
The repair uses the checker's existing pinned Markdown parser for rendered
heading identity and sentence text, preserving physical lines and refusing
content whose line structure is not prose.

The verifier's unchanged `verify-002/boundary-probes.mjs`, run under
`node scripts/harness.mjs bounded --`, exits 1 before repair and 0 afterwards.
[Before](boundary-probes-before.json) reproduces three formatted bypasses;
[after](boundary-probes-after.json) has 17 cases, no direct or formatted mismatch,
and every formatted input at a fixed point. Exact-budget, CRLF and unrelated-next-heading
controls pass. The source creates and removes its temporary repository.

Two new fixture groups in `scripts/test-docs-check.mjs` fail on the original
checker ([before](markdown-fixtures-before.txt)) and pass on the repair
([after](markdown-fixtures-after.txt)). They test sentences and headings both
before and after formatting. Unquoted cases include links, strikethrough,
entities, escaped punctuation, setext headings, other-level namesakes and
a quoted heading. Valid styling, multiline emphasis, hard breaks and exactly
three counted sentences retain their passing controls. Inline HTML and block
content fail explicitly.

[The eight selected front-page fixture groups](front-page-fixtures.txt) also
pass, including the original ownership, immutable-control, range, budget and
typed-header contracts. Full gate results belong in the current
[executor handoff](../handoff.md).

No worker was spawned. Separate-pass review consists of the unchanged verifier
source rerun and the expanded full-`checkDocs` fixtures. The repair changes no
README prose, reader artifact, package implementation or dependency. Reader
provenance and alternate-page installation limits remain as recorded by VER-002.
