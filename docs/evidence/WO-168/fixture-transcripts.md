# WO-168 fixture transcripts

Recorded 2026-09-27 by the executor session. Local paths are replaced by
`<worktree>`, `<system-temp>`, `<host-scratchpad>` and `<home>`; stack
frames are dropped; nothing else is edited. Each block names the command that
produced it.

## Base-built runtime, before any rebuild

The runtime built from the activation tree (`3d58955d`), judged at hook level
under a live gate by a scratch probe assembled from the fixture helpers of
`scripts/test-harness.mjs`. The probe lived in the host scratchpad and wrote
nothing in the repository.

| Command | Classifier | Hook | Refusal begins |
| --- | --- | --- | --- |
| `git --no-pager diff HEAD~1` | null | denied | DOTLN_HARNESS_REFUSED: write may change gate inputs during active gate npm test (run 35f97 |
| `git --no-pager show stash@{0}` | null | denied | DOTLN_HARNESS_REFUSED: write may change gate inputs during active gate npm test (run 35f97 |
| `grep -n '<title>' fixture.ts` | null | denied | DOTLN_HARNESS_REFUSED: write may change gate inputs during active gate npm test (run 35f97 |
| `git --no-pager log -1 --format="%H <%ae>"` | null | denied | DOTLN_HARNESS_REFUSED: write may change gate inputs during active gate npm test (run 35f97 |
| `wc -l < fixture.ts` | null | denied | DOTLN_HARNESS_REFUSED: write may change gate inputs during active gate npm test (run 35f97 |
| `ls docs 2>/dev/null` | null | admitted |  |
| `npm run --silent resume -- status` | null | denied | DOTLN_HARNESS_REFUSED: write may change gate inputs during active gate npm test (run 35f97 |
| `ls docs 2>/tmp/x` | null | denied | DOTLN_HARNESS_REFUSED: outside-project write to /tmp/x (physical destination /private/tmp/ |
| `ls docs 2>fixture.ts` | null | denied | DOTLN_HARNESS_REFUSED: write may change gate inputs during active gate npm test (run 35f97 |
| `cut -c1-80 fixture.ts` | null | denied | DOTLN_HARNESS_REFUSED: write may change gate inputs during active gate npm test (run 35f97 |

- {"configured":"executable post-index-change hook","hook":"admitted"}
- {"configured":"format.pretty with %G","hook":"admitted"}
- {"scratchExistsAfterDispatch":false}
- {"swap":"session-scratch is a link to an ungranted directory","hook":"admitted"}

The five new harness cases, run against the same base-built runtime
(`node --test --test-name-pattern 'WO-168' scripts/test-harness.mjs`):

```text
✖ WO-168 a hedge names the longest gate identity that holds the one it spells (9.799625ms)
✖ WO-168 a live gate admits four argument forms of listed reads and the second npm spelling, and refuses every other form (0.646959ms)
✖ WO-168 an override exit prints ahead of an input refusal, and an appended record is never reported as not appended (794.186083ms)
✖ WO-168 a printed session scratch path exists at the dispatch, the Codex begin and harness scratch, and an obstructed path advises without blocking (425.079167ms)
✖ WO-168 a granted session root is a real directory: a linked root grants nothing, a real or absent root grants, and an unreadable root advises once (417.736833ms)
ℹ tests 5
ℹ pass 0
ℹ fail 5
✖ failing tests:
test at scripts/test-observed-facts.mjs:420:1
✖ WO-168 a hedge names the longest gate identity that holds the one it spells (9.799625ms)
  AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:
test at scripts/test-harness.mjs:4836:1
✖ WO-168 a live gate admits four argument forms of listed reads and the second npm spelling, and refuses every other form (0.646959ms)
  AssertionError [ERR_ASSERTION]: git --no-pager diff HEAD~1
test at scripts/test-harness.mjs:5371:1
✖ WO-168 an override exit prints ahead of an input refusal, and an appended record is never reported as not appended (794.186083ms)
  AssertionError [ERR_ASSERTION]: The input did not match the regular expression /operator-control exited; ordinary workflow checks resume.*DOTLN_HARNESS_INPUT_REFUSED: MISSING_FIELD at \$\.cwd/. Input:
test at scripts/test-harness.mjs:5823:1
✖ WO-168 a printed session scratch path exists at the dispatch, the Codex begin and harness scratch, and an obstructed path advises without blocking (425.079167ms)
  Error: ENOENT: no such file or directory, lstat '<system-temp>/dotln-wo168-scratch-q7Vuj6/temporary/dotln/bd26807875c18d77da768abd5b60cc8f2f81faf1d26bc676dc80a611f3e563d0/scratch'
test at scripts/test-harness.mjs:5962:1
✖ WO-168 a granted session root is a real directory: a linked root grants nothing, a real or absent root grants, and an unreadable root advises once (417.736833ms)
  Error: ENOENT: no such file or directory, lstat '<system-temp>/dotln-wo168-roots-E0aNF3/temporary/dotln/ba3964728bd11bd784a4cef1e5254c0d532ad300fc1c492e8bbaa2940a208600/scratch'
```

## Rebuilt runtime, final sources

`node --test --test-name-pattern WO-168 scripts/test-harness.mjs`

```text
✔ WO-168 a hedge names the longest gate identity that holds the one it spells (9.260459ms)
✔ WO-168 a live gate admits four argument forms of listed reads and the second npm spelling, and refuses every other form (5958.686459ms)
✔ WO-168 an override exit prints ahead of an input refusal, and an appended record is never reported as not appended (2238.214083ms)
✔ WO-168 a printed session scratch path exists at the dispatch, the Codex begin and harness scratch, and an obstructed path advises without blocking (1133.645834ms)
✔ WO-168 a granted session root is a real directory: a linked root grants nothing, a real or absent root grants, and an unreadable root advises once (6142.049583ms)
ℹ tests 5
ℹ pass 5
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
real 15.57
```

`node --test --test-name-pattern 'WO-168|WO-153|WO-166 an unbuilt|WO-145 optional economy' scripts/test-process-debt.mjs`

```text
✔ WO-145 optional economy support preserves historical snapshots through WO-168 and changes only executor instructions on (279.974458ms)
✔ WO-166 an unbuilt Codex dispatch refuses before lifecycle writes and names the missing reservation runtime (272.87575ms)
✔ WO-168 a Codex dispatch against a built runtime without the reservation entry point refuses before any event and names bootstrap (206.413084ms)
✔ WO-153 a Codex dispatch whose session entry fails names the cause and still delivers its briefing (3848.207125ms)
✔ WO-168 a Codex dispatch refused after placing its reservation releases it, and a second session is then admitted (1270.526041ms)
ℹ tests 5
ℹ pass 5
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
real 5.98
```

`node --test --test-name-pattern "WO-132 both harness roles" packages/compiler/dist/test/harness.test.js`

```text
✔ WO-132 both harness roles receive identical duties and the shared instruction includes missing-hook residue (7.579ms)
ℹ tests 1
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
```

`npm test -- --only harness-fixtures`, twice, once after each adjacent repair

```text
PASS build 0.54 s
PASS harness-fixtures 240.07 s
suite:harness-fixtures: 2 passed; 0 failed; 240.65 s; 2 fresh tasks
real 241.07
PASS build 0.53 s
PASS harness-fixtures 242.89 s
suite:harness-fixtures: 2 passed; 0 failed; 243.47 s; 2 fresh tasks
real 243.88
```

## This session beside a live gate

Commands this executor session ran while its own review gate was live
(`docs/control/local/harness/active-gates` held one run), on the hooks
regenerated from this branch:

| Command | Hook |
| --- | --- |
| `git --no-pager diff HEAD~1 --stat \| tail -n 1` | admitted |
| `wc -l < docs/evidence/WO-168/decisions.md` | admitted |
| `ls docs/evidence/WO-168 2>/dev/null \| head -n 3` | admitted |
| `grep -n '<!-- dotln-harness:start -->' CLAUDE.md` | admitted |
| `npm run --silent resume -- status \| head -n 4` | admitted |
| `cut -c1-40 CLAUDE.md \| head -n 2` | refused: unlisted program |
| a command with a variable assignment, an expansion and `cut` | refused |

The session's own scratch path, printed at a dispatch that ran on the base
hooks, was absent at entry and was never created: the regenerated hooks create
it at a role dispatch, and this session had none after regeneration.
