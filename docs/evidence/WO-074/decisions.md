# WO-074 decisions

## WO-074-D001

```json
{
  "id": "WO-074-D001",
  "date": "2026-10-09",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.70.0, the next minor above the observed release baseline v0.69.2, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.69.2 (local tags)",
    "minor classification declared in docs/work-orders/WO-074-launchpad-export-kit.md"
  ],
  "rejected": [
    {
      "option": "An activation-completion paragraph in the roadmap",
      "reason": "The tag is the record and the roadmap's release history is generated from tags (WO-086); this decision keeps the base and the classification."
    }
  ],
  "reopenWhen": "The observed baseline or the classification changes before publication; a later collision is recorded as its own decision."
}
```

## WO-074-D002 — The kit is the running checkout's commit; templates are blobs; the list is the launchpad's

```json
{
  "id": "WO-074-D002",
  "date": "2026-10-09",
  "dispatch": "resume: next",
  "decision": "scripts/launchpad.mjs takes the kit root from TOOL_ROOT, the checkout that holds the running scripts, and the kit commit from that checkout's HEAD. Every kit file is a Git blob at that commit, never the work tree: the scripts and packages/beacons trees, the nine build-free package modules, the three license files, the three documents (source paths through docRelative(root, key, ...), destinations through defaultDocRelative(key, ...)) and the nine templates under scripts/kit, which the export renders from their blob bytes, so a manifest never names a commit that lacks a listed file's source. A kit file absent at the commit refuses by name before any write. findLaunchpad() selects only the launchpad whose local-terms list judges the texts (exportKit(root, destination, { license, termsRoot })). When kit paths in the work tree differ from HEAD the command prints one advisory naming the count and the commit it carried; when the destination lies inside a Git work tree it prints one advisory to run git init there first. The executor's first design read kit files from findLaunchpad()'s HEAD and the templates from the running work tree; the pre-implementation refutation showed that the criterion 6 run would then publish manifest hashes for files rendered from sources the named commit does not hold, and that a DOTLN_LAUNCHPAD naming another repository would export that repository's HEAD as the kit; the design was corrected before the fixtures were filed.",
  "evidence": [
    "docs/work-orders/WO-074-launchpad-export-kit.md, Execution plan step 1 (readKitSources(root, commit) reading Git blobs at the named commit, never the work tree; TOOL_ROOT among the resolvers) and step 3 (checkLocalTerms(findLaunchpad(), surfaces))",
    "scripts/lib/config.mjs: TOOL_ROOT is the checkout that holds the running scripts and kit paths live there; every document root is resolved from a launchpad instead; scripts/lib/harness.mjs resolves kit inputs from TOOL_ROOT and the terms list from the launchpad in the same way",
    "docs/evidence/WO-070/decisions.md D009: an explicit tool root for kit inputs while outputs keep the launchpad",
    "The pre-implementation refutation (one dotln-worker, read-only, 2026-10-09): the first criterion 6 run named main's 28d32e26, which holds no scripts/kit/, under manifest-listed files rendered from this worktree's uncommitted templates",
    "scripts/test-configuration-root.mjs 'no control-plane script keeps a literal document root or a second root derivation': scripts/launchpad.mjs passes it (direct run recorded in handoff.md)",
    "docs/evidence/WO-074/launchpad-fixture.txt: the dirty-tree case shows the copied template and the rendered README both at the commit's bytes with the advisory printed; the absent-template case refuses by name and writes nothing"
  ],
  "goalAlignment": {
    "traps": "Rule beating: reading the work tree would pass byte-identity only while the tree is clean, so blobs are the only source and a dirty tree is named. Seeking the wrong goal: exporting whatever is on disk looks more useful in this worktree today and would make the manifest a lie; the fixtures commit a copy instead. Shifting the burden: letting the launchpad choose the kit commit would push the question of whose scripts a kit holds onto every reader.",
    "noOp": "No export command: WO-075 to WO-078 stay blocked and the starter stays an operator-reported intention."
  },
  "rejected": [
    {
      "option": "One root, findLaunchpad(), for kit files, documents and the list, with templates read from the running work tree (the first design)",
      "reason": "Refuted: manifest hashes under a commit that lacks their source, and a foreign launchpad's HEAD exported as the kit."
    },
    {
      "option": "Fall back to the work tree when a kit file is absent at HEAD",
      "reason": "It would silently export uncommitted bytes under a commit's name; the refusal names the file and the commit instead."
    },
    {
      "option": "Refuse a destination that lies inside a Git work tree",
      "reason": "A fixture or an operator may export into a scratch directory under a repository on purpose; the advisory names the consequence and the remedy."
    }
  ],
  "reopenWhen": "A launchpad separate from the scripts' checkout must export its own documents as kit files (WO-070-D009's follow-up); WO-077's update needs the rendered seeds reproducible from the manifest's commit alone; or WO-075 adds files after the write (the runtime copy from a fresh build, the emitted harness surfaces), which needs a manifest and terms step after those additions rather than the single pre-write pass this order fixes."
}
```

