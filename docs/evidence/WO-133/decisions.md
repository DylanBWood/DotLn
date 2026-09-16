# WO-133 decisions

## WO-133-D001 — Complete the stand-down at the existing boundaries

```json
{
  "id": "WO-133-D001",
  "date": "2026-09-16",
  "dispatch": "resume: next",
  "decision": "Complete the stand-down at the existing runtime and output boundaries, retaining two refusals and all journal rows.",
  "evidence": [
    "docs/work-orders/WO-133-stand-down-residue.md",
    "docs/planning/r1-replan-2026-09-16.md",
    "packages/skeleton/src/harness-host.ts"
  ],
  "rejected": [
    {
      "option": "NoOp",
      "reason": "Leaves repeated advisories, manual rebuilds and lost supplied attestations."
    }
  ],
  "reopenWhen": "The first real close or next skeleton reviewer gate reveals repeated output, stale runtime, unnecessary suites or a lost refusal."
}
```

Dispatch: `resume: next`, 2026-09-16. Sources: the order's cited R1 replan
§3.1–3.3; inspected generated prelude, runtime assertion, release close,
worktree finish, role procedures and attestation parser. The mission benefit
is fewer recurring operator repairs and interruptions on the route to the
always-on runtime. The baseline is 344 advisory journal rows in one session,
five reviewer gates of 625–840 seconds selected by version literals, and
supplied model/effort values omitted by actors. These are planning observations,
not measurements of this implementation.

Use one atomic per-session/per-cause advisory marker shared by the generated
fallback and runtime output boundary; keep every journal row and silence
PostToolUse output. Compare installed runtime pins using source-only code so
missing dist can still diagnose and rebuild. Release close preserves its
egress/surface-check ordering; finish repairs before removing the subject.
No hook, resume command or planning command builds. Keep supplied actor fields;
normalize only the legacy source token and the already-established ultra alias.
Move the skeleton version into one module and pin its built bytes.

Policy resistance/fixes that fail: keep the two refusals ahead of advisory
suppression. Commons: one advisory replaces a flood; build only on a mismatch.
Drift: retain explicit byte equality and executable negative cases. Escalation:
reuse existing events, journals and suites, without a new gate. Success to the
successful: compare the small boundary fixes against replacement and NoOp.
Shifting the burden: refresh automatically at the helpers that move main.
Rule beating: exercise actual generated hooks, close/finish and review selection.
Wrong goal: measure visible messages and selected suites, not receipt counts.
Naive Interventionism: preserve host permissions, immutable snapshots, recovery,
publication ordering and unknown attestations when unsupplied; use reversible
source changes and bounded fixtures before a product gate. NoOp leaves repeated
interruptions and manual rebuilds, so it loses. A hook-triggered build risks
concurrent writes and latency; total suppression hides broken runtime; splitting
the host or replacing the classifier is unnecessary.

Reopen on the first real close after merge, the next skeleton review gate, or a
missed refusal, repeated advisory, unnecessary rebuild or lost supplied value.
First real completion after merge: Codex **unobserved**; Claude **unobserved**.
Record the actual events here when they occur; this pre-merge executor cannot
claim either observation.

## WO-133-D002 — SessionStart means the actual host event

```json
{
  "id": "WO-133-D002",
  "date": "2026-09-16",
  "dispatch": "resume: next",
  "decision": "Register the existing session handler for SessionStart as explicitly directed by the operator.",
  "evidence": [
    "docs/work-orders/WO-133-stand-down-residue.md",
    "packages/compiler/src/harness.ts"
  ],
  "rejected": [
    {
      "option": "First prompt only",
      "reason": "Does not meet the actual SessionStart criterion."
    }
  ],
  "reopenWhen": "Live SessionStart registration or payload differs from the documented and fixture-tested contract.",
  "kind": "correction",
  "misread": "The order assumed SessionStart was already registered.",
  "meant": "Diagnose at the actual SessionStart event.",
  "changed": "Operator authorized reusing session.mjs for SessionStart."
}
```

Correction, 2026-09-16: the order assumed an existing SessionStart hook, but this
checkout only registered the session handler for UserPromptSubmit. The operator
explicitly directed: “Register the existing handler for SessionStart.” Register
that same handler; SessionStart performs only runtime diagnostics. Preserve prompt
dispatch and recovery behavior. This resolves the order's “no new hook” wording
without adding another handler file. First-prompt-only reporting was declined
because it would not meet criterion 2.


## WO-133-D003 — Release and version-only selection

