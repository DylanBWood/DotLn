# WO-159 decisions — Codex episode isolation

Dispatch: `resume: next` on 2026-09-25, Claude Code 2.1.282 executor, model
`claude-opus-5-5`, effort `xhigh` (the session exports `CLAUDE_EFFORT=xhigh`,
observed with `printenv`; the operator selected `ultracode` for this session,
which DotLn records as `xhigh` with mode `subagents`). Authority:
`docs/work-orders/WO-159-codex-episode-isolation.md`. The live rows ran on the
operator's local Codex CLI 0.156.1.

## WO-159-D001

```json
{
  "id": "WO-159-D001",
  "date": "2026-09-25",
  "dispatch": "resume: next; equipped Tinkerer — Economy",
  "decision": "Pre-register this order's one economy experiment before implementation: try one live Codex feedback self-host episode through the transport as both criterion 6's feedback re-mint and criterion 3's live Codex worker row, instead of a Claude feedback episode plus a separate Codex row. Budget 900 s wall-clock including preparation and recording. The experiment record with its result is WO-159-D012.",
  "evidence": [
    "Question: can one live Codex episode through CodexCliExecWorkOrderTransport serve both the feedback self-host re-mint and the live worker row?",
    "Deciding observation: the Codex feedback-audit completes with an admitted verdict, its verifier store's WorkerCompleted carries codexIsolation with equal pairs, and --record-selfhost accepts the same store",
    "Precedent: the current feedback edition WO-114/feedback-001 was minted on codex-cli-exec gpt-6-sol xhigh with Codex 0.156.1; 70 of 89 recorded self-host verifications used codex-cli-exec (counted from WorkerAttemptStarted events)",
    "dotln feedback-audit accepts --transport codex-cli-exec (packages/skeleton/src/dotln.ts)"
  ],
  "rejected": [
    { "option": "Two live launches: a claude-cli-print feedback episode (the WO-147 to WO-157 precedent) plus a separate Codex worker row", "reason": "Kept as the fallback if the combined episode is refused or lacks equal pairs; it spends a second live episode otherwise." },
    { "option": "Decline the experiment", "reason": "A credible saving exists: one live episode instead of two, within the order's existing authority." }
  ],
  "reopenWhen": "The Codex episode is refused or its store lacks equal digest pairs; the fallback is the two-launch alternative."
}
```

## WO-159-D002

```json
{
  "id": "WO-159-D002",
  "date": "2026-09-25",
  "dispatch": "resume: next",
  "decision": "Authenticate each isolated episode through a symlink from the per-episode CODEX_HOME to the operator's auth.json, never a copy. D016's reopening condition (credentials cannot reach an isolated home without copying secrets into evidence) does not hold, so the order proceeds.",
  "evidence": [
    "Probe 2026-09-25 under three fresh 0o700 homes in system temp, printing no secret: `codex login status` exited 0 and reported ChatGPT sign-in with a symlinked auth.json, exited 0 with a copied one, and exited 1 'not logged in' with an empty home; the user-level config.toml and auth.json digests were equal before and after each run",
    "auth.json top-level keys observed by name only: auth_mode, OPENAI_API_KEY (null), tokens (id_token, access_token, refresh_token, account_id), last_refresh",
    "openai/codex tag rust-v0.156.1 codex-rs/login/src/auth/storage.rs FileAuthStorage::save opens the auth path with OpenOptions truncate+write+create (mode 0o600) and writes in place; it does not rename. Opening follows a symlink, so a refresh inside the isolated home writes the operator's file",
    "Inference from the version string: the installed codex-cli 0.156.1 binary was built from that tag"
  ],
  "rejected": [
    { "option": "Copy auth.json into the home (0o600)", "reason": "A token refresh during the episode would be written to the copy and discarded with the home; with a rotating refresh token the operator's file could be left stale. The operator preferred a symlink when the CLI honours it (assumption 1)." },
    { "option": "An empty isolated home (D016's caller-side attempt)", "reason": "Observed unauthenticated: login status exits 1." },
    { "option": "Keyring credential storage", "reason": "The keyring key is derived from the Codex home path (storage.rs), so an isolated home would not find the operator's entry; this host uses file storage." }
  ],
  "reopenWhen": "A Codex release writes auth.json by rename or temporary file (the link would be replaced and a refresh lost), or the operator moves authentication to keyring storage."
}
```

The auth bytes never reach a record: the episode record names the home by the
SHA-256 of its path and states only `authentication: "symlink" | "absent"`.
Goal alignment: this is the containment precondition the critical path's
operator-repository orders (WO-066, WO-112, WO-118) cannot skip; it adds no
gate, agent or approval. The eight traps are immaterial to a transport detail
except shifting the burden (the operator no longer removes trust entries after
each proof) and rule beating (addressed by the receipt check in D003).

## WO-159-D003

