# WO-015 — Release-manifest cadence parser repair, v0.2.3

**Model:** any capable model. The executor and independent verifier must record
the model, effort, and harness they actually use (07-execution-guide.md
§Model-specific notes).
**Release classification:** `v0.2.3` patch — this repairs the release gate that
blocked publication of WO-006's already-reviewed `v0.2.3` boundary. This order
continues that interrupted release obligation; after this patch passes the
ordinary implementation, independent verification, final-review, PR, and
operator-merge gates, a fresh `resume: release close` for **WO-015** evaluates
and may publish annotated `v0.2.3`. The tag then contains WO-006 plus this
repair. The failed WO-006 release authority does not carry forward.
**Failure provenance:** the operator-authorized `release close WO-006
--publish` run on 2026-09-01 fast-forwarded clean `main` to the merged WO-006
commit, removed the merged worktree and local branch, ran `npm ci`, `npm test`,
and the built skeleton CLI successfully, then stopped before tag construction
with `cannot derive cadence kinds from source`. Both local and origin
`v0.2.3` were absent after the refusal. WO-012 is the precedent for this manual
fix-in-place recovery composition.
**Depends on:** WO-006 merged at `origin/main`, with VER-003 and FINAL-001
passing. Nothing else executable. Branch from current `origin/main`; do not
reuse the removed WO-006 worktree or edit `main`.

**Cites (read these sections):** 06-roadmap.md §Release boundary (failed-gate
fix-in-place recovery and preserved release obligation);
07-execution-guide.md §Workflow closeout and releases; 01-principles.md
Principles 5, 7, and 10; `scripts/release.mjs` `compatibility`;
`scripts/test-release.sh`'s source fixture and manifest assertions; and
`docs/work-orders/WO-012-release-gate-path-quoting.md` only as process
precedent, not as reusable scope.

**Objective:** make the release manifest derive the complete `Cadence.T` union
and the complete set of implemented `evaluateCadence` cases from the canonical,
Prettier-formatted TypeScript source, while failing closed when either source
shape cannot be derived. Pin that contract with a formatter-shaped release
fixture and exact manifest assertions so a green release test cannot precede
the same post-evidence failure or a silently incomplete cadence manifest.

**Observed defect and adjacent latent defect:** WO-006 introduced pinned
Prettier formatting and formatted `packages/kernel/src/types.ts` from a
single-line alias into:

```ts
export type T =
  | Once
  // ...
  | Backoff;
```

The release union matcher requires a literal space immediately after `=`, so
it returns no match on that canonical source. A whitespace-tolerant union
matcher alone is insufficient: the evaluator matcher currently ends its
capture at the first newline followed by `}`, which is the closing brace of
the formatted object literal returned by `case "Once"`. It would therefore
publish `evaluable: ["Once"]` and silently misclassify the other five
implemented cases as deferred. The test fixture hand-builds a one-line union
and one-line case returns, so `npm test` exercises neither production shape.

The dated read-only reproduction against merged source produced:

- old union match: absent;
- whitespace-tolerant union: `Once, After, Every, Burst, Calendar, Window,
  While, Until, Gate, Sequence, Merge, Race, Repeat, Backoff`;
