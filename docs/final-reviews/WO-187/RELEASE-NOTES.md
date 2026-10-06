## Release overview

This release moves defect discovery from final review into verification, and makes what final review still finds a recorded count. A verifier now attacks the change, reviews the whole implementation as a pull-request reviewer and has one fresh adversary read only the order and the diff. An executor runs the same fresh adversary before each completion. Final review keeps its duties and lists its findings in one block that the lifecycle counts by class. The visible changes:
- `resume: verify` prints the order's `Known issues and carry-ins` and the latest planning receipt's known issues for that order, so the verifier starts with what the planning pass recorded.
- A final-review report carries one `dotln-findings` block, and `final-review-result` records how many findings were escapes, integration findings, new scope or unclassed.
- `npm run plan -- failures` shows those counts per order, and `npm run plan -- start` shows escapes per final review over the ten most recently reviewed orders.
- Sub-agents launched by a Claude Code role use one generated definition that pins their model and effort, whatever effort the root session selected.

The release is for operators and agents who run DotLn's delivery roles in a DotLn repository. It promises no fall in escaped defects: that is what the new count is there to show.

## Read before upgrading

- **Verification does more and takes longer.** The verifier's duty sentence is replaced by three duties run in order, with their detail in product 07 §Verification review and attack, which the verifier reads when dispatched. This order's own five verifications ran under the new text and took 867 s to 3,886 s, with a median of 1,352 s, against a median of 842 s before. They judged a subject that failed four times, so the two figures are not a like-for-like comparison.
- **Every executor completion pays one sub-agent.** Before `implementation-ready` and `repair-complete`, one fresh worker reads the order and the diff as an adversary and improver. The executor fixes or records each finding and writes a line in `handoff.md` that starts `self-review: found N; fixed N; recorded N`. A missing line prints one advisory and never refuses the completion. The line is the executor's statement; it does not prove a review ran.
- **Final-review reports need a findings block.** The report lists every finding once, as a JSON array between two marker lines, with `[]` for none:

  ```text
  <!-- dotln-findings:start -->
  [{"id": "F1", "route": "follow-up", "class": "escape", "summary": "one line"}]
  <!-- dotln-findings:end -->
  ```

  Only that block is counted; prose is never read for counts. A report without exactly one readable block records its counts as unmeasured with one advisory naming the cause. A class that is missing or outside `escape`, `integration` and `new-scope` counts as `unclassed` and is named in one advisory. The result records in every case.
- **Existing reviews are unmeasured, not zero.** Final-review events recorded before this release hold no counts, and no earlier report is re-read. `plan start` therefore reports the rate as unknown until every review of the ten most recently reviewed orders is measured.
- **Spawned Claude workers use `.claude/agents/dotln-worker.md`.** The generated definition sets `model: claude-opus-5-5` and `effort: xhigh`, and each role's text says to launch adversaries, reviewers, refuters and research workers by that type with no model override. Under Codex the same pin is passed to the spawn call. `npm run harness -- check` fails when the file's model or effort is edited by hand. The host reports no effective effort for a worker, so the pin is a launch selection, not proof of what ran.
- **A cold-start ceiling overrun is now boarded, not raised.** Product 07 retires the 2026-09-17 route of raising a ceiling by a 4 KB step or recording an acceptance: a reviewed rule that breaches a role's cold-start ceiling stays whole and its overrun becomes a follow-up. Every role root grows by the worker-pin sentence, and the executor root now stands 531 bytes over its unchanged ceiling on that route.
- **A document ceiling can report an overrun as an advisory.** An entry in `docs/control/doc-ceilings.json` may name an `advisoryDecision`: a public evidence decision whose registered follow-up is open or deferred. While it is, `docs-check` reports the overrun as an advisory instead of a failure, with no ceiling raised and no bytes exempted. Product 07 uses it now. Settling or allocating that follow-up while the document is still over its ceiling returns the hard failure.
- **Planning output changed shape.** The `plan failures` page and export gain a `finalReviewFindings` field. The `plan start` block gains `finalReviewEscapes`, drops `opensAt` (the full feed keeps it in `window.opensAt`) and shortens the `localCoverage` text, to stay inside its 1 KB bound.
- **Component versions.** The compiler moves 0.25.2 → 0.25.3, the skeleton 0.53.0 → 0.53.1 and the harness host 0.34.4 → 0.34.5. The console pins the compiler and skeleton exactly. No dependency is added.

## Substantive changes

