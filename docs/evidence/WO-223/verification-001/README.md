# WO-223 VER-001 probes and observations

These probes back [VER-001](../../../verifications/WO-223/VER-001.md). Each
ran under `node scripts/harness.mjs bounded --`, one process at a time, from
the repository root of the order's worktree at code identity
`917ceeff861b3902ca6cd533717dd4d98b1a12e9d9691a5b63345bb2c2a36d1b`. The
probes read the repository and write only to temporary directories. In the
commands below, `<scratch>` is the session's temporary directory. The times
are those of the final reproduction from these saved files, on 2026-10-21 UTC.

## Snapshots

The two repair controls revert implementation files. They run in snapshots,
never in the worktree. `probes.mjs snapshot <dir>` copies the paths the three
fixtures read from their tool root: `scripts/`, `packages/` with their build
output, the root manifests and license files, `corpus/` and the six product
and template documents the exported-instance case copies. It links
`node_modules`. Each `--revert <path>` takes the base commit's bytes
(`6df0ec37cc21143871217bade638e5ec28bc5959`) and prints both SHA-256 values.

| Snapshot | Reverted path | SHA-256 prefix at the subject → at the base |
| --- | --- | --- |
| `<scratch>/v-head` | none | — |
| `<scratch>/v-neg1` | `scripts/docs-check.mjs` | `6dceffb4f640` → `e7128202c8b2` |
| `<scratch>/v-neg2` | `scripts/lib/target-record-reader.mjs` | `9c41de85de54` → `8969be6c0e61` |
| `<scratch>/v-neg2` | `scripts/lib/git.mjs` | `3fa0b29e2044` → `18632d02e2fa` |
| `<scratch>/v-export` | none; `patch-export` applied | — |

The six values equal the `before` and `after` fingerprints in
[repair-controls.json](../repair-controls.json). `add-probes` placed
`reader-probe.mjs` in `scripts/` and appended `hook-probe.fragment.mjs` to
`scripts/test-harness.mjs` in `v-head`, and the reader probe in `v-neg2`.
The export case copies its kit's `scripts/` from the snapshot and format-checks
it, so its snapshot carries only the formatted patch.

## Repair controls (criteria 1 and 2)

| Control | Command | Snapshot | Exit | Observation |
| --- | --- | --- | --- | --- |
| Moved document, repaired | `node --test --test-name-pattern 'moved decisions and reports resolve' <snapshot>/scripts/test-target-worktree-publish.mjs` | `v-head` | 0 | 00:18:52Z, 12.7 s |
| Moved document, reverted | same | `v-neg1` | 1 | `records/evidence/WO-999/decisions.md: document is not a readable regular file (ENOENT)` |
| Primary mapping, repaired | `node --test --test-name-pattern 'moved record lookup uses' <snapshot>/scripts/test-target-worktree-publish.mjs` | `v-head` | 0 | 00:19:17Z, 14.3 s |
| Primary mapping, reverted | same | `v-neg2` | 1 | `no main-branch control-plane worktree found` |

## Exported instance in the operator instance's arrangement (criteria 1, 2, 3, 6)

`probes.mjs patch-export <scratch>/v-export` inserts lines into the snapshot
copy of the case "planning and release-close reads run in a fresh exported
instance". Before the moved-record steps, they switch the instance's primary
checkout from `main` to `planning/verifier-probe`. They print the worktree
list and the document gate's task lines, then switch back so the rest of the
case runs unchanged. Run with
`node --test --test-name-pattern 'planning and release-close reads run in a fresh exported instance' <scratch>/v-export/scripts/test-launchpad-planning.mjs`.
It exited 0 at 00:24:19Z after 247.5 s.

- Worktrees during the gate: `kit` on `planning/verifier-probe`, `kit-wo001`
  on `wo-001` and `kit-wo002` on `wo-002`. No worktree holds `main`.
- From `kit-wo002`, after `resume target-records` moved WO-002's decisions,
  `npm run meta`, `node scripts/lineage.mjs index`, `npm run format` and
  `npm run test:docs` passed. The document gate printed PASS for all fourteen
  tasks: format, configuration-root, registrations, declarations, generated,
  host, kit-verify, harness-context, docs-check, license-surfaces,
  reader-profiles, entropy, plan-refutation-current and plan.
- The same run asserts that the first instance order's `worktree start`
  prints exactly one sign-off advisory naming `Signed-off-by` and
  `contributions.operatorAuthor`. A fresh export declares no exemption.

