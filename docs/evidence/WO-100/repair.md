# WO-100 repair — VER-001 F1

Dispatch: `resume: fix`, 2026-09-22, recorded by the harness before this
procedure loaded. Subject: the one finding VER-001 routed to repair, with its
structured follow-up [WO-100-D009](decisions.md#wo-100-d009). VER-001, the
implementation record and its transcripts are unchanged; this record adds
[WO-100-D010](decisions.md#wo-100-d010).

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.280","model":"claude-opus-5-5[1m]","effort":"unknown","source":"harness-session-model-statement"}

The model is the identifier Claude Code states for this session; nobody
supplied an effort for this dispatch and the harness exposes no effective
readback, so effort is `unknown`. The version is `claude --version` at handoff.

**Process cost:** the entry counter at 2026-09-22T19:16:32Z read 83,353 total
tokens; at 19:33:17Z `node scripts/harness.mjs usage
1d45c483-3669-4d3e-9ed2-98fbb161d691` reported 9,355,342 total tokens (input
140, cached input 9,153,134, cache write 157,547, output 44,521), reasoning
tokens and dollars unavailable, source `claude-transcript-message-usage`, scope
`dispatch`, over 78 steps and 67 commands; later handoff steps are not in
that reading. Observed subagents 0 of the configured cap of 20, with an unknown
unobserved remainder; no agent or paid external worker was launched. The full
product gate ran once (350.70 s) and dominated wall time.

## Finding and repair

**F1 — a valid Sort move with a pathless check could not reach independent
verification (D009 → D010).** `verificationSurfaces` in
`packages/skeleton/src/portfolio-host.ts` selected only the order's paths and
its commands' path tokens present in both snapshots. A move from
`loose/guide.md` to `docs/guide.md` checked by `npm test` found none, and
`verify` threw before WO-054 opened. When that narrow selection is empty, the
single WO-054 criterion is now anchored on every file both snapshots hold,
because a command such as `npm test` runs over the whole tree. WO-054's rule
that each criterion surface is a file of the baseline and of the subject is
untouched, as are the host relocation check and WO-052's surfaces. The narrow
selection keeps precedence wherever it finds a path, so existing Sort, Shine
and Standardize criteria keep their surfaces. The skeleton README states the
rule.

**Regression.** The Sort test in `scripts/test-portfolio.mjs` gained two runs
of the same exact move under a portfolio whose `misplaced-file` check is
`npm test`, each at a new bound base so each is its own WO-120 identity. With
`package.json`'s `test` script running the placement check, the move passes
2 of 2 criteria, the verifier is dispatched once, and its capsule criterion
lists every file of the base tree except `loose/guide.md`. With the script
also running the failing `checks/test.cjs`, the same move fails 1 of 2 with one
finding after the verifier ran: the pass comes from the check, not from the
new surfaces. The existing path-bearing move, copy and escalation runs are
unchanged. **Negative control:** before the host change, the test stopped at
the first pathless run with `portfolio verification has no surface in both
trees`, reproducing VER-001's observation, after the earlier runs in the same
test had passed.

## Defects met inside the repair

None beyond F1. The throw remains for a change whose two snapshots share no
file at all, which WO-054 cannot verify by construction; the actor records it
as a failed episode and the curve resets.

## Checks executed (2026-09-22)

| Command | Result |
| --- | --- |
| `node --test --test-reporter=tap --test-concurrency=1 scripts/test-portfolio.mjs` | 3 tests, 3 pass, 0 fail ([repair-001-portfolio-e2e.tap](repair-001-portfolio-e2e.tap)) |
| `node --test --test-reporter=tap packages/skeleton/dist/test/portfolio.test.js` | 5 tests, 5 pass, 0 fail ([repair-001-portfolio-unit.tap](repair-001-portfolio-unit.tap)) |
| `npm test` | **26 passed, 0 failed, 350.70 s, 70 fresh tasks** |
| `npm run test:docs` | **20 passed, 0 failed, 29.23 s, 20 fresh tasks** |
| `node scripts/{authority,artifact-identity,feedback,verification}-evidence.mjs --check` | all four exit 0; the selected editions stay current, since none records the portfolio host's bytes in its output |
| `npm run publication:check` | 275/275 headings; both editions CURRENT (30 and 45 linked sections) |
| `npx prettier --check` on the two changed code files | clean |
| `git diff --check` | clean |
| `npm run release -- prepare --local` | `WO-100 target v0.43.0 remains current; no files changed` |

## Limits

- Effective model and effort are `unknown`; the attestation is the session's
  stated model and an unsupplied effort.
- The fallback locates the criterion on the shared tree; it adds no claim.
  WO-054 still judges only whether the named commands pass, and a Sort move's
  obligation is still the host relocation check.
- `npm test` launches inside WO-054's confined copy only where the host's
  test PATH (the Node binary's directory, `/usr/bin`, `/bin`) provides npm,
  as the Node directory does on this machine. Otherwise the host records the
  launch unavailable, and `verification-protocol.ts` refuses a pass whose
  required check has a non-passing witness, so the order cannot pass.
- The implementation's transcripts `portfolio-e2e.tap` and
  `portfolio-unit.tap` keep their bytes as that cutoff's evidence; the repair's
  own transcripts are separate files.
- No second economy experiment: D002 is this order's one decision.

## Follow-up queue

Revision 5 at entry and at handoff: the implementation's `adjacent-0001` is
completed, nothing is running and `next` is null. This repair added no item.
