# WO-168 decisions

## WO-168-D001 — economy experiment: the rebuild step

```json
{
  "id": "WO-168-D001",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "kind": "experiment",
  "decision": "Keep `npm run build` as the rebuild step of every fixture iteration. A forced in-place build saved about 0.3 s; an incremental build was not timed and cannot save more than the 0.64 s the staged build takes.",
  "question": "This order edits four TypeScript sources across eight items and every fixture run needs a rebuilt dist. Does an in-place project build give the same fixture-ready runtime materially faster than the staged, forced `npm run build`?",
  "alternatives": [
    "Run `npm run build` (scripts/build.mjs: staged copy, `tsc -b --force`, atomic publication) before each fixture iteration.",
    "Run `node node_modules/typescript/bin/tsc -b` in place for iteration and the staged build only before evidence runs (timed here with `--force`; the incremental form was not timed)."
  ],
  "observation": "On the activation tree with unchanged sources: `npm run build --silent` took 0.64 s real (1.72 s user); `node node_modules/typescript/bin/tsc -b --force` in place took 0.33 s real (1.50 s user). node_modules/typescript/package.json reports 7.0.2. Four read-only mapper agents were running during both timings, so each figure is an upper bound.",
  "budget": {
    "wallSeconds": 300
  },
  "execution": "run",
  "cost": {
    "wallSeconds": 21,
    "tokens": null,
    "commands": [
      "/usr/bin/time -p npm run build --silent",
      "/usr/bin/time -p node node_modules/typescript/bin/tsc -b --force"
    ],
    "source": "Shell timing in the executor session; wallSeconds is the two commands plus their inspection, estimated from the session clock (22:59:00 to 22:59:21 EDT); tokens are part of the dispatch usage observation."
  },
  "effect": {
    "wallSecondsPerOrder": 0,
    "tokensPerOrder": null,
    "commands": [
      "npm run build"
    ],
    "summary": "The timed alternative saves about 0.3 s per iteration and no alternative can save more than 0.64 s, more than an order of magnitude below what an iteration's fixture run costs (WO-158-D001 measured 11.65 s for a focused harness pattern; this order's focused harness pattern took 14.6 s). No method changes; focused `--test-name-pattern` iteration with one full suite run before handoff stays the practice WO-158-D001 adopted."
  },
  "outcome": "kept-current",
  "regression": "unknown",
  "history": {
    "lastAdoptedImprovementAt": "2026-09-25",
    "experimentsSinceAdoption": 4
  },
  "evidence": [
    "scripts/build.mjs atomicBuild: stages sources under .runtime/build-*, runs `tsc -b --force`, publishes each package's dist by rename",
    "The two timed commands above, run at 2026-09-27T02:59Z; git status afterwards showed no tracked change",
    "docs/evidence/WO-155 to WO-166 decisions scanned for kind experiment: WO-159-D012 (2026-09-25) is the latest adopted; WO-160-D001, WO-161-D002, WO-165-D002 and WO-166-D002 follow it by order number. The same-day order of WO-159, WO-160 and WO-161 is not verified, so the count of four is an inference from order numbers"
  ],
  "rejected": [
    {
      "option": "Iterate on an in-place incremental build",
      "reason": "At most 0.64 s saved per iteration (0.3 s measured for the forced in-place build), and it would leave iteration runs on a runtime the staged build did not publish."
    }
  ],
  "reopenWhen": "A full build exceeds ten seconds on this tree, or the TypeScript toolchain changes."
}
```

## WO-168-D002 — approach and re-observation

```json
{
  "id": "WO-168-D002",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "Execute the eight items with one writer and read-only fan-out: four mappers re-observed every item on the activation tree before it was edited, and four reviewers judged the working tree before anything version-bound was regenerated or minted. Every item reproduces and ends fixed. One line of the order's Cost declaration does not reproduce at hook level: `ls docs 2>/dev/null` is classified `null` by the list but was already admitted by the hook through the destination adapter.",
  "evidence": [
    "git rev-parse HEAD: 3d58955d; a mapper's `git diff --stat 4c34b332 HEAD` over harness-host.ts, gate-evidence.mjs, scripts/harness.mjs, scripts/test-harness.mjs and scripts/resume.mjs was empty, so the order's observations dated at 4c34b332 describe the activation tree",
    "This session at 2026-09-27T02:50Z, after the dispatch printed the scratch path: `ls -ld` of the path answered No such file or directory (item 1, executed)",
    "Read-only probe of the base-built classifier: `liveGateReads` returned null for the seven gap commands and admitted `node 'scripts/harness.mjs writer' --show` (items 4 and 4f, executed)",
    "Scratch probe built from the fixture helpers and run against the base-built runtime under a live gate: six gap commands denied by the hook with the live-gate refusal; `ls docs 2>/dev/null` admitted; `ls docs 2>/tmp/x` denied by the outside-write guard, not the gate; an executable post-index-change hook and a `%G` format.pretty both admitted `git --no-pager` reads; the scratch directory was absent after a dispatch; a write under a session-scratch root replaced by a link to an ungranted directory was admitted (items 1, 2 and 4, executed)",
    "Mapper probe of runHarnessHook on the base-built runtime with an override exit and three refused inputs: only the protocol refusal printed (item 3c, executed); items 3d, 5 and 6 rest on code reading at HEAD and on WO-166-D014's recorded probe",
    "The five new harness cases run against the base-built runtime before the first rebuild each failed at the expected assertion (hedge unmeasured, classifier null, exit message absent, scratch directory absent twice); the process-debt cases were first run after the rebuild, so items 5 and 6 have no executed base observation of their own",
    "node scripts/harness.mjs usage for this session at 2026-09-27T04:08Z: 8 subagents, exact-observed, cap 20, 12 remaining; both workflows finished with no agent in error"
  ],
  "rationale": "Mission and critical path: each item removes recurring operator or session attention on the machinery that carries the rules (a lost gate command, a refused read, a stranded reservation), which is the outcome the mission names; none advances the runtime's critical path directly, and the order's provenance is the operator's drain dispatch. Policy resistance and escalation: no guard, gate or step is added; item 4 narrows refusals and items 1, 5 and 6 remove failure modes. Tragedy of the commons: eight read-only agents of twenty, batched by item group, one writer; the mapping cost 985,627 and the review 1,003,685 subagent tokens; the review returned eighteen findings, of which D012 records the dispositions. Drift to low performance and rule beating: fixtures were run red against the base runtime where they could be, and a scratch probe established base hook verdicts, because a classifier table alone cannot show what a session meets. Success to the successful: the existing fixture files and helpers are reused, no parallel harness. Shifting the burden: nothing here depends on operator rescue. Seeking the wrong goal: the item 4 discrepancy is recorded instead of being counted as a removed refusal. Naive Interventionism: the hooks guard this session while it edits them; they run from a pinned snapshot, so a rebuild never changes the guard mid-session, and regeneration waits until no gate is live. NoOp leaves every role session to meet the absent directory and the refused reads.",
  "rejected": [
    {
      "option": "One worktree per item with parallel writers",
      "reason": "Items 1 to 5 edit the same two files; the repository reserves one writer per worktree and integration would cost more than the edits."
    },
    {
      "option": "Mint editions and regenerate before review",
      "reason": "Editions are immutable; WO-166 minted five authority revisions because source changed after minting (WO-166-D005, D006, D012)."
    },
    {
      "option": "Count `ls docs 2>/dev/null` among the refusals this order removes",
      "reason": "The base hook admitted it; only the classifier and the refusal text change for that command."
    }
  ],
  "reopenWhen": "A verifier or reviewer session on this branch is refused one of the four admitted forms, or an item is found not to reproduce on the activation tree."
}
```

## WO-168-D003 — item 1: the printed scratch path exists

