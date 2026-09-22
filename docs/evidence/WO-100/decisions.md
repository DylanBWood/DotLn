# WO-100 decisions

## WO-100-D001

```json
{
  "id": "WO-100-D001",
  "date": "2026-09-22",
  "dispatch": "resume: next",
  "decision": "Deliver the portfolio as a pure contract and derivation in packages/skeleton/src/portfolio.ts, reviewed text under a new `portfolios` section of dotln.config.json and a `portfolio` binding on the resident configuration validated under the compiled floor and each presence phase's effective envelope, and a `portfolio` actor kind whose adapter materializes the selected order through WO-120, changes source through a WO-052 SourceChangeHost and verifies through a WO-054 VerificationHost. The resident records the activation with a host-policy grant before the episode runs; `verified` is computed only from the admitted verification verdict, so the compiled presence transitions advance on a pass and reset on anything else.",
  "evidence": [
    "docs/work-orders/WO-100-preauthorized-portfolio.md: objective, design, criteria 1-5",
    "packages/skeleton/src/work-candidate.ts: WorkCandidate carries kind, paths, evidence ids, proposedHome and measured file count; no authority",
    "packages/skeleton/src/discovery.ts: failing-check evidence records commandSha256 only, so a Shine order's test command cannot be recovered from the candidate",
    "packages/skeleton/src/repair.ts: deriveRepairOrder is the cited derivation shape (pure, NeedsHuman naming the offending path or command, grants never wider)",
    "packages/skeleton/src/repair-host.ts: the existing composition of SourceChangeHost then VerificationHost, and the all-criteria-pass verdict rule in reactor.ts",
    "packages/skeleton/src/resident-state.ts and resident-host.ts: dispatch, refusal, NoOp events and the verified-success / failure transitions compiled by packages/compiler/src/presence.ts",
    "scripts/lib/derived-orders.mjs: materializeOrder allocates WO-900..WO-999 identities by provenance key, requires a registered repository with a full base commit, and activates through resume activate",
    "packages/compiler/src/types.ts: AuthorityGrant.grantedBy includes host-policy; WorkOrder shape",
    "scripts/lib/config.mjs: the WO-069 configuration schema and its refuse-by-path rule",
    "packages/skeleton/src/worker-protocol.ts: a writer request carries only repo.read, repo.inspect, repo.write, git.local and shell.run"
  ],
  "rejected": [
    {
      "option": "NoOp",
      "reason": "Leaves the WO-119 producer without a consumer and keeps every unattended repair awaiting an operator, which is the observed gap this order closes."
    },
    {
      "option": "Put the portfolio on the compiler's LoadoutGraph and compile it beside presence",
      "reason": "Needs schema, normalization and hash-invariant changes across the compiler for a runtime policy the resident already validates against the same compiled floor; the resident configuration already carries the compiled graph and environment. Reopen when a second host needs the portfolio compiled without a resident."
    },
    {
      "option": "Recover the Shine test command from the candidate's evidence",
      "reason": "The evidence records only commandSha256 of an absolute argv; the portfolio's per-kind verification commands are the reviewed source instead, and a kind without one yields NeedsHuman."
    },
    {
      "option": "Map misplaced-file to Seiton (Set in Order)",
      "reason": "Seiton is not compiled today (WO-093); product 05 assigns placement to the Sort/Shine producer and the order's objective names a misplaced file as derivable. Reopen when WO-093 compiles Seiton."
    },
    {
      "option": "Retry a candidate whose derived order failed or was lost",
      "reason": "A candidate is activated at most once per portfolio version and store; the durable order stays in the index for a human, so a failing candidate cannot loop the curve or spend the budget twice."
    },
    {
      "option": "Kill an in-flight episode when the wall budget runs out",
      "reason": "Neither WO-052's host nor WO-054's accepts cancellation; the budget is an admission budget charged when an episode ends, and the source-change lease bounds the episode itself."
    },
    {
      "option": "Declined in the order text and kept: a model choosing work, operator-authored candidate lists, an order widening its own surfaces",
      "reason": "Recorded by the order; candidates come only from the executable producer and the derived surfaces are the candidate's files."
    }
  ],
  "reopenWhen": "WO-111 needs retry, replenishment or in-flight budget cancellation; WO-093 compiles Seiton; a second consumer needs the portfolio as a compiled loadout field; or a verifier shows a derived order whose surfaces, size or envelope exceed the portfolio or phase."
}
```

**Mission and critical path.** The mission is operator flow through
dependable unattended machinery; the critical-path plan targets the
always-on runtime and a verified source-to-deliverable loop. This order is
the step between the executable producer (WO-119) and the unattended hour
(WO-111): without it, no candidate ever becomes bounded work, so the hour
has nothing it may do.

**System traps.** Policy resistance: the derivation reuses the compiled
presence transitions and the existing resident refusal, so the portfolio
cannot advance a phase the presence policy would not. Tragedy of the
commons: the budget counts episodes, reported tokens and resident-clock wall
time and refuses dispatch once any is spent. Drift to low performance: the
fixture pins what each candidate becomes and asserts derived surfaces and
size against the portfolio and phase. Escalation: no new lifecycle gate or
approval step; out-of-portfolio work becomes a suggestion or a
`NeedsHuman`, not a new process. Success to the successful: the WO-120
materializer and the WO-052/WO-054 hosts are reused rather than duplicated,
and the compiler route was weighed and declined above for cost, not
investment. Shifting the burden to the intervenor: a derived order is
executed and verified without an operator await; only candidates the
portfolio cannot bound reach the operator. Rule beating: `verified` is
recomputed by the fold from the host's recorded verdict and the activation
payload is recomputed from the persisted discovery, portfolio and phase, so
a log cannot claim an order the derivation did not produce or a pass the
verifier did not admit; the fixture's failure path uses a real failing
check. Seeking the wrong goal: the observable outcome is a verified derived
change and a phase that advances only after it, not the count of orders.

**Naive Interventionism.** Existing useful functions: the resident's
dispatch/NoOp/refusal path, the discovery observation, WO-120 identity,
WO-052/WO-054 hosts. Affected consumers: resident fold replay (new event
types are additive; existing logs replay unchanged), the actor catalog, the
configuration loader (a new optional section). Second-order harm: a new
actor kind widens the resident's surface; it is unavailable unless a host
binds execution ports, so today's `dotln resident` behaves as before.
Reversible by removing the optional section and actor kind. Smallest useful
probe: the WO-119 six-candidate fixture over a scratch target with doubles.

**NoOp.** Nothing changes: WO-111 cannot start and the producer's output is
read only by humans. Action wins because every dependency is met and the
order is the next sequence entry. Evidence that would reopen: a verifier
showing a derived order outside its portfolio or phase.

## WO-100-D002

