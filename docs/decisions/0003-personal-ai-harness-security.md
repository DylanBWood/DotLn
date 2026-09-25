# ADR-0003 — Personal AI harnesses stay sandboxed with human-reviewed boundaries

**Status:** Accepted (2026-09-01), amended 2026-09-25. The original
sandbox-on decisions below are historical; the [amendment](#amendments) records
the current posture: host sandboxes off in all three CLIs.

## Context

DotLn uses Claude Code and Codex CLI as peer work-order harnesses. Their
permissions are personal-machine safety boundaries, not product configuration,
but they still affect whether an agent can leave the requested repository, reach
a network service, write Git metadata, or encounter credentials.

Tool availability is not authority. A harness can discover a path, host,
connector, or command without having any reason to use it. Prose alone is not a
sufficient backstop for an exploratory mistake, while disabling all automation
would add friction without improving the agent's underlying decision rule.

The two vendors expose different controls and change them independently. A
portable repository setting cannot truthfully make their sandboxes equivalent.

## Original decision — 2026-09-01

1. Keep the operating-system shell sandbox enabled in every current personal
   harness. Use the vendor's locally tested, human-reviewed permission path for
   commands that cross its boundary; do not use auto-review, never-ask, or full
   access as the normal DotLn posture.
2. Fail closed when Claude's sandbox is unavailable, disable its unsandboxed
   fallback, route sandboxed Bash through explicitly pinned `default` regular
   permissions, and deny direct SSH/SCP/SFTP commands plus reads and writes of
   the SSH credential directory.
3. Run Codex with workspace-write, on-request approval, the operator as
   reviewer, and shell network disabled. Keep its command allow-rule set empty
   unless a later work order justifies a narrow stable exception.
4. Treat the controls as defenses behind the authority invariant: discovering a
   credential, host, open port, connector, or capable tool never grants
   permission to inspect or use it.
5. Store personal settings only in their user/local configuration layers. The
   repository stores a dated, sanitized enable/verify/undo runbook and no
   credential, private path, or complete personal config file.
6. Record vendor and version asymmetries honestly. At the accepted snapshot,
   Codex can broadly read outside the repository and its workspace-write sandbox
   protects linked-worktree Git metadata; Claude's configured SSH denial is
   stronger for credential reads and its sandbox permits the Git metadata needed
   by DotLn checkpoints.
7. Until lifecycle checkpointing gains a sandbox-independent or backfill path, a
   Codex session requests explicit outside-sandbox approval on the first
   invocation of every state-changing `resume` command. `status` is read-only;
   `next` appends no event and creates no checkpoint. Both remain sandboxed.

The operative snapshot and rollback instructions live in
[`docs/AI-HARNESS-SECURITY.md`](../AI-HARNESS-SECURITY.md). Changes to this
safety posture require explicit work-order authority, a sanitized receipt, and
an amendment or superseding decision after locally verifying current vendor
behavior.

## Consequences

- Routine in-repository work remains low-friction, while network access,
  protected metadata writes, and unsandboxed commands return to the operator.
- Claude and Codex do not present identical prompts. The runbook describes the
  effective guarantee of each instead of flattening both into “regular
  permissions.”
- Codex's broad read boundary remains a known limitation. Moving to its custom
  filesystem-permission profiles is a separate migration because those profiles
  replace the legacy sandbox configuration rather than merely adding one deny.
- Browser, web-search, plugin, app, and MCP permissions remain separate surfaces
  that must be reviewed when introduced or changed.
- Vendor upgrades can invalidate the recorded syntax or defaults. The tested
  date/version and effective-state checks are part of the baseline.
- A checkpoint warning means the lifecycle event recorded without a new recovery
  ref. It is not a failed transition, must not be retried after the fact, and
  must never fall back to an older advertised ref.
- The checkpoint workaround unsandboxes the full project-controlled `npm`
  process, not merely a Git subcommand. The exact command, package mapping, and
  lifecycle-script diff must be inspected before a one-invocation approval;
  persistent allow rules are forbidden. A narrower checkpoint mechanism remains
  the preferred future repair.

## Alternatives rejected

- **Disable the sandbox for both harnesses.** This removes a useful containment
  layer to avoid a narrow Git-metadata approval.
- **Use Claude's sandboxed-Bash auto-allow mode.** Automatically approving every
  sandboxed Claude Bash command weakens the review boundary that this setup
  exists to provide.
- **Commit provider configuration as repository policy.** Personal scopes,
  linked-worktree behavior, and vendor versions differ; committing a partial
  personal config would imply enforcement the repository does not have.
- **Silently redesign Codex filesystem permissions now.** The custom-profile
  migration is broader than the authorized alignment and needs its own evidence
  and rollback plan.

## Amendments

**2026-09-25 — WO-161: host sandboxes off in all three CLIs.** The operator
reaffirmed the standing choice that Claude Code, Codex and Copilot run without
host sandboxing. The 2026-09-17 security note already records Claude's sandbox
off and Codex's `danger-full-access` plus `never`; the operator's 2026-09-25
direction explicitly includes Copilot. This amendment records that direction
under [WO-161](../work-orders/WO-161-sandbox-vocabulary.md); it does not change
personal settings or claim a new enforcement probe for the other CLIs.

This supersedes Decision 1's sandbox-on/default-review posture, Decision 2's
required sandbox and fallback posture, Decision 3's required Codex mode, and
Decision 7's unconditional approval procedure. It also supersedes the required
sandbox-on posture and associated permission-mode preferences in ADR-0004 and
ADR-0005. Their original decisions and consequences remain historical records.
The authority invariant, personal-settings privacy, Clean Room floor and
honest reporting of host differences remain in force.

DotLn's refusals plus the host permission mode are the boundary. Claude enforces
the five observed refusal conditions; Codex carries the same duties as role
text; Copilot's supported boundaries and limits remain those in the
[security note](../AI-HARNESS-SECURITY.md). These are not OS containment of
arbitrary programs. Full-access Codex sessions do not use the retained
`workspace-write` plus `on-request` escalation procedure. DotLn's discovery
Seatbelt and spawned Codex workers' `--sandbox workspace-write` are separate
mechanisms and retain their names and behavior.

Reopen when the operator changes a host's posture or current executable evidence
contradicts this description. Review and document such a change explicitly;
never infer permission to alter personal settings from this amendment.
