# WO-159 — Codex episode isolation: every DotLn-launched Codex worker, verifier and probe goes through one launcher that supplies a per-episode home seeded only with what authentication needs, the operator's user-level Codex configuration is byte-identical before and after each launch with the digests as protected receipt surfaces, and the WO-054 claim that continuation changes no user configuration is corrected

**Model:** the actual local Codex harness for the live rows; any capable
model for the code. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. The worker transport's launch
environment and argv construction change, six probe and smoke scripts
adopt the launcher, and episode records gain two digest pairs. Assigned
at activation under the standing opt-out default.
**Cost:** adds one Codex launcher in `packages/skeleton/src/worker-transport.ts`
used by the transport and by `scripts/lib/authority-probe.mjs`,
`scripts/lib/writing-worker-probe.mjs`, `scripts/harness-probe.mjs`,
`scripts/probe-worker-hosts.mjs`, `scripts/target-worker-smoke.mjs` and
`scripts/probes/local-model-role-qualification.mjs`; a per-episode
`CODEX_HOME` under system temp (0o700) seeded with the authentication file
(0o600, removed at episode end, never in evidence); before/after SHA-256
of the user-level Codex configuration file and of its trust table in the
episode record and in live receipts' protected surfaces; one fixture; one
live Codex worker row; one dated correction note beside
`docs/evidence/WO-054/codex-continuation.md`. Removes: the outside-portfolio
write that failed WO-111 criterion 2 in VER-001, VER-002 and VER-003 and
ended in an operator-accepted deviation (D020); the block on any WO-111
rerun and on any live Codex proof against an operator-owned repository
(D011, FUP-3c34a8ffbf61376f, high, undisposed since 2026-09-24); six
argv copies outside the canonical transport (REVIEW-003 ER3-001); and the
36 of 43 trusted project entries the diagnosis attributes to DotLn scratch
and probe families, which stop accumulating. Registered sources edited:
`packages/skeleton/src/worker-transport.ts` (authority and verification
editions re-mint deterministically); it is also a feedback source
(`FEEDBACK_SOURCE_PATHS`), so the feedback edition re-mints with one live
feedback self-host episode after the source edits settle (WO-147 D010;
WO-154 D001). Wall-clock, tokens and context bytes of the order itself are
unknown until run; WO-147 D010 measured a self-host episode at 320.6 s.
**Nomination provenance:** WO-111 D011 (the boarded runtime defect and its
follow-up), D016 (the caller-side isolated home, declined because an empty
home is unauthenticated), D020 (the accepted deviation); VER-001 B1;
REVIEW-003 finding ER3-001 (major, measured, survived REFUTATION-004) and
its packet `isolated-codex-launch-home`; the operator's 2026-09-25
dispatch. Planner-synthesized. Opaque identifier, not a priority.
Clean-room screen: the operator's configuration is described by digest,
never copied.
**Depends on:** WO-111 merged (the evidence; closed, v0.47.1); WO-157
merged (typed refusal reasons in the worker record; closed, v0.45.0).
**Recommended placement:** paired with WO-158 at the head of the sequence;
it must close before WO-066, WO-112 and WO-118, the first orders that push
a worker's head or run a resident against a repository the operator owns.
This order edits the transport and the six launch sites; WO-158 edits the
control plane, the classifier, the hook generator and the role texts.
Disjoint files; neither depends on the other; both re-mint editions and
this one alone pays the live episode. A recommendation, not a dependency
token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-111",
    "relation": "satisfied-by-close",
    "reason": "the evidence and the boarded defect"
  },
  {
    "workOrderId": "WO-157",
    "relation": "satisfied-by-close",
    "reason": "typed refusal reasons in the worker record"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):**
`packages/skeleton/src/worker-transport.ts` lines 88–106 (`spawn` with
`process.env`) and 512–552 (`codex -a never exec --ephemeral
--ignore-user-config --sandbox workspace-write ...`, no `CODEX_HOME`);
`scripts/lib/authority-probe.mjs` line 66 (the environment filter keeps
everything but `GIT_*`) and 509; the other five launch sites named in
ER3-001; `docs/instance/entropy-reducer/runs/REVIEW-003.md` (ER3-001 and
the packet) and `REFUTATION-004.md`; `docs/evidence/WO-111/codex-trust-diagnosis.md`;
`docs/verifications/WO-111/VER-001.md` lines 188–237;
`docs/evidence/WO-111/decisions.md` D011, D016, D020;
`docs/evidence/WO-054/codex-continuation.md` lines 116–117; product 07
§Independent workflows and integration (the live-row rules).

