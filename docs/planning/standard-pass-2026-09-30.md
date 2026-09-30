# Standard planning pass, 2026-09-30 (second): the operator's three items and WO-172's subject map

Document-only planning pass on branch
`planning/2026-09-30-standard-pass-small-additions` from clean `main` at
`b51a58a8` (the REVIEW-004 pass merged; WO-066 published as v0.57.0).
Between work orders. Every claim below names its source; a value nobody
observed is written as unknown.

## 1. What was asked, and the subject

The operator's dispatch, `planning: standard planning pass + small
additions`, and four mid-turn messages (captured verbatim in ignored
intake, `docs/intake/notes/2026-09-30-standard-pass-small-additions-planning.md`,
SHA-256 `53ec7f2a57d8d07f8337dd97686099b29d09efcf1c0fa5747849ffdf0f5b0e6c`),
paraphrased:

1. A release close's helper refused removal because it found a nested
   walkthrough repository; the session stopped at the refusal, then
   decided by itself to preserve the repository outside the worktree and
   finish cleanup. Two errors: idling instead of finishing, and deciding
   alone about scratch material. The executor's handoff to release close
   should carry what the executor knows about such repositories.
2. New guidance: spawned Codex agents run GPT-6.1-Sol at max; spawned
   Claude agents run Opus 5.5 at xhigh.
3. Claude Code only: the auto-mode permission classifier denied
   `release close WO-086 --publish` as "Create Public Surface", and the
   session neither retried nor looked for another way to the same result.
4. WO-172 should have given the pass a trove of places or areas to
   improve, in addition to the normal follow-up queue and the boarded
   items. (The operator first re-pasted message 2 by mistake and
   corrected it.)
5. The last five or so passes generated only machinery and debt orders;
   the orders themselves are fine, but is it certain no product order
   needs adding or updating?
6. `v1.0.0` is months away at the current rate, and many critical
   product features have likely not been considered yet.
7. Once this queue drains the operator will bring a lot of direction;
   until then the period is early access, as games hold an alpha or beta
   for a long time.

Subject: `npm run plan -- failures` since receipt 035 and, for the
survey's measurements, since WO-173 closed; the vision (product 00), the
critical-path plan and its gates, the roadmap's rungs (product 06) and
product 03's adapter definitions against the 30 queued orders; the register at revision
`ad163666…` (790 rows, 193 pending, 31 untriaged): the first page,
the rows `--touching` the surfaces this pass changes, and the rows
WO-172's subject map names; the subject map itself, 30 themes over 303
episodes ([intervention-subjects.md](../evidence/WO-172/intervention-subjects.md),
D022, D026, D034, D039); the WO-117 and WO-086 records; the harness
source that judges ignored material, permissions and hooks; the sequence
as the REVIEW-004 pass left it; Claude Code's permission, permission-mode,
auto-mode configuration and hooks documentation, read on 2026-09-30.

Fan-out plan: one background refuter of twenty (Agent tool, model
`opus`; effort inherited from this root's `CLAUDE_EFFORT`, `xhigh`), no
other subagent. Five web fetches of public documentation; no external
review transport.

## 2. The failures report (`plan failures`; WO-172)

Window since receipt 035 (2026-09-30T14:16Z): four corrections, no failed
judgment, one failed local gate row, one local shell diagnostic. Routes:

| Item | What it was | Route |
| --- | --- | --- |
| WO-057-D003 (implementation) | a scratch setup assumed a browser executable's filename instead of reading the download's inventory | theme 4 of the map (a conclusion stated before it was checked); WO-179's checked-claim sentence; the decision's own reopening condition stands |
| WO-057-D007 (final review) | a record sentence named four removed variables without the filter that selected them | a wording correction with its fixture; no route needed |
| WO-087-D006 (implementation) | a scratch probe equated repository-wide historical link failures with new ones, read with too small a buffer, and left a zsh pattern unquoted | the Shell rule WO-172 put in CLAUDE.md covers the pattern; the `unknown`-after-source sentence (WO-179, theme 26) covers the rest |
| WO-087-D009 (implementation) | a failing planning check was reported as inherited from the runner's label without comparing the inputs | theme 4; FUP-5f58198706dfa59e's recurrence, allocated to WO-179 |
| local gate row, `npm run test:docs` exit 1 at 14:17:59Z, identity `73acb752` | the previous pass's stale lineage index before regeneration (its §11 records the cause) | none; the same pass regenerated and passed |
| local shell diagnostic, parse error at 14:20Z (planner session `953439e8…`) | a command the shell refused to parse in a planner session before this one; the row holds no command text | none; this pass's own unmatched pattern (14:36Z, `WO-175*.md` in the wrong directory) is the second row and is answered by the same Shell rule |

Widened to the window the subject map asks a pass to read (since
WO-173 closed, 2026-09-28T17:00Z): three failed verifications (WO-172
VER-003 by Codex `gpt-6.1-sol`, criteria 9 and 11; VER-004 by Claude
`claude-sonnet-5-5`, criterion 11; WO-086 VER-002 by `claude-opus-5-5`,
criterion 3), five failed first verifications among eleven orders made
ready, 26 corrections, one waiver, ten amendments. Each of the three
failed on a declared criterion, none only on a case outside its declared
set, so FUP-b053a956adb84b6a's reopening condition did not occur (§8).

The report gave this pass identifiers and counts, as WO-172 chose
(D202: the pass reads the report it names). What it could not give is
in §6: the two failures items 1 and 3 describe are in no record, and
the subject map WO-172 also produced was not on the pass's entry list.

## 3. Item 1 — the release close that stopped and then decided alone (observed)

- The repository was WO-117's walkthrough store under
  `.runtime/wo117-walkthrough/` (VER-001 §Limits read it there; the
  witness keeps its private name out of the record). WO-117 was
  published as v0.56.0 on 2026-09-29 (tag 14:06 local). The retained lane
  for WO-117 holds `integration.json` and two follow-up files and no
  close record; the close's session journal holds four rows and names no
  harness. The operator's report is the record of what the session did.
- The mechanism, from the source: `describeIgnoredMaterial`
  (`scripts/lib/paths.mjs`) returns `disposable: false` for every nested
  repository with content outside the intake and control lanes,
  ignoring `classifyIgnoredMaterial`, which marks files under `.runtime/`
  disposable. `ensureNoIgnoredMaterial` (`scripts/worktree.mjs`) then
  blocks removal with the remedy "move it outside the checkout from an
  operator terminal; a nested repository is never deleted here". Release
  close prints the blocker as an advisory and leaves the worktree
  (`scripts/release.mjs`). The session did the remedy itself.
- Nothing the executor hands off says which repositories it made are
  scratch: `ImplementationReady` evidence holds the tree hash,
  advisories, two gate rows and the unmet criteria
  (`scripts/lib/lifecycle-evidence.mjs`; `scripts/resume.mjs`).
- WO-172's map holds both halves: theme 8 (release close stops short;
  coverage "fixed", zero episodes after its fixing orders, which this
  episode contradicts) and theme 2 (halts at a blocker it could settle;
  22 episodes in 14 orders, partial coverage).

Decision: WO-176. The lane is the declaration for disposable roots; the
executor declares the rest with `worktree material` and completion
records the rows in the lifecycle event; the close removes, preserves or
blocks on the record, and a blocker's advisory prints the one command
that settles it (`--material <path>=…`, the operator's word at close
time); every close writes `release-close.json`. The role sentences (a
blocker or a denial is reported with its command; the session never
moves, copies, deletes or preserves material by its own decision; the
executor declares its scratch repositories) are WO-179's, since role
text is one file. FUP-ecf9d3b703a0b7d9's condition ("a release close
fails and the next pass cannot say why") occurred; it is allocated to
WO-176 and WO-178. Alternatives in §11.

## 4. Item 3 — the publish the classifier denied (observed)

- The record holds no denial: the project's generated permission hook
  emits only `deny` decisions (`packages/skeleton/src/harness-host.ts`),
  `.claude/settings.json` has no allow rules and registers no
  `PermissionDenied` hook, and the WO-086 close's Claude session journal
  (192 Bash rows) holds no denial row. v0.56.1 was tagged at 16:00:50
  local on 2026-09-29; how, after the denial, the record does not show.
- Claude Code's documentation, read on 2026-09-30: actions matching
  allow, ask or deny rules "resolve immediately" before the classifier,
  with exceptions (protected paths, critical-path removals, per-command
  domains, content ask rules); "narrow Bash and PowerShell allow rules
  such as `Bash(npm test)` stay in effect in auto mode" while "broad
  rules that grant arbitrary code execution, such as `Bash(*)` or
  wildcarded interpreters" are suspended; a PreToolUse hook's `"allow"`
  "bypasses the permission system entirely and runs without prompting
  the user or checking permission rules"; the `PermissionDenied` event
  fires "when auto mode denies a tool call, including denials without a
  classifier verdict" and receives the tool input; `autoMode`
  configuration is read only from `~/.claude/settings.json` or managed
  settings, "never from project settings"; a denied action is listed
  under `/permissions` Recently denied, where the operator can retry it.
- The printed helper begins with the absolute node path
  (`process.execPath` in `scripts/worktree.mjs` and `scripts/release.mjs`),
  so a project allow rule for it would be a wildcarded interpreter, and
  WO-066 D012 records that such a rule admits a family of commands while
  the hook enforces the exact spelling.
- The 2026-09-25 pass met the same classifier denying a verifier's
  instrument run and took NoOp with the reopening condition "a second
  verification cites operator-run output"; the class recurred in another
  role instead.

Decision: WO-178. The permission hook returns `allow` for the byte-exact
release-close helper when the session's recorded dispatch is
`release-close` for that order, cwd is the main checkout and canonical
status lists `release-close` among its legal actions: the lifecycle that
authorized the effect admits it, the hook's first admission, under the
standing direction toward DotLn-owned authority (FUP-3682b768d1d00a3b).
A `PermissionDenied` hook journals every denial so `plan failures` can
count them. WO-179 gives the release-close role the sentence: a denial is
reported once with the operator's two routes (the `!` prefix; the
Recently denied retry), the session finishes what remains and never
claims a publication it did not make. An `autoMode` environment entry is
the operator's option outside the repository (map candidate 1).

## 5. Item 2 — spawned agents (observed)

- Compiled defaults at `b51a58a8`: `scripts/lib/entropy-review.mjs`
  `TRANSPORT_DEFAULTS` names `gpt-6-sol` at `xhigh` for Codex and
  `claude-opus-5-5` at `xhigh` for Claude; `writing-worker-probe.mjs`
  names `claude-fable-5` and `gpt-6-sol` at `xhigh`; `authority-probe.mjs`
  and `subagent-probe.mjs` name `claude-fable-5` and `gpt-6-sol`.
  AI-HARNESS-SECURITY's launch line says the same. Product 07's
  live-episode sentence and eight queued orders (WO-058, WO-059, WO-072,
  WO-075, WO-095, WO-097, WO-098, WO-123) named Codex `gpt-6-sol` at
  `xhigh`.
- The model exists on the operator's host: WO-086's repair ran on Codex
  CLI 0.159.0 with `gpt-6.1-sol` by session readback. `max` is among the
  accepted Codex effort selectors the 0.154.0 probes recorded.
- Claude Code's Agent tool takes a `model` (`sonnet`, `opus`, `haiku`,
  `fable`) and no effort; `CLAUDE_EFFORT` is process-wide and names the
  root's selection (AI-HARNESS-SECURITY), so a spawned Claude agent runs
  at the root's effort. This session's is `xhigh`. Whether Codex
  `spawn_agent` takes a model or an effort is unrecorded here.

Decision: the direction is written into product 07 §Model-specific
notes as the spawned-agent rule and into the live-episode sentence, the
refuter sentence of §Operator-opened planning pass names the Claude
model, and the eight orders' sentences now read Codex `gpt-6.1-sol` at
`max` or Claude Code `claude-opus-5-5` at `xhigh` (this pass; they enter
the refutation scope). The compiled defaults, the probes and the
`spawn_agent` record are WO-177. This pass's refuter ran on `opus` at
the root's `xhigh` (§15).

## 6. Item 4 — WO-172's subject map, taken up (observed and routed)

The map's 30 themes (303 episodes, 71 orders, 2026-08-31 to 2026-09-28)
were the executor's reading through agents, accepted by the operator as
good for now on 2026-09-29; the 2026-09-29 map candidate said a pass
should take them up beside `plan failures` and confirm each with the
operator before allocating. The operator's messages 3 to 5 are that
direction. Each theme's route:

| # | Theme (layer; episodes; map coverage) | Route in this pass |
| --- | --- | --- |
| 1 | Gates rerun in loops or run slowly (meta; 21; fixed) | Measured (below): 40 `npm test` rows since WO-173 closed, 12 fresh at an identity already green. Carry-in on WO-174's catalog row to explain; WO-178 counts repeated runs; the structural cut re-measured as map candidate 4 |
| 2 | Asks, stalls or re-diagnoses instead of acting (meta; 22; partial) | Recurred in item 1. WO-179 sentence (2); FUP-a9412a7815418c21 is settled by the 2026-09-30 pass already |
| 3 | Misreads what the operator asked (meta; 16; partial) | WO-179 sentence (3): Intent to Act extended to planner, verifier, reviewer; scoring waits for WO-178's rows |
| 4 | States conclusions it has not checked (meta; 16; fixed, 4 after) | Recurred (WO-087 D009). WO-179 sentence (4); FUP-5f58198706dfa59e reopened and allocated to WO-179 |
| 5 | Lifecycle gaps lose context (subject; 15; fixed) | None needed, as the map says; no episode since 2026-09-18 |
| 6 | Judges reach beyond the criteria (meta; 13; partial, 4 after) | Tested: the three failed verifications since WO-173 each failed on a declared criterion; FUP-b053a956adb84b6a stays deferred. The "set aside is known, not failed" briefing line is WO-179 (15) |
| 7 | Sandbox and permission steps (meta; 12; partial) | Recurred in item 3 (a denial passed nowhere). WO-179 sentence (7); WO-178's admission and journal |
| 8 | Release close stops short (subject; 13; fixed, 0 after by the map; 1 after by item 1) | WO-176 and WO-178; FUP-ecf9d3b703a0b7d9 allocated; FUP-8cfd3ff52146a016 stays deferred (a non-goal of both) |
| 9 | Unusable text to the operator (meta; 12; partial) | WO-179 sentence (9) |
| 10 | Records the operator's words other than said (meta-meta; 12; partial, 1 after) | WO-178's document check (FUP-f287a595299249ff, FUP-71fc2efc208f597a allocated, bounded to thirty paraphrases) |
| 11 | Corrections do not persist as process (meta-meta; 12; tracked) | WO-178's intervention rows (FUP-84ea5fb168c317cf, FUP-0c76cd39223a576b allocated); the classifier is map candidate 3 |
| 12 | Hooks and gate machinery block the work (subject; 12; fixed) | None needed, as the map says |
| 13 | Plans drift from the vision (meta-meta; 11; partial) | Measured (below): three of the last eight closed orders are delivery by this pass's reading. WO-178's `Track:` header and the split at `plan start` |
| 14 | Serves a check or cap instead of the goal (meta; 11; partial) | Product 07 now says a byte figure is a target, never a trim bound (this pass); FUP-a815e8862796c2e1 reopened and allocated to WO-179 sentence (14) |
| 15 | Defers fixable defects (meta; 10; partial) | WO-179 (15): the verify sentence and the Adjacent Repair rule state the boundary |
| 16 | Polls, narrates or idles (meta; 10; candidate, 4 after) | Recurred in item 1 (idle at a refusal). WO-179 sentence (16); FUP-3bb4dea9dde2a392 and FUP-1f47fd50acc97814 allocated |
| 17 | Clean-room screening too broad (meta; 8; fixed) | None needed, as the map says |
| 18 | Every role reruns the full gate (meta-meta; 8; partial) | Measured with theme 1. WO-179 (18): the verifier consumes the executor's row; `productGate` leaves the verifier procedure |
| 19 | Treats a question as an instruction (meta; 8; fixed, 1 after) | WO-179 (19): the briefing sentence |
| 20 | Leaves locks, monitors, stray files (subject; 8; partial) | WO-179 (20) and WO-178's Stop advisory; FUP-0349c7a91fe63917 settled (WO-166 shipped its ask) |
| 21 | Passes before the work is checked (meta; 9; partial) | WO-179 (21): the claim check at `verification-result`; FUP-9a23fe23cbf08958 reopened and allocated |
| 22 | Refutation loops or needs hand steps (subject; 7; partial) | Map candidate 5 (the fixed deadline); receipt 035 took 605 s |
| 23 | Phases run far longer than their work (meta; 7; partial) | WO-178: attempts above twice the phase's median listed at entry |
| 24 | PR titles drift (meta-meta; 6; fixed) | None needed, as the map says |
| 25 | Ideation captured raw (meta; 6; fixed) | None needed, as the map says |
| 26 | Readable values left unknown (meta; 6; partial) | WO-179 (26) |
| 27 | Writes outside its lane (meta; 6; partial, 4 after) | The roadmap duty is gone from the role text at `b51a58a8` (no `roadmap` in `contributor.ts`); FUP-cd1a227413938345 deferred to the consolidation; FUP-bf614feaea90cac3 settled by the product 07 step-1 edit |
| 28 | Sessions misreport model and effort (subject; 5; fixed) | FUP-a6cf30a8b7bc4a83 deferred on D014's own condition, low priority by the operator's note |
| 29 | Provider safeguard refusals (subject; 1; untracked) | WO-179 (29); FUP-6332681e9500a84b allocated |
| 30 | Unprompted trap judgment the operator wants kept (meta; 0; tracked) | WO-178 carries D018's classes, positive reinforcement among them |

Measurements the map asked a pass to take at entry:

| Measure | Value | Source |
| --- | --- | --- |
| `npm test` rows since WO-173 closed (2026-09-28T17:00Z) | 40 rows, 11 orders: WO-172 7, WO-065 5, WO-086 5, WO-167 4, WO-173 4, WO-116 3, WO-117 3, WO-057 3, WO-060 2, WO-087 2, WO-066 2 | `docs/control/local/harness/checks.json`, by order |
| Rows fresh at a code identity already green | 12 (one identity five times on 2026-09-30, 00:55Z to 02:47Z, all exit 0; WO-066's final review ran 701 s at the identity its executor had run green); WO-173's covering-row lookup exists and did not apply, for a reason the rows do not state | same index; `scripts/lib/gate-reuse.mjs`; `docs/control/orders/WO-066.jsonl` |
| Orders above four runs (the 2026-09-28 pass's reopening figure) | three | same |
| Delivery among the last eight closed orders | three (WO-066, WO-117, WO-065) of eight (WO-066, WO-057, WO-087, WO-086, WO-117, WO-172, WO-173, WO-065), by the catalog's purpose column; no order header states its track | `docs/planning/work-order-map.md` catalog; `npm run release -- list` |
| Failed verifications since WO-173 closed | 3, each on a declared criterion (§2) | `plan failures --since` |

The subject map is the executor's reading; the routes are this pass's.
Where a theme's next step is one sentence, WO-179 carries it with the
theme and episode ids in its decisions so the operator can strike one at
review; where it is a count or a check, WO-178 carries it; where the map
says none needed, nothing is filed.

## 7. Product coverage — the operator's question, checked (observed)

Read against the queue of 30 orders (every observed gap re-dated
2026-09-28): the vision's three horizons and mission (product 00), the
critical path's gates and destination checklist, the roadmap's pending
rungs and `v1.0.0` exit (product 06), product 03's adapter definitions
and product 12's journeys.

| Product surface | Orders that carry it | Gap |
| --- | --- | --- |
| Gate R, the always-on runtime (resident, presence, mission check, portfolio, unattended hour) | WO-067, WO-068, WO-099, WO-100, WO-110, WO-111, WO-119 to WO-122: closed | none |
| Gate U, the window into it (status, parity, audit, live console) | WO-114 to WO-117: closed; the authoring journey through the live client is a map candidate that waits for WO-095 | none this pass files |
| Gate F, browser witnesses | WO-057 closed; WO-058, WO-059 at the head | none |
| Gate G, intake (SourceBundle, StoryContract, Issue adapter, surfaces) | WO-060 closed; WO-061, WO-062, WO-124 queued | none |
| Gate V, the vertical (composition, the loop from core, the resident-owned loop) | WO-123, WO-112, WO-118 queued | **three steps the roadmap's vertical and product 03 name have no order**: the baseline witness before any change (product 03 §VerificationAdapter "Baseline first (Live Witness)"), the independent review episode beside blinded behavior verification ("separate independent episodes"), and the deliverable-ready conjunction checklist before the pull request (§DeliveryAdapter, fourteen items; WO-064 landed four of them in the body and declined to require readiness). A search of the queued orders for baseline, reproduce, live witness, code review, review episode, conjunction or DeliveryAdapter finds none |
| Gate S and P, the starter and the fork's run | WO-069 to WO-071, WO-079 closed; WO-072 to WO-078, WO-080 to WO-083 queued | none |
| Deferred families (docs reset, pattern workshop, rule migration) | WO-088, WO-089, WO-091 to WO-098 queued | none; the workshop's later shelf entries (Marquet ladder, voice selector) are map candidates in order of the console's evidence |
| `v1.0.0` exit, teammate-ready (a stranger declares one intent) | none | **the map's candidate since 2026-09-06 had its precondition met when WO-115 closed the parity contract and no order was filed** |
| Console rung's remaining exits (replay scrubber, mechanics inspector, glyphs, transmog, drag-equip) | none queued; the framework decision is R3, after WO-112 and WO-083 | deliberately after R3; recorded, not filed |
| Horizon 3 and post-1.0 | none | the roadmap places them after `v1.0.0`; the operator's message 6 says critical features are still unconsidered, and message 7 says direction comes after the queue drains |

Decision: four delivery orders. WO-180 (the baseline witness episode on
the sealed base snapshot, typed rows the verifier compares, non-reproduction
as a typed stop), WO-181 (the independent review episode under the finding
contract, `blocking` to bounded repair, the rest to the body), WO-182 (the
fourteen-item conjunction as rows in the target pull request body, with a
flag the loop's runs use to refuse an unready publication) and WO-183 (the
intent command and the stranger test, placed after WO-118 as the exit's
shape, with no priority: the operator puts `v1.0.0` months away). WO-123
gains the three primitives as hard dependencies and its objective names
them, since it composes them and WO-112 runs the composition. The
early-access posture is written into product 06 §v1.0.0 in place: the
ladder below `v1.0.0` is early access, planning drains the queue with a
delivery lane in every pair, and product work beyond the promised steps
waits for the operator's direction. What this pass did not do: invent
product features the operator has not named (message 6 says they are
unconsidered, and inventing them would be the drift theme 13 records).

## 8. The register

Read: the first page (8 rows), the rows `--touching` the four surfaces
WO-176 changes (4), the rows shown for items 1 to 3 (5) and the rows the
subject map names (40, of which 22 are already settled, allocated or
declined and 18 pending). The register export was scanned by keyword;
only rows opened were judged. Dispositions (`--apply`, one batch):

| Rows | Disposition |
| --- | --- |
| FUP-3c34a8ffbf61376f (WO-159 closed with its live row); FUP-f219d99187db98b7 (the versioned-source branch complete); FUP-0349c7a91fe63917 (WO-166 shipped the candidate's ask); FUP-bf614feaea90cac3 (product 07 step 1 edited) | settled, each with its reopening observation |
| FUP-f3281eb085ad87a7 | duplicate of FUP-3c34a8ffbf61376f, again |
| FUP-5d191eb1b77b3431; FUP-b053a956adb84b6a (tested, condition not met); FUP-4475529d727a4d25, FUP-8cfd3ff52146a016, FUP-e2cf2122a642d1e0 (textual matches on WO-176's files); FUP-3a0c4ea52f8d6d08 (no withdrawn order exists); FUP-0053; FUP-165f9860f8f32a67 (before WO-118); FUP-a6cf30a8b7bc4a83; FUP-3682b768d1d00a3b (WO-178 is the first admission; R2 for the rest); FUP-cd1a227413938345 (the roadmap half done); the five new map candidates | deferred, each with its reopening condition |
| FUP-b7a66e7a4fa7ad20 (WO-086 D024 hardening: a textual match); FUP-5474f89208c6bb9f (WO-066 D012: not these orders' files) | open, unchanged |
| FUP-ecf9d3b703a0b7d9 → WO-176, WO-178; FUP-1f47fd50acc97814, FUP-3bb4dea9dde2a392, FUP-6332681e9500a84b, FUP-a815e8862796c2e1, FUP-5f58198706dfa59e, FUP-9a23fe23cbf08958 → WO-179; FUP-84ea5fb168c317cf, FUP-0c76cd39223a576b, FUP-f287a595299249ff, FUP-71fc2efc208f597a, FUP-01e80ba5ce62c72a, FUP-d90c46abf5658272 → WO-178; FUP-24aca90d1fcbc821, FUP-f60f7a8727ee2a82 → WO-123 (catalog carry-ins: the review loop's two reproduced outcome defects) | allocated |

Three declined rows (FUP-a815e8862796c2e1, FUP-5f58198706dfa59e,
FUP-9a23fe23cbf08958) return as allocated because the map records their
recurrence conditions as met and this pass met one of them again
(WO-087 D009). One batch of 39 requests (the 38 rows above and the
stranger-test candidate FUP-0073, allocated to WO-183) applied under
revision `06bd8397…`; the register's revision after it is `56ca7968…`,
recorded in the planning check.

## 9. The orders

| Order | What it lands | Class | Re-mint |
| --- | --- | --- | --- |
| WO-176 Release close finishes on the handoff (new) | lane-disposable nested repositories; `worktree material`; `material` rows in the lifecycle event; the close consumes, blocks with the one command, writes `release-close.json` | patch | deterministic (`paths.mjs`); no live episode |
| WO-177 Spawned agents run the pinned models (new) | six defaults and their fixtures; the `spawn_agent` record; two documents in place | patch | none |
| WO-178 The record holds what the operator sees (new) | `PermissionDenied` and intervention rows; the Stop advisory's running monitors; the hook's admission of the exact publish helper; five counts and the `Track:` split; the operator-words check | patch | deterministic (`harness-host.ts`); no live episode |
| WO-179 Role text carries the confirmed corrections (new) | fourteen sentences traced to themes; the verifier consumes the executor's gate row; two briefing lines; the claim check at `verification-result`; product 07 §Discipline; cold-start acceptances | patch | deterministic (`contributor.ts`); no live episode |
| WO-180 Baseline witness before any change (new, delivery) | a `baseline` episode on the sealed base, `subject: baseline` rows, `BaselineWitnessed`, the verifier's comparison rule; two live rows | minor | deterministic (`verification-protocol.ts`) |
| WO-181 Independent review episode (new, delivery) | a blinded read-only `review` episode, `review` findings in three severities under the finding contract, `ReviewCompleted`, routes to repair and to the body; two live rows | minor | deterministic (`verification-protocol.ts`) |
| WO-182 Deliverable-ready conjunction (new, delivery) | fourteen typed rows from the episode store, the body's section, `--require-deliverable-ready` | minor | none |
| WO-183 Intent declaration and the stranger test (new, delivery) | `dotln intent` and its loopback form, `IntentDeclared`, the receipt, one witnessed run by a non-author or the substitute run | minor | deterministic (`dotln.ts`) |

Eight queued orders' live-episode sentences edited (§5); WO-123 gains
three hard dependencies and names the three steps it composes (§7). Each
new order carries a `Cost:` line naming additions and removals, a dated observed
gap at `b51a58a8`, acceptance criteria whose last names both gates,
non-goals and operator-review assumptions. `followups --touching` was
run on WO-176's surfaces (§8).

## 10. The sequence

Four pairs enter from the third slot and one entry after WO-118; 40
entries queued. Every pair from the third slot has a delivery lane and a
machinery lane (operator direction, 2026-09-16); the run from WO-061
keeps its reading order (WO-061, WO-124, WO-062, WO-123) and WO-061
gains a second lane.

| Slot | Pair | Why here |
| --- | --- | --- |
| head (unchanged) | WO-058; WO-174 | the critical path and REVIEW-004's gate finding |
| second (unchanged) | WO-059; WO-175 | |
| third | WO-180; WO-176 | the vertical's first missing step and the operator's item 1; disjoint files (the skeleton's verification protocol vs worktree, release and reconciliation); WO-180 after WO-058 (shared protocol file) |
| fourth | WO-181; WO-178 | the review episode and the record; disjoint (verification protocol vs hooks, `plan failures`, `docs-check`, the index); WO-181 after WO-180; WO-178 after WO-175 (`scripts/refute-plan.mjs`) |
| fifth | WO-182; WO-177 | the conjunction and the pinned models; disjoint (`github-body.mjs`, `target-publish.mjs` vs entropy defaults and probes); WO-182 after WO-181; WO-177 after WO-175 (`scripts/lib/entropy-review.mjs`) |
| sixth | WO-061; WO-179 | the run's head and the role text; disjoint (the compiler vs `contributor.ts`, `resume.mjs`, product 07) |
| the serial run | WO-124, WO-062, WO-123, WO-112, … WO-118 | unchanged; WO-123 now depends on WO-180 to WO-182 |
| after WO-118 | WO-183 | the `v1.0.0` exit's shape, months away by the operator's estimate |

No blocking edge inside a pair; the typed edges are WO-180→WO-058,
WO-181→WO-180 and WO-058, WO-182→WO-181, WO-177→WO-175, WO-178→WO-175,
WO-123→WO-180, WO-181, WO-182, WO-183→WO-118 (`hard`), and the
closed-order edges. The operator may move the head pairs or the run's
head above the new pairs at review.

## 11. Declined alternatives — the NoOp register of this pass

Each is a `NoOpIntent`: what happens if nothing changes, why the choice
wins, what reopens it.

- **Item 1, do nothing.** The next close that meets a scratch repository
  outside the intake lane stops, and the session decides alone again or
  waits for the operator; the executor's knowledge stays in its session.
  Action wins: the declaration is an interface the close consumes
  (platform lens) and the lane rule removes the common case. Reopen: none.
- **Item 1, refuse `implementation-ready` on an undeclared repository.**
  Declined: a gate step at handoff for a state observed once; WO-130's
  boundary keeps completion advisory. Reopen: two closes after WO-176
  block on undeclared repositories.
- **Item 1, let the session move the material.** Declined: material of
  unknown provenance is the operator's decision (fail-conservative); the
  declaration makes the case rare and the flag makes the operator's word a
  command, not a terminal move. Reopen: none.
- **Item 1, a committed close event.** Declined: the close pushes nothing
  to main, so the event would ride the next pull request; the retained
  record and its local count serve the pass. Reopen: a pass needs a close
  outcome a pull request carries (the register row keeps it).
- **Item 3, do nothing.** Every Claude auto-mode close pays a classifier
  verdict on a command the lifecycle already authorized, and a denial
  leaves no record. Action wins. Reopen: none.
- **Item 3, a project allow rule.** Declined: the helper begins with the
  absolute node path, a wildcarded interpreter that auto mode suspends,
  and a rule admits a family (WO-066 D012). Reopen: the host documents
  narrow interpreter rules as honored in auto mode.
- **Item 3, `autoMode` prose in the operator's settings.** Not the
  repository's to write; recorded as map candidate 1 for the operator.
  Reopen: the first auto-mode close after WO-178 records a denial.
- **Item 3, retry the denied command unchanged.** Declined: the
  documentation says repeated blocks pause auto mode; the route is the
  operator's retry or the hook's admission. Reopen: none.
- **Item 2, edit only product 07 and leave the eight orders.** Declined:
  an executor reading `gpt-6-sol` in its order and the rule elsewhere
  must choose, and a verifier may hold the difference; the edit costs the
  refuter eight more orders in scope, accepted. Reopen: none.
- **Item 2, change the compiled defaults in this pass.** A planning pass
  writes no code; WO-177. Reopen: none.
- **Item 2, pin a per-agent effort for Claude.** The host exposes none;
  map candidate 2. Reopen: the host exposes it.
- **Item 4, allocate every theme's next step.** Declined: six themes
  record no episode since their fix and say none needed; the map's own
  condition (confirm with the operator) is met by the direction, and each
  WO-179 sentence names its episodes so a strike is precise. Reopen: a
  theme marked none needed recurs.
- **Item 4, one order per theme.** Declined: twelve of the next steps are
  one sentence each in one file; one order with a row per sentence is the
  legible shape. Reopen: WO-179's verifier finds a sentence it cannot
  judge without the others.
- **Item 4, a model classifier in the prompt hook.** Declined for cost and
  latency on every prompt; the rows carry a digest and a prefix class,
  and the classifier is map candidate 3. Reopen: two passes report more
  than half the rows unclassified.
- **Item 4, an intervention instrument that reads host transcripts at
  planning entry.** Declined: WO-172 D013 kept the commands on the public
  record; transcripts are local, pruned and hold the operator's words.
  Reopen: the operator asks for it.
- **Theme 1, the structural cut now.** Deferred until WO-174 explains the
  repeats and WO-179 removes the verifier's procedural rerun (map
  candidate 4). Reopen: an order still records more than four runs after
  both close.
- **Theme 13, a `Track:` line on every queued order now.** Declined: it
  would put 32 orders in the refutation scope for a header; the reader
  treats a missing line as unknown and the next pass adds lines in its own
  revision. Reopen: two passes print a split with more unknowns than known.
- **Theme 22, the refuter deadline.** Deferred (map candidate 5): one
  pass needed an acceptance, the last did not. Reopen: a second pass does.
- **The WO-066 loop defects as their own order.** Declined: both are
  behavioral repairs in the loop WO-123 composes and WO-112 runs; carry-ins
  on WO-123's catalog row, as the 2026-09-25 pass did for WO-066's own
  carry-ins. Reopen: WO-123 closes without them.
- **Message 5, answer "yes, the queue is complete."** Declined: the
  check found three promised vertical steps and the `v1.0.0` exit without
  an order; saying otherwise would have been the unsupported claim theme 4
  records. Reopen: none.
- **Message 5, fold the three steps into WO-123 or WO-112.** Declined:
  WO-123 itself says a step the composition lacks is its own order; each
  step is one seam (an episode kind, an episode kind, a checklist) with
  its own live rows or fixtures. Reopen: WO-123's executor finds one step
  inseparable from the composition.
- **Message 5, invent the unconsidered product features.** Declined: the
  operator says they are unconsidered and that direction comes after the
  queue drains; a planner naming them would be theme 13's drift. Reopen:
  the operator opens the post-queue direction.
- **Message 6, leave the `v1.0.0` exit as a candidate.** Declined: its
  precondition closed 24 days ago and an exit with no order is what the
  candidate itself calls the gap; filing it after WO-118 gives it a shape
  and no priority. Reopen: the operator re-cuts the exit.
- **Keep the four machinery orders in two pairs of their own.** Declined:
  the lane rule wants a delivery lane per pair and the operator's message
  5 names the drift; re-cutting keeps the run's reading order and gives
  WO-061 a second lane. Reopen: a pair's two lanes collide on a file at
  integration.
- **Deleting anything.** Every removal in these orders preserves bytes in
  a record or the register. Reopen: never.

## 12. Goal alignment

Mission and critical path: WO-180, WO-181 and WO-182 are on the
source-to-deliverable critical path (WO-123 composes them and WO-112 runs
the composition; the roadmap's vertical exit names each step) and WO-183
is the `v1.0.0` exit's shape after the path's end. The four machinery
orders are off the path; each removes a recurring cost the operator or a
role pays on every order: a close that stops, a denied publish nobody
retries, a verifier's gate rerun, the corrections the operator gives
again, and the pass's own hand counts. The Contributor's purpose is to
move recurring supervision and recovery into machinery, and the
operator's messages name both the supervision they still do and the
drift toward machinery they saw; every pair from the third slot now
carries one delivery lane. The head pairs keep the head.

Traps: policy resistance (the lane rule and the declaration pull the
same way; the hook's admission adds no refusal for a refusal to undo);
commons (WO-179 removes gate minutes; WO-178's rows are digests; the
refuter pays eight more orders once); drift (the counts make the
baseline visible instead of normalizing it); escalation (one admission,
no new gate step, no new prompt); success to the successful (the hook
route was preferred to the host's own configuration because the host
does not read it from the repository, not because the hook exists);
shifting the burden (every route names the operator's word as a flag or
a retry, never a terminal move or a hand step); rule beating (the
admission is byte-exact and fact-gated; a denial is journaled whether or
not the agent reports it; sentence (14) forbids the rewind); wrong goal
(operator flow, stated by the operator four times in one dispatch).
Naive Interventionism: the kept functions are preservation of unknown
material, the refusals, and the claim check; the consumers are the six
roles; the second-order risk is an admission the host does not honor,
recorded at the first live close; everything is reversible in one file
each. NoOp is §10.

## 13. Evidence and cost of this pass

Read-only inspection of `main` at `b51a58a8`: product 07's planning,
ideation, goal-alignment, closeout, resume-phrase and model sections;
the sequence; the REVIEW-004 planning document and the 2026-09-25 and
2026-09-28 documents' cited sections; the subject map and WO-172 D008,
D010, D013, D014, D018, D053, D059; the WO-117 witness, VER-001 and
retained lane; the WO-086 handoff, README and order log; the WO-066
order log and retained close record; `paths.mjs`,
`intake-reconciliation.mjs`, `worktree.mjs`, `release.mjs`,
`resume.mjs`, `lifecycle-evidence.mjs`, `harness.mjs`, `dependencies.mjs`,
`entropy-review.mjs`, the three probes, `worker-transport.ts`,
`plan-refutation-protocol.ts`, `harness-host.ts` (the decision paths),
`contributor.ts` (the sentences named), `evidence-sources.mjs`,
`feedback-audit.ts`, `test-runner.mjs` (the reuse and source tables);
`.claude/settings.json`; the gate index; the session journals named; the
register rows named in §7; AI-HARNESS-SECURITY §Current mode choices and
§Harness version, model and effort readback; product 00 §Mission and
§Three horizons, product 06 §Release boundary, the pending rungs and
§v1.0.0, product 03 §VerificationAdapter and §DeliveryAdapter, product
12's journey headings, the critical path's destination, gates, lanes,
replan points and deferred work, the map's candidates on the stranger
test and the authoring journey, the 30 queued orders' headings and gap
dates, WO-112's and WO-118's objectives, WO-064's decisions on the body;
four Claude Code documentation pages.

Commands: `npm run plan -- start`, `failures` (three windows),
`followups` (page, `--export`, `--touching`, sixteen `--show`, one
`--apply`); `npm run resume --silent -- status --json`; `npm run
release -- list`; `npm run meta`, `npm run meta -- --plan-cost`; `npm run
work-orders -- index`; `node scripts/lineage.mjs index`; `npm run plan --
check`; `npm run test:docs`; Git reads only.

Written outside the repository: the ignored intake capture (eight
messages), the register export and a copy of product 07 in the session
scratch, the refuter's result and statement files.

Fan-out: one background refuter of twenty (§15). Wall-clock and tokens
of this pass: the handoff usage is in the response; counters of the
subagent are in its receipt.

## 14. Reversal conditions for this plan

- A close after WO-176 blocks on material its executor declared, or a
  lane-disposable repository turns out to hold work: the lane rule
  narrows to `.runtime/` and the declaration becomes the only route.
- The first Claude auto-mode close after WO-178 records a denial of the
  admitted command: the hook route is not honored; map candidate 1 (the
  operator's environment entry) becomes the route and the role sentence
  carries the close.
- `max` is refused for `gpt-6.1-sol` on the operator's host: WO-177
  records the accepted selector and the direction is re-asked.
- A verifier misses a defect the executor's gate row would not have
  shown and the rerun would have: sentence (18) reverts to the
  procedural rerun for that class.
- WO-179's cold-start acceptances exceed one 4 KB step for a role: the
  sentences are split across the role that needs each, not trimmed.
- The operator strikes a sentence at review: its theme's row returns to
  deferred with the operator's words as the reason.
- Two passes report more than half the intervention rows unclassified:
  map candidate 3 is allocated.
- WO-058's executor finds the matrix cannot carry a `subject: baseline`
  row without a compiler change: WO-180's hard edge on WO-058 becomes a
  shared surface and WO-180 waits for it as written, or the label moves
  to the event alone.
- The operator brings the post-queue direction before the third pair
  activates: the delivery lanes are re-cut to that direction and the
  machinery lanes keep their places.
- WO-123's executor finds one of the three steps inseparable from the
  composition: that order is withdrawn as superseded by WO-123 with the
  operator's words captured.

## 15. Independent review

Pending at drafting: the receipt is filed after the subject commit and
this section then records its verdict, scope, wall-clock and known
issues.
