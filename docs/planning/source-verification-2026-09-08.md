# Source verification of the 2026-09-08 external audit

**Planning artifact:** 2026-09-08, the critical-path planning pass on the
clean `main` checkout at `33e2c25` (the merged WO-039 source, `v0.15.0`
unpublished, latest local tag `v0.14.0`). It verifies every material claim of
the external source-level audit that the operator's `planning:` dispatch
appended, before any of it was incorporated. Method: read-only inspection of
the committed tree and control state; no runtime was executed to verify a
claim except where a line says so. The audit itself states that it did not
execute the repository; neither did this pass, apart from `npm test` at the
end, which is recorded in the plan.

Each claim carries one status: **verified** (the current source supports it
as stated), **partially verified** (supported with a material qualification),
**contradicted** (the current source says otherwise), **stale** (true of the
tree the audit read, no longer true), or **unverified** (not checkable from
the committed tree in this pass). "Where" names the exact location.
"Consequence" says what the plan does with it. Line numbers are those of
`33e2c25`.

The audit read `main` before the WO-039 merge. That one fact changes its
roadmap more than any other finding below.

## A. Repository state table

- **Kernel: pure events, reactors, cadence, authority guard, replay,
  continuations.** Verified. `packages/kernel/src/core.ts` (`evaluateCadence`
  72-131, `stepProgram` 147-234, `authorize` 328-545, `replay` 556-578,
  `serializeContinuation` 268-271), `store.ts`. Consequence: none; the kernel
  is not on the critical path except through the codecs brief.
- **Compiler: typed loadout graph, links, supports, claims, permissions, work
  orders, projections; contains a P0 authority-design flaw.** Verified. See
  §B1. Consequence: WO-042.
- **Skeleton: read-only workers, transports, worktrees, leases, recovery,
  verification fixtures, feedback host, plan refuter; becoming an integration
  god-package.** Verified as an inventory: `packages/skeleton/src` holds 46
  files (39 `.ts`, 7 `.mjs`) covering exactly the areas the audit lists;
  `reactor.ts` remains the single decider that WO-016's ownership guard
  enforces. "God-package" is the audit's judgment; the repository recorded
  the same growth risk with a reversal condition on 2026-09-06
  (`docs/planning/phase-two-plan-2026-09-06.md` §Code sweep: split the reactor
  in the next order that adds a host branch). Consequence: the
  source-changing worker brief carries that recorded condition.
- **Persistence: JSONL event state and a careful single-host worker store;
  validation must be strengthened.** Partially verified. The kernel store
  validates object shape and line framing only (`store.ts:7-33`); the worker
  store refuses torn appends and stale locks
  (`packages/skeleton/src/worker-store.ts:62-67, 69-106`); transport results
  are positively validated at the host boundary
  (`worker-protocol.ts:112-160`, `verification-protocol.ts` via
  `parseTransportResult`). The audit's "validation must be strengthened"
  holds for the store envelope and hook input, not for transport results.
  Consequence: the codecs brief is scoped to the unvalidated boundaries.
- **Console: read-only actor board in terminal, JSON and HTML.** Verified
  (WO-032 closed at `v0.14.0`; `packages/console/src`). Consequence: reference
  only; WO-042's render change regenerates its recorded expectations.
- **Work-order control plane better developed than the product runtime.**
  Verified by the record: 35 closed orders, 29 local release tags, and the
  phase-two plan's own count of roughly twenty machinery orders against six
  runtime rungs. Consequence: the plan's minority rule for machinery.
- **External work product: no general source-changing executor; no complete
  artifact-to-PR path.** Verified. The real transports launch Claude with
  `--tools ""` and `--safe-mode` and Codex with a read-only filesystem
  profile (`worker-transport.ts:179-253`); the execution environment's
  `writableSurfaces` is the empty tuple and a non-empty one refuses
  (`execution-environment.ts:30, 66`); `worker-host.ts:48` states the host
  admits only idempotent read-only inspection; the README's release block
  says "General source-writing workers and portable starter export remain
  later work". Consequence: the critical-path destination.
- **Browser verification: specified, no Playwright adapter in the product
  path.** Verified. No `.ts` or `.mjs` source mentions Playwright; the
  environment record observes it only through a connected MCP server and
  browser binaries (`docs/discovery/environment.md:47, 339-347`); the WO-032
  final review used that server by hand. Consequence: Gate F brief with an
  ADR-0002 dependency-note entry criterion.
