# WO-068 implementation evidence

Dispatch: `resume: next`, 2026-09-16. Subject: the uncommitted WO-068 worktree.
Actor: Codex, GPT-6 Astra, max, operator-attested defaults; effective setting
readback is unavailable. Independent verification is a separate dispatch.

The host runs one selected compiled presence policy, one script at a time,
with explicit clock/presence events and an optional reactor slice. The existing
WO-067 fixtures now use the production interpreter. Existing Decision identity
fixtures remain unchanged. It is operator-started infrastructure, not an
automatic Contributor-stage scheduler or work-order selector.

| Acceptance | Executable evidence |
| --- | --- |
| 1 — phases, cadence, return kill/finish, replay | `resident.test.ts`: recorded clock, in-flight return and ambient-clock-poisoned byte replay; retained WO-067 interpreter tests |
| 2 — crash, exclusive lock and inspected reclaim | Real CLI subprocess SIGKILL, orphan heartbeat cessation, live contender refusal, restart/lost identity; malformed/torn state preserved |
| 3 — authorization, declared worktree, environment and reduced output | Effect/evidence/scope/resource refusals; native exact argv/cwd, absent inherited sentinel, stdout digest/first line; timeout and output cap |
| 4 — unavailable actor | Local-model NoOp names WO-110; fake script launch count remains zero; native unsupported boundary has no fallback |
| 5 — one-tick mode | Fresh CLI `--once` exits zero; two fresh fake-clock once processes and one two-tick process produce identical complete JSONL |
| 6 — idle expiry and rearming | Fake-clock deadline expires; repeated away does not replenish; back/away rearms the first phase |
| 7 — write-backs | Product 02/03, both READMEs, dated capability row and decisions |
| 8 — product/release evidence | Full gate and immutable current evidence are recorded separately at their final cutoffs; no new dependency |

The focused native fixture requires execution outside Codex's nested sandbox:
inside it, `sandbox-exec` refuses its initialization. Under the native profile,
the loopback probe receives EPERM. This is a native macOS script capability;
other operating systems are unavailable, not claimed supported. The host uses
no network. Script effects are exact owner-authored commands with checked
declared resource reservations; actual file/line accounting, hostile same-user
containment and independently verified source changes are not implemented here.

The script success check is exit zero plus an owner-declared expected stdout
SHA-256. This proves that bounded acceptance contract, not arbitrary task
correctness. A supervisor owns the deadline and terminates the ordinary process
group after parent IPC disconnect. Timers and script output are edge effects;
replay samples neither. Command/configuration and reduced output remain local
store data supplied by the owner.

Source inventory expansion pins the new reactor dependencies in harness
snapshots and feedback evidence. The component advances to skeleton 0.19.0 and
application v0.23.0 under the order's minor classification. Kernel, compiler and
console versions remain unchanged. No commit or publication is part of this
executor handoff.

Focused evidence: [resident.tap](resident.tap) records 45 passing tests across
the resident, shared presence interpreter and existing reactor-slice identity
fixtures. Feedback revision 002 completed with ten passing regressions and a
separate live `codex-cli-exec` verifier launched as GPT-6 Astra at max; these are
launch selectors, not effective model readback. Earlier audit/report bytes are
preserved and are not the selected final source evidence.

Final repository gate: `npm test` passed at 2026-09-16T15:48:44.181Z,
19 suites, zero failures, 63 freshly executed tasks, 248,809 ms. The canonical
host gate records code identity
`288a413d6a727b27a909eff54fd7fbe198206483fa9e35b24eb073fd3249305b`.
The transcript is retained locally at `.runtime/wo068-full-gate.log`.
Current authority and feedback edition checks, generated harness checks,
publication checks and `git diff --check` also pass. Independent work-order
verification and final review remain separate dispatches.
