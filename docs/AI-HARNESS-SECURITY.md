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

Three harnesses have qualified roles in the current loop; Copilot's compiled
operator profile has the bounded qualification recorded below:

| Harness     | Provider  | Models or roles using it              |
| ----------- | --------- | ------------------------------------- |
| Claude Code | Anthropic | Fable, Opus, and Sonnet assignments   |
| Codex CLI   | OpenAI    | Codex executor and repair assignments |
| Copilot CLI | GitHub    | Executor, fixer and fresh verifier qualified on CLI 1.0.86 / Claude Sonnet 5 / xhigh |

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

## DotLn hook boundary — WO-144, 2026-09-19

DotLn's generated hooks refuse five conditions (WO-135, WO-139 and WO-144): a second live writer
in the same worktree; a write to gate inputs or the success record during a live
`npm test`; a classified repository write outside `docs/` and root Markdown
on a `planning/` branch; an observable subagent admission beyond
`docs/control/budgets.json` `subagentCap` (default 20; `null` disables); and a
known write destination outside the project without a containing grant from
the active role or an equipped support. The last refusal binds roots to
host-registry-admitted authority grants and the effective envelope, with
sources in the manifest. It resolves symlinks; unlinking judges the removed
entry. It is not confinement of an arbitrary program's effects.

What the fifth refusal judges, after the FINAL-001 repair:

- Recognized write tools, by their path.
- Shell operands of `touch`, `mkdir`, `tee` and `rm`, when the rest of the
  command stays inside the bounded read vocabulary.
- A literal output redirect on any program, because the shell opens it:
  `npm run meta 2>../.x` is refused. The program's own effects stay unobserved.
- From any working directory. The hook finds its project from its installed
  runtime and resolves relative destinations against the session's directory;
  a row judged away from the worktree root carries `workingDirectory: moved`,
  and journal rows and advisory markers stay in the hook's own project.

What it does not judge, all left to host permissions:

- A destination spelled with an expansion, substitution or wildcard. The
  recorded incident redirected to `$PWD/../.x`; that spelling is still admitted.
- A quoted operand attached to its operator (`2>'../x'`), a redirected group,
  and a relative redirect after an earlier program outside the vocabulary in
  the same command (`cd docs && npm test > ../out`); an absolute one is judged.
- Anything a program writes by itself. In recorded review and verification
  sessions most shell calls were unobserved (34 of 35 and 199 of 238 rows).

The four older refusals are judged only while the session's working directory
is the worktree root. Away from it they stand down with one advisory, and each
hook now journals that row; whether they should judge there is boarded in
[WO-144 D007](evidence/WO-144/decisions.md).
Literal shell redirects to the `/dev/null` character device are discards,
not outside file mutations. This grants no other device path or removal.
Use the DotLn scratch path printed at Claude role dispatch or returned by
`node scripts/harness.mjs scratch` in Codex. Native scratch and `/tmp` require
a separate grant when outside the host's `os.tmpdir()` root. The permission
hook records one judgment per destination; the other pre-tool hooks still
enforce the same refusal. Historical duplicate rows remain preserved.
The session-local counter serializes observed admissions. Workflow calls need
one remaining unit but consume no unit themselves; attributable descendants
count at their first tool call. Direct/child identities are joined only from
the observed Agent result. Until that join, possible overlap is reported as a
minimum count; missing/unreadable counters admit with a named advisory.
Stop and `harness usage` disclose the count/cap and unknown remainder. This is
not a total creation cap: silent agents, unobserved paths and unresolved
overlap remain open ([WO-139 evidence](evidence/WO-139/README.md)).
All six default contributor roles grant the host `os.tmpdir()` root and DotLn
session scratch below `<system-temp>/dotln/<session-key>/scratch`; no role
grants arbitrary home folders or main intake by default. Main's ignored intake
and an operator-named absolute root are available declaration kinds, requiring
explicit admitted authority. Missing active roles grant nothing. An opaque
destination is journaled as unobserved. Unreadable grant configuration,
unavailable grant roots and resolution errors admit with one advisory and a
journaled cause, while the existing refusals remain effective. Existing runtime
pin failures retain advisory delegation. A refusal already established in a
multi-target command survives later path failure. In-project writes never use
the outside-grant check. The existing `operator override:` route supports
authorized recovery. The writer
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
commands as role text without claiming automatic hook enforcement. Copilot
reuses the Claude registration; its narrower, dated observations are below.

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

