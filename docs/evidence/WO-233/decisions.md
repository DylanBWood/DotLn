# WO-233 decisions

## WO-233-D001 — An active order behind main integrates main by current code before its handoff run (operator-authorized amendment after receipt 056)

```json
{
  "id": "WO-233-D001",
  "date": "2026-10-27",
  "dispatch": "planning: FIX THE BULLSHIT FROM WO-192 … (the 2026-10-26 pass, after receipt 056); operator-authorized amendment of the judged order",
  "decision": "Amend WO-233 so that `worktree integrate WO-NNN` is admitted for an order in `active` whose worktree's merge base is behind `main`, and so that the integrate can be performed by the main checkout's current `scripts/worktree.mjs` against the order's registered worktree (resolved from `git worktree list --porcelain` by the order's branch), so a worktree whose own script predates the rule is integrated by code that carries it. The executor root's handoff step gains the duty: when main has moved past the worktree's base, integrate first, resolve authorized conflicts, re-run format and sync, then start the one complete run, so the row recorded at the integrated identity is the one final review reuses. WO-192 is the first consumer: resumed after WO-233 closes, it integrates by main's code, takes the fixed gate, and pays one complete review instead of two.",
  "operatorAuthorization": "The operator directed on 2026-10-27 that WO-233 be changed, calling it the height of stupidity that an out-of-date executor pass cannot integrate main because a planning pass forbade it, and then pointed out that the WO-192 worktree the resume runs in would not carry the code admitting it, which is why the integrate runs by the main checkout's current code against the stale worktree. Captured verbatim in ignored intake, SHA-256 2280c0555104abe9c811daf4efd4218f4d835b0eab50be56ff7afc78a6cb190a (items 1 to 5).",
  "evidence": [
    "scripts/lib/worktree-integration.mjs 595 to 597: `integrate requires the selected order in repairing or final-review`; 20 to 26: the command's cwd must be the matching wo-NNN worktree root, so a stale worktree can only run its own old script",
    "scripts/worktree.mjs 716 to 724: the integrate action passes resolve(process.cwd()) as the root",
    "product 07 §Preflight before the full gate: final review reuses the passing complete review row at the integrated code identity whichever role recorded it, and pays a fresh run only when that identity has no passing row; an order that waited while main moved therefore pays two complete reviews under the current rule (the executor's at its own identity, final review's at the integrated one)",
    "WO-192's worktree at 939af628 with main three releases ahead once WO-233, WO-234 and WO-235 close; its last complete review ran 1,902.3 s and its gate churn is what WO-233 fixes, so its handoff run must happen on the fixed gate, which only an integrate before that run gives it",
    "receipt 056 judged WO-233 aligned-with-findings with no hold; this is a bounded change to one of its files and one role sentence, recorded through the execution-amendment route rather than by an edit of judged bytes without authority"
  ],
  "rejected": [
    { "option": "Admit integrate at every phase", "reason": "Verification and final review judge a frozen subject; the admission is for the executor's phase only." },
    { "option": "Cherry-pick WO-233's change into the stale worktree by hand", "reason": "That is the operator's hand again, and it would have to be repeated for every worktree that waits behind a release." },
    { "option": "Leave the rule and accept two complete reviews for WO-192", "reason": "The second run is 1,902 s of the churn this order exists to stop, and the first would run on the unfixed gate." },
    { "option": "NoOp", "reason": "The operator's explicit direction; the chicken-and-egg stays." }
  ],
  "reopenWhen": "An active order's integrate from current code leaves the worktree with a mixed runtime (a merged scripts tree whose installed harness snapshot or built runtime predates it), or a verification finds the integrated identity's complete row reused for a subject the integrate changed after the row was recorded."
}
```
