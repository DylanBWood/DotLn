# WO-161 — Sandbox vocabulary made true: the cold-start text stops describing a host sandbox and an approval path that are off in all three CLIs, the operator's posture is recorded as a decision, and the host-confinement detector is named for what it does

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. Two loadout sentences, one residue
clause and three envelope labels change in the generators; the bundle and
skills regenerate; the playbook, the security note, the docs index and an
ADR amendment change; no runtime behavior changes. Assigned at activation
under the standing opt-out default.
**Cost:** adds one ADR amendment recording the operator's posture, one
dated docs-index entry, a rename of the detector module and its exported
names, and assertion updates in `scripts/test-process-debt.mjs`. Removes,
measured on 2026-09-25 (planning document §6): the misleading half of the
149-byte Codex residue line every role reads every session
(`CLAUDE.md` line 70: "native sandbox and approval remain host controls",
when `approval_policy = "never"` and `sandbox_mode = "danger-full-access"`
are the operator's Codex settings); the reviewer's and verifier's
"one-invocation outside-sandbox approval in Codex" sentence (no approval
path exists under full access) and "run the product gate outside the
harness sandbox from the start" (six `SKILL.md` files; 1,809 bytes of
sandbox lines in a reviewer or verifier cold start, 1,349 in an
executor's); the playbook's "Keep untrusted execution inside the enabled
shell sandbox" (lines 93–95), false for the current posture; and three
ADRs that still say "keep `sandbox.enabled: true`". Registered sources
edited: `packages/skeleton/src/loadouts/contributor.ts`,
`packages/compiler/src/harness.ts`; the harness and authority editions
re-mint deterministically; no feedback source changes, so no live episode.
Wall-clock, tokens and context bytes of the order itself are unknown until
run.
**Nomination provenance:** the operator's 2026-09-25 dispatch ("idk why i
keep seeing sandbox nonsense. NOTHING IS RUNNING IN SANDBOX MODE CLAUDE,
COPILOT, NOR CODEX"), captured verbatim in ignored intake (SHA-256 in the
ledger section), and the audit in the planning document §6 (3,853 tracked
lines in 850 files carry the word; six senses; the cold-start and
operator-facing sentences that are wrong for the host). Planner-synthesized.
Opaque identifier, not a priority. Clean-room screen: the operator's
settings are described by posture, never copied.
**Depends on:** WO-155 merged (the single-source floor emission this order
edits beside; closed, v0.46.0); WO-140 merged (the detector; closed).
**Recommended placement:** paired with WO-160 directly after WO-158 and
WO-159. This order edits the generators, generated skills and bundle, the
playbook, the security note, `docs/README.md`, one ADR, `README.md` and
`scripts/test-process-debt.mjs`; WO-160 edits `scripts/lib` helpers, the
document runner and their fixtures. Disjoint files; neither depends on the
other; only this order re-mints. It must not run beside WO-158, which edits
the same generators. A recommendation, not a dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-155",
    "relation": "satisfied-by-close",
    "reason": "the single-source floor emission this order edits beside"
  },
  {
    "workOrderId": "WO-140",
    "relation": "satisfied-by-close",
    "reason": "the host-confinement detector this order renames"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):**
`docs/planning/off-ramps-5s-entropy-2026-09-25.md` §6 (the audit table:
file, quoted text, sense, accuracy, cold-start surface, generator);
`packages/compiler/src/harness.ts` line 745 (the residue clause);
`packages/skeleton/src/loadouts/contributor.ts` lines 69, 81, 217, 349,
382; `scripts/lib/gate-sandbox.mjs` (a fail-open detector of a host OS
sandbox that returns `inForce: false` on this host); `docs/AI-HARNESS-SECURITY.md`
lines 50–52 (the current posture, already accurate) and line 743 (the
`workspace-write` scoping the skills lack); `docs/PLAYBOOK.md` lines 93–95
and 109–124; `docs/decisions/0003-*.md` lines 44–47, ADR-0004, ADR-0005;
07-execution-guide.md lines 265–271 and the "Gate sandbox preflight"
heading; `README.md` lines 245–248; `packages/skeleton/src/worker-transport.ts`
lines 436 and 522 (`--sandbox workspace-write` for spawned Codex workers,
which is accurate and stays).

**Objective:** a reader of any cold-start surface, the playbook or an ADR
finds only true statements about confinement on the operator's host: the
three CLIs run without a host sandbox; DotLn's refusals and the host
permission mode are the boundary; DotLn's own Seatbelt for discovery and
the `--sandbox workspace-write` it passes to spawned Codex workers are
named as what they are.

**Observed gap (dated 2026-09-25, `main` at `fa9957f1`):**

- Host posture: Claude Code's Bash sandbox is off in this checkout (the
  ignored project-local settings override the user default); Codex runs
  `approval_policy = "never"`, `sandbox_mode = "danger-full-access"`;
  Copilot's configuration has no sandbox key and the security note records
  it off by default. `docs/AI-HARNESS-SECURITY.md` lines 50–52 already say
  so; no ADR does.
