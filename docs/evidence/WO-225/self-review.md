# WO-225 independent self-review

Two fresh `codex-spawn-agent` workers, each `gpt-6.1-sol` at `max`, received
only the work order and an immutable current diff. They were read-only;
neither ran gates, changed files or spawned a descendant. Root-session
explicit count: 2 admissions, against subagentCap 20. No extra worker was
needed after the review.

## Criteria adversary

Finding count: 0 confirmed implementation defects; 1 pending evidence item.
The worker traced criteria 1–5 to the collector, kit, loopback, snapshot,
client, documentation and their fixture cases. It confirmed no dependency
addition and unchanged schema labels. Its pre-gate snapshot could not yet
establish the final meta/review/document rows, diff check or re-mint record.
Those obligations remain with the executor and are judged in handoff.md.

The worker also raised a scope-dependent question: `commandRoot` can name a
separate document-only launchpad, whereas ordinary command executables come
from the resident's installation. This order's board child runs the console
in the carrying instance, as step 7 specifies. The current board CLI itself
collects its installed kit root. Redirecting it to another kit would silently
project that other kit, so the snapshot keeps the explicit carrying-root
contract and returns 503 when its CLI is unavailable. Separate document-only
launchpads are not a confirmed criterion defect in this instance-kit order.

## Design improver

Finding count: 1 (P2), fixed: 1, recorded unfixed: 0.

The new configured-control adapter checked only leaf files/directories.
A parent symlink could therefore escape the launchpad and supply an external
control segment. The canonical `readControl` checks physical containment
with `realpathSync` through `containedRegularFile`.

The adapter now verifies physical containment before reading configuration,
control directories and every segment. A non-contained source yields the
coded `not readable` category. The new fixture places a segment outside the
launchpad behind a parent symlink: the canonical reader throws, the board
collector refuses the source, and neither the external path nor its order
enters the board. The bounded compiled test passed on 2026-10-23T02:08:22Z
(1 test, 0 failures). This was an in-scope correction to the newly added
configured-root reader.

self-review: found 1; fixed 1; recorded 0
