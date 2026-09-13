# WO-129 decisions

## WO-129-D001

```json
{
  "id": "WO-129-D001",
  "date": "2026-09-13",
  "dispatch": "Operator resume: next; subsequent scope expand directs fixing model launch refusal after a harness update, specifically Fable.",
  "decision": "Remove exact CLI-version admission from both worker transports and Codex effort selection. Version remains observed metadata. Requests retain validated effort values, explicit model selection, restricted launch arguments, bounded execution and validated results; an actual CLI refusal remains a failure without fallback.",
  "evidence": [
    "packages/skeleton/src/worker-transport.ts",
    "packages/skeleton/test/worker.test.ts",
    "Installed Claude Code 2.1.270; constructing its transport before this repair returns profile-refused before dispatch."
  ],
  "rejected": [
    "Adding 2.1.270 to the allowlist repeats the defect at the next upgrade.",
    "NoOp keeps operator-selected Fable blocked by an unrelated CLI patch.",
    "Per-version permission or a fresh model probe adds recurring work without proving the requested invocation; the actual restricted launch already returns success or failure."
  ],
  "reopenWhen": "A concrete CLI incompatibility requires an adapter change; preserve the failing invocation and fix its protocol rather than rebuilding a version allowlist."
}
```

This scope expansion adds the transport and its existing worker fixtures to
the order's source/test inputs. It supersedes WO-125's exact-version policy,
not its runtime effort validation or honest host-launch attestation. The
original suite-input deliverable remains required.

Mission and critical path: keep the model-agnostic source-to-deliverable loop
usable after routine host upgrades. Policy resistance, shifting the burden to
the intervenor and escalation are directly evidenced by requiring another
operator repair for a patch release. Commons cost favors no extra probe per
launch. Drift to low performance and rule beating require actual dispatch and
validated results rather than a constructor-only success. Success to the
successful and seeking the wrong goal favor the requested model over a frozen
list of previously observed versions. Naive Interventionism preserves the
restricted profile, refusal handling and effective-model uncertainty; fixture
dispatch is the smallest reversible probe. NoOp retains the reproduced defect.

Entry measurement: 180,661 total tokens, source `codex-transcript-counter`,
scope `dispatch`, observed 2026-09-13T01:28:37.678Z. The window begins at explicit
session registration and excludes earlier routing reads; it includes waiting.
The first collection preceded a fresh counter; the next collection succeeded.

## WO-129-D002

```json
{
  "id": "WO-129-D002",
  "date": "2026-09-13",
  "dispatch": "Operator correction during execution: make the last seen Codex or Claude version the minimum required rather than the maximum.",
  "kind": "correction",
  "misread": "D001 selected removal of version admission altogether.",
  "meant": "Retain a minimum supported CLI version and admit newer versions without an upper bound.",
  "changed": "Before transport edits, selected numeric minimums Codex 0.154.0 and Claude Code 2.1.270, observed locally in this dispatch. Older or unparseable versions refuse with the required minimum. Newer patch, minor and major versions can launch the requested model.",
  "decision": "Use one named minimum per transport and reuse the Codex minimum for explicit effort; never compare versions lexically or enumerate exact admitted releases.",
  "evidence": [
    "Operator's minimum-version correction",
    "Local codex --version: 0.154.0; claude --version: 2.1.270",
    "packages/skeleton/src/worker-transport.ts",
    "packages/skeleton/test/worker.test.ts"
  ],
  "rejected": [
    "No version floor contradicts the correction.",
    "Adding the newest version to an exact list still blocks the next update.",
    "Automatic floor increases on every invocation would invalidate older installations without a reviewed compatibility decision."
  ],
  "reopenWhen": "Observed CLI behavior requires a higher baseline or an argument adapter; raise the documented minimum deliberately, without introducing an upper bound."
}
```

D001's goal comparison still applies. The floor preserves an explicit supported
baseline without requiring intervention after every upgrade. Related existing
verification, feedback-host and planning-refutation fixtures join the read/write
scope because they instantiate the same transports with older fixture versions.

## WO-129-D003

