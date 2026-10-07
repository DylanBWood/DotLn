# WO-118 — The resident-owned loop from a starter instance: one initial intent and standing grants carry work through derivation, dispatch, verification, repair, delivery and the pull-request loop under the durable runtime, surviving an actor's death and a resident restart, with only material decisions returned to the operator (version assigned at activation)

**Model:** the actual local harnesses as actors, launched by the instance's
resident; the operator witnesses from the operator's terminal; launch
claims recorded per episode (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Track:** delivery
**Front page:** README.md
**Release classification:** minor. The product exit's composition inside a
starter instance plus its evidence record; a defect found in a primitive is
a separate bounded order. Assigned at activation under the standing opt-out
default.
**Cost:** adds the instance export receipt and one witnessed live run from
a starter instance (the resident's actor episodes, a push and a pull
request under standing grants, an actor killed and the resident
restarted), and `docs/evidence/WO-118/README.md` with the sanitized event
log, the console transcript, the measures and the parity scores; at most
250 bytes in product 00 and 150 in product 12; a README sentence folded
into its release block; one appended capability-table section. Removes
the absence of the product exit's evidence: no record shows the runtime
carrying an intent to a pull request from a starter. It unblocks WO-083
(gate P of the critical path). Re-mints: none; the order edits no
registered or judged source. Wall-clock, tokens and context bytes are
unknown until run.
**Nomination provenance:** the external review of the revised plan
(2026-09-08, finding 1: the product proof did not require the resident or
the starter to run the loop), preserved verbatim in the ignored capture
`docs/intake/notes/2026-09-08-codex-planning-review.md`, whose hash is in
the ledger section of that date; the operator's direction that the always-on
runtime is the critical path. Planner-synthesized draft. Opaque identifier,
not a priority. Clean-room screen: the instance and target are scratch
artifacts. Amended by the 2026-09-28 planning pass, which re-observed the
order on `main` at `5f3849ec`: the terminal state is WO-112's; the third
replan checkpoint follows WO-083; the capability write-back uses the
table's own levels; the audit dependency is typed; the operator's steps
have a fallback; the outside-root carry-in is written in; the final
criterion names both gates
([planning document](../planning/failures-across-phases-2026-09-28.md)
§10).
**Depends on:** WO-199 merged (the vertical survives an interrupt and a
host crash: D060 and D065, which criterion 2 needs); WO-075 and WO-076
merged (a starter instance with the build and its overlay); WO-121 and WO-122 merged (presence with origin; the
`cli-worker` and `human-handoff` actors; closed, v0.27.0 and v0.29.0);
WO-100 merged (derivation inside a portfolio; closed, v0.44.0); WO-120
merged (derived work as durable records; closed, v0.41.0); WO-124 merged
(surfaces derived from the contract); WO-112 merged (the loop proven from
core first); WO-111 merged (the unattended hour; closed, v0.47.1); WO-066
merged (the pull-request loop with dispositions); WO-114, WO-116 and
WO-117 merged (the run is visible through the interfaces and audited;
WO-114 closed, v0.47.0); WO-123 merged (the resident admits a filed
intent under standing authorization and owns the vertical continuation).
**Recommended placement:** in the serial run after WO-078 and before
WO-113. This order adds `docs/evidence/WO-118/` and writes products 00
and 12, `README.md` and the capability table. WO-078 adds the sibling
registry and writes `docs/README.md`; WO-113 edits the work-order
tooling, older orders' notes and product 07; neither edits this order's
files. WO-112, earlier in the run, writes the same table of product 12.
The third replan checkpoint follows WO-083. A recommendation, not a
dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-199",
    "relation": "hard",
    "reason": "an actor killed and the resident restarted (criterion 2) needs the vertical's recovery through a recorded process group and an interrupt handler"
  },
  {
    "workOrderId": "WO-075",
    "relation": "hard",
    "reason": "a starter instance with the build"
  },
  {
    "workOrderId": "WO-076",
    "relation": "hard",
    "reason": "the instance's overlay"
  },
  {
    "workOrderId": "WO-121",
    "relation": "hard",
    "reason": "presence with origin"
  },
  {
    "workOrderId": "WO-122",
    "relation": "hard",
    "reason": "the cli-worker and human-handoff actors"
  },
  {
    "workOrderId": "WO-100",
    "relation": "hard",
    "reason": "derivation inside a portfolio"
  },
  {
    "workOrderId": "WO-120",
    "relation": "hard",
    "reason": "derived work as durable records"
  },
  {
    "workOrderId": "WO-124",
    "relation": "hard",
    "reason": "surfaces derived from the contract"
  },
  {
    "workOrderId": "WO-112",
    "relation": "hard",
    "reason": "the loop proven from core first"
  },
  {
    "workOrderId": "WO-111",
    "relation": "hard",
    "reason": "the unattended hour"
  },
  {
    "workOrderId": "WO-066",
    "relation": "hard",
    "reason": "the pull-request loop with dispositions"
  },
  {
    "workOrderId": "WO-114",
    "relation": "hard",
    "reason": "the run is visible in the status projection"
  },
  {
    "workOrderId": "WO-116",
    "relation": "hard",
    "reason": "the audit view that reproduces the run afterward"
  },
  {
    "workOrderId": "WO-117",
    "relation": "hard",
    "reason": "the run is visible in the live console"
  },
  {
    "workOrderId": "WO-123",
    "relation": "hard",
    "reason": "the resident admits a filed intent under standing authorization and owns the vertical continuation"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 00-vision.md §The one-paragraph story and
§What DotLn is not (the reference implementation is not finished when it
works for its author); 12-workstream-application.md §One outcome from
request to return and §Replacing a successful but costly workflow;
03-architecture.md §Platform and instance boundary and §Operator-presence
policy; `docs/planning/critical-path-2026-09-08.md` §Stop and replan
points (the third checkpoint); 07-execution-guide.md §Discipline
(outside-project writes and their root grants);
`docs/work-orders/WO-112-core-run-loop-proof.md` (the terminal state and
the parity items); `docs/work-orders/WO-060-source-bundle-contract.md`
(the screen); `docs/planning/capability-table.md` (the table's levels and
its appended dated sections); `scripts/check-registrations.mjs` (JSONL
under `docs/`); the
[2026-09-28 planning document](../planning/failures-across-phases-2026-09-28.md)
§10.1; the orders named in Depends on.

**Objective:** Export a starter instance into a scratch directory, register
a scratch target repository with a scratch issue, declare a portfolio and
the standing grants, start the instance's resident, file one intent, and
witness the runtime carry the work without further prompting: the intent
admitted by the resident under the portfolio's `intent` class and the
standing grants (WO-123); the intent interpreted into a contract (WO-061)
and surfaces (WO-124); a durable derived order (WO-120); an actor
dispatched (WO-122) into a governed
worktree (WO-052); result persisted; independent verification and one
repair (WO-054, WO-055); delivery under the grant (WO-064); the
pull-request loop through a delayed automated comment to a terminal state
(WO-065, WO-066); an actor session killed mid-episode and replaced by the
resident; the resident itself restarted mid-loop and resuming under the
same identities; every phase handoff performed by the runtime; the whole
run visible in the live console (WO-117) and audited (WO-116); one
deliberately ambiguous control intent returning `NeedsHuman` with its
reason, and nothing else returning to the operator.

**Observed gap (dated 2026-09-28, `main` at `5f3849ec`; first observed
2026-09-08 at `33e2c25`):**

- No starter instance can be exported yet: WO-074 to WO-078 are open, and
  the README lists portable starter export as later work. No end-to-end
  run exists from core either (WO-123 and WO-112 are open).
- The resident has run live scratch portfolio windows (WO-111), and the
  console serves status, commands and invocation (WO-114, WO-115); the
  audit view and the live console are open (WO-116, WO-117).
- The present WO-083 has the fork's resident drive the order with its own
  actors and depends on this order; the critical path places the third
  replan checkpoint after WO-083.
- The capability table rates a row by level and evidence
  (fixture-evidenced, live-evidenced); no document defines an
  instance-evidenced level. `runtime.resident` has five assessments, and
  an addition or a reassessment is an appended dated section.
- Product 00 §The one-paragraph story holds no status sentence. Ceilings
  are planning's since the 2026-10-07 pass; no byte figure binds this order.
- The export directory and the scratch target lie outside this
  repository. The default roles grant outside-project writes only under
  the temporary, session-scratch and host-scratchpad roots, and order
  contracts do not supply active grants (07 §Discipline; the WO-144
  carry-in on this order's planning map row).

**Design (scope discipline):**

- Nothing new is built here; the order composes and witnesses. If the
  instance needs a command core lacks, that command is a core order filed
  before this one runs again.
- The two control scenarios (the ambiguous intent; a review comment that
  is wrong and must be rejected with evidence) are part of the same run so
  that escalation is proven legitimate rather than assumed.
- The terminal state is WO-112's: the pull request with every automated
  item observed `resolved`, or a typed stop. DotLn merges nothing
  (WO-066's non-goal); the merge or close that follows is the operator's
  and no step of the run.
- The export directory, the scratch target's checkout and every other
  directory the run writes outside this repository are named in the
  receipt. Unless one lies under a root the default roles grant, the role
  or support that writes it carries an operator-named root grant with its
  provenance, admitted through the compiled envelope; order contracts do
  not supply active grants (WO-144 carry-in, planning map catalog row).
- The instance supplies the scratch repository's forge host as the
  allowlist of WO-060's screen at decode time; a refused item is a typed
  stop that names the item, recorded in the receipt.
- The sanitized event log, if committed as JSONL under `docs/`,
  round-trips as an EventEnvelope stream or is declared in this order's
  evidence declaration.
- The third replan checkpoint follows WO-083, as the critical path
  defines it; this order's receipt is one of its inputs.
- **Declined alternatives, recorded:** a staged manual demonstration as the
  exit (evidence, never the replacement claim); the operator's real target
  (that is the fork's run, WO-083); answering the third replan checkpoint
  at this order's close (WO-083 depends on this order; reopen when the
  critical path moves the checkpoint).

**Execution plan (the executor follows these steps in order; observed at `bd437eb2`, 2026-10-07):**

1. Gate: `node scripts/harness.mjs bounded -- node docs/evidence/WO-112/final-001-vertical-recovery-probe.mjs`
   at the base; every case must recover (WO-199 merged). If `crash-vertical` still throws,
   stop and record the order blocked on WO-199.
2. Export (WO-074 and WO-075 merged): `npm run launchpad -- export <dir>` with `<dir>` under
   `node -e 'console.log(require("os").tmpdir())'`, the system-temp root every role holds
   (`contributor.ts` lines 226 to 229); inside it `node scripts/harness.mjs emit` then
   `node scripts/harness.mjs check`. Write `docs/evidence/WO-118/export-receipt.json`
   (paths as shapes). The kit must carry `packages/skeleton/dist/src/dotln.js`,
   `scripts/lib/vertical-*.mjs` and the console; if WO-075's runtime subset left one out,
   record criterion 1 unmet with the file name (the fallback the order's assumptions allow).
3. Instance configuration: `dotln.config.json` with `repositories.<id>`
   (`worktreeParent`, `baseBranch`, `authorityProfile`), `portfolios.<id>`
   (`class: "intent"`, the repository), and the grants where
   `scripts/lib/authority-grants.mjs` lines 13 to 45 read them; the resident policy from
   WO-076's overlay when it names one, else the instance's own.
4. `<store>/vertical.json` with only the keys `scripts/lib/vertical-runtime.mjs` lines 152 to
   164 read (`workers` with transport, model and effort; `awaitChecks`); each issue
   `{ number, intake: "model" }`; `<store>/resident.json` per `decodeResidentConfiguration`
   (`packages/skeleton/src/resident-state.ts` line 134). Check:
   `readVerticalConfiguration(store, root)` reports no admission failure.
5. Each intent's prose carries `https://<repositoryId>/issues/<n>` exactly
   (`vertical-runtime.mjs` lines 143 to 148).
6. The run: `dotln resident --store <store> --policy <id>`; `dotln presence away --store <store>`
   (the one setup event criterion 1 permits, recorded in `human-events.json` with purpose
   `setup`); `dotln intent "<prose>"`; for criterion 2, kill the source-change writer step
   (the longest-running one) as `kill.json` `{ step, commandId, signal, at }` records; send
   SIGTERM to the resident and relaunch it between steps. No operator terminal: the executor
   runs it (WO-112-D007's delegation applies).
7. Evidence under `docs/evidence/WO-118/`: `README.md`; `human-events.json` rows
   `{ store, eventId, type, purpose }` checked by a script against every operator-origin
   event in both logs; `measures.json` rows `{ item, score, label, method, evidence }`
   (the README renders it); `kill.json`; a copy of `<store>/runtime-status-v1.json` at each
   `IntentStepSettled` plus `dotln audit --store <store>/vertical/<key>` (criterion 4's
   phases are judged on these JSON fields, not on the console, which does not read the
   vertical's events); the outward checks (`lintOutwardArtifact`, `scripts/outward-lint.mjs`
   line 55; `docs/control/outward-vocabulary.json`); any `.jsonl` passes
   `node scripts/check-registrations.mjs`.
8. Write-backs: `docs/product/00-vision.md` §"## The one-paragraph story" (one sentence, in
   place); `docs/product/12-workstream-application.md` §"## Replacing a successful but costly
   workflow" (extend the WO-112 sentence); `README.md` release block: rewrite the paragraph
   that says the `dotln vertical` command runs unaided; `docs/planning/capability-table.md`:
   append `## WO-118 dated reassessment (<date>)` after the WO-112 section;
   `docs/evidence/WO-118/decisions.md`; `npm run meta`;
   `node scripts/lineage.mjs index --check`; `node scripts/check-publication.mjs --print-locks`;
   `npm run publication:check`.
9. Handoff sequence: `npm run format`; `npm run test:docs`; `npm test -- --review`;
   complete `docs/evidence/WO-118/handoff.md`; `npm run resume -- implementation-ready <flags>`.

**Deliverables:** the instance export receipt; `docs/evidence/WO-118/README.md`
with the sanitized event log, the console transcript, the measures and the
parity checklist; the write-backs below.

**Acceptance criteria (all required)**

1. From the filed intent to the terminal state, the control log shows
   every phase transition performed by the resident's actors; the human
   events before the terminal state are only the initial intent, the
   operator's inputs to the two control scenarios and the witness line,
   each named in the receipt; the representative scenario reaches its
   terminal state with every automated item resolved and no `NeedsHuman`.
   If the witnessed run has not happened by handoff, the executor records
   this criterion unmet with the commands the operator runs in the
   exported instance (`dotln resident --store <directory> --policy <id>`,
   then `dotln intent "<prose>"`, from the operator's terminal) and what
   the run needs from the operator (the control scenarios' inputs, the
   automated reviewer's setting on the scratch repository WO-064's smoke
   used, and the root and remote grants); the other criteria are judged;
   the criterion closes by the operator's run or by a recorded waiver.
2. The killed actor session is replaced by the resident without a second
   commit, and the resident restart resumes the loop under the same order
   and episode identities; both are events in the log.
3. The delivered pull request exists with a generated body, the delayed
   comment is dispositioned and re-observed as resolved, the incorrect
   suggestion is rejected with recorded evidence, and no DotLn file, path
   or vocabulary reached the target, as far as the outward-artifact lint's
   configured vocabulary and a tree grep for the terms and path prefixes
   the receipt lists can show. The criterion is judged against the
   declared set; a case outside it is a follow-up, not a failure.
4. The live console shows the run's actors, phases, holds and order status
   during the run and the audit view reproduces it afterward, recorded as a
   transcript.
5. Every measure and every parity score in the receipt is labeled
   `observed`, `launch-claim` or `unknown`; the measures are recorded with
   methods; the parity items of WO-112's criterion 3 are scored, and the
   replacement claim is made only if every representative item is
   observed-met.
6. Write-backs land, each in place with no dated paragraph: 00 §The
   one-paragraph story (one status sentence stating what the receipt
   observed, in place with no dated paragraph (ceilings are planning's: the 2026-10-07 pass set every product document's ceiling at measured bytes plus one tenth)); 12 §Replacing a successful but costly workflow (the
   evidence for the rows this run observed, extending the WO-112 sentence
   in place; WO-080, WO-082, WO-193 and WO-194 also write 12 after it);
   `README.md` §What runs today (one sentence inside the marked section
   WO-189 defines, named by this order's `**Front page:**` field; if WO-189
   has not landed, folded into the existing prose, never appended to); the
   capability table, an
   appended `## WO-118 dated reassessment (YYYY-MM-DD)` section rating
   `runtime.resident` and `vertical.source-to-pr` on the table's scale,
   live-evidenced from a starter instance, never a row edited in place,
   and a rating rises only from a run criterion 1 records as observed,
   never from a waived one; the decisions file; the publication locks refreshed. The executor
   re-measures the headroom at its base; where the bound does not fit, it
   consolidates the section it edits in the same change; a ceiling is
   raised only by a planning-document decision.
7. `npm test -- --review` and `npm run test:docs` green;
   `git diff --check` clean; no new dependency.

**Evidence gate:** the instance export receipt, the sanitized event log,
the console transcript, the measures and the parity scores;
`npm run test:docs`; `npm test -- --review` before
`implementation-ready`, because `docs/evidence/WO-118/` lies under
`docs/`, a declared source of registrations, and again at final review.
The live row: the run from the starter instance, which the operator
witnesses (criterion 1).

**Write-back duty:** as listed in criterion 6.

**Known issues and carry-ins:**

- The 2026-10-07 pass found this order planned as evidence-only while its
  criterion 2 needs recovery the tree lacks (D060, D065); WO-199 now
  supplies it and is a hard dependency. Stale and corrected: WO-123,
  WO-112, WO-116 and WO-117 are closed; the headroom figures; the
  WO-122 actors are not what the vertical launches (it launches writers
  through `SourceChangeHost` over `verticalTransport`), so the typed WO-122
  edge is history, not a mechanism this run exercises.
- Decided by the 2026-10-07 pass: `dotln presence away` is the one
  permitted setup event (criterion 1 reads it so); the kill targets the
  source-change writer step; criterion 4's phases are judged on the
  vertical's own receipts; a `NeedsHuman` that ends a run is a typed stop
  recorded as such, and consuming the operator's answer is a candidate
  (reopen when WO-083's run needs the answer consumed); the executor runs
  the whole run under D007's delegation. Reopen: the operator asks to
  witness.
- Blocked on WO-074 and WO-075 for the export's contents and on WO-076
  for the overlay path; step 2 records what the kit lacks.

**Non-goals:** the operator's repositories (WO-083 is the fork's run);
cross-repository workstreams; any runtime fix (a separate order); merging
the pull request (WO-066's non-goal); the third replan checkpoint,
answered after WO-083; budget-window work-order ladders, register row
FUP-0107, which the planning map notes reopens at this order's close, for
that pass to dispose.

**Operator-review assumptions**

1. A run that fails records its receipt under this order's evidence and
   does not close the order; dependents wait for an observed success.
2. The operator witnesses from the operator's terminal.
3. The operator's inputs to the two control scenarios are the ambiguous
   control intent it files, its answer to that intent's `NeedsHuman`, and
   the incorrect suggestion it plants on the pull request; the rejection
   itself is the runtime's triage (WO-066).
