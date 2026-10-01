## Release overview

DotLn can now produce browser evidence instead of narrating it. A new private package, `@dotln/browser-evidence`, runs a saved scenario in a pinned headless Chromium over a checked-in synthetic application. It returns a screenshot, a DOM snapshot, an accessibility snapshot, network traces and a console capture, each bound to the criteria the scenario covers. These are the witness kinds that v0.58.0's visual and network claim rules require before a pass is admitted. A caller records them as subject evidence before verification opens, and the kernel, the compiler and the verification host stay unchanged. This release is for operators and verifiers preparing subjects whose criteria are visual or network claims, and for the later orders that consume browser evidence.

## Read before upgrading

- **New runtime dependency.** `playwright` `1.63.0` is pinned exactly in the new package, with `playwright-core` `1.63.0` as its only registry dependency. It is the repository's second pinned runtime dependency, after the skeleton's `typescript`. `npm ci` installs it. `docs/LEGAL.md` §Current state records the inventory. `NOTICE` and the pinned legal hashes are unchanged, and no browser or bundled artifact is distributed.
- **Install the browser in each worktree.** Each fresh worktree must install the pinned headless shell before its first `npm test`; until it does, the `browser-evidence` suite fails by design. From the repository root, run `PLAYWRIGHT_BROWSERS_PATH="$PWD/.runtime/playwright" npx playwright install chromium --only-shell`. The install costs a download, disk space and time. The reopening condition for this setup cost is recorded in WO-059's decision D023.
- **Confinement.** The suite runs outside host confinement, as the other suites marked that way do. A confined session either refuses the run before any suite starts or runs the rest as a partial result, which is never product-gate evidence.
- **Recovery sends real signals.** `recoverFrom` sends SIGKILL to recorded browser processes that outlived a killed host. It refuses while the recorded owner is alive and refuses a record without a browser root observed as the owner's child. It signals only processes whose pid, start time and command still match the record, and it trusts the record file it is given.
- **No migration needed.** No capsule field, control event or compiler schema changes. The evidence editions were re-minted for the new lockfile, and the console's self-host case was re-pinned.

## Substantive changes

**Scenario runner.** `runScenario(scenario, env)` accepts a saved scenario file or object in a closed interpreter: navigate, fill, click, assert text, assert a response and wait for a bounded time. Unknown actions or fields are refused before any browser or file effect. The package serves its own form, fetch endpoint and console pages on a loopback server and aborts requests to any other origin. Each run gets a fresh browser and context, and closes them and its server before returning. The raw captures, the scenario, its replay fields, the process record and a Playwright trace stay in the run's new output directory.

**Witnesses and outcomes.** Every covered criterion receives all five witness kinds. A failed scenario assertion produces adverse evidence. A console error or a failed `console.assert` produces a failing console witness for every criterion, and the existing admission rules refuse a pass on it. The console witness is copied at capture, so a message during trace retention or shutdown cannot change the saved entries or their hash. A capture that exceeds the capsule's bounds makes the run unavailable, never a pass.

**Replay.** A saved scenario replays to the same DOM, accessibility text, console entries and normalized request and response hashes. Under the WO-057 browser pin and render settings, the PNG hash is equal as well. The package's replay-fields file names each field left out of the comparison, such as dynamic ports and timings, with its reason.

**Process ownership and recovery.** The adapter records its own identity and the browser's process tree. The tree is rooted at the browser process observed as the adapter's direct child, with start times read in UTC so the caller's timezone cannot change an identity. After a host kill, recovery from that record removes surviving recorded processes and leaves every other process alone. That includes a process that now holds the recorded browser pid.

**Unavailable browser.** If the pinned headless shell is missing, the run returns `unavailable` witnesses with a reason and an install command scoped to the cache in use. Timeouts, sandbox denials and other launch failures are also unavailable, without install advice and without raw host diagnostics.

## Progressive polish

The test runner gains a fast `browser-evidence` package suite, and the root TypeScript build references the new package. The README's "What runs today", the architecture document's verification-adapter port and the capability table each gain a short entry for the adapter. The package README documents the API, the replay fields, recovery and browser setup.

## Evidence and compatibility

Application `v0.59.0` is a minor release over `v0.58.2`, built from WO-059 on `main` at `2210dd87`. `@dotln/browser-evidence` starts at 0.1.0. `@dotln/skeleton` moves to 0.47.2 to add the package to its normalized evidence components, and `@dotln/console` stays at 0.4.0 with its exact skeleton pin updated. `@dotln/kernel` 0.6.0, `@dotln/compiler` 0.21.0 and `@dotln/beacons` 0.1.0 are unchanged. The authority, artifact-identity and verification editions are WO-059 revision 001. Feedback is WO-059 revision 002, recorded from one live self-host episode on Claude Code `claude-opus-5-5` at `xhigh` after integration with `v0.58.2`.

The verification sequence:
- [VER-001](../../verifications/WO-059/VER-001.md) failed: the printed install command used a different cache from the suite's.
- [VER-002](../../verifications/WO-059/VER-002.md) passed after that repair.
- [FINAL-001](FINAL-001.md) failed: a record with a browser pid but no recorded root could lead recovery to kill an unrelated process.
- [VER-003](../../verifications/WO-059/VER-003.md) passed after that repair. It reproduced the record shape and four variants, each refused or signalling nothing, with the bystander alive.
- [FINAL-002](FINAL-002.md) passed. It re-ran the record shape against a fresh build.

`npm test -- --review` passed at code identity `7f384f7b66cf718e238ac7c87a38028ee29d8924dcb77e1e18e29f4f5d4cba30`: 38 suites, 0 failed, 399.86 s. `npm run test:docs` passes.

Known limitations:
- The evidence covers the synthetic application on one macOS host under the WO-057 pin. Real targets, cross-platform screenshot stability and universal kill cleanup are unproved.
- On that host, Chromium exits with its host, so the signal path is shown with Node and `/bin/sleep` survivors.
- A browser process started in the last 250 ms before a host kill, if it also outlives its root, goes unrecorded.
- Process identity has one-second start-time resolution.

Details are in the [package README](../../../packages/browser-evidence/README.md) and the [decisions](../../evidence/WO-059/decisions.md).
