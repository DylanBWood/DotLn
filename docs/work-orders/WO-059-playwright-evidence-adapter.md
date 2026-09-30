# WO-059 — Playwright evidence adapter: a workspace package outside the kernel and compiler drives a synthetic local application and produces the visual and network witnesses, closes or recovers the browser on a kill, and replays a saved scenario (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. A new workspace package whose pinned
third-party runtime dependency is the repository's second, after the
skeleton's exact `typescript`; kernel and compiler unchanged. Assigned at
activation under the standing opt-out default.
**Cost:** adds `packages/browser-evidence/` with one exported
`runScenario`, its synthetic application and fixtures, the dependency
pinned to the version WO-057 observed and its lockfile entries, a suite
row in `scripts/test-runner.mjs`, one dependency inventory paragraph in
`docs/LEGAL.md`, at most 400 bytes in product 03, one sentence in README
§What runs today and one capability-table addition. Removes the gap
between WO-058's witness kinds and a producer: no product code can drive a
browser. WO-123 depends on it. Re-mints: `package-lock.json` is a
registered evidence source in every edition and a source the feedback
verifier judges, whose projection keeps registry dependencies, so the
authority, artifact-identity, verification and harness editions are
re-minted deterministically and the executor runs one live self-host
episode for the feedback edition on Codex `gpt-6.1-sol` at `max` or Claude Code `claude-opus-5-5` at `xhigh`, with the console re-pinned to the new
feedback edition; the root `tsconfig.json`
joins the deterministic re-mint if the package is TypeScript, and
`packages/skeleton/src/evidence-editions.mjs` if the package's release
label is normalized beside the five components'. Wall-clock, tokens and
context bytes are unknown until run.
**Nomination provenance:** the 2026-09-08 critical-path planning pass (gate
F, the adapter slice), cut as a bounded order at the operator's same-day
correction; the operator's "walk the app" practice. Planner-synthesized
draft; captures and hashes in the ledger section of that date. Opaque
identifier, not a priority. Clean-room screen: no stop condition. Amended
by the 2026-09-28 planning pass, which re-observed the order on `main` at
`5f3849ec`: the dependency is not the repository's first, the witnesses
enter a capsule through the caller's host preparation so the compiler and
the verification host stay unchanged, `NOTICE` stays pinned while the
legal record's inventory takes the dependency, and the re-mints, the
bounded write-backs and both gates are named
([planning document](../planning/failures-across-phases-2026-09-28.md)
§10).
**Depends on:** WO-057 merged (the observed runtime rows and the recorded
dependency decision); WO-058 merged (the claim types and witness rules this
adapter produces).
**Recommended placement:** second of the serial run, after WO-058. This
order adds `packages/browser-evidence/` and edits `package-lock.json`,
`scripts/test-runner.mjs`, `docs/LEGAL.md` §Current state, product 03
§Ports, README §What runs today and `docs/planning/capability-table.md`,
and the root `tsconfig.json` if the package is TypeScript; the root
manifest's `workspaces` glob already takes the package in. WO-057 edits
`docs/LEGAL.md` before it; WO-060 writes 03 §Ports before it, and WO-124
and WO-062 after it. A recommendation, not a dependency token.

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

