# WO-171 decisions

## WO-171-D001 — economy experiment: where the new listing spends its time

```json
{
  "id": "WO-171-D001",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "kind": "experiment",
  "decision": "Keep the plan's full stash inventory, content reads and hashes included, in the preview as in the apply. It is about 87% of the new listing on the operator's checkout, but the cost lives in the fifteen integration stashes that the operator's next apply removes.",
  "question": "Once publication is listed once, does the integration-stash inventory dominate `harness prune` enough that a size-only preview (`git cat-file --batch-check`, no blob reads, no hashes) would be worth nominating?",
  "alternatives": [
    "Keep one inventory routine for the preview and the apply: `ls-tree` per stash role, blob contents read in batches of 32 and SHA-256 hashed.",
    "A preview that reads only blob sizes and leaves reading and hashing to an apply."
  ],
  "observation": "On the operator's main checkout (HEAD 894be584), 2026-09-27T16:37:29Z to 16:37:43Z, a read-only replica of `stashInventory` over the 15 integration stashes took 14.81 s wall-clock: 96,837 tree entries, 2,865,652,393 bytes of unique blobs read, and 1.02 s of that spent hashing. The listing with this order's module took 16.99 s at 16:37:00Z and 16.40 s after the review's corrections (D006), so the stash inventory is about 87 to 90% of it, and reading the blobs, not hashing them, is the cost.",
  "budget": { "wallSeconds": 600 },
  "execution": "run",
  "cost": {
    "wallSeconds": 240,
    "tokens": null,
    "commands": [
      "node <session-scratch>/wo171/stash-inventory-time.mjs <main checkout> (a read-only replica of harness-prune.mjs stashInventory using scripts/lib/git.mjs readGitObjects)"
    ],
    "source": "The run's own timer (14.81 s) and the shell clock around it. Writing the script before the run and recording the result afterwards are estimated from the session clock at about four minutes in all. Tokens are part of the dispatch usage observation and are not attributed to the experiment."
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": ["node scripts/harness.mjs prune"],
    "summary": "No saving claimed for an order. A size-only preview would cut today's listing from about 16 s to about 3 s (an estimate: the listing less the measured inventory, plus a size read not timed here). The fifteen stashes are integration residue: an apply drops them, after which a listing pays only for the stashes that closes add since the previous apply (one per integrated order), and the apply itself must read and hash every stash it drops."
  },
  "outcome": "kept-current",
  "regression": false,
  "history": {
    "lastAdoptedImprovementAt": "2026-09-25",
    "experimentsSinceAdoption": null
  },
  "evidence": [
    "scripts/lib/harness-prune.mjs stashInventory (ls-tree per role, readGitObjects in batches of 32, SHA-256)",
    "The replica's output: {stashes: 15, entries: 96837, uniqueBlobBytes: 2865652393, wallSeconds: 14.81, hashSeconds: 1.02}",
    "D006: 15 integration-stash candidates of 5,852,823,702 bytes counted per entry",
    "docs/evidence/WO-168/decisions.md WO-168-D001 names WO-159-D012 (2026-09-25) as the latest adopted experiment. WO-169-D001 left the count since null, and WO-164 runs beside this order, so no single source counts the experiments since"
  ],
  "rejected": [
    {
      "option": "Nominate or build a size-only preview",
      "reason": "It saves about 13 s on listings made before the next apply, and the cost goes away once the apply runs. A second inventory routine would also let a preview report bytes the apply never proved."
    }
  ],
  "reopenWhen": "A listing made after a completed apply still spends 10 s or more on integration stashes, or stashes accumulate again because applies are not run."
}
```

## WO-171-D002 — One plan, and a pre-delete check that re-judges only its candidate