## WO-074-D003 — Kit files and instance seeds

```json
{
  "id": "WO-074-D003",
  "date": "2026-10-09",
  "dispatch": "resume: next",
  "decision": "Manifest-listed kit files: the verbatim blobs (scripts/** with the templates under scripts/kit, packages/beacons/**, the nine build-free .mjs modules, LICENSE, LICENSE-docs, NOTICE, docs/PLAYBOOK.md, docs/product/07-execution-guide.md, docs/publication/implementation-overlay-template.md) and the generated package.json (name dotln-launchpad, private, core's script names and commands verbatim, core's three dev-dependency pins, workspaces packages/*; license Apache-2.0, or UNLICENSED under --license none), package-lock.json (D004), dotln.config.example.json (schema 1 declaring only the docs base, so every other root derives from it and a fork that moves the base moves them all; the fixture asserts it loads as defaultRoots()) and UPSTREAM.md, plus LICENSE-PENDING.md in place of the three license files under --license none, rendered from scripts/kit/pending-license.template.md (the template is not itself named like a license file, since every export carries scripts/kit verbatim and a default export must hold no second license-shaped file). Instance seeds, written once and never listed: README.md (the client README) and .gitignore (core's minus dist/ and *.tsbuildinfo, for WO-075's committed runtime), both files a fork edits, whose upstream sources stay kit files under scripts/kit for WO-077 to refresh; CLAUDE.md (the hand-written floor with only a generic clean-room rule, the secrets rule and the resume phrases, plus a generated block between dotln-kit markers, distinct from the dotln-harness markers WO-075's emit adds, that points at UPSTREAM.md and KIT-MANIFEST.json and carries no commit, so an update never leaves it stale), the AGENTS.md symlink, AI-HARNESS-SECURITY.md from the sanitized template (not among the order's enumerated seeds; a fork records its own posture there), docs/work-orders/WO-001-environment-truth.md, docs/planning/sequence.md naming WO-001, docs/workstreams/README.md and docs/repositories/README.md (the workstream and repository-profile conventions rendered from their kit templates; root READMEs under instance roots are seeds, and the templates under scripts/kit are how a convention change reaches a fork), one README per other seeded document root, docs/intake/.gitkeep and packages/skeleton/loadouts/grants.json holding []. docs/work-orders/README.md and docs/lineage/README.md are not seeded: the index generator and the lineage index own those paths and refuse a hand-written file. KIT-MANIFEST.json is {schemaVersion: 1, commit, tag, files: [{path, sha256}]} sorted by path; it lists no seed and is itself checked against the local-terms list. The overlay template is exported verbatim; its upstream pointer list is UPSTREAM.md's, as owner/repo@commit path entries derived from the origin remote with any userinfo stripped.",
  "evidence": [
    "docs/work-orders/WO-074-launchpad-export-kit.md, Objective, Design (kit files only in the manifest; instance files never, the workstream root among them) and Execution plan step 4 (instance seeds, the first order and the root READMEs, are written and never manifest-listed)",
    "The pre-implementation refutation: the first design manifest-listed docs/workstreams/README.md and docs/repositories/README.md, which criterion 3 and step 4 forbid, and seeded two generator-owned READMEs (scripts/work-orders.mjs renders docs/work-orders/README.md and its --check needs a tag snapshot; scripts/lineage.mjs renders docs/lineage/README.md and its --check needs an exact match); corrected before the fixtures were filed",
    "The self-review (two dotln-workers, 2026-10-09): README.md and .gitignore manifest-listed would be refused on every WO-077 update once a fork edits them; the template named LICENSE-PENDING.md travelled in every export as a second license-shaped file whose text was false beside LICENSE, and the fixture hid it by skipping scripts/; a CLAUDE.md block naming the commit goes stale at the first update; corrected before the gates",
    "scripts/lib/authority-grants.mjs reads packages/skeleton/loadouts/grants.json with optional=false, so an absent file throws; the empty registry is instance authority data (Execution plan step 1)",
    "scripts/resume.mjs refreshes the generated index at every transition when package.json has a work-orders script, and scripts/work-orders.mjs reads docs/planning/sequence.md for it: without the seeded sequence, activate in the export recorded the event and then exited 1 (observed in this session before the seed)",
    "scripts/lib/config.mjs resolveRoots keeps a declared child where it is declared, so an example that declared every root would strand the nested defaults when a fork edits only docs",
    "docs/work-orders/WO-080-workstream-document-and-index.md step 6 and docs/work-orders/WO-073-repository-class-and-profile.md Objective name the conventions the two templates follow (operator-review assumption 3)",
    "packages/compiler/src/harness.ts HARNESS_START/HARNESS_END: the harness block has its own markers; .claude/harness-manifest.json lists CLAUDE.md as an emitted surface, which WO-075 step 4 adds to the manifest"
  ],
  "rejected": [
    {
      "option": "CLAUDE.md, AI-HARNESS-SECURITY.md, README.md and .gitignore as kit files",
      "reason": "A fork edits its floor, records its own posture, rewrites its front door and its ignore rules; a listed file is replaced by every kit update (WO-077). dotln.config.example.json stays a kit file: a fork copies it rather than editing it."
    },
    {
      "option": "A seeds list inside KIT-MANIFEST.json",
      "reason": "Criterion 3 judges that the manifest lists no instance path; the seeds are named in UPSTREAM.md instead."
    },
    {
      "option": "An upstream pointer section prepended to the exported overlay template",
      "reason": "A template with a non-template section; the pointer list belongs with the provenance in UPSTREAM.md, which also names the template."
    },
    {
      "option": "Keep Apache-2.0 in the generated package.json under --license none",
      "reason": "It would name a license beside a notice that names none; npm's UNLICENSED is the label for no grant. The verbatim packages/beacons/package.json keeps upstream's label because byte identity requires it, and UPSTREAM.md says so."
    }
  ],
  "reopenWhen": "WO-075 step 4 lists CLAUDE.md as an emitted surface in the manifest (then the floor and the generated block need a typed split, or the seed classification yields), WO-073 or WO-080 lands a convention the kit templates no longer match (the executor edits scripts/kit/), or WO-077's update must tell a seed from a kit file by a typed record rather than the manifest's absence."
}
```

