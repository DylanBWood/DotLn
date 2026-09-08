# WO-115 — Console parity contract: every command a UI host may invoke is the same command the terminal runs, exposed through one local loopback surface the resident serves under the compiled authority, with no second authority path (version assigned at activation)

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
WO-114 merged (the status projection the surface reads).
**Recommended placement:** after WO-114; it adds the contract and the
loopback server to the resident and a client in `packages/console`. A
recommendation, not a dependency token.

**Cites (read these sections):** 04-interfaces.md §Terminal first, console
equal, §Candidate — exact operator command vocabulary and §Community build
workshop; 03-architecture.md §Composition system (equip preview; compiled
diff); 07-execution-guide.md §Operator resume phrases; `packages/skeleton/src/cli.ts`
and `dotln.ts` (the terminal commands); `scripts/resume.mjs`.

**Objective:** One typed command contract (`console-commands-v1`) lists the
commands a UI host may invoke: the `resume:` phrases, `worktree` lifecycle,
`harness emit` and `check`, equip preview and compiled diff for a build,
saved-build selection, declaring a portfolio, `away` and `back`, activating
an order, filing an intent as a work-order draft, and the read projections
(status, audit); the resident serves them over a loopback socket bound to
the local user only, executing exactly the terminal's implementation under
the same compiled envelope, so a UI cannot do what the terminal cannot; the
console's text host and the fork's Angular shell are both clients.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- The board is read-only and the terminal is the only command surface;
  authoring in a UI has no contract.

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
