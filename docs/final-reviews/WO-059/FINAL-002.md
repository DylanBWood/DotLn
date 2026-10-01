# WO-059 — FINAL-002

**Verdict:** pass. All nine criteria are met on the integrated tree at code identity `7f384f7b…`. FINAL-001's F1 is fixed. Recovery now refuses a record that sets `browserPid` without a recorded root, and refuses a root whose recorded parent is not the owner. During a run, the root is captured as the owner's child before any observation can adopt descendants. I re-ran FINAL-001's exact record shape against a fresh build of this subject, with a live `/bin/sleep` at the recorded pid. Recovery refused it, the record bytes were unchanged, and the bystander stayed alive and unsignalled. D018's five minor items are fixed, and D023 disposes D019. The verification sequence is complete and every report hash matches the control log. `main` has not moved since FINAL-001's integration, so no integration was needed. This review found no new defect.

**Subject:** [`docs/work-orders/WO-059-playwright-evidence-adapter.md`](../../work-orders/WO-059-playwright-evidence-adapter.md) on branch `wo-059`, uncommitted. The original base is `60eeecdccc3f3717da492a7416435d2227639bc5`. The integrated base is `main` at `2210dd87c5b017edcf144980e5657b1349e6a53b` (v0.58.2), from FINAL-001's integration (D015). The dispatch checkpoint is `refs/dotln/checkpoint/WO-059/16` (`3a782212…`).
- **Verification sequence.** [VER-001](../../verifications/WO-059/VER-001.md) failed on its F1, an install remedy that targeted the wrong cache, and [VER-002](../../verifications/WO-059/VER-002.md) passed after the repair. [FINAL-001](FINAL-001.md) failed on F1, recovery that could SIGKILL a process the adapter did not start. [VER-003](../../verifications/WO-059/VER-003.md) passed after the repair, at checkpoint 14 and code identity `7f384f7b…`.
- **Report hashes.** All four reports hash to the `reportHash` in the control log: `ebb73bed…`, `5eaacf60…`, `168b1459…` and `3de96d6d…`.
- **Tree since dispatch.** I compared the whole working tree, untracked files included, with checkpoint 16 through a temporary index. Only the dispatch's regenerated `current.md`, work-order index and control log line differed.
- **The order as judged.** I judged the original nine criteria. The order's text differs from `main` only in its heading's `(v0.59.0)` label (D003).

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.286","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}

Dispatch: `resume: final review`. The operator made no choice about the verdict. The actor values are this session's:
- Claude Code 2.1.286, from `claude --version`;
- model `claude-opus-5-5`;
- effort `xhigh`, read from `CLAUDE_EFFORT` (selected, not effective).

The order recommends any effort for the reviewer. Fan-out plan, stated before any work: zero subagents against a `subagentCap` of 20. The repair is about 60 source lines. VER-003 had already run an independent 26-check probe, and I read the whole of `processes.ts` and `index.ts` myself. The usage readback observed 0 subagents, with 20 remaining.

**Process cost:** entry 86257 tokens; handoff 8468468 tokens; source claude-transcript-message-usage

Both readings are `dispatch` scope, from `node scripts/harness.mjs usage 7c54ed64-d9f6-44c9-94eb-00b8e22bb914`:
- The entry reading was observed at 2026-10-01T02:37:22.035Z.
- The handoff reading was observed at 02:44:50.807Z, after the checks and before this report, `test:docs` and the result transition. It counts 8,251,918 cached input, 176,691 cache-write, 120 uncached input and 39,739 output tokens, over 61 steps and 55 commands.

Reasoning tokens and dollar cost are unavailable, which means unknown, not zero. Compared with FINAL-001 (17,725,119 tokens at handoff, one subagent, a 401 s fresh gate), this review spent less because it had no integration and no source change. No subagent was spawned and no fresh gate ran: the runner reused VER-003's row at the unchanged code identity. Tradeoff: this review's assurance rests on VER-003's gate run, recorded at 02:32:54Z on the same host and identity, plus my own reading and probe, rather than a second 400 s run.

