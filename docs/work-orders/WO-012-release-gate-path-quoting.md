# WO-012 — Release-gate path quoting fix, v0.2.1

**Model:** any capable model.
**Release classification:** `v0.2.1` patch — it repairs the release gate that
blocked `v0.2.1` itself. This work order closes the same roadmap rung WO-004
opened; the annotated `v0.2.1` tag is cut when *this* order closes, and it
carries WO-004's content plus this fix.
**Depends on:** WO-004 (merged, `origin/main`). Nothing else executable.

**Cites (read these sections):** 07-execution-guide.md §Workflow closeout and
releases (the "failed release check opens a patch work order" rule, and the
intake-preservation contract this bug violates); 06-roadmap.md §v0.2.1;
01-principles.md Principle 7.

**Objective:** Repair the path classification in the release and worktree
gates so that ignored files whose names contain non-ASCII bytes are read as
the paths they actually are. `git ls-files`, `git diff --name-only`, and
`git ls-tree --name-only` C-quote any path containing non-ASCII bytes,
backslashes, quotes, or control characters (default `core.quotePath=true`),
wrapping the whole path in literal double quotes and escaping the bytes. All
three consumers in this repo compare that already-quoted string against
unquoted prefixes and path segments, so a protected intake file is classified
as release-contaminating material and a disposable build output is classified
as material that must be preserved. Both misreadings are inverted, and both
fail closed by refusing an authorized action.

**Observed failure (the reason `v0.2.1` was not tagged on 2026-09-01):** the
authorized `release close WO-004 --publish` run refused with
`main checkout contains ignored material that can contaminate release
evidence: "docs/intake/images/Screenshot 2026-08-30 at 10.01.24\342\200\257PM.jpg"`.
The named file is ordinary protected intake, explicitly allowed by the guard's
own `docs/intake/` rule. It was rejected only because macOS screenshot names
carry U+202F (narrow no-break space, bytes `\342\200\257`) before `AM`/`PM`,
which triggers git's quoting, so the candidate string began with `"` and the
`startsWith("docs/intake/")` test failed. Every macOS screenshot placed in
`docs/intake/images/` reproduces this, so the release path is blocked until
this order lands. WO-004's deliverable was already merged and had passed
VER-002 and FINAL-001; the deferral is a tooling defect, not an evidence
failure, and no `v0.2.1` tag was created.

**Scope discipline (three sites, one root cause):**
- `scripts/release.mjs` `ensureNoIgnoredInfluence` — the site that fired.
  A false refusal that blocks release close entirely, in both the `--publish`
  and preparation forms.
- `scripts/worktree.mjs` `ensureNoIgnoredMaterial` — same inverted misread
  with the opposite polarity: a *disposable* ignored path with a non-ASCII
  name (`node_modules/<non-ASCII>/x.js`) escapes the disposable test and
  refuses worktree removal.
- `scripts/release.mjs` `changedFiles` — the consequential one. `diff
  --name-only` and `ls-tree --name-only` quote identically, so a tracked
  non-ASCII path would be written C-escaped into the **immutable published
  manifest** and into the annotated tag message, and would silently fail
  `criticalNotes`' anchored path regexes. Latent today only because every
  tracked path is ASCII.
- `ensureClean` in both scripts consumes `status --porcelain`, which quotes
  too, but only tests empty against non-empty. Audit it, record that it is
  unaffected, and leave it alone.
- Fix the reading, not the callers' predicates: read NUL-delimited output
  (`-z`) and split on `\0`. `-z` is required rather than
  `-c core.quotePath=false`, because it also survives literal newlines in a
  filename. Note that the shared `runGit`/`run` helpers `.trim()` their
  stdout; `\0` is not JavaScript whitespace so the trailing delimiter
  survives, but a filename with leading or trailing spaces would not. Add a
  non-trimming path-list helper rather than reusing the trimming one.
- Refusal messages must name the real path, unquoted.
- No change to which files are allowed or disposable. The classification
  policy is correct; only its input was corrupt.

**Bounded secondary correction (strike if unwanted):** 07-execution-guide.md
§Workflow closeout and releases states the release command "works from the
exact merged commit". `release.mjs` in fact tags `origin/main` HEAD after
fast-forward, which is a later commit whenever another PR merges between the
work-order merge and release close — as happened here, with PR #7 landing
between PR #6 and this episode. Correct the prose to describe the implemented
behaviour, or state the intended behaviour and open it as a separate defect.
Do not change the tagging code under this order.

**Deliverables:** the three corrected call sites and the shared path-list
helper in `scripts/release.mjs` and `scripts/worktree.mjs`; non-ASCII fixture
coverage in `scripts/test-release.sh` and `scripts/test-worktree.sh`; the
roadmap's `v0.2.1` rung updated to name this order alongside WO-004 with the
deferral reason; the guide correction if the secondary item is kept.

**Acceptance criteria (all required)**
1. A main checkout holding an intake file whose name contains U+202F passes
   `ensureNoIgnoredInfluence` and release close proceeds past the guard.
2. A main checkout holding a genuinely foreign ignored file with a non-ASCII
   name (a stray dotenv, say) still refuses, and the refusal prints the path
   unquoted.
3. A subject worktree whose only non-ASCII ignored paths are disposable
   (`node_modules`, `dist`, `.DS_Store`, `*.tsbuildinfo`) is removed by
   `worktree finish`; one holding a non-ASCII intake note still refuses and
   names it unquoted.
4. A tracked file with a non-ASCII name appears literally, unquoted, in the
   manifest's `changedFiles`, and a manifest generated from such a tree
   re-validates byte-identically through `release validate`.
5. Every new fixture asserts the real byte sequence, not a transliteration;
   at least one fixture uses U+202F specifically, since that is the
   reproducing real-world case.
6. `npm test` passes, and the guard rejection recorded in this order's
   Observed failure no longer reproduces.

**Evidence gate:** `npm test` green, plus a captured before/after of the
`ensureNoIgnoredInfluence` classification on a fixture containing the U+202F
intake path, recorded in the result.

**Write-back duty:** 06-roadmap.md `v0.2.1` names WO-004 and WO-012 with the
deferral reason (the guide requires a deliberately deferred eligible release
to retain a durable reason); 07-execution-guide.md only if the bounded
secondary correction is kept; ledger duty for the general lesson that git
path output is an encoded format, not a path list.

**Operator note (outside this order's scope):** `origin/revert-6-wo-004` is a
stray unmerged revert of PR #6 left on the remote. `origin/main` still
contains WO-004, so it blocks nothing, but it should be deleted.

**Non-goals:** changing the allow/disposable classification policy; changing
which commit release close tags; ruleset-aware push preflight; the carried
non-blocking findings G2–G6 from FINAL-001; any new release capability.