## WO-074-D004 — The pruned lockfile

```json
{
  "id": "WO-074-D004",
  "date": "2026-10-09",
  "dispatch": "resume: next",
  "decision": "kitLockfile(coreLock, kitPackage) keeps core's lockfile root entry with the kit's name, workspaces and dev dependencies, the packages/beacons workspace and its node_modules/@dotln/beacons link, and the closure of the kit's three dev dependencies at core's exact pins (dependencies, optionalDependencies and peerDependencies, resolved by npm's nested lookup from the depending entry upward); every other workspace and link is dropped. The kit keeps lockfileVersion and requires from core.",
  "evidence": [
    "docs/work-orders/WO-074-launchpad-export-kit.md, Execution plan step 2",
    "docs/evidence/WO-074/launchpad-fixture.txt: npm ci --offline in the export installs prettier 3.9.6, typescript 7.0.2 with its platform package, @types/node 26.6.2 and undici-types 8.9.0 (6 packages) and links @dotln/beacons; the lockfile holds no skeleton, compiler, kernel, console or browser-evidence entry",
    "npm cache ls at this base held every pinned tarball, so the offline install is reproducible on this host; a cold host runs npm ci with network (README)"
  ],
  "rejected": [
    {
      "option": "Run npm install --package-lock-only inside the export",
      "reason": "It needs the registry or a warm cache at export time and may move a pin; pruning core's lockfile keeps core's exact resolution."
    },
    {
      "option": "Drop typescript from the kit's dev dependencies",
      "reason": "The order names three dev dependencies and WO-075's build in the export needs it."
    }
  ],
  "reopenWhen": "Core adds a dev dependency the kit's scripts need, or npm ci refuses the pruned shape on a later npm."
}
```

