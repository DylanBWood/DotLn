# WO-177 — Spawned agents run the pinned models: every compiled default and probe that launches a worker names Codex `gpt-6.1-sol` at `max` and Claude Code `claude-opus-5-5` at `xhigh`, the Codex agent-spawning parameters are recorded, and the attestation keeps saying what actually ran (v0.61.3)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer any.
**Release classification:** patch. Default values and their fixtures;
no gate step, no schema change, no refusal. Assigned at activation under
the standing opt-out default.
**Cost:** adds one changed default in `scripts/lib/entropy-review.mjs`
(`TRANSPORT_DEFAULTS`, the Codex row), two in
`scripts/lib/writing-worker-probe.mjs`, one in
`scripts/lib/authority-probe.mjs`, two in `scripts/lib/subagent-probe.mjs`,
the fixture rows that assert them (`scripts/test-entropy-review.mjs`,
`scripts/test-resident-bind.mjs`), one bounded Codex session that records
whether `spawn_agent` takes a model and an effort, and at most 600 bytes
in `docs/AI-HARNESS-SECURITY.md` §Harness version, model and effort
readback and 200 in `docs/instance/entropy-reducer/README.md`, edited in
place. Removes: the disagreement between the operator's direction and
the compiled defaults, under which a launched Codex review or a probe
runs a model the operator retired for spawned work. Re-mints: none of
the six files is a registered evidence source; `packages/skeleton/src/entropy-review-protocol.ts`
is one and is unchanged. Wall-clock, tokens and context bytes are
unknown until run.
**Nomination provenance:** the operator's direction of 2026-09-30 (item
2 of the mid-turn message: spawned Codex agents run GPT-6.1-Sol at max,
spawned Claude agents run Opus 5.5 at xhigh), captured in ignored intake
(SHA-256 in the ledger section); the compiled defaults this pass read;
WO-086's Codex readback (`gpt-6.1-sol` on Codex CLI 0.159.0,
[handoff](../evidence/WO-086/handoff.md)) as the evidence the model runs
on the operator's host; the Codex 0.154.0 effort probes that record
`max` as an accepted selector (AI-HARNESS-SECURITY). Planner-synthesized.
Opaque identifier, not a priority. Clean-room screen: public model names
and repository records; no stop condition.
**Depends on:** WO-175 merged (both edit `scripts/lib/entropy-review.mjs`;
WO-175 closes first); WO-100 merged (the defaults it set; closed).
**Recommended placement:** paired with WO-182 in the fifth slot, the
machinery lane beside the deliverable-ready conjunction. This order edits
`scripts/lib/entropy-review.mjs`, the three probes, their fixtures,
`docs/AI-HARNESS-SECURITY.md` and the reducer README; WO-182 edits
`scripts/github-body.mjs`, `scripts/lib/target-publish.mjs`, their
fixtures and product 03. Disjoint files and no hard edge. A recommendation, not a dependency
token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-175",
    "relation": "hard",
    "reason": "both edit scripts/lib/entropy-review.mjs; WO-175 closes first"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `scripts/lib/entropy-review.mjs`
(`TRANSPORT_DEFAULTS`, `buildAttestation`);
`scripts/lib/writing-worker-probe.mjs` (the model table near its top);
`scripts/lib/authority-probe.mjs` (the cell actor); `scripts/lib/subagent-probe.mjs`
(the model constants); `packages/skeleton/src/worker-transport.ts`
(`canonicalWorkerArgs`: how `--model` and the effort reach each CLI);
`docs/AI-HARNESS-SECURITY.md` §Harness version, model and effort readback
(the Entropy Reducer launch line, WO-151); `docs/instance/entropy-reducer/README.md`
(the substitute-reviewer reading); product 07 §Model-specific notes (the
spawned-agent rule this pass wrote) and §Operator-opened planning pass
(the refuter sentence); `docs/evidence/WO-086/handoff.md` (the Codex
readback); `.agents/skills/dotln-refuter/SKILL.md` (the `spawn_agent`
sentence).

**Objective:** a worker any session launches runs the model and effort
the operator pinned, by default and without a flag, and the record says
which model and effort actually ran.

