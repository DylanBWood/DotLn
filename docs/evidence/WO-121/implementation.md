# WO-121 implementation evidence

Repair follow-up: [repair 001](repair-001.md) addresses VER-001 F1 and removes
O2's literal-only assertion. Its current evidence supersedes the historical
independent-authority claim below; the resident completion checks remain.

Dispatch: `resume: next`, 2026-09-16. Actor: GPT-6 Astra, ultra
(recorded as xhigh plus subagent workflows), Codex CLI 0.154.0, source
`codex-session-readback`. One writable root agent; delegated code reviews were
read-only. Independent work-order verification is a separate dispatch.

The resident now consumes origin-bearing observations, with separate human
inactivity, actor heartbeat and task progress state. Generated hooks record
reduced observations through the resident's existing append lock. The resident
passes only store/episode stamp metadata into its script environment. An actor
stall is diagnostic budget silence; it does not imply human return or revoke a
task's authority. Existing discretionary kill/finish rules remain intact.

| Acceptance | Evidence |
| --- | --- |
| 1 — origin classification and negative away streams | `presence-signals.test.ts`: both activity streams, stamped scripted prompt, explicit back and separately established human prompt; launch-path permutations; production resident fold |
| 2 — discretionary return, foreground completion | Six combinations of back/prompt with kill/finish/non-discretionary execution; nondiscretionary resident work completes and separate foreground authority remains valid; the existing WO-067 fixture models foreground completion |
| 3 — stalled actor separate from presence | Exact/late heartbeat deadlines, Stop followed by silence, in-flight clock sampling without new traffic, task progress independence, backward-clock command and stale replay fixtures |
| 4 — generated hooks and baseline | Generated Contributor hook execution, target PreToolUse execution and storage failure; `bundle-diff.json` checks old wrappers modulo pins, heartbeat-only settings additions, unchanged skills/instruction; canonical harness checks and hook regression suite |
| 5 — write-backs | Product 03, ADR-0007, decisions and generated decisions index; this order's legacy ledger duty uses the executor procedure's pre-2026-09-09 substitution |
| 6 — current evidence and repository gate | Fresh authority/artifact/verification/feedback editions; full repository gate and diff result recorded at handoff in local host check receipts |

[presence-fixtures-final.tap](presence-fixtures-final.tap) records 27 passing tests with
zero skips, including native macOS execution. The native environment fixture
proves the stamp survives the script supervisor and unrelated inherited
environment is absent. Replay remains independent of ambient clocks. Existing
WO-067/068 expiry, restart, return and native boundary tests pass in that run.

The observed installed harness profiles do not establish a typed prompt origin:
Claude C-W10 lacks the discriminator and Codex X-W10 has no observed prompt hook.
Their generated heartbeats therefore never count as human. The generic pure
contract supports an established human interaction for a future observed adapter;
its fixture does not claim that today's installed harness can supply it.
Explicit `away`/`back` remains the available human input. Presence authentication,
new actor kinds and automatic task selection are outside this order.

Human inactivity is optional `humanIdleMs` in the compiled policy, independent
of existing phase `decay.idleMs`. An explicit `DOTLN_RESIDENT_STORE` environment
binding enables hook ingress; missing bindings do nothing. Resident children
also carry `DOTLN_RESIDENT_EPISODE_ID`. Session/episode IDs stay local; prompt and
tool content are excluded. The current actor budget defaults to 30000 ms and
can be configured via `heartbeatBudgetMs`. Missed deadlines survive recovery;
observed/lost managed outcomes retire actors and late traffic cannot revive them.

Feedback edition 002 completed ten passing regressions and ten removal failures,
then a separate live `codex-cli-exec` verifier completed all acceptance rows.
It launched with model `gpt-6-astra`, effort `max`; these are launch selectors,
not effective model readback. The saved 1192 instruction bytes are the existing
feedback audit's matched projection, not a claimed WO-121 cost reduction.
The immutable report and reduced audit/verifier streams are retained in
[feedback-002](feedback-002/feedback.json). Edition 001 is preserved as the
earlier cutoff before the final input-boundary corrections.

Application v0.26.0, compiler 0.13.0 and skeleton 0.22.0 stage the declared minor
release above the local v0.25.0 tag snapshot. Kernel, console behavior and third-party dependencies
are unchanged. Earlier evidence editions are preserved. No commit, push or
publication is part of this executor result.

Initial integration checks found fixture assumptions tied to the old generated
file set, the target owned-path allowlist, and the authority evidence adapter
parser. These now explicitly account for the observational heartbeat while
retaining guard assertions. Local exploratory logs are retained under `.runtime`;
the final repository gate is the handoff authority, not those earlier failures.

The first gate was stopped during preparation because an earlier projection
refresh was still finishing. The second was stopped after 60.2 seconds for two
review findings: reject invalid explicit presence arguments instead of coercing
them to back, and reject stale actor refreshes during replay. Both have focused
regressions; neither stopped gate recorded a success. Revision 002 binds the
corrected source, and the final gate follows it.

The first completed repository gate took 447.13 seconds: 17 suites passed and
two failed. The console's selfhost fixture still selected WO-049 feedback;
the existing recorder now pins WO-121 feedback edition 002 and its three
rendered snapshots. No console behavior changed. The release runtime-refresh
fixture failed with suppressed clone output; its isolated rerun passed all
six scenarios. Clone failures now print their captured diagnostic, preserving
failure behavior. A subsequent complete gate must establish the handoff result.

Correction, 2026-09-17: the new foreground fixture checks independent authority,
not execution of a separate foreground action. Acceptance row 2 and its test
diagnostic now distinguish that assertion from nondiscretionary resident
completion and the existing WO-067 modeled completion fixture.
