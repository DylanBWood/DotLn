# WO-077 — Launchpad export update: `launchpad export --update <dir>` refreshes an existing export's kit files by manifest, refuses locally modified ones, touches no instance file without the instance's opt-in, and prints the instance actions and the re-emit instruction (v0.74.0)

**Model:** any capable model. State the model and effort actually run in the
result (07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh+; verifier xhigh+; reviewer any.
**Track:** delivery
**Release classification:** minor. One command mode over the kit manifest.
Assigned at activation under the standing opt-out default.
**Cost:** adds `--update` to `scripts/launchpad.mjs`, the kit's dated
instance-actions note, `--apply` behind one opt-in field in
`scripts/lib/config.mjs`, fixture exports and a fixture instance with a
resident, the client README template's update section and at most 200 bytes
in product 07. Removes the hand refresh of an export: without it a fork
takes core's improvements only by hand. WO-078 depends on it. Re-mints:
none; `scripts/launchpad.mjs` is in no evidence inventory, and
`scripts/lib/config.mjs` is excluded from every inventory with a recorded
reason. Wall-clock, tokens and context bytes are unknown until run.
**Nomination provenance:** WO-033's `--update` item, cut into a bounded
child at the operator's 2026-09-08 correction; the operator's chain made
mechanical (core → starter by this command; starter → forks by ordinary
upstream merge). Planner-synthesized draft. Opaque identifier, not a
priority. Clean-room screen: no stop condition. Amended by the 2026-09-28
planning pass, which re-observed the order on `main` at `5f3849ec`: the
opt-in is named as a configuration field with its write-back, applied
actions are listed in the command's output rather than as control events,
the resident fixture runs on the kit's runtime, and the map's carry-in is
written in
([planning document](../planning/failures-across-phases-2026-09-28.md)
§10).
**Depends on:** WO-074 merged (a prior manifest to update from); WO-075
merged (the kit runtime a resident inside an exported instance runs on);
WO-167 merged (closed, v0.53.1; its fold is history, and product 07's
ceiling is planning's).
**Recommended placement:** in the serial run after WO-076 and before
WO-078. This order edits `scripts/launchpad.mjs`, `scripts/lib/config.mjs`,
the client README template and product 07; WO-078 edits
`scripts/launchpad.mjs` and product 07 after it, and WO-073 may edit
`scripts/lib/config.mjs` before it. A recommendation, not a dependency
token.

<!-- dotln-dependencies:start -->
[
  {
    "workOrderId": "WO-074",
    "relation": "hard",
    "reason": "a prior manifest to update from"
  },
  {
    "workOrderId": "WO-075",
    "relation": "hard",
    "reason": "the kit runtime a resident inside an exported instance runs on"
  },
  {
    "workOrderId": "WO-167",
    "relation": "hard",
    "reason": "closed at v0.53.1; retained as the fold this order's product 07 write-back followed"
  }
]
<!-- dotln-dependencies:end -->

**Cites (read these sections):** 03-architecture.md §Platform and instance
boundary; ADR-0006 Decision 7; `scripts/lib/config.mjs` (the closed section
list) and 07-execution-guide.md §Where the control plane finds its
documents; 07 §Discipline (outside-project write grants);
`scripts/lib/control.mjs` (the closed control event set);
`scripts/check-registrations.mjs` (JSONL under `docs/`); the
[2026-09-28 planning document](../planning/failures-across-phases-2026-09-28.md)
§10.1; `docs/work-orders/WO-033-compiled-starter-export.md`, as history
only (the update and instance-actions sentences of the Design bullet led
"Kit, instance, and the instance's build overlay are separate sets of
files.").

**Objective:** `--update` requires a prior manifest; replaces a kit file only
when its current bytes still match the prior manifest's hash; lists and
refuses to overwrite a kit file the instance modified locally; adds new kit
files; removes kit files the new manifest dropped only when unmodified;
touches no instance file unless the instance opted in to `--apply`;
rewrites `UPSTREAM.md` and the manifest to the new commit; prints the dated
instance-actions note when the kit carries one; and prints the re-emit
instruction; it refuses without a prior manifest.

**Observed gap (dated 2026-09-28, `main` at `5f3849ec`; first observed
2026-09-08 at `33e2c25`):**

- Nothing refreshes an export: `scripts/launchpad.mjs` does not exist, and
  WO-074 is open.
- The configuration loader is closed: its sections are a fixed list and an
  unknown key refuses, so an instance's opt-in to `--apply` needs a field
  added to `scripts/lib/config.mjs` and to the list 07 §Where the control
  plane finds its documents states.
- Control events are a closed typed set (`scripts/lib/control.mjs` refuses
  an unknown type), and the registrations suite requires every JSONL under
  `docs/` to be an event stream or a classified protocol.
- A resident host, derived orders and cadences exist in core
  (`packages/skeleton/src/resident-host.ts`,
  `scripts/lib/derived-orders.mjs`, the kernel's `Cadence`); an exported
  instance runs them only on the runtime WO-075 carries.
- The umbrella this order was cut from said the command never applies an
  instance action itself; this order's Design adds an opt-in `--apply`.

**Design (scope discipline):**

- Without opt-in the command never applies an instance action; the note is
  the kit's, dated. An instance may opt in through one configuration field
  to `--apply`, which performs only the kit-declared mechanical instance
  actions (a renamed root, a new configuration field with its default, a
  changed phrase), lists each applied action in the command's output, and
  refuses any action the kit did not declare; the output of an update
  without opt-in and of an opted-in one says which it was.
- Input the update cannot read refuses before any write, naming the path: a
  prior manifest that is absent or malformed, and a kit file whose bytes
  cannot be read.
- Updates flow core → starter by this command, run by the operator and
  landed in the starter as an ordinary reviewed change, and starter → forks
  by each fork's upstream merge, which touches only kit files; nothing
  refreshes a fork automatically.
- Carried in from the map's row (WO-144, 2026-09-19): the update writes
  outside the project; a destination outside the roots the role is granted
  needs an operator-named absolute root on the executing role or an
  equipped support, since order contracts do not yet supply grants. The
  fixtures write under the system temporary root, which the default roles'
  grants cover.
- **Declined alternatives, recorded:** automatic refresh of any fork without
  its opt-in (never); a three-way merge of kit files (refusal is the
  reviewable path); a control event per applied action (a new event type
  is a schema change this order does not make; reopen if WO-078's receipts
  need the actions).

**Execution plan (the executor follows these steps in order; observed at `bd437eb2`, 2026-10-07; steps 2, 4 and 5 are written against WO-074's files and re-read at the base):**

1. `scripts/lib/config.mjs`: add a `kit` section with one boolean `applyInstanceActions`
   (default false): add it to `SECTION_KEYS` (line 84), add `validateKit(path, declared)`
   using `requireObject` and `requireKnownKeys`, and add it to `validateConfig` and
   `absentConfig` (line 633). `scripts/test-configuration-root.mjs`: add the case
   "a kit section admits only applyInstanceActions as a boolean".
   Check: `npm test -- --only configuration-root`.
2. `scripts/launchpad.mjs`: `export --update <dir> [--apply]`. `readPriorManifest(dir)`
   refuses an absent or malformed `KIT-MANIFEST.json` before any write, naming the path.
   `planUpdate(prior, next, dir)` sorts each path as unmodified-replace, modified-refuse,
   dropped-remove (only if unmodified) or new-add; instance files are never touched; an
   unreadable kit file refuses before any write. Apply the plan, rewrite `UPSTREAM.md` and
   `KIT-MANIFEST.json` (a refused, locally modified file keeps its prior hash in the manifest
   and is listed in the dated note, so the next update refuses it again), and print the
   dated note, the refused list, `opted-in update` or `update without opt-in`, and
   `re-emit: node scripts/harness.mjs emit`.
3. Same file: `applyInstanceActions(dir, actions)` refuses unless
   `loadConfig(dir).kit.applyInstanceActions` is true, performs only declared kinds, and
   prints one line per applied action. Actions are typed, never read from the note.
4. `scripts/kit/KIT-ACTIONS.json` (new, manifest-listed):
   `{ "schemaVersion": 1, "actions": [{ "id", "date", "kind": "rename-root" | "add-config-field" | "change-phrase", ...typed fields }] }`,
   empty at first; the printed dated instance-actions note is rendered from it; `--apply`
   refuses any `kind` outside the list. After export the fork's `CLAUDE.md` is an instance
   file, so a `change-phrase` action edits it only under the opt-in. Add the update section to
   `scripts/kit/README.client.md`.
5. `scripts/test-launchpad.mjs`: build two commits in a synthetic source repository (B drops one
   kit file, adds one and changes one) and export A. Cases: update replaces unmodified kit files,
   refuses a modified one, keeps instance and overlay files, removes the dropped file, adds the
   new one, rewrites the manifest and `UPSTREAM.md`, prints the re-emit line; update refuses
   without or with a malformed prior manifest before any write; update prints the dated note;
   `--apply` without opt-in refuses and changes no instance file; `--apply` with opt-in performs
   and lists declared actions and refuses an undeclared one; an opted-in update keeps a
   resident's log, derived identities and next cadence (follow `scripts/test-derived-orders.mjs`
   line 574: `ResidentHost` start, tick, close; `replayResident`; `materializeOrder`), loading
   `resident-host.js` from the export's `packages/skeleton/dist/src` (WO-075's runtime subset
   must carry it; the executor checks and otherwise records the case as blocked on WO-075 with
   the file name). Check: `npm test -- --only launchpad`.
6. Write-backs: `scripts/kit/README.client.md` sections for taking upstream updates and for
   opting in; `docs/product/07-execution-guide.md` §"### Where the control plane finds its
   documents": add `kit` to the sentence that lists the optional sections and one sentence for
   the field, in place; `docs/evidence/WO-077/decisions.md` (the field, the action format, what
   the manifest records for a refused file); `node scripts/check-publication.mjs --print-locks`
   into `docs/publication/audience-status-index.md`; `npm run publication:check`.
7. Handoff sequence: `npm run format`; `npm run test:docs`; `npm test -- --review`;
   complete `docs/evidence/WO-077/handoff.md`; `npm run resume -- implementation-ready <flags>`.

**Deliverables:** the mode, the opt-in field, fixtures, the write-backs
below.

**Acceptance criteria (all required)**

1. Over a fixture export with one locally modified kit file, one instance
   file, one overlay file, one dropped kit file and one new kit file, the
   update replaces only the unmodified kit files, lists the modified one as
   refused, leaves every instance and overlay file byte-identical, removes
   the dropped file, adds the new one, rewrites the manifest and
   `UPSTREAM.md`, and prints the re-emit instruction.
2. A kit carrying a dated instance-actions note prints it; without a prior
   manifest, and with a malformed one, the command refuses before any
   write; with the instance's opt-in, `--apply` performs the declared
   mechanical actions, lists each in its output, and refuses an undeclared
   one; without the opt-in, `--apply` refuses and no instance file changes.
   The criterion is judged against the declared set; a case outside it is
   a follow-up, not a failure.
3. A fixture instance with a running fixture resident on the kit's runtime
   survives an opted-in update: the resident resumes from its log after the
   update, its derived orders keep their identities, and its next cadence
   fires.
4. Write-backs land: the client README template (take upstream updates;
   opting in); 07 §Where the control plane finds its documents (the opt-in
   field), in place with no dated paragraph (ceilings are planning's: the 2026-10-07 pass set every product document's ceiling at measured bytes plus one tenth, and an overrun is an advisory the next pass reads); WO-072, WO-073, WO-113, WO-080, WO-078, WO-188,
   WO-189, WO-190, WO-192 and WO-193 also write product 07. The decisions
   file; the publication locks
   refreshed.
5. `npm test -- --review` and `npm run test:docs` green; `git diff --check`
   clean; no new dependency.

**Evidence gate:** the fixture transcripts; `npm run test:docs`;
`npm test -- --review` before `implementation-ready`, because
`scripts/launchpad.mjs` is a declared source of configuration-root, and
again at final review. No live row.

**Write-back duty:** as listed in criterion 4.

**Known issues and carry-ins:**

- Stale on 2026-10-07 and corrected above: WO-167's fold and product 07's
  headroom; the 07 co-writer list.
- Decided by the 2026-10-07 pass: the opt-in is `kit.applyInstanceActions`;
  actions are a typed `KIT-ACTIONS.json`; a refused file keeps its prior
  manifest hash; the fork's `CLAUDE.md` is an instance file after export.
  Reopen: a fork needs an action kind outside the three.
- Blocked on WO-074 (manifest schema, entry point, template directory,
  fixture helper) and WO-075 (`resident-host.js` in the runtime subset).

**Non-goals:** any fork's own upstream merge; the overlay (WO-076); an
event type for applied actions; the resident-owned loop from a starter
instance (WO-118).

**Operator-review assumptions**

1. Refusing a modified kit file is the right default; the instance resolves
   it by hand.
2. The umbrella said the command never applies an instance action; this
   order keeps the opt-in `--apply` its Design and criteria describe, so its
   title and objective say "without the instance's opt-in". The operator
   may drop `--apply`, which also drops the configuration field and the
   product 07 write-back.
