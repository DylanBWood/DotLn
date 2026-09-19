# Personal AI harness security baseline

This is the operator's sanitized setup record for AI coding harnesses used with
DotLn. It records personal-machine posture; the repository does not install or
enforce these settings. Re-check vendor documentation and local behavior after
upgrades because names, defaults, precedence, and sandbox boundaries can change.

**Current operating note:** 2026-09-17; Codex CLI 0.154.0 checked locally.
The September 1 snapshot below records Claude Code 2.1.257 and Codex CLI
0.151.0. Its sandboxed configuration is retained as a reference, not the current
operator-selected mode.

**Version-only re-check, 2026-09-19 (WO-142):** `codex --version` returned
`codex-cli 0.155.0`; `claude --version` returned `2.1.278 (Claude Code)`.
Only installed CLI version strings were re-checked. The earlier behavioral
probes remain evidence of their recorded versions; this check does not
requalify permission behavior or establish current effective settings.

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

## Current mode choices and settings locations — 2026-09-17

The operator reports **Claude sandbox off, auto mode on**, with the supplied
user settings file unchanged. The active Codex session reports **approval
`never`, sandbox `danger-full-access`**; the operator removed
`approvals_reviewer = "auto_review"` from their TOML. These choices supersede
the earlier operating preference below. Claude's mode is operator-attested here,
not a fresh enforcement probe. The WO-136 experiment remains inconclusive.

During WO-135 the operator separately authorized installing
`~/.codex/rules/personal-remote-deny.rules`. That file now forbids matching
SSH/SCP/SFTP commands. **No `config.toml` edit was needed or made**, and no
sensitive-file permission profile was installed. The operator then requested
this cross-harness reference. Personal settings and credential contents are
not repository artifacts.

Sandboxing and permission decisions are independent controls:

| Harness and mode | Command decisions | Filesystem boundary |
| --- | --- | --- |
| Claude, sandbox enabled | Explicit deny rules remain active. `autoAllowBashIfSandboxed` can admit sandbox-contained Bash. Auto permission mode separately uses classifier review. | Sandbox read/write restrictions apply to contained subprocesses; inspect any excluded commands or unsandboxed requests. |
| Claude, sandbox disabled, auto mode | Explicit tool denies still win; the classifier reviews actions that still need approval. Auto mode can still prompt. | No OS sandbox. Read/Edit denies cover built-in tools and recognized shell file operations, not every indirect file open by an arbitrary script. |
| Codex, `workspace-write` with `on-request` | Command rules apply; approval can be requested for escalation. | Workspace-oriented write restrictions; network follows `[sandbox_workspace_write]`. Broad reads are not a sensitive-file denial. |
| Codex, `danger-full-access` with `never` | Matching `forbidden` command rules still reject before execution. Other actions do not ask for approval. | No filesystem sandbox; command rules do not prevent arbitrary programs from reading sensitive paths. |
| Codex, named permission profile with `never` | Command rules still apply; denied operations do not escalate through prompts. | Explicit filesystem path rules are enforced for sandbox-contained commands. Broad access elsewhere and network access can be retained. |

