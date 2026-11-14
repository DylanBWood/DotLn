# WO-001 — Environment truth for this launchpad (bounded) (v0.1.0)

**Model:** any capable model.
**Effort:** executor any; verifier any; reviewer any.
**Release classification:** minor. The instance's first release: its environment-truth record.
**Depends on:** nothing (first executable work order of this instance).

**Objective:** Establish, with epistemic labels, what this launchpad's machine
and the hosts it runs actually support, so later mechanism choices are
evidence, not assumption. This is the bounded inspection, not a comprehensive
audit; it runs the review ladder every order runs.

**Authority:** Read-only inspection plus writes under `docs/discovery/`,
`docs/control/local/` and this order's own `docs/evidence/WO-001/` only. The
hosts inspected are Claude Code, the host this session runs in, and any other
host this instance's `dotln.config.json` elects under `features` (a `host-`
row of `npm run features -- list` that reads `true`); a fresh instance elects
none. Look for no other agent harness or model provider on this machine, ask
no version of one, and invoke no harness: no session, print-mode call or model
request runs. A host's version flag, its documentation and its settings files
are the inspection. No package installation beyond `npm ci`, no configuration
mutation, no secrets in output (environment variable names only, never
values). Report only limits observed incidentally.

**Capability checklist (each item gets a classification):**

1. The host report: run `node scripts/doctor.mjs --json` and record its rows
   as printed in `docs/discovery/host-report.json`, with the command in
   `docs/discovery/environment.md`. The rows are what the kit assumes of this
   host (Node and Git against their floors, the C compiler, a gate lane's
   memory, symbolic links, line endings, the forge and its tool, the
   platform, and the agent CLI of each inspected host), each with its verdict
   and remedy, and they carry no host name, user name, URL or absolute path.
   An unmet row is a finding of this order, with the remedy the row names.
   Record beside it what the report does not read: npm's version, the
   shell's, and how `git worktree` behaves here.
2. Each inspected host (see Authority): version; print or non-interactive
   mode and its output formats; model and effort selection; settings sources
   actually loaded; hooks; instruction-file handling; startup-context
   accounting (what a fresh session auto-loads, by file, metadata only). What
   cannot be read without invoking the host stays `untested`.
3. The harness smoke: `node scripts/harness.mjs check` verifies the pinned
   runtime files the hooks import (the snapshot) and every generated surface;
   `KIT-MANIFEST.json` hashes the whole compiled runtime. Record `observed`
   with the command and its output, or `blocked` with the printed cause when
   it refuses (a fresh clone runs `node scripts/bootstrap.mjs` once first:
   `npm ci`, then the emit that installs the snapshot). The live smoke,
   `DOTLN_LIVE_HARNESS=1 node scripts/harness-live-smoke.mjs executor 001`,
   launches the actual harness in a scratch copy of this launchpad; it is this
   instance's own choice, made outside this order, which invokes no harness.
4. Local-terms registration: create `docs/control/local/terms.txt` from
   `scripts/kit/terms.example.txt` (one entry a line, ignored by Git;
   an empty list is `present` with no terms and refuses nothing): the entries
   that must never appear in committed text under `refuse:`, and the entries
   that are also ordinary words under `context:`. Run
   `npm run terms -- check docs/discovery/environment.md docs/discovery/environment.json docs/discovery/host-report.json docs/evidence/WO-001/README.md`
   from the repository root over the files this order writes, and record only
   the printed status. A refuse-mode match refuses the check by file and
   line; fix the text before filing. A context-mode match is printed as a
   `CONTEXT` line and refuses nothing; read each listed line beside the entry
   it matched, and reword a line that names the listed thing.
5. Audit questions. Answer each generically: describe behavior, name no
   specific host, gateway, vendor policy or internal service.
   - Gateway and provider behavior: what sits between each inspected host and
     its model provider, and what it changes (models offered, request limits,
     logging, retention), observed or documented.
   - Metering between foreground and delegated execution: whether a delegated,
     background or sub-agent run is metered and attributed like a foreground
     session, and how the difference shows.
   - Interruption recovery: what each inspected host retains and restores
     after an interrupt, a crash or a context compaction, and what is lost.
   - Managed-settings precedence: which settings layer wins when user, project
     and managed settings disagree, read from the settings files each layer
     holds or documented; no call to a host tests it.
6. Classification labels: observed / documented locally / documented
   officially / untested / blocked / not found / ambiguous / operator-attested.
   Unknown is an acceptable result.

**Deliverables:** `docs/discovery/environment.md` (human-readable, every
command recorded), `docs/discovery/environment.json` (machine-readable) and
`docs/discovery/host-report.json` (the host report's rows as printed).
Record each inspected host, and no other, under
`effortReadbackProbe.harnesses.<harness>` (`claude-code` for Claude Code) with
its `versions` (each `{ "classification", "value" }`; only `observed` counts) and
the effort selectors observed under the keys `scripts/resume.mjs` reads:
`sessionEffortSelector` (`{ "classification", "values" }`),
`persistedEffortSelector` (`{ "classification", "value" }`),
`effectiveEffortReadback` or `selectedSessionReadback` (`{ "classification",
"value" }`, `observed` only). A later attestation of an observed version and
effort then prints no advisory. This record turns no host on: only an
election in `dotln.config.json`, or a lifecycle attestation recorded under a
host, does.

**Acceptance criteria (all required)**

1. Every checklist item carries a classification label; an unknown stays
   unknown with the reason it could not be observed.
2. `docs/discovery/environment.json` records each inspected host's observed
   versions and effort selectors in the shape named above, names no host this
   instance does not elect, and a lifecycle attestation of an observed version
   and effort prints no discovery advisory.
3. The local-terms registration step records the printed status; a
   refuse-mode match, where one occurred, was fixed before filing, and each
   context-mode match was read, with the count read recorded.
4. The harness smoke is recorded as observed with its output, or blocked with
   the named missing input.
5. Each of the four audit questions carries an answer or a labeled unknown, and
   none names a specific host, gateway, vendor policy or internal service.

**Evidence gate:** the recorded commands and outputs in `environment.md`;
`npm run resume -- status --json` after `implementation-ready` shows the
attestation recorded. Ordinary instance `npm test` checks installed runtime
and harness integrity, while `npm run test:docs` checks coordination records;
neither replaces this order's observed smoke. Later work in a registered
sibling repository uses that repository's declared target gate.

**Non-goals:** benchmarking, rate-limit probing, package or framework
selection, running core's suites in this instance, and any work in a target
repository.