- **Imperfect source intake: specified, no `SourceBundle → StoryContract`
  runtime.** Verified. The only occurrences of either name outside `docs/`
  are in a console fixture copy of the roadmap; the port is specified in
  `docs/product/03-architecture.md` §Ports. Consequence: Gate G brief.
- **The repository's 2026-09-06 audit reaches almost the same conclusion.**
  Verified (`phase-two-plan-2026-09-06.md:79-93`). Consequence: the plan
  cites it rather than re-arguing it.

## B. The five technical problems

### B1. Linked supports can widen their own authority (P0)

- **A support's claim picks its own layer, including `safety-invariants` and
  `hard-permissions`; nothing ties a layer to the authoring component's
  kind.** Verified. `packages/compiler/src/types.ts:19-30, 239-245, 279`;
  validation at `compile.ts:477-506` checks only layer existence, allow/deny
  values and wildcards.
- **The resolver sorts by precedence and takes the winner.** Verified.
  `compile.ts:383-396`.
- **`applyAuthorityClaims` implements an `allow` by removing the effect from
  the denied list and adding it to the allowed list, and the result becomes
  the compiled envelope.** Verified. `compile.ts:729-741`; consumed at
  `compile.ts:789-801` (WorkOrder operations) and `826-840` (envelope).
- **The malicious-support shape compiles.** Verified, and previously
  reproduced: WO-008 VER-001 finding F2 (2026-09-03) compiled a support
  allowing `repo.delete` at `safety-invariants` with `ok: true`
  (`docs/verifications/WO-008/VER-001.md:249-267`), and the planning map has
  carried it since as an unallocated candidate
  (`docs/planning/work-order-map.md:390-398`). The audit presents it as new;
  it is a known, recorded, unallocated defect.
- **Not named by the audit: a second widening path.** A linked support's
  `permission-guard` emission contributes `allowedEffects` and
  `allowedOperations` that are unioned with the base before claims apply
  (`compile.ts:789-801, 826-836`). Added to WO-042's floor.
- **"This becomes dangerous specifically because WO-039 proposes lowering
  compiled claims into real settings, hooks and permissions."** Stale in
  tense, verified in substance: WO-039 is merged, and `lowerToHarness`
  requires the emitted envelope to equal the compiled one
  (`harness.ts:235-239`) and emits it into the PreToolUse permission hook
  (`harness.ts:427-439`; installed at `.claude/hooks/permissions.mjs:35-61`).
  The widening path now reaches live permission decisions. The Contributor
  and plan-refuter loadouts author no claims (`contributor.ts:272`), so it is
  latent. Consequence: WO-042 is the first gate.
- **The tooltip can disagree with enforcement.** Verified. Inspection strings
  are authored and appended per support (`compile.ts:855-857`) and rendered
  verbatim (`render.ts:89-135`); VER-001 F2 reproduced the divergence.
  Consequence: WO-042's projected inspection, with the qualification that
  prose cannot be checked for contradiction mechanically; only effect-id
  tokens can.
- **The required invariant and the `AuthorityGrant` shape.** Recommendation,
  adopted in WO-042 with changes: an `allow` claim may restore a base
  allowance (not forbidden outright); `safety-invariants` stays legal for a
  support's `deny`; grants carry `repo` bound to the compilation environment
  rather than a free `Scope`; no `expiresOn` in v1.

### B2. Persisted continuations and events are not type-safe at runtime (P0)

- **`deserializeContinuation` is an unchecked cast.** Verified.
  `packages/kernel/src/core.ts:270-271`; the kernel's own test says so
  (`packages/kernel/test/ac6-authorization.test.ts:59`).
- **JSONL decoding verifies only that each line is a non-null object.**
  Verified. `store.ts:25-31` (plus final-newline and blank-line framing
  checks the audit does not mention).
- **"The entire DotLn thesis depends on" that deserializer.** Contradicted
  in the specific and verified in the general: no skeleton or script source
  calls `deserializeContinuation` (only kernel tests do); the skeleton host
  persists continuations inside event payloads that `decodeLog` admits with
  the same object-shape check, so the class of gap is real, the named
  function is not on the live path.
