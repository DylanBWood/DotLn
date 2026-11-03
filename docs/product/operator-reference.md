# Operator reference

What the operator types to run DotLn, and what happens next. Every session
follows the [execution guide](07-execution-guide.md), which is the contract
each role reads; this page is the operator's side of it, and each section links
the guide's section that binds the session.

## Dispatching a phase

A whole message of the form `resume: <intent>` dispatches the role that the
order's canonical phase selects; the session reads the order and the durable
control state itself, so the phrase needs nothing else.

| Operator says          | What runs                                                                                                                                 |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `resume: next`         | The executor implements the selected order, or reports the next in-flight order when it is closed.                                          |
| `resume: fix`          | The executor repairs the named failure of a verification or final review.                                                                    |
| `resume: verify`       | The verifier judges the candidate independently and files its report.                                                                      |
| `resume: final review` | The reviewer integrates main, judges the whole order and, on a pass, publishes the reviewed branch and opens its pull request.              |
| `resume: release close`| In the main checkout after you merge: the close publishes the tag and Release and refreshes the declared starter.                          |
| `resume: status`, `resume: times` | A read-only report of canonical status or of the phase times.                                                                   |

The contract each phrase dispatches is in the guide's
[§Operator resume phrases](07-execution-guide.md#operator-resume-phrases--how-you-get-dispatched).
You review and merge each pull request yourself; no role merges.

## Driving an order

`drive: WO-NNN` in the main checkout runs each lifecycle phase of the order in
a fresh pinned worker and stops for your merge. It carries the authority of the
phrases it dispatches, including final-review publication and the release close
after your merge, and never merges.

A drive stops for the operator merge, an operator finding, an operator's
recorded direction (a waiver, retraction, reopened handoff, override record or
withdrawal; a defect record or a bound acceptance does not stop it) or typed
correction, analysis or override, refused dispatch, three verification failures,
two final-review failures, two ended incomplete attempts in one phase, or an
exhausted budget. A stop's facts describe the log the drive last saw, so a
transition recorded since, by hand or otherwise, clears a stale refusal or incomplete
count; a repair bound limits only the repairs still to come. Type the same phrase to
re-enter: the phase receives its same briefing in a fresh session.
Release close requires the launchpad merge and, for a target, the target branch's
ancestry in its registered base branch on the remote, as close itself judges it.
Status reads local refs; a drive of a closed order fetches both bases first, because a
hosted merge reaches neither clone by itself and a failed fetch reads as not yet merged. A merge also needs the order's passing final review in its own control record on the base, as close asks of that base, since a branch with no commits of its own is trivially an ancestor. A target merge counts once its branch has reached the remote base, and the drive also requires that branch to have left its recorded base.
A close the host declines is not retried. The drive stops at `awaiting-close`
and names the next step: type `resume: release close` in the launchpad's main
checkout for the order or, after a Codex decline, re-enter with `--host claude`,
the one admitted host change, for that activation's release close only; the
driver refuses any other phase under it, a later activation drives on the host
recorded before it, and a decline is carried only while it is the order's
current fact. The drive record keeps the declined item in the enumerated
vocabulary with the reason the host printed, its URLs, paths and queries masked,
or that it printed none, and a declined or failed phase's raw stream, stderr and
Codex session rollouts stay
beside the record in ignored storage; the live fixture moves them to
`docs/control/local/live-drive-reports/` before removing its trees
([WO-247-D003](../evidence/WO-247/decisions.md#wo-247-d003--what-a-declined-phase-retains-and-where)).

## Session commands

These prefixes join `resume:`, `planning:` and `ideation:` and create no
lifecycle event ([WO-043](../evidence/WO-043/decisions.md)):

| Operator says                   | Meaning                                                                                                                                                                                                                                                                                                                   |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `scope expand: <addition>`      | Authorize the stated addition to the current task. Preserve existing work and obligations, record the bounded scope expansion and its evidence/review duties, and continue under the existing effect boundaries. The prefix alone does not authorize publication, destructive effects or unrelated work.                  |
| `conversation only: <question>` | Answer a side question briefly while continuing the active work order. The question changes no scope, phase or obligation, opens no ideation capture, and requires no repeat `resume:` instruction. Tools and changes already authorized by the work order continue. Only an explicit pause or stop interrupts that work. |
| `quality pass: <target>`        | Improve the named documents, list, folder, described set or passage in the current session under §Discipline's usefulness and passage rules, then continue the active task. It authorizes only those document edits and changes no phase, gate or record protection.                                                      |

## Recovery controls

Begin a message with `analysis:` to pause the work for diagnosis or direction,
or with `operator override:` to suspend DotLn's gates for a recovery you
authorize; the same prefix followed by `off` ends either. Both are admitted
whatever state the repository or harness is in, and host permissions still
apply. Under Codex, `node scripts/operator-control.mjs
analysis|override|off|status` does the same without a build. The guide's
[§Operator recovery controls](07-execution-guide.md#operator-recovery-controls)
is what each role does under them.

## Planning and ideation

`planning:` on clean main opens a planning pass: `npm run plan -- start <slug>`
creates the planning branch and the pass document under `docs/planning/passes/`,
prints the failures, conditions, documents report and follow-up feed, and the
pass ends with a refutation receipt and its `:memo:` pull request, which you
merge. `planning: refute` and `planning: refute full` run the refuter;
`planning: entropy reducer` consumes or runs an Entropy Reducer review.
`ideation:` captures and synthesizes ideas into the ledger. The routes are in
the guide's [§Operator-opened planning pass](07-execution-guide.md#operator-opened-planning-pass)
and [§Operator-opened ideation mode](07-execution-guide.md#operator-opened-ideation-mode);
the [planning README](../planning/README.md) names what a pass reads.

## Releases

Each order's final review publishes its reviewed branch and opens the pull
request; after you merge it, `resume: release close` in the main checkout
publishes the order's tag and Release. The release route and its classification
are in the guide's
[§Workflow closeout and releases](07-execution-guide.md#workflow-closeout-and-releases).
