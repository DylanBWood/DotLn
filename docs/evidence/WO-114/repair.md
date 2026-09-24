# WO-114 repair evidence

Dispatch: `resume: fix`, 2026-09-24. Repair source:
[VER-001](../../verifications/WO-114/VER-001.md), findings F1–F6.

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.156.1","model":"gpt-6-astra","effort":"xhigh","source":"codex-session-readback"}

The repair keeps the original work-order scope and application target
`v0.47.0`, with skeleton `0.40.0` and console `0.2.0`. No external dependency
was added. The recorded verification report remains immutable. Decisions
[D010 and D011](decisions.md#wo-114-d010--repair-publication-and-consumer-boundaries)
explain the implementation and correct the earlier contract and evidence claims.

| Finding | Repair and executed evidence |
| --- | --- |
| F1 — publication cost | Status uses temporary-file write and atomic rename without file or directory fsync. The authoritative event log retains fsync, and every event still publishes. The unchanged WO-143 sixty kill/restart rounds passed in 32.53 s in isolation, versus VER-001's observed 31.8–32.4 s baseline and 39.3–48.0 s prior implementation. The original 60 s timeout also passed inside the full gate. These are individual observations, not a guaranteed timing bound or a fresh paired benchmark. |
| F2 — competing index sources | The lifetime owner records the selected index path in private `.runtime-status-source.json` metadata. Every store writer reads that binding. The CLI obtains the launchpad and configured work-order root through the existing configuration resolver. The regression observes all seven publications across start, a presence helper, the installed snapshot's heartbeat and a clock sample; each equals replay from its log prefix and retains the fixture's derived WO-999. A separate CLI fixture exercises `DOTLN_LAUNCHPAD` plus a configured index root. |
| F3 — projection failure interrupts work | Index read failures produce an unavailable order section; all projection/write failures are contained after the durable append. A directory at the status path exercises failures during start, presence and dispatch: the presence clock event remains, the actor runs, and its observation is recorded without a lost episode. Removing the obstruction lets the next tick rebuild; replacing an unreadable index restores the order section; restart reproduces the final bytes and releases ownership normally. |
| F4 — watcher crashes and duplicates | The watcher subscribes before its initial read, catches read/decode failures, reports a generic unavailable state, and compares decoded views to suppress duplicate notifications. A spawned CLI starts without a file, survives deletion, malformed JSON and a foreign version, and resumes after each valid replacement; repeated identical replacement renders once and emits no path or stderr. |
| F5 — contract inaccuracies | Decoder validation now applies the schema's WO-NNN rule to episode, hold and order-row identifiers. Differential tests cover valid, null and malformed identifiers in all three locations. The README identifies the schema as a file and the type/decoder as skeleton definitions re-exported by console. D011 corrects D004 while preserving its historical record. |
| F6 — display controls | The status renderer replaces terminal controls, bidi controls and Unicode line separators. A decoded fixture carrying those characters verifies they do not survive rendering. |

The original five pinned status hashes still pass. The five actor-board
fixture cases remain byte-identical. Privacy assertions cover the fixture
store path and the synthetic heartbeat session identifier. Publication remains
a disposable view of the event log and selected current index, not a command or
work-order authority. An unavailable index or binding stays visibly unavailable.

Executed checks on the repaired code:

| Check | Result |
| --- | --- |
| `npm test` | 27 suites passed, 0 failed; 293.52 s; 71 fresh tasks |
| `npm run test:docs` | 21 passed, 0 failed; 24.60 s |
| Focused skeleton and console runtime-status tests | 10 passed, 0 failed |
| Unchanged WO-143 thirty-round test, once and loop | Passed; 32.53 s test duration, 32.59 s process duration |
| `node scripts/console-fixtures.mjs --check` | All five cases matched JSON, terminal and HTML |
| Authority revision 002 `--check` | Passed; 34 bundle comparisons |
| Feedback revision 001 `--check` | Passed; existing live audit judged current registered behavior |
| `npm run plan -- check`; `npm run format:check`; `git diff --check` | Passed |
| `npm run publication:check` | 275 headings covered; both audience source locks current |
| `npm run release -- prepare --local` | Existing v0.47.0 target remains current |

The harness snapshot was regenerated and authority revision 002 selected.
Feedback revision 001 remains selected after its executable source check;
this repair launched no live model episode and no subagent. One early focused
run failed only because the new test removed its temporary directory before
closing its host; teardown order was corrected and the suite then passed.
Publication source locks were refreshed after the authorized product edit.

Process-cost entry observation: 50,577 total tokens, source
`codex-transcript-counter`, scope `dispatch`, cutoff 2026-09-24T22:45:35.915Z.
Handoff counters remain in the ignored harness receipt and operator response;
dollar cost is unavailable. The existing D002 economy decision was read and
its D008 reopening addressed by this measured repair; no second experiment
was introduced.

Limits: filesystem notifications and timing were exercised on this host;
there is no cross-platform timing guarantee. Publication faults are synthetic.
Independent re-verification and final review remain separate dispatches.