## WO-074-D005 — Criterion 6 from a committed copy of the work tree against the main checkout's list

```json
{
  "id": "WO-074-D005",
  "date": "2026-10-09",
  "dispatch": "resume: next",
  "decision": "The order stays uncommitted until final review, so this worktree's HEAD (28d32e26, equal to main) lacks scripts/launchpad.mjs and the templates, and under D002 an export from it refuses by name. Criterion 6 is therefore run as the order's step 10 from a committed bounded copy of this work tree (the same shape the fixtures build), with DOTLN_LAUNCHPAD naming the main checkout, which holds the operator's local-terms list: the kit is this order's own, the list is the operator's, the command printed local-terms list: present and refused nothing (docs/evidence/WO-074/criterion-6-local-terms.md records both commits). The list's contents were never read or printed by the executor.",
  "evidence": [
    "docs/evidence/WO-074/criterion-6-local-terms.md",
    "docs/work-orders/WO-074-launchpad-export-kit.md, criterion 6, Execution plan steps 7 and 10",
    "scripts/lib/terms.mjs: the local list and matches never leave the process",
    "The pre-implementation refutation: a run from this worktree exporting main's HEAD would have met the criterion's words while never checking this order's own kit texts against the list"
  ],
  "rejected": [
    {
      "option": "Run step 10 from this worktree at HEAD",
      "reason": "Refused by name under D002, and before D002 it exported a kit that predates this order."
    },
    {
      "option": "Copy the operator's list into the scratch launchpad",
      "reason": "The private list would leave the main checkout; DOTLN_LAUNCHPAD reaches it in place."
    },
    {
      "option": "Record the criterion unmet until the order merges",
      "reason": "The order admits that only where no checkout on the machine holds the list; one does."
    }
  ],
  "reopenWhen": "The verifier or reviewer runs the same command from their own committed copy and sees a refusal: the kit text it names is the defect to fix."
}
```

## WO-074-D006 — The local-terms check over every exported text, before any write

