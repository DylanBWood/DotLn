# WO-032 — Showrunner board: a read-only first console over control state, worktrees, releases, evidence, and blueprint status (version assigned at activation)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Release classification:** minor. It is the first slice of the roadmap's
"Projections & console" rung and adds a new workspace package with a runtime
capability; no kernel, compiler, or skeleton contract changes. Assigned at
activation under the standing opt-out default: the first wave-1 order to merge
takes the next minor above the latest published tag, and the second retimes
with a dated note at its integration step (06-roadmap.md §Release boundary).
**Nomination provenance:** the 2026-09-06 planning pass, from the operator's
dispatch asking for "a UI to see what's going on with dotln and our vision
around it" and accepting "a basic UI in dotln's primary repo" as a route.
Planner-synthesized draft; the unedited dispatch is preserved locally in
`docs/intake/notes/2026-09-06-phase-two-planning-dispatch.md`. Opaque
identifier, not a priority. The clean-room screen found no employer,
credential, internal-service, or other stop condition.
**Depends on:** WO-030 merged (`status --json` `orders[]`; satisfied at
`v0.7.0`); WO-026 merged (the generated index; satisfied at `v0.5.2`); WO-021
merged (`worktree constellation`; satisfied at `v0.8.0`); WO-028 merged
(`recordedAt` and `elapsed`; satisfied at `v0.5.1`); WO-031 merged
(`resume usage`; satisfied at `v0.10.1`).
**Recommended placement:** wave 1, lane A, beside WO-033, with which it shares
no primary write surface; the two form the first paired wave. A
recommendation, not a dependency token.

