# WO-164 decisions

## WO-164-D001 — economy experiment: a scratch collection timer in place of the document gate

```json
{
  "id": "WO-164-D001",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "kind": "experiment",
  "decision": "Keep `npm run test:docs` as the source of every recorded `console-docs` figure. Use the scratch collection timer only to iterate. It tracked the task within 6 % before the change, but only because collection dominated the task then. After the change it reads 0.65 s against the task's 1.58 s warm, and 6.2 s against 8.21 s cold, because the test's own fixed cost now dominates.",
  "question": "This order has to measure `collectSources` and the `console-docs` task before and after. Does an uninstrumented scratch timer of `collectSources` (the ER3-002 reproduction without the spawn patch) track the `console-docs` task within 10 %, so that the full document gate runs only for the two figures criterion 2 records?",
  "alternatives": [
    "Run `npm run test:docs` for every measurement (31.42 s before the change).",
    "Run only the board document test with `node --test --test-name-pattern='\\[document\\]'`.",
    "Time `collectSources` directly with a scratch script, about 21 s before and under 1 s after."
  ],
  "observation": "Before, on the activation tree: the scratch timer read 21,192 and 21,173 ms, against `console-docs` 22.50 s in `test:docs` (5.8 %). After, on the final sources: the timer read 662, 653 and 645 ms warm and 6,261 and 6,165 ms with the cache removed, against `console-docs` 1.58 s warm and 8.21 s cold. The after gap is 0.9 s and 2.0 s, more than 10 %.",
  "budget": {
    "wallSeconds": 300
  },
  "execution": "run",
  "cost": {
    "wallSeconds": 120,
    "tokens": null,
    "commands": [
      "node <scratch>/time-collect.mjs <worktree> (two runs before, five after)",
      "npm run test:docs (one run before, two after)"
    ],
    "source": "Shell timing in the executor session. The timer runs themselves take about 80 s; the rest is inspection and recording, estimated from the session clock. The document gate runs were needed for criterion 2 either way. Tokens are part of the dispatch usage observation."
  },
  "effect": {
    "wallSecondsPerOrder": 0,
    "tokensPerOrder": null,
    "commands": ["npm run test:docs"],
    "summary": "No method changes. The timer is a proxy only while collection dominates the task. Once collection is small, the fixed cost of the node test process and the board projection dominates, so recorded task figures keep coming from the document gate."
  },
  "outcome": "kept-current",
  "regression": "unknown",
  "history": {
    "lastAdoptedImprovementAt": "2026-09-25",
    "experimentsSinceAdoption": null
  },
  "evidence": [
    "docs/evidence/WO-164/timing.md: the before and after tables",
    "WO-168-D001 records 2026-09-25 as the latest adopted improvement. This session did not count the experiments between WO-168 and this order, so experimentsSinceAdoption is null."
  ],
  "rejected": [
    {
      "option": "Record the timer's figures as the `console-docs` figures",
      "reason": "After the change they disagree with the task by more than 10 %; criterion 2 names the task in `test:docs`."
    }
  ],
  "reopenWhen": "A later order again makes collection dominate the `console-docs` task, or the document test's fixed cost changes by more than a second."
}
```

## WO-164-D002 — approach, goal alignment and independent review

```json
{
  "id": "WO-164-D002",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "Implement the order's three changes with one writer: a batched status fold, a per-tag cache in the release listing, and the collector calling each once. Put the regressions in existing runner tasks: the console package tests, the `resume` shell suite's control-segments file and the process-debt lane assertions. That adds no gate step. Measure before and after on the operator's host, then have the working tree judged by a read-only workflow of four lens reviewers and one skeptic. Every reviewer finding is fixed or disposed of in D003 to D006.",
  "evidence": [
    "git rev-parse HEAD: 894be584 (activation checkpoint refs/dotln/checkpoint/WO-164/1). 113 order ids in the control log and 104 local annotated DotLn release tags on the operator's host.",
    "Before: `collectSources` 21.2 s (113 status forks 14.7 s, one release listing 6.1 s); 116 node processes and 1,457 Git spawns; `test:docs` 31.42 s with `console-docs` 22.50 s. REVIEW-003 ER3-002 measured 101 forks and 93 tags on 2026-09-25, and the counts grew by 12 orders and 11 tags in two days.",
    "Workflow wo164-review, five read-only agents with the session cap at 20: 20 findings, two of them major. The skeptic reproduced both and lowered each to minor: a shallow-clone or replace-ref history view outliving its cached ranges (CACHE-1), and a cold cache after a code change or in a new worktree (C1). Every finding is disposed of in D003 to D006.",
    "Mutation check of the final regression: dropping the previous-object guard, the history-view bypass, the replace-ref check, the ignore check, the code digest or the shared release set each fails the console regression (six of six detected); every mutated file was restored and compared byte for byte."
  ],
  "rationale": "Mission and critical path: the document gate runs at every planning pass and final review, and 20 of its 31 s were this collection, growing by about a second a day. Removing that growth returns operator waiting time on every order. Seeking the wrong goal: the order's measure is the collection's process count and the board's bytes, not a proxy for them. Drift to low performance and fixes that fail: the 2026-09-11 answer was a longer deadline, which accepted the growth; this removes the structure that grows. Policy resistance: no guard is added that another guard undoes; the status and listing commands keep their single-order and text forms. Tragedy of the commons: the cache is one bounded file per worktree (29 KB at 104 tags), disposable at teardown, and neither read nor written unless Git reports its path ignored and history plain. Escalation: no new gate step, command family or role text. Success to the successful: an in-process import of the status projection into the collector was considered and declined (D003). Shifting the burden to the intervenor: a stale record would need an operator to notice, so the record's identity covers the code that derives it, the configured roots and the history view, and anything unestablished falls back to an uncached listing. Rule beating: the regression counts real processes with a node --import logger and a PATH Git shim, and the same-tree board hash compares the original sources with the new ones. NoOp: the gate stays near 31 s and grows about a second a day, and the deferred row's reopening observation stays met without an answer. Naive interventionism: existing functions are preserved (the per-order form, the text listing, the board's refs); the affected consumers are the board, the document gate and any caller of `release list`; the second-order effect is a cold first call per worktree and code change; three source files revert cleanly.",
  "rejected": [
    {
      "option": "Raise the gate's collection deadline again",
      "reason": "Declined by the order: it is the 2026-09-11 answer to the same growth and leaves the growth in place."
    },
    {
      "option": "Move the board test out of the document gate",
      "reason": "Declined by the order: it hides the cost from the gate that pays it."
    },
    {
      "option": "Cache status by segment mtime",
      "reason": "Declined by the order: the fold is cheap once in-process (0.23 s for 113 orders); the forks were the cost."
    },
    {
      "option": "One writer per change in parallel worktrees",
      "reason": "The three changes meet in the collector and its regression; one writer per worktree is the repository rule and the edits are small."
    },
    {
      "option": "Add the regressions as a new runner task",
      "reason": "The order's classification says no gate step changes; the existing console, resume and process-debt tasks already run these files."
    }
  ],
  "reopenWhen": "The console-docs task or a verifier's board run measures above 3 s with a warm cache, or a reviewer shows the board's bytes differ between the original and new sources on one tree."
}
```

## WO-164-D003 — `resume status --all --json` and the collector's one call

