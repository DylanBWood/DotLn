# WO-144 repair of FINAL-001

`resume: fix`, 2026-09-19. Repairs F1 and F2 from
[FINAL-001](../../final-reviews/WO-144/FINAL-001.md), VER-002's O5 copy edit,
and two adjacent defects met on the way. Decisions are
[D008 and D009](decisions.md); executed evidence is in the
[fixture transcripts](fixture-transcripts.md#repair-of-final-001-2026-09-19).
The earlier [implementation](implementation.md) and [repair](repair.md) reports
stay as they were.

**Actor attestation:** {"harness":"claude-code","harnessVersion":"2.1.278","model":"claude-fable-5-1","effort":"xhigh","source":"operator-attested"}

One writable executor, zero subagents (0 of 20, `exact-observed`). No branch
commit, push or publication. The prompt hook recorded the `fix` dispatch and it
was not repeated.

## What changed

| Finding | Repair | Executed evidence |
| --- | --- | --- |
| **F1.** One persisted `cd` stood the guard down and left no journal row | Enforced rather than documented (D008). The hook runner takes its root from the session's directory only while that is this hook's own verified worktree root. Otherwise it finds the project from the installed runtime, makes only the outside-write judgment, and resolves relative destinations against the session's directory. A refusal is returned; every other outcome rethrows the original cause, so the four older refusals keep their stand-down and advisory unchanged. Judgments made away from the root carry `workingDirectory: moved`, and every hook now journals its stand-down advisory row | New generated-hook fixture from a project subdirectory, a directory outside any repository and another repository's root. Live: FINAL-001's probe form (same command shape and directory, a different file name), after one persisted `cd docs`, is refused before execution with journal row 689; the file was not created |
| **F2.** A literal redirect on `npm`, `node` or `git` was unobserved, and no document said so | Both of the reviewer's directions (D009). A new accessor, `shellRedirectTargets`, names literal output redirects on any program, because the shell opens them; only the outside-write guard consults it, and only when `shellWriteTargets` returns `null`. That contract is untouched, so the live-gate and planning-branch refusals read commands exactly as before. The program's own effects are still journaled unobserved. Product 03, product 07 §Discipline, the security document, the README block and the generated boundary text state what is judged and what is not | New fixture with redirects on `npm`, `node` and `git`, the accessor table and a planning-branch control. Live: `node -e 0 2>/private/tmp/…` from the moved directory is refused, row 695 |
| **O5.** Doubled conjunction in the five-refusal lists | Removed in the security document, product 07 §Discipline and the README block | Read in the diff |
| **adjacent-0003 (met here).** A hook whose input directory was another repository's root created its journal and an `.advisory` marker inside that repository | Same resolver: the root is accepted from the session's directory only when the pinned runtime is installed under it, so rows and markers stay in the hook's own project | Probed before the change (files appeared in a scratch repository); the F1 fixture asserts the other repository contains only `.git` |
| **adjacent-0004 (met during output review).** The generated fallback, used when the pinned runtime cannot be loaded, took its root from `input.cwd` and wrote its row and marker there | `packages/compiler/src/harness.ts` derives the fallback's root from the hook file's own location. Found only after the first product gate, so the bundle, authority evidence and gate were redone; D008 carries the same-day correction | Probed before the change; the extended F1 fixture failed on the earlier build (`docs` created in the other repository) and passes now |

`npm run meta 2>../.x`, the recorded incident's command in its literal spelling,
is now refused. The incident as it actually happened redirected to
`$PWD/../.x`. That is an expansion, it stays opaque, it is **still admitted**
under host permissions, and the documents now say so in those words.

## What stays unjudged

Stated in product 03 and the security document, summarized here.

- A destination spelled with an expansion, substitution or wildcard.
- A quoted operand attached to its operator (`2>'../x'`); the spaced form is
  judged.
- A redirected group, and a relative redirect after an earlier program outside
  the bounded vocabulary in the same command (`cd docs && npm test > ../out`),
  because that program may have moved the shell. An absolute one is judged.
- Operands of any program other than `touch`, `mkdir`, `tee` and `rm`, and
  whatever a program writes by itself.
- Away from the worktree root, the writer, live-gate, planning-branch and
  subagent refusals still stand down. That is D007's planner follow-up, now
  visible in the journal.
- Codex enforcement, native scratch discovery and order-named roots remain the
  order's non-goals.

## Checks

- `node --test scripts/test-harness.mjs`: **108 passed, 0 failed**, 169,046 ms
  on the final code (106 before this repair, plus the two new fixtures; 162,382
  ms on the run before adjacent-0004).
- `node --test --test-name-pattern=WO-144 scripts/test-harness.mjs`: **8
  passed, 0 failed** against the regenerated bundle.
- `node scripts/harness.mjs check`: 31 generated surfaces match.
- Authority evidence **revision 004** matches the final bundle; revisions 001
  to 003 and the first edition are preserved (003 recorded the bundle before
  adjacent-0004). Artifact identity,
  verification and feedback editions still pass without a new edition.
- `npm run test:docs`: **19 passed, 0 failed** (13 passed and 6 failed before
  the authority revision, all on the stale revision 002).
- `npm run publication:check`: current after both source locks were refreshed
  for the product 03 and 07 edits; headings unchanged, 272/272 indexed.
- `node scripts/console-fixtures.mjs --check`, `release.mjs check-surfaces
  --local`, `npm run plan -- check`, `npm run format:check` and
  `git diff --check`: pass.
- `npm run release -- prepare --local`: "WO-144 target v0.33.0 remains
  current; no files changed." Application **v0.33.0**, compiler **0.16.0**,
  skeleton **0.29.0**; no dependency added.
- `npm test`: see Product gate below.

Cold-start bytes after regeneration, identical in both harness roots: executor
**22,174/24,576**; verifier **19,216/20,480**; reviewer **20,434/20,480**;
release-close **13,440/16,384**; planner **14,506/24,576**; refuter **15,163**,
no configured ceiling. The boundary text grew 154 bytes per role. No ceiling
changed. The reviewer has **46 bytes** left; D009 boards that.

## Product gate

`npm test` ran twice, because adjacent-0004 was found after the first run and
changed code identity.

| Run | Result | Recorded row | Code identity |
| --- | --- | --- | --- |
| After F1, F2 and adjacent-0003 | 21 suites passed, 0 failed, 65 fresh tasks, 259.07 s | `2026-09-20T00:13:37.522Z`, exit 0, 259,073 ms | `ebf79299…0294933`, superseded |
| After adjacent-0004, final code | **21 suites passed, 0 failed**, 65 fresh tasks, 259.81 s | `2026-09-20T00:27:30.478Z`, exit 0, 259,808 ms | `edf80fb619113dd69088b4ac12401a51950b0f60d9f04b71cb36b5a1686013f5` |

`findGateCheck` returns the second row for the current tree. Only this report
changed afterwards, which does not change code identity. The final review
still runs its own gate as the order directs.

While the first gate ran, the live-gate refusal refused two of this executor's
own opaque wait commands and admitted plain reads. That is the second refusal
behaving as before, met by accident rather than probed.

## Limits

- The order's own text was not edited. Its cost line ("removes the recorded
  incident class") and criterion 2's label remain broader than what ships,
  because the incident's `$PWD` spelling is opaque. D009 boards this for the
  planner; changing a judged order needs the operator's scope expansion.
- Live probes ran on darwin, for the executor role, through the Bash tool. A
  write-tool call from a moved directory and a subagent's calls were covered by
  fixture or not at all, as D008 records.
- FINAL-001's disclosed probe file, `/private/tmp/wo144-final-cwd-probe.txt`
  (6 bytes), is still there. Removing it is an ungranted outside removal, which
  the guard refuses for this role as it should. It is left for the operator.
- My two live probes created nothing. The pre-change probe of adjacent-0003
  wrote only inside this session's DotLn scratch directory.
- Usage at handoff is in the response and the ignored receipts; dollar cost is
  unavailable.

Independent reverification and a new numbered final review keep their own
dispatches.