- **Values from files, model envelopes, hooks and CLI transports are
  `unknown` regardless of the declared type.** Partially verified: transport
  results are positively validated (`worker-protocol.ts:112-160`); hook input
  is a bare cast (`harness-host.ts:1764`); the store envelope is a cast
  (`store.ts:31`). Consequence: the codecs brief names the unvalidated
  boundaries the source-changing worker crosses and leaves the validated
  ones alone. Its severity is judged P1 here: no misdecode has been
  demonstrated, and the WO-105 crash-shape corpus draft exists to probe it.

### B3. The public program grammar is larger than the executable grammar (P1)

- Verified. `core.ts:139-146` exports `EVALUABLE_PROGRAM_KINDS` and
  `stepProgram` throws for the rest (`core.ts:231-233`). Partially
  qualified: the boundary is explicit as an exported constant and in the
  capability table's `program.evaluable-subset` row, but not in the type, and
  the WO-101 corpus pins the enumeration. Consequence: the type split is in
  the codecs brief.

### B4. Generic replay contains application-specific state assumptions (P1)

- **`replay` reads `rngState` and `policy` by literal key and defaults RNG to
  zero.** Verified. `core.ts:551-578`.
- **"Can silently alter replay semantics."** Contradicted as "silent": the
  domain model documents the contract explicitly ("the RNG seed must live at
  the state field `rngState` (any other name replays as `0`)",
  `docs/product/02-domain-model.md:18`). The coupling is a documented
  contract, not an accident; the generic-kernel objection stands.
  Consequence: an optional environment projector in the codecs brief with
  the default preserving today's contract byte-for-byte.

### B5. The control plane cannot reliably answer whether an order is blocked (P1)

- **The index says WO-039 is blocked on WO-001 while WO-039 says WO-001 was
  satisfied at `v0.2.1`.** Verified. `docs/work-orders/README.md:685-686`;
  WO-039 line 29-30; derived at `scripts/work-orders.mjs:75-88, 237-245`.
  Also WO-004, WO-027 (WO-001) and WO-017 (WO-105, cited as an oracle).
- **The map admits it is a conservative token interpretation.** Verified.
  `work-order-map.md:13-16, 474-476`.
- **"The machine responsible for sequencing cannot determine whether the
  first proposed order may begin."** Partially verified, consequence
  overstated: `scripts/resume.mjs` reads no dependency at all; activation is
  human preflight and WO-039 activated and closed regardless. The defect is a
  misleading projection with no machine consumer. Consequence: WO-043
  creates the typed projection and the first activation check.

## C. Growth and the "wrong center"

- **The sweep's numbers (kernel 1,277; compiler 4,223; skeleton 13,748;
  scripts 12,984; `reactor.ts` 2,268 lines, six concerns, twenty-case switch,
  154-line branch, 34 casts; 23 serial steps, six to ten minutes).** Stale.
  They are the phase-two plan's measurements at `v0.13.1`
  (`phase-two-plan-2026-09-06.md:262-269, 274`), reproduced, not re-measured.
  Since then WO-032, WO-038, WO-041, WO-039 and WO-109 landed; the root
  `test` script is now 34 `&&` segments (30 excluding four `ls` sanity
  checks), and the forced rebuild sits at segment 18 while
  `test-worktree.sh` runs at segment 12 (`package.json`), so WO-036's
  ordering defect persists. The reactor numbers were not re-measured in this
  pass and are labeled as the dated sweep's.
- **The skeleton tree's inventory.** Verified (46 files; listed above).
- **"Do not perform a broad cleanup first; extract each seam when the
  vertical needs it."** Consistent with the repository's recorded NoOp and
  reversal condition; adopted.
- **The proposed package split (`runtime-contracts`, `worker-runtime`,
  ...).** Unverified recommendation; not adopted as a plan item. The
  source-changing worker brief carries the recorded reactor-split condition
  only.

## D. The current proposed sequence

- **The proposed order is WO-039 → WO-033 → WO-040 → WO-036 → WO-034 →
  WO-035 → WO-037.** Stale. The marked sequence is WO-038, WO-039, WO-033,
  WO-041, WO-032, WO-040, WO-036, WO-034, WO-035, WO-037
  (`work-order-map.md:86-96`); WO-038, WO-039, WO-041 and WO-032 are
  control-closed, so the open remainder is WO-033, WO-040, WO-036, WO-034,
  WO-035, WO-037, which matches the audit's list minus WO-039.