```json
{
  "id": "WO-074-D006",
  "date": "2026-10-09",
  "dispatch": "resume: next",
  "decision": "checkLocalTerms(findLaunchpad(), surfaces) runs over every file the export will write that decodes as UTF-8, kit files and seeds alike, named by its destination path; the status prints as local-terms list: <status>; unavailable is printed and never counted as a pass; an empty or malformed list and a match refuse with the library's own message, which names file and line and never the term; the destination directory is created only after every refusal has passed, so a refused export writes nothing.",
  "evidence": [
    "docs/work-orders/WO-074-launchpad-export-kit.md, Design (the local-terms check) and Execution plan step 3",
    "docs/evidence/WO-074/launchpad-fixture.txt: present, unavailable, the empty-list refusal and the match refusal (README.md by line, the term absent from the output), each leaving no destination",
    "The fixture suite is itself a kit file: its first run was refused because it held the synthetic term literally, so the term is built at runtime from reversed parts"
  ],
  "rejected": [
    {
      "option": "Check only the documents and templates",
      "reason": "The scripts are exported text too; a planted term in a fixture would travel."
    }
  ],
  "reopenWhen": "A binary kit file appears (none decodes as other than UTF-8 today), or the check's cost on the 300 texts becomes visible."
}
```

## WO-074-D007 — The export's own test command is a follow-up

```json
{
  "id": "WO-074-D007",
  "date": "2026-10-09",
  "dispatch": "resume: next",
  "decision": "The export's npm test is not claimed (operator-review assumption 2): scripts/test-runner.mjs imports packages/skeleton/src/gate-deadlines.mjs and evidence-editions.mjs, which the kit carries, but its suites need the compiled packages and the runner builds them first, so npm test in the export fails at the build. The client README says so. The follow-up is recorded here; carrying the package source or a no-build path in the runner is declined by the order.",
  "evidence": [
    "docs/work-orders/WO-074-launchpad-export-kit.md, Observed gap (the control plane loads package code) and operator-review assumption 2",
    "scripts/kit/README.client.md, 'What runs here, and what does not yet'",
    "docs/planning/work-order-map.md WO-074 row, receipt 041 known issue: a stranger who runs the kit's test command hits a failure unless the README says so"
  ],
  "rejected": [
    {
      "option": "A kit-only test runner",
      "reason": "Declined by the order: it breaks the byte identity criterion 1 requires."
    }
  ],
  "followup": "Run core's suites inside an export: once WO-075 carries the runtime build, wire the export's npm test (harness check first, then the suites that need no TypeScript source) and record in the client README which suites run in a fork and which stay core's. Natural home: WO-075 or the order that first runs an exported instance's gate (WO-118). Priority: medium; a fork's test command fails at its first import until then.",
  "reopenWhen": "An exported instance must run core's suites in place, or WO-118's exported instance runs npm test and the README does not say what fails."
}
```

## WO-074-D008 — Earlier decisions this order was to dispose

```json
{
  "id": "WO-074-D008",
  "date": "2026-10-09",
  "dispatch": "resume: next",
  "decision": "WO-069-D001 does not reopen: the kit's dotln.config.example.json is today's layout under schema version 1 and the export consumes no build or release section. WO-069-D002 does not reopen: every launchpad this order uses is named by DOTLN_LAUNCHPAD (criterion 6) or by the ascent from the scripts' checkout (the fixtures, a fork). WO-070-D009's plane/kit root-resolution follow-up (FUP-a058e82c0bbd9b6d) stays allocated to WO-075 as that decision records; this order adds no module identity and keeps the nine build-free modules at their source paths.",
  "evidence": [
    "docs/evidence/WO-069/decisions.md D001 and D002 reopenWhen clauses",
    "docs/evidence/WO-070/decisions.md D009: natural home WO-074 and WO-075; the WO-074 text allocates it to WO-075",
    "docs/evidence/WO-074/launchpad-fixture.txt: loadConfig of the example equals defaultRoots()"
  ],
  "rejected": [
    {
      "option": "Take up FUP-a058e82c0bbd9b6d here",
      "reason": "It edits harness-pinned runtime modules outside this order's surfaces and would widen the re-mint surface; the order allocates it to WO-075."
    }
  ],
  "reopenWhen": "An export must run from a launchpad that neither DOTLN_LAUNCHPAD nor the ascent names, or a kit needs a build or release section the schema refuses."
}
```