```json
{
  "id": "WO-100-D002",
  "kind": "experiment",
  "date": "2026-09-22",
  "dispatch": "resume: next; Tinkerer — Economy equipped by default",
  "decision": "Decline this order's economy experiment and keep the current method: the focused-suite development loop adopted in WO-145-D002 and one full npm test at the end.",
  "question": "Can the order's dominant avoidable cost, the required live feedback self-host episode (WO-152: three attempts, 631,183 ms of launch wall-clock, USD 4.2363984), be reduced by a different model or effort choice for the episode?",
  "alternatives": [
    "Run the episode once with the README's documented selection and accept its attempts",
    "Pair two model/effort selections on the same source and compare attempts to completion and cost"
  ],
  "observation": "Attempts to a complete matrix and reported USD per selection on the same source revision.",
  "budget": { "wallSeconds": 900 },
  "execution": "declined",
  "reason": "A paired comparison needs at least one additional paid live episode (about 190-230 s and USD 1.3-1.5 each per WO-152's rows), which the order does not authorize beyond its one required edition, and a single sample per selection cannot distinguish the unknown-cause invalid-result refusals WO-152-D009 left open from a selection effect. The development loop already runs focused suites per WO-145-D002.",
  "cost": {
    "wallSeconds": 420,
    "tokens": null,
    "commands": [
      "sed -n '40,80p' docs/evidence/WO-152/repair.md",
      "grep -n '\"kind\": \"experiment\"' -A30 docs/evidence/WO-152/decisions.md",
      "sed -n '95,160p' docs/evidence/WO-145/decisions.md"
    ],
    "source": "Wall-clock from reading WO-145's trial guidance (about 17:38Z) to this record (about 17:45Z) by the session's command timestamps, rounded up. Tokens null: the only counter (`node scripts/harness.mjs usage`) is dispatch-scoped and cumulative, so no experiment-scoped delta was observed."
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": ["none: declined before any measurement"],
    "summary": "No measurement was taken; no saving is claimed."
  },
  "outcome": "kept-current",
  "regression": "unknown",
  "history": { "lastAdoptedImprovementAt": null, "experimentsSinceAdoption": null },
  "evidence": [
    "docs/evidence/WO-152/repair.md: three live attempts, two invalid-result refusals of unknown cause, totals",
    "docs/evidence/WO-145/decisions.md: WO-145-D002 adopted focused tests during development",
    "docs/work-orders/WO-100-preauthorized-portfolio.md criterion 5: one fresh feedback evidence edition"
  ],
  "rejected": [
    {
      "option": "Run the paired comparison anyway",
      "reason": "Spends an unauthorized paid episode and cannot separate selection from WO-152-D009's unknown refusal cause with one sample each."
    }
  ],
  "reopenWhen": "WO-152-D009's refusal cause is observed, or the operator authorizes paired live episodes for an efficiency comparison."
}
```

## WO-100-D003

```json
{
  "id": "WO-100-D003",
  "date": "2026-09-22",
  "dispatch": "resume: next",
  "decision": "Take no boy-scout item from REVIEW-002: the single-source refusals-paragraph nomination once written on this order's catalog row was withdrawn the same day and allocated to WO-155 with ER2-003.",
  "evidence": [
    "docs/planning/entropy-review-002-2026-09-22.md §5.3 (the nomination) and §10 (\"The same day's boy-scout nominations on WO-064 and WO-100 are withdrawn\"; ER2-003 to WO-155)",
    "docs/planning/sequence.md: WO-155 filed after WO-100 and WO-064"
  ],
  "rejected": [
    {
      "option": "Implement the emission change here",
      "reason": "It is WO-155's allocated scope; doing it here would duplicate an order the sequence already holds."
    }
  ],
  "reopenWhen": "The operator returns the item to this order."
}
```

## WO-100-D004

```json
{
  "id": "WO-100-D004",
  "date": "2026-09-22",
  "dispatch": "resume: next; Adjacent Repair equipped",
  "decision": "Repair two adjacent defects met while reading this order's surface, as queue item adjacent-0001: register packages/skeleton/src/sha256.ts in the evidence sources, and correct its header's attribution of the discovery digest from WO-100 to WO-119.",
  "evidence": [
    "git show bbf1bc85: the digest moved from the registered work-candidate.ts into a new sha256.ts, which was not added to scripts/lib/evidence-sources.mjs, so an edit to it could not stale an evidence edition",
    "packages/skeleton/src/work-candidate.ts and docs/evidence/WO-119/decisions.md: the discovery wire digest is WO-119's",
    "npm run adjacent -- list: adjacent-0001 completed with `node --test packages/skeleton/dist/test/discovery.test.js` (10 of 10) and a format check"
  ],
  "rejected": [
    {
      "option": "Defer both to a follow-up",
      "reason": "Both are one-line, low-risk and inside files this order already registers or reads; the portfolio actor now imports sha256.ts too, so leaving it unregistered would weaken this order's own edition."
    }
  ],
  "reopenWhen": "An evidence edition check shows sha256.ts drift it should have caught, or its provenance is shown to be otherwise."
}
```

## WO-100-D005

```json
{
  "id": "WO-100-D005",
  "date": "2026-09-22",
  "dispatch": "resume: next",
  "decision": "Shape the derived contract for its two consumers: the compiled WorkOrder handed to WO-120 is phase-free (constant prohibited operations; the grant named without its phase), and its first acceptance criterion states the portfolio's verification requirement, which is the only criterion the WO-054 capsule carries. The phase's envelope and the grant's reason stay on the resident's activation record; WO-052 enforces the surfaces; the order's other criteria guide the writer.",
  "evidence": [
    "scripts/lib/derived-orders.mjs: the same provenance key with a different contract refuses ('provenance key already names a different contract'), so a candidate derived in two phases needs one contract",
    "packages/compiler/src/verification.ts: a snapshot criterion's description must be one of the contract's acceptance criteria, and every contract criterion must be covered by a criterion with named checks ('snapshot criterion contract or named checks', 'snapshot contract criterion coverage'); both refusals were observed in scripts/test-portfolio.mjs before this shape",
    "packages/skeleton/src/source-change-worktree.ts: the committed diff is refused outside the declared surfaces",
    "scripts/test-portfolio.mjs: WO-900 verified through the real hosts; WO-901's verification failed on its named check and reset the curve"
  ],
  "rejected": [
    {
      "option": "One verification criterion per stated acceptance criterion, each requiring every named command",
      "reason": "Would record, for example, 'the change touches only src/main.js' as verified by a lint run, a claim the evidence does not support."
    },
    {
      "option": "Include the phase in the WO-120 provenance key",
      "reason": "Gives one candidate a separate durable order per phase and lets it be attempted twice."
    }
  ],
  "reopenWhen": "A portfolio needs a stated criterion judged independently beyond its named commands, or WO-120 gains per-phase amendment of an allocated contract."
}
```

## WO-100-D006

```json
{
  "id": "WO-100-D006",
  "date": "2026-09-22",
  "dispatch": "resume: next; one read-only review subagent over the uncommitted diff",
  "decision": "Dispose the executor-requested review's ten findings, each re-checked against the code: fix eight (a host-checked Sort relocation before WO-054 and claims scoped to the named commands; RepairHost's no-escalation pass rule; the bound base in the WO-120 provenance key; a kill after the change records the observed commit; a full commit id for the bound base; an actor reservation covering its phase ceiling; a writer unit required in each named phase; consistent Sort wording), document the accounting limits, and defer the resident-side profile check to WO-111's production binding.",
  "evidence": [
    "packages/skeleton/src/reactor.ts: RepairHost's verified requires !result.envelope.requiresHuman; the portfolio host omitted it",
    "scripts/lib/derived-orders.mjs: an allocated provenance key with a different contract refuses, so a key without the base could never materialize a candidate again after a rebind",
    "packages/compiler/src/verification.ts: criterion surfaces must be non-empty and present in each snapshot ('criterion outside repository snapshot', observed while adding the Sort test), hence surfaces drawn from both trees",
    "scripts/test-portfolio.mjs third test: a git mv passes 2 of 2 criteria; a copy fails the host relocation with no verifier dispatched; an escalating verifier fails a lint fix whose evaluation passed",
    "packages/skeleton/test/portfolio.test.ts: writer-unit and full-hash refusals, reservation refusal, the provenance key, and both kill paths"
  ],
  "rejected": [
    {
      "option": "Enforce the registered repository profile inside the resident now",
      "reason": "The skeleton cannot read the launchpad configuration, and no production host binds portfolio ports today; the resident's compiled floor is the runtime guard, and WO-111 owns building a resident from the loaded portfolio under a profile-compiled environment."
    },
    {
      "option": "Charge only the pre-crash wall time for an episode lost to a restart",
      "reason": "The loss is recorded after the restart's first clock sample; over-charging is the conservative direction for a budget that must not be exceeded."
    },
    {
      "option": "Judge every stated criterion with every named command",
      "reason": "Recorded in D005: it would claim verification the evidence does not give."
    }
  ],
  "followup": "WO-111: build the resident's portfolio binding from the loaded `portfolios` entry and compile its environment under the bound repository's registered authorityProfile, so the profile check the configuration loader performs also holds for a hand-written resident.json.",
  "reopenWhen": "A host reports tokens, a portfolio binding is created outside the configuration loader, or a verifier shows a Sort, Shine or Standardize order advancing the curve on a change its named commands and host checks did not establish."
}
```