```json
{
  "id": "WO-171-D002",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "`pruneHarness` plans once. Each retention rule moves unchanged into a judgment for one candidate (`judgeSnapshot`, `judgeAdvisory`, `judgeCache`, `judgeLane`, `judgeStash`) that reads from a context. The context reads the global observations eagerly, as the plan before this order did: registered worktrees, the writer view, the writer-event history, live gates in every worktree, and the ref backend. An unreadable one therefore stops the plan or the apply instead of being skipped. Only the snapshot pins, which never throw, are read when a snapshot first needs them. The plan builds one context and enumerates. Before each deletion `recheckCandidate` builds a fresh context and re-judges only that candidate: its inventory, its guards, and, for a stash, its identity by SHA in a fresh stash listing. The apply refuses with 'Prune subject changed' when the candidate is gone or its release, work order or inventory differs, as before. The publication observation is the one thing the check shares with the plan. The design's 'its release' is read as the release that the apply's single observation names for that order, because criterion 2 and the Cost line exclude a remote read per candidate.",
  "evidence": [
    "docs/work-orders/WO-171-prune-apply-finishes.md Design (one plan per apply; a pre-delete check of that candidate's inventory, release and stash identity) and criteria 1 to 4",
    "Pristine source: pruneHarness called planHarnessPrune once for each candidate, and every plan observed publication for every unregistered lane and stash (scripts/lib/harness-prune.mjs at 894be584, identical to 4c34b332)",
    "Fixture `WO-171 one apply plans once ...`: a child's preload counts the plan's listing of the retained directory, which a check never makes: 1. The injectable is asked [WO-901, WO-902, WO-903, WO-904, WO-907, WO-906, WO-905], once each. It fails against the 4c34b332 module (7 plans by the same count and 34 publication asks, the sentinel asked 7 times) and against a mutant that re-plans per candidate while sharing the publication observation (actual 7 plans, expected 1)",
    "Fixture `WO-171 an unreadable global observation still stops the plan`: a malformed writer-events.jsonl or active-gate marker stops the apply and the lane stays. The first version of this change read these lazily and did not stop (review finding, D010)",
    "Advisory markers: the old code checked liveness for every writer-event row with a known owner. `sessionProtected` asks the same question for the one session key being judged, so a check of one marker does not probe every owner in the history (383 rows on the operator's host on 2026-09-27)"
  ],
  "rejected": [
    {
      "option": "Call planHarnessPrune again, narrowed to the one candidate",
      "reason": "It is still a plan per deletion, which criterion 1 counts, and it would re-read every global observation in order to judge one path."
    },
    {
      "option": "Reuse the plan's local observations (gate, writer, pins, registrations) for the whole apply",
      "reason": "The window in which a gate or writer that starts mid-apply goes unseen would grow from one plan to the whole apply. The old code re-read them before every deletion, and a fresh context costs two Git calls (`worktree list`, `rev-parse --show-ref-format`) and the writer, writer-event and gate-marker reads per candidate, on top of what the candidate's own judgment reads."
    },
    {
      "option": "Re-read the candidate's release from GitHub before its deletion",
      "reason": "That is one `gh release view` per lane or stash per apply, which criterion 2 and the Cost line remove."
    },
    {
      "option": "Re-read the local release tag before each deletion",
      "reason": "A local tag does not establish publication; only the remote listing does. The re-read would add a Git call per candidate without observing what the rule depends on."
    }
  ],
  "reopenWhen": "An apply is observed deleting a candidate that a check made at that moment would have retained, a Release is withdrawn while an apply runs, or a new retention rule needs an observation the per-candidate context does not re-read.",
  "rationale": "Mission: the operator's own residue command finishes, so the residue stops waiting on a rescue nobody can complete (shifting the burden is the material lens). Critical path: none. Policy resistance: every existing guard keeps its text, its order of evaluation and its failure mode, and the usage rule (D004) keeps the prune from undoing WO-170. Rule beating: the fixtures count calls and plans instead of timing them, and each count was run against the old module and against a mutant. Commons: one apply now costs one listing plus local reads per candidate, not about three hours of GitHub calls. Escalation, drift, success to the successful and wrong goal have no purchase on a reordering inside one operator command. Naive Interventionism: the byte proof, the publication requirement and every retention reason are kept, and the change can be reversed file by file. NoOp: the apply stays about three hours long, it stopped once with exit 143, and 5.9 GB stays on disk."
}
```

## WO-171-D003 — Publication is one release listing and one tag listing, joined per order

```json
{
  "id": "WO-171-D003",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "A plan observes publication at most once, lazily, when the first unregistered lane or stash needs it. It runs `gh release list --repo <origin selector> --json tagName,isDraft --limit 10000` (the ambient GH_REPO and GH_HOST removed, as before) and `git ls-remote --refs --tags origin`, and joins them to `localReleaseRecords`. An order's release is its newest local release tag that is listed as non-draft and whose remote tag names the same tag object as the local one. That is the old per-release test (`tagName` equal, `isDraft` false, `ls-remote` object equal to `release.object`), asked of two listings instead of two calls per release. The answer is kept per order, and the injectable `publishedRelease` is likewise asked once per order. One failed listing is not retried within the plan: every order then reads as not established and stays retained, as before.",
  "evidence": [
    "Fixture `WO-171 one apply issues one release listing and one tag listing ...`: nine orders (six published, one draft, one remote tag naming another object, one without a Release). The fake gh honours --limit with gh's default of 30 and lists thirty newer unrelated Releases first. The preview, the apply and a later preview of the three orders left each issue exactly [gh release list] and [git ls-remote --refs --tags origin], and the three unestablished orders stay retained. It fails against the 4c34b332 module (its preview alone issued 8 `gh release view` and 8 `git ls-remote` calls) and against a mutant without --limit",
    "Fixture `WO-142 D1 publication proof binds the origin repository ...`, whose fake gh now answers a listing: the selector is still github.com/fixture-origin/fixture with GH_REPO and GH_HOST removed, and an unbound listing still cannot establish publication",
    "Operator's main checkout, read-only (<session-scratch>/wo171/publication-equivalence.mjs): for all 89 orders whose lane or stash the base module listed as a candidate, this order's plan observation names the same release as the base module's per-release views (89 of 89, none different)",
    "gh 2.98.0 `gh release list --help`: JSON fields include tagName and isDraft; --limit defaults to 30"
  ],
  "rejected": [
    {
      "option": "`gh api --paginate repos/{owner}/{repo}/releases`",
      "reason": "It is also one command with no item limit, but it is a raw REST shape where the codebase's other release reads use `gh release` subcommands. The 10,000 limit is about 100 times the 104 local release tags present today."
    },
    {
      "option": "Keep one `gh release view` per release and cache it across plans",
      "reason": "One plan per apply already makes a cross-plan cache pointless, and per-release views are the cost the order removes."
    }
  ],
  "reopenWhen": "The repository approaches 10,000 Releases (a listing at its limit may omit old ones, which then stay retained), or gh changes `release list --json` fields.",
  "rationale": "Groups the lenses with D002: the rule for what counts as published is unchanged, only how often it is asked. Rule beating: fake gh and fake remote record every invocation, so a second listing, any view or a dropped limit fails the fixture."
}
```