```json
{
  "id": "WO-168-D003",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "Add `ensureHarnessSessionScratch`, called by the Claude role-dispatch briefing, `beginHarnessSession` and `harness scratch` before the path is printed or returned. It inspects the path first and creates it only when absent: the shared `<system-temp>/dotln` parent at the default mode, the session's own two directories at 0700. An existing real directory of the session user is used as it is; a file, a link, another user's directory or any error is one advisory naming the path and the cause. `harnessSessionScratch` stays a pure path function for the grant judgment. `scripts/harness.mjs` loads the new entry point inside the `scratch` action. The harness and process-debt suites keep what their sessions create in a temporary directory of their own.",
  "evidence": [
    "packages/skeleton/src/harness-host.ts ensureHarnessSessionScratch and notOwnDirectory; its three call sites; scripts/harness.mjs scratch",
    "scripts/test-harness.mjs `WO-168 a printed session scratch path exists ...`: a real dispatch, `harness begin` and `harness scratch` each leave a directory of mode 0700 owned by the session user that the fixture never creates; an existing 0755 directory keeps its mode and contents; a file and a link each yield exactly one advisory in the briefing and in the operator notice, the dispatch still resolves its role, and the link's target stays empty",
    "scripts/test-harness.mjs WO-144 repair case: its own `mkdirSync(scratch)` is removed and it asserts the directory the dispatch created",
    "Mapper observation: <system-temp>/dotln held 55 session directories, every one mode 0755, the mode a session's own `mkdir -p` produces under umask 022",
    "Two reviewers, by executed primitives and code reading: a recursive mkdir at 0700 also made the shared `<system-temp>/dotln` parent private, so on a temporary directory shared between users a second user's lstat of their own root would fail with EACCES and the outside-write guard would admit with its advisory; the parent is now created separately",
    "scripts/test-fixture-temporary.mjs, imported first by scripts/test-harness.mjs and scripts/test-process-debt.mjs; `ls <system-temp>/dotln | wc -l` read 59 before and 59 after two full harness-fixtures runs and the focused runs, and no `dotln-fixture-temporary-` directory remained"
  ],
  "rationale": "Inspecting before creating names the cause (`it is not a directory`) where a recursive mkdir would answer EEXIST, and sees a link to a directory that a recursive mkdir passes over. The advisory reaches both channels of the session hook because the operator notice and the model's briefing have different readers; the briefing drops `Use this path for temporary work` when the path is unavailable, so the model is not told to use what does not exist. A static import of the new export in scripts/harness.mjs would make every `harness` action fail at module link time against a runtime built before this order, the skew WO-166-D014 met at release close, so the entry point is loaded where it is used and its absence names `node scripts/bootstrap.mjs`. Rule beating was the lens WO-166-D015 named: the only fixture created the directory itself, so it is now the fixture that proves existence.",
  "rejected": [
    {
      "option": "Make harnessSessionScratch itself create the directory",
      "reason": "The grant judgment and two fixtures compute other sessions' paths; computing must not create, and a string return has no channel for the advisory."
    },
    {
      "option": "Create lazily at the first write",
      "reason": "Declined by the order: the redirect that failed was a shell's, which no hook can complete."
    },
    {
      "option": "chmod an existing directory to 0700",
      "reason": "The order uses an existing real directory as it is; changing the mode of a directory a session made is an effect nobody asked for."
    },
    {
      "option": "Leave the fixture residue to the host's temporary-file cleanup",
      "reason": "My first choice, reversed after two reviewers showed one fixture id is random per run and a fixed-id fixture is judged against whatever sits at its path in the real temporary directory. Removing entries from the real directory could delete a live session's; a directory of the suite's own cannot."
    },
    {
      "option": "Make the shared parent world-writable with the sticky bit",
      "reason": "It would let a second user create their own directories, and it would add a world-writable directory the harness owns. The default mode keeps the guard working for every user; creation for a second user on a shared temporary directory stays an advisory, as their own mkdir was before."
    }
  ],
  "reopenWhen": "A role session reports the printed path absent, a dispatch is blocked by the scratch step, a suite outside the two that import the private temporary root is observed leaving scratch directories, or DotLn is run by two users on one shared temporary directory."
}
```

## WO-168-D004 — item 2: a granted session root is a real directory

```json
{
  "id": "WO-168-D004",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "For session-scratch and host-scratchpad only, the outside-write guard lstats the root it is about to grant under. A final component that is a link, is not a directory, or belongs to another user grants nothing, and a refusal of a destination that root would have held names the root and the cause. An absent root is judged as before. An lstat failure other than absence throws exactly as the root's resolution always did, which is the guard's existing single advisory and an admission. system-temp, operator-root and main-intake are unchanged.",
  "evidence": [
    "packages/skeleton/src/harness-host.ts grantedSessionRoot and its use in outsideWriteResponse",
    "scripts/test-harness.mjs `WO-168 a granted session root is a real directory ...`, on three hooks and two call shapes. With a harness that grants only session-scratch and host-scratchpad, a write directly under the temporary directory is refused without naming a root, a real scratch root admits with no notice, the swapped root refuses with `Granted root <root> grants nothing: it is a symbolic link (WO-168)` and leaves the target empty, an absent root admits, and the same three verdicts hold for the host scratchpad. With the default harness, a temporary directory reached through a link admits, and a root under a file ancestor (ENOTDIR) admits with exactly one `outside-write guard unavailable` advisory across the three hooks",
    "Base probe: the same swap was admitted by the base-built runtime",
    "packages/skeleton/src/loadouts/contributor.ts: every default role carries system-temp, session-scratch and host-scratchpad, so the fixture narrows TMPDIR and links to a directory outside it",
    "Review finding: with the default grants the scratch path lies inside the system temporary root, so the first version of the fixture's real-root and absent-root admissions were decided by that grant and could not fail for the rule they named; the fixture now removes the covering grant"
  ],
  "rationale": "The order asks that an lstat failure fall back to the earlier judgment with one advisory and never a refusal. At 4c34b332 that judgment is `prospectiveRealpath`, which lstats the same component and throws the same code into the guard's catch; a separate advisory path would be reachable only for a transient error and would add plumbing no fixture could exercise, so the failure is left to throw. Only a root the refused destination would have used is named, so an unrelated refusal does not mention the scratch root. Naive Interventionism: the refusal sentence keeps its order and its existing regular expressions still match.",
  "rejected": [
    {
      "option": "Catch the lstat failure and continue with a second advisory channel",
      "reason": "Same observable result, more code, and the branch where the fallback succeeds cannot be driven by a fixture."
    },
    {
      "option": "Apply the rule to system-temp, operator-root and main-intake",
      "reason": "The order names two kinds and requires system-temp unchanged; an ownership rule would disqualify a root-owned /tmp."
    },
    {
      "option": "Refuse when the root is a regular file",
      "reason": "A destination beneath a file cannot be resolved (ENOTDIR) before any root is judged, so the outcome is the guard's advisory and an admission; the write itself cannot succeed. The root still grants nothing."
    }
  ],
  "followup": "Planner, low priority, with the next order that edits the outside-write guard: only the final component of a session root is inspected, so an ancestor (`<system-temp>/dotln/<key>` or the host scratchpad's session directory) replaced by a link to a tree that holds a real user-owned `scratch` still carries the grant; and the judgment and the write are separate moments. Decide whether the two ancestors the harness itself names are inspected too.",
  "reopenWhen": "A write lands outside every granted root through a swapped root or ancestor, or a session is refused under a real root it owns."
}
```

## WO-168-D005 — item 3: the override exit and the record it names

```json
{
  "id": "WO-168-D005",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "With an override exit pending, a refused hook input prints the exit message, the refusal as the reason and the record command, instead of the protocol refusal alone. After the lifecycle is spawned, whether OperatorOverrideRecorded was appended is decided by the order's log, not by the exit status alone: a journal observation that cannot be written is swallowed, and a lifecycle that appends and then fails is reported as recorded with the failure named.",
  "evidence": [
    "packages/skeleton/src/harness-host.ts runHarnessHook inputRefusal; recordOperatorOverride records(), appended and the receipt",
    "scripts/test-harness.mjs `WO-168 an override exit prints ahead of an input refusal ...`: no cwd at `operator override: off` prints `operator-control exited`, MISSING_FIELD at $.cwd and the record command, and appends nothing; without an override the protocol refusal is unchanged; with the writer held and the session journal replaced by a directory the event is appended and no `was not appended` text prints; a lifecycle wrapper that fails after the append is reported `recorded ...; resume then failed`; a wrapper that refuses before the append still reports `was not appended`",
    "Mapper reading of scripts/resume.mjs: the override-record case appends, then projects current.md and refreshes the index; a failure there exits 1 with the event in the log"
  ],
  "rationale": "Criterion 3 names the journal throw; the design sentence says an appended record is never reported as not appended, and a mapper found a second route to that report. Counting the order's OperatorOverrideRecorded events before and after the spawn decides both routes by the fact itself. Rule beating: the fixture proves the negative as well, so a change that always reports `recorded` fails it. The refused-input response contains `was not appended`, which is true there: no root was resolved and nothing was appended.",
  "rejected": [
    {
      "option": "Wrap only the journal call",
      "reason": "It meets the criterion and leaves the post-append failure reported as not appended."
    },
    {
      "option": "Block the prompt when the input is refused",
      "reason": "An override's exit is never withheld, and a UserPromptSubmit refusal is already non-blocking."
    }
  ],
  "reopenWhen": "An override exit prints nothing, or a recorded override is reported as not appended."
}
```

