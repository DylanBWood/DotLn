# WO-071 decisions

## WO-071-D001

```json
{
  "id": "WO-071-D001",
  "date": "2026-09-21",
  "dispatch": "resume: next",
  "decision": "Complete the version-1 `repositories` schema as an object keyed by public repository id. Each value declares `baseBranch`, a relative POSIX `worktreeParent`, opaque `repositoryClass`, and a complete `authorityProfile` in the existing `AuthorityEnvelope` shape. The loaded entry carries its key as `id`; `self` remains implicit and cannot be registered.",
  "evidence": [
    "docs/work-orders/WO-071-registered-target-repositories.md",
    "docs/work-orders/WO-033-compiled-starter-export.md#phase-2--target-repositories-are-builds-not-just-paths",
    "docs/product/02-domain-model.md#identity-and-composition",
    "scripts/lib/config.mjs"
  ],
  "rejected": [
    {
      "option": "Repeat `id` inside each repository value",
      "reason": "WO-033 defines the section as an id-keyed map. Repeating it creates two identity sources and a mismatch case without adding information."
    },
    {
      "option": "Store an absolute repository or worktree path",
      "reason": "The order's operator-review assumption keeps local paths out of committed registration, and its privacy criterion forbids physical paths in lifecycle records. A relative public worktree-parent declaration is sufficient for WO-072 to resolve under its own host boundary."
    },
    {
      "option": "Keep repository values opaque until WO-072",
      "reason": "That is NoOp for this order: activation could not reject malformed profiles or compile target authority, leaving WO-072 to infer semantics the selected order explicitly owns."
    }
  ],
  "reopenWhen": "WO-072 demonstrates that a target cannot be resolved from a public relative worktree parent, or WO-073 requires a versioned class reference rather than an opaque name."
}
```

## WO-071-D002

```json
{
  "id": "WO-071-D002",
  "date": "2026-09-21",
  "dispatch": "resume: next",
  "decision": "Parse exactly one leading `**Repository:** <id> @ <base>` field, where `<base>` is an immutable 40- or 64-hex commit id. Absence remains implicit `self` and adds no event or projection fields, preserving existing fixture bytes. Target activation resolves the id through configuration and records only `repositoryId` and `baseCommit`; current-state, JSON-status, orders-list and work-order-index projections expose the same pair.",
  "evidence": [
    "docs/work-orders/WO-071-registered-target-repositories.md",
    "docs/product/09-audit-resilience-privacy.md#privacy-and-minimization",
    "scripts/resume.mjs",
    "scripts/work-orders.mjs",
    "scripts/lib/control.mjs"
  ],
  "rejected": [
    {
      "option": "Record the configured worktree parent or another physical lookup path",
      "reason": "The order expressly forbids physical paths in the event and projections; WO-072 owns local path resolution."
    },
    {
      "option": "Record the configured branch name as `baseCommit`",
      "reason": "A movable ref would not bind the activation subject. The domain WorkOrder and the order's acceptance text both name a base commit."
    },
    {
      "option": "Add explicit `self` fields to every existing activation",
      "reason": "It would violate the order's byte-identity requirement for every existing fixture without improving target identity."
    }
  ],
  "reopenWhen": "A supported Git implementation needs another full object-id width, or WO-072 proves that activation must resolve a named branch to an object id before the event can be appended."
}
```

## WO-071-D003

```json
{
  "id": "WO-071-D003",
  "date": "2026-09-21",
  "dispatch": "resume: next",
  "decision": "Compile a registered target through the existing loadout compiler. Profile denials and the remaining envelope constraints narrow the active base; profile allows already inside the base remain ordinary allowances; each exact allow beyond either the base envelope or WorkOrder operations is carried by one deterministic `registered-repository` grant admitted from the committed configuration. Applying the same widening without that grant refuses with `AUTHORITY WIDENING`.",
  "evidence": [
    "docs/product/02-domain-model.md#authority-grants-and-trusted-admission",
    "packages/compiler/src/authority.ts",
    "packages/compiler/src/compile.ts",
    "scripts/lib/authority-grants.mjs"
  ],
  "rejected": [
    {
      "option": "Replace the active base lists with the profile lists",
      "reason": "That silently widens authority and discards base restrictions, violating WO-042's monotone floor."
    },
    {
      "option": "Treat every profile allow as a support claim",
      "reason": "The compiler correctly rejects a support that widens the active base even when a grant also exists; widening belongs in the grant itself."
    },
    {
      "option": "Model only WorkOrder operation lists and ignore the rest of the AuthorityEnvelope",
      "reason": "The configured profile is explicitly an AuthorityEnvelope. Ignoring expiry, evidence, resource and revocation restrictions would make the operations projection pass while the intended authority did not occur."
    }
  ],
  "reopenWhen": "The compiler gains a first-class registered-profile input, or a repository profile needs a wildcard grant or a resource allowance that the current grant contract cannot represent."
}
```

