# WO-078 fixture transcripts

Observed 2026-10-11 on the executor's host, each under
`node scripts/harness.mjs bounded -- <command>`, after the self-review's
fixes landed. Temporary paths under the system temporary root are replaced by
labels; test names, counts, timings and printed lines are preserved. The
fixture repositories were removed by the suites.

## Generator fixtures

Command: `node --test scripts/test-siblings.mjs`. Exit 0; wrapper duration
7,658 ms. A temporary launchpad with its own Git history (two commits, one
tag, one synthetic closed order's control segment) stands in for core.

```text
▶ sibling registry
  ✔ WO-078 criterion 2: before any receipt, every field a receipt supplies reads not evidenced (160.612917ms)
  ✔ WO-078 criterion 1: the entry carries the latest receipt's fields, the kit version from Git and the orders closed between receipts (301.322666ms)
  ✔ a declared origin anchors the first receipt, and a commit this repository lacks reads not evidenced where Git would speak (817.507208ms)
  ✔ the receipt resolves its sibling from the destination's repository name or directory name without case (318.96325ms)
  ✔ refuses a hand-edited entry, naming the first differing line (930.565ms)
  ✔ refuses an entry whose manifest hash is not the latest receipt's, naming the receipt (1012.699083ms)
  ✔ refuses a receipt it cannot decode or read, one misnamed or misplaced, or one no declaration names, and writes nothing (1127.543625ms)
  ✔ a malformed declaration refuses by field and writes nothing (1337.373791ms)
  ✔ a tag added after generation is newer evidence, not a stale page, until the next generation (1387.39075ms)
✔ sibling registry (7396.110791ms)
ℹ generator wall-clock 50 ms (process start to exit); registry 1615 bytes
ℹ generator wall-clock 150 ms with two receipts; registry 2852 bytes
ℹ tests 10
ℹ suites 0
ℹ pass 10
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 7589.873042
```

## Export receipt, the update's receipt and the update fixtures

Command: `node --test --test-name-pattern='WO-078 criterion 1|export update' scripts/test-launchpad.mjs`.
Exit 0; wrapper duration 82,385 ms.

```text
✔ WO-078 criterion 1: an export to a declared sibling writes its receipt inside the manifest step and regenerates the entry, and an update records the sibling by its repository name (10018.846792ms)
ℹ sibling receipts 2026-10-11T03-05-27-321Z.json and 2026-10-11T03-05-30-594Z.json; generator wall-clock 104 ms; registry 2564 bytes
▶ export update preserves ownership, validates actions and keeps the exported resident
  ✔ unmodified files update; edited and dropped edits keep prior hashes on repeated updates (5745.009375ms)
  ✔ new kit collisions stay instance-owned and refused on repetition (8680.206333ms)
  ✔ missing/malformed manifests and unreadable kit inputs refuse before any write (5984.384375ms)
  ✔ apply requires opt-in and preflights all declared actions (8821.076459ms)
  ✔ a retry after an update that failed after its kit writes completes with no refusal, at a later commit too (5780.288458ms)
  ✔ a retry after the second of two renames failed adopts the first without moving it again (5919.10725ms)
  ✔ opt-in alone leaves instance files untouched; apply lists actions and is repeatable (8601.166333ms)
  ✔ declared child roots move with their parent and existing configuration values survive (2758.796834ms)
  ✔ a running exported resident keeps its log, derived identity and pending cadence (3497.301583ms)
  ✔ bounded comparison: shared preparation and a staged export produce identical candidate bytes (6196.080583ms)
✔ export update preserves ownership, validates actions and keeps the exported resident (65036.814791ms)
ℹ Updated the DotLn kit to f32d1cbcb90a3ed861af900c6ed01dfd435c2b1d in <fixture-scratch>/update-ownership.
kit files: 600 replaced; 1 added; 1 removed; 2 refused.
Instance-actions note (2026-10-11): update without opt-in.
action: {"id":"move-evidence","date":"2026-10-10","kind":"rename-root","root":"evidence","from":"docs/evidence","to":"records/evidence"}
action: {"id":"release-default","date":"2026-10-10","kind":"add-config-field","field":"release.corpus","value":true}
action: {"id":"contract-heading","date":"2026-10-10","kind":"change-phrase","from":"# Launchpad\n","to":"# Launchpad\n\nUpdated instance contract.\n"}
refused: scripts/update-dropped-modified.txt (locally modified; prior hash retained)
refused: scripts/update-modified.txt (locally modified; prior hash retained)
re-emit: node scripts/harness.mjs emit
local-terms list: present (625 texts checked)
sibling receipt: none (update-ownership is not declared in docs/siblings/siblings.json)
ℹ error: EACCES: permission denied, rename '<fixture-scratch>/update-interrupted/docs/evidence' -> '<fixture-scratch>/update-interrupted/records/evidence'
Updated the DotLn kit to 8be7663d9b8d1a324c3540e55e590f18566d7e42 in <fixture-scratch>/update-interrupted.
kit files: 601 replaced; 2 added; 1 removed; 0 refused.
ℹ Updated the DotLn kit to cbb628ddc6f8410b917cecb859ecd0d1b0009c3c in <fixture-scratch>/update-apply.
kit files: 602 replaced; 0 added; 0 removed; 0 refused.
Instance-actions note (2026-10-11): opted-in update.
action: {"id":"move-evidence","date":"2026-10-10","kind":"rename-root","root":"evidence","from":"docs/evidence","to":"records/evidence"}
action: {"id":"release-default","date":"2026-10-10","kind":"add-config-field","field":"release.corpus","value":true}
action: {"id":"contract-heading","date":"2026-10-10","kind":"change-phrase","from":"# Launchpad\n","to":"# Launchpad\n\nUpdated instance contract.\n"}
applied: move-evidence (2026-10-10, rename-root)
applied: release-default (2026-10-10, add-config-field)
applied: contract-heading (2026-10-10, change-phrase)
re-emit: node scripts/harness.mjs emit
local-terms list: present (625 texts checked)
sibling receipt: none (update-apply is not declared in docs/siblings/siblings.json)
ℹ {"runtime":"exported packages/skeleton/dist/src/resident-host.js","identity":"WO-900","logPreserved":true,"nextCadenceDueAt":10,"dispatched":1}
ℹ {"preparedMs":3022,"stagedExportAndReadMs":3069,"files":602,"bytes":9644198,"equal":true}
ℹ tests 12
ℹ suites 0
ℹ pass 12
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 82299.027917
```

The receipt case asserts: an export to `undeclared-destination` prints
`sibling receipt: none (undeclared-destination is not declared in docs/siblings/siblings.json)`
and writes neither a receipt nor a registry page; the export to
`starter-fixture` prints the receipt path and `sibling registry: docs/siblings/README.md regenerated`,
the receipt holds exactly `sibling`, `coreCommit` (the copy's HEAD),
`manifestHash` (sha256 of the export's `KIT-MANIFEST.json` bytes),
`buildHash` (`fnv1a64:` plus the snapshot hash the export prints) and `date`
(the file's name); the export holds no `docs/evidence/siblings` and its
manifest lists no evidence path; the page the export wrote carries that
commit, hash and build hash and passes `index --check`; removed and
regenerated by `node scripts/siblings.mjs index`, the page is byte-identical;
after a kit commit, `--update` into a copy named `Starter-Fixture-wo001` whose
origin remote names `starter-fixture` writes a second receipt for the declared
sibling at the new commit and the retained manifest's hash and regenerates the
page with two receipt rows; the export's page put back by hand fails
`index --check` naming the entry's recorded hash and the later receipt, and
the check writes nothing.

The update cases assert, beyond their earlier claims: a kit file whose bytes a
fork already holds at the incoming revision is not refused and is recorded at
the incoming hash (`2 refused` are the two genuine edits); a new kit path
already holding the incoming bytes and a dropped file removed by hand update
with `0 refused`; a declared `rename-root` into `scripts/evidence` refuses
before any write; an opted-in update whose rename fails with `EACCES` after
the kit writes leaves the planned manifest journaled as
`KIT-MANIFEST.pending.json` and the prior manifest in place, and the retry at
a later core commit, where a written file changed again and a dropped file
returned, completes with no refusal, every manifest hash equal to its file,
the journal removed and the root moved; and an update whose second of two
renames fails leaves the first moved with the configuration unchanged, and the
retry adopts the moved root, applies the second and records both.

## Setup-only measurement

Command: `node --test --test-name-pattern='no-such-case-setup-only' scripts/test-launchpad.mjs`
(2026-10-11T02:30:44Z, before the self-review). Exit 0; wrapper duration
4,247 ms: the committed copy, the install links and the default export that
every case in the suite reads, with no case selected. This is the cost a
second committed copy inside `scripts/test-siblings.mjs` would add to every
product gate (D006).
