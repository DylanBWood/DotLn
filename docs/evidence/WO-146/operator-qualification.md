# WO-146 operator qualification

Status: both bare interactive observations and all four workflow episodes are
collected. Qualification passed on Copilot CLI 1.0.86 / Claude Sonnet 5 / xhigh. None of these helpers launches Copilot or changes
personal settings. All model work happens in system-temporary scratch
repositories, never in DotLn's control log.

## Prepared reservations in this continuation

The two interactive probe scratches have been collected: an untrusted start
was blocked, and a trusted allow-all run supplied denial and model-change
observations. All four workflow episodes have also been collected. Use the concrete directories supplied in the
session handoff; do not rerun the preparation commands below for those rows.
The original unused workflow snapshot is preserved. The current snapshot was
prepared after integrating WO-145 and refreshed with the corrected credit
reader before the operator launched its first episode. Its
location and the preserved predecessor are in ignored session scratch.

The preparation commands below describe creating a fresh record. They refuse
when that record or its attempt reservations already exist; that is preservation,
not an instruction to remove the record. Continue with the existing reservation
or the next/collect commands as directed in the handoff.

## Bare interactive probe

From the WO-146 worktree, prepare one untrusted and one trusted scratch:

```sh
DOTLN_LIVE_HARNESS=1 node scripts/harness-probe.mjs copilot interactive-prepare untrusted
DOTLN_LIVE_HARNESS=1 node scripts/harness-probe.mjs copilot interactive-prepare trusted
```

Each command prints its scratch directory. In a separate terminal, change into
that directory and enter **`copilot` with no arguments**. Do not set a launch
environment or use the scratch's disposable `cli-home`; that home belongs to
scripted probes, not this operator workflow.

For the untrusted row, do not accept folder trust. If the CLI cannot continue
untrusted, exit and report that limitation. Otherwise ask:
`Use dotln-probe once. Do not spawn agents. Only report markers you actually received.`

For the trusted row, accept folder trust yourself and enable allow-all using
the CLI's in-session permission control before the fixture. Give the same
prompt. After the fixture, change the selected model in-session and ask it to
run `node shell-identity.mjs`. Note the actual permission mode, any approval
prompts and any visible Stop marker, then exit Copilot.

The helper records the shell's session identifier only in the private scratch,
verifies its log against that scratch and drops identifiers from retained
observations. After exit, from the WO-146 worktree:

```sh
node scripts/harness-probe.mjs copilot interactive-collect <scratch> --bare --trust trusted --permissions all --approvals unknown
```

Use the values actually observed: trust is `trusted`, `untrusted` or `unknown`;
permissions are `normal`, `all` or `unknown`; approvals are `observed`,
`not-observed` or `unknown`. `--bare` is the operator's attestation, not an
inferred launch claim. An untrusted entry that could not start is recorded with:

```sh
node scripts/harness-probe.mjs copilot interactive-collect <scratch> --bare --blocked trust-required
```

There are two reservations, not an unlimited retry loop. Instruction markers
do not prove once-only loading. A missing marker or effect does not prove a
denial.

## Four workflow episodes

Prepare the emitted bundle and synthetic order once:

```sh
DOTLN_LIVE_HARNESS=1 node scripts/harness-probe.mjs copilot qualification-prepare
```

Before each episode, reserve the next attempt from the WO-146 worktree:

```sh
node scripts/harness-probe.mjs copilot qualification-next <scratch>
```

In a separate terminal, change into the printed scratch directory and enter
**`copilot` with no arguments**. Use the printed resume phrase:

| Episode | Phrase | Required outcome |
| --- | --- | --- |
| 1 | `resume: next` | Implementation-ready; fixture assertions pass |
| 2 | `resume: verify` | Fresh verifier reports the planted import-time defect and fails |
| 3 | `resume: fix` | Repair-complete; fixture assertions pass |
| 4 | `resume: verify` | Fresh verifier passes |

The reservation for episode 2 plants the defect only after episode 1 passed.
Do not plant it manually, copy earlier conversation into a verifier, or ask a
model to produce the expected verdict without judging the actual source.
Cross-session memory can still carry prior context; fresh identity does not
mechanically exclude that channel. No subagents, network work, commits or
publication are part of this fixture. The operator chooses model, effort and
permission mode. Any desired credit limit is set in-session.

After each handoff, note the session identifier printed by the role's usage
readback line and exit Copilot. Collect from the WO-146 worktree:

```sh
node scripts/harness-probe.mjs copilot qualification-collect <scratch> <session-id> --bare --permissions normal --approvals unknown
```

Again, supply the actual permission and approval observations. Collection
requires the session's shutdown record and checks the real lifecycle outcome,
fixture outcome and writer release. It retains selected readback separately
from the completion actor's attestation. Raw session identifiers and transcripts
stay out of the published qualification record.

The original bound is four episodes plus two retries. One unused contingency
launch was allocated to the separately authorized live feedback audit, so at
most one qualification retry remains in this continuation (D011). A failed or incomplete
episode is a finding, not permission for more launches. Preserve its scratch
and report the blocker; do not repeat an already-recorded lifecycle transition.
Final review and release close are not qualified by these episodes.
