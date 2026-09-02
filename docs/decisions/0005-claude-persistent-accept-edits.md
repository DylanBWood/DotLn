# ADR-0005 — Claude starts in Accept Edits inside the fail-closed sandbox baseline

**Status:** Accepted (2026-09-01)

## Context

WO-006 changed Claude's personal permission posture while verification was in
progress. The operator enabled sandboxed-Bash auto-allow and selected Accept
Edits to stop an untenable approval stream, then disclosed the moving state and
the desired end state to the verifier. That intervention created the initial
settings-versus-documentation mismatch, but it did not make persistent Manual
mode the desired outcome.

`VER-001` correctly declined to mutate personal settings. It reported that
`permissions.defaultMode` was still `default`, that Accept Edits was only
session-local, and that a new session would therefore return to Manual. The
operator was told that the repair pass would reconcile the finding.

The repair instead retained `defaultMode: "default"`, documented Manual as the
intentional baseline in ADR-0004, and recorded `RepairCompleted` while the
reported startup regression remained. The operator's later correction is new
decision evidence: the repair was expected to persist Accept Edits as part of
the complete low-friction, contained posture.

## Decision

1. Supersede ADR-0004 Decision 4 only. Persist
   `permissions.defaultMode: "acceptEdits"` in the user settings so new terminal
   sessions start in Accept Edits rather than Manual.
2. Keep `sandbox.enabled: true` and
   `sandbox.autoAllowBashIfSandboxed: true`. These are independent controls:
   Accept Edits covers in-scope file edits, while sandbox auto-allow covers Bash
   commands that remain inside the operating-system sandbox.
3. Keep the compensating controls explicit: fail closed when the sandbox is
   unavailable, disable unsandboxed retries, and retain the credential-path and
   direct SSH/SCP/SFTP denials. Accept Edits is not bypass-permissions mode and
   does not override a deny rule.
4. Remove the eleven command-specific checkout-local Bash grants accumulated
   during WO-006. They were not baseline authority and are redundant under the
   intended sandboxed-Bash posture. Their contents remain private; only the
   sanitized count and removal are recorded.
5. Treat a fresh-session mode check as required evidence for future changes to
   `defaultMode`. A JSON readback alone is necessary but insufficient when the
   defect is startup behavior.

The dated effective-state snapshot and enable, verify, and undo instructions
live in
[`docs/AI-HARNESS-SECURITY.md`](../AI-HARNESS-SECURITY.md).

## Consequences

- New Claude terminal sessions start with in-workspace edits automatically
  accepted. The operator reviews those changes through the working-tree diff
  rather than approving each edit inline.
- Sandboxed Bash continues to run without an ordinary per-command prompt.
  Commands that cannot remain sandboxed do not gain an escape path.
- The explicit credential and transport denials remain higher-priority safety
  boundaries.
- The checkout-local remembered Bash grant count returns to zero, eliminating
  accidental per-command permission drift from this work order.
- The repository records this personal-machine choice but does not install or
  enforce it for another user.

## Alternatives rejected

- **Keep Manual as the persisted default.** That preserves the exact startup
  regression the operator sent the repair pass to fix.
- **Rely on an in-session mode selection or a vendor default.** Neither proves
  that the next session starts in the intended mode.
- **Use auto mode or bypass permissions.** Those are broader decision policies
  than the requested Accept Edits plus sandboxed-Bash posture.
- **Keep the remembered command grants.** The grants were execution residue,
  not reviewed baseline policy, and the operator explicitly authorized a
  complete settings correction.

## Amendments

None.
