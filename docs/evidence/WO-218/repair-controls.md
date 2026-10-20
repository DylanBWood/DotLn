# WO-218 repair controls

The [machine-readable record](repair-controls.json) contains each exact command, test setup, isolated source replacement, before/after source hashes, output hashes and results. Commands ran serially under `node scripts/harness.mjs bounded --` in a disposable copy; no production reversion was made in the working tree. TypeScript mutants were rebuilt before their test. All other fixes remained present. The recorded baseline was `a66981acfcb4c451f9ef0417c2625ef809e4dc72`.

An already-met row runs the named baseline module with the current case; its equal passing results establish retained behavior. A fixture adequacy control removes an existing guard to show that the improved case reaches it. Neither is described as a new runtime repair. Exact-command positive reuse is marked in the JSON. Complete review and document gates separately judge the final subject.

## r01-identity

Only the instance-declared contribution author receives the exemption.

Rows: 1. Preflight suite: `configuration-root`.

Command:

```sh
node --test --test-name-pattern 'instance contribution identity' scripts/test-configuration-root.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T13:25:27.627040+00:00. Reversion paths: `scripts/lib/contributions.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:

  false !== true
Value previews: actual: false, | expected: true, | operator: 'strictEqual',
```

## r02-ancestors

Inspect every scratchpad component below the trusted temporary prefix.

Rows: 2. Preflight suite: `harness-fixtures`.

Command:

```sh
node --test --test-name-pattern 'every scratchpad component' scripts/test-harness.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T13:25:28.748333+00:00. Reversion paths: `packages/skeleton/src/harness-host.ts`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: The "string" argument must be of type string. Received type undefined (undefined)
Value previews: actual: undefined, | expected: /symbolic link/, | operator: 'match',
```

## r05-stash-continuation

An inspected and staged interrupted stash application can continue without applying it twice.

Rows: 5. Preflight suite: `worktree-integration`.

Command:

```sh
node --test --test-name-pattern 'interrupted stash application has an explicit' scripts/test-worktree-integration.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T13:25:38.440005+00:00. Reversion paths: `scripts/lib/worktree-integration.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: error: usage: worktree integrate WO-NNN [--intake-backup <archive.zip>] [--continue [--stash-applied]]

  + actual - expected

  + []
  - [
  -   'build',
  -   'harness',
  -   'release',
  -   'meta',
  -   'work-orders',
  -   'publication',
  -   'console'
  - ]
Value previews: actual: [], | expected: [ 'build', 'harness', 'release', 'meta', 'work-orders', 'publication', 'console' ], | operator: 'deepStrictEqual',
```

## r06-navigation

Disabled harnesses retain their floor and remove obsolete role navigation.

Rows: 6, 22. Preflight suite: `harness-fixtures`.

Command:

```sh
node --test --test-name-pattern 'disabled harness keeps core and kit' scripts/test-harness.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T13:25:40.513294+00:00. Reversion paths: `scripts/lib/harness-instruction.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: The input was expected to not match the regular expression /Read\[(?:executor|verifier|reviewer|release-close|planner)\]:/. Input:

  '# DotLn\n' +
    '\n' +
    '## Clean Room — locked floor\n' +
    '\n' +
    'Personal work only. Never import employer code, configuration, identifiers,\n' +
    'internal services, credentials, or secrets. Stop and flag suspect material;\n' +
    "derive decisions from this project's public sources. Refer to the predecessor\n" +
    'as `v1`; use enterprise tracker, ticket artifact, and constrained managed host\n' +
    'as generic terms. No support or generated configuration may weaken this floor.\n' +
    '\n' +
    '`docs/intake/` is ignored, single-copy source material. Synthesize and rewrite\n' +
    'ordinary raw ideation. Exact wording is allowed only for an operator-authored\n' +
    'public draft explicitly marked ready to file, with direct-filing provenance\n' +
    'recorded on the committed surface. Its compaction-safety capture is a sibling\n' +
    'record, never a source to mine. The same clean-room screen always applies.\n' +
    '\n' +
Value previews: actual: "# DotLn\n\n## Clean Room — locked floor\n\nPersonal work only. Never import employer code, configuration, identifiers,\ninternal services, credentials, or secrets. Stop and flag suspect material;\nderive decisions from this project | expected: /Read\[(?:executor|verifier|reviewer|release-close|planner)\]:/, | operator: 'doesNotMatch',
```

## r07-original-objects

Export provenance reads original Git objects despite replacement refs.

Rows: 7. Preflight suite: `launchpad`.

Command:

```sh
node --test --test-name-pattern 'export refuses a replaced blob hidden' scripts/test-launchpad-export.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T13:25:52.551319+00:00. Reversion paths: `scripts/lib/git.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: Exported the DotLn kit of d6ba247cab35e4e42df5d9df71b9da7e44ce6e01 (tag v9.9.9-fixture) to <control-scratch>/temporary/dotln-launchpad-8bqfjz/kit-replaced-blob: 977 kit files in KIT-MANIFEST.json, 30 instance seeds.
  runtime: 504 compiled files built from the commit's package sources; harness bundle: 34 surfaces emitted and checked inside the export, 33 manifest-listed (CLAUDE.md's block is checked through .claude/harness-manifest.json); snapshot .runtime/harness/9db1ef0d84776228.
  local-terms list: present (1007 texts checked)
  sibling receipt: none (no sibling declaration at docs/siblings/siblings.json)


  0 !== 1
Value previews: actual: 0, | expected: 1, | operator: 'strictEqual',
```

## r08-markers

Overlay strings and nested property names cannot inject harness markers.

Rows: 8. Preflight suite: `harness-fixtures`.

Command:

```sh
node --test --test-name-pattern 'overlay marker text' scripts/test-harness.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T13:29:27.658222+00:00. Reversion paths: `scripts/lib/harness.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:

  0 !== 1
Value previews: actual: 0, | expected: 1, | operator: 'strictEqual',
```

## r09-seed-class

The retained public seed declares a class that the instance validator accepts.

Rows: 9. Preflight suite: `configuration-root`.

Command:

```sh
node --test --test-name-pattern 'public WO-111 seed emits' scripts/test-configuration-root.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T13:25:55.171599+00:00. Reversion paths: `docs/evidence/WO-111/seed.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: file://<control-scratch>/subject/scripts/lib/config.mjs:157
    new Error(`invalid DotLn configuration in ${path}: ${detail}`);
    ^

  Error: invalid DotLn configuration in <control-scratch>/temporary/dotln-legacy-seed-IfBJpv/temporary/dotln-wo111-KFcS6p/launchpad/dotln.config.json: repositories.scratch.repositoryClass names no declared class: scratch
Value previews: actual: 1, | expected: 0, | operator: 'strictEqual',
```

## r10-link-hosts

Registration link hosts use the source-bundle DNS screen.

Rows: 10. Preflight suite: `configuration-root`.

Command:

```sh
node --test --test-name-pattern 'registration hosts and target release names' scripts/test-configuration-root.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T13:25:55.536290+00:00. Reversion paths: `scripts/lib/config.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: Missing expected exception.
Value previews: actual: undefined, | expected: /repositories.target.linkHosts\[0\].*DNS host/, | operator: 'throws',
```

## r11-configured-git

A live gate does not treat Git with executable configuration as a harmless listed read.

Rows: 11. Preflight suite: `harness-fixtures`.

Command:

```sh
node --test --test-name-pattern 'WO-168 a live gate admits four' scripts/test-harness.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T13:26:11.814314+00:00. Reversion paths: `packages/skeleton/src/harness-host.ts`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: permissions: git status --short
  + actual - expected

  + undefined
  - 'deny'
Value previews: actual: undefined, | expected: 'deny', | operator: 'strictEqual',
```

## r13-carried-receipt

A captured receipt already preserved by another registered worktree remains recoverable without a duplicate.

Rows: 13. Preflight suite: `siblings-fixtures`.

Command:

```sh
node --test --test-name-pattern 'captured pending receipts survive' scripts/test-siblings.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T13:26:13.148523+00:00. Reversion paths: `scripts/siblings.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
Error: captured pending receipt is missing from source and destination: docs/control/local/sibling-receipts/starter-fixture/2026-10-13T13-00-00-000Z.json; restore the captured receipt before retrying
```

## r14-build-none

An intentionally disabled harness does not report an unavailable runtime.

Rows: 14. Preflight suite: `harness-fixtures`.

Command:

```sh
node --test --test-name-pattern 'disabled harness keeps core and kit' scripts/test-harness.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T13:26:13.981856+00:00. Reversion paths: `scripts/lib/harness-runtime.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
  + actual - expected

  + 'runtime-unavailable'
  - null
