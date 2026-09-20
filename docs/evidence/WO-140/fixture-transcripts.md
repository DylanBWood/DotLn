# WO-140 fixture transcripts

Recorded 2026-09-19 during `resume: next` in the uncommitted `wo-140` worktree,
Claude Code 2.1.278. Outputs are trimmed to the lines that carry the claim and
`<worktree>` stands for this checkout's path. The gate result and final counts
are in [implementation.md](implementation.md).

## The session that ran these is not sandboxed, and carries the marker

```text
$ env | cut -d= -f1 | grep -E "^CLAUDECODE$"
CLAUDECODE
$ ( : > .claude/hooks/.dotln-sandbox-probe ); echo exit=$?
exit=0
$ /usr/bin/sandbox-exec -p '(version 1)(allow default)' /usr/bin/true; echo exit=$?
exit=0
```

The marker is present and no sandbox is in force: the case the order's design
names, in which a marker alone must not refuse. The probe file was removed.

## Criterion 1, end to end: the real entry under a real denial

The actual marker, the actual `npm test` entry, and a Seatbelt profile that
denies writes under this worktree's `.claude/hooks`, the path the Claude Code
sandbox protects. Each command ran as
`CLAUDECODE=1 sandbox-exec -p '(version 1)(allow default)(deny file-write* (subpath "<worktree>/.claude/hooks"))' node scripts/test-runner.mjs <flags>`:

```text
$ npm test
Refused before any suite ran: this run carries the claude-code marker and a write to <worktree>/.claude/hooks is denied (EPERM), so it is inside a harness sandbox, and skeleton needs the outside (needs: outside-sandbox). Run outside the sandbox: npm test. To run only the remaining suites here as a partial result that is never product-gate evidence: npm test -- --inside-sandbox
exit=1          (0.1 s wall-clock on the first capture)
$ npm test -- --review
... Run outside the sandbox: npm test -- --review. To run only the remaining suites here ...: npm test -- --review --inside-sandbox
exit=1
$ npm test -- --only skeleton
... Run outside the sandbox: npm test -- --only skeleton.
exit=1
$ npm test -- --only skeleton --inside-sandbox
Nothing remains to run inside the sandbox: skeleton needs the outside
exit=1
$ ls -a .claude/hooks | grep -c dotln-sandbox-probe
0
$ npm test -- --list | grep '^skeleton '
skeleton — protects: the local runtime executes work within admitted authority — needs: outside-sandbox
$ npm test -- --list --inside-sandbox | grep -c '^skeleton '
0
```

## Criteria 1 to 3: the runner fixtures

`scripts/test-runner.test.mjs`. A fake marker `DOTLN_FIXTURE_SANDBOX` and an
owned directory whose mode decides whether the exclusive create is denied
drive the real `runGate` over a three-row injected table:

```text
$ node --test --test-name-pattern="WO-140" scripts/test-runner.test.mjs
✔ WO-140 the real inventory declares only the suite with an environmental outside-only cause
✔ WO-140 a sandbox in force refuses before any suite runs and names the suites and the outside command
✔ WO-140 an inherited marker whose denied-write probe succeeds does not refuse and leaves no probe behind
✔ WO-140 a partial inside-sandbox row is rejected by every product-gate consumer at the code identity where a full row is accepted
✔ WO-140 the recognized markers probe the path their sandbox protects and fail open without one
✔ WO-140 the probe classifies only a denied write as a sandbox, and every other outcome fails open
✔ WO-140 a real Seatbelt denial under the real marker reads EPERM and is in force
✔ WO-140 any partial flag or exclusion shape disqualifies a row under the npm test identity
$ node --test scripts/test-runner.test.mjs
ℹ tests 37
ℹ pass 37
ℹ fail 0
ℹ skipped 0
```

The Seatbelt case is not skipped on this host; it skips where `sandbox-exec`
is unavailable or itself nested inside a harness sandbox.

### The fixtures fail when the feature is removed

