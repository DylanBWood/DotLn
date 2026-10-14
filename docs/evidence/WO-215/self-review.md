# WO-215 independent self-review

Two fresh Codex workers, each gpt-6.1-sol at max with no inherited conversation,
received only the work order and diff. Both were read-only and ran no tests.
The root executor retained the only writable role and reused those workers
for focused resolution checks after fixes.

| Worker | Findings, including resolution checks | Fixed | Remaining |
| --- | ---: | ---: | ---: |
| Adversary | 3 | 3 | 0 |
| Improver | 2 | 2 | 0 |

The workers independently reported the same post-commit journal failure gap,
so five worker findings represent four unique findings. All four are fixed;
none is deferred or left as a recorded defect.

1. Staging may transform verified bytes. Compare index blobs and modes for
   every allowed path, including a path whose filter restores the previous
   blob and removes it from Git's changed list. Hash the committed manifest.
2. The second fetch re-admitted checkout-local URL rewriting. Transfer the
   bound bare lane's objects with offline unbundle and update the tracking ref.
3. Cleanup failure after push lost the disposable resources' identities.
   Retain ignored ownership state and finish cleanup before current or skipped.
4. Commit success followed by a failed state write could strand that cleanup.
   Record the expected tree and parent before committing; recovery recognizes
   only the matching detached one-parent child.

The adversary's final disposition was resolved 3/3, remaining 0, new 0.
The improver's final disposition was fixed 2, remaining 0, new 0. These are
static judgments. The executor's focused fixture passed both tests at
2026-10-13T21:24:31Z; README and D008 record its executable evidence.

Explicit worker count: three (one reused research worker plus these two),
against the configured cap of twenty. No child worker was declared.

## Repair review

The `resume: fix` session launched one fresh Codex read-only worker at
gpt-6.1-sol/max with no inherited conversation, then reused it for an applied
repair review. The root remained the only writer; no child worker was launched.

The first pass confirmed the F2 cause, the two dry-run outcome branches and
the smallest F4 recovery remedy D011 authorizes. It recommended keeping the
physical, scratch, worktree and ref checks rather than adopting the replacement
checkout's cleanup objects. The applied pass found no concrete new implementation
bug and confirmed F1–F5 and both publishing-preview guards.

It recommended one coverage addition: a non-publishing preview after the
release already exists, because that is a separate branch in close. The root
added it before the preflights; the release suite passed, including the expanded
starter case. Repair review: implementation bugs found 0; coverage findings 1;
fixed 1; remaining 0. These are static worker judgments; the 19 executed
preflights are recorded in repair-checks.json.

The same worker was reused for the additional cleanup privacy and cancellation
review. Its design pass identified the clone-map parser as another source-byte
boundary. Its applied privacy pass found two further gaps: non-string retained
checkout values and the raw temporary-base path. Its applied cancellation pass
found a JSON readiness race and a child-reaping/forced-kill cleanup gap in the
regression driver. All five implementation findings are fixed, along
with the earlier coverage finding. Final counts for the repair passes:
implementation findings 5; coverage findings 1; fixed 6; remaining 0.
D014 and D015 name the fixes and focused executable checks. These worker
judgments remain static; the current gate results are recorded separately.
Explicit repair-session worker count remains one, with no declared descendant.