```json
{
  "id": "WO-164-D003",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "`resume status --all --json` selects no order (branch selection would refuse a new worktree whose order is not yet activated). It folds the control segments once and returns, in id order, the per-order object for every id in the fold's locations. Each id passes through the same `selectWorkOrder` and `statusProjection` as `status --json --work-order`, so an unreadable allocation fails the command as it failed its fork. The dependency release set is read at most once per process through an optional thunk on `readDependencies`. When a harness session report exists, `currentSession` is added to each object as the per-order form adds it. The output is one compact JSON array, and the command appends nothing and writes no projection. The collector makes that one call with a 256 MB output bound, and fails its status source unless the returned ids equal the control log's ids in order. The single-order form and its text form are unchanged; the usage line names both forms.",
  "evidence": [
    "Real tree, 113 orders: every batched object deep-equals `status --json --work-order` in the Claude session environment and without a session; ids sorted; control segment and current.md hashes unchanged; 227 and 234 ms for the batch against 15,461 and 15,341 ms for 113 forks; output 2,583,929 bytes.",
    "Equivalence reviewer, in an executed scratch fixture: legacy-only, interleaved legacy, segment, withdrawn, withdrawn-then-reactivated and unreadable-allocation orders compare deep-equal under no session, CLAUDE_EFFORT, CODEX_THREAD_ID and COPILOT_AGENT_SESSION_ID, on main with several open orders and on an unactivated wo-NNN branch. For the unreadable allocation both forms fail with the same stderr line; only the command text the collector wraps differs.",
    "scripts/test-control-segments.mjs `WO-164 status --all --json returns every order's per-order object and appends nothing`: three orders including a release edge, with and without CLAUDE_EFFORT; three refused argument forms; control bytes unchanged.",
    "packages/console/test/collect.test.ts: the collector's batched objects deep-equal nine per-order objects whose release edges are met, and the Git census stays at eight spawns whether four or eight orders carry release edges."
  ],
  "rationale": "The collector already reads every segment to find the ids, so one process that folds once and answers for all of them removes the forks without changing any object. Reusing selectWorkOrder keeps the refusal of unreadable orders. Checking the returned ids keeps the collector's old guarantee that every control-log id has a status. Each object carries the whole order list (the per-order contract), so the output grows with the square of the order count. Compact JSON halves it. By the equivalence reviewer's projection from measured row sizes, the larger bound covers about 999 orders (the id space) at today's rows, or about 810 if every row is a derived order.",
  "rejected": [
    {
      "option": "Import `statusProjection` into the collector in-process",
      "reason": "It would make the console depend on the script layer's module graph and launchpad resolution; the order specifies a batched status command the collector calls."
    },
    {
      "option": "Factor the repeated order list out of each object",
      "reason": "Criterion 4 requires the same objects as the per-order form; this is recorded as the remedy for the quadratic size."
    },
    {
      "option": "Pretty-print the array like the single form",
      "reason": "About twice the bytes through the collector's bound for no reader benefit; `jq` reads either."
    },
    {
      "option": "Extend the tracked fixture with withdrawn and unreadable orders",
      "reason": "A valid withdrawal needs an operator capture and its hash; the reviewer's executed fixture covered those states. Reopen with the next change to the batched path's projection."
    }
  ],
  "reopenWhen": "`status --all --json` output exceeds 32 MB (about 400 orders at today's rows), or any change touches how the batched path projects withdrawn, reactivated or unreadable orders."
}
```

## WO-164-D004 — the release listing's per-tag records

```json
{
  "id": "WO-164-D004",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "`release list` keeps one record per local semver annotated tag in `docs/control/local/cache/release-list.json`. A record is keyed by tag name and tag object id. It holds whether the tag is a DotLn release, its APPLICATION text as the row prints it, the manifest's previous release, the manifest-derived work orders, and the first-parent range result together with the previous tag's name and object id. The range result is reused only when both still match. Uncached tags are read in one `cat-file --batch`. Range reads name tags as `refs/tags/<name>`, so the range and its key name the same objects. The file is read and written only while `git check-ignore` reports the path ignored and `rev-parse` reports history that is not shallow, with no grafts file and no replace refs. Its identity covers a schema version, a digest of `scripts/release.mjs` and every regular `scripts/lib/*.mjs`, the configured control paths and the final-review root. A save keeps exactly the tags listed; anything that cannot be established yields an uncached listing, never a refusal. The cache directory is disposable at teardown (scripts/lib/paths.mjs), so close does not archive it.",
  "evidence": [
    "Real tree, 104 tags: the original script (a `git archive HEAD` export run with DOTLN_LAUNCHPAD), the new cold listing and the new warm listing print the same bytes, sha256 273ea687117b3f0c586aa8b6a104b56fcd943cddfd485c17e8a5749bc299706a (105 lines). Git spawns under a counting shim: original 1,167, cold 962, warm 3 (for-each-ref, check-ignore, rev-parse); warm listing 0.07 s.",
    "Cache reviewer and skeptic, executed: a cache warmed in a shallow clone kept the shallow view's cumulative ranges after `git fetch --unshallow` (CACHE-1, now bypassed); a ref shadowing a tag name was read by rev-list but not keyed (CACHE-2, now read as refs/tags); the cache would have been archived into main's retained lane at every close (CACHE-3/C4, now disposable); an unreadable `scripts/lib` entry would fail the listing (CACHE-4, now uncached); a non-finite manifest value did not survive JSON (CACHE-5, APPLICATION is stored as its text and an unusual previous release is not cached).",
    "packages/console/test/collect.test.ts: warm calls read no tag; four new tags cost exactly 29 Git spawns (seven per tag and one batch); a tag moved to another commit re-reads its own row and the next release's range; a corrupt file is rewritten; an edited lib module retires every record; a replace graft is neither read nor written and its rows equal an uncached listing; a tampered record in an unignored lane is neither read nor written.",
    "scripts/test-process-debt.mjs: `docs/control/local/cache/release-list.json` is disposable and a lookalike `cached-terms.txt` is not."
  ],
  "rationale": "Tags and commits are immutable, so a record keyed by the tag object is exact while the code, the configured roots and the history view that derive it are unchanged. Each of those is either in the key or makes the cache stand aside. Reading tags as refs/tags removes the one case where Git's name resolution differs from the key. In a repository with a ref named like a tag, this corrects the original's reading instead of reproducing it. The lane is the one product 03 names for gate caches; making `cache/` disposable keeps derived records out of the retained archive.",
  "rejected": [
    {
      "option": "A shared cache in the Git common directory",
      "reason": "It would stay warm across worktrees, but worktrees at different code versions would evict each other's records, and the order names the ignored local lane."
    },
    {
      "option": "A hand-maintained schema version instead of a code digest",
      "reason": "A forgotten bump would serve stale rows silently. The digest's cost is one cold listing per worktree and code change."
    },
    {
      "option": "Digest only the listing's import closure",
      "reason": "The skeptic found it would still have invalidated in 6 of the last 10 release intervals, against 9 of 10 for the whole library, and new worktrees start cold either way."
    },
    {
      "option": "Key the history view into the record identity",
      "reason": "A plain view of immutable commits is the same view whenever it holds; standing aside while it does not is sound across unshallowing, grafts and replace refs without tracking their contents."
    },
    {
      "option": "Memoize control reads along the first-parent chain to shorten cold listings",
      "reason": "Outside the order's scope: the cold path is the original derivation. It is recorded as the next step if cold listings need to shrink."
    }
  ],
  "reopenWhen": "A cold listing exceeds 10 s on the operator's host, a verifier finds a listing that differs from an uncached one on the same repository state, or a later order adds an input to the derivation outside scripts/release.mjs and scripts/lib."
}
```

## WO-164-D005 — version assignment

```json
{
  "id": "WO-164-D005",
  "date": "2026-09-27",
  "dispatch": "resume: next; classified release preparation",
  "decision": "Assign application v0.52.6, the next patch above the observed local v0.52.5 tag, under the order's patch classification. Bump @dotln/console from 0.3.0 to 0.3.1, a compatible patch for its changed collector, in its package.json and the lockfile. Compiler, kernel, skeleton and beacons are unchanged. The heading, the README version line, the console README and the roadmap activation note follow.",
  "evidence": [
    "git tag --sort=-v:refname: v0.52.5 newest",
    "`npm run release -- prepare --local`: WO-164 target v0.52.6 remains current",
    "`npm run release -- check-surfaces --local`: the only failure before the bump was `component-version @dotln/console: src changed; observed 0.3.0; previous v0.52.5 0.3.0`; every surface passes after it",
    "`npm ls @dotln/console`: @dotln/console@0.3.1 -> ./packages/console"
  ],
  "rationale": "The collector is console package source; the scripts are not versioned components. No interface, contract or schema changes.",
  "rejected": [
    {
      "option": "Minor bump for the new `--all` form",
      "reason": "It is an additive read-only command form with byte-identical results, and the order is classified patch."
    }
  ],
  "reopenWhen": "Final review integrates a newer published application tag or console version and retimes the unpublished target under the same patch classification."
}
```

## WO-164-D006 — timing record, byte identity and the deferred row

```json
{
  "id": "WO-164-D006",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "Record the before and after figures in docs/evidence/WO-164/timing.md and add the after figure to product 07's cold-gate candidate. Judge criterion 2 on a warm cache, which is every run after the first in a worktree at unchanged code, and record the cold figure beside it. Criterion 1 is met by one same-tree comparison of the original sources with the new ones. FUP-7f9a27e6ed6c44b3 is allocated to this order; final review retargets it at close with the reopening condition below.",
  "evidence": [
    "Criterion 1, same tree, final sources: `console board --json` from the original sources 22,783 ms, new cold cache 6,588 ms, new warm cache 822 ms, all sha256 43c2fe35edf94c55a84745c6b571e1541287745acc1e4c99190e3d3a8a138a02 (6,444,755 bytes). The same comparison before the review fixes gave 5f58217e52d21c48ee5678169ad28a43b82beff185f3d8ce321bc419dff91e56 for all three. A first comparison against the activation tree's board differed in five values: the version heading, the index row and three host-projected beacon ages. Those are documents and a clock, not code, so the comparison was redone on one tree.",
    "Criterion 2: `collectSources` 21,192 and 21,173 ms before; 662, 653 and 645 ms warm and 6,261 and 6,165 ms cold after. `console-docs` 22.50 s in a 31.42 s `test:docs` before; 1.58 s in 13.10 s warm and 8.21 s in 17.58 s cold after.",
    "Criterion 3: the console regression's census reads 4 node processes throughout and 8 Git spawns warm with five or nine orders and four or eight tags; 37 Git spawns after four new tags. Against the original sources it fails at 8 node processes where 4 are allowed, and the control-segments subtest fails with `ambiguous work-order selection`.",
    "The console regression costs 9.1 s of the console package task, which runs outside the document gate.",
    "FUP-b8a329d9970b8206, the cold-gate candidate's row, is also allocated to this order and reopens when 'the document gate's critical path exceeds ten seconds after WO-164 closes'. In the warm after run, `console-docs` started only after `docs-check` finished: build 0.56 s, then `docs-check` 8.63 s, then `console-docs` 1.58 s, about 10.8 s of a 13.10 s gate. That chain is now led by `docs-check`, which this order does not change (the order's non-goals include the document gate's task selection). Final review disposes of the row with this observation; editing the candidate appended source revision 12 to it."
  ],
  "rationale": "A warm cache is the steady state the order designs for: an unchanged tag costs no Git spawn. The cold figure is the original derivation run once per worktree and code change, and it is still a third of the original board time because the status half is constant either way.",
  "rejected": [
    {
      "option": "Judge criterion 2 on a cold cache",
      "reason": "A cold listing is by design linear in tags (Design, bullet 2); the cold figure is recorded, with its own reopening condition in D004."
    }
  ],
  "reopenWhen": "collectSources above 3 s warm after WO-164 closes, a cold listing above 10 s, or `work-orders index` above ten seconds (the register row's other half, a non-goal of this order)."
}
```

## WO-164-D007 — verifier finding on the first collection

```json
{
  "id": "WO-164-D007",
  "date": "2026-09-27",
  "dispatch": "resume: verify",
  "kind": "finding",
  "decision": "Criterion 2 is unmet. Its under-3-second collectSources bound is unqualified, so it includes the first collection in a new worktree or after a release derivation code change. The executor's warm result meets the bound, but its 6,261 and 6,165 ms cold results do not. This verifier reproduced an uncached collection in 5,845 ms and a warm collection in 632 ms on the same 113-order host; both returned the same release listing hash. The uncached reproduction set GIT_GRAFT_FILE=/dev/null only for the first call, which makes the cache stand aside without altering repository files. It is not a literal cache deletion; the executor's literal cold results provide that complementary observation.",
  "evidence": [
    "docs/work-orders/WO-164-constant-process-console-collection.md criterion 2: collectSources under 3 s with 100-plus orders and 90-plus tags, with no warm-only qualifier.",
    "docs/evidence/WO-164/timing.md: executor cold 6,261 and 6,165 ms; warm 662, 653 and 645 ms; 113 orders and 104 tags.",
    "Verifier on 2026-09-27: node collectSources on the current built subject returned 113 available statuses, an available release list and hash 273ea687117b3f0c586aa8b6a104b56fcd943cddfd485c17e8a5749bc299706a in both modes; 5,845 ms with an empty graft file at /dev/null to bypass the cache and 632 ms warm.",
    "The verifier's npm test passed 28 suites, 0 failed and 72 fresh tasks; the performance miss is separate from that gate result."
  ],
  "rejected": [
    {
      "option": "Treat the bound as warm-only, as D006 proposed",
      "reason": "That qualifier does not appear in criterion 2 and new worktrees and code changes are normal first-call conditions."
    },
    {
      "option": "Raise a gate deadline",
      "reason": "The order explicitly rejects that answer to recurring growth."
    }
  ],
  "followup": "In resume: fix, make the first collectSources call on the current 100-plus-order, 90-plus-tag host complete under 3 seconds while preserving release-list and board bytes, constant collection process count and the verified warm path; record fresh cold and warm timings and rerun both gates.",
  "reopenWhen": "A repair's first-call measurement is under 3 seconds on the operator's host and the same-tree board output remains byte-identical, supported by fresh verifier measurement after repaired code is staged."
}
```

## WO-164-D008 — repair the cold derivation and correct the timing interpretation

```json
{
  "id": "WO-164-D008",
  "date": "2026-09-27",
  "dispatch": "resume: fix",
  "decision": "Correct D006: criterion 2 includes cold collection. Batch the missing release ranges within one listing: retain each range's Git reachability selection, obtain first parents in that selection, share validated historical control views, and batch release-note diffs. Preserve the existing per-tag persistent cache and the release-note publishing path. Reuse D001's timer-versus-gate method; do not start a second economy experiment.",
  "evidence": [
    "VER-001 F1 and D007: literal cold collections 6,261 and 6,165 ms; independently uncached collection 5,845 ms. Criterion 2 has no warm-only qualifier.",
    "scripts/release.mjs releaseWorkOrdersBetween launches rev-list per tag, rev-parse per commit, readControl twice per commit (each tree plus blob batch), and a release-note diff per commit. scripts/lib/control-store.mjs already exports readControls and addedSegmentEvents.",
    "A local diff-tree --stdin probe reproduced release-note paths for first-parent merge diffs with explicit commit/parent pairs and NUL framing."
  ],
  "rationale": "Mission and critical path: fast first collection removes normal new-worktree and code-change waiting from the board and document gate. Drift to low performance, rule beating and seeking the wrong goal: measure cold and warm collection against the actual three-second criterion, with byte equivalence; a green warm fixture cannot discharge it. Policy resistance / fixes that fail: keep validated control folds and append-only comparison, Git range selection, and cache invalidation. Tragedy of the commons: share immutable reads only within the process and bound batch preparation, with individual-read fallback for an aggregate buffer failure. Escalation: no new gate or role procedure. Success to the successful: retaining the cache does not justify its slow first derivation. Shifting the burden: no manual prewarming. Naive Interventionism: preserve refusal behavior, attribution ordering, configured paths, and publishing consumers; probe and regress before broader gates. NoOp leaves the confirmed six-second failure.",
  "rejected": [
    {
      "option": "Interpret the bound as warm-only or raise a deadline",
      "reason": "Changes the required outcome and leaves VER-001 unresolved."
    },
    {
      "option": "Use only manifest attribution",
      "reason": "Would skip first-parent control completions and changed release notes, changing historical rows."
    },
    {
      "option": "Change the shared control-store reader or the publication path",
      "reason": "The listing can batch through existing readers within the named repair seam."
    }
  ],
  "reopenWhen": "Cold collectSources reaches three seconds, before/after listing or board bytes differ, or the batching changes an accepted history view or refusal."
}
```

## WO-164-D009 — repaired timing, equivalence and handoff

```json
{
  "id": "WO-164-D009",
  "date": "2026-09-27",
  "dispatch": "resume: fix",
  "decision": "VER-001 F1 is repaired on the executor subject: literal cold collections take 2,468 and 2,427 ms, the verifier's uncached empty-graft proxy 2,409 ms, and warm collection 665 ms on the current 113-order, 104-tag host. Preserve D006 as the historical mistaken judgment, corrected by D007 and D008. The three-second reopening bound now covers cold and warm collection. Product 07 records the repaired cold figures. The existing v0.52.6 application patch and @dotln/console 0.3.1 remain current after local release preparation.",
  "evidence": [
    "docs/evidence/WO-164/repair.md: same-tree board hash, literal cold/warm timings, exact regression against pre-repair code, history cases and checks.",
    "A same-tree board comparison using an isolated copy of the pre-repair release script and a fixed observation time returns 6,456,826 identical bytes in all three modes, SHA-256 4007e8014e00b3cac2174c7b21a68c1a0bed38a69e7ebb0492690c54890c08f0.",
    "The strengthened console regression passes in 9.34 s and rejects the pre-repair source at 41 cold Git processes where at most 20 are allowed. Warm fixture Git processes remain eight; collection Node processes remain four.",
    "npm run test:docs with the ignored cache absent at entry: 23 suites passed, zero failed, 23 fresh tasks, 13.37 s; console-docs 3.53 s.",
    "npm run release -- prepare --local retains v0.52.6; check-surfaces --local passes.",
    "npm test: 28 suites passed, zero failed, 72 fresh tasks in 343.24 s; console 25.82 s. Publication freshness and planning checks pass; git diff --check is clean.",
    "FUP-d68bd29cf96864f1 (D007) and source revision 13 of FUP-b8a329d9970b8206 remain allocated to WO-164; independent re-verification and close-stage disposition remain separate."
  ],
  "rationale": "The direct first-call outcome now meets the order while retaining the established board and release bytes and warm benefit. Batched historical validation reuses the existing control-store reader and addedSegmentEvents; bounded batches retry individual reads on failure. No new dependency, gate step, component bump beyond the prepared patch, persistent cache format, or publishing behavior is needed. Independent verification remains a separate dispatch.",
  "rejected": [
    {
      "option": "Change the acceptance text to warm-only",
      "reason": "The observed cold performance now meets the original criterion; its prior reinterpretation was wrong."
    },
    {
      "option": "Add further speculative optimizations after the bound passes",
      "reason": "The first-call defect and regression are addressed; additional changes add validation cost without a demonstrated remaining failure."
    }
  ],
  "reopenWhen": "Either cold or warm collectSources reaches three seconds on the operator host, same-tree board/list bytes differ, or accepted historical attribution/refusal changes."
}
```

## WO-164-D010 — final review finding: the new cache module fails the configuration-root suite

```json
{
  "id": "WO-164-D010",
  "date": "2026-09-27",
  "dispatch": "resume: final review; FINAL-001",
  "kind": "finding",
  "decision": "Fail FINAL-001 on criterion 6 and return the finding to repair. The final review's `npm test -- --review` exited 1: 33 suites passed and `configuration-root` failed its subtest `no control-plane script keeps a literal document root or a second root derivation`, naming `scripts/lib/release-list-cache.mjs: newURL(\"../\",import.meta.url)`. The new module derives the scripts directory from its own URL instead of through scripts/lib/config.mjs, which already exports TOOL_ROOT for that purpose. The resolved directory is the same, so no listing byte changes; the repository invariant and the binding product gate are what fail. The reviewer does not write the fix.",
  "evidence": [
    "Review gate row: npm test, exit 1, 635,990 ms, recorded 2026-09-27T18:39:06.712Z, code identity 4db1cb2cae04fd715020e546d4dfe790116b611ba3b3978ef43c3c18b03668bd, tree c8dc5c76; 78 fresh tasks; 33 passed, 1 failed (configuration-root, 4.35 s).",
    "Reproduced outside the gate: `node scripts/test-configuration-root.mjs` exits 1 with the single offence `scripts/lib/release-list-cache.mjs: newURL(\"../\",import.meta.url)`. The file is new in this subject, so the base has no offence.",
    "scripts/test-runner.mjs: `configuration-root` is a machinery suite whose declared source is `scripts/`. Plain `npm test` selects product suites; `--review` adds the machinery suites whose declared sources changed since the base. The executor's, VER-001's, the repair's and VER-002's `npm test` rows each ran 28 suites and 72 fresh tasks; none records a `configuration-root` run.",
    "scripts/lib/config.mjs exports TOOL_ROOT = resolve(fileURLToPath(new URL(\"../../\", import.meta.url))), the one sanctioned tool-root derivation."
  ],
  "alternatives": [
    "Pass and board the offence as a follow-up",
    "Write the one-line fix during review and certify it",
    "Fail with the reproduced finding and route it through repair and fresh verification"
  ],
  "rejected": [
    {
      "option": "Pass and board the offence as a follow-up",
      "reason": "Criterion 6 requires `npm test` green, and the final review's gate row is the one publication cites. A red row cannot be published."
    },
    {
      "option": "Write the one-line fix during review and certify it",
      "reason": "Product 07 §Independent workflows and integration and WO-158-D027: a reviewer never writes a source fix and certifies it. The module is part of the release-list cache's code digest, so the change also needs fresh evidence that the listing and board bytes hold."
    }
  ],
  "followup": "WO-164 resume: fix — derive the scripts directory in scripts/lib/release-list-cache.mjs through scripts/lib/config.mjs (for example from TOOL_ROOT) instead of `new URL(\"../\", import.meta.url)`; rerun `node scripts/test-configuration-root.mjs`, the console collection regression and the same-tree release-list comparison; run the machinery suites whose sources changed (`npm test -- --review`) before requesting a fresh verification.",
  "goalAlignment": "Mission: the order's speedup ships only through a green binding gate. Rule beating: four green 28-suite gates stood in for the review selection, which alone runs the suite that guards root derivations. Fixes that fail: a second root derivation would silently diverge the day a launchpad moves the tool root. Naive Interventionism bounds the response: one line and existing suites, no redesign. NoOp publishes nothing; the red row blocks the PR.",
  "reopenWhen": "A repaired subject passes `npm test -- --review` including configuration-root, and a fresh verification judges criterion 6 on that subject."
}
```

## WO-164-D011 — final review finding: Receipt 028's three known issues have no recorded disposition

```json
{
  "id": "WO-164-D011",
  "date": "2026-09-27",
  "dispatch": "resume: final review; FINAL-001",
  "kind": "finding",
  "decision": "Route to the same repair one decision that disposes each of the three WO-164 known issues in the ideation receipt, planning receipt 028. The receipt judged WO-164 aligned-with-findings. The planning map's WO-164 row carries the issues 'to carry into the executor's decisions', and no WO-164 decision names them. (1) Criterion 4: no runtime fallback from the one-process fold to the per-order form. The planning pass weighed the answer as 'a fold failure falls back to the per-order form and records that it did'. The subject has no fallback, and no decision declines it. (2) Criterion 3: the cache's storage and its visibility to `harness prune`. D004 and product 03 answer the storage: the ignored local lane, disposable at teardown. The planning pass's 'registered with harness prune' is neither done nor declined. (3) Criterion 2: the growth rate. D002 answers it in substance, citing REVIEW-003's 18.4 to 19.1 s on 2026-09-25 and 21.2 s on 2026-09-27 as 'about a second a day', but does not say this disposes the issue. Minor: no criterion fails on this alone. WO-158's final review checked that each receipt 028 issue reached a decision, and WO-161's VER-001 F6 returned the same gap to repair (WO-161-D010).",
  "evidence": [
    "docs/planning/refutations/2026-09-25-planning-cb4e4076b7ec0078-028.md, WO-164 entry: three known-issue findings on criteria 4, 3 and 2, each with a reopenWhen.",
    "docs/planning/off-ramps-5s-entropy-2026-09-25.md §16, 'WO-164 (3)': the planning pass's weighing of the three issues.",
    "docs/planning/work-order-map.md, WO-164 row: 'Receipt 028 known issues to carry into the executor's decisions'.",
    "grep of docs/evidence/WO-164 and both verification reports for 'Receipt 028', 'prune' and a fold fallback: no disposition.",
    "Reviewer observations the repair may use or refute. (1) At the base, the collector's ids.map ran inside `attempt`, so one failing per-order fork made the whole `resume:status--json` source unavailable. The fold keeps that granularity, and an unreadable allocation fails both forms (D003). The fold's own failure modes are the 256 MB output bound and the id-equality check. (2) The read-only `node scripts/harness.mjs prune` plan at review time lists no cache path; scripts/lib/harness-prune.mjs inventories docs/control/local/harness, not local/cache, and no harness journal in this worktree names release-list.json. (3) The executor's two same-day runs (21,192 and 21,173 ms) and REVIEW-003's figure give about 1.0 to 1.4 s a day over two days, in 12 more orders and 11 more tags."
  ],
  "rejected": [
    {
      "option": "Write the three dispositions in this review",
      "reason": "The first issue is an implementation choice the planning pass weighed the other way (fall back and record). Declining it on the executor's behalf would put a reviewer's product decision in place of the executor's, on a subject that returns to repair for D010 anyway."
    },
    {
      "option": "Board the gap with a follow-up and leave it after close",
      "reason": "The map row makes the dispositions part of this order's record, and a repair is already required; carrying it past close would leave the receipt's issues unanswered on the closed order."
    }
  ],
  "followup": "WO-164 resume: fix — record one decision that disposes each of receipt 028's three WO-164 known issues with evidence and a reopening condition. Either implement the fold-to-per-order fallback with a recorded marker, or decline it with the failure-mode evidence. State whether the cache needs a harness prune registration, given its disposability at teardown. State the observed growth rate from the dated measurements.",
  "reopenWhen": "A WO-164 decision disposes all three receipt 028 issues and a fresh verification reads it, or a receipt reopening observation occurs: a collection on the operator's host fails or differs from the per-order form outside the fixture; a guard refusal names the cache path during test:docs; a prune inventory lists an unregistered cache."
}
```

## WO-164-D012 — final review finding: an eager manifest read fails listings the original printed

```json
{
  "id": "WO-164-D012",
  "date": "2026-09-27",
  "dispatch": "resume: final review; FINAL-001",
  "kind": "finding",
  "decision": "Route to the same repair one listing difference the review's helper established by execution. The new `listPublishedReleases` computes `manifestWorkOrders(manifest, toolRoot)` for every uncached DotLn release so it can cache the result (scripts/release.mjs line 2073). The original called it only when a release's range attributed no work order (HEAD line 1948). `manifestWorkOrders` spreads `(manifest?.notes?.changedFiles ?? []).flatMap(...)`, which throws when `changedFiles` is a string, an object or a number. A tag whose headline is `DotLn <tag>` and whose manifest carries such a value now fails the whole `release list`, exit 1 with no rows, where the original printed every row whenever that release's range was not empty. Criterion 1 holds on the operator's tree, whose manifests are validated against an array; the difference is reachable only through a hand-made or foreign tag with a DotLn headline. Minor: no criterion fails on this alone.",
  "evidence": [
    "Review helper, executed on synthetic fixtures with the original (git archive HEAD) and new scripts: `notes.changedFiles` as a string, an object or a number gives the original exit 0 with both rows and the new code exit 1, empty stdout, `error: ((intermediate value) ?? []).flatMap is not a function or its return value is not iterable`; `null` is identical.",
    "Reviewer reading: git show HEAD:scripts/release.mjs line 1948 calls manifestWorkOrders only inside `if (workOrders.length === 0)`; the working tree's line 2073 calls it inside the uncached facts map for every DotLn release.",
    "scripts/lib/release-tags.mjs manifestWorkOrders: `(manifest?.notes?.changedFiles ?? []).flatMap(...)`.",
    "The helper found the original crashing on the same manifest when the range is empty, so the defect predates the order for that case."
  ],
  "rejected": [
    {
      "option": "Record it as an observation only",
      "reason": "A listing that printed rows before now prints none, and `release list` feeds the board's release source; the order's design promises the same output."
    },
    {
      "option": "Prescribe the fix here",
      "reason": "The executor owns the choice between computing the manifest attribution lazily, guarding a non-array value, and caching only an array."
    }
  ],
  "followup": "WO-164 resume: fix — keep `release list` printing every row the original printed when a DotLn-headlined tag's manifest carries a non-array `notes.changedFiles`, for example by deriving the manifest attribution only when the range is empty; add a fixture row for a string, object and number value, and compare the original and new outputs on it.",
  "reopenWhen": "The repair's fixture shows identical original and new output for non-array `notes.changedFiles` values, and a fresh verification reads it."
}
```

## WO-164-D013 — repair FINAL-001: the cache's root derivation and the listing's lazy manifest attribution

```json
{
  "id": "WO-164-D013",
  "date": "2026-09-27",
  "dispatch": "resume: fix; FINAL-001",
  "decision": "Repair F1 and F3 without changing any listing or board byte. F1 (D010): `scripts/lib/release-list-cache.mjs` derives its scripts directory as `join(TOOL_ROOT, \"scripts\")` through `scripts/lib/config.mjs` instead of `new URL(\"../\", import.meta.url)`; the directory it resolves is unchanged. F3 (D012): `release list` still derives an uncached release's manifest attribution with its other facts, but a throw from `manifestWorkOrders` is kept in place of the list. The error is thrown only when the release's range attributes nothing, which is the only case in which the original read the attribution. A record holding an error is not an array, so the cache never stores it and the tag is derived afresh on every listing. The pre-existing failure on an empty range is kept, because the original fails there too, and it is deferred with a follow-up. D001 remains this order's one economy experiment; this repair starts no second one.",
  "evidence": [
    "FINAL-001 F1 and F3; D010 and D012.",
    "`node scripts/test-configuration-root.mjs` after the F1 change: 13 passed, 0 failed.",
    "Synthetic fixture (docs/evidence/WO-164/repair-final-001.md): with `notes.changedFiles` a string, an object, a number and null on non-empty ranges, the original (`git archive HEAD`), the repaired cold listing and the repaired warm listing each exit 0 with the same four rows and empty stderr. On an empty range with a string value, all three exit 1 with the same stderr, `error: ((intermediate value) ?? []).flatMap is not a function or its return value is not iterable`.",
    "packages/console/test/collect.test.ts gains the non-array rows, an uncached-record assertion and the empty-range failure; the checkpoint-11 `scripts/release.mjs` fails the test with that TypeError, and the file was restored and compared byte for byte.",
    "Same tree after both changes: the original, repaired cold and repaired warm `release list` print SHA-256 273ea687117b3f0c586aa8b6a104b56fcd943cddfd485c17e8a5749bc299706a (105 lines), the hash FINAL-001 and D004 recorded."
  ],
  "rationale": "Mission: the speedup ships only through a green binding gate with the original's output. Rule beating: F1 was invisible to four green default gates, so this repair runs the review selection itself before handoff (D016). Fixes that fail: one root derivation means a moved tool root moves the cache's code digest with it. Seeking the wrong goal and drift: F3 is judged by exact parity with the original on the reviewer's inputs, not by a new tolerance. Naive Interventionism: the listing's facts map, the cache format and the warm path are kept; only a throwing call is deferred to the row that reads it. Tragedy of the commons, escalation, success to the successful and shifting the burden are immaterial: no gate, command or operator step is added. NoOp leaves criterion 6 red and a listing that fails where the original printed rows.",
  "rejected": [
    {
      "option": "Compute the manifest attribution only when a range is empty",
      "reason": "Warm records would then need the manifest or a second read, which changes the record format; keeping the error as the fact reaches the same output with no format change."
    },
    {
      "option": "Treat a non-array `changedFiles` as no attribution in `manifestWorkOrders`",
      "reason": "It would also print rows where the original fails (an empty range), so the output would no longer equal the original's. It is the deferred follow-up below."
    },
    {
      "option": "Cache a record whose attribution failed, with a marker",
      "reason": "Reproducing the thrown message later would mean storing engine-specific error text; such tags are hand-made and rare, so re-deriving them costs little."
    }
  ],
  "followup": "Adjacent defect met and not fixed (adjacent-0001): `release list` fails as a whole, and with it the board's release source, when a DotLn-headlined tag on an empty range carries a non-array `notes.changedFiles`, in the original and repaired code alike. Fix: treat such a value as attributing nothing, as the listing already treats an unparsable manifest, and add an empty-range fixture row for string, object and number values.",
  "reopenWhen": "The configuration-root suite reports another root derivation, a listing differs between the original and repaired code on one repository state, or a DotLn-headlined tag with a non-array `changedFiles` appears on the operator's tree."
}
```

## WO-164-D014 — Receipt 028's three known issues: two implemented, one stated from dated measurements

```json
{
  "id": "WO-164-D014",
  "date": "2026-09-27",
  "dispatch": "resume: fix; FINAL-001; operator scope expansion",
  "decision": "Dispose of receipt 028's three WO-164 known issues (D011) in the form the 2026-09-25 planning pass weighed. The operator widened this repair from disposition to completion with a `scope expand:` direction: implement the three known issues where that needs no planning pass. None needs a planning pass, because the pass already weighed each answer (off-ramps-5s-entropy-2026-09-25.md §16, WO-164 (3)). The order's text, criteria and classification are unchanged, so no amendment is recorded. (1) Criterion 4, fold fallback: implemented. When `resume status --all --json` fails, or returns ids that differ from the control log, the collector reads each order with `status --json --work-order`, as before WO-164. It returns that result under the ref `resume:status--json#per-order-fallback`, which the board lists in its sources and cites in every order row. If the fallback also fails, the fold's own failure is reported under `resume:status--json`. (2) Criterion 3, storage and `harness prune`: storage stays as D004 set it, the ignored local lane, disposable at teardown. The gate-input half of the issue cannot occur: `packages/skeleton/src/gate-evidence.mjs` treats only tracked or unignored paths as gate inputs, and the cache is read and written only while Git reports its path ignored. `harness prune` now lists `docs/control/local/cache/release-list.json` as a retained `release-list-cache` row with its reason and never removes it; product 07 says so. (3) Criterion 2, growth rate: on the unmodified source, `collectSources` measured 18,367 and 19,065 ms on 2026-09-25 (REVIEW-003, `fa9957f1`, 101 orders, 93 tags) and 21,192 and 21,173 ms on 2026-09-27 (D001, `894be584`, 113 orders, 104 tags). That is 1.05 to 1.41 s a day. It matches the arrival of about six orders and six tags a day (REVIEW-003) at about 0.13 s per order fork and 0.06 s per tag, which predicts about 1.1 s a day. The `console-docs` task series agrees: 11.55 s on 2026-09-19 (WO-143, 72 orders, 63 tags), 20.06 s on 2026-09-25 and 22.50 s on 2026-09-27, or 1.4 and 1.2 s a day. The title's 'about a second a day' is therefore supported. The receipt found it unsupported because the Cost line gave per-unit costs without the arrival rate.",
  "evidence": [
    "docs/planning/refutations/2026-09-25-planning-cb4e4076b7ec0078-028.md, WO-164 findings on criteria 4, 3 and 2; docs/planning/off-ramps-5s-entropy-2026-09-25.md §16.",
    "Fallback regression (packages/console/test/collect.test.ts): with a fold failure injected into the fixture's `scripts/resume.mjs`, collection starts 4 + 9 node processes, the status source is available under `resume:status--json#per-order-fallback` and deep-equals the nine per-order objects, and `projectBoard(...).sources` lists that ref as available. The checkpoint-11 collector fails the same test at 4 node processes where 13 are expected; the source was restored byte for byte and rebuilt.",
    "Normal path on the operator's tree: three cold and three warm `collectSources` runs each report `statusRef` `resume:status--json` with 113 statuses (repair-final-001.md).",
    "Prune regression (scripts/test-harness.mjs `WO-142 D1 prune previews...`): the fixture's cache file is one retained `release-list-cache` row and survives `--apply`. The checkpoint-11 prune module fails the assertion with `actual: []`; it was restored byte for byte. Ten prune tests pass.",
    "Read-only `node scripts/harness.mjs prune` on this checkout: exit 0, 30 candidates, 14 retained, one of them the `release-list-cache` row for the 29,003-byte file.",
    "No harness journal in this worktree names `release-list.json` (50 files under docs/control/local/harness).",
    "docs/instance/entropy-reducer/runs/REVIEW-003.md ER3-002: '101 node resume.mjs status 13287ms/12791ms; 1 node release.mjs list 5446ms/5249ms; total 19065ms/18367ms'; 'Orders and tags each arrive at about six a day'; WO-143's 11.55 s at 72 orders and 63 tags. docs/evidence/WO-164/timing.md: 21,192 and 21,173 ms; console-docs 22.50 s."
  ],
  "rationale": "Policy resistance / fixes that fail: a fallback can hide a broken fold. Here the ref records it in the board's sources and every order row's evidence, and the census regression fails when the normal path starts more than four node processes. Tragedy of the commons: the fallback costs about 14.6 s of forks at 113 orders, and only when the fold has already failed. The prune row adds no deletion and no recurring check. Drift to low performance: the slow path is labeled, not normalized, and the three-second bound (D009) still reads the normal path. Escalation: no gate step, role text or command family. Success to the successful: declining the fallback was weighed, since the base had the same failure granularity (FINAL-001). The operator's expansion and the planning pass's answer favor availability with a record. Shifting the burden: a failed fold no longer costs the operator the board, and the ref tells them why the board was slow. Rule beating: both regressions inject the real failure and compare with the per-order form or the prune plan, and each fails against the unchanged code. Seeking the wrong goal: the growth figure is stated from dated measurements, not from the title. Naive Interventionism: the normal path's output is unchanged (same-tree hashes), the prune change only adds a retained row, and each change reverts as one block. NoOp: the receipt's three issues would stay open on a closing order, against the operator's direction.",
  "rejected": [
    {
      "option": "Decline the fold fallback with the failure-granularity evidence",
      "reason": "The operator asked for completion where no planning pass is needed, and the planning pass weighed the fallback with a record as the answer."
    },
    {
      "option": "Make the cache a prune candidate that `--apply` removes",
      "reason": "Each listing rewrites the file to the current tags (29,003 bytes at 104 tags) and teardown disposes of it; removing it only costs the next listing a cold derivation."
    },
    {
      "option": "List caches of every registered worktree in prune",
      "reason": "Prune's advisory, snapshot and retained-lane rows are the running checkout's own, and a worktree's cache leaves with its teardown."
    },
    {
      "option": "Add an explanation field to available board sources to carry the fold's failure message",
      "reason": "It changes the board's projection contract, a non-goal of this order; the ref records that the fallback happened, and rerunning `resume status --all --json` reproduces a persistent failure."
    },
    {
      "option": "Edit the order's title to drop 'a second a day'",
      "reason": "The dated measurements support it, and changing a judged order's text needs an amendment this repair does not require."
    }
  ],
  "reopenWhen": "A collection on the operator's host reports `resume:status--json#per-order-fallback` or differs from the per-order form outside the fixture; a guard refusal names the cache path during test:docs; a prune inventory lists an unregistered cache; or collectSources on the repaired source reaches three seconds cold or warm (D009)."
}
```

## WO-164-D015

<!-- integration refs/dotln/checkpoint/WO-164/12 -->

```json
{
  "id": "WO-164-D015",
  "date": "2026-09-27",
  "dispatch": "resume: fix; worktree integrate WO-164; completed by resume: final review (FINAL-002)",
  "decision": "Integrated main at 371b7a08 (WO-171, published as v0.52.6) by fast-forward of the uncommitted branch from 894be584, during the FINAL-001 repair at the operator's direction (D016); checkpoint and named stash retained. The final review assessed the three authored resolutions. scripts/lib/harness-prune.mjs differs from main only by the added `judgeListingCache` judge and its one `record` call, so WO-171's single plan, pre-delete recheck and usage retention are untouched. docs/product/06-roadmap.md keeps both release notes, WO-164's activation and retiming notes above WO-171's. docs/planning/followups.json keeps every row of main in main's order, with main's revisions and dispositions as a prefix of each; it adds the five WO-164 rows and extends two. The helper retimed the unpublished patch from v0.52.6 to v0.52.7, and @dotln/console 0.3.1 stays valid because WO-171 changed no package source. No resolution changed a WO-164 criterion, behavior, contract or authority.",
  "evidence": [
    "refs/dotln/checkpoint/WO-164/12",
    "base 894be5841d250649b945ea31a98ca2b7c38dc7fd",
    "upstream 371b7a08e1d9213e55e9c087785126abd3457057",
    "Final review, 2026-09-27: `git diff HEAD --stat` shows 30 added lines and no removed line in scripts/lib/harness-prune.mjs and 11 added lines in docs/product/06-roadmap.md.",
    "Final review, row comparison of the working register with `git show HEAD:docs/planning/followups.json`: 680 rows on main, 685 here; none missing, none reordered, none whose revisions or dispositions diverge from main's; FUP-b8a329d9970b8206 extended from 11 to 14 revisions and 7 to 8 dispositions by this order, FUP-6c401ec3e9e06edb from 5 to 6 revisions by the integration's sync; added FUP-d68bd29cf96864f1, FUP-e9bd0effe2b00f0e, FUP-6a9eb3c24f1ab9ea, FUP-934cf5f4268029c8 and FUP-e2cf2122a642d1e0.",
    "`git tag -l v0.52.6` names the published WO-171 tag the retiming steps over.",
    "The final review's `npm test -- --review` on the integrated subject: 34 passed, 0 failed, 637.99 s, 78 fresh tasks, exit 0, recorded 2026-09-27T20:12:44.597Z, including harness-fixtures (the prune fixtures) and configuration-root."
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

Integration date: 2026-09-27. Original base: `894be5841d250649b945ea31a98ca2b7c38dc7fd`.
Fetched main: `371b7a08e1d9213e55e9c087785126abd3457057`. Checkpoint: `refs/dotln/checkpoint/WO-164/12`.
Named stash retained: `4692cd227277646dced6f24c056be6b70d689377` (WO-164 integrate 2026-09-27).
Resolved projections: docs/control/current.md, docs/publication/everyday-ai-user-toc.md, docs/publication/software-engineer-toc.md, docs/work-orders/README.md.
Release preparation: Retimed WO-164: v0.52.6 → v0.52.7. Files changed: docs/work-orders/WO-164-constant-process-console-collection.md, README.md, docs/product/06-roadmap.md, docs/final-reviews/WO-164/PR.md. Tag observation: local snapshot only.
Carried-forward claims: the order, VER-001, VER-002 and FINAL-001 keep their recorded subjects. No authored resolution changed a WO-164 criterion or its own source; the prune module gains one retained row inside WO-171's judge structure, the roadmap keeps both notes, and the register keeps main's rows and history whole. The repair's changes and the merged subject were judged by VER-003, and WO-171's prune fixtures and the configuration-root suite ran in the final review's gate. Final review owns its independent acceptance judgment, recorded in FINAL-002.
Authored conflicts observed: docs/planning/followups.json, docs/product/06-roadmap.md, scripts/lib/harness-prune.mjs.
Affected checks: the helper selected npm test -- --review, publication, harness and local release checks. The repair's executed results are in repair-final-001.md; the final review's gate and checks are in FINAL-002. This integration supplies no acceptance verdict.

## WO-164-D016 — merge main and hand off the repaired subject

```json
{
  "id": "WO-164-D016",
  "date": "2026-09-27",
  "dispatch": "resume: fix; FINAL-001; operator scope expansion",
  "decision": "Merge `main` into the repaired subject, as the operator directed during this dispatch with a second `scope expand:`, through the canonical `npm run worktree -- integrate WO-164`, then hand off. The branch fast-forwarded from `894be584` to `371b7a08` (WO-171, published as v0.52.6), with checkpoint `refs/dotln/checkpoint/WO-164/12` and named stash `4692cd22` retained; no branch commit was made. Three authored conflicts were resolved. (a) `scripts/lib/harness-prune.mjs`: WO-171 rebuilt the plan as judge functions over one context, so its module is kept whole. D014's registration is re-expressed as `judgeListingCache(context)`, recorded after `judgeCache`, which returns only a retained row; since it is never a candidate, `recheckCandidate` needs no branch for it. (b) `docs/product/06-roadmap.md`: both activation notes are kept, WO-164's above WO-171's, since the roadmap lists the latest merge first. (c) `docs/planning/followups.json`: a three-way merge by row against the base. 670 rows were unchanged or new on `main`, nine were taken from `main` and `FUP-b8a329d9970b8206` from this subject. The five WO-164 rows are appended. `FUP-6c401ec3e9e06edb`, changed on both sides, keeps `main`'s revisions, and the integration's register sync appended the merged section as revision `74a9cd97`; this subject's own revision described a section state that was never committed. Release preparation retimed WO-164 from v0.52.6 to v0.52.7 under the same patch classification. The console README's application line follows; `@dotln/console` 0.3.1 is unchanged, because WO-171 changed no package. The integration's draft decision D015 is left for the final reviewer, whose duty it names. After the merge, the document gate found product 07 221 bytes over its ceiling and Prettier style in two files this repair edited. The WO-164 after-figure paragraph was tightened in place with its figures kept, and the files were formatted, a whitespace-only change. A third review gate then ran on the final bytes. That gate was avoidable: the document gate, run before the second review gate, would have caught both defects. repair-final-001.md §Executor errors records this and the other time lost.",
  "evidence": [
    "docs/evidence/WO-164/repair-final-001.md: the integration, the before and after measurements, the synthetic comparison, the regressions and every gate.",
    "Review gate before the merge: `npm test -- --review`, 34 passed, 0 failed, 648.00 s, 78 fresh tasks, exit 0, recorded 2026-09-27T19:17:31.816Z (configuration-root 4.26 s, console 25.62 s, harness-fixtures 249.27 s).",
    "Review gate after the merge: `npm test -- --review`, 34 passed, 0 failed, 639.25 s, 78 fresh tasks, exit 0, recorded 2026-09-27T19:33:32.642Z, tree f85556c3, code identity 3f59bb6431b097d52bb801b4bc89fff92cd4069fe89e06ae31ca4e648707ecae (configuration-root 4.17 s, console 25.46 s).",
    "Document gate after the trim and formatting: `npm run test:docs`, 23 passed, 0 failed, 12.59 s, recorded 2026-09-27T19:36:06.762Z; the run before them failed `format` and `docs-check` (22.25 s, 19:34:46.506Z).",
    "Review gate on the final subject: `npm test -- --review`, 34 passed, 0 failed, 642.96 s, 78 fresh tasks, exit 0, recorded 2026-09-27T19:46:57.004Z, tree 71c26ec9, code identity 310096b93b4d75d5f66aef87b0256f832c3918edd14676ebbc5932d3e8f42cf0 (configuration-root 4.01 s, console 25.21 s).",
    "After the merge on 114 orders and 105 tags: `main`'s original listing and the repaired cold and warm listings print SHA-256 2481906d740370d873f36f4d0fb92163e2e7debbd83772688aa674b4c755e21d (106 lines); collectSources 2,160 to 2,197 ms cold and 628 to 645 ms warm through the fold.",
    "After the merge: configuration-root 13 passed; the console collection test passed; 19 prune and WO-171 harness tests passed; publication, harness, release-surface and planning checks exit 0; `git diff --check` clean."
  ],
  "rationale": "Mission: final review integrates `main` in any case; merging now lets the fresh verification judge the subject that will be published, including WO-171's rewrite of the module this repair touches. Policy resistance / fixes that fail: re-expressing the registration inside WO-171's judge structure keeps its single-plan apply and candidate re-check intact. Splicing in the old-structure code would have undone them. Rule beating: every check was rerun on the merged tree, and the binding gate ran after the merge. Tragedy of the commons and escalation: no new command, gate step or process; the integration command's own recovery refs hold the pre-merge work. Seeking the wrong goal: the register merge keeps every row's recorded history, not whichever side's file happened to be convenient. Naive Interventionism: the fast-forward adds no branch commit, and the stash and checkpoint keep both bases recoverable. Success to the successful and shifting the burden are immaterial. NoOp would leave the final reviewer a known collision on v0.52.6 and an unrun WO-171 overlap.",
  "rejected": [
    {
      "option": "A plain `git merge main` on the dirty tree",
      "reason": "The integration command is the repository's canonical path: it keeps a checkpoint and a named stash, regenerates owned projections and records the release retiming."
    },
    {
      "option": "Take this subject's register row for FUP-6c401ec3e9e06edb",
      "reason": "Its last revision described a product 07 section that was never committed; `main`'s history plus the merged revision is what the files now hold."
    },
    {
      "option": "Complete the integration's draft decision D015 here",
      "reason": "The command assigns carried-forward claims to the final reviewer."
    },
    {
      "option": "Leave the console README at v0.52.6",
      "reason": "Release preparation retimed the order to v0.52.7; the component line names the application it prepares."
    }
  ],
  "reopenWhen": "A document or review gate fails on this subject; the fresh verification finds the merged listing, board or collection differing from the per-order form or the original on one tree; `main` advances again before final review, which integrates once more; or a prune apply changes the cache row."
}
```

## WO-164-D017 — final review passes, paraphrases two operator messages before commit and disposes the rows

```json
{
  "id": "WO-164-D017",
  "date": "2026-09-27",
  "dispatch": "resume: final review; FINAL-002",
  "decision": "Pass FINAL-002. The subject meets all six criteria on the tree VER-003 judged; no source byte changed after VER-003, and this review changed none. Three record changes precede the commit. (1) Correction, same day: the FINAL-001 repair recorded two operator `scope expand:` messages word for word, in D014's and D016's decision text and in repair-final-001.md. What was misread: naming the operator's authorization was taken as licence to quote the message. What was meant, per the operator's 2026-09-24 correction recorded in WO-153-D008: record the control prefix and a paraphrase. What changed: the three passages now paraphrase each message with the same meaning, and `npm run meta` regenerated the decisions index; neither quote was ever committed, and no claim, figure or reopening condition changed. (2) D015's carried-forward claims are completed from this review's checks of the three authored resolutions. (3) Criterion 5's register duty is discharged: FUP-7f9a27e6ed6c44b3 is retargeted to the order's reopening conditions, and every row the change's `--touching` run returned is disposed through one `followups --apply` batch.",
  "reopens": {
    "decisionId": "WO-085-D004",
    "observation": "A new verbatim record occurred after WO-153-D008's correction: the WO-164 FINAL-001 repair recorded two operator scope-expansion messages word for word in D014, D016 and repair-final-001.md. FINAL-002 paraphrased them before any commit (WO-164-D017). Committed records written after that correction still carry one: WO-168-D017's dispatch field and evidence quote a `scope expand:` message. The role text still asks decisions to name the operator dispatch without saying to paraphrase, and WO-085's lexical check reads only dispatch fields."
  },
  "evidence": [
    "No source change after VER-003: the working tree differs from dispatch checkpoint 16 only in docs/control/current.md, docs/control/orders/WO-164.jsonl and docs/work-orders/README.md; the gate code identity is 310096b93b4d75d5f66aef87b0256f832c3918edd14676ebbc5932d3e8f42cf0, as VER-003 recorded.",
    "Final review gate: `npm test -- --review`, 34 passed, 0 failed, 637.99 s, 78 fresh tasks, exit 0, recorded 2026-09-27T20:12:44.597Z at code identity 310096b93b4d75d5f66aef87b0256f832c3918edd14676ebbc5932d3e8f42cf0, tree 9f7c7962 (configuration-root 4.11 s, console 25.16 s, resume 35.62 s, harness-fixtures 246.00 s).",
    "Same tree, 2026-09-27T20:00:52Z, 114 orders, 105 annotated tags: the original `release list` (git archive HEAD run with DOTLN_LAUNCHPAD) 5,812 ms, new cold 1,630 ms, new warm 114 ms, all SHA-256 2481906d740370d873f36f4d0fb92163e2e7debbd83772688aa674b4c755e21d (106 lines); the regenerated cache equals the file found at entry byte for byte.",
    "`collectSources` in fresh processes: 2,140 and 2,170 ms with the cache removed, 631 and 651 ms warm; each returned 114 statuses under `resume:status--json`, the listing hash above and no unavailable source.",
    "`status --all --json` against the original per-order form for all 114 orders: string-equal with the session variables present and absent (217 and 231 ms against 14,698 and 14,781 ms of forks); ids sorted; control segments, resume.jsonl and current.md unchanged.",
    "WO-153-D008: 'record the control prefix and a paraphrase'; grep of the WO-164 records found the two quotes only in decisions.md (D014, D016), repair-final-001.md and the generated index rows.",
    "FINAL-002 §Rows lists every row this review disposed, with the register revisions before and after its one `followups --apply` batch; the release-close skill names no register duty, and WO-171's allocated FUP-6aafd40115ac97fd still reads allocated after v0.52.6 was published."
  ],
  "rationale": "Mission: the order's speedup reaches main only through a green binding gate with the original's output, and this review observed both on the final subject. Rule beating: the verdict rests on this review's own review-selection gate and same-tree comparisons, not on the repair's row at the same identity. Seeking the wrong goal: criterion 2 was judged cold, as VER-001 required. Drift to low performance: the three-second bound and the reopening conditions are unchanged. Policy resistance and fixes that fail: the paraphrase keeps each authorization and changes no claim, so the verification that read those records still describes them. Tragedy of the commons: the operator's words stay out of the public record they asked to keep paraphrased. Escalation: no gate step, command or role text is added; the role-text cause goes to the existing row. Success to the successful: the repair's passing gate was not treated as this review's gate. Shifting the burden to the intervenor: the allocated rows are disposed here, where this order's records place the duty, rather than left to a close step that does not perform it. Naive Interventionism: three paragraphs of the order's own uncommitted records change wording only; the originals remain in checkpoint 16. NoOp would commit two verbatim operator messages against the operator's standing correction and leave criterion 5's retargeting undone.",
  "rejected": [
    {
      "option": "Rely on the repair's passing `npm test -- --review` row at the same code identity",
      "reason": "The order's evidence gate names `npm test` at final review and product 07 has the reviewer run the review selection once; the row carries the same identity either way."
    },
    {
      "option": "Fail the review and route the two quotes through repair",
      "reason": "The change is wording in the order's own uncommitted records, alters no claim a verifier judged, and a repair, verification and review cycle would add about an hour for three sentences."
    },
    {
      "option": "Commit the quotes and leave them to FUP-71fc2efc208f597a's sweep",
      "reason": "It would publish operator chat the operator has already asked to keep paraphrased; the sweep is for records that are already committed."
    },
    {
      "option": "Leave FUP-7f9a27e6ed6c44b3 and FUP-d68bd29cf96864f1 allocated for release close",
      "reason": "D006, VER-002, VER-003 and repair-final-001.md place their disposition at the passing final review, and the release-close procedure does not retarget register rows."
    }
  ],
  "reopenWhen": "The review gate row cited here does not bind at publication; `main` advances before merge and integration changes a WO-164 resolution; or another operator message is found word for word in a WO-164 record."
}
```
