# WO-087 executor handoff

Dispatch: `resume: next`. Actor: Codex CLI 0.159.0, gpt-6.1-sol, effort ultra
(xhigh with workflows), source codex-session-readback. Subject base: `c57fd557`.

**Criterion 1:** met — move-check.json and final-move-check.json prove all twelve preserved slugs and complete content equality after two necessary link rebasings; 864 source-interval lines include one retained next-rung directive, so 863 content lines moved and the roadmap fell from 1,613 to 750 lines. npm run publication:check passes, both locks are refreshed, and npm run test:docs passes with zero new broken links and product 06 at 39,975 non-exempt bytes under its 40,775-byte ceiling.

**Criterion 2:** met — seven former candidate rows are duplicates of their map rows through register-requests.json; all original history prefixes remain; relocation preserves 191 pending rows while 771 total rows become 778, with former dispositions and reopening conditions carried to targets. link-only-requests.json retains two dispositions after link rebasing. The separate planning blind-spot follow-up FUP-dc58e92c5cafc732 adds one untriaged row, producing final totals 779/192 without losing any old pending work.

**Criterion 3:** met — docs/README.md points to the candidate home; decisions.md and its generated decisions-index row discharge the legacy ledger duty for this order filed before 2026-09-09, as the executor skill specifies.

**Criterion 4:** met — npm test -- --review passes 31 suites, zero failures (75 fresh tasks, 376.62 s); npm run test:docs passes 23 suites, zero failures (16.81 s); git diff --check passes and no dependency changed. gate-checks.json records the canonical passing rows at code identity aa0c11ebec1f7a23acf17afdc3fe716228c803e63b9490734459c86fc7758409. Three grouped relocation fixtures and the full planning suite accept the proved move, reject changed meaning and invalid destinations, and retain receipt bytes. The main diff changes no filed planning receipt, verification or historical final-review report.

The earlier document failures and incorrect inherited-failure diagnosis are
corrected in D006/D009. D008/D010 bind the operator-authorized two-file planning
check repair; D012 records the final review and outcome. The first product run
and an early review run were stopped through the canonical command before
source edits; neither was claimed as passing. The final complete runs above
supersede those unfinished attempts.

D011 records the separate planning prompt/source dependency blind spot, deferred
onto FUP-dc58e92c5cafc732. The continuation proof uses the repository's existing
metadata slug model and conservatively refuses unsupported link contexts.

Independent verification and final review remain separate dispatches.
