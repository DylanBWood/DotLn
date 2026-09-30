# WO-066 — Review-comment resolution loop: each unresolved automated review comment or failing check derives a bounded repair, runs through a fresh worker, is pushed under the grant and re-observed, until every comment is resolved or recorded as needing a human (v0.57.0)

**Model:** any capable model; the executor runs the live episodes. State
the model and effort actually run (07-execution-guide.md §Model-specific
notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. One continuation over the observation,
repair, verification and publication primitives, extended where the loop
needs them (a review item the repair derivation admits, a push to an open
pull request's branch and a thread disposition, each under an operator
grant); one terminal event type. Assigned at activation under the standing
opt-out default.
**Cost:** adds one loop module and its operator command beside WO-065's
observer (`scripts/lib/`, `scripts/worktree.mjs`), a further push and a
thread disposition in `scripts/lib/target-publish.mjs`, one review-item
input to `deriveRepairOrder` in `packages/skeleton/src/repair.ts`, the
carry-ins below (the target-root Git reads and the push's repository
binding in `target-publish.mjs`, the focused test run's confinement in
`packages/skeleton/src/source-change-worktree.ts`, one reading of a Claude
launch's effect on user-level state), fixtures over recorded observations
and doubles, and at most 500 bytes in product 02 and 200 in product 06.
Removes the gap after a pull request exists: nothing reads, repairs or
disposes its review comments or failing checks. WO-123 and WO-118 depend
on it. Re-mints: `repair.ts` and `source-change-worktree.ts` are
registered evidence sources in every edition and sources the feedback
verifier judges, so the authority, artifact-identity, verification and
harness editions are re-minted deterministically and the executor runs
one live self-host episode for the feedback edition on Codex `gpt-6-sol`
or Claude Code `claude-opus-5-5`, at `xhigh`, with the console re-pinned
to the new feedback edition; the
loop module, the publication host and `scripts/worktree.mjs` are neither
registered nor judged (`scripts/lib/evidence-sources.mjs` and
`packages/skeleton/src/feedback-audit.ts` at `5f3849ec`). Wall-clock,
tokens and context bytes are unknown until run.
**Nomination provenance:** the 2026-09-08 critical-path planning pass (gate
H, the post-PR loop the audit omitted and the operator's parity checklist
names last), cut as a bounded order at the operator's same-day correction.
Planner-synthesized draft; captures and hashes in the ledger section of that
date. Opaque identifier, not a priority. Clean-room screen: no stop
condition. Amended by the 2026-09-28 planning pass, which re-observed the
order on `main` at `5f3849ec`: the primitive extensions the loop needs are
named with the registered sources they touch and what those owe, the four
carry-ins recorded against it are written in, a refused comment is a typed
stop, and the operator's steps have fallbacks and the final criterion
names both gates
([planning document](../planning/failures-across-phases-2026-09-28.md)
§10).
**Depends on:** WO-065 merged (the observed comments and checks); WO-055
merged (the repair derivation and round limit it reuses; closed at
`v0.31.0`); WO-054 merged (verification of each repaired head before a
push; closed at `v0.30.0`); WO-064 merged (the grant under which the push
and the disposition run; closed at `v0.43.0`).
**Recommended placement:** paired with WO-057 in the sixth slot, after
WO-087's one-entry slot. This order edits a new loop module under
`scripts/lib/`, `scripts/lib/target-publish.mjs`, `scripts/worktree.mjs`,
`packages/skeleton/src/repair.ts` and `source-change-worktree.ts`, their
fixtures, products 02 and 06, the evidence editions and the console's
pins; WO-057 edits `docs/discovery/`, ADR-0002 and `docs/LEGAL.md`.
Disjoint files; neither depends on the other; only this order re-mints.
WO-065 edits `scripts/worktree.mjs` and the target-publish fixtures before
it, WO-087 edits product 06 before it and does not run beside it, WO-061
and WO-124 amend the same sentence of 06 after it, and WO-065 and WO-058
also write product 02. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-065",
    "relation": "hard",
    "reason": "the observed comments and checks it resolves"
  },
  {
    "workOrderId": "WO-055",
    "relation": "hard",
    "reason": "the repair derivation and round limit it reuses"
  },
  {
    "workOrderId": "WO-054",
    "relation": "hard",
    "reason": "verification of each repaired head before a push"
  },
  {
    "workOrderId": "WO-064",
    "relation": "hard",
    "reason": "the grant under which the push and the disposition run"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 06-roadmap.md §Application version pending
— Source-to-deliverable vertical (comment triage); 03-architecture.md
§Ports (what keeps work-flavored verticals pluggable) (`DeliveryAdapter`:
CI failures classified before any repair dispatch, comments triaged by
type, a human-controlled terminal state); 02-domain-model.md §Actors and
episodes (the edge) (the publication events) and §Independent
verification v1 (WO-055's derivation);
`docs/work-orders/WO-055-repair-continuation.md` (the derivation);
`docs/final-reviews/WO-055/FINAL-001.md` §Non-blocking items for the next
planning pass (the `roundLimit` wording);
`docs/work-orders/WO-064-target-publish.md` (the push under the grant);
`docs/work-orders/WO-065-pull-request-state-observation.md` (the event, the
comment classes, `refused`); `packages/skeleton/src/repair.ts`
(`deriveRepairOrder`, `RepairOriginal`);
`packages/skeleton/src/source-change-worktree.ts` (`runFocusedTest`);
`packages/skeleton/src/verification-worktree.ts` (`witnessTest`) and
`packages/skeleton/src/discovery-sandbox.ts` (the confinement a host-run
test gets); `scripts/lib/target-publish.mjs` (`PUBLICATION_EFFECTS`,
`authorizePublication`, `observeTarget`, `publishTargetOrder`);
`scripts/lib/github-repository.mjs`; `docs/evidence/WO-157/decisions.md`
D005 and D038; `docs/evidence/WO-159/decisions.md` D009;
`packages/skeleton/README.md` §Feedback compiler and bounded self-hosting
(the live episode's commands); the
[2026-09-28 planning document](../planning/failures-across-phases-2026-09-28.md)
§10.1.

**Objective:** For each `automated-review` or `ci-failure` item in the
latest `PullRequestStateObserved` event: triage it against the contract and
the diff into `accept` (a repair is warranted), `reject` (the suggestion is
incorrect or stale, with evidence references) or `NeedsHuman`; for an
accepted item derive a repair with WO-055's derivation (surfaces from the
comment's path and line or from the named test a failing check maps to,
the contract unchanged, one round per item), dispatch a fresh source-change
worker, verify the repaired head through WO-054 before any push, push under
WO-064's grant, apply the authorized external disposition on the thread
(`pr.thread.resolve`, or a recorded rejection with the evidence, through
the CLI helper under the grant), and re-observe through WO-065 until the
observed state is `resolved`; `human-review` items are never
auto-dispositioned; the loop is an executable-subset continuation that
resumes after an interruption without reprompting.

**Observed gap (dated 2026-09-28, `main` at `5f3849ec`; first observed
2026-09-08 at `33e2c25`):**

- Publication ends at `PullRequestOpened`: nothing reads a pull request
  back and no reactor slice folds the event (02 §Actors and episodes).
  WO-065, queued ahead, adds the observation this loop consumes.
- WO-055's `deriveRepairOrder` takes a `VerificationFinding` and answers
  `NeedsHuman` unless the finding is blocking and each evidence reference
  resolves to a pinned adverse host witness of the same criterion and
  revision; a review comment carries none. `roundLimit` is a field of
  `RepairOriginal` with a default of two, where WO-055's Design line says a
  WorkOrder field (WO-055 FINAL-001).
- WO-064's publication admits exactly `repo.push` and `pr.open` and has
  one path: it pushes the observed commit and opens a new pull request,
  and a rerun for a recorded head pushes nothing. No path pushes a further
  head to an open pull request or disposes a thread; `pr.thread.resolve`
  occurs only in this order and the refutation receipts that copy it.
- Target publication reads each branch commit's message in the target's
  own root under the hook and fsmonitor overrides only, so a planted
  `log.showSignature` with `gpg.program` runs there, and an edited
  `remote.origin.url` is read the same way by the push-URL check and by
  `ensureGh` (WO-157 D038).
- The source-change host runs the focused test with no confinement
  (`runFocusedTest`), while the verification host runs each named test
  under macOS `sandbox-exec` with the discovery profile, which denies the
  network and writes outside its root (WO-157 D005).
- Nothing records whether a Claude worker launch changes the operator's
  user-level Claude state (WO-159 D009).

**Design (scope discipline):**

- The loop is a module beside WO-065's observer in `scripts/lib/`, invoked
  by one operator command beside WO-065's; WO-123 composes it into the
  vertical. It reads the latest `PullRequestStateObserved` in the episode
  store's `publication/` log, appends its own events there and resumes
  from that log after an interruption without reprompting. Each repair
  round runs through WO-055's `RepairHost`.
- Triage: an item of class `human-review` is never dispatched or disposed,
  and a comment WO-065 recorded as `refused` stops the loop with a typed
  stop naming the comment. For an `automated-review` or `ci-failure` item,
  accept or reject is a supplied judgment with evidence references (a
  model episode in WO-112, a labeled double here). The loop answers
  `NeedsHuman`, naming the item, for a failing check its declared
  check-to-test mapping does not name and for a class it does not know.
- An accepted item enters `deriveRepairOrder` as a blocking finding whose
  evidence is the host-recorded item (the comment's id, path and line, or
  the check's name and its mapped named test), which `repair.ts` admits in
  place of a verifier's adverse host witness; every other rule of the
  derivation holds (the original's surfaces and named tests, the grants,
  the round limit).
- Per-item round limit one, set through `RepairOriginal.roundLimit`, where
  WO-055 placed the field with a default of two; this order records that
  placement as the contract, not the WorkOrder field WO-055's Design line
  names (map carry-in from the 2026-09-19 cleanup pass; WO-055 FINAL-001).
- A comment whose path is outside the order's declared surfaces yields
  `NeedsHuman` rather than a widened repair (the derivation's own rule for
  a path outside the original's surfaces).
- The publication host gains a push of a verified repaired head to the
  branch the recorded `PullRequestOpened` names, under an operator grant
  for `repo.push` alone and refused unless the head descends from the
  recorded one, and a thread disposition under an operator grant for
  `pr.thread.resolve`, through the `gh` helper.
- A rejection is a recorded disposition with evidence references, posted
  through the helper as the thread's disposition, never prose narrative.
- The observed `resolved` state comes from a fresh WO-065 observation after
  the disposition, never from the loop's own bookkeeping; a failing check
  counts as resolved when a fresh observation shows it passing on the new
  head.
- Carry-ins due before the first target publication (map catalog row of
  the 2026-09-25 standard pass; register rows FUP-0a47198c1e076d4d,
  FUP-92fd86e53b44fa39 and FUP-e398c79e1b32e94b): every host Git read in
  the target's root runs with `log.showSignature=false` and `gpg.program`
  and `gpg.ssh.program` neutralised, or the commit messages are read inside
  the publish lane after its fetch, and publication is bound to a
  repository identity the request names, so an edited `remote.origin.url`
  is refused (WO-157 D038); the focused test run takes the confinement the
  verification host gives a host-run test (`sandbox-exec` with the
  discovery profile: no network, writes only in the worktree), and the
  Claude writer's admitted test command runs with no network and writes
  confined to the worktree as the host's permission settings allow, since
  no harness sandbox is in force on this host (WO-157 D005; WO-161); one
  recorded reading of a Claude worker launch's effect on the operator's
  user-level Claude state (WO-159 D009).
- **Declined alternatives, recorded:** narrative replies; resolving human
  comments; treating a pushed change as resolution; a reactor slice in
  `packages/skeleton/src/reactor.ts` for the loop (the `gh` helper, the
  publication log and its writer are script-side, as WO-065's observer is;
  reopen when a package consumer needs the loop in process); re-running a
  failing check as a WO-054 witness and sending every automated comment to
  `NeedsHuman` (it leaves `repair.ts` unedited but repairs no comment,
  which the title promises; reopen if a review item cannot be admitted
  without widening the derivation's other rules).

**Deliverables:** the continuation, its command, the event, the push and
disposition paths, the review-item input, the carry-ins, fixtures over
recorded observations and doubles, the re-mints, the write-backs below.

**Acceptance criteria (all required)**

1. Over recorded observations replayed through a fake `gh`, with doubles
   for the triage, the worker and the verification (a WO-054 double records
   a pass before the push): an accepted automated review comment is
   repaired, verified, pushed to the pull request's branch, disposed under
   `pr.thread.resolve` and observed `resolved` in a recorded
   post-disposition observation; a failing check the mapping names is
   repaired the same way and observed passing on the new head.
2. In the fixture observations: an incorrect suggestion is rejected with
   evidence references and its disposition recorded; a comment whose path
   lies outside the original's surfaces and a check the mapping does not
   name each end in `NeedsHuman` with the reason; no `human-review` item is
   dispatched or disposed; a comment recorded `refused` stops the loop with
   a typed stop naming it; a repair whose verification fails is not
   pushed. The criterion is judged against the fixture observations; a
   case outside them is a follow-up, not a failure.
3. A comment arriving after the pull request was created is picked up at
   the next observation; a kill between a push and the re-observation
   resumes the continuation without a second push or a reprompt; a double
   that flips a `resolved` bit without a post-disposition observation does
   not count as resolution.
4. Without an operator grant naming the effect, the push and each
   disposition refuse before any remote call; a head that does not descend
   from the recorded one refuses; the per-item limit is one, and the
   decisions record the `roundLimit` reading.
5. A fixture plants `log.showSignature` and `gpg.program` on a branch
   commit carrying a signature header and shows the program runs on an
   ordinary `git log` and not during publication; a publication whose
   `remote.origin.url` names a repository other than the one the request
   names refuses before any remote call (WO-157 D038).
6. A fixture whose focused test script attempts a network connection, a
   write into the target's common Git directory and a read of a file
   planted outside the worktree shows each refused under the confinement;
   the decisions record what the Claude writer's permission settings
   refuse and what they cannot (WO-157 D005).
7. The decisions record one reading of a Claude worker launch's effect on
   the operator's user-level Claude state: digests of the user settings and
   the project registry before and after the launch, and no content
   (WO-159 D009). The executor takes the reading from a Claude worker
   launch of its own.
8. Write-backs land, each in place with no dated paragraph: 06
   §Application version pending — Source-to-deliverable vertical (the
   post-PR loop in the pipeline sentence; at most 200 bytes added, against
   1,802 bytes of headroom on 2026-09-28; WO-086 and WO-087 change 06
   before this order, and WO-061 and WO-124 amend the same sentence after
   it, so the executor re-measures the headroom at its base, and where the
   bound does not fit it consolidates the section it edits in the same
   change; a ceiling is raised only by a planning-document decision); 02
   §Actors and episodes (the edge), beside the publication events (the
   loop's event and command), and §Independent verification v1, beside
   WO-055's derivation (the review item it admits), at most 500 bytes
   added in 02 together, against 2,776 bytes of headroom on 2026-09-28
   (WO-065 and WO-058 also write 02, under the same rule); the decisions
   file; the publication locks refreshed.
9. The authority, artifact-identity, verification and harness editions
   this order stales are re-minted deterministically and the console is
   re-pinned; the decisions record each. After the last edit to a judged
   source the executor re-mints the feedback edition from one live
   self-host episode on Codex `gpt-6-sol` or Claude Code
   `claude-opus-5-5`, at `xhigh`; the decisions record the configuration.
   A repair that edits a judged source again runs another the same way.
10. `npm test -- --review` and `npm run test:docs` green; `git diff
    --check` clean; no new dependency.

**Evidence gate:** the fixture transcripts; the confinement and Git-read
fixtures; the digests of criterion 7;
`npm run test:docs`; `npm test -- --review` before `implementation-ready`,
because `packages/skeleton/src/repair.ts` is a declared source of the five
evidence suites and every file under `scripts/` is a declared source of
the configuration-root suite, and again at final review. The live rows are
the executor's: the Claude launch reading and the feedback self-host
episode.

**Write-back duty:** as listed in criterion 8.

**Non-goals:** the live loop (part of WO-112); merging; replying in prose; a
poller or a cadence; a pull request DotLn did not open; triaging a comment
WO-065 recorded `refused`; a harness sandbox.

**Operator-review assumptions**

1. One round per comment is the right default for the first vertical.
2. The loop lives beside the publication host in `scripts/lib/` and runs
   from a command; a reactor slice in the skeleton is the declined
   alternative the Design records.
3. `repair.ts` admits a host-recorded review item in place of a verifier's
   witness, so automated comments can be repaired; the alternative keeps
   the derivation unchanged and sends every automated comment to
   `NeedsHuman`.
4. The focused test run takes the verification host's `sandbox-exec`
   confinement, which the map row's note that no OS sandbox exists on this
   host did not count.
5. The carried D038 follow-up includes binding publication to the
   repository the request names, which the map row does not repeat.
