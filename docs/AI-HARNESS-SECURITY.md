# Personal AI harness security baseline

This is the operator's sanitized setup record for AI coding harnesses used with
DotLn. It records personal-machine posture; the repository does not install or
enforce these settings. Re-check vendor documentation and local behavior after
upgrades because names, defaults, precedence, and sandbox boundaries can change.

**Snapshot:** 2026-09-01, Claude Code 2.1.257 and Codex CLI 0.151.0.

The original safety-boundary decision is
[ADR-0003](decisions/0003-personal-ai-harness-security.md), partially superseded
for Claude's sandboxed-Bash review path by
[ADR-0004](decisions/0004-claude-sandboxed-bash-auto-allow.md), whose
Manual-mode default is superseded by
[ADR-0005](decisions/0005-claude-persistent-accept-edits.md). This runbook is
the dated operating detail beneath those decisions.

## Invariant

Discovering a credential, host, open port, connector, or capable tool is not
authority to use it. Repository exploration stays inside the requested project
unless the operator explicitly expands scope. Sandbox controls are a backstop
for that judgment rule, not a replacement for it.

Only two harnesses are in the current loop:

| Harness     | Provider  | Models or roles using it              |
| ----------- | --------- | ------------------------------------- |
| Claude Code | Anthropic | Fable, Opus, and Sonnet assignments   |
| Codex CLI   | OpenAI    | Codex executor and repair assignments |

Model names are not additional harnesses. They inherit the permissions of the
harness that launches them. Browser, web-search, plugin, app, MCP, and other
connectors can have separate permission and network boundaries; neither shell
sandbox below automatically governs all of them.

## Current posture

| Control                  | Claude Code                                                                          | Codex CLI                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| Filesystem sandbox       | enabled                                                                              | `workspace-write`                                                                         |
| File-edit review         | in-workspace edits auto-accept; review occurs through the working-tree diff          | edits inside `workspace-write` run without a separate harness prompt                      |
| Command review           | sandbox-contained Bash auto-allows; explicit denies and sandbox boundaries still win | user reviews sandbox-boundary escalation                                                  |
| Shell network            | sandboxed and permission-gated                                                       | disabled inside the workspace sandbox                                                     |
| Unsandboxed fallback     | disabled                                                                             | explicit approval required                                                                |
| Sandbox startup failure  | fail closed                                                                          | helper/config diagnostics must pass                                                       |
| SSH safeguards           | SSH credential reads/writes and direct `ssh`, `scp`, and `sftp` commands are denied  | no command allow rules; shell SSH cannot cross the network boundary without user approval |
| Remembered command rules | no checkout-local allow entries                                                      | no command allow rules                                                                    |

The review rows are intentionally not described as identical. Claude's posture
combines two independent controls: `acceptEdits` accepts in-workspace edits, and
sandbox auto-allow accepts Bash only when the command remains in the enabled
sandbox. Fail-closed startup, disabled unsandboxed fallback, and the
credential/SSH denials remain compensating controls. Codex 0.151.0's locally
supported low-friction mode automatically runs routine work inside the workspace
and asks when a command needs to cross a sandbox boundary. It does not prompt
for every Bash invocation.

The first Claude effective-state check on 2026-09-01 found eleven
command-specific `permissions.allow` entries in the main checkout's local
settings. They accumulated during WO-006 and were not required baseline content.
After the operator authorized a complete correction, the repair removed all
eleven without publishing their commands. The sanitized checkout-local count is
now zero.

Post-correction evidence on the same date matched the table above: targeted
readback found `defaultMode: "acceptEdits"`, all four sandbox/fallback values at
their pinned values, fourteen retained deny entries, and zero allow entries at
user, main-checkout-local, and WO-006 worktree layers. A new plain `claude`
process, launched without a permission-mode override, rendered `accept edits on`
at startup, and its `/sandbox` view selected “Sandbox BashTool, with
auto-allow.” `claude doctor` exited successfully and reported no invalid-setting
warning; its one warning concerned Keychain writability in the diagnostic
environment, so no unrelated Keychain setting was changed.

