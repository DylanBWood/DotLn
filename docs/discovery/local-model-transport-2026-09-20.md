# Local-model transport availability — 2026-09-20

`unavailable`: the transport carried a complete, validated inspection episode
against the operator's live endpoint, and readiness is still ungranted because
no attributable non-local-egress boundary exists. Working inference is not the
readiness contract. This is an availability row for WO-110's third
`WorkOrderTransport`, not a qualification of any local model.

Work order: [WO-110](../work-orders/WO-110-local-model-transport.md).
Two machine records, both written by
`scripts/probes/local-model-transport-smoke.mjs --live`: the
[18:10 row](local-model-transport-2026-09-20.json) taken while nothing was
listening, and the [18:38 row](local-model-transport-live-2026-09-20.json)
taken after the operator started the endpoint. The
[decisions](../evidence/WO-110/decisions.md) carry the design choices and their
reopening conditions.

The labels are exactly those in `environment.json`: `observed`, `documented
locally`, `documented officially`, `untested`, `blocked`, `not found`, and
`ambiguous`.

## Row

| Item                    | Classification | Result                                                                                                                                                                           |
| ----------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Installed runner        | `observed`     | LM Studio bundle `0.4.24+1`; CLI commit `ff50809`. Same versions WO-137 recorded on 2026-09-18; read from the installed bundle and `lms --version`.                               |
| Endpoint at 18:10 UTC   | `not found`    | No listener on `127.0.0.1:1234` or `:1235`. `lsof` empty, `curl` exit 7, the smoke's own probe `ECONNREFUSED`.                                                                    |
| Endpoint at 18:38 UTC   | `observed`     | After the operator started the server and loaded the pinned artifact, the model listing answered HTTP 200 in 21.08 ms.                                                            |
| Live inspection episode | `observed`     | One dispatch returned a validated six-field envelope in 14,558.64 ms: `status` completed, `beaconClaim` inspection-completed, a 161-character summary, one candidate, 3 evidence. |
| Requested model honored | `not found`    | The wire carried `model: "required-model"`; the loaded identifier was `dotln-local`. The endpoint served the request anyway. See the limitation below.                            |
| Overall readiness       | `unavailable`  | No attributable non-local-egress boundary; WO-137 grades the runner `inconclusive`. Successful inference does not discharge that contract.                                        |

## The live episode

The 18:38 packet records `outcome: "envelope"`. That value is only reachable
after the transport's own `parseWorkerResult` succeeds, so it is a contract
result and not merely well-formed JSON: the `workOrderId`, `episodeId` and
`resultId` matched the pinned request, `status` was within its allowed set, the
summary was inside its 320-character bound, and the candidate path was checked
against the mounted fixture inventory. A 27B local model produced a
contract-valid DotLn inspection result on the first live attempt.

Which file it proposed is deliberately absent: the shape projection records
field names, types, lengths, counts, failure codes and latency, and no
model-authored text. One candidate carrying three evidence strings is the
recorded shape.

This is n=1 on one warm runner lifetime against one four-file fixture. It is
not a determinism, quality, throughput or suitability claim, and it promotes no
capability level.

## Limitation: the endpoint does not honor the requested model

The dispatch named `required-model`, the pinned fixture's placeholder. The
runner had `dotln-local` loaded. The endpoint answered HTTP 200 and served the
episode from whatever was loaded rather than rejecting an unknown model.

Two consequences, both `observed`:

- The transport's `model-unavailable` classification cannot rely on the
  endpoint refusing an unknown model name. It still holds for a refused,
  reset or aborted connection and for an error body naming a missing model,
  which is how the shipped code detects it.
- The transport cannot establish which model produced an envelope. WO-137
  already recorded that the API alias is not the artifact's identity; this is
  stronger, because the request's model field is not consulted at all.

Any order that needs the answering model bound to the result — WO-138's
qualification pilot in particular — must obtain that identity from the runner
rather than from the request, and must not treat a served response as evidence
that the intended artifact answered.

## Declared row consumed by the catalog

`LOCAL_MODEL_ROW` in `packages/skeleton/src/local-model-transport.ts` carries
`L-U1`, label `unavailable`. The catalog adapter reports that row rather than
probing the endpoint, so the resident can record a reasoned `ActorUnavailable`
NoOp without contacting the operator's machine. A row is data, not a gate: the
adapter runs the episode when a row labelled `ready` is supplied, which is
exactly how the fixtures exercise the live path.

## Limits of these rows

The 18:10 absence proves only that nothing answered those two ports at that
instant. The 18:38 success proves the protocol and the transport, not the
boundary: the runner was started normally on loopback with no outer deny-egress
sandbox, and loopback binding governs inbound connections only. WO-027's
historical crash-on-wake and WO-137's ambiguous boundary self-tests remain
unchanged and time-indexed.

## Reproduction

The smoke contacts nothing unless `--live` is passed and refuses to overwrite an
existing destination.

```sh
cd <repository root>
export PATH="$HOME/.lmstudio/bin:$PATH"
OUT=/tmp/wo110-live-$(date +%Y%m%d-%H%M%S).json

lms server start --bind 127.0.0.1 --port 1234
lms load qwen/qwen3.6-27b --identifier dotln-local --context-length 4096 --parallel 1 --gpu max -y
node scripts/probes/local-model-transport-smoke.mjs --live --out "$OUT"
cat "$OUT"

lms unload dotln-local
lms server stop
```

The model key takes no `@q4_k_m` suffix; WO-137 recorded that the displayed
variant key is rejected by this installed CLI. Start, load, unload and stop
remain explicit operator or authorized-executor steps. Reopen this row when an
attributable runner egress boundary exists, or when a runner version changes the
API shape or begins honoring the requested model.