```json
{
  "id": "WO-159-D003",
  "date": "2026-09-25",
  "dispatch": "resume: next",
  "decision": "Build the launcher in packages/skeleton/src/worker-transport.ts as two parts every Codex launch uses: codexExecArgv, the one builder of a Codex exec argv (it alone holds the shared --ephemeral --ignore-user-config flags; each shape keeps its approval option, leading options and remaining bytes), and startCodexEpisode, which builds the isolated home and environment and whose finish() digests the user-level config.toml and its [projects] trust-table projection again, counts trusted entries the CLI wrote into the isolated home, removes the home and returns a digest-only record. The transport dispatch finishes the episode when the process settles and exposes the record as TransportDispatch.isolation; the worker, verification and source-change hosts add it as codexIsolation to the episode events they already write (WorkerCompleted or WorkerResultObserved, WorkerInterrupted, WorkerResultQuarantined), and a resident CLI observation carries it as isolation. The runtime reports an unequal pair (stderr advisory) and the receipt check assertCodexIsolationUnchanged refuses it; the launch itself refuses only when its home cannot be built.",
  "evidence": [
    "Fixture AC1: a fake codex that appends a trust entry to $CODEX_HOME/config.toml leaves the fixture user-level file byte-identical; the record carries equal pairs, isolatedTrustEntries 1 and homeRemoved true; the fixture auth bytes appear in no record, store file or stderr",
    "All transport argv fixtures (codex-unknown-args.json, wo051-inspection-baseline.json, wo051-writer-args.json, the WO-125 effort rows) still match byte for byte; the six adopted probes keep their argv bytes (approval option, positional prompt or -)",
    "Only type imports were added to registered edition sources other than worker-transport.ts, so no edition gains a runtime import (unregisteredEvidenceImports returns none for all five kinds, integration review lens)"
  ],
  "rejected": [
    { "option": "Refuse or kill a live episode whose digests change", "reason": "The order places the check on the receipt; a mid-run refusal would discard work for a change another program (the Codex desktop app) may have made to the same file. The advisory and the receipt check keep the observation without turning it into a runtime veto." },
    { "option": "A new event type for the isolation record", "reason": "It would route through the reactor slice folds; an optional field on existing terminal events leaves fake, Claude and local-model logs byte-identical." },
    { "option": "The order's declined alternatives: patch the configuration afterwards, -c trust overrides, detection without isolation", "reason": "A write is still a write; overrides do not stop the write; detection alone is the VER-001 state." }
  ],
  "reopenWhen": "A Codex release stops writing trust into the isolated home (isolatedTrustEntries null across live rows), needs other files from the home to authenticate, or a live receipt shows an unequal pair."
}
```

Goal alignment: the mission is dependable unattended work that preserves
authority; this removes a recurring operator rescue (removing trust entries by
hand, the D020 waiver) and is the containment precondition WO-066, WO-112 and
WO-118 need (shifting the burden to the intervenor, seeking the wrong goal).
Rule beating is countered by the receipt check and its forgery tests; policy
resistance and escalation are bounded by adding no gate, agent or approval.
The home also withholds the operator's AGENTS.md, rules and skills, which the
argv already ignores or disables. NoOp keeps every Codex launch writing trust
entries into the operator's configuration and blocks the operator-repository
orders; it is rejected.

## WO-159-D004

