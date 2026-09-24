# WO-050 fixed identity inputs

Captured once from pre-refactor source at
`7fd94aeb2a35c88dc4cf3a618e3138ca02d0b2c3` with
`node scripts/reactor-identity.mjs --capture /private/tmp/dotln-wo050-identity`.
Worker logs use the existing synthetic CLI subprocess fixture, never an
authenticated model. Temporary repositories, command identities and paths are
synthetic. Recovery fixtures retain interrupted/quarantined prefixes and final
recovery. The verification fixture uses the existing deterministic fake.

Checks replay these exact bytes; they do not regenerate inputs. The adjacent
`wo050-identity.json` manifest also names immutable historical/current evidence
and pins complete canonical Decision/projection outputs. Its four historical
refusal cases were already failures before the refactor. The executor receipt
and cmp transcript distinguish those from the successful fixtures.

Since WO-133's compiler patch, `--check` executes the current reactor in an
isolated child with the recorded compiler identity `0.11.1`. The test-only
loader substitutes that single constant in that single module; all other
runtime code and all input/output hashes stay unchanged. This checks the
refactor's byte identity without claiming production compatibility with old
compiled artifacts. Current-version behavior uses fresh compilation and the
selected evidence editions in the ordinary scenario and ownership tests.

Since WO-154 (D014), the compiler accepts a program or capsule recorded under
an earlier compiler release when everything else is its current lowering. The
four historical refusal cases now replay. `../wo154-identity.json` succeeds
this manifest and names it by hash. It also gives the reason for each row it
changes or removes, and this manifest keeps its bytes. The WO-011 self-host
verifier left the byte oracle, because its full replay's 1,600 prefix
projections cost about 100 s. `packages/skeleton/test/verification.test.ts`
asserts that it replays to complete.