**Objective:** a DotLn-launched Codex episode leaves the operator's
user-level Codex configuration byte-identical, the receipt proves it, and
there is one launch site to prove it at.

**Observed gap (dated 2026-09-24 and 2026-09-25):**

- Each live Codex worker or verifier launch during WO-111 wrote
  `trust_level = "trusted"` entries for the scratch targets into the
  user-level configuration (VER-001 B1, carried to VER-003). The transport
  spawns with the inherited environment and no isolated `CODEX_HOME`;
  `--ignore-user-config` governs reading, not the trust write. Attribution
  to the CLI is an inference from keys, timing and arguments (VER-001).
- Census on 2026-09-24: 43 trusted entries, 36 in DotLn scratch and probe
  families, 34 of them for paths that no longer exist.
- Seven files build a Codex argv; six copy `--ephemeral
  --ignore-user-config` outside the transport; none mentions `CODEX_HOME`
  (ER3-001, reproduced by the refuter).
- D016's caller-side isolated home was declined because an empty home has
  no credentials. WO-111's criterion 6 forbade the runtime fix, so the
  defect ended as an operator-accepted deviation with the receipts still
  reading `criterion2: unmet`.

**Design (scope discipline):**

- One launcher builds every Codex argv and environment. Per episode it
  creates `CODEX_HOME` under system temp (0o700), places only the
  authentication file (copied, 0o600, or a symlink if the CLI honours
  one), launches, and removes the directory at episode end; the episode
  record names the home by digest, never by content. The executor first
  confirms with `codex login status` under an isolated home what the CLI
  needs to authenticate and copies the minimum; if authentication cannot
  be isolated without secrets reaching evidence, the order stops there and
  records the finding (D016's reopening condition).
- Before and after each launch the launcher digests the user-level
  configuration file and, separately, its `[projects]` trust table, and
  records both pairs in the episode record; the runtime's live receipts
  carry them among their protected surfaces and a receipt whose pairs
  differ fails its check. Whether the CLI still writes a trust entry into
  the isolated home is observed and recorded, not assumed.
- The six probe and smoke scripts call the launcher; their rows record the
  digests.
- The stale entries already in the operator's configuration are the
  operator's to remove; the order records the census only if the operator
  does so.
- **Declined alternatives, recorded:** patching the configuration after
  the fact (a write is still a write); `-c` trust overrides (do not stop
  the write); reading the user configuration as a protected surface
  without isolation (detects, does not prevent, which is VER-001's state).

**Deliverables:** the launcher; the six adoptions; the digest pairs and
receipt check; the fixture; the live row; the WO-054 note; decisions.

**Acceptance criteria (all required)**

1. Fixture: a fake `codex` that writes a trust entry to
   `$CODEX_HOME/config.toml` leaves the fixture's user-level file
   byte-identical; the episode record carries equal before/after digest
   pairs; the isolated home is gone after the episode; the copied
   authentication file appears in no record, store or log.
2. `git grep -l -e '"--ephemeral"'` over `packages/*/src`, `scripts` and
   `scripts/probes` returns only the launcher's file; the six former sites
   call it.
3. Live row: one Codex worker episode through the transport on the
   operator's host, `codex login status` succeeding under the isolated
   home, the user-level configuration digests equal before and after,
   recorded in `docs/evidence/WO-159/` with the launch claim.
4. The live receipts' protected-surface list includes the two digest
   pairs; a fixture receipt with unequal pairs fails the receipt check.
5. `docs/evidence/WO-054/codex-continuation.md` gains a dated correction
   note appended below its existing bytes, and the WO-054 capability row
   is reassessed.
6. The authority and verification editions re-mint deterministically; the
   feedback edition re-mints with one live self-host episode after every
   source edit has settled; `docs/evidence/current.json` selects them.
7. `npm test` and `npm run test:docs` green; `git diff --check` clean; no
   new dependency.

**Evidence gate:** the fixture transcript; the live row with its digests;
the feedback self-host episode; `npm test` at final review.

**Write-back duty:** decisions; the WO-054 note and row; product 03's
candidate on progressive absence authority gains one sentence that the
containment precondition is met; at close, FUP-3c34a8ffbf61376f and its
duplicate rows retargeted through the adjacent queue.

**Non-goals:** Claude Code or Copilot worker isolation (no observed
write); removing the operator's existing trust entries; a WO-111 rerun
(unblocked by this order, not performed by it); the Entropy Reducer's
delegate route (WO-165).

**Operator-review assumptions**

1. Copying the authentication file into a 0o700 temporary home for the
   episode's duration is acceptable; a symlink is preferred if the CLI
   honours it.
2. The operator removes the stale trust entries themselves.
