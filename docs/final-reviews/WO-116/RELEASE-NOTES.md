## Release overview

A store's audit trail can now be read from the terminal and through the console as the same bytes. `dotln audit --store DIRECTORY` prints the audit fold's three projections for a store's retained log: the L0 receipt, the L1 causal timeline and the L4 governed raw JSON, each with its fidelity label and the causal links the fold recognizes. `--workstream ID` or `--episode ID` selects one scope. The console contract gains `dotln.audit`, which returns the terminal's stdout, stderr and exit code unchanged, so a UI built on the console can show what the runtime did without its own reader of the log. The release is for anyone who inspects a DotLn store or builds on the console's parity surface.

## Read before upgrading

`dotln.audit` serves every retained event envelope in governed raw, exactly as the terminal prints it, to the local user the loopback already admits; it adds no redaction and no access rule, because product 09 has not defined the projections' access and retention rules yet. The terminal permission classifier judges the command `shell.run`, as it judges every `dotln` entrypoint, so a resident whose compiled envelope refuses `shell.run` refuses it too. Known limit: over a resident host's own store the command runs, but the fold recognizes none of the event types a resident appends, so the L0 receipt and L1 timeline are empty and only governed raw shows what the resident did; the fold's omission labels still say "fixture" over any store. Both are recorded for planning, not changed here.

## Substantive changes

`dotln audit` reads the store's `events.jsonl`, keeps the envelopes of the selected workstream or episode, and passes them to the unchanged audit fold, so each selection is labeled as the fold labels one projection run (`ep:`, `ws:` or `log:mixed`). A store with no events, an absent or empty log or a missing directory refuses as `audit: store DIRECTORY holds no events`, and a selection the log lacks as `audit: episode ID is not in store DIRECTORY` or the workstream form; nothing is written. The fold's own refusals, such as an event missing a class-required reference, now print in the fold's words. Over the fixture scenario's log the command's output equals the skeleton's `--audit` section byte for byte. `console invoke --store BOUND-STORE dotln.audit --store STORE` prints those bytes through the text host.

## Progressive polish

The `dotln` usage line and unknown-command message now also list `handoff answer`, which had its own usage but was missing from both. Product 09, product 04's console parity contract and the console README name the command. The roadmap, README release line and work-order index record the release.

## Evidence and compatibility

Application `v0.54.0` is a minor release over `v0.53.2`. Skeleton `0.44.4` to `0.45.0` is a minor bump for the new command and the exported contract identifier; the console's pin and the lockfile follow, and the console stays `0.3.1`. The audit fold is unchanged and no evidence edition is re-minted; no dependency is added. VER-001 passed all five criteria. The final review's `npm test -- --review` passed 29 suites, 0 failed, in 322.76 s at code identity `89720b83…`. Evidence: [decisions](../../evidence/WO-116/decisions.md), [evidence README](../../evidence/WO-116/README.md), [fixture transcripts](../../evidence/WO-116/fixtures.txt), [VER-001](../../verifications/WO-116/VER-001.md) and [FINAL-001](FINAL-001.md).
