# WO-139 execution evidence

The subsequent `resume: fix` repairs FINAL-001 F1 and F2. See the
[repair evidence](repair-001.md) for the runtime pin, advisory provenance,
regressions, regenerated authority revision 003 and passing review gate.

The counter uses the root `session_id`, child `agent_id`, and direct
`tool_use_id` observed in [probe 2](subagent-probe-2.json), Claude Code
2.1.276 on 2026-09-18. All 22 hooks shared the supplied root session.
The direct child read used the same anonymous identity later returned by
Agent's `tool_response.agentId`; the two workflow reads used distinct child
identities. Hook payloads contained no spawning invocation on child calls.
Identifiers and paths were reduced to anonymous equality labels; no raw
transcript is retained. The launch requested `claude-fable-5`, effort xhigh;
these are launch selectors, not effective-model attestations.

The [first attempt](subagent-probe.json) observed the direct Agent path but
its scratch guard rejected Workflow because the host expanded `scriptPath`
to an absolute path. Probe 2 corrected the guard and observed one direct
Agent, one Workflow and two workflow children. Later fixture tests harden
exact read paths and once-only parent calls; they do not rewrite the live
observations or claim that their earlier guard had those later protections.

| Harness / path | Admission and accounting | Limit |
| --- | --- | --- |
| Claude Agent | Parent PreToolUse reserves a unit before creation; exact result joins child identity afterwards. | Native host denial after admission may leave a conservative reservation; no speculative refund. |
| Claude Task | Same classified direct-spawn branch, covered by fixtures. | No live Task call in this row; it is a compatibility adapter, not separately observed native creation. |
| Claude Workflow | Parent call needs remaining budget, consumes no unit itself. | Descendants already exist before their first hook. |
| Claude workflow `agent()` | Each attributable `agent_id` is recorded at its first admitted tool call in the root counter. | Tool-free agents are unseen; unresolved direct admissions can overlap later child observations. |
| Codex `collaboration.spawn_agent` | Classified as spawn, but no project hook in the recorded Codex profile; role text and the stated session plan apply. | No automatic refusal or measured creation total is claimed. |

The counter serializes separate state under `docs/control/local/harness/`.
Repeated hooks/tool identities do not debit twice. Direct admissions cannot
overlap children already observed before that admission. For later children,
the counter computes the minimum distinct count consistent with unresolved
direct reservations, labels it `minimum-observed`, and joins only on the
returned Agent identity. It never assigns a guessed parent. Two unresolved
direct agents and two later workflow children may therefore mean four actual
agents while the current minimum is two; exact late joins expose the excess.
This gap, tool-free agents, unknown identities and unavailable counters remain
in product 07's open total-cap candidate. `null` disables refusals; missing,
invalid or unreadable counter/budget state admits with a named advisory.

The operator-expanded planning fix records WO-053's authorized amendment as
`PlanExecutionAmended` in the existing planning control log. It binds receipt
017, the original and approved order, and WO-053-D002. It preserves historical
receipts and existing execution records; strict later execution appendices
and release retiming remain admitted. Fixtures reject unrecorded edits,
forged bindings, changed or external decision evidence, and attempts to
discharge independent holds through an amendment.

The same check exposed an overwritten capability row inherited from WO-053.
The repair restores WO-052's judged assessment and appends WO-053's exact newer
row as a dated reassessment. Before commit, the check admits only this proven
history-preserving repair and labels it pending; every changed HEAD row must
survive exactly in the appendix. Fixtures cover the pending and committed
states and reject omitted/altered claims, changed IDs, headings or line counts.

Validation on 2026-09-18 before the writer-release scope expansion:

| Check | Result | Evidence |
| --- | --- | --- |
| `npm test` | 19 suites passed, zero failed; 363.18 seconds | [Final gate](npm-test.txt) |
| `npm run test:docs` | 17 checks passed, zero failed | [Document gate](document-gate.txt) |
| Planning continuation and current receipt | Passed, including both inherited failures | [Continuation](planning-continuation.json), [current check](planning-check.txt) |
| Planning fixtures | 41 passed | [Fixtures](planning-fixtures.txt) |
| Subagent accounting | 9 passed, including concurrent admission | [Fixtures](subagent-tests.txt) |
| Harness integration | 48 unaffected cases passed in the broad run; both updated expectations plus the cap integration passed in the 3-case rerun | [Initial run](harness-fixtures-initial.txt), [updated cases](harness-updated-tests.txt) |
| Probe confinement | 7 passed | [Fixtures](probe-fixtures.txt) |
| Compiler | 106 passed | [Fixtures](compiler-tests.txt) |
| Console answering cells | Passed after recording the current audited feedback edition | [Fixture](console-answering-cells.txt) |
| Generated harness and four evidence editions | All checks passed; 28 generated surfaces match | Document gate; current authority, artifact, verification and feedback edition 001 |
| Publication and whitespace | Passed; no added dependency | [Publication](publication-check.txt); `git diff --check` |

The broad harness run's two failures expected the pre-cap Stop-message prefix
and usage return shape. Their assertions now check the preserved process
observation plus the separate subagent observation. The first full gate also
caught an old compiler boundary phrase; the corrected assertion explicitly
requires Codex's role-text cap without automatic enforcement. The final full
gate above passes. Historical probe/evidence editions retain their bytes.
The console selfhost fixture now pins this order's audited feedback policy;
its prior policy hash correctly produced unavailable maturity cells.

Local release: application `v0.29.5`, compiler `0.13.2`, skeleton `0.25.4`,
patch classification; no new dependency. Verification and final review are
separate dispatches. [Decisions](decisions.md) carry authority and alternatives.

The subsequent operator-expanded writer repair makes `implementation-ready`
and `repair-complete` update the final index and automatically release the
current Codex session's reservation. No manual release step is added. Failed
pre-append validation retains ownership; once the event records, a projection
failure also releases ownership and reports that the transition must not be
repeated. The fixture keeps the host alive, exercises both completions and an
interrupted index write, and proves that a subsequent verifier can acquire
immediately and its reservation survives another session's cleanup.

Validation after that expansion, on 2026-09-18:

| Check | Result | Evidence |
| --- | --- | --- |
| Automatic executor/fix handoff | Passed all scenarios in the lifecycle fixture | [Focused regression](lock-targeted.txt) |
| Complete harness regression run | 51 passed, zero failed; 624.97 seconds | [Harness](lock-harness.txt) |
| Existing resume suite | Passed | [Lifecycle](lock-resume.txt) |
| `npm test` | 19 suites passed, zero failed; 560.34 seconds | [Product gate](lock-npm-test.txt) |
| `npm run test:docs` | 17 checks passed, zero failed; 374.18 seconds | [Document gate](lock-docs.txt) |

After that expansion, authority and feedback selected revision 002; the repair
above advances authority to revision 003. Artifact identity and verification
remain revision 001.
The new feedback edition includes a fresh live audit and independent verifier,
and the console fixture follows it. Earlier editions retain their bytes. The
planning checks still pass with both inherited failures repaired. The broader
runs overlapped and their measured elapsed times exceed the 120-second fast-gate
budget; no performance improvement is claimed. No additional lifecycle result
was fabricated for the scope expansion after the recorded ready-to-verify state.
