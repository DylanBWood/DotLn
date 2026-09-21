# WO-148 decisions — Bind a resident to the active order

Dispatch: `resume: next` on 2026-09-21, Claude Code executor, model
`claude-opus-5[1m]`, effort `xhigh` (operator-attested; the harness exposes no
effective effort readback). Authority:
`docs/work-orders/WO-148-resident-binding.md`.

## WO-148-D001

```json
{
  "id": "WO-148-D001",
  "date": "2026-09-21",
  "dispatch": "resume: next; WO-148 objective and design §Who owns the binding",
  "decision": "One explicit operator command, `node scripts/resident-bind.mjs WO-NNN --surface <path>... --transport <name> --model <model> --effort <level> [--base <commit>]`, owns the binding. It reads the canonical control state for the order in that order's own worktree, locates the worktree through `git worktree list` by the branch the order names, and writes the store. Activation does not generate it and the worktree helper is not edited.",
  "evidence": [
    "scripts/worktree.mjs `start`: activation runs inside the helper before `scripts/bootstrap.mjs` prepares the worktree, so a failing bind there would fail activation itself",
    "docs/work-orders/WO-148-resident-binding.md §Design: the transport, model and effort are the operator's choice at launch (WO-122's rule that a CLI worker's launch is an observed row)",
    "scripts/lib/control-store.mjs `readControl`: control segments are read from the working tree, and WO-148's own activation event lives untracked in this worktree at docs/control/orders/WO-148.jsonl — canonical state for an in-flight order is in its worktree, not in main",
    "Executed: scripts/test-resident-bind.mjs, 10 cases, all passing"
  ],
  "rejected": [
    {
      "option": "Generate the store at activation inside `worktree start`",
      "reason": "Activation precedes bootstrap, so the store would be written before the worktree can run anything, and a bind failure would fail the activation it is attached to. The transport, model and effort are also not known at that moment."
    },
    {
      "option": "Add a bind step to the worktree helper",
      "reason": "Same ordering problem, and it would put the declaration in a file this order does not otherwise touch. The order allows the helper to print a hint and requires nothing; no hint was added, so `scripts/worktree.mjs` is unchanged."
    },
    {
      "option": "Read canonical state from the launchpad rather than the bound worktree",
      "reason": "The main checkout does not carry an in-flight order's activation or phase events until the branch merges; binding from it would read a phase that does not exist yet."
    }
  ],
  "reopenWhen": "An operator binds often enough that the separate command is the friction rather than the cure, or a later order makes activation know the transport, model and effort."
}
```

## WO-148-D002

```json
{
  "id": "WO-148-D002",
  "date": "2026-09-21",
  "dispatch": "resume: next; WO-148 operator-review assumption 1 and design §Store lifetime",
  "decision": "A store is `<launchpad>/<control root>/local/resident/WO-NNN-<n>/`, holding `resident.json` and `binding.json` at mode 0600 under a 0700 directory, where `<n>` is the next unused index for that order. The launchpad is the one `findLaunchpad()` resolves. A rebind writes the next index and never touches an existing store.",
  "evidence": [
    "packages/skeleton/src/resident-state.ts `decodeResidentConfiguration` and packages/skeleton/README.md §Resident host: configuration is immutable within a store and the old store is retained for inspection",
    "scripts/lib/config.mjs `docPath`/`docRelative`: the control root is configurable (WO-069), so the lane follows a declared `dotln.config.json` rather than a hard-coded `docs/`",
    ".gitignore `/docs/control/local/`: the lane is ignored, which is what keeps physical paths out of every committed surface",
    "Measured: the binding record for WO-148 is 1,494 bytes and `resident.json` is 290,006 bytes (the compiled Contributor graph and the pinned capsule). The order's cost estimate said 'a few hundred bytes' for the record; the observed figure is about five times that, and the store itself is the larger cost.",
    "Executed: the rebind fixture asserts WO-999-2 is created while every byte and the mtime of WO-999-1 are unchanged"
  ],
  "rejected": [
    {
      "option": "A `.runtime/` directory inside the bound worktree",
      "reason": "Operator-review assumption 1 puts the store in the launchpad's control lane, and `.runtime/` is disposable material that `worktree finish` discards — a retained store must outlive the worktree it judged."
    },
    {
      "option": "Force the store into the main-branch checkout with `mainWorktree()`",
      "reason": "That bypasses the configured document roots WO-069 established; a launchpad declared by `dotln.config.json` need not be the main worktree. The command instead uses the same launchpad derivation every other script uses."
    },
    {
      "option": "Rewrite one store per order in place on a rebind",
      "reason": "`decodeResidentConfiguration` refuses a changed configuration against a started store, and the runbook keeps the old store for inspection. Writing a new index is that rule kept, not worked around."
    }
  ],
  "followup": "Not repaired here: when the operator runs the bind from inside the bound worktree rather than the main checkout, the store lands in that worktree's ignored control lane, and `worktree finish` then preserves it into main as ordinary retained control material — including a stale lock directory. It is inert and inspectable, but it is copied rather than pruned. Prune eligibility of retained bound stores is an explicit non-goal of this order and reopens with WO-142 D022's prune follow-up.",
  "reopenWhen": "A retained store is needed after its worktree is removed and the preserved copy cannot be read, or the prune follow-up decides bound-store eligibility."
}
```

## WO-148-D003

