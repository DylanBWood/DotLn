WO-110 implemented the third `WorkOrderTransport` over an operator-owned local
inference endpoint for the inspection profile, joined it to the actor catalog,
and recorded a dated availability row. Criterion 2's live smoke returned an
envelope: the operator started the endpoint and a local model completed a
validated inspection episode through the transport.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.278","model":"claude-opus-5[1m]","effort":"xhigh","source":"operator-attested"}

## What landed

`packages/skeleton/src/local-model-transport.ts` carries the port. One episode
is one bounded HTTP request to an explicit IPv4 loopback origin: no argv, no
child process and no disposable supervisor, because an `AbortController` ends
the episode with the host that started it. The wire shape is taken from
WO-137's observed rows rather than a vendor promise — the native
`/api/v0/chat/completions` path, a `json_schema` `response_format` carrying the
same `workerResultSchema` the CLI adapters pass as a file, fixed decoding, and
`reasoning_effort: "none"`, without which WO-137 observed a whole token cap
spent on reasoning and empty answer content. The response is read under a
declared byte bound; the six-field envelope is validated again at the host
boundary. `LOCAL_MODEL_ROW` is the dated `L-U1` availability row.

`local-model-contract.ts` and `local-model-actor.ts` give the catalog its real
entry, replacing the `"local-model is unavailable until WO-110"` placeholder.
Availability is the declared row, never a live probe, so the resident records a
reasoned `ActorUnavailable` NoOp without contacting the operator's machine.
`actor-contract.ts` gained the `local` spec and observation slots with their
cross-kind refusals, and `scriptResultVerified` treats a local completion claim
as not independently verified, exactly as it treats a CLI one. `local-model-http`
joined `WorkerTransportName`, and `canonicalWorkerArgs` refuses it rather than
falling through to the Codex argv branch.

## Criteria

| # | Criterion | Evidence |
| --- | --- | --- |
| 1 | Double endpoint returns the six-field envelope and the result validates; an unavailable endpoint yields the typed unavailability | `packages/skeleton/test/local-model.test.ts`, 10 tests. The doubles are real loopback HTTP servers, not stubbed clients, so the transport's own request construction, bounded reading and parsing run unchanged. The envelope is asserted to be exactly the six fields and is re-validated with `parseWorkerResult`. A closed port yields `model-unavailable`; a `No models loaded` body does too, while an unrelated 500 is `transport-failed`. Truncation, prose, empty content and a foreign episode id each get their own code. |
| 2 | Live smoke returns an envelope recorded with shapes only, or an `unavailable` row | Met by the envelope branch. `docs/discovery/local-model-transport-live-2026-09-20.json`: probe HTTP 200 in 21.08 ms, dispatch 14,558.64 ms, `outcome: "envelope"`, status completed, `beaconClaim` inspection-completed, 161-character summary, one candidate with 3 evidence strings. That outcome is only reachable after `parseWorkerResult` accepts the result, so identifiers, bounds and the inventory-checked candidate path all held. The earlier `docs/discovery/local-model-transport-2026-09-20.json` retains the superseded 18:10 `unavailable` row. The shape projection and its exclusion of model-authored text are themselves tested against doubles. |
| 3 | Write-backs land: 03 §Ports, `environment.md` addendum, ledger entry | Product 03 §Ports gains the third adapter and its paragraph; §Runtime primitive catalogs replaces the placeholder sentence. `docs/discovery/environment.md` gains the dated addendum. The inherited ledger duty is discharged by this order's decisions file and its row in the decisions index, as the work-order index directs for an order filed before 2026-09-09; no lifecycle ledger append. |
| 4 | `npm test` green; `git diff --check` clean; no new dependency | Recorded in the handoff. `package.json` is unchanged: the transport uses `fetch`, `AbortController` and `node:http` only. |

## Limits

The live result is n=1 on one warm runner lifetime against one four-file
fixture. It is not a determinism, quality, throughput or suitability claim and
promotes no capability level. Nothing here qualifies a local model for any role
or establishes the attributable runner egress boundary WO-137 still lacks, so
the `L-U1` row stays `unavailable` and WO-138 remains blocked on a `ready`
preflight; working inference is not the readiness contract.

