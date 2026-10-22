# WO-226 — An instance's kit works after its update without a hand step: the emitted release-close recovery, `worktree finish` and `npm run harness` prepare an export's carried runtime instead of a source build, one `update --finish` fast-forwards main and prepares it, every bootstrap advisory names the command an export can run, the registered-target admission judges the committed grant and the publication fields instead of whole-file equality and names a near miss, a dispatch prefix is read from the first line of pasted content, and a Fable 5.1 worker is available by operator request beside the pinned worker (version assigned at activation)

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer xhigh.
**Track:** machinery
**Release classification:** minor. One kit command (`launchpad update
--finish`), export-aware runtime preparation at three sites that today run
a source build, a narrower registered-target admission with a new advisory
class, a prefix rule that reads the first non-blank line, a second generated
worker definition and the role text that admits it on the operator's word.
No refusal weakens: the admission still requires the committed grant, the
profile and the registry; the prefix rule still records one prefix per
message; the pinned worker stays the default. Assigned at activation under
the standing opt-out default.
**Cost:** adds, in `packages/compiler/src/harness.ts`, an export branch to
the emitted `recoverReleaseClose` (the carried-runtime restore in place of
`npm run build --silent`) and the same words in the fallback advisory; in
`scripts/lib/harness-runtime.mjs`, an export-aware `refreshHarnessRuntime`
whose callers in `scripts/worktree.mjs` (finish) and `scripts/harness-entry.mjs`
pass no source build in a kit root; in `scripts/launchpad.mjs`, `update
--finish`; in `packages/skeleton/src/harness-host.ts`, the admission's
field comparison, the `near-miss` advisory and the first-line prefix rule;
in `packages/skeleton/src/loadouts/contributor.ts`, a second worker
definition and one sentence of role text; in `scripts/lib/harness.mjs`,
the second agent file; cases in `scripts/test-harness.mjs`,
`scripts/test-process-debt.mjs`, `scripts/test-launchpad-update.mjs`,
`scripts/test-launchpad-export.mjs`, `packages/skeleton/test/harness-host.test.ts`
and `scripts/test-plan-refutation.mjs`; the client README's update route;
product 07 and the kit README sentences the steps name. Removes the states
the fork met on 2026-10-21: a release close withheld on `ENOENT
tsconfig.json` in an export, a route that ends with a bootstrap the session
must remember, three user-facing texts telling an export to run a build it
cannot run, an admission withheld because an order's own registration edit
changed a byte of `dotln.config.json`, a piped spelling that left no row
and no advisory, a dispatch prefix inside a paste that left a whole planning
pass without its role, and a worker model the operator cannot select.
Re-mints: `packages/compiler/src/harness.ts` and `contributor.ts` are
registered sources of every edition, so each is re-minted deterministically
through `npm run sync` after the compiler minor, the feedback edition by
carry; `scripts/lib/harness.mjs` is a registered authority source. No
`FEEDBACK_SOURCE_PATHS` file changes, so no live feedback episode is owed.
`scripts/launchpad.mjs`, `scripts/kit/` and `scripts/lib/harness.mjs` are
declared machinery sources, so `npm test -- --review` runs before handoff.
Wall-clock: an export's recovery and finish now run the carried-runtime
restore (`prepareKitReleaseRuntime`: `verifyKit`, the input digest and the
snapshot copy; unmeasured, under the recovery's 120 s child bound) instead
of a build that fails; `update --finish` costs one fetch, one fast-forward
and one bootstrap. Context bytes: this file, about 30,000. Steps: 14.
**Nomination provenance:** the operator's note 1 of the 2026-10-21 planning
dispatch (why an instance must run bootstrap by hand after an upstream
merge: shifting the burden, non-automated, error-prone), note 6's item 2
(the hand checkout and pull of main before a release close) and the fork's
UI planning pass item 6 (a release close started before bootstrap; the
advisory could name bootstrap in both places), the fork's planning pass
item 4 (`git fetch upstream --tags` overrides `tagOpt --no-tags`), the fork's
kit-behavior question 2 (the registered-target admission against the host's
auto mode: whole-file equality, the silent piped spelling, the classifier),
the first message of the dispatch recorded as `prefix: null` by the prompt
hook, and the operator's request of the same session for Fable 5.1 at
`xhigh` as an opt-in planning subagent; all in the ignored capture, SHA-256
`4db8e10536b76209745538e6f54f2563dc7d1b34645a2cba438fd14a7812bab6`, and its
sibling messages file. Planner-synthesized by the [2026-10-21
pass](../planning/fork-notes-and-operator-questions-2026-10-21.md) (§6, §8
and §9) from a read-only research pass over the sources each step names.
Opaque identifier, not a priority. Clean-room screen: the fork is the
operator's own public instance; no target or employer material enters.
**Depends on:** WO-195 (closed: the stale-main recovery this order makes
export-aware), WO-215 (closed, v0.81.0: `prepareKitReleaseRuntime`, which
the recovery and the finish reuse), WO-221 (closed, v0.85.0: the
registered-target admission), WO-223 (closed, v0.88.0: the admission
advisory spelling this order's near-miss advisory follows). WO-227 edits
the publication helpers and WO-207 the update route's README section with
no typed edge: whichever runs second rebases.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-195",
    "relation": "satisfied-by-close",
    "reason": "the emitted stale-main recovery this order makes export-aware"
  },
  {
    "workOrderId": "WO-215",
    "relation": "satisfied-by-close",
    "reason": "the carried-runtime preparation the recovery and the finish reuse"
  },
  {
    "workOrderId": "WO-221",
    "relation": "satisfied-by-close",
    "reason": "the registered-target admission this order narrows"
  },
  {
    "workOrderId": "WO-223",
    "relation": "satisfied-by-close",
    "reason": "the advisory spelling the near-miss advisory follows"
  },
  {
    "workOrderId": "WO-227",
    "relation": "reference-only",
    "reason": "it edits the publication helpers' lint, not the admission; whichever runs second rebases"
  },
  {
    "workOrderId": "WO-207",
    "relation": "reference-only",
    "reason": "it edits the README's update route after this order's finish sentence lands; whichever runs second rebases"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** product 07 §Operator-opened planning pass
(the dispatch prefixes), §Model-specific notes (the pinned worker, the
generated `dotln-worker` definition, the readback limits), §Host
qualification and the registered-target admission (as WO-221 and WO-223
wrote it), §Preflight before the full gate; product 03 §Platform and
instance boundary; `packages/compiler/src/harness.ts` (`releaseCloseRecovery`
lines 49 to 140: the event gate at 50 to 54, the build and emit loop at 108
to 111, the withheld advisory at 137; the inline fallback at 729 to 775 and
its advisory at 755); `scripts/lib/harness-runtime.mjs`
(`harnessRuntimeCause` 15 to 70, `reportHarnessRuntime` 72 to 79,
`refreshHarnessRuntime` 203 to 218); `scripts/worktree.mjs` (finish, the
refresh at 1375 to 1384; `completeSelfStart` 507 to 515;
`startTargetWorktree` 651 to 660); `scripts/harness-entry.mjs` (16 to 20);
`scripts/release.mjs` (`ensureReleaseRuntime` 1581 to 1620, the refusal at
3475); `scripts/lib/release-kit-runtime.mjs`; `scripts/bootstrap.mjs`
(`bootstrapWorktree`); `scripts/launchpad.mjs` (the usage at 2131 to 2132,
`main`); `scripts/resume.mjs` (1280, 1318, 2443); `scripts/lib/worktree-integration.mjs`
(384 to 390, the guarded regenerate); `packages/skeleton/src/runtime-inputs.mjs`
(`isKitRoot`, `hasPackageSources`); `packages/skeleton/src/harness-host.ts`
(`operatorPrefixes` 1065 to 1073, `recordOperatorMessage` 1175,
`plainShellWords` 1384 to 1410, `registeredTargetAdmission` 1614 to 1898:
`committed` 1654 to 1671, the registration and grant reads 1672 to 1760,
the admission response 1879 to 1891; the PreToolUse caller 5478 to 5502);
`packages/skeleton/src/loadouts/contributor.ts` (`sharedCorrections` line
64, the `worker` field at 881, `targetWorkerProfiles`);
`scripts/lib/harness.mjs` (the agent-file emit, line 290's path rule);
`scripts/test-harness.mjs` (the WO-195 stale-main case 2621 to 2700; the
agent pin case 5574 to 5584); `scripts/kit/README.client.md` §Taking
upstream updates (585 to 728: the tag fetch at 642 to 659, the route's end at
697 to 700) and §First steps (113 to 121); `docs/evidence/WO-221/host-qualification.md`
(the Claude Code row as the 2026-10-21 pass rewrote it); the [2026-10-21
planning document](../planning/fork-notes-and-operator-questions-2026-10-21.md)
§6, §8 and §9.

**Objective:** An instance's session finishes a starter update and a
release close without a step the kit did not run for it, the kit's admission
and prefix rules judge what they mean to judge, and the planner can ask for
the newest model:

- **The carried runtime is prepared where a build was tried.** In a kit
  root (`isKitRoot`), the emitted `recoverReleaseClose` runs the
  carried-runtime restore (`scripts/lib/release-kit-runtime.mjs`) and
  `harness emit` in place of `npm run build --silent`; `worktree finish`
  and `npm run harness` do the same; every advisory and refusal that tells
  an export to run `npm run build` names `node scripts/bootstrap.mjs` or the
  restore instead. In core nothing changes.
- **One command finishes the update.** `node scripts/launchpad.mjs update
  --finish` on a clean `main` fetches `origin`, fast-forwards `main` to
  `origin/main`, runs `bootstrapWorktree(root)` and prints what it did; it
  refuses, naming the fact, on a dirty tree, a non-fast-forward or a
  checkout that is not `main`. The README's route ends with it, and names
  that an explicit `--tags` fetch overrides `remote.upstream.tagOpt`.
- **The admission judges authority, not bytes.** The registered-target
  admission reads main's committed `dotln.config.json` and compares, between
  the worktree and main, only the registration's publication fields
  (`baseBranch`, `authorityProfile`, `release`, the roots) and the grants
  file, so an order that edits its own registration's gate commands is
  still admitted; any other difference in those fields withholds with the
  field named. A helper spelling that `plainShellWords` cannot parse but
  that begins with the admitted node spelling writes a `near-miss` advisory
  naming the shell syntax that hid it (a pipe, a redirect, a prefix), with
  no admission.
- **A prefix inside a paste is a prefix.** `recordOperatorMessage` finds the
  dispatch prefix at the start of the first non-blank line of the prompt
  after any fence or pasted-content framing the host adds, records which
  line held it, and still records one prefix per message.
- **The newest model on request.** `harness emit` writes
  `.claude/agents/dotln-worker-fable.md` (`model: claude-fable-5-1`,
  `effort: xhigh`) beside `dotln-worker`; the planner, refuter and reviewer
  role text admits it only when the operator's dispatch names it (the
  words `fable` or `fable 5.1` in the `planning:` or `resume:` line), the
  pinned worker stays the default, the direct refutation receipt and the
  response record which worker type ran, and product 07 §Model-specific
  notes states the opt-in.

**Observed gap (dated 2026-10-21 at `main` `926b8234`):**

- The tracked hooks import a content-addressed snapshot under the ignored
  `.runtime/harness/<hash>` (`scripts/lib/harness.mjs` 732 to 733;
  `packages/compiler/src/harness.ts` 779; `scripts/kit/gitignore.template`
  29). Fast-forwarding `main` to a merged update brings hook pins that name
  a new snapshot and installs nothing (`scripts/test-harness.mjs` 2660 to
  2661 states it for core). `worktree start` bootstraps only the checkout it
  creates (`scripts/worktree.mjs` 507 to 515, 651 to 660). The two repairs
  that run on `main` both try a source build: the emitted
  `recoverReleaseClose` (`harness.ts` 108 to 111, no `isKitRoot` check) and
  `worktree finish`'s refresh (`worktree.mjs` 1375 to 1384); `npm run
  harness` (`harness-entry.mjs` 16 to 20) builds unguarded too. In an export
  `scripts/build.mjs` copies `tsconfig.json`, which the export lacks, so the
  fork's close on 2026-10-21 was withheld with `runtime preparation failed
  at npm run build --silent: ENOENT tsconfig.json`; after a hand bootstrap
  the close ran three times (dry run, publish, idempotent retry), and the
  journal held 125 `snapshot-missing` rows for that session. Only release
  close's own `ensureReleaseRuntime` (`release.mjs` 1594 to 1605) handles an
  export, through `prepareKitReleaseRuntime`. The README's route ends with
  a manual bootstrap on `main` (`README.client.md` 697 to 700); three texts
  still say `npm run build` (`release.mjs` 3475, `resume.mjs` 1280 and
  2443) and `refreshHarnessRuntime`'s message always does (`harness-runtime.mjs`
  210). `BOOTSTRAP_HATCH_TEXT` (`harness-host.ts` 4277) is exported and
  unused. DotLn installs no Git hook, by recorded stance (`docs/LEGAL.md`
  19; WO-038; WO-063; `packages/skeleton/README.md` 815 to 822).
- `launchpad.mjs`'s verbs are `export`, `export --update`, `preview --from`
  and `verify` (2131 to 2132); nothing finishes an update. The README sets
  `remote.upstream.tagOpt --no-tags` (642 to 649) and says nothing of an
  explicit `--tags` fetch, which delivered the starter's four annotated tags
  into the fork before its session deleted them.
- `registeredTargetAdmission` reads `dotln.config.json` and
  `packages/skeleton/loadouts/grants.json` from main's `HEAD` and withholds
  when either checkout's working file differs by a byte (`committed`,
  1654 to 1671: `publication authority differs from main's committed
  <file>`), then uses only `roots`, `repositories[<id>].baseBranch`, the
  `authorityProfile` and the operator grant (1672 to 1760). The fork's
  WO-006 added a gate command to its registration, so the plain spelling was
  withheld at the verified-phase draft and would be at the closed-phase
  publish; `plainShellWords` returns null on `|` (1408), so the piped
  spelling wrote no admission row and no advisory (the permissions handler
  still journals `{ effect, allowed }`, 5497). Both calls were then denied
  by the host's auto-mode classifier (`[Unrequested Commit in a Connected
  App]`, `[Create Public Surface]`); whether a hook `allow` prevails over
  that classifier is undocumented and unqualified (the host-qualification
  row as rewritten on 2026-10-21; a research pass over the host's published
  pages on 2026-10-21 found no sentence either way), and no live episode
  has yet seen the admission return `allow`.
- `recordOperatorMessage` (1175) matches a prefix only at
  `prompt.trimStart()`. The 2026-10-21 dispatch, pasted as one block whose
  first line was `planning: …`, was recorded `prefix: null`, `role:
  unknown`: no planner role, no outside-write grants (three scratchpad
  writes refused as `role unknown`), no usage readback, until the operator's
  bare `planning:` thirty minutes later; the Skill dispatch and the writer
  reservation were unaffected.
- `contributor.ts` declares one worker (`worker: { name: "dotln-worker",
  model: "claude-opus-5-5", effort: "xhigh" }`, 881); the shared role text
  (64) and product 07 §Model-specific notes pin every spawned worker to it;
  the agent-pin test (`test-harness.mjs` 5574 to 5584) admits `model:
  claude-opus-5-5` or `inherit`. The direct refutation receipt records
  `model: "unknown"` (`plan-direct.mjs` 307) and accepts any model string
  (`plan-receipts.mjs` 357), so the receipt does not pin.

**Design (scope discipline):**

- *Export detection where the build is tried.* The recovery imports
  `packages/skeleton/src/runtime-inputs.mjs` (`isKitRoot`), a build-free
  module exports carry, as it already imports `writer-teardown.mjs` and
  `gate-evidence.mjs`; in a kit root it runs `node
  scripts/lib/release-kit-runtime.mjs <root>` then `harness emit`, under the
  same writer lock, active-gate check and 120 s bounds. `refreshHarnessRuntime`
  takes the export decision itself: in a kit root it runs the restore and
  says so; otherwise the caller's build. Rejected: a Git `post-merge` hook
  (axis: the recorded no-Git-hook stance, writes outside the hook-observed
  boundary, duplication with `worktree start`); a SessionStart hook that
  prepares the runtime (axis: a 15 s hook timeout against an unmeasured
  restore, and a tracked-surface rewrite while the session starts; kept as
  a candidate in the map with its measurement).
- *One finish verb, no hook.* `update --finish` composes existing code
  (`runGit` fetch and `merge --ff-only`, `bootstrapWorktree`) and refuses
  before any write when `main` is dirty or not checked out; it is the
  route's last step in the README and in WO-207's template. Rejected:
  running it from the update branch's session automatically after the
  operator merges (axis: the merge is the operator's, and the session may
  be gone).
- *The admission compares what it uses.* `committed` returns the committed
  bytes; a new `publicationView(configuration)` projects the roots and the
  registration's `baseBranch`, `authorityProfile` and `release`, and the
  admission compares the projection of main's committed file with the
  projection of each checkout's working file, withholding with the first
  differing field; the grants file keeps byte equality (a grant edit is a
  publication change). Rejected: requiring the registration change to reach
  main first (axis: an order's records merge with its pull request; the
  fork would need two pull requests per order).
- *A near miss is named.* When `plainShellWords` returns null and the
  command, trimmed, begins with `<node> <launchpad>/scripts/worktree.mjs
  publish ` or the release-close helper's node path, the hook journals and
  prints `Registered-target admission not judged: shell syntax (<pipe |
  redirect | prefix>) hides the helper; run the plain spelling`, kind
  `near-miss`, and emits no decision. Rejected: parsing through the pipe
  (axis: the admitted spelling is the plain one by design, WO-221).
- *First non-blank line.* The prefix search runs over the prompt with any
  leading fence line (three backticks) or blank lines removed, then
  `trimStart()`, on the first line only, recording `prefixLine`; a prefix
  later in the text is still not a dispatch. Rejected: searching the whole
  paste (axis: a quoted `resume:` in a pasted log would dispatch).
- *A second definition, one default.* `contributor.ts` gains `workers:
  [pinned, { name: "dotln-worker-fable", model: "claude-fable-5-1", effort:
  "xhigh", optIn: true }]`; `harness emit` writes one agent file per entry;
  the shared correction reads "Launch … as Claude `dotln-worker` …; when the
  operator's dispatch names Fable, launch `dotln-worker-fable` instead and
  record the type in the receipt and the response"; the direct receipt's
  episode gains `workerType`; the agent-pin test admits both files. The
  Codex pin is unchanged. Rejected: changing the default pin (axis: the
  operator's 2026-09-30 direction stands until the operator changes it);
  a per-call model override (axis: product 07 forbids it so readback stays
  truthful).

**Deliverables:** the export-aware recovery, refresh and harness entry;
`update --finish`; the admission's field comparison and near-miss advisory;
the first-line prefix rule; the second worker definition, its agent file,
the role text and receipt field; the README and product write-backs;
fixtures; decisions.

**Acceptance criteria (all required)**

1. In a fixture export whose `main` was fast-forwarded to a merged update
   (hook pins changed, snapshot absent), a `resume: release close` prompt's
   emitted recovery restores the carried runtime and re-emits without
   running `npm run build`, and the replayed hook dispatches; the control
   (the recovery as at the base) is recorded withheld on the build. In core
   the WO-195 case passes unchanged.
2. In the same fixture, `worktree finish` and `npm run harness -- check`
   prepare the runtime through the restore and print no `npm run build`;
   `release close`'s unbuilt-runtime refusal and `resume`'s two Codex
   messages name `node scripts/bootstrap.mjs` in an export; no user-facing
   text tells an export to run `npm run build` (a grep over `scripts/`,
   `packages/compiler/src/harness.ts` and the emitted hooks in the fixture
   export finds none outside core-only branches).
3. `node scripts/launchpad.mjs update --finish` on a clean fixture `main`
   behind `origin/main` fetches, fast-forwards, bootstraps (one emit step in
   an export) and prints the steps; it refuses before any write on a dirty
   tree, on a non-fast-forward and when `main` is not checked out, naming
   the fact; the client README's route ends with it, its tag paragraph
   says an explicit `--tags` fetch overrides `remote.upstream.tagOpt`, and
   its target publish paragraph names `hostRules: "literal"` as the route
   while the classifier is unqualified.
4. The registered-target admission admits a worktree whose
   `dotln.config.json` differs from main's committed file only outside the
   publication fields (a registration's gate command added) and withholds,
   naming the field, when `baseBranch`, `authorityProfile`, `release`, a
   root or the grants file differs; the admitted response is unchanged
   (fixture).
5. A piped or redirected spelling of the publish or release-close helper
   journals a `near-miss` advisory naming the syntax and emits no decision;
   a raw `git`, `gh` or `npm` spelling is unchanged; the plain spelling is
   unchanged (fixture).
6. A prompt whose first non-blank line, after a leading fence or blank
   lines, begins with a dispatch prefix is recorded with that prefix, its
   class, its role and `prefixLine`; a prefix on a later line is not a
   dispatch; a prompt with no prefix is `unclassified` as today (fixture).
7. `harness emit` writes `.claude/agents/dotln-worker-fable.md` with
   `model: claude-fable-5-1` and `effort: xhigh` beside the unchanged
   `dotln-worker.md`; `harness check` refuses a drifted copy of either; the
   planner, refuter and reviewer role text admits the Fable worker only on
   the operator's dispatch; the direct refutation receipt and the response
   record `workerType`; product 07 §Model-specific notes states the opt-in
   and the unchanged default (fixture; `npm run test:docs`).
8. `npm test -- --review` and `npm run test:docs` green; `git diff --check`
   clean; no new dependency; the compiler minor and the re-mints of step 13
   recorded.

**Preflight:** `npm test -- --only harness-fixtures` and `npm test -- --only
harness` for steps 2, 3, 10 and 11; `npm test -- --only process-debt` for
step 4; `npm test -- --only launchpad` for steps 5, 6 and 9; `npm test --
--only skeleton` for steps 7, 8 and 10; `npm test -- --only plan-refutation`
for step 11; `npm test -- --only configuration-root` for every script step;
`npm test -- --only evidence-sources` and the edition suites for step 13;
`npm run test:docs` when a document changes; each under `node
scripts/harness.mjs bounded --` for the steps that edit their declared
sources; then one `npm test -- --review` (07-execution-guide.md §Preflight
before the full gate).

**Execution plan (the executor follows these steps in order; observed at `926b8234`, 2026-10-21):**

1. `docs/evidence/WO-226/README.md` (new): at the base, a fixture export
   fast-forwarded past a pin change: the recovery's withheld advisory, the
   finish's refusal text, the `npm run harness` failure, the admission's
   withheld fact on a registration edit, the piped spelling's absent row and
   the prompt hook's `prefix: null` on a fenced first line, each with the
   command run. Check: the README names the base behavior.
2. `packages/compiler/src/harness.ts` (`releaseCloseRecovery`, 49 to 140):
   import `isKitRoot` from the carried `runtime-inputs.mjs` beside the two
   existing imports; in a kit root run `[process.execPath,
   [join(root, "scripts/lib/release-kit-runtime.mjs"), root]]` in place of
   the build, then the emit; the withheld advisory (137) and the fallback
   advisory (755) say `restore` in a kit root and `build` in core. Check:
   `npm test -- --only harness-fixtures` (the WO-195 case and a new export
   case beside it).
3. `scripts/test-harness.mjs` (beside 2621 to 2700): the export-shaped
   stale-main case of criterion 1 with its control. Check:
   `npm test -- --only harness-fixtures`.
4. `scripts/lib/harness-runtime.mjs` (`refreshHarnessRuntime`, 203 to 218):
   `(root, build)` becomes export-aware: in a kit root run
   `prepareKitReleaseRuntime(root)` and write `Refreshing pinned runtime
   (<cause>); carried-runtime restore.`, else the caller's build; the
   remaining-cause message names `node scripts/bootstrap.mjs` as today.
   `scripts/worktree.mjs` finish (1375 to 1384) and `scripts/harness-entry.mjs`
   (16 to 20) pass their build only for core (`hasPackageSources`);
   `scripts/release.mjs` 3475 and `scripts/resume.mjs` 1280 and 2443 name
   `node scripts/bootstrap.mjs` when `isKitRoot`. Check: `npm test -- --only
   process-debt` (the refresh cases at 10689 to 10725 gain the kit-root
   branch).
5. `scripts/launchpad.mjs`: `update --finish [<dir>]`: refuse unless the
   checkout is `main`, clean and has `origin`; `fetch origin main`, `merge
   --ff-only origin/main`, `bootstrapWorktree(root)`; print the steps; the
   usage string names it. Check, in `scripts/test-launchpad-update.mjs`: the
   happy path on a fixture instance behind its origin, the three refusals
   before any write; the case listed in `scripts/fixtures/launchpad-cases.json`
   or written as a subtest (`npm test -- --only launchpad`, `npm test --
   --only runner-fixtures`).
6. `scripts/kit/README.client.md` §Taking upstream updates: the route's end
   (697 to 700) becomes `node scripts/launchpad.mjs update --finish`; the
   tag paragraph (642 to 659) gains one sentence: an explicit `git fetch
   upstream --tags` overrides `remote.upstream.tagOpt --no-tags`, so a
   session that wants the starter's tags fetches them by ref as the example
   does and otherwise fetches plain. The target publish paragraph (the node
   spelling, from WO-223) gains one sentence naming the registration's
   `hostRules: "literal"` fallback as the route while the host's classifier
   is unqualified, and what it writes and removes. Check: the README travels
   manifest-listed (`launchpad`).
7. `packages/skeleton/src/harness-host.ts` (`registeredTargetAdmission`,
   1654 to 1700): `committed` returns the bytes; `publicationView` projects
   `roots` and `repositories[<id>]`'s `baseBranch`, `authorityProfile` and
   `release`; the comparison runs over the projections for
   `dotln.config.json` and over the bytes for `grants.json`; the withheld
   fact names the first differing field. Check:
   `packages/skeleton/test/harness-host.test.ts` cases (`skeleton`).
8. Same function, before the `plainShellWords` null return (1626 to 1627):
   when the trimmed command starts with the publish helper's or the
   release-close helper's node spelling, journal `{ registeredTargetAdmission:
   { kind: "near-miss", syntax } }` and return the advisory `Registered-target
   admission not judged: shell syntax (<syntax>) hides the helper; run the
   plain spelling; host permissions decide.`; a raw `git`, `gh` or `npm`
   spelling and the plain spelling are unchanged. Check: `skeleton`.
9. `scripts/test-launchpad-export.mjs`: an export's emitted hooks and
   `scripts/` hold no text telling the export to run `npm run build` outside
   core-only branches (criterion 2's grep as a case). Check: `launchpad`.
10. `packages/skeleton/src/harness-host.ts` (`recordOperatorMessage`,
    1175): strip leading blank lines and one leading fence line, take the
    first line, `trimStart()`, match the prefix, record `prefixLine` (0 or
    the line index); the class and route follow as today. Check: `skeleton`
    cases for criterion 6; `npm test -- --only harness-fixtures` (the
    journal fixture).
11. `packages/skeleton/src/loadouts/contributor.ts`: `workers` (the pinned
    entry first, `dotln-worker-fable` with `optIn: true`); the shared
    correction (64) gains the opt-in sentence; `scripts/lib/harness.mjs`
    writes one agent file per entry and `harness check` compares both;
    `scripts/test-harness.mjs` 5574 to 5584 admits both files;
    `scripts/lib/plan-direct.mjs` records `workerType` in the direct
    episode (`dotln-worker` when unstated) and `scripts/lib/plan-receipts.mjs`
    renders it; the planner and refuter skills regenerate from the role
    text. Check: `npm test -- --only harness`, `npm test -- --only
    harness-fixtures`, `npm test -- --only plan-refutation`.
12. Labels: one compiler minor (`packages/compiler/package.json`,
    `COMPILER_PACKAGE_VERSION`), the skeleton version its `src` edits
    require and its compiler pin, the console pins and `package-lock.json`.
    Check: `npm run release -- check-surfaces --local` (`release-surfaces`).
13. Re-mints: `npm run build`; `node scripts/harness.mjs emit`; point
    `docs/evidence/current.json` at WO-226 revision 001 for each kind the
    edited registered sources stale; `npm run sync`; `node
    scripts/feedback-evidence.mjs --carry <the feedback edition selected at
    the base> --edition WO-226 --revision 001`; `node
    scripts/console-fixtures.mjs --record-current-selfhost` then `--check`
    (the compiler minor moves the policy hash the console binds). Check:
    `npm test -- --only evidence-sources` and each edition's suite;
    `npm test -- --only console`.
14. Write-backs, in place, each heading re-read at the base: product 07
    §Model-specific notes (the opt-in worker, the unchanged default, the
    receipt's `workerType`), §Operator-opened planning pass (the first-line
    prefix rule; its preconditions item on pasted blocks, written by the
    2026-10-21 pass, names it), §Preflight before the full gate (the
    export's finish and restore in one sentence), the admission paragraph
    WO-221 wrote (the publication fields and the near-miss advisory);
    product 03 §Platform and instance boundary (the update route ends in
    `update --finish`); `docs/evidence/WO-221/host-qualification.md` known
    issues (the near-miss class; the classifier question stays open);
    `docs/evidence/WO-226/decisions.md` with one decision per step; `npm run
    meta`; `npm run publication:check`. Handoff: `npm run format`; `npm run
    test:docs`; `npm test -- --review`; complete
    `docs/evidence/WO-226/handoff.md`; `npm run resume --
    implementation-ready <flags>`.

**Evidence gate:** the Preflight suites; the paired controls of steps 3,
5, 7, 8 and 10 recorded in `docs/evidence/WO-226/controls.json`; `npm run
test:docs`; `npm test -- --review`. No live model run: the first live Fable
worker is a planning pass the operator dispatches with the word.

**Write-back duty:** criteria 3 and 7 and step 14.

**Known issues and carry-ins:**

- The operator removed the interim `autoMode.environment` entries and the
  launchpad-local allows before the fork's WO-006 on core's 2026-10-19
  framing of the qualification test, and the publish then stopped (the
  admission withheld on byte equality, the piped spelling unparsed, the
  classifier denying both); the framing rested on WO-178's unqualified
  reading of the host documentation. This order removes the two kit-side
  causes (criteria 4 and 5) and records the third as the host's; until the
  live qualification, the kit's route is the registration's `hostRules:
  "literal"` fallback (WO-221), named in the client README by step 6.
  Reopen when a live publish under `hostRules: "literal"` is denied by the
  classifier.
- Whether a PreToolUse hook `allow` prevails over the host's auto-mode
  classifier stays unknown: no published page states it and no live
  episode has seen the admission return `allow` (the WO-221 row). This
  order narrows what the admission judges and names the near miss; it
  cannot qualify the host. Reopen when a live publish observes the
  admission's `allow` and the classifier's verdict in the same call.
- The SessionStart hook could prepare the runtime itself (the carried
  restore writes only the ignored `.runtime`), but its timeout is 15 s and
  the restore is unmeasured; recorded as a candidate in the map. Reopen when
  step 1 measures the restore under 10 s in the fixture export.
- A Git `post-merge` hook was weighed and declined (the recorded
  no-Git-hook stance; writes outside the hook-observed boundary). Reopen
  only on an operator decision that reverses the stance.
- `bootstrapWorktree` reinstalls dependencies only when `tsc` is absent; an
  update that moves `package-lock.json` pins does not trigger `npm ci`.
  Reopen when an instance's gate fails on a dependency the lockfile moved.
- The fork's instance journal and WAIT lines were not read; the piped
  spelling's absent row is explained by `plainShellWords` and is reproduced
  by fixture, not by the fork's journal.
- The Fable worker's cost per planning pass is unmeasured; the receipt's
  `workerType` and the response's statement make it visible. Reopen when a
  pass's Fable worker exceeds the pinned worker's recorded wall-clock by
  half.

**Non-goals:** a Git hook of any kind; a SessionStart preparation (the
candidate); changing the default worker pin or the Codex pin; a per-call
model override; qualifying the host's classifier; the update route's merge
or pull request (the operator's); the outward lint (WO-227); a change to the
plain helper spelling the admission requires.

**Operator-review assumptions**

1. The operator wants the finish as one kit command the session runs, not a
   hook that fires on the operator's own Git actions.
2. The pinned worker stays the default; the Fable worker runs only when the
   operator's dispatch names it, and its model and effort are read back from
   the host, never assumed.
3. An order that edits its own registration's non-publication fields should
   publish without a second pull request.
