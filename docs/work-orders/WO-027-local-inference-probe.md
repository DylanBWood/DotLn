# WO-027 — Local inference probe: runner inventory, pinned artifact, no-egress evidence, and the calibration decision, v0.3.3

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** `v0.3.3`, the honest no-release path strictly below
the latest published `v0.3.4` tag. Discovery evidence only; no exported runtime
capability and no change under `packages/` or `scripts/`. Activation on
2026-09-03 accidentally retained the planner placeholder in this heading and
paragraph. The executor forward-corrected that preflight miss under explicit
operator authority without replaying or editing the append-only activation
event. Closeout remains subject to independent verification, final review,
operator merge, and the separately authorized release-close transition.
**Nomination provenance:** the ledger's 2026-09-02 entry "Local inference is a
first-class runtime target behind capability truth" and 06-roadmap.md
§Counterfactual profiling work orders, which instructed the next planning pass
to run or nominate the smallest bounded runner and no-egress capability probe.
The 2026-09-03 planning pass ran only a read-only existence check and
nominated this order; the operator's planning messages are preserved locally as
a compaction-safety capture
(`docs/intake/notes/WO-027-WO-028-primitives-and-data-planning-2026-09-03.md`).
Planner-synthesized draft; opaque identifier, not a priority. The clean-room
screen found no employer, credential, internal-service, or other stop
condition.
**Depends on:** `main` at or after `v0.3.4`. Nothing else. Independent of the
release ladder and of WO-008 and WO-009; it never gates a rung. WO-001 and
WO-004 supply the discovery format and classification labels.

**Cites (read these sections):** 06-roadmap.md §Efficiency as a separate
capability axis (E0–E5; `EfficiencyObservation`) and §Counterfactual profiling
work orders (the local-inference calibration paragraph, the hybrid local-first
cell, the typed and ablatable intervention point); 03-architecture.md §The
agentic communication core, "Model input boundary" (`ModelInputPlan`;
deterministic local processor, local model, provider-hosted remote model);
05-pattern-library.md §Candidate — Beware of Naive Interventionism and
§Candidate — Do Nothing, active and support; 09-audit-resilience-privacy.md
§Bootstrap sequence and §Candidate — model-input exposure plans;
docs/lineage/idea-ledger.md §WO-019 execution-window ideation ("Local
inference is a first-class runtime target", "Repeated story generation becomes
controlled loadout calibration", "A hybrid local-first model route",
"Model-input exposure is inspectable and adjustable before invocation");
`docs/work-orders/WO-001-environment-truth.md` and
`docs/work-orders/WO-004-environment-truth-addendum.md` (authority model,
timebox, labels); `docs/discovery/environment.md` §Corrections and known gaps
and `docs/discovery/environment.json` (`labels`); 01-principles.md Principles
8 and 15.

**Objective:** Establish, with epistemic labels, whether this machine can run
one pinned small model through an installed runner, non-interactively, with
evidence about network egress, determinism, and cost per generation — enough to
decide whether the local-inference calibration order the roadmap describes
(baseline, role-only, mechanics-only, and role-plus-mechanics cells over one
pinned story prompt) is worth filing now, later under a named condition, or not
at all. Unknown is an acceptable result; every claim carries a label. Timebox:
about 90 minutes of session time excluding any model-artifact download.

**Planner's read-only findings at nomination (dated 2026-09-03; re-observe,
never inherit):**

- LM Studio is installed (`/Applications/LM Studio.app`, bundle version
  `0.4.13+1`; the `lms` CLI in the user-local LM Studio bin directory, CLI
  commit `0b2a176`); its models directory holds artifacts from three public
  publishers. Ollama, `llama-cli`, `llama-server`, `llama-bench`, `mlx_lm`, and
  the `llama_cpp` Python module were absent from `PATH` and from `python3`.
  Homebrew is present.
- Hardware, coarse: Apple M3 Max with 48 GB of unified memory. Point releases
  are withheld, following the `environment.md` precedent.
- **`lms ls`, `lms ps`, and `lms status` are not read-only.** The planner ran
  them expecting an inventory. The CLI printed "Waking up LM Studio service…",
  launched the desktop app, and timed out ("Timed out waiting for LM Studio
  daemon to start") while the operator watched the app open and crash;
  `lms status` afterwards reported the server OFF. This order treats every
  `lms` invocation as a process launch and records that crash as its first
  observation instead of repeating it blind.

**Authority:** read-only inspection plus writes under `docs/discovery/`, this
order's own scratch root outside the repository, and the exact roadmap,
environment, documentation-map, ledger, planning-map, and work-order write-back
surfaces named below. The operator confirmed this explicit write-back list as
authority on 2026-09-03 while correcting the activation preflight miss. Exactly
one runner launch per runner shape and one bounded smoke generation per launched
runner, performed only with the operator present because the runner may open a
desktop window. A
model-artifact download is permitted only when the operator authorizes the
exact artifact (publisher, file, quantization, byte size, digest) before the
fetch; record that authorization in the discovery doc. No package installation
into this repository; no runner installation or upgrade; no config mutation; no
secret values (variable and settings key names only); no benchmark loops beyond
the declared samples; no rate or thermal stress.

**Checklist (each item gets exactly one classification from
`environment.json` `labels`: observed, documented locally, documented
officially, untested, blocked, not found, ambiguous):**

1. **Runner inventory.** For LM Studio, Ollama, llama.cpp, and MLX: installed
   or not found; version; CLI versus GUI; whether a headless or server mode
   exists; which commands launch a process; the crash-on-wake observation
   reproduced or corrected with the runner's own log excerpt (a path only when
   it discloses no private identifier).
