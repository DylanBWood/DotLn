# WO-057 — Browser runtime truth: observe whether a Playwright runtime can be installed, launched headless and killed inside a confined checkout in this environment without the harness's connected server, and record the dependency decision as an ADR-0002 amendment (version assigned at activation)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** any capable model for the probe; the rows need the actual host,
run by the operator from a terminal outside the sandbox where network access
is needed. State the model and effort actually run (07-execution-guide.md
§Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. A discovery record and a dated decision
amendment; no runtime dependency is added by this order. Assigned at
activation under the standing opt-out default.
**Nomination provenance:** the 2026-09-08 critical-path planning pass (gate
F, the truth slice), cut as a bounded order at the operator's same-day
correction; the pass verified that browser automation exists in the
environment only through the harness's connected server, which the product's
adapter must not require. Planner-synthesized draft; captures and hashes in
the ledger section of that date. Opaque identifier, not a priority.
Clean-room screen: no stop condition.
**Depends on:** WO-004 merged (the environment record this order extends;
closed).
**Recommended placement:** any free lane; recommended after WO-056 so the
adapter has a consumer, but nothing blocks it. It edits `docs/discovery/`,
`docs/decisions/0002-kernel-first-agentic-core.md` (a dated amendment) and
`docs/LEGAL.md` (one dated observation). A recommendation, not a dependency
token.

**Cites (read these sections):** 01-principles.md Principle 15; ADR-0002
(the zero-dependency posture of the kernel and compiler; consumers may carry
adapters); `docs/LEGAL.md` (the third-party material rule); `docs/discovery/environment.md` (the record shape and its
addenda); `docs/discovery/harness-smoke-2026-09-07.md` (the connected
browser server observed there); 03-architecture.md §Ports (the evidence
adapter boundary).

**Objective:** Before any adapter is written, record whether the `playwright`
package and a browser binary install from a pinned lockfile in this
environment (with and without the filtering proxy), launch headless inside a
sandbox-confined scratch checkout, produce a screenshot whose hash is stable
across two runs of the same page, close on SIGKILL of the parent without a
leaked process, and run with the harness's connected browser server absent;
then amend ADR-0002 with the decision that the browser adapter is a
dependency of a consumer package outside the kernel and compiler, with the
third-party inventory duty it triggers.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- Browser automation exists in the environment only as the harness's
  connected server; no product code can drive a browser, and no record says
  whether a package-level runtime installs or launches here.
- ADR-0002 keeps the kernel and compiler dependency-free and says nothing
  about a runtime dependency in an adapter package; the legal record names a
  third-party notices duty at the first bundled artifact.

**Design (scope discipline):**

- A throwaway scratch package outside the workspace pins one Playwright
  version and one browser; rows: install online, install through the proxy
  from a warmed cache, launch headless, deterministic screenshot hash over a
  static fixture page (two runs), parent SIGKILL with process-table
  inspection, and launch with the connected server's environment removed.
- Labels are observed, blocked, unavailable or ambiguous; shapes only.
- The ADR amendment is dated and names the consumer package boundary and
  the inventory duty; it commits nothing to the workspace.
- **Declined alternatives, recorded:** adding the dependency to the
  workspace now (WO-059 does, from the rows); driving the harness's server
  from the product (the product must not require the harness).

**Deliverables:** `docs/discovery/browser-runtime-<date>.md` and `.json`;
the ADR-0002 amendment; the legal observation; the write-backs below.

**Acceptance criteria (all required)**

1. The record carries every row above with its command shape and observed
   result; the screenshot-hash row states equal or unequal hashes across the
   two runs with the fixture page's hash.
2. The kill row records whether a browser process survived the parent's
   SIGKILL, from a process-table observation.
3. The no-server row records a launch with the connected server's
   environment removed.
4. ADR-0002 carries the dated amendment and `docs/LEGAL.md` the dated
   observation naming the inventory duty; no workspace `package.json` or
   lockfile changes.
5. Write-backs land: `environment.md` addendum, ledger entry.
6. `npm test` green; `git diff --check` clean; no runtime source or
   dependency change.

**Evidence gate:** the record and its JSON; `npm test`.

**Write-back duty:** as listed in criterion 5.

**Non-goals:** the adapter (WO-059); the claim types (WO-058); OCR; any
Angular content.

**Operator-review assumptions**

1. The online rows are operator-run outside the sandbox; a blocked proxy row
   is a valid result that WO-059 designs around.
