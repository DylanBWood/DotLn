# WO-020 Beacon observables — 2026-09-04

Fresh, bounded observation inside the Codex sandbox, using synthetic temporary
files on the checkout's volume. No finding is inherited from the 2026-09-02
planning probes. Machine transcript:
[beacon-probe-2026-09-04.json](beacon-probe-2026-09-04.json). Reproduce with
`python3 scripts/probe-beacon.py`; it removes its own temporary directory.
Versions observed here: macOS 15.6, Python 3.11.7, Node v22.2.0, npm 10.8.0,
Codex CLI 0.153.2. These are host observations, not model-setting readback.

| Observable             | Principle 15 label and finding                                                                                                                                      | Atomicity evidence                                                                                                                     | Readability inside this sandbox                                                                                                           |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Filesystem identity    | **observed-not-exposed**: `diskutil info -plist` exited 1. This probe establishes behavior on the checkout volume, not its filesystem type.                         | Not established by the identity query.                                                                                                 | The query supplied no filesystem identity; planning's APFS label is not imported as current truth.                                        |
| `st_size`              | **observed**: 23-byte synthetic content stays size 23 through rename; v1 files range within 51,064 bytes.                                                           | Actual adapter replacement is tested with a concurrent metadata observer, described below.                                             | `stat`/`lstat` works without opening content, including mode 000. Logical byte size is distinct from allocated blocks.                    |
| mtime through `utimes` | **observed**: requested 1,234,567,000 ns is retained before and after rename, preserving the tested microsecond precision.                                          | Time is set and checked on the staged file before its rename into the visible directory.                                               | Metadata access exposes recency even when content is unreadable. Node conversion limits are recorded below.                               |
| `rename`               | **observed**: exact size and mtime survive rename. The adapter's concurrent test observes only complete old/new codewords and stable names during 128 replacements. | Per-file publication by sibling temp file plus rename; no multi-file snapshot, power-loss durability, or `fsync` guarantee is claimed. | Directory enumeration never includes staging names because they are outside the observed directory.                                       |
| Sparse `truncate`      | **observed**: a 65,536-byte logical file has zero allocated blocks.                                                                                                 | Sparse concurrent replacement was not tested; v1 never uses sparse tails.                                                              | Metadata reports logical size independently of allocation. Reserved for later codebooks/composites.                                       |
| File permissions       | **observed**: mode 000 produces `EACCES` for a content read, while metadata still reports 23 bytes.                                                                 | Permission changes themselves are not a transactional disclosure boundary.                                                             | Content denial does not hide codebook state or timestamps.                                                                                |
| Directory permissions  | **observed**: mode 0111 refuses enumeration with `EACCES`; a known child path still permits a metadata lookup.                                                      | Directory access changes are not synchronized with a sweep.                                                                            | A known address can remain observable without listing permission.                                                                         |
| Names                  | **observed**: 255 ASCII bytes accepted; 256 returns `ENAMETOOLONG`; mixed case resolves case-insensitively in this sample.                                          | Stable names publish through rename; rename-to-a-new-state-name is deliberately not selected.                                          | Names are exposed to an authorized listing. Unicode normalization and other volumes were not measured.                                    |
| Symlink targets        | **observed**: 1,023-byte target accepted and readable through `readlink`; 1,024 returns `ENAMETOOLONG`.                                                             | Link replacement concurrency was not tested. A staged-link rename is only an **inferred** possible lowering.                           | Reading a target string needs `readlink`, not the v1 metadata sweep. The v1 reader uses non-following `lstat` and labels links malformed. |
| xattr                  | **observed**: installed `xattr` writes and reads 65,536 bytes; `ls -l@` exposes the attribute name and length.                                                      | Concurrent attribute replacement was not tested.                                                                                       | Retrieving the value needs a distinct attribute read; plain `stat` does not decode it.                                                    |

**Node timestamp conversion:** the filesystem retains the tested microseconds,
but Node's floating-point seconds input can truncate an intended integer
millisecond one microsecond early. At 1,200,001 ms, direct `utimes` produced
1,200,000,999,000 ns. Centering the target microsecond bin with a half-microsecond
input offset produced exactly 1,200,001,000,000 ns. The same correction succeeded
at 1,200,002 and 1,200,003 ms. The adapter tries the direct input first, then this
bounded conversion correction only if necessary, and compares `mtimeNs` with
the exact integer target before rename. Unsupported timestamps refuse; they are
never silently rounded in a published beacon. Negative/fractional milliseconds
and dates outside the supported JavaScript Date range refuse before writing.

**Why size for v1:** it supplies an exact, finite, cheap metadata channel that
the observed host can publish with the receipt and mtime as one file replacement.
Dense newline padding keeps logical size and complete readable content together
below 64 KiB. Names carry only a stable hashed producer/scope address; using
status in names would disclose it outside the declared codeword and create
rename/removal coordination. Symlink targets need another read and a different
content arrangement; xattrs need a separate API. Their observations remain
available for later design rather than becoming untested v1 mechanisms.

**Executable adapter evidence:** `beacon-fs.test.ts` compares live/replay files
with both byte equality and `cmp`, then checks `st_size` and nanosecond mtime.
Its observer worker is synchronized with each of 128 replacements, requires
both valid states to have been observed, and rejects off-lattice sizes or any
extra/partial address. A separate test makes an actual file unreadable, then
replaces its JSON with garbage at unchanged size; both sweeps still decode.
The gate also observes a fake executor's premature `verification/passed` claim
on disk before either result or verification completion, with the existing
host bytes and mtime unchanged. These tests establish this bounded adapter,
not real-worker liveness, provenance authentication, staleness policy, or
operator usefulness.