**Cites (read these sections):** 04-interfaces.md §Terminal first, console
equal (the console invokes the same commands; a read-only v0 invokes none),
§Plural UI hosts, one projection contract (no host may grow a second workflow
state machine; framework selection waits for representative evidence), §Agent
projection (the sparse twin), and §Glyph system (the visual grammar and its
accessibility rules); 13-uifa-roles.md §UIFA showrunner and §Assistance the
platform owes each role ("a shared status view" is the showrunner's next
tooling); 06-roadmap.md §Application version pending — Projections & console
(the zero-asset static page is the sanctioned prototype zero) and §Work-order
navigation and identity (three answers kept separate); 12-workstream-
application.md §Arriving at the desk (the first screen's four questions);
03-architecture.md §Session lifecycle & resilience (`status --json` is the
machine interface; `current.md` is never an API; `constellation` reads
metadata only); 07-execution-guide.md §Operator resume phrases; 08-publication-
compiler.md §Authority and honesty rules (status labels never blur);
01-principles.md Principles 1, 11, and 16; ADR-0002 Decision 3 and its
2026-09-05 dependency-posture amendment (zero runtime dependencies; the UI
framework stays undecided until the console rung's evidence);
`docs/publication/audience-status-index.md`, `docs/planning/capability-table.md`,
`docs/planning/work-order-map.md` (the marked sequence block),
`docs/work-orders/README.md` (generated), `scripts/resume.mjs`
(`statusProjection`, `usage`), `scripts/lib/beacons.mjs` (`constellation`),
`scripts/release.mjs` (`list`).

**Objective:** Give the operator one screen that answers the showrunner's
questions — what is active, blocked, verified, and closed; which actor did it
and how long it took; what each release contained; which worktrees are alive
and how fresh their Beacons are; what the next legal action is — and the
product lead's question — how much of the blueprint is vision, specified,
planned, implemented, or verified — as a pure, read-only projection over the
machine-readable sources that already exist, rendered in the terminal and as a
zero-dependency static HTML page, without a UI framework, a network service,
a new control event, or a second state machine.

**Observed gap (dated 2026-09-06, `main` at `v0.13.1`):**

- The showrunner's answers are spread over five surfaces that nothing
  composes: `resume status --json` (selected order plus `orders[]`), the
  generated work-order index, `worktree constellation`, `release list`, and
  `resume usage --json`. Product 13 names "a shared status view" as the role's
  next tooling; product 06's console rung is "Application version pending"
  with no first slice; the concurrent work-orders plan lists the shared view
  as an unfiled slice.
- Blueprint progress is inferable only by reading: the publication index
  classifies 232 product headings by status, the capability table carries
  levels, and the roadmap carries rungs. No surface counts or renders them.
- The only visual projection in the repository is the skeleton's one-line
  glyph scene. The roadmap's "printed to terminal or a static HTML page — zero
  assets, a pure projection of the log" has never been built.
- The two sibling repositories exist and are empty (public API, 2026-09-06).
  The console-framework decision is deliberately deferred to representative
  evidence (ADR-0002 Decision 3; 04 §Plural UI hosts). A first console inside
  this repository must not pre-decide it or pull a UI toolchain into
  `npm test`.

**Design (scope discipline):**

- **One pure projection.** A new workspace package `packages/console`
  (`@dotln/console`, TypeScript, strict `tsc`, zero runtime dependencies)
  exports `projectShowrunnerBoard(inputs): BoardViewModel` with
  `boardVersion: 1`. Inputs are values already produced by documented
  interfaces, supplied by a thin host: the `status --json` object, the
  `usage --json` object, the `constellation` text, the `release list` text,
  the H1 and metadata of each work-order file, the file lists of
  `docs/verifications/WO-NNN/` and `docs/final-reviews/WO-NNN/`, the marked
  sequence block of the planning map, the publication audience/status index,
  the capability table, and the roadmap's rung headings. The projection never
  folds control segments itself and never imports `scripts/`; it consumes
  outputs, so WO-033's refactor of the providers cannot collide with it.
- **Sections, each with a source and a freshness stamp.** (1) Orders: every
  known order with phase, latest verdict, elapsed phases, attested actor,
  release attribution, and links to its authority, `VER-NNN`, and `FINAL-NNN`
  files, grouped active / awaiting verification / closed / open drafts /
  historical, with the selected order's legal next actions. (2) Sequence: the
  map's marked block with the same completion marks the generated index uses.
  (3) Worktrees and Beacons: the constellation rows with fresh, stale, absent,
  and flagged glyphs and their text equivalents. (4) Releases: local annotated
  tags with application version and included orders, plus the GitHub Releases
  link. (5) Blueprint status: per product document, the count of headings in
  each publication status; capability rows with current and target level;
  roadmap rungs with the order and index state each names. (6) Actors: the
  `usage` totals by actor and phase. (7) Order detail, the founding corpus's
  workstream page as synthesized in 12 §Arriving at the desk and 04 §Agent
  projection: for the selected order, its authority and objective, current
  phase and legal next actions, the active build (the compiled item tooltip
  and semantic hashes of the shipped loadouts through the compiler's existing
  tooltip render), running episodes and the acceptance-evidence matrix from
  `dotln status --store --json` when a store exists, changed files from the
  worktree's `git diff --stat`, evidence links, and the control-event
  timeline; a source absent in this profile renders as `not available`, never
  as empty success. (8) Siblings: when `docs/siblings/README.md` exists
  (WO-033 creates it), one row per first-class sibling repository with its
  purpose, upstream relation, the kit manifest version or contract version it
  carries, the orders in core that advanced it, and its capability rows; the
  section is absent, not empty, until the registry exists. Every number names
  its source; `unknown` stays `unknown`; nothing is estimated (Principle 11).
  The page works offline over local files and command output, which the
  founding corpus asked of any launchpad dashboard.
- **Two renderers of the same view model.** `npm run console -- board`
  prints the terminal projection. `npm run console -- render --out <dir>`
  writes `index.html` into an explicitly selected directory that must be
  gitignored when inside this repository and may never be under `docs/`. The
  page has no external assets, no network requests, and no framework; inline
  CSS applies the 04 visual grammar (reduced opacity = dormant, blur = stale,
  vertical flip = failed, red silhouette = blocking) with
  `prefers-reduced-motion` honored and a text equivalent beside every glyph.
  An optional `--serve` uses `node:http` only to re-render on reload. The page
  is a projection: it invokes no command and holds no state. Command
  invocation from a console is a later slice with its own parity contract.
- **Inputs are documented formats.** Where a source has no JSON form
  (constellation, release list, the index), the console parses the pinned text
  the existing suites already assert, with refusal on drift. Adding `--json`
  forms to those commands is nominated as a bounded follow-on in the planning
  map, not done here, to keep the wave-1 write surfaces disjoint.
- **Declined alternatives, recorded:** an Angular or Nx shell inside this
  repository (framework decision deferred; toolchain weight in the evidence
  gate); a live server that executes commands (second-state-machine risk); a
  package that folds control segments directly (would duplicate the shared
  fold or invert the package/script dependency direction).

**Deliverables:** `packages/console` with the pure projection, the terminal
and HTML renderers, and a small CLI; the root `console` script and workspace
entry; recorded fixture inputs and pinned outputs; tests wired into the root
`npm test` chain; an evidence receipt under `docs/evidence/WO-032/README.md`
containing the real-repository terminal render at the activation base; the
write-backs below.

**Acceptance criteria (all required)**

1. Over fixture inputs covering orders in `active`, `ready-to-verify`,
   `needs-fix`, `verified`, `final-review`, and `closed` phases, an order
   without an attestation, historical orders, Beacons that are fresh, stale,
   absent, and flagged, a worker store with running episodes and a partly
   stale acceptance matrix, and an order with no store, the projection is
   deterministic and both renders match their pinned fixtures byte for byte;
   the order detail's active build shows the same tooltip and semantic hashes
   the compiler's tests pin.
2. Over this repository at the activation base, `npm run console -- board`
   lists every order the generated index lists, with the phase and verdict
   `status --json` reports; a disagreement between two sources renders as a
   labeled conflict and is never silently resolved in either direction.
3. The blueprint counts equal the publication index's rows per document, the
   capability rows equal the table's current rows, and the rung list equals
   the roadmap's ladder headings, each proven by a test that reads the same
   files; no other number appears on the board without a named source.
4. The HTML page contains no external resource references and no script
   except the optional inline refresh under `--serve`; a structural check
   proves that; every glyph has a text equivalent; motion is disabled under
   `prefers-reduced-motion`.
5. The console invokes only the read-only commands named above or reads
   files; it appends no control event, writes only under the selected output
   directory, refuses an output path under `docs/` or `docs/intake`, and
   leaves `git status`, every control segment, `current.md`, and the generated
   index byte-identical after a render (`cmp` transcripts).
6. `@dotln/console` declares zero runtime dependencies; kernel, compiler, and
   skeleton source and versions are unchanged; the new tests run inside the
   root `npm test` chain and it is green; `git diff --check` is clean.
7. Write-backs land: 04 §Plural UI hosts (a dated "Showrunner board v0"
   paragraph naming what is read-only and what waits for the parity
   contract); 13 §Assistance the platform owes each role (showrunner "today"
   column); 06 §Projections & console (first slice named, framework decision
   still pending); README "What runs today" (one paragraph and the `console`
   commands); `docs/README.md` map; the root release block; the publication
   index rows for any new heading with both edition locks repaired; a dated
   capability-table addition for `projection.showrunner-board` at level 1;
   ledger entry.

**Evidence gate:** the fixture transcripts for criteria 1 through 5; the real-
repository render for criterion 2; `npm test`.

**Write-back duty:** as listed in criterion 7. Record in the result which
sources were parsed as text and nominate their JSON forms in the planning map.

**Non-goals:** command invocation from the page; a web server beyond the
optional local re-render; Angular, Nx, Babylon.js, or any framework; the RPG
loadout editor or build inspector; the sparse agent projection (it exists);
new control events, transitions, or Beacon codebooks; workstream or
multi-repository views (WO-034 extends the view model); editing any provider
under `scripts/`; token, cost, or attention telemetry.

**Operator-review assumptions**

1. A read-only board is an acceptable first console and the visible payoff
   of this rung.
2. Terminal plus static HTML is the v0 shell; the Angular shell arrives as
   console v1 through the launchpad pilot in the operator's DotLn-Angular
   repository, after a framework decision with that evidence.
3. Parsing pinned generated text is acceptable until JSON forms exist.
4. The board serves the UIFA showrunner and, through the blueprint section,
   the UIFA product lead; it introduces no human role as data.
