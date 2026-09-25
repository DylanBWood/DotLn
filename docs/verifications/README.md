# Verification artifacts

Verifier reports are immutable evidence grouped by authoritative work order:

```text
docs/verifications/WO-003/VER-001.md
docs/verifications/WO-003/VER-002.md
docs/verifications/WO-003/VER-003.md
```

`docs/work-orders/WO-003-*.md` remains the scope authority. `VER-001` is the
first independent verification; every re-verification writes the next unused
number and never edits, replaces, or deletes an earlier report.

A repair episode reads both the original work order and the specific verifier
report it was dispatched to fix. A verifier reads the original work order, the
current subject, and relevant prior reports before appending the next report.
The final reviewer reads the original work order and the complete ordered
verification sequence so the code → verify → fix history remains visible.

**Criterion lines (WO-158, 2026-09-25).** A report judges an acceptance
criterion once, on one line outside code fences (as a paragraph, a bullet or
numbered item, or a quotation): `**Criterion <id>:** met`,
`**Criterion <id>:** unmet`, or, for a criterion the operator waived through
`npm run resume -- waive`, `**Criterion <id>:** unmet, waived by <ordinal>`
naming that `CriterionWaived` event's ordinal. A waiver neither passes nor
fails the criterion. `verification-result` and `final-review-result` refuse a
pass over an unwaived unmet line, a waiver the control log lacks, and an unmet
line that omits the waiver the log holds. A wrong verdict takes a later report;
`npm run resume -- correct` never changes a verdict or a report's bytes.

**Current attestation contract (WO-132, 2026-09-15).** The verifier records
its actual harness, version, model, effort and epistemic source. These fields
are required as observations; discovery gaps, version minimums, effort
recommendations and absent readback do not refuse a completion. `unknown` is
admitted and other values remain as supplied. A report includes exactly one
single-line machine header matching the completion actor:

```markdown
**Actor attestation:** {"harness":"claude-code","harnessVersion":"<version>","model":"<model>","effort":"xhigh","source":"self-reported"}
```

Canonical field order follows the completion parser: `harness`, `harnessVersion`,
`model`, `effort`, optional `mode` and `raw`, `source`, then optional `accountLabel`.
`ultra` and `ultra code` normalize to `xhigh` with subagents while retaining the
raw spelling:

```markdown
**Actor attestation:** {"harness":"codex-cli","harnessVersion":"unknown","model":"unknown","effort":"xhigh","mode":"subagents","raw":"ultra code","source":"self-reported"}
```

For the second example, pass `--effort 'ultra code'` so the completion parser
records the normalized level, mode and original spelling together.

The report necessarily exists before its `VerificationCompleted` event. The
verifier therefore invokes `verification-result` with those same values;
`resume` compares the machine header before append and refuses a missing,
malformed, or differing actor without recording the verdict. A successful
completion is the executable agreement evidence rather than a report claiming
to inspect its own future event. Later reviewers quote the immutable header and
event together; a quoted header must not begin at column one, because the
completion command requires exactly one such line in the report it checks, so
indent or blockquote it. Reports from before the 2026-09-02 forward-only migration
legitimately have neither machine header nor control-log actor.

**Evidence migration (WO-132, 2026-09-15).** WO-126 through WO-131 reports,
receipts, timings and evidence editions remain immutable and retain the contract
under which they were recorded. Current completion commands run `git diff --check`
and append the legal event without requiring a full test gate, session authorship,
output-read receipts or usage counters. Missing observations are advisory and
usage remains `unknown` when unavailable. This does not convert unsupported
acceptance claims into passes: the verifier still runs the evidence needed to
judge the work order. The reviewer runs the product gate once with
`npm test -- --review`; its committed success row, keyed by code identity, is the
PR and release evidence. Release close runs no suite. A report or control write
after the run does not invalidate code identity. Historical whole-tree and
replica/cache requirements are not retroactively imposed or erased.

Reports may contain bounded repair checklists, but they do not expand work-order
scope. New authority comes only from the operator or an amended/new work order.

A work order may explicitly require an implementer-owned hardening receipt in
this directory. Such a receipt uses a non-`VER-NNN` name, states that it is not
independent verification, and is ignored by the verification-number allocator.
It supplements rather than replaces the next independent `VER-NNN` report.

Migration note: WO-002's surviving re-verification is honestly numbered
`VER-002`; its earlier VER-001 artifact predates this convention and is not
available. Do not fabricate it to make the sequence appear complete.

Closure note for WO-002 (recorded 2026-08-31): `VER-002`'s terminal verdict
reads "WO-002 does not pass" with an unchecked blocking checklist, and no
`VER-003` exists — yet WO-002 was repaired and merged (`5af72a6`). This is not
an oversight. The operator confirms the repaired tree and `VER-002` were
reviewed by the planning model before WO-003 was cut, and that review is what
closed it. The numbered sequence cannot show this because the review happened in
a session, not an artifact. Recorded here so a later verifier or final reviewer
does not re-open it: WO-003's `Depends on: WO-002 complete` is satisfied on that
authority. The general lesson is the one in `CLAUDE.md` — a closure that lives
only in a chat effectively did not happen, so record it.
