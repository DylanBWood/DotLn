# WO-218 executor reviews

The executor used two read-only workers under the role's required review rule,
then one additional probe worker at the operator's explicit request. Each was
launched with Codex `gpt-6.1-sol`, effort `max`, without inherited conversation.
That is the launch selection; effective model readback was not independently
available to the workers. The executor remained the only repository writer.

The first two workers received the order and a frozen diff, with directly
relevant source and tests available. They made no repository writes and ran no
tests. Their first pass covered the first implementation group; their second
pass covered the complete implementation snapshot. Repeated findings in the
two independent reports are counted separately, not presented as distinct bugs.

| Worker/pass | Findings | Repairs |
| --- | ---: | --- |
| Criteria adversary, initial group | 4 | Add the shared module to the export closure; inspect every scratch-root ancestor; accept explicitly staged untracked stash resolutions; correct parser regression expectations. |
| Design improver, initial group | 3 | Add the export dependency; fix staged stash recovery; apply exact legacy floor migration in seed floor validation. |
| Criteria adversary, complete snapshot | 11 | Correct draft origin type and configuration spread; disable replacement objects for immutable records; recover archived publication bindings; compare helper bytes independently of index flags; normalize historical seed floors; resolve records through their recorded root; validate Codex rule ownership during stale scans; refuse judge-only merge collisions; require proof of consumed sibling receipts; preserve URL queries. |
| Design improver, complete snapshot | 11 | Correct configuration spread and draft origin type; preserve historical floor provenance; read archived close history; disable replacement objects; parse quoted Git programs; retry drafts safely when their first push never created the branch; use recorded roots; compare helper bytes; remove retired owned permission prefixes; preview sibling Releases. |

All 29 reported findings have implementation repairs and regression coverage
authored. A separate initial scope observation about configured Git metadata
fallbacks was also repaired; it was not included in that worker's numbered
finding count. Passing execution is reported in the handoff after the complete
gate, not inferred from these read-only reviews.

The operator subsequently requested a worker dedicated to different probes and
ad hoc scripts. It reproduced three additional defects: optional empty history
configuration, same-tree draft retries after remote movement, and a foreign
repository identity accepted by the immutable reader. All three are repaired.
The configuration recheck passed; its unchanged target-boundary script then
passed all seven assertions, bounded exit 0 in 27,496 ms at
2026-10-20T02:55:04.645Z. [The probe record](adversarial-probes.json) preserves
the commands, results and limits. The marker-key decoder observation was also
addressed; output corruption was not established. The stash experiment was
inconclusive, and the later broader probing turn ended at a provider safeguard.
Only the already established correctness checks were rerun.

A supplemental review reused the criteria adversary for eight NoOp or partial-decline decisions. It reported four findings: the beacon freshness window, the fetch-isolation scope and absent-target recovery limit, the need to restore a physical starter checkout, and interrupted removal of an operator rule duplicate. The first three descriptions are corrected; the fourth has removal journaling and interruption cases (D050). This pass was read-only and ran no probes.

Total: 36 reported findings, 36 addressed, none left as an unrecorded defect.
Two further observations (Git metadata fallback and overlay marker keys) were
also repaired without inflating the workers' numbered counts. The total
launched worker count is three of the configured twenty-worker cap, with no
descendants requested. Full-suite execution remains the handoff's obligation.