## WO-074-D009 — Re-mints

```json
{
  "id": "WO-074-D009",
  "date": "2026-10-09",
  "dispatch": "resume: next",
  "decision": "package.json gains the launchpad script and is a common source of every evidence inventory, so docs/evidence/current.json selects WO-074 revision 001 for authority, artifact-identity, verification and feedback; the first three were written deterministically after npm run build, and feedback-001 carries docs/evidence/WO-199/feedback-004's live audit by reference with no live episode, since package.json is not among the sources the feedback verifier judges. All four checks pass (docs/evidence/WO-074/edition-checks.json). Previous editions remain preserved.",
  "evidence": [
    "docs/work-orders/WO-074-launchpad-export-kit.md, Cost line (re-mints) and Execution plan step 9",
    "docs/evidence/WO-074/edition-checks.json",
    "node scripts/feedback-evidence.mjs --carry docs/evidence/WO-199/feedback-004: 'only component release labels moved; no live episode'",
    "The fifth inventory, harness, is a machinery-selection list judged by scripts/harness-evidence.mjs against the installed bundle, not a hashed edition; node scripts/harness.mjs check passed at this base with 33 generated surfaces, so it needs no re-mint"
  ],
  "rejected": [
    {
      "option": "Leave the editions at WO-199 and let the document gate judge staleness",
      "reason": "The order names the deterministic re-mint; a stale edition at handoff is a known failure class of this queue."
    }
  ],
  "reopenWhen": "A registered behavioral source changes after the mint, or a current-edition check fails."
}
```

## WO-074-D010 — Write-backs, carry-ins and the kit's instance identity

```json
{
  "id": "WO-074-D010",
  "date": "2026-10-09",
  "dispatch": "resume: next",
  "decision": "Write-backs landed in place: product 03 §Platform and instance boundary gains one undated paragraph naming the kit's first slice (the command, what it carries, the manifest, the seeds, the terms check and what a kit without package source runs), about 1,400 bytes under the ceiling the 2026-10-07 pass reset, which supersedes the Cost line's older 400-byte bound as the order's Known issues record; docs/LEGAL.md §Current state gains the dated observation that the kit carries the three license files by default and no bundled third-party material; docs/README.md §Map gains one line for scripts/kit/; the two publication source locks were refreshed from node scripts/check-publication.mjs --print-locks after each product 03 edit (the order's step 11 names audience-status-index.md, but the locks live in the two audience outlines, which check-publication.mjs reads). The two Design carry-ins hold: the fixtures and the criterion 6 run write only under the system temporary root and the session scratch, which the default roles' grants cover, so no operator-named outside root was needed (WO-144); the kit needs no documentation adapter or paid account, and packaging beyond the process kit stays open (FUP-0070). One limit is recorded as a follow-up rather than fixed: the verbatim scripts carry the operator's public author identity (the operatorAuthor constant in scripts/lib/contributions.mjs and three test fixtures), which is core's instance identity inside byte-identical kit files; it is public, not employer material, and a fork's publish check needs its own.",
  "evidence": [
    "docs/product/03-architecture.md §Platform and instance boundary (178,153 bytes against the 194,488 ceiling)",
    "docs/LEGAL.md §Current state, 'Kit export — 2026-10-09 (WO-074)'",
    "docs/README.md §Map, the ../scripts/kit/ line",
    "node scripts/check-publication.mjs: CURRENT for both outlines after the lock refresh",
    "The pre-implementation refutation named the author identity in scripts/lib/contributions.mjs and the fixtures as instance identity inside the kit"
  ],
  "rejected": [
    {
      "option": "Strip or template the author identity out of the exported scripts",
      "reason": "It breaks criterion 1's byte identity and the publish check's own fixtures; the kit's scripts are core's."
    }
  ],
  "followup": "A fork's publish check should read its operator author identity from instance data rather than scripts/lib/contributions.mjs's constant, so the kit carries no instance identity in a byte-identical file. Natural home: WO-077 (update) or WO-078 (sibling registry). Priority: low; the identity is public and the check only exempts it from the sign-off rule.",
  "reopenWhen": "A fork's worktree publish exempts core's operator identity instead of its own, or an exported kit must carry no personal identifier at all."
}
```