## Reader lookup (criterion 2 and the removed registry fallback)

`reader-probe.mjs` moves one decision with the real lifecycle in the
target-worktree fixture, then reads it in five arrangements. The order's
phase is `closed`, and both registry entries for WO-999 remain until release
close. Run: `node --test <snapshot>/scripts/reader-probe.mjs`. It exited 0 in
both snapshots (00:19:43Z and 00:19:56Z).

| Arrangement | Subject (`v-head`) | Base reader (`v-neg2`) |
| --- | --- | --- |
| R1: the only mapping removed from the primary on `main`; registry entries remain | refuses, naming the three checkouts | reads, through the registry entry |
| R2: primary on a planning branch; a prunable worktree entry | reads, from the primary | `no main-branch control-plane worktree found` |
| R3: R2 plus a mapping-less worktree on `main` | reads, from the primary | reads, through the registry entry |
| R4: read from that `main` worktree | reads, from the primary | refuses (`restore its local clone mapping`) |
| R5: `readDecisions` from the order worktree | 1 row | 1 row |

R1 is the behavior D004 removed. The order's objective prescribes it: "when
none holds it, the refusal names the three places read". Product 07 now
states it.

## Release-close advisory (criterion 4)

`hook-probe.fragment.mjs` runs inside the WO-178 hook fixture: a closed
order with `release-close` legal and a recorded `resume: release close`
dispatch. It invokes the emitted `permissions` hook as a process. Run:
`node --test --test-name-pattern 'VERIFIER PROBE' <scratch>/v-head/scripts/test-harness.mjs`.
It exited 0 at 00:20:08Z.

- The four base admitted forms are still admitted: `--publish`,
  `--dry-run`, one canonical material word, and two material words with an
  escaped apostrophe.
- Each of the 21 withheld spellings is withheld. On every invocation it
  journals its advisory twice, in the hook's record and in the delivered
  response, naming `<helper> --publish` and `<helper> --dry-run`. The first
  advisory of each distinct text is displayed. A repeated text is journaled
  again but not displayed, as a scratch count of rows per invocation showed.
- Nineteen receive the class their suffix shows. These include nine redirect,
  pipe, list and newline forms, one with a quoted `>` before an unquoted
  redirect; four material forms (double
  quotes, unquoted, a `keep` value, a command substitution); and six
  word-or-whitespace forms, among them a tab, a leading space, `--Publish`
  and `$(true)`.
- Two receive `non-canonical material flag quoting or value` although their
  material word is canonical: `--publish --material 'docs/x=preserve' --force`
  and `--dry-run --material 'docs/x=preserve'`. D017 boards this.
- The displayed text ends `host permissions decide.; host permissions decide.`.
  The base formatter does the same. D017 boards it with the class.

## Subject length (criterion 5)

`probes.mjs lint`, a pure probe: 72 code points gives no finding, and 73
gives `subject.length: 73 of 72 characters`. LF and CR-only endings, a ZWJ
gitmoji, a shortcode gitmoji, a nonconventional subject and a pr-title each
print the code-point count the lint judged, beside the shared limit.

## Sign-off text (criterion 3)

`probes.mjs signoff` uses synthetic identities. An unsigned outside-author
commit fails with the same line whether or not the instance declares
`contributions.operatorAuthor`. Both lines name the trailer and the
declaration route. D018 boards the declared arm. The declared-author arm of
`worktree start` passed in `bash <scratch>/snap-head/scripts/test-worktree.sh`
(exit 0, 89.8 s, 2026-10-21T00:13:13Z). That earlier hand-built snapshot
holds the subject's bytes for every script the test copies. The fixture
declares `Fixture Operator <operator@example.invalid>`, and the script fails
if the start output names the key.

## Identity and subject

- `probes.mjs identity`: code identity `917ceeff…2a36d1b`. The passing
  complete review row at that identity was recorded 2026-10-20T23:38:50.498Z
  with 104 fresh suites, none reused and none unrun.
- `probes.mjs checkpoint refs/dotln/checkpoint/WO-223/3`: of 6,902 files,
  three differ from the checkpoint, all the verify dispatch's projections.
  They are `docs/control/current.md`, `docs/control/orders/WO-223.jsonl` and
  `docs/work-orders/README.md`. Before this directory was written, no file was
  missing or extra.