Value previews: actual: 'runtime-unavailable', | expected: null, | operator: 'strictEqual',
```

## r15-encoded-links

Encoded paths are decoded once before containment and query strings retain their meaning.

Rows: 15. Preflight suite: `target-worktree`.

Command:

```sh
node --test --test-name-pattern 'target publication normalizes nested links' scripts/test-target-worktree-publish.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T13:26:14.381361+00:00. Reversion paths: `scripts/lib/github-body.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:

    assert.ok(body.includes("file%281%29.md?plain=1#here"))
Value previews: actual: false, | expected: true, | operator: '==',
```

## r17-publication-declaration

A publication declaration under the configured root requires both edition inputs.

Rows: 17. Preflight suite: `configuration-root`.

Command:

```sh
node --test --test-name-pattern 'publication declarations under a configured root' scripts/test-configuration-root.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T13:26:15.428843+00:00. Reversion paths: `scripts/check-publication.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: audience-status-index.md

  0 !== 1
Value previews: actual: 0, | expected: 1, | operator: 'strictEqual',
```

## r18-moved-decisions

Moved decisions are read from the bound immutable target record.

Rows: 18. Preflight suite: `target-worktree`.

Command:

```sh
node --test --test-name-pattern 'moved decisions and reports resolve' scripts/test-target-worktree-publish.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T13:26:41.905903+00:00. Reversion paths: `scripts/lib/meta.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
TypeError [Error]: Cannot read properties of undefined (reading 'targetRecord')
```

## r19-protected-retry

Disposable retry commands exclude protected intake, submodule and linked-worktree rows.

Rows: 19. Preflight suite: `release`.

Command:

```sh
bash scripts/test-release.sh --case material
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T13:31:57.979899+00:00. Reversion paths: `scripts/release.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: disposable retry excludes protected intake
Value previews: actual: false, | expected: true, | operator: '==',
```

## r19-reserved-case

Reserved local export names are compared without ASCII case.

Rows: 19. Preflight suite: `launchpad`.

Command:

```sh
node --test --test-name-pattern 'follow-up exports refuse reserved' scripts/test-launchpad-seeds.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T13:34:43.285276+00:00. Reversion paths: `scripts/refute-plan.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: Terms.txt
Value previews: actual: 0, | expected: 0, | operator: 'notStrictEqual',
```

## r19-linked-remedy

Nested linked worktrees retain their preserving move remedy through inventory.

Rows: 19. Preflight suite: `worktree-integration`.

Command:

```sh
node --test --test-name-pattern 'nested material keeps linked-worktree' scripts/test-worktree-integration.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T13:34:43.856343+00:00. Reversion paths: `scripts/lib/worktree-material.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
  + actual - expected

  + undefined
  - true
Value previews: actual: undefined, | expected: true, | operator: 'strictEqual',
```

## r19-advisory-first

The scratch repository advisory is emitted before candidate-tree hashing can refuse.

Rows: 19. Preflight suite: `worktree-integration`.

Command:

```sh
node --test --test-name-pattern 'completion names unignored scratch' scripts/test-worktree-integration.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T13:34:44.567411+00:00. Reversion paths: `scripts/lib/lifecycle-evidence.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:

    assert.ok(
Value previews: actual: false, | expected: true, | operator: '==',
```

## r19-submodule-quote

A submodule refusal shell-quotes the closing worktree path.

Rows: 19. Preflight suite: `release`.

Command:

