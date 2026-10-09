# WO-001 — Environment truth for this launchpad (bounded)

**Model:** any capable model.
**Effort:** executor any; verifier any; reviewer any.
**Depends on:** nothing (first executable work order of this instance).

**Objective:** Establish, with epistemic labels, what this launchpad's machine
and AI coding harnesses actually support, so later mechanism choices are
evidence, not assumption. This is the bounded inspection, not a comprehensive
audit. Timebox: about 45 minutes.

**Authority:** Read-only inspection plus writes under `docs/discovery/`,
`docs/control/local/` and this order's own `docs/evidence/WO-001/` only. One smoke invocation per harness surface is
permitted (a trivial print-mode call that verifies structured output works);
that is inspection, not work. No package installation beyond `npm ci`, no
configuration mutation, no secrets in output (environment variable names only,
never values). Do not probe for rate limits by repeated invocation; report only
limits observed incidentally.

**Capability checklist (each item gets a classification):**

1. Toolchain: node, npm, git (and worktree behavior), OS and shell versions.
2. Each AI coding harness as installed: version; print or non-interactive mode
   and its output formats; model and effort selection; settings sources
   actually loaded; hooks; instruction-file handling; startup-context
   accounting (what a fresh session auto-loads, by file, metadata only).
3. The harness smoke: `node scripts/harness.mjs check` and the live smoke
   `scripts/harness-live-smoke.mjs` import the compiled runtime under
   `packages/<name>/dist/`, which this kit revision does not carry. Record
   `blocked` with that missing input, or `observed` with the command and its
   output once a kit revision carries the runtime.
4. Local-terms registration: create `docs/control/local/terms.txt` with at
   least one term (one per line, ignored by Git; an empty list refuses), run
   `npm run terms -- check CLAUDE.md README.md docs/product/07-execution-guide.md`
   from the repository root with explicit paths, and record only the printed
   status. A match refuses the check by file and line; fix the text before
   filing.
5. Audit questions. Answer each generically: describe behavior, name no
   specific host, gateway, vendor policy or internal service.
   - Gateway and provider behavior: what sits between each harness and its
     model provider, and what it changes (models offered, request limits,
     logging, retention), observed or documented.
   - Metering between foreground and delegated execution: whether a delegated,
     background or sub-agent run is metered and attributed like a foreground
     session, and how the difference shows.
   - Interruption recovery: what each harness retains and restores after an
     interrupt, a crash or a context compaction, and what is lost.
   - Managed-settings precedence: which settings layer wins when user, project
     and managed settings disagree, observed by a harmless probe.
6. Classification labels: observed / documented locally / documented
   officially / untested / blocked / not found / ambiguous / operator-attested.
   Unknown is an acceptable result.

**Deliverables:** `docs/discovery/environment.md` (human-readable, every
command recorded) and `docs/discovery/environment.json` (machine-readable).
Record each harness under `effortReadbackProbe.harnesses.<harness>` with its
`versions` (each `{ "classification", "value" }`; only `observed` counts) and
the effort selectors observed under the keys `scripts/resume.mjs` reads:
`sessionEffortSelector` (`{ "classification", "values" }`),
`persistedEffortSelector` (`{ "classification", "value" }`),
`effectiveEffortReadback` or `selectedSessionReadback` (`{ "classification",
"value" }`, `observed` only). A later attestation of an observed version and
effort then prints no advisory.

**Acceptance criteria (all required)**

1. Every checklist item carries a classification label; an unknown stays
   unknown with the reason it could not be observed.
2. `docs/discovery/environment.json` records each harness's observed versions
   and effort selectors in the shape named above, and a lifecycle attestation
   of an observed version and effort prints no discovery advisory.
3. The local-terms registration step records the printed status; a match was
   refused by the check and fixed before filing.
4. The harness smoke is recorded as observed with its output, or blocked with
   the named missing input.
5. Each of the four audit questions carries an answer or a labeled unknown, and
   none names a specific host, gateway, vendor policy or internal service.

**Evidence gate:** the recorded commands and outputs in `environment.md`;
`npm run resume -- status --json` after `implementation-ready` shows the
attestation recorded.

**Non-goals:** benchmarking, rate-limit probing, package or framework
selection, running core's suites in this instance, and any work in a target
repository.