```json
{
  "id": "WO-133-D003",
  "date": "2026-09-16",
  "dispatch": "resume: next",
  "decision": "Stage patch v0.22.1, compiler 0.11.2 and skeleton 0.18.4; reuse the existing evidence projection for version-only review selection.",
  "evidence": [
    "scripts/lib/release-preparation.mjs",
    "scripts/test-runner.mjs",
    "packages/skeleton/src/evidence-editions.mjs"
  ],
  "rejected": [
    {
      "option": "Select machinery for release literals",
      "reason": "Repeats the measured cost without a behavioral change."
    }
  ],
  "reopenWhen": "Integration consumes an assigned version or a behavioral change is omitted from machinery selection."
}
```

The activation left a placeholder rather than a strict version in the order
heading, so `release prepare --local` could not resolve it. The observed local
maximum was v0.22.0. Assign v0.22.1 under the existing patch classification,
compiler 0.11.2 and skeleton 0.18.4; no dependency is added. Reopen at integration
if a sibling consumes a version, preserving this compatibility classification.
The compiler's existing artifact-identity constant and package manifests also
participate in machinery declarations. Reuse `evidenceSourceContent` to ignore
only their release literals; preserve behavioral differences and conservative
selection when source comparison fails. This satisfies the order's compiler
and skeleton version-only objective without moving compiler architecture.