## WO-171-D004 — A lane holding a usage copy waits for a committed snapshot that carries it

```json
{
  "id": "WO-171-D004",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "A retained lane that would otherwise be a candidate, and whose inventory holds a regular file at `process/usage.jsonl` (at any depth), stays retained until HEAD's `<evidence root>/WO-NNN/meta.json` is JSON that names the SHA-256 of every such copy. Without a committed blob the reason is 'usage has no committed snapshot'; with a committed snapshot that does not name the copy it is 'usage copy is not in the committed snapshot'. The reason is asked last (after registration, publication and the inventory), so a lane that is also unpublished keeps its existing reason. It is a retention reason and not an eligibility rule (operator-review assumption 2): the snapshot that carries the copy releases the lane. The design's words 'until docs/evidence/WO-NNN/meta.json exists' are read under the objective, which is to never remove the only copy of an order's usage record. A snapshot that exists but holds other rows does not release the lane.",
  "evidence": [
    "scripts/lib/meta.mjs usageRows reads `<control root>/local/process/usage.jsonl`; scripts/lib/intake-reconciliation.mjs preserves a worktree's `<control root>/local/` into `retained/WO-NNN/`, so the copy sits at `retained/WO-NNN/process/usage.jsonl`",
    "Operator's main checkout, 2026-09-27 (read-only): 76 lanes and 75 usage copies, each at `WO-NNN/process/usage.jsonl` and none elsewhere",
    "WO-043 on that checkout: HEAD holds a whole-meter `docs/evidence/WO-043/meta.json` observed at 2026-09-11T17:56:24Z with 8 WO-043 usage rows; the lane's copy holds 50 rows (executor 16, verifier 26, reviewer 6, release-close 2), 15 of them recorded after the snapshot (the last at 19:59:19Z). The first version of this rule released the lane on the blob's existence (review finding, D010); the final listing retains it with 'usage copy is not in the committed snapshot'",
    "A whole-meter snapshot written on main after a close would postdate the lane's rows yet hold only main's own usage file (usageRows reads the checkout's own file), so neither existence nor observation time shows that a snapshot carries the copy; the copy's digest does",
    "Fixture `WO-171 a lane holding a usage copy is retained until a committed snapshot carries it`: retained with no snapshot, with a committed whole-meter snapshot that names the order and postdates the rows, with a committed link at the path, and with a covering snapshot written but not committed; a candidate once a snapshot naming the copy's SHA-256 is committed, whose proof then carries the same hash. It fails against the 4c34b332 module and against a mutant that releases on any committed blob",
    "Final listing (D006): 73 lanes retained for usage (45,647,143 bytes); WO-127, which holds no usage copy, is the one lane candidate"
  ],
  "rejected": [
    {
      "option": "Release the lane when the blob exists at HEAD",
      "reason": "It releases WO-043 today and deletes 42 rows that exist nowhere else."
    },
    {
      "option": "Release when the snapshot's observedAt is at or after the copy's last recordedAt",
      "reason": "A snapshot written on main after the close postdates every row yet carries none of them."
    },
    {
      "option": "Require WO-170's per-order shape or usage totals by role",
      "reason": "WO-170 has not fixed its shape, and totals cannot show which copy they were computed from. A digest binds the snapshot to the exact bytes the prune would delete, wherever the snapshot puts it."
    },
    {
      "option": "Release when the snapshot exists in the working tree",
      "reason": "An uncommitted file can be discarded by a checkout or a clean, and the usage copy would already be gone."
    }
  ],
  "followup": "WO-170: record in each per-order snapshot the SHA-256 of every retained usage copy it carries (for example `usageCopies: [{path, sha256}]`), and write or refresh the snapshot after the order's last usage row, since rows added later by verification, review or release close change the copy. Otherwise `harness prune` keeps the order's lane with 'usage copy is not in the committed snapshot'. Priority: medium.",
  "reopenWhen": "WO-170 settles a snapshot that cannot name the copy's digest, a usage record is found under another file name, or retained lanes pass product 07's disk-pressure condition while waiting for snapshots.",
  "rationale": "Policy resistance is the material lens: without this reason a working apply would remove 2,141 usage rows that WO-170 exists to recover, and NoOp would make the order's own success the cause of that loss. Rule beating: a snapshot passes only by naming the exact bytes, not by existing. The cost is 45.6 MB kept a while longer; the stashes (5.85 GB) are unaffected."
}
```