- `CLAUDE.md` line 70 (generator `harness.ts` line 745) tells every role
  every session that "native sandbox and approval remain host controls";
  neither is on. `contributor.ts` line 69 emits a Codex approval rule that
  has no path under full access; line 81 tells the reviewer and verifier
  to run the gate "outside the harness sandbox from the start"; both reach
  six `SKILL.md` files.
- `scripts/lib/gate-sandbox.mjs` is not a sandbox: it probes whether the
  host confines the process and fails open. The name has misled two
  reviews (WO-068, WO-100) and this pass's own brief.
- The `contributor.sandboxed` envelope label, its "Sandbox and human
  approval boundaries remain in force" constraint and the "Sandboxed
  contributor authority" title describe a boundary the host does not
  supply; 124 historical `authority.json` files carry the old id and must
  keep it.

**Design (scope discipline):**

- Residue: keep "Pre-effect envelope checks unavailable in this harness";
  replace the second clause with "host permission settings decide", which
  `harness-host.ts` already says.
- Loadout sentences: delete or scope the Codex approval sentence to
  `workspace-write` + `on-request`, matching the security note; rewrite
  the gate sentence as "run the product gate with `npm test`; if the runner
  reports that the host confines the process, run the printed outside
  command; a confined partial result is never product-gate evidence".
- Detector: rename `gate-sandbox.mjs` → `host-confinement.mjs`,
  `detectGateSandbox` → `detectHostConfinement`, `--inside-sandbox` →
  `--confined-partial`, the fixture temp-root prefix, and the product 07
  heading; keep the recorded check-row identity strings (`needs`,
  `partial`, `excludedSuites` values) byte-identical unless the executor
  shows no recorded row or consumer reads them, recorded as a decision
  either way.
- Envelope labels: `contributor.sandboxed` → `contributor.bounded` for new
  compilations, with the constraint and title reworded; historical
  evidence keeps the old id; the `sandbox.disable` effect id stays (it
  names the `--dangerously-*` and `danger-full-access` command shapes).
- Hand-written surfaces: the playbook paragraph states the posture and
  points at the security note; `docs/README.md` gains a dated entry;
  ADR-0003 gains an amendment (ADR-0004 and ADR-0005 a cross-reference)
  recording "sandboxes off in all three CLIs; DotLn refusals plus the host
  permission mode are the boundary" with the date the operator selected it.
- Leave alone: the discovery Seatbelt (`sandbox-exec`, a real mechanism);
  the worker transport's `--sandbox workspace-write`; product-design and
  citation senses; every `docs/evidence`, verification, final-review and
  refutation record.
- **Declined alternatives, recorded:** editing generated files by hand
  (regenerate); rewriting historical authority records (immutable);
  changing the user-level Claude setting from this repository (outside the
  project; the operator's).

**Deliverables:** the generator edits; regenerated bundle and skills; the
detector rename; the hand-written corrections; the ADR amendment; the
assertion updates; decisions.

**Acceptance criteria (all required)**

1. `git grep -n -i sandbox -- CLAUDE.md .claude/skills .agents/skills`
   returns only lines that are true of the host: the worker-transport
   sense, the discovery Seatbelt, or a citation; the residue line carries
   no sandbox clause. The count of sandbox bytes per role cold start is
   recorded before and after.
2. The playbook, `README.md` lines 245–248, product 07 lines 265–271 and
   the ADRs state the posture recorded in `docs/AI-HARNESS-SECURITY.md`;
   the ADR amendment names the date and the operator's direction.
3. The detector and its flags are renamed; `npm test` still excludes or
   includes suites exactly as before on this host (`inForce: false`); a
   fixture with a simulated confined host produces the same partial-result
   rows as before, byte-identical in their identity fields.
4. New compilations carry `contributor.bounded`; every historical
   `authority.json` is byte-identical; the writer and process-debt tests
   assert the new label where they asserted the old.
5. `npm run harness -- check` green; cold-start bytes measured and any
   ceiling breach recorded under the standing route; the harness and
   authority editions re-mint deterministically.
6. `npm test` and `npm run test:docs` green; `git diff --check` clean.

**Evidence gate:** the grep transcript before and after; the fixture with
the simulated confined host; `npm test` at final review. No live row.

**Write-back duty:** decisions; the ADR amendment; the docs-index entry;
the product 07 heading rename with a dated note.

**Non-goals:** any change to the refusals or the host permission mode;
removing DotLn's discovery Seatbelt; the operator's user-level Claude
setting; historical evidence.

**Operator-review assumptions**

1. The posture "no host sandbox in any of the three CLIs" is the operator's
   standing decision and may be recorded in an ADR amendment without a
   fresh ideation capture beyond this pass's intake.
2. The detector stays (dormant, fail-open, cheap); only its name changes.
