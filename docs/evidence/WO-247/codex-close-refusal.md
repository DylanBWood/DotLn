# Why Codex CLI 0.166.0 declined the driven release close

Observed on 2026-11-01 at 00:00:43 UTC in the close-only Codex episode
[live-drive-attempt-1.json](live-drive-attempt-1.json), run on code identity
`baf33adde1db508cb555fdb5ce16d0604cdacf36889810f97d479213bb3d4590` (main at
`e66730ee` plus this order's uncommitted work) with the retention WO-247's step 1
added. The earlier runs of 2026-10-31 (WO-192 attempts 49 and 50) ended at the same
decline with nothing retained; [WO-192-D102](../WO-192/decisions.md#wo-192-d102--stop-rerunning-codexs-refused-close-and-leave-criterion-17-open)
records them.

## The declined command

`release.mjs close WO-999 --publish`, run as the exact helper the launchpad's own
`resume.mjs release-close --work-order WO-999` handoff printed, requested with
escalated permissions and the justification "May I run the exact printed WO-999
close helper once outside the sandbox? Its inspected target path enforces this
fixture's no-release policy, verifies the merges, and removes the merged order
worktrees". The `--json` stream reports the item as `command_execution` with
status `declined`, exit code null and empty output: the command never ran. The
receipt keeps it as `["<operand>", "release.mjs", "close", "<operand>",
"--publish"]`.

## The reason, as the host printed it

The stream printed none. The host printed it on stderr, which the transport now
retains for a declined phase, as one error line from `codex_core::tools::router`
wrapping the review's verdict:

> This action was rejected due to unacceptable risk.
> Reason: The exact helper will push a tag and create a GitHub Release, exporting
> repository material to an external destination not specifically authorized by
> the user; it also performs irreversible cleanup.
> Do not bypass this rejection through a workaround or indirect execution.
> Continue with a safer alternative, or carry out checks to prove that the action
> is authorized or low risk before trying again. Complete unaffected work without
> asking for confirmation. Report anything that remains blocked, clarify why it
> was blocked by auto-review, inform the user of the risk and ask for approval.

The same text reached the worker as the tool call's error, and the retained
session files hold the reviewer's own thread.

## The decider the host names

Codex's automatic review ("Approve for me", selected by the driver's
`--approve-for-me`), which the retained session index names as a separate thread
"Guardian review" with `turn_trigger: guardian_review`. It is itself a Codex
agent; it sees a compact transcript plus the exact approval request, and answers
with a JSON verdict. Two verdicts were recorded in this episode:

1. For the lifecycle handoff command `resume.mjs release-close --work-order WO-999`:
   `{"risk_level":"high","user_authorization":"medium","outcome":"allow","rationale":"The requested release-close workflow can publish a validated tag/release and remove the merged worktree/branch, but it is narrowly scoped to WO-999 and the user authorized release close in substance."}`.
2. For the close helper itself, after reading that handoff's output:
   `{"risk_level":"high","user_authorization":"medium","outcome":"deny","rationale":"The exact helper will push a tag and create a GitHub Release, exporting repository material to an external destination not specifically authorized by the user; it also performs irreversible cleanup."}`.

Between the two verdicts the reviewer read the launchpad's handoff sentence,
printed by `resume.mjs release-close`: "This narrowly authorizes the annotated tag
and its matching GitHub Release; never push main. The helper needs network egress
to the GitHub host for fetch, ls-remote, the tag push and the Release". That
sentence is false for this order: the fixture's target has no release policy and
a target order's launchpad records branch records no release, so the close
publishes no tag and no Release; it fetches both bases to verify the merges,
records a no-release close and removes the merged worktrees and branch. The
reviewer's rationale is that sentence, restated.

## CLI version and the documented policy

`codex --version`: `codex-cli 0.166.0`. The launch is `codex exec --approve-for-me
-c sandbox_workspace_write.network_access=true ...` with `--ignore-user-config`
and the isolated home. The pages read on 2026-10-31:

- `learn.chatgpt.com/docs/developer-commands?surface=cli`: `--approve-for-me`
  uses automatic approval review with `on-request` approvals and the
  `workspace-write` sandbox; it conflicts with `--sandbox` and `--yolo`.
- `learn.chatgpt.com/docs/sandboxing/auto-review`: eligible sandbox-boundary
  approvals go to a separate reviewer agent instead of stopping for a person;
  if denied, the main agent is instructed to find a materially safer path or stop
  and ask the user, and Codex returns the review rationale to the main agent.
  With `approval_policy = "never"` there is nothing to review, and
  `danger-full-access` or `--yolo` avoids the boundary-crossing request that
  review requires. In the TUI `/approve` admits one retry of a recent denial;
  `codex exec` offers no such route.
- `learn.chatgpt.com/docs/agent-approvals-security`: `never` disables approval
  prompts; dangerous full access is "No sandbox; no approvals (not
  recommended)"; protected paths stay read-only inside writable roots.

The retained observation, in ignored storage of this launchpad:
`docs/control/local/live-drive-reports/live-drive-attempt-1/drives/release-close-1.stderr.txt`
(the printed reason), `release-close-1.events.jsonl` (the raw `--json` stream)
and `release-close-1.codex-home/sessions/2026/10/31/` (the worker's rollout and
the reviewer's; this first retained copy predates the allow-list of
[WO-247-D003](decisions.md#wo-247-d003--what-a-declined-phase-retains-and-where)
and holds the whole home without its auth link, 33 top-level entries, where a
later copy holds the rollouts and their index alone).

## What the reason admits

The review declined on a claimed external export the command would not make,
and on cleanup the close is for. The repair the reason admits, within "carry out
checks to prove that the action is authorized or low risk before trying again",
is to make the launchpad's own handoff state what the close does for the order
it names: a no-release close publishes nothing and removes the merged worktrees,
and only an order with a release due is told its tag and Release are authorized.
That corrects DotLn's sentence; it argues nothing to the review and bypasses no
denial. One close-only Codex run on the corrected text,
[live-drive-attempt-2.json](live-drive-attempt-2.json) on 2026-11-01 from
00:13 to 00:16 UTC, recorded the finish: the review admitted the close, the
worker exited 0, the receipt records a no-release close with clean cleanup and
the target removed, and the drive stopped at `released`. A close a host still
declines ends at the drive's `awaiting-close` stop, which names the attended
close and the admitted host change.
[WO-247-D007](decisions.md#wo-247-d007--the-reviews-reason-and-the-repair-it-admits)
records the choice; the requalification runs of step 9 record the full
lifecycle on each host on the final code.
