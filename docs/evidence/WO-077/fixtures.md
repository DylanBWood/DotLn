# WO-077 fixture transcript

Observed 2026-10-10. Command: `node scripts/harness.mjs bounded -- node --test --test-name-pattern='export update' scripts/test-launchpad.mjs`.
Exit 0; wrapper duration 34,091 ms. The fixture repositories lived under the system temporary root and the suite removed them. Temporary export paths and synthetic source commits below are replaced by labels; test names, counts, timings, action declarations and outcomes are preserved.

```text
▶ export update preserves ownership, validates actions and keeps the exported resident
  ✔ unmodified files update; edited and dropped edits keep prior hashes on repeated updates (3779.172458ms)
  ✔ new kit collisions stay instance-owned and refused on repetition (3582.962958ms)
  ✔ missing/malformed manifests and unreadable kit inputs refuse before any write (1797.529458ms)
  ✔ apply requires opt-in and preflights all declared actions (4964.693959ms)
  ✔ opt-in alone leaves instance files untouched; apply lists actions and is repeatable (5453.117334ms)
  ✔ declared child roots move with their parent and existing configuration values survive (1871.818792ms)
  ✔ a running exported resident keeps its log, derived identity and pending cadence (3110.738584ms)
  ✔ bounded comparison: shared preparation and a staged export produce identical candidate bytes (3462.533375ms)
✔ export update preserves ownership, validates actions and keeps the exported resident (30072.059125ms)
ℹ Updated the DotLn kit to <fixture-commit> in <fixture-export:update-ownership>.
kit files: 594 replaced; 1 added; 1 removed; 2 refused.
Instance-actions note (2026-10-10): update without opt-in.
action: {"id":"move-evidence","date":"2026-10-10","kind":"rename-root","root":"evidence","from":"docs/evidence","to":"records/evidence"}
action: {"id":"release-default","date":"2026-10-10","kind":"add-config-field","field":"release.corpus","value":true}
action: {"id":"contract-heading","date":"2026-10-10","kind":"change-phrase","from":"# Launchpad\n","to":"# Launchpad\n\nUpdated instance contract.\n"}
refused: scripts/update-dropped-modified.txt (locally modified; prior hash retained)
refused: scripts/update-modified.txt (locally modified; prior hash retained)
re-emit: node scripts/harness.mjs emit
local-terms list: present (619 texts checked)
ℹ Updated the DotLn kit to <fixture-commit> in <fixture-export:update-apply>.
kit files: 596 replaced; 0 added; 0 removed; 0 refused.
Instance-actions note (2026-10-10): opted-in update.
action: {"id":"move-evidence","date":"2026-10-10","kind":"rename-root","root":"evidence","from":"docs/evidence","to":"records/evidence"}
action: {"id":"release-default","date":"2026-10-10","kind":"add-config-field","field":"release.corpus","value":true}
action: {"id":"contract-heading","date":"2026-10-10","kind":"change-phrase","from":"# Launchpad\n","to":"# Launchpad\n\nUpdated instance contract.\n"}
applied: move-evidence (2026-10-10, rename-root)
applied: release-default (2026-10-10, add-config-field)
applied: contract-heading (2026-10-10, change-phrase)
re-emit: node scripts/harness.mjs emit
local-terms list: present (619 texts checked)
ℹ {"runtime":"exported packages/skeleton/dist/src/resident-host.js","identity":"WO-900","logPreserved":true,"nextCadenceDueAt":10,"dispatched":1}
ℹ {"preparedMs":1543,"stagedExportAndReadMs":1869,"files":596,"bytes":9193048,"equal":true}
ℹ tests 9
ℹ suites 0
ℹ pass 9
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 34037.745125
```

## Final-subject gate

After the review correction added `array-commit` and `array-hash` to the
unchanged-destination refusal matrix, `npm test -- --review` executed the
complete launchpad suite again. Its passing row was recorded at
2026-10-10T04:53:33.024Z for code identity
`43d2cf9cabeb65c9b603ec693c34114d2987c6a968d958e103cd7d73a2377e09`:
launchpad exit 0, duration 94,275 ms; the update parent test exit 0,
duration 43,612.177875 ms. Configuration-root also passed in 5,737 ms.
The complete review had 29 suites passed, 0 failed and 81 fresh tasks,
with unchanged code and build outputs. Passing task stdout is not retained
in that row; the earlier bounded transcript above remains the displayed
action and resident observation. [handoff.md](handoff.md) identifies both
required passing gates.
