# WO-117 — Console live host: the text console runs as a client of the resident, showing live agent status, work-order statuses and the audit view, and invoking the parity commands, proven in one operator-witnessed session (v0.56.0)

**Model:** any capable model; the witnessed session uses the real resident
and harness. State the model and effort actually run (07-execution-guide.md
§Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. The console package's live mode, the
resident's index-source hardening and the evidence record. Assigned at
activation under the standing opt-out default.
**Cost:** adds one `live` action to the console CLI that shows the status
projection with refresh, the work-order statuses and WO-116's audit
render in one view and invokes contract commands through WO-115's
client; fixtures with a fixture resident; the resident index-source
hardening the register allocated here (a guarded launchpad and index
resolution in the resident CLI, a `readIndex` that reads only a regular
file, a sweep of stale status temporaries, three regressions); at most
400 bytes in product 04; one README sentence folded; the console README;
one appended capability-table section; the witnessed session record.
Removes: supervising the resident today takes three console actions and
a terminal, and nothing shows the audit beside the status. It is the last
step of gate U of the critical path, and WO-118 depends on it. Re-mints:
`packages/skeleton/src/resident-store.ts` is among the common sources of
every evidence inventory (`scripts/lib/evidence-sources.mjs`), so each
edition selected in `docs/evidence/current.json` owes a deterministic
re-mint; the feedback verifier does not judge it, so no live episode;
`packages/skeleton/src/dotln.ts` and `packages/console` are unregistered.
Wall-clock, tokens and context bytes are unknown until run.
**Nomination provenance:** the operator's 2026-09-08 mid-pass direction
(the runtime's UI to author, inspect, audit, and see live agent and
work-order status); the reference host in core is the text console; the
Angular shell in the operator's fork is the second host. Planner-synthesized
draft; captures and hashes in the ledger section of that date. Opaque
identifier, not a priority. Clean-room screen: no stop condition. Amended
by the 2026-09-28 planning pass, which re-observed the order on `main` at
`5f3849ec`: status refresh, `commands` and `invoke` already ship, so the
order adds the combined mode; the equip preview and build authoring have
no terminal command and leave the order; the allocated register row
becomes criterion 3; the witnessed session has a fallback and the final
criterion names both gates
([planning document](../planning/failures-across-phases-2026-09-28.md)
§10).
**Depends on:** WO-114 merged (the status projection; closed, v0.47.0);
WO-115 merged (the commands; closed, v0.52.0); WO-116 merged (the audit
view); WO-099 merged (a live resident with something to show; closed,
v0.37.0).
**Recommended placement:** paired with WO-086 in the fourth slot, after
WO-116. This order edits `packages/console`, the resident CLI in
`packages/skeleton/src/dotln.ts`, `packages/skeleton/src/resident-store.ts`,
their tests, product 04, one sentence of the README's "What runs today",
the console README and the capability table; WO-086 edits the release
scripts, the docs check, products 06, 10 and 07 and other parts of the
README. Neither depends on the other; neither re-mints for the other. A
recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-114",
    "relation": "hard",
    "reason": "the status projection"
  },
  {
    "workOrderId": "WO-115",
    "relation": "hard",
    "reason": "the commands"
  },
  {
    "workOrderId": "WO-116",
    "relation": "hard",
    "reason": "the audit view"
  },
  {
    "workOrderId": "WO-099",
    "relation": "hard",
    "reason": "a live resident with something to show"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 04-interfaces.md §Terminal first, console
equal, §Console parity contract v1 and §Later console hosts;
13-uifa-roles.md §UIFA showrunner; `packages/console/README.md`;
`packages/console/src/cli.ts` (the shipped actions);
`docs/evidence/WO-114/decisions.md` WO-114-D013 and register row
FUP-4656197433cb8b3d (the hardening); `packages/skeleton/src/dotln.ts`
and `packages/skeleton/src/resident-store.ts` (`readIndex`); README.md
§What runs today (its rewrite-not-append rule);
`scripts/lib/plan-continuation.mjs` (capability additions are appended
dated sections); the
[2026-09-28 planning document](../planning/failures-across-phases-2026-09-28.md)
§10.1.

**Objective:** `npm run console -- live --store <dir>` connects to the
resident's loopback surface and shows, in one refreshing view, the status
projection, the work-order statuses and the audit view, and invokes
contract commands (compiled diff, `away`, `back`, activate, file an
intent, and the rest the contract holds) through WO-115's client. One
witnessed session records the operator marking away and back, watching a
cadence fire and an actor run, viewing a compiled diff and auditing the
episode. The resident CLI degrades instead of failing on a bad index
source.

**Observed gap (dated 2026-09-28, `main` at `5f3849ec`; first observed
2026-09-08 at `33e2c25`):**

- The console CLI's actions are `board`, `status` (with `--watch`, since
  WO-114), `commands` and `invoke` (since WO-115). No action combines
  them, and no audit view exists until WO-116.
