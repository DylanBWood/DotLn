# WO-117 operator walkthrough

Status: **operator-reported completed walkthrough, 2026-09-29**. Criterion 2
is met by the operator's report together with the retained real-resident
command/result sequence below. The first failed attempt remains recorded.

After the ordinary build, from the DotLn worktree:

```sh
node packages/console/fixtures/live-walkthrough.mjs <scratch-repository>
```

The helper verifies the Git root, creates a new ignored store and runs the real
resident with a real sandboxed script actor. It prints the exact live-console
command for a second terminal and the plain commands to type at `live>`. The target
is the operator-selected scratch repository; its private name and physical
paths remain in the local setup rather than this public record. The actor is
read-only: it checks that its cwd is a Git worktree, returns fixed `true` output,
and stays running for five seconds. The cadence is ten seconds while away.
There is no model worker in this walkthrough; the actual actor is `script`.

1. Leave the helper running in terminal 1. Open terminal 2, run its printed
   live-console command, and find the `live>` prompt on the stable screen.
2. At `live>`, type `away` and press Enter. Wait about ten seconds for
   “Actor started”, then about five seconds for “Script completed (verified)”.
   The recent-event preview reads the actual `ScriptEpisodeObserved` event;
   L0/L1 do not contain a synthesized script-result receipt.
3. At `live>`, type `back` and press Enter. Observe presence return.
4. At `live>`, type `diff` and press Enter. Read/scroll the result, then press
   Enter again to return to the live screen.
5. At `live>`, type `audit` and press Enter. Inspect L0 RECEIPT, CAUSAL TIMELINE
   and GOVERNED RAW JSON; the latter includes `ScriptEpisodeObserved` for the
   script. Press Enter to return to the live screen. This resident stores
   script episode references inside payloads, so the terminal's top-level
   `--episode` selector is not used for this walkthrough.
6. At `live>`, type `quit` and press Enter. Return to terminal 1 and press
   Ctrl-C. The ignored store retains private logs; do not paste them here.

Record the witness here using shapes only: date, observed away/back, cadence
fire, `script_<16 hex>` episode observed running and completed (or the actual
failure), compiled diff viewed, full audit viewed, actor kind and actual
harness/model if one was used. Never replace an unobserved field with a claim.

## Executor preparation smoke — 2026-09-29

This was automated by the executor and is **not** the operator's witness.
The helper ran against the operator-selected scratch Git clone using the real
ResidentHost and script adapter, with no fake transport. Through the live
client, away returned exit 0; the status file showed actor `script`, phase
`mission-check`, in a live episode; its observed result was verified with
reason `completed`; back, compiled diff and audit each returned exit 0. The
combined view then showed the receipt, timeline, open orders and back signal.
The executor stopped this resident afterward. This establishes a working
walkthrough setup, not acceptance of criterion 2.

## Corrected terminal preparation — 2026-09-29

The operator's first attempt rejected the scrolling UI and unclear commands;
that attempt is not a passing witness. The corrected UI passed the
[24x80 terminal probe](terminal-probe.json), including the real actor, stable
prompt, idle suppression, wrapped input, readable diff/audit results and exit.
The executor then offered a retry against the already-running preparation
resident with plain commands. The operator then reported completion as recorded
below.

## Operator retry — 2026-09-29

After receiving the exact retry command and the plain `away`, `back`, `diff`,
`audit` and `quit` sequence, the operator reported: “ok i ran through the
commands”. This conversation report supplies the human attribution; the local
console receipts by themselves do not identify a person or prove attention.

The retained log's final command sequence, after the preparation probe, records:

- `away` returned exit 0 and recorded the away signal.
- The ten-second policy cadence dispatched `script_<16 hex>`. Its first
  result returned exit 0, `verified: true`, reason `completed`.
- A second script started; `back` recorded presence return and exited 0.
  That in-flight script ended with reason `operator-return`, unverified; it
  is not claimed as a second successful completion.
- The compiled-diff and full-audit invocations each returned exit 0. The
  prescribed walkthrough views those results in scrollback and audits the
  script through the governed raw projection.

The automated PTY probe separately demonstrated the same live actor display,
diff/audit visibility and stable prompt. The operator's brief report confirms
running the supplied walkthrough; no additional subjective assessment of its
UI or detailed readback is invented. Actor kind was `script` with the real
ResidentHost and sandboxed script adapter; no model worker was used. Executor
preparation used Codex CLI 0.159.0, gpt-6-astra, selected effort ultra.

Identifiers here are shapes; repository identity, store paths and raw logs stay
in the ignored local setup. The executor stopped the preparation resident after
the reported run and confirmed no walkthrough process remained.

## Final-review correction — 2026-09-29

The operator ran an earlier `live.ts`, before D005's final changes. VER-001
observed the operator-paced commands at 15:37:34–15:38:19 UTC and the source's
last write at 15:44:36 UTC; no checkpoint preserves the witnessed build.
After that run, short inspection results were also paused until Enter, generic
payload labels were validated, and terminal clipping was adjusted. The operator
did not witness the final build. VER-001's independent final-build 24x80 PTY
probe reproduced away, a running/completed script, back, readable diff and full
audit, then quit. Criterion 2 asks for the real-resident session, which the
operator report and retained events establish; the later presentation changes
have separate automated evidence. No renewed human witness is claimed.

The earlier shape `script_<ordinal>` was incorrect: the resident constructs
`script_` followed by 16 hexadecimal characters. This record now uses that
shape without copying an identifier. Probe timing and build limits are recorded
in [the correction decision](decisions.md#wo-117-d011).
