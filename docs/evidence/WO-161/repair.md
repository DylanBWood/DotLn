# WO-161 repair evidence — VER-001

Recorded 2026-09-25 for `resume: fix` on `wo-161`. This report judges the
uncommitted repair of [VER-001](../../verifications/WO-161/VER-001.md) findings
F1 to F8. The original [implementation evidence](implementation.md) remains the
record of the first handoff. [D009 to D011](decisions.md#wo-161-d009) record
the repair choices, the Receipt 028 disposition and the new authority edition.

## Repair result

- **F1:** `contributor.ts` no longer emits “need no Git escalation” into the
  executor, verifier or reviewer skills. `scripts/test-process-debt.mjs` now
  asserts its absence in every generated role. The harness regenerated all 31
  surfaces, and the WO-161 default and opt-out role hashes were re-pinned while
  the historical snapshot chain stayed intact.
- **F2:** The skeleton README says host permission settings decide execution
  and emission changes no host setting. The playbook calls its older Claude
  procedure “retained.”
- **F3:** Product 06 now records WO-161 activation completion above the
  published `v0.49.0` baseline, with `v0.50.0` minor, compiler `0.19.1` and
  skeleton `0.43.0`. The same-day correction below D009 names the misread in
  D003; D003's historical bytes remain.
- **F4:** ADR-0003 through ADR-0005 keep their 2026-09-25 Amendments as the
  current decision. D009 explicitly records why their Status and heading
  annotations are a bounded exception to product 07's amendment-only duty:
  they identify historical sandbox-on text immediately below old ADR titles.
  The original decision bodies are unchanged.
- **F5:** [partial-method.mjs](partial-method.mjs) reproduces the two saved
  projections from a temporary Git repository. Its suite table has `alpha`
  and `outside`, with `outside` declaring `needs: outside-sandbox`, and
  intentionally has no build row. A fake `fixture-harness` marker and a denied
  directory yield `inForce: true`; `runGate` with `--confined-partial --serial`
  inserts `document-barrier`, runs only `alpha`, and records the saved
  `checkId`, evidence-reference suffix, `needs`, partial, excluded and required
  suite identities. The script compares its projection to both
  `partial-before.json` and `partial-after.json`; it passed. The committed
  runner fixture includes a build row, so its separate assertion correctly
  expects `["build", "alpha"]`. VER-001 also reproduced baseline and repaired
  rows independently with that committed fixture.
- **F6:** D010 disposes of both Receipt 028 issues. Generated text gives a
  conditional instruction based on the runner's runtime confinement probe; it
  does not claim a generator-time probe. The residue names host permission
  settings as the boundary, and the dated ADR records this instance's posture.
- **F7:** The runner comment and assertion use the host-confinement fixture
  name. The authority-evidence comment names WO-161's three Contributor
  component-definition labels alongside WO-099's presence policy.
- **F8:** The docs index has a 2026-09-25 Config log line for the regenerated
  `CLAUDE.md` and `.claude/` output.

The changed bundle made immutable authority revision 001 stale. Revision
`WO-161/002` was recorded and selected; its compiled programs and behavior
checks pass. Artifact-identity, verification and carried-feedback editions
remain at `WO-161/001`, and their checks pass. All 129 authority files tracked
at entry remain byte-identical. The repaired cold starts in both skill roots
are 25,723 bytes (executor), 22,526 (verifier), 23,608 (reviewer), 14,632
(release close), 16,780 (planner) and 16,355 (refuter). Each configured
ceiling is met; the refuter ceiling is unset. The exact [inventory](vocabulary-after.json)
and [cold-start measurement](cold-start.json) record the method and comparison.
`git grep -n -i sandbox -- CLAUDE.md .claude/skills .agents/skills` has no
matches, and the new assertion closes the approval-clause gap that grep missed.

## Executed evidence and limits

The final `npm test` passed 27 suites with zero failures and 71 fresh tasks in
294.243 seconds. Its recorded code identity is
`17655ddca8c6450bac73e611c0d97632f3ac4eabb8e40bdb555cc4768381a590`
at 2026-09-25T18:04:25.698Z. A first repair gate passed as well; it preceded
a Prettier-only source correction found by the documentation gate. The final
`npm run test:docs` passed 21 suites with zero failures in 25.18 seconds.
Focused role-snapshot and committed confined-row tests, the executable
partial-method script, `npm run harness -- check` (31 surfaces), all four
selected evidence checks, console fixture check, publication check, cold-start
budget check, release surface check and both staged/unstaged `git diff --check`
passed. Product publication remains a separate action.

`FUP-6f7834c355df7feb`, the VER-001 repair route, is settled after these
checks. D007's inherited `evidence-sources` machinery failure and D008's
product 02 wording stay boarded as `FUP-be91067a3842b44a` and
`FUP-422f1b3cdd4b7330`; neither was judged as part of this repair. The one
WO-161 economy experiment remains D002; this repair reused its inventory
method and claimed no time or token saving.

The repair ran in Codex CLI 0.157.0 with session readback `gpt-6-sol`, selected
effort `ultra` (normalized to xhigh with workflows), source
`codex-session-readback`. The root was the only writer. One read-only audit
agent covered F1 to F8, with no descendants; the explicit session count is one
against the cap of twenty. No branch commit, push, pull request, publication
or host-setting change was made.

`node scripts/harness.mjs writer --show` reported `reserved:false` before
the repair dispatch and at this handoff, so this Codex session has no observed
writer reservation. The root remained the sole writing agent by work
allocation, but the report does not claim host-enforced ownership.
