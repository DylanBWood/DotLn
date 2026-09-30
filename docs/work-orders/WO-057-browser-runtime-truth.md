# WO-057 — Browser runtime truth: observe whether a Playwright runtime can be installed, launched headless and killed inside a confined checkout in this environment without the harness's connected server, and record the dependency decision as an ADR-0002 amendment (v0.56.4)

**Model:** any capable model for the probe; the executor runs every row on
the actual host, whose sessions run with network access and no host
sandbox. State the model and effort actually run (07-execution-guide.md
§Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. A discovery record and a dated decision
amendment; no runtime dependency is added by this order. Assigned at
activation under the standing opt-out default.
**Cost:** adds `docs/discovery/browser-runtime-<date>.md` and its `.json`,
one dated amendment in ADR-0002 §Amendments, one dated observation in
`docs/LEGAL.md` §Current state and one addendum at the end of
`docs/discovery/environment.md`; a throwaway scratch package outside the
workspace that is never committed. Removes the unknown WO-059 would
otherwise pin a runtime on: nothing records whether a package-level
browser runtime installs, launches and dies cleanly here without the
harness's connected server. WO-059 depends on it. Re-mints: none; no file
it edits is a registered evidence source, and
`docs/discovery/environment.json`, which is one, stays unchanged, as the
last three environment addenda left it (`scripts/lib/evidence-sources.mjs`
at `5f3849ec`). Wall-clock, tokens and context bytes are unknown until
run.
**Nomination provenance:** the 2026-09-08 critical-path planning pass (gate
F, the truth slice), cut as a bounded order at the operator's same-day
correction; the pass verified that browser automation exists in the
environment only through the harness's connected server, which the product's
adapter must not require. Planner-synthesized draft; captures and hashes in
the ledger section of that date. Opaque identifier, not a priority.
Clean-room screen: no stop condition. Amended by the 2026-09-28 planning
pass, which re-observed the order on `main` at `5f3849ec`: the connected
server is cited where the environment record holds it, the confinement and
the proxy rows are defined against what the repository holds, a row that
waits on a launch that did not happen is labeled, and the install rows
are the executor's
([planning document](../planning/failures-across-phases-2026-09-28.md)
§10).
**Depends on:** WO-004 merged (the environment record this order extends;
closed at `v0.2.1`); WO-056 (reference only: the real-repository loop
that gives the adapter a consumer; closed at `v0.33.2`, so the
recommendation is met).
**Recommended placement:** paired with WO-066 in the sixth slot, after
WO-087's one-entry slot. This order edits `docs/discovery/` (a new record
and an addendum to `environment.md`),
`docs/decisions/0002-kernel-first-agentic-core.md` §Amendments and
`docs/LEGAL.md` §Current state; WO-066 edits the publication host, the
repair derivation, the source-change worktree, their fixtures and products
02 and 06. Disjoint files; neither depends on the other; only WO-066
re-mints. WO-059, which depends on this order, edits `docs/LEGAL.md` after
it. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-004",
    "relation": "satisfied-by-close",
    "reason": "the environment record it extends"
  },
  {
    "workOrderId": "WO-056",
    "relation": "reference-only",
    "reason": "recommended after the real-repository loop so the adapter has a consumer"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 01-principles.md Principle 15; ADR-0002
Decision 3 and §Amendments (the zero-dependency posture of the kernel and
compiler; the dependency posture and the skeleton's runtime `typescript`);
`docs/LEGAL.md` §Current state (the dependency inventory) and §Decision —
2026-09-06 (the third-party material rule and the three hash declarations
`scripts/license-surfaces.mjs` reads); `docs/discovery/environment.md`
§Claude MCP capability (the connected browser server) and its addenda;
03-architecture.md §Ports (what keeps work-flavored verticals pluggable)
(`VerificationAdapter`); 07-execution-guide.md §Discipline (the
host-confinement preflight); `packages/skeleton/src/discovery-sandbox.ts`
and `packages/skeleton/src/verification-worktree.ts` (`witnessTest`: the
confinement a host-run test gets).

**Objective:** Before any adapter is written, record whether the `playwright`
package and a browser binary install from a pinned lockfile in this
environment (with and without the filtering proxy), launch headless inside a
sandbox-confined scratch checkout, produce a screenshot whose hash is stable
across two runs of the same page, close on SIGKILL of the parent without a
leaked process, and run with the harness's connected browser server absent;
then amend ADR-0002 with the decision that the browser adapter is a
dependency of a consumer package outside the kernel and compiler, with the
third-party inventory duty it triggers.

**Observed gap (dated 2026-09-28, `main` at `5f3849ec`; first observed
2026-09-08 at `33e2c25`):**

- No manifest, lockfile, installed module, source or test in the
  repository names Playwright or Puppeteer. The environment record's
  Playwright row observed browser automation only through the harness's
  connected MCP server, with browser binaries already in the per-user
  Playwright cache when it was taken (2026-08-30); that cache has not been
  re-observed.
- `docs/discovery/` holds no browser-runtime record.
- ADR-0002 §Amendments already holds a dependency posture (a runtime
  dependency only with a decision-record note naming its consumer) and
  records the skeleton's exact runtime `typescript`; what it lacks is the
  note naming a browser runtime's consumer package. The legal record names
  a `THIRD_PARTY_NOTICES` duty at the first bundled distribution.
- No harness sandbox is in force: the operator's three CLI sessions run
  without one and the host-confinement detector reports `inForce: false`
  (07 §Discipline). The OS confinement the repository applies is macOS
  `sandbox-exec` with the discovery profile, which the verification host
  gives each host-run test and which denies the network and writes outside
  its root. No discovery or product record describes a filtering proxy.

**Design (scope discipline):**

- A throwaway scratch package outside the workspace pins one Playwright
  version and one browser; rows: install online, install through the proxy
  from a warmed cache, launch headless, deterministic screenshot hash over a
  static fixture page (two runs), parent SIGKILL with process-table
  inspection, and launch with the connected server's environment removed.
- The confined launch runs under the confinement the verification host
  gives a host-run test (`sandbox-exec` with the discovery profile), since
  no harness sandbox is in force on this host.
- The proxy row records whether the host has a filtering proxy and is
  `unavailable` when it has none.
- The no-server row launches from a process that no harness session
  started and lists by name the environment variables it removed.
- Labels are observed, blocked, unavailable or ambiguous; shapes only. A row
  that needs a launch that did not happen is `blocked` and names the row it
  waited on.
- The ADR amendment is dated and names the consumer package boundary and
  the inventory duty; it commits nothing to the workspace.
- **Declined alternatives, recorded:** adding the dependency to the
  workspace now (WO-059 does, from the rows); driving the harness's server
  from the product (the product must not require the harness); a harness
  sandbox for the confined launch (none is in force; reopen when one is).

**Deliverables:** `docs/discovery/browser-runtime-<date>.md` and `.json`;
the ADR-0002 amendment; the legal observation; the write-backs below.

**Acceptance criteria (all required)**

1. The record carries every row the Design lists with its command shape
   and label; the screenshot-hash row states equal or unequal hashes
   across the two runs with the fixture page's hash, or `blocked`; the
   executor runs the install rows itself.
2. The kill row records, from a process-table observation that names the
   process ids the launch recorded, whether a browser process survived the
   parent's SIGKILL, or `blocked` naming the row it waited on.
3. The no-server row records a launch from a process no harness session
   started, with the removed variables listed by name, or `blocked` naming
   the row it waited on.
4. ADR-0002 §Amendments carries the dated amendment, which applies the
   dependency posture: it names the consumer package outside the kernel and
   compiler and the version the rows observed. `docs/LEGAL.md` §Current
   state carries the dated observation naming the inventory duty, and the
   three hash declarations under §Decision — 2026-09-06 are unchanged. No
   workspace `package.json` or lockfile changes.
5. Write-backs land: an addendum at the end of
   `docs/discovery/environment.md`, as each earlier order's is;
   `docs/discovery/environment.json` unchanged, or the decisions name the
   change and each edition it stales is re-minted; the decisions file.
6. `npm test` and `npm run test:docs` green; `git diff --check` clean; no
   runtime source or dependency change.

**Evidence gate:** the record and its JSON; `npm test` and
`npm run test:docs` before `implementation-ready` and at final review. The
live rows are the executor's install rows.

**Write-back duty:** as listed in criterion 5.

**Non-goals:** the adapter (WO-059); the claim types (WO-058); OCR; any
Angular content; a harness sandbox; configuring a filtering proxy on the
host.

**Operator-review assumptions**

1. The executor runs the online rows; a blocked or unavailable proxy row
   is a valid result that WO-059 designs around.
2. The confined launch uses the verification host's `sandbox-exec`
   confinement; a harness sandbox replaces it once one is in force.
3. A row whose launch did not happen is recorded `blocked`, which meets
   criteria 2 and 3 and leaves WO-059 waiting on a rerun.
