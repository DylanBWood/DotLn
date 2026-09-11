# WO-117 — Console live host: the text console runs as a client of the resident, showing live agent status, work-order statuses and the audit view, and invoking the parity commands, proven in one operator-witnessed session (version assigned at activation)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** any capable model; the witnessed session uses the real resident
and harness. State the model and effort actually run (07-execution-guide.md
§Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. The console package's live mode and the
evidence record. Assigned at activation under the standing opt-out default.
**Nomination provenance:** the operator's 2026-09-08 mid-pass direction
(the runtime's UI to author, inspect, audit, and see live agent and
work-order status); the reference host in core is the text console; the
Angular shell in the operator's fork is the second host. Planner-synthesized
draft; captures and hashes in the ledger section of that date. Opaque
identifier, not a priority. Clean-room screen: no stop condition.
**Depends on:** WO-114 merged (the status projection); WO-115 merged (the
commands); WO-116 merged (the audit view); WO-099 merged (a live resident
with something to show).
**Recommended placement:** after WO-116; it edits `packages/console` and
adds `docs/evidence/WO-117/`. A recommendation, not a dependency token.

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
equal and §Later console hosts; 13-uifa-roles.md §UIFA showrunner;
`packages/console/README.md`.

**Objective:** `npm run console -- live` connects to the resident's
loopback surface, renders the status projection with live refresh, the
work-order statuses, and the audit view, and invokes the parity commands
(equip preview, compiled diff, `away`, `back`, activate, file an intent)
from the terminal UI; one witnessed session records the operator authoring
a build change, marking away, watching a cadence fire and an actor run, and
auditing the episode.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- The console renders fixtures and control state at rest; no live mode
  exists.

**Design (scope discipline):**

- The live mode is a client; all authority stays in the resident and the
  terminal commands.
- **Declined alternatives, recorded:** a web UI in core (the fork's shell
  is the second host).

**Deliverables:** the live mode, fixtures with a fixture resident, the
witnessed receipt, the write-backs below.

**Acceptance criteria (all required)**

1. Against a fixture resident, the live mode renders the projection,
   refreshes on change, and invokes each contract command with the same
   events as the terminal.
2. The witnessed session's receipt shows the four actions above with
   identifiers reduced to shapes.
3. Write-backs land: 04 §Later console hosts, README "What runs today" (one
   sentence), console README, ledger entry; the capability table gains a
   dated `console.live` row.
4. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the fixture transcripts; the receipt; `npm test`.

**Write-back duty:** as listed in criterion 3.

**Non-goals:** drag-and-drop (the fork's shell); remote access.

**Operator-review assumptions**

1. The operator witnesses the session outside the sandbox.
