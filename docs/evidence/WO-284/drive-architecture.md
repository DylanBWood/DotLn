# The drive router: in-session phases and operator directions

A record of WO-284, written on 2026-11-17 for a planning pass. WO-284 implements none of it: the operator asked for the architecture and for it to be kept where planning can use it ([D019](decisions.md#wo-284-d019--the-operators-scope-expansion-for-the-drive-router-narrowed-by-the-operator-to-an-architecture-kept-for-planning-two-workers-proposals-and-their-synthesis)).

## What the operator asked for

Paraphrased from four messages of 2026-11-17, kept in ignored intake (SHA-256 `2c81406727f4d8ac3987edfd3bac78579105289ad17aafe5101ef927e8516f2b`, `844339c57f97765a02f8079b2f3e882413ffe2563243783149f039b57b2af7da`, `de5107c206c672102d8f87fc4c056ea436b64b2c011a6f1d2be0864dfeb60b5f` and `48a50b1987cfa3bd418ae879639342c595e1d18fac066876ac2beee9ed61059c`):

1. Drive gets a way to run an order's phases as subagents of the router's own session, or as a host workflow, in place of the separate CLI sessions it starts today. The operator's reason is cost: on the machine concerned, by the operator's account, a session's subagents are covered and separately started sessions are billed apart. The operator says this was drive's original requirement.
2. The operator can give data with the drive request that the router relays to named phases: a command or information for one phase.
3. A second, separate router is acceptable if that is cleaner.
4. Two workers each propose an architecture, the executor combines the best of both, and the result is kept for planning. Nothing is implemented in WO-284.

## What exists today

Checked by the executor in this worktree:

- The driver starts each phase as `claude --print` (`scripts/lib/drive-worker.mjs:216`) or a Codex session, with only the lifecycle phrase, and prints one JSON line a transition (`scripts/lib/drive-session.mjs:880`). Its usage is `node scripts/drive.mjs [status] WO-NNN [--host claude|codex]`.
- The hook takes the router's order from a phrase that is exactly `drive: WO-NNN` (`packages/skeleton/src/harness-host.ts:7094`).
- WO-192-D001 chose separate sessions as that order's fallback after a host probe: an in-session worker ran under the parent's hooks only, and a shell directory change did not move it (`docs/evidence/WO-192/host-probe.json`: `cwdUnsupported: true`, `targetHooks` absent). That decision reopens when a repeated probe observes the worker's real working directory and the target's hooks, or when the separate sessions' overhead justifies two transports.
- The harness already emits an agent definition for each phase (`dotln-executor`, `dotln-verifier`, `dotln-reviewer`, `dotln-release-close`).

## How this was produced

Two research workers read the same brief, read-only, and neither saw the other's answer: `opus` (the host reported claude-opus-5-5; xhigh selected) as an in-session worker, 00:52 to 01:03 UTC, and `astra` through Codex in a read-only sandbox, 00:52 to 01:05 UTC, asked for as gpt-6-astra at max; Codex gave no readback, so the model and effort that ran are unknown. Their proposals are in the ignored reviews lane as `architecture-opus.md` and `architecture-astra.md`.

A statement marked (worker) below is a worker's, given with file and line in its proposal, and was not read again by the executor. Planning checks it before it relies on it.

## Recommendation

**Two orders.** Operator directions need no change to how phases run and carry no host unknown, so they can ship first and work with today's sessions. In-session phases depend on host behaviour nobody has observed, so that order opens with a probe.

**One router, one loop, a mode.** Both workers reject a second router: it would copy the stop table, the record, the status command and every router check, while the loop is shared anyway.

- The modes are `sessions`, which is today's, and `agents`.
- An instance elects its default beside `drive.sandbox` (opus). A `mode:` line in one drive request chooses for that drive (astra).
- The recorded mode holds across re-entry, and changing it resets no count (astra).

**Agent spawns, each authorized by a driver step.** Both workers arrive here.

- `node scripts/drive.mjs step WO-NNN` settles the last attempt, applies every stop, and prints one permitted launch or a stop. The router model makes that one Agent call and steps again. The model makes each launch; the module makes every decision.
- The hook admits the call only for the step's pending attempt: the exact phrase, the exact agent type, once, with no model, effort, isolation or fork override (opus).
- The launch runs in the background so the host returns a handle, and the child may do nothing until its identity is bound to the attempt (astra). No second phase starts while one is live.

**No workflow yet.** Both workers reject it for now. A workflow script has no file or process access, so every status read would become a model's structured answer; a resumed workflow replays cached agent results, where re-entry must reread canonical status; and its one gain, a loop no model steers, the step already gives (opus, worker).

**The worktree: probe first, then one of two designs.**

- Primary (opus): the router switches the session into the order's worktree with the host's `EnterWorktree` before each spawn and leaves with `ExitWorktree` after it, and the hooks hand each check to that root's own installed bundle. The phase's role text then holds as written. This rests on host behaviour that is unverified: whether hooks, the project directory, the sandbox's write scope and a new subagent follow the switch.
- Fallback (astra): the child stays in main. A wrapper, `scripts/drive-phase.mjs`, runs each shell command with its working directory set to the registered worktree, file tools take absolute paths, and the hooks read the wrapper's inner command and judge it under the bound root. It needs no host change and is the larger design.
- Target orders: the primary design refuses them, since the switch reaches only the current repository's worktrees (opus, worker, from the tool's description). The fallback binds the target and its launchpad and reserves both.

**Shared control.**

- Split the driver's loop into settle and route (opus), in one control module both modes call (astra). The stop rules stay where they are: awaiting merge, three verification failures, two final-review failures, two incomplete endings, budget.
- One attempt is persisted across steps with an owner, because a lock held only during a step leaves the time between steps open; settlement is idempotent, and a worker's prose is never evidence of completion (astra).
- There is no process to end at a deadline. The hook refuses every tool of a worker past its attempt's limit and the next settle counts it incomplete (opus); the router also cancels through the host where the host allows (astra).
- A new router that finds a dead router's pending attempt reclaims it with a record and counts it incomplete; a live one refuses (opus).

**Attestation.** A subagent's shell may carry the router's effort, so today's readback cannot attest a child. Add a source that the completion accepts only where the hook vetted the model against the attempt's definition and the effort against what it observed on that agent (opus). A value nobody observed stays unknown (astra).

**Codex.** The mode refuses there before any effect and names the election, since Codex tool calls are unhooked. Its sessions remain.

**Operator directions.**

- Form: the first line stays `drive: WO-NNN`; each following block opens with `for <phase>:` and runs to the next such line. Phases are `next`, `fix`, `verify`, `final review` and `release close`, with `executor` for the first two and `all`. `for <phase>: none` clears one. Unaddressed text or an unknown phase refuses the drive before any launch.
- Parsing: only the prompt hook, from the operator's own prompt. Neither the router model nor the driver reads a direction (both).
- Custody: the hook writes the whole prompt to ignored intake with its SHA-256, and a manifest in the ignored control lane with each block's phase, byte span and hash (opus). Bytes are kept as written, and the record says how they arrived: by the hook from the operator's turn, or typed at a terminal (astra).
- Lifetime: a direction stands until a later drive request replaces or clears it, or the order's activation ends. A once-only direction, consumed at that phase's completion, can follow later (astra).
- Delivery: the dispatch already runs the resume command and gives its output as the briefing, so the briefing prints the addressed block in every route: sessions, agents and Codex (both). It rehashes the capture first and refuses on a mismatch (opus).
- Authority: the briefing labels the block as the operator's direction inside the role's limits. It waives no gate, criterion, refusal or bound; a direction that asks for one is recorded as a conflict and not followed. The spawn prompt stays the exact phrase, so the router still relays nothing.
- Codex has no prompt hook: the operator runs a driver command that captures a file's bytes into the same manifest, marked as typed at a terminal.

## Where the proposals differ

| Question | opus | astra | Taken |
| --- | --- | --- | --- |
| Reaching the worktree | Switch the session with the host's tool; hooks delegate | Child stays in main; a wrapper sets each command's directory | Probe, then opus's if the host follows the switch, astra's if not |
| Choosing the mode | An instance election | A line in the drive request | Both: the election is the default, the line chooses for one drive |
| Directions' form | `for <phase>:` lines | Fenced blocks with a lifetime | opus's header, running to the next header, with astra's byte spans |
| Lifetime | Until replaced, cleared or the activation ends | `drive` or `once` | opus's now; `once` later |
| Control code | Split the loop where it is | A new control module with a persisted attempt | astra's persistence in opus's split |
| Target orders | Refused in this mode | Both roots bound and reserved | Follows the worktree design |
| Size | About 12 files, 1,500 to 2,000 lines | 20 to 25 files, 2,500 to 4,500 lines | The gap is mostly the wrapper and paired roots |

## To establish before an order is written

- What `EnterWorktree` changes: the hooks' root, the project directory, the sandbox's write scope, a new subagent's working directory, and what `ExitWorktree` restores.
- Whose effort a subagent's shell reports, and whether the hook sees each child's own.
- That a child's first hooked call can be tied to its spawn, that a phase subagent can launch its own reviewers and they are counted, and that the host can cancel one.
- Whether the usage command reads a subagent's transcript.
- The billing premise. It is the operator's; neither worker measured it, and token counts cannot show it.

## Risks

- Delegating a check to another root's bundle is a new trust path; the delegate's manifest must be verified (opus).
- A phase inherits the session's servers, permission mode and prompts, which the session mode strips, so a drive in this mode is attended (opus).
- The router receives each phase's final text as the Agent result, which the rule against relaying must now cover (opus).
- An in-session phase cannot be killed, only refused tools (opus).
- Usage and cost reporting weaken; a configured dollar limit would refuse the mode, as it does for Codex (opus).

## Questions for the operator

1. May the order open with a bounded host probe, and stop if the host does not follow the switch, or go on to the wrapper design?
2. Is the mode chosen by election only, or also per drive?
3. Do directions persist across a re-entry, or end at each stop?
4. Does the cost requirement cover phase launches alone, or also the review workers and critics that run as separate sessions on another host?
5. Under the in-session mode, should the planned critic command (WO-288 Part A) run as an in-session spawn too?
6. Is weaker usage reporting acceptable in this mode?
7. After qualification, is `agents` the default or an explicit choice?
