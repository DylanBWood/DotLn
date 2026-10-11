# WO-078 verification evidence — VER-002

The operator dispatched `resume: verify` after the
[D010 repair](decisions.md#wo-078-d010--repair-expected-versions-come-from-a-separate-captured-input).
The verifier ran these observations for
[VER-002](../../verifications/WO-078/VER-002.md) against the uncommitted
subject on branch `wo-078`. The base is `b7741e38d68ac659921db757ac19054f84743495`
and the code identity is
`569315b50685741e95b7046cda71c010fa3a0fcd04a50757b65ce1edd41a6e34`. No
implementation file was edited. Every probe ran in sequence, one process at
a time, under `node scripts/harness.mjs bounded --`. Each built a synthetic launchpad under
the system temporary directory and removed it.

## Commands and results

| Command | Result | UTC cutoff | Duration |
| --- | --- | --- | ---: |
| `node <session scratch>/ver002-probe.mjs <worktree>` (first run, before the copy below) | Cases A, B and G refuse; case C exits 0 | 2026-10-11T16:58:57.943Z | 861 ms |
| `node --test scripts/test-siblings.mjs` | 13 passed, 0 failed; generator 36 ms / 1,801 bytes without receipts and 94 ms / 3,038 bytes with two | 2026-10-11T17:00:01.143Z | 7,254 ms |
| `npm run format:check` | All matched files use Prettier code style | before the gate | not recorded |
| `git diff --check`, plus a trailing-whitespace scan of the 17 untracked files | clean | before the gate | not recorded |
| `git diff --quiet -- package.json package-lock.json packages/` | exit 0: no dependency change | before the gate | not recorded |
| suppression scan of the `scripts/` diff and the three new modules | no `eslint-disable`, `@ts-*` or `prettier-ignore` directive | before the gate | not recorded |
| `npm run test:docs` | 33 passed, 0 failed, 33 fresh tasks; exit 0; identity and build outputs unchanged | 2026-10-11T17:03:18.025Z | 101,656 ms |
| `node docs/evidence/WO-078/verification-002-probe.mjs` (the formatted copy) | `reproducedF1: true`; same outcomes as the first run | 2026-10-11T17:03:35.040Z | 921 ms |

`npm test -- --review` was not rerun. The executor's row matches the
subject's code identity. It was recorded at 2026-10-11T15:39:08.809Z with
selection `review`, 38 of 38 required suites fresh, exit 0, executed, and
identity and build outputs unchanged, in 1,479,890 ms. Its required suites
include `launchpad`, `siblings-fixtures`, `configuration-root` and
`worktree-integration`. The verifier consumes that row.

## Probe cases

The synthetic launchpad declares one export sibling, commits once, tags the
commit `v1.0.0`, writes one receipt through `scripts/lib/siblings.mjs`
`writeReceipt`, and generates. The baseline check exits 0. The Kit version
reads `` `v1.0.0` ``, and `tag-observations.json` records
`{ "tag": "v1.0.0", "nearest": "v1.0.0" }` for the commit.

| Case | Edit | Check exit | Output |
| --- | --- | ---: | --- |
| A | page only: every `v1.0.0` becomes `v9.8.7-forged` (VER-001 F1 as filed) | 1 | `README.md is stale at line 13` |
| B | `tag-observations.json` only, same replacement | 1 | `README.md is stale at line 13` |
| C | page and `tag-observations.json` together, same replacement | **0** | `NEWER tag evidence for <commit>: v1.0.0; the page keeps its recorded observation; …` then `PASS docs/siblings/README.md is current` |
| C′ | `siblings index` after C | 0 | `Generated docs/siblings/README.md`; both files are restored byte for byte |
| D | both files changed to record `tag: null, nearest: null` while `v1.0.0` points at the commit | 0 | NEWER tag evidence naming `v1.0.0`, then PASS |
| E | no edit; `v1.1.0` tagged at the same commit | 0 | NEWER tag evidence naming `v1.1.0`; the page is unchanged |
| F | with `v1.1.0` present, both files change `v1.0.0` to `v1.1.0` | 0 | NEWER tag evidence, then PASS |
| G | a leftover `<receipt>.json.<uuid>.tmp` beside the receipt | 1 | `expected a regular .json receipt`, naming the path |

In case C the page's Kit version line reads `` `v9.8.7-forged` ``.
`git rev-parse -q --verify refs/tags/v9.8.7-forged` fails, and
`git tag --points-at <commit>` prints `v1.0.0`. The receipt and declaration
bytes are unchanged. Case C is the VER-002 F1 reproduction. Cases D and F
record observations that hold real tags at or below the commit. They are
reported as limits and are not part of the repair rule. Case G shows the
documented refusal for a file the gate cannot decode. It matches the planning
receipt 043 known issue for criterion 1, whose reopening condition (a gate
refused in an order that changed no sibling file) has not been observed.

## Source path

`writeRegistry(root, { check: true })` passes
`readTagObservations(observationSource)` to `commitFacts` as `recorded`.
`commitFacts` takes `recorded.get(commit) ?? describeTag(root, commit)`, so
for every recorded commit the expected tag comes from the observation file.
The observation check confirms only the file's shape and that its keys equal
the receipts' known commits. After `checkRegistry` passes, the loop over
`recorded` calls `describeTag` for each commit. On any difference it writes
`NEWER tag evidence` to stdout and continues to `PASS`. `.gitattributes` lists
`/docs/siblings/tag-observations.json dotln-generated dotln-check=suite:siblings`.
`scripts/lib/worktree-integration.mjs` lists it in `pureProjection` and
regenerates it with the page.

## Limits

No sibling checkout was exported or updated, and no network service was
queried. The probe and the fixtures use synthetic repositories. The gate rows
and usage readings come from the harness instruments under verification. The
probe's verdict rests on its own exit codes and byte comparisons and on live
`git` reads, not on those instruments.
