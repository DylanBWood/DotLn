# WO-078 executor self-review

Observed 2026-10-11. Two fresh read-only `dotln-worker` agents received only
the work order and the implementation diff bundle, formatted, as it stood
after the fixtures first passed. Both were launched as the generated
`dotln-worker` type (`claude-opus-5-5`, `xhigh`) with no per-call override;
the adversary reported the host system prompt's model as `claude-opus-5-5`
and no effort readback, the improver reported neither. Neither edited a file,
ran a gate or launched a descendant. Session fan-out: 2 of the configured
20-agent cap.

## Criteria adversary report

Reported count: 11 findings (P1: 0, P2: 6, P3: 5). The worker also noted
that the working tree had moved past the bundle while it read, and judged the
bundle.

| # | Finding | Disposition |
| --- | --- | --- |
| 1 | P2: the kit version is re-derived from today's tags, so a tag added later stales the check and disagrees with the sibling's own manifest tag | Fixed: the page records the tag observation it was rendered against; the check judges against it and prints a later tag as newer evidence; D002 records the departure from "the kit manifests" |
| 2 | P2: a receipt is skipped when the destination's directory name differs from the declared id (worktree suffixes, case) | Fixed: the update reads the destination's origin repository name, the match is case-insensitive, and the fixture updates through a `Starter-Fixture-wo001` copy |
| 3 | P2: a receipt failure is raised after every destination write, with only the error printed | Fixed in its cause: the declaration is resolved before the build and before any write; a failure after the manifest names the complete command and the receipt already written. Recorded, not fixed: the summary lines are not printed in that case (D004) |
| 4 | P2: the summary claims "none closed" when a compared commit is missing | Fixed: the summary distinguishes nothing compared, orders found with a gap, a gap alone, and none closed; a fixture covers two unknown commits and a known pair with an unknown third |
| 5 | P2: the third boarded defect was only partly closed (a retry at a later commit; the second of two renames) | Fixed: the planned manifest is journaled beside the current one, kept bytes include the journaled plan, a dropped path a later kit carries again is added, and a rename that landed without its configuration write is adopted; two fixtures cover both states |
| 6 | P2: each export needs a hand-run generation before the preflight passes | Fixed: the export and update regenerate the page through the generator's write path right after the receipt and print whether it changed |
| 7 | P3: the page is not registered as a generated projection for integration | Fixed: `.gitattributes` marks it with its suite, and `worktree integrate` lists it as a pure projection and regenerates it when a declaration exists |
| 8 | P3: the check's diagnostic pattern can cross into the next entry | Fixed: the check splits both texts by entry heading and compares the manifest-hash line structurally |
| 9 | P3: sibling ids are unique only case-sensitively | Fixed: ids are compared without case, with a fixture |
| 10 | P3: an absent kit file the incoming kit still carries refuses only after the build | Recorded (D004) |
| 11 | P3: the generator fixture copied a live control segment | Fixed: a synthetic closed-order segment is built in the fixture |

## Design improver report

Reported count: 16 findings (High: 1, Medium: 5, Low: 10).

| # | Finding | Disposition |
| --- | --- | --- |
| 1 | High: the "orders in core that advanced it" summary misreports when a commit is unknown | Fixed (as adversary 4) |
| 2 | Medium: the manifest-hash check pattern is unbounded and rebuilds the line's format | Fixed (as adversary 8) |
| 3 | Medium: the declaration is read and the snapshot checked after the manifest is written | Fixed (as adversary 3) |
| 4 | Medium: `describeTag` duplicated between the export and the generator | Fixed: one `describeTag` in `scripts/lib/git.mjs`, used by both; `readControl` replaces the batch call |
| 5 | Medium: a tag created after generation stales the preflight row | Fixed (as adversary 1) |
| 6 | Medium: the generator fixture relies on shared mutable state and subtest order | Fixed: a baseline reset at the start of each case; cleanups in `finally` |
| 7 | Low: `planUpdate`'s nested ternaries and a stale comment | Fixed: the flat form, with the journal added to it |
| 8 | Low: the library re-implements `parseJson`, `exact`, `validDigest` and the configuration loader's validators | Fixed for the three helpers; the loader's private validators stay small local copies (D004) |
| 9 | Low: the receipt file name was never checked against its date and the list was re-sorted | Fixed: a misnamed receipt refuses by path, and the directory listing is the order |
| 10 | Low: a failed write leaves the temporary; the first-differing-line computation is duplicated | Fixed for the temporary; the duplicated computation is recorded (D004) |
| 11 | Low: the receipt comment overstates, a collision surfaces raw, the write is not atomic | Fixed: written beside its name and linked into place, refusals in the module's style |
| 12 | Low: wording of the upstream relation, the not-evidenced forms, the column header and a decoder message | Fixed |
| 13 | Low: the decisions do not name the departure from "the kit manifests" | Fixed (D002) |
| 14 | Low: decision ids started at D002, a case count, an em dash and a map line that would go stale | Fixed |
| 15 | Low: unused exports and an unused parameter | Fixed |
| 16 | Low: a null dereference in the fixture and shared state left behind | Fixed: the snapshot assertion; the state left behind is described in a comment |

## Executor disposition

self-review: found 27; fixed 24; recorded 3. The recorded three are in D004
with their reopening conditions. Every fix was re-run through
`scripts/test-siblings.mjs` and the `WO-078 criterion 1|export update`
selection of `scripts/test-launchpad.mjs` under the bounded runner before the
gates; the transcripts are in [fixtures.md](fixtures.md).
