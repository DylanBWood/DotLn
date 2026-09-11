# WO-115 — Console parity contract: every command a UI host may invoke is the same command the terminal runs, exposed through one local loopback surface the resident serves under the compiled authority, with no second authority path (version assigned at activation)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. A command contract and a loopback
surface in the resident; the terminal commands are unchanged. Assigned at
activation under the standing opt-out default.
**Nomination provenance:** the planning map's wave-5 candidate "Console
parity contract and drag-equip authoring" (the contract half, allocated
here), 04-interfaces.md §Candidate — exact operator command vocabulary, and
the operator's 2026-09-08 mid-pass direction that the runtime has the UI to
author and to inspect. Planner-synthesized draft; captures and hashes in
the ledger section of that date. Opaque identifier, not a priority.
Clean-room screen: no stop condition.
**Depends on:** WO-068 merged (the resident that serves the surface);
WO-114 merged (the status projection the surface reads); WO-120 merged
(`intent` and derived-order activation exist as terminal commands);
WO-100 merged (declaring a portfolio exists as a terminal command).
**Recommended placement:** after WO-114; it adds the contract and the
loopback server to the resident and a client in `packages/console`. A
recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-068",
    "relation": "hard",
    "reason": "the resident serves the surface"
  },
  {
    "workOrderId": "WO-114",
    "relation": "hard",
    "reason": "the status projection the surface reads"
  },
  {
    "workOrderId": "WO-120",
    "relation": "hard",
    "reason": "intent and derived-order activation exist as terminal commands"
  },
  {
    "workOrderId": "WO-100",
    "relation": "hard",
    "reason": "declaring a portfolio exists as a terminal command"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 04-interfaces.md §Terminal first, console
equal, §Candidate — exact operator command vocabulary and §Community build
workshop; 03-architecture.md §Composition system (equip preview; compiled
diff); 07-execution-guide.md §Operator resume phrases; `packages/skeleton/src/cli.ts`
and `dotln.ts` (the terminal commands); `scripts/resume.mjs`.

**Objective:** One typed command contract (`console-commands-v1`) lists
exactly the commands that exist as terminal implementations at activation:
the `resume:` phrases, the `worktree` lifecycle, `harness emit` and
`check`, the compiled diff and loadout selection the skeleton CLI offers,
`intent` and derived-order activation (WO-120), declaring a portfolio
(WO-100), `away` and `back` (WO-068), and the read projections (status;
audit once WO-116 lands); a command with no terminal implementation is not
in the contract, and adding one is a named order; the resident serves them over a loopback socket bound to
the local user only, executing exactly the terminal's implementation under
the same compiled envelope, so a UI cannot do what the terminal cannot; the
console's text host and the fork's Angular shell are both clients.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- The board is read-only and the terminal is the only command surface;
  authoring in a UI has no contract; the skeleton CLI today offers `status`,
  `demo`, `verify-demo`, `feedback-audit`, `--audit`, `--compiled-diff` and
  `--beacons`, and no intent or saved-build command.

**Design (scope discipline):**

- Commands are dispatched to the same functions the CLI calls; every
  invocation is an event with the actor `console`; refusals are the
  terminal's refusals.
- **Declined alternatives, recorded:** a UI-only command; a network-exposed
  server; a second authority table.

**Deliverables:** the contract, the loopback surface, the console client,
fixtures, the write-backs below.

**Acceptance criteria (all required)**

1. For each contract command, a fixture invocation over loopback produces
   the same result bytes and the same events as the terminal command.
2. A command outside the contract, a caller not on the local user's
   loopback, and a command the envelope denies are refused with the
   terminal's refusal shape.
3. Every invocation appends an event naming the `console` actor; a replay
   reproduces the results.
4. Write-backs land: 04 §Terminal first, console equal (the contract), 07
   (one sentence), console README, ledger entry; the map's wave-5 candidate
   marked allocated for its contract half.
5. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the fixture transcripts; `npm test`.

**Write-back duty:** as listed in criterion 4.

**Non-goals:** drag-equip authoring itself (the fork's shell, over this
contract); remote access; authentication beyond the local user.

**Operator-review assumptions**

1. Loopback bound to the local user is the right first boundary for an
   offline app.