```json
{
  "id": "WO-129-D003",
  "date": "2026-09-13",
  "dispatch": "Operator resume: next selects the full WO-129 suite-input deliverable.",
  "decision": "Declare Git inputs for every inventoried suite, retain conservative whole-tree document scopes, and store sealed version-3 successes under the Git common directory. Hash input classes separately and retain hashed path inventories for bounded miss explanations. Normalize checkout-local executable search paths relative to the checkout, while preserving external tool identity and the projected execution environment.",
  "evidence": [
    "docs/work-orders/WO-129-suite-evidence-input-identity.md",
    "scripts/lib/suite-evidence.mjs",
    "scripts/test-runner.mjs",
    "scripts/work-orders.mjs: index reads HEAD history and tag ancestry",
    "docs/evidence/WO-126/decisions.md#wo-126-d009"
  ],
  "rejected": [
    "NoOp repeats suites after unrelated checkpoint/branch updates and cannot share worktree results.",
    "A global behavior hash or all-documents exclusion hides actual dependencies.",
    "Dropping hook/filter/attribute guards or installed roots weakens reuse soundness.",
    "Migrating version-2 records would reuse proofs under a different identity contract.",
    "Narrowing every document or installed-package scope belongs to WO-130."
  ],
  "reopenWhen": "An input counterexample, cache sharing on another machine, or measured inventory/storage overhead requires a revised declaration or trust model."
}
```

Mission and critical path: reduce repeated verification cost in the independent
source-to-deliverable loop. Policy resistance and rule beating require declared
Git dependencies, unknown-name refusal, the existing live checks and an exact
current-tree aggregate. Commons depletion, escalation and shifting the burden
favor shared disposable successes with automatic explanations over operator
diagnosis and repeated full execution. Drift to low performance and seeking
the wrong goal are judged by executed fresh/reused counts, not cache hits alone.
Success to the successful is checked against NoOp and simpler global keys;
neither meets dependency-specific reuse. Naive Interventionism preserves seals,
final input comparison, environment projection and installed-root coverage.
Fixtures for one changed byte and sibling worktrees are the smallest useful
probe; version-3 records are disposable and older records remain untouched.

## WO-129-D004

```json
{
  "id": "WO-129-D004",
  "date": "2026-09-13",
  "dispatch": "WO-129 criterion 3 requires generated-hook protection for the Git-common suite cache; operator scope expansion additionally repairs CLI version admission.",
  "decision": "Share the physical Git-common cache locator with the generated pre-tool guard and refuse classified direct or shell destinations into that cache, including from linked worktrees. Assign application v0.17.4 above local v0.17.3 and skeleton 0.15.4; retain other component versions and publication controls.",
  "evidence": [
    "scripts/test-harness.mjs: linked-worktree cache regression failed before the shared locator guard and passed after it",
    "scripts/test-suite-evidence.mjs: 14 suite-input fixtures plus 9 deadline fixtures passed",
    "scripts/test-process-debt.mjs: synthetic full inventory composes 32 fresh and 46 reused tasks after each of three role transitions",
    "packages/skeleton/test/worker.test.ts: all 21 worker tests passed"
  ],
  "rejected": [
    "Trust contained() alone: shell writes to an absolute common-directory path did not go through it.",
    "Protect the cache only during a gate: a forged record written between gates can be reused later.",
    "Bump unchanged compiler, kernel or console components: none has a changed implementation."
  ],
  "reopenWhen": "A supported tool exposes a new destination form, or concrete CLI incompatibility requires a higher minimum or argument adapter."
}
```

Correction to the order's observed assumption: generated hooks did not already
protect every shared-cache shell destination from linked worktrees. This repair
adds the shared locator and classifier to `packages/skeleton/src/gate-evidence.mjs`
and its pre-tool consumer in `harness-host.ts`; it changes neither exact-tree
identity nor lifecycle admission. Classified destinations are checked even when
no gate is active. The existing treatment of opaque commands and same-user
privilege remains; this is not a signed cache or an OS security boundary.

Current-byte review also selected the existing Codex effort observation as a
skeleton document input: `worker.test.ts` reads that file. Its mutation fixture
prevents reuse after those test inputs change, without narrowing other suites.

D003's goal comparison applies. The smallest failing probe was a generated
permission hook receiving a shell redirect into the main checkout's cache from
a linked worktree. The locator costs one Git-common-directory observation per
hook process, shared with the classification; this is a bounded protection
cost, not a claimed performance improvement. The release is a patch repair;
older-than-minimum CLI installations now receive an explicit baseline error,
while newer versions have no upper limit. No dependency was added.

## WO-129-D005

