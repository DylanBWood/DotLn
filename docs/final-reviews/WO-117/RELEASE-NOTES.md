## Release overview

DotLn v0.56.0 gives operators a combined text console for supervising a resident: live actor and order status, readable command results and audit access from one terminal.

## Read before upgrading

Update strict `runtime-status-v1` consumers with the resident. The new optional `workOrders.reason` appears on unavailable views; the updated decoder accepts old views, while older strict decoders reject the added field. The version label remains `runtime-status-v1`. No event-log migration is introduced. Command identifiers, admission authority and local token transport retain their existing contracts.

A FIFO at `dotln.config.json` can still block startup. FIFO protection covers the selected index and private source binding. The passive live screen does not detect a stopped resident; explicit commands test reachability. Refresh work reads the whole event log and grows with history, and recovery can repeat an old script notice. These known limitations and diagnostic/terminal-test work remain [open follow-ups](../../evidence/WO-117/decisions.md#wo-117-d012).

## Substantive changes

`console live --store STORE` combines resident status and open orders with a compact audit preview and full audit on demand. A stable interactive screen suppresses clock-only repaint, defers redraw while typing and keeps inspection results in scrollback until Enter resumes observation. Plain controls invoke the existing contract with unchanged result bytes and the usual console receipts. Resident logs produce no L0/L1 audit entries; recent events and full audit L4 carry script results.

The resident degrades to orders unavailable with a coded cause for missing launchpads, malformed regular-file configuration and missing, unreadable, nonregular or malformed index data. Helpers keep the same failure binding, and a valid restart restores the selected source. Nonblocking descriptor reads cover the index and binding; only the lifetime owner removes stale status temporary files.

## Progressive polish

Console controls and two-terminal walkthrough directions are clearer. Displayed audit fields neutralize line and control characters. Documentation, capability assessment and publication locks reflect the implemented behavior and its limits; corrected build attribution retains the original decisions and independent report. Generated harness pins and four selected evidence editions follow the source change, preserving earlier editions.

## Evidence and compatibility

Prepared source tag: `v0.56.0`; reviewed base: `3a68c517668555ae201feb8f1d51ee86c9e9ada0`; reviewed code identity: `6b7f545b9cece0be95128dcca0b1fced128cc3258f5267d12d0ccb579654b0de`. The [release manifest contract](../../releases/README.md) binds the merged source commit and reviewed gate when the operator later authorizes release close. Console is 0.4.0, skeleton 0.45.1; compiler 0.20.0, kernel 0.6.0 and beacons 0.1.0 are retained. The supported Node engine remains >=26.0.0 and <27; no external dependency is added.

[FINAL-001](FINAL-001.md) records the gate result and current document checks; [VER-001](../../verifications/WO-117/VER-001.md) passed all five criteria, and [fixtures](../../evidence/WO-117/fixtures.txt) record 22 passing focused tests. The [witness correction](../../evidence/WO-117/witness.md#final-review-correction--2026-09-29) distinguishes the operator's earlier-build run from final-build automated evidence. The independent final-build terminal probe covered macOS at 24x80; the executor's supplemental CJK/resize record has no exact code identity or timestamp, and committed terminal-mode regressions remain follow-up work.
