# WO-178 — FINAL-001

**Verdict:** fail. Criterion 6 is unmet; criteria 1 to 5, 7 and 8 are met. The new operator-word check in `scripts/docs-check.mjs` reads a work-order provenance field only when the field is a paragraph of its own. Work orders usually write it as one line of the header paragraph, after lines such as Model and Effort: 157 of the 166 work orders with a provenance field do, WO-178 included. In that layout an operator quotation with no capture digest produces no advisory. I reproduced this on the subject's own module: the same field gives one finding as its own paragraph and none after `**Model:**` and `**Effort:**` lines. The criterion's fixture uses the standalone form, so it passes while the check stays silent on the layout planning writes. By the check's own patterns, 35 header-paragraph fields match, and at least seven of them quote an operator dispatch (WO-150, WO-158 and WO-160 to WO-166). The executor's bounded paraphrase pass, which counted 28 candidates (D006), never saw them. A reviewer does not write and certify a behavioral fix, so the finding returns to repair ([D015](../../evidence/WO-178/decisions.md#wo-178-d015--final-review-finding-the-operator-word-check-never-reads-a-provenance-field-in-a-header-paragraph)). I concur with VER-001's three boarded defects, and this review adds live evidence for D014.

**Subject:** [`docs/work-orders/WO-178-the-record-holds-what-the-operator-sees.md`](../../work-orders/WO-178-the-record-holds-what-the-operator-sees.md) on branch `wo-178`, uncommitted, on base `2f52501450b55abdb03386352bb651909bb2e134`. The dispatch checkpoint is `refs/dotln/checkpoint/WO-178/5` (`23ad67e9`). The code identity is `38bcda114fb6ad962b5425c535a120afff02fea96169a73d4c614f27059fb3e8`, the same as VER-001's subject.
- **Verification sequence:** [VER-001](../../verifications/WO-178/VER-001.md) passed, and no repair followed. Its bytes hash to the control log's `reportHash` (`c1db27d7…`).
- **Between checkpoints:** from VER-001's `/3` to `/5`, only documents changed: VER-001, D012–D014, the control log and its projections, the decisions index, the register and the work-order index. No source file changed.
- **Order text:** it differs from the base only in its heading's version label. I judged the original eight criteria.
- **Ideation:** no ideation breakout receipt applies. The evidence folder holds none, and the control log records no scope expansion or amendment.
- **Integration:** `main` and `origin/main` are at `85d13906`, ten commits past the base (WO-103, WO-102 and WO-181; tags `v0.60.2`, `v0.60.3` and `v0.61.0`). Because this review fails, I did not integrate; the integration belongs to the next final review's window. That review will meet two retimes under the recorded patch classification, neither of them a finding. The staged `v0.60.2` is taken upstream. Upstream's compiler 0.22.0 and skeleton 0.49.0 are above the staged 0.21.1 and 0.48.1. The harness host stays at 0.34.0 upstream, so the staged 0.34.1 does not collide.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.286","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}
**Process cost:** entry 88498 tokens; handoff 8745093 tokens; source claude-transcript-message-usage

Dispatch: `resume: final review`, recorded by the harness. The canonical phase selected WO-178 and allocated this path. The operator made no choice about the verdict. The actor values are this session's: Claude Code 2.1.286 from `claude --version`, model `claude-opus-5-5`, and effort `xhigh` read from `CLAUDE_EFFORT` (selected, not effective). The order recommends any effort for the reviewer.

Fan-out plan, stated before any spawn: no subagents out of the 20 available. The usage readback observed 0 admissions with 20 remaining, and the root session was the only writer.

Cost scope: this dispatch, read with `node scripts/harness.mjs usage 7245481f-a2e9-4824-ad5b-b0d7d91f53ac`.
- **Entry:** observed at 2026-10-01T17:14:43.076Z.
- **Handoff:** observed at 17:24:20.710Z, after D015 and `npm run meta` and before this report, `test:docs` and the result transition. It covers 69 steps and 64 commands.
- **Breakdown:** 8,506,399 cached input, 191,237 cache-write, 130 uncached input and 47,327 output tokens. Both totals are cumulative transcript counters and do not measure live context.
- **Unavailable:** reasoning tokens and dollar cost, which means unknown, not zero.

No suite ran in this review. The code identity was unchanged, and a failing verdict does not need a gate on an integrated tree.

## Goal-aligned judgment

WO-178 is machinery: it lets a planning pass open on a record of what the operator saw, and lets the one lifecycle-authorized publish run under Claude auto mode. Criterion 6 serves the clean-room floor. A new work order that carries the operator's words should be reported before it lands.
- **Rule beating** decided the verdict. The fixture writes the provenance field in a layout that 9 of 166 work orders use, so the evidence passes while the declared surface goes unread.
- **Seeking the wrong goal.** "Operator-word advisories: 0" would be read as compliance when the check never looked at the field.
- **Drift to low performance and shifting the burden.** Accepting the gap would leave the operator to notice verbatim words again, which is the failure the order names.
- **Escalation and Naive Interventionism.** The remedy is bounded to the reader, its fixture and the baseline. The admission, the journals, the counts and their evidence stay as verified, and no refusal or gate is added.
- **Policy resistance.** The repair uses the existing repair and verification route. The operator's waive off-ramp stays available if the gap is to be accepted instead.
- **Tragedy of the commons.** The cost is one repair and one verification. `docs-check.mjs` is not a registered evidence or machinery source, so it triggers no edition re-mint.
- **Success to the successful.** The verified parts are not reopened.
- **NoOp** would publish a check that is silent on the layout it was built to read.

## Criteria

**Criterion 1:** met.
- **Fixture.** `WO-178 PermissionDenied journals bounded metadata…` passed in VER-001's fresh run and in both product-gate rows at this identity.
- **Handler.** I read `harness-host.ts`'s `denial` branch. It records the tool name, the SHA-256 digest and byte count of the JSON tool input, the bracketed rule and the order, role and phase. It never records the input or the reason text, and its advisory names the `!` prefix and `/permissions` → Recently denied. It returns no `retry`.
- **Registration.** `.claude/settings.json` registers `PermissionDenied` with matcher `.*` running `.claude/hooks/permission-denied.mjs`. `node scripts/harness.mjs check` reports 32 generated surfaces.
- **Limit.** No live denial has occurred, so the row is fixture-witnessed only.

**Criterion 2:** met.
- **Fixture.** `WO-178 prompt rows…` passed in VER-001 and the gate.
- **Live row.** This session's journal row 5 records class `direction`, prefix `resume:` and 20 bytes, the length of the dispatch phrase. Its route is `unknown`, with source `host-route-unavailable`. No row holds message text.
- **Not in the criterion.** The attribution defect D014 is outside it (see Findings).

**Criterion 3:** met. `WO-178 Stop names only journaled dispatches…` passed. The Stop branch filters the existing `observedFacts` task fold to tasks this session's journal saw dispatched and that are still `dispatched`, `running` or `pending`. It adds one line beside the expected completion, and with none running the message is unchanged.

**Criterion 4:** met.
- **Admitted bytes.** `releaseCloseAdmission` admits only bytes equal to `'<execPath>' '<main>/scripts/release.mjs' close WO-NNN` followed by `--publish` or `--dry-run`, or by `--publish` and canonical single-quoted `--material` words. That is the helper `resume.mjs`'s `release-close` case prints (`scripts/resume.mjs:2017`).
- **Conditions.** It requires all of the following:
  - a `release-close` dispatch recorded in this session for the same order;
  - the Claude Code host;
  - cwd, and any tool cwd, resolving to the main checkout;
  - canonical status selecting that order with `release-close` legal.
- **Ordering.**
  - The admission runs after the gate, planning-branch, subagent and read-scope judgments.
  - In `runHarnessHook`, an outside-write deny, or an unavailable outside-write guard, still replaces the allow.
  - The writer reservation is a separate PreToolUse hook.
- **Phrase dispatch.** The new `resume: release close` phrase dispatch runs `resume.mjs release-close`. That command prints the helper and reserves main's writer, and appends no control event.
- **Negatives.** The enumerated negatives passed in VER-001's fresh fixture run.
- **Boarded.** D012 (printer and admission spellings diverge) and D013 (the admission precedes a typed correction) stand as VER-001 boarded them.

**Criterion 5:** met.
- **Fixture.** `WO-178 local counts and track split…` passed within the plan-refutation suite.
- **Real record.** `npm run plan -- failures` on the subject prints all five counts with `source: local`:
  - `localReleaseCloses` 0, from 0 records;
  - `localHostDenials` 0, across 3 journals;
  - `interventions` 5: 2 direction and 3 unclassified, of which 4 are from verification and 1 from final review;
  - `longPhases` 3, one each for WO-174, WO-175 and WO-176;
  - `repeatedGateRuns` 1, which is VER-001's rerun at the identity already green;
  - `recentTracks`: 8 counted, all `unknown`.

**Criterion 6:** unmet.
- **Fixture.** `WO-178 attributed operator words…` passes, and `node scripts/docs-check.mjs` prints `Operator-word advisories: 0; historical baseline: 25.`
- **Why unmet.** `operatorWordFindings` tests `^(?:Nomination )?Provenance:` against each whole paragraph. My probe shows the header-paragraph field is never read. My count over `docs/work-orders`, using the check's own attribution and capture patterns, finds:
  - 166 provenance fields, 157 of them inside a header paragraph;
  - 37 matches without a digest, 35 of them in header paragraphs.
- **Operator quotes.** A sample of the 35 shows operator dispatch quotes that cite only "SHA-256 in the ledger section", with no digest. WO-178's own match quotes a classifier label and documentation.
- **Unsupported claims.** The handoff's criterion 6 claim and D006's candidate count therefore do not describe the declared surface. [D015](../../evidence/WO-178/decisions.md#wo-178-d015--final-review-finding-the-operator-word-check-never-reads-a-provenance-field-in-a-header-paragraph) records the reproduction and the repair rule.

**Criterion 7:** met for what is due before close.
- **Write-backs.** I read both diffs. The Claude auto-mode row in `docs/AI-HARNESS-SECURITY.md` §Current mode choices and the product 07 planning sentence are replaced in place. VER-001 measured them at 422 and 216 bytes, within 500 and 300.
- **Decisions.** `decisions.md` and the decisions index are current, with D015 added by this review.
- **Register.** The eight provenance-named register rows hold the dispositions VER-001 lists. The close retarget of the three rows allocated to WO-178 remains due at close.

**Criterion 8:** met at this subject.
- **Product gate.** `gateCodeIdentity` recomputed in this review gives `38bcda11…`, the identity of both passing `npm test -- --review` rows:
  - the executor's, at 2026-10-01T16:29:24.587Z;
  - VER-001's fresh run, at 17:03:38.493Z.
- **Diff and dependencies.** `git diff --check HEAD` is clean. The package and lockfile changes are internal version labels only.
- **Suppressions.** No added line carries a lint, type, format or shellcheck suppression.
- **Limits.** `npm run test:docs` ran after this report was filed; its result is in the session response. The repair reruns both gates.

## Findings

[D015](../../evidence/WO-178/decisions.md#wo-178-d015--final-review-finding-the-operator-word-check-never-reads-a-provenance-field-in-a-header-paragraph) fails criterion 6. The repair it routes:
- treat a header-paragraph provenance line as one record, from its bold label to the next bold header label or the paragraph end;
- add a fixture in that layout;
- rerun the paraphrase pass over the full candidate set within the order's thirty-record bound, three of which are used;
- baseline the rest by fingerprint and record the counts.

Criteria 1 to 5, 7 and 8 carry forward with their evidence.

I concur with VER-001's boards:
- [D012](../../evidence/WO-178/decisions.md#wo-178-d012--verification-boards-the-unadmitted-material-retry-spelling) (`FUP-00ed3cd9ab11599f`);
- [D013](../../evidence/WO-178/decisions.md#wo-178-d013--verification-boards-the-admissions-precedence-over-a-typed-correction) (`FUP-d5a399224b1a5886`);
- [D014](../../evidence/WO-178/decisions.md#wo-178-d014--verification-boards-host-notifications-counted-as-operator-messages) (`FUP-bfe39a18fdf822ae`).

Each is outside its criterion's enumerated behavior, and each follow-up names its repair rule.

The live record adds to D014. The verifier session's journal holds one direction row for its dispatch phrase and three `unclassified` rows (533, 1178 and 1194), each with a distinct digest.
- **Row 533** is the task notification VER-001 matched by digest.
- **Row 1178** was journaled 0.2 s after VER-001's gate row was recorded (17:03:38.493Z, then 17:03:38.709Z). This is consistent with a background-task completion notification. That is an inference: I read no message text.

So 3 of the 5 intervention rows the planning count reads come from one verifier session that typed one phrase. D014's medium priority stands.

## Register

`npm run plan -- followups --touching` matched 38 pending rows at register revision `190fd466…`.
- **Added by `npm run meta`.** It indexed D015 and added `FUP-de7e15d4444da75b` for it.
- **Not settled here.** This failing review settles no row; the repair re-reads the matches.
- **Historical sweep.** `FUP-71fc2efc208f597a` keeps the sweep beyond the order's bound.

## Executed checks

| Check | Result |
| --- | --- |
| `node scripts/harness.mjs usage` (entry, handoff) | 88,498 and 8,745,093 tokens; source `claude-transcript-message-usage`; 0 subagents |
| `npm run resume -- status --json` | WO-178 `final-review`; legal action `final-review-result` |
| `node scripts/docs-check.mjs` | PASS; operator-word advisories 0, historical baseline 25 |
| Header-layout probe (scratch, `probe/header-provenance.mjs`) | standalone field 1 finding; same field in a header paragraph 0 |
| Surface count (scratch, `probe/count-header.mjs`, `probe/sample-header.mjs`) | 166 fields, 157 in header paragraphs, 37 lexical matches without a digest, 35 unseen |
| `node scripts/harness.mjs check` | 32 generated surfaces |
| `npm run plan -- failures` | the five counts and track split under Criterion 5 |
| `gateCodeIdentity` recomputed; gate index rows | `38bcda11…`; two `npm test` rows for WO-178, both exit 0 |
| Clean-room screen of the tracked diff and untracked files | no user path or private host; one fixture address at `example.test`; one public Claude Code documentation URL; no secret shape |
| Suppression scan of added lines | none |
| `git diff --check HEAD` | clean |
| `npm run meta` | D015 indexed; `FUP-de7e15d4444da75b` added; health line `1 reopen candidates` (WO-150-D003) |
| `npm run test:docs` | after filing; result in the session response |

## Route

Record the fail. The order returns to repair, and `resume: fix` takes D015. If the operator accepts the gap instead, the off-ramp is a waiver of criterion 6 recorded from the operator's captured words (`npm run resume -- waive 6 --reason <text>` with its capture flags), which the order's own executor never runs. Nothing is committed, pushed or published.
