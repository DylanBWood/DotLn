# WO-183 — Intent declaration and the stranger test: one command takes a bounded intent in prose, compiles it through the StoryContract into a durable derived work order with a fire-and-forget receipt over the parity contract, carries it through the resident-owned loop, and is exercised once by a person who has not read these documents (version assigned at activation)

**Model:** any capable model; the witnessed run uses the actual local
harnesses as the loop's actors. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer any.
**Release classification:** minor. One terminal and console command over
the parity contract, one receipt shape, one witnessed run; no change to
the loop's primitives. Assigned at activation under the standing opt-out
default.
**Cost:** adds `dotln intent "<prose>" [--target <registered repository>]`
in `packages/skeleton/src/dotln.ts` (and the parity contract's loopback
form, product 04 §Console parity contract v1) that admits the intent
under the portfolio's `intent` class (WO-123), interprets it into a
StoryContract with a labeled inference episode (WO-061), materializes the
durable derived order (WO-120) and returns a receipt naming the order,
where its progress can be watched (the live console, WO-117) and the one
question the loop may ask; one `IntentDeclared` event; fixtures with
doubles; one witnessed run by a non-author on the starter instance WO-118
exports, recorded with shapes and the person's own words paraphrased; at
most 300 bytes in product 06 §v1.0.0 and 200 in product 04 in place.
Removes: the hand-written work order as the only way an intent enters
this repository (the map's candidate since 2026-09-06), and the absence
of any order for the `v1.0.0` exit. Re-mints: `dotln.ts` and the parity
contract's sources are registered evidence sources (deterministic
re-mint); the executor checks `FEEDBACK_SOURCE_PATHS`. Wall-clock, tokens
and context bytes are unknown until run.
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
**Depends on:** WO-118 merged (the resident-owned loop the intent enters
and the exported starter instance); WO-115 merged (the parity contract;
closed); WO-120 merged (derived work identity; closed).
**Recommended placement:** immediately after WO-118 in the serial run,
before WO-113, as a single entry; it is the product exit the run leads
to and shares WO-118's surfaces. A recommendation, not a dependency
token.

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
`intent` portfolio class); `docs/work-orders/WO-061-storycontract-compile.md`
(the labeled inference episode); `docs/work-orders/WO-120-*.md` (derived
identity); `packages/skeleton/src/dotln.ts`; the console's loopback
command surface.

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

**Deliverables:** the command and its loopback form, the event, the
receipt, fixtures with doubles; the witnessed run's record; the two
product write-backs; the decisions.

**Acceptance criteria (all required)**

1. `dotln intent "<prose>"` on the exported starter with a registered
   scratch target and standing grants returns a receipt naming a derived
   order that `resume status` lists, the console command to watch it, and
   the pending decision or its absence; a fixture with doubles asserts the
   receipt's fields and the `IntentDeclared` event.
2. An intent for an unregistered target, or under a portfolio without
   the `intent` class, is refused with the reason in plain words and no
   event; a fixture asserts both.
3. The same intent through the console's loopback command surface yields
   the same receipt (parity), asserted by the console's fixtures.
4. One witnessed run by a non-author on the exported instance, recorded
   in `docs/evidence/WO-183/witness.md` with shapes and the person's
   paraphrased reading, or the fallback substitute run with the pending
   observation named.
5. Write-backs: product 06 §v1.0.0 and product 04, in place, within the
   stated bytes; `docs/evidence/WO-183/decisions.md`; the decisions index.
6. `npm test -- --review` and `npm run test:docs` green; `git diff
   --check` clean; no new dependency.

**Evidence gate:** the fixtures of criteria 1 to 3; the witnessed or
substitute run; `npm test -- --review` before `implementation-ready`;
the editions re-minted deterministically; a live feedback episode only if
a judged feedback source changes.

**Write-back duty:** products 04 and 06, in place; the order's decisions.

**Non-goals:** the loop's primitives and the resident (WO-118); a chat
interface; the Angular shell (WO-083's fork); teaching the taxonomy (the
receipt hides it); running the target's own release.

**Operator-review assumptions**

1. The stranger test is the `v1.0.0` exit and belongs after WO-118, the
   product exit of the critical path; filing it now gives the run its
   name and shape without moving it ahead of the loop.
2. A non-author's run is the operator's to arrange; the substitute run is
   recorded as such and never as the exit.
