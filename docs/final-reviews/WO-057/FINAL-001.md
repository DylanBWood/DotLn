# WO-057 — FINAL-001

**Verdict:** pass. All six criteria are met against the original order. The review found one imprecision in the record, the unstated selection behind the no-server row's removed-name list, and corrected it within the adjacent-cleanup bound ([D007](../../evidence/WO-057/decisions.md#wo-057-d007--state-the-no-server-rows-removed-names-as-a-projection)). Nothing is boarded ([D008](../../evidence/WO-057/decisions.md#wo-057-d008--final-review-passes-the-touching-rows-are-textual-matches)).

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.285","model":"claude-opus-5-5","effort":"xhigh","source":"claude-session-readback"}
**Process cost:** entry 38252 tokens; handoff 4316910 tokens; source claude-transcript-message-usage

Dispatch: `resume: final review`. The canonical phase selected WO-057 and allocated this path. The actor values are this session's: Claude Code 2.1.285 (`claude --version`), model `claude-opus-5-5`, and effort `xhigh` read from `CLAUDE_EFFORT` (selected, not effective). The order recommends any effort for the reviewer. Cost scope is this dispatch. The entry sample was taken at 2026-09-30T02:35:11.046Z and the handoff sample at 2026-09-30T02:48:01.310Z, before this report was filed. These are cumulative transcript counters, mostly cached input (4,172,550 of the handoff total). Reasoning tokens and dollar cost were unavailable.

Fan-out plan: no subagents out of the 20 available. The harness observed 0 admissions, and the root was the only writer.

## Subject, integration and evidence

The subject is the working tree over base `1674ea5e9dfc8f8dfe85db1ed76d46d8af30689e`. At this review, `git ls-remote origin refs/heads/main`, `origin/main` and local `main` all read `1674ea5e`, so no integration ran. No version collided: tags end at v0.56.3, and the order's target is v0.56.4 ([D005](../../evidence/WO-057/decisions.md#wo-057-d005)).

The numbered verification sequence is complete: [VER-001](../../verifications/WO-057/VER-001.md) passed all six criteria. Its SHA-256 recomputes to the `reportHash` in the control log (`6b017203…d4ca0`). At dispatch, every authored subject file had the same blob as the verifier's checkpoint `refs/dotln/checkpoint/WO-057/4`. The only differences were the control log's `FinalReviewRequested` event and the generated projections.

No ideation breakout receipt applies. The evidence folder holds none, and the control log records no scope expansion or amendment. The operator's question about Playwright MCP during execution was answered without changing scope. [D006](../../evidence/WO-057/decisions.md#wo-057-d006--distinguish-runtime-availability-from-an-mcp-architecture-choice) records it in paraphrase and keeps the record from claiming an architecture comparison.

I reviewed:

- the order, its cited ADR-0002 Decision 3 and §Amendments, LEGAL §Current state and §Decision — 2026-09-06, and product 07 §Goal-aligned decisions and §Ideation breakout receipt;
- WO-059's Design and criteria, where it consumes this order's rows;
- the executor handoff, decisions D001–D006 and the meter snapshot;
- the full browser-runtime record and every field of its JSON packet;
- the full diff of ADR-0002, LEGAL, the environment addendum, the README version line, the order heading and the decisions index.

A clean-room screen of the record, packet, decisions, handoff, meter snapshot, report and draft body found no user path, session scratch path, account identity or secret shape. Host paths are placeholders (`<scratch>`, `<user-home>`). The only other absolute paths are system locations from the unchanged `discoverySandbox` profile. The URLs are the public npm registry, the public Playwright download host and Playwright's public repository.

## Criteria

**Criterion 1:** met.

- **Rows.** The record and packet carry all nine rows, each with a command shape and a label. The rows cover every Design row: install online (the lockfile pin, the package install and the browser install), install through the proxy (`unavailable`, with its would-be command shape), the boundary control, the confined headless launch, the screenshot hash, the parent SIGKILL and the launch without the connected server.
- **Screenshot.** The row states equal hashes across two fresh processes (`c040f0cd…2d9c`, 1505 bytes each) and the fixture's hash. The packet's `fixture.html` string recomputes to the recorded `c0bca658…77f4fd`.
- **Installs.** The executor's rows carry their own timestamps and exit codes, 01:43–01:45 UTC, inside the activation window. VER-001 examined the executor's retained install script and results and independently reinstalled the same lockfile, executable and license-file hashes.

**Criterion 2:** met. The `parent-sigkill` row names parent PID 14577 and browser PIDs 14578, 14579 and 14580 from a pre-kill `ps -p` observation with their parent chain. It records the parent's `SIGKILL` exit and two post-kill `ps -p` observations of the same PIDs, each with exit 1 and no rows. It sets `browserSurvivedParentKill: false`. VER-001 saw the same outcome over 5 s from its own launch.

