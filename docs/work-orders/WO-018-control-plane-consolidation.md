# WO-018 — Control-plane consolidation: shared helpers, machine-readable state, manifest from the built kernel (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** assigned by the planner at activation. Expected
class: patch. Tooling and evidence corrections; no exported runtime
capability.
**Nomination provenance:** the operator's 2026-09-02 entropy review, including
an independent read of `scripts/`; opaque identifier.
**Direct-draft provenance:** the operator supplied this complete public draft
and explicitly directed that it be filed. The same message was first preserved
in ignored intake only as a compaction-safety copy, so its earlier filesystem
timestamp does not make it the source of an agent-authored synthesis. Both
artifacts descend from one operator-authored filing instruction. The operator
confirmed that direction during VER-001 repair; the clean-room screen found no
employer, credential, internal-service, or other stop condition.
**Depends on:** WO-017 merged; criterion 5 consumes its exported evaluable-kind
constants. WO-013 is recommended sequencing because both orders edit the shell
suites, but hunk overlap is not a semantic dependency. If WO-013 has not landed,
activation must baseline and reconcile the overlapping fixture edits explicitly.

**Cites (read these sections):** 07-execution-guide.md §Operator resume
phrases and §Workflow closeout and releases; 03-architecture.md §Session
lifecycle & resilience (resume control v1: the log is canonical, the Markdown
is a disposable projection); `docs/releases/README.md`; 06-roadmap.md §Release
boundary; `docs/final-reviews/WO-015/FINAL-001.md` §Remaining deviations
(shared refusal message; trace assertion guard; the post-`default:` parser
gap); `docs/work-orders/codex-downtime-series.md` (corpus promotion is a
reviewed change); 01-principles.md Principles 5 and 6.

**Objective:** Stop the four lifecycle scripts diverging. Collapse duplicated
helpers into one library, make control state machine-readable so sibling
scripts stop parsing a Markdown projection, derive the release manifest's
grammar fields from the built kernel instead of a source-text parser, close
one data-loss gap, and make the test chain exercise what it claims, without
losing a single existing guard.

**Observed problems (dated 2026-09-02):**

- `containedRegularFile` exists three times; the git runner four times under
  four conventions; the ignored-material guard twice with different
  allowlists; `ensureClean` twice with different strictness; the work-order
  authority check three times; branch teardown twice. Bare `JSON.parse` on
  `package.json` in two scripts loses the filename on failure.
- `worktree.mjs` gates `publish` and `finish` on
  `stdout.includes("- Phase: closed")`; `release.mjs` regexes `^- <label>:`
  lines out of `current.md`. The projection is being used as the API.
- `release.mjs` derives the manifest's cadence kinds by regex over `core.ts`
  and `types.ts`, and the control-log schema version by matching a source
  literal in `resume.mjs`. That parser refused the first v0.2.3 close; WO-015
  repaired it in place, and its own final review recorded that a `case` after
  `default:` still classifies silently as deferred.
- `resume.mjs`'s `fold` has no `default`: an unknown event type advances the
  log and silently leaves the projection unchanged, while `readEvents`
  refuses malformed JSON.
- Data loss: the disposable classifier treats any path segment named `dist`
  or `node_modules` as disposable, so an ignored file at
  `docs/intake/dist/notes.md` passes the refusal and is destroyed by
  `git worktree remove`. Protecting `docs/intake` is the guard's purpose.
- `scripts/test-publication.sh` asks the script for the correct lock, writes
  it into the fixture, then asserts the script agrees with itself. `npm test`
  never runs `check-publication.mjs` against the real repository. The corpus
  identity lane, the one independent oracle under `corpus/`, runs nowhere.

**Scope discipline:** behavior-preserving except the named fixes; every
existing shell suite passes with its assertions unchanged except where an
acceptance criterion names the change; one isolated, evidenced change stage
per numbered deliverable and no worktree commit before final review.

**Deliverables and acceptance criteria (all required)**

1. `scripts/lib/git.mjs` and `scripts/lib/paths.mjs` hold one `runGit`,
   `failureOf`, `runGitPathList`, `ensureClean`, `parseWorktrees`,
   `mainWorktree`, `containedRegularFile`, `readJsonFile` (names the file on
   failure), and the ignored-material classifier. The four scripts import
   them; a grep proves no duplicate definition remains. The two `ensureClean`
   strictnesses and the two allowlists are reconciled to one each, and the
   result states which was chosen and why.
2. The classifier never treats anything under `docs/intake/` as disposable
   and matches build outputs by anchored path rather than by any segment.
   Test: plant `docs/intake/dist/x.md` and `docs/intake/node_modules/y` in
   the subject worktree; `finish` refuses and both survive; the existing
   disposables-leave-with-the-worktree case stays green.
3. `resume.mjs` gains `status --json` emitting the same fields as
   `current.md`; `worktree.mjs` and `release.mjs` read it and contain no
   substring or regex parse of `current.md`. `status` warns, read-only and
   without writing, when `current.md` disagrees with the fold of
   `resume.jsonl`.
4. `fold` refuses an unknown event type with its ordinal, consistent with
   `readEvents`; test added.
5. The manifest's evaluable and deferred cadence lists come from the built
   kernel's exported constants; the source-text parser and its fixtures are
   deleted; the "malformed cadence source" release test becomes "kernel
   constants missing or inconsistent with the type union" and still proves no
   `mktag` or push occurs. The control-log schema version comes from a
   `resume.mjs` export, not a source-literal match.
6. `npm test` runs `check-publication.mjs` against the real repository and
   runs `corpus/harness/wo101-id-corpus.test.mjs`; the Program-lane corpus
   stays outside the chain and is marked frozen in `corpus/README.md`.
7. `test-publication.sh` computes its expected lock with an independent
   `shasum -a 256` and asserts against that. The WO-015 review's carried
   items land: split refusal messages in the manifest deriver, and `test -s`
   guards on the trace assertions in `test-release.sh`.
8. The line count of `scripts/*.mjs` is lower than on `main` and the result
   reports the delta; every guard enumerated across `scripts/test-*.sh` still
   has a failing negative fixture.

**Evidence gate:** every suite green; the new negative fixtures; `cmp` of
`current.md` before and after each transition in `test-resume.sh`; a
simulated release in the fixture proving the manifest's cadence fields equal
the kernel constants; `git diff --check` clean.

**Write-back duty:** 07-execution-guide.md and `docs/PLAYBOOK.md` for
`status --json`; `docs/releases/README.md` for the manifest source;
`corpus/README.md` for the promoted lane; ledger entry (adopted: control state
is data, and a projection is never parsed as an API).

**Non-goals:** changing any lifecycle phase or transition; `dotln status`
(WO-009); Linux portability of `stat -f`; a `recover` action; rewriting the
shell suites beyond the named lines; a `program` field in the manifest (record
as a candidate); touching `docs/verifications/` or `docs/final-reviews/`.
