# Codex trust persistence — repair diagnosis, 2026-09-24

VER-001's **two** entries meant the two WO-111 scratch targets. It did not
inventory every trusted project. After the operator supplied a broader list,
a read-only TOML parse counted 43 trusted entries in the user configuration:
36 matched DotLn scratch/probe families and 7 were other projects. This receipt
retains counts and public fixture prefixes only, never the private path keys.

| Scratch/probe family | Trusted entries |
| --- | ---: |
| `dotln-authority` | 18 |
| `dotln-writing-worker` | 6 |
| `dotln-resident-actors` | 4 |
| `dotln-wo111` | 2 |
| `dotln-harness-probe`, `dotln-target-live`, `dotln-wo053`, `dotln-wo056`, `dotln-codex-compact-probe`, `dotln-codex-compact-probe2` | 1 each |

Of those 36 scratch paths, 34 were absent and 2 present at this read. That is
an existence check, not proof of when or which process removed a directory.
The earlier verification's timestamp remains a historical observation; the
repair cannot reconstruct an earlier config file from today's state.

Codex documents project trust as controlling project configuration layers,
including project-local config, hooks and rules. Trust does not itself start
a process, and sandbox permissions are a separate setting. Thus these entries
are not evidence that old workers remain running, but neither are they just
an activity log: trust may matter if Codex later encounters that path again.
The present evidence does not show harmful execution or data exposure.
[Official configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference).

`--ephemeral` suppresses session rollout files. `--ignore-user-config` skips
loading the user config while authentication still uses the Codex home.
Neither documented flag promises a read-only home or automatic removal of
trust entries. No automatic cleanup guarantee was found in the consulted
documentation. This is not sufficient evidence to label Codex's own behavior
an upstream bug.
[Official CLI reference](https://learn.chatgpt.com/docs/developer-commands?surface=cli).

The local launch code supplies both flags but inherits `process.env` in
`packages/skeleton/src/worker-transport.ts`, without isolating Codex's home.
`scripts/lib/authority-probe.mjs` and `writing-worker-probe.mjs` likewise create
temporary targets and use inherited launch environments. Their cleanup covers
owned fixture/process/capture state; the inspected code has no removal of user
trust entries. The family names match these generators. Attribution of every
historical entry to a particular launch remains an inference, not a recovered
writer log.

For DotLn, this is an isolation and evidence defect regardless of whether
Codex is behaving as designed: the launcher's host-side effects escaped the
claimed scope, and the original receipt did not check this location. Removing
stale entries alone would not prevent recurrence. The existing D011 follow-up
must assess shared launch paths, preserve authentication without copying
credentials into evidence, and prove user configuration unchanged with a
before/after check. An isolated home is a candidate to validate, not a tested
fix. A separate owner-authorized cleanup may remove confirmed stale entries;
this repair makes no setting change and does not assume all trusted projects
are disposable.
