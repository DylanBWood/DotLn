// The lifecycle's phases and the actions canonical status can call legal in
// each: one table for the command that answers status and for whoever reads
// a refusal that quotes its answer, so that neither keeps a list of its own.

/** The lifecycle phrases a drive routes, by action, with the role each
 * selects. */
export const LIFECYCLE_ROUTES = Object.freeze({
  next: { role: "executor", phrase: "resume: next" },
  fix: { role: "executor", phrase: "resume: fix" },
  verify: { role: "verifier", phrase: "resume: verify" },
  "final-review": { role: "reviewer", phrase: "resume: final review" },
  "release-close": { role: "release-close", phrase: "resume: release close" },
});

/** The actions legal in a phase, whatever else the order's state holds. */
export const PHASE_LEGAL_ACTIONS = Object.freeze({
  none: Object.freeze(["activate"]),
  active: Object.freeze(["next", "implementation-ready"]),
  "ready-to-verify": Object.freeze(["verify"]),
  verifying: Object.freeze(["verification-result"]),
  "needs-fix": Object.freeze(["fix"]),
  repairing: Object.freeze(["repair-complete"]),
  verified: Object.freeze(["final-review"]),
  "final-review": Object.freeze(["final-review-result"]),
  closed: Object.freeze(["release-close", "next", "activate"]),
  // Terminal: only a reactivation of a changed revision leaves it.
  withdrawn: Object.freeze(["activate"]),
});

/** The actions an order's own state adds to a phase's list: a plan-first
 * order's proposal and approval, a target's records owed at its close, and
 * the repair offered beside a verification of an order that failed one. */
export const STATE_LEGAL_ACTIONS = Object.freeze([
  "plan-proposed",
  "plan-approved",
  "target-records",
  "fix",
]);

/** Every phase canonical status names. */
export const LIFECYCLE_PHASES = Object.freeze(Object.keys(PHASE_LEGAL_ACTIONS));

/** Every word a list of legal actions can hold. */
export const LEGAL_ACTIONS = Object.freeze([
  ...new Set([
    ...Object.values(PHASE_LEGAL_ACTIONS).flat(),
    ...STATE_LEGAL_ACTIONS,
  ]),
]);