New inputs: `scripts/lib/harness-runtime.mjs` is a source-only pin reader used
by close, finish, resume and plan start, because importing `lib/harness.mjs`
requires the runtime being diagnosed. The SessionStart registration/input and
systemMessage output were checked against the [official hook reference](https://code.claude.com/docs/en/hooks)
through Context7 on 2026-09-16. This is documentation evidence, not a live Claude
SessionStart observation. Generated-handler fixtures provide executable coverage.

## WO-133-D004 — Keep historical compiler identity explicit in test oracles

```json
{
  "id": "WO-133-D004",
  "date": "2026-09-16",
  "dispatch": "resume: next",
  "decision": "Keep compiler purity and production artifact validation intact; isolate the historical compiler identity in the WO-050 oracle child and use current compiled inputs in other tests.",
  "evidence": [
    "packages/compiler/test/purity.test.ts",
    "docs/evidence/WO-050/decisions.md",
    "packages/skeleton/fixtures/wo050/README.md",
    "scripts/reactor-identity.mjs",
    "scripts/fixtures/historical-compiler-loader.mjs"
  ],
  "rejected": [
    {
      "option": "Change production validation to accept obsolete artifacts",
      "reason": "WO-050 D002 reserves that compatibility decision for separate scope; this order changes no artifact contract."
    },
    {
      "option": "Regenerate the frozen oracle",
      "reason": "Would discard the pre-refactor byte comparison."
    },
    {
      "option": "NoOp",
      "reason": "Leaves the required product gate failing on stale test identities."
    }
  ],
  "reopenWhen": "Compiler behavior changes beyond its release identity, the frozen oracle differs, or obsolete artifact compatibility receives separate scope.",
  "kind": "correction",
  "misread": "The shared marker function could live as executable Node I/O in compiler TypeScript, and historical positive fixtures could follow a compiler patch unchanged.",
  "meant": "The compiler remains pure and frozen byte oracles retain their original compiler identity.",
  "changed": "Host-supplied atomic marker callback; isolated historical test loader; current inputs for current-behavior tests."
}
```

The first product gate completed in 249.27 seconds with 16 passing and three
failing suites. The compiler purity failure identified the helper's dynamic
Node imports. The pure policy now receives a host callback; generated fallback
and host use the same marker key, atomic creation and error behavior. The
unchanged purity tests pass. This changes no permission or journal decision.

The compiler patch from 0.11.1 to 0.11.2 also exposed frozen positive test
inputs. Production validation intentionally refuses old compiled identities;
WO-050 D002 records that boundary. The operator explicitly replied “Proceed
with fixture repair.” Adjacent queue item adjacent-0001 records the bounded
scope and the actor-attested check-in. The historical oracle now runs all 19
cases with current runtime code in a child that substitutes only its recorded
compiler identity, 0.11.1, in one exact module. Original logs and input/output
hashes remain unchanged; no Decision or log normalization occurs. Ownership
and predicate tests use fresh compilation; WO-047 selects current evidence;
the console's existing recorder selects the new selfhost edition. This is not
a claim that production can replay obsolete compiled artifacts successfully.
The Node 22 loader API was checked through Context7 against its official
module reference; the isolated child executed successfully on Node 22.2.0.

This bounded fixture repair supports the mission's dependable replay evidence.
Policy resistance, fixes that fail and drift: preserve production refusals and
all frozen comparisons. Commons and escalation: one test-only child, no new
gate or dependency. Success to the successful: compare against regeneration
and NoOp. Shifting the burden and rule beating: keep the test identity explicit
and execute all 19 cases. Wrong goal: preserve meaningful compatibility
evidence, not merely a green count. Naive Interventionism: the loader is
restricted to its exact test entry, mode, module and single declaration; the
ordinary runtime has no compatibility bypass.

New inputs: the historical loader, reactor identity script, reactor-slices and
scenario tests, WO-050 fixture README, and the console's current-selfhost
manifest/expected renders. Read-only independent audits found no material
weakening in the fixture repair or advisory callback. Authority evidence uses
WO-133 revision 001 after the final helper emission; the earlier unversioned
WO-133 evidence remains preserved. Artifact, verification and live feedback
evidence checks still pass without replacement.

## Executor outcome — 2026-09-16

The [validation record](validation.md) reports the final passing product gate
(19 suites, 318.56 s), harness suite (28 tests, 364.31 s), process suite (67
tests, 200.63 s), and supporting checks. Those suites overlapped; their timings
do not measure an isolated reviewer gate. Against the planning observation of
344 repeated journal advisories, the controlled after-case returns one visible
message for twenty invocations while retaining all twenty journal rows. Against
the earlier 625–840 s reviewer gates triggered by version literals, the new
version-only review fixture selects zero machinery suites; the next real
skeleton reviewer duration remains unobserved. No wall-clock savings are
invented. The standalone changed-pin close fixture took 1.960 s with one build;
matching pins took 1.892 s with no build.

The intended interruption and manual-rebuild reductions are supported by the
fixtures. The two refusals, production compiler validation, frozen history and
publication ordering remain covered. The cost is one build only when pins need
repair, plus small source-only comparisons at the named boundaries. The release
and post-merge actor observations listed above remain the reopening conditions.

## WO-133-D005 — Register the release case and select its inventory guard

```json
{
  "id": "WO-133-D005",
  "date": "2026-09-16",
  "dispatch": "resume: fix",
  "decision": "Register runtime_refresh in the expected release inventory and select runner-fixtures when scripts/test-release.sh changes.",
  "evidence": [
    "docs/final-reviews/WO-133/FINAL-001.md",
    "scripts/test-release-fixtures.mjs",
    "scripts/test-runner.mjs",
    "scripts/test-runner.test.mjs"
  ],
  "rejected": [
    {
      "option": "Register the case without repairing source selection",
      "reason": "Leaves future shell-only additions unable to select their existing inventory guard."
    },
    {
      "option": "Run all machinery for every release change",
      "reason": "Adds unrelated recurring cost; one existing suite owns this inventory."
    },
    {
      "option": "NoOp",
      "reason": "The reproduced missing inventory entry leaves the required review gate red."
    }
  ],
  "reopenWhen": "A release-case change evades the inventory guard, or the added selection incurs unrelated machinery work."
}
```

FINAL-001's required repair reproduces: the shell exposes 44 cases and the
expected inventory lists 43, omitting only `runtime_refresh`. Add that entry
after `stale_helpers`, preserving the duplicate and unknown-case checks. The
report's recommendation identifies a missing dependency: the shell defines the
inventory that `runner-fixtures` checks, but no machinery suite declares it.
The operator answered “Proceed with the bounded fix” during this repair.
Adjacent queue item `adjacent-0002` records the selection fix. An isolated Git
fixture adds a shell case and exercises both source selection and the actual
review-list entry point. Version-only exclusions stay covered.

This removes recurring late review failures and operator repair on the route
to dependable runtime delivery. Policy resistance/fixes that fail and drift:
keep the existing inventory assertion and product gate. Commons and escalation:
select only the existing runner suite for shell edits; add no gate or dependency.
Success to the successful: compare the bounded dependency with inventory-only,
blanket selection and NoOp. Shifting the burden and rule beating: automate the
selection and test it with an actual Git diff. Seeking the wrong goal: protect
case completeness, not a green count. Naive Interventionism: this reversible
declaration affects review selection only; the full review gate checks its
interaction with the order. The historical-loader paths mentioned in FINAL-001
already execute in every product gate, so no additional machinery declaration
is warranted for them. The retained planner nomination remains separate.

New repair inputs: `scripts/test-release-fixtures.mjs` and the existing
`scripts/lib/release-fixtures.mjs` case enumeration. Release classification
remains patch v0.22.1; no component behavior or dependency changes in this repair.
