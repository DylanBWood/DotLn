# WO-189 independent worker reviews

Two fresh `dotln-worker` agents (the generated Claude agent type, pinned to
`claude-opus-5-5` at `xhigh`) each received only the work order and the
complete diff snapshot of 2026-10-10T03:03Z. Each reported the host's model
readback as claude-opus-5-5 and no effort readback; the pin is a launch
selection, not effective-effort evidence. Neither ran tests (each ran one
`wc -l` on the patch), wrote files, dispatched a lifecycle action or spawned
descendants. Their reports arrived at 03:10Z and 03:12Z.

## Acceptance-criteria adversary

Found 8 (F1 to F8), one more not counted (F9).

| Finding | What it said | Disposition |
| --- | --- | --- |
| F1 | An order could add the header field on its own branch and be admitted. | Fixed: the declaration is read at the merge base (`branchFrontPage` takes a reader; the check passes `git show <base>:<authority>`); a fixture adds the field on the branch and stays refused. Also recorded: `npm run plan -- check` refused the same edit with "existing work-order bytes changed" (D001). |
| F2 | The control record was read from the working tree and failed open: deleting it, pointing `baseBranch` elsewhere, registering a bogus or unterminated generated block, or raising the budget. | Fixed: the base's record governs for an undeclared branch and a changed record is refused; `baseBranch` is gone (the base is `main`); a record whose generated block reuses the section markers is invalid; a block that never closes is a shape failure; fixtures cover each. |
| F3 | The budget counted lines, not sentences; two sentences on one line passed; prose above the markers was uncounted. | Fixed: a line must end a sentence and hold one; nothing but blank lines and generated blocks may stand between the heading and the opening marker; messages say lines; the two longer candidates' lead-in sentences moved inside the markers. |
| F4 | No fixture covered the block rule's two new refusals. | Fixed: `scripts/test-release.sh` asserts both messages. |
| F5 | The page said "1.0", a version outside the generated line. | Fixed in all three candidates ("the release the roadmap calls teammate-ready"); the identifier screen now runs in the document check and also catches bare three-part numbers and versions that end a sentence. |
| F6 | The intent command was never run as written; D008 cited a digest it did not have. | Fixed: `npm run dotln -- intent "Describe the work"` ran as written (commands/npm-run-dotln-intent.txt), its draft was removed as scratch, and D008 cites only observed facts. |
| F7 | `worktree publish`, `dotln vertical`, `dotln resident` and `dotln presence` cannot run as written. | Fixed: the page names them as commands of the `dotln` and worktree tools, not as runnable lines; the runnable lines are the four npm commands, each run. |
| F8 | Keep rows dropped qualifiers: fake verifier, scratch proof, synthetic module, the conservative return rule, "neither an installed service nor a measured payoff curve", two not-built items. | Fixed in all three candidates; the candidates were re-read and re-scored (round two). |
| F9 | The integration test did not check its own setup; the live page was copied into the fixture; the in-flight multi-line case is untested. | Fixed the first two (the test asserts the two block lines differ; the fixture writes a minimal page); the third is recorded as an inference in D005. |

Observations: evidence outside the diff (noted; the verifier has the tree);
budget arithmetic for the three queued orders (recorded in D002's reopening
condition); cut headings without a destination (the inventory's class text
says a heading names no document).

## Design and maintainability improver

Found 15 (I1 to I15).

| Finding | Disposition |
| --- | --- |
| I1 record read from the working tree | Fixed (same as F2). |
| I2 lines versus sentences | Fixed (same as F3). |
| I3 identifier screen only in evidence; inventory-check re-parses | Fixed: the screen runs in the document check; inventory-check keeps its evidence-local checks and the same version shapes. |
| I4 a single line with extra words rewritten silently | Fixed: `release prepare` admits only the generated line or its two older spellings and refuses otherwise; the old fixture text is now a refusal case. |
| I5 one helper, one regex, case-specific messages | Fixed: `branchFrontPage` returns the reason; the authority lookup is no longer exported. |
| I6 error messages | Fixed: the record's failing field is named and reported as a failure, not a throw; the undeclared-change message names the diff command; the budget message names the record; the surface messages tell the author to move text and rerun prepare. |
| I7 bootstrap and no-merge-base fixtures | Fixed: both added. |
| I8 integration test setup and overlay | Fixed (same as F9). |
| I9 two claims changed by shortening | Fixed in all three candidates. |
| I10 who it is for; Try it; the 12/12 tie | Fixed: an opening sentence names the audience, Try it opens with the one command, D002 records the tie and the second round; the scorer records whether each quote exists in the page. |
| I11 anchored phrases without their half-clause | Fixed in the shortest candidate. |
| I12 one path per map bullet | Fixed. |
| I13 rule sentences that contradicted themselves | Fixed in the playbook and product 07. |
| I14 prose fields in the control record | Fixed: machine fields plus pointers; the policy field points at product 07. |
| I15 CONTRIBUTING order | Fixed: what to run first, mechanics, history last; release evidence in its own section. |

Not counted by the improver: the 08845c71 fixture archives a historical tree on
every run. The order requires that case; it is left as filed.

## Disposition

self-review: found 23; fixed 22; recorded 1 — the adversary's F9 third point
(an in-flight branch's old multi-line block merging against main's one line)
is recorded in D005 as an inference with the normalization logic it rests on.
Both reports were acted on before the handoff gates; the candidates were
re-scored after the edits.