- **WO-039 is not a bounded work order (314 lines; the listed items).**
  Verified as an inventory (the file is 334 lines with its 2026-09-07
  ideation section; every listed item is in it) and moot as a plan input:
  WO-039 is closed after five verifications, two final reviews and five
  repairs (control elapsed repair 27,103,415 ms). Its cost is visible in the
  record; the plan does not re-litigate it, and the audit's replacement
  orders WO-044, WO-045 and WO-046 map onto WO-039's delivered evidence (see
  §E).
- **WO-033 is an epic (477 lines; the listed items).** Verified (478 lines;
  four phases plus the sibling registry, license files and a boy-scout
  item). Its own assumption 5 offers a split. Consequence: partially
  superseded (the target-worktree emit half of phase 2 and the target
  publish half become critical-path slices); the rest deferred.
- **WO-034 starts at cross-repository complexity; none of the six
  demonstrations has a fixture.** Verified (`WO-034:67-70`); its non-goals
  also exclude DotLn transports executing the target work. Consequence:
  deferred behind the first external source change.
- **WO-040 migrates doctrine before observing the real system; the ten units
  have only fixture observations and no live activation.** Verified as
  written at `v0.13.1` (`WO-040:62-64`), now stale: the WO-039 live role
  records show generated-hook refusals in real sessions, and this very pass
  was refused by the writer-isolation unit on `main`. WO-040's design already
  classifies shapes by taxonomy and rung; the audit's point that a real
  external episode is a better classification input is a judgment the
  operator's dispatch adopts. Consequence: deferred, not reactivated.
- **WO-036 is coherent, dependency-ready, and should move to the front.**
  Verified (`WO-036`; index: dependency-ready). Consequence: remains active,
  recommended beside WO-042 and WO-043.

## E. The replacement roadmap

- **WO-044 harness capability truth ("only WO-039 phase zero").** Satisfied
  by existing evidence in the main: `docs/discovery/harness-smoke-2026-09-07.md`
  records Claude rows C1–C8 (four hook events, refusal shape, skill
  resolution, settings deny, instruction file, `--bare`) and Codex X1–X3;
  the WO-004, WO-009, WO-011 and WO-019 addenda in
  `docs/discovery/environment.md` record print mode, structured output,
  session persistence, settings precedence and effort readback. Residual
  not observed anywhere: a tool-enabled worker writing in a foreign worktree
  under that worktree's own hooks. Consequence: the residual is Gate C2.
- **WO-047 versioned runtime codecs.** Recommendation; scoped down (§B2,
  §B3, §B4). Consequence: Gate C1 brief, parallel, mandatory before Gate H.
- **WO-045 minimum viable harness lowering (writer isolation, authority
  denial, evidence-before-completion).** Satisfied by existing evidence: the
  three controls are installed and live
  (`.claude/hooks/concurrent-work-requires-worktrees.mjs`, `permissions.mjs`,
  `verify-app-before-done.mjs`, `no-partial-completion.mjs`,
  `read-your-own-output.mjs`), the drift check runs in `npm test`, and the
  live role records exist. Consequence: no order; the target-worktree slice
  is Gate D1.
- **WO-046 Contributor self-host comparison.** Partially satisfied: WO-039
  criterion 6 measured directed bytes and lines per role before and after
  (`docs/evidence/WO-039/README.md` §Context accounting) and the live
  records count refused reads; false activations and operator burden are the
  units' declared next-maturity condition, observed continuously. Consequence:
  no order; observations accrue in the risk register (this pass records one
  procedure gap).
- **WO-048 single-repository source-changing worker.** Adopted as Gate D2
  with additions (commit-identity idempotency; the recorded reactor-split
  condition; operator-run live episodes).
- **WO-049 blinded verifier and repair continuation.** Partially satisfied:
  WO-010 built the loop over a synthetic repository with process doubles and
  no live model claim (`docs/evidence/WO-010/README.md`); the WO-011 and
  WO-039 feedback audits ran live verifier episodes over controlled fixtures.
  Consequence: Gate E is that loop over a real repository with a live
  verifier.