```json
{
  "id": "WO-148-D003",
  "date": "2026-09-21",
  "dispatch": "resume: next; WO-148 objective",
  "kind": "correction",
  "decision": "The store's compilation environment is the Contributor build's `contributor.project` environment with `capabilities: [\"actor.cli-worker\"]` added, and the command declares the vision path and thesis headings itself. The saved Contributor build is unchanged.",
  "misread": "The order's objective says the store carries 'the vision path and thesis headings the Contributor build's mission policy uses', which reads as though the policy declares them.",
  "meant": "`CONTRIBUTOR_MISSION_POLICY` declares the `mission-check` phase, its cadence, scope and envelope, and nothing else. It declares no `MissionSource`, no vision path and no thesis headings; the only ones in the repository are the mission fixture's. The bind therefore has to declare them, and it does so against this project's own vision document.",
  "changed": "`scripts/resident-bind.mjs` exports `MISSION_THESIS_HEADINGS` (four `docs/product/00-vision.md` sections), `MISSION_DECISION_LIMIT` (5, matching the fixture's window) and `MISSION_ENVIRONMENT_CAPABILITY`, and builds the environment from them. A heading the vision does not carry is skipped by `missionTheses`; a vision with none refuses.",
  "evidence": [
    "packages/skeleton/src/loadouts/contributor.ts lines 253-281: the whole declared policy, with no MissionSource, vision path or thesis heading",
    "grep for `thesisHeadings` across packages and scripts: only mission-check-protocol.ts, mission-check-source.ts and the fixture and test that supply them",
    "packages/compiler/src/presence.ts: `availability` is `NoOp` while a phase's `requiredCapabilities` are missing from the compilation environment, and the saved Contributor environment declares `capabilities: []`",
    "docs/product/03-architecture.md §Operator-presence policy: 'The saved Contributor build declares no runtime capability, so the compiled phase is a NoOp naming `actor.cli-worker` until a host supplies it'",
    "Executed probe: compiling `contributorWithSupports()` with `capabilities: [\"actor.cli-worker\"]` yields `availability: { kind: \"ready\" }` and `requiredEvidence: [\"resolved-worktree\"]` for the mission-check phase, which is why the store's `evidence` is exactly that",
    "Executed: a real store bound to WO-148 records `ResidentConfigured` under `dotln resident --once` and dispatches nothing while the operator is present"
  ],
  "rejected": [
    {
      "option": "Keep the saved environment's empty capability list",
      "reason": "`ResidentHost` checks `phase.availability` before it consults its own runtime capability list, so the cadence would record `ActorUnavailable` forever and never dispatch. The store would look correct and judge nothing."
    },
    {
      "option": "Add the capability, vision path and thesis headings to the Contributor graph itself",
      "reason": "That changes the compiled build identity and the authority-evidence baselines WO-099 D013 and D017 protect, for a declaration only a bound store needs. The order also scopes the deliverable to the command, its tests and three write-backs."
    },
    {
      "option": "Take the thesis headings from a command-line flag",
      "reason": "They are a property of the project's vision, not of one binding; a per-bind flag would let two stores judge the same worktree against different theses with nothing recording why."
    }
  ],
  "reopenWhen": "A second build needs a bound resident, at which point the vision path, thesis headings and decision window belong on the presence policy rather than in this command; or the vision's section titles change and a bind silently drops a thesis."
}
```

## WO-148-D004

```json
{
  "id": "WO-148-D004",
  "date": "2026-09-21",
  "dispatch": "resume: next; WO-148 design §Declared surfaces and operator-review assumption 2",
  "decision": "Declared surfaces are exactly the repository-relative paths typed on the command line. A bind with none refuses; a duplicate refuses; a path that is not repository-relative refuses. A declared surface that does not exist in the worktree yet is printed as an advisory note and binds anyway.",
  "evidence": [
    "packages/skeleton/src/mission-check-protocol.ts `MISSION_SURFACE_CLAUSE` and the structural out-of-surface finding: every judgment leans on the declaration, so a wrong declaration is a wrong judgment",
    "docs/work-orders/WO-124-impact-surfaces-derivation.md: deriving surfaces is that order's contract, not a convenience available here",
    "Observed while binding WO-148 itself: `scripts/test-resident-bind.mjs` did not exist when the first bind ran, which is the ordinary case for an order that adds files"
  ],
  "rejected": [
    {
      "option": "Derive the surfaces from the order's prose or the work-order map's catalog column",
      "reason": "A machine-derived surface list is a product decision the mission check leans on, and WO-124 owns it. Deriving it here would change that contract under cover of a convenience."
    },
    {
      "option": "Refuse a declared surface that does not exist yet",
      "reason": "An implementation order ordinarily declares files it is about to create; refusing them would make the honest declaration impossible and push the operator toward a vaguer one."
    },
    {
      "option": "Accept a bind with no surface and let the capsule declare none",
      "reason": "`assertMissionSource` requires at least one, and a capsule with no declared surface can never produce the out-of-surface finding the check exists for."
    }
  ],
  "reopenWhen": "WO-124 derives surfaces, at which point the command should offer the derived list as a default the operator confirms rather than types."
}
```

## WO-148-D005

```json
{
  "id": "WO-148-D005",
  "date": "2026-09-21",
  "dispatch": "resume: next; WO-148 design §Staleness and acceptance criterion 2",
  "decision": "`--check <store>` compares five things with canonical state — the order's phase, the worktree the branch now resolves to, the base commit, the contract bytes the capsule pinned, and the mission source the store itself declares — names every mismatch, prints no launch line and exits non-zero. A control segment that gained events without changing the phase is an informational note, not a mismatch. Nothing inside the resident is changed.",
  "evidence": [
    "packages/skeleton/src/cli-actor.ts: each dispatch re-observes from `spec.missionSource` but reuses `missionPin(spec.request.subject)`, so the pinned contract is fixed at bind and a contract edited afterwards is exactly the drift `--check` can see before a launch",
    "Executed: the `--check` fixture drives an edited contract, a closed order, a moved worktree and a pruned worktree, and asserts both the named mismatch and the absence of any launch or `DOTLN_RESIDENT_STORE` line",
    "The store comparison catches a hand-edited `resident.json` whose declared source no longer matches its own binding record"
  ],
  "rejected": [
    {
      "option": "Refuse a stale subject inside `resident-host.ts`",
      "reason": "That is a runtime change with replay consequences on every recorded store, and an explicit non-goal of this order. A resident already running keeps judging the subject it was declared with; that is the recorded limit, and it reopens with WO-111's evidence."
    },
    {
      "option": "Treat any change to the order's control segment as staleness",
      "reason": "Every lifecycle event changes those bytes, so the binding would read stale after the first transition even when the phase, worktree, base and contract are all unchanged. The phase covers what actually matters and the byte change is reported as a note."
    },
    {
      "option": "Recompute the merge base even when the operator supplied `--base`",
      "reason": "WO-079's integrated-sibling case is exactly where the operator knows better than the merge base; recomputing would report a permanent mismatch against a deliberate choice. The supplied commit is instead checked for still resolving in the worktree."
    }
  ],
  "reopenWhen": "A running resident is observed judging a subject the operator had already rebound, which is the evidence that the refusal belongs inside the resident host."
}
```

## WO-148-D006

```json
{
  "id": "WO-148-D006",
  "date": "2026-09-21",
  "dispatch": "resume: next; WO-148 objective and operator-review assumption 3",
  "decision": "The base commit is the merge base of the order's branch with the first of `origin/main`, `main` that resolves in the bound worktree, recorded with the ref it used; `--base <commit>` replaces it and is recorded as operator-supplied. Neither ref resolving refuses and names `--base`.",
  "evidence": [
    "scripts/worktree.mjs `start`: the worktree is created with `git worktree add <target> -b <branch> origin/main`, so `origin/main` is the ref the branch was actually created from",
    "Executed: the real bind of WO-148 recorded the merge base with `origin/main` at c84db382; the fixture launchpad has no remote and falls through to `main`, which its assertions pin",
    "Executed: `--base` with a commit outside the worktree refuses by name"
  ],
  "rejected": [
    {
      "option": "Use the branch point recorded in the control activation event",
      "reason": "`WorkOrderActivated` carries a `baseCommit` only for a registered outside repository, not for `self`; this order's own activation event carries none."
    },
    {
      "option": "Use `main` alone",
      "reason": "A local `main` advances as other orders merge, so the merge base would move under a store that is meant to be fixed; `origin/main` is the ref `worktree start` branched from."
    }
  ],
  "reopenWhen": "A repository whose base branch is not `main` binds a resident, at which point the ref belongs in `dotln.config.json`'s repository declaration rather than in this list."
}
```

## WO-148-D007

```json
{
  "id": "WO-148-D007",
  "kind": "experiment",
  "date": "2026-09-21",
  "dispatch": "resume: next; Tinkerer — Economy equipped by default (WO-150)",
  "decision": "Build WO-148's fixtures on a minimal synthetic launchpad — `git init`, five files, one `git worktree add` — rather than copying this repository's document tree into each fixture.",
  "question": "Can the bind fixtures run the real `scripts/resident-bind.mjs` against a minimal synthetic launchpad, or do they need a copy of this repository's `docs/` tree to satisfy canonical status, the authority-path check and the mission capsule's reads?",
  "alternatives": [
    "Build a minimal launchpad per fixture: git init, a contract, a vision, one source file, a .gitignore, and one linked worktree carrying the activation event",
    "Copy this repository's docs/ tree into each fixture launchpad, as the heavier fixture suites do"
  ],
  "observation": "The minimal launchpad is adopted only if the real command binds against it unmodified and the whole suite's wall-clock stays below the measured cost of the copies it replaces.",
  "budget": { "wallSeconds": 900 },
  "execution": "run",
  "cost": {
    "wallSeconds": 214,
    "tokens": null,
    "commands": [
      "find docs -type f | wc -l",
      "/usr/bin/time -p cp -R docs \"$DOTLN_SCRATCH/docs-copy\"",
      "node --test --test-reporter=spec scripts/test-resident-bind.mjs"
    ],
    "source": "Wall-clock from naming the experiment before implementation through this record, measured against the session's own command timestamps in the granted DotLn session scratch. Tokens: null because the only counter available (node scripts/harness.mjs usage) is cumulative and dispatch-scoped, so no experiment-scoped delta was observed."
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": [
      "/usr/bin/time -p cp -R docs \"$DOTLN_SCRATCH/docs-copy\"",
      "node --test --test-reporter=spec scripts/test-resident-bind.mjs"
    ],
    "summary": "Copying docs/ once measured 1.46 s real for 154 MB across 2,368 files. The delivered suite builds 10 minimal launchpads and finishes in 3.18 s in total, including its own `git init`, commit, worktree add and the real bind. The copy alternative would have added about 14.6 s and about 1.5 GB of temporary writes per suite run on top of the same work. Per-order values stay null: this is one suite's cost, and how often the suite runs is not measured here."
  },
  "outcome": "adopted",
  "regression": false,
  "history": { "lastAdoptedImprovementAt": "2026-09-21", "experimentsSinceAdoption": 0 },
  "evidence": [
    "Measured copy: `real 1.46`, 154M, 2,368 files, then removed from the session scratch",
    "Measured suite: `duration_ms 3180.065041`, 10 tests, 0 failures",
    "The minimal launchpad is sufficient because `TOOL_ROOT` resolves the kit while `DOTLN_LAUNCHPAD` resolves the documents (scripts/lib/config.mjs), so the fixture needs only the documents the command actually reads"
  ],
  "rejected": [
    {
      "option": "Copy docs/ into each fixture",
      "reason": "It buys nothing the command reads: the bind touches one authority file, one vision document, one control segment and an optional decisions file. The measured price is 1.46 s and 154 MB per fixture."
    },
    {
      "option": "Share one launchpad across all ten cases",
      "reason": "Four cases mutate canonical state, the contract bytes or the worktree's location, so a shared launchpad would make their order significant. The per-case cost is about 0.3 s, which is not worth that coupling."
    },
    {
      "option": "Decline the experiment",
      "reason": "The deciding observation cost one `cp` and one suite run that had to happen anyway, well inside the 900 s budget."
    }
  ],
  "reopenWhen": "The bind starts reading a document the minimal launchpad does not carry, so the fixture has to grow toward a copy, or the suite's wall-clock exceeds the copy cost it replaced."
}
```

## WO-148-D008

```json
{
  "id": "WO-148-D008",
  "date": "2026-09-21",
  "dispatch": "resume: next; Adjacent Repair, queue item adjacent-0001",
  "decision": "Correct the one sentence in the README release block that still says the Tinkerer economy support 'stays off by default while the three-order trial establishes whether its savings justify its cost', inside the same block edit this order's release preparation already makes. No other README prose changes.",
  "evidence": [
    "packages/skeleton/src/loadouts/executor-supports.ts:89 `\"tinkerer-economy\": true` — the shipped default is on",
    "git show e39de5bc -- README.md: WO-150's write-back reached product 05 and its own decisions but never the README, so the published claim was left contradicting the delivered default",
    "Executed: `node scripts/release.mjs check-surfaces --local` exit 0 and `node scripts/check-publication.mjs` exit 0 after the edit",
    "npm run adjacent -- list: adjacent-0001 queued, announced as intent, started after a check-in and completed with both passing checks"
  ],
  "rejected": [
    {
      "option": "Leave it for a later order",
      "reason": "It is a false claim on the repository's published front page, the file was already being edited for this order's release version, and the whole repair is one sentence with two passing checks."
    },
    {
      "option": "Rewrite the surrounding release-block paragraphs while there",
      "reason": "The release block is reviewed publication text; the bounded repair is the sentence that became false, and widening it would put unreviewed prose into a published surface under cover of a version bump."
    }
  ],
  "reopenWhen": "A support default changes again without a README write-back, which would mean the release block needs a generated claim rather than hand-maintained prose."
}
```

## WO-148-D009

```json
{
  "id": "WO-148-D009",
  "date": "2026-09-21",
  "dispatch": "resume: next; Adjacent Repair, queue item adjacent-0002 (deferred)",
  "decision": "Record, but do not repair here, a reproducible defect that makes every `claude-cli-print` mission check fail before any model call: `missionReferenceIds` emits duplicate `contract-clause` reference ids, and the Claude CLI refuses the resulting JSON Schema. WO-148's live row is collected on `codex-cli-exec`, which is unaffected.",
  "evidence": [
    "packages/skeleton/src/mission-check-protocol.ts:645-649 `missionReferenceIds` concatenates `subject.contract.clauses` with `subject.observation.contract.clauses`; when the contract has not changed mid-episode — the ordinary case — the two lists are identical",
    "packages/skeleton/src/mission-check-protocol.ts:730-763 `missionCheckResultSchema` puts that list straight into the `reference` enum, so the emitted enum carries every clause id exactly twice",
    "Reproduced against a real bound store: the Claude CLI exits 1 with no stdout and `Error: --json-schema is not a valid JSON Schema: data/properties/findings/items/anyOf/0/properties/reference/enum must NOT have duplicate items (items ## 9 and 19 are identical)`; the transport records `transport-failed` after 1.28 s",
    "Negative control: the same binary, model, effort and every other transport flag succeed against a trivial prompt with no `--json-schema`, so the refusal is the schema and not the CLI, the model, the effort or authentication",
    "`validateMissionCheckResult` is unaffected: it tests membership with `includes`, which duplicates do not change",
    "The same capsule judged on `codex-cli-exec` returned a verdict, so the defect is transport-specific"
  ],
  "rejected": [
    {
      "option": "Deduplicate the enum in this order",
      "reason": "It edits the mission-check result schema, and this order's release classification states 'No kernel, resident-host, event, schema or hook change'. The schema is shared by every CLI worker request kind, so the change needs its own regressions, a skeleton component bump and its own classification."
    },
    {
      "option": "Work around it in the bind by refusing the claude-cli-print transport",
      "reason": "The bind would then hide a defect in code it does not own, and the transport is legitimate for every other request kind. Naming the defect with its reproduction is the honest result."
    },
    {
      "option": "File the live row as `blocked` on the failing transport and stop",
      "reason": "Criterion 4 admits a blocked row, but an observed one was available on the other transport and proves more about the binding. Both observations are recorded."
    }
  ],
  "followup": "Deferred to a separate work order (queue item adjacent-0002): deduplicate the `contract-clause` reference ids, preserving first-seen order, at the schema site or inside `missionReferenceIds`, and add a regression asserting the emitted mission-check schema carries no duplicate enum item for an unchanged contract while still accepting a changed one. Until then no `claude-cli-print` mission check can run.",
  "reopenWhen": "The deduplication lands and a `claude-cli-print` mission check returns a judgment against a real bound store."
}
```

## WO-148-D010

```json
{
  "id": "WO-148-D010",
  "date": "2026-09-21",
  "dispatch": "resume: next; WO-148 acceptance criterion 4",
  "kind": "correction",
  "decision": "The live row is collected by running the shipped `dotln presence away` and `dotln resident --once` commands against the bound store on the real clock, waiting the 900 s Contributor cadence out, and the row labels an attempt `observed` only when a judgment came back.",
  "misread": "The first collector followed WO-099's live row and drove `ResidentHost.start()` and `tick()` in process with an injected clock, and labelled the attempt `observed` on an actor-origin launch alone.",
  "meant": "Criterion 4 names the resident `--once` run, not an in-process cycle, and a row that says `observed` beside `verdict: absent` and `failure: transport-failed` overstates what was obtained. Both were caught by this order's own bound resident: the live judge returned `contract-clause:contract:criterion:4` against `scripts/evidence-resident-binding.mjs` for the first, and `exclusion:what-dotln-is-not:6` against the filed row for the second.",
  "changed": "`scripts/evidence-resident-binding.mjs` now spawns the shipped CLI for both presence and the pulse, waits `900 s + 15 s` before the first `--once` and retries up to five times at 30 s, records every `--once` exit code in `onceRuns`, and derives the label from a returned judgment with a `blockedReason` naming what stopped it otherwise. No clock is injected.",
  "evidence": [
    "docs/evidence/WO-148/live.json: the filed row, its `onceRuns` and its stated limits",
    "The superseded fake-clock row on the same store observed 19 changed paths, all inside the 15 declared surfaces, 0 omitted, base commit matching the binding, and verdict `drift` with those two findings"
  ],
  "rejected": [
    {
      "option": "Keep the in-process cycle and name the deviation in the row's limits",
      "reason": "WO-099 could do that because its criterion asked for a mechanism proof on a synthetic store. This criterion names the `--once` run against a real bound order, and the deviation was available to fix for the price of waiting out one cadence."
    },
    {
      "option": "Shorten the cadence for the collector",
      "reason": "That would make the row prove a policy no operator runs. The 900 s wait is the policy the Contributor build actually declares."
    }
  ],
  "reopenWhen": "The cadence changes, or an operator needs a live row sooner than one cadence and the collector has to inject time again — at which point the injection belongs in the row's label, not only in its limits."
}
```

## WO-148-D011

```json
{
  "id": "WO-148-D011",
  "date": "2026-09-21",
  "dispatch": "resume: next; WO-148 acceptance criterion 3",
  "kind": "correction",
  "decision": "Keep every physical path out of this order's own committed surfaces, including the implementation report, not only out of the binding record, the store and the evidence row.",
  "misread": "Criterion 3 was read as governing the three artefacts it names — the binding record, the store and the evidence row — so the implementation report reproduced the repository's usual dispatch sentence, which states the worktree by its absolute path.",
  "meant": "The criterion's own words are 'No physical path enters a committed surface'. The report is a committed surface, and an operator home directory is a physical path whether or not earlier reports carry one.",
  "changed": "The dispatch paragraph of docs/evidence/WO-148/implementation.md now names the worktree without its path. Nothing else was edited: earlier orders' filed reports are immutable records under their own criteria and were left alone.",
  "evidence": [
    "docs/evidence/WO-148/live.json: the bound resident's own judgment, `contract-clause:contract:criterion:3` with `docs/evidence/WO-148/implementation.md` as its evidence",
    "Executed: `grep -c \"/Users/\"` over every file this order adds or modifies returns 0",
    "docs/evidence/WO-150/implementation.md carries the same sentence shape, which is the convention this criterion tightens"
  ],
  "rejected": [
    {
      "option": "Treat the report as outside criterion 3 because earlier reports carry the same path",
      "reason": "Precedent is not authority. The criterion is this order's, it is unqualified, and the path adds nothing a reader needs."
    },
    {
      "option": "Redact the path in every earlier evidence report too",
      "reason": "Those are filed immutable records under their own orders' criteria; rewriting them would be an unreviewed edit to other orders' evidence. If the tightening should be repository-wide it is a separate nomination."
    }
  ],
  "reopenWhen": "A later order adopts the stricter rule repository-wide, or a reader needs the physical worktree in a report and the ignored control lane cannot hold it."
}
```

## WO-148-D012

```json
{
  "id": "WO-148-D012",
  "date": "2026-09-21",
  "dispatch": "resume: verify; VER-001 F1",
  "decision": "Fail verification until `--check` compares the complete stored `MissionSource` with its binding record instead of accepting a store that has been retargeted through an unchecked source field.",
  "evidence": [
    "scripts/resident-bind.mjs `bindingMismatches`: the store comparison names only `root`, `contractPath`, `baseCommit` and a comma-joined `declaredSurfaces` value",
    "Executed disposable probe: changing only `decisionsPath`, `visionPath`, `thesisHeadings` and `decisionLimit` returned an empty mismatch list",
    "packages/skeleton/src/cli-actor.ts `startCliEpisode`: each pulse calls `observeMissionSubject` from the stored `missionSource`, so these fields change the decisions and vision context actually judged"
  ],
  "rejected": [
    {
      "option": "Treat the omitted fields as harmless store metadata",
      "reason": "They are live inputs to every mission observation, and both the binding record and D005 claim that the store's declared source is checked before a launch line is printed."
    }
  ],
  "followup": "Repair VER-001 F1 in `resume: fix`: decode `resident.json`, compare `decisionsPath`, `decisionLimit`, `visionPath` and `thesisHeadings` as well as the existing source fields, compare surface arrays structurally rather than through joined text, and add a `--check` regression that mutates each field independently and refuses every case without printing a launch line.",
  "reopenWhen": "A stored declaration that can change the dispatch-time mission subject is added without being covered by the binding comparison."
}
```

## WO-148-D013

```json
{
  "id": "WO-148-D013",
  "date": "2026-09-21",
  "dispatch": "resume: verify; VER-001 F2",
  "decision": "Fail verification until a successful check of a relocated retained store prints launch, presence, status, export and recheck lines for the directory supplied to `--check`, not for the absent directory recorded when the store was first bound.",
  "evidence": [
    "scripts/resident-bind.mjs `readBinding` resolves and returns the checked directory, but `checkBinding` discards it and `main` calls `launchLines(binding.store)`",
    "scripts/test-resident-bind.mjs accepts a moved store as fresh but does not assert the paths in the printed commands",
    "Executed disposable probe: `--check` on the relocated directory exited 0, printed the original store in its launch lines and never printed the directory that was checked"
  ],
  "rejected": [
    {
      "option": "Make any store relocation stale",
      "reason": "The existing fixture deliberately admits a moved retained store, and relocation does not change the worktree subject; the actionable path is the checked directory."
    }
  ],
  "followup": "Repair VER-001 F2 in `resume: fix`: carry the resolved checked directory through `checkBinding`, use it for every emitted command and the success heading, retain the original path only as binding provenance, and extend the moved-store fixture to assert that every printed command names the new directory and none names the missing original.",
  "reopenWhen": "A retained store gains path-dependent content that makes relocation itself invalid, in which case `--check` should refuse it explicitly instead of printing commands for another path."
}
```

## WO-148-D014

```json
{
  "id": "WO-148-D014",
  "date": "2026-09-21",
  "dispatch": "resume: verify; VER-001 F3",
  "decision": "Fail verification until bind proves that the resolved configured control lane is ignored before it writes either path-bearing file. A configured control root does not by itself create a Git ignore rule.",
  "evidence": [
    "scripts/lib/config.mjs permits a configured `roots.control`; `scripts/resident-bind.mjs` follows it through `docPath` and writes without an ignore check",
    "The shipped `.gitignore` ignores only the default `/docs/control/local/` lane",
    "Executed real-Git disposable probe: with `roots.control` set to `records/state` and no matching ignore rule, bind exited 0 and `git status --porcelain --untracked-files=all` named both `records/state/local/resident/WO-999-1/binding.json` and `resident.json`; the binding carried absolute store and worktree paths"
  ],
  "rejected": [
    {
      "option": "Treat configured launchpads as responsible for making every local lane ignored",
      "reason": "Criterion 3 and the product write-back make the command's output location guarantee unconditional, while the configuration schema validates containment but declares no ignore precondition."
    },
    {
      "option": "Always write the default `docs/control/local` lane",
      "reason": "That would bypass WO-069's configured control root and contradict D002."
    }
  ],
  "followup": "Repair VER-001 F3 in `resume: fix`: before creating a store, use Git's ignore query against the resolved lane and refuse by path when the lane is not ignored; add configured-root fixtures for both the refusal without a rule and a successful bind with `<configured control>/local/` ignored, asserting a clean Git status in the latter.",
  "reopenWhen": "The configuration model gains an explicit private-local root whose containment and ignore policy replace this Git check."
}
```

## WO-148-D015

```json
{
  "id": "WO-148-D015",
  "date": "2026-09-21",
  "dispatch": "resume: fix; VER-001 F1, boarded as WO-148-D012",
  "decision": "`--check` compares every field of the store's declared `MissionSource` with the binding record — `root`, `contractPath`, `decisionsPath`, `baseCommit`, `declaredSurfaces`, `decisionLimit`, `visionPath` and `thesisHeadings` — element by element for the arrays, names any field the store declares and the record does not, and decodes `resident.json` with `decodeResidentConfiguration` rather than reading it as plain JSON. A store that no longer decodes is named as a mismatch and gets no launch line.",
  "evidence": [
    "packages/skeleton/src/cli-actor.ts `startCliEpisode`: every pulse re-observes from the stored `missionSource`, so the decisions window, its limit, the vision document and its theses select the context actually judged; they are not display metadata",
    "packages/skeleton/src/mission-check-protocol.ts `assertMissionSource`: `storyPath` is a source field the protocol admits and the binding never declares, so the comparison names an undeclared field instead of passing over it",
    "Executed: the defect-restored control. With the four-field joined-text comparison and the plain-JSON read put back into the shipped file, `scripts/test-resident-bind.mjs` fails exactly the two new cases (`--check names a store retargeted through any declared source field` and the `bindingMismatches` unit case) and passes the other eleven; with the repair, 13/13 pass",
    "Executed: `--check` against this repository's four retained WO-148 stores decodes each 290 KB `resident.json` and reports the phase and contract mismatches only, so decoding a real store at check time is not a new failure mode",
    "The joined-text hole is reproduced directly: a single declared surface whose text is `packages/fixture, docs/work-orders` joins to the same string as the two surfaces that were bound, and is now named as a mismatch"
  ],
  "rejected": [
    {
      "option": "Deep-compare the stored source against one rebuilt from the binding record in a single equality",
      "reason": "It refuses just as often but names nothing: the operator would be told the store differs without being told which declaration moved. The per-field list is the same guarantee with a usable message, and the undeclared-field check closes the gap a field list would otherwise leave."
    },
    {
      "option": "Keep reading `resident.json` as plain JSON and only compare fields",
      "reason": "A launch line is an instruction to run that store. A store the runtime would refuse cannot honestly be given one, and the decode is the same call the bind already makes."
    },
    {
      "option": "Refuse a retargeted store inside the resident host instead",
      "reason": "Still a runtime change with replay consequences and still this order's explicit non-goal; D005's reopening condition is unchanged."
    }
  ],
  "reopenWhen": "A stored declaration that can change the dispatch-time mission subject is added without being covered by the comparison, which the undeclared-field mismatch now makes visible at the first check rather than silently."
}
```

## WO-148-D016

```json
{
  "id": "WO-148-D016",
  "date": "2026-09-21",
  "dispatch": "resume: fix; VER-001 F2, boarded as WO-148-D013",
  "decision": "A successful `--check` prints its launch, presence, status, export and recheck lines for the directory that was checked, not for the path recorded when the store was bound. When the two differ, the bound path is printed once as provenance. `checkBinding` returns the resolved directory for that purpose.",
  "evidence": [
    "scripts/test-resident-bind.mjs `a moved store keeps its binding, and a directory without one refuses`: the relocated store is still accepted, and every printed command now names the relocated directory while none names the directory the store left",
    "Executed: the defect-restored control. With `launchLines(binding.store)` and the old heading put back, that case fails on the first printed line and the other twelve pass",
    "The store's own comparison is unaffected: relocation changes no field of the declared source, so a moved store is fresh or stale for the same reasons it was before"
  ],
  "rejected": [
    {
      "option": "Make relocation itself a mismatch",
      "reason": "The fixture admits a moved retained store deliberately, and the subject it judges is the worktree, not its own directory. Refusing would reverse a product choice this order already made, to fix a printing defect."
    },
    {
      "option": "Print both paths in every command",
      "reason": "Two candidate commands where one is wrong is the same burden shifted, with more text. One actionable path and one provenance line says what happened."
    }
  ],
  "reopenWhen": "A retained store gains path-dependent content that makes relocation invalid, at which point `--check` should refuse a moved store by name rather than print commands for it."
}
```

## WO-148-D017

```json
{
  "id": "WO-148-D017",
  "date": "2026-09-21",
  "dispatch": "resume: fix; VER-001 F3, boarded as WO-148-D014",
  "decision": "Before writing either file, bind asks Git whether the exact paths it is about to write are ignored (`git check-ignore -q` against `<store>/resident.json` and `<store>/binding.json` in the launchpad) and refuses by name when they are not, naming the lane to add to `.gitignore`. The query is asked in the launchpad for every bind, not only for a configured control root, and a Git error refuses rather than passes.",
  "evidence": [
    "scripts/lib/config.mjs `validateRootPath`: a configured `roots.control` is validated for containment only, so WO-069's configured lane moves without carrying an ignore rule; the shipped `.gitignore` names the default `/docs/control/local/` path alone",
    "Executed: `scripts/test-resident-bind.mjs` binds a launchpad configured with `roots.control` set to `records/state`. Without the matching ignore rule the command exits 1, names the lane, leaves no `records/state/local` directory behind and the launchpad's `git status --porcelain --untracked-files=all` stays empty; with `/records/state/local/` ignored the same bind writes the store, `git status` stays empty, `git check-ignore` matches both files, and `--check` accepts the result",
    "Executed: the defect-restored control. With the assertion removed from `bindOrder`, the refusal case fails and the other twelve pass",
    "Measured in a disposable launchpad: `git check-ignore -q` answers for a path that does not exist yet and matches through an ignored parent directory, which is what lets the question be asked before the store is created"
  ],
  "rejected": [
    {
      "option": "Write the default `docs/control/local` lane whenever the configured lane is not ignored",
      "reason": "It bypasses WO-069's configured control root and contradicts D002; a launchpad that moved its control root would silently get its store somewhere else."
    },
    {
      "option": "Create the ignore rule on the operator's behalf",
      "reason": "Bind would then edit a committed file of the launchpad as a side effect of writing a store. Naming the missing rule leaves that edit where it belongs, with the operator."
    },
    {
      "option": "Check the lane only when a configured control root is declared",
      "reason": "The default lane's rule can be removed too, and the guarantee criterion 3 states is unconditional. The query costs one Git call per bind."
    }
  ],
  "reopenWhen": "The configuration model gains an explicit private-local root whose containment and ignore policy replace this Git question, or a launchpad legitimately keeps its control lane outside Git's view by another means."
}
```

## WO-148-D018

```json
{
  "id": "WO-148-D018",
  "date": "2026-09-21",
  "dispatch": "resume: fix; Adjacent Repair, queue item adjacent-0003",
  "decision": "Correct the one phrase in the software-engineer edition's chapter 13 bullet that still calls the economy support default-off, so it states the delivered default and its per-order opt-out while keeping the three-order trial record the bullet already names. No other edition prose changes and no source lock is touched by the wording.",
  "evidence": [
    "packages/skeleton/src/loadouts/executor-supports.ts:89 `\"tinkerer-economy\": true` and docs/product/05-pattern-library.md §'Equipped by default, 2026-09-21 (WO-150, application v0.39.0)': the delivered default is on with a per-order opt-out",
    "docs/publication/software-engineer-toc.md chapter 13 read at its current bytes while refreshing this order's source lock: 'the default-off economy support and its three-order trial record'",
    "WO-148-D008: the identical missing write-back was repaired in the README release block earlier in this order, which makes this the same defect class on another published surface rather than a new judgment",
    "Executed: `node scripts/check-publication.mjs` exit 0 (both editions CURRENT, 30 and 45 linked source sections, 273/273 headings indexed) and `npm run test:docs` exit 0 (19 passed, 0 failed) after the edit",
    "npm run adjacent -- list: adjacent-0003 queued at revision 8, announced as intent, started after a fresh check-in and completed with both passing checks at revision 12, leaving nothing running and nothing next"
  ],
  "rejected": [
    {
      "option": "Leave the edition to WO-150's own follow-up",
      "reason": "WO-150 is closed and its write-back never reached this surface; the claim is false today on a published edition, the file was already open for this order's source-lock refresh, and the whole repair is one phrase with two passing checks."
    },
    {
      "option": "Rewrite the chapter bullet to describe the support fully",
      "reason": "The editions are reviewed audience text. The bounded repair is the phrase that became false; widening it would put unreviewed prose into a published surface under cover of a lock refresh."
    },
    {
      "option": "Also restate the default in the everyday-AI-user edition",
      "reason": "That edition's chapter 10 describes the experiment's purpose and makes no claim about the default, so there is nothing false there to repair."
    }
  ],
  "reopenWhen": "A support default changes again without reaching the editions, which would mean the published claim needs a generated projection rather than hand-maintained prose — the same reopening condition D008 recorded for the README."
}
```

## WO-148-D019

```json
{
  "id": "WO-148-D019",
  "date": "2026-09-21",
  "kind": "correction",
  "dispatch": "resume: fix; this order's own evidence claims",
  "decision": "State the product gate's scope exactly: `npm test` runs the 23-suite machinery set, and the formatter check belongs to the `--document` set that `npm run test:docs` runs. A repair that changes source claims both, and this one records a passing run of each at the final bytes.",
  "misread": "The first full-gate run of this repair — 23 suites, 0 failed, 279.04 s — was reported in chat as evidence that the changed scripts were clean, as though the gate covered every check the repository runs.",
  "meant": "It never ran the formatter over them. `scripts/test-runner.mjs` declares the `format` suite `document: true`, so `npm test` excludes it; `npm run test:docs` then failed six document suites on the preflight, naming `scripts/resident-bind.mjs` and `scripts/test-resident-bind.mjs`. The files were unformatted before that gate started, so the run was not stale evidence — it was evidence of something narrower than the claim made for it.",
  "changed": "Both files were formatted with the repository's own Prettier, the focused suite was rerun (13/13), `npm run test:docs` now passes 19/19, and the full gate was rerun at the formatted bytes: 23 passed, 0 failed, 266.62 s, exit 0, recorded against tree f314c86b with `PASS resident-bind 5.60 s` observed inside it. docs/evidence/WO-148/repair-001.md reports both runs and this scope.",
  "evidence": [
    "scripts/test-runner.mjs: the `format` suite is declared `fast: true, document: true, preflight: true`, and `package.json` maps `test` to the runner with no flags and `test:docs` to `--document`",
    "Executed: `npm run format:check` named both files before the fix and reports 'All matched files use Prettier code style!' after",
    "Recorded gate rows: 279,041 ms at tree e65e96fd (before formatting) and 266,620 ms at tree f314c86b (after), both exit 0",
    "File mtimes put both scripts' last edit before the first gate started, so the first run's format verdict was out of scope rather than cached or stale"
  ],
  "rejected": [
    {
      "option": "Report only the second gate run and drop the first",
      "reason": "The first run happened and its narrower scope is the thing worth recording; deleting it would hide the reason the second one was needed."
    },
    {
      "option": "Treat the formatter gap as a defect in the runner and queue a repair",
      "reason": "The split is deliberate — document suites are the slower, documentation-facing set — and `npm run test:docs` is a named command this role already owes for authored documents. The defect was in the claim, not the runner."
    }
  ],
  "reopenWhen": "A check that gates published source moves out of the set a role is told to run, so that a passing `npm test` again reads as broader than it is."
}
```

## WO-148-D020

```json
{
  "id": "WO-148-D020",
  "date": "2026-09-21",
  "dispatch": "resume: final review; refutation receipt 022, WO-148 known issue on criterion 2 (base drift after integrate)",
  "decision": "Record the moved merge base as an observed `--check` mismatch rather than a constructible one, and keep a regression for it in the order's own suite: after `main` advances and the order's branch integrates it, `--check` names `base commit: the binding records <old>; the merge base with <ref> is now <new>`, exits non-zero and prints no launch line, and the bind that follows records the new merge base. The capsule keeps diffing against the base pinned at bind, which is what makes a moved base visible as stale instead of silently re-read.",
  "evidence": [
    "docs/planning/refutations/2026-09-21-planning-9d2888b45f687bc6-022.md, WO-148 findings[0]: base drift after `worktree integrate` was constructible and unobserved, and criterion 2's enumerated mismatches did not name it; its reopening condition asks for the mismatch to be observed or the record to say what the capsule diffs against",
    "scripts/resident-bind.mjs `observeBinding` and `bindingMismatches`: the check recomputes the merge base with the recorded ref and names a difference; before final review this path had no real-Git fixture, only the store-field retargeting case in the `bindingMismatches` unit test",
    "Executed at final review in a disposable real-Git launchpad under the granted session scratch: bind WO-999, advance `main` by one commit, merge `main` into `wo-999`, then `--check`: the base-commit mismatch was named, exit 1, no launch or `DOTLN_RESIDENT_STORE` line; the launchpad was removed and no physical path was filed",
    "Executed: `scripts/test-resident-bind.mjs` case `a merge base moved by integrating main is named before any launch line`, added at final review; the suite passes 14/14"
  ],
  "rejected": [
    {
      "option": "Treat the receipt's reopening condition as discharged by D005 and D006 alone",
      "reason": "Both records say what the capsule diffs against and what `--check` compares, but the receipt asked for the mismatch to be observed, and a sentence in a report is not a regression that holds."
    },
    {
      "option": "Re-read the merge base inside the resident instead of refusing at the command",
      "reason": "A resident-host change is this order's explicit non-goal (D005), and the pinned base is exactly what lets a moved base be seen at all."
    }
  ],
  "reopenWhen": "`worktree integrate` learns to rebind, or a resident-side binding check lands, at which point a moved base should be handled where the integration happens rather than reported at the next check."
}
```

Goal and critical path: this is operator-workflow tooling on the resident's
path, not a dependency of the source-to-deliverable runtime. It contributes by
removing the hand-written store that made WO-099's mechanism unusable daily,
and it is what WO-100 and WO-111 will extend.

System traps, scaled to consequence. Shifting the burden is the live one: a
command that writes a store makes it cheap to have several, and a store aimed
at finished work judges nobody. The answer is not a cleanup daemon but
`--check` refusing a launch line and naming the mismatch, with prune
eligibility left explicitly undecided rather than quietly solved. Rule beating
is the second: the out-of-surface rule is only as good as the declaration, so
D004 refuses to derive it and D005 records what a running resident still
cannot see. Escalation is bounded — no gate, hook, key, receipt or recurring
check is added, and the only new recurring cost is one ignored store directory
per binding. Policy resistance, drift to low performance, success to the
successful, tragedy of the commons and seeking the wrong goal are immaterial
here: no authority, budget or outcome standard moves. Naive Interventionism:
the two runtime changes that were available — generating at activation and
refusing inside the resident host — are both declined above with their
reasons. NoOp: leaving the boundary empty keeps WO-099's mechanism in the
state the candidate recorded, where the only way to watch a real order is to
hand-write a store and the only live row is synthetic.

Judged again at the repair handoff (`resume: fix`, VER-001). The three findings
were all boundary claims the command made and did not keep, so the repair is
the narrow one in each case: compare what the store declares, print what was
checked, and ask Git before writing a path-bearing file. None of them widened
authority, added a gate, hook or recurring check, or moved the non-goals — no
automatic rebinding, derived surfaces, pruning or `resident-host.ts` change is
in this repair. Rule beating is the trap the repair answers directly: a
freshness check that passed while the judged subject had been retargeted, and
an ignored-lane guarantee that held only for the default layout, were both
green readings that did not mean what they said. Shifting the burden is the
second: a successful check that printed commands for a directory the store had
left made the operator work out which path was real. NoOp here would have kept
a command whose two advertised guarantees are false on configurations the
order claims to support.