## Goal-aligned judgment

WO-059 is gate F's producer: WO-123 sequences browser witnesses before verification. The question for this review was whether the repaired adapter can run on an operator's host without harming a bystander, and produce admitted evidence through a green binding gate.

- **Rule beating.** I did not credit the executor's regressions or VER-003's probe as the proof. I rebuilt the packages and ran FINAL-001's exact record shape myself, under a caller `TZ` of `America/Los_Angeles`. I added three variants: a root whose recorded parent is a live non-owner, `observeOwned` on a bare pid, and a `null` `browserPid` with a non-empty list.
- **Seeking the wrong goal.** The goal is a recovery that cannot reach a bystander, not a passing kill fixture. The criterion's second clause was judged against the code paths, not only against the fixtures.
- **Tragedy of the commons.** The host's process table is shared. Every probe case checked the bystander's liveness through both the adapter's table and the probe's own spawn handle.
- **Drift to low performance.** A failed final review followed by a passing verification does not lower the bar. Each criterion was re-judged on this subject.
- **Shifting the burden.** The guard is in the adapter, not in a caller's discipline. D023 makes the per-worktree browser install visible instead of hiding it in a download or a skip.
- **Escalation and policy resistance.** No gate, guard or role text is added. The review's edits are bounded to the stale capability-row wording and the register disposition its own verdict settles.
- **Success to the successful.** VER-003's green rows were not taken as proof of the code paths. Reusing its gate row is the runner's contract (WO-132) at an unchanged code identity, and is stated as such.
- **Naive Interventionism.** A second fresh 400 s gate would re-measure an identical code identity on the same host and add no information. The probe ran from session scratch and OS temp.
- **NoOp.** Failing or holding without a reproduced defect would keep WO-123 waiting on a finding that is fixed.

## Earlier findings re-checked

**F1 (FINAL-001): fixed.** I checked each part of FINAL-001's rule against the current source.
- **Recovery refuses a bare pid.** `recover()` refuses a record when `browserPid` is set or the list is non-empty, unless there is a root at `browserPid` whose recorded parent is the owner and the list forms a closed tree under it (`processes.ts:120-129`). The owner's own pid and duplicate pids are also refused.
- **No adoption before the root is recorded.** `observeOwned` returns without adopting anything unless that recorded root exists, its recorded parent is the owner, and its identity still matches the table (`processes.ts:32-43`).
- **The root is captured once, at launch.** `runScenario` captures the root right after launch, requiring a table entry at the browser pid whose parent is the live owner (`index.ts:345-351`). If the root is missing, it throws before the first `recordNow()` or the 250 ms recorder starts. The `finally` then saves the record only as `closed: true`, which recovery ignores.
- **The kill path.** It signals only recorded identities: pid, UTC start time and command. It re-reads the table before each signal.
- **The regressions.** The two FINAL-001 asked for are `bare-pid-bystander`, whose sentinel sits at `browserPid`, and `surviving-owned-tree-recovery`, whose `recoveredPids` is non-empty. Both read as FINAL-001's rule asks (`scenario.test.mjs:1022-1190`).
- **My probe.** `final002-probe.mjs` in DotLn session scratch ran against `packages/browser-evidence/dist/src/processes.js` after `npm run build`, with all 9 checks passing:
  - FINAL-001's shape `{browserPid: <sleep pid>, processes: [], closed: false}` threw `Invalid browser ownership record`, the record bytes were unchanged, and the sleep stayed alive with `signalCode` null;
  - a root at the sleep's pid with the probe as recorded parent was refused;
  - `observeOwned` on a bare pid adopted nothing;
  - a `null` pid with a non-empty list was refused.

**D018 (FINAL-001, minor): fixed.** I checked each item against the diff from checkpoint 11 to checkpoint 16:
- `ps` runs with `TZ: "UTC"`;
- owner liveness matches pid and start time only, so a renamed owner still blocks recovery;
- Playwright's `assert` type maps to `error`;
- the console entries are copied before they are written, hashed and returned;
- install advice is given only for `Executable doesn't exist at`.

