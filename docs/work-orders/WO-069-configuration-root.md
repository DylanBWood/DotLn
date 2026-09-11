# WO-069 — Configuration root: every control-plane script resolves its document roots and repository root through one `dotln.config.json` loader whose absence reproduces today's layout byte for byte (version assigned at activation)

**Cost:** Legacy declaration unavailable: added and removed wall-clock, context bytes, commands, tokens and steps were not measured. No reduction is claimed; the next planning refutation must judge this missing cost evidence (WO-126, 2026-09-09).

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** patch. A pure refactor of the control plane
with a documented configuration schema; no runtime package change. Assigned
at activation under the standing opt-out default.
**Nomination provenance:** WO-033 phase 1 (the 2026-09-06 planning pass and
its same-day redirect), cut into a bounded child at the operator's
2026-09-08 correction; the umbrella's wording is the record. Planner-
synthesized draft. Opaque identifier, not a priority. Clean-room screen: no
stop condition.
**Depends on:** WO-018 merged (`scripts/lib/`; satisfied at `v0.4.1`).
**Recommended placement:** first of the starter children, after the first
external source change (a dated planning deferral until WO-053 closes or the
operator waives it); it edits every `scripts/*.mjs` and `scripts/lib/*.mjs`
root literal and adds `scripts/lib/config.mjs`. A recommendation, not a
dependency token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-018",
    "relation": "satisfied-by-release",
    "release": "v0.4.1",
    "reason": "scripts/lib"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** `docs/work-orders/WO-033-compiled-starter-export.md`
§Phase 1 (the umbrella's wording); 10-ir-compatibility.md §Separate version
axes (a configuration schema is its own axis); 07-execution-guide.md
§Operator resume phrases (the machine contract that must survive);
`scripts/lib/paths.mjs`, `scripts/lib/control-store.mjs`, `scripts/resume.mjs`,
`scripts/worktree.mjs`, `scripts/release.mjs`, `scripts/work-orders.mjs`.

**Objective:** Add `scripts/lib/config.mjs` with `loadConfig(root)` and a
documented `dotln.config.json` schema, version 1 (`roots`, `repositories`
as an opaque section this order only validates as an object, `build`, and
`release` surface toggles); resolve every document root and the repository
root through it; find the launchpad root by walking up to a
`dotln.config.json` or the Git top level, with `DOTLN_LAUNCHPAD` overriding;
and remove the literal `docs/...` roots and the eleven ad hoc root
derivations from every other script.

**Observed gap (dated 2026-09-08, `main` at `33e2c25`; counts from the
2026-09-06 sweep):**

- `"docs/control` appears 29 times, `"docs/work-orders` 18,
  `"docs/final-reviews` 13, `"docs/verifications` 6, `"docs/publication` 5,
  `"docs/evidence` 4, `"docs/releases` 3 and `"docs/planning` 3 across
  `scripts/`; eleven scripts derive the repository root from
  `import.meta.url` in four ways. The plane runs only inside this layout.

**Design (scope discipline):**

- Absence of the file means today's defaults byte for byte; a test refuses
  any remaining literal root outside `config.mjs`.
- The schema is documented in product 07 and validated positively; unknown
  keys refuse.
- **Declined alternatives, recorded:** environment variables per root (one
  file is reviewable); a global mutable config object (pass the loaded
  config explicitly).

**Deliverables:** `config.mjs`, the schema documentation, the refactor, the
fixtures, the write-backs below.

**Acceptance criteria (all required)**

1. With no `dotln.config.json`, every existing suite passes unchanged, and
   `status --json`, `current.md`, the generated index, `times`, `usage` and
   a release manifest derived over the real log are byte-identical to the
   activation base (`cmp` transcripts).
2. A fixture launchpad in a temporary directory with non-default roots
   drives `activate`, `implementation-ready`, `verify`,
   `verification-result`, `final-review`, `final-review-result` and
   `worktree finish` through the unchanged commands, writing only under its
   configured roots.
3. A test refuses any literal `docs/` root outside `config.mjs` and any
   second root derivation; a malformed configuration refuses with the path.
4. Write-backs land: 07 §Operator resume phrases (config discovery and
   `DOTLN_LAUNCHPAD`), 10 §Separate version axes (the schema axis), ledger
   entry.
5. `npm test` green; `git diff --check` clean; no new dependency.

**Evidence gate:** the transcripts for criteria 1 through 3; `npm test`.

**Write-back duty:** as listed in criterion 4.

**Non-goals:** repository registration semantics (WO-071); the export
(WO-074); any lifecycle change.

**Operator-review assumptions**

1. A configuration file at the launchpad root is the right discovery
   mechanism; the reviewer may prefer a named directory.