## Harness version, model and effort readback

These observations moved from product 07 §Model-specific notes on 2026-09-20
(WO-090); the guide keeps the attestation contract and points here. The
[WO-090 relocation table](evidence/WO-090/README.md#relocation-table) names
each paragraph's origin.

**Version and effort observations (WO-132, 2026-09-15).** Harness,
version, model, effort and source are required attestation fields and are
recorded as supplied, including `unknown`. `Effort:` recommendations accept
`any` or a level with or without `+`; below-recommended values and missing
version/selector/readback observations warn without refusing. CLI transports
attempt the requested model and effort and report actual invocation failures;
version minima and discovery gaps no longer prevent launch.

`ultra` and `ultra code` normalize to `effort: xhigh`, `mode: subagents`, and
the supplied `raw` spelling. Other labels remain as given. Codex launches in
subagents mode do not disable multi-agent features. Accepted selectors are
launch observations, not effective-session readback. The five existing Codex
0.154.0 probes record low, medium, high, xhigh and max; discovery preserves
historical observations and never acts as an admission list.

Codex briefings, status and usage output report the active thread's model,
effort and CLI version from its local session metadata. This readback is
independent of token-counter freshness and adds no admission check. Missing or
incomplete metadata is reported without substituting a model default. Explicit
operator-supplied values remain operator-attested when readback is unavailable.
Optional `--account-label` retains its public opaque-label grammar; no private
account meaning is inferred. Reports carry exactly one normalized actor header
matching completion flags. The control log preserves all earlier actor values;
historical evidence is not rewritten to the new grammar. Values are single-line
data and missing required fields remain a syntax error.

**Codex dispatch session entry (WO-149, 2026-09-21).** When
`CODEX_THREAD_ID` is present, the `next`, `fix`, `verify`, `final-review` and
`release-close` lifecycle commands begin a harness session with that thread and
the dispatch's role after the command is admitted and before current-session or
usage observations are read. The begin is idempotent: a repeated dispatch in
the same thread preserves the original session record byte-for-byte. Without a
thread identity the command writes no session record; `harness usage` returns
unknown counters with cause `no-session` without creating one. An unbuilt
harness runtime leaves the dispatch admitted and emits an advisory naming
`npm run build` and the missing session; it does not silently claim a begin.
Claude's hook entry and
Copilot's `active-dispatch-unavailable` branch are unchanged.

**Entropy Reducer launch line (WO-151, 2026-09-22).** `npm run entropy --
review` and `refute` launch the pinned reviewer only when the operator asks
for it with `--transport claude-cli-print` or `--transport codex-cli-exec`;
without a transport the command prints the canonical prompt and closed schema
for a background worker the session spawns, and the parent remains the sole
repository writer. A background-worker failure never triggers an automatic
external fallback. Claude defaults to `claude-fable-5-1` at `max` and Codex to
`gpt-6-astra` with effort `unknown`; both are recorded from the invocation as
`command-line-readback-and-invocation`, and effective model and effort stay
`unknown` because no harness reports them. The receipt reads
`entropy-reducer@1` only when a launched `claude-cli-print` episode carried the
compiled model, effort and harness; every other route, including a background
worker whose effort the operator supplies with `--source operator-attested`,
reads `substitute reviewer` with its recorded values and the reason. The
`fake` transport drives executable fixtures only: it is refused outside a
fixture run and a fixture receipt can never be committed as a run.

This profile is the one inspection profile in this repository that admits
command execution to a model. The worker's working directory is a copy of the
subject commit under the granted system-temp lane, never the tracked tree.
Claude runs it with `--safe-mode --restricted`, which ignores the copy's own
settings, hooks, skills and `CLAUDE.md`, confines the file tools to that
working directory, and denies without prompting anything outside the named
tools; Codex runs it under `--sandbox workspace-write` rooted at the same copy
with network disabled. Claude does not path-confine a shell command, so that
half of the boundary is instructed and then checked rather than enforced: the
host records the subject's tracked-status hash and the frozen copy's inventory
before and after each episode, the review and the blinded refutation alike, and
states in the receipt which of the two confinements applied with the delta it
observed. On the default clean-`HEAD` review route a moved tracked status
refuses the return; an explicitly named commit, which is also the refutation's
subject, is bound by its tree object instead and the working tree's own drift
is recorded as `trackedStatusByteIdentical: false` rather than hidden. The receipt
also records the observed count of denied tool calls when the transport
exposes one, and `unobserved` when it does not.

**Version-line attestation (WO-126).** `npm run discover -- harness` appends
a bounded observation of the running CLI's major.minor line and newest patch,
plus whether Claude's effort readback channel exists. WO-132 supersedes
its effort admission rule: all supplied labels are preserved, including
unknown versions and efforts. Session entry warns once when the observed CLI
leaves the recorded line. WO-042's unknown attestation remains unchanged.
Session detection prefers the explicit harness input, then the exposed
running executable, then a matching ancestor executable from the host process
table. A versioned Claude installation path supplies its observed version;
on macOS, a bare version basename is accepted only for the `CLAUDE_PID`
process verified in that ancestor chain. An unrelated numeric process name
supplies no version evidence
([WO-126-D017](evidence/WO-126/decisions.md#wo-126-d017));
when a verified Claude ancestor has an opaque process name, a bounded `lsof`
text-mapping probe can resolve its versioned executable. A supplied PID without
ancestry is never probed, and ambiguous or unavailable mappings supply no
version. A successful session observation is reused on later prompts; a changed
explicit harness-version input can replace it
([WO-126-D021](evidence/WO-126/decisions.md#wo-126-d021)).
An unversioned absolute Claude executable is probed directly. PATH is the
fallback when those channels are unavailable. Only the version and channel
are recorded, not the process paths or arguments
([WO-126-D013](evidence/WO-126/decisions.md#wo-126-d013)).

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

## Copilot CLI - WO-146, 2026-09-20

**Observed version: 1.0.86. Four operator workflow episodes completed on Claude Sonnet 5 / xhigh.** The
[dated probe](discovery/copilot-cli-2026-09-20.md) and its companion JSON
separate observations, missing observations and blocked work. P1-P6 misplaced
temporary trust state and cannot establish trusted-folder behavior. Corrected
P7-P10 establish that the Claude-form registration fires and its pre-tool JSON
denial and exit-2 error stop the matching fixture command, including P10 with
allow-all. Both registration sources fire when both are installed; DotLn emits
only its existing `.claude/settings.json` registration. Event availability is
not a claim that every handler receives every field it needs.

The operator enters **bare `copilot`** at the worktree root. No wrapper,
environment prefix or launch flag is required. The two existing, identical skill
roots and the `AGENTS.md` to `CLAUDE.md` symlink remain the instruction surfaces.
The [operator runbook](evidence/WO-146/operator-qualification.md) and
[qualification record](evidence/WO-146/qualification.md) are separate from the
scripted probe. Final review and release close remain untested under Copilot.

### Seven-item setup record

1. **Settings and trust.** Preferences use `~/.copilot/settings.json`;
   runtime state, including `trustedFolders`, uses `~/.copilot/config.json`.
   `COPILOT_HOME` selects another home. The CLI also reads shared
   `.claude/settings.json`, personal project `.claude/settings.local.json`
   and native `.github/hooks/*.json`. DotLn adds no native registration or
   Copilot settings file. Managed policy and session choices can constrain
   preferences; the complete precedence matrix is not live-qualified here.
   The 1.0.60 bundled changelog documents worktree trust inheritance, not a
   second live observation of inheritance or local-setting precedence.
   Accept trust yourself for a new worktree and verify loaded hooks; a main
   checkout's trust is not used as this probe's evidence.
2. **Read/write boundaries.** The installed permissions help describes
   path approval checks for the working tree and system temp, not OS
   confinement. With sandboxing off, shell programs have the user's file,
   credential and network access. Built-in edits are not OS-sandboxed even
   when command sandboxing is enabled; the CLI describes their policy
   application as best-effort. DotLn's literal-destination checks do not
   protect every indirect file open, credential path or `.git` operation.
3. **Approvals and exceptions.** Documented `manual` mode prompts for
   writes/commands and auto-approves reads. `assisted` uses an experimental
   safety classifier, subject to policy. `allow-all` removes tool, path and
   URL approval prompts; it is not confinement. The help says explicit
   native denies still precede allows, but their complete exception matrix
   was not tested here. P10's DotLn-compatible hook denials remain observed
   separately from native permission rules. The operator's current mode
   and actual prompt count must be attested or remain unknown.
4. **Network and outward channels.** Without command sandboxing, shell
   network access is unconfined by an OS sandbox. Remote MCP is not covered
   by command sandboxing; local stdio MCP/LSP sandboxing has separate
   settings. The built-in GitHub MCP server, `/delegate`, `--remote`,
   `--fleet` and autopilot are outside this qualification and DotLn's
   publication helpers. Their availability grants no authority to use
   them. No launch argument is imposed to disable them.
5. **Unavailable sandbox and hook errors.** Installed `copilot help sandbox`
   documents command sandboxing as experimental and **off by default**.
   Enabled sandboxing on an unsupported host makes sandboxed shell and
   sandboxed MCP/LSP launches fail, with a startup warning; it does not
   silently establish an unsandboxed replacement. A permitted bypass is a
   separate operator choice, and managed policy may forbid it. This native
   failure behavior is documented, not live-qualified here. The hook
   reference documents pre-tool errors as fail-closed and hook timeouts as
   fail-open; P7/P10 observed exit-2 refusal, not timeout behavior.
6. **Enable, verify and undo.** Enter bare `copilot`, inspect the actual
   mode, model and effort in-session, and accept folder trust only for the
   intended project. Run `node scripts/harness.mjs check` for generated
   drift, then the bounded scratch observations rather than testing
   refusals on real work. Sandboxing is optional in either direction;
   `/sandbox enable` and `/sandbox disable` are available only when the
   experimental feature or managed policy exposes that command. Enabling
   it seeds a policy whose defaults must be inspected, including network,
   credential injection and bypass. Undo an optional personal change by
   restoring just that setting; neither deleting generated hooks nor
   changing personal settings is an automatic DotLn recovery action.
7. **Date and scope.** Scripted observations and installed help/source
   checks are dated 2026-09-20 on 1.0.86. Both bare-session rows are
   collected, and four operator workflow episodes passed with Claude Sonnet 5
   / xhigh; the separate bare probe observed a change to GPT-5.6 Sol / medium. A version outside the recorded
   major.minor line warns; it does not refuse a workflow or authorize a
   new probe.

Sources: the H anchors below; installed 1.0.86 `help config`, `help permissions`
and `help sandbox`; its bundled changelog; the installed public CLI's
`disabledMcpServers` user-setting reader/writer and `github-mcp-server`
registration; and the [GitHub hook reference](https://docs.github.com/en/copilot/reference/hooks-reference).
Documented vendor behavior is not promoted to observed DotLn enforcement.

### Copilot control table

**Enforced** below means the bounded pre-effect predicate is covered by a
generated-handler fixture and the live Claude-form refusal channel in H5,
P7/P10 and bare I2. It does not mean arbitrary shell effects, remote tools or
hostile same-user processes are confined. The four older guards
retain their existing worktree-root limit. Unknown observations do not become
successful defaults.

| DotLn control | Classification and evidence | With allow-all |
| --- | --- | --- |
| Session and worktree identity | **Advisory.** H2/H3/H9; `COPILOT_PROJECT_DIR` identifies hook origin, `session_id` identifies that callback, and the shell exposes `COPILOT_AGENT_SESSION_ID`. The reader verifies the log's identity, cwd and supplied Git root; foreign logs yield unknown. WO-146 process-debt fixtures cover selection and refusal of foreign metadata. | Same metadata checks; not an OS boundary. Bare I2 confirms the shell variable, matched worktree and in-session model change. |
| Writer reservation: reserve, refuse, owner, liveness, release | **Enforced at the observed hook boundary.** H5/P7/P10 plus WO-146 generated writer/freeform fixtures. H11 observed an ancestor owner alive at callback time, not hostile-process isolation. Two real-command fixtures cover explicit completion; all four operator episodes released their writers after exit. | Scripted and bare refusal channels hold; live workflow release is recorded. |
| Presence heartbeat and origin class | **Advisory.** H1/H3 and `presence-heartbeat.ts`: only an explicit resident-store binding writes a heartbeat; interaction is `unknown`. A scripted prompt is not operator presence and no new resident transport is added. | Not an approval-dependent guarantee; native origin classification unobserved. |
| Live-gate input protection and `evidence --stop` | **Enforced for classified writes.** H5/P10 and WO-146 generated native-path/freeform live-gate fixtures, with existing WO-135 stop/ownership fixtures. The owner can explicitly stop its gate; no effect is inferred from an absent file alone. | The refusal channel holds in bare I2; a live-gate write attempt in that bare session was not exercised. |
| Planning-branch write boundary | **Enforced for classified writes at the worktree root.** H5/P10 and WO-146 generated native-path/freeform fixtures retain docs/root-Markdown scope. | Scripted refusal holds; opaque program effects remain unobserved. |
| Subagent admission and descendant accounting | **Advisory.** H3/H8 provide no `tool_use_id` or child identity. Preserve explicit root-session budgeting; zero observed admissions is not zero agents or fresh budget. No new identity synthesis is added. | No mechanical total-creation cap claimed. |
| Outside-write grant | **Enforced for recognized literal destinations.** H5/P10; WO-146 native path and multi-file patch fixtures plus WO-144 redirect/symlink fixtures. System-temp and declared session scratch are grants, not a blanket home-directory grant. Expansions and programs' own effects retain their documented gaps. | Scripted denial holds; no OS confinement. |
| Write observation and authorship | **Advisory.** H3/H4 supply native write paths; the decoder maps them into the existing byte-diff observer. A write record does not prove scope correctness or authorize publication. | Observation remains possible; not a permission guarantee. |
| Read-your-own-output observation | **Advisory.** H3 has `tool_result`, not Claude's range-bearing `tool_response.file`. Automatic read receipts are not claimed. Use existing `read-output` and actual-stdout `delivered` adapters; WO-146 shares the existing observer rather than fabricating ranges. | No automatic delivery guarantee. |
| Observed-facts block | **Advisory.** H6 did not deliver the prompt-context marker. Explicit briefing/status adapter output supplies available facts; unsupported scans remain unknown. | No prompt-injection/delivery guarantee. |
| Usage counters | **Advisory.** H12 and WO-146 fixtures: shutdown counters are session-cumulative; request counters can cover utility calls only and are explicitly partial. Checkpoint/shutdown `totalNanoAiu` supplies session-cumulative AI credits at 1,000,000,000 nanos per credit, with its own source and cutoff. Missing counters carry a cause and never block completion; tokens and dollars are not inferred from credits. | Same readback; completeness independent of approval mode. |
| Model and effort readback | **Advisory.** H9/H12 and WO-146 process-debt fixtures. Source `copilot-session-readback` means CLI-selected, not effective effort; `auto`, null or missing fields stay unknown with causes. Supplied operator attestations remain unchanged. | Independent of approval mode. |
| Completion and handoff | **Advisory.** H7 observed Stop callbacks but not their message visibility. Plain lifecycle commands retain their evidence/report checks, and explicit executor/fixer completion releases the identified writer. WO-146 real-command fixtures and all four live operator qualification episodes pass; release was checked after each session exited. | Stop advice is not a publication or completeness gate. |
| Compaction continuation | **Unsupported.** No Copilot continuation adapter is qualified. The Codex adapter is not reused or relabeled. Ordinary resume/status and preserved state remain available. | No automatic continuation claim. |
| `analysis:` and `operator override:` | **Advisory as model/terminal delivery; explicit controls available.** H1/H6 and the existing operator-control fixtures. The shared prompt handler may apply the control, but context/message delivery is unobserved; `node scripts/operator-control.mjs analysis|override|off|status` remains the explicit route. | Host permissions still decide. Override never supplies missing operator authority. |

### Selected-session readback, completion and counters

Moved from product 07 §Model-specific notes on 2026-09-20 (WO-090). Enter bare
`copilot`; model and effort come from the operator's settings or in-session
selection, not required launch arguments. Briefing, status and usage report
`copilot-cli`, CLI version, selected model and reasoning effort from the one
session identified by `COPILOT_AGENT_SESSION_ID`, or an explicitly supplied
identifier verified against its log and worktree. Hook origin uses the observed
`COPILOT_PROJECT_DIR` channel. The harness is never inferred from a Claude or
GPT model name. Source `copilot-session-readback` is **CLI-selected metadata,
not effective-effort proof**. `auto` without a resolved selection, null effort,
missing metadata and a foreign worktree remain unknown with causes. Preserve
values supplied by the operator as `operator-attested`.

The ordinary completion line is
`npm run resume -- implementation-ready --harness copilot-cli --harness-version <version> --model <id> --effort <level> --source copilot-session-readback`
when those values came from that readback. Repair and verification use their
existing result commands and the same actor fields. A prompt hook can record a
dispatch without demonstrated context delivery: inspect canonical status and
use `npm run resume -- briefing` for an already-recorded dispatch rather than
repeat it. The explicit observation/recovery adapters remain available, and
executor/fixer completion releases the identified Copilot writer.

Counter availability is separate. Copilot shutdown totals are
session-cumulative; individual recorded model calls may be utility requests
only, so their scope is `observed-requests-only`, never a fabricated session
total. AI credits use the latest valid checkpoint or shutdown `totalNanoAiu`
divided by 1,000,000,000, with their own session-cumulative scope, source and
cutoff; they do not establish tokens, dollars or dispatch-only cost. Missing
credit counters, complete token readback and dollar amounts remain unknown.
See the [dated probe](discovery/copilot-cli-2026-09-20.md), the
[control table](#copilot-control-table) and the
[completed operator qualification](evidence/WO-146/qualification.md): four
bare sessions on CLI 1.0.86 / Claude Sonnet 5 / xhigh completed implementation,
failing fresh verification, repair and passing fresh verification, with writer
release confirmed after each exit. Permission choices varied by session; use
the in-session status instead of inferring persistence. No personal setting is
written by the integration. Fresh verifier sessions remain the operator's
responsibility; cross-session memory can transfer implementer context. Final
review, release close, built-in GitHub MCP, `/delegate`, `--remote`,
`--fleet` and autopilot are not qualified here.

### Proposed operator settings

**Proposals only; none is applied by this order.** Merge individual preferences
instead of replacing a settings file. DotLn's guarantees come from the table,
not from private settings. Defaults below are documented defaults, not a fresh
readback of effective policy.

| File and key | Observed value | Proposed value | Reason | Undo |
| --- | --- | --- | --- | --- |
| `~/.copilot/settings.json`: `includeCoAuthoredBy` | `false`, recorded at planning | Keep `false` | Avoid automatic AI attribution; publication preflights remain separate. | Restore the prior preference, without weakening the no-attribution duty. |
| Same file: `effortLevel` | `xhigh`, recorded at planning | Keep the operator's choice | Bare entry must not force a model or effort. Readback reports what the CLI selects. | Restore the prior value or remove this preference. |
| Same file: `memory` | Effective value not re-read; documented default `true` | Consider `false` for independent verification | Cross-session recall can carry implementer context into a fresh verifier. This is not mechanical independence. | Restore the previous value; `/memory on` is the documented in-session option. |
| Same file: `defaultPermissionMode` | Effective value unknown; documented default `manual` | Operator chooses `manual` or `allow-all` | Fewer prompts are optional, not a DotLn requirement or filesystem sandbox. | Restore the previous value or remove the key. |
| Same file: `sandbox.enabled` | Effective value unknown; documented default `false` | Operator chooses; either mode supported only to its recorded width | Off leaves shell effects unconfined; enabling requires reviewing the seeded policy and host support. | Restore the previous value through settings or the available `/sandbox` control. |
| Same file: `disabledMcpServers` | Not re-read | Optionally add `github-mcp-server`, preserving other entries | A persisted way to disable the built-in outward channel without a launch argument; DotLn still does not govern external tools. | Remove only that entry or restore its previous state. |
| `~/.copilot/config.json`: `trustedFolders` | Main's trust was recorded at planning; each live scratch choice is separate | Accept trust yourself for the intended worktree | Repository hook loading depends on trust; an approval choice is not a repository-enforced guarantee. | Remove the specific folder's trust through the CLI; preserve unrelated runtime state. |

## Vendor references

- Claude Code: [sandboxing](https://code.claude.com/docs/en/sandboxing),
  [permissions](https://code.claude.com/docs/en/permissions),
  [settings](https://code.claude.com/docs/en/settings), and
  [commands](https://code.claude.com/docs/en/commands).
- Codex: [sandboxing](https://learn.chatgpt.com/docs/sandboxing),
  [basic configuration](https://learn.chatgpt.com/docs/config-file/config-basic),
  [approvals and security](https://learn.chatgpt.com/docs/agent-approvals-security),
  and [command rules](https://learn.chatgpt.com/docs/agent-configuration/rules).
- Copilot CLI: [command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference),
  [hooks](https://docs.github.com/en/copilot/reference/hooks-reference), and
  version-pinned installed help for configuration, permissions and sandboxing.
