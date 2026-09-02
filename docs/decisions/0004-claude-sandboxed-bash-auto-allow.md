# ADR-0004 — Claude sandboxed Bash may auto-allow inside fail-closed containment

**Status:** Accepted (2026-09-01)

## Context

ADR-0003 established the first personal Claude Code and Codex CLI safety
baseline. It routed Claude's sandboxed Bash through regular `default`
permissions and rejected sandboxed-Bash auto-allow because per-command review
was part of that baseline.

During WO-006 verification, parallel-subagent work made that regular permission
path produce an untenable approval stream. The operator enabled Claude's
sandboxed-Bash auto-allow mode and directed the verifier to fail the stale
documentation until the new posture was recorded. The observed change and its
timing are preserved in
[`VER-001`](../verifications/WO-006/VER-001.md); this decision does not rewrite
that evidence or the earlier decision.

## Decision

1. Partially supersede ADR-0003 Decision 2's requirement to route sandboxed
   Bash through `default` regular permissions, and its rejection of Claude's
   sandboxed-Bash auto-allow mode. All other ADR-0003 decisions remain in
   force.
2. Permit `autoAllowBashIfSandboxed: true` only while Claude's operating-system
   sandbox is enabled. This accepts less per-command human review for commands
   that remain inside that sandbox; it does not authorize sandbox escape or
   unsandboxed execution.
3. Retain the compensating controls: fail closed when sandbox startup fails,
   disable unsandboxed fallback, and keep the direct SSH/SCP/SFTP and SSH
   credential-directory denials intact.
4. Keep `permissions.defaultMode: "default"` for permission decisions that
   still reach the normal permission layer. An in-session Accept Edits choice
   is not a persistent baseline and must not be documented as one.
5. Treat checkout-local command-specific allow entries as observable local
   drift, not as repository policy or required baseline content. Inventory them
   in sanitized aggregate, review their scope and continued need locally, and
   never publish their exact commands from personal configuration.
6. Keep the authority invariant unchanged: a command, host, credential,
   connector, or tool being discoverable or sandbox-compatible never grants a
   reason to use it.

The dated effective-state snapshot, enable/verify/undo instructions, and
sanitized local-drift count live in
[`docs/AI-HARNESS-SECURITY.md`](../AI-HARNESS-SECURITY.md).

## Consequences

- Parallel Claude sessions can execute sandbox-contained Bash without a prompt
  for every command, at the explicit cost of removing that per-command review
  signal.
- Fail-closed startup, no unsandboxed fallback, and credential/SSH denials are
  load-bearing compensating controls rather than optional refinements.
- Commands that do not remain within the sandbox are not made permissible by
  auto-allow. The operator still owns any authority expansion or safety-setting
  change.
- Remembered local allow entries can outlive the session that created them.
  Their aggregate presence is visible in the runbook, while their exact private
  contents and any removal remain local operator decisions.
- This is a personal harness choice, not a DotLn runtime capability or a
  repository-enforced guarantee.

## Alternatives rejected

- **Return immediately to regular-permission review for every sandboxed Bash
  command.** The observed parallel-subagent approval volume made that posture
  operationally untenable.
- **Disable the sandbox or enable unsandboxed fallback.** Either would discard
  the containment that makes the narrower auto-allow tradeoff acceptable.
- **Clear remembered local allow entries as part of this documentation
  repair.** WO-006 repair has authority to reconcile the record, not to mutate
  personal safety settings without a separate operator instruction.

## Amendments

None.