## WO-074-D011 — Self-review findings and a follow-up outside criterion 3's declared set

```json
{
  "id": "WO-074-D011",
  "date": "2026-10-09",
  "dispatch": "resume: next",
  "decision": "Two fresh dotln-workers reviewed the order and the diff before implementation-ready, an adversary of the criteria (16 findings) and an improver of design, simplicity and maintainability (21 findings; docs/evidence/WO-074/adversary.md and improver.md hold both reports with each finding's disposition). Fixed: the license-shaped template name and the fixture's scripts/ exclusion (criterion 4); the product 03 and protects wording that said the kit is read from the launchpad's commit; the client README's claim that the later transitions run without a build (in a Codex session next, verify, fix, final-review and release-close refuse until the runtime lands, now asserted) and its attestation sentence; README.md and .gitignore as seeds; a placeholder-free CLAUDE block; pre-write dirty and enclosing-launchpad probes through the configuration loader's own ascent; the forge remote through parseGitHubTarget; a generic workspace list in the lockfile; every plant force-added so the allowlist alone keeps it out; the terms list's absence and hash asserted; a discovery record that lacks the attested version; try/finally around the terms mutations; the unreadable case as a skippable test; the summary line that counted texts under an unavailable list; wording in the first order, the workstream and profile templates, the pending-license notice, the docs README seed and LEGAL. Recorded, not fixed: scripts/fixtures/wo138-local-role-qualification.json, a kit file through scripts/**, holds outcome data derived from docs/verifications/WO-052/VER-001.md (its verdict, criteria counts and gate duration), which is this repository's evidence in derived form and outside criterion 3's declared set; the order's own wording errors (criterion 2's 'packages/skeleton source' against step 1's TypeScript reading, step 11's lock location, the stale line citation) are noted for the next amendment.",
  "evidence": [
    "docs/evidence/WO-074/adversary.md and docs/evidence/WO-074/improver.md",
    "docs/evidence/WO-074/launchpad-fixture.txt after the fixes",
    "scripts/fixtures/wo138-local-role-qualification.json: source docs/verifications/WO-052/VER-001.md with its verdict, criteria counts and gateDurationSeconds",
    "docs/work-orders/WO-074-launchpad-export-kit.md, criterion 3: judged against the declared set; a case outside it is a follow-up, not a failure"
  ],
  "rejected": [
    {
      "option": "Drop scripts/fixtures/ from the kit's scripts tree now",
      "reason": "Several suites load their fixtures by path and criterion 1 requires the scripts byte-identical; which fixture data belongs in a kit is a decision for the orders that run an export's suites."
    }
  ],
  "followup": "Decide whether scripts/fixtures data derived from this repository's records (wo138-local-role-qualification.json carries a verification report's verdict and durations) belongs in the exported kit, and either exclude such fixtures from KIT_FILES with their suites or record them as admitted kit data. Natural home: WO-075 (the first order to run suites inside an export) or WO-077. Priority: low; the data is public and names no instance.",
  "reopenWhen": "A fork's export carries a fixture derived from a report the fork never had, or an exported suite fails for want of an excluded fixture."
}
```

## WO-074-D012

<!-- integration refs/dotln/checkpoint/WO-074/6 -->