**Verification as review and attack.** The verifier attacks each criterion by varying what the executor's fixtures held constant: empty, forged or stale inputs and records, the working directory, a member outside the declared list, a repeated token, the real corpus in place of the fixture, and any path a repair introduced. It then reads the whole diff for correctness beyond the criteria, a simpler alternative, what a maintainer will not understand in six months and fit with the repository's principles. It gives one fresh worker only the order and the diff, and judges that worker's findings itself. Each finding takes one route: `blocking`, `follow-up` or `operator`. A re-verification re-derives every criterion whose surfaces the repair touched and attacks the repair. Consuming the executor's passing gate row limits reruns of the product gate and never limits a probe. A six-row lens catalog names the questions a verifier chooses among, and its report says which it used and why.

**What the verifier is told at dispatch.** The verify briefing prints every `Known issues and carry-ins` section of the order as written, under a header that names the label's line, the last line printed and the line that ended the section. It then prints the known issues the latest filed planning judgment recorded for that order. It advises on an empty section, on a code fence the order never closes, and on any other line outside a section that starts with `Known issue`.

**Counted final-review findings.** `final-review-result` reads the report's findings block and records four counts on the `FinalReviewCompleted` event. A block that cannot give a complete count records none, never a lower one: a missing or duplicated block, invalid JSON, a repeated or malformed id, an unlisted route, a summary that is not one line, or a failed review whose block lists no blocking finding. Planning reads the recorded event and never re-reads a report. A review whose counts are all zero adds no failure item.

**Executor self-review.** The executor's fresh adversary reads the order and the diff before each completion, and the handoff states what it found, fixed and recorded. Where the harness cannot spawn, the executor does the pass as a separate step and says so.

**One pinned worker definition.** The harness bundle emits one agent definition for spawned workers, carrying the pinned model and effort in the host's documented fields. It is part of the bundle's integrity check and of the installed-file drift check, so a root session's own effort no longer decides a worker's.

## Progressive polish

Product 07's planning and refutation paragraphs name the generated worker type in place of the root's effort, and the playbook's verify entry states what the briefing prints. The lifecycle fixture holds one case table per rule with exact expected output: every findings-block outcome from the repository root and a nested directory, the carry-in layouts each earlier verification reported, and the self-review line's accepted and refused forms. The Beacon portability fixture turns off Git's detached maintenance so a background repack cannot write into a tree the test removes. The authority and feedback evidence editions are re-minted, the console's self-hosted fixture follows the new feedback edition, and the harness bundle, role roots and publication lock are regenerated.

## Evidence and compatibility

Application `v0.67.1` is a patch release over `v0.67.0`, built from WO-187 integrated with `main` at `602f7e83`. The compiler moves 0.25.2 → 0.25.3, the skeleton 0.53.0 → 0.53.1 and the harness host 0.34.4 → 0.34.5. Kernel, beacons, console and browser-evidence sources are unchanged. The console's exact pins and its regenerated self-hosted fixture move, and no dependency was added.

The verification sequence:
- [VER-001](../../verifications/WO-187/VER-001.md) failed criteria 2 and 4: the briefing dropped a carry-in layout the real corpus uses, and finding lines in unrecognised shapes vanished from the count.
- [VER-002](../../verifications/WO-187/VER-002.md) failed criteria 2 and 4: a quoted code fence hid real content after it, and an uncounted line could leave a complete-looking count.
- [VER-003](../../verifications/WO-187/VER-003.md) failed criteria 2 and 4: the second repair's reading of inline code across lines hid a finding, a label or a self-review line.
- [VER-004](../../verifications/WO-187/VER-004.md) failed criteria 2 and 4 on the design itself: three readers inferred records from prose. The fourth repair replaced the inference with a findings block, a line-by-line briefing reader and one self-review form.
- [VER-005](../../verifications/WO-187/VER-005.md) passed.
- [FINAL-001](FINAL-001.md) passed on the integrated tree and boards seven low items.

A fresh `npm test -- --review` at the reviewed subject passed 39 of 39 suites with 89 fresh tasks in 1,349 s, and `npm run test:docs` passes.

Known limitations:
- The effect on escaped defects and on verification time is unobserved until orders run under the new text. The order reopens if ten orders show no fall in escapes or verification's median time more than doubles.
- The host reports no effective effort for a spawned worker.
- The self-review line and a finding's class are statements by their author.
- `verify` records its dispatch before it builds the briefing, so a missing order file or a receipts path that is not a directory leaves the dispatch recorded with no briefing until the path is restored. No supported workflow reaches that state (FINAL-001 F2).
- The document-ceiling advisory has no bound on the overrun and no tie to the document it excuses (WO-187 D033 and D052).
- The briefing reads structure only at the start of a line: a field label at the start of a line inside an indented code fence, after a blank line, ends a carry-in section. The section's header names the line that ended it.
- A recursive copy of a repository that holds a Beacon group file writes the file's sparse size out in full; two probe copies during this order's final review filled a disk (WO-187 D053).

Details are in [FINAL-001](FINAL-001.md), the [decisions](../../evidence/WO-187/decisions.md) and the [handoff](../../evidence/WO-187/handoff.md).