2. **Hardware and thermal envelope, coarse.** Chip family, unified memory, and
   core count as the runner reports them; nothing finer than `environment.md`
   already publishes.
3. **Pinned artifact.** One small instruction-tuned model already on disk if
   one exists, otherwise one operator-authorized download: publisher, file
   name, quantization, parameter count, byte size, SHA-256 digest, license
   name; the runner's prompt template; decoding parameters (temperature,
   top-p, seed); context length; stop rules.
4. **Bounded launch shape.** The exact non-interactive command that loads the
   model, sends one fixed prompt, and returns the completion (structured or
   JSON output where the runner exposes it), with observed load time,
   first-token latency, and tokens per second as labeled samples with their
   `n`, never as a benchmark claim.
5. **Determinism.** With a fixed seed and greedy or temperature-zero decoding,
   run the same prompt at least three times and report whether the outputs
   are byte-identical; label the seed policy the runner actually honors.
6. **No-egress evidence.** Run the generation under an outer boundary that
   denies network by construction (the sandboxed Claude Code Bash boundary is
   one; a macOS-level block is another) and record the boundary used, the
   runner's offline and telemetry settings as documented and as observed, a
   process-level socket snapshot taken during generation, and the boundary's
   own denial report if any connection was attempted. State the limit of the
   claim: what was proven not to happen, what was merely not observed, and
   what the GUI may do when the boundary is absent. Per the ledger, a local
   model is not assumed private.
7. **Capability row proposal.** Draft the `runtime.local-inference` row
   (maturity level with its evidence, efficiency level E0 or E1, baseline
   reference, next experiment) as a proposal inside the discovery doc. Do not
   edit `docs/planning/capability-table.md`; it is pinned to a revision and
   refreshes as its own reviewed act.
8. **Decision packet.** Exactly one of: file the calibration order now (naming
   the pinned artifact, runner, launch shape, the evaluators the order must
   predeclare, and the estimated cost of 100 runs); defer under a named
   condition (for example, a headless runner is installed, or determinism
   holds); or do nothing, with the reason, the evidence, the reevaluation
   cadence, and the condition that would make the calibration worthwhile (the
   Do Nothing shape in 05). The packet is a recommendation to the planner,
   never activation authority.

**Deliverables:** `docs/discovery/local-inference.md` (human-readable, with the
command log and every classification); `docs/discovery/local-inference.json`
(schema-versioned; the same `labels` vocabulary; `observedAt`; `workOrder`; the
pinned-artifact record; the egress-evidence record; the decision packet); the
write-backs below. Model artifacts, runner logs, and smoke outputs live outside
the repository or under an ignored scratch root and are named by path class
only.

**Acceptance criteria (all required)**

1. Every checklist item carries exactly one classification and either the
   command with its output excerpt or the blocking reason; no row rests on
   ambient knowledge or a vendor page without the `documented officially`
   label and a citation.
2. At least one runner shape is either observed end to end with the pinned
   artifact (items 3 through 5 all `observed`) or recorded `blocked` with the
   reproduced failure and the runner's own diagnostic; the crash-on-wake
   observation is reproduced or corrected with evidence either way.
3. The no-egress record names the boundary, the method, the observed sockets,
   and the limit of the claim; it never states "private" or "offline" as a
   property of the model or the runner beyond the narrower claim the evidence
   supports.
4. `git status --porcelain` before and after the probe differ only by files
   under `docs/discovery/`; nothing under `packages/`, `scripts/`, `.claude/`,
   or `package.json` changes; no dependency is added; the ignored scratch root
   and any downloaded artifact are listed by path class in the result.
5. The decision packet names exactly one of the three dispositions, and that
   disposition carries its reason, evidence references, reevaluation cadence,
   and reversal condition.
6. The proposed capability row is present in the discovery doc and the pinned
   capability table is byte-identical to `main`.
7. `npm test` green with unchanged code; `git diff --check` clean; the
   discovery JSON parses and its `labels` equal those in `environment.json`.

**Evidence gate:** the command log with classifications; the smoke
transcripts; the determinism triple; the egress record with its socket
snapshot; the before-and-after tracked-status pair; the decision packet.

**Write-back duty:** 06-roadmap.md §Counterfactual profiling work orders (the
dated discharge note gains the probe's outcome and the calibration
disposition); `docs/discovery/environment.md` §Corrections and known gaps
(pointer to the new doc); `docs/README.md` map line for `docs/discovery/`;
ledger entry (adopted: local inference probed as capability truth, and the
calibration disposition; preserved: the hybrid local-first cell until a
calibration order exists); `docs/planning/work-order-map.md` row and
disposition.

**Non-goals:** the calibration experiment itself; a `WorkOrderTransport`
adapter or model-slot lowering for a local runner (WO-009 territory, later);
`ModelInputPlan` or any exposure-preview implementation; installing or
upgrading a runner; a benchmark suite; a privacy or "no telemetry" claim about
any vendor beyond what was observed; editing the pinned capability table;
adding a roadmap rung.

**Operator-review assumptions**

1. LM Studio is the first runner shape because it is the only one installed;
   Ollama, llama.cpp, and MLX are recorded absent, not evaluated, and this
   order installs none of them.
2. Any model-artifact download is authorized per artifact by the operator
   before the fetch and pinned by digest; an artifact already on disk is
   preferred.
3. The operator is present for the launch step because the runner may open a
   desktop window and, as observed on 2026-09-03, may crash.
4. The close takes the honest no-release path.
