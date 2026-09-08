# WO-112 — The loop from core: one scratch issue travels from SourceBundle to a verified pull request with the post-PR loop against a scratch target, run from this launchpad and measured item by item against the predecessor's loop (version assigned at activation)

**Model:** the actual local harnesses for every episode, operator-witnessed
from a terminal outside the sandbox; launch claims recorded per episode
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. The composition of the earlier gates as
one `dotln vertical` command plus the evidence record; a defect found in a
primitive is a separate bounded order. Assigned at activation under the
standing opt-out default.
**Nomination provenance:** the 2026-09-08 critical-path planning pass (gate
H's proof), re-cut at the operator's same-day direction that no
target-application work order lives in this repository: the core proof runs
against a scratch target, and the operator's Angular work is planned in
their fork of the starter. The operator's description of the predecessor's
loop is the parity checklist, generalized under the Clean Room floor.
Planner-synthesized draft; captures and hashes in the ledger section of that
date. Opaque identifier, not a priority. Clean-room screen: the target and
issue are scratch artifacts in a personal public repository.
**Depends on:** WO-123 merged (the composition this run executes); WO-053
merged (the live primitive); WO-056 merged (live verification and repair);
WO-045, WO-046, WO-047 and WO-048 merged (the codecs are mandatory before
the loop runs against anything the operator keeps).
**Recommended placement:** last of the primitive gates; the third replan
checkpoint follows its receipt. It adds the composition command and
`docs/evidence/WO-112/`. A recommendation, not a dependency token.

**Cites (read these sections):** 00-vision.md §The one-paragraph story;
06-roadmap.md §Application version pending — Source-to-deliverable vertical
(the rung's exit criteria and measures); 12-workstream-application.md
§Replacing a successful but costly workflow (the replacement table);
`docs/planning/critical-path-2026-09-08.md` §The destination in the
operator's terms; every order named in Depends on.

**Objective:** Run WO-123's composition once, witnessed, against a scratch
target repository that carries a small web page and a scratch issue: SourceBundle (WO-062) → StoryContract (WO-061,
with a labeled inference episode) → an implementation order whose
surfaces WO-124 derives → the source-change
episode in the governed worktree (WO-052) with the focused tests → browser
witnesses (WO-059) → verification and repair (WO-054, WO-055) →
conventional commits and the pull request (WO-063, WO-064) → the post-PR
loop (WO-065, WO-066) until a terminal state; measure main-thread context,
model input and output, sessions, human touch time, cycle time, retries,
cost, evidence coverage, findings and operator interventions; score the
parity checklist item by item.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`):**

- The predecessor performs this loop today from prose rules; DotLn has no
  end-to-end run anywhere.

**Design (scope discipline):**

- The run adds nothing; a step the composition lacks is a WO-123 defect
  filed as its own order.
- The representative scenario must reach its terminal state with every
  automated review item resolved; a separate control scenario in the same
  run carries one incorrect suggestion that must be rejected with evidence,
  so `NeedsHuman` is proven legitimate rather than allowed to pass.
- Unmeasured values are `unknown`, never estimated.
- **Declined alternatives, recorded:** running against the operator's
  Angular repository from this launchpad (that work is the fork's, by the
  operator's direction; core records only the sibling receipt through
  WO-083).

**Deliverables:** `docs/evidence/WO-112/README.md`
with sanitized receipts, the measures and the checklist; the write-backs
below.

**Acceptance criteria (all required)**

1. The pull request exists on the scratch repository with a generated title
   and body; every acceptance criterion of the StoryContract carries
   evidence, visual ones with screenshot witnesses; findings, if any, were
   resolved through repair; in the representative scenario every automated review
   comment is `resolved` and none is `NeedsHuman`; in the control scenario
   the incorrect suggestion is rejected with recorded evidence; the terminal
   state was human-controlled.
2. No DotLn file, path or vocabulary is in the target's branch or pull
   request, proven by the lint and a tree grep recorded in the receipt.
3. The measures are recorded with methods; each parity item is scored
   observed-met, observed-unmet or unknown with its evidence reference, and
   the parity claim passes only if every item is observed-met.
4. Every claim is labeled `observed`, `launch-claim` or `unknown`.
5. Write-backs land: 06 (the rung's status), 12 (the replacement table rows
   with evidence), README "What runs today", the capability table (a dated
   `vertical.source-to-pr` row), ledger entry; the third replan checkpoint is
   answered in the planning map.
6. `npm test` green; `git diff --check` clean; no new dependency beyond the
   ones the earlier orders pinned.

**Evidence gate:** the receipts; `npm test`.

**Write-back duty:** as listed in criterion 5.

**Non-goals:** any target-application repository of the operator's (planned
in the fork); cross-repository workstreams (WO-080 onward); the console
framework decision; any runtime fix (a separate order).

**Operator-review assumptions**

1. The operator witnesses the run and files the receipt from an outside
   terminal.
2. A run that fails records its receipt under this order's evidence and does not close the order; dependents wait for an observed success, and the operator may withdraw the order with a dated note. A defect found in a primitive is nominated as its own order.
