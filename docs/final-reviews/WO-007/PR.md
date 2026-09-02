## What this merges

WO-007, the `v0.3.0` minor work order: bootstrap steps 1–3 of the audit map
against the walking skeleton's real event log, plus the operator-authorized
documentation expansions reviewed in the same subject.

- **AuditRecord schema version 1** (`packages/skeleton/src/audit.ts`): a
  discriminated reference envelope over the canonical event log for seven
  action classes — work-order dispatch, authority decision, external effect,
  result, verification, recovery, and `NoOp`. Every record carries a non-empty
  set of canonical event ids, numeric log time, actor, workstream, optional
  episode/correlation/causation, and class-specific references (WorkOrder,
  command, authority envelope, subject). Payloads, candidate paths, and
  WorkOrder bodies never enter a record; a denied intent keeps its refusal and
  envelope references and receives no invented command id; data the fixture
  never collected (ingest time, policy, runtime, integrity, redaction) is
  declared unknown rather than filled in.
- **Consequential-action enumeration** with the operator question and the
  verifier question each class answers, pinned as data and mirrored in
  `docs/product/09-audit-resilience-privacy.md`.
- **Three pure, rebuildable folds** over one JSONL log: an L0 receipt
  (outcome, scope, time, actor, evidence links), an L1 causal timeline
  (explicit causation first, canonical append order as the stable fallback,
  correlation as an append-stable group that never asserts causation, cycles
  refused), and L4 governed raw JSON (every retained envelope, restricted
  intent, enforcement declared deferred). Each lossy view names its omissions
  and links one projection deeper. A consequential source event missing a
  class-required reference refuses projection instead of producing a
  placeholder.
- **CLI:** `npm run skeleton -- --audit` prints all three projections before
  the unchanged final receipt; without the flag the output is byte-identical
  to `v0.2.3`. Zero new dependencies; `packages/kernel/` untouched.
- **Docs and lineage:** 09 pins the envelope, the class tables, and the
  projection semantics; the ledger records the two adopted audit ideas; the
  skeleton README documents the flag.
- **Reviewed documentation expansions** (each with its receipt in the work
  order): the planning batch WO-016 through WO-023 and revised WO-109, with
  recorded direct-draft provenance for WO-016 through WO-022 and a refreshed
  work-order map; the `προτείνω` first-party application thesis
  (`docs/product/11-proteino.md`) with bounded cross-links and the standing
  shape-first synthesis rule; Clean Room modelled as an active mechanic whose
  employer/secret floor is locked (`CLAUDE.md`, 03, 04, 05, 07); the
  operator-supplied root `README.md` with its recorded truthfulness
  corrections; and refreshed publication locks with two appended staleness
  recaptures.

## Evidence

Re-established first-hand at final review, not inherited:

- `npm run format:check` clean; `tsc -b --force` clean; `node --test` over
  kernel and skeleton 77/77; `npm run publication:check` 149/149 headings
  indexed, both edition locks `CURRENT`; `git diff --check` clean. The six
  shell suites pass from a scratch mirror whose only change is the hardcoded
  `/private/tmp` fixture root (two lines per suite, helpers proved
  byte-identical); the unmodified `npm test` cannot run inside a sandbox that
  denies `/private/tmp`, the WO-013 condition every prior report disclosed.
- `npm run skeleton` ends `verified=true candidates=1`;
  `npm run skeleton -- --audit` renders the L0 receipt (10 entries), the
  causal timeline (10 entries), and governed raw JSON (21 envelopes); two
  separate invocations are byte-identical; nothing printed before the
  projections differs from the default form; no `payload` key appears outside
  governed raw. Step 9's `repo.delete` refusal is visible in the receipt and
  the timeline with `auth_seiri`, `effect denied`, and its three canonical
  evidence events.
- Mutation drill in a scratch mirror: nine of thirteen single-point mutations
  of the fold each fail a named test (AC2, AC3, AC4, the causal-ordering,
  association, and scope tests); the four survivors are documented test
  thinness (below).
- Control-plane integrity: every blob in the verification checkpoint matches
  the working tree apart from the control files; the audit source, tests, and
  CLI carry identical blob hashes from the VER-001 allocation through final
  review; the control log is a strict append over `HEAD` and an independent
  fold reproduces `docs/control/current.md` byte for byte.
- Clean-room sweep over all changed and new files: no employer, credential,
  internal-service, or product-name material; the predecessor is named only
  generically; raw intake stays single-copy in the main checkout and out of
  Git.

## Verification trail

- `docs/verifications/WO-007/VER-001.md` — fail. The audit implementation
  passed all five criteria; six findings in the operator-added planning and
  provenance scope (intake overlap without recorded provenance, intake not
  single-copy, a WO-023 self-contradiction, WO-109's dependency/preflight mix,
  a missing v3 beacon size gate in WO-022, WO-018's dependency classification).
- Repair under `resume: fix`, documentation only; the audit deliverable was
  byte-frozen throughout.
- `docs/verifications/WO-007/VER-002.md` — pass. All six findings repaired,
  five corroborated by independent measurement; one Minor finding (a redundant
  replay assertion and an overstated README sentence) and five non-blocking
  observations.
- `docs/final-reviews/WO-007/FINAL-001.md` — pass; two bounded wording
  corrections applied (the work-order map's lifecycle projection and the
  skeleton README's replay sentence), disclosed with diffs against the review
  checkpoint; one minor test-adequacy finding carried; method, instruments,
  and harness deviation disclosed.

## Known open items

- **Operator check at PR review:** the root `README.md` was filed under
  direct-draft authority and no artifact of the supplied draft exists, so only
  the operator can confirm its fidelity; the work-order receipt lists the two
  deliberate normalisations and the truthfulness corrections that were
  applied.
- **Before `resume: release close`:** move the main checkout's globally
  ignored, non-disposable `.claude/settings.local.json` out of the repository;
  the release-close gate refuses it by name before anything else. This
  worktree holds no such file.
- **Test thinness, carried (FINAL-001 F-3):** the verification verdict's
  `failed`/`unknown` mapping, the partial `NoOp`-evidence refusal, the
  non-finite `occurredAt` refusal, and the `schemaVersion` refusal are
  implemented and documented but unbound by tests; four one-line assertions
  close them. Candidates for WO-016 (which owns the negative scenario outcome)
  and WO-108.
- **Hardening candidate (FINAL-001 F-5):** the timeline's append-stable sort
  breaks ordinal ties with `localeCompare()` and no explicit locale;
  deterministic today, worth a code-unit comparison when `audit.ts` is next
  open.
- **Replay leg:** the AC5 test's replay assertion is vacuous because
  `replayScenario` returns its input log unchanged; the re-encoded and
  independently re-run legs carry the property. WO-016 restores a real replay
  leg when the kernel's `replay()` drives the scenario.
- Automated CLI output coverage for the default and `--audit` forms is still
  absent (parked to WO-016); the CLI banner still prints the `v0.2.0` package
  version until release close assigns `v0.3.0`.
- After merge, the separately authorized `resume: release close` runs
  `npm run release -- close WO-007 --publish` from the main checkout, reruns
  all merged evidence, and may cut annotated `v0.3.0`. This PR performs no
  release action.