## WO-171-D005 — A bound resident store follows its lane, with no code change

```json
{
  "id": "WO-171-D005",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "No rule is added for bound stores. A retained lane's inventory already walks every regular file and directory, `resident/WO-NNN-<n>/` included, and removes the store with the lane. A fixture pins that the store's files, `.resident-append/events.jsonl` included, are named with their hashes in the lane's byte proof. A store that held a non-regular entry (the worker lock's recovery link) would make its whole lane retained with 'unowned or non-regular material', which is the safe side.",
  "evidence": [
    "Operator's main checkout (read-only): stores in WO-111 (1), WO-148 (4) and WO-152 (1), each holding binding.json, resident.json, events.jsonl and .resident-append/events.jsonl, and no link, socket or FIFO (`find ! -type f ! -type d` empty)",
    "scripts/lib/intake-reconciliation.mjs `contained` refuses a symlink, so a preserved lane cannot hold packages/skeleton/src/worker-store.ts's `host-lock-recovery` link",
    "Fixture `WO-171 a bound resident store follows its retained lane ...`. It also passes against the 4c34b332 module, as expected: the behaviour predates this order, and the criterion only pins it"
  ],
  "rejected": [
    {
      "option": "Retain lanes that hold a resident store",
      "reason": "WO-148-D002 left the store inert and inspectable, and the byte proof keeps its inventory. The allocation decides that it follows its lane."
    }
  ],
  "reopenWhen": "A retained store is needed after its lane was pruned and the byte proof cannot answer for it (the register row's own condition)."
}
```

## WO-171-D006 — The listing on the operator's host, before and after

```json
{
  "id": "WO-171-D006",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "Record the read-only listing's wall-clock on the operator's main checkout with the base module and with this order's module. It drops from 68.2 s to 16.4 s. No apply was run by this session.",
  "evidence": [
    "Before: `node scripts/harness.mjs prune` in the main checkout (HEAD 894be584, harness-prune.mjs identical to 4c34b332), finished 2026-09-27T16:25:57Z, 68,229 ms, exit 0. 199 candidates (5 snapshots, 105 advisory markers, 74 retained lanes, 15 integration stashes), 5,927,772,256 bytes; 41 retained (10 pinned snapshots, 1 unrecognized snapshot name, 18 legacy markers, 2 lanes with nested repositories, 10 unnamed stashes)",
    "After, final module: `node <this worktree>/scripts/harness.mjs prune` with the main checkout as its working directory, finished 2026-09-27T16:58:49Z, 16,400 ms, exit 0. 126 candidates (5 snapshots, 105 markers, 1 lane, 15 stashes of 5,852,823,702 bytes), 5,882,125,113 bytes; 114 retained: 72 lanes with 'usage has no committed snapshot', WO-043 with 'usage copy is not in the committed snapshot', and the other 41 with the same reasons as before",
    "An earlier after listing, before the review's correction of the usage rule, took 16,987 ms (16:37:00Z) and listed WO-043 as a candidate",
    "The order's figure, 64.2 s for 186 candidates at 4c34b332, was taken by the operator on the same host; the set has grown since",
    "None of the three runs wrote: `find` over the main checkout (without .git and node_modules) lists no file modified during any run's window (12:24:40 to 12:26:05, 12:36:40 to 12:37:05 and 12:58:30 to 12:58:52 local time)"
  ],
  "rejected": [
    {
      "option": "Time an apply on a copy of the operator's checkout",
      "reason": "Criterion 7 bars an apply against the operator's checkout, and a 5.9 GB copy would measure disk throughput, not the ordering this order changes. The fixtures count what the order changes."
    }
  ],
  "reopenWhen": "The operator's apply after this order's close runs materially longer than one listing plus its deletions, stops with 'Prune subject changed', or meets a rate limit."
}
```

## WO-171-D007 — What a stopped apply resumes from, one repair, and what stays boarded

