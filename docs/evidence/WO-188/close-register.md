# WO-188 register write-back at close

The executor preserves the live allocations: every row below is `allocated`
to WO-188 at its recorded source revision, and this order writes no
disposition itself. The closing final reviewer rereads each source revision
and the current register revision, then applies one canonical
`npm run plan -- followups --apply` batch. These are prepared close
dispositions, not a claim that the order has passed independent review.

| Register row | Source | Disposition when closing | Evidence and reopening condition |
| --- | --- | --- | --- |
| FUP-a1e36af45f68e3ac | WO-176 D035 | Settle onto WO-188-D003. | The close removes a scratch repository and records its head commit and whether a remote held it; reopen if a close record names a removed repository whose commits no remote or retained ref held and the operator asks to recover it. |
| FUP-e7096aa6bde63c0e | WO-176 D033 | Settle onto WO-188-D003; the narrowed limit is FUP-fb2a080cc9b597d0. | D003 re-observes the lane boundary: intake and declared submodules stay, everything else nested is scratch. |
| FUP-00ed3cd9ab11599f | WO-178 D012 | Settle onto WO-195's record (landed at 2d50a415); WO-188-D004 records the re-observation. | Not reproduced at this order's base; the admission fixture still exercises the printed spellings. |
| FUP-03ccaaf4c2e6ad49 | WO-176 D034 | Settle onto WO-188-D005 (c, d, e) and WO-188-D003 (a, b, f gone). | Reopen if a published tag's outcome is unset in a record or a nested hook leaves a marker. |
| FUP-65efad56c927c1f9 | WO-176 D037 | Settle onto WO-188-D006 (a, d, e, f) and WO-188-D003 (b, c, g gone); the gate-hash limit is FUP-079f827e1b11eb1e. | Reopen if a close forces a removal over a submodule or a retry loses a completed Release. |
| FUP-50cda1c03ecd8ea8 | WO-171 D014 | Settle onto WO-188-D007. | Reopen if a prune leaves a partial file beside a verified proof. |
| FUP-d5a399224b1a5886 | WO-178 D013 | Settle onto WO-195's record (landed at 2d50a415); WO-188-D008 records the re-observation. | Reopen if a publish is admitted under a pending typed correction. |
| FUP-bfe39a18fdf822ae | WO-178 D014 | Settle onto WO-188-D009. | Reopen if a host task notification is counted as an intervention. |
| FUP-74e984d94ea97de5 | WO-172 D033 | Settle onto WO-188-D010. | The event is registered after the Copilot observation; reopen if a Claude Code release stops delivering it or a failed call is answered twice. |
| FUP-9cb0a7e667913624 | WO-172 D009 | Settle onto WO-188-D011. | Reopen if the persisted correction ids move to another record. |
| FUP-f927210831623001 | WO-178 D021 | Settle onto WO-188-D012. | Reopen on a key collision within one file. |
| FUP-b7a66e7a4fa7ad20 | WO-086 D024 | Settle onto WO-188-D016 (sub-items 1 to 4) and WO-188-D013 (5 and 7). | Reopen if a preparation writes through a link or a product 06 without its block passes. |
| FUP-af65972e5491da22 | WO-124 D015 | Settle onto WO-188-D014. | Forward-only screen; reopen if a later order baselines a new home-path line instead of fixing it. |
| FUP-71fc2efc208f597a | WO-085 D004 | Settle onto WO-188-D015. | Reopen if a typed quotation without a digest is admitted. |
| FUP-dc1335f4d10f6a75 | WO-174 D014 | Settle onto WO-188-D017. | Reopen if a console change that breaks its regenerator passes the integration suite. |
| FUP-e2cf2122a642d1e0 | WO-164 D013 | Settle onto WO-188-D018. | Reopen if release list crashes on a recorded manifest. |
| FUP-e55e258d37cb3f20 | WO-169 D014 | Settle onto WO-188-D019. | Reopen if an export lands on a reserved lane. |
| FUP-def7dd3b4f48a6fb | WO-107 D011 | Settle onto WO-188-D020. | Reopen if an untracked file with trailing whitespace passes completion. |
| FUP-a583091bec0d08b7 | WO-177 D006 | Settle onto WO-188-D021. | Reopen when the pinned worker model changes. |
| FUP-4a1d1fc3611506a1 | WO-157 D040 | Settle onto WO-188-D022. | Reopen if a binding with a foreign profile passes the check. |
| FUP-a6cf758ebdd11f1c | WO-173 D016 | Settle onto WO-188-D025. | Reopen if a comment failure is resolved by editing the baseline instead of the line. |
| FUP-fc4158d3207e495d | Candidate — Tinkerer / Scientist | Keep `allocated`; record revision 14, the product 05 trigger sentence this order wrote; WO-188-D001's planning follow-up FUP-7c909f0880237fba carries the next step. | Reopen when planning disposes FUP-7c909f0880237fba or the next ten closed orders record fewer than three two-arm comparisons. |
| FUP-19cd701c25446383 | WO-187 retarget (recurring review of implementation alternatives) | Settle the item-22 remainder onto WO-196's record and WO-188-D024; the review allocation WO-187 implemented stays as WO-187 recorded. | Reopen if review repeatedly fails to consider a credible simpler alternative. |
| FUP-7c909f0880237fba | WO-188 D001 | No close action; stays open for planning. | The Tinkerer support should modify the phase it is linked to. |
| FUP-fb2a080cc9b597d0 | WO-188 D003 | No close action; `deferred` to planning at its current revision. | A bare or unreadable nested repository with no other file is invisible to the inventory. |
| FUP-079f827e1b11eb1e | WO-188 D006 | No close action; `deferred` to planning at its current revision. | gateTreeHash refuses a committed submodule. |
| FUP-d4493f4251e69c87 | WO-188 D009 | No close action; `deferred` to planning at revision 1. | An enqueue row with the message text and no recorded command mode is attributed to the operator. |
| FUP-de0faf98b2487c8f | WO-188 D032 (verification) | Settle onto WO-188-D035. | The repair names the keep-alive timer race, closes every loopback connection after its response and records a fresh passing full document gate; reopen if the bound-resident case fails again in a full document gate or a response is seen without `connection: close`. |
| FUP-3c96f0fb5b283866 | WO-188 D036 (verification) | Settle onto WO-188-D038. | An empty destination is refused by the profile and written as its text by the rewriter, and the actual publication in the forge double writes none; reopen if a parser-rendered link, image or definition with an empty destination passes the profile or survives the rewriter. |
| FUP-c6b2a2b66fd0847c | WO-188 D037 (verification) | Settle onto WO-188-D039. | Code and raw HTML are masked at the parser's positions and the committed code example reaches the forge byte-for-byte; reopen if the rewriter changes a byte inside a range the parser renders as code or HTML. |
| FUP-98dd4b8af0b34182 | WO-188 D034 (reopened by D036 and D037) | Settle onto WO-188-D038 and WO-188-D039. | The reopened link rule is held again by the two repairs, which share the parser's reading of links and of code; reopen with either repair's condition. |
| FUP-a95dab688b9bdaaf | WO-188 D041 (verification) | Settle onto WO-188-D043. | The rewriter and the profile read the lines the parser counts under every Markdown line ending, and the carriage-return body reaches the forge double with its code byte-for-byte; reopen if the rewriter changes a byte inside a parser-rendered code or HTML range under any line ending or a body that passes the profile fails publication on a coordinate. |
| FUP-860e9c5b60e43758 | WO-188 D042 (verification) | Settle onto WO-188-D044; the percent-encoding remainder is D044's follow-up. | A link is rewritten only where the parser renders one and at the destination the parser renders; reopen if a rewritten path differs from the parser's url once encoded. |
| FUP-eb7648ea4530f48a | WO-188 D039 (reopened by D041) | Settle onto WO-188-D043. | The parser-position mask holds again now that its positions address the inventory's lines; reopen with D043's condition. |
| FUP-a859aa6cad8f9c6c | WO-188 D044 | No close action; `deferred` to planning at its current revision. | A destination already percent-encoded in the source is encoded again and addresses a different filename. |
| FUP-642d7a4beaed2272 | WO-188 D045 | No close action; `deferred` to planning at its current revision. | The runner's format-preflight fixture failed once under the full review gate with an empty nested-gate output and passed alone; no cause established. |

FUP-4feed3b6e7a451ef (settled at revision 3), FUP-a5c6ac8cb40bd52a (deferred
at revision 6) and FUP-bdfe7ebb85eb6e22 (settled at revision 2) were
re-recorded by the item 13 batch when their records were paraphrased; no
close action. The meter's reopen candidate WO-150-D003 (executor cold start
above 24,576 bytes) reads a ceiling that docs/control/budgets.json raised to
29,246 on the standing route; the measured 28,665 is within it and this order
adds no acceptance.
