# WO-042 repair — VER-001 F1

The repair addresses [VER-001 F1](../../verifications/WO-042/VER-001.md#finding-f1--unicode-prose-punctuation-bypasses-the-exact-token-contradiction-guard),
the Unicode punctuation bypass in the authored-note contradiction check.
The original order and operator-expanded duties remain in force.

The old guard excluded a small ASCII punctuation list from tokens. Em dash,
en dash, ellipsis and curly quotes therefore stayed attached to an effect id
and prevented its exact comparison. The replacement matches a complete
escaped literal effect id against one Unicode punctuation boundary rule in
both authored-note directions. It preserves punctuation belonging to the id,
internal dot/colon qualifiers and negative prefix/suffix cases. The product
contract in [04-interfaces](../../product/04-interfaces.md#authority-inspection-projection)
and the dated ledger entry record the rule and the rejected alternatives.

Before the source repair, the focused criterion-5 run failed all ten new
Unicode punctuation cases; its existing two tests passed. After the repair,
the same run passed all 14 tests, including its aggregate case and the added
literal-id/longer-token fixture. The complete authority test file passed 38/38.

```sh
npm run build --silent
node --test --test-name-pattern='WO-042 (VER-001 F1|AC5)' packages/compiler/dist/test/authority.test.js
node --test packages/compiler/dist/test/authority.test.js
node scripts/authority-evidence.mjs --check
node scripts/harness.mjs check
```

The unchanged authority transcript passes its executable check: four saved
programs and authored inspection bodies retain their bytes, four widening
paths reject, all nine narrowing cases agree with runtime authorization,
explicit grants admit/revert correctly, and all 24 bundle comparisons agree.
The installed bundle check also passes without regeneration. This repair does
not change a live-audit subject or require new package versions beyond those
already assigned to the unpublished WO-042 release.

The fresh [mutation transcript](mutations/reproduce.log) and
[source-bound summary](mutations/summary.json) record two 328/328 unmutated
baselines. M00001 and M00002 each compile and fail exactly their named tag or
equal-precedence test (327 passing, one failing). The executable summary check
passes against the repaired source. Its earlier bytes remain recoverable from
the repair-request checkpoint, `refs/dotln/checkpoint/WO-042/5`.

`npm run evidence:console -- --check` passes all five fixture scenarios:
`wo009`, `selfhost`, `control`, `refutations` and `missing` match their recorded
JSON, terminal and HTML bytes. `npm run release -- prepare --local` confirms
that the assigned `v0.16.0` target remains current and changes no files. The
local-terms screen over the changed prose exits 0 and reports the list
**unavailable**; no list content is claimed or copied.

The first full gate stopped at the documentation freshness check: both edition
locks still named the earlier interface-contract bytes. After review of the
changed product section, `node scripts/check-publication.mjs --print-locks`
provided the new locks. Only the two stored current-byte locks were refreshed;
source-base revisions and edition links remain fixed. The ordinary publication
check then passes with 247/247 product headings indexed and both editions
current. This completes the order's existing edition-lock write-back duty.

The final handoff gate is `npm run harness -- evidence`: it executes the fixed
`npm test` and `git diff --check` commands and binds their host receipt to the
current subject. A `RepairCompleted` event in the
[order segment](../../control/orders/WO-042.jsonl) records the handoff only
after both checks exit 0. VER-001 remains immutable; independent
re-verification is a separate dispatch. The previously recorded live feedback
and harness observations are revalidated by the gate, not presented as newly
run sessions.

Executor attestation: observed `codex-cli` `0.153.4`; `gpt-6-astra`; effort
`max`; source `operator-attested` under the repository default. Effective
session readback and Claude completion hooks are not exposed in this session.
