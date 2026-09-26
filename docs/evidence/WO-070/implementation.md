# WO-070 implementation evidence

Recorded 2026-09-25 to 26 for `resume: next`. The bounded implementation is
complete and ready for independent verification. This report is executor
evidence, not a verification verdict or final review.

## Provenance

A Codex session activated the order at 22:22:37Z and moved the leaves
(codex-cli 0.157.0, `gpt-6-sol`, ultra recorded as xhigh; decisions D001 to
D003). It stopped during a provider outage before running any gate. Claude
continued the same dispatch from 22:57Z at the operator's direction (Claude
Code 2.1.283, `claude-opus-5-5`, effort xhigh from `CLAUDE_EFFORT`;
[D004](decisions.md#wo-070-d004)).

## Result and decisions

The seven build-free Beacon leaves live in the private, build-free
`@dotln/beacons` workspace (`packages/beacons/src`, version 0.1.0). Lifecycle
scripts import that source by path; the skeleton imports it by package name;
the build stages it for strict type checking without emitting a copy
([D002](decisions.md#wo-070-d002)). Release-tag reading is split into
`scripts/lib/release-tags.mjs`, so activation loads no skeleton source
([D003](decisions.md#wo-070-d003)); `release-records.mjs` keeps exactly its
former public names ([D008](decisions.md#wo-070-d008)).

The takeover found that the move had broken every root that assembles DotLn
packages without the new workspace: the immutable harness runtime snapshot,
target and authority-probe launchpads, the Copilot qualification root, four
test fixtures and the live smoke. [D005](decisions.md#wo-070-d005) (adjacent-0001, completed)
makes each carry it through one `runtimeModuleDirectory` predicate or an
explicit copy and link. [D006](decisions.md#wo-070-d006) scopes criterion 2 to
the seven leaves and names the two remaining non-Beacon source/dist pairs.
[D007](decisions.md#wo-070-d007) registers `beacons` as a release component, so
a future Beacon version bump is a release label, not a judged change.
[D008](decisions.md#wo-070-d008) applies the verified review repairs and
write-backs. [D009](decisions.md#wo-070-d009) disposes the four carry-ins at the
operator's direction (deferred; plane/kit trio to FUP-a058e82c0bbd9b6d).
[D010](decisions.md#wo-070-d010) records the operator's authorization of one
live feedback episode and the re-mint, bound to the order's scope-expansion
section by `plan amend-order`. [D011](decisions.md#wo-070-d011) boards up a
pre-existing evidence-test defect (FUP-04bdf07955e1e24f).

The one economy experiment is Codex's D001 (declined, kept-current); no second
experiment was started. The adjacent queue holds one item, adjacent-0001,
completed with five passing suite results; nothing is pending.

Goal-alignment outcome: a copied control plane with no skeleton emits and
decodes its control Beacon, and installed harness runtimes, launchpads and
qualification roots remain self-contained. The critical-path prerequisite named
in the decisions header is met without weakening a guard.

## Acceptance evidence

1. **Beacon fixtures byte-identical.** No fixture file changed
   (`git diff HEAD --stat` touches none; console fixtures and
   `scripts/fixtures/harness-context/baseline.json` unchanged). The skeleton
   suite's Beacon tests (codebook v1 through group v1, perception, provenance)
   pass in the final `npm test`. Leaf bytes against `HEAD`:

   | Leaf | HEAD `packages/skeleton/src` SHA-256 | `packages/beacons/src` SHA-256 | Change |
   | --- | --- | --- | --- |
   | `beacon-codebook.mjs` | `0b4c2a4cbac901e5d46fb0b2cb2e0ef4f17912e24148834a986ab4c8e22ff3ee` | `f515c232756445769f2f32e64fb0d3dfa3c7e7caf3d2016d68f109774d133452` | 2 JSDoc type paths |
   | `beacon-io.mjs` | `d25b6a750a6eba8bc30b8a5a1847de817ab10b5a20027fa76dff1c59cdfad33b` | identical | none |
   | `beacon-provenance.mjs` | `f0b7f971c1decda337cf5c80d7474bb5569b9928d70e40c8fcdb819b08600c9f` | identical | none |
   | `beacon-v3-codebook.mjs` | `0176d624e2eef4f756f8c985f3b20ac730fbba2e88580e1440f13c527551045b` | `a3c6fe96e9f8f62afd84aa2d70823df0d58e9a5a00f9855d9596903bc5f91e56` | 2 JSDoc type paths |
   | `beacon-v3-fs.mjs` | `8310203f90e777dd27bd2d42673cc92ecd57e0cd8f738f8d5ca09cb48a9013cf` | `faf2f69aa91570c9087a17f3a862e5eb8cef2c29a8ff3f0c5b3dc161b2f4fbb4` | 1 JSDoc type path |
   | `control-beacon-fs.mjs` | `58ef149af96e3345e0438831986afb04d6d81407a4095abf1c6cb4ee729e6e6b` | `8be151ed693ac05b7e4812012b85d1c6ed4521b61b99f664be1a3e344300319d` | 5 JSDoc type paths; one Prettier reflow of a type cast |
   | `control-codebook.mjs` | `fb416d8e67daf4092eee0cf4f34ca9b2cba320cd525e07cebd2874570e01b4f2` | `4b7825bd9c73e8fae82f69879811c8f5037e5c05656051f2acaf16b77d3c32ac` | 4 JSDoc type paths |

   Every changed line retargets a JSDoc type reference from skeleton
   TypeScript (`./control-beacon.js`, `./execution-environment.js`,
   `./beacon.js`) to `./types.d.mts`; no code, mode or newline changed.
2. **Grep test.** `scripts/test-beacon-portability.mjs`, "WO-070 grep scan
   finds one home for the seven Beacon leaves and no skeleton source or dist
   copy of them", walks `scripts/` recursively (`.mjs`, `.js`, `.ts`, `.sh`)
   and rejects any skeleton source or dist, or compiled Beacons, path to a
   leaf. Scope: [D006](decisions.md#wo-070-d006).
3. **Portability fixture.** The second test copies only `scripts/`,
   `packages/beacons` and `.gitignore` into a new temporary Git root with no
   `node_modules` and no `packages/skeleton`, runs
   `scripts/resume.mjs activate WO-099`, and decodes the public and verifier
   control Beacons from file size with the copied codebook
   (`{codebookVersion: 2, phase: active, latestVerdict: unknown, effort:
   unknown, provenance: host-projected}`), with mtime equal to the recorded
   transition time. Suite `beacon-portability` passes in `npm test`.
4. **Write-backs.** 03 §Layer diagram row and prose; skeleton README
   §Control-plane Beacons; the ledger entry is discharged by this order's
   decisions file and the generated decisions index (the order was filed
   2026-09-08, before 2026-09-09). Also 02 §Beacon codebook v1, a dated ADR
   0002 amendment and the 06 release-boundary entry.
5. **Gate.** Final `npm test` exit 0 (343,956 ms, recorded
   2026-09-26T00:00:44Z); `git diff --check` and `git diff --cached --check`
   clean. No third-party dependency: the lockfile adds only the
   `packages/beacons` workspace and its `node_modules/@dotln/beacons` link.

## Evidence editions

The move changes three judged feedback files, and the re-emitted harness moved
the authority bundle hashes. Under the operator's authorization (D010), once,
after the last registered-source edit:

- authority `WO-070` revision `001`: `authority-evidence --write`, then
  `--check` (34 bundle comparisons);
- feedback `WO-070` revision `001`: `evidence:feedback --write`; one live
  `claude-cli-print` episode with `claude-sonnet-5` at xhigh, store
  `.runtime/feedback-audit-wo070-r001`, started 23:50:58Z, complete on the
  first attempt (one `WorkerAttemptStarted`, one `WorkerCompleted`, 181
  heartbeats, ten fixtures, 1,192 saved instruction bytes). Usage from the
  transport's result envelope: 184,276 ms, 697,224 tokens (19,851 output),
  USD 1.6576648. Then `--record-selfhost` (123,475 of 2,280,530 verifier
  bytes by reference) and `--check`: "Live feedback audit
  docs/evidence/WO-070/feedback-001 judged the current source";
- artifact identity and verification stay at `WO-161` revision `001`; both
  checks pass unchanged. `evidence:console --check` matches every fixture.

## Gate transcripts

- First gate (Codex's tree plus the snapshot fix, 23:04 to 23:08Z):
  `npm test` exit 1, 26 passed and 2 failed (`worktree-integration` 7 of 9;
  skeleton 113, the stale feedback edition).
- `test:machinery` (23:12Z): the authority preflight failed (stale bundle
  diff), hiding ten suites; run one by one, `harness-fixtures` (1),
  `process-debt` (6), `runner-fixtures` (1), `evidence-sources` (3) and
  `harness-probe` (2) failed; five passed.
- After D005: the five repaired suites passed (`--only`, 23:21 to 23:28Z).
- Final `npm test` passed as above. The final `test:machinery` and
  `test:docs` runs are recorded in [the addendum](#final-machinery-and-document-gates).

## Limits

- `scripts/harness-live-smoke.mjs` gained the `@dotln/beacons` link but was not
  executed: it is a live smoke outside the gate. The two production builders
  changed with it are exercised by `harness-probe` (Copilot qualification and
  authority probe).
- The harness snapshot identity hashes only its pinned dist files, so a
  Beacon-leaf-only change would reuse an existing snapshot, as the unpinned
  dist codebook copies did before this order (D005).
- `gate-evidence.mjs` and `usage-observation.mjs` still load from both skeleton
  source and dist; neither holds module state (D006, FUP-a058e82c0bbd9b6d).
- The three new code paths are staged with `git add --` (not committed) so the
  gate's tracked-file code identity binds their bytes.
- The release classification (patch) is the order's; the final reviewer judges
  it against the removed skeleton deep dist paths.

## Process cost

Codex segment: 112,481 tokens over 19,662 ms and two steps (the
`npm run meta` process meter, dispatch `WO-070/executor`); USD unavailable.
Claude segment at 2026-09-26T00:01:20Z (`harness usage`,
claude-transcript-message-usage, dispatch scope): 67,947,136 total tokens,
of which 67,332,544 cached input and 176,891 output, 251 steps and 207
commands; USD unknown. The review workflow's four subagents used 989,513
tokens. The live episode is the only paid model call outside the session
(USD 1.6576648). Waiting was dominated by gate runs: 296 s and 344 s for the
two full product gates, 420,749 ms for the five repaired suites.

## Final machinery and document gates

The first final `test:machinery` and `test:docs` runs (00:00Z) stopped at the
`meta` preflight ("Decisions index is stale; run npm run meta") after D004 to
D011 were added; every evidence preflight passed. After `npm run meta` and
`npm run work-orders -- index`:

- `npm run test:machinery`: 19 passed, 0 failed, 410.53 s (00:02 to 00:09Z),
  including `harness-fixtures`, `process-debt`, `runner-fixtures`,
  `evidence-sources`, `harness-probe` and all four evidence checks;
- `npm run test:docs`: 21 passed, 0 failed, 26.30 s (recorded
  2026-09-26T00:09:44Z);
- with the final `npm test` (exit 0, 343,956 ms), every product, machinery and
  document suite passed on the subject handed to verification.
