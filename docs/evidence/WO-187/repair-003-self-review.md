# WO-187 repair self-review

One fresh read-only Codex worker received only the order and authored diff,
with `fork_turns: none`, model `gpt-6.1-sol` and effort `max`. It ran no probes,
made no writes and spawned no descendants. The same worker reviewed the final
repair diff twice. Its selections are known; effective model/effort readback
was unavailable. Its last response reported no remaining finding in its bounded
static recheck. The root executed every dynamic claim before choosing a route.

| Finding | Route and executable evidence |
| --- | --- |
| Root: endpoint-only inline-span handling still hid a wholly enclosed record | Fixed by comparing every physical-line projection. `repair-003-corpus-first.json` is red; `repair-003-corpus.json` marks it unmeasured. |
| Worker: unsupported parenthetical routes evaded completeness | Fixed; both pass and partly counted fail cases now advise. |
| Worker: large decimal finding IDs merged through numeric rounding | Fixed by string normalization; distinct large IDs count separately and leading-zero aliases still merge. |
| Worker: narrative code examples supplied another class | Fixed by the metadata/body boundary; the recheck's prose beginning with “class” additionally requires the field colon. |
| Worker: narrative route words overrode an explicit route | Fixed by explicit-route precedence, with legacy inference retained for records without a route. |

The four worker findings are reproduced in
`repair-003-adversary-all-before.json`; the remaining prose-prefix variant is
`repair-003-adversary-prefix-before.json`. All repaired results are in
`repair-003-adversary-after.json` and the persistent lifecycle fixture.
The final fixture passes in `repair-003-fixture.json`; the original
`08845c71` resume source still fails criterion 2's required known-issues
assertion in `repair-003-baseline.json`.

self-review: found 5; fixed 5; recorded 0

D035 and D037 record the choices and limits. VER-003's four original repair
findings are separate from these five self-review findings. D020, D033 and
D034 retain their previously boarded scope. No new follow-up is needed for
this self-review.
