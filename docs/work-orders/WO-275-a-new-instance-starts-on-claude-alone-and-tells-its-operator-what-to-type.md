# WO-275 — A new instance starts on Claude alone and tells its operator what to type: the first order and the security seed ask about the hosts an instance elects and permit no call to a harness, a discovery record no longer turns a host on, the operator's commands for the release in hand are one generated page, and what core should hear is one file at the instance's root that each final review and each planning pass writes

**Model:** any capable model. State the model and effort actually run
(07-execution-guide.md §Model-specific notes).
**Effort:** executor xhigh; verifier xhigh; reviewer high.
**Track:** delivery
**Release classification:** minor. Two seeds reworded; one source of host
inference removed; one generated page and the command that prints it; one
new seed and a sentence in two roles' text. No refusal is added or
tightened. Assigned at activation under the standing opt-out default.
**Cost:** adds, in `scripts/kit/first-order.template.md` and
`scripts/kit/AI-HARNESS-SECURITY.template.md`, the elected hosts in place
of every harness installed; `scripts/lib/operator-commands.mjs` with its
entry in `scripts/lib/generated-artifacts.mjs`, the generated page
`docs/OPERATOR.md` in the kit's file list and a `commands` subcommand of
`scripts/launchpad.mjs`, recurring work in core's generated check (one
read of the kit guide and one comparison; unmeasured, and measured by this
order); `scripts/kit/for-core.template.md`, seeded as `FOR-CORE.md` at an
instance's root through `scripts/launchpad.mjs` and
`scripts/lib/starter-seeds.mjs`; in `scripts/docs-check.mjs`, the shape
check of that file's entries, recurring work in the document gate over one
file (unmeasured, and measured by this order); in
`packages/skeleton/src/loadouts/contributor.ts`, one sentence for the
final reviewer and one for the planner; cases in the suites the Preflight
names; the kit guide, product 07 and the decisions. Removes, from
`scripts/lib/features.mjs` (`hostRecord`), the discovery record as a
source that turns a host on. Removes these states: a new instance's first
order looking for every agent harness on the machine and calling each; a
host turned on because that order recorded its version; an operator
following a command list a planning pass wrote by hand for one release;
an operator asking each instance what core should hear and reading it out
of pass documents. Tokens and wall-clock: unknown until this order's
handoff records them. Re-mints: every installed role root and the role
baseline, once, from the two role sentences, as `scripts/check-role-oracle.mjs`
requires until WO-264 removes that chain; the executor names any other
edition `npm run sync` reports. The files this order edits are declared
sources of machinery suites, so the final criterion names `npm test --
--review`. Steps: the executor's, below.
**Nomination provenance:** the operator's findings from a new instance's
first cycle on the work laptop, 2026-11-09, at starter v0.122.1: that the
first order went through every harness and provider it knew of and called
each, where Claude is the default unless the operator says otherwise
(ignored capture SHA-256
`5f21df63b6d668b25ea93859af6a87396d5afed9c5d11d6ef34d1e27e54ee50f`); that a
command list kept current with each release would spare a planning pass
(`394db09ac4b950c801bc9f06256bc9e1ac81e00c241e52a9f3c936f7bdb11e92`); and
that what core should hear belongs in one findable place that a final
review writes as a planning pass does
(`1eff9b69860dc02244d9ad75aee6f709dd955375917531fe4ec90cd76b674dc9` and
`06895d90d9cdfdb6f13e9132a22ecfe57aa7c1564d43ec12451fafa3e28288dd`).
**Depends on:** WO-258 (closed, v0.121.0: hosts as elections and the
starter refresh that adds a seed a starter lacks); WO-259 (closed: the
words screen every committed file passes). No open order.
**Recommended placement:** first. Every clone of the starter repeats the
first order's inspection until this order's release, on machines where a
call to another provider is not the kit's to make.
**Cites (read these sections):** `scripts/kit/first-order.template.md`;
`scripts/kit/AI-HARNESS-SECURITY.template.md`; `scripts/lib/features.mjs`
(`HOST_FEATURES`, `hostRecord`, `readHostFeatures`); `scripts/resume.mjs`
(the discovery record's reading for an attested host's advisory);
`scripts/lib/generated-artifacts.mjs` (how an artifact is checked and
written); `scripts/launchpad.mjs` (the kit's file list, `KIT_TEMPLATE_FILES`,
the export's `addSeed` calls, the `preview` subcommand);
`scripts/lib/starter-seeds.mjs` (`seeds`, `exportSeedPaths`);
`scripts/docs-check.mjs` (how a typed block in a document is judged);
`packages/skeleton/src/loadouts/contributor.ts` (the reviewer's and the
planner's procedures); `scripts/check-role-oracle.mjs`; the kit guide
§First steps, §Features, §Planning in this instance, §Releases in this
instance and §Taking upstream updates; product 07 §Operator-opened
planning pass, item 5.

**Objective:** A person who clones the starter gets an instance that uses
Claude Code and looks for nothing else until told to. That person reads
the commands of the whole cycle for the release in hand from one page the
kit keeps true, and finds what the instance has learned that core should
hear in one file, written without being asked for.

**Observed gap (dated 2026-11-09 at `main` `06c1ddc1a`, v0.122.1):**

- The first order looks for every harness and calls each. The seed
  `scripts/kit/first-order.template.md` permits one smoke invocation per
  harness surface in its Authority, asks in its second checklist item for
  each AI coding harness as installed, puts its audit questions to each
  harness, and records each under `effortReadbackProbe.harnesses`. Since
  v0.121.0 a clone starts Claude-only (WO-258-D003), and WO-258 edited
  that seed and left the inspection in it. By the operator's report, a
  new instance's first order on the work laptop went through the
  harnesses and providers it knew of and made test calls. The kit names
  three harnesses and no other provider; a session that reached further
  did so on that order's words. `scripts/kit/AI-HARNESS-SECURITY.template.md`
  asks in the same way for the posture of each harness.
- That inspection then turns the hosts on. `hostRecord` in
  `scripts/lib/features.mjs` counts an observed version in
  `docs/discovery/environment.json` as a record that shows a host, so a
  first order that found another harness's CLI makes the next emit write
  that host's surfaces with no election.
- No page lists the operator's commands for a release. The kit guide
  carries them inside its sections' prose, and a release's notes carry
  Read before upgrading. The one compact list is a section of the
  2026-11-07 pass document, written by hand for v0.120.1; its setup lines
  for the lineage index stopped applying at v0.121.0, and the operator was
  following it on the work laptop on 2026-11-09.
- What core should hear has no place of its own. An instance's planning
  pass writes a block for core inside its own planning document, and no
  other role writes one, so the operator asks each instance for it and
  reads it out of pass documents. A final review, which has read an
  order's whole record, writes nothing for core.

**Design (scope discipline):**

- Claude Code is the default host and the only one a new instance has.
  The seeded first order inspects the host its session runs in and any
  host that `features.host-codex` or `features.host-copilot` elects in
  the instance's configuration. It names no other harness or provider,
  looks for none on the machine, asks no version of one and permits no
  invocation of any harness; the live smoke stays the instance's own
  choice, as that order's third item says. Its discovery record and its
  audit questions cover the elected hosts, and the security seed asks for
  the posture of the same hosts. Rejected: keeping the inspection behind
  a question to the operator (the axis is the default: nothing looks
  unless it is told to).
- A discovery record no longer turns a host on. An attestation in the
  instance's control log still does, since a phase run under a host is
  the operator using it, and an election decides either way. This
  repository elects in its own configuration each host its record shows
  only in the discovery file, so its emitted surfaces do not change.
  Rejected: ending inference from attestations as well (the axis is what
  was explicit: an attested phase ran under that host on the operator's
  own dispatch).
- The operator's commands are a generated page. The kit guide marks each
  command block of the operator's cycle with the step it belongs to: a
  new instance, the first pass, running an order, closing it, taking a
  release, registering a repository, and telling core. A build-free
  module reads those blocks in the cycle's order, with the one sentence
  each step carries, into `docs/OPERATOR.md`, which names the kit's
  version and ships in every release; `node scripts/launchpad.mjs
  commands` prints it in an instance before any install. The page is a
  generated artifact of core, so a write-back that changes a marked block
  changes the page or the generated check fails. Rejected: a page written
  by hand at each release (the axis is who keeps it true: that is the
  list that went stale). Rejected: printing the kit guide's sections
  whole (the axis is the reader's task: an operator at a terminal wants
  the lines to type).
- What core should hear is one file. `FOR-CORE.md` is seeded at an
  instance's root and is the instance's own. An entry is a second-level
  heading (the date, the order or pass it came from, one line) over a
  marked block of typed fields (the kit's version, whether it stops this
  instance's next order, and whether a release has answered it) and then
  plain prose in generic words: what the kit did, what was expected, the
  command and its message, and the route used meanwhile. Each order's
  final review appends what the kit itself got wrong or made hard during
  that order, where it found anything; each planning pass reads the file
  at entry, appends its own entries there, marks the ones a taken release
  answered, and writes no block for core in its own document. The
  operator opens one file and paraphrases or sends it. The file is
  committed text, so the local-terms screen and the private-path screen
  judge it as they judge every document. Rejected: a file per order or
  per pass (the axis is the operator's question: one place to look).
  Rejected: sending anything from the instance (the axis is authority:
  what leaves an instance is the operator's to send).
- The rule that an instance sends core only what stops its next order
  stays. The file holds more than that, each entry saying whether it
  stops the next order, and what the operator carries to core is the
  operator's choice.

**Execution plan (the executor follows these steps in order; observed at `06c1ddc1a`, 2026-11-09):**

1. `scripts/kit/first-order.template.md` and
   `scripts/kit/AI-HARNESS-SECURITY.template.md`: rewrite to the hosts of
   the Design's first item the first seed's Authority, second checklist
   item, audit questions, deliverable shape and second criterion, removing
   the permitted smoke invocation, and the second seed's opening and its
   paragraph on settings layers. The cases of
   `scripts/test-launchpad-seeds.mjs`, `scripts/test-launchpad-planning.mjs`
   and `scripts/test-launchpad-update.mjs` that read either seed change
   with them, and one refuses a first order that holds the phrases `each
   AI coding harness` or `smoke invocation`. Check: `npm test -- --only
   launchpad` and `npm test -- --only launchpad-planning`.
2. `scripts/lib/features.mjs` (`hostRecord`): drop the discovery record
   from the rows that show a host and keep the attestations;
   `scripts/resume.mjs` keeps its own reading of that record. Elect in
   this repository's `dotln.config.json` each host the feature inventory
   reports as inferred from the discovery record alone. Check: `npm test
   -- --only configuration-root` and `node scripts/harness.mjs check`,
   with the emitted surfaces compared with the base's.
3. `scripts/lib/operator-commands.mjs` (new), `docs/KIT.md` (the markers
   on the cycle's command blocks, with one sentence for each step),
   `scripts/lib/generated-artifacts.mjs` (the artifact, checked and
   written as the others are, in core) and `scripts/launchpad.mjs` (the
   `commands` subcommand, the page in the kit's file list and the
   generated `package.json`'s script): generate `docs/OPERATOR.md` and
   print it. Record the generated check's added time. Check: `npm test --
   --only sync-fixtures`, `npm test -- --only launchpad` and `npm test --
   --only launchpad-docs`.
4. `scripts/kit/for-core.template.md` (new), `scripts/launchpad.mjs`
   (`KIT_TEMPLATE_FILES` and the export's `addSeed` calls) and
   `scripts/lib/starter-seeds.mjs` (`seeds` and `exportSeedPaths`): seed
   `FOR-CORE.md` with its heading, the entry form and no entry.
   `scripts/docs-check.mjs`: judge the typed block of each entry in a root
   that holds the file, naming the entry and the field on a failure.
   Record the document gate's added time. Check: `npm test -- --only
   launchpad` and `npm test -- --only docs-check-fixtures`.
5. `packages/skeleton/src/loadouts/contributor.ts` (the reviewer's and the
   planner's procedures): the reviewer's sentence and the planner's of the
   Design's fourth item, each applying where the root holds the file.
   Then `npm run sync` and the role baseline. Check: `npm test -- --only
   skeleton`, `npm test -- --only process-debt` and `node
   scripts/harness.mjs check`.
6. Write-backs, each replacing the sentence now wrong and linking this
   order's decisions: the kit guide §First steps (the first order's hosts,
   and the page as where the commands are), §Features (a discovery record
   shows no host; an attestation or an election does), §Planning in this
   instance (the file in place of the block in a pass document) and
   §Releases in this instance (the final review's entry); product 07
   §Operator-opened planning pass, item 5 (an instance pass writes to the
   file); `docs/evidence/WO-275/decisions.md`. Then the handoff sequence
   of product 07 §Discipline.

**Deliverables:** the two seeds for elected hosts only; the host record
without the discovery source; the operator's commands page, its generator
and the command that prints it; the seeded file with its entry check; the
two role sentences; the cases; the write-backs and the decisions.

**Acceptance criteria (all required)**

1. A fresh export's first order and security seed name no agent harness
   or model provider other than Claude Code, permit no invocation of a
   harness, and say that another host is inspected only when the
   instance's configuration elects it. The seed case refuses a first
   order that holds either phrase of step 1, and the verifier reads both
   seeds.
2. With a discovery record that holds observed versions of `codex-cli`
   and `copilot-cli`, no election and no attestation, the feature
   inventory reports both hosts off and the emit writes Claude's surfaces
   alone; with an attestation under a host it reports that host inferred,
   as at the base; and this repository's emitted surfaces are the bytes
   they are at the base.
3. `docs/OPERATOR.md` in a fresh export names the kit's version and
   holds, in the cycle's order, every command block the kit guide marks,
   byte for byte; `node scripts/launchpad.mjs commands` prints the same
   blocks there before any install; and after a marked block of the kit
   guide changes in a scratch copy, the generated check fails naming the
   page until it is regenerated.
4. A fresh export holds `FOR-CORE.md` equal to its template; the starter
   refresh adds it to a starter that lacks it and leaves an instance's own
   file byte-identical; `node scripts/docs-check.mjs` passes an entry of
   the stated form and fails, naming the entry and the field, on an entry
   that lacks a field or holds a value outside its set.
5. The emitted reviewer root says that a final review appends to
   `FOR-CORE.md` what the kit got wrong or made hard during the order,
   and the emitted planner root says that a pass reads the file at entry,
   writes its own entries there and writes no block for core in its
   document, each where the root holds the file; by the case of the
   skeleton suite that reads the emitted roots (`npm test -- --only
   skeleton`), and `node scripts/harness.mjs check` shows the installed
   roots equal the emitted ones.
6. The kit guide's four sections and product 07's item state the hosts,
   the page and the file as steps 1 to 5 leave them, each linking this
   order's decisions. The verifier reads the named sections; `npm run
   test:docs` judges their links and form.
7. `npm test -- --review`, `npm test` and `npm run test:docs` pass.

**Preflight:** `npm test -- --only launchpad` for steps 1, 3 and 4;
`npm test -- --only launchpad-planning` for step 1; `npm test -- --only
configuration-root` for step 2; `npm test -- --only sync-fixtures` and
`npm test -- --only launchpad-docs` for step 3; `npm test -- --only
docs-check-fixtures` for step 4; `npm test -- --only skeleton` and `npm
test -- --only process-debt` for step 5; the structural phase; the
complete run with `npm test -- --review` at final review.

**Evidence gate:** under `docs/evidence/WO-275/`: the two seeds as
exported; the two inventories and the emitted surfaces' comparison of
criterion 2; the page, the command's output and the failing generated
check of criterion 3; the passing and failing entry checks of criterion
4; the times of steps 3 and 4; `npm run resume -- status --json` after
`implementation-ready`.

**Write-back duty:** as listed in step 6 and criterion 6; sources and
reopening conditions in `docs/evidence/WO-275/decisions.md`.

**Known issues and carry-ins:**

- FUP-e4189f78a94f2893 (the operator's commands and what core should
  hear): this order is its allocation.
- An instance that ran the earlier first order keeps the rows that order
  wrote in its discovery record. After this order they turn no host on.
  What the next emit does with surfaces an earlier emit wrote for such a
  host is recorded by the executor, and the release's Read before
  upgrading names the command. Until an instance takes this release it
  sets `features.host-codex` and `features.host-copilot` to `false`,
  which the kit respects today beside a record that shows the host.
- A first order already seeded in an instance is that instance's file and
  no update rewrites it. The release's Read before upgrading says which
  lines to change in one that has not run.
- The role skills name Codex as the other host a worker runs on when the
  operator's dispatch line names it. That is an election by the
  operator's own words and is unchanged.
- This order runs before WO-262 and WO-264, so it runs today's full
  review ladder and edits role text under the chain of baselines WO-264
  removes.
- WO-265's host report lists the agent CLI of elected hosts only and
  reads the same election; WO-265 also changes the first order's host
  questions after this order has rewritten that seed.
- The page carries the kit guide's blocks and one sentence a step. What a
  release changed for an instance stays in that release's Read before
  upgrading.

**Non-goals:** removing a host's support; inference from attestations; a
host report (WO-265); sending anything from an instance to core; a
command that files an entry; core reading an instance's file; a rewrite
of the kit guide's prose beyond the markers and the sentences this order
names.

**Operator-review assumptions:** that a host the operator has not elected
is never looked for, asked its version or called, by an order, a seed or
a command; that the kit guide's own command blocks are the right source
for the operator's page; that a final review is where an order's lessons
for core are written, and one root file where they are kept; and that
what leaves an instance stays the operator's to send.