### Portable shell-fixture evidence (2026-09-02)

WO-013 removed the shell suites' absolute temporary-root choice. In a fresh
noninteractive Claude Code 2.1.258 session, Claude Sonnet 5 at low effort ran
the unchanged `npm test` directly from the worktree with the existing
`acceptEdits` plus sandboxed-Bash auto-allow posture. The Bash tool reported its
session-provided `$TMPDIR`; the command exited zero, all seven shell suites
passed, and the compiled Node suite reported 77 tests, 77 passes, and zero
failures. No source mirror or test-copy relocation was used, no permission
prompt or persistent allow rule was accepted, and no unsandboxed fallback was
enabled. Future verification no longer needs the WO-006 relocation deviation.

The captured Bash result's sanitized load-bearing excerpt was:

```text
[session-provided TMPDIR]
$ npm test
All matched files use Prettier code style!
fixture temp-root tests passed
publication checker tests passed
backup-intake tests passed
resume tests passed
checkpoint tests passed
worktree tests passed
release tests passed
# tests 77
# pass 77
# fail 0
npm test exit status: 0
```

The final evidence session issued two simple Bash calls: `printenv TMPDIR` and
`npm test`. Both auto-executed without a prompt, the stream ended successfully,
and no retry ran. A preliminary evidence session's pre-run listing identified
three older `dotln-*` entries already beneath the Claude temp base; they were
observed and left untouched. The executor also ran the unchanged command under a
separate supplied-root-only macOS policy: direct writes to the legacy base and
the surrounding session-temp parent were denied, writes to the supplied root
were allowed, `npm test` exited zero, and the root's before/after `dotln-*`
listings were both empty. An ordinary outside-all-sandboxes run under a fresh
owned temporary base also exited zero with 77 of 77 compiled tests passing and
empty before/after residue listings. This note updates the fixture-path evidence
only; it does not replace the broader dated posture snapshot above.

## Claude Code

### Enable or restore the baseline

The durable baseline belongs in personal user settings so new sessions and
worktrees do not depend on a gitignored file being copied. Merge the following
keys into the existing file; do not replace the entire settings file.

Personal user settings (`~/.claude/settings.json`):

```json
{
  "sandbox": {
    "enabled": true,
    "autoAllowBashIfSandboxed": true,
    "failIfUnavailable": true,
    "allowUnsandboxedCommands": false,
    "credentials": {
      "files": [{ "path": "~/.ssh", "mode": "deny" }]
    }
  },
  "permissions": {
    "defaultMode": "acceptEdits",
    "deny": [
      "Read(~/.ssh/**)",
      "Edit(~/.ssh/**)",
      "Bash(ssh)",
      "Bash(ssh *)",
      "Bash(scp)",
      "Bash(scp *)",
      "Bash(sftp)",
      "Bash(sftp *)"
    ]
  }
}
```

The main checkout's local settings may repeat the sandbox keys below. They are a
redundant project-local confirmation, not the durable source of truth, and must
not override `permissions.defaultMode`:

```json
{
  "sandbox": {
    "enabled": true,
    "autoAllowBashIfSandboxed": true
  }
}
```

`autoAllowBashIfSandboxed: true` is the explicit parallel-work tradeoff recorded
by ADR-0004. It removes ordinary per-command review only for Bash that remains
inside the active sandbox. `defaultMode: "acceptEdits"` separately persists
automatic in-workspace editing for new sessions; it is not auto mode or bypass
permissions, and explicit deny rules still win.

No checkout-local `permissions.allow` entry is part of the baseline. The eleven
entries observed during `VER-001` were removed under explicit operator
authority. Investigate any nonzero count locally without copying rule contents
into repository evidence.

