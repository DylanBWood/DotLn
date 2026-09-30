# WO-174 child-command inventory and boundary

Source: one four-package run before the tags/lazy imports were completed,
recorded in session scratch `package-reads.json` and
`non-node-observations.json`. The preload records argv, cwd and the parent
case. Exact repetitions in one parent process are deduplicated, so the
numbers below count logged observations, not every process launch. Raw logs
stay ignored; this record contains no host paths or prompt bodies.

The excluded-tree reads below are inferred from the observed targets and
checked consumer source. This is not an OS filesystem trace. Descendants
which clear Node options and native filesystem calls remain outside the
specified guard.

| Observed entry | Logged observations | Input and excluded-tree consumption |
| --- | ---: | --- |
| Native `tsc` | 10 | `--api` with virtual `/source` or `/` cwd and filesystem callbacks. The purity/application-state/comment parsers supply source strings and virtual project files; their declared parser input contains no excluded document tree. |
| `git` | 6,155 | Mostly synthetic temporary repositories. At the project root, observed `ls-files` enumerates `docs/`, `packages/` and `corpus/`; `log` names control/budget history; `ls-tree` names `CLAUDE.md`, skill trees and control segments; `cat-file --batch` reads committed document/control/profile blobs requested by the Node readers. Revisions, tags, checkpoints, reflogs and source-restricted diffs also appear. Thus Git consumes excluded path metadata and committed excluded blobs; the cases with current document inputs are now tagged. Batch argv does not expose the stdin object list; that consumption is established by the checked callers. |
| `sh` | 1 | `-c 'command -v git'` resolves the executable through PATH, with no excluded project input named. |
| `mkfifo` | 3 | Creates named runtime-status/index FIFOs in temporary fixture stores. It does not read their contents. |
| `cmp` | 1 | Compares two temporary beacon files, as the beacon-fs case requires; no project document target. |
| `sandbox-exec` | 134 | Launches offline fixture checks/discovery/verification in named temporary roots. The profiles grant the fixture root and host/runtime tools; the pinned script actor additionally grants `packages/`, `node_modules/` and `package.json`. Synthetic fixture Markdown/configuration is inside those roots. No current project excluded document tree is named as a granted input in these consumers. The sandbox launcher itself is not a read tracer. |
| `xattr` | 1 | Writes a synthetic attribute on a temporary senses fixture; the test verifies that file content and xattrs do not affect its projection. |
| `zsh` | 2 | Runs the exact confined writer/test command on a temporary repository through `env -i` and `sandbox-exec`. Its declared read roots are the fixture and runtime tools; it clears the observation options, so reads inside that subprocess are outside the guard. |
| `ps` | 6 | `-axo pid=,ppid=,lstart=,comm=` reads process metadata for harness ownership, rather than document bodies. |
| Synthetic `claude` shim | 2 | The verification refusal test writes a shell shim: `--version` prints a fixed fixture version; the other call execs the local Node fixture CLI. It reads that fixture code and its synthetic worktree, with no live vendor episode. |
| `codex-login` | 2 | Node shebang fixture, not a native reader; its fixture receipt cases now run in the document gate. |
| `script-episode.js` | 10 | Node shebang entry point. It launches the sandboxed fixture actor described above; the launcher is not a native filesystem reader. |

Checked consumers: `packages/kernel/test/store-history.test.ts`;
`packages/compiler/test/purity.test.ts`;
`packages/skeleton/src/feedback-source-comments.ts`, `feedback-selfhost.ts`,
`script-episode.ts`, `discovery-sandbox.ts` and `harness-host.ts`;
`packages/skeleton/test/beacon-fs.test.ts`, `runtime-status.test.ts`,
`senses.test.ts`, `source-change-confinement.test.ts`,
`codex-isolation-receipt.test.ts` and `verification.test.ts`;
`packages/console/src/collect.ts`; and `scripts/lib/git.mjs`,
`control-store.mjs`, `harness-context.mjs` and `release-tags.mjs`.

A second observation, the post-tag guarded product run completed at
2026-09-30T17:17:20.437Z, has zero excluded Node reads in all four packages.
Its non-Node-marked command observations are native tsc 8, git 4,732,
sandbox-exec 132, mkfifo 2, cmp 1, xattr 1, zsh 2, ps 6, the synthetic
claude shim 2 and sh 1. Project-root Git argv names source-only grep,
revision/tree/root metadata and creation of temporary repositories; no
excluded document path is named there. This narrower inventory does not
turn unobserved native reads into a Node guard claim.