## WO-100-D007

```json
{
  "id": "WO-100-D007",
  "date": "2026-09-22",
  "dispatch": "scope expand: during resume: next — four operator messages on 2026-09-22 and one answered question (move the Entropy Reducer pin inside WO-100)",
  "decision": "Replace every active external-CLI selection of Claude Fable 5.1 with Claude Opus 5.5 at xhigh and of GPT-6 Astra with GPT-6 Sol (xhigh where Astra ran at max or xhigh; model only where the Codex effort is deliberately unrecorded as `unknown`, so the CLI's configured effort applies). This includes the compiled Entropy Reducer reviewer pin with a recorded evidence migration. Record, as a candidate, that always-on agents may default to GPT-6 Luna or the latest Claude Sonnet at xhigh, since no resident-level default model exists yet.",
  "evidence": [
    "Operator messages 2026-09-22: 'any external cli call place fable 5.1 max is utilized, replace with opus 5.5 xhigh. any place astra max or xhigh is utilized, now use gpt 6 sol xhigh'; 'always on agents (or candidates if functionality isnt there yet) may default to luna (6) xhigh or sonnet (5.5 when it comes out) xhigh'; 'opus 5.5 and gpt 6 sol and luna came out today. sonnet 5.5 isnt out yet so use whatever currently is available'; 'actually, replace all external cli calls from fable 5.1 -> opus 5.5 xhigh and gpt 6 astra -> gpt 6 sol'",
    "Operator answer 2026-09-22: include the compiled Entropy Reducer pin in WO-100",
    "~/.codex/models_cache.json (local Codex CLI 0.155.1 catalog): gpt-6-sol supports low..ultra, gpt-6-luna supports low..max; identifiers observed, not inferred",
    "Claude Code environment: claude-opus-5-5 is the Opus 5.5 identifier; claude-sonnet-5 is the latest Sonnet available",
    "grep of packages/*/src, scripts and docs for fable and astra: active selections in entropy-reducer.ts, scripts/lib/entropy-review.mjs, scripts/refute-plan.mjs, the probe and evidence scripts, PLAYBOOK, AI-HARNESS-SECURITY, the Entropy Reducer guide and product 03, 05 and 06",
    "scripts/resident-bind.mjs requires --model and --effort: the resident has no default model, so the always-on default is a candidate"
  ],
  "rejected": [
    {
      "option": "Rewrite historical receipts, recorded evidence or observed-session fixtures",
      "reason": "They record what ran; the directive governs future calls."
    },
    {
      "option": "Move Claude Fable 5 selections (harness probes, the planning role)",
      "reason": "Fable 5 is not Fable 5.1; the final directive names Fable 5.1 only."
    },
    {
      "option": "Tier existing call sites to Luna or Sonnet as downgrade-tolerant",
      "reason": "The operator's final message ('actually, replace all …') makes the mapping total for existing sites; the downgrade guidance informed only this order's own live feedback episode, which ran on claude-sonnet-5."
    },
    {
      "option": "Add a resident default model now",
      "reason": "The operator allowed a candidate where the functionality does not exist; a bind default is new behavior for WO-111's unattended hour."
    },
    {
      "option": "Move the Entropy Reducer pin in its own order",
      "reason": "Offered; the operator chose to include it here."
    }
  ],
  "followup": "WO-111: when the resident binds live transports, default always-on agents to gpt-6-luna or the latest Claude Sonnet at xhigh, per the candidate note in product 06.",
  "reopenWhen": "Claude Sonnet 5.5 becomes available (the Sonnet tier moves to it), a selected model is withdrawn, or the operator changes a role default."
}
```

## WO-100-D008

```json
{
  "id": "WO-100-D008",
  "kind": "correction",
  "date": "2026-09-22",
  "dispatch": "operator question during resume: next: why the Codex default effort stayed `unknown` rather than `xhigh`",
  "misread": "D007 kept `unknown` as the Codex effort for the entropy and planning-refutation defaults on the premise that the CLI's configured effort (xhigh in the operator's Codex configuration) would then apply.",
  "meant": "The operator's direction is GPT-6 Sol at xhigh. DotLn's Codex transport launches with --ignore-user-config and passes no model_reasoning_effort for `unknown`, so those launches would run at gpt-6-sol's built-in default, which the local Codex catalog lists as medium.",
  "changed": "scripts/lib/entropy-review.mjs TRANSPORT_DEFAULTS and scripts/refute-plan.mjs now default Codex to gpt-6-sol at xhigh, passed explicitly and recorded as the invocation's value; effective effort readback stays unknown as before.",
  "decision": "Default both Codex routes to an explicit xhigh.",
  "evidence": [
    "packages/skeleton/src/worker-transport.ts lines 337, 433, 521: --ignore-user-config on every Codex launch",
    "packages/skeleton/src/worker-transport.ts: `unknown` omits the -c model_reasoning_effort override; xhigh is an admitted level and version comparison is advisory",
    "~/.codex/models_cache.json: gpt-6-sol default_reasoning_level medium",
    "docs/evidence/WO-125/decisions.md WO-125-D001: why `unknown` was the earlier default (explicit Codex efforts admitted only after observation)"
  ],
  "rejected": [
    {
      "option": "Keep `unknown` and document the medium default",
      "reason": "Contradicts the operator's xhigh direction."
    }
  ],
  "reopenWhen": "The Codex transport stops ignoring user configuration, or xhigh is refused for gpt-6-sol by an installed CLI."
}
```

## WO-100-D009

```json
{
  "id": "WO-100-D009",
  "date": "2026-09-22",
  "dispatch": "resume: verify",
  "decision": "Record VER-001 F1 for repair: a valid portfolio verification command that names no shared tree path cannot verify an otherwise correct Sort move.",
  "evidence": [
    "packages/skeleton/src/portfolio.ts: decodePortfolio accepts `npm test` as a verification command for `misplaced-file`",
    "packages/skeleton/src/portfolio-host.ts: verificationSurfaces selects only order paths present in both snapshots or command tokens that are paths in both; verify throws on an empty result before dispatching WO-054",
    "Verifier's system-temp scratch Git reproduction: moving loose/guide.md to docs/guide.md with unchanged blob returned relocationHolds=true and verificationSurfaces=[] for the admitted `npm test` command",
    "npm test on the current subject: 26 suites passed, 0 failed, 286.65 s; the existing Sort fixture uses `node checks/test.cjs` and therefore does not cover this case"
  ],
  "followup": "resume: fix WO-100 VER-001 F1: make a correct Sort relocation verifiable with an admitted check such as `npm test` that names no path common to both snapshots, preserving WO-054's requirement for a real shared criterion surface; add the corresponding fixture assertion.",
  "rejected": [
    {
      "option": "Treat the existing Sort fixture's success as coverage of all admitted verification commands",
      "reason": "Its `node checks/test.cjs` argument supplies a shared path that `npm test` does not; the scratch reproduction reaches the opposite host result."
    }
  ],
  "reopenWhen": "A repair demonstrates an admitted Sort move with a pathless verification command reaching WO-054 and advancing only after the named check passes."
}
```