One limitation surfaced in the live run and is recorded in WO-110-D007: the
dispatch named `required-model` while `dotln-local` was loaded, and the endpoint
served the episode anyway. The transport's `model-unavailable` classification
therefore cannot rely on the endpoint refusing an unknown model name — it holds
for a refused connection and for an error body naming a missing model — and the
transport cannot establish which model produced an envelope.

## Tinkerer economy trial

WO-110 is the second of WO-145's three selected trials. The support was not
equipped at dispatch; the operator authorized equipping it during this dispatch,
and default equipment is restored at handoff. The experiment is recorded as
WO-110-D001 with its measurement in `experiment-measurement.json`: adopted, a
14.175 s focused iteration against a 252.611 s full gate, at a cost of 87 s of a
900 s budget. The full gate still ran before handoff.

## Repair (resume: fix, VER-001)

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.278","model":"claude-opus-5[1m]","effort":"unknown","source":"self-reported"}

VER-001 returned `fail` on three current-subject defects. All three are
repaired, and a fourth defect the report had classified as inherited is
repaired with it. No acceptance-criterion behavior changed: the transport, the
contract, the actor and their tests are untouched apart from formatting.

| Finding | Repair | Check |
| --- | --- | --- |
| F1 — seven order-owned files fail the formatter | The formatter run over exactly those seven paths (WO-110-D008) | `--only format`: 2 passed, 0 failed |
| F2 — current generated surfaces invalidate the WO-146 authority edition | A new WO-110 authority edition at revision 001 (WO-110-D009) | `--only authority-evidence`: 2 passed, 0 failed |
| F3 — actor/transport changes leave feedback evidence stale | A new WO-110 feedback edition at revision 001, with a live self-hosted recording (WO-110-D009) | `--only feedback-evidence`: 2 passed, 0 failed |
| Not in VER-001 — `release-surfaces` fails on the unbumped skeleton component | `@dotln/skeleton` 0.31.0 to 0.32.0, minor and additive, with its pin, lockfile and `HARNESS_HOST_VERSION` (WO-110-D010) | `--only release-surfaces`: 2 passed, 0 failed |

**Correction to VER-001.** The report states that `release-surfaces` and five
dependent suites are inherited from base. That is not reproduced.
`componentVersionRules` in `scripts/release.mjs` appends the revision to its
`git diff` only under `--committed`, so the document suite compares the
`v0.35.1` tag against the working tree; `git diff v0.35.1 main --
packages/skeleton/src` is empty, so the clean base passes the rule. The failure
was caused by this subject's own unbumped skeleton source. The five "dependent"
suites were preflight-blocked rather than failing: run directly at the
unrepaired subject they were `skeleton-docs` 38 passed 0 failed, `console-docs`
2 passed 0 failed, `lineage-fixtures` 7 passed 0 failed, and `refute-plan check`
exit 0. The whole document gate now passes, which the "six inherited failures"
reading would not allow.

**Ordering cost, recorded.** The first WO-110 authority and feedback editions
were minted before the component bump was diagnosed. The bump moves the console
workspace pin inside `package-lock.json`, and the feedback projection omits only
`version` and `license`, so that first feedback edition went stale and the live
recording had to be run again. Both editions therefore carry revision 001, and
the superseded revision-null editions remain as residue. Diagnosing the release
surface before minting evidence would have avoided one live run.

**Live recording.** `DOTLN_LIVE_WORKERS=1 dotln feedback-audit --store
.runtime/feedback-audit-wo110-r001 --transport claude-cli-print --model
claude-sonnet-5 --effort max`. The first attempt returned `worker refused:
deadline-exceeded; pending work is retained` at the profile's ten-minute bound;
the second attempt on the same store resumed the saved audit and completed
(`phase: complete`, 10 fixtures, 1,192 saved instruction bytes, verifier
`claude-cli-print`), as the runbook's retained-pending path describes. The
console self-host fixtures were re-pinned to
`docs/evidence/WO-110/feedback-001`, which the runbook requires of the actor
board.

**Gates after repair.** `npm test`: 21 passed, 0 failed, 283.90 s, 65 fresh
tasks. `npm run test:docs`: 19 passed, 0 failed, 19.07 s, against 10 passed and
9 failed at the verification subject. `git diff --check` and `git diff --cached
--check` both exit 0. `npm run publication:check`: 272/272 product headings,
both publications current. No dependency was added: the root `package.json` has no
diff, and the only manifest edits are the skeleton component version, the
console workspace pin and the lockfile entries those two imply.
