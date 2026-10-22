# WO-183 — Intent declaration and the stranger test: one command takes a bounded intent in prose, compiles it through the StoryContract into a durable derived work order with a fire-and-forget receipt over the parity contract, carries it through the resident-owned loop, and is exercised once by a person who has not read these documents (version assigned at activation)

**Model:** any capable model; the witnessed run uses the actual local
harnesses as the loop's actors. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer any.
**Track:** delivery
**Release classification:** minor. One terminal and console command over
the parity contract, one receipt shape, one witnessed run; no change to
the loop's primitives. Assigned at activation under the standing opt-out
default.
**Cost:** extends `dotln intent "<prose>"` (WO-120) with `--target <registered
repository>`, `--help` and the receipt in `packages/skeleton/src/dotln.ts` (and the parity contract's loopback
form, product 04 §Console parity contract v1) that admits the intent
under the portfolio's `intent` class (WO-123), interprets it into a
StoryContract with a labeled inference episode (WO-061), materializes the
durable derived order (WO-120) and returns a receipt naming the order,
where its progress can be watched (the live console, WO-117) and the one
question the loop may ask; one `IntentDeclared` event; fixtures with
doubles; one witnessed run by a non-author on the starter instance WO-118
exports, recorded with shapes and the person's own words paraphrased; about 300 bytes in product 06 §v1.0.0 and 200 in product 04 in place (the
planner's estimates, never bounds).
Removes: the hand-written work order as the only way an intent enters
this repository (the map's candidate since 2026-09-06), and the absence
of any order for the `v1.0.0` exit. Re-mints: none unless step 2's `intent-source.ts` is registered or enters a
registered import closure (then each edition whose check it stales, through
`npm run sync`); `dotln.ts` and `console-commands.ts` are not registered
evidence sources, and the executor checks `FEEDBACK_SOURCE_PATHS` (corrected
by the 2026-10-21 pass). Commands: no new
command name; `dotln intent` gains `--target`, `--help` and the receipt
(step 1: the command exists). Steps: one witnessed run by a non-author, or
the substitute run (step 9). Wall-clock, tokens and context bytes are
unknown until run.
**Nomination provenance:** the operator's message of 2026-09-30 (are
product orders missing?), captured in ignored intake (SHA-256 in the
ledger section); the map's candidate "Intent declaration and the stranger
test" (named 2026-09-06 by the redirect's final refutation receipt),
whose precondition, the parity contract, closed with WO-115; product 06
§v1.0.0 — Teammate-ready ("a person who has never read these docs declares
one bounded intent and receives a verifiable result, without learning the
taxonomy and without a giant transcript; exit: witnessed run by a
non-author"); product 12's journeys as the scenarios. Planner-synthesized.
Opaque identifier, not a priority. Clean-room screen: public product text;
the non-author's identity stays out of the record; no stop condition.
Carries FUP-0073 (the stranger test, allocated here by the 2026-09-30
pass). Amended by the 2026-10-13 standard pass under the operator's sizing
direction ([planning document](../planning/standard-pass-2026-10-13.md)
§12): the queue is serial, so the placement names its position; a
Preflight line is added; FUP-0073 and the two deferred rows whose
reopening names this order's activation are carried below.
**Depends on:** WO-118 merged (the resident-owned loop the intent enters
and the exported starter instance; closed, v0.80.0); WO-115 merged (the
parity contract; closed); WO-120 merged (derived work identity; closed).
**Recommended placement:** after WO-193 and before WO-088 in the serial queue
(position 14 after the 2026-10-21 pass placed four fork-unblocking orders
first; the operator keeps core's next thirty orders serial, planning document
§12.4), because it keeps the place the 2026-10-11 route
pass gave it in the one-at-a-time tail, after the instance's request
orders and ahead of WO-113, now part of WO-088
([route pass](../planning/three-repository-route-2026-10-11.md) §6); with
WO-118, its one hard dependency, closed, nothing else fixes it. A
recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-118",
    "relation": "hard",
    "reason": "the resident-owned loop and the exported starter instance the intent enters"
  },
  {
    "workOrderId": "WO-115",
    "relation": "satisfied-by-close",
    "reason": "the parity contract the command is defined over"
  },
  {
    "workOrderId": "WO-120",
    "relation": "satisfied-by-close",
    "reason": "the durable derived order the intent materializes"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** product 06 §v1.0.0 — Teammate-ready;
product 12 §Arriving at the desk and §One outcome from request to return;
product 04 §Console parity contract v1; product 00 §Mission and §Three
horizons; `docs/planning/work-order-map.md` (the candidate "Intent
declaration and the stranger test"); `docs/work-orders/WO-118-resident-owned-loop-from-starter.md`
(the intent the resident admits, the standing grants, the exported
instance); `docs/work-orders/WO-123-vertical-composition.md` (the
`intent` portfolio class); `docs/work-orders/WO-061-story-contract-compile.md`
(the labeled inference episode); `docs/work-orders/WO-120-*.md` (derived
identity); `packages/skeleton/src/dotln.ts`; the console's loopback
command surface; 07-execution-guide.md §Preflight before the full gate
(the **Preflight:** line below).

**Objective:** a person who has not read these documents types one
command with a bounded intent in their own words and receives, in one
screen, a receipt that names the derived work order, where to watch it,
and the one decision the loop may bring back; the loop carries the intent
to a verifiable result under the standing grants; and the run is
witnessed by that person, whose reading of the receipt is recorded.

**Observed gap (dated 2026-09-30, `main` at `b51a58a8`):**

1. Product 06's `v1.0.0` exit has no order; the map's candidate has
   waited since 2026-09-06 for the parity contract, which WO-115 closed.
2. WO-118 files one intent through the resident's portfolio class from
   inside the runtime; no command takes prose from a person and returns a
   receipt, and no run has been witnessed by a non-author.
3. Every intent that reached this repository entered as a hand-written
   work order through a planning pass (the map's candidate text; the
   index's 183 orders).

**Design (scope discipline):** one command over the existing parity
contract: it validates the target is registered and the portfolio admits
the `intent` class under standing grants (WO-123, WO-118), runs WO-061's
inference episode to a StoryContract with its labels shown in plain
words, materializes the derived order (WO-120), appends `IntentDeclared`,
and prints the receipt: the order's identity, the console command to
watch it (WO-117), and the decision the loop will bring back if any. The
loop itself is WO-118's. The stranger test is one run by a person who
has not read these documents, given only the command's help: the record
keeps their reading of the receipt in paraphrase, what they typed as a
shape, and whether they needed anything beyond the screen. Fallback if
no such person is available by handoff: the executor runs the command in
a fresh session given only the help text, records it as the substitute
run, and names the witnessed run as the pending observation. Declined:
a natural-language chat surface (the receipt is a screen, not a
transcript); admitting an intent outside a portfolio's grants (never);
a new contract vocabulary (the StoryContract's).

**Execution plan (the executor follows these steps in order; observed at `bd437eb2`, 2026-10-07):**

1. What exists: `dotln intent "<prose>"` (`packages/skeleton/src/dotln.ts` lines 35 and 80
   to 84, WO-120) files a draft through `fileIntent` (`scripts/lib/derived-orders.mjs` line
   286); `dotln.intent` is in `CONSOLE_COMMANDS_V1` (`console-commands.ts` lines 40 to 43).
   New here: `--target`, the receipt, a prose source and the help text. Neither `dotln.ts` nor
   `console-commands.ts` is a registered evidence source, so they owe no re-mint.
2. `packages/skeleton/src/intent-source.ts` (new): `intentSourceBundle(prose, sourceId)` builds
   a one-section bundle of `sourceKind: "intent"` decoded by
   `decodeSourceBundle(bundle, { allowedHosts: [] })`; prose is its own source, no forge
   effect. Keep it imported only from unregistered files or register it (the evidence-sources
   suite checks the import closure). Check: `npm run build`.
3. `scripts/lib/derived-orders.mjs`: `fileIntent(prose, { target, judge })` validates `target`
   against `loadConfig(root).repositories` and resolves its base commit; runs the intake
   judgment (`judge` is a double in fixtures, live through `liveTransport` in
   `scripts/lib/vertical-judgment.mjs` line 68; the live labeled episode is the vertical's
   intake, `intakeSubject` and `admitIntake` in `vertical-judgment-protocol.ts` lines 233 and
   265, run by `runVerticalJudgment`); compiles via `admitIntake`, then
   `materializeOrder(compiled, { kind: "intent", sourceId })`; reads the portfolio the configuration declares
   (`loadConfig(root).portfolios`, decoded by `decodePortfolio`,
   `packages/skeleton/src/portfolio.ts`) before admission and, when its class
   is not `intent`, takes the draft path receipt 036 keeps (the receipt names
   that decision); returns `{ workOrderId, workOrderPath, watch, decision }`,
   `decision` from the typed `contract.openDecisions` or an admitted intent's
   `IntentAdmission` `NeedsHuman` (`vertical.ts` line 118).
   The target binds by `--target` into the compiled `repo` (validated by `validateCompiled`,
   `derived-contract.mjs` line 42), never by scraping URLs from the prose
   (`referencesIssue`, `vertical-runtime.mjs` line 143).
4. `packages/skeleton/src/dotln.ts`: accept `--target` (option list, lines 54 to 65); answer
   `intent --help` with help text before line 35 takes prose (today `--help` would file a
   draft); print the receipt: order id and path, the watch command
   (`console status --store <dir> --watch`, `packages/console/src/cli.ts` line 16), and the
   decision or `none`. A refusal is typed `{ code: "unregistered-target", message }` (a portfolio without the intent class takes the draft path, never a refusal; receipt 036);
   fixtures assert the code and the absence of an event, never the wording.
5. `IntentDeclared`: appended in the order's control segment, with a `case "IntentDeclared"`
   added to `scanControl` (`scripts/lib/control.mjs` line 239 onward; the fold throws on
   unknown types at 450 to 453).
6. `scripts/test-derived-orders.mjs` (`derived-orders`, product): cases: an intent with a
   registered target returns a receipt and `IntentDeclared`; an unregistered target refuses with the code and no event; a portfolio
   without the intent class files the draft and the receipt names that
   decision (the draft-path case, receipt 036). Check: `npm test -- --only derived-orders`.
7. `packages/console/test/console-commands.test.ts`: extend the WO-115 contract-command case
   (line 979) with the receipt bytes. Check: `npm test -- --only console-docs`.
8. `npm run resume -- status --all --json` lists the derived id: its
   control segment opens with `WorkOrderIdentityAllocated`, which
   `scripts/lib/control.mjs` admits as a location (`materializeOrder`,
   `scripts/lib/derived-orders.mjs`), so a never-activated draft appears; a
   case in `scripts/test-derived-orders.mjs` asserts it. Check: `npm test --
   --only derived-orders`.
9. The witnessed run on WO-118's exported starter, or the substitute run given only the help
   text; write `docs/evidence/WO-183/witness.json`
   `{ run: "witnessed" | "substitute", readDocs: false, typedShape, neededBeyondScreen, understood: { order, watch, decision } }`
   and `witness.md` rendering it with the paraphrase.
10. Write-backs: product 06 §"## v1.0.0 — Teammate-ready" (the command and the run, in place);
    product 04 §"### Console parity contract v1" (the receipt and `--target` on the
    `dotln.intent` row); `docs/evidence/WO-183/decisions.md`; `node scripts/meta.mjs`;
    `node scripts/check-publication.mjs --print-locks`; `npm run publication:check`.
11. Handoff: finish source edits; `npm run format` and `npm run sync` for
    stale generated artifacts; start one `npm test -- --review` in the
    background, never under the bounded wrapper, and await it with `node
    scripts/harness.mjs evidence --wait`; after it passes, complete
    `docs/evidence/WO-183/handoff.md`; run `npm run test:docs` once after the
    last document edit; then `npm run resume -- implementation-ready <flags>`
    (product 07 §Discipline, revised 2026-10-19; corrected by the 2026-10-21
    pass).

**Deliverables:** the command and its loopback form, the event, the
receipt, fixtures with doubles; the witnessed run's record; the two
product write-backs; the decisions.

**Acceptance criteria (all required)**

1. `dotln intent "<prose>"` on the exported starter with a registered
   scratch target and standing grants returns a receipt naming a derived
   order that `resume status` lists, the console command to watch it, and
   the pending decision or its absence; a fixture with doubles asserts the
   receipt's fields and the `IntentDeclared` event.
2. An intent for an unregistered target is refused with a typed code
   (`unregistered-target`) and a message and appends no event; an intent under
   a portfolio without the `intent` class files the draft for human review, as
   `dotln intent` does today (`fileIntent`, `scripts/lib/derived-orders.mjs`),
   and its receipt names that decision (receipt 036: an intent outside
   intent-class coverage degrades to a draft, never a refusal); a fixture
   asserts the code, the absence of the event and the draft path (rewritten by
   the 2026-10-21 pass).
3. The same intent through the console's loopback command surface yields
   the same receipt (parity), asserted by the console's fixtures.
4. One witnessed run by a non-author on the exported instance, recorded
   in `docs/evidence/WO-183/witness.md` with shapes and the person's
   paraphrased reading, or the fallback substitute run with the pending
   observation named. A substitute run (`witness.json` `run: "substitute"`) leaves the v1.0.0
   exit and FUP-0073 open (receipts 036 and 045).
5. Write-backs: product 06 §v1.0.0 — Teammate-ready states the command and
   the run's kind, and states the exit met only when `witness.json` records
   `run: "witnessed"` (after a substitute run no product section, capability
   row or release claims it); product 04 §Console parity contract v1 states
   the receipt and `--target` on the `dotln.intent` row; both in place, with
   no byte figure binding them; `docs/evidence/WO-183/decisions.md`; the
   decisions index.
6. `npm test -- --review` and `npm run test:docs` green; `git diff
   --check` clean; no new dependency.

**Preflight:** `npm test -- --only evidence-sources` for step 2,
`npm test -- --only derived-orders` for steps 3–4 and 6,
`npm test -- --only resume` for step 5, `npm test -- --only console-docs`
for step 7, and `npm run test:docs` when a document changes (steps 9 and
10), each under `node scripts/harness.mjs bounded --`; then one
`npm test -- --review` (07-execution-guide.md §Preflight before the full
gate).

**Evidence gate:** the fixtures of criteria 1 to 3; the witnessed or
substitute run; `npm test -- --review` before `implementation-ready`;
the editions re-minted only if step 2 registers a source; a live feedback
episode only if a judged feedback source changes.

**Write-back duty:** products 04 and 06, in place; the order's decisions.

**Known issues and carry-ins:**

- Stale on 2026-10-07 and corrected above: the command exists and the
  Cost line overstates what is new; `dotln.ts` and the parity contract are
  not evidence sources; WO-061 shipped a double, the live episode is the
  vertical's intake; product 06's exit names this order; the index count.
- Decided by the 2026-10-07 pass: prose is its own source adapter (no forge
  effect); `IntentDeclared` lives in the control segment; the witness is
  WO-118's run or the substitute record (typed, prose-parsing screen).
  Reopen: a fork needs the intent filed as a forge issue.
- Blocked on WO-118 for the starter and the admission path without an
  issue binding (met: WO-118 closed at v0.80.0 on 2026-10-13); WO-190 closed (v0.71.1); the heading reads `## v1.0.0 — Teammate-ready`.
- FUP-0073 (the stranger test) is allocated here by the 2026-09-30 pass;
  this order is its exit's shape.
- FUP-eeb25ea9315438ad and FUP-2b9a8e696b38fb97 (WO-118 D013 and D018: live
  status of resident-owned work) are allocated to WO-220 (the 2026-10-17
  standard pass), because its stranger watches the console those rows describe
  (planning document §4); the activation decision reads WO-220's disposition
  of each, and if either is still open the receipt records that the console
  the stranger watches lacks that live status.
- Receipts 036 (2026-09-30) and 045 (2026-10-13), written in by the 2026-10-21
  pass: `dotln intent` keeps its draft path, so an intent outside intent-class
  coverage degrades to a draft, never a refusal (criterion 2, steps 3, 4 and
  6); a substitute run can meet criterion 4 but never claims the exit
  (criteria 4 and 5). Reopen when a product 06 section, a capability row or a
  release claims the exit while the witness records a substitute run, or when
  the operator reverses the draft-path rule with its source recorded.

**Non-goals:** the loop's primitives and the resident (WO-118); a chat
interface; the Angular shell (WO-083's fork); teaching the taxonomy (the
receipt hides it); running the target's own release.

**Operator-review assumptions**

1. The stranger test is the `v1.0.0` exit and belongs after WO-118, the
   product exit of the critical path; filing it now gives the run its
   name and shape without moving it ahead of the loop.
2. A non-author's run is the operator's to arrange; the substitute run is
   recorded as such and never as the exit.