```json
{
  "id": "WO-171-D007",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "Resumption rests on the byte proofs, not a progress file (as the order designs). A lane or snapshot stopped before or during removal is listed again with what remains: its earlier proof is kept, and a partly removed lane gets a second proof of the remainder. A stash stopped after its proof is proved again with identical bytes and dropped. One adjacent defect is repaired here because it defeats the resume this order promises. A proof was written in place, so a stop between creating the file and writing it left a partial proof, and every later apply refused that candidate and every one after it with 'Preservation byte proof differs'. A proof is now written to `<proof>.partial`, linked into place and the partial removed, so a present proof is always whole. The stash drop's own stop states stay boarded, because `scripts/lib/stash-drop.mjs` is outside this order's files and they need the operator whatever the prune does.",
  "evidence": [
    "Fixture `WO-171 an apply stopped after two deletions resumes ...`: a real SIGTERM (exit 143 in a shell) right after the second lane's removal, then an ordinary apply removes the other two lanes and both stashes; the first two proofs are byte-identical and nothing is left to list",
    "Fixture `WO-171 a stop before a byte proof is published ...`: SIGTERM after the partial is written and before the link; the lane and no proof remain, and a torn partial is replaced; the rerun removes all six candidates and leaves no partial. It fails against the 4c34b332 module, whose in-place write the stop never reaches",
    "Review probe (D010, edges lens): an empty proof file followed by SIGKILL made two reruns refuse 'Preservation byte proof differs; retained docs/control/local/retained/WO-901', with WO-901, WO-902 and both stashes left; the in-place write is identical at HEAD",
    "scripts/lib/stash-drop.mjs dropInventoriedStash: locks taken with `wx` and released only in `finally`, which a signal skips; the recovery snapshot is written in place and compared exactly on the next try; the reflog is installed before the ref",
    "Review probes against both modules: a stop holding the locks gives EEXIST at the first stash on every rerun; a stop after the recovery write followed by a new stash gives 'stash recovery snapshot changed' on every rerun; a stop between the reflog and ref installs gives 'stash ref and reflog disagree' once the locks are gone"
  ],
  "rejected": [
    {
      "option": "Treat a zero-length or unparsable proof as absent",
      "reason": "A proof that differs may record something the operator must look at; a proof that can never be partial removes the case without weakening the comparison."
    },
    {
      "option": "Remove stale stash locks or a stale recovery snapshot on the next apply",
      "reason": "A lock held by a live Git process looks the same, and removing it could corrupt the stash reflog. Git leaves this to the operator too, and the drop's recovery design belongs to its own file."
    },
    {
      "option": "A progress file",
      "reason": "Declined in the order's design: the byte proofs already are the progress."
    }
  ],
  "followup": "scripts/lib/stash-drop.mjs: a stopped drop leaves states a rerun cannot pass without the operator. They are the three lock files, a recovery snapshot that no longer matches once the reflog changes, and a reflog installed before its ref. Name each in the refusal with its remedy (remove the named locks after checking no Git process holds them; restore refs/stash and its reflog from the recovery snapshot), write the recovery snapshot whole by link as harness-prune.mjs now writes its proofs, and add a fixture that stops a drop at each point. Priority: low.",
  "reopenWhen": "An operator apply is observed stopping at a stash in one of these states."
}
```

## WO-171-D008 — How the fixtures count, stop and change an apply

```json
{
  "id": "WO-171-D008",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "Fixtures act on the apply from outside the module through preloads (`--require`, then `module.syncBuiltinESMExports()`, as the reservation race harness already does), so the module's own `node:fs` bindings are observed. Criterion 1 counts plans as the child's `readdirSync` calls on the retained directory, which only a plan makes. Criteria 3 and 4 act after the Nth removal of a lane directory (`/retained/WO-NNN` exactly): `stop` sends SIGTERM to the child itself and blocks on `Atomics.wait` until the signal lands, and `touch` appends to a later lane's file. The proof fixture stops the child at the proof's link.",
  "evidence": [
    "Criterion 1 fails against the 4c34b332 module and against the re-plan mutant (actual 7 plans, expected 1); the unpublished sentinel lane alone could not tell those apart (review finding, D010)",
    "The stop and change fixtures pass on the new module; the stop lands before any later deletion (third and fourth lanes intact, child signal SIGTERM)",
    "The first version of the stop preload counted every rmSync under `/retained/WO-`, which the partial-proof cleanup also calls; it now matches lane directories only"
  ],
  "rejected": [
    {
      "option": "A fake `git` that kills its parent on the Nth call",
      "reason": "That couples the stop to how many Git calls a check makes, an implementation detail this order changes."
    },
    {
      "option": "Stopping on a pre-existing stash lock",
      "reason": "That is a refusal, not an interruption; the WO-160 fixtures already cover it."
    },
    {
      "option": "An `onPlan` callback or a plan count in the output",
      "reason": "Production code would report on itself, and the fixture would pass against any code that sets the counter."
    }
  ],
  "reopenWhen": "Node stops honouring `syncBuiltinESMExports` for `node:fs` named imports, or the plan stops listing the retained directory with `readdirSync`."
}
```

## WO-171-D009 — Register rows allocated to this order

```json
{
  "id": "WO-171-D009",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "Leave both provenance rows as allocated for the close to retarget (the order's criterion 8). FUP-6aafd40115ac97fd (WO-142-D022): item (a) is delivered by D002 and D003; item (b), the product-gate suite that writes target lanes in the real checkout, is this order's non-goal and should outlive the close with its own condition. FUP-866699c54128edc1 (WO-148-D002) is delivered whole by D005.",
  "evidence": [
    "docs/planning/followups.json: both rows allocated to WO-171 on 2026-09-27; FUP-6aafd40115ac97fd's reason says item (b) stays out as the non-goal",
    "docs/work-orders/WO-171-prune-apply-finishes.md Non-goals and criterion 8"
  ],
  "rejected": [
    {
      "option": "Dispose of the rows from this executor dispatch",
      "reason": "Criterion 8 places the retarget at close, and the register records dispositions from planning passes and final review."
    }
  ],
  "reopenWhen": "The close finds item (a) incomplete, or item (b) has already been allocated elsewhere."
}
```

