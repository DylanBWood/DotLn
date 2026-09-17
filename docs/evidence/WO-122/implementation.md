# WO-122 implementation evidence

Dispatch: `resume: next`, 2026-09-17. Actor: Codex CLI 0.154.0,
gpt-6-astra, ultra (readback; normalized xhigh with subagent workflows).
The root agent is the only writable coding agent; delegated reviews are
read-only. Work-order verification and final review remain separate dispatches.

The resident catalog now launches the existing writer/inspection transport and
publishes durable human decision packets. CLI sessions receive explicit
resident store/episode stamps, run through a disposable supervisor, and return
validated envelopes with launch claims. Human questions release the process
slot, hold their work order through restart, and resume only on a valid option
from a current, unexpired continuation. See [decisions](decisions.md) for
sources, alternatives, corrections and reopening conditions.

| Acceptance | Executed evidence |
| --- | --- |
| 1 — CLI request, origin, envelope and unavailable row | [actor fixtures](actor-fixtures.tap): writer and inspection through resident and production transports with process doubles; X-U1 unavailable NoOp and zero launch; per-process native stamps; both envelope authorizations and failure paths |
| 2 — durable question, hold and answer | Same fixtures: packet contents; one request across restart; recovery after packet-before-event interruption; invalid/wrong-order/repeated answer refusal; answer resumes CLI; another order can dispatch after return; stale/expired answers cannot promote a phase |
| 3 — real launch while away | [live row](live.json): detached parent, actual Codex 0.154.0, gpt-6-astra at xhigh, source-change-v1, actor origin, operator away, validated envelope shapes |
| 4 — write-backs | Product 03 runtime catalogs, runbook, decisions and generated decisions index; legacy ledger duty follows the executor skill's pre-2026-09-09 substitution |
| 5 — tests, diff, dependency | Full product gate and diff check are recorded in the local host receipts at handoff; no third-party dependency change |

The final focused transcript records 20 passing tests, zero failures or skips.
Existing resident/presence/native-script coverage passed outside the sandbox
in the earlier broader focused run; that run's single failing new case was a
shared-reference fixture error corrected and covered in the final transcript.
The review run passed 27 suites and exposed one existing discovery digest
fixture that omitted its actor kind through a partial type cast. The fixture
now supplies a complete script declaration and preserves the digest assertion.
The fresh product gate is the handoff authority for the corrected tests; all
unchanged machinery suites passed in the review run.

The live worker's envelope reports **blocked**: its cleared tool environment
could not locate `node` for the declared test. Separately, the host observed
the requested file contents, ran that test successfully with its absolute Node
executable, and observed a new commit. These observations remain distinct; no
worker success, independent repair verification or general source-change proof
is claimed. Supplying a test command executable in the worker environment is
an input responsibility of the future writer host. The live collector's earlier
edit/test/commit requirement was stronger than WO-122 AC3; WO-053 owns that
full proof. All three earlier shapes-only attempts remain preserved.

The operator-confirmed adjacent repair removes `code_mode_host` from only the
Codex writer's disabled features; inspection argv remains byte-identical to its
baseline. Its existing named filesystem/network profile remains unchanged.
The queue records the scoped repair and its passing checks.

Current authority, artifact identity, verification and feedback editions are
under this order at revision 002; the original editions remain preserved. The feedback regressions and separate live CLI verifier passed;
the selected console selfhost snapshot was regenerated from that edition. The
existing audit's matched instruction-byte savings are not a WO-122 cost claim.
Generated runtime bindings include the two new pure contracts. Application
v0.28.0 and skeleton 0.24.0 stage the additive minor release; compiler, kernel
and console versions are unchanged. No branch commit or publication is part of this
executor handoff.

Limits: local handoff origin is observation, not hostile-process authentication;
the resident has one configured policy; CLI completion is never independent
verification; ordinary process-group cleanup does not claim hostile descendant
containment; stored authentication lifetime remains unknown. Final usage is
reported from ignored receipts rather than copied into this tracked report.