```json
{
  "id": "WO-074-D012",
  "date": "2026-10-09",
  "dispatch": "resume: final review; worktree integrate WO-074",
  "decision": "Integrate main into the WO-074 worktree at final review: the branch base, local main and origin main all name 28d32e26fade7b7d2fe6ed00c43707ad58b87f70, so the helper merged nothing, met no authored conflict and re-applied the uncommitted work from its named stash unchanged; only generated projections (the control projection, the meter in PR.md and meta.json, the decisions index, the follow-up register, the work-order index and the publication locks) were regenerated. Every acceptance claim VER-001 judged is carried forward with its original evidence: the gate code identity after integration is 7b57ef29042a715b9ee198e29878d72783b84d4351cc3dc86e066be476b3d79d, the identity VER-001 and the executor's npm test -- --review row judged, so no criterion's surfaces changed. The affected checks the helper printed pass at the integrated tree (npm run publication:check, node scripts/harness.mjs check, npm run release -- check-surfaces --local, the four current evidence-edition checks and git diff --check), and FINAL-001 records the review gate. The application target v0.70.0 remains current and collides with nothing: local and origin tags end at v0.69.2. No component package changed, so no component version moves, and the evidence editions stay WO-074 revision 001 for the four kinds.",
  "evidence": [
    "refs/dotln/checkpoint/WO-074/6",
    "base 28d32e26fade7b7d2fe6ed00c43707ad58b87f70; upstream 28d32e26fade7b7d2fe6ed00c43707ad58b87f70; git ls-remote origin refs/heads/main on 2026-10-09 names the same commit",
    "gateCodeIdentity after integration and after npm run format: 7b57ef29042a715b9ee198e29878d72783b84d4351cc3dc86e066be476b3d79d (docs/verifications/WO-074/VER-001.md Subject; docs/control/orders/WO-074.jsonl ImplementationReady productGate)",
    "release preparation: WO-074 target v0.70.0 remains current. Files changed: docs/evidence/WO-074/meta.json, docs/final-reviews/WO-074/PR.md. Meter snapshot: docs/evidence/WO-074/meta.json, 4102 bytes. Tag observation: local snapshot only; git ls-remote --tags origin ends at v0.69.2",
    "docs/final-reviews/WO-074/FINAL-001.md, Executed checks",
    "docs/evidence/WO-074/final-001-observations.json"
  ],
  "rejected": [
    {
      "option": "Rewrite reviewed commits or discard the integration stash",
      "reason": "Both histories and recovery material must remain available."
    },
    {
      "option": "Rerun the full product gate because the whole-tree hash moved with the regenerated projections",
      "reason": "The gate is keyed by code identity, which is unchanged; product 07 §Independent workflows and integration makes a changed whole-tree hash alone neither a finding nor a reason for a new verification."
    }
  ],
  "reopenWhen": "An authored resolution changes behavior, contracts, authority or acceptance; return that finding through repair and fresh independent verification."
}
```

Integration date: 2026-10-09. Original base: `28d32e26fade7b7d2fe6ed00c43707ad58b87f70`.
Fetched main: `28d32e26fade7b7d2fe6ed00c43707ad58b87f70`. Checkpoint: `refs/dotln/checkpoint/WO-074/6`.
Named stash retained: `89ce66420f9e900092201a3ba9daf5d7fa768383` (WO-074 integrate 2026-10-09).
Resolved projections: none.
Release preparation: WO-074 target v0.70.0 remains current. Files changed: docs/evidence/WO-074/meta.json, docs/final-reviews/WO-074/PR.md. Meter snapshot: docs/evidence/WO-074/meta.json, 4102 bytes. Tag observation: local snapshot only.
Carried-forward claims: all eight criteria as VER-001 judged them, at the unchanged code identity `7b57ef29042a715b9ee198e29878d72783b84d4351cc3dc86e066be476b3d79d`. FINAL-001 re-derived criteria 1 to 5 by a fresh run of the fixture suite, criterion 6 by an export from a committed copy of this tree against the main checkout's list, criterion 4 by a license census of both exports, and criteria 7 and 8 by the affected checks and the review gate; no claim rests on an earlier identity.
Authored conflicts observed: none.
Affected checks: executed; every one passed (FINAL-001, Executed checks).
