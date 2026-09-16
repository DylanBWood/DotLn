# WO-049 implementation evidence

Dispatch: `resume: next`. Executor: Codex CLI 0.154.0, GPT-6 Astra, raw `ultra`
(normalized `xhigh`, workflows/subagents), source `codex-session-readback` from
the active thread metadata. Scope includes the operator's evidence-before-claims
rule in the shared floor and automatic reporting of actual Codex properties.
The misplaced model default was removed from the shared floor.

## Executed evidence at the pre-gate cutoff

- Compiler and target fixtures: 11 passing checks, including pure deterministic
  target lowering; scratch repositories with and without unrelated `.claude`
  content; clean status and empty staging after `git add -A`; drift, missing
  files/excludes and effective `.gitignore` negation; tracked missing files and
  symlink destinations; exact file-tree restoration; shared linked-worktree
  excludes; direct writer-boundary comparisons; sibling/remote/opaque-shell and
  attribution refusals; alias/hardlink protection; and unavailable-runtime deny.
- [Contributor comparison](contributor-compatibility.json): activation and new
  lowering deep-equal for both complete bundles at equal current inputs (17
  Claude surfaces, 7 Codex surfaces). The operator explicitly permits required
  version, pin and hash updates. Default relative-import generation is intact.
  The separate operator correction also replaces stale model defaults in role
  instructions with current-session readback guidance; the equal-input lowering
  comparison does not claim those intentionally changed instructions are old bytes.
- [Claude live smoke](live-claude.json): Claude Code 2.1.273, claude-fable-5 at
  xhigh, operator-approved outside-sandbox launch. Actual denied sibling Write
  request and permission-hook denial observed; sibling absent; allowed target
  Write succeeded. Six hook records. Exit 0 in 11,547 ms.
- [Codex live smoke](live-codex.json): Codex CLI 0.154.0, gpt-6-astra at xhigh,
  requested ultra, multi-agent features not disabled; effective effort/mode
  unobserved. Instruction block echoed after
  an explicit read, zero hook records. Exit 0 in 15,813 ms. This establishes
  instruction delivery, not Codex enforcement; WO-051 owns launch governance.
  The retained smoke's ultra/subagents labels reflect the executor's mistaken
  scope interpretation, not observed mode. The recorder now reports its actual
  xhigh selector and unknown mode; historical result bytes remain intact.
- Both live bundles passed `check` and were removed. Only derived booleans,
  counts, selectors and command/path shapes were retained; no raw transcripts.
  Synthetic worktrees and local journal lanes remain available for review.
- Codex session reporting: executable tests cover metadata available before
  usage counters, current-turn changes, worktree/thread selection, privacy and
  status JSON without a lifecycle mutation. Existing briefings and harness
  begin/usage report the same values. Missing information or reader files do
  not refuse work. The first full run found a static-import dependency in the
  source-minimal CLI fixture; reporting now loads optionally, and that fixture
  exercises both activation and status with the reader absent.
- Complete harness fixtures pass (235.38 s), including the reduced target and
  existing Contributor behavior. Complete process/reporting fixtures pass
  (112.73 s). The copied emitter also works without the optional reporting
  helper; both CLI entry paths keep reporting independent of startup.
- All 19 console tests pass. Its old selfhost fixture pinned WO-068 and failed
  replay under the new compiler identity. The existing
  `console-fixtures.mjs --record-current-selfhost` command repins its three
  inputs to WO-049 feedback revision 002 and regenerates the matching JSON,
  terminal and HTML output. No console production code changed.

The smoke commands are `node scripts/target-worker-smoke.mjs claude` and
`node scripts/target-worker-smoke.mjs codex`, launched with explicit outside-
sandbox approval and existing harness authentication. Claude used
`--permission-prompts none --setting-sources project,local`; no account setting
was changed. Existing result files refuse overwrite.

## Boundaries and cost

The manifest owns relative file paths and hashes. Its self entry hashes the
payload list; the launchpad receipt binds its complete bytes. Shared exclude
mutations serialize; a different launchpad's managed block refuses. Original
unrelated exclude content is preserved in place, not copied to receipts.
Removal refuses modified owned files, leaves empty directories, and preserves
runtime snapshots and journals. Interrupted partial installation/removal needs
inspection and recovery; no rollback or stale-lock deletion is inferred.

Target guards reject opaque shell routes; host-owned test/commit execution is
separate work. No unit predicate or compiled-envelope semantics changed.
Absolute launchpad paths appear only in generated hook import lines. State is
keyed by the real target-path digest and lives outside the target. This does
not provide hostile same-user isolation or authenticate hashes.

The fixture batch took about 13 seconds with the five compiler cases and six
scratch-target cases; this is above the order's estimated five seconds. The
extra tree/ignore/ownership failure coverage verifies the installation's core
claims. Entry process counters were unavailable, source `unavailable`, scope
`dispatch`, cutoff 2026-09-16T19:27:03.649Z; unknown is not zero. Final gate and
usage observations remain in ignored local receipts and the handoff response.

Product write-backs and fresh evidence editions accompany compiler 0.12.0,
skeleton 0.20.0 and application v0.24.0. No package publication, branch commit, PR or
push is part of this execution handoff.

## Final validation

`npm test` completed successfully: 19 suites passed, zero failed, 63 fresh
tasks, 475.92 seconds. The complete harness and process/reporting suites passed
separately as recorded above; all 19 console tests and every saved console
render passed after its current-evidence refresh. Formatting, generated harness
bytes, authority, artifact identity, verification and live feedback evidence
checks pass. The smoke recorder's final label-only correction also passed
`node --check`; it does not claim observed workflow mode.

The operator clarified that the GPT-6 Astra/ultra preference applies within the
Codex harness. The executor incorrectly extended it to the completed feedback
worker calls; their actual invocations remain recorded. DotLn worker-selection
defaults were not changed, and subsequent worker calls follow their own task
assignments. See WO-049-D006 for the correction.