These are tool and subprocess boundaries, not an assertion that browser, MCP or
other connectors share them. Claude documents Bash-pattern and indirect-read
limits; Codex documents its bounded shell command parsing. Neither set of
command patterns is an OS-wide ban on every possible implementation of remote
access. Sources: [Claude permissions](https://code.claude.com/docs/en/permissions),
[Claude sandboxing](https://code.claude.com/docs/en/sandboxing),
[Codex permissions](https://learn.chatgpt.com/docs/permissions), and
[Codex command rules](https://learn.chatgpt.com/docs/agent-configuration/rules).

| Setting | Location and scope |
| --- | --- |
| Claude personal defaults, including `permissions.deny`, `permissions.defaultMode` and `sandbox` | `~/.claude/settings.json`, across projects. |
| Claude shared project settings | `.claude/settings.json`; in DotLn this also contains generated hook wiring. |
| Claude personal project overrides | `.claude/settings.local.json`, normally ignored. `/sandbox` changes can be stored here. |
| Claude session/UI mode | CLI `--permission-mode` affects a launch; Desktop remembers a mode per folder. A user settings file alone cannot establish effective mode. |
| Codex personal defaults and named permission profiles | `~/.codex/config.toml`, or `config.toml` under an explicitly selected `CODEX_HOME`. |
| Codex selected configuration profile | `~/.codex/<name>.config.toml`, selected with `--profile <name>`; separate from a `[permissions.<name>]` permission profile. |
| Codex managed requirements | Organization-managed `requirements.toml` constrains configuration separately from personal defaults. |
| Codex project configuration | `.codex/config.toml` in a trusted project, subject to config precedence and managed requirements. |
| Codex command rules | `.rules` files under active configuration layers' `rules/` directories; the personal file installed here is `~/.codex/rules/personal-remote-deny.rules`. These are separate from TOML. |

Claude's documented precedence is managed, CLI, project local, shared project,
then user; permission lists merge across scopes. Current Claude docs require
`defaultMode: "auto"` in user or managed settings, or a CLI selector: that value
is ignored in project/local settings. Check `/status` and `/permissions` for
loaded sources and effective rules. See [Claude settings](https://code.claude.com/docs/en/settings)
and [permission modes](https://code.claude.com/docs/en/permission-modes).
Codex CLI overrides and project layers can change the personal TOML's effective
values; a trusted project can also provide `.codex/rules/*.rules`. Configuration
profiles use separate files in this version; see [profiles](https://learn.chatgpt.com/docs/config-file/config-advanced#profiles)
and [configuration precedence](https://learn.chatgpt.com/docs/config-file/config-basic).

### Claude examples: keep the denies in either sandbox mode

The operator-supplied permission block is:

```json
{
  "permissions": {
    "deny": [
      "Bash(ssh)", "Bash(ssh *)",
      "Bash(scp)", "Bash(scp *)",
      "Bash(sftp)", "Bash(sftp *)",
      "Read(~/.ssh/**)", "Edit(~/.ssh/**)",
      "Read(~/.aws/**)", "Read(~/.gnupg/**)", "Read(~/.netrc)",
      "Read(~/.config/gh/**)", "Read(~/.kube/**)",
      "Read(~/.docker/config.json)"
    ],
    "defaultMode": "auto"
  }
}
```

Merge keys into personal settings; do not replace unrelated settings. With
`sandbox.enabled: false`, those tool rules remain applicable. With
`sandbox.enabled: true`, they combine with sandbox filesystem enforcement;
`sandbox.filesystem.denyRead` and `denyWrite` can express subprocess path
restrictions. `autoAllowBashIfSandboxed` and `defaultMode: "auto"` are different
features. The earlier sandboxed example below retains the separately recorded
`acceptEdits` configuration. No Claude settings were edited in this dispatch.
[Claude Read/Edit boundaries](https://code.claude.com/docs/en/permissions#read-and-edit),
[sandbox settings](https://code.claude.com/docs/en/sandboxing).

### Codex examples: TOML chooses the mode, rules deny commands

The operator's retained personal TOML mode is:

```toml
approval_policy = "never"
sandbox_mode = "danger-full-access"
```

Removing the reviewer selector does not reproduce Claude auto review: `never`
means no approval prompts. The installed rules file contains this restriction
plus positive/negative matching examples:

```python
prefix_rule(
    pattern = [[
        "ssh", "/usr/bin/ssh",
        "scp", "/usr/bin/scp",
        "sftp", "/usr/bin/sftp",
    ]],
    decision = "forbidden",
    justification = "Remote shell and file transfer commands are disabled.",
)
```

A prefix covers the bare command and its arguments. The installed Codex 0.154.0
policy checker returned `forbidden` for twelve basename/absolute-path cases,
with and without arguments; `git status` and `ls` were not forbidden. No SSH
command was executed. The versioned implementation maps a matched forbidden
rule to rejection independently of approval policy and sandbox mode, and the
orchestrator refuses before launch. This corrects the initial uncertainty in
this session: **command denials work with full access; filesystem denials
require sandbox enforcement**. [Policy implementation](https://github.com/openai/codex/blob/rust-v0.154.0/codex-rs/core/src/exec_policy.rs),
[execution rejection](https://github.com/openai/codex/blob/rust-v0.154.0/codex-rs/core/src/tools/orchestrator.rs).

Codex loads `.rules` files when a root session starts. **Restart Codex after
adding this file**; validation alone does not replace the active session's
cached policy. A harmless matching check is:

```sh
codex execpolicy check --rules ~/.codex/rules/personal-remote-deny.rules -- ssh example.invalid
```

This evaluates tokens without opening a connection. See the
[rule installation procedure](https://learn.chatgpt.com/docs/agent-configuration/rules#create-a-rules-file).
Absolute paths outside the listed forms and opaque script invocations need
separate consideration; the file is a bounded command policy.

For sandboxed sensitive-file protection while retaining broad access elsewhere,
Codex 0.154.0 also supports this **alternative, not installed**:

```toml
approval_policy = "never"
default_permissions = "personal"

[permissions.personal.filesystem]
":root" = "write"
"~/.ssh" = "deny"
"~/.aws" = "deny"
"~/.gnupg" = "deny"
"~/.netrc" = "deny"
"~/.config/gh" = "deny"
"~/.kube" = "deny"
"~/.docker/config.json" = "deny"

[permissions.personal.network]
enabled = true
```

Remove the legacy `sandbox_mode` and `[sandbox_workspace_write]` configuration
when selecting this alternative: legacy sandbox settings take precedence over
`default_permissions`. A path `deny` blocks both reads and writes for sandboxed
processes. Claude `Read` denies also block built-in Edit/Write; an `Edit` deny
is needed to cover every editing tool, including NotebookEdit. Review existing
Codex `allow` command rules before adopting path restrictions: those rules can
run matching commands outside the sandbox. A disposable profile blocked access to harmless `/etc/hosts` while allowing an ordinary
command; no credential file was read. Named profiles are documented as beta.
The earlier `workspace-write` example below remains another sandboxed option.
[Named permission profiles](https://learn.chatgpt.com/docs/permissions).

## DotLn hook boundary — WO-132, WO-135 and WO-139, 2026-09-18

DotLn's generated hooks refuse four conditions (WO-135 and WO-139): a second live writer
in the same worktree; a write to gate inputs or the success record during a live
`npm test`; a classified repository write outside `docs/` and root Markdown
on a `planning/` branch; and an observable subagent admission beyond
`docs/control/budgets.json` `subagentCap` (default 20; `null` disables).
The session-local counter serializes observed admissions. Workflow calls need
one remaining unit but consume no unit themselves; attributable descendants
count at their first tool call. Direct/child identities are joined only from
the observed Agent result. Until that join, possible overlap is reported as a
minimum count; missing/unreadable counters admit with a named advisory.
Stop and `harness usage` disclose the count/cap and unknown remainder. This is
not a total creation cap: silent agents, unobserved paths and unresolved
overlap remain open ([WO-139 evidence](evidence/WO-139/README.md)).
External scratch paths remain admitted; the existing
`operator override:` route supports authorized planning recovery. The writer
reservation applies on main as on a work-order branch; dead reservations may be
reclaimed.

Unclassified tools, unsupported shell forms, unavailable adapters, outside-root
reads, output-read observation failures and attribution pre-checks emit advisory
information and defer to the host's own permission decision. A post-tool
observer cannot turn a completed read into a refused operation. This delegation
grants no new network, filesystem, credential or publication authority. Any
configured host denials for publication, SSH/SCP/SFTP and credential access
remain in force; DotLn role text does not establish those host restrictions.
Claude applies the generated hooks; Codex receives the same invariants and
commands as role text without claiming automatic hook enforcement.

Harness, version, model, effort and source are recorded as supplied. `unknown`
is admitted; `ultra` and `ultra code` are `xhigh` with `mode: subagents` and raw
spelling. Missing discovery/readback data and older or unfamiliar versions yield
warnings rather than DotLn refusals. These observations do not certify host
compatibility or effective settings. Host approval and actual CLI failures still
apply. WO-132 changes repository policy; it does not alter account settings.

Release close consumes the reviewer's committed product-gate row and runs no
suite or dependency install. Its egress preflight and the host's permissions
still govern publication. Worktree cleanup follows publication as best effort;
protected local settings or intake can block cleanup without undoing the release.

## Authority boundary measurement — WO-136, 2026-09-17

The [authority matrix](discovery/authority-boundary-2026-09-17.md) records an
**inconclusive** bounded experiment using Claude Code 2.1.274 and Codex CLI
0.154.0, with native sandbox on/off launch selectors. Forty individually
approved launches used only temporary fixtures, a random credential sentinel,
loopback and a local bare remote. Several sandbox-off script effects were
observed-only; missing attempts and unavailable human-prompt telemetry prevent
qualifying another operating mode. The packet retains partial workflow effects
and failed attempts separately. Native sandbox selection is a launch claim,
not effective-state attestation. The proposed Claude rule table was not applied;
the experiment itself changed no personal settings. The later operator-selected
modes and command-rule installation are recorded above and do not turn these
inconclusive measurements into a passing qualification.

## Recorded host posture (2026-09-01, with dated amendments)

WO-051's `source-change-v1` worker profile uses one host-declared writable Git
worktree and the observed WO-044 launch shapes; its sandbox is not a containment
boundary, and target governance plus host checks still require WO-053's live proof.

| Control                  | Claude Code                                                                                                   | Codex CLI                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Filesystem sandbox       | enabled                                                                                                       | `workspace-write`                                                                         |
| File-edit review         | in-workspace edits auto-accept; review occurs through the working-tree diff                                   | edits inside `workspace-write` run without a separate harness prompt                      |
| Command review           | sandbox-contained Bash auto-allows; explicit denies and sandbox boundaries still win                          | user reviews sandbox-boundary escalation                                                  |
| Shell network            | sandboxed and permission-gated                                                                                | disabled inside the workspace sandbox                                                     |
| Unsandboxed fallback     | request with approval: a command may ask to run unsandboxed and the permission mode reviews that ask (WO-044) | explicit approval required                                                                |
| Sandbox startup failure  | fail closed                                                                                                   | helper/config diagnostics must pass                                                       |
| SSH safeguards           | SSH credential reads/writes and direct `ssh`, `scp`, and `sftp` commands are denied                           | no command allow rules; shell SSH cannot cross the network boundary without user approval |
| Remembered command rules | no checkout-local allow entries                                                                               | no command allow rules                                                                    |

The review rows are intentionally not described as identical. Claude's posture
combines two independent controls: `acceptEdits` accepts in-workspace edits, and
sandbox auto-allow accepts Bash only when the command remains in the enabled
sandbox. Fail-closed startup, permission-reviewed unsandboxed requests and the
credential/SSH denials remain compensating controls; the WO-044 amendment permits
requesting host approval for an unsandboxed command. Codex 0.151.0's locally
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

## Claude Code — retained sandboxed reference

### Enable or restore the September 1 sandboxed configuration

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
    "allowUnsandboxedCommands": true,
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

This exact root `.claude/settings.local.json` is persistent operator-owned
harness state. It is not read by the repository's release scripts or test
chain, so main-checkout release close allows its presence without copying or
inspecting it. That exception is not a cleanup rule: a copy inside a disposable
worktree remains protected and may block removal. Under WO-132, that cleanup
blocker is reported after publication; it does not block the release. Other
ignored and untracked material is also reported without treating it as tracked
source dirt. Moving settings immediately before close does not change settings
already loaded by the current harness session.

`autoAllowBashIfSandboxed: true` is the explicit parallel-work tradeoff recorded
by ADR-0004. It removes ordinary per-command review only for Bash that remains
inside the active sandbox. `allowUnsandboxedCommands: true` (operator direction,
2026-09-14, WO-044) lets a session ask to run one command outside the sandbox;
the sandbox stays on by default and every such ask is reviewed by the
permission mode, which is the same request-and-approve shape Codex offers
through its on-request approval policy. It was turned on because two required
steps could not run inside the sandbox at all: regenerating the checked-in hook
and skill files, which live on the host's protected paths, and launching a
child harness that must read the credential store. Handing either step back to
the operator's terminal is a defect, not a procedure. `defaultMode: "acceptEdits"` separately persists
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
  use the current `/sandbox` UI. Tool permission rules remain separate; the
  September 17 operator choice above uses this mode.
- To refuse every unsandboxed ask again, set `allowUnsandboxedCommands` to
  `false`; sessions then cannot regenerate generated surfaces or launch an
  authenticated child harness, and those steps return to an operator terminal.
- Removing `failIfUnavailable` or `allowUnsandboxedCommands` returns those
  controls to version-dependent defaults. Keep the SSH credential block and deny
  rules unless the intent is also to make those credentials reachable.

Managed, command-line, local, project and user settings follow the precedence
order above. Always verify effective state in the actual worktree instead of
trusting one file in isolation.

## Codex CLI — retained sandboxed reference

### Enable or restore the September 1 sandboxed configuration

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

Codex 0.151.0 locally rejected `approval_policy = "untrusted"`. Current
documentation also says that selectable policy has been removed; use the
documented `on-request` or `never` choices and verify the installed version.

The September 1 comparison did not establish exact Claude-style command-review
parity in Codex 0.151.0. This does not imply an absence of forbidden command rules;
the 0.154.0 behavior is documented above. A stricter supported alternative is
`sandbox_mode = "read-only"` with `approval_policy = "on-request"`; built-in/file
reading remains available, and shell reads can still run inside the boundary. Operations needing writes
or network beyond that policy require escalation; it is not a prompt for
every shell command. This corrects the earlier overbroad description of
read-only mode.

At the September 1 snapshot, the personal command-rules file contained no
pre-approved commands. A Codex `allow` rule runs a matching command outside the sandbox without asking;
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
- To restore the earlier sandboxed configuration, set
  `sandbox_mode = "workspace-write"`, `approval_policy = "on-request"`, and
  `network_access = false` as above.
- `sandbox_mode = "danger-full-access"` disables the filesystem sandbox.
  Pairing it with `approval_policy = "never"` is the September 17 operator
  choice above; forbidden command rules still apply.

Workspace-write primarily protects writes. In the September 1 local profile,
Codex
can broadly read outside the repository, so this is not proof that `~/.ssh` is
unreadable. Shell network denial and human-reviewed escalation stop an
unsolicited SSH connection, while repository policy forbids credential
exploration. The candidate Malcolm Check expresses the same selection doctrine,
but it is not an implemented permission guard. A future move to Codex custom
filesystem permissions should be treated as a separate reviewed migration
because it replaces, rather than simply augments, this legacy sandbox
configuration.

## Why recovery checkpoints warn under sandboxed Codex

This subsection describes the retained `workspace-write` plus `on-request`
mode. Full-access sessions do not use that escalation path; host settings and
the operator's existing authorization determine execution.

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
- Claude's recorded sandboxed posture permits the linked worktree's shared Git
  metadata
  writes, apart from protected Git configuration and hooks, so the same
  checkpoint normally succeeds with that sandboxed-Bash auto-allow
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