## WO-168-D006 — item 4: four argument forms, one spelling, two Git conditions

```json
{
  "id": "WO-168-D006",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "The tokenizer records an unquoted `<` or `>` per word (`redirects`), as WO-158 recorded unquoted glob characters. The live-gate list then admits a word that holds `<` or `>` only inside quotes; a revision suffix in an unquoted operand of a listed Git read when the word holds no glob character, no dollar sign, no tilde at its start or after `=` or `:`, and only brace pairs free of a comma and of `..`; an input redirect whose operand is a literal path; and an output redirect (`>`, `>>`, with or without a descriptor) whose literal operand is exactly `/dev/null`. `&>` stays off the list. `npm run --silent resume -- status` is admitted, `--silent` once on either side of `resume`. Helper forms are compared argument by argument. `configuredGitPrograms` also refuses for a `%G` in `format.pretty` or `pretty.<alias>`, for an executable `post-index-change` in the hooks directory `git rev-parse --git-path hooks` names, and for a `hook.<name>.event` of `post-index-change`; a hooks directory that cannot be named refuses. `LIVE_GATE_READ_LIST` is unchanged; the refusal text and product 07 state the forms and say that any other redirect is judged by its destination.",
  "evidence": [
    "packages/skeleton/src/harness-command.ts ShellWord.redirects, liveGateNode, liveGateNpm, revisionOperand, liveGateReads; packages/skeleton/src/harness-host.ts LIVE_GATE_GIT_HOOKS, configuredGitPrograms, LIVE_GATE_READ_TEXT",
    "scripts/test-harness.mjs `WO-168 a live gate admits four argument forms ...`: a table of 79 commands (26 admitted, 53 refused) with an admitted and a refused row for each form, the seven gap commands admitted, `git --no-pager diff $(x)`, `ls docs/*.md`, `wc -l <> fixture.ts`, `ls docs 2>/tmp/x` and `cut -c1-80 fixture.ts` refused, the list's exact text, and hook-level rows on three hooks with the global and system Git configuration excluded; at the hook `ls docs 2>/tmp/x` is refused by the outside-write guard and not by the gate",
    "Scratch repository on Git 2.55.0 (executed): an executable post-index-change hook fired for `git --no-pager status` and `git --no-pager diff`, stayed quiet for `diff HEAD~1`, `log -1`, `show --stat HEAD`, `stash list` and `--no-optional-locks status`, and did not fire at mode 0644; the same hook under core.hooksPath fired; a hook defined by `hook.probe.command` and `hook.probe.event post-index-change` fired for diff and status",
    "Mapper probe: `cat \"fixture.ts\">fixture.ts` tokenizes to one word `fixture.ts>fixture.ts` with quoted true, so the whole-word quoted flag cannot carry the first form",
    "Base probe under a live gate: `ls docs 2>/dev/null` was admitted by the base hook and `ls docs 2>/tmp/x` was refused by the outside-write guard; the other six gap commands were refused by the gate",
    "Review, executed against the base and the working-tree builds: `ls docs &>/dev/null touch gate.ts` was admitted by my first version and refused by the base; /bin/dash runs the words after `&>/dev/null` as a command of their own, while bash and zsh do not. `git --no-pager diff $~x` was admitted by my first version; zsh expands `$~x`. Both are refused now",
    "Focused run after those corrections: the hook still admits `ls docs &>/dev/null touch fixture.ts`, through the older destination adapter, whose WO-144 fixture pins `true &>/dev/null` as a discard"
  ],
  "rationale": "Security is the material lens. The first form rests on per-character provenance because a quoted word beside an operator is one token here and two in a shell. A word that mixes quotation with an operator or an expanding character stays refused. The tilde rule is one step stricter than the order's wording because bash expands `a=~/x` in an argument; the result is a changed argument, never a write, and refusing it costs nothing. The configured hook is outside the order's words (`core.hooksPath or the repository's hooks directory`) and inside its purpose: on this Git a hook needs no file, and the probe shows it runs. Failing closed when the hooks directory cannot be named refuses a Git read outside any repository, which fails by itself. Seeking the wrong goal: the list names no new program, and `ls docs 2>/tmp/x` is asserted where it is decided, in the classifier, with a redirect onto a gate input as the hook-level row.",
  "rejected": [
    {
      "option": "Admit any quoted word that contains `<` or `>`",
      "reason": "It would admit `cat \"fixture.ts\">fixture.ts`, a write onto a gate input."
    },
    {
      "option": "Refuse a Git read while any executable file sits in the hooks directory",
      "reason": "A repository holds sample hooks and a hook manager's pre-commit; only a hook a listed read can start is a reason."
    },
    {
      "option": "Admit `>&/dev/null` and a quoted attached operand such as `2>'/dev/null'`",
      "reason": "The order asks for a literal operand that is exactly /dev/null; both spellings stay refused and the unquoted forms cover the use."
    },
    {
      "option": "Teach metadataCommand and invocationEffects the second npm spelling",
      "reason": "The order admits the spelling on the live-gate list; the effect classifier outside a gate is another seam with its own fixtures."
    },
    {
      "option": "Admit `&>/dev/null` as an output redirect",
      "reason": "My first version did. A POSIX shell without the operator backgrounds the reader and runs the following words; `>/dev/null 2>&1` says the same thing in every shell."
    },
    {
      "option": "State in the refusal text that every other redirect is refused",
      "reason": "My first wording. A redirect off the list is judged by the destination adapter, which admits one that names no gate input; the text now says so."
    }
  ],
  "followup": "Planner, low priority, with the next order that edits the shell destination adapter or command effects: (a) invocationRedirects treats `&>` and `&>>` as one redirect, so the hook admits `ls docs &>/dev/null touch <gate input>` during a live gate although a shell without that operator (dash, busybox ash) would run the touch; WO-144's fixture pins `true &>/dev/null`, so decide the adapter's spelling there, and establish which shell each supported host runs tool commands through. (b) `npm run --silent resume -- status` is on the live-gate list and is still classified shell.run by invocationEffects and metadataCommand. (c) A word that begins with `=` is a zsh expansion (`=ls`, `=(ls)`), admitted before and after this order; it names only listed programs. (d) An input redirect from bash's /dev/tcp and /dev/udp pseudo-paths opens a connection and writes no gate input. (e) The metadata exception still admits `git status --short` and `git diff --check` without the configured-program check (WO-142 N7).",
  "reopenWhen": "A command the list admits writes a file, runs an unlisted program or expands; a listed Git read starts a configured program; or a session beside a live gate is refused one of the four forms."
}
```

## WO-168-D007 — item 5: a refused Codex dispatch releases the reservation it placed

```json
{
  "id": "WO-168-D007",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "A Codex dispatch that placed its reservation and is then refused, by anything before its event is recorded, releases that reservation. `reserveCodexDispatchWriter` releases when the reservation call itself throws; `scripts/resume.mjs` holds a release from the reservation until `appendTransition` records the dispatch's event, and runs it when the dispatch throws. A reservation the session already held, or a holder that could not be observed, is never released by a refusal. The refusal stays a refusal. `acquireHarnessWriter`, `reserveHarnessWriter` and the Claude path are untouched.",
  "evidence": [
    "packages/skeleton/src/harness-host.ts reserveCodexDispatchWriter; scripts/resume.mjs releaseRefusedDispatch, reserveCodexDispatch, appendTransition and main",
    "scripts/test-process-debt.mjs `WO-168 a Codex dispatch refused after placing its reservation releases it ...`: with the observation log a directory, `resume next` and `resume verify` each exit 1 before any event, `harness writer --show` reports reserved false, the writer event log reads acquired, released, acquired, released; a second session's dispatch is admitted and holds the writer; the refused session is then refused as a foreign writer and the second session's reservation stands; and with a work order that lacks its Model line, `resume next` exits 1, the log gains acquired then released, and the writer is free",
    "docs/evidence/WO-166/decisions.md D014: the probe that found the stranded reservation; the WO-153 fixture comment now states that a journal broken before the reservation refuses the dispatch and releases what it placed",
    "Review finding, from code: the first version released only inside the reservation call, while every dispatch site reserves before work that can still refuse (the briefing reads the order's declaration; the append can fail)"
  ],
  "rationale": "WO-166-D014 asked whether the log failure should stay a refusal or become an advisory; the order decides it stays a refusal and leaves the worktree as found. Releasing in the one caller that is Codex-only keeps Claude's behaviour unchanged by construction; `releaseHarnessWriter` retires only an instance whose actor is this session, so a throw unrelated to placement cannot remove another session's reservation. An unobservable holder is treated as held because releasing on a guess could drop a reservation the session owned.",
  "rejected": [
    {
      "option": "Catch inside acquireHarnessWriter",
      "reason": "It would change Claude's path or key Codex on an incidental argument."
    },
    {
      "option": "Turn the log failure into an advisory and keep the reservation",
      "reason": "The order decided the refusal; a dispatch that cannot journal its acquisition should not proceed to a control event."
    },
    {
      "option": "Compute each briefing before reserving",
      "reason": "It moves one known throw ahead of the reservation and leaves the append and the post-dispatch projection able to strand it; holding the release until the event is recorded covers every site with one rule."
    }
  ],
  "reopenWhen": "A refused dispatch leaves a reservation its own session cannot reclaim, or a release removes a reservation the dispatch did not place."
}
```

## WO-168-D008 — item 6: a stale built runtime names bootstrap

```json
{
  "id": "WO-168-D008",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "`reserveCodexDispatch` checks that the built runtime exports `reserveCodexDispatchWriter` before calling it and refuses with `Codex writer reservation unavailable; the built harness runtime lacks reserveCodexDispatchWriter. Run node scripts/bootstrap.mjs before retrying this dispatch.` The check precedes every event at all five dispatch sites.",
  "evidence": [
    "scripts/resume.mjs reserveCodexDispatch",
    "scripts/test-process-debt.mjs `WO-168 a Codex dispatch against a built runtime without the reservation entry point ...`: a stub harness-host.js without the export; the dispatch exits 1 with that message and no `is not a function`, the segment is unchanged, no session record and no writer directory exist, and a dispatch without a thread still exits 0",
    "Base behaviour is a code reading plus a mapper's semantic probe (a module lacking the export yields `TypeError: reserveCodexDispatchWriter is not a function`); it was not executed end to end at the base, as WO-166-D014 also states"
  ],
  "rationale": "The message keeps the prefix and tail of the unbuilt refusal, so the two cases read as one family. beginHarnessSessionOnce comes from the same module; a missing export there is already caught and printed as the session-entry advisory after the event, so the refusal is not widened to it.",
  "rejected": [
    {
      "option": "Rebuild automatically from the dispatch",
      "reason": "A dispatch that builds changes gate inputs and runs for seconds before it can refuse; bootstrap is the named route."
    }
  ],
  "reopenWhen": "A Codex dispatch fails with a TypeError, or refuses against a runtime that holds the entry point."
}
```

## WO-168-D009 — item 7: the standing sentences

```json
{
  "id": "WO-168-D009",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "Reword the Codex clause of `HARNESS_BOUNDARIES` to `under Codex a lifecycle dispatch reserves the writer and refuses a foreign holder, and the other duties and grants are role text because Codex tool calls are unhooked`, regenerate, and pin the new role bytes in `wo168-role-baseline.json`. Edit product 02's refusal sentence to name the fields a refusal carries and the `codex-host` and `thread` owners. In product 07 edit the index paragraph to name every releasing completion and the `resume: release close` row, with the sentence that repeats it, to the main-session route. Product 07 also carries the sentences criteria 1 and 4 owe, the granted-root rule, and the paragraph's own root kinds and default grants, which had been stale since WO-158.",
  "evidence": [
    "packages/compiler/src/harness.ts HARNESS_BOUNDARIES: the clause grew from 79 to 167 UTF-8 bytes, net 88; packages/compiler/test/harness.test.ts asserts the new clause",
    "docs/evidence/WO-168/cold-start-before.json and cold-start-after.json (node scripts/harness-context.mjs --check, before and after `harness emit`): CLAUDE.md 6,132 to 6,220; executor 26,110 to 26,286; verifier 22,913 to 23,089; reviewer 23,995 to 24,171 of 24,576; release-close 15,019 to 15,195; planner 17,167 to 17,343; refuter 16,742 to 16,918. Each profile grows 176 bytes because the paragraph is in the instruction file and in the skill; every verdict is unchanged (five within, refuter unset), identically under .claude/skills and .agents/skills",
    "node scripts/harness.mjs emit and check: 31 generated surfaces, exit 0",
    "packages/skeleton/fixtures/wo168-role-baseline.json chains to wo166-role-baseline.json by sha256 d7b4d86b26f29cd4000e77ae4d14d89125beb2d519b0073f03529900181cab0f; the WO-145 oracle case in scripts/test-process-debt.mjs passes against it",
    "Byte growth against HEAD: docs/product/02-domain-model.md 147,657 to 147,835, 178 of 600; docs/product/07-execution-guide.md 185,895 to 186,885, 990 of 1,000; node scripts/docs-check.mjs passes with no ceiling raised",
    "A reviewer verified each product claim against the code: writerRefusal's fields, codexHostProcess's two owners, the five releasing completions in scripts/resume.mjs and scripts/release.mjs, and what resume release-close and worktree publish print"
  ],
  "rationale": "The order asks that a reader meet the Codex writer boundary stated the same way in the four sentences it names. The clause is the order's own wording; a shorter one needed two semicolons in one sentence. Tragedy of the commons is the material lens: the paragraph is carried twice by every cold-start profile, so 88 bytes cost 176 of the reviewer's 581 bytes of headroom and leave 405. The granted-root sentence is not one the order names; it is there because the documentation duty asks the executor to write the fact it ships, and it fit the bound. Once it named a host-scratchpad root, the same paragraph's list of root kinds and its statement that default roles carry two grants contradicted it, so both were corrected in place.",
  "rejected": [
    {
      "option": "Edit every standing sentence that carries the older Codex statement",
      "reason": "Seven more sentences in five documents say Codex carries the duties as role text. None is made false by this order, the order bounds its edits to the sentences it names, and product 07 has ten bytes of its allowance left."
    },
    {
      "option": "Raise a cold-start or document ceiling",
      "reason": "Declined by the order; the edits are bounded instead."
    }
  ],
  "followup": "Planner, low priority, one pass over the standing text: state the Codex dispatch reservation in docs/product/02-domain-model.md (the sentence `Codex carries the same duties as role text` in section Feedback), docs/product/07-execution-guide.md (`Codex carries the same duties, grants and advisory cap as role text` in section Discipline), README.md (`Codex carries the same duties as role text`), and docs/AI-HARNESS-SECURITY.md (two sentences); add the two Git conditions and the admitted forms to the live-gate row of docs/AI-HARNESS-SECURITY.md; and say in docs/product/03-architecture.md and docs/AI-HARNESS-SECURITY.md that the printed scratch path exists and that default roles carry the host scratchpad grant.",
  "reopenWhen": "A session acts on one of the named sentences against the shipped behaviour, a cold-start verdict changes, or the next order that edits the writer text closes without the unnamed sentences."
}
```

## WO-168-D010 — item 8: the stranded comment and the hedge match

```json
{
  "id": "WO-168-D010",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "The `Bounded destination adapter` comment sits above `shellWriteTargets`. A hedged gate duration resolves to a named row unless another named identity contains it, so `npm test -- --inside-sandbox` wins over `npm test` when both rows are in scope, while two unrelated identities in one phrase, or two rows of one identity, stay unmeasured.",
  "evidence": [
    "packages/skeleton/src/harness-command.ts: the comment directly above `export function shellWriteTargets(`; packages/skeleton/src/observed-facts.ts scanHedges",
    "scripts/test-observed-facts.mjs `WO-168 a hedge names the longest gate identity ...`: three rows in scope; the partial phrase gives 450 ms, the full phrase 1200 ms, a phrase naming `npm test` and `suite:fixture` is unmeasured, and a second row of the partial identity makes it unmeasured",
    "Mapper probe of the base-built scanHedges: with both rows the partial phrase was unmeasured, as WO-140-D007 recorded"
  ],
  "rationale": "WO-140-D007 asks to prefer the longest matching identity. Taken as string length, a phrase naming two unrelated gates would resolve to whichever name is longer, which is a guess; taken as containment, the rule settles only the case the decision describes and leaves ambiguity unmeasured. No fixture pins the comment's place: the order names the both-rows fixture for this item, and the comment is checked by reading.",
  "rejected": [
    {
      "option": "Keep only the rows with the greatest identity length",
      "reason": "It resolves a phrase that names two unrelated identities, which was unmeasured before and should stay so."
    }
  ],
  "followup": "Planner, low priority, with the next order that edits observed-facts.ts: with only the full gate's row in scope, a hedge naming `npm test -- --inside-sandbox` still resolves to the full gate's duration, because an identity without a row cannot be seen. Decide whether a phrase that continues a matched identity with ` -- ` is left unmeasured.",
  "reopenWhen": "A hedge about a partial run is attributed to the full gate while both rows are in scope."
}
```

## WO-168-D011 — release, editions and version

```json
{
  "id": "WO-168-D011",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "Assign application `v0.52.4`, the next patch above the local `v0.52.3` tag. Compiler moves 0.19.2 to 0.19.3 and skeleton 0.44.2 to 0.44.3 for their changed source, with the console's exact pins and the lockfile following; `HARNESS_HOST_VERSION` is unchanged. After the last source edit, one revision of each edition was minted and selected: authority WO-168/001, artifact identity WO-168/001, verification WO-168/001 and feedback WO-168/001, the last a carry of the WO-070 live audit with no live episode. The console self-host fixtures are re-pinned and both publication locks updated.",
  "evidence": [
    "git tag: v0.52.3 is the newest local tag; npm run release -- prepare --local: `WO-168 target v0.52.4 remains current`; npm run release -- check-surfaces --local: exit 0, 51 PASS lines, compiler and skeleton `src changed ... expected a different version`",
    "npm run plan -- check: exit 0; the heading change is reported as a release-assignment workspace update",
    "Before minting, all four edition checks reported stale: authority on compilerPackageVersion, artifact identity and verification on their recorded files, feedback on the policy hash moved by the compiler release. After minting, all four checks exit 0; node scripts/console-fixtures.mjs --check exits 0; npm run publication:check exits 0 with both editions current",
    "git log for packages/skeleton/src/version.ts: last changed by 7bd4e78e, not by WO-158 or WO-166, which also edited harness-host.ts"
  ],
  "rationale": "Patch: hook and dispatch behaviour at existing boundaries, refusal and advisory text, no event schema, gate step, grant kind or contract change. Drift and policy resistance: WO-166 minted five authority revisions because source moved after minting, so this order reviewed, corrected and formatted first and minted once. A sibling order may stage the same version; product 07 records that a collision is bookkeeping the integration command retimes.",
  "rejected": [
    {
      "option": "Mint before the adversarial review",
      "reason": "Its findings changed four source files."
    }
  ],
  "reopenWhen": "An edition check fails on this subject, or the release surfaces report a component whose source changed without a version."
}
```

## WO-168-D012 — review dispositions and two adjacent repairs

```json
{
  "id": "WO-168-D012",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "Dispose the eighteen findings of the four-lens review. Accepted and fixed inside the order's items: the `&>` form and the `$~` operand (item 4); the refusal text and product sentence that overstated what a live gate refuses (item 4); a release that covered only the reservation call (item 5); the private mode on the shared temporary parent (item 1); a product paragraph that contradicted its new sentence (item 7); three fixture admissions that could not fail for the rule they named, a fixture that depended on the developer's global Git configuration, a missing hook-level row, and fixture residue. Two defects that predate the order were repaired through the adjacent queue: the tokenizer ended a word on any whitespace and did not see four zsh parameter expansions, and the configured Git program check read a valueless boolean as false and cut a key at its first space. Two findings named work not yet done when they were written (rebuild, regeneration, D009) and are discharged by D009 and D011. The rest are boarded in D006 and D009.",
  "evidence": [
    "Review workflow, four read-only agents, 1,003,685 subagent tokens, 310 tool uses, 25 minutes; findings by lens: criteria and text 5, host behaviour 3, classifier bypass 4, fixture quality 6",
    "Tokenizer, executed by the reviewer on the base and working-tree builds: `cat a<NBSP>#;touch gate.ts` tokenized to the single read `cat a` and was admitted by both, as were CR, VT, FF and U+2028 in place of NBSP; bash 3.2.57, zsh 5.9 and dash each ran the second command. `cat $=x`, `cat $^x`, `cat $+x` and `git --no-pager diff $=x` were admitted by both builds; zsh expands each",
    "Git configuration, replicated by the reviewer against Git 2.55.0 output: a valueless `log.showSignature` or `core.fsmonitor` prints the key alone and was judged unconfigured although Git reads it as true; `hook.my hook.event` was cut to `hook.my`",
    "npm run adjacent -- list: adjacent-0001 and adjacent-0002 completed at queue revision 10, each announced with `I intend to`, preceded by a check-in, and completed with the focused pattern and `npm test -- --only harness-fixtures` at exit 0 (PASS 240.07 s and 242.89 s)",
    "scripts/test-harness.mjs `WO-168 a live gate admits four argument forms ...`: refused rows for the five whitespace characters, the four parameter flags, a hook name that holds a space and valueless `log.showSignature` and `core.fsmonitor`, with a valueless `core.ignoreCase` admitted"
  ],
  "rationale": "Mission and critical path: the two adjacent defects defeat the guard this order widens, so admitting more forms on top of them would have made the list look safer than it was. Rule beating: every accepted fix has a row that fails without it. Policy resistance: the tokenizer serves the outside-write and planning guards too; ending a word only on space and tab can only refuse more, and the full harness-fixtures suite passed twice after it. Shifting the burden and escalation: no new guard, one queue entry per cause. Naive Interventionism: the older adapter's `&>` spelling is pinned by a WO-144 fixture and is left to an order that owns it. NoOp would have shipped a wider list over a tokenizer any shell disagrees with.",
  "rejected": [
    {
      "option": "Board the two pre-existing defects as follow-ups",
      "reason": "Each fix is a few lines in a file this order already edits, with fixture rows in a table it already adds; the equipped Adjacent Repair support prefers the bounded repair."
    },
    {
      "option": "Treat the reviewers' unfinished-work findings as defects",
      "reason": "The rebuild, regeneration and D009 were sequenced after the review on purpose; they are recorded as done, with their evidence, in D009 and D011."
    }
  ],
  "reopenWhen": "A command the tokenizer splits differently from a shell is admitted, or a configured Git program runs under an admitted read."
}
```

## WO-168-D013 — the review gate, both rows

```json
{
  "id": "WO-168-D013",
  "date": "2026-09-27",
  "dispatch": "resume: next",
  "decision": "Record the review gate as it happened. The first `npm test -- --review` failed: 37 suites passed and the skeleton suite had one case cancelled at its own 240 s budget, `WO-143 once and loop restart at every acquisition filesystem boundary, including killed reclaimers`, with six of its eight cells done and no failed assertion. The second run, on the identical tree and code identity, passed 38 suites with 0 failures. The first row is not converted to a pass; the second is the evidence this handoff rests on. The budget itself is the standing follow-up of WO-159-D020, whose reopening observation has now occurred.",
  "evidence": [
    "docs/control/local/harness/checks.json, checkId `npm test`, tree dd25f80e7ad34de024ba005d0a0947fc5fbc3092, code identity ee886f5a42f3645f1362329409bafb07c3b710da50618e697115490ddc9a97d5, both rows fresh with 82 tasks: exit 1 after 708,691 ms recorded 2026-09-27T04:24:41.939Z; exit 0 after 693,224 ms recorded 2026-09-27T04:41:22.842Z",
    "First run: skeleton 381.03 s, 454 tests, 453 passed, 0 failed, 1 cancelled with `test timed out after 240000ms`. Second run: skeleton 312.06 s and every suite passed, including harness-fixtures 292.50 s, process-debt 83.73 s and compiler 0.58 s",
    "Host observations: `uptime` after the first run read load averages 4.37, 6.20 and 6.00, with a Codex session running and gate records present in the main checkout and, at the start of the second run, in the wo-169 worktree; the second run began at a one-minute load of 9.56 and ended at 4.55, 7.11 and 7.16. Both runs therefore shared the host; load is an observed condition, not an established cause",
    "The case alone, between the two runs, on this tree: passed in 208,053 ms with all eight cells reported. docs/evidence/WO-115/repair-diagnostics.md records 180,247 ms and 174,288 ms for the same focused command; docs/final-reviews/WO-159/FINAL-001.md records the same case cancelled at 240,795 ms under a sibling gate and passing on a rerun",
    "git diff --stat HEAD for packages/skeleton/src: harness-command.ts, harness-host.ts and observed-facts.ts only; packages/skeleton/test/resident.test.ts and the resident sources are unchanged by this order"
  ],
  "rationale": "Drift to low performance and rule beating are the material lenses: a green row chosen from two runs is only honest if the red one is recorded beside it with what is and is not known. What is known: the case asserts nothing that failed, its sources and its test are untouched by this diff, it passed alone and inside the second full run. What is not known: why it needed more than 240 s in the first run; host load was present in both runs, so it does not separate them. Policy resistance: no deadline was raised and no assertion removed to obtain the pass. Shifting the burden: the budget has now cost three orders a gate run (WO-115, WO-159 and this one), which is recurring attention the mission moves into machinery, so the deferral is reopened instead of being repeated. Naive Interventionism: resident.test.ts belongs to no item of this order and a change to its budget is a planning decision. NoOp would leave the register saying the condition had not recurred.",
  "rejected": [
    {
      "option": "Report only the passing row",
      "reason": "The failed run is a fact of this subject; omitting it would present a selected result as the result."
    },
    {
      "option": "Raise the case's 240 s budget in this order",
      "reason": "Outside every item; WO-115's review already declined raising deadlines solely to obtain green output, and the cause is unestablished."
    },
    {
      "option": "Attribute the failure to host load",
      "reason": "Load was observed in both runs and only one failed; the row's cause stays unestablished."
    }
  ],
  "reopens": {
    "decisionId": "WO-159-D020",
    "observation": "A second deadline hit on the WO-143 matrix subtest with cause unestablished: WO-168's first review gate, 2026-09-27T04:24:41.939Z, six of eight cells done at 240 s; the rerun on the identical tree passed."
  },
  "reopenWhen": "A verifier's or reviewer's gate on this subject fails a case other than this one, or fails this one with a failed assertion."
}
```

## WO-168-D014 — verifier gate failure in the writer-refusal fixture

```json
{
  "id": "WO-168-D014",
  "date": "2026-09-27",
  "dispatch": "resume: verify",
  "decision": "The verifier's npm test -- --review failed one process-debt case. Keep that failed full-gate row distinct from the passing focused rerun and mark criterion 11 unmet. The WO-131 fixture compares two writer-refusal strings from separate hook calls, including a wall-clock age; the exact differing bytes were not retained in the gate output, so a crossed second boundary is an inference, not an established cause.",
  "evidence": [
    "docs/control/local/harness/checks.json: npm test at 2026-09-27T14:32:25.324Z, tree 536a1c4b79c5eda420b40136c77766b211a29af2, code identity ee886f5a42f3645f1362329409bafb07c3b710da50618e697115490ddc9a97d5, exit 1, 37 suites passed and process-debt failed, 82 fresh tasks",
    "docs/control/local/harness/check-output/671e6f231b596bd715d7f5fbe2eb7c2864d80dcda6b29089645187e2efc4b0bf.log: WO-131 prompt submission stays open while dispatches retain the ordinary command's gate and writer checks failed at scripts/test-process-debt.mjs:7118, where additionalContext.includes(writerDenied.permissionDecisionReason) was false; the output contains neither string",
    "packages/skeleton/src/harness-host.ts writerRefusal computes age seconds from Date.now at each call; scripts/test-process-debt.mjs:7110-7121 calls two hooks and compares their full strings",
    "node --test --test-name-pattern 'WO-131 prompt submission stays open while dispatches retain' scripts/test-process-debt.mjs: one passed, zero failed, 5.63 s after the full gate"
  ],
  "rationale": "The gate is an outcome standard: a passing focused run does not turn the failed full run green. NoOp leaves an intermittent gate cost for later roles. The smallest repair is to establish the mismatch and compare stable refusal fields or control the clock in this existing fixture; neither a deadline raise nor a relaxed assertion is evidence of correct dispatch behavior. This verifier records the finding and leaves the implementation to repair.",
  "rejected": [
    {
      "option": "Count the passing focused rerun as a passing review gate",
      "reason": "It did not run the full required suite selection and does not change the recorded failed row."
    },
    {
      "option": "Name the second boundary as the proved cause",
      "reason": "The gate retained the failed assertion, not the two refusal strings it compared."
    }
  ],
  "followup": "WO-168 repair executor: reproduce and diagnose the WO-131 writer-refusal fixture's full-string mismatch, make its assertion stable while preserving the gate and foreign-writer checks, then run the required full review gate again.",
  "reopens": {
    "decisionId": "WO-168-D013",
    "observation": "The verifier's 2026-09-27 review gate failed process-debt's WO-131 case, a case other than D013's WO-143 deadline case; the focused rerun passed."
  },
  "reopenWhen": "The repaired full gate still fails this case or another required suite."
}
```

## WO-168-D015 — repair of VER-001 F1 and F2: `&>` followed by words, and zsh's `=` word

```json
{
  "id": "WO-168-D015",
  "date": "2026-09-27",
  "dispatch": "resume: fix",
  "decision": "Repair VER-001 F1 and F2 in the shared tokenizer and destination adapter, with no text change. F2: the tokenizer marks an unquoted `=` as an expansion when it begins a word (also after empty quotes) or follows `=` or `:`, and something follows it in the word; `revisionOperand` refuses the same spelling, so `ls =cat`, `cat ''=cat`, `git --no-pager diff =cat`, `--format==cat`, `HEAD~1:=cat` and `grep -c == f` leave the list, while a lone `=`, `a:=` and an escaped or quoted `=` stay literal. `invocationRedirects` treats that word as it treats a glob, so the strict destination adapter cannot name it either. F1: in `invocationRedirects`, a command word after an `&>` or `&>>` redirect makes the invocation opaque, because dash and busybox ash background at `&` and run those words as a command of their own; an `&>` followed only by redirects still names its destination, so WO-144's `true &>/dev/null` discard and `ls docs &>/dev/null` beside a live gate are unchanged. Both rules serve `shellWriteTargets` (the live-gate and planning-branch fallback) and `shellRedirectTargets` (the outside-write guard), where opaque means refused beside a live gate and host delegation elsewhere. The refusal text and product 07 stay true as written: an expansion is off the list, and any other redirect is judged by the adapter, which now cannot name this form.",
  "evidence": [
    "docs/verifications/WO-168/VER-001.md F1 and F2: the verifier's hook admitted `ls docs &>/dev/null touch packages/skeleton/src/harness-host.ts` and `ls =cat` beside its live gate; dash ran the words after `&>/dev/null` as a command",
    "Shell probes in the session scratch directory, 2026-09-27 (executed): `dash -c 'ls . &>/dev/null touch marker-dash'` created the marker; GNU bash 3.2.57 and zsh 5.9 passed the following words to `ls` (exit 1). zsh 5.9: `=cat`, `''=cat`, the assignment `x==cat` and `x=a:=cat` expand to /bin/cat; `--f==cat` expands under MAGIC_EQUAL_SUBST; `==cat` and `==` fail with `not found`; `\\=cat`, `a==cat`, `a:=cat`, a lone `=`, `''=` and `a:=` stay literal; `test a = a` succeeds",
    "Pinned pre-repair snapshot .runtime/harness/8870fd9e05d086ec against the rebuilt dist (executed): liveGateReads admitted `ls =cat`, `cat ''=cat`, `git --no-pager diff =cat`, `git --no-pager log -1 --format==cat`, `git --no-pager show HEAD~1:=cat` and `grep -c == fixture.ts` before and returns null after; shellWritePaths named only /dev/null for `ls docs &>/dev/null touch fixture.ts`, its spaced and `&>>` spellings and `&>/dev/null ls docs` before and returns null after; shellRedirectTargets named /dev/null for `true &>/dev/null touch fixture.ts` before and returns null after; `ls docs &>/dev/null`, `grep -c = fixture.ts` and `grep -c a:= fixture.ts` are unchanged",
    "scripts/test-harness.mjs `WO-168 a live gate admits four argument forms ...`: eleven classifier rows for the `=` word, eight shellWritePaths rows and one shellRedirectTargets row for `&>`, and hook-level rows on three hooks under a live gate refusing `ls docs &>/dev/null touch fixture.ts` and `ls =cat` and admitting `ls docs &>/dev/null`",
    "Focused runs on the final sources: `node --test --test-name-pattern 'WO-168|WO-144' scripts/test-harness.mjs` 13 passed, 0 failed, 45.07 s; `node --test --test-name-pattern 'WO-168|WO-132|WO-131|WO-153' scripts/test-process-debt.mjs` 23 passed, 0 failed, 31.70 s",
    "node scripts/harness.mjs emit and check: 31 surfaces; only the hooks' snapshot pin and the manifest changed, .claude/skills, .agents/skills and CLAUDE.md are byte-identical, so every cold-start byte count is unchanged. Authority re-minted as WO-168/003 and selected (its bundle-diff differs from 001 only in five hook hashes); WO-168/002 was minted before the last tokenizer change, is stale and is kept unselected. Artifact identity, verification, feedback and harness evidence checks pass unchanged; console fixtures, publication:check, release prepare --local (v0.52.4 current), check-surfaces --local (51 PASS) and plan check pass"
  ],
  "rationale": "Mission and critical path: the order widens the live-gate list on the premise that every admitted form changes no gate input; two admissions broke that premise, so the repair restores the guard before any session relies on the wider list. Seeking the wrong goal: the first version's fixtures asserted the classifier while the hook admitted through the older adapter; the new rows sit at the hook, where a session meets the verdict. Policy resistance: the tokenizer and adapter serve three guards, and both rules can only make an invocation opaque, never name a new destination. Rule beating: every new refused row was admitted by the pinned pre-repair snapshot. Escalation and shifting the burden: no guard, gate step or text is added, and no operator step. Success to the successful: the existing fixture table and helpers carry the rows. Tragedy of the commons: no subagent; cold-start bytes unchanged. Drift to low performance: authority 002 is kept rather than deleted, as WO-166 kept its superseded revisions. Naive Interventionism would have refused every `&>` or every unquoted `=`; the rules stop where the shells stop agreeing. NoOp ships a list that admits a write onto a gate input under dash and an expansion under zsh.",
  "rejected": [
    {
      "option": "Name both shells' readings of `&>` and judge the union of their destinations",
      "reason": "It teaches a bounded adapter a second grammar, and beside a live gate it would admit a `touch` of a non-input that only dash runs. Opaque costs a session nothing: `>/dev/null 2>&1` spells the discard in every shell."
    },
    {
      "option": "Refuse every `&>` spelling in the adapter",
      "reason": "The shells disagree only when words follow the operand; WO-144 pins the discard and the outside-write width would change."
    },
    {
      "option": "Refuse every redirect outside the four admitted forms beside a live gate",
      "reason": "The destination adapter predates the order (WO-132, WO-144) and admits a redirect that names no gate input; the order says those forms stay refused, and D006 records the text that says any other redirect is judged by its destination. Changing that width is a separate decision, not this finding's repair."
    },
    {
      "option": "Mark every unquoted `=` as an expansion",
      "reason": "It would refuse ordinary option words such as `--format=%H` and `--color=never`, which no shell expands."
    },
    {
      "option": "Add a product 07 sentence for the `&>` rule",
      "reason": "The order bounds its product 07 growth at 1,000 bytes and 990 are used; the paragraph is not made false."
    },
    {
      "option": "Delete the stale authority revision 002 and mint 002 again",
      "reason": "A minted edition is preserved evidence; a new revision is the recorded practice."
    }
  ],
  "followup": "Planner, low priority, with D009's standing-text pass: product 07's destination-adapter paragraph and docs/AI-HARNESS-SECURITY.md do not say that a command word after an `&>` operand makes an invocation opaque, or that zsh's `=` word is an expansion; WO-168's product 07 allowance has 10 bytes left.",
  "reopens": {
    "decisionId": "WO-168-D006",
    "observation": "VER-001 F2: the list admitted `ls =cat`, which zsh expands (D006's reopening condition, a command the list admits expands); F1: the hook admitted `ls docs &>/dev/null touch <gate input>` through the destination adapter, which dash runs as a touch. D015 repairs both, so items (a) and (c) of D006's follow-up are fixed; (b), (d) and (e) remain, and which shell each supported host runs tool commands through is still not established."
  },
  "reopenWhen": "A command the adapter or the list admits is run by a supported shell as a different command or with an expanded word, or a verifier or reviewer beside a live gate is refused one of the four admitted forms."
}
```

## WO-168-D016 — repair of VER-001 F3: the WO-131 fixture compares refusals across two clocks

```json
{
  "id": "WO-168-D016",
  "date": "2026-09-27",
  "dispatch": "resume: fix",
  "decision": "Repair the fixture, not the refusal. The WO-131 case compares the writer refusal a tool hook returns with the context a prompt dispatch delivers; each hook runs in its own process and computes the reservation's `age N seconds` from its own clock, so the full strings differ whenever a second boundary falls between the two reads. The comparison now replaces that one field in both strings before `includes`; the pattern assertion after it still requires `age \\d+ seconds` in the delivered reason, and a failure prints both strings. `writerRefusal` is unchanged. This discharges D014's follow-up, subject to the full gate recorded in implementation.md.",
  "evidence": [
    "packages/skeleton/src/harness-host.ts writerRefusal: `age` is `Math.floor((Date.now() - reservedAt) / 1000)` at each call; the fixture's reservation has the fixed reservedAt 2026-09-13T00:00:00.000Z",
    "Deterministic reproduction (executed): a session-scratch preload, passed through NODE_OPTIONS, advanced Date.now by 1000 ms only in processes running .claude/hooks/session.mjs. Before the repair the focused case failed at scripts/test-process-debt.mjs:7118 with the verifier's assertion (`additionalContext.includes(writerDenied.permissionDecisionReason)` false), while the gate-refusal comparison before it, which carries no clock field, passed. After the repair the same skewed run passed: 1 test, 0 failed, 5.78 s",
    "Unskewed focused process-debt run on the final sources: 23 passed, 0 failed, including this case and the WO-153 and WO-168 cases",
    "grep of scripts/test-harness.mjs and scripts/test-process-debt.mjs: no other case compares an age-bearing refusal from two calls; the other writer-refusal assertions match `age \\d+ seconds` with a pattern"
  ],
  "rationale": "Drift to low performance and rule beating are the material lenses: the case keeps asserting every byte of the refusal except the one that legitimately differs between two processes, and it no longer fails on a boundary that says nothing about dispatch behaviour. The natural failure rate is unknown because the interval between the two clock reads was not measured; the skewed run establishes the mechanism the verifier inferred. Policy resistance and escalation: no deadline, retry or relaxed gate. Shifting the burden: an intermittent red gate costs a later role a full 11-minute rerun and a diagnosis. Naive Interventionism would change production output to suit a test. NoOp leaves the flake for verification and final review.",
  "rejected": [
    {
      "option": "Inject a clock into the hook through an environment variable",
      "reason": "A test-only control in production hook code, for a field whose value is already asserted by pattern."
    },
    {
      "option": "Retry the comparison",
      "reason": "It would hide a real mismatch as well as a clock tick."
    },
    {
      "option": "Drop the age from the refusal",
      "reason": "Product 02 names the fields a refusal carries; the age is operator information."
    },
    {
      "option": "Compare only the text before `age`",
      "reason": "It would stop checking the inspect and release commands that follow."
    }
  ],
  "reopenWhen": "The repaired full gate fails this case, or another fixture compares strings built from separate clock reads."
}
```

## WO-168-D017

<!-- integration refs/dotln/checkpoint/WO-168/6 -->

```json
{
  "id": "WO-168-D017",
  "date": "2026-09-27",
  "dispatch": "scope expand: merge main in; worktree integrate WO-168",
  "decision": "Integrated main at e578e1f2 (WO-169 and its release, v0.52.4) by fast-forward of the uncommitted branch at the operator's `scope expand: merge main in`, during the repair and before its review gate; checkpoint and named stash retained. Two authored conflicts were resolved. docs/product/06-roadmap.md keeps both release notes, WO-168's activation and retiming notes above WO-169's, as the integrating order's notes sit in earlier integrations. docs/planning/followups.json takes main's committed register, because this branch's side held only rows the sync derives from its decisions (six new WO-168 rows with no disposition and an uncommitted second revision of FUP-1d57cbcb226d8f8a); `--continue` re-derived them, and that row's third revision (hash eaeed442476d, the current source hash of WO-159-D020 with its reopening decisions) carries the observations of both WO-168-D013 and WO-169-D013. The helper retimed the unpublished patch from v0.52.4 to v0.52.5; compiler 0.19.3 and skeleton 0.44.3 remain valid, since WO-169 changed no package source.",
  "evidence": [
    "refs/dotln/checkpoint/WO-168/6",
    "base 3d58955d4187d1ebf2b510061861cc8b5958ec5c",
    "upstream e578e1f261bbd1b507c70eed41e407ba4c65306e",
    "Operator message in this repair session, 2026-09-27: `scope expand: merge main in`",
    "Files both sides changed: scripts/test-process-debt.mjs and docs/product/07-execution-guide.md merged without conflict; the rest are projections the helper regenerates. Product 07 is 186,318 bytes on main and 187,308 here, so this order still adds 990 of its 1,000; product 02 is unchanged by main",
    "On the integrated tree: harness check 31 surfaces; authority WO-168/003, artifact identity, verification, feedback and harness evidence checks pass unchanged; plan check, publication:check, release check-surfaces --local (51 PASS) and console fixtures pass; the cold-start check is byte-identical to docs/evidence/WO-168/cold-start-after.json (instruction 6,220 bytes; reviewer 24,171 of 24,576; every verdict unchanged)"
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

Integration date: 2026-09-27. Original base: `3d58955d4187d1ebf2b510061861cc8b5958ec5c`.
Fetched main: `e578e1f261bbd1b507c70eed41e407ba4c65306e`. Checkpoint: `refs/dotln/checkpoint/WO-168/6`.
Named stash retained: `c15f61690c78edddd0f607145dca941ade08594c` (WO-168 integrate 2026-09-27).
Resolved projections: docs/control/current.md, docs/lineage/decisions-index.md, docs/publication/everyday-ai-user-toc.md, docs/publication/software-engineer-toc.md, docs/work-orders/README.md.
Release preparation: Retimed WO-168: v0.52.4 → v0.52.5.
Files changed:
  docs/work-orders/WO-168-printed-path-exists.md
  README.md
  docs/product/06-roadmap.md
  docs/final-reviews/WO-168/PR.md
Tag observation: local snapshot only..
Carried-forward claims: the order, VER-001's failure evidence and the minted editions keep their recorded subjects. No authored resolution changed a WO-168 criterion or source file; the two resolutions are a release-note order and a register regenerated from its sources. The repair's F1 to F3 changes and the rest of the order receive fresh independent verification after this handoff; WO-169's selection of the configuration-root suite for changed scripts is part of the integrated gate. Final review still owns its independent acceptance judgment.
Authored conflicts observed: docs/planning/followups.json, docs/product/06-roadmap.md.
Affected checks: the helper selected npm test -- --review, publication, harness and local release checks. The executed results are recorded in implementation.md (Repair 1); this integration supplies no acceptance verdict.

## WO-168-D018 — final review: pass, and board one hedge edge and two fixture observations

```json
{
  "id": "WO-168-D018",
  "date": "2026-09-27",
  "dispatch": "resume: final review",
  "decision": "Pass final review of WO-168 on the staged subject without a source change and board, under one follow-up, a minor defect of item 8 that this review established and two observations that fail no criterion. The defect: the containment rule in `scanHedges` drops a named gate identity whenever a longer named identity contains it, even when the phrase also names the shorter identity on its own, so `The npm test gate took about 9 minutes and npm test -- --inside-sandbox about 2` resolves the full gate's 9 minutes to the partial row's duration, where the base left it unmeasured. Criterion 8 is met: its phrase names only the longer identity and resolves to that row. The first observation: `scripts/test-fixture-temporary.mjs` sets TMPDIR to the physical path of a private directory, so on darwin the harness and process-debt fixtures no longer reach the session-scratch and system-temp roots through the `/var` link; the WO-168 root fixture still links a temporary directory on purpose, and production resolves ancestors physically. The second, an inference from code: `scripts/resume.mjs` clears its pending release only after `appendTransition`'s append returns, so an append that writes the event and then throws would release a reservation that a recorded dispatch owns.",
  "evidence": [
    "packages/skeleton/src/observed-facts.ts scanHedges: clauses split at `.;!?`, newline and comma, then at each hedge marker, so both identities stay in the first part of the probe phrase; `named` holds both rows and `matching` keeps only `npm test -- --inside-sandbox`",
    "Executed against packages/skeleton/dist/src/observed-facts.js with rows `npm test` 1200 ms and `npm test -- --inside-sandbox` 450 ms: the probe phrase gave observed `450 ms`, source `gate-row`, for quantity `9 minutes`; `The npm test -- --inside-sandbox gate took about 2 minutes` gave 450 ms and `The npm test gate took about 9 minutes` gave 1200 ms, as criterion 8 and the base require",
    "Base scanHedges at HEAD e578e1f2 kept every row whose identity the part contains, so two rows gave `unmeasured` (code reading)",
    "scripts/test-fixture-temporary.mjs: `realpathSync(mkdtempSync(join(tmpdir(), ...)))` assigned to TMPDIR, TMP and TEMP; scripts/test-harness.mjs `WO-144 scratch-only role grant ...` computes `harnessSessionScratch(session)` from that TMPDIR; `WO-168 a granted session root is a real directory ...` asserts that a temporary directory reached through a link admits (read-only fixture review)",
    "scripts/resume.mjs appendTransition sets `releaseRefusedDispatch = undefined` after the append call returns, and main runs it in its catch (code reading; not executed)",
    "This review's `npm test -- --review`: 38 passed, 0 failed, 634.41 s, 82 fresh tasks, code identity be9d1f96908eb09bdd4baf65253e1f0d723243c197c2923c8b52aba2ffaf8475, recorded 2026-09-27T15:54:58.217Z"
  ],
  "rationale": "Correctness over a green count: the hedge advisory states an observed value to the model, so a wrong attribution is worse than `unmeasured`, but the phrase must name both gates in plain text inside one hedge part, and text in code spans is stripped before scanning, so the case is narrow. The repair belongs in the function D010 already boards, with a fixture row; making it here would change source after independent verification for an advisory edge. Seeking the wrong goal: criterion 8's fixture tests the phrase the order names, and the edge is the case it does not name. Shifting the burden: one follow-up joins D010's open question on the same function. Naive Interventionism: the fixture temporary root keeps suite residue out of the shared temporary directory, which D003 chose for reasons that stand; only the incidental loss of link coverage is recorded. NoOp would leave the edge unrecorded.",
  "rejected": [
    {
      "option": "Fix the containment rule in final review",
      "reason": "A source change after independent verification for an advisory edge that fails no criterion; the next order that edits observed-facts.ts can take it with D010's question and a fixture row."
    },
    {
      "option": "Route to repair",
      "reason": "Every criterion is met on the reviewed subject; the edge is minor and boarded with a named follow-up."
    }
  ],
  "followup": "Planner, low priority, with the next order that edits observed-facts.ts (joined to WO-168-D010's follow-up): drop a contained gate identity only where each of its occurrences in the part lies inside an occurrence of the longer identity, with a fixture row for a phrase that names both gates on their own; and, with the next order that edits the harness or process-debt fixture temporary root, decide whether one fixture reaches a session-scratch root through a linked ancestor. With the next order that edits scripts/resume.mjs dispatch release, decide whether a transition whose append wrote the event and then threw keeps its reservation.",
  "reopenWhen": "A hedge about the full gate is attributed to a partial row, or a partial run's hedge to the full gate, while both rows are in scope; a session-scratch or system-temp grant fails through a linked ancestor; or a recorded Codex dispatch is found without its reservation."
}
```
