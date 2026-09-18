# WO-054 VER-002 repair

Dispatch: `resume: fix`, 2026-09-18. Failure source:
[VER-002 N1](../../verifications/WO-054/VER-002.md#n1--major-the-generated-role-text-breaches-two-cold-start-ceilings-which-are-left-advisory).

**Actor attestation:** {"harness":"codex-cli","harnessVersion":"0.155.0","model":"gpt-6-astra","effort":"xhigh","source":"codex-session-readback"}

The operator directed incrementing the budget now and reserving efficiency
changes for a later pass. [D006](decisions.md#wo-054-d006) records that choice.
Both affected cold-start ceilings rise by 4,096 bytes in
`docs/control/budgets.json`, with dated entries naming the added shared
advisory-boundary and Codex continuation rule:

| Role | Measured bytes, both roots | Previous ceiling | New ceiling |
| --- | ---: | ---: | ---: |
| executor | 20,849 | 20,480 | 24,576 |
| release-close | 12,437 | 12,288 | 16,384 |

The measurement first reproduced both breaches. After the change,
`node scripts/harness-context.mjs --check` reports both roles within their
ceilings and emits no cold-start breach advisory. The existing targeted test
`budgets keep unselected caps unset and cold-start measurement ignores product
prose` passes (1/1). `npm run meta` also reports both roles within their limits
and refreshes the decision index. The historical 344,065 ms gate-time advisory
remains a separate efficiency observation, outside N1's cold-start correction.

Product 07 records the decision and the software-engineer publication source
lock is refreshed for that paragraph. The rule text and runtime are unchanged.
A direct Git blob comparison with verification checkpoint 8 matched all 486
non-document regular files, including new untracked sources and generated
hooks. This repair does not rerun the product gate; VER-002 records its prior
passing gate and the limits of that evidence. No new runtime behavior is claimed.

Local release preparation retains v0.30.0 without a version change. Final
document, planning, metadata, publication, release-surface and whitespace
checks are recorded at handoff. There were no subagents. At entry, session token
and dollar counters were unavailable; handoff counters, source and cutoff remain
in the ignored usage receipt and the response. No efficiency saving is claimed.
