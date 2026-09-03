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

For work orders governed by the effort-attestation mechanism, the verifier
states its harness, harness version, model, effort, and epistemic source in prose
and includes exactly one single-line machine header using the normalized actor
shape (including `raw` only when applicable):

```markdown
**Actor attestation:** {"harness":"claude-code","harnessVersion":"<version>","model":"<model>","effort":"xhigh","source":"self-reported"}
```

The canonical serialization has no extra whitespace and orders keys as
`harness`, `harnessVersion`, `model`, `effort`, optional `raw`, then `source`.
For example, an unmapped label is:

```markdown
**Actor attestation:** {"harness":"codex-cli","harnessVersion":"<version>","model":"<model>","effort":"unknown","raw":"ultracode","source":"self-reported"}
```

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