VER-003 ran a passing case for each, and all of them sit in the `browser-evidence` suite that passed in the reused gate row.

**D019 (FINAL-001): disposed by D023.** D023 accepts the behavior under operator-review assumption 2, names the recurring per-worktree setup cost, weighs a shared cache, automatic install and a passing skip, and keeps Receipt 036's reopening condition. The package README links it.

**F1 (VER-001): still fixed.** The fresh-worktree and default-caller remedy cases pass in the gate row. D026 moved the fresh copy to OS temp so npm's workspace scan no longer reads the parent checkout, and the printed and README commands are unchanged.

## Criteria

**Criterion 1:** met. `installed pinned browser produces all five kinds admitted from a VerificationOpened subject` is in the `browser-evidence` suite, which passed in the gate row at `7f384f7b…`. The repair touched no subject, capsule or admission code. The kernel, compiler and skeleton source have no diff since FINAL-001, and the compiler and verification host have no diff against `main`.

**Criterion 2:** met. `console-error` binds a failing `console-capture` to each covered criterion and each `pass` is refused, in the gate row. A failed `console.assert` is now adverse the same way, which FINAL-001 had recorded as a limit.

**Criterion 3:** met. The host-kill fixture leaves an empty after-set by recorded pids and a process-table observation, and the unrelated sentinel survives. The signal path is now reached, by `surviving-owned-tree-recovery` with a non-empty `recoveredPids`. The criterion's second clause holds in the code, in VER-003's probe and in mine: a process the adapter did not start is outside the set. After my probe, `ps -ax` shows no `chrome-headless-shell` and no `/bin/sleep` process; the probe killed its own sleep.

**Criterion 4:** met. `saved-replay` passed in the gate row. VER-003's cross-session hashes equal repair-003's and VER-002's for all five files. `fixtures/replay-fields.json` is unchanged since FINAL-001; it states WO-057's equal-PNG-hash rule and names its omitted fields with their reasons.

**Criterion 5:** met.
- `no-connected-server` passed in the gate row.
- Against `main`, `NOTICE`, `LICENSE`, `scripts/license-surfaces.mjs` and the kernel and compiler manifests have no diff, and the skeleton manifest changes only its version (0.47.1 → 0.47.2, D015).
- `release check-surfaces --local` passes `license-surfaces`, including the adapter's publish refusal and the `NOTICE` pin (`645cf84d…`).
- `docs/LEGAL.md` §Current state carries the dated inventory paragraph.

**Criterion 6:** met. `missing-browser` yields `unavailable` witnesses with a reason and no pass, and the independently launched suite exits 1 naming the cache-scoped install command. Non-missing launch failures are `unavailable` without install advice. These cases passed in the gate row.

**Criterion 7:** met.
- **Product 03, README and the publication TOCs.** All are byte-identical to VER-003's subject, and the §Ports addition is still 279 bytes (≤ 400).
- **Capability table.** I replaced "repair-003 awaits fresh independent verification" with a link to VER-003's pass. Once merged, the old clause would have been false.
- **Decisions.** The decisions file holds D001–D027, and the index lists them.
- **Publication.** `npm run publication:check` passes with both locks current (29 and 45 linked sections).

**Criterion 8:** met. The repairs after FINAL-001 changed neither the lockfile nor any registered edition or feedback source (VER-003 checked all five source lists at runtime). The authority, artifact-identity and verification editions at WO-059/001 and feedback at WO-059/002 therefore stay current, along with D016's live episode on Claude Code `claude-opus-5-5` at `xhigh`. The evidence-edition suites and `console` passed in the gate row.