- **WO-050 Playwright evidence adapter.** Adopted as Gate F with an ADR-0002
  dependency-note entry criterion and the `verification-v1` contract
  extension named.
- **WO-051 generic SourceBundle and StoryContract.** Adopted as Gate G; the
  audit's private tracker adapter is out of core by ADR-0002 Decision 2.
- **WO-052 Angular source-to-verified-PR vertical.** Adopted as Gate H,
  extended with the post-PR loop the roadmap rung already names and the
  operator's v1 parity list (intake, requirement understanding, branch,
  changes, conventional commits, PR title and body, every review comment
  resolved).
- **"WO-039 is superseded by WO-044, WO-045 and WO-046."** Contradicted:
  WO-039 is closed and satisfied; nothing supersedes delivered evidence.
- **Defer WO-033, WO-034, WO-035, WO-037, WO-040 until the vertical
  closes.** Adopted with one change: the deferral gate is the first external
  source change (Gate D2), followed by a mandatory replan, not the whole
  vertical, so that the starter and pilot decisions are made on the first
  real episode rather than on the last one.
- **Work-order atomicity rules (one boundary, one seam, one outcome, one
  rollback unit; split on more than one substantial item).** Adopted as the
  planning principles the dispatch states; WO-042 and WO-043 are checked
  against them in the plan.

## F. Environment facts the audit did not have

- A session inside the Claude sandbox cannot dispatch either CLI transport;
  WO-039's executor recorded three refused in-session attempts and an
  operator-run audit from an outside terminal
  (`docs/evidence/WO-039/README.md` §Fresh evidence editions). Every live
  episode on the critical path, and the plan refuter, is operator-run.
- Every runtime source change invalidates the pinned feedback evidence
  edition (`docs/product/02-domain-model.md` §Feedback compiler v1, WO-041
  integration correction), so each compiler order carries a live audit.
- The compiled writer guard gates only the Bash, Edit and Write tools
  (`harness-host.ts:1070-1072`), and the permission classifier treats every
  other tool as a read (`harness-host.ts:1405-1408`). During this pass a
  read-only listing subagent obtained shell output through the `Monitor`
  tool without touching the reservation. No write was made that way. This is
  a false negative in the lowered controls and is recorded as a candidate
  and a risk.
- The planning procedure says "run on the clean main checkout"; under the
  compiled build every write on `main` is refused by the writer-isolation
  unit, so the pass needed a planning branch checked out in the main
  checkout before its first write. Recorded as a one-sentence procedure
  correction in product 07 and the playbook.

## G. Clean-room screen of the audit text

The audit names a commercial enterprise tracker and the operator's employer
in its Gate G and Gate H text. Both stay in the ignored capture and appear on
no committed surface; the plan writes "enterprise tracker adapter" and keeps
it outside core, as ADR-0002 Decision 2 already does. The audit copies no
employer code, configuration, identifier or internal service.

## H. Not verified in this pass

- The reactor's concern, switch, branch and cast counts (dated sweep values,
  not re-measured).
- The "six to ten minutes" chain duration is not re-measured as a comparable
  figure. This pass's own `npm test` on the planning branch, inside the
  sandbox, ran 10 minutes 28 seconds from its first step to the plan gate's
  refusal (log created 14:34:52, last written 14:45:20 local time); the five
  steps after the gate were then run individually and passed. One data point,
  not a baseline.
- Any runtime behavior beyond what the cited tests and evidence receipts
  assert; this pass executed no worker, verifier or refuter episode.
- The audit's claim that the skeleton "is becoming an integration
  god-package" beyond the inventory and the recorded growth risk.

## I. What changes as a result

1. The first gate is unchanged from the audit and the dispatch: WO-042.
2. The audit's Gates C and D collapse: harness truth and minimum lowering are
   delivered; the residual is one discovery brief (writing worker in a
   foreign worktree) and one emit slice (bundle into a target worktree).
3. The codecs work is a parallel brief, mandatory before the Angular
   vertical, not a prerequisite of the first external source change.
4. The deferral gate for WO-033, WO-034, WO-035, WO-037 and WO-040 is the
   first external source change plus a mandatory replan, not the end of the
   vertical.
5. Two new risks enter the register from this pass's own observations: an
   unclassified effectful tool bypasses the writer guard, and the planning
   procedure needed a branch under the compiled build.