The sandbox credential block and matching Read/Edit rules deny both directions
for the SSH credential directory. Add explicit denies for other credential
stores used on the machine instead of assuming this one path covers them all.

### Verify

Start a new Claude session after changing settings.

1. Open `/sandbox`. Its configuration view should show the sandbox enabled and
   sandboxed-Bash auto-allow on.
2. Open `/status` to confirm which user, project, and local files loaded.
3. Confirm the fresh session reports Accept Edits, then open `/permissions` and
   confirm `acceptEdits`, the SSH/SCP/SFTP denies, and a zero checkout-local
   allow-rule count. Investigate a different count locally without copying rule
   contents into repository evidence.
4. Run `claude doctor` and resolve invalid-setting warnings.

Do not verify by attempting a real SSH connection or opening a private key.

### Undo

- To return sandboxed Bash to the earlier regular-permission path, set
  `autoAllowBashIfSandboxed` to `false` or remove the explicit key and re-check
  the then-current default.
- To return file edits to Ask-before-edits / Manual startup, set
  `permissions.defaultMode` to `default`. Removing `defaultMode` instead returns
  startup behavior to the then-current vendor default and is not an equivalent
  pinned rollback.
- To remove a remembered checkout-local command grant, review and delete that
  exact entry through the current permissions UI or local settings. Do not
  replace the whole file or remove unrelated rules as a shortcut.
- To disable Claude's sandbox intentionally, set `sandbox.enabled` to `false` or
  use the current `/sandbox` UI. This removes a useful defense and is not the
  recommended DotLn posture.
- Removing `failIfUnavailable` or `allowUnsandboxedCommands` returns those
  controls to version-dependent defaults. Keep the SSH credential block and deny
  rules unless the intent is also to make those credentials reachable.

Managed, command-line, local, project, and user settings can override one
another. Always verify effective state in the actual worktree instead of
trusting one file in isolation.

## Codex CLI

### Enable or restore the baseline

Merge this block into `~/.codex/config.toml`:

```toml
approval_policy = "on-request"
sandbox_mode = "workspace-write"
approvals_reviewer = "user"

[sandbox_workspace_write]
network_access = false
```

The reviewer line is explicit even though `user` is the documented current
default. Do not use `approvals_reviewer = "auto_review"` or `--approve-for-me`
when the goal is human review.

Codex 0.151.0 locally rejects `approval_policy = "untrusted"`, although newer
online documentation describes that policy. Use the locally validated
`on-request` value for this snapshot and re-test after upgrading rather than
copying a newer example blindly.

Exact Claude-style command-review parity is unavailable in this installed Codex
version. A stricter supported alternative is `sandbox_mode = "read-only"` with
`approval_policy = "on-request"`; built-in/file reading remains available, but
shell-command execution, edits, and network access require approval. This is
substantially noisier than Claude's current sandboxed-Bash auto-allow posture.

The personal command-rules file currently contains no pre-approved commands. A
Codex `allow` rule runs a matching command outside the sandbox without asking;
add one only for a stable, narrowly reviewed command. A stale WO-specific Git
stash exception was removed when this baseline was recorded.

### Verify

Start a new Codex session after changing user configuration. In that session,
`/permissions` should report workspace-write, on-request approvals, and the user
as reviewer. The following diagnostic is useful even when unrelated network
checks make the overall doctor command non-green:

```bash
codex doctor --json \
  | jq '.checks["config.load"], .checks["sandbox.helpers"]'
```

The expected targeted result is a loaded configuration with `OnRequest`, a
restricted filesystem sandbox, and a restricted network sandbox.

### Undo

- To undo only the explicit reviewer pin, remove `approvals_reviewer = "user"`;
  it returns to the version-dependent default.
- To restore this recommended sandbox after experimentation, set
  `sandbox_mode = "workspace-write"`, `approval_policy = "on-request"`, and
  `network_access = false` as above.