## WO-171-D010 — Independent review of the change and its dispositions

```json
{
  "id": "WO-171-D010",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "Before handoff, three read-only reviewers, one lens each (deletion safety, the fixtures against the criteria, resume and edge cases), judged the working tree. Their nine findings are disposed as follows. Fixed: usage released on the blob's existence (blocking, found by two lenses; D004); global reads made lazy (D002); criterion 1 not counting plans (D008); criterion 2 not reading --limit (D003); a partial byte proof halting every later apply (D007). Recorded as decided: the release is not re-read before a deletion (D002). Boarded: the stash drop's stop states (D007).",
  "evidence": [
    "Review workflow wf_49eb7190-b22: three agents, 155 tool uses, 834 s; each ran the prune fixtures and probes under the session scratch and wrote nothing in the repository",
    "Each fix has a fixture that fails without it: this order's first version, saved before the review, fails exactly the usage, unreadable-global and proof fixtures and passes the other five; plans fail against the re-plan mutant, --limit against a mutant without it, and the usage rule against a mutant that releases on any committed blob",
    "While building the --limit mutant, a scratch command edited this worktree's module instead of the copy and removed the two --limit lines. The diff size exposed it; the lines were restored at once, and the 19 prune fixtures passed on the restored file"
  ],
  "rejected": [
    {
      "option": "Hand off with the first version and leave the findings to verification",
      "reason": "One finding deletes usage rows on the operator's next apply; the others are cheap to fix inside this order's files."
    }
  ],
  "reopenWhen": "Verification finds a defect in a disposition recorded here."
}
```

## WO-171-D011 — The follow-up feed over this change

```json
{
  "id": "WO-171-D011",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "Ran `npm run plan -- followups --touching` on this order's change and judged each returned row. None names work inside this order's files or objective, so each is left for the final review to dispose, with the proposal beside it. The two provenance rows are allocated to WO-171 and are closed to the feed (D009).",
  "evidence": [
    "npm run plan -- followups --touching, 2026-09-27, register revision 7ba87e89ee3a8c0a8d43f3e9f021a2fba7a8570856a006865de81ea0568ab942 before the review: 16 changed paths and WO-171, 142 pending rows, 6 matched, no continuation. Rerun after the gate, register revision 32958d6a32e5c65133a81a911c4098f5dce4266ce609e4b244ff517f9ee2bbba: 16 paths, 144 pending, 8 matched, no continuation. The same six rows plus this order's two new rows, FUP-dc6c139003bd4b89 (D004) and FUP-e62c63344f52405f (D007), whose proposals the evidence README carries",
    "FUP-56b599e15f97e666 (WO-099-D027; matched product 07): a match on a document name. This order does not change resident-state.ts. Proposed: deferred, unchanged condition",
    "FUP-71fc2efc208f597a (WO-085-D004; matched this order's decisions and the decisions index): a match on file names. These records quote only the `resume: next` dispatch phrase, as earlier orders do, and no operator chat. Proposed: deferred, unchanged condition",
    "FUP-8cfd3ff52146a016 (WO-166-D008; matched scripts/test-harness.mjs): the release-close fixture against the real runtime is not this order's work; its test edits are the prune fixtures. Proposed: deferred, unchanged condition",
    "FUP-acfe4bfda716d8fb (WO-158-D008; matched docs/control/current.md, a generated projection): this order keeps usage copies but changes no usage or meta attribution; that is WO-170's ground. Proposed: deferred, unchanged condition",
    "FUP-f1c7a256bec46737 (WO-054-D006; matched product 07): the cold-start ceilings are untouched. Proposed: deferred, unchanged condition",
    "FUP-fd05316b6030ef73 (WO-168-D009; matched README.md, this order's evidence README, product 07 and the work-order index): this order's product 07 edit is the retention paragraph only, not the Codex reservation text. Proposed: deferred, unchanged condition"
  ],
  "rejected": [
    {
      "option": "Fix a matched row inside this order",
      "reason": "None of them names a defect in the prune or its fixtures, so fixing one would widen the order."
    }
  ],
  "reopenWhen": "The final review's own run of the feed returns a row this record did not judge."
}
```

## WO-171-D012 — Verification found a preserved usage copy the prune misses