```json
{
  "id": "WO-129-D005",
  "date": "2026-09-13",
  "dispatch": "Operator resume: fix selecting VER-001 F1 and F2.",
  "kind": "correction",
  "misread": "D003 treated checkout-local PATH normalization and a same-process sibling fixture as sufficient for cross-worktree reuse; authority-evidence was declared to read no Git state.",
  "meant": "Canonical npm invocations must share successes at equivalent declared inputs, and every mutable Git reference actually read must participate in identity.",
  "changed": "Give npm_config_local_prefix a checkout-relative identity while retaining the actual value in execution; declare authority-evidence's refs/tags/v0.16.0 input. Exercise real npm children in separate worktrees and tag creation, movement and deletion.",
  "decision": "Extend the existing path identity narrowly to npm's local prefix, including its uppercase spelling. Preserve external prefixes, other configuration values and the reviewed execution environment.",
  "evidence": [
    "docs/verifications/WO-129/VER-001.md#findings",
    "scripts/lib/suite-evidence.mjs",
    "scripts/test-suite-evidence.mjs",
    "scripts/authority-evidence.mjs: historical evidence and bundle reads at v0.16.0"
  ],
  "rejected": [
    "NoOp leaves canonical sibling reuse broken and permits a stale success after the historical tag changes.",
    "Drop npm configuration from execution or hashing: broader than the demonstrated defect and risks changing real npm fixture behavior or concealing inputs.",
    "Normalize every path-like environment value: external configuration and session observations remain distinct declared inputs.",
    "Declare every tag for authority-evidence: unrelated tags are not read by that suite."
  ],
  "reopenWhen": "A canonical invocation reveals another checkout-dependent input, an external-prefix collision, or a changed Git read in authority-evidence."
}
```

Mission and critical path: remove repeated validation in the independently
verified source-to-deliverable loop. Policy resistance and rule beating require
actual npm-launched execution and reuse across worktrees, with changed inputs
still executing. Commons depletion, escalation and shifting the burden favor
this bounded correction over recurring operator diagnosis. Drift to low
performance and seeking the wrong goal are judged by executed/reused tasks,
not equality in a synthetic hash alone. Success to the successful is checked
against dropping the variable and broad normalization; both disturb more of
the reviewed contract. Naive Interventionism preserves execution values,
seals, configuration guards and the exact-tree aggregate; the smallest useful
probe is a real npm child per worktree. The change is locally reversible.

Entry usage: 141,071 total tokens (134,400 cached input), source
`codex-transcript-counter`, scope `dispatch`, observed
2026-09-13T03:04:33.595Z. Registration followed the routing reads. Initial
collection preceded a fresh counter; the next collection succeeded. This
includes useful work and waiting, not just uncached tokens.

## Execution observations

The restricted live Fable feedback verifier launched through Claude Code
`2.1.270`. Its diagnostic run at `max` returned `error_max_budget_usd` under
the existing $3 request limit. A fresh run of the same model at `high` returned
CLI success and a complete, all-verified feedback matrix. No model fallback,
budget increase or transport-profile weakening was used. The completed audit
and verifier streams are retained in `feedback-001/`; the earlier incomplete
stores remain local. This checks the feedback fixture, not independent
verification of WO-129. Effective model and effort remain unknown; the request
is a host-launch observation.

Current-byte review added the two publication edition tables of contents and
08 §Freshness and ownership to the read scope. Their audience claims still
agree with the revised release and execution rules; only the source locks
needed refreshing. The first fast gate exposed those stale locks; the next
passed compiler, kernel and skeleton and failed only the console's missing current
selfhost stream. After recording the completed live stream, `npm test` passed
all 12 suites in 47.147 seconds. The full gate then passed all 37 suites and
78 tasks in 647.838 seconds (75 fresh, 3 reused); its diff check passed.

`fixture-transcripts.txt` retains passing worker, suite/deadline and cache-hook
transcripts, plus the three-role episode's TAP and gate-count lines. The
episode executes the full 78-task inventory with synthetic commands: initially
78 fresh, then 32 fresh and 46 reused after each transition. It is not a host
timing claim. `wo125-baseline.json` retains the ten observed 78-fresh host rows,
including their original outcomes. `host-gates.json` retains criterion 7's
actual first full gate after implementation-ready: 37 suites passed in
390.062 seconds, composed from 32 fresh and 46 reused tasks. The before/after
source and installed-runtime digests match. Only the control event, generated
control projection and work-order index changed. The capture checks that this
is the first recorded full gate after the real transition, rather than a later
retry. Both exact-tree rows and the passing fast row are retained. The input
observer and recorder are instruments under review; this is executed host
evidence, not independent verification of WO-129.