**Observed gap (dated 2026-09-30, `main` at `b51a58a8`):**

1. `TRANSPORT_DEFAULTS` names `gpt-6-sol` at `xhigh` for `codex-cli-exec`
   (the Claude row, `claude-opus-5-5` at `xhigh`, already matches the
   direction). `writing-worker-probe.mjs` names `claude-fable-5` at
   `xhigh` and `gpt-6-sol` at `xhigh`; `authority-probe.mjs` names
   `claude-fable-5` and `gpt-6-sol`; `subagent-probe.mjs` names
   `claude-fable-5` twice.
2. AI-HARNESS-SECURITY says Codex defaults to `gpt-6-sol` at `xhigh`
   (WO-100); product 07's live-episode sentence and eight queued orders
   said the same until this pass edited them to the direction. The
   compiled defaults are this order's.
3. Claude Code's Agent tool takes a `model` and no effort (the tool
   schema in Claude Code 2.1.285), and `CLAUDE_EFFORT` is process-wide
   (AI-HARNESS-SECURITY), so a spawned Claude agent runs at the root
   session's selected effort. Whether Codex `spawn_agent` takes a model
   or an effort is unrecorded in this repository.

**Design (scope discipline):** change the six defaults and the fixtures
that assert them; leave `entropy-reducer@1`'s compiled requirement as it
is (Claude `claude-opus-5-5` at `xhigh`, which the direction matches);
run one bounded Codex session that calls `spawn_agent` with and without
a model and effort and records the accepted parameters, or their absence,
and the worker's own readback; write the result and the defaults into the
two documents in place. The attestation mechanism is unchanged: a
launched route records the command line, a background route records a
session attestation, and effective readback stays unknown.

**Deliverables:** the six defaults and their fixtures; the `spawn_agent`
record; the two document edits; the decisions.

**Acceptance criteria (all required)**

1. `npm run entropy -- review --transport codex-cli-exec` without
   `--model` or `--effort`, driven through the fake transport fixture,
   records `gpt-6.1-sol` and `max` in its attestation; the
   `claude-cli-print` route records `claude-opus-5-5` and `xhigh`
   unchanged; the fixture in `scripts/test-entropy-review.mjs` asserts
   both and fails against `b51a58a8`.
2. The three probes' default selections are `claude-opus-5-5` at `xhigh`
   and `gpt-6.1-sol` at `max`; their fixtures pass; the rebind hint
   `scripts/test-resident-bind.mjs` asserts names the new Codex model.
3. One bounded Codex session records, in
   `docs/evidence/WO-177/spawn-agent.md`, whether `spawn_agent` accepts a
   model and an effort, with the parameters tried and the spawned
   worker's own readback or the refusal text; AI-HARNESS-SECURITY carries
   the result within 600 bytes, in place. If no Codex session is
   available to the executor, the record says so and names the pending
   observation; this criterion is then met with that record.
4. Write-backs: the AI-HARNESS-SECURITY Entropy Reducer launch paragraph
   and the reducer README name the new defaults in place;
   `docs/evidence/WO-177/decisions.md`; the decisions index.
5. `npm test -- --review` and `npm run test:docs` green; `git diff
   --check` clean; no new dependency.

**Evidence gate:** `npm test -- --review` before `implementation-ready`,
because the six files are declared sources of machinery suites; no
edition re-mint; no live feedback episode (none of the files is a judged
feedback source).

**Write-back duty:** the two documents, in place; the order's decisions
with sources and reopening conditions.

**Non-goals:** the role sessions' own `Model:` and `Effort:` lines (the
operator selects those at dispatch); historical attestations; the
compiled `entropy-reducer@1` requirement; role text (product 07 carries
the rule from this pass; WO-179 carries the sentences it owns); any
change to how effort reaches a spawned Claude agent (the host exposes
none).

**Operator-review assumptions**

1. `max` is an accepted Codex effort for `gpt-6.1-sol` on the operator's
   host, as the 0.154.0 probes recorded for the effort and WO-086's
   readback for the model; the executor's first launch is the check.
2. A spawned Claude agent's effort follows the root session's selection;
   a root that spawns at `xhigh` satisfies the direction, and a root at
   another effort records that its workers ran there.