## WO-071-D004

```json
{
  "id": "WO-071-D004",
  "date": "2026-09-21",
  "dispatch": "resume: next",
  "decision": "Complete the activation's standing release assignment at application v0.38.0, the next minor above the observed local annotated v0.37.2 baseline. The changed control-plane scripts do not belong to a versioned component package, so kernel, compiler, skeleton and console versions remain fixed.",
  "evidence": [
    "docs/work-orders/WO-071-registered-target-repositories.md",
    "docs/product/06-roadmap.md#release-boundary",
    "local annotated tag v0.37.2",
    "git diff -- packages"
  ],
  "rejected": [
    {
      "option": "Leave the application target unassigned",
      "reason": "The order declares a minor release classification and the executor release-preparation procedure requires its activation placeholder to be completed before handoff."
    },
    {
      "option": "Bump a workspace component",
      "reason": "No package source changed; the implementation is confined to repository control-plane scripts, tests and documentation."
    }
  ],
  "reopenWhen": "Another order publishes v0.38.0 before WO-071 integrates, or integration moves this implementation into a versioned component package."
}
```

## WO-071-D005

```json
{
  "id": "WO-071-D005",
  "date": "2026-09-21",
  "dispatch": "resume: final review",
  "decision": "Resolve the registration in `compileRegisteredRepositoryLoadout` with `Object.hasOwn` before indexing, so an id that names an `Object.prototype` member refuses with the contract's `unknown registered repository id` message instead of reaching `repository.authorityProfile` as an inherited function. Observed before the fix at the reviewed tree: `toString`, `constructor` and `hasOwnProperty` each threw `TypeError: Cannot read properties of undefined (reading 'allowedEffects')`, while `ghost` refused by name; all three match the order's own id pattern `[A-Za-z0-9][A-Za-z0-9._-]{0,63}`. The activation path in `scripts/resume.mjs` already guarded with `Object.hasOwn`, so this aligns the compile path with its sibling. A regression assertion for `toString` joins the existing `absent` case in the WO-071 authority-grant test.",
  "evidence": [
    "scripts/lib/authority-grants.mjs",
    "scripts/resume.mjs",
    "scripts/test-authority-grants.mjs",
    "docs/final-reviews/WO-071/FINAL-001.md"
  ],
  "rejected": [
    {
      "option": "Record it as an observation and leave the code unchanged",
      "reason": "The failure is fail-closed but unnamed, and WO-072 is the first production caller of exactly this function. A two-line guard inside the order's own new code is cheaper to make now than a stack trace for WO-072 to diagnose."
    },
    {
      "option": "Give `repositories` a null prototype in the configuration loader",
      "reason": "That changes a shared loader's return shape for every consumer of the configuration, which is wider than the defect and outside the reviewer cleanup bound."
    },
    {
      "option": "Narrow the repository id pattern to exclude prototype member names",
      "reason": "A denylist of JavaScript member names is not a property of a repository id; the lookup, not the identifier grammar, is what was wrong."
    }
  ],
  "reopenWhen": "The configuration loader returns a null-prototype map for `repositories`, or the compiler gains a first-class registered-profile input that performs its own resolution (D003's reopening condition)."
}
```

Goal and critical path: registered targets are the next prerequisite between the
portable configuration root and WO-072's real target-worktree lifecycle. The
change advances the source-to-deliverable route by binding target identity,
revision and authority before any target path or worktree exists.

System traps: policy resistance is controlled by routing authority through the
existing monotone compiler floor; the shared-context cost is one registration
instead of per-order repetition; byte-identity prevents drift for self orders;
no publishing or extra lifecycle ritual is introduced; the existing compiler
is reused because it already proves the needed floor, while its unsupported
wildcard-grant case remains a refusal; operator rescue is reduced because
unknown targets and malformed profiles fail at activation; rule beating is
countered by asserting both compiled operation lists and grant provenance; and
the outcome is a consumable registered-target interface, not merely schema
validation. Naive Interventionism preserves the useful self-repository path and
changes only opt-in target orders. NoOp would leave WO-072 without a trustworthy
repository/revision/authority input and therefore does not advance the selected
critical path.

The pre-2026-09-09 ledger-entry duty is discharged by this decisions record and
its generated decisions-index row under the executor's standing substitution;
no lifecycle ledger append is made.
