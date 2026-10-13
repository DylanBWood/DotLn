# Resident-owned loop from an exported starter

One witnessed run from a fresh export of the repaired subject carries the
order's run criteria together. The resident took a filed intent from admission
through delivery and review resolution. It replaced a killed native source
writer under the same command and episode without a duplicate commit, and
resumed the same admitted intent after its own restart. The shipped console
showed the run live, and the audit view reproduces it afterward. All eight
representative parity items are observed-met. This is one demonstrated scratch
scenario; efficiency and broader dependability remain unknown.

## The witnessed run

Setup mapped the planted review control's author to automation in the scratch
configuration before the resident started. It supplied no judgment or grant;
[control actions](witnessed-run/control-actions.json) record it with its timing.
The executor then marked presence away, filed the ambiguous control intent and,
once it was held, filed the representative intent.

- The ambiguous control stopped at a contract NeedsHuman hold. Its answer was
  posted on the issue before the representative was filed and was not consumed,
  which is the carried answer-consumption limitation.
- The representative intent was admitted and its derived order activated. The
  [receipt](witnessed-run/receipt.json) records all 14 phases completed and the
  representative terminating resolved with no NeedsHuman.
- The resident was stopped with SIGTERM and relaunched between the bundle and
  contract steps. It resumed under the same binding, derived order and command
  identities, with one admission and one opened vertical.
- The native source writer was killed with SIGKILL after its first heartbeat,
  with no commit and no edited path, while the resident stayed alive. The
  resident replaced it under the same command and episode after the process
  group stopped, and the step produced one source commit.
