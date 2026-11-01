# Native role qualification on the final code

WO-247 requalifies both hosts on the order's final bytes, with every receipt
naming the code identity it ran on. The earlier episodes, on WO-192's code, are in
[WO-192's record](../WO-192/native-qualification.md); this record supersedes its
statement that Codex's close was declined for a reason nobody had seen.

## Code identity

The handoff identity at completion is recorded in [handoff.md](handoff.md). Each
receipt below carries `codeIdentity.source.codeIdentity`, the authoring checkout's
gate code identity at the export the fixture installed, and completion compares
the cited receipts with the handoff identity (criterion 4). The first two receipts
record the diagnosis code and are cited for what they show, not for the final
identity.

| Receipt | Host | Scope | Election | Source identity | Result |
| --- | --- | --- | --- | --- | --- |
| [attempt 1](live-drive-attempt-1.json) | Codex CLI 0.166.0 | router and release close; earlier phases coordinator-seeded | host | `baf33add…` (diagnosis code) | Stopped at `awaiting-close`: the close was declined by automatic review for the reason the host printed on stderr, which the receipt retains with the observation's paths. |
| [attempt 2](live-drive-attempt-2.json) | Codex CLI 0.166.0 | router and release close; earlier phases coordinator-seeded | host | `d9681c94…` (corrected handoff) | Released: the review admitted the close once the launchpad's handoff stated the no-release close's actual effect. |
| [attempt 3](live-drive-attempt-3.json) | Codex CLI 0.166.0 | full lifecycle | host | `5a6f7b70…` (final code) | Released: every phase and the close admitted by automatic review; a no-release close with clean cleanup. |
| [attempt 4](live-drive-attempt-4.json) | Claude Code 2.1.316 | full lifecycle | off | `5a6f7b70…` (final code) | Released: every phase and the close completed under the disabled launch sandbox and the declared permission mode; a no-release close with clean cleanup. |

## Codex CLI 0.166.0

[Attempt 3](live-drive-attempt-3.json), 2026-11-01 from 06:55 to 07:40 UTC inside a
fixture of 45 minutes, source identity
`5a6f7b703f253fc3821167b27771454bde71e0deb43aaee6c67fe419e6a22b42` at head
`e66730ee`, election `host` from the instance configuration. Two native routers
drove the order: the first through executor, verifier and reviewer to the stop
for the coordinator's merge, the second from the merged order through release
close. Every phase worker exited 0; the automatic review admitted every
lifecycle command and the close helper; nothing was declined, so no transcript
was retained. The close recorded `no-release` with clean cleanup and the target
worktree removed, and the drive stopped at `released`. The fixture's Claude
permission options were set for a Codex-to-Claude close that never ran, since
the Codex close was admitted; the receipt records them as declared.

| Role | Model and effort (selected) | Observed policy (rollout `turn_context`) | Driven start (bytes) | Tool calls | Output tokens |
| --- | --- | --- | --- | --- | --- |
| router (two sessions) | gpt-6.1-sol, max | workspace-write, on-request, auto_review | 15,759 (installed 15,311 + launch 448) | 25 and 12 | 12,581 and 6,293 |
| executor (`next`) | gpt-6.1-sol, max | workspace-write, on-request, auto_review | 42,986 (38,293 + 4,693) | 143 | 33,699 |
| verifier (`verify`) | gpt-6.1-sol, xhigh | workspace-write, on-request, auto_review | 37,821 (33,126 + 4,695) | 91 | 16,792 |
| reviewer (`final-review`) | gpt-6.1-sol, max | workspace-write, on-request, auto_review | 40,589 (35,896 + 4,693) | 137 | 26,179 |
| release close | gpt-6.1-sol, max | workspace-write, on-request, auto_review | 28,001 (23,398 + 4,603) | 87 | 25,259 |

Model and effort are the launch's selections; Codex reports neither in its
stream. The observed policy is read from each phase's own session rollout, and
it equals the form the election selected. The router sessions used 2,720,358
tokens in total (native result stream, router sessions only); no dollar figure is
available from this host. Driven-start figures are recorded, not bounded
(WO-192-D095).

## Claude Code 2.1.316

[Attempt 4](live-drive-attempt-4.json), 2026-11-01 from 06:55 to 08:16 UTC inside a
fixture of 81 minutes, source identity
`5a6f7b703f253fc3821167b27771454bde71e0deb43aaee6c67fe419e6a22b42` at head
`e66730ee`, election `off` through the fixture's `DOTLN_LIVE_SANDBOX` override,
the form D057 describes: `sandbox.enabled false` in each launch's own
`--settings`, with the fixture's declared permission mode `default` and the exact
driver rule in the fixture checkouts' local settings, as every passing Claude run
since WO-192 attempt 48 has used. Two native routers drove the order, the first
to the merge stop and the second from the merged order through release close.
Every phase worker exited 0, nothing was declined, no transcript was retained,
the close recorded `no-release` with clean cleanup and the target worktree
removed, and the drive stopped at `released`.

| Role | Model and effort (selected) | Observed (init row) | Driven start (bytes) | Tool calls | Cost (USD) |
| --- | --- | --- | --- | --- | --- |
| router (two sessions) | claude-opus-5-5, xhigh | permission mode default; sandbox not exposed | 15,650 (installed 15,311 + launch 339) | 8 and 8 | 0.54 and 0.36 |
| executor (`next`) | claude-opus-5-5, xhigh | permission mode default | 42,643 (38,293 + 4,350) | 689 | 22.52 |
| verifier (`verify`) | claude-opus-5-5, xhigh | permission mode default | 37,476 (33,126 + 4,350) | 144 | 3.61 |
| reviewer (`final-review`) | claude-opus-5-5, xhigh | permission mode default | 40,246 (35,896 + 4,350) | 113 | 3.30 |
| release close | claude-opus-5-5, xhigh | permission mode default | 27,067 (23,398 + 3,669) | 47 | 1.30 |

Model and effort are the launch's selections; Claude's init row names its
permission mode and nothing of its sandbox, so the receipt records the selected
form (`disabled-by-launch-settings`) apart from what the host reported. The
routers' result streams total 119,670 tokens and 0.91 USD (router sessions only);
the phase workers' result rows total 30.72 USD. Driven-start figures are
recorded, not bounded (WO-192-D095).

## What each run saw

Attempts 3 and 4 carry the source identity `5a6f7b70…`, the handoff identity;
completion's comparison is the check (criterion 4). The fixture trees' hashes are
provenance only. Attempts 1 and 2 carry the diagnosis code's identities and are
cited for what they show. The two full lifecycles ran twice before on this
order's intermediate code, and each pair was superseded when a repair the
complete run or a review named moved the identity; their dated account is in
[WO-247-D012](decisions.md#wo-247-d012--three-reviews-their-repairs-and-a-probe-rule-every-review-worker-reads).
The Codex-to-Claude close finish, the admitted host
change, did not run live in attempt 3 because the Codex close was admitted; its
mechanism is covered by the drive suite, and the fixture's Claude permission
options, set for that finish, are recorded on the receipt as declared and unused.
The Codex episode records no dollar figures: its host reports none.

## Limits

- Only the fixture's Codex router runs `harness begin` with its order; an
  operator's own Codex drive session does not, so its router usage stays unknown,
  which blocks nothing (WO-192-D101; stated in product 07).
- Codex reports neither model nor effort in its stream; the rows retain the
  supplied values. Its sandbox and approval policy are read from the phase's own
  rollout in the isolated home; Claude's stream names its permission mode and
  nothing of its sandbox.
- Hosted merges were not exercised: these fixtures merge locally, with the
  remote base a drive fetches, and regressions cover the hosted case.
- The self-order lane was not driven live.