```sh
bash scripts/test-release.sh --case submodule_force
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T13:48:58.824483+00:00. Reversion paths: `scripts/worktree.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
FAIL expected shell-quoted submodule remedy.
Derived worktree <control-scratch>/temporary/dotln-release-test.V784f0/submodule_force/project-wo099-measure-001: kept (Worktree holds a submodule (vendor/sub); Git removes it only with --force, which would discard its unpushed commits; source retained. Push the submodule's commits, then remove this worktree from an operator terminal with git worktree remove --force "<control-scratch>/temporary/dotln-release-test.V784f0/submodule_force/project-wo099-measure-001" and retry)
```

## r19-shared-git-primitives

All nested repository readers share the safe Git argument and gitlink parsers.

Rows: 19. Preflight suite: `worktree-integration`.

Command:

```sh
node --test --test-name-pattern 'nested material keeps linked-worktree' scripts/test-worktree-integration.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T13:34:53.626869+00:00. Reversion paths: `scripts/lib/worktree-material.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: The input did not match the regular expression /import \{[^}]*\bnestedGitArgs\b[^}]*\} from "(?:\.\/lib|\.)\/git\.mjs"/su. Input:

  'import {\n' +
    '  accessSync,\n' +
    '  constants,\n' +
    '  existsSync,\n' +
    '  lstatSync,\n' +
    '  readdirSync,\n' +
    '  realpathSync,\n' +
    '  rmSync,\n' +
    '} from "node:fs";\n' +
    'import { isAbsolute, join, resolve } from "node:path";\n' +
    'import {\n' +
    '  releaseCloseCommand,\n' +
    '  runGit,\n' +
    '  runGitPathList,\n' +
    '  shellQuote,\n' +
    '} from "./git.mjs";\n' +
Value previews: actual: 'import {\n  accessSync,\n  constants,\n  existsSync,\n  lstatSync,\n  readdirSync,\n  realpathSync,\n  rmSync,\n} from "node:fs";\nimport { isAbsolute, join, resolve } from "node:path";\nimport {\n  releaseCloseCommand,\n  runGit,\ | constants.W_OK | constants.X_OK);\n    } catch {\n      return current;\n    }\n    for (const entry of readdirSync(current, { withFileTypes: true }))\n      if (entry.isDirectory()) pending.push(join(current, entry.name));\n  }\n  return null;\n};\n\n/** R | expected: /import \{[^}]*\bnestedGitArgs\b[^}]*\} from "(?:\.\/lib|\.)\/git\.mjs"/su, | operator: 'match',
```

## r20-shared-composition

Seed preflight and runtime emission import one dependency-free composition implementation.

Rows: 20. Preflight suite: `launchpad`.

Command:

```sh
node --test --test-name-pattern 'seed preflight and runtime emit share' scripts/test-launchpad-seeds.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T13:35:01.911364+00:00. Reversion paths: `scripts/lib/harness-instruction-duplicate.mjs`, `scripts/lib/harness.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: harnessInstructionBlock must retain its shared export
  + actual - expected

  + [Function: harnessInstructionBlock]
  - [Function: harnessInstructionBlock]
Value previews: operator: 'strictEqual',
```

## r21-narrowing-grants

Narrowing cannot be silently restored by a later authority grant.

Rows: 21. Preflight suite: `harness-fixtures`.

Command:

```sh
node --test --test-name-pattern 'overlay marker text' scripts/test-harness.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T13:29:29.556580+00:00. Reversion paths: `packages/skeleton/src/loadouts/contributor.ts`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:

  0 !== 1
Value previews: actual: 0, | expected: 1, | operator: 'strictEqual',
```

## r23-moved-main

An earlier release is retried at its recorded commit after main advances.

Rows: 23. Preflight suite: `release`.

Command:

```sh
bash scripts/test-release.sh --case close_real_writer
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T13:35:20.619575+00:00. Reversion paths: `scripts/release.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
error: v0.2.1 already exists remotely for a different or non-annotated object
rm: <control-scratch>/temporary/dotln-release-test.HSqijk/close_real_writer/project-wo099/.runtime/snapshots/deep/snapshot.txt: Permission denied
rm: <control-scratch>/temporary/dotln-release-test.HSqijk/close_real_writer/project-wo099/.runtime/snapshots/deep: Directory not empty
rm: <control-scratch>/temporary/dotln-release-test.HSqijk/close_real_writer/project-wo099/.runtime/snapshots: Directory not empty
rm: <control-scratch>/temporary/dotln-release-test.HSqijk/close_real_writer/project-wo099/.runtime: Directory not empty
rm: <control-scratch>/temporary/dotln-release-test.HSqijk/close_real_writer/project-wo099: Directory not empty
rm: <control-scratch>/temporary/dotln-release-test.HSqijk/close_real_writer: Directory not empty
rm: <control-scratch>/temporary/dotln-release-test.HSqijk: Directory not empty
error: failed to remove owned fixture root <control-scratch>/temporary/dotln-release-test.HSqijk
```

## r23-foreign-tag

An existing tag cannot be adopted by a different order.

Rows: 23. Preflight suite: `release`.

Command:

```sh
bash scripts/test-release.sh --case close_foreign_tag
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T13:35:29.587952+00:00. Reversion paths: `scripts/release.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
PROGRESS release case close_foreign_tag started
foreign release tag accepted
```

## r23-serialized-close

A close records its attempt only after the previous close has released the order lock.

Rows: 23. Preflight suite: `release`.

Command:

```sh
bash scripts/test-release.sh --case close_overlap
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T13:35:39.246778+00:00. Reversion paths: `scripts/release.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: both overlapping attempts remain recorded

0 !== 1
Value previews: actual: 0, | expected: 1, | operator: 'strictEqual',
```

## r25-stash-proof

A stopped stash prune publishes only a complete recovery snapshot.

Rows: 25. Preflight suite: `worktree-integration`.

Command:

```sh
node --test --test-name-pattern 'stash drop stopped at partial-snapshot' scripts/test-worktree-integration.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T13:35:40.162961+00:00. Reversion paths: `scripts/lib/stash-drop.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:

  true !== false
Value previews: actual: true, | expected: false, | operator: 'strictEqual',
```

## r26-nested-links

Rewriting an inner link reparses newly exposed outer links until stable.

Rows: 26. Preflight suite: `target-worktree`.

Command:

```sh
node --test --test-name-pattern 'target publication normalizes nested links' scripts/test-target-worktree-publish.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T13:35:40.560444+00:00. Reversion paths: `scripts/lib/github-body.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:
  + actual - expected

  + [
  +   {
  +     href: 'file%281%29.md?plain=1#here',
  +     kind: 'relative-link',
  +     line: 1
  +   }
  + ]
  - []
Value previews: actual: [ { line: 1, href: 'file%281%29.md?plain=1#here', kind: 'relative-link' } ], | expected: [], | operator: 'deepStrictEqual',
```

## r27-other-launchpad

Status names the owning launchpad when the current launchpad cannot select a target.

Rows: 27. Preflight suite: `target-worktree`.

Command:

```sh
node --test --test-name-pattern 'a target registered to another launchpad' scripts/test-target-worktree-start.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T13:35:44.878901+00:00. Reversion paths: `scripts/lib/target-worktrees.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: The input did not match the regular expression /registered to launchpad.*no order selected.*DOTLN_LAUNCHPAD=/u. Input:

  'error: <control-scratch>/temporary/dotln-target-worktree-bMIjhA/Targets/target-wo999 is not a registered target worktree; no order selected\n'
Value previews: actual: 'error: <control-scratch>/temporary/dotln-target-worktree-bMIjhA/Targets/target-wo999 is not a registered target worktree; no order selected\n', | expected: /registered to launchpad.*no order selected.*DOTLN_LAUNCHPAD=/u, | operator: 'match',
```

## r29-rebase-guard

Moving an unchecked-out base preserves Git’s rebase guard.

Rows: 29. Preflight suite: `target-worktree`.

Command:

```sh
node --test --test-name-pattern 'target close keeps Git'"'"'s guard' scripts/test-target-worktree-close.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T13:35:57.733136+00:00. Reversion paths: `scripts/lib/target-worktree-close.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: Expected "actual" to be strictly unequal to: 0
Value previews: actual: 0, | expected: 0, | operator: 'notStrictEqual',
```

## r29-stale-lock

Writer transition lock failures name the checkout role and a recovery route.

Rows: 29. Preflight suite: `target-worktree`.

Command:

```sh
node --test --test-name-pattern 'target close names a stale writer transition' scripts/test-target-worktree-close.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T13:36:07.777748+00:00. Reversion paths: `scripts/lib/target-worktree-close.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: The input did not match the regular expression /target clone base main: writer transition lock requires inspection; source retained\. Confirm no registration or teardown is running.*then rerun/u. Input:

  'error: writer registration or teardown in progress at <control-scratch>/temporary/dotln-writer-transition-501/149628ace0d772d29b86a9dae2a010492d35c313716ac9df7e5d87a5b937c0c9 (or lock requires inspection)\n'
Value previews: actual: 'error: writer registration or teardown in progress at <control-scratch>/temporary/dotln-writer-transition-501/149628ace0d772d29b86a9dae2a010492d35c313716ac9df7e5d87a5b937c0c9 (or lock requires inspection)\n', | expected: /target clone base main: writer transition lock requires inspection; source retained\. Confirm no registration or teardown is running.*then rerun/u, | operator: 'match',
```

## r29-local-paths

File URLs and colon-prefixed local paths are masked while HTTPS remains readable.

Rows: 29. Preflight suite: `target-worktree`.

Command:

```sh
node --test --test-name-pattern 'refusal masking names passed paths' scripts/test-target-worktree-close.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T13:36:08.123841+00:00. Reversion paths: `scripts/lib/git.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
  + actual - expected

  + 'file://<target clone>/private.txt; error:<target clone>/private.txt; file://<fixture-temp>/elsewhere; error:<fixture-temp>/elsewhere; https://example.invalid/tmp/public'
  - 'file://<local>; error:<local>; file://<local>; error:<local>; https://example.invalid/tmp/public'
Value previews: actual: 'file://<target clone>/private.txt; error:<target clone>/private.txt; file://<fixture-temp>/elsewhere; error:<fixture-temp>/elsewhere; https://example.invalid/tmp/public', | expected: 'file://<local>; error:<local>; file://<local>; error:<local>; https://example.invalid/tmp/public', | operator: 'strictEqual',
```

## r29-large-fence

A large fenced block does not spread one argument per code point.

Rows: 29. Preflight suite: `outward-lint`.

Command:

```sh
node --test --test-name-pattern 'a large fenced body' scripts/test-outward-lint.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T13:36:08.543927+00:00. Reversion paths: `scripts/lib/outward-lint.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
RangeError [Error]: Maximum call stack size exceeded
```

## r32-recovery-instructions

The upgrade instructions check phase after restoring the saved records.

Rows: 32. Preflight suite: `launchpad-planning`.

Command:

```sh
node --test --test-name-pattern 'an instance exported at v0.81.0 takes this release' scripts/test-launchpad-planning.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T13:37:13.715086+00:00. Reversion paths: `scripts/kit/README.client.md`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: the recorded phase is checked after restoring the saved stash
Value previews: actual: false, | expected: true, | operator: '==',
```

## r35-settings-preflight

Malformed literal settings refuse before creating either worktree.

Rows: 35. Preflight suite: `target-worktree`.

Command:

```sh
node --test --test-name-pattern 'malformed literal settings refuse target start' scripts/test-target-worktree-start.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T13:37:20.047790+00:00. Reversion paths: `scripts/worktree.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:

  true !== false
Value previews: actual: true, | expected: false, | operator: 'strictEqual',
```

## r36-rules-cleanliness

Owned per-order Codex rules do not make main dirty.

Rows: 36. Preflight suite: `target-worktree`.

Command:

```sh
node --test --test-name-pattern 'literal host rules keep main clean and preserve another in-flight order' scripts/test-target-worktree-start.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T13:37:33.864970+00:00. Reversion paths: `scripts/lib/target-worktrees.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: the first order's owned rules leave main clean
  + actual - expected

  + '?? .codex/rules/dotln-WO-999.rules'
  - ''
Value previews: actual: '?? .codex/rules/dotln-WO-999.rules', | expected: '', | operator: 'strictEqual',
```

## r37-path-overflow

A path-list overflow emits a bounded limit and remedy without echoing captured paths.

Rows: 37. Preflight suite: `target-worktree`.

Command:

```sh
node --test --test-name-pattern 'path-list overflow is bounded' scripts/test-target-worktree-close.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T13:37:34.602768+00:00. Reversion paths: `scripts/lib/git.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: file://<control-scratch>/subject/scripts/lib/git.mjs:145
      throw new Error(failureOf(result, `git ${args.join(" ")} failed`));
            ^

  Error: spawnSync git ENOBUFS
Value previews: actual: 1, | expected: 0, | operator: 'strictEqual',
```

## r38-write-access

Both disposable trees are writable before either deletion starts.

Rows: 38. Preflight suite: `target-worktree`.

Command:

```sh
node --test --test-name-pattern 'disposable directory write access before deleting' scripts/test-target-worktree-close.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T13:37:54.900942+00:00. Reversion paths: `scripts/lib/target-worktree-close.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: The input did not match the regular expression /node_modules\/deep needs write, read and search access/u. Input:

  "error: EACCES: permission denied, unlink '<control-scratch>/temporary/dotln-target-worktree-b5L6pk/target/node_modules/deep/keep.txt'\n"
Value previews: actual: "error: EACCES: permission denied, unlink '<control-scratch>/temporary/dotln-target-worktree-b5L6pk/target/node_modules/deep/keep.txt'\n", | expected: /node_modules\/deep needs write, read and search access/u, | operator: 'match',
```

## r39-null-observation

Any matching null gate-write observation keeps the aggregate unknown.

Rows: 39. Preflight suite: `target-worktree`.

Command:

```sh
node --test --test-name-pattern 'preserves unavailable gate-write observations in mixed valid rows' scripts/test-target-worktree-close.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T13:38:10.063890+00:00. Reversion paths: `scripts/lib/target-worktree-close.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:

  [] !== null
Value previews: actual: [], | expected: null, | operator: 'deepStrictEqual',
```

## r40-moved-status

Status projects moved reports through their immutable target bindings.

Rows: 40. Preflight suite: `target-worktree`.

Command:

```sh
node --test --test-name-pattern 'moved decisions and reports resolve' scripts/test-target-worktree-publish.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T13:38:36.930849+00:00. Reversion paths: `scripts/resume.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
TypeError [Error]: Cannot read properties of undefined (reading 'commit')
```

## r41-instance-history

Historical dependency exemptions belong to the instance configuration.

Rows: 41. Preflight suite: `work-orders-fixtures`.

Command:

```sh
bash scripts/test-work-orders.sh
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T13:39:21.042948+00:00. Reversion paths: `scripts/lib/dependencies.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
  + actual - expected

  + 'Open'
  - 'Historical'
Value previews: actual: 'Open', | expected: 'Historical', | operator: 'strictEqual',
```

## r42-gitmoji

One leading gitmoji does not bypass or invalidate the conventional title grammar.

Rows: 42. Preflight suite: `outward-lint`.

Command:

```sh
node --test --test-name-pattern gitmoji scripts/test-outward-lint.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T13:39:21.384613+00:00. Reversion paths: `scripts/lib/outward-lint.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:
  + actual - expected

  + [
  +   'subject.shape'
  + ]
  - []
Value previews: actual: [ 'subject.shape' ], | expected: [], | operator: 'deepStrictEqual',
```

## r43-release-display

A target release uses its configured display name in the title.

Rows: 43. Preflight suite: `target-worktree`.

Command:

```sh
node --test --test-name-pattern 'WO-221 a target close deletes declared disposable output' scripts/test-target-worktree-release.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T13:40:37.810194+00:00. Reversion paths: `scripts/release.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: The input did not match the regular expression /title Fixture Product v0\.1\.0/u. Input:

  'WO-999 dry run: registered target; no launchpad tag is due.\n' +
    'Dry run: would fetch main, verify merge and closed state, preserve intake and retained control state, and remove merged wo-999. No changes made.\n' +
    'WO-999 closes a registered target; target release v0.1.0: preview; no launchpad tag is due.\n' +
    'Cleanup: clean.\n' +
    'Target release target: preview; tag v0.1.0; GitHub Release would create; title target v0.1.0.\n' +
    'Target worktree <control-scratch>/temporary/dotln-target-worktree-y6cHMh/Targets/target-wo999; branch wo-999: would-remove; base disposable policy delete; disposable output would be deleted: .angular (1), .nx (1), dist (1), node_modules (1), base .angular (1); advisory: gate commands wrote into the base checkout: .angular/cache/stray.tsbuildinfo.\n' +
    'Worktree <control-scratch>/temporary/dotln-target-worktree-y6cHMh/launchpad-wo999: would-remove.\n' +
    'Branch wo-999: would-delete.\n' +
    'Full report: records/state/local/retained/WO-999/release-close-2026-10-20T13-40-33-861Z.txt\n'
Value previews: actual: 'WO-999 dry run: registered target; no launchpad tag is due.\nDry run: would fetch main, verify merge and closed state, preserve intake and retained control state, and remove merged wo-999. No changes made.\nWO-999 closes a register | expected: /title Fixture Product v0\.1\.0/u, | operator: 'match',
```

## r44-starter-baseline

Starter provenance tags do not set an instance local release baseline.

Rows: 44. Preflight suite: `launchpad-planning`.

Command:

```sh
node --test --test-name-pattern 'planning and release-close reads run in a fresh exported instance' scripts/test-launchpad-planning.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T13:58:30.931629+00:00. Reversion paths: `scripts/release.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: a Starter provenance tag does not retime the instance release
Value previews: actual: '# WO-001 — Environment truth for this launchpad (bounded) (v99.1.0)\n\n**Model:** any capable model.\n**Effort:** executor any; verifier any; reviewer any.\n**Release classification:** minor. The instance\'s first release: its envi | expected: /^# .+ \(v0\.1\.0\)$/mu, | operator: 'match',
```

## r45-base-policy

Judge-only retains base output after the same refusal checks.

Rows: 45. Preflight suite: `target-worktree`.

Command:

```sh
node --test --test-name-pattern 'target close keeps the base judgment and applies judge-only' scripts/test-target-worktree-close.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T13:45:17.627857+00:00. Reversion paths: `scripts/lib/target-worktree-close.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:

  false !== true
Value previews: actual: false, | expected: true, | operator: 'strictEqual',
```

## am-close-refusals

The earlier ignore isolation, unreadable-directory and malformed advisory repairs already hold at the order base.

Rows: 33. Preflight suite: `target-worktree`. Findings: FINAL-001 F10, FINAL-001 F11, FINAL-001 F19.

Command:

```sh
node --test --test-name-pattern 'target close isolates fetched ignore rules' scripts/test-target-worktree-close.mjs
```

Current implementation: exit 0; baseline-module: exit 0. Recorded 2026-10-20T13:50:13.730277+00:00. Reversion paths: `scripts/lib/target-worktree-close.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
✔ target close isolates fetched ignore rules, retains unreadable output and tolerates unavailable gate advisories (35995.962625ms)
ℹ tests 1
ℹ suites 0
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 36059.059584
```

## am-large-ignore

Large ignored path streams were already handled at the order base.

Rows: 33. Preflight suite: `target-worktree`. Findings: FINAL-001 F1.

Command:

```sh
node --test --test-name-pattern 'target close judges large NUL-framed base path lists' scripts/test-target-worktree-close.mjs
```

Current implementation: exit 0; baseline-module: exit 0. Recorded 2026-10-20T14:00:40.933634+00:00. Reversion paths: `scripts/lib/target-worktree-close.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
✔ target close judges large NUL-framed base path lists before deleting declared output (27060.313083ms)
ℹ tests 1
ℹ suites 0
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 27126.216375
```

## am-complete-bound

The complete-selection wrapper already applies the documented six-hour ceiling.

Rows: 33. Preflight suite: `harness-fixtures`. Findings: FINAL-001 F20.

Command:

```sh
node --test --test-name-pattern 'probe wrapper gives a complete test selection' scripts/test-harness.mjs
```

Current implementation: exit 0; baseline-module: exit 0. Recorded 2026-10-20T14:00:41.909630+00:00. Reversion paths: `scripts/lib/bounded-command.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
✔ the probe wrapper gives a complete test selection a six-hour outer bound and keeps the probe deadline for focused, document, machinery and listing ones (278.926417ms)
ℹ tests 1
ℹ suites 0
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 373.747042
```

## f1-02-origin

Admission requires a recorded origin, not merely a parseable current origin.

Rows: 33. Preflight suite: `harness-fixtures`. Findings: FINAL-001 F2.

Command:

```sh
node --test --test-name-pattern 'WO-221 registered-target admission admits only the bound publication helper' scripts/test-harness.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T14:00:55.861411+00:00. Reversion paths: `packages/skeleton/src/harness-host.ts`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: node <control-scratch>/temporary/dotln-fixture-temporary-4dLrSf/dotln-harness-test-sWXImj/scripts/worktree.mjs publish WO-999 --target-worktree --draft --branch feat/x --title "feat: x" --body-file b.md
Value previews: actual: 'allow', | expected: 'allow', | operator: 'notStrictEqual',
```

## f1-03-package-closure

Helper admission binds package source as well as scripts.

Rows: 33. Preflight suite: `harness-fixtures`. Findings: FINAL-001 F3.

Command:

```sh
node --test --test-name-pattern 'WO-221 registered-target admission admits only the bound publication helper' scripts/test-harness.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T14:00:59.952780+00:00. Reversion paths: `packages/skeleton/src/harness-host.ts`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: node <control-scratch>/temporary/dotln-fixture-temporary-oVm8aY/dotln-harness-test-4uSe0Y/scripts/worktree.mjs publish WO-999 --target-worktree --draft --branch feat/x --title "feat: x" --body-file b.md
Value previews: actual: 'allow', | expected: 'allow', | operator: 'notStrictEqual',
```

## f1-04-profile

Admission honors registered authority expiry, denies and revocation.

Rows: 33. Preflight suite: `harness-fixtures`. Findings: FINAL-001 F4.

Command:

```sh
node --test --test-name-pattern 'WO-221 registered-target admission admits only the bound publication helper' scripts/test-harness.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T14:01:03.219554+00:00. Reversion paths: `packages/skeleton/src/harness-host.ts`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: node <control-scratch>/temporary/dotln-fixture-temporary-iVBFKB/dotln-harness-test-Yz3cV4/scripts/worktree.mjs publish WO-999 --target-worktree --draft --branch feat/x --title "feat: x" --body-file b.md
Value previews: actual: 'allow', | expected: 'allow', | operator: 'notStrictEqual',
```

## raw-git

Raw git receives no helper admission; its mutable configuration remains outside the bound lane.

Rows: 33. Preflight suite: `harness-fixtures`. Findings: FINAL-001 F5.

Command:

```sh
node --test --test-name-pattern 'WO-221 registered-target admission admits only the bound publication helper' scripts/test-harness.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T14:01:09.065132+00:00. Reversion paths: `packages/skeleton/src/harness-host.ts`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: git -C <control-scratch>/temporary/dotln-fixture-temporary-K5pcCs/dotln-wo221-target-Ps0Jks/Targets/clone-wo999 push -u origin wo-999
Value previews: actual: 'allow', | expected: 'allow', | operator: 'notStrictEqual',
```

## raw-gh

Raw gh receives no helper admission; its mutable configuration remains outside the bound lane.

Rows: 34. Preflight suite: `harness-fixtures`. Findings: FINAL-002 F7.

Command:

```sh
node --test --test-name-pattern 'WO-221 registered-target admission admits only the bound publication helper' scripts/test-harness.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T14:01:15.611138+00:00. Reversion paths: `packages/skeleton/src/harness-host.ts`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: gh pr view 7
Value previews: actual: 'allow', | expected: 'allow', | operator: 'notStrictEqual',
```

## raw-npm

Raw npm receives no helper admission; its mutable configuration remains outside the bound lane.

Rows: 33. Preflight suite: `harness-fixtures`. Findings: FINAL-001 F3.

Command:

```sh
node --test --test-name-pattern 'WO-221 registered-target admission admits only the bound publication helper' scripts/test-harness.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T14:01:18.201680+00:00. Reversion paths: `packages/skeleton/src/harness-host.ts`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: npm run worktree -- publish WO-999 --target-worktree --draft --branch feat/x --title "feat: x" --body-file b.md
Value previews: actual: 'allow', | expected: 'allow', | operator: 'notStrictEqual',
```

## f1-06-next-version

A tag already at the merged tip remains a prior release, not this order’s new tag.

Rows: 33. Preflight suite: `target-worktree`. Findings: FINAL-001 F6.

Command:

```sh
node --test --test-name-pattern 'WO-221 a target close deletes declared disposable output' scripts/test-target-worktree-release.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T14:01:38.417275+00:00. Reversion paths: `scripts/release.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: The input did not match the regular expression /Target release target: preview; tag v0\.1\.0/u. Input:

  'WO-999 dry run: registered target; no launchpad tag is due.\n' +
    'Dry run: would fetch main, verify merge and closed state, preserve intake and retained control state, and remove merged wo-999. No changes made.\n' +
    'WO-999 closes a registered target; target release v0.0.0: preview; no launchpad tag is due.\n' +
    'Cleanup: clean.\n' +
    'Target release target: preview; tag v0.0.0; GitHub Release would create; title target v0.0.0.\n' +
    'Target worktree <control-scratch>/temporary/dotln-target-worktree-YtAfAy/Targets/target-wo999; branch wo-999: would-remove; base disposable policy delete; disposable output would be deleted: .angular (1), .nx (1), dist (1), node_modules (1), base .angular (1); advisory: gate commands wrote into the base checkout: .angular/cache/stray.tsbuildinfo.\n' +
    'Worktree <control-scratch>/temporary/dotln-target-worktree-YtAfAy/launchpad-wo999: would-remove.\n' +
    'Branch wo-999: would-delete.\n' +
    'Full report: records/state/local/retained/WO-999/release-close-2026-10-20T14-01-34-634Z.txt\n'
Value previews: actual: 'WO-999 dry run: registered target; no launchpad tag is due.\nDry run: would fetch main, verify merge and closed state, preserve intake and retained control state, and remove merged wo-999. No changes made.\nWO-999 closes a register | expected: /Target release target: preview; tag v0\.1\.0/u, | operator: 'match',
```

## f1-07-ambiguous-push

A transport error after tag acceptance still retains the attempted publication binding.

Rows: 33. Preflight suite: `target-worktree`. Findings: FINAL-001 F7.

Command:

```sh
node --test --test-name-pattern 'WO-221 a target close deletes declared disposable output' scripts/test-target-worktree-release.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T14:02:14.573079+00:00. Reversion paths: `scripts/release.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
  + actual - expected

  + undefined
  - 'published'
Value previews: actual: undefined, | expected: 'published', | operator: 'strictEqual',
```

## f1-08-recorded-origin

A post-cleanup retry stays bound to the recorded target release origin.

Rows: 33. Preflight suite: `target-worktree`. Findings: FINAL-001 F8.

Command:

```sh
node --test --test-name-pattern 'WO-221 a target close deletes declared disposable output' scripts/test-target-worktree-release.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T14:02:54.769770+00:00. Reversion paths: `scripts/release.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: Expected "actual" to be strictly unequal to: 0
Value previews: actual: 0, | expected: 0, | operator: 'notStrictEqual',
```

## f1-09-draft-commit

A failed draft publication reuses its already prepared commit.

Rows: 33. Preflight suite: `target-worktree`. Findings: FINAL-001 F9.

Command:

```sh
node --test --test-name-pattern 'WO-221 the draft form at verified' scripts/test-target-worktree-publish.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T14:03:50.614166+00:00. Reversion paths: `scripts/lib/target-publish.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
  + actual - expected

  + '3e5c0db9b11df9dbc4cc1b2d9aef70813b5874c1'
  - '66629110990842f34c7db3d9b91bc03ee4c80b36'
Value previews: actual: '3e5c0db9b11df9dbc4cc1b2d9aef70813b5874c1', | expected: '66629110990842f34c7db3d9b91bc03ee4c80b36', | operator: 'strictEqual',
```

## f1-12-body

Draft body input excludes intake and ignored files before publication.

Rows: 33. Preflight suite: `target-worktree`. Findings: FINAL-001 F12.

Command:

```sh
node --test --test-name-pattern 'WO-221 the draft form at verified' scripts/test-target-worktree-publish.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T14:04:02.436709+00:00. Reversion paths: `scripts/worktree.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: Expected "actual" to be strictly unequal to: 0
Value previews: actual: 0, | expected: 0, | operator: 'notStrictEqual',
```

## f1-13-literal-rules

Literal host rules expose only the absolute order-specific node helper.

Rows: 33. Preflight suite: `target-worktree`. Findings: FINAL-001 F13.

Command:

```sh
node --test --test-name-pattern 'literal host rules keep main clean and preserve another in-flight order' scripts/test-target-worktree-start.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T14:04:10.836042+00:00. Reversion paths: `scripts/lib/target-worktrees.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:

    assert.ok(rules().every((rule) => !/^Bash\((?:git|gh|npm) /u.test(rule)))
Value previews: actual: false, | expected: true, | operator: '==',
```

## f1-15-order-rules

Removing one order’s literal rules preserves every rule the other order needs.

Rows: 33. Preflight suite: `target-worktree`. Findings: FINAL-001 F15.

Command:

```sh
node --test --test-name-pattern 'literal host rules keep main clean and preserve another in-flight order' scripts/test-target-worktree-start.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T14:04:28.360879+00:00. Reversion paths: `scripts/lib/target-worktrees.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: closing the first order preserves every rule needed by the second
  + actual - expected

    [
  -   'Bash(gh pr create --draft --repo github.com/dotln-fixture/target *)',
  -   'Bash(gh pr create --repo github.com/dotln-fixture/target *)',
  -   'Bash(gh pr edit --repo github.com/dotln-fixture/target *)',
  -   'Bash(gh pr ready --repo github.com/dotln-fixture/target *)',
  -   'Bash(gh pr view --repo github.com/dotln-fixture/target *)',
      'Bash(git -C <control-scratch>/temporary/dotln-target-worktree-PgbgWx/Targets/target-wo998 push -u origin wo-998)',
      'Bash(git -C <control-scratch>/temporary/dotln-target-worktree-PgbgWx/Targets/target-wo998 push origin wo-998)',
      'Bash(npm run worktree -- publish WO-998 --target-worktree *)'
    ]
Value previews: actual: [ 'Bash(git -C <control-scratch>/temporary/dotln-target-worktree-PgbgWx/Targets/target-wo998 push -u origin wo-998)', 'Bash(git -C <control-scratch>/temporary/dotln-target-worktree-PgbgWx/Targets/target-wo998 push origin wo-998)', ' | expected: [ 'Bash(gh pr create --draft --repo github.com/dotln-fixture/target *)', 'Bash(gh pr create --repo github.com/dotln-fixture/target *)', 'Bash(gh pr edit --repo github.com/dotln-fixture/target *)', 'Bash(gh pr ready --repo github.c | operator: 'deepStrictEqual',
```

## f2-08-gh-prefix

A literal gh prefix cannot authorize a later overriding repository argument.

Rows: 34. Preflight suite: `target-worktree`. Findings: FINAL-002 F8.

Command:

```sh
node --test --test-name-pattern 'literal host rules keep main clean and preserve another in-flight order' scripts/test-target-worktree-start.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T14:04:36.649049+00:00. Reversion paths: `scripts/lib/target-worktrees.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:

    assert.ok(rules().every((rule) => !/^Bash\((?:git|gh|npm) /u.test(rule)))
Value previews: actual: false, | expected: true, | operator: '==',
```

## f1-14-rewrite-origin

Rewriting host rules checks the origin recorded at start.

Rows: 33. Preflight suite: `target-worktree`. Findings: FINAL-001 F14.

Command:

```sh
node --test --test-name-pattern 'host-rule rewrite requires a committed opt-in' scripts/test-target-worktree-start.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T14:04:54.547773+00:00. Reversion paths: `scripts/worktree.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: Expected "actual" to be strictly unequal to: 0
Value previews: actual: 0, | expected: 0, | operator: 'notStrictEqual',
```

## f1-16-sidecar-path

A sidecar cannot redirect ownership to a different Codex rule path.

Rows: 33. Preflight suite: `target-worktree`. Findings: FINAL-001 F16.

Command:

```sh
node --test --test-name-pattern 'host-rule rewrite requires a committed opt-in' scripts/test-target-worktree-start.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T14:05:00.164407+00:00. Reversion paths: `scripts/lib/target-worktrees.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: Missing expected exception.
Value previews: actual: undefined, | expected: /repair the host-rule record/, | operator: 'throws',
```

## f1-16-removal-journal

Interrupted host-rule removal retains an identical operator rule on retry.

Rows: 33. Preflight suite: `target-worktree`. Findings: FINAL-001 F16.

Command:

```sh
node --test --test-name-pattern 'host-rule rewrite requires a committed opt-in' scripts/test-target-worktree-start.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T14:05:10.404613+00:00. Reversion paths: `scripts/lib/target-worktrees.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: error: .claude/settings.local.json allow rules changed during removal; preserve the current settings and inspect records/state/local/host-rules/WO-999.json before retrying host-rules --remove WO-999


  1 !== 0
Value previews: actual: 1, | expected: 0, | operator: 'strictEqual',
```

## f1-17-receipt

A failed target Release records partial publication and its blocker.

Rows: 33. Preflight suite: `target-worktree`. Findings: FINAL-001 F17.

Command:

```sh
node --test --test-name-pattern 'WO-221 a target close deletes declared disposable output' scripts/test-target-worktree-release.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T14:05:45.700492+00:00. Reversion paths: `scripts/release.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: The input did not match the regular expression /Target release target: partially-published/u. Input:

  'WO-999: registered target; no launchpad tag is due.\n' +
    'Cleanup: not-attempted.\n' +
    'Target release target: prepared; tag v0.1.0; GitHub Release not verified; title Fixture Product v0.1.0.\n' +
    'Target worktree <control-scratch>/temporary/dotln-target-worktree-DVpyTd/Targets/target-wo999; branch wo-999: removed; base disposable policy delete; disposable output deleted: .angular (1), .nx (1), dist (1), node_modules (1), base .angular (1); advisory: gate commands wrote into the base checkout: .angular/cache/stray.tsbuildinfo.\n' +
    'Cleanup/publication blocker (completion): target publish refused: tag published; GitHub Release not created; rerun the same command: simulated release failure\n' +
    "Retry: '<node>' '<control-scratch>/temporary/dotln-target-worktree-DVpyTd/launchpad/scripts/release.mjs' close WO-999 --publish\n" +
    'Full report: records/state/local/retained/WO-999/release-close-2026-10-20T14-05-44-508Z.txt\n'
Value previews: actual: "WO-999: registered target; no launchpad tag is due.\nCleanup: not-attempted.\nTarget release target: prepared; tag v0.1.0; GitHub Release not verified; title Fixture Product v0.1.0.\nTarget worktree <control-scratch>/temporary/dotl | expected: /Target release target: partially-published/u, | operator: 'match',
```

## f1-18-gh-preflight

Starter refresh verifies forge authentication before pushing a new refresh commit.

Rows: 33. Preflight suite: `launchpad`. Findings: FINAL-001 F18.

Command:

```sh
node --test --test-name-pattern 'starter refresh publishes one verified commit' scripts/test-launchpad-update.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T14:13:57.472822+00:00. Reversion paths: `scripts/lib/starter-refresh.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: authentication failure must precede every remote write
  + actual - expected

  + 'refs/heads/main 7668521fab021fd78570768a16ab87c34e34a20b\n'
  - 'refs/heads/main 0e1018f21b6a5c06a6c91e11bb1a4fec7b0869bc\n'
Value previews: actual: 'refs/heads/main 7668521fab021fd78570768a16ab87c34e34a20b\n', | expected: 'refs/heads/main 0e1018f21b6a5c06a6c91e11bb1a4fec7b0869bc\n', | operator: 'strictEqual',
```

## f1-18-preview

Starter preview names both the intended tag and Release.

Rows: 33. Preflight suite: `launchpad`. Findings: FINAL-001 F18.

Command:

```sh
node --test --test-name-pattern 'starter refresh publishes one verified commit' scripts/test-launchpad-update.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T14:14:18.676858+00:00. Reversion paths: `scripts/lib/starter-refresh.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:
  + actual - expected

  + undefined
  - {
  -   outcome: 'preview',
  -   tag: 'v10.1.0'
  - }
Value previews: actual: undefined, | expected: { tag: 'v10.1.0', outcome: 'preview' }, | operator: 'deepStrictEqual',
```

## f2-01-path-names

Undeclared ignored output is named by its full relative path.

Rows: 34. Preflight suite: `target-worktree`. Findings: FINAL-002 F1.

Command:

```sh
node --test --test-name-pattern 'target close keeps the base judgment and applies delete' scripts/test-target-worktree-close.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T14:14:30.747719+00:00. Reversion paths: `scripts/lib/target-worktree-close.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: The input did not match the regular expression /nested\/\.env/u. Input:

  "error: target clone base main has undeclared ignored material; source retained: nested. Declare it disposable in the registration or remove it; regenerable build output is deleted at close, never moved to scratch. Then rerun '<node>' '<control-scratch>/temporary/dotln-target-worktree-bhm2Ef/launchpad/scripts/release.mjs' close WO-999 --publish\n"
Value previews: actual: "error: target clone base main has undeclared ignored material; source retained: nested. Declare it disposable in the registration or remove it; regenerable build output is deleted at close, never moved to scratch. Then rerun '<node | expected: /nested\/\.env/u, | operator: 'match',
```

## f2-02-planned

A refused close reports planned deletion while the output still exists.

Rows: 34. Preflight suite: `target-worktree`. Findings: FINAL-002 F2.

Command:

```sh
node --test --test-name-pattern 'WO-221 a target close deletes declared disposable output' scripts/test-target-worktree-release.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T14:14:57.289678+00:00. Reversion paths: `scripts/release.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: The input did not match the regular expression /disposable output planned for deletion:[^\n]*base \.angular \(1\)/u. Input:

  'WO-999: no-release; no tag or GitHub Release is due.\n' +
    'Cleanup: not-attempted.\n' +
    'Target worktree <control-scratch>/temporary/dotln-target-worktree-F1mfgq/Targets/target-wo999; branch wo-999: retained; base disposable policy delete; disposable output deleted: .angular (1), .nx (1), dist (1), node_modules (1), base .angular (1); advisory: gate commands wrote into the base checkout: .angular/cache/stray.tsbuildinfo.\n' +
    "Cleanup/publication blocker (completion): target has undeclared ignored material; source retained: .env. Declare it disposable in the registration or remove it; regenerable build output is deleted at close, never moved to scratch. Then rerun '<node>' '<control-scratch>/temporary/dotln-target-worktree-F1mfgq/launchpad/scripts/release.mjs' close WO-999 --publish\n" +
    "Retry: '<node>' '<control-scratch>/temporary/dotln-target-worktree-F1mfgq/launchpad/scripts/release.mjs' close WO-999 --publish\n" +
    'Full report: records/state/local/retained/WO-999/release-close-2026-10-20T14-14-54-908Z.txt\n'
Value previews: actual: "WO-999: no-release; no tag or GitHub Release is due.\nCleanup: not-attempted.\nTarget worktree <control-scratch>/temporary/dotln-target-worktree-F1mfgq/Targets/target-wo999; branch wo-999: retained; base disposable policy delete; d | expected: /disposable output planned for deletion:[^\n]*base \.angular \(1\)/u, | operator: 'match',
```

## f2-03-streaming

The tree selector streams all paths while retaining only selected names.

Rows: 34. Preflight suite: `target-worktree`. Findings: FINAL-002 F3.

Command:

```sh
node --test --test-name-pattern 'path-list overflow is bounded' scripts/test-target-worktree-close.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T14:14:57.734686+00:00. Reversion paths: `scripts/lib/git.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: file://<control-scratch>/subject/scripts/lib/git.mjs:145
      throw new Error(
            ^

  Error: Git path-list read exceeded the 16 MiB limit; remove or reduce the listed tree, then rerun the same command
Value previews: actual: 1, | expected: 0, | operator: 'strictEqual',
```

## f2-04-tag-preflight

A conflicting sibling tag refuses before the refresh commit is pushed.

Rows: 34. Preflight suite: `launchpad`. Findings: FINAL-002 F4.

Command:

```sh
node --test --test-name-pattern 'starter refresh publishes one verified commit' scripts/test-launchpad-update.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T14:15:11.730693+00:00. Reversion paths: `scripts/lib/starter-refresh.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: a conflicting release tag must refuse before the refresh push
  + actual - expected

  + 'refs/heads/main 3960838a370dd12dcc9a7f14c70d04ea1230f5a9\n' +
  - 'refs/heads/main 5e0f12ed01b840f075e61f44026cf15998c82682\n' +
      'refs/tags/v10.0.0 5e0f12ed01b840f075e61f44026cf15998c82682\n'
Value previews: actual: 'refs/heads/main 3960838a370dd12dcc9a7f14c70d04ea1230f5a9\nrefs/tags/v10.0.0 5e0f12ed01b840f075e61f44026cf15998c82682\n', | expected: 'refs/heads/main 5e0f12ed01b840f075e61f44026cf15998c82682\nrefs/tags/v10.0.0 5e0f12ed01b840f075e61f44026cf15998c82682\n', | operator: 'strictEqual',
```

## f2-05-symlink

Declared output roots cannot traverse symlinked components.

Rows: 34. Preflight suite: `target-worktree`. Findings: FINAL-002 F5.

Command:

```sh
node --test --test-name-pattern 'disposable directory write access before deleting' scripts/test-target-worktree-close.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T14:15:24.595423+00:00. Reversion paths: `scripts/lib/target-worktree-close.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: Expected "actual" to be strictly unequal to: 0
Value previews: actual: 0, | expected: 0, | operator: 'notStrictEqual',
```

## f2-05-git-case

Git metadata spellings are excluded from disposable roots regardless of case.

Rows: 34, 38. Preflight suite: `configuration-root`. Findings: FINAL-002 F5.

Command:

```sh
node --test --test-name-pattern 'registration hosts and target release names' scripts/test-configuration-root.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T14:15:24.958541+00:00. Reversion paths: `scripts/lib/config.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: Missing expected exception.
Value previews: actual: undefined, | expected: /disposable/u, | operator: 'throws',
```

## f2-06-registry

Target admission binds the worktree registry to main’s recorded registry.

Rows: 34. Preflight suite: `harness-fixtures`. Findings: FINAL-002 F6.

Command:

```sh
node --test --test-name-pattern 'WO-221 registered-target admission admits only the bound publication helper' scripts/test-harness.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T14:15:27.685280+00:00. Reversion paths: `packages/skeleton/src/harness-host.ts`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: node <control-scratch>/temporary/dotln-fixture-temporary-0GA9ak/dotln-harness-test-3BuW82/scripts/worktree.mjs publish WO-999 --target-worktree --draft --branch feat/x --title "feat: x" --body-file b.md
Value previews: actual: 'allow', | expected: 'allow', | operator: 'notStrictEqual',
```

## f2-09-control-root

Admission resolves records through the configured control root.

Rows: 34. Preflight suite: `harness-fixtures`. Findings: FINAL-002 F9.

Command:

```sh
node --test --test-name-pattern 'WO-221 registered-target admission admits only the bound publication helper' scripts/test-harness.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T14:15:40.038904+00:00. Reversion paths: `packages/skeleton/src/harness-host.ts`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: node <control-scratch>/temporary/dotln-fixture-temporary-qzMRDl/dotln-harness-test-OtygyL/scripts/worktree.mjs publish WO-999 --target-worktree --draft --branch feat/x --title "feat: x" --body-file b.md
  + actual - expected

  + undefined
  - 'allow'
Value previews: actual: undefined, | expected: 'allow', | operator: 'strictEqual',
```

## f2-10-draft-origin

Draft retry and reuse validate the recorded draft’s repository identity.

Rows: 34. Preflight suite: `target-worktree`. Findings: FINAL-002 F10.

Command:

```sh
node --test --test-name-pattern 'WO-221 the draft form at verified' scripts/test-target-worktree-publish.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T14:15:57.153473+00:00. Reversion paths: `scripts/lib/target-publish.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: Expected "actual" to be strictly unequal to: 0
Value previews: actual: 0, | expected: 0, | operator: 'notStrictEqual',
```

## f2-11-partial-row

A passing partial row neither replaces nor revokes an earlier complete structural pass.

Rows: 34. Preflight suite: `resume`. Findings: FINAL-002 F11.

Command:

```sh
bash -c 'set -euo pipefail
unset DOTLN_ACCOUNT_LABEL CLAUDE_EFFORT CODEX_THREAD_ID COPILOT_AGENT_SESSION_ID
source scripts/test-temp-root.sh
fixture_base="$(resolve_test_tmp_base "$TMPDIR")"
create_test_temp_root "$fixture_base" dotln-repair-test
fixture_root="$test_temp_root_result"
install_test_temp_root_traps "$fixture_base" "$fixture_root" dotln-repair-test
node scripts/test-verifier-gate-claims.mjs "$fixture_root"'
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T14:20:08.463227+00:00. Reversion paths: `scripts/lib/gate-reuse.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: final-review-result pass --harness human --harness-version not-applicable --model human --effort unknown --source operator-attested: Advisory: attestation recorded as supplied; human not-applicable effort unknown has no matching discovery observation.
error: Final review requires a passing complete review row at the integrated code identity; when none exists, start npm test -- --review in the background and await it: no passing complete review row at the current code identity 2632a2f18b523f463b490b192db7a53a2fe62deedde6a4969f632b09f26d65f2 (the latest complete row names format, configuration-root, registrations, declarations, generated, host, whose latest execution there can no longer be carried; a later structural run failed: run npm run sync, then a passing structural phase before the complete run).


1 !== 0
Value previews: actual: 1, | expected: 0, | operator: 'strictEqual',
```

## f2-12-selection

Same-suite negative review cases exercise the selection requirement itself.

Rows: 34. Preflight suite: `resume`. Findings: FINAL-002 F12.

Command:

```sh
bash -c 'set -euo pipefail
unset DOTLN_ACCOUNT_LABEL CLAUDE_EFFORT CODEX_THREAD_ID COPILOT_AGENT_SESSION_ID
source scripts/test-temp-root.sh
fixture_base="$(resolve_test_tmp_base "$TMPDIR")"
create_test_temp_root "$fixture_base" dotln-repair-test
fixture_root="$test_temp_root_result"
install_test_temp_root_traps "$fixture_base" "$fixture_root" dotln-repair-test
node scripts/test-verifier-gate-claims.mjs "$fixture_root"'
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T14:20:12.250442+00:00. Reversion paths: `scripts/lib/handoff-ledger.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: Recorded final review pass; commit the reviewed state, then run npm run worktree -- publish WO-179 --title "<title>" --body-file <contained-reviewed-body-path>.
Observed facts at 2026-10-20T14:20:12.197Z: unknown (observation-runtime-unavailable); advisory only.
Value previews: actual: 0, | expected: 0, | operator: 'notStrictEqual',
```

## f2-12-executed

Same-suite negative review cases exercise the executed requirement itself.

Rows: 34. Preflight suite: `resume`. Findings: FINAL-002 F12.

Command:

```sh
bash -c 'set -euo pipefail
unset DOTLN_ACCOUNT_LABEL CLAUDE_EFFORT CODEX_THREAD_ID COPILOT_AGENT_SESSION_ID
source scripts/test-temp-root.sh
fixture_base="$(resolve_test_tmp_base "$TMPDIR")"
create_test_temp_root "$fixture_base" dotln-repair-test
fixture_root="$test_temp_root_result"
install_test_temp_root_traps "$fixture_base" "$fixture_root" dotln-repair-test
node scripts/test-verifier-gate-claims.mjs "$fixture_root"'
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T14:20:15.847022+00:00. Reversion paths: `scripts/lib/handoff-ledger.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: Recorded final review pass; commit the reviewed state, then run npm run worktree -- publish WO-179 --title "<title>" --body-file <contained-reviewed-body-path>.
Observed facts at 2026-10-20T14:20:15.794Z: unknown (observation-runtime-unavailable); advisory only.
Value previews: actual: 0, | expected: 0, | operator: 'notStrictEqual',
```

## f2-13-moved-head

A moved draft head names preservation and review before any rebind.

Rows: 34. Preflight suite: `target-worktree`. Findings: FINAL-002 F13.

Command:

```sh
node --test --test-name-pattern 'WO-221 the draft form at verified' scripts/test-target-worktree-publish.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T14:21:16.180528+00:00. Reversion paths: `scripts/lib/github-repository.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: error: target publish refused: remote draft branch feat/reviewed-behavior for pull request #7 moved from the recorded head 8ae3ab286e68858149ba8c444cddb0273439fd36 to 4b862697ea970a1a16ae0c59dd8033b911bc7743; stale info
Value previews: actual: false, | expected: true, | operator: '==',
```

## am-delayed-stub

The integration stub already waited until release preparation succeeded.

Rows: 5. Preflight suite: `worktree-integration`.

Command:

```sh
node --test --test-name-pattern 'WO-086 a retime that lands on a continuation is recorded once' scripts/test-worktree-integration.mjs
```

Current implementation: exit 0; baseline-module: exit 0. Recorded 2026-10-20T14:21:32.594229+00:00. Reversion paths: `scripts/lib/worktree-integration.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
PROGRESS integration case ended {"event":"end","name":"WO-086 a retime that lands on a continuation is recorded once, in the stub the failed pass withheld","file":"scripts/test-worktree-integration.mjs","nesting":0,"durationMs":4221.872125}
✔ WO-086 a retime that lands on a continuation is recorded once, in the stub the failed pass withheld (4468.201125ms)
ℹ tests 1
ℹ suites 0
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 4689.94875
```

## am-real-writer

The real writer-directory publication and retry protocol already works at the base.

Rows: 12. Preflight suite: `release`.

Command:

```sh
bash scripts/test-release.sh --case close_real_writer
```

Current implementation: exit 0; baseline-module: exit 0. Recorded 2026-10-20T14:21:54.882649+00:00. Reversion paths: `scripts/release.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
PROGRESS release case close_real_writer started
Preparing worktree (new branch 'wo-099')
WO-195 admitted 1 actual printer commands
WO-195 summary bytes publish=589 dry-run=873
WO-195 summary bytes retry=347
WO-195 admitted 1 actual printer commands
PROGRESS release case close_real_writer passed
release tests passed
```

## am-stale-holder

A stale base holder already permits close when its local base is synchronized.

Rows: 29. Preflight suite: `target-worktree`.

Command:

```sh
node --test --test-name-pattern 'worktree is deleted and a synced local base closes' scripts/test-target-worktree-close.mjs
```

Current implementation: exit 0; baseline-module: exit 0. Recorded 2026-10-20T14:22:07.721545+00:00. Reversion paths: `scripts/lib/target-worktree-close.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
✔ target close with a base branch whose worktree is deleted and a synced local base closes in both modes (6055.537625ms)
ℹ tests 1
ℹ suites 0
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 6119.979708
```

## r29-unmerged-remedy

An unmerged target branch keeps its protection and names the merge-and-retry remedy.

Rows: 29. Preflight suite: `target-worktree`.

Command:

```sh
node --test --test-name-pattern 'WO-072 criterion 4' scripts/test-target-worktree-close.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T14:22:22.861609+00:00. Reversion paths: `scripts/lib/target-worktree-close.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: The input did not match the regular expression /target branch wo-999 is not merged into origin\/main; source retained/. Input:

  'error: git -c core.hooksPath=/dev/null -c core.fsmonitor=false -c log.showSignature=false -c gpg.program=/usr/bin/false -c gpg.ssh.program=/usr/bin/false merge-base --is-ancestor wo-999 origin/main failed\n'
Value previews: actual: 'error: git -c core.hooksPath=/dev/null -c core.fsmonitor=false -c log.showSignature=false -c gpg.program=/usr/bin/false -c gpg.ssh.program=/usr/bin/false merge-base --is-ancestor wo-999 origin/main failed\n', | expected: /target branch wo-999 is not merged into origin\/main; source retained/, | operator: 'match',
```

## am-nested-whitespace

The original whitespace check already keeps nested repositories present while excluding their contents.

Rows: 19. Preflight suite: `worktree-integration`.

Command:

```sh
node --test --test-name-pattern 'completion names unignored scratch' scripts/test-worktree-integration.mjs
```

Current implementation: exit 0; baseline-module: exit 0. Recorded 2026-10-20T14:22:23.345825+00:00. Reversion paths: `scripts/lib/lifecycle-evidence.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
PROGRESS integration case ended {"event":"end","name":"completion names unignored scratch before tree refusal and checks whitespace with it present","file":"scripts/test-worktree-integration.mjs","nesting":0,"durationMs":202.912959}
✔ completion names unignored scratch before tree refusal and checks whitespace with it present (211.321834ms)
ℹ tests 1
ℹ suites 0
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 278.06975
```

## r18-commit-lint

Target final review refuses nonconventional commits before binding its subject.

Rows: 18. Preflight suite: `target-worktree`.

Command:

```sh
node --test --test-name-pattern 'target final review refuses a nonconventional commit' scripts/test-target-worktree-start.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T14:22:31.020977+00:00. Reversion paths: `scripts/lib/target-commit-lint.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: Expected "actual" to be strictly unequal to: 0
Value previews: actual: 0, | expected: 0, | operator: 'notStrictEqual',
```

## r18-planning-body

Planning publication accepts only planning and product documentation.

Rows: 18. Preflight suite: `target-worktree`.

Command:

```sh
node --test --test-name-pattern 'target planning publishes only product and planning documents' scripts/test-target-worktree-publish.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T14:22:57.683869+00:00. Reversion paths: `scripts/lib/target-planning.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: Expected "actual" to be strictly unequal to: 0
Value previews: actual: 0, | expected: 0, | operator: 'notStrictEqual',
```

## r30-temp-containment

The refresh fixture contains its temporary worktrees beneath its own root.

Rows: 30. Preflight suite: `launchpad`.

Command:

```sh
node --test --test-name-pattern 'starter refresh publishes one verified commit' scripts/test-launchpad-update.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T14:23:37.358196+00:00. Reversion paths: `scripts/test-launchpad-update.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: refresh scratch remains inside the fixture's declared temporary parent
  + actual - expected

  + '<control-scratch>/temporary'
  - '<control-scratch>/temporary/dotln-launchpad-lCMq1Y/starter-refresh-fixture/refresh-temporary'
Value previews: actual: '<control-scratch>/temporary', | expected: '<control-scratch>/temporary/dotln-launchpad-lCMq1Y/starter-refresh-fixture/refresh-temporary', | operator: 'strictEqual',
```

## r31-temporary-retry

Cleanup recovery remains bound to its recorded temporary root after TMPDIR changes.

Rows: 31. Preflight suite: `launchpad`.

Command:

```sh
node --test --test-name-pattern 'starter refresh publishes one verified commit' scripts/test-launchpad-update.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T14:24:19.402030+00:00. Reversion paths: `scripts/lib/starter-refresh.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: {"sibling":"starter-fixture","outcome":"refused","firstExport":false,"before":null,"after":null,"tag":"v10.1.0","coreCommit":"5564b9754db6d68a812fcd24f0f7508a9122c8c9","manifestHash":null,"buildHash":null,"receipt":null,"reason":"refresh cleanup ownership does not match the recorded checkout","actions":[],"rewrittenSeeds":[],"timings":{},"finderMetadata":[]}
  + actual - expected

  + 'refused'
  - 'current'
Value previews: actual: 'refused', | expected: 'current', | operator: 'strictEqual',
```

## r31-cleanup-privacy

The existing cleanup redaction guard withholds recorded private paths in preview and applied recovery.

Rows: 31. Preflight suite: `launchpad`.

Command:

```sh
node --test --test-name-pattern 'starter refresh publishes one verified commit' scripts/test-launchpad-update.mjs
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T14:28:44.058185+00:00. Reversion paths: `scripts/lib/starter-refresh.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
AssertionError [ERR_ASSERTION]: no private path or source excerpt in refusal
Value previews: actual: false, | expected: true, | operator: '==',
```

## r44-ancestral-local

Local preparation excludes ordinary tags on unintegrated histories while counting reachable releases.

Rows: 44. Preflight suite: `release`.

Command:

```sh
bash scripts/test-release.sh --case prepare_independent
```

Current implementation: exit 0; isolated-reversion: exit 1. Recorded 2026-10-20T14:29:57.841421+00:00. Reversion paths: `scripts/release.mjs`. Exact replacements and any equal-arm fixture setup are in the JSON.

Observed second-arm output:

```text
FAIL unintegrated ordinary tag changed the release baseline:
Retimed WO-099: v0.2.0 → v9.0.1 above the observed release baseline v9.0.0.
Recorded WO-099-D001 in docs/evidence/WO-099/decisions.md.
Files changed:
  docs/work-orders/WO-099-fixture.md
  README.md
  docs/evidence/WO-099/decisions.md
Tag observation: local snapshot only.
Reader profile (releaseNotes): contributor / account / where they help / summarized / plain.
Give a contributor enough context to assess and work on the change.
Explain the outcome, needed action and limits at the depth this surface can carry.
Name identifiers only when they help the reader find or act on a claim.
Summarize machine results and link their full evidence.
Use direct, ordinary language.
Preserve facts, limits, required sections and the attribution rule; this guidance neither refuses nor rewrites text.
Nearest example: docs/publication/examples/releaseNotes/balanced.md
```
