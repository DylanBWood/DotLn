# Local-inference discovery — 2026-09-03

Work order: WO-027. Evidence timestamps span 2026-09-03 02:08–03:11 EDT.
Executor: Codex CLI 0.152.1, GPT-5.6 Sol, xhigh, self-reported.

This is capability truth, not an exported runtime capability. The probe found a
runner and pinned an existing model artifact, but the only permitted LM Studio
launch crashed before its localhost API became ready. No model was loaded and
no generation occurred. The calibration order is therefore deferred under the
named condition in the decision packet below.

The labels are exactly those in `environment.json`: `observed`, `documented
locally`, `documented officially`, `untested`, `blocked`, `not found`, and
`ambiguous`.

## Checklist classifications

| Item                             | Classification | Result                                                                                                                                                                                                                 |
| -------------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Runner inventory              | `observed`     | LM Studio is installed; the three standalone alternatives are not found.                                                                                                                                               |
| 2. Hardware and thermal envelope | `blocked`      | OS evidence reports Apple M3 Max, 48 GB unified memory, and 16 total cores. The required runner-reported and thermal readings are blocked because the runner crashed and `pmset -g therm` returned no readings.        |
| 3. Pinned artifact               | `observed`     | One existing 7B Q8_0 instruction-tuned GGUF is pinned below; no download occurred.                                                                                                                                     |
| 4. Bounded launch shape          | `blocked`      | The sole `lms` invocation exited 1 after the spawned app crashed; the local API never listened.                                                                                                                        |
| 5. Determinism                   | `blocked`      | Zero of the required three completions ran, so byte identity and seed handling remain unknown.                                                                                                                         |
| 6. No-egress evidence            | `blocked`      | External connections failed under the combined outer and nested boundaries, but the denying layer is ambiguous. The launch profile also blocked localhost; no generation or during-generation socket snapshot existed. |
| 7. Capability row proposal       | `observed`     | A level-0/E0 proposal is recorded below; the pinned table was not edited.                                                                                                                                              |
| 8. Decision packet               | `observed`     | Exactly one disposition is recorded: defer under a named condition.                                                                                                                                                    |

## 1. Runner inventory

### LM Studio — `observed`