```json
{
  "id": "WO-159-D004",
  "kind": "correction",
  "date": "2026-09-25",
  "dispatch": "resume: next",
  "decision": "Prove criterion 2 with the pathspec that reaches package sources, `:(glob)packages/*/src/**`, and run the order's literal command beside it. The literal pathspec `packages/*/src` matches no file in Git's wildcard semantics.",
  "misread": "Criterion 2 reads as if `git grep -l -e '\"--ephemeral\"' -- 'packages/*/src' scripts scripts/probes` would list the launcher's file once the six sites adopt it.",
  "meant": "Only the launcher's file carries the shared exec flags; the six former sites call it (ER3-001's reproduction used 'packages/*/src/*.ts').",
  "changed": "The regression test `WO-159 AC2 only the launcher's file carries the shared Codex exec flags` runs the corrected pathspec; the order text is unchanged.",
  "evidence": [
    "2026-09-25: the literal command listed only the six scripts before adoption and never packages/skeleton/src/worker-transport.ts; `-- 'packages/*/src'` alone exits 1 with no output; `-- 'packages/*/src/*.ts'` and `-- ':(glob)packages/*/src/**'` list worker-transport.ts",
    "After adoption: `git grep -l -e '\"--ephemeral\"' -- ':(glob)packages/*/src/**' scripts` lists exactly packages/skeleton/src/worker-transport.ts; the literal command lists nothing (exit 1)"
  ],
  "rejected": [
    { "option": "Amend the criterion text", "reason": "The meaning is unambiguous and the test records the corrected command; an order amendment adds a planning step for no behavioural gain." }
  ],
  "reopenWhen": "A Codex argv literal appears in an untracked or newly added file (git grep searches tracked files only)."
}
```

## WO-159-D005

```json
{
  "id": "WO-159-D005",
  "date": "2026-09-25",
  "dispatch": "resume: next",
  "decision": "Adopt the launcher at a seventh site the order did not name, scripts/probe-codex-effort.mjs, because it launches live Codex model episodes with the inherited home. Leave bare `codex --version` observations (the transport constructor, scripts/discover.mjs, harness-host.ts) outside the episode scope.",
  "evidence": [
    "scripts/probe-codex-effort.mjs imported canonicalWorkerArgs and ran `spawnSync(\"codex\", args)` with the inherited environment, five model episodes per run; criterion 2's grep cannot see it because it holds no literal",
    "Probe 2026-09-25 with a fresh CODEX_HOME: `codex --version` and `codex exec --help` each wrote only tmp/arg0/codex-arg0*/ helper links (apply_patch, applypatch, codex-execve-wrapper, .lock); no config.toml",
    "The operator's ~/.codex/tmp/arg0 holds 2 entries (a count), so the CLI reaps those helpers; version calls leave no accumulating state and never touch configuration",
    "REFUTATION-004: probe-worker-hosts.mjs was a help-text flag checklist, not a launch; it still adopts the launcher, and its checklist now reads CODEX_EXEC_SHARED_FLAGS"
  ],
  "rejected": [
    { "option": "Route every `codex --version` through an isolated episode", "reason": "It would add a temporary home to every transport construction for no configuration effect; the claim under test is the user-level configuration." },
    { "option": "Leave probe-codex-effort.mjs outside", "reason": "It is a live model launch; the objective is one launch site for every DotLn-launched Codex episode." }
  ],
  "reopenWhen": "A Codex release writes configuration or trust on --version or --help, or the arg0 helper directories accumulate in the operator's home."
}
```

## WO-159-D006

```json
{
  "id": "WO-159-D006",
  "date": "2026-09-25",
  "dispatch": "resume: next",
  "decision": "Carry receipt 028's three known issues into the launcher. (1) An abnormal end leaves a home: homes are named dotln-codex-home-<launcher pid>-<random>; the next launch removes homes whose launcher process has exited (best effort), and `harness prune` lists them. (2) Approval and trust settings absent from the seeded home: every argv keeps its explicit approval and sandbox arguments; the live row records the episode completing within its deadline with approval policy never. (3) A home that cannot be built refuses the launch with WorkerFailure profile-refused 'isolated Codex home'; there is no fallback to the operator's home.",
  "evidence": [
    "docs/planning/off-ramps-5s-entropy-2026-09-25.md §refutation receipt 028, WO-159 (3)",
    "staleCodexEpisodeHomes: a pid is stale only on ESRCH; a live launcher (EPERM or signal success), this process, another user's directory and non-matching names are never listed; test 'WO-159 stale episode homes are those of exited launchers; the next launch removes them'",
    "scripts/lib/harness-prune.mjs returns staleCodexEpisodeHomes (names only); scripts/test-harness.mjs prune test asserts a dead launcher's home is listed and a live one is not",
    "The live row's episode fact: terminal WorkerCompleted, durationMs below the verifier deadline (D012)"
  ],
  "rejected": [
    { "option": "Record an owner file inside the home", "reason": "The home must hold only what authentication needs; the name carries the owner." },
    { "option": "Remove stale homes in prune --apply", "reason": "Receipt 028 asks prune to list them; the next launch already removes them, and prune's apply path carries byte-proof duties this listing does not need." }
  ],
  "reopenWhen": "A reused pid keeps a stale home alive long enough to matter, or a stale home resists removal and accumulates."
}
```

## WO-159-D007

```json
{
  "id": "WO-159-D007",
  "date": "2026-09-25",
  "dispatch": "resume: next; equipped Adjacent Repair",
  "decision": "Move scripts/harness-probe.mjs phaseZero's retained-observation check before the Codex or Claude launch.",
  "evidence": [
    "The check on docs/discovery/harness-smoke-2026-09-07/<mode>.json ran after spawnSync; all three mode files exist, so any rerun launched a model episode and then threw, discarding the observation"
  ],
  "rejected": [
    { "option": "Leave it", "reason": "A bounded repair in a file this order already edits; a rerun would spend a live episode for nothing." }
  ],
  "reopenWhen": "The probe gains a dated output path."
}
```

## WO-159-D008

```json
{
  "id": "WO-159-D008",
  "date": "2026-09-25",
  "dispatch": "resume: next",
  "decision": "Prove digest equality only on fixture homes. Tests that drive the real runner through the default environment (verification WO-157 item 8, resident WO-122) digest the host's own Codex home and assert the record's shape and removal, not equality.",
  "evidence": [
    "VER-001 recorded an unrelated later rewrite of the operator's config.toml: other programs (the Codex desktop app) rewrite that file, so equality over a test run would be flaky and could fail for reasons unrelated to DotLn",
    "WO-159 AC1 and AC4 fixtures point CODEX_HOME at a temporary user home and assert byte identity and equal pairs there"
  ],
  "rejected": [
    { "option": "Set CODEX_HOME for every test process in the runner", "reason": "Several suites read the session's own Codex transcripts through CODEX_HOME (usage-observation, observed-facts, process-debt); a global override changes their subject." }
  ],
  "reopenWhen": "A test that reads the operator's home becomes flaky, or a test needs equality on the real home."
}
```

Those default-environment tests read the operator's `config.toml` only to digest
it and create a temporary link to `auth.json` that the episode removes; no test
writes the operator's home.

## WO-159-D009

```json
{
  "id": "WO-159-D009",
  "date": "2026-09-25",
  "dispatch": "resume: next",
  "decision": "Hand D011's open question — whether the Claude transport leaves the same class of user-level state — to planning unexamined. WO-159's non-goals exclude Claude Code and Copilot worker isolation, and no write has been observed.",
  "evidence": [
    "docs/evidence/WO-111/decisions.md WO-111-D011 followup: 'Check whether the Claude transport leaves the same class of user-level state; that is an open question, not an observation'",
    "docs/proposals/isolated-codex-launch-home/packet.json: analogous Claude or Copilot user-level writes were not measured",
    "WO-159 Non-goals: 'Claude Code or Copilot worker isolation (no observed write)'"
  ],
  "rejected": [
    { "option": "Measure it inside WO-159", "reason": "A live Claude launch with a before/after digest of the Claude user settings is outside this order's authority and cost." }
  ],
  "followup": "Planner: decide whether to measure a claude-cli-print worker launch's effect on the operator's user-level Claude state (for example a before/after digest of the user settings and project registry) before WO-066, WO-112 or WO-118 run Claude workers against an operator-owned repository. Priority: medium; no write has been observed.",
  "reopenWhen": "A Claude or Copilot worker launch is observed changing user-level state."
}
```

## WO-159-D010

```json
{
  "id": "WO-159-D010",
  "date": "2026-09-25",
  "dispatch": "resume: next",
  "decision": "Settle an independent read-only review of the implementation before any edition was minted. Three lenses (isolation safety, integration and coverage, receipt honesty) filed 17 findings; one batch verifier confirmed 11 and partly confirmed 6, refuting none; all are minor after verification. Fixed: ISO-1 (a home is stale only when its launcher has exited and it is older than twice the longest DotLn episode deadline, STALE_CODEX_HOME_MS, so a detached Codex that outlives a killed launcher keeps its home), ISO-2 (finish records homeRemoved false instead of throwing), ISO-3 (the trust-table projection covers inline root tables, literal keys and quoted brackets, and array lines are not headers), ISO-4 (the writing-worker probe finishes each row in finally), F2 (WorkerResultQuarantined carries the record; source-change keeps it on WorkerResultObserved and WorkerInterrupted, a placement choice), F3/R4 (the live mode validates before writing and keeps a failed attempt under live-codex-attempt-N.json), F5 (a fixture receipt is built from a VerificationHost store), F6 (the probe Codex stub refuses any home but an isolated one; worker-transport.ts reselects the harness-probe and harness-fixtures suites), R1, R2, R3 and R5 (the receipt requires the auth link on both launches, closes the isolation records, requires distinct homes, cross-checks the census digests, names the event stream and matches the committed feedback store). F1 (the harness snapshot moves because cli-actor-contract.ts is a runtime file) is the routine harness re-emit during minting. F4/R6 (the committed-receipt test skips when absent) is closed after the live row. F7 is declined.",
  "evidence": [
    "Review workflow wf_b3f7e7c1-fc4 (four read-only agents, xhigh): findings ISO-1 to ISO-4, F1 to F7, R1 to R6 with reproductions; batch verdicts recorded in the session",
    "After the fixes: node --test codex-episode and codex-isolation-receipt 11 pass (1 skipped until the live row); worker, verification, writer, resident-actors, source-change-host, verification-worktree, feedback-host, mission-check and portfolio 119 pass serially; test-harness-probe 11, test-authority-probe 26, local-model-role-qualification 13, test-configuration-root 13 and the prune test pass"
  ],
  "rejected": [
    { "option": "F7: give every test transport a fixture CODEX_HOME", "reason": "A fixture child already runs as the operator with the real HOME and could read ~/.codex/auth.json directly, so a link inside a 0o700 temporary home grants no new access; those tests assert the record's shape only (D008), and suiteEnvironment deliberately passes CODEX_HOME to suites." },
    { "option": "ISO-1: a pid file for the Codex child inside the home", "reason": "The home holds only what authentication needs; the age bound protects an orphan without new contents." },
    { "option": "ISO-1: fix the supervisor's signal handling here", "reason": "Pre-existing and outside this order's deliverables: it changes the resident host's shutdown ordering and supervisor-lost recovery, which needs its own design and fixture." }
  ],
  "followup": "Planner: a resident CLI supervisor killed from its terminal leaves its detached Codex episode running unobserved. cli-actor.ts forks the cli-episode supervisor in the foreground process group while runWorkerProcess spawns resident Codex detached; cli-episode.ts handles only disconnect and message, so a terminal SIGINT or SIGTERM kills the supervisor and never reaches the detached group, and the supervisor-lost path only records the loss (WO-159 review ISO-1, confirmed; adjacent-0001). Fix: supervisor SIGINT and SIGTERM handlers that kill the active episode's process group before exiting, with a fixture. Priority: medium; WO-159's age bound keeps such an orphan's home.",
  "reopenWhen": "A live receipt or later review shows a record without isolation, or an orphaned Codex episode losing its home."
}
```

## WO-159-D011

```json
{
  "id": "WO-159-D011",
  "date": "2026-09-25",
  "dispatch": "resume: next; standing release assignment (product 07 §Discipline, Release assignment is opt-out, operator default 2026-09-04)",
  "decision": "Complete the missing activation target: application v0.48.0, the next minor above the local tag v0.47.1 under the declared minor classification; @dotln/skeleton 0.40.0 to 0.41.0 (new launcher exports and optional record fields), with the console's exact pin and the lockfile following; compiler, kernel and console versions unchanged. Bind the heading label (v0.48.0) with `npm run plan -- amend-order`, because the 2026-09-25 planning pass filed WO-158 to WO-165 without the `(version assigned at activation)` heading placeholder that the planning check admits as the release label; the amendment changes only that label.",
  "evidence": [
    "WO-159 heading has no version token; its classification line reads 'Assigned at activation under the standing opt-out default'",
    "WO-154 to WO-157 were each filed with '(version assigned at activation)' (git log --diff-filter=A); WO-158 to WO-165 were not",
    "scripts/lib/release-preparation.mjs requires exactly one strict version in the heading; scripts/lib/plan-continuation.mjs releaseAssignment admits only the placeholder-to-version change",
    "Trial 2026-09-25: appending ' (v0.48.0)' to the heading made `npm run plan -- check` refuse 'existing work-order bytes changed'; the order was restored byte-identical",
    "Product 07 §Discipline: 'Complete a missing activation target under 06-roadmap.md §Release boundary and record the base/classification; do not repeatedly ask for routine release assignment'"
  ],
  "rejected": [
    { "option": "Ask the operator before assigning", "reason": "The standing default asks not to be asked for routine release assignment, and the order's own classification line assigns it at activation; the amendment is bounded to the label and recorded here for veto." },
    { "option": "Skip release preparation", "reason": "A missing component bump is an executor defect, and release prepare needs the heading version." },
    { "option": "Widen the planning check to accept a version without the placeholder", "reason": "That weakens a planning guard for one filing defect; the defect belongs to planning." }
  ],
  "followup": "Planner: the 2026-09-25 off-ramps pass filed WO-158 and WO-160 to WO-165 without the '(version assigned at activation)' heading placeholder, so each executor must bind its release label through an execution amendment (WO-159-D011). Restore the placeholder when filing, or admit the release label for a heading that declares 'Assigned at activation'. Priority: low.",
  "reopenWhen": "The operator vetoes the assignment or names another version; or a sibling order consumes v0.48.0 first (retimed at final review under the same classification)."
}
```

## WO-159-D012

```json
{
  "id": "WO-159-D012",
  "kind": "experiment",
  "date": "2026-09-25",
  "dispatch": "resume: next; equipped Tinkerer — Economy",
  "decision": "Adopt the pre-registered method (WO-159-D001) for an order that needs both a live Codex row and a feedback re-mint: one feedback self-host episode on codex-cli-exec, bracketed by the isolated login check and the trust census, served criterion 3 and criterion 6.",
  "question": "Can one live Codex episode through CodexCliExecWorkOrderTransport serve both the feedback self-host re-mint and the live worker row?",
  "alternatives": [
    "Two live launches: a claude-cli-print feedback self-host episode plus a separate Codex worker row",
    "One live launch: the feedback self-host episode on codex-cli-exec gpt-6-sol xhigh, bracketed by the isolated login check and the trust census"
  ],
  "observation": "The Codex episode completed (WorkerCompleted, feedback-audit exit 0, ten fixtures), its verifier store carried codexIsolation with equal pairs, --record-selfhost accepted the same store ('Live feedback audit docs/evidence/WO-159/feedback-001 judged the current source'), and receipt.mjs --check matched the committed stream's terminal event.",
  "budget": { "wallSeconds": 900 },
  "execution": "run",
  "cost": {
    "wallSeconds": 24,
    "tokens": 208174,
    "commands": [
      "node docs/evidence/WO-159/receipt.mjs --live --store <repo>/.runtime/feedback-audit-wo159-r001",
      "node scripts/feedback-evidence.mjs --record-selfhost <repo>/.runtime/feedback-audit-wo159-r001",
      "node scripts/feedback-evidence.mjs --check",
      "node docs/evidence/WO-159/receipt.mjs --check"
    ],
    "source": "Wall-clock from the shell wrapper around --live (2026-09-25T04:35:40Z to 04:36:04Z; build, login check, episode, census and receipt). Tokens from docs/control/local/process/usage.jsonl, source codex-result-envelope: 207,417 input, 757 output (439 reasoning), 208,174 total. This is the whole combined episode, which the order required anyway, not a marginal cost; preparation and recording were part of the order work."
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": ["node docs/evidence/WO-159/receipt.mjs --live --store <new directory>"],
    "summary": "One live launch instead of two for this order. The avoided launch was not run, so its saving is not measured; for scale only, WO-157-D036's claude-cli-print feedback episode took 172 s and 659,304 tokens. The later writer-shape trust probe (WO-159-D013) answered a different question and is not part of this comparison."
  },
  "outcome": "adopted",
  "regression": false,
  "history": { "lastAdoptedImprovementAt": "2026-09-25", "experimentsSinceAdoption": 0 },
  "evidence": [
    "docs/evidence/WO-159/live-codex.json",
    "docs/evidence/WO-159/feedback-001/edition.json and selfhost-verification.jsonl",
    "docs/control/local/process/usage.jsonl verifier row recorded 2026-09-25T04:36:03.848Z"
  ],
  "rejected": [
    { "option": "Two live launches", "reason": "The combined episode met both deciding observations on its first attempt." }
  ],
  "reopenWhen": "A Codex feedback self-host episode is refused or its verdict differs from a Claude episode on the same subject, or a live row needs a launch shape the feedback verifier does not use."
}
```

## WO-159-D013

```json
{
  "id": "WO-159-D013",
  "kind": "correction",
  "date": "2026-09-25",
  "dispatch": "resume: next; operator message during execution: 'i updated config.toml from 43 to 1. but i never saved the file', then 'ok i hit save'",
  "decision": "Record the live row, a writer-shape trust probe and the trust census as observed. The live row's census is 43 trusted entries before and after, the file as it stood; the planning pass's one-entry baseline came from an unsaved edit. After the operator saved at 2026-09-25T04:40:38Z the user configuration holds 1 trusted entry and none in a DotLn scratch family.",
  "misread": "The 2026-09-25 planning pass (commit b3991fbd) recorded that the operator had removed every user-level trust entry but the DotLn project's, so WO-159's baseline would be one entry.",
  "meant": "The operator had edited config.toml down to one entry in an editor without saving; the file on disk still held the 43 entries of WO-111's diagnosis.",
  "changed": "live-codex.json records 43 before and after (the file was last written at 2026-09-25T00:00:56Z, before the planning commit and this session). A count-only census after the save: 1 trusted entry, 0 DotLn scratch families, 1 other project, file digest changed, modification 2026-09-25T04:40:38Z. The operator saved after the live launches and before handoff, at the executor's signal, so no receipt spans the save.",
  "evidence": [
    "Live row 2026-09-25T04:35:40Z to 04:36:04Z: codex login status exit 0 (ChatGPT) under an isolated home with the auth link; one codex-cli-exec gpt-6-sol xhigh feedback verifier episode completed in 19,490 ms against a 600,000 ms deadline with 19 heartbeats and approval policy never; both launches' user config.toml and trust-table pairs equal, both homes removed; isolatedTrustEntries null for both (this inspection shape wrote no configuration into its home)",
    "The live verifier home held the CLI's own state while it ran (logs, state, goals, memories and queue SQLite stores, models cache, skills, installation id), all of which would otherwise have been written into the operator's ~/.codex; observed by entry names only",
    "Trust probe 2026-09-25 (docs/evidence/WO-159/trust-probe.json): WO-111's source-change prefix (-a never exec --ephemeral --ignore-user-config --sandbox workspace-write --cd <scratch Git root>) with a one-word prompt, gpt-6-sol low, exit 0 in 3,999 ms, 14,376 input and 9 output tokens; the CLI wrote 1 trusted entry naming its scratch target into the isolated home; the user config.toml and trust table were byte-identical (43 before and after)",
    "Count-only census at the live row, by the diagnosis's public family prefixes: 36 DotLn-family entries (18 dotln-authority, 6 dotln-writing-worker, 4 dotln-resident-actors, 2 dotln-wo111, one each for dotln-harness-probe, dotln-target-live, dotln-wo053, dotln-wo056 and the two dotln-codex-compact-probe families) and 7 other projects, identical to docs/evidence/WO-111/codex-trust-diagnosis.md",
    "An isolated home whose launcher (pid 86323) had exited was present in system temp at 04:36Z, created 04:29:11Z during this session's test runs, holding only the auth link; under WO-159-D010 it stays until older than STALE_CODEX_HOME_MS, then the next launch removes it and harness prune lists it"
  ],
  "rejected": [
    { "option": "Rerun the live row after the save to show a one-entry baseline", "reason": "The criterion is equal digests before and after the launch, which the recorded row shows; a rerun would spend a live episode to restate a count." },
    { "option": "Remove the stale entries for the operator", "reason": "A non-goal: they are the operator's settings, and the operator removed them." }
  ],
  "reopenWhen": "The trusted-entry count rises above one before WO-159 closes (FUP-069721aeed24fe6d), or a live receipt shows an unequal pair."
}
```

This confirms WO-111-D011's attribution, which was an inference: with the
source-change prefix the Codex CLI itself writes the trust entry, into whatever
`CODEX_HOME` it runs with. The inspection-shape episode wrote none, so the
trust write depends on the launch shape, not on every launch.

## WO-159-D014

```json
{
  "id": "WO-159-D014",
  "kind": "correction",
  "date": "2026-09-25",
  "dispatch": "resume: next",
  "decision": "Re-mint the authority, verification and feedback editions as WO-159/001 and point docs/evidence/current.json at them; keep artifact identity at WO-154/001, whose check passes and which criterion 6 does not name. Re-emit the harness bundle because cli-actor-contract.ts is a harness runtime file.",
  "misread": "The order names packages/skeleton/src/worker-transport.ts as the registered source it edits.",
  "meant": "Every registered source the order edits re-mints its editions.",
  "changed": "Eight edited files are registered in all five inventories (authority, artifact identity, verification, feedback, harness): package-lock.json, package.json, packages/skeleton/package.json, and packages/skeleton/src cli-actor-contract.ts, cli-actor.ts, source-change-host.ts, verification-host.ts, worker-transport.ts. Seven are judged feedback sources (all but package.json). WO-158 also regenerates the .claude bundle; the integrating final review regenerates it once (product 07 §Independent workflows and integration).",
  "evidence": [
    "Baseline before re-minting: authority --check failed (bundle-diff moved with the harness snapshot); artifact identity and verification passed; feedback failed 'judged behavior changed since docs/evidence/WO-114/feedback-001 (cli-actor-contract.ts, cli-actor.ts, source-change-host.ts, verification-host.ts, worker-transport.ts)'",
    "node scripts/harness.mjs emit --loadout contributor, then check: 31 generated surfaces; 14 .claude files moved to the new runtime snapshot; node scripts/harness-context.mjs --check exit 0",
    "authority-evidence --write then --check verified (and verified again on regeneration); verification-evidence --write then --check verified; the four WO-159 verification files are byte-identical to WO-154's",
    "evidence:feedback --write, the live Codex episode (WO-159-D012), --record-selfhost and --check: 'Live feedback audit docs/evidence/WO-159/feedback-001 judged the current source'",
    "evidenceSources(root) and FEEDBACK_SOURCE_PATHS read on 2026-09-25"
  ],
  "rejected": [
    { "option": "Leave the verification edition at WO-154", "reason": "Its check passes, but criterion 6 asks that it re-mint deterministically; the identical bytes are that evidence." },
    { "option": "Re-mint artifact identity too", "reason": "Its check passes and criterion 6 does not name it (WO-154-D004 precedent)." }
  ],
  "reopenWhen": "Any registered source changes after these editions were minted."
}
```

## WO-159-D015

```json
{
  "id": "WO-159-D015",
  "date": "2026-09-25",
  "dispatch": "resume: next",
  "decision": "Discharge the write-backs: a dated correction appended below the existing bytes of docs/evidence/WO-054/codex-continuation.md; a WO-159 dated reassessment in docs/planning/capability-table.md covering Codex launch containment and WO-054's continuation row; one status sentence in product 03's progressive absence candidate that the containment precondition is met; the publication locks refreshed. FUP-3c34a8ffbf61376f, allocated to WO-159, and its duplicate FUP-f3281eb085ad87a7 settle at close: this worktree's queue holds no deferral onto them, and register dispositions go through planning's followups apply.",
  "evidence": [
    "The first bytes of codex-continuation.md hash to the HEAD file's SHA-256 (44197513…), so the original is an unchanged prefix",
    "The WO-054 capability observation (profile codexContinuation, observed 0.155.0) stands; only the evidence file's settings claims were overstated",
    "npm run plan -- check exit 0 after the capability section; npm run publication:check exit 0 after refreshing the two edition locks printed by --print-locks (WO-151 precedent)",
    "FUP-3c34a8ffbf61376f reopens when 'an isolated launch still changes the user-level Codex configuration, or WO-159 closes without its live row'; neither holds"
  ],
  "rejected": [
    { "option": "Edit the WO-054 sentences in place", "reason": "Criterion 5 asks for a note appended below the existing bytes." },
    { "option": "Change the codexContinuation profile row in contributor.ts", "reason": "The continuation capability itself is unaffected; editing it would move the harness manifest and authority edition for no behavioural change." }
  ],
  "reopenWhen": "The close does not settle FUP-3c34a8ffbf61376f, or a later order finds another WO-054 claim contradicted."
}
```

## WO-159-D016

```json
{
  "id": "WO-159-D016",
  "date": "2026-09-25",
  "dispatch": "resume: verify; VER-001",
  "decision": "Fail independent verification and route the writing-worker probe's multi-process rows to repair. A Codex concurrent row launches three distinct exec processes under one CODEX_HOME, and its resident-kill row reuses the first process's home for a fresh recovery launch. One aggregate digest record cannot establish the order's per-launch claim.",
  "evidence": [
    "docs/work-orders/WO-159-codex-episode-isolation.md heading and lines 106-122 require a fresh home and two digest pairs before and after each launch, including the six probe sites",
    "scripts/lib/writing-worker-probe.mjs lines 1128-1130 create one startCodexEpisode and env per row; lines 1176-1187 pass that env into three concurrent runProcess calls; lines 1307-1318 reuse it for a recovery process explicitly recorded as a fresh episode; lines 1342-1349 file only one codexIsolation",
    "scripts/test-harness-probe.mjs lines 1000-1025 check one homeRemoved field per row but do not check distinct homes or per-process records; the current 27-suite npm test passed with this gap"
  ],
  "rejected": [
    { "option": "Treat a probe row as one episode", "reason": "The concurrent row itself launches three Codex exec sessions, and the recovery row names a fresh episode; the order requires digests before and after each launch." },
    { "option": "Repeat the live feedback verifier episode", "reason": "Its single-process observation is valid and cannot test the multi-process probe path; a focused fixture is the smaller useful proof." }
  ],
  "followup": "WO-159 VER-001 F1 repair: give each Codex exec in concurrent and fresh-recovery probe rows its own startCodexEpisode lifecycle, retain one digest record per launch, and add a fixture asserting distinct homes and records across the launches before re-verification.",
  "reopenWhen": "A repaired probe row still shares a home across distinct Codex exec launches or omits a launch's before/after digest record."
}
```

**Same-day correction:** D003 and the probe's WO-159 comment treated a probe
row as one episode. The work order means one isolated home and digest record
for each Codex exec launch. VER-001 changes the outcome to failed verification
and routes the two multi-process shapes to repair; it does not rewrite the
earlier implementation decision or its evidence.

## WO-159-D017

```json
{
  "id": "WO-159-D017",
  "date": "2026-09-25",
  "dispatch": "resume: verify; VER-001",
  "decision": "Record a bounded receipt-integrity defect without rejecting the current live episode: the committed stream agrees with its receipt, but the receipt check accepts a false well-formed eventStream.sha256 and does not compare the recorded row count or start event with the retained stream.",
  "evidence": [
    "docs/evidence/WO-159/receipt.mjs lines 321-334 validate eventStream.sha256 syntax; lines 389-409 match only the terminal event's isolation record",
    "A read-only mutation of live-codex.json eventStream.value.sha256 to 64 zero hex digits made both validateReceipt and matchSharedStream return true",
    "Resolving the committed feedback verifier stream's edition references reconstructed the original 2,203,530-byte log in memory; its SHA-256 8916ed6f..., 29 rows and WorkerAttemptStarted launch selection match the present receipt. The projected 63,528-byte file has a different hash by design; this finding concerns what --check would admit after a change"
  ],
  "rejected": [
    { "option": "Treat any syntactically valid SHA-256 as checked", "reason": "A deliberately false digest passes while the receipt labels the stream hash observed." },
    { "option": "Rerun the live episode", "reason": "The retained stream reconstructs and matches the present receipt; the checker needs a bounded fixture and comparison, not another model call." }
  ],
  "followup": "WO-159 VER-001 F2 repair: bind receipt eventStream.sha256, row count and launch selection to the retained feedback verifier stream in --check, with a fixture that rejects a well-formed false hash and mismatched start event.",
  "reopenWhen": "The receipt check still admits a well-formed false stream hash, count or launch selection."
}
```

## WO-159-D018

```json
{
  "id": "WO-159-D018",
  "kind": "correction",
  "date": "2026-09-25",
  "dispatch": "resume: fix; VER-001 F1 (WO-159-D016)",
  "decision": "Give every Codex invocation in a writing-worker probe row its own isolated episode. scripts/lib/writing-worker-probe.mjs routes each launch through isolated(label, launch), which starts one startCodexEpisode, hands its environment to exactly one invocation and finishes it in finally; the row records codexEpisodes, one labelled record per invocation in launch order (exec; concurrent-1 to concurrent-3; exec and recovery; help), in place of the one row-level codexIsolation. userScopeSettingsWritten is true when any invocation's user-config pair is unequal. The row-level try/finally is gone, which restores HEAD's indentation of the loop body (the probe's net diff falls from 470 to 147 lines). Claude's background session keeps the caller's environment: the Codex catalog has no background launch, and one episode around its several invocations would repeat F1.",
  "misread": "WO-159-D003 and the probe's WO-159 comment treated a probe row as one episode.",
  "meant": "One isolated home and one before/after digest record for each Codex invocation, as D016 records.",
  "changed": "The concurrent row's three sessions and the resident-kill row's fresh recovery each get their own home and record; the fixture proves it at the invocation level.",
  "evidence": [
    "scripts/test-harness-probe.mjs: the Codex stub appends the CODEX_HOME each invocation saw; the WO-044 fixture asserts 12 invocations (the version call and 11 row launches) with 12 distinct homes, each row's labels (concurrent-1 to concurrent-3; exec and recovery; help; exec otherwise), homeRemoved and equal pairs on every record, and that the recorded home digests equal the SHA-256 of the 11 row launches' homes exactly (node --test, pass, 22.0 s)",
    "Negative control 2026-09-25: the same fixture against the probe at refs/dotln/checkpoint/WO-159/5 fails 'no two launches share a home' with 9 distinct homes for 12 invocations (the three concurrent sessions shared one, and so did exec and recovery); the temporary copies were removed",
    "The other five launch sites pair one episode with one invocation: harness-probe.mjs, authority-probe.mjs, probe-codex-effort.mjs, local-model-role-qualification.mjs and target-worker-smoke.mjs start and finish one episode around one spawn, and probe-worker-hosts.mjs starts one per run() call (read 2026-09-25)",
    "No registered edition source changed: evidenceSources lists none of the four repaired files in the authority, artifact identity, verification, feedback or harness inventories"
  ],
  "rejected": [
    { "option": "Record each invocation beside its launch observation (concurrent[i], recovery)", "reason": "A reader proving one record per invocation would have to gather them from three shapes; one labelled list does it directly and matches probe-worker-hosts.mjs's episode array." },
    { "option": "Keep a row-level record beside the per-invocation records", "reason": "It restates one invocation's digests as the row's and invites the aggregate reading VER-001 refused." },
    { "option": "Rerun the live writing-worker probe", "reason": "The defect is control flow; VER-001 notes no model call is needed, and the stub fixture observes every invocation's home." }
  ],
  "reopenWhen": "A Codex probe row gains an invocation outside isolated(), or a live writing-worker row shows a shared home or a missing per-invocation record."
}
```

## WO-159-D019

```json
{
  "id": "WO-159-D019",
  "date": "2026-09-25",
  "dispatch": "resume: fix; VER-001 F2 (WO-159-D017)",
  "decision": "Bind the live receipt to its retained stream by deriving the whole receipt from it. matchSharedStream reads the WO-159 feedback edition's verifier stream by value through feedbackEditionLog (the edition's own references and pins, WO-154), passes it with the receipt's bracketing observations (the login record, the census counts and digests, commandExit, timeoutMs and workerEpisodeId) to buildReceipt, the builder --live used, and requires every top-level field to be deep-equal. The stream digest, row count, terminal event, launch selection (transport, harness version, model, effort, selection source), heartbeats, duration and isolation record are each bound to the stream, not to their syntax. --check now requires the retained stream: an unresolvable or absent stream throws instead of skipping.",
  "evidence": [
    "Committed receipt 2026-09-25: the edition's references rebuild the 2,203,530-byte verifier stream in 28 ms; all nine top-level fields re-derive identically; node docs/evidence/WO-159/receipt.mjs --check exits 0 ('the retained feedback verifier stream derives it')",
    "packages/skeleton/test/codex-isolation-receipt.test.ts: eight forgeries that validateReceipt still admits are each refused by matchSharedStream with their expected message (a well-formed false digest, row count, terminal event, model, harness version, episode home, heartbeat count, an episode absent from the stream); a stream whose start event names another model is refused; the committed receipt with a 64-zero digest, VER-001's reproduction, is refused. The WO-159 skeleton tests pass 12 of 12",
    "VER-001 F2: before this repair both validateReceipt and matchSharedStream returned true for the 64-zero digest"
  ],
  "rejected": [
    { "option": "Compare only the digest, the row count and the start event (D017's minimum)", "reason": "A field-by-field list leaves the next derived field unchecked; deriving the whole receipt through the builder binds every stream-derived field at once." },
    { "option": "Hash the committed projected file", "reason": "Its bytes differ from the store's by design (references in place of bodies); only the rebuilt stream carries the claimed digest." },
    { "option": "Rerun the live episode", "reason": "The retained stream rebuilds and derives the present receipt; the defect was in the checker." }
  ],
  "reopenWhen": "A receipt field is added that the stream does not derive, or the WO-159 feedback edition can no longer be resolved by feedbackEditionLog."
}
```

Goal alignment: both repairs restore the claims the order already makes and add
no gate, agent, approval or live episode. F2 is the rule-beating lens itself:
before the repair a receipt could pass without the stream it names. F1 closes a
per-launch claim the probe had reduced to a per-row aggregate (drift to low
performance). No shared compute was spent: both are proved by fixtures, with a
negative control for F1 and VER-001's reproduction for F2. NoOp leaves both
findings standing and blocks re-verification. Economy: WO-159-D012 is this
order's one experiment, and it was read before repair; no second experiment was
started.

## WO-159-D020

```json
{
  "id": "WO-159-D020",
  "date": "2026-09-25",
  "dispatch": "resume: final review",
  "decision": "Pass final review without integration and record the reviewer's product gate as it happened. Local main, origin main and the worktree HEAD were the same commit (1f888509) at review, so no merge, retime or re-mint was needed, the integrate helper was not run, and every VER-002 claim is carried forward on unchanged source bytes. The first `npm test -- --review` failed one skeleton subtest this order does not touch, the WO-143 lock-boundary matrix, which exceeded its own 240 s budget while a sibling worktree's product gate shared the host; the second run, alone on the host, passed 37 suites with 0 failures at the same tree and code identity. Every WO-159 subtest passed in both runs.",
  "evidence": [
    "git rev-parse HEAD main and git ls-remote origin refs/heads/main on 2026-09-25: all 1f88850975c5aa7c2e8169c7267017d06d34a302; git log main..HEAD is empty",
    "docs/control/local/harness/checks.json rows: 2026-09-25T05:49:54.351Z exit 1, 564,676 ms, skeleton 377,741 ms, the only failed task; 2026-09-25T05:59:47.772Z exit 0, 492,013 ms, skeleton 294,403 ms, 81 fresh tasks; both at tree 2fe97d33b9e11647b1668df894546d0213860674 and code identity fbcb86c8921193b8b901db1b198ecde8251ef9dddf42a7085d372b8699986cd7 with no sandbox in force",
    "Gate log: 'not ok 223 - WO-143 once and loop restart at every acquisition filesystem boundary, including killed reclaimers', failureType testTimeoutFailure, 240,795 ms, seven of eight matrix cells reported before the timeout; packages/skeleton/test/resident.test.ts declares { timeout: 240000 } for it; the row's four deadline diagnostics are classified deadline-hit-cause-unestablished",
    "During the first run ../DotLn-wo158/docs/control/local/harness/active-gates held one live gate record and the host load averages were 4.21, 6.41 and 6.93; the record was gone and the load lower before the second run",
    "git diff of the checkpoint 9 tree against the staged index differs only in docs/control/current.md, docs/control/orders/WO-159.jsonl and docs/work-orders/README.md, the projections the final-review dispatch regenerated; against the checkpoint 8 tree it is empty outside docs/",
    "The diff changes no resident lock code; packages/skeleton/src/resident-host.ts gains one optional field on a failed observation"
  ],
  "rejected": [
    { "option": "Run npm run worktree -- integrate WO-159 anyway", "reason": "With identical bases it would stash and re-apply 79 uncommitted files to merge nothing and would need an intake backup archive; the projections it regenerates were refreshed by the dispatch and by this review's index and meta runs, and publication, harness, plan and release preflights pass." },
    { "option": "Treat the first gate failure as an acceptance defect and route it to repair", "reason": "The failing subtest exercises resident lock acquisition, which the order does not touch; the order's own subtests passed in that run; the timeout is a per-test budget exceeded under a concurrent sibling gate, and the rerun alone on the host passed at the same code identity." },
    { "option": "Report only the passing row", "reason": "Both rows are recorded gate observations; the report and this decision name both." }
  ],
  "followup": "Planner: the WO-143 lock-boundary matrix subtest (packages/skeleton/test/resident.test.ts, 'once and loop restart at every acquisition filesystem boundary, including killed reclaimers') runs eight kill/restart cells under one 240 s budget and exceeded it when a sibling worktree's product gate shared the host at WO-159 final review (seven of eight cells done; skeleton suite 378 s loaded against 294 s alone). Decide between per-cell budgets, a smaller matrix, or having the runner name a concurrent sibling gate as the deadline cause, since the row classifies its deadline hits 'deadline-hit-cause-unestablished'. Priority: low; the rerun passed.",
  "reopenWhen": "The same subtest times out on a host with no sibling gate, or a later review finds a source byte that differs from checkpoint 8."
}
```

Goal alignment: the review adds no gate, agent or ritual and spends no model episode. Reporting only the passing row would be rule beating; routing a load-induced timeout of untouched code to repair would be naive interventionism. NoOp on the follow-up leaves a machinery budget that fails whenever two gates share the host, which the planner can bound.