## WO-100-D010

```json
{
  "id": "WO-100-D010",
  "date": "2026-09-22",
  "dispatch": "resume: fix; VER-001 F1",
  "decision": "When neither the order's surviving paths nor its named commands' path tokens are present in both snapshots, anchor the single WO-054 criterion on every file both snapshots hold. A command such as `npm test` runs over the whole tree, so the shared tree is a real surface present in the baseline and the subject, and WO-054's own check that each criterion surface is in each snapshot is unchanged. The narrower selection still applies whenever it finds a path, so existing Sort, Shine and Standardize criteria keep their surfaces.",
  "evidence": [
    "docs/verifications/WO-100/VER-001.md F1: a move of loose/guide.md to docs/guide.md checked by the admitted `npm test` gave relocationHolds=true and verificationSurfaces=[], and verify threw before WO-054 opened",
    "packages/compiler/src/verification.ts: criterion surfaces must be non-empty ('criterion surfaces') and each must be a file of the snapshot ('criterion outside repository snapshot'); packages/skeleton/src/verification-worktree.ts prepares the baseline and the subject with the same criteria, so a surface must be in both trees",
    "Negative control executed before the fix: the Sort test stopped at its first pathless run with 'portfolio verification has no surface in both trees', after the earlier runs in that test had passed",
    "Executed after the fix (docs/evidence/WO-100/repair-001-portfolio-e2e.tap): with package.json `test` running the placement check, the exact move passes 2 of 2 criteria, the verifier is dispatched once and its capsule criterion lists every file of the base tree except loose/guide.md; with `test` also running the failing checks/test.cjs, the same exact move fails 1 of 2 with one finding after the verifier ran; the path-bearing Sort, copy and escalation runs are unchanged; 3 of 3 tests pass",
    "packages/skeleton/src/verification-worktree.ts witnessTest: `npm test` runs under sandbox-exec with PATH naming the Node binary's directory, where npm is installed on this machine, and HOME inside the test copy; the passing run shows the confined launch works"
  ],
  "rejected": [
    {
      "option": "Anchor the criterion on the whole shared tree whenever any command names no path",
      "reason": "Changes the surfaces of Shine and Standardize orders that verify today on their own files, beyond the case VER-001 names; the narrower paths remain an accurate location when they exist."
    },
    {
      "option": "Map known programs to manifest files (npm to package.json, make to Makefile, and so on)",
      "reason": "decodePortfolio admits any command in the WO-052 grammar, so a table always leaves an unknown program stranded and still needs this fallback; it also guesses at what a program reads."
    },
    {
      "option": "Relax WO-054's snapshot-surface rule or add a synthetic surface file",
      "reason": "Weakens the verifier's own contract for every consumer, or records a claim located on a file the change never had; VER-001 asks to preserve the real shared-surface requirement."
    },
    {
      "option": "Refuse `npm test`-style commands for misplaced-file in decodePortfolio",
      "reason": "Turns an admitted, common check into configuration friction and leaves the host rule unchanged for any other pathless command."
    },
    {
      "option": "NoOp",
      "reason": "An admitted Sort order would stay unable to reach independent verification, so the curve resets on correct work."
    }
  ],
  "reopens": {
    "decisionId": "WO-100-D009",
    "observation": "The named repair is implemented with its regression and a negative control: an admitted Sort move checked by `npm test` reaches WO-054 and passes only when that check passes."
  },
  "reopenWhen": "A verifier shows a criterion surface outside either snapshot, a shared tree too large for WO-054's limits, or an order whose narrow surfaces understate a check enough to mislead a verdict."
}
```

**Goal alignment.** Mission and critical path: this keeps the verified loop
from WO-119's producer to WO-111's unattended hour whole for every admitted
Sort order, so a correct move can advance the curve. Policy resistance: the
compiled floor, WO-052 surfaces, the host relocation check and WO-054's
snapshot rules are untouched. Rule beating: the regression uses the command
shape the verifier found, and its failing twin shows a pass comes from the
check, not from the new surfaces. Drift to low performance and seeking the
wrong goal: the observed outcome is an admitted verdict, not a green fixture.
Tragedy of the commons: one focused regression; the full gate runs once.
Escalation and shifting the burden to the intervenor: a host rule, not an
operator rescue or a new approval step. Success to the successful: the
existing narrow selection keeps precedence where it finds a path; the fallback
is used only where it finds none. **Naive Interventionism:** the only changed
behavior is the case that threw; consumers are the portfolio host alone;
second-order harm would be a broader criterion location, bounded by the
snapshot's 100-file limit and reversible by deleting one line. **NoOp** is
rejected above. No second economy experiment is started: D002 already records
this order's one decision.

## WO-100-D011

```json
{
  "id": "WO-100-D011",
  "date": "2026-09-22",
  "dispatch": "resume: verify; VER-002",
  "decision": "Record VER-002 F1 for repair: the active planning-refutation guide still states the pre-migration external CLI model and effort defaults, although this order changed those defaults and explicitly included documents that state them.",
  "evidence": [
    "docs/work-orders/WO-100-preauthorized-portfolio.md: the authorized scope expansion includes the planning-refutation command defaults and documents that state those defaults",
    "scripts/refute-plan.mjs: the active claude-cli-print default is claude-opus-5-5 at xhigh and the codex-cli-exec default is gpt-6-sol at xhigh",
    "docs/planning/refutations/README.md §Execution and preservation: the operator-facing guide still says claude-fable-5-1 at max and gpt-6-astra at unknown",
    "docs/AI-HARNESS-SECURITY.md §Planning refutation: the current defaults are correctly stated there, confirming the guide's mismatch"
  ],
  "followup": "resume: fix WO-100 VER-002 F1: correct docs/planning/refutations/README.md §Execution and preservation to state the current Claude Opus 5.5 and GPT-6 Sol xhigh defaults; preserve the guide's separate statement that effective model and effort remain unknown; run the relevant documentation and product checks.",
  "rejected": [
    {
      "option": "NoOp",
      "reason": "Leaves an active operator guide contradicting the executable defaults and the order's authorized documentation scope."
    },
    {
      "option": "Edit the guide in independent verification and pass the order",
      "reason": "The verifier's current-subject judgment must remain independent; route the bounded correction through the repair phase."
    }
  ],
  "reopenWhen": "The active guide states the same model and effort defaults as scripts/refute-plan.mjs, with its effective-readback limit intact."
}
```

## WO-100-D012

