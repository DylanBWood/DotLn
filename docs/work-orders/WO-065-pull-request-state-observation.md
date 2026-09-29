# WO-065 — Pull-request state observation: a read-only adapter projects a pull request's checks and review comments into typed, classified events on demand (v0.55.0)

**Model:** any capable model; the live smoke is operator-run. State the
model and effort actually run (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. A read-only external adapter and one
event type. Assigned at activation under the standing opt-out default.
**Cost:** adds one observer module beside the target-publish host in
`scripts/lib/`, one event type in the episode store's `publication/` log,
one operator command in `scripts/worktree.mjs`, fixtures in the
target-publish suite over recorded JSON replayed through a fake `gh`, and
at most 450 bytes in product 02. Removes the gap product 02 names:
`PullRequestOpened` has no reader, so DotLn cannot see a pull request's
checks or review comments. WO-066 consumes the stored comments and WO-123
composes observation into the vertical. Re-mints: none; no file it edits
is a registered evidence source or one the feedback verifier judges
(`scripts/lib/evidence-sources.mjs` and
`packages/skeleton/src/feedback-audit.ts` at `5f3849ec`). Wall-clock,
tokens and context bytes are unknown until run.
**Nomination provenance:** the 2026-09-08 critical-path planning pass (gate
H, the observation slice), cut as a bounded order at the operator's same-day
correction; the parity item "resolves every automated review comment"
needs the comments observed first. Planner-synthesized draft; captures and
hashes in the ledger section of that date. Opaque identifier, not a
priority. Clean-room screen: no stop condition. Amended by the 2026-09-28
planning pass, which re-observed the order on `main` at `5f3849ec`: the
helper's path and the log that receives the event are named, the stored
comments pass WO-060's declared screen with a stated allowlist, the
resident cadence the order promised does not exist and is dropped, the
live smoke has a fallback and the final criterion names both gates
([planning document](../planning/failures-across-phases-2026-09-28.md)
§10).
**Depends on:** WO-064 merged (a pull request to observe; closed at
`v0.43.0`); WO-060 merged (the screen every stored comment passes). WO-068
closed without a cadence that observes pull requests; the command is
operator-invoked until WO-123 composes it into the vertical.
**Recommended placement:** paired with WO-172 in the third slot, after the
pairs of WO-060 and WO-167, WO-116 and WO-173. This order edits a new
observer module under `scripts/lib/`, `scripts/worktree.mjs` (the
command), `scripts/test-target-publish.mjs` (the fixtures) and product
02; WO-172 edits the planning and meter scripts, a different new module
under `scripts/lib/`, product 07 and the sequence. Disjoint files; neither
depends on the other; neither re-mints. A recommendation, not a
dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-064",
    "relation": "hard",
    "reason": "a pull request to observe"
  },
  {
    "workOrderId": "WO-060",
    "relation": "hard",
    "reason": "the screen every stored comment passes"
  },
  {
    "workOrderId": "WO-068",
    "relation": "reference-only",
    "reason": "the resident host; no cadence observes pull requests, and WO-123 composes observation into the vertical"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 06-roadmap.md §Application version pending
— Source-to-deliverable vertical (CI classification and comment triage);
02-domain-model.md §Actors and episodes (the edge) (WO-064's event
paragraph); 03-architecture.md §Ports (what keeps work-flavored verticals
pluggable); 09-audit-resilience-privacy.md §Privacy and minimization;
`scripts/lib/github-repository.mjs` (the `gh` helper);
`scripts/lib/target-publish.mjs` (the host, its actor id and its
`publication/` log); `scripts/test-target-publish.mjs` (the fake `gh` its
fixtures write); `docs/evidence/WO-064/smoke.json` (identifiers reduced to
shapes); `docs/work-orders/WO-060-source-bundle-contract.md` (the screen,
its declared set and the role labels); the
[2026-09-28 planning document](../planning/failures-across-phases-2026-09-28.md)
§10.1.

**Objective:** `observePullRequest` reads, for a pull request that a
`PullRequestOpened` event in the store's `publication/` log records, the
head sha, check runs and review comments through `gh` in JSON mode, and
appends one `PullRequestStateObserved` event to the same log carrying
`{ repositoryId, number, headSha, checks[], comments[] }`, where each check
is `{ name, state }` and each comment is
`{ id, role, path?, line?, text?, resolved, class, refused? }` with `class`
from `ci-failure`, `automated-review`, `human-review`, `resolved`. The
operator invokes it through one command; nothing polls. Identical state
appends nothing.

**Observed gap (dated 2026-09-28, `main` at `5f3849ec`; first observed
2026-09-08 at `33e2c25`):**

- Nothing reads a pull request back. The `gh` calls under `scripts/` are
  `--version`, `auth status`, `pr create`, `release view`,
  `release create` and `release list`; product 02 says no reactor slice
  folds `PullRequestOpened` and that this order owns its first reader.
- WO-064 records `PullRequestOpened` from `target-publish-host` in the
  episode store's `publication/` log; its smoke record reduces every
  identifier to a shape. The scratch pull request's state since
  2026-09-22 is not recorded.
- No cadence, actor or command named for pull-request observation exists;
  WO-068 closed without one.

**Design (scope discipline):**

- The observer lives beside the target-publish host and reads through
  the `gh` helper; it observes only a pull request the store's
  `PullRequestOpened` events record, and correlates its event to that
  one.
- Each comment is screened as a one-entry bundle through WO-060's
  screen, with the forge host of `repositoryId` as the whole allowlist. A
  comment the screen refuses is stored with `refused: { shape, span }`
  and without its text; the observation's other comments are stored. A
  string the screen cannot classify passes, which is WO-060's stated
  limit.
- Role labels as WO-060 defines them: `automation` for accounts matching
  a pattern the executor declares, `reviewer` for other review authors,
  `reporter` for the pull request's author.
- Input the observer cannot read refuses the observation with the reason
  and appends nothing: a number no `PullRequestOpened` records, `gh`
  output that does not decode (with the field's path), a `gh` failure.
- **Declined alternatives, recorded:** a poller of its own (WO-123
  composes the step into the vertical); writing to the pull request
  (WO-066's disposition); an observer in `packages/skeleton/src/` (the
  `gh` helper and the log's writer are script-side; reopen when a
  package consumer needs observation in process); keeping a refused
  comment's text in any form.

**Deliverables:** the observer, the event, the command, fixtures, a live
smoke record, the write-backs below.

**Acceptance criteria (all required)**

1. Over recorded JSON replayed through a fake `gh`, the observer
   classifies a failing check, an automated review comment, a human
   review comment and a resolved comment as pinned and appends one
   `PullRequestStateObserved`; a second observation of identical state
   appends no event; a new head or a new comment appends one.
2. For each secret shape and each URL form WO-060's screen declares, a
   recorded comment holding it is stored with `refused` naming the shape
   and the span, and a search of the store for the fixture's string finds
   nothing; a comment that links only to the forge host is stored with its
   text; the other comments of the same observation are stored. The
   criterion is judged against WO-060's declared set; a shape outside it
   is a follow-up, not a failure.
3. A number no `PullRequestOpened` records, `gh` output that does not
   decode and a failing `gh` each refuse with the reason (the decode
   refusal names the field's path) and append nothing.
4. A live smoke against a scratch pull request the operator names
   (WO-064's, if it is still open) records the event with identifiers
   reduced to shapes, as WO-064's smoke record does. If the smoke has not
   run by handoff, the executor records this criterion unmet with the
   command the operator runs; the other criteria are judged; the
   criterion closes by the operator's run or by a recorded waiver.
5. Write-backs land, in place with no dated paragraph: 02 §Actors and
   episodes (the edge), beside WO-064's event paragraph (the event, its
   log and the command; at most 450 bytes added, against 2,776 bytes of
   headroom on 2026-09-28; WO-066 and WO-058 also write 02, so the
   executor re-measures the headroom at its base, and where the bound
   does not fit it consolidates the paragraph it edits in the same
   change; a ceiling is raised only by a planning-document decision); the
   decisions file; the publication locks refreshed.
6. `npm test -- --review` and `npm run test:docs` green; `git diff
   --check` clean; no new dependency.

**Evidence gate:** the fixture transcripts; the smoke record, or the
unmet criterion and its command; `npm run test:docs`; `npm test --
--review` before `implementation-ready`, because every file under
`scripts/` is a declared source of the configuration-root suite, and
again at final review. The live row is the operator's smoke.

**Write-back duty:** as listed in criterion 5.

**Non-goals:** resolving anything (WO-066); a daemon or a cadence; pull
requests DotLn did not open; the enterprise tracker; a secret outside
WO-060's declared set.

**Operator-review assumptions**

1. Observation is operator-invoked until WO-123 composes it into the
   vertical; this order adds no cadence.
2. A comment the screen refuses is kept as a refused item without its
   text, so WO-066 stops on it instead of never learning of it.
3. The forge host is the whole default allowlist; a link to any other
   host refuses that comment's text until a later order admits more.

**Authorized ideation breakout (2026-09-29):** The operator's `ideation:`
message during execution requests a minimum of three subagents with each
harness's workflow mode enabled and willing discretionary delegation with it
disabled. This adds document-only capture, synthesis and write-back to the
review subject; it adds no runtime change to the observer. Read
[WO-065-D008](../evidence/WO-065/decisions.md#wo-065-d008), the named new ledger
section and product 05 §Orchestration and quality policies. Verification and
final review judge traceability, counting-scope inference, policy consistency
and the distinction between specification and observed enforcement. Original
acceptance criteria and non-goals remain in force.
