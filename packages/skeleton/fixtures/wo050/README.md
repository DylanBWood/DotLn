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