```json
{
  "id": "WO-100-D012",
  "date": "2026-09-22",
  "dispatch": "resume: fix; VER-002 F1",
  "decision": "Correct docs/planning/refutations/README.md §Execution and preservation to state the current external CLI defaults, claude-opus-5-5 at xhigh and gpt-6-sol at xhigh, and name the pre-WO-100 defaults as previous, in the same form docs/AI-HARNESS-SECURITY.md §Planning refutation uses. The guide's separate sentence that effective model and effort remain unknown unless independently observed is unchanged.",
  "evidence": [
    "docs/verifications/WO-100/VER-002.md F1 and its follow-up WO-100-D011",
    "scripts/refute-plan.mjs: the --model default is claude-opus-5-5 for claude-cli-print and gpt-6-sol for codex-cli-exec; the --effort default is xhigh for both external transports",
    "docs/AI-HARNESS-SECURITY.md §Planning refutation already states those defaults with the previous pair in parentheses",
    "Sweep `git grep -n -i -E \"fable-5-1|fable 5\\.1|gpt-6-astra|astra\"` over README.md, docs/product/, docs/PLAYBOOK.md, docs/planning/refutations/README.md, docs/instance/entropy-reducer/*.md and both skill trees: after the edit, every remaining match either names the previous selection beside the new one or is docs/product/06-roadmap.md's v0.5.0 entry, which describes what the closed WO-023 release ran; all other matches are dated receipts, evidence, discovery observations or fixtures, which the scope expansion keeps byte-identical"
  ],
  "rejected": [
    {
      "option": "Add a test that parses the guide's prose and compares it with refute-plan.mjs",
      "reason": "Goes beyond the literal correction D011 names, and a prose parser for one sentence would be brittle. VER-002 records the missing check as a limit, not a finding."
    },
    {
      "option": "Also rewrite the roadmap's v0.5.0 entry or dated receipts to the new models",
      "reason": "Those describe what ran at their time; the authorized scope keeps historical bytes and changes only active selections and the documents that state them."
    },
    {
      "option": "NoOp",
      "reason": "Leaves the operator guide contradicting the command and the security guide, as VER-002 found."
    }
  ],
  "reopens": {
    "decisionId": "WO-100-D011",
    "observation": "The guide now states the same model and effort defaults as scripts/refute-plan.mjs, and its effective-readback limit is unchanged."
  },
  "reopenWhen": "The refute-plan.mjs defaults change again, or a verifier finds another active document stating a pre-WO-100 default as current. A second finding like this one would justify a check that ties the guides' stated defaults to the command."
}
```

**Goal alignment.** Mission and critical path: an operator reading the
refutation guide now sees what the command will select, so the authorized
model migration is complete on its operator-facing surface. Policy resistance
and success to the successful: the wording copies the security guide's already
correct form rather than inventing a third. Rule beating, drift to low
performance and seeking the wrong goal: the evidence is the sweep and a
side-by-side reading against the command's source, not a green gate count.
Tragedy of the commons and escalation: one sentence; the full gate is not
rerun for a prose-only change outside the gate's code identity
(documentation checks run instead). Shifting the burden to the intervenor:
the guide no longer asks operators to reconcile two current guides.
**Naive Interventionism:** only the default sentence changed; the effective
readback limit and the explicit-selection rules are untouched, and restoring
that one sentence reverts the edit. **NoOp** is rejected above. No second economy
experiment is started: D002 is this order's one decision.

## WO-100-D013

<!-- integration refs/dotln/checkpoint/WO-100/15 -->

```json
{
  "id": "WO-100-D013",
  "date": "2026-09-22",
  "dispatch": "worktree integrate WO-100, during resume: final review",
  "decision": "Integrate main at 28f9f870 (WO-064, published as v0.43.0) by fast-forward with no authored conflict. Criteria 1 to 4 carry forward on their VER-003 evidence: main changed no file under packages/, no portfolio, configuration, evidence-source or edition input, and no WO-100 write-back section. The v0.44.0 target stays current over the published v0.43.0 tag, and no component version collides, because WO-064 bumped none. Criterion 5 is judged afresh on the integrated tree in FINAL-001: the reviewer gate there fails in runner-fixtures on WO-100's own suite declaration (D014), not on anything the integration brought in.",
  "evidence": [
    "refs/dotln/checkpoint/WO-100/15",
    "base 15fa8a7953707d6caa768a0edc01b6b6678238a9",
    "upstream 28f9f870a2891fb65796324bbdb5f5853ddccee9",
    "git diff --stat 15fa8a79 28f9f870: 33 files, none under packages/, none of scripts/lib/config.mjs, scripts/lib/evidence-sources.mjs, docs/evidence/current.json or .claude/; scripts/lib/entropy-review.mjs (one comment line) and scripts/test-runner.mjs (the target-publish suite) merged beside WO-100's hunks without overlap",
    "git ls-remote --tags origin: refs/tags/v0.43.0 peels to 28f9f870; npm run release -- prepare (run by the helper): WO-100 target v0.44.0 remains current",
    "After integration: node scripts/harness.mjs check (31 generated surfaces), npm run publication:check (275/275 headings, both editions CURRENT) and npm run release -- check-surfaces --local (44 PASS) exit 0",
    "npm test -- --review on the integrated tree a25aee7c, code identity ef024991: 37 passed, 1 failed (runner-fixtures), 469.05 s; portfolio, skeleton, target-publish, configuration-root and worktree-integration passed"
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-09-22. Original base: `15fa8a7953707d6caa768a0edc01b6b6678238a9`.
Fetched main: `28f9f870a2891fb65796324bbdb5f5853ddccee9`. Checkpoint: `refs/dotln/checkpoint/WO-100/15`.
Named stash retained: `544330e6b8b197621c41afcd120cfb02e645f3b5` (WO-100 integrate 2026-09-22).
Resolved projections: README.md, docs/control/current.md, docs/planning/followups.json, docs/publication/everyday-ai-user-toc.md, docs/publication/software-engineer-toc.md, docs/work-orders/README.md.
Release preparation: WO-100 target v0.44.0 remains current; no files changed.
Tag observation: local snapshot only..
Carried-forward claims: criteria 1 to 4 carry forward on VER-003's evidence, since main touched none of their inputs, and the portfolio suite passed again on the integrated tree. Criterion 5 is not carried forward: the reviewer gate on the integrated tree failed in runner-fixtures on WO-100's own `portfolio` suite declaration ([D014](#wo-100-d014)), which main did not cause. The first integration attempt stranded its receipt before any stash or merge ([D017](#wo-100-d017)).
Authored conflicts observed: none.
Affected checks are printed by the command; results remain untested until executed.

## WO-100-D014

```json
{
  "id": "WO-100-D014",
  "date": "2026-09-22",
  "dispatch": "resume: final review; the operator chose to fail to repair",
  "decision": "Fail FINAL-001 on F1. WO-100's new `portfolio` suite declares `needs: outside-sandbox` in scripts/test-runner.mjs. No decision records the environmental cause WO-140-D001 requires, and the inventory test that encodes WO-140's rule, product 07 §Gate sandbox preflight and WO-140-D001 were not updated. The reviewer gate selects runner-fixtures because WO-100 edits scripts/test-runner.mjs, and its test 41 fails. The declaration is probably right in substance: an outer Seatbelt sandbox refuses a nested sandbox-exec, and the portfolio suite nests one through WO-119 discovery and WO-054's witness. But choosing between declaring and not declaring, and updating the gate machinery's own record, is a change to the order's subject. A reviewer does not write and certify it.",
  "evidence": [
    "npm test -- --review at tree a25aee7c36248b88a8d498b4426844fde8fb31c4, code identity ef024991f563e3febf02b192b4e531dfb0dda55575fd910194c71538c1fc520c, recorded 2026-09-22T20:20:01.385Z: 37 passed, 1 failed, 469.05 s, 82 fresh tasks, exit 1, sandbox not in force",
    "scripts/test-runner.test.mjs:1369 'WO-140 the real inventory declares only the suite with an environmental outside-only cause': expected [[skeleton, outside-sandbox]], actual adds [portfolio, outside-sandbox]",
    "scripts/test-runner.mjs portfolio row: `needs: OUTSIDE_SANDBOX` with the comment 'Its discovery checks and verification tests nest `sandbox-exec`'; main has no portfolio suite, so the failure is WO-100's",
    "docs/evidence/WO-140/decisions.md WO-140-D001 and docs/product/07-execution-guide.md §Gate sandbox preflight: a suite declares only for an environmental cause shown by a receipt; 'skeleton carries the declaration'",
    "grep of docs/evidence/WO-100/*.md and docs/verifications/WO-100/*.md for outside-sandbox, OUTSIDE_SANDBOX, nested sandbox and WO-140: no match",
    "Reviewer probe in this session: `sandbox-exec -p '(version 1)(allow default)' sh -c 'sandbox-exec -p \"(version 1)(allow default)\" /usr/bin/true'` printed 'sandbox-exec: sandbox_apply: Operation not permitted' and exit 71",
    "packages/skeleton/src/discovery.ts:300-308 and packages/skeleton/src/verification-worktree.ts:166-191 launch /usr/bin/sandbox-exec",
    "Implementation, VER-001, VER-002 and VER-003 each ran plain npm test (26 suites), which does not select runner-fixtures"
  ],
  "rejected": [
    {
      "option": "Add portfolio to the WO-140 inventory test and pass in review",
      "reason": "Offered to the operator, who declined. The reviewer would be the only judge of a gate-machinery change that reopens WO-140-D001, which is repair work."
    },
    {
      "option": "Treat the verifiers' green plain npm test as criterion 5",
      "reason": "The reviewer's gate is the one publication consumes, and it selects runner-fixtures because this order changed that suite's declared source. A green subset does not make the full gate green."
    },
    {
      "option": "Remove the declaration in review",
      "reason": "That also changes the order's subject, and the probe suggests the suite cannot pass inside an outer sandbox."
    }
  ],
  "followup": "resume: fix WO-100 FINAL-001 F1: decide the portfolio suite's `needs: outside-sandbox` from evidence. Either record the environmental cause with a receipt (an in-sandbox run of the portfolio suite, or the nested sandbox-exec probe tied to the suite's launches), reopen WO-140-D001 in a WO-100 decision, add portfolio to the scripts/test-runner.test.mjs inventory expectation and amend product 07 §Gate sandbox preflight to name it; or remove the declaration if the suite passes inside. Then run npm test -- --review.",
  "reopenWhen": "A fresh verification shows the reviewer gate green with a recorded cause for every outside-only declaration, or the portfolio suite shown to pass inside a harness sandbox."
}
```

**Goal alignment.** The portfolio loop is sound, so the gap here is in gate machinery, not product behaviour. Still, it is the kind of evidence debt the rule-beating lens exists for: four green plain gates, and not one of them ran the invariant this order broke. NoOp would publish bytes whose own reviewer gate is red. Fixing it here was offered and declined, so the reviewer does not certify its own edit to the gate. Routing it through repair costs one repair, one verification and one review cycle. Its reach is one declaration, one test expectation, one product sentence and one decision.

## WO-100-D015

```json
{
  "id": "WO-100-D015",
  "date": "2026-09-22",
  "dispatch": "resume: final review",
  "decision": "Route three minor FINAL-001 findings to the same repair, because they are cheap once a repair is open. F2: two active documents label the Entropy Reducer's Fable 5.1 pin as lasting 'through `v0.42.0`', but v0.43.0 (WO-064) also shipped it, and the retime moved WO-100 to v0.44.0. F3: WO-100-D011 and WO-100-D012 (and the immutable VER-002) cite 'docs/AI-HARNESS-SECURITY.md §Planning refutation', a section that does not exist. The defaults they compare are in that document's 'Entropy Reducer launch line (WO-151, 2026-09-22)' paragraph, which states the same values, so the substance holds. F4: the curve fixtures fail their order in `peak`, the last phase, where a verified success wraps to `probe` with the same actions as a failure, so the state assertion cannot show a reset. The budget refusal is asserted only when no candidate is left to dispatch. The wall-time and token refusals have no case. The decoded binding admits a 64-hex base that WO-054's worktree preparation refuses.",
  "evidence": [
    "docs/instance/entropy-reducer/README.md:4-5 and docs/product/03-architecture.md:1228-1229: 'Fable 5.1 `max` through `v0.42.0`'; git ls-remote: v0.43.0 at 28f9f870, where packages/skeleton/src/loadouts/entropy-reducer.ts still pins claude-fable-5-1; product 05 and docs/instance/entropy-reducer/REFUTATION-PLAN.md already say 'before WO-100'",
    "grep -n '^#' docs/AI-HARNESS-SECURITY.md: no Planning refutation heading; lines 355-366 hold the Entropy Reducer launch line with claude-opus-5-5 and gpt-6-sol at xhigh",
    "packages/compiler/src/presence.ts:130-150: the last phase's verified-success goes to the first phase with cancel-pending, reset-progress and arm-phase, the same as failure; packages/skeleton/test/portfolio.test.ts:394-396 and scripts/test-portfolio.mjs:492-494 fail in peak and assert probe",
    "packages/skeleton/src/resident-state.ts:742-797: the shared observation handler maps verified false to failure after the fold recomputes `verified` (769-771), and portfolio.test.ts:421-430 asserts verified false for WO-901, so criterion 2 holds on code and the asserted input",
    "portfolio.test.ts:433-455 and test-portfolio.mjs:548-566: after two episodes in widen, both widen candidates are already activated and the Sort move is deferred there; resident-state.ts:343-355 checks episodes, wall time and tokens before derivation at 358",
    "packages/skeleton/src/portfolio.ts:279 admits a 64-hex baseCommit; packages/skeleton/src/verification-worktree.ts refuses a baseCommit that is not 40 hex"
  ],
  "rejected": [
    {
      "option": "Fail the order on F4",
      "reason": "The code implements the reset and the budget order, and the fold's recomputation of `verified` is asserted, so criteria 2 and 3 hold. The weakness is that the evidence could stay green if that code regressed."
    },
    {
      "option": "Edit D011, D012 or VER-002 in review",
      "reason": "VER-002 is immutable. A citation fix belongs in a dated correction record, which the repair can write beside its F2 edits."
    }
  ],
  "followup": "resume: fix WO-100 FINAL-001 F2-F4: say 'through v0.43.0' (or 'before WO-100') in docs/instance/entropy-reducer/README.md and product 03 §First live Entropy Reducer use; record a correction naming the AI-HARNESS-SECURITY launch-line paragraph that D011 and D012 meant; make a portfolio curve fixture fail in a non-last phase and assert the reset to the first phase, add a budget-exhaustion case with an in-phase candidate still available and one wall-time refusal; and make decodePortfolioBinding accept only the 40-hex commit ids WO-054 prepares, or record why not.",
  "reopenWhen": "A repair lands these, or a verifier shows one of them was already true."
}
```

## WO-100-D016

```json
{
  "id": "WO-100-D016",
  "date": "2026-09-22",
  "dispatch": "resume: final review",
  "decision": "Board up rather than repair: nothing counts a derived order's committed change against its `files` ceiling. WO-052 checks each changed path only by surface prefix, and it does not refuse a deletion or a file that becomes a directory. A Shine or Standardize writer could therefore replace `src/main.js` with a directory of any number of files, all inside the surface, and WO-054 would judge only the named commands. Sort is not affected, because the host requires exactly the move. This is WO-052's existing behaviour, not a WO-100 regression. WO-100 relies on it, though, and portfolio.ts's comment 'Host-counted files the order may touch' reads as if a host counted them.",
  "evidence": [
    "packages/skeleton/src/source-change-worktree.ts:261-276: `path === surface || path.startsWith(`${surface}/`)` over `git diff --name-only --no-renames`, with no count and no status filter",
    "packages/skeleton/src/portfolio.ts:43 ('Host-counted files the order may touch, including a proposed home') and :578 (size.files is the surface count)",
    "packages/skeleton/src/portfolio-host.ts relocationHolds: a Sort order must be exactly the delete and add of one blob",
    "docs/product/07-execution-guide.md §Declaring a portfolio: 'the host itself checks only a Sort move's relocation and every order's surfaces' is accurate"
  ],
  "rejected": [
    {
      "option": "Add a count check in WO-052 in this review",
      "reason": "A behavioural change to the shared source-change host, which no verifier has judged."
    }
  ],
  "followup": "Before WO-111 runs a portfolio unattended on an operator repository: make the source-change host refuse a committed change whose path count exceeds the envelope's files limit, or that deletes or changes the type of a path when the envelope does not carry repo.delete; add a Shine fixture whose writer turns a file surface into a directory; and reword portfolio.ts's ceiling comment to match what is enforced.",
  "reopenWhen": "The source-change host counts committed paths or refuses deletions, or a verifier shows a derived order's change exceeding its declared size."
}
```

## WO-100-D017

```json
{
  "id": "WO-100-D017",
  "date": "2026-09-22",
  "dispatch": "resume: final review; operator authorized the recovery ('Recover and re-run')",
  "decision": "Record a machinery defect met at integration and the operator-authorized recovery. `worktree integrate` saves a pending receipt (stage `preserved`) and then runs `git stash push --include-untracked`. The executor had marked WO-100's seven new files intent-to-add, and the stash push failed with \"Entry 'docs/evidence/WO-100/decisions.md' not uptodate. Cannot merge.\" Nothing was stashed or merged, and HEAD was unchanged. A fresh run then refuses as pending, and --continue cannot move past `preserved`, so the helper strands itself. At the operator's direction, the reviewer copied the receipt into the session scratch, fully staged the seven files, removed the stale receipt and re-ran the helper, which completed under checkpoint 15.",
  "evidence": [
    "First run: 'Checkpoint: refs/dotln/checkpoint/WO-100/14' then the stash error; git stash list held no WO-100 entry; HEAD stayed 15fa8a79; no MERGE_HEAD",
    "scripts/lib/worktree-integration.mjs: `save()` at stage preserved precedes the stash; a previous incomplete receipt refuses a fresh run; the continuation path advances only from `merging` or `applied`",
    "docs/evidence/WO-100/implementation.md Limits: the executor ran `git add -N` on the seven new files so `git diff --check` could see them",
    "Recovery: `git add` of those seven paths, then removal of docs/control/local/integration.json after an exact copy to session scratch; the second run printed checkpoint 15, retained stash 544330e6 and 'Authored conflicts: none'",
    "The auto-mode classifier refused the first combined recovery command; the operator then chose 'Recover and re-run'"
  ],
  "rejected": [
    {
      "option": "Integrate by hand outside the helper",
      "reason": "It skips the helper's projection regeneration and draft record, and it leaves the stale receipt blocking the next run."
    },
    {
      "option": "Fix the helper in this review",
      "reason": "It is machinery outside this order's scope, with its own fixture suite."
    }
  ],
  "followup": "Planning: make `worktree integrate` refuse intent-to-add index entries (or stage them) before it saves a receipt, and make any failure before the stash leave either no pending receipt or one that --continue can restart; add a worktree-integration fixture with an intent-to-add entry. Until then, an executor who runs `git add -N` should expect the reviewer's integration to need this recovery.",
  "reopenWhen": "The helper handles or refuses intent-to-add entries before minting a pending receipt."
}
```

## WO-100-D018

```json
{
  "id": "WO-100-D018",
  "date": "2026-09-22",
  "dispatch": "resume: fix; FINAL-001 F1 (WO-100-D014)",
  "decision": "Keep `needs: outside-sandbox` on the portfolio suite, now with its recorded environmental cause, and extend WO-140's declared set from skeleton alone to skeleton and portfolio. The suite's end-to-end tests run WO-119 discovery, which wraps each check in /usr/bin/sandbox-exec, and WO-054's witness, which does the same, and an outer Seatbelt sandbox refuses a nested one. Inside an outer `(allow default)` Seatbelt profile, which differs from the outside run only by the nesting, both end-to-end tests stop at 'discovery: check sandbox or launch refused' and only the configuration test passes; outside, all three pass. That meets WO-140-D001's own reopening condition, 'a receipt names a suite that cannot pass inside a harness sandbox for an environmental cause', so this decision reopens WO-140-D001's declared set: the scripts/test-runner.test.mjs inventory expectation, the runner row's comment and product 07 §Gate sandbox preflight now name portfolio beside skeleton.",
  "evidence": [
    "docs/evidence/WO-100/repair-003-portfolio-in-seatbelt.tap: `sandbox-exec -p '(version 1)(allow default)' node --test --test-reporter=tap --test-concurrency=1 scripts/test-portfolio.mjs` exit 1, 3 tests, 1 pass, 2 fail; both failures 'discovery: check sandbox or launch refused' from discovery.js checks() under test-portfolio.mjs:348 and in the Sort test",
    "docs/evidence/WO-100/repair-003-portfolio-e2e.tap: the same command without the outer profile, 3 of 3 pass",
    "packages/skeleton/src/discovery.ts:305-335: each check runs under /usr/bin/sandbox-exec unless the caller inherited a boundary, and a stderr beginning 'sandbox-exec:' fails the discovery; packages/skeleton/src/verification-worktree.ts:166-191: the WO-054 witness launches /usr/bin/sandbox-exec the same way",
    "This session's Bash was not inside a harness sandbox (`sandbox-exec -p '(version 1)(allow default)' /usr/bin/true` exited 0), so the receipt supplies the outer profile explicitly. That a harness sandbox on macOS is Seatbelt is an inference from WO-140-D001's receipts, where skeleton's nested launches failed inside harness sandboxes with 'sandbox-exec refused its local probe'",
    "FINAL-001 reviewer probe: a nested sandbox-exec inside an outer one printed 'sandbox-exec: sandbox_apply: Operation not permitted', exit 71",
    "node --test --test-name-pattern=\"WO-140 the real inventory\" scripts/test-runner.test.mjs: 1 of 1 pass with the expectation [[skeleton, outside-sandbox], [portfolio, outside-sandbox]]"
  ],
  "rejected": [
    {
      "option": "Remove the declaration",
      "reason": "The receipt shows the suite cannot pass inside. Without the declaration, npm test inside a harness sandbox would run the suite and fail for an environmental reason, instead of refusing before any suite and printing the outside command."
    },
    {
      "option": "Run discovery through discoverWithinActor, or skip the nested tests, when a probe is refused",
      "reason": "WO-140 declined silent skips of outside-only suites, and the inherited-boundary path would stop criterion 1's fixture exercising the confined launch it evidences, leaving a green suite that no longer tests what it names."
    },
    {
      "option": "Declare from the reviewer's generic nested-probe observation alone",
      "reason": "WO-140-D001 asks for a receipt tied to the suite; the in-profile suite run names the refused launch and the tests it stops."
    },
    {
      "option": "NoOp",
      "reason": "The reviewer gate stays red on runner-fixtures and the declaration stays unevidenced."
    }
  ],
  "reopens": {
    "decisionId": "WO-100-D014",
    "observation": "The portfolio suite's outside-only cause is recorded with an in-profile receipt tied to the suite; the WO-140 inventory expectation, the runner comment and product 07 §Gate sandbox preflight name portfolio beside skeleton."
  },
  "reopenWhen": "The portfolio suite passes inside a harness sandbox (for example once discovery and the WO-054 witness use an inherited boundary under a refused probe), a macOS harness sandbox stops being Seatbelt, or a receipt shows a harness sandbox refusing the suite for another cause."
}
```

**Goal alignment.** Mission and critical path: the gate's preflight is what
tells a sandboxed verifier to run the product gate outside, so an evidenced
declaration keeps the verified loop to WO-111 reviewable. Rule beating and
seeking the wrong goal: the rejected skip would have turned the suite green
inside by no longer testing the confined launch; the declaration keeps the
suite honest and moves it outside. Drift to low performance: the evidence is
a suite run in the refusing environment, not the reviewer's generic probe.
Policy resistance and success to the successful: WO-140's rule is applied as
written, through its own reopening condition. Tragedy of the commons and
escalation: one declaration, one test expectation, one product sentence.
Shifting the burden to the intervenor: a sandboxed session gets the refusal
and the outside command before any suite runs. **Naive Interventionism:**
nothing in the runner's behaviour changes; the declaration already existed,
and only its record and the invariant that checks it change. **NoOp** is
rejected above.

## WO-100-D019

```json
{
  "id": "WO-100-D019",
  "kind": "correction",
  "date": "2026-09-22",
  "dispatch": "resume: fix; FINAL-001 F3 (WO-100-D015)",
  "misread": "WO-100-D011 and WO-100-D012, and VER-002 and repair-002.md, which quote them, cite 'docs/AI-HARNESS-SECURITY.md §Planning refutation' as the section that states the planning-refutation command's defaults. No such section exists.",
  "meant": "The 'Entropy Reducer launch line (WO-151, 2026-09-22)' paragraph of docs/AI-HARNESS-SECURITY.md (lines 355-366 at this subject). It states the `npm run entropy -- review | refute` defaults, claude-opus-5-5 at xhigh and gpt-6-sol at xhigh, with the previous pair in parentheses. Those are the same values, in the same form, as scripts/refute-plan.mjs's defaults, but the paragraph is about the entropy command, not refute-plan.mjs. The binding comparison in D011 and D012 is the guide against scripts/refute-plan.mjs lines 262-272, which both decisions also cite, so their conclusions stand.",
  "changed": "No document changes. D011, D012, VER-002 and repair-002.md keep their bytes; this record supersedes their section citation.",
  "decision": "Correct the citation by a dated record, not by editing the earlier decisions or the immutable verification report.",
  "evidence": [
    "grep -n -i '^#.*refut|planning refutation' docs/AI-HARNESS-SECURITY.md: no match",
    "grep -n 'claude-opus-5-5|gpt-6-sol' docs/AI-HARNESS-SECURITY.md: only lines 361-362, inside the Entropy Reducer launch line paragraph",
    "scripts/refute-plan.mjs:265-271: claude-opus-5-5 for claude-cli-print, gpt-6-sol for codex-cli-exec, xhigh for both external transports",
    "docs/planning/refutations/README.md:116: the guide states claude-opus-5-5 at xhigh and gpt-6-sol at xhigh"
  ],
  "rejected": [
    {
      "option": "Edit D011, D012 or repair-002.md in place",
      "reason": "Recorded decisions and receipts keep their bytes, and VER-002 is immutable; a correction record is the established form (WO-100-D008)."
    },
    {
      "option": "Add a Planning refutation section to docs/AI-HARNESS-SECURITY.md so the citation resolves",
      "reason": "Beyond the literal correction, and it would duplicate the refutation guide's own statement of the defaults."
    }
  ],
  "reopenWhen": "A later record repeats the nonexistent section citation, or the security document gains a statement of refute-plan.mjs's defaults."
}
```

## WO-100-D020

```json
{
  "id": "WO-100-D020",
  "date": "2026-09-22",
  "dispatch": "resume: fix; FINAL-001 F2 and F4 (WO-100-D015)",
  "decision": "F2: say that the Entropy Reducer's Fable 5.1 pin lasted through `v0.43.0` in docs/instance/entropy-reducer/README.md and product 03 §First live Entropy Reducer use. F4: in both portfolio curve fixtures, make the first order fail in widen, the non-last phase where a pass would advance to peak, so the asserted return to probe can only be the reset. The second widen order passes and advances, and peak is then refused on the spent episode budget while it still admits the Sort move. A unit case refuses peak on spent wall time and, separately, on spent reported tokens, with episodes left and a candidate admitted. decodePortfolioBinding accepts only a 40-hex base, because WO-054 prepares no other form.",
  "evidence": [
    "git show 28f9f870:packages/skeleton/src/loadouts/entropy-reducer.ts: ENTROPY_REDUCER_REVIEWER_MODEL is claude-fable-5-1 at v0.43.0 (git ls-remote: refs/tags/v0.43.0^{} is 28f9f870)",
    "packages/compiler/src/presence.ts:130-150 (FINAL-001): the last phase's verified-success wraps to the first phase with the failure's actions, so a failure in peak cannot show a reset",
    "docs/evidence/WO-100/repair-003-portfolio-unit.tap: 6 of 6 pass; the curve test's calls are fail in widen, pass in widen, and states widen, probe, widen, peak, then 'budget exhausted: 2 of 2 episodes' in peak",
    "docs/evidence/WO-100/repair-003-portfolio-e2e.tap: 3 of 3 pass with the real WO-052 and WO-054 hosts; WO-054 fails the wrong lint fix in widen and passes the test fix",
    "Negative controls on the built resident-state.js, restored byte for byte after each: turning every failure into verified-success fails the unit curve test and the new end-to-end curve ('peak' !== 'probe') but leaves the previous end-to-end curve green (exit 0, 1 of 1); removing the episode check fails both new curves ('probe' !== 'peak', the Sort move ran); removing the wall or the token check fails the new unit case (no refusal recorded)",
    "packages/skeleton/src/verification-worktree.ts:255 and packages/compiler/src/verification.ts:507 require a 40-hex base; scripts/lib/derived-orders.mjs:148 and source-change-command.ts:134 admit 40 or 64",
    "node scripts/{authority,artifact-identity,feedback,verification}-evidence.mjs --check: all four exit 0 after the portfolio.ts change"
  ],
  "rejected": [
    {
      "option": "Say 'before WO-100' instead of 'through v0.43.0'",
      "reason": "Both were offered; 'through v0.43.0' keeps the release-labelled form both sentences already use and names the last release that shipped the pin."
    },
    {
      "option": "Change only the unit fixture",
      "reason": "The end-to-end curve had the same weakness: under the failure-to-success mutation the previous end-to-end curve still passed, so its real WO-054 verdict did not evidence the reset."
    },
    {
      "option": "Keep 64-hex bindings and record why",
      "reason": "No reason survives: WO-054's worktree preparation and the compiler's snapshot contract refuse a non-40-hex base, so such an order would activate, spend its one attempt through WO-052 and never verify."
    },
    {
      "option": "Cover the wall-time refusal only, as D015's follow-up words it",
      "reason": "FINAL-001 F4 names both the wall-time and the token refusal as uncovered, and the token case is the same fixture with one budget field and one reported count changed."
    }
  ],
  "reopens": {
    "decisionId": "WO-100-D015",
    "observation": "The two labels say v0.43.0, D019 corrects the citation, both curve fixtures reset from a non-last phase and refuse at the budget with an in-phase candidate left, wall-time and token refusals have a case, and the binding admits only 40-hex bases; each new assertion fails under its negative control."
  },
  "reopenWhen": "WO-054 prepares SHA-256 bases, or a verifier shows a curve fixture that stays green under a reset or budget regression."
}
```

**Goal alignment.** Mission and critical path: criteria 2 and 3 now rest on
evidence that fails when the reset or the budget order regresses, which is
what WO-111 will rely on when no operator is watching. Drift to low
performance and rule beating: every new assertion was run against the
mutation it guards, and the previous end-to-end curve was shown to miss one.
Seeking the wrong goal: the budget refusal is asserted with work still
admitted, so it reads as the budget's refusal, not an empty phase. Policy
resistance and escalation: no runtime behaviour changes except the binding's
commit form, which only refuses what could never verify. Tragedy of the
commons: two fixtures and one unit case; the full gate runs once. Success to
the successful and shifting the burden: the fixes reuse the existing hosts
and doubles. **Naive Interventionism:** the one behaviour change narrows
input the resident already could not complete, and restoring one regular
expression reverts it. **NoOp** would leave FINAL-001's findings open. No
second economy experiment is started: D002 is this order's one decision.
