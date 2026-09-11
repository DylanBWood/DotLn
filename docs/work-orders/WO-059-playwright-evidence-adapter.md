# WO-059 — Playwright evidence adapter: a workspace package outside the kernel and compiler drives a synthetic local application and produces the visual and network witnesses, closes or recovers the browser on a kill, and replays a saved scenario (version assigned at activation)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. A new workspace package with the first
runtime dependency in the repository, pinned; kernel and compiler unchanged.
Assigned at activation under the standing opt-out default.
**Nomination provenance:** the 2026-09-08 critical-path planning pass (gate
F, the adapter slice), cut as a bounded order at the operator's same-day
correction; the operator's "walk the app" practice. Planner-synthesized
draft; captures and hashes in the ledger section of that date. Opaque
identifier, not a priority. Clean-room screen: no stop condition.
**Depends on:** WO-057 merged (the observed runtime rows and the recorded
dependency decision); WO-058 merged (the claim types and witness rules this
adapter produces).
**Recommended placement:** after WO-057 and WO-058; it adds
`packages/browser-evidence/` and edits the root workspace manifest, the
lockfile, `NOTICE` or the third-party inventory, and product 03. A
recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-057",
    "relation": "hard",
    "reason": "the observed runtime rows and the recorded dependency decision"
  },
  {
    "workOrderId": "WO-058",
    "relation": "hard",
    "reason": "the claim types and witness rules the adapter produces"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 03-architecture.md §Ports (the evidence
adapter boundary) and §Layer diagram; ADR-0002 with WO-057's amendment;
`docs/LEGAL.md` (the third-party material rule); 02-domain-model.md §Independent
verification v1; `docs/discovery/browser-runtime-<date>.md` (WO-057's
rows); `packages/skeleton/src/verification-host.ts` (where witnesses enter a
capsule).

**Objective:** Implement the port: given a scenario (navigate, interact,
assert) over a small synthetic local web application checked into the
package's fixtures, produce `screenshot`, `dom-snapshot`,
`accessibility-snapshot`, `network-trace` and `console-capture` witnesses
bound to criterion ids, retain the trace, close the browser and context on
completion, close or recover on a SIGKILL of the host, and replay a saved
scenario deterministically enough that a replacement verifier reproduces the
same DOM and network witnesses (screenshots compared by the rule WO-057
observed).

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- No product code can drive a browser; the witness kinds from WO-058 have no
  producer.

**Design (scope discipline):**

- `packages/browser-evidence` with one exported `runScenario(scenario, env)`
  returning witnesses; the dependency pinned to the version WO-057 observed;
  the package is never imported by the kernel, compiler or skeleton at
  build time (the verification host loads it by name at runtime when a
  capsule declares a browser scenario).
- The synthetic application: static pages served from the package's
  fixtures with one form, one fetch and one deliberate console error page.
- Kill behavior follows WO-057's row: if a browser process can survive the
  parent, the adapter records a PID file and the host reaps it on recovery.
- The third-party inventory entry and NOTICE update land with the
  dependency, per the legal gate.
- **Declined alternatives, recorded:** requiring the harness's connected
  server; a headed browser; screenshot pixel-equality as the visual rule if
  WO-057 observed unequal hashes (then the rule is the observed one).

**Deliverables:** the package, fixtures, the synthetic application, the
inventory entry, the write-backs below.

**Acceptance criteria (all required)**

1. Over the synthetic application, a scenario produces all five witness
   kinds bound to criterion ids, and the WO-058 fold accepts them.
2. The console-error page yields a `console-capture` witness that fails the
   scenario's criteria.
3. A kill fixture leaves no browser process after recovery, by process-table
   observation.
4. A saved scenario replays to identical DOM and network witnesses; the
   screenshot rule is the one WO-057 recorded and the fixture states it.
5. The adapter runs with the connected server's environment removed; kernel,
   compiler and skeleton `package.json` files gain no dependency; the
   inventory and NOTICE entries exist.
6. Write-backs land: 03 §Ports (the adapter), README "What runs today" (one
   sentence), the capability table (a dated `evidence.browser` row), ledger
   entry; publication index rows and locks if a product heading changed.
7. `npm test` green; `git diff --check` clean; the one new dependency is the
   pinned adapter dependency only.

**Evidence gate:** the fixture transcripts; `npm test`.

**Write-back duty:** as listed in criterion 6.

**Non-goals:** OCR; the console UI; the Angular application (WO-112 is the first
real consumer; the fork's Angular run is the first UI consumer); a live proof on a real target.

**Operator-review assumptions**

1. A pinned runtime dependency in an adapter package is consistent with
   ADR-0002 as amended by WO-057.
