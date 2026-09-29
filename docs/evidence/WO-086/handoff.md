# WO-086 repair handoff ledger

Executor: Codex CLI 0.159.0, model `gpt-6.1-sol`, selected effort `ultra`
(normalized `xhigh`, mode `subagents`), source `codex-session-readback`;
`resume: fix` on 2026-09-29 against VER-002 F2. The earlier integration scope
is bound through D016. Original base `3a68c517`; integrated fetched main
`4d7c3319`; current application target `v0.56.1`. Current rule and evidence:
[D022](decisions.md#wo-086-d022--file-the-saved-preparation-outcome-before-preparing-again),
[D023](decisions.md#wo-086-d023--f2-repair-evidence-and-handoff) and the
[evidence README](README.md#stub-recovery-repair--2026-09-29).
Both failed verification reports remain unchanged; fresh independent
verification judges these repaired bytes. The prior criterion 3 judgment
missed F2 and is superseded by the current evidence below.

**Criterion 1:** met. Fresh `npm run test:docs` passed 23 checks including release-history fixtures comparing `release list`, a version-free order heading, changed/missing recorded tags and an allowed newer tag. Current `release list --markdown` equals the 115-row roadmap block, whose recorded-tag check reports no failures or newer tags; staging appears in no row (D006, D023).
**Criterion 2:** met. All six original base ranges retain D008's exact SHA-256 values and occur once in the archive and zero times in current 06. Main's additional WO-117 paragraph is preserved once with D017's SHA-256 `4245a38c1ee4523fba3c56fbf1cd37c13503956955a0cd3b7969c7a9685ac84b`: seven ranges, 66,778 bytes total; earliest/latest dates stay 2026-08-31 and 2026-09-29.
**Criterion 3:** met. Fresh `npm test -- --review` passed the final complete preparation/integration suites. F1's PR blockers preserve original inputs; F2's regular-file and symlink stub blockers recover exactly one complete v9000.0.1 → v9000.0.2 record above baseline v9000.0.1. Repeated blocked continuation preserves saved evidence and target; a newer collision records its own baseline and targets once after the stub succeeds. Another preparation failure after filing the saved stub retains provenance and recovers without a duplicate. The authored-conflict case still refuses with its path and writes nothing. Products stay unchanged and the README changes only its version claim (D022, D023; focused transcript 8/8 before the final diagnostic extension).
**Criterion 4:** met under D004's bound standing-policy amendment. Products 06/10, README version claim, product 07 sentence, docs/README exemption policy, baseline and ceiling write-backs remain present; decisions/index discharge the inherited ledger duty. Main's release paragraph stays archived and the 115-tag table/locks hold. Fresh `npm run test:docs` and publication checks pass, including registered/unregistered markers and demoted/quoted/hidden terminating-heading fixtures. Counted 06 bytes: 90,074 before, 96,395 after; generated exemption 31,537 bytes; ceiling 98,323 = ceil(96,395 × 1.02). Ten baseline shapes remain, zero receipts under Release boundary (D017, D023).
**Criterion 5:** met. Fresh `npm test -- --review`: 31 suites passed, 0 failed, 359.026 s, 75 fresh tasks, recorded 2026-09-29T19:19:52.302Z at code identity `db26626332e4b7b6264a3a87c2851db3fdd416aad073bb73a041b26d42471e52`; evidence `host-gate:db26626332e4b7b6264a3a87c2851db3fdd416aad073bb73a041b26d42471e52:npm test`. Fresh `npm run test:docs`: 23 passed in 14.932 s at that identity, recorded 2026-09-29T19:21:09.403Z, with final document bytes checked inline on completion. `git diff HEAD --check` passes; package.json/package-lock.json equal integrated HEAD; no dependency is added (D023).
