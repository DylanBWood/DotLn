# WO-230 executor handoff

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.164.0","model":"gpt-6-astra","effort":"max","source":"codex-session-readback"}

The implementation describes both session publication forms from the fetched
merge base when it descends from the activation base. Activation evidence
remains bound to its original base. The local patch target is v0.96.1.

**Criterion 1:** met — the paired draft controls in [controls.json](controls.json) publish two files at the activation base and one after integration, with the required activation clause only in the latter; the original integrated baseline published two. Both arms leave the activation record and stale tracking ref unchanged.
**Criterion 2:** met — the final-publish control excludes the earlier order's moved record and later.txt, admits the fetched base's existing docs/WO-006-notes.md, and preserves both reviewed paths plus four moved records. All 19 publication cases pass, including the unchanged existing final cases. Comparing the records commit with its parent would lose both reviewed paths.
**Criterion 3:** met — draft and final controls refuse their respective no-change messages when their trees equal the described base, with no new forge call.
**Criterion 4:** met — both publication forms refuse the fixture fetch failure before push, name origin and the public selector without a host path, and retain the prepared work. The draft retry uses the identical commit with exactly one preparation event; final retry retains its records head.
**Criterion 5:** met — the unrelated-history control retains the existing activation-ancestry refusal and makes no forge call; all existing target-worktree cases pass.
**Criterion 6:** met — the plan check returns exactly the target-side identifier advisory under both default and relocated roots; other-order, prefix-collision and traversal paths remain advised, and the existing gem-board review-word advisory passes.
**Criterion 7:** met — product 07 explains the described base and activation clause; D001–D007 record counts, merge-base-over-parent reasoning, retained activation evidence, the episode limitation and encountered repairs. The complete npm test -- --review row below and npm run publication:check pass. This claim requires a current-tree passing npm run test:docs result before ImplementationReady; the lifecycle transition consumes the document row and refuses a stale or failing one.

**Complete gate:** `npm test -- --review`, exit 0, recorded
2026-10-24T20:14:11.199Z; 1558.394 seconds; 105 fresh
tasks, 0 reused and zero unrun. Code identity:
`201d143894c00d9beaa6b4c24297b4e79d8110d0baba3d89a77ccaa594c10aaf`. [gate-runs.json](gate-runs.json)
retains the failed attempts and this passing row. The full run covers every
named Preflight suite; the focused case recorded in D007 only reproduced its
preceding complete-run failure.

**Generated checks:** synchronization is current; the harness check passes
all 35 generated surfaces. Publication checks pass with 255/255 headings
indexed, three identical claim links per voice, and 29/45 linked source
sections current in the two editions. No edition was re-minted.

**Final document gate:** run after these final authored bytes and formatting;
`implementation-ready` is authorized only with its passing row for the
current tree. That canonical row is retained in the local gate journal,
without changing this report after the check.

self-review: found 2; fixed 2; recorded 0

Two fresh `codex-spawn-agent` workers, gpt-6.1-sol at max effort, each found
and confirmed repair of the same stale same-tree retry body defect. Each has
zero residual findings. [self-review.md](self-review.md) gives individual
counts, the conditional concern they withdrew and their evidence limits.

**Goal alignment:** matched the publication and advisory correction. D003
restored a missing release-heading placeholder, and D006 preserved a
misclassified document comparison in the document suite. No lint rule,
activation record or episode diff binding changed. The episode form and
planning-time base admission remain the order's stated known issues, with
reopening observations in D002. Fixtures used a local forge; no live forge
publication was performed.

**Process cost:** Entry counter: 47,463 total tokens from
codex-transcript-counter, dispatch scope, cutoff 2026-10-24T18:57:34.800Z;
cost unavailable. The handoff counter is read from the same source, with its
scope and cutoff reported in the final response and retained in the ignored
usage receipt. Final counters are not copied into tracked artifacts. The
measured comparison preserves the reviewed change at six merge-base paths
versus four parent paths; D005 records the extra body edit accepted for
longer-history same-tree retries. Failed complete runs are preserved rather
than omitted from process cost.