```json
{
  "id": "WO-171-D012",
  "date": "2026-09-27",
  "dispatch": "resume: verify",
  "decision": "Criterion 5 is unmet. Worktree preservation can place a second usage copy at process/usage.jsonl.from-WO-NNN, or under process.from-WO-NNN/usage.jsonl, when archived paths collide. The prune's usage guard recognizes only paths ending in process/usage.jsonl. A committed snapshot naming the original copy can therefore make the lane a candidate while another copy in its deletion inventory has no committed snapshot. Verification ran no apply against the operator's checkout; no loss is observed in the recorded current listing.",
  "evidence": [
    "scripts/lib/intake-reconciliation.mjs plan maps a differing destination to <initial>.from-WO-NNN, including a file or parent directory; scripts/worktree.mjs finish preserves the subject and then clean detached derivatives into the same order lane",
    "scripts/lib/harness-prune.mjs usageCopy at lines 543-548 matches only an exact process/usage.jsonl suffix; the WO-171 usage fixture creates only that canonical name",
    "Verifier isolated reproduction in two temporary Git repositories: reconcileWorktreeMaterial produced docs/control/local/retained/WO-901/process/usage.jsonl.from-WO-901 with collision-preserved disposition. After HEAD's WO-901/meta.json named only the canonical file's SHA-256, planHarnessPrune with an injected published Release returned WO-901 as a candidate, inventory [process/usage.jsonl, process/usage.jsonl.from-WO-901], retained []. Temporary repositories were removed.",
    "scripts/test-process-debt.mjs closeout archive collisions and partial-copy retries fixture proves the preservation suffix is a supported path, not malformed input",
    "docs/verifications/WO-171/VER-001.md finding F1"
  ],
  "rejected": [
    {
      "option": "Pass on the canonical usage fixture",
      "reason": "Its path set omits a supported preservation outcome; the isolated reproduction shows the guard can pass while an unsnapshotted usage copy is deleted."
    },
    {
      "option": "Edit the implementation during independent verification",
      "reason": "The verifier records the failed subject for the order's repair role to change and independently re-verify."
    }
  ],
  "followup": "WO-171 repair: make usage retention recognize every usage copy name that reconciliation can create, including file and parent-directory collision suffixes and their numbered forms; require the committed snapshot to name each copy's SHA-256 before the lane becomes a candidate. Add fixtures for both collision forms, then rerun the review and documentation gates. Do not run prune apply against the operator's checkout.",
  "reopenWhen": "A repair fixture demonstrates both collision forms retained until each digest is named by a committed snapshot, and a later independent verification judges the repaired subject."
}
```

## WO-171-D013 — Usage retention follows preservation's collision names