- GUI/application: `/Applications/LM Studio.app`, bundle version `0.4.13+1`.
- CLI: `~/.lmstudio/bin/lms`, arm64 Mach-O, embedded CLI commit `0b2a176`.
- The installed CLI contains a local `server start` command. LM Studio's
  [official CLI documentation](https://lmstudio.ai/docs/cli/serve/server-start)
  says it starts an HTTP API server and binds to `127.0.0.1` by default.
  [LM Studio's runner overview](https://lmstudio.ai/docs/app/basics/lmstudio-vs-llmster-vs-lms)
  documents desktop and headless service shapes and says an `lms` command wakes
  the selected service when none is running. Those two feature claims are
  `documented officially`.
- Static local inspection is `observed`: on a connection miss this CLI calls
  its service-wake routine, passes `--run-as-service` for the desktop bundle,
  and spawns it detached with the current environment. Thus every `lms`
  invocation was treated as a process launch. There was exactly one in this
  probe.
- The planner's crash-on-wake observation was reproduced. The sole launch
  printed `Waking up LM Studio service...`, timed out waiting for the daemon,
  and exited 1. A new operating-system crash diagnostic names LM Studio
  `0.4.13+1`, parent process `lms`, `EXC_BREAKPOINT`, `SIGTRAP`, and
  `Trace/BPT trap: 5` at 03:00:32 EDT. Two earlier diagnostics at 02:08 and
  02:09 carry the same app version and exception/signal class. Only the path
  class `~/Library/Logs/DiagnosticReports/LM Studio-<timestamp>.ips` is
  retained here.
- Causal attribution is `ambiguous`. The new diagnostic's triggered-thread
  frame is in the c-ares DNS path, while the two earlier reports have different
  top frames. Loopback also failed under the actual launch profile, so this
  probe cannot distinguish a runner defect from a boundary interaction.
- No LM Studio process survived the failed launch or its cleanup. A stale
  service PID lock was left under the runner's internal application-data root.
- Installed application data contains LM Studio-packaged llama.cpp and MLX
  backend extensions. They are components of this runner, not standalone
  runner installations, and were not launched separately.

### Ollama — `not found`

No `ollama` executable was found in `PATH`, the conventional application
location, or the Homebrew installation roots inspected. Version is not
applicable and it was not launched. Ollama has a server mode in its
[official CLI reference](https://docs.ollama.com/cli), but that is only
`documented officially` and was not evaluated on this machine.

### llama.cpp — `not found`

No standalone `llama`, `llama-cli`, `llama-server`, or `llama-bench`
executable was found in `PATH` or conventional Homebrew roots. Version is not
applicable and it was not launched. The installed LM Studio application data
contains internal backend versions through `2.31.2`; that does not make a
standalone llama.cpp runner available. The upstream
[server documentation](https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md)
describes `llama-server` as an HTTP server (`documented officially`).

### MLX LM — `not found`

No standalone `mlx_lm` executable, `mlx_lm.server`, or importable `mlx_lm`
module was found in `PATH` or the inspected Python. Version is not applicable
and it was not launched. LM Studio's application data contains internal MLX
backend versions through `1.11.0`; those were not treated as a separate
installation. The upstream
[MLX LM server guide](https://github.com/ml-explore/mlx-lm/blob/main/mlx_lm/SERVER.md)
documents a localhost HTTP mode (`documented officially`).

## 2. Hardware and thermal envelope — `blocked`

`system_profiler SPHardwareDataType`, projected only to the already-public
coarse fields, reported:

```text
Chip=Apple M3 Max
Total Number of Cores=16
Memory=48 GB
```

Unified memory is `documented locally` by the established environment
precedent; the command labels it simply `Memory`. Exact OS and hardware
identifiers are withheld. The runner never became ready, so a runner-reported
core or memory reading is `blocked`. `pmset -g therm` returned no thermal,
performance, or CPU-power status, so the instantaneous thermal reading is also
`blocked`; no stress or benchmark loop was run.

## 3. Pinned artifact — `observed`

A complete instruction-tuned artifact already present was selected; no artifact
was downloaded.

| Field                     | Value                                                              | Claim label                                                                                                                |
| ------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| Publisher/repository      | `lmstudio-community/dolphin-2.8-mistral-7b-v02-GGUF`               | `observed` in the local model index                                                                                        |
| File                      | `dolphin-2.8-mistral-7b-v02-Q8_0.gguf`                             | `observed`                                                                                                                 |
| Path class                | LM Studio model root / publisher / repository / file               | `observed`                                                                                                                 |
| Format / architecture     | GGUF v3 / llama                                                    | `observed` from the artifact and local index                                                                               |
| Parameters / quantization | 7B / 8-bit Q8_0                                                    | `observed` from local GGUF/index metadata                                                                                  |
| Byte size                 | 7,695,875,136                                                      | `observed`                                                                                                                 |
| SHA-256                   | `49d60b64563d5e4e78211eb3dfb1af75c3c89d1158f141bc0bf38ec5eac30fbb` | `observed`                                                                                                                 |
| License                   | Apache-2.0                                                         | `documented officially` by the [publisher card](https://huggingface.co/lmstudio-community/dolphin-2.8-mistral-7b-v02-GGUF) |
| Maximum artifact context  | 32,768 tokens                                                      | `observed` from GGUF/index metadata                                                                                        |
| Intended probe context    | 4,096 tokens                                                       | `untested`; the load request never ran                                                                                     |

The GGUF embeds this ChatML Jinja template (`observed`):

```jinja
{% if not add_generation_prompt is defined %}{% set add_generation_prompt = false %}{% endif %}{% for message in messages %}{{'<|im_start|>' + message['role'] + '\n' + message['content'] + '<|im_end|>' + '\n'}}{% endfor %}{% if add_generation_prompt %}{{ '<|im_start|>assistant\n' }}{% endif %}
```

The embedded BOS is `<s>` and EOS is `<|im_end|>`. LM Studio says it normally
chooses a prompt template from model metadata
([official prompt-template documentation](https://lmstudio.ai/docs/app/advanced/prompt-template));
the crash prevented observation of the applied runtime template.

The intended fixed request was: system `Output only the requested story. Do
not explain.`; user `Write exactly two sentences, each no more than twelve
words, about a lighthouse keeper finding a brass key at dawn.`; temperature
0; top-p 1; seed 424242; maximum output 80 tokens; stop `<|im_end|>`; stream
false. These values are `untested`. The OpenAI-compatible API's temperature,
top-p, seed, maximum-token, and stop fields are
[documented officially](https://beta.lmstudio.ai/docs/developer/openai-compat/chat-completions).

## 4. Bounded launch shape — `blocked`

The exact sanitized command was:

```sh
sandbox-exec -f <scratch>/no-external-network.sb ~/.lmstudio/bin/lms server start --port 12345 --bind 127.0.0.1
```

It was the only `lms` invocation. Output:

```text
Waking up LM Studio service...
Error: Timed out waiting for LM Studio daemon to start.
Error: Failed to start or connect to local LM Studio API server.
exit=1
```

The wrapper polled `GET http://127.0.0.1:12345/api/v1/models` 120 times at
0.5-second intervals. It never connected. The new crash diagnostic above was
written six seconds after launch began. Therefore model load time,
first-token latency, throughput, output tokens, and cost per generation all
remain `blocked`; sample count is `n=0`, not a benchmark. The prepared v1 model
load and v0 chat request shapes are preserved under the OS temporary path class
but were never sent.

## 5. Determinism — `blocked`

Required repetitions: 3. Completed repetitions: 0. There are no smoke outputs
to compare, so byte identity is unknown. The runner did not echo or exercise a
seed policy; seed handling is `blocked`, not inferred from accepted API
documentation. No replacement runner or relaunch was attempted after the exact
one-launch authority was spent.

## 6. No-egress evidence — `blocked`

### Boundary and method

The executing harness declared a network-disabled outer boundary
(`documented locally`), and a key-name-only environment projection observed
`CODEX_SANDBOX` and `CODEX_SANDBOX_NETWORK_DISABLED` without reading their
values. The probe shell was launched from that environment and nested macOS
`sandbox-exec` with a profile whose SHA-256 was
`e95491ddeda717a3bb8b37f4413d93619e79fc39ea21b5ae667badeb855f742d`.
Its public-safe clauses were:

```scheme
(version 1)
(allow default)
(deny network-outbound
  (require-all
    (remote ip)
    (require-not (remote ip "localhost:*"))))
```

A request to `1.1.1.1:443` under those combined boundaries failed immediately
with curl exit 7 and no response body (`observed`). `sandbox-exec` emitted no
denial diagnostic; the only stderr was curl's failed-connect message, so a
boundary-owned denial report is `not found` and attribution to the outer versus
nested layer is `ambiguous`. A later liveness-controlled self-test failed
against a verified `127.0.0.1` listener with curl exit 7 under this first
profile. This is a narrower and less useful result than a successful no-egress
generation.

After the runner launch was spent, a corrected profile was tested without LM
Studio:

```scheme
(version 1)
(allow default)
(deny network-outbound)
(allow network-outbound (remote ip "localhost:*"))
```

Under that profile, a sandboxed curl reached a separately verified localhost
listener and received HTTP 200 (`observed`), while the `1.1.1.1:443` request
again failed immediately with exit 7 and no body. No sandbox diagnostic was
emitted, so that external result remains `ambiguous` as to the denying layer;
it does not prove the corrected profile caused the failure. The v1-to-v3
localhost A/B does support the narrower conclusion that the profiles had
different loopback behavior under the same combined environment. Its SHA-256 was
`b61210f848c24197b79ceb22e455bd688008bf77abd7e415908e5fdbacfb5d75`.
The local man page marks `sandbox-exec` deprecated, so this is a dated probe
boundary, not a durable product mechanism.

### Settings and sockets

LM Studio's [official offline-operation page](https://lmstudio.ai/docs/app/offline)
says inference with downloaded models and a local server need no connectivity,
while search, downloads, runtime downloads, and update checks do. That is
`documented officially`, not evidence about this launch. A key-name-only scan
of `~/.lmstudio/settings.json` found update/download/JIT and credential key
names but no key name matching telemetry, analytics, privacy, offline, or
diagnostic (`observed`). Values were not read, so effective settings are
`ambiguous`.

No process-level socket snapshot during generation exists because generation
never began (`blocked`). Immediately after the failed launch, the runner PID
set and sanitized runner-process list were empty (`observed`); that proves only
that no runner process survived to expose a socket at that later instant.

### Limit of the claim

The evidence proves the tested external IPv4 connections failed under each
combined boundary and that v1 failed while v3 succeeded against verified
localhost listeners. It does not identify which layer prevented either
external connection, prove v3's non-local rule independently, or prove what LM
Studio would attempt or expose under v3, because LM Studio was not relaunched.
It does not establish a successful no-provider-content generation, a general
absence of network effects, telemetry behavior, filesystem confinement, or
behavior when the GUI runs without an outer boundary. The runner and model
receive no broader privacy or offline property claim.

## 7. Proposed capability row — `observed`

Proposal only; `docs/planning/capability-table.md` remains byte-identical to
`main` (Git object `02d8937c4d8b5396e4595dbb72ebf00245ef8935`).

| Capability and declared scope               |  Current level |         Target level | Evidence                                                                                                                       | Blocking gate                                                                                                                                   | Efficiency       | Baseline                                                                                             | Next experiment                                                                                                                                                                                                                                                                     |
| ------------------------------------------- | -------------: | -------------------: | ------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Local inference (`runtime.local-inference`) | **0 — latent** | **1 — demonstrable** | Installed LM Studio shape and pinned artifact are observed, but the only service wake crashed before model load or generation. | No end-to-end completion, determinism triple, during-generation socket snapshot, or attributable non-local-egress evidence during a runner run. | **E0 — unknown** | WO-027 blocked launch at LM Studio 0.4.13+1; `n=0` verified outcomes, so no resource/outcome vector. | After the named defer condition is true, rerun one service lifetime under a boundary with independently attributable loopback/egress behavior, load the same digest at 4,096 context, and issue the fixed three-request determinism smoke with a during-generation socket snapshot. |

## 8. Decision packet — `observed`

**Disposition: defer under a named condition.** Do not file the calibration
order now.

- **Reason:** the available runner crashes on service wake, and the sole
  authorized launch yielded no completion, determinism result, latency/rate
  sample, cost estimate, or during-generation socket evidence. Filing a
  100-run calibration now would schedule load against an unproven runtime.
- **Evidence:** the one-launch transcript and 03:00:32 crash diagnostic;
  `n=0` model load/generation; failed v1 loopback against a verified listener;
  successful v3 loopback; and external curl failures whose denying layer
  remains ambiguous.
- **Named condition:** either an installed LM Studio version/service shape no
  longer crashes on `--run-as-service`, or another already-installed headless
  runner becomes available, and that runner completes the fixed three-request
  smoke under a boundary that both permits its local control channel and denies
  non-local egress.
- **Reevaluation cadence:** event-driven on a runner install or operator-chosen
  LM Studio upgrade/fix; otherwise review once per quarter. This work order
  authorizes neither installation nor upgrade.
- **Reversal condition:** file the calibration order only after one pinned
  artifact has observed load time, first-token latency, throughput, three
  byte-comparable fixed-decoding outputs, and a during-generation process socket
  snapshot under a boundary with independently attributable egress behavior.
  The future order must predeclare coherence, instruction-following, diversity,
  role behavior, mechanic participation, and resource evaluators. Estimated
  cost for 100 runs remains unknown until the first verified resource vector
  exists.
- **Preserved candidate:** the hybrid local-first cell remains preserved, not
  scheduled, until a calibration order exists.

This is an evidenced NoOp rather than abandonment: reason, evidence, cadence,
and the condition that makes intervention worthwhile are all explicit.

## Repository containment and scratch

The tracked-status pair was captured immediately around the probe, after the
operator-authorized version correction and before these write-backs.

Before:

```text
 M docs/control/current.md
 M docs/control/resume.jsonl
 M docs/work-orders/WO-027-local-inference-probe.md
```

After:

```text
 M docs/control/current.md
 M docs/control/resume.jsonl
 M docs/work-orders/WO-027-local-inference-probe.md
```

The pair is byte-identical: the probe itself changed no tracked file. The
activation control dirt was preserved. The only probe artifacts are outside
the repository in an OS temporary root class. They contain the boundary
profiles and validation output, the sanitized process/port observations, the
one CLI launch transcript, and the prepared-but-unsent load/generation
requests. No model artifact was downloaded; the selected model remains in LM
Studio's pre-existing application-data model root. Nothing under `packages/`,
`scripts/`, `.claude/`, or `package.json` changed, and no dependency or config
value was added or mutated.

## Command log

All excerpts are public-safe projections; paths use classes or `~`. Commands
that merely formatted output are omitted, while every claim-producing probe is
represented.

```sh
pwd
git rev-parse --show-toplevel
git status --porcelain=v1
command -v lms ollama llama-cli llama-server llama-bench mlx_lm
python3 -c '<importability check for llama_cpp and mlx_lm>'
test -x '/Applications/Ollama.app/Contents/MacOS/Ollama'
find /opt/homebrew/bin /usr/local/bin -maxdepth 1 -type f '<runner executable names>'
plutil -extract CFBundleShortVersionString raw '/Applications/LM Studio.app/Contents/Info.plist'
file ~/.lmstudio/bin/lms
rg -a -o -m 10 '0b2a176[0-9a-f]*' ~/.lmstudio/bin/lms
python3 '<public-safe static-source projection for wake routine, --run-as-service, direct spawn options, and inherited environment>' ~/.lmstudio/bin/lms
find ~/.lmstudio/extensions/backends -maxdepth 4 -type d '<llama.cpp and MLX version directories>'
system_profiler SPHardwareDataType  # projected to chip/core/memory only
pmset -g therm
python3 '<bounded GGUF metadata reader>'
stat -f 'artifact_bytes=%z' <LM-Studio-model-root>/<publisher>/<repository>/<file>
shasum -a 256 <LM-Studio-model-root>/<publisher>/<repository>/<file>
jq '<whitelisted model fields>' ~/.lmstudio/.internal/model-index-cache.json
jq -r 'paths(scalars) | ...' ~/.lmstudio/settings.json  # key names only
env | sed 's/=.*//' | sort | rg '^(CODEX_SANDBOX|CODEX_SANDBOX_NETWORK_DISABLED)$'
sandbox-exec -f <scratch>/no-external-network.sb curl https://1.1.1.1
sandbox-exec -f <scratch>/no-external-network.sb ~/.lmstudio/bin/lms server start --port 12345 --bind 127.0.0.1
curl http://127.0.0.1:12345/api/v1/models  # bounded readiness polls; all failed
pgrep -f '<LM Studio and packaged-engine executable patterns>'
ps -axo pid=,ppid=,comm= | grep -E 'LM Studio|llama-server|llm_engine'
jq -s '<whitelisted crash fields>' ~/Library/Logs/DiagnosticReports/LM\ Studio-<timestamp>.ips
find ~/Library/Logs/DiagnosticReports -maxdepth 1 -type f -name 'LM Studio-*.ips' -print | wc -l
kill -0 '<PID read but not retained from runner-internal service lock>'
python3 -m http.server 12347 --bind 127.0.0.1
lsof -nP -iTCP:12347 -sTCP:LISTEN -FpcnPT
sandbox-exec -f <scratch>/no-external-network.sb curl http://127.0.0.1:12347/
sandbox-exec -f <scratch>/no-external-network.sb curl https://1.1.1.1
python3 -m http.server 12349 --bind 127.0.0.1
lsof -nP -iTCP:12349 -sTCP:LISTEN -FpcnPT
sandbox-exec -f <scratch>/no-external-network-v3.sb curl http://127.0.0.1:12349/
sandbox-exec -f <scratch>/no-external-network-v3.sb curl https://1.1.1.1
git status --porcelain=v1
git hash-object docs/planning/capability-table.md
git diff --quiet main -- docs/planning/capability-table.md
PATH=<sibling-main>/node_modules/.bin:$PATH npm test  # worktree attempt; stopped at missing @types/node
NODE_PATH=<sibling-main>/node_modules PATH=<sibling-main>/node_modules/.bin:$PATH tsc -b --force
rsync -a --exclude .git --exclude node_modules --exclude '<generated dist>' <worktree>/ <scratch>/test-copy/
ln -s <sibling-main>/node_modules <scratch>/test-copy/node_modules
(cd <scratch>/test-copy && npm test)
```

Observed output highlights: the static CLI projection found the service-wake
routine, desktop flag, direct child spawn, and inherited environment; one
`lms` invocation; three matching crash reports in total (two earlier and one
new); zero load requests; zero generation requests; zero runner-process matches
after the attempt and cleanup; one retained decimal PID lock whose referenced
process was not alive; no downloaded bytes; verified-listener localhost curl
exit 7 under v1 and HTTP 200 under v3; external curl exit 7 under both combined
boundaries with no sandbox denial diagnostic; pinned artifact hash above; and a
capability table identical to `main`.

## Verification

No dependency was installed. This worktree intentionally had only a formatter
cache under `node_modules`, so the first `npm test` reached the final TypeScript
build after every formatter and shell/Node fixture suite passed, then stopped
because `@types/node` was unavailable to module resolution. `NODE_PATH` did not
alter TypeScript build-mode resolution.

The exact working tree was then copied to the same OS temporary root, excluding
`.git`, `node_modules`, and generated `dist` directories, and linked to the
sibling main worktree's pre-existing lockfile-resolved dependency tree, which
was used only as dependency input.
The unmodified `npm test` command passed there, including the TypeScript build
and all 78 kernel and skeleton tests. `git diff --check`, JSON parsing, exact
label-array equality with `environment.json`, and capability-table identity
also passed in the worktree.
