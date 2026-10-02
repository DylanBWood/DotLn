# WO-184 — The seams the vertical inherits are settled in one order before it is composed (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer any.
**Track:** delivery
**Release classification:** minor. One optional field on a verification
opening and a changed derivation result for two input classes (a
requirement no rule covers; a request with no surface); every other item
is a correction with no interface change. Assigned at activation under
the standing opt-out default.
**Cost:** nineteen items in three units, each a boarded follow-up whose
deadline or seam is this point, combined so the fixed costs are paid
once: one compiler release with a deterministic re-mint of all five
editions and a carried feedback edition (`story-contract.ts` is a
registered source the feedback verifier does not judge; the WO-124 D004
precedent), one skeleton release with one live feedback self-host
episode after the last edit to a judged source, three live
verification-and-review attempts on Claude for item 13, and one harness
bundle re-emit. Adds, by the re-observation's estimates and not by
measurement, about 60 source lines in the compiler, about 80 in
`scripts/lib`, one leaf module split out of `reactor.ts`
byte-for-byte, about 150 lines across ten judged skeleton sources, and
their fixtures. Removes: the refusal the next reactor edit would meet
(99,655 of 100,000 characters); a live composition that stops at human
attention before the review can run (two of three Claude verifier
attempts in WO-181); a compile that throws on an admitted bundle;
response bytes echoed on an error; a publish that reports success over
an unready recorded head; four outcome defects in the review loop; and
nineteen register rows, seven of the nine whose deadline is WO-123's
activation and twelve whose seam this order opens (the other two go to
WO-123's own text and to WO-073). Wall-clock of the whole re-mint is recorded
by criterion 20 beside WO-175's 384 s figure; tokens and context bytes
are unknown until run.
**Nomination provenance:** the operator's notes of 2026-10-02, item 10
(combine many small items in one order, each with its change and
criterion; captured in ignored intake, SHA-256 in the ledger section of
that date); the final reviews and verifications that boarded each item
(the decision named beside it below); the 2026-10-02 planning pass,
which re-observed all of them at `08845c71`
([planning document](../planning/standard-pass-2026-10-02.md) §9).
Planner-synthesized. Opaque identifier, not a priority. Clean-room
screen: repository records only; no stop condition.
**Depends on:** WO-124 merged (`deriveSurfaces`; closed, v0.64.0);
WO-061 merged (the contract compile; closed, v0.63.0); WO-065, WO-066
and WO-182 merged (the observer, the review loop and the readiness
table; closed); WO-180 and WO-181 merged (baseline and review episodes;
closed); WO-175 merged (the entropy protocol; closed); WO-159 merged
(the Codex launcher; closed).
**Recommended placement:** the delivery lane of the head pair, before
WO-123, which takes this order as a hard dependency. This order edits
`packages/compiler/src/story-contract.ts`; in `packages/skeleton/src/`
`reactor.ts` and one new leaf module, `repair.ts`, `review.ts`,
`verification-protocol.ts`, `worker-transport.ts`,
`discovery-sandbox.ts`, `source-change-command.ts`, `worker-protocol.ts`,
`entropy-review-protocol.ts`, `cli-episode.ts` and `resident-state.ts`;
in `scripts/lib/` `pull-request-observer.mjs`, `review-comment-loop.mjs`,
`target-publish.mjs`, `github-body.mjs`, `config.mjs` and
`entropy-review.mjs`; `scripts/worktree.mjs` (the error line); the
evidence-source and feedback-source registries for the new module; their
tests. WO-185, beside it, edits the runner, the dispatch command and the
corpus lane. WO-123, WO-072, WO-073, WO-074, WO-076, WO-077 and WO-078
also edit `scripts/lib/config.mjs`, and WO-123 also edits
`resident-state.ts`; each comes after this order. A recommendation, not
a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-124",
    "relation": "satisfied-by-close",
    "reason": "the surface derivation whose three seams items 1 to 3 settle"
  },
  {
    "workOrderId": "WO-061",
    "relation": "satisfied-by-close",
    "reason": "the contract compile whose seams items 4 to 6 settle"
  },
  {
    "workOrderId": "WO-065",
    "relation": "satisfied-by-close",
    "reason": "the pull-request observer item 7 hardens"
  },
  {
    "workOrderId": "WO-066",
    "relation": "satisfied-by-close",
    "reason": "the review loop whose outcome defects item 9 repairs"
  },
  {
    "workOrderId": "WO-182",
    "relation": "satisfied-by-close",
    "reason": "the readiness table and publish flag item 8 completes"
  },
  {
    "workOrderId": "WO-180",
    "relation": "satisfied-by-close",
    "reason": "the verification protocol the baseline episode shares with items 13 and 14"
  },
  {
    "workOrderId": "WO-181",
    "relation": "satisfied-by-close",
    "reason": "the review episode items 12 and 13 make reachable in a live stream"
  },
  {
    "workOrderId": "WO-175",
    "relation": "satisfied-by-close",
    "reason": "the entropy protocol and launch item 16 corrects"
  },
  {
    "workOrderId": "WO-159",
    "relation": "satisfied-by-close",
    "reason": "the Codex launcher whose supervisor item 17 completes"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** the decision records that boarded each
item, read whole before the item is touched: `docs/evidence/WO-124/decisions.md`
D014; `docs/evidence/WO-061/decisions.md` D010 and D011;
`docs/evidence/WO-065/decisions.md` D014; `docs/evidence/WO-182/decisions.md`
D006; `docs/evidence/WO-066/decisions.md` D011, D012 and D014;
`docs/evidence/WO-114/decisions.md` D013 with
`docs/evidence/WO-117/decisions.md` D008 and D011;
`docs/evidence/WO-181/decisions.md` D004, D005, D012 and D014;
`docs/evidence/WO-058/decisions.md` D010; `docs/evidence/WO-175/decisions.md`
D012, D013 and D016; `docs/evidence/WO-159/decisions.md` D010;
`docs/evidence/WO-099/decisions.md` D027; the map candidates "Three
recorded items in `reactor.ts`" and "A transitive reactor purity check"
(`docs/planning/work-order-map.md`); `packages/compiler/src/verification.ts`
(`copySubject`, the 100,000-character file bound);
`packages/skeleton/test/scenario.test.ts` (the import, purity and decider
lists); `scripts/reactor-identity.mjs`; `scripts/lib/evidence-sources.mjs`
and `packages/skeleton/src/feedback-audit.ts` (`FEEDBACK_SOURCE_PATHS`);
the [2026-10-02 planning document](../planning/standard-pass-2026-10-02.md)
§9.

**Objective:** WO-123 composes primitives that behave as their consumers
need on real input, and its executor meets none of the defects their
reviews already found. Each item below is one boarded seam with its
decision made, its change bounded and its fixture named; none adds a
primitive.

**Observed gap (dated 2026-10-02, `main` at `08845c71`; every item
re-observed at that revision):**

- `packages/skeleton/src/reactor.ts` holds 99,655 characters against the
  capsule's 100,000-character file bound, so the next order that adds
  346 characters to it is refused before any feedback model launches
  (WO-181 D004, D014).
- A behavior verifier on a review-enabled stream that passes every
  criterion and notices a scope or convention defect asks for human
  attention; the host then holds the stream and never dispatches the
  reviewer. Claude attempts 002 and 003 of WO-181 stopped there; the
  passing Claude row needed a Codex verifier (WO-181 D005, D006, D014).
- `deriveSurfaces` returns a derivation with no surface when the caller
  passes threshold 0; counts a requirement covered only by a supplied
  inference toward the confidence gate; and matches the noun `parser`
  inside `parser-other` (WO-124 D014; probes re-run on the built
  compiler).
- `compileStoryContract` throws on a bundle `decodeSourceBundle` admits
  when an image's reference covers only whitespace; keeps two relations
  with one identifier when an entry is supplied twice; records no
  `follows` fact when the asker posts again before anyone replies; and a
  comment says replacement items get fresh identifiers when they keep
  theirs (WO-061 D010, D011).
- The pull-request observer hands a response-derived cursor and thread
  identifier to `gh` undecoded, and a spawn error prints the argument,
  response bytes included; a token of about 5.6 million characters
  overflows the screen's expression stack and fails the whole
  observation (WO-065 D014).
- `publishTargetOrder` returns a recorded publication before it
  evaluates readiness, so a flagged repeat over a head published without
  the flag exits 0 with items absent; and the readiness checks row has
  no route for a target with no build or lint step (WO-182 D006).
- The review loop reports `resolved` while an item's own terminal is
  `needs-human`, measures freshness from the stage start, admits an
  automated comment with no line and then throws in the repair stage
  (WO-066 D011, D014).
- A FIFO at `dotln.config.json` blocks resident startup: the reader
  stats and then reads without checking the file type (WO-114 D013;
  WO-117 D008, D011).
- The verification result schema offers every claim type for every
  criterion; the writer's admitted command text carries the sandbox
  profile's asterisks, which the host's rule syntax reads as wildcards;
  the entropy prompt's temporary-directory sentence starts with a space
  and the launch mutates the parent's `TMPDIR`; a supervisor killed from
  its terminal leaves its detached episode running; an answered
  `unknown` judgment is worded as a verifier that returned nothing
  (WO-058 D010; WO-066 D012; WO-175 D012, D013; WO-159 D010; WO-099
  D027).
- The reactor purity test is a list of named modules; a walk of the
  reactor's import closure finds 53 modules, two of which import host
  modules today (`discovery-sandbox.ts` through `worker-protocol.ts`;
  `gate-deadlines.mjs` through `local-model-transport.ts`). No fixture
  pins what the host does when a review episode fails or its transport
  is rejected (WO-181 D012).

**Design (scope discipline):** each numbered item below is one
criterion. The decisions the records left to planning are made here and
stated as operator-review assumptions; an executor that finds a decision
unworkable records why and what it did instead, and does not widen the
item.

Compiler, `packages/compiler/src/story-contract.ts`:

- (1) `deriveSurfaces` returns `NeedsHuman` when it derives no surface,
  whatever threshold the caller passes.
- (2) Only a rule's coverage counts toward the confidence gate. A
  requirement covered only by a supplied inference stays uncovered and
  is listed as a candidate with its inferred surfaces.
- (3) The noun rule's boundary class includes the hyphen, so
  `parser-other` is not the noun `parser`.
- (4) A whitespace-only image reference derives no statement, and the
  compile never throws on a bundle the decoder admits.
- (5) Duplicate relation entries are removed before the contract
  identifier is computed, as `revise` already does; duplicate class
  entries keep refusing. The `StoryContractRevision` comment says that
  an invalidated identifier may reappear with a changed status or claim
  type.
- (6) `follows` targets the first later discussion entry by another
  role, and the rule comment states that reading.

Scripts, `scripts/lib/`:

- (7) The observer validates every response value it sends back to `gh`
  (each connection's end cursor; a review thread's identifier) against a
  bounded grammar at its field path and refuses there; an error the
  observer did not raise prints a fixed reason, never the error's
  message; a range error inside the screen is contained per item as a
  refused item with the shape `unscreenable-text` and no text. The
  evidence README's no-logging statement is corrected in the same
  change.
- (8) A publish with `--require-deliverable-ready` over a head that is
  already recorded re-evaluates readiness, refuses when an item is
  absent and otherwise returns the recorded publication without a
  remote call. The checks row accepts `not-applicable` with an
  owner-stated reason for `build` or `lint`, shown as such in the table
  and never counted as evidence; `tests` has no such route.
- (9) The review loop consults item terminals before it reports
  `resolved` and stops `needs-human` naming the item; measures freshness
  from the item's latest repair push or thread disposition; sends an
  automated comment with no integer line to the human; and returns
  `human` with the derivation reason where the repair stage threw.
- (10) The configuration reader opens without blocking, checks that the
  descriptor is a regular file, reads from it, and refuses anything else
  by path; the two documented disclaimers go.

Skeleton, sources the feedback verifier judges:

- (11) Room in the reactor. The unreachable continuation guard is
  deleted (the kernel declares the field non-optional). The three
  decider-free regions the pass measured (the `VerificationOpened`
  validation and state; the `CommandResult` evaluation and finding fold;
  the `VerificationSubjectSubmitted` repair application) move
  byte-for-byte to one leaf module that does not import the reactor.
  The one `any` becomes a typed repair event payload declared in
  `repair.ts`. The new module is registered as an evidence source and as
  a feedback source, and joins the import and purity lists of
  `scenario.test.ts`.
- (12) On a review-enabled stream, an in-stream repair marks every
  criterion stale, so the review is dispatched only after each is
  verified at the repaired revision.
- (13) A verification opening may carry an optional review notice. When
  it does, the verifier's instruction says that scope and convention
  defects belong to the review that follows and that a behavior it
  verified is passed; the verifier still asks for human attention for
  anything else it judges unsafe to pass. A stream opened without the
  field compiles the instruction it compiles today, so recorded streams
  resume unchanged.
- (14) The result schema offers, for the evaluation's claim type, only
  the claim types the capsule's criteria carry.
- (15) The writer's sandbox profile is written to a host-owned file
  outside every root the writer may write, and the confined test command
  names that file; the admitted command text holds no asterisk. A
  contract test command that itself contains an asterisk is refused for
  this profile with the reason. Other sandbox users keep the inline
  profile.
- (16) The entropy prompt's output instructions start with a non-space
  character and join without a doubled or missing space; the episode's
  temporary directory is set in the worker's launch environment from the
  request, and the wrapper that mutated the parent's is removed.
- (17) The CLI episode supervisor kills its episode's process group on
  interrupt, termination and hang-up, then exits.
- (18) An answered `unknown` judgment over an incomplete capsule is
  worded as an incomplete capsule and names the omitted paths and
  decisions; a judge that returned nothing keeps today's wording.

Tests only:

- (19) A transitive purity check walks the reactor's runtime import
  closure and fails on a static host import, with a reasoned exclusion
  for each of the two edges present today. A fixture pins the review
  host's behavior when a review result is `failed` and when its
  transport is rejected: the worker is recorded interrupted, the review
  stays pending, no review completion is recorded, and a rerun starts a
  fresh attempt.

- **Left as it is, and recorded:** the append-only `repairPlans` field
  (replacing or deleting it re-keys three identity streams); the
  inline-strike fragmentation of a requirement (a contract change);
  whether the screen refuses C1 controls and bidirectional overrides;
  machine-user logins and link hosts beyond the forge (the repository
  profile's decision, WO-073); derived surfaces in the review context (a
  protocol change with its own live proof); a per-run waiver of a
  baseline that does not reproduce.
- **Declined alternatives, recorded:** leaving the composition
  decisions to WO-123's executor (its order is the composition; each of
  these changes a primitive's judged source and wants its own fixture);
  one order per unit (three lifecycles and three re-mint passes for
  items that share one); ignoring a verifier's attention request on a
  review stream (WO-181 D005 rejected it; the notice tells the verifier
  what the review is for instead); splitting the whole verification fold
  out of the reactor (it calls the kernel's deciders, which the
  decider-ownership check keeps in one file); refusing a flagged repeat
  outright (a legitimate ready repeat would refuse, since the
  publication event records no readiness).

**Deliverables:** the nineteen changes with their fixtures; the leaf
module and its registrations; the live proof for item 13; the re-mints
and the live feedback audit with their wall times; the write-backs
below.

**Acceptance criteria (all required)**

1. `deriveSurfaces` on a contract whose requirements yield no surface
   returns `NeedsHuman` at threshold 0 and at the default; a fixture case
   pins it, and the existing cases that pass threshold 0 with surfaces
   are unchanged.
2. A requirement covered only by a supplied inference is uncovered: the
   derivation's confidence does not count it, the default threshold
   hands off, and the inferred surfaces appear as a candidate. The
   pinned `inferred` fixture case is rewritten to this reading and the
   decisions say so.
3. The prose `The parser-other module changes.` yields no `src/parser`
   surface; the noun `parser` still matches `the parser module`; a
   fixture pins both.
4. A bundle whose image reference covers only whitespace compiles, with
   no visual statement for that reference; the bundle of WO-061 D011
   probe P1 is the fixture.
5. Compiling with one relation entry supplied twice equals compiling
   with it once, in bytes and in contract identifier; a duplicate class
   entry still refuses; the revision comment is corrected.
6. A thread of a question, a second entry by the asker and a reply by
   another role records one `follows` fact from the reply to the
   question; the 35 WO-060 bundles and the WO-061 fixture bundles
   compile to the contracts they compile to today.
7. Through the fake `gh`, an end cursor holding U+0000 and a paginated
   review thread identifier holding U+0000 each exit non-zero, name
   their field path, print neither the value nor the runtime's error
   text, append no event and make no call that carries the value. A
   comment body with a 6,000,000-character token beside a safe peer
   stores one observation in which that item is refused as
   `unscreenable-text` without text and the peer is kept. The WO-065
   evidence README states what is and is not logged.
8. After an unflagged publication of a head with an absent readiness
   item, a publish of the same head with `--require-deliverable-ready`
   exits non-zero naming the item and makes no further remote call; with
   every item present it returns the recorded publication. A preparation
   that marks `lint` not applicable with a reason passes the checks row,
   which prints the reason; one that marks `tests` not applicable
   refuses.
9. In the review-loop fixtures: a mapped check that is in progress or
   cancelled stops `needs-human` with its item named; a kill after the
   observer appends resolves on resume; a repair push with a failing
   matrix refuses and pushes nothing; an automated comment with no line
   stops `needs-human`, later items are still reached and nothing
   throws; a criterion lacking the matched test stops `needs-human`.
10. `loadConfig` refuses a FIFO at the configuration path by path within
    five seconds, and the runtime status reports the configuration
    source invalid with work orders unavailable, exit 0; the disclaimers
    in product 04 and `packages/console/README.md` are removed.
11. `packages/skeleton/src/reactor.ts` holds at most 92,000 characters;
    `node scripts/reactor-identity.mjs --check` verifies the same
    eighteen streams with no successor manifest; the moved regions are
    byte-identical apart from their import and export lines; the new
    module appears in the evidence-source registry, in
    `FEEDBACK_SOURCE_PATHS` and in the purity and import lists; no `any`
    remains in `reactor.ts`.
12. A review-enabled fixture stream in which a repair touches one
    criterion's surfaces re-verifies every criterion and then dispatches
    the review without throwing.
13. With the notice, the compiled verifier instruction names the review
    and the two defect kinds it owns; without it, the compiled command
    is byte-identical to today's for the WO-181 fixture stream. Three
    live attempts are recorded, each a Claude verifier on a
    review-enabled stream with WO-181's two planted review defects: in
    all three the verifier passes both behavior criteria without
    requesting human attention over either planted defect, and the
    reviewer then reports both. One stop over a planted defect makes the
    criterion unmet, since one pass in three is the rate WO-181 already
    recorded; an attempt that stops for another reason is recorded with
    that reason and repeated once. Every receipt is kept.
14. For a capsule whose criteria carry two claim types, the emitted
    schema's claim-type enumeration holds exactly those two; the
    admission check that refuses a mismatched pair is unchanged; the test
    that pinned all four is rewritten.
15. The Claude writer's allowed-tools entry for the confined test
    command contains no asterisk; the emitted hook denies a command that
    differs from it by one character; the native confinement tests still
    deny network and writes outside the worktree; a contract test command
    containing an asterisk is refused for the profile with the reason; a
    writer that tries to write the profile file is denied.
16. Both entropy prompts contain the instruction sentence joined by
    exactly one space and starting with a non-space character; a real
    worker child launched through the transport sees a `TMPDIR` that
    holds no host temporary of the launch, and the parent's `TMPDIR` is
    unchanged during the dispatch.
17. A supervisor forked from the built CLI episode entry with a double
    on the path, sent a termination signal, leaves no process of its
    episode's group alive.
18. An answered `unknown` over a capsule with omitted decisions produces
    a hold that names them; the unanswered case produces today's text.
19. The transitive purity check passes with exactly two reasoned
    exclusions and fails when a third closure member gains a static host
    import (shown by a fixture module); the review-failure fixture
    asserts the four facts of item 19.
20. Each edition the edited registered sources stale is re-minted
    deterministically; after the last edit to a judged source the
    feedback edition is re-minted from one live feedback self-host
    episode on Codex `gpt-6.1-sol` at `max` or Claude Code
    `claude-opus-5-5` at `xhigh`; the decisions record the wall time of
    each deterministic re-mint, the harness regeneration, the live audit
    and the console re-pin, beside WO-175's figure. A repair that edits a
    judged source again runs another the same way.
21. Write-backs land, each in place with no dated paragraph: product 03
    §VerificationAdapter (the review notice, in the sentence that
    describes the two episodes) and §DeliveryAdapter (the not-applicable
    reading of the checks row); product 04 (the removed disclaimer);
    `packages/console/README.md`; the decisions file with one record per
    item naming its source decision; the register rows named in the
    provenance retargeted at close; the publication locks refreshed.
22. `npm test -- --review` and `npm run test:docs` green;
    `git diff --check` clean; no new dependency.

**Evidence gate:** each item's fixture transcript; the three live
attempts of criterion 13 with their receipts, failures included; the re-mint records
and timings of criterion 20; `npm test -- --review` before
`implementation-ready`, because `worker-transport.ts`,
`entropy-review-protocol.ts` and the evidence-source registry are
declared sources of machinery suites, and again at final review.

**Write-back duty:** as listed in criterion 21.

**Known issues and carry-ins:**

- A failed item is repaired alone. Verification judges each criterion
  on its own fixture; a repair re-opens only the criteria whose surfaces
  it touches.
- The retained fixture derivations of WO-124
  (`docs/evidence/WO-124/fixture-derivations.json`) and contracts of
  WO-061 are historical evidence and are not regenerated; item 2 changes
  what one of those derivations would be today, and the decisions say
  which.
- Item 15 is a security boundary: the verifier attacks it first.
- `resident-state.ts` and `scripts/lib/config.mjs` are edited again by
  WO-123; this order lands first.
- Receipt 038: criterion 13 first accepted one passing attempt in three,
  the rate the order cites as the defect; it now requires all three.
  Reopen if WO-123's executor or WO-112 records a Claude verifier
  stopping at attention on a review-enabled stream.
- Receipt 038: the purity check passes with two host imports still
  inside the reactor's import closure (`discovery-sandbox.ts` and
  `gate-deadlines.mjs`); whether either is reachable from a decision
  path is not shown. Reopen if a live and a replay identity differ or a
  nondeterministic decision is traced to either module, or a later
  order adds a third exclusion instead of removing one.

**Non-goals:** the composition itself (WO-123); the live proof of the
loop (WO-112); which step writes the delivery preparation (WO-123); a
waiver of a non-reproducing baseline; derived surfaces in the review
context; machine-user logins and extra link hosts; any change to what
the screen admits beyond containing its own overflow; the `repairPlans`
field; a further reactor split.

**Operator-review assumptions**

1. A request that derives no surface, and a requirement only an
   inference covers, both go to the human for the first runs (items 1
   and 2); the operator may let inference count once a run shows it
   reliable.
2. A verifier on a review-enabled stream leaves scope and convention
   defects to the reviewer and passes the behavior it verified (item
   13). This changes what a verifier holds on such a stream; the
   operator may strike it, in which case the composition stops at
   attention as WO-181 left it.
3. A target with no build or lint step says so with a reason (item 8);
   tests are never not applicable.
4. A contract test command with an asterisk is refused for the Claude
   writer profile until a rule for it is decided (item 15).
5. The whole order is one lifecycle: a verification that fails on some
   items repairs those items only.