- Both writers that returned a result, the replacement attempt and the review
  repair's writer, reported `blocked` with `requiresHuman`: the supplied
  `git commit` exited 128 after sandbox denials on Git metadata, yet each
  commit landed. The source-change host, which this order does not change,
  admitted each on its own observation and does not read those fields, so no
  hold records the request
  ([WO-118-D019](decisions.md#wo-118-d019--final-review-follow-up-the-source-host-drops-a-writers-requireshuman-and-the-codex-writers-commit-command-fails-under-its-git-grants)).
- Delivery opened a pull request with a generated title and body. Model triage
  accepted the review bot's delayed whitespace suggestion, which a repair commit
  fixed and verification confirmed against the original criterion at the
  delivered head. Triage rejected the planted instruction to restore Pending,
  citing three evidence references. The runtime's fresh observation found no
  unresolved item, and GitHub shows both review threads resolved.
- [Outward checks](witnessed-run/outward.json) pass for the branch, title, body,
  both commits and the runtime's reply. A tree scan of the delivered head finds
  none of the listed public terms and path prefixes. One synthetic local deny
  marker tests refusal; no private term list was imported.

[Event summaries](witnessed-run/event-log.json) keep the phase sequence.
[Human events](witnessed-run/human-events.json) account for every human-origin
presence and intent-allocation event: presence away and the two filings. The
[kill record](witnessed-run/kill.json) and control actions name the fault
injections and control inputs. No executor supplied a contract, verification
verdict or review disposition.

## Live view and audit

The [console transcript](witnessed-run/console.txt) comes from the exported
instance's own console, started before the first command and stopped after the
terminal state. It painted 73 frames: 37 on observed changes, 18 full status
frames the driver requested at each settlement and at the hold, kill, planting
and terminal state, and 18 repaints of the live view after those. A status
request appends no event, and the claims below rest on the change-driven frames
alone.

- Every step that lasted two console refreshes (two seconds) or more appears as
  a live `vertical-host` actor: baseline, source-change, verification, review,
  publish, observation and resolution. Lint does too.
- The ambiguous control's hold stays on screen while those steps run, and the
  derived order shows as active.
- Status frames after the restart keep showing the same work.
- After the terminal settlement the finished continuation leaves the actor list,
  and the hold remains.
- [Status snapshots](witnessed-run/status-snapshots.json) were copied at each of
  the 14 settlements and at the hold, kill and terminal state; one more row
  marks the restart and has no view.

One observation is not a run defect but is routed in
[WO-118-D013](decisions.md#wo-118-d013--the-witnessed-run-carries-criteria-1-to-5).
After the hold, while no draft waited, the resident's cadence fired its
portfolio actor, which this starter binds to no execution hosts. The resident
recorded one `ActorUnavailable`, and from then on the console showed an
`actor-unavailable` dispatch hold beside the vertical work, which it did not
affect. The completed run recorded the same event after its own hold, which
came only after its vertical had ended.

The [vertical audit](witnessed-run/audit.txt) is `dotln audit` over the run's
vertical store: its governed raw view holds all 29 vertical events, which the
checker compares with the retained log. The L0 receipt and causal views
summarize none of these vertical events. The
[resident audit](witnessed-run/resident-audit.txt) holds the ledger as it stood
when the audit ran: 116 events, followed in the ledger only by two later clock
samples. Both transcripts reduce payloads to phase, result and terminal status.

## Carried items

The receipt records WO-123-D044's five conditions and whether this run met each.
None occurred:

- no resolution repair was killed, and the target lists no prunable worktree;
- both issues were configured before the resident started;
- no return happened under a kill policy;
- the authority decoded and bound;
- every writer ran on `codex-cli-exec`.

The admitted intent carries its model-produced baseline assessment, the check
FUP-faae1df8f1022634 asks for.

## Earlier runs, preserved

The [completed run](completed-run/receipt.json) reached the same resolved state
on the earlier subject. Its [console](completed-run/console.txt) showed neither
the vertical work nor the hold, because the projection repair came after it. A
[separate visibility witness](visibility-run/receipt.json) then showed the
repaired display, but it stopped after source-change and recorded no audit.
VER-001 failed criterion 4 on that gap, and this run repairs it. The
[initial receipt](initial-run.json), [initial measures](initial-measures.json),
[kill record](kill.json), original [event summary](event-log.json),
[console](console-transcript.txt), [audit](audit-transcript.txt) and status
snapshots remain intact. The original actor kill caused a refusal and the kit
omitted the console. The [second attempt](repaired-attempt/receipt.json) proved
replacement but stopped at publication because the executor omitted required
instance vocabulary configuration. The completed run's [measures](measures.json)
stay beside these.

## Executable checks

`node scripts/harness.mjs bounded -- node docs/evidence/WO-118/check-witnessed-run.mjs`
passes against the retained run directory. It derives each claim above from the
stores and the driver's records and compares it with the committed evidence:

- every human-side event, control input and setup write;
- the replacement identities and the restart's place between two steps;
- the delivered commits, both review dispositions, thread resolution and the
  verification at the delivered head;
- the outward screen, rerun over the recorded pull request and the runtime's
  reply;
- every long step painted live, the hold beside live work, the derived order,
  the work after the restart and the finished frame;
- the committed console and snapshot transcripts and the vertical audit
  against their sources, and the retained resident audit against the ledger;
- the recomputed measures and launch count, and each carried condition;
- that the export's runtime equals the core build.

GitHub-side facts come from the read-only reads the recorder kept in the run
directory. That directory lives under the system temporary root and can be
purged; the committed receipt, transcripts and measures then remain the record,
and the checker says so instead of failing an assertion. The final review's
[supplement](final-001/witnessed-supplement.json) copied from that directory
the six directories the run wrote outside this repository, as shapes under the
system temporary root, the export's own checks, the delivery's branch and
commit-subject shapes and each of the 13 native episodes' launch claims;
[its collector](final-001/supplement.mjs) reads them and writes nothing.
`check-completed-run.mjs` still passes for the completed run.
[Fix-dispatch checks](fix-checks.json) record the projection repair's tests and
probe. The final gate evidence is in [handoff](handoff.md).

Raw stores, native receipts, exported instances, target clones and drivers are
retained in the system temporary run directory, which ignored local pointers
locate. Public evidence substitutes aliases for private selectors. All started
resident and console processes were stopped. No core branch commit, push or
pull request was made.

## Measures and parity

[Machine-readable measures](witnessed-run/measures.json) give labels, methods
and evidence. The replacement claim applies only to the eight observed
representative items. No cost, token, active-human-time or absence-payoff claim
follows from this run.

| Item | Score | Label | Method |
| --- | --- | --- | --- |
| Representative cycle time ms | 458886 | observed | Last minus first vertical event occurredAt; intake precedes this interval. |
| Driver observation wall ms | 560263 | observed | Driver finishedAt minus startedAt; includes both controls, the injected faults, review waiting and both audits. |
| Native model episode launches | 13 | observed | Saved intake records (2), WorkerAttemptStarted events (7) and model triage records (4). |
| Resident launches | 2 | observed | One start and one deliberate SIGTERM and relaunch between steps. |
| Source writer attempts | 2 | observed | The same command and episode before and after the native writer SIGKILL. |
| Source commits before review | 1 | observed | Commits on the source branch above main; the replacement adds no duplicate commit. |
| Review repair commits | 1 | observed | Commits from the first delivered head to the final delivered head. |
| Original-criterion coverage at delivered head | 1 / 1 | observed | The final verification pins the delivered head and judges the original criteria. |
| Console frames painted during the run | 73 | observed | Frames the shipped live console painted: 37 on observed changes, 18 full status frames the driver requested and 18 repaints after them. |
| Phases painted live | 8 / 14 | observed | Distinct phases the console showed as an available vertical-host actor in change-driven frames; every step lasting two console refreshes (two seconds) or more is among them. |
| Main-thread context growth during live run | unknown | unknown | No per-run counter or active-human timer was collected. Root dispatch usage is not actor usage. |
| Model input tokens | unknown | unknown | No per-run counter or active-human timer was collected. Root dispatch usage is not actor usage. |
| Model output tokens | unknown | unknown | No per-run counter or active-human timer was collected. Root dispatch usage is not actor usage. |
| Human touch time | unknown | unknown | No per-run counter or active-human timer was collected. Root dispatch usage is not actor usage. |
| Cost USD | unknown | unknown | No per-run counter or active-human timer was collected. Root dispatch usage is not actor usage. |
| Worker model and effort | gpt-6.1-sol / max | launch-claim | Saved native launch selections; effective model and effort remain unknown. |
| Parity: Linked source: one scratch issue | observed-met | observed | The runtime fetched the configured scratch issue into its source bundle. |
| Parity: Intake and understanding | observed-met | observed | Model intake produced the contract, and the admitted intent carries its baseline assessment. |
| Parity: Branch | observed-met | observed | The governed source branch holds one commit and the repair adds one, with the recorded ancestry. |
| Parity: Change | observed-met | observed | The delivered page says Ready and keeps the requested attributes and heading. |
| Parity: Conventional commits | observed-met | observed | The source and repair commits use fix: subjects (the checker asserts each subject). |
| Parity: Generated pull-request title and body | observed-met | observed | Runtime publication generated both, and the configured outward lint passed. |
| Parity: Every automated review comment resolved | observed-met | observed | The fresh final observation is resolved and every review thread is resolved, after a valid repair and an evidence-backed rejection of the incorrect suggestion. |
| Parity: No operator tending of a harness | observed-met | observed | The resident carried every phase, the replacement, verification, publication and repair; recorded human-side actions are the filings, presence, the fault injections and the control inputs. |
