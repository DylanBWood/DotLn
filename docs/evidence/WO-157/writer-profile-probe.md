# WO-157 item 4 — can a target writer write the target's common Git directory?

Probe run 2026-09-22 by the WO-157 executor on macOS with Git 2.55.0, Claude
Code 2.1.280 and codex-cli 0.155.1. No model was invoked. The subject is a
scratch repository `target` with one linked worktree `trees/wt` on branch
`probe`, created as the source-change host creates a writer's worktree
(`git worktree add -b <branch> <parent>/<name> main`), so the worktree's
objects, refs, `hooks/` and `config` live in the common directory
`target/.git`, outside the worktree. Paths below are shown relative to that
scratch lane.

## target-worker-codex

The Codex writer launches with `--sandbox workspace-write` and the named
permission profile `dotln-writer` (`:minimal` read, `:workspace_roots` write,
network off; packages/skeleton/src/worker-transport.ts). The probe ran the
writes through the CLI's own sandbox under that profile, from the worktree:

```text
codex sandbox -C <trees/wt> -c 'default_permissions="dotln-writer"' \
  -c 'permissions.dotln-writer.filesystem={":minimal"="read",":workspace_roots"="write"}' \
  -c 'permissions.dotln-writer.network.enabled=false' -P dotln-writer -- /bin/sh -c '<writes>'
```

| Attempt from the worktree | Observed |
| --- | --- |
| write `<common>/hooks/pre-push` | refused: `Operation not permitted`, exit 1; file absent afterwards |
| append to `<common>/config` | refused: `Operation not permitted`, exit 1; config unchanged |
| write `<common>/probe.txt` | refused: `Operation not permitted`, exit 1; file absent afterwards |
| write `inside.txt` in the worktree | admitted, exit 0 |

Limit: the same run also refused `git add` and `git commit`, because Git could
not read `~/.gitconfig` or create its cache under the sandbox, so this command
is stricter than a live `codex exec` writer, which must be able to commit. A
live Codex writer episode was not run. The observation agrees with the
2026-09-14 writing-worker record X-W2 (under the named write profile the
sibling write did not happen) and contrasts with X-W6 (without the named
profile a sibling write happened).

## target-worker-claude

The Claude writer's shell is limited to the three host-issued commands by
`--allowedTools` (writing-worker record C-W2) and by the target bundle's
`permissions` PreToolUse hook; its file tools are contained by that hook, not
by a sandbox (C-W6: without the target bundle a sibling write happened). The
probe emitted the real bundle into the worktree with
`node scripts/harness.mjs emit --target <trees/wt> --runtime-root <launchpad>
--profile target-worker-claude` (seven surfaces) and fed the installed
`.claude/hooks/permissions.mjs` PreToolUse inputs, as the source-change process
double does for its commands:

| Tool input | Hook decision |
| --- | --- |
| `Write <worktree>/inside-probe.txt` | admitted (no decision) |
| `Write <common>/hooks/pre-push` | deny: `DOTLN_TARGET_REFUSED: compiled authority does not permit settings.user` |
| `Edit <common>/config` | deny: same reason |
| `Write <common>/probe.txt` | deny: same reason |
| `Write ../../target/.git/hooks/pre-push` | deny: `DOTLN_TARGET_REFUSED: Path outside the worktree surface` |

Limit: this exercises the hook, which is the Claude writer's containment; it
does not run a live Claude writer, so a Claude release that skipped the hook
would fall back to the unconfined behaviour C-W6 recorded.

## The focused test the host runs after the writer

The source-change host runs the order's test command itself after the writer
exits (`runFocusedTest` in packages/skeleton/src/source-change-worktree.ts:
`spawnSync` in the worktree, no sandbox, the operator's environment), and the
test command executes files the writer may edit inside its surface. The
Claude writer's admitted test command (`--allowedTools ... Bash(<testCommand>)`)
likewise runs those files with no OS sandbox during the episode. The probe
wrote a `fixture-test.mjs` in the worktree that writes `<common>/hooks/pre-push`
and appends a `remote "origin"` `receivepack` line to `<common>/config`, and ran
it as `runFocusedTest` does (`spawnSync("node", ["fixture-test.mjs"], { cwd:
<worktree> })`): exit 0, the hook file present afterwards, the config line
present afterwards.

## Reading

The writer's own file tools cannot write the common Git directory under the
probed mechanisms (the Codex named profile refuses at the sandbox, the Claude
target bundle refuses at the hook). Neither profile is disproved, though:
code the writer controls reaches the common Git directory through the test
command, which the Claude writer runs unsandboxed and the host runs for every
writer after the episode. The guard therefore does more than disable hooks:
publication pushes the observed commit from a host-created bare repository
(`git fetch` of the branch, then `git push <url>` with hooks and fsmonitor off),
so neither the target's hooks nor its repository configuration run in the
operator's publish process, and the push URL is origin's configured URL before
any rewrite, which must name the repository `ensureGh` resolved. The host's own
Git calls in the source-change worktree run with hooks and fsmonitor off as
well. The fixture in `scripts/test-target-publish.mjs` plants `pre-push` and
`reference-transaction` hooks, a `remote.origin.receivepack`, a
`core.sshCommand` and an `include.path` whose file sets `core.fsmonitor`; none
runs during publication.

The larger exposure the probe shows — the host runs writer-controlled test code
with the operator's privileges — predates WO-157 (product 03 records that the
source-change host is 'not OS isolation of arbitrary test scripts') and is
recorded as WO-157-D005's follow-up.