- old evaluator capture: `Once` only;
- a capture bounded by the evaluator's `default:` arm: `Once, After, Every,
  Gate, Until, Backoff`.

**Scope discipline (two parser boundaries, one fixture, two projections):**

- In `scripts/release.mjs`, make the `Cadence.T` alias match tolerate canonical
  whitespace around `=` while retaining the existing semicolon boundary and
  source-order derivation.
- In the same `compatibility` function, bound the evaluator case capture at
  the switch's `default:` arm (or an equivalently explicit structural boundary)
  rather than at an inner closing brace. Missing namespace, alias, switch,
  default arm, or case set remains a loud refusal; never accept a partial list.
- In `scripts/test-release.sh`, exercise a multiline union and at least one
  multiline object-literal return before later cases. Prefer the canonical
  source bytes or a deliberately formatter-identical fixture. Assert the exact
  six evaluable and eight deferred kinds in source order in the generated
  manifest, not merely that a planted mutation is rejected.
- Add a negative fixture proving a missing cadence namespace/type alias,
  evaluator switch/default boundary, or case set refuses before tag
  publication. Keep the existing simulated origin/tag-success and idempotency
  coverage intact.
- Update `docs/product/06-roadmap.md` to record the interrupted `v0.2.3`
  boundary and WO-015 recovery, and update
  `docs/planning/work-order-map.md` to the patch's actual evidence state.
- Do not change `packages/kernel/`, cadence semantics, the manifest schema,
  application/component versions, tag selection or push logic, the evidence
  command list, dependencies, or any WO-006 verification/final-review artifact.
  Do not broaden this order into a general TypeScript parser or release-system
  redesign.

**Deliverables:**

1. The two bounded compatibility-extraction boundary corrections and their
   fail-closed completeness guards in `scripts/release.mjs`.
2. Formatter-shaped positive and malformed-source negative coverage in
   `scripts/test-release.sh`, including exact cadence manifest assertions.
3. The release-obligation write-back in `docs/product/06-roadmap.md` and the
   evidence-state update in `docs/planning/work-order-map.md`.

**Acceptance criteria (all required):**

1. Against the merged canonical `packages/kernel/src/types.ts`, compatibility
   extraction returns all fourteen `Cadence.T` members exactly once and in
   source order.
2. Against the merged canonical `packages/kernel/src/core.ts`, extraction
   returns exactly the six implemented cases — `Once`, `After`, `Every`,
   `Gate`, `Until`, `Backoff` — even though formatted return objects contain
   inner closing braces.
3. The resulting deferred list is exactly `Burst`, `Calendar`, `Window`,
   `While`, `Sequence`, `Merge`, `Race`, `Repeat`, in union order.
4. Release fixtures use the multiline alias and multiline case-body shape that
   reproduced the defect. Reverting either parser correction makes a targeted
   assertion fail.
5. A fixture missing the cadence namespace/type alias, evaluator switch/default
   boundary, or all case labels refuses with a non-zero exit before `git mktag`
   or any tag push; the simulated origin remains unchanged.
6. The existing release success fixture still creates one annotated simulated
   tag, re-validates its embedded manifest byte-for-byte, remains idempotent,
   and does not move or follow unrelated tags.
7. `npm test` and `git diff --check` pass on the patch worktree. The verifier
   also runs the targeted release suite independently and records the exact
   cadence arrays extracted from canonical source.
8. Apart from standing control-log/projection changes and numbered
   verification/final-review artifacts, the implementation diff is limited to
   the two code/test files and the two required projections.
   `packages/kernel/`, package manifests/lockfile, control schema, release
   manifest schema/template, and historical WO-006 evidence remain
   byte-identical.
9. The roadmap says why `v0.2.3` was not published during WO-006 close and
   names WO-015 as the bounded continuation. It does not imply the tag exists
   before the later, freshly authorized close succeeds.

**Evidence gate:** capture the pre-fix four-result reproduction above; run the
targeted `bash scripts/test-release.sh`; run the full unchanged `npm test`;
run `git diff --check`; show that the simulated release manifest contains the
exact six/eight arrays; and show the malformed-source fixture leaves its
simulated remote without the candidate tag. The independent verifier repeats
the targeted fixture and canonical-source extraction rather than relying only
on the executor transcript.

**Closeout:** after FINAL-NNN passes, the final reviewer may publish only the
WO-015 branch/PR under the ordinary final-review authority. The operator merges
it. Only a later, fresh `resume: release close` authorizes
`npm run release -- close WO-015 --publish`; that close must rerun all merged
evidence and is the only path that may create/push annotated `v0.2.3`.

**Non-goals:** editing or reopening WO-006; using `resume: fix` against its
closed implementation; changing runtime cadence behavior or types; adopting a
new parser dependency; changing release-note content policy; publishing a tag
from this planning or implementation session; direct edits or pushes to
`main`; WO-013 temporary-root work; WO-014 approval-burden work; or any WO-102
corpus scope.
