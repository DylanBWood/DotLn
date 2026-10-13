# WO-118 handoff

The repair of VER-001 (`resume: fix`) is complete. One witnessed run from a
fresh export of the repaired subject now carries criteria 1 to 5 together. The
resident took the filed intent through all 14 phases to a resolved terminal
state. It replaced a killed native writer and resumed after its own restart.
Its triage rejected the planted suggestion and repaired the delayed one. The
shipped console showed the run live, and the audit view reproduces it
afterward. Live status now retires finished continuations. The outcome matches
WO-118-D009's repair rule and the order's goal within its declared scratch scope.

**Criterion 1:** met — [witnessed receipt](witnessed-run/receipt.json), [event log](witnessed-run/event-log.json) and `check-witnessed-run.mjs` (bounded, exit 0). The resident's actors performed every phase transition. The only human-origin events are the presence-away setup event and the two intent filings; the [control actions](witnessed-run/control-actions.json) name the setup control-author mapping and control issue, the writer kill, the resident restart, the NeedsHuman answer and the planted suggestion. The representative ended resolved, with every automated item resolved and no NeedsHuman. The answer was posted and not consumed, the carried limitation.
**Criterion 2:** met — the native writer was killed with SIGKILL after one heartbeat, with no commit and no edited path, while the resident stayed alive. The resident replaced it under the same command and episode after the process group stopped, and the step made one source commit. The resident restarted between the bundle and contract steps under one admission, one opened vertical and the same identities; the ledger holds one start and one settlement for the source step.
**Criterion 3:** met — the pull request has a generated title and body. Model triage accepted the delayed whitespace suggestion; one repair commit fixed it, and verification passed the delivered head against the original criterion. Triage rejected the planted suggestion with three evidence references, and both threads are resolved. The outward screen passes the branch, title, body, both commits and the runtime's reply, and the delivered tree holds none of the declared terms or path prefixes.
**Criterion 4:** met — the exported instance's console ran live from before the first command to after the terminal state ([transcript](witnessed-run/console.txt)). Its change-driven frames painted every step lasting two refreshes or more as live vertical-host work, the contract hold beside it, derived order WO-902 active, the work after the restart and the finished frame. [Snapshots](witnessed-run/status-snapshots.json) cover all 14 settlements. `dotln audit` reproduces the vertical store (all 29 events, equal to the log) and the resident store ([vertical](witnessed-run/audit.txt), [resident](witnessed-run/resident-audit.txt)).
**Criterion 5:** met — [measures](witnessed-run/measures.json) label all 24 rows observed, launch-claim or unknown, with methods; the eight parity items are observed-met and bound the replacement claim; the checker recomputes the observed measures from the stores.
**Criterion 6:** met — the product 00, product 12 and README.md sentences stay in place and remain true. The capability table's WO-118 section cites the witnessed receipt. Decisions WO-118-D011 to D014 are recorded. `npm run publication:check` reports both editions current, `node scripts/lineage.mjs index --check` passes and `npm run plan -- check` passes.
**Criterion 7:** met — `npm test -- --review` passed 36 suites and 91 fresh tasks with no failure in 1,335,688 ms, recorded 2026-10-13T11:58:03.830Z. `npm run test:docs` passed 35 fresh tasks with no failure in 99,177 ms, recorded 2026-10-13T11:35:33.447Z. Both ran at code identity `99fb21b175c81af5e893fdbd22fe96663e9ae34df959772247cd2dac98f35448` with identity and build output unchanged ([checks.json](checks.json)). `git diff --check` is clean, and no dependency was added.

self-review: found 26; fixed 21; recorded 5

Two fresh `dotln-worker` reviewers each found no blocking issue: the criteria
adversary found 11, fixed 9 and recorded 2; the design improver found 15, fixed
12 and recorded 3. [self-review.md](self-review.md) lists every finding, and
[WO-118-D014](decisions.md#wo-118-d014--independent-review-of-the-repair)
records why the five were declined. Three would change a file the witnessed
export carries, for wording or naming alone; one would rewrite a bound status
sentence that remains true; one is a design option for WO-083's planner.

## What this dispatch repaired

- The live view (VER-001 F1):
  [WO-118-D013](decisions.md#wo-118-d013--the-witnessed-run-carries-criteria-1-to-5)
  records the witnessed run. The review-control author mapping was setup,
  before the resident started and before the first intent.
- Unbounded status rows (F3):
  [WO-118-D012](decisions.md#wo-118-d012--finished-continuations-leave-live-status)
  retires a continuation whose latest step settled terminally; a terminal one
  keeps at most its hold. A new status test covers several finished intents, and
  `probe-status-retirement.mjs` shows that test's ledger giving 27 rows before
  the repair and 2 after. The kit README states the rule.
- The carry-in record (F4): the witnessed receipt records WO-123-D044's five
  conditions; none occurred.
- FUP-1b4aeae6d87b3c7e, WO-118-D009's repair rule, is settled in the register.
- The host guard: a stale guard from a removed worktree held the lock without
  its record, so the bounded wrapper and both gates failed. With the operator's
  authorization it was stopped, and a fresh guard now runs
  ([WO-118-D011](decisions.md#wo-118-d011--repair-dispatch-run-the-witnessed-rerun-and-restore-the-host-guard)).

The final subject's `packages/`, `scripts/`, package files and `tsconfig.json`
are tree-identical to the candidate the witnessed run exported. The current
core build of its runtime files equals the export's.

## Routed, not fixed here

- FUP-e18e6a5422109bfb: a host guard can lose its record while holding its lock
  (machinery).
- FUP-eeb25ea9315438ad: an unbound portfolio actor leaves a standing
  `actor-unavailable` hold beside vertical work (before WO-083).
- FUP-589c1d588cb302a9: home-directory paths in WO-187's records at HEAD.
- FUP-a272d577fd351b43: runtime identifiers in target-facing text, VER-001's F2
  (before WO-083).
- FUP-0126's `needs-review` state predates this dispatch. The planner owns it.

## Process cost

Entry usage was 102,758 tokens (observed 2026-10-13T10:21:22Z). At handoff,
before this file and the completion's own document gate, usage was 73,162,663
tokens (observed 2026-10-13T11:58:40Z): 72,379,183 cached input and 256,320
output. Source `claude-transcript-message-usage`, scope dispatch. Reasoning
tokens and dollar cost are unavailable. The counts are cumulative transcript
totals, almost all cached input, so they do not measure live context.

Launches against the dispatch's cap of 20: 13 native model launches in the
witnessed run (2 intake records, 7 worker attempts, 4 triage records), which the
harness cannot observe, and 2 Claude reviewers, which it observed; 15 in all.

Wall-clock:

| Work | Duration |
| --- | --- |
| Witnessed run | 560 s |
| Review gate | 1,336 s |
| Document gate | 99 s |
| Native recovery suite, before the guard restart | 372 s |
| The two reviews | 935 s |

## Attestation and limits

Attestation: Claude Code 2.1.296 (`claude --version`), model `claude-opus-5-5`,
effort `max` from the `CLAUDE_EFFORT` readback (selected, not effective). The
operator selected max with `/effort`, with Ultracode on.

Limits:

- One representative scratch scenario, witnessed by the executor under
  WO-112-D007's delegation; there is no operator-terminal attestation.
- Native effective model and effort are launch claims. Actor tokens, cost and
  human time remain unknown.
- The ambiguous answer is not consumed, the carried limitation.
- The retained run directories sit under the system temporary root and can be
  purged.

No nested repository remains in this worktree, and no proof process remains.
All started residents and consoles were stopped. Every authored output was read
after it was written. Core publication awaits verification and final review.
