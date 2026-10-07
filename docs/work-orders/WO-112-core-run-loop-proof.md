# WO-112 — The loop from core: one scratch issue travels from SourceBundle to a verified pull request with the post-PR loop against a scratch target, run from this launchpad and measured item by item against the predecessor's loop (v0.68.0)

**Model:** the actual local harnesses for every episode, executor-run with
host-observed receipts; launch claims recorded per episode
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. Amended 2026-10-05 (WO-112-D012). The
first end-to-end run of WO-123's composition and its evidence record. The
operator's scope expansion repairs VER-001 F1 in the composition itself and
fixes the adjacent hazards met (D012–D015), so code ships with new
configuration (`intake: "model"`, `awaitChecks`).
**Cost:** adds one witnessed live run of the composition against a
scratch target (the actual harnesses' episodes, a branch, a push and a
pull request under an operator grant, and the post-pull-request loop) and
`docs/evidence/WO-112/README.md` with the sanitized receipts, the
measures and the parity scores; at most 300 bytes in product 06 and 200
in product 12; a README sentence folded into its release block; one
appended capability-table section. Removes the absence of any
end-to-end run: no record holds one today. It unblocks WO-118 (gate V of
the critical path). Re-mints: authority, artifact-identity, verification and
feedback evidence for the amended code. Wall-clock, tokens and context bytes
are unknown until run.
**Nomination provenance:** the 2026-09-08 critical-path planning pass (gate
H's proof), re-cut at the operator's same-day direction that no
target-application work order lives in this repository: the core proof runs
against a scratch target, and the operator's Angular work is planned in
their fork of the starter. The operator's description of the predecessor's
loop is the parity checklist, generalized under the Clean Room floor.
Planner-synthesized draft; captures and hashes in the ledger section of that
date. Opaque identifier, not a priority. Clean-room screen: the target and
issue are scratch artifacts in a personal public repository. Register row
FUP-0049 allocates this order the critical-path candidate that proves the
vertical from core (2026-09-19). Amended by the 2026-09-28 planning pass,
which re-observed the order on `main` at `5f3849ec`: the command is
WO-123's and this order ships the run's evidence; the third replan
checkpoint follows WO-083, as the critical path defines it; the parity
items, the labeled claims and the vocabulary check are declared sets; the
operator's steps have a fallback; the outside-root carry-in is written
in; the final criterion names both gates
([planning document](../planning/failures-across-phases-2026-09-28.md)
§10).
**Depends on:** WO-123 merged (the composition this run executes); WO-053
merged (the live primitive; closed, v0.29.3); WO-056 merged (live
verification and repair; closed, v0.33.2); WO-045, WO-046, WO-047 and
WO-048 merged (the codecs are mandatory before the loop runs against
anything the operator keeps; closed, v0.20.0, v0.21.0, v0.22.0 and
v0.21.1).
**Recommended placement:** in the serial run after WO-123 and before
WO-074. As amended by D012/D022, this order ships the implementation and
evidence below, plus its product and release write-backs. WO-123
edits `packages/skeleton/src/`, `packages/beacons/src/`,
`scripts/lib/config.mjs` and products 07 and 03; WO-074 adds the
launchpad export script and writes product 03, `docs/LEGAL.md` and
`docs/README.md`. These surfaces overlap this order's amended implementation
and product write-back. The third replan
checkpoint follows WO-083, not this order. A recommendation, not a
dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-123",
    "relation": "hard",
    "reason": "the composition this run executes"
  },
  {
    "workOrderId": "WO-053",
    "relation": "hard",
    "reason": "the live source-change primitive"
  },
  {
    "workOrderId": "WO-056",
    "relation": "hard",
    "reason": "independent verification and repair, live"
  },
  {
    "workOrderId": "WO-045",
    "relation": "hard",
    "reason": "the codecs are mandatory before the loop runs against anything the operator keeps"
  },
  {
    "workOrderId": "WO-046",
    "relation": "hard",
    "reason": "a persisted continuation of an unsupported kind must fail at decode"
  },
  {
    "workOrderId": "WO-047",
    "relation": "hard",
    "reason": "the second state shape replays through an explicit projector"
  },
  {
    "workOrderId": "WO-048",
    "relation": "hard",
    "reason": "host recovery refuses malformed state before dispatch"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 00-vision.md §The one-paragraph story;
06-roadmap.md §Application version pending — Source-to-deliverable vertical
(the rung's exit sentence; the measures are this order's own);
12-workstream-application.md §Replacing a successful but costly workflow
(the replacement table); `docs/planning/critical-path-2026-09-08.md`
§The destination in the operator's terms (the parity sentence) and §Stop
and replan points (the third checkpoint); 07-execution-guide.md
§Discipline (outside-project writes and their root grants; the release
opt-out) and §Operator recovery controls (`withdraw`);
`docs/work-orders/WO-060-source-bundle-contract.md` (the screen);
`docs/work-orders/WO-066-review-comment-resolution-loop.md` (the terminal
state; no merge); `docs/planning/capability-table.md` (appended dated
sections); `scripts/check-registrations.mjs` (JSONL under `docs/`);
register row FUP-0049; the
[2026-09-28 planning document](../planning/failures-across-phases-2026-09-28.md)
§10.1; every order named in Depends on.

**Objective:** Run WO-123's composition once, witnessed, against a scratch
target repository that carries a small web page and a scratch issue: SourceBundle (WO-062) → StoryContract (WO-061,
with a labeled inference episode) → an implementation order whose
surfaces WO-124 derives → the source-change
episode in the governed worktree (WO-052) with the focused tests → browser
witnesses (WO-059) → verification and repair (WO-054, WO-055) →
conventional commits and the pull request (WO-063, WO-064) → the post-PR
loop (WO-065, WO-066) until a terminal state; measure main-thread context,
model input and output, sessions, human touch time, cycle time, retries,
cost, evidence coverage, findings and operator interventions; score the
parity checklist item by item.

**Observed gap (dated 2026-09-28, `main` at `5f3849ec`; first observed
2026-09-08 at `33e2c25`):**

- DotLn has no end-to-end run: `docs/evidence/WO-112/` does not exist and
  no command composes the loop (WO-123 is open). Segments are
  live-evidenced since the order was filed: the first external source
  change (WO-053), live verification and repair (WO-056), a pull request
  opened on a scratch remote by `worktree publish --target` in an
  operator-run smoke with a deterministic writer double (WO-064), and two
  unattended scratch windows (WO-111).
- The predecessor is not in this repository (00 §The one-paragraph
  story); its loop is known here as the critical path's parity sentence,
  one sentence naming eight items, not an enumerated list. The roadmap
  rung holds one exit sentence and no measures, so the measures are
  defined only in this order.
- The critical path places the third replan checkpoint after WO-112 and
  the fork's first run, WO-083; WO-083 depends on WO-118, which depends
  on this order.
- This repository ships no `dotln.config.json`, where a registered target
  is declared. The default roles grant outside-project writes only under
  the temporary, session-scratch and host-scratchpad roots, and order
  contracts do not supply active grants (07 §Discipline; the WO-144
  carry-in on this order's planning map row).
- The operator's sessions run without a host sandbox (07 §Discipline).

**Design (scope discipline):**

- The run adds nothing; a step the composition lacks is a WO-123 defect
  filed as its own order. Amended 2026-10-05 by the operator's scope
  expansion (WO-112-D012): this order adds the composition's run-time intake
  and triage episodes, the bounded wait for declared review checks,
  acknowledgement of review bodies and the Codex writer's launch repair
  (D017, superseding D014), with the adjacent fixes of D015 and the review
  fixes of D022: host integrity checks for every writer and product 03's
  writer sentences.
- The representative scenario must reach its terminal state with every
  automated review item resolved; a separate control scenario in the same
  run carries one incorrect suggestion that must be rejected with evidence,
  so `NeedsHuman` is proven legitimate rather than allowed to pass.
- The terminal state is the pull request with every automated item
  observed `resolved` (WO-065, WO-066), or a typed stop. DotLn merges
  nothing (WO-066's non-goal), so the merge or close that follows is the
  operator's and no step of the run; WO-118 uses the same definition.
- Unmeasured values are `unknown`, never estimated.
- The scratch target's checkout and every directory the run writes
  outside this repository are named in the receipt. Unless one lies under
  a root the default roles grant, the executing role or an equipped
  support carries an operator-named root grant with its provenance,
  admitted through the compiled envelope; order contracts do not supply
  active grants (WO-144 carry-in, planning map catalog row).
- The run supplies the scratch repository's forge host as the allowlist
  of WO-060's screen at decode time; a refused item is a typed stop that
  names the item, recorded in the receipt.
- A receipt committed as JSONL under `docs/` round-trips as an
  EventEnvelope stream or is declared in this order's evidence
  declaration.
- The third replan checkpoint follows WO-083, as the critical path
  defines it; this order's receipt is one of its inputs.
- **Declined alternatives, recorded:** running against the operator's
  Angular repository from this launchpad (that work is the fork's, by the
  operator's direction; core records only the sibling receipt through
  WO-083); answering the third replan checkpoint at this order's close
  (the critical path places it after WO-083, which waits for WO-118 and
  so for this order; reopen when the critical path moves the checkpoint).

**Deliverables:** `docs/evidence/WO-112/README.md`
with sanitized receipts, the measures and the checklist; the write-backs
below; and, under D012–D015, the run-time judgment episodes
(`packages/skeleton/src/vertical-judgment-*.ts`, `scripts/lib/vertical-*.mjs`,
`scripts/lib/review-comment-loop.mjs`), the Codex writer launch change, and,
under D022, the source-change host's integrity checks and product 03's
writer sentences, with their tests.

**Acceptance criteria (all required)**

1. The pull request exists on the scratch repository with a generated
   title and body; every acceptance criterion of the StoryContract carries
   evidence, visual ones with screenshot witnesses; findings, if any, were
   resolved through repair; in the representative scenario every
   automated review comment is observed `resolved` and none is
   `NeedsHuman`; in the control scenario the incorrect suggestion is
   rejected with recorded evidence; the run ends in the terminal state the
   Design defines and merges nothing. The executor prepares and runs the
   authorized scratch setup, issue, automated reviewer, planted suggestion,
   target registration and admitted root and remote grants. If the run
   stops or has not happened by handoff, the executor records this criterion
   unmet with the exact result and runnable reproduction entry; the other
   criteria are judged. The criterion closes by an observed successful run
   or by a recorded waiver. No operator-terminal participation or personal
   witness attestation is required (WO-112-D007, operator delegation).
2. No DotLn file, path or vocabulary is in the target's branch or pull
   request, as far as the outward-artifact lint's configured vocabulary
   and a tree grep for the terms and path prefixes the receipt lists can
   show; both are recorded in the receipt. The criterion is judged against
   the declared set; a case outside it is a follow-up, not a failure.
3. The measures are recorded with methods; each item of the critical
   path's parity sentence (the linked source, here one scratch issue;
   intake and understanding of the requirements; the branch; the change;
   conventional commits; a generated pull-request title and body; every
   automated review comment resolved; no operator tending of a harness) is
   scored observed-met, observed-unmet or unknown with its evidence
   reference, and the parity claim passes only if every item is
   observed-met.
4. Every measure and every parity score in the receipt is labeled
   `observed`, `launch-claim` or `unknown`.
5. Write-backs land, each in place with no dated paragraph: 06
   §Application version pending — Source-to-deliverable vertical (the
   rung's status; at most 300 bytes added, against 1,802 bytes of
   headroom on 2026-09-28); 12 §Replacing a successful but costly
   workflow (the evidence for the rows the run observed; at most 200
   bytes added, against 360 bytes of headroom on 2026-09-28); `README.md`
   §What runs today, folded into the release block's prose, which is
   rewritten, never appended to; the capability table, an appended
   `## WO-112 dated addition (YYYY-MM-DD)` section with a
   `vertical.source-to-pr` row, never a row edited in place; the decisions
   file; the publication locks refreshed. Product 06 is also written by
   WO-086, WO-087, WO-066, WO-061, WO-124, WO-096 and WO-095, and product
   12 by WO-061, WO-118, WO-080 and WO-082: the executor re-measures the
   headroom at its base; where the bound does not fit, it consolidates the
   section it edits in the same change; a ceiling is raised only by a
   planning-document decision.
6. `npm test -- --review` and `npm run test:docs` green;
   `git diff --check` clean; no new dependency beyond the ones the earlier
   orders pinned.

**Evidence gate:** the receipts, the lint output and the tree grep, the
measures and the parity scores; `npm run test:docs`;
`npm test -- --review` before `implementation-ready`, because
`docs/evidence/WO-112/` lies under `docs/`, a declared source of
registrations, and again at final review. The live row: the run against
the scratch target, with executor-filed host-observed receipts (criterion 1).

**Write-back duty:** as listed in criterion 5.

**Non-goals:** any target-application repository of the operator's (planned
in the fork); cross-repository workstreams (WO-080 onward); the console
framework decision; any runtime fix beyond the scope expansions D012, D015,
D017 and D022–D025 record (a separate order); merging the pull
request (WO-066's non-goal); the third replan checkpoint, answered after
WO-083; Context Continuity, register row FUP-0091, which the planning map
notes reopens at this order's activation, for the activating pass to
dispose.

**Operator-review assumptions**

1. The executor runs the authorized scratch workflow and files its actual
   terminal and host observations. The operator required autonomous delivery
   without operating or watching the harness (WO-112-D007).
2. A run that fails records its receipt under this order's evidence and
   does not close the order; dependents wait for an observed success. A
   defect found in a primitive is nominated as its own order.
3. The run reuses the scratch repository of WO-064's smoke; the executor
   creates no remote repository. The selected personal scratch repository
   and the autonomous delivery instruction authorize its proof setup and
   GitHub effects. The executor admits those grants with their provenance,
   prepares the issue and planted review fixtures, and records an actual
   refusal if a needed capability is unavailable; it invents no account
   permission or successful effect.
4. The scratch target is registered in a launchpad configuration kept out
   of the committed tree, since this repository ships no
   `dotln.config.json`; the receipt records the registration by shape.
5. The class is minor under D012: the order ships the run-time episodes,
   bounded repairs and evidence described in Deliverables.
