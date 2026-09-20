# WO-144 repair of VER-001

`resume: fix`, 2026-09-19. Repairs F1, F2, N1 and N2 from
[VER-001](../../verifications/WO-144/VER-001.md), plus its inventory observation
O1 and the encountered crash-fixture race. Decisions are
[D004–D006](decisions.md). Original implementation evidence and VER-001 remain
preserved; this report records the repaired subject.

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.155.1","model":"gpt-6-astra","effort":"xhigh","source":"codex-session-readback"}

One writable executor, zero subagents. No branch commit or publication.

| Finding | Repair and executed evidence |
| --- | --- |
| F1: null redirects refused | The extractor marks redirects; the guard exempts only a literal `/dev/null` redirect whose destination is the character device. Generated-hook fixtures admit `2>/dev/null`, `>/dev/null 2>&1` and `&>/dev/null`, and refuse `rm /dev/null`, `touch /dev/null` and the existing ungranted-first-target plus `/dev/null/child` case. |
| F2: scratch undiscoverable | Preserve the recorded operator choice of DotLn-managed scratch. Claude role dispatch prints the concrete path; `node scripts/harness.mjs scratch` retrieves it in Codex, and explicit session entry returns it. Role text directs its use and states that native scratch and `/tmp` need a separate grant when outside `os.tmpdir()`. A split-TMPDIR fixture checks both refused alternatives and the admitted printed path. |
| N1: four identical judgment rows | Every pre-tool boundary still judges; the permission hook alone records outside-write judgments. The four-hook fixture records exactly one granted-destination row. |
| N2: granted writes reported as settings changes | A granted write uses its admitted outside-write effect, while credential classification retains precedence. Repository suppression comparisons omit outside files without reading them or claiming to inspect them. Fixtures check the permission and post-tool messages. |
| O1: inventory misses new rows | The scanner summarizes recorded judgment rows by role, root kind and status separately from legacy extracted destinations. It preserves and labels historical duplicates. The executed inventory found 204 judgment rows; it does not claim 204 calls or writes. |
| Encountered fixture race | The first product gate failed in `killLockProcess` with `Unexpected end of JSON input`. The parent observed the pause file before the child finished writing it. The operator confirmed the bounded fixture repair; publishing complete bytes through a sibling-file rename fixes the ready signal. All original crash assertions and production lock code remain unchanged. The product rerun passes. |

Executed checks:

- `node --test scripts/test-harness.mjs`: **106 passed, 0 failed**. Includes
  the new repair regression, original outside-grant cases, correction narrowing,
  the four earlier refusals, shell extraction and repository suppression checks.
- `npm test`: **21 suites passed, 0 failed**, 65 fresh tasks, after the fixture
  repair. The earlier run had 20 passing suites and one failure; its output and
  failed gate row remain in ignored local evidence.
- `npm run test:docs`: **19 passed, 0 failed** before the final fixture-only
  edit. That edit also passed Prettier and the final product gate.
- Generated bundle: **31 surfaces match**. Authority evidence revision **002**
  matches the repaired bundle; the initial edition and revision 001 remain preserved. Artifact,
  verification and feedback evidence still pass without new editions.
- Planning check, publication source locks, local release preparation and
  `git diff --check` pass. Stale decision/follow-up projections and publication
  locks encountered during editing were refreshed through their existing tools.

Cold-start bytes, identical in both harness roots: executor **22,020/24,576**;
verifier **19,062/20,480**; reviewer **20,280/20,480**; release-close
**13,286/16,384**; planner **14,352/24,576**; refuter **15,009**, no configured
ceiling. No ceiling changed. The release remains application **v0.33.0**,
compiler **0.16.0**, skeleton **0.29.0**; no dependency was added.

Limits: this repair ran in Codex and exercised generated Claude hooks through
fixtures, not a new live Claude session. Known destinations only remain the
guarantee; opaque effects, Codex enforcement, native scratch discovery and
order-contract propagation remain outside this order. Standard-stream device
paths receive no new grant. A standalone impossible `/dev/null/child` still
uses the existing path-resolution-error advisory behavior; the exception never
matches that spelling. These are not claims of filesystem confinement.

Outcome against D004: ordinary null discards and authorized scratch work have
tested usable paths; accidental folder writes retain their refusal. D005 removes
the inventory blind spot, and D006 removes a reproduced fixture synchronization
race. Both queued items are complete. Usage and gate timing observations remain
in ignored local receipts and the handoff response; dollar cost is unavailable.
Independent verification and final review retain their separate dispatches.