Interim measured cost at 2026-09-13T01:57:58.258Z: 9,141,453 total tokens
(8,828,416 cached input), source `codex-transcript-counter`, scope `dispatch`.
Required current-byte output delivery accounts for repeated context; this is
not a live occupancy figure or an estimate. The additional live diagnostic
isolated a request-budget failure after successful version admission. D002's
minimum policy and D003's bounded cache repair remain selected. The live Fable
result, upgrade regressions and actual 46-task reuse support those choices.
Remaining whole-tree document scopes explain the 32 fresh tasks; narrowing
those scopes remains WO-130's separately planned work. Filing these evidence
artifacts requires one final gate at their exact document tree.

## WO-129-D006

```json
{
  "id": "WO-129-D006",
  "date": "2026-09-13",
  "dispatch": "Operator resume: final review; VER-002 F1: the repair's passing full gate at 2026-09-13T03:20:31Z persisted none of its 69 keyed suite successes, and the runner cannot tell.",
  "kind": "decision",
  "decision": "Pass the review without a runner change and carry F1 as a follow-up whose first step is a diagnosis of that invocation's write context. Every other gate in the WO-129 series persisted, including two later Claude Code gates; the identity, cache and explanation logic under review are correct, and the criteria do not require retention accounting.",
  "evidence": [
    "docs/verifications/WO-129/VER-002.md#findings",
    "Shared cache census at review: 284 sealed version-3 records in 69 suite directories, none with source.recordedAt 2026-09-13T03:20:31.668Z; 69 records each from the 02:59:46Z and 03:50:20Z gates and 23 from the 03:57:46Z composed gate.",
    "Retained gate rows: the 03:20:31Z row carries the same checkout digest and 22-key environment projection as the executor's 02:11:14Z, 02:18:36Z and 02:26:15Z gates, which persisted 66, 23 and 23 records.",
    "scripts/lib/suite-evidence.mjs: saveSuiteSuccess writes with flag wx and rename and does not catch a refused write; the gate exited 0 and the lifecycle accepted its evidence, so that process observed no write failure."
  ],
  "rejected": [
    "Fail the review: no acceptance criterion is unmet, the cause is not reproducible from a Claude Code session, and a repair cycle would re-verify identity logic already confirmed in both directions.",
    "Add a persisted-success counter and warning now: the observed invocation reported no failure to its own process, so a counter would have read 69 and warned about nothing; whether a non-retaining host should fail the gate or warn is an operator decision about write-restricted hosts.",
    "Fail closed when the cache directory is not writable: it would refuse a complete, passing gate on hosts the order never required to share a cache, against operator-review assumption 1."
  ],
  "reopenWhen": "A recorded gate through npm at writable cache inputs fails to retain an executed, hashed, passing suite; or a gate at unchanged declared inputs explains a task as no prior success when the preceding passing gate executed it in the same repository; or the diagnosis of the 03:20:31Z invocation names the host mechanism."
}
```

Mission and critical path: the order removes repeated full gates from the
independently verified source-to-deliverable loop; F1 asks whether one host
retained the work it did, not whether the identity is sound. NoOp is the
selected action for the runner: the observed loss cost one host 717 s of
reusable evidence once, the record is disposable by design, and the next
gate rebuilds it. Rule beating is checked: the pass rests on executed and
reused counts from gates that persisted, not on the one that did not.
Shifting the burden and escalation weigh against a warning whose trigger
cannot be shown to fire for the observed case; the commons cost is the 717 s
and is bounded to that host. Drift, success to the successful, policy
resistance and seeking the wrong goal are immaterial to a deferral that
changes no behavior. Naive Interventionism: a counter or a fail-closed rule
touches the runner's completion path, whose consumers are every gate on
every host; the smallest useful probe is a cache census after the next
Codex-hosted gate, which costs one directory listing.

Entry usage: 134,311 total tokens (116,125 cached input), source
`claude-transcript-message-usage`, scope `dispatch`, observed
2026-09-13T04:00:12Z after the routing reads and two commands; the window
includes waiting.
