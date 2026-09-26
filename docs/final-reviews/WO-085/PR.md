# WO-085

`docs/product/` grew from 296 KB to 1,048 KB between 2026-09-01 and 2026-09-25, 3.5× in 164 commits, because every order and pass appended a dated bold paragraph or a `Candidate —` heading under a product heading and nothing refused it; WO-090 cut product 07 to 1,933 lines on 2026-09-20 and it was 2,531 lines five days later. Links and anchors were healthy but unchecked, and decision records had carried the operator's messages word for word (WO-153 D008).

This pull request lands WO-085. The document gate now bounds each product document's bytes, refuses the shapes that were accreting, checks that decision dispatches carry a control prefix and a paraphrase, and resolves every in-repo Markdown link and anchor; the rule every role reads says to edit the changed sentence in place and names the check.

- **One check in the document gate.** `scripts/docs-check.mjs`, run by `npm run test:docs` as a preflight, prints one table (document, bytes, exempt bytes, ceiling, headroom) and fails with the file, line and remedy. It reads `docs/control/doc-ceilings.json` (fifteen documents, each ceiling the non-exempt bytes at landing plus two per cent, dated and tied to the decision that set it) and `docs/control/doc-baseline.json` (87 receipt and candidate shapes counted by document, nearest heading and label; 743 dispatch fingerprints; 368 historical broken-link pairs with 412 counted occurrences in closed orders' immutable reports).
- **Shapes and exemptions.** A paragraph opening `**…(YYYY-MM-DD…):**` or `**…operator direction…**` is a receipt; a `## Candidate —` or `### Candidate —` heading is a candidate; an addition beyond the baseline fails with "edit the sentence the change amends" or "candidates go to the planning map". Roadmap §Release boundary is exempt from bytes and shapes until WO-086 retires the handwritten notes product 07 §Discipline still requires there. No generator writes into `docs/product`, so a hand-written marker pair exempts nothing.
- **Dispatches and links.** A new decision record's `dispatch` needs one of the seven control prefixes and at most 240 characters of paraphrase on one line; existing records are fingerprinted, not copied. Links in root and `docs/` Markdown resolve from their own file to an existing file and heading slug, HTML anchor or line reference; fenced code, comments and inline code are not navigation; remote URLs are not fetched.
- **The seams the check met.** The generated work-order index renders a pending verification or final-review report as plain text until a verdict exists, so the gate no longer fails on an allocated report in every verifying and final-review window; the integration decision stub emits `resume: fix; …` or `resume: final review; …` instead of a command the check refuses; the WO-165 path literal in the authority-evidence generator reads through the configured work-orders root, repairing `main`'s failing `configuration-root` suite.
- **Fixtures.** `scripts/test-docs-check.mjs` runs 24 cases in fresh `git init` roots: exact overage, new and duplicate shapes, moved headings, missing ceilings, broken anchors and files, invalid encodings, dispatch prefix and length, historical exception counts, ceiling raises after a commit, marker pairs, byte-order marks, list and quote fences, setext headings, HTML ids, line references and stored PR-body links.

**What a reviewer should know.**

- **Links in a stored PR body are file-relative.** The check judges `docs/final-reviews/*/PR.md` from its own directory, so a new body links with `../../…`; the 347 root-style links in closed PR bodies are counted historical exceptions. Neither form navigates on the GitHub PR page ([VER-001](../../verifications/WO-085/VER-001.md) F1; [D015](../../evidence/WO-085/decisions.md#wo-085-d015) V5 carries the writer-side rule).
- **The check judges shapes, not intent.** Receipt forms outside the Design's literal pattern, candidate headings at other levels, invisible prefixes and relocation into exempt regions are constructible; they are boarded for the next document-maintenance planning pass ([D009](../../evidence/WO-085/decisions.md#wo-085-d009), D015) and review still judges paraphrase ([D002](../../evidence/WO-085/decisions.md#wo-085-d002)).
- **Raising a ceiling is a planning decision.** The entry must cite a resolving anchor under `docs/planning/`; the guard compares with the committed ceilings and the landing formula.
- **WO-167 must not cite this check for the skills' citations** ([D016](../../evidence/WO-085/decisions.md#wo-085-d016)): the scan covers root and `docs/` Markdown only, and the role skills cite product 07 headings as inline code.

**How the review went.** A Codex session implemented the order (D001 to D007), superseding a handwritten Markdown grammar with the pinned Prettier parser after adversarial probes. [VER-001](../../verifications/WO-085/VER-001.md) failed it: a PR-root link rule admitted 308 broken links, a hand-written marker pair exempted anything, the index linked reports before they existed, a byte-order mark disabled detection, and one README sentence was wrong (F1 to F5, D008). The repair integrated `main`, answered all five with regressions, reconciled the landing inventory and repaired the two producers the integrated gate exposed (D010 to D014). [VER-002](../../verifications/WO-085/VER-002.md) passed all five criteria on copies of the real documents with the real controls and boarded ten observations (D015). [FINAL-001](FINAL-001.md) read the whole diff, counted the controls and product bytes without the check's parser, observed the document gate green on its own window before the report existed, and ran the review gate.

**Validation.** The reviewer's `npm test -- --review` on the staged subject passed **34 passed, 0 failed, 594.62 s, 78 fresh tasks, exit 0** at code identity `26c200f1af7836611825290bfa9834b1efa179bda07da53f4f529527267aacd2`, and that row binds the released bytes. `npm run test:docs` passed 23 of 23 before and after the review records; the focused suite passes 24 of 24; `docs-check` passes on the tree with 0 failures and 412 declared occurrences; `publication:check`, `release check-surfaces --local`, `meta --check` and `harness check` pass. `git diff --check` is clean, no dependency is added and the diff adds no suppression.

This prepares application `v0.52.2` as a patch release over `v0.52.1` (`6a5c323d`), the classification the order declared; the staged `v0.51.2` target was retimed at the repair's integration. No package version changes.

Full evidence: [decisions D001 to D016](../../evidence/WO-085/decisions.md), the [evidence README](../../evidence/WO-085/README.md), the verification reports [VER-001](../../verifications/WO-085/VER-001.md) and [VER-002](../../verifications/WO-085/VER-002.md), the [final review](FINAL-001.md) and [the order](../../work-orders/WO-085-spec-receipt-boundary.md).

<!-- dotln-process-meter:start -->

Observation cutoff: 2026-09-26T21:20:37.880Z; source: canonical control events and the recorded gate, usage and harness observations collected by npm run meta.

| Work | Phase ms / attempts | Gate ms | Read files / bytes | Observed tokens / USD | Declared prompt tokens | Corrections |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-161 | 7,818,816 (Δ unavailable) / 5 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ unavailable) |
| WO-160 | 13,450,485 (Δ 5,631,669) / 7 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ 0) |
| WO-070 | 8,380,589 (Δ -5,069,896) / 3 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ 0) |
| WO-115 | 22,293,818 (Δ 13,913,229) / 15 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ 0) |
| WO-165 | 6,509,729 (Δ -15,784,089) / 3 | unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) / unavailable (Δ unavailable) | unavailable (Δ unavailable) | 0 (Δ 0) |
| WO-085 | 11,433,736 (Δ 4,924,007) / 4 | 3,498,342 (Δ unavailable) | 0 (Δ unavailable) / 0 (Δ unavailable) | 65,734,293 (Δ unavailable) / unavailable (Δ unavailable) | 1,019 (Δ unavailable) | 2 (Δ 2) |

Unavailable observations are not zero; unset ceilings are not approvals of a future limit.

| Dispatch | Wall ms (Δ) | Context bytes (Δ) | Commands (Δ) | Tokens (Δ) | Steps (Δ) | USD (Δ) / declared prompt tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| WO-085/executor | 4,648,286 (2,078,584) | unavailable (unavailable) | unavailable (unavailable) | 26,556,596 (unavailable) | 199 (unavailable) | unavailable (unavailable) / 1,019 |
| WO-085/verifier | 6,785,450 (4,339,126) | 541,228 (unavailable) | 816 (unavailable) | 37,494,113 (unavailable) | 903 (unavailable) | unavailable (unavailable) / unavailable |
| WO-085/reviewer | 618,318 (-875,385) | unavailable (unavailable) | 66 (unavailable) | 1,683,584 (unavailable) | 68 (unavailable) | unavailable (unavailable) / unavailable |
| WO-085/release-close | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-085/planner | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
| WO-085/refuter | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) | unavailable (unavailable) / unavailable |
<!-- dotln-process-meter:end -->