**Criterion 3:** met. The row records a launchd-origin child (parent PID 1) that launched and closed the browser, with no harness invoked and no endpoint supplied. `env -i` cleared the whole inherited environment. The child's full environment was `HOME`, `PATH`, `TMPDIR` and macOS's `__CF_USER_TEXT_ENCODING`. The four removed names listed are a projection. The executor's retained `lifecycle.mjs` line 48 keeps the session names matching `^(CODEX|CLAUDE|MCP|PLAYWRIGHT|PW_TEST|VSCODE)`, and the record did not say so. WO-059 criterion 5 consumes "the variables WO-057's no-server row removed". Taken literally under Claude Code, that list would clear four absent Codex names and leave the session's `CLAUDE*` names. D007 adds one reviewer-marked sentence stating the filter and the `env -i` requirement. The packet, the observation and the label are unchanged.

**Criterion 4:** met.

- **ADR-0002.** §Amendments ends with the dated 2026-09-30 WO-057 bullet. It names WO-059's planned `packages/browser-evidence` package as the consumer of exact `playwright` `1.63.0`, outside the kernel and compiler. That applies the existing posture: a runtime dependency only with a note naming its consumer. WO-059's Design names the same package and keeps it out of kernel, compiler and skeleton imports.
- **LEGAL.** §Current state adds one dated paragraph naming the inventory duty: WO-059 records the pinned inventory, and `THIRD_PARTY_NOTICES` is due at the first built or bundled distribution. `LICENSE`, `LICENSE-docs` and `NOTICE` hash to the three declared values, and the diff touches no declaration.
- **Manifests.** `git diff 1674ea5e` is empty for `package.json`, `package-lock.json` and everything under `packages/` and `scripts/`. All eight protected surfaces hash to the packet's values.

**Criterion 5:** met. `docs/discovery/environment.md` ends with the `WO-057 browser-runtime addendum (2026-09-30)` section, after the earlier addenda. `docs/discovery/environment.json` has no diff against the base, so no edition is re-minted. [The decisions](../../evidence/WO-057/decisions.md) hold D001–D008, and the decisions index carries eight rows, regenerated by `npm run meta`.

**Criterion 6:** met. The product gate passed at the unchanged code identity (below), and `npm run test:docs` passed with this report in the tree. `git diff --check` is clean. No runtime source or dependency changed; the change is Markdown, JSON and JSONL under `docs/` plus the README's version line.

## Findings and follow-up dispositions

One finding, fixed: the no-server row's removed-name list was an unstated projection (criterion 3 above; D007). Its correction is one sentence. It changes no observation, label, contract or criterion, so it does not return the order to repair.

`npm run plan -- followups --touching` listed five pending rows, all textual matches, left as they were (D008):

- FUP-71fc2efc208f597a matched the decisions file and index. D006's dispatch field and evidence paraphrase the operator's question and retain no chat.
- FUP-b7a66e7a4fa7ad20 matched the decisions file. This order edits no release preparation, integrate helper or history check.
- FUP-50cda1c03ecd8ea8 matched the meter snapshot. The harness-prune byte-proof writer is untouched.
- FUP-acfe4bfda716d8fb matched the generated control projection. No usage attribution is touched.
- FUP-fd05316b6030ef73 matched the README and the work-order index. No standing writer text is touched.

Process meter (`npm run meta`, advisory): one budget breach, `current/sequenceBytes` 13,516 against its 8,192 ceiling. That file is outside this order. The meter also reports a `seeking-the-wrong-goal` reopen candidate from machinery share over three order deltas. I record both as observed and leave them to their owners.

## Executed checks

- Final product row: `npm test -- --review`, 29 passed, 0 failed, 460.06 s, 73 fresh tasks, at code identity `aa0c11ebec1f7a23acf17afdc3fe716228c803e63b9490734459c86fc7758409`. That is the executor's and verifier's identity; D007's documentation edit does not move it.
- `npm run test:docs`: 23 passed, 0 failed, 17.44 s, 23 fresh tasks, run after this report existed. Completion runs the gate again inline.
- Also passing: `npm run publication:check` (253/253 headings indexed; both editions CURRENT), `node scripts/docs-check.mjs` (0 failures), `git diff --check`, and my hash, diff and blob probes. The docs check's one advisory, missing roadmap rows for v0.56.1–v0.56.3, is outside the criteria; release tooling regenerates that table.

## Judgment and publication

[D008](../../evidence/WO-057/decisions.md#wo-057-d008--final-review-passes-the-touching-rows-are-textual-matches) compares this outcome with the mission, all eight system traps, Naive Interventionism and NoOp.

The observed outcome:

- WO-059 can pin its browser runtime on rows observed twice, by independent installs, under the verification host's real boundary.
- The ADR amendment and legal observation apply the existing dependency posture without adding a dependency.
- The one imprecision a downstream criterion would consume is now stated where WO-059 reads it.

No efficiency gain is claimed. The tradeoff: I relied on VER-001's independent live reproduction instead of a third install, and ran the fresh product gate that `--review` selected.

Reviewed PR title: `:alembic: Show that a pinned Playwright runs confined and standalone here, so the browser adapter pins a runtime on evidence`. The [gitmoji catalog](https://gitmoji.dev/) assigns that shortcode to performing experiments, and this change records one bounded experiment. [PR.md](PR.md) and [RELEASE-NOTES.md](RELEASE-NOTES.md) follow the current publication profile and state the limits. A pass authorizes committing this reviewed state, pushing only `wo-057` and opening its PR. The helper supplies the post-merge release-close handoff.