- The command contract holds 23 identifiers at `5f3849ec` and none for an
  equip preview or saved-build selection; product 04 says a new
  identifier needs a terminal command and a named order first.
- WO-114's second verification boarded two index-source defects (D013):
  `dotln resident` refuses to start with a generic message when
  `DOTLN_LAUNCHPAD` names a missing directory or the launchpad's
  configuration is malformed, and `readIndex` blocks on a FIFO at the
  index path so the host never starts. The register allocated them here
  on 2026-09-27; WO-115 closed without taking them.

**Design (scope discipline):**

- The live mode is a client; all authority stays in the resident and the
  terminal commands. It adds no identifier to the contract.
- An unresolvable launchpad, a malformed configuration and an index that
  is not a regular file each leave the resident running with orders
  unavailable and the cause named in the status projection; stale
  `.runtime-status-*.tmp` files are removed when the resident acquires
  its lifetime.
- **Declined alternatives, recorded:** a web UI in core (the fork's shell
  is the second host); an equip preview (no terminal command exists;
  reopen when an order adds one); refusing to start on a bad index source
  (the console would have nothing to show; reopen when a resident
  function other than the order list needs the index).

**Deliverables:** the live mode, the hardening and its regressions,
fixtures with a fixture resident, the witnessed record, the write-backs
below.

**Acceptance criteria (all required)**

1. Against a fixture resident, the live mode renders the status
   projection, the work-order statuses and the audit view, and refreshes
   when the store changes. For one read-only and one mutating contract
   command, and for WO-116's audit command, an invocation from the live
   mode returns the bytes `console invoke` returns for the same store and
   input, and the store gains the command's ordinary events plus exactly
   the `ConsoleCommandInvoked` and `ConsoleCommandObserved` receipts
   product 04 names.
2. The operator's witnessed session against the real resident records,
   with identifiers reduced to shapes: marking away and back, a cadence
   firing and an actor running in the live view, a compiled diff viewed,
   and the episode audited. If the session has not run by handoff, the
   executor records this criterion unmet with the command the operator
   runs; the other criteria are judged; the criterion closes by the
   operator's run or by a recorded waiver.
3. A missing `DOTLN_LAUNCHPAD`, a malformed configuration and a FIFO in
   place of the index each leave the resident running with orders
   unavailable and the cause in the status projection; a stale status
   temporary is gone after lifetime acquire; each has a regression.
4. Write-backs land, in place with no dated paragraph: 04 §Later console
   hosts (the live host) and the index-source sentences the hardening
   changes (at most 400 bytes added in 04 together, against 1,194 bytes
   of headroom on 2026-09-28; WO-116, WO-081 and WO-083 also write 04, so
   the executor re-measures the headroom at its base, and where the bound
   does not fit it consolidates the section it edits in the same change;
   a ceiling is raised only by a planning-document decision); one
   sentence folded into README §What runs today, rewriting what it
   supersedes, as the block's own rule says; the console README; an
   appended `## WO-117 dated addition (YYYY-MM-DD)` section in the
   capability table assessing `console.live`; the decisions file; the
   publication locks refreshed.
5. `npm test -- --review` and `npm run test:docs` green; `git diff
   --check` clean; no new dependency.

**Evidence gate:** the fixture transcripts; the regressions; the
witnessed record, or the unmet criterion and its command; `npm run
test:docs`; `npm test -- --review` before `implementation-ready`, because
`packages/skeleton/src/resident-store.ts` is a declared source of the
harness-fixtures and harness suites, and again at final review. The live
row is the operator's session.

**Write-back duty:** as listed in criterion 4.

**Non-goals:** drag-and-drop (the fork's shell); remote access; an equip
preview or saved-build selection; the authoring journey through the live
client (a map candidate after WO-095 and this order); a new contract
identifier.

**Operator-review assumptions**

1. The witnessed session is the operator's; the executor prepares its
   command and the record's shape.
2. A bad index source degrades to orders unavailable rather than refusing
   to start, so the console always has a resident to show.