**Cites (read these sections):** 03-architecture.md §Ports (what keeps
work-flavored verticals pluggable) (`VerificationAdapter`) and §Layer
diagram; ADR-0002 Decision 3 and §Amendments (the dependency posture;
WO-057 adds the browser runtime's note); `docs/LEGAL.md` §Current state
(the dependency inventory) and §Decision — 2026-09-06 (third-party
material; the three pinned hashes); 02-domain-model.md §Independent
verification v1; `docs/work-orders/WO-057-browser-runtime-truth.md` (the
rows its record carries); `docs/work-orders/WO-058-visual-and-network-claim-types.md`
(the witness kinds and rules);
`packages/skeleton/src/verification-worktree.ts`
(`prepareWorktreeVerification` and `witnessTest`: a host witness is built
before `VerificationOpened`; read, not edited);
`scripts/license-surfaces.mjs` (the workspace manifest rules and the
pinned `NOTICE` hash); `scripts/test-runner.mjs` (the package suites);
`scripts/build.mjs` (the project references the root `tsconfig.json`
names); `packages/skeleton/src/evidence-editions.mjs` (the normalized
components); `packages/skeleton/README.md` §Feedback compiler and bounded
self-hosting (the live episode's commands); the
[2026-09-28 planning document](../planning/failures-across-phases-2026-09-28.md)
§10.1.

**Objective:** Implement the port: given a scenario (navigate, interact,
assert) over a small synthetic local web application checked into the
package's fixtures, produce `screenshot`, `dom-snapshot`,
`accessibility-snapshot`, `network-trace` and `console-capture` witnesses
bound to criterion ids, retain the trace, close the browser and context on
completion, close or recover on a SIGKILL of the host, and replay a saved
scenario deterministically enough that a replacement verifier reproduces the
same DOM and network witnesses (screenshots compared by the rule WO-057
observed).

**Observed gap (dated 2026-09-28, `main` at `5f3849ec`; first observed
2026-09-08 at `33e2c25`):**

- No source, test, manifest or lockfile names Playwright or Puppeteer, and
  the witness kinds this adapter produces arrive with WO-058.
- The skeleton carries `typescript` `7.0.2` as an exact runtime
  dependency, recorded in ADR-0002's amendments and in the legal record's
  dependency inventory, so a browser runtime would be the repository's
  second; the kernel and compiler have none.
- The root manifest's `workspaces` is `["packages/*"]`, which takes a new
  package in. The license-surfaces check, which `npm test` runs, refuses
  any other value and requires every workspace manifest to carry
  `license: "Apache-2.0"`, `private: true` and the exact `prepublishOnly`
  guard. `NOTICE` names no dependency; its SHA-256 is pinned in
  `scripts/license-surfaces.mjs` and declared in `docs/LEGAL.md`.
- A host witness enters a capsule as subject evidence the caller records
  through `VerificationOpened`: WO-054's host-run tests are built by
  `prepareWorktreeVerification` before it, and a capsule refuses a field
  it does not know.
- The runner's package suites are the kernel's, compiler's, skeleton's and
  console's; the build compiles the packages the root `tsconfig.json`
  references and fails on a package with its own `tsconfig.json` that
  emits nothing.

**Design (scope discipline):**

- `packages/browser-evidence` with one exported `runScenario(scenario, env)`
  returning witnesses; the dependency pinned to the version WO-057 observed;
  the package is never imported by the kernel, compiler or skeleton at
  build time. The caller's host preparation runs a scenario before
  `VerificationOpened` and records its witnesses as subject evidence, as
  WO-054's host-run tests enter; the verification host does not load the
  package and no capsule field declares a scenario, so the kernel, the
  compiler and `packages/skeleton/src/verification-host.ts` are unchanged.
- The package's manifest carries the license, the private flag and the
  publish guard the license-surfaces check requires; the root manifest is
  not edited.
- The synthetic application: static pages served from the package's
  fixtures with one form, one fetch and one deliberate console error page.
- Kill behavior follows WO-057's row: if a browser process can survive the
  parent, the adapter records a PID file and the host reaps it on recovery.
- A browser that cannot launch yields `unavailable` witnesses with the
  reason, never a pass, as the contract rules for an unavailable runner;
  the package's suite fails, naming the install command, when the pinned
  browser is absent, so a session installs it before the gate.
- The dependency is recorded where the legal record keeps its inventory:
  a dated dependency inventory paragraph in `docs/LEGAL.md` §Current
  state, as WO-142's is. `NOTICE` is unchanged: it names no dependency,
  and a `THIRD_PARTY_NOTICES` file becomes due only when a built or
  bundled artifact is distributed, which this order does not do.
- **Declined alternatives, recorded:** requiring the harness's connected
  server; a headed browser; screenshot pixel-equality as the visual rule if
  WO-057 observed unequal hashes (then the rule is the observed one); the
  verification host loading the package by name at dispatch (it needs a
  capsule field the compiler's closed schema refuses, against kernel and
  compiler unchanged; reopen when a consumer needs a browser driven at
  dispatch); editing `NOTICE` (pinned by hash, and changing it needs
  review; reopen at a bundled distribution or at the operator's legal
  review).

**Deliverables:** the package, fixtures, the synthetic application, the
inventory paragraph, the suite row, the re-mints, the write-backs below.

**Acceptance criteria (all required)**

1. Over the synthetic application, a scenario produces all five witness
   kinds bound to criterion ids, and a verifier result citing them is
   admitted under WO-058's rules in a capsule whose subject records them.
2. The console-error page yields a `console-capture` witness bound to each
   criterion the scenario covers, and a `pass` for those criteria is
   refused.
3. A fixture that kills the host leaves, after recovery, no process the
   adapter started, by the process ids it recorded and a process-table
   observation; a process the adapter did not start, the harness's
   connected server's among them, is outside the set.
4. A saved scenario replays to identical DOM and network witnesses over the
   fields the fixture declares stable, each field it leaves out named with
   its reason; the screenshot rule is the one WO-057 recorded and the
   fixture states it. The criterion is judged against the declared fields;
   a case outside them is a follow-up, not a failure.
5. The adapter's fixture runs from a process with the variables WO-057's
   no-server row removed also removed; the kernel, compiler and skeleton
   manifests gain no dependency; the package's manifest passes the
   license-surfaces check; `docs/LEGAL.md` §Current state carries the
   dependency inventory paragraph; `NOTICE` and the three pinned hashes are
   unchanged.
6. With the pinned browser absent, a launch yields `unavailable` witnesses
   with the reason and no pass, and the package's suite fails naming the
   install command.
7. Write-backs land, each in place with no dated paragraph: 03 §Ports, in
   the `VerificationAdapter` bullet (the adapter, its witness kinds and how
   they enter a capsule; at most 400 bytes added, against 3,284 bytes of
   headroom on 2026-09-28; WO-060 writes the same section before this
   order and WO-124 and WO-062 after it, so the executor re-measures the
   headroom at its base, and where the bound does not fit it consolidates
   the section it edits in the same change; a ceiling is raised only by a
   planning-document decision); one sentence folded into README §What
   runs today, rewriting what it supersedes, as the block's own rule says;
   an addition for `evidence.browser` in
   `docs/planning/capability-table.md`, dated as its earlier additions
   are; the decisions file; the publication locks refreshed.
8. Every edition the Cost line names is re-minted deterministically and
   the console re-pinned; the decisions record each. After the last
   lockfile change the executor re-mints the feedback edition from one
   live self-host episode on Codex `gpt-6.1-sol` at `max` or Claude Code `claude-opus-5-5` at `xhigh`; the decisions record the configuration.
   A repair that changes the lockfile again runs another the same way.
9. `npm test -- --review` and `npm run test:docs` green; `git diff
   --check` clean; the only new direct dependency is the pinned adapter
   dependency, and the lockfile's additions are its own tree, listed in
   the decisions.

**Evidence gate:** the fixture transcripts; the process-table observation;
`npm run test:docs`; `npm test -- --review` before `implementation-ready`,
because `package-lock.json` is a declared source of the five evidence
suites and `scripts/test-runner.mjs` of the runner-fixtures and
registrations suites, and again at final review. The live row is the
executor's feedback self-host episode.

**Write-back duty:** as listed in criterion 7.

**Non-goals:** OCR; the console UI; the Angular application (WO-112 is the first
real consumer; the fork's Angular run is the first UI consumer); a live proof on a real target;
browser witnesses under the `worktree-snapshot` profile, which admits
host-run tests only; a `THIRD_PARTY_NOTICES` file or a `NOTICE` change; a
browser driven by the verification host at dispatch.

**Operator-review assumptions**

1. A pinned runtime dependency in an adapter package is consistent with
   ADR-0002 as amended by WO-057.
2. A gate session installs the pinned browser before `npm test`; a suite
   that reports the browser's absence as a partial check is not taken,
   since a gate that passes without the browser proves nothing about it.
3. `NOTICE` stays unchanged and the dependency is recorded in the legal
   record's inventory until a bundled artifact is distributed.
4. Browser witnesses enter through the caller's host preparation; the
   verification host drives no browser at dispatch.