**Criterion 9:** met.
- **Product gate.** `npm test -- --review` exited 0. The runner found the passing complete row at code identity `7f384f7b66cf718e238ac7c87a38028ee29d8924dcb77e1e18e29f4f5d4cba30`, recorded 2026-10-01T02:32:54.475Z (38 suites, 0 failed, 399.86 s, 82 fresh), and started no suite. No source changed in this review.
- **Whitespace.** `git diff --check` and `git diff --cached --check` are clean.
- **Dependencies.** Against `main`, the only new direct dependency is `playwright` `1.63.0`, and the lockfile adds only its `playwright-core` `1.63.0`, the workspace link and the skeleton 0.47.2 entries (D004, D015).
- **Document gate.** `npm run test:docs` passes with this report in place (see the checks table).

## Follow-ups and register

- **FUP-96928fa2501223a5 (D017).** It was allocated to WO-059 pending fresh verification. I settled it, citing D021, VER-003 and this review's probe, with a reopening condition for any signal outside a recorded owner-rooted tree.
- **FUP-4ec1bd58fe0d1fba (D018) and FUP-a8f5dd98ad1eb0b9 (D019).** These were settled by the repair (D027), and this review confirms both.
- **The twelve textual matches.** They keep FINAL-001's and D027's dispositions. This review opens no seam they name: it changes no runner, edition, meta or follow-up source.
- **Meter.** `npm run meta` lists two reopen candidates. WO-150-D003 (executor cold start 26,903 > 24,576 bytes) was already listed on `main` by WO-175. The `policy-resistance` trend (guard refusals 13, Δ 4, worsened over three order deltas) is a process observation for the next planning pass, which reads the candidates at entry. It is not a defect in this subject.

**Limits I checked and found already recorded.** These are not new defects.
- **Trust.** Recovery trusts the record file a caller points it at. A record written by hand that names a live process as a root with the owner's pid as its recorded parent would be honored. The adapter cannot write such a record, because it captures the root from the live table as its own child. D027 records trusted records as the recovery boundary.
- **Recording window.** A browser process spawned in the last 250 ms before a host kill, if it also outlives its root, goes unrecorded (VER-001, VER-003).
- **Identity.** Start times have one-second resolution.

## Edits by this review

- The `evidence.browser` capability row's assessment now links VER-003's pass.
- The FUP-96928fa2501223a5 disposition, applied through `npm run plan -- followups --apply` from an ignored `.runtime` request file.
- [`PR.md`](PR.md) prose, with the meter block refreshed by `npm run release -- prepare`. That command observed origin tags and kept v0.59.0 current.
- [`RELEASE-NOTES.md`](RELEASE-NOTES.md), in the five-section form.
- `npm run meta` and the work-order index regenerated their projections.

None of these is a source edit, so the code identity is unchanged.

## Executed checks

| Check | Result |
| --- | --- |
| Report hashes vs control log | VER-001, VER-002, FINAL-001, VER-003 match |
| Working tree vs checkpoint 16 (temporary index, untracked included) | only `current.md`, the index and the control log line |
| `git fetch origin main`; `git ls-remote` | `main` at `2210dd87`, unchanged; no `wo-059` remote branch; latest tag v0.58.2 |
| `npm run build` | built browser-evidence, compiler, console, kernel, skeleton |
| `final002-probe.mjs` against built `processes.js` (`TZ=America/Los_Angeles`) | 9/9 ok: FINAL-001's shape and three variants refused or adopt nothing; bystander alive, unsignalled |
| New suppression directives in the diff | none |
| `npm test -- --review` | exit 0; passing row at `7f384f7b…` reused, no suite started |
| `npm run release -- check-surfaces --local` | pass; v0.59.0; browser-evidence 0.1.0 first version; skeleton 0.47.2 |
| `npm run publication:check` | pass; both locks CURRENT |
| `git diff --check`; `git diff --cached --check` | clean |
| `npm run release -- prepare` | target v0.59.0 current (origin tags); meter refreshed |
| `npm run test:docs` (report in place) | 24 passed, 0 failed, 35.91 s |

Result route: `final-review-result pass`. On pass, the reviewed state is committed on `wo-059` and published as its pull request. Nothing is merged, tagged or released by this review.
