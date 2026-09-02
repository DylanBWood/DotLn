## What this merges

WO-015, the `v0.2.3` patch work order: the release manifest's cadence
compatibility extraction now reads the canonical Prettier-formatted kernel
source and fails closed when it cannot.

- **The defect:** WO-006's formatter pass turned the `Cadence.T` alias into a
  multiline union. The release union matcher required a literal space after
  `=`, so the operator-authorized WO-006 release close on 2026-09-01 passed
  `npm ci`, `npm test`, and the built skeleton CLI, then refused with
  `cannot derive cadence kinds from source` before tag construction. No local
  or origin `v0.2.3` tag was created.
- **The adjacent latent defect:** the evaluator capture ended at the first
  newline-plus-closing-brace, which in formatted source is the object literal
  returned by `case "Once"`. A whitespace-tolerant union alone would have
  published `evaluable: ["Once"]` and silently declared five implemented
  cadences deferred.
- **The fix** (`scripts/release.mjs`, the `compatibility` function only): the
  alias match tolerates canonical whitespace around `=` while keeping the
  semicolon boundary and source-order derivation; the evaluator capture is
  scoped to the exported `evaluateCadence` region and bounded at the switch's
  own `default:` arm, reading `case` labels at the switch's indentation; new
  guards refuse an empty, duplicated, or non-identifier union and an empty,
  duplicated, unlabeled, or out-of-union case set. Tag selection, push logic,
  the evidence command list, versions, dependencies, and the manifest
  schema/template are untouched; `packages/kernel/` is byte-identical.
- **Fixture coverage** (`scripts/test-release.sh`): the fixture repository now
  copies the live `packages/kernel/src/types.ts` and `core.ts` instead of a
  hand-built one-line union and one-line case returns. The success path
  asserts, with `assert.deepStrictEqual`, the exact six evaluable kinds
  (`Once`, `After`, `Every`, `Gate`, `Until`, `Backoff`) and eight deferred
  kinds (`Burst`, `Calendar`, `Window`, `While`, `Sequence`, `Merge`, `Race`,
  `Repeat`) in source order, read from the manifest extracted out of the real
  simulated annotated tag and re-validated. A new malformed-source fixture
  removes the `default:` arm and proves the close exits non-zero with the
  named refusal, never reaches `git mktag` or a tag push (asserted from
  `GIT_TRACE`), and leaves the simulated origin's full ref listing
  byte-identical. Existing origin/tag success, byte-for-byte re-validation,
  idempotency, and unrelated-tag coverage are unchanged.
- **Docs:** the roadmap records why `v0.2.3` was not published at the WO-006
  close and names WO-015 as the bounded fix-in-place continuation, without
  implying the tag exists; its recovery paragraph now covers any guarded
  pre-tag refusal, not only evidence failure. The work-order map's lifecycle
  block and WO-015 row reflect the reviewed evidence state (one bounded
  wording correction applied at final review, disclosed in FINAL-001).

## Evidence

Re-established first-hand at final review, not inherited:

- Pre-fix four-result reproduction against merged canonical source: old union
  match absent; whitespace-tolerant union yields all fourteen kinds in source
  order; old evaluator capture yields `Once` only; the shipped
  `default:`-bounded capture yields `Once, After, Every, Gate, Until,
  Backoff`.
- Full unchanged `npm test`: Prettier check, six shell suites,
  `tsc -b --force`, 68/68 node tests, exit 0. `git diff --check` clean. The
  release suite prints `malformed cadence source refused before tag
  publication` and the exact arrays
  `["Once","After","Every","Gate","Until","Backoff"]` /
  `["Burst","Calendar","Window","While","Sequence","Merge","Race","Repeat"]`.
- Mutation sensitivity, isolated mirrors: reverting the union correction fails
  the exact-message assertion at `test-release.sh:188`; reverting the
  evaluator boundary fails `error: malformed cadence source published` at
  `:187`. The negative fixture's trace assertions were proven non-vacuous by a
  positive control in which `git mktag` and the tag push do appear and the tag
  lands in the simulated origin.
- Independent derivation: a TypeScript-compiler-API oracle sharing no code
  with the parser yields the identical fourteen, six, and eight kinds; every
  "missing structure" the work order names (namespace, alias, switch,
  `default:` arm, case set) refuses loudly against the live extraction chain.

## Verification trail

- `docs/verifications/WO-015/VER-001.md` — pass; all nine acceptance criteria
  met, no findings. Six candidate findings refuted on adversarial review,
  fourteen synthetic source variants classified, three observations recorded
  for follow-on work.
- `docs/final-reviews/WO-015/FINAL-001.md` — pass; one bounded wording
  correction applied to the work-order map projection; VER-001's line-range
  citation for its AC6 row corrected by reference (`:272`–`:275` and
  `:293`–`:310`), VER-001 itself untouched; clean-room sweep clean; subject
  proven byte-identical to the tree VER-001 passed; thirty-agent review with
  adversarial refutation and a completeness critic, method disclosed.

## Known open items

- A `case` clause appended after the trailing `default:` arm is silently
  ignored by the capture and survives the whole gate (VER-001 Observation 1,
  reproduced by three methods at final review). Unreachable without editing
  `packages/kernel/`, which this order forbids; a validated two-group remedy
  inside the same function is recorded in VER-001 and FINAL-001 and is
  recommended for WO-102 or a bounded follow-on.
- The executor's model, effort, and harness are not recorded in a committed
  artifact (VER-001 Observation 2); the verifier's and reviewer's are in their
  report headers. Candidate for a future process order.
- The release fixture is now coupled to the live kernel source (VER-001
  Observation 3): implementing a currently deferred cadence will fail the two
  exact-array assertions until they are updated. That is the pin doing its
  job; update, do not delete.
- Cheap hardening candidates carried from review: split the shared
  `cannot derive cadence evaluator cases from source` message by cause; add a
  `test -s` guard before the trace assertions; give the `:188` exact-message
  assertion a diagnostic.
- Before `resume: release close`, move both globally ignored, non-disposable
  `.claude/settings.local.json` files — the main checkout's and the `wo-015`
  worktree's — out of the repository. The release-close gate refuses the main
  checkout's copy as release-contaminating ignored material first, and the
  worktree-finish gate then refuses removal while the worktree's copy exists.
- The six shell suites still hardcode `/private/tmp`; verification and final
  review ran through a local sandbox write allowance for
  `/private/tmp/dotln-**`. This is the WO-013 condition and is out of scope
  here.
- After merge, the separately authorized `resume: release close` runs
  `npm run release -- close WO-015 --publish` from the main checkout, reruns
  all merged evidence, and may cut annotated `v0.2.3` containing WO-006 plus
  this repair. This PR performs no release action.