```text
== mutation A: the partial guard removed from findGateCheck
✖ WO-140 a partial inside-sandbox row is rejected by every product-gate consumer ...
  AssertionError [ERR_ASSERTION]: the exclusions alone mark a partial result
== mutation B: the preflight refusal disabled
✖ WO-140 a sandbox in force refuses before any suite runs and names the suites and the outside command
== restored: 5 of 5 pass
```

The adversarial pass then found two mutants those five fixtures did not kill:
dropping `EPERM` and `EROFS` from the denied codes, and dropping the `partial`
flag from `partialGateCheck`. The sixth and eighth fixtures above exist for
them; the seventh pins the code a real sandbox returns.

## Criterion 2, the committed-history consumers

Pull-request publication (`scripts/worktree.mjs`) and release close
(`scripts/release.mjs`) both read `reviewedProductGate`. A scratch probe
committed three reviewer observations at one code identity:

```text
full ACCEPTED npm test
partial-id REJECTED: WO-999 has no recorded passing reviewer npm test row
mislabelled REJECTED: WO-999 has no recorded passing reviewer npm test row
```

The same cases, plus a relabelled row with its `partial` flag stripped, are
asserted in the consumer fixture; the adversarial pass confirmed that removing
the guard from `reviewedProductGate` fails it.

## Criteria 4 and 5: briefing, role text and the receipt check

```text
$ node --test --test-name-pattern="WO-131 prompt submission stays open|WO-140" scripts/test-process-debt.mjs
✔ WO-131 prompt submission stays open while dispatches retain the ordinary command's gate and writer checks
✔ WO-140 a newly allocated receipt needs counters with their source or one cause code; earlier receipts pass
✔ WO-140 the briefing names the session and the exact usage command the usage guard admits
✔ WO-140 the cost line is a record and not a mention, and meta --check is wired to refuse it
$ bash scripts/test-resume.sh
resume tests passed                       exit=0
$ bash scripts/test-checkpoint.sh
checkpoint tests passed                   exit=0
$ bash scripts/test-worktree.sh
worktree tests passed                     exit=0
$ node --test --test-reporter=tap scripts/test-harness.mjs
# tests 108   # pass 108   # fail 0
$ node scripts/meta.mjs --check >/dev/null; echo exit=$?
exit=0
```

`test-resume.sh` asserts, in one in-process lifecycle: the stamp on VER-001,
VER-002 and FINAL-001 and on no other event; the `verify` and `final-review`
briefings ending with the admitted forms; and `verification-result` refusing a
report with no cost line, a bare `unknown`, and a bulleted
`entry unknown as of 2026-09-19; handoff unknown; source none`, each appending
no event, before admitting a bulleted counters line.

The WO-131 case compares a recording session's briefing with a resumed
session's; it now asserts that each is given its own
`DotLn session: <id>. Usage readback: node scripts/harness.mjs usage <id>` line
before setting it aside. The command works as printed:

```text
$ node scripts/harness.mjs usage 93de90d8-5649-4449-bcd6-fbbf78bb137b
{"activity":{"stepCount":169,"commandsRun":111,...},"source":"claude-transcript-message-usage","scope":"dispatch","observedAt":"2026-09-20T03:00:25.984Z","usage":{"inputTokens":270,"cachedInputTokens":29781343,"cacheWriteInputTokens":307105,"outputTokens":117819,"reasoningOutputTokens":null,"totalTokens":30206537,"costUsd":null},...,"subagents":{"count":1,"cap":20,"remaining":19,"countKind":"exact-observed",...}}
```

## Cold-start measurement

```text
$ node scripts/harness-context.mjs --check      # both generated roots agree
verifier  20081 of 20480  within     (19,216 before; +865)
reviewer  21299 of 20480  breach     (20,434 before; +865)
# after raising the reviewer ceiling by one 4 KB step to 24,576:
reviewer  21299 of 24576  within
$ npm run meta
Process health: no observed budget breach; ...
```