```json
{
  "id": "WO-171-D013",
  "date": "2026-09-27",
  "dispatch": "resume: fix",
  "decision": "Repair VER-001 F1 in scripts/lib/harness-prune.mjs. A usage copy is a regular file whose path ends in `process/usage.jsonl` at any depth, where either the `process` component or the `usage.jsonl` component may carry one or more `.from-WO-NNN` or `.from-WO-NNN-<n>` suffixes. Those are the names scripts/lib/intake-reconciliation.mjs gives a colliding file or directory. D004's rule is unchanged: the lane stays retained until HEAD's meta.json names the SHA-256 of every such copy. A new fixture produces each name through the real reconcileWorktreeMaterial call rather than writing the names by hand, so it also fails if the producer's names change. scripts/test-runner.mjs declares intake-reconciliation.mjs as a source of the harness-fixtures suite, so a review gate re-runs the fixture when the producer changes. Product 07's sentence already says 'any usage copy it holds' and is not edited. This repair discharges D012's follow-up (FUP-6f08db4cc5d96847). Its register disposition belongs to final review with the other rows (D009).",
  "evidence": [
    "scripts/lib/intake-reconciliation.mjs plan: a destination that exists or is reserved with other bytes, or a directory whose destination is not a directory, becomes `${initial}.from-${workOrder}` and then `-2`, `-3` and so on. A child's initial path is built from its parent's mapped destination, so both components can carry a suffix at once",
    "Only one writer produces the usage file: packages/skeleton/src/usage-observation.mjs writes `docs/control/local/process/usage.jsonl`. worktree finish preserves it into `retained/WO-NNN/` under that name or a collision name",
    "Fixture `WO-171 a collision-preserved usage copy keeps its lane until the snapshot names it`: reconcileWorktreeMaterial produced `process/usage.jsonl.from-WO-921`, `process/usage.jsonl.from-WO-921-2`, `process.from-WO-922/usage.jsonl` and `process.from-WO-923-2/usage.jsonl`. Against the unrepaired module it failed at its first listing: WO-922 and WO-923, whose only usage copies carry a suffix, were already candidates with no snapshot at all. This is broader than VER-001's reproduction, which needed a snapshot naming the canonical copy",
    "Repaired module: all three lanes are retained with 'usage has no committed snapshot'. WO-921 stays retained with 'usage copy is not in the committed snapshot' when its snapshot names only the canonical copy (VER-001's case), and again when it names two of the three. WO-923 stays retained when its snapshot names another copy's digest. The apply removes WO-921 and WO-922 once their snapshots name every copy, and each byte proof lists the preserved copies with their hashes. All nine WO-171 fixtures pass (`node --test --test-name-pattern \"WO-171\" scripts/test-harness.mjs`, 9 pass, 0 fail)",
    "Integration stashes carry no usage copy: scripts/lib/worktree-integration.mjs pushes with `git stash push --include-untracked`, which leaves ignored files such as `docs/control/local/` in place (Git's documented behaviour without `--all`; an inference from the source, not a stash inspection)",
    "The economy experiment for this order is D001; the repair starts no second one"
  ],
  "rejected": [
    {
      "option": "Retain on any file name that contains usage.jsonl",
      "reason": "No writer produces any other name, and D004 already reopens if a usage record turns up under another name. A rule tied to the producer's naming stays testable. A looser one would keep lanes for names nothing writes."
    },
    {
      "option": "Export the suffix pattern from intake-reconciliation.mjs and import it into the prune",
      "reason": "That edits a process-debt suite source outside this order's files. The fixture already ties the two modules together through the real reconcile call, and the declared-source line re-runs it whenever the producer changes."
    },
    {
      "option": "Leave the review gate's suite selection unchanged",
      "reason": "harness-fixtures would then not run when only intake-reconciliation.mjs changes, and the naming contract the new fixture pins could drift without a failing gate."
    }
  ],
  "reopenWhen": "Reconciliation gains another naming scheme, a usage record is found under a name this rule does not match, or an independent verification finds a usage copy that a lane candidate's inventory would delete while no committed snapshot names it.",
  "rationale": "Policy resistance is the material lens, as in D004: without the repair, a faster apply could still delete usage bytes that WO-170 exists to recover. Rule beating: the fixture gets its names from the producer, so it cannot pass on names the fixture invents. The added retention costs only disk space until WO-170 writes snapshots. Today it retains no additional lane: a read-only `find` over the main checkout's `docs/control/local/retained/` on 2026-09-27, during this repair, found 75 canonical copies and no copy with a suffix in either component. The other lenses change nothing beyond D004. NoOp leaves criterion 5 unmet and the order unmergeable."
}
```

## WO-171-D014 — Final review passes and boards where the usage rule looks for a digest

```json
{
  "id": "WO-171-D014",
  "date": "2026-09-27",
  "dispatch": "resume: final review",
  "decision": "FINAL-001 passes WO-171 on all nine criteria and changes no source. One minor defect is boarded rather than fixed. usageRetention releases a lane when each copy's SHA-256 appears anywhere in the text of HEAD's meta.json, not in a field that says the snapshot carries that copy, so a snapshot that mentions a digest for another reason (a copy it skipped, for example) would release the lane. Nothing writes a digest into meta.json today, and WO-170, the first producer, has not settled the field. Choosing a field here would pre-empt WO-170, which D004 declined for the same reason. A `<proof>.partial` left by a stop between the link and its removal also stays beside a whole proof on every later apply. It is a few kilobytes of residue in an ignored lane, never listed or inventoried.",
  "evidence": [
    "scripts/lib/harness-prune.mjs usageRetention: `snapshot.stdout.includes(copy.sha256)` after a JSON.parse whose result is unused",
    "Final-review safety helper, executed in throwaway repositories: a committed meta.json holding each digest only inside an unrelated `note` string, or all three digests joined in one string, made the lane a candidate. Malformed JSON holding the digests stayed retained with 'usage copy is not in the committed snapshot'. The base module has no usage rule, so the current rule is stricter than the base either way",
    "Same helper: with a whole proof and a leftover `.partial` present, the apply succeeds and the `.partial` remains. A `.partial` that is a directory refuses every run with EISDIR and keeps the lane. The module never creates either state except through a stop",
    "scripts/lib/meta.mjs has no digest field today (helper, reading); docs/work-orders/WO-170-meter-keeps-what-sessions-observed.md Design and criterion 5 write usage totals by role and nothing else, so WO-170 as filed would not release any lane under D004 (FUP-dc6c139003bd4b89)",
    "docs/final-reviews/WO-171/FINAL-001.md: the review gate, the read-only listing of the main checkout and the two helpers' reports"
  ],
  "rejected": [
    {
      "option": "Require `usageCopies[].sha256` in the prune now",
      "reason": "It fixes WO-170's format from this order, and a change to verified source needs a new review gate for a case no producer can reach today."
    },
    {
      "option": "Fail the review on the digest match",
      "reason": "No criterion is unmet. Criterion 5 asks that the snapshot release the lane, and the match is stricter than the base module and than the order's design words ('until meta.json exists')."
    }
  ],
  "followup": "scripts/lib/harness-prune.mjs usageRetention: once WO-170 (or its amendment) settles the field that names each carried usage copy's SHA-256, match the digest only in that field of the parsed snapshot. While the file is open, remove a leftover `<proof>.partial` when the proof beside it is already whole. Priority: low.",
  "reopenWhen": "WO-170 or any other producer writes a SHA-256 into meta.json, or a `.partial` is found beside a proof on the operator's host.",
  "rationale": "Mission: an operator apply that finishes and never removes the only copy of an order's usage record. Rule beating is the material lens: a digest found anywhere in the text passes the rule without the snapshot actually carrying the copy. It is boarded because no producer writes a digest today, and the fix belongs with the field WO-170 chooses. Naive Interventionism: editing verified source for a case nothing can reach costs a new gate and pre-empts the next order. NoOp would leave the row unrecorded until WO-170 writes digests the rule reads loosely."
}
```
