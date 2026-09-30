## Release overview

DotLn v0.56.4 records whether a package-level browser runtime works on this host without the harness's connected browser server. Exactly pinned Playwright `1.63.0` with Chromium headless shell `153.0.8010.12` installed from a scratch lockfile. It launched headless under the verification host's discovery sandbox, rendered one static fixture to equal screenshot hashes twice and left no recorded browser process after its parent was killed. It also ran from a launchd-origin process with a cleared environment. ADR-0002 names the future consumer of that pin, and the legal record names the inventory duty it triggers. No dependency is added.

## Read before upgrading

Nothing to migrate. No workspace manifest, lockfile, runtime source, event schema, `NOTICE`, license hash declaration or registered evidence source changes. The browser runtime stays out of the workspace until WO-059 adds its `packages/browser-evidence` package. The filtering-proxy install row is `unavailable`, because the host configures no proxy. A session behind a filtering proxy therefore has no observed install path yet.

## Substantive changes

Browser runtime record: `docs/discovery/browser-runtime-2026-09-30.md` and its JSON packet carry nine labeled rows with command shapes. The rows are the lockfile pin, online package and browser installs, the unavailable proxy row, a boundary control, a confined headless launch, the two-run screenshot hash with the fixture's exact bytes, the parent-SIGKILL process-table observation and the launch without the connected server. The record includes the confined probe script and a rerun recipe.

Dependency decision: ADR-0002 §Amendments names WO-059's planned `packages/browser-evidence` workspace package as the consumer of exact `playwright` `1.63.0`, outside the pure kernel and compiler. LEGAL §Current state records the observed package, browser and FFmpeg identities. It leaves the pinned inventory to WO-059 and the `THIRD_PARTY_NOTICES` file to the first built or bundled distribution.

## Progressive polish

The environment record gains a WO-057 addendum. Final review clarified that the record's four removed variable names are a filtered projection and that the row's requirement is clearing the whole inherited environment. The work-order heading and README version line name `v0.56.4`.

## Evidence and compatibility

Prepared source tag: `v0.56.4`; reviewed base: `1674ea5e9dfc8f8dfe85db1ed76d46d8af30689e`. The [release manifest contract](../../releases/README.md) binds the merged source commit and reviewed gate when the operator later authorizes release close. Components are unchanged: beacons 0.1.0, compiler 0.20.0, console 0.4.0, kernel 0.6.0 and skeleton 0.45.2. The supported Node engine remains >=26.0.0 and <27.

[FINAL-001](FINAL-001.md) records the final product and document gates, and [VER-001](../../verifications/WO-057/VER-001.md) passed all six criteria from an independent reinstall. Known limits are in the [decisions](../../evidence/WO-057/decisions.md): one host, one pin, one static fixture, one SIGKILL trial and one standalone launch per observer, and no comparison with Playwright MCP.
