# WO-022 implementation evidence — 2026-09-06

This source prepares application `v0.11.0` above published `v0.10.1`
(`2851225`), with compiler `0.4.0`, skeleton `0.10.0`, and unchanged kernel
`0.2.1`. This is executor evidence; independent verification and final review
remain separate lifecycle dispatches. Actor: Codex CLI `0.153.4`, GPT-6 Astra,
`max`, using the standing operator-attested selection rather than effective
session readback.

## Acceptance evidence

| Criteria      | Executable evidence                                                                                                                                                                                                                   | Observed result                                                                                                                                                                                                                                                                                                                                     |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1             | [Compiler fixtures](../../../packages/compiler/test/senses.test.ts)                                                                                                                                                                   | Missing individual mount returns SUPPORT INACTIVE with `beacons.individual.metadata` and a provide-capability correction; three active supports preserve the envelope and declare one context line each                                                                                                                                             |
| 2–3           | [Affordance/permission fixtures](../../../packages/skeleton/test/senses.test.ts)                                                                                                                                                      | No sense/mount/grant, explicit denial, expiry, exhausted resource, missing evidence and invalid profiles/selections refuse; zero reads and one envelope-naming refusal event; equipped authorized Sight yields exactly one action                                                                                                                   |
| 4, 6–7        | [Mounted perception fixtures](../../../packages/skeleton/test/senses.test.ts)                                                                                                                                                         | A real 0111 directory refuses listing and permits known-name stat; a mode-000 file with garbage content and a synthetic xattr still decodes; no content, unrelated names, xattrs, private path, session capability or key in the log; coarse/all channels render one/three lines                                                                    |
| 5             | [Walking-skeleton verifier fixture](../../../packages/skeleton/test/senses.test.ts)                                                                                                                                                   | VerificationCompleted is accepted; the host log contains implementer narrative/evidence prose, while the actual verifier capsule contains only candidate paths, independent inventory fields and authorized Beacon metadata                                                                                                                         |
| 6, 8          | [Key/epoch fixtures](../../../packages/skeleton/test/senses-v3.test.ts) and [control-log re-derivation](../../../packages/skeleton/test/senses.test.ts)                                                                               | A written forged host-provenance codeword fails the current keyed check; independent HMAC preimage agrees; canonical control JSONL re-derives identical v3 state/size/mtime under the same key; rotated and never-observed epochs are unverifiable; epoch 255 refuses without changing the key or Beacon                                            |
| 9             | [Arithmetic/storage fixtures](../../../packages/skeleton/test/senses-v3.test.ts) and [normative proof](../../product/02-domain-model.md#beacon-codebook-v3--weak-keyed-provenance)                                                    | Entire 4,831,838,208-tuple product is algebraically injective; 589,824 representative residue round trips plus inherited-field/boundary cases pass; maximum logical size stays within eight allocated blocks through temp/mtime/rename, with zero holes and no dense large buffer; unsupported-host emission creates no destination or staging file |
| Compatibility | [Legacy and current sweep fixtures](../../../packages/skeleton/test/control-beacon.test.ts), [CLI](../../../packages/skeleton/test/control-beacon-cli.test.ts), and [Senses fixtures](../../../packages/skeleton/test/senses.test.ts) | All 104 v1 and 288 v2 meanings remain; current sensing labels them unauthenticated; old tag-3 observations retain their unknown meaning on replay; new live input cannot select the historical bypass                                                                                                                                               |

The [focused test transcript](focused-tests.txt) records nine passing tests
and the bounded runtime measurements. The 29 artifact-identity and scenario
regression checks also pass. The full `npm test` passes: 245 package tests and
8 corpus tests, with zero failures, cancellations or skips. The gate also
passes formatting, the real-Git workflow and temporary-directory fixtures,
publication coverage (229/229 headings; both source locks current), the
generated work-order index, a clean forced TypeScript rebuild and all four
current artifact-evidence checks. The semantic hashes and frozen oracle remain
unchanged. `git diff --check` is clean; no dependency was added.

## Fresh host observation

[Host probe JSON](host-probe.json) was reproduced with
`python3 scripts/probe-beacon.py` on this checkout's volume, inside the Codex
sandbox. Node `v22.2.0`, npm `10.8.0`, Python `3.11.7`, macOS `15.6`, and Codex
CLI `0.153.4` are observed versions. Filesystem identity is
**observed-not-exposed**: `diskutil` exited 1, so the old APFS label is not
inherited. The actual sparse and exact-size behavior is observed directly.

| Datum                 | Fresh result                                                                                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Small sparse premise  | 65,536 logical bytes, zero data blocks                                                                                                                             |
| V3 finite fields      | `8 × 3 × 6 × 2 × 256 × 65536`; all arithmetic uses bigint                                                                                                          |
| Maximum v3 code       | 19,327,352,831                                                                                                                                                     |
| Maximum logical bytes | 1,236,950,589,434; exactly representable below Node's 9,007,199,254,740,991 safe-integer limit                                                                     |
| Maximum allocation    | Eight 512-byte blocks = 4,096 bytes, including the JSON prefix; logical zero tail retained after rename                                                            |
| Timestamp lowering    | Requested microseconds survive native rename; Node's known one-microsecond truncation is corrected and exact milliseconds checked before publication               |
| Permissions           | Mode 000 denies content while stat succeeds; directory 0111 denies listing while a known child remains stat-able                                                   |
| Other metadata        | 255-byte names accepted, 256 refused; case-insensitive lookup observed; 1,023-byte symlink accepted, 1,024 refused; 64-KiB xattr readable and its name/size listed |

The v3 limit is a reproduced codebook ceiling, not the filesystem's maximum.
The production probe and writer fail closed if sparse support, numeric
conversion, device identity, allocation or exact mtime cannot meet the declared
contract. No large dense allocation, alternate channel, or stronger isolation
claim is substituted. Test keys are generated dynamically in private temporary
host files outside all repositories and removed afterward. No key bytes are
embedded in source, retained fixtures, prompts or logs.

## Implementation choices and write-backs

The kernel remains unchanged: Observe uses WO-021's existing
`observe.beacons.<audience>` Act lowering and `beaconSweeps` resource. The
compiler adds ordinary support definitions without changing graph architecture.
The host derives capabilities from `beacon-perception-v1`, a specialization of
WO-009's input-profile boundary. Same-user hostile processes remain outside
that boundary. Separate OS-user isolation remains the preserved stronger local
option. The mounted verifier is deterministic; native model verification is
still WO-010.

V3's 16-bit residue is a weak keyed consistency/error check, not authorship or
enumeration resistance. Key epoch is non-secret; only the current external key
file is retained. Long-lived hosts reopen handles after rotation. Without a
configured host key, lifecycle emission stays v2; a configured key selects v3
and failures never silently fall back. Physical mount/session paths and key
material remain outside the audit projection.
The epoch and authenticator are carried only by the size codeword; the JSON
prefix retains the v2 control fields with version 3. A bounded prefix read
asserts that exact content contract. Replay also rejects non-numeric metadata,
inconsistent fine timestamps and extra observation fields.

Product 02/03/04/06/07/09/10/13, the root/package entry points, planning map,
work-order release header and append-only ledger carry these current facts.
The existing artifact-identity evidence generator now records its current
compiler-0.4.0 edition in [artifact-identity/](artifact-identity/), retaining
WO-029's historical files and frozen semantic-hash oracle. That generator and
the lifecycle Beacon/teardown helpers are instruments changed by this order;
their independent source/real-Git fixtures remain part of the full gate.
The historical identity fixtures retain their recorded bytes; the comparison
checks the current package version while pinning every other identity field.
The reactor import check admits the pure sense projection/profile and continues
to require every kernel decider to live in the single reactor.
The only teardown addition restores access to generated search-only cache
directories after the existing close/material/merge gates; a failed removal
restores the original permissions.

Migration note (2026-09-06, WO-010): since compiler `0.5.0` the evidence helper
writes and checks the current edition under
[`docs/evidence/WO-010/artifact-identity/`](../WO-010/artifact-identity/audit.json)
instead of this directory. These four files are retained historical bytes that
the helper no longer regenerates or byte-checks; `docs/evidence/WO-029/baseline.json`
remains the pinned source of the frozen oracle and every semantic hash.

No scope expansion, new dependency, kernel change, branch commit or publication is
part of this executor pass. The omitted activation version was completed under
the repository's standing release rule. Open limitations are explicit above;
there is no request to weaken the work order's sparse, clean-room, authority or
independence requirements.
