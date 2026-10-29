# WO-234 repair 002 design review

Fresh independent codex-spawn-agent, selected gpt-6.1-sol/max. Effective values
beyond launch metadata are unobserved. Read-only: no edits, tests, probes,
lifecycle commands or descendants. The coordinator files this worker response.

Reviewed the order, VER-002, full current work-order implementation, repair diff
against checkpoint 11, relevant callers and tests. The usage catch stays at the
presentation boundary, and admission counting uses retained task evidence with
an explicit legacy fallback.

The initial repair had no design finding. On the material timestamp refinement,
found one call-contract defect: a stored phase-request index belongs to full
order history, while lifecycle callers supplied activation-trimmed acceptance
events. Recovery now reads full order history independently, with the distinction
explained in code. The reviewer rechecked that correction and the first-activation
and reactivation regression. No further design findings.

self-review: found 1; fixed 1; recorded 0