- `sandbox_mode = "danger-full-access"` disables the filesystem sandbox. It is
  an intentionally unsafe mode, not the inverse recommended for normal DotLn
  work. Never pair it with `approval_policy = "never"` as a convenience.

Workspace-write primarily protects writes. In the current local profile, Codex
can broadly read outside the repository, so this is not proof that `~/.ssh` is
unreadable. Shell network denial and human-reviewed escalation stop an
unsolicited SSH connection, while repository policy forbids credential
exploration. The candidate Malcolm Check expresses the same selection doctrine,
but it is not an implemented permission guard. A future move to Codex custom
filesystem permissions should be treated as a separate reviewed migration
because it replaces, rather than simply augments, this legacy sandbox
configuration.

## Why recovery checkpoints warn under Codex

Every state-changing `npm run resume -- ...` transition first tries to capture
the dirty worktree in a local `refs/dotln/checkpoint/...` Git ref. Codex's
workspace-write sandbox always protects `.git` and the resolved shared Git
directory of a linked worktree. The checkpoint's throwaway index lives in a
writable temporary directory, but Git must still write objects and the ref into
that protected metadata directory.

Therefore the old explanation that the sandbox “cannot write Git's temporary
index” is incomplete. The exact meaning of the warning is:

- the lifecycle event was appended and its phase transition succeeded;
- no recovery ref was created for that latest transition; and
- the projection deliberately says `unavailable` instead of showing an older,
  stale restore point.

This is a real harness integration seam, not evidence that the transition failed
and not a reason to disable the whole sandbox. At this snapshot:

- In Codex, run each **state-changing** resume command with explicit,
  one-invocation outside-sandbox approval on its first invocation. `status` is
  read-only; `next` appends no event and creates no checkpoint, although it
  refreshes the workspace projection. Neither needs Git escalation. Do not run a
  transition sandboxed and then repeat it; the first invocation records even
  when its optional checkpoint fails.
- That approval unsandboxes the entire project-controlled `npm`/JavaScript
  process, not only its Git calls. Before approving, inspect the exact command,
  the `resume` mapping in `package.json`, and the current `scripts/resume.mjs`
  diff. Approve once rather than creating a persistent command rule; the
  operator may instead run the reviewed exact command directly.
- Claude's current sandbox permits the linked worktree's shared Git metadata
  writes, apart from protected Git configuration and hooks, so the same
  checkpoint normally succeeds with the current sandboxed-Bash auto-allow
  posture.
- If the warning already occurred, run `npm run resume -- status`, trust the
  recorded phase, and do not use an older checkpoint. Any later stash or Git
  recovery write also requires explicit Codex approval.

A future lifecycle change may replace this operational workaround with a
sandbox-independent checkpoint or a first-class backfill action. Until then, the
first-invocation approval rule is part of the dispatch contract.

## Adding another harness

Before treating a new provider, desktop app, CLI, or connector as equivalent,
record and test:

1. settings locations, scope precedence, and whether linked worktrees inherit
   local settings;
2. filesystem read and write boundaries, especially credentials and `.git`;
3. command approval behavior and every pre-approved exception;
4. shell networking plus separate browser, web, MCP, plugin, and app controls;
5. fail-open or fail-closed behavior when sandboxing is unavailable;
6. enable, effective-state verification, and rollback steps; and
7. the tested date and installed version.

## Vendor references

- Claude Code: [sandboxing](https://code.claude.com/docs/en/sandboxing),
  [permissions](https://code.claude.com/docs/en/permissions),
  [settings](https://code.claude.com/docs/en/settings), and
  [commands](https://code.claude.com/docs/en/commands).
- Codex: [sandboxing](https://learn.chatgpt.com/docs/sandboxing),
  [basic configuration](https://learn.chatgpt.com/docs/config-file/config-basic),
  [approvals and security](https://learn.chatgpt.com/docs/agent-approvals-security),
  and [command rules](https://learn.chatgpt.com/docs/agent-configuration/rules).
