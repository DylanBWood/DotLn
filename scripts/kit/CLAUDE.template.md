# Launchpad

This file is the operating contract every session in this repository reads;
`AGENTS.md` is a symlink to it. The hand-written floor below is instance-owned:
edit it here; an upstream kit update changes it only through explicitly
opted-in instance actions. The marked blocks
at the end are generated: the kit block by the export (its provenance) and the
harness block by `node scripts/harness.mjs emit`, which `harness check`
verifies.

## Clean Room — locked floor

Work here belongs to the owner of this repository. Never import code,
configuration, identifiers, internal services, credentials or secrets that the
owner has no right to publish in it. Stop and flag suspect material; derive
decisions from this repository's own recorded sources. No support or generated
configuration may weaken this floor.

`docs/intake/` is ignored, single-copy raw material. Synthesize and rewrite it;
exact wording is copied only from an operator-authored draft explicitly marked
ready to file, with that provenance recorded on the committed surface.

## Secrets

Never expose, copy, commit or print credentials, tokens, private hostnames,
account identifiers or the contents of `docs/control/local/`. Environment
variable names may be recorded; their values never. The private local-terms
list at `docs/control/local/terms.txt` is reported by file and line on a match
and its terms are never printed.

## Start here

Whole `resume:` phrases select their skill through canonical status
(`npm run resume -- status --json` is the record). `@skills`: `.claude/skills`
in Claude, `.agents/skills` in Codex. `AGENTS.md` symlinks here.

Read[executor]: `@skills/dotln-executor/SKILL.md` — next, fix, status, times.
Read[verifier]: `@skills/dotln-verifier/SKILL.md` — verify.
Read[reviewer]: `@skills/dotln-reviewer/SKILL.md` — final review.
Read[release-close]: `@skills/dotln-release-close/SKILL.md` — release close.
Read[planner]: `@skills/dotln-planner/SKILL.md` — planning or ideation.

Expand skill read/review selectors from order/report paths. Read cited sections;
name new inputs. A session that cannot load skills runs the
`npm run resume -- <action>` commands itself.

Always admit `analysis:` (pause for diagnosis or direction) and
`operator override:` (suspend gates for authorized recovery), despite repo or
harness failures. Preserve work; invent no dispatch or pass. Exit: either prefix
plus `off`. Codex: `node scripts/operator-control.mjs analysis|override|off|status`.
Host permissions apply.

<!-- dotln-kit:start -->
Kit provenance (commit, tag, remote): UPSTREAM.md. Kit files and their hashes: KIT-MANIFEST.json. How to start: README.md.
The control plane finds its documents through dotln.config.json at this root; its absence means the default layout under docs/ (dotln.config.example.json shows it).
This export carries the compiled runtime under packages/<name>/dist/ (hashed in KIT-MANIFEST.json) and the Contributor harness bundle its own emit wrote from it; node scripts/harness.mjs check verifies the pinned runtime snapshot and every generated surface. The hooks import an ignored snapshot under .runtime/harness/: a fresh clone runs node scripts/bootstrap.mjs once (npm ci, then the emit that installs it); until then each hook reports snapshot-missing once per session and host permissions alone decide.
<!-- dotln-kit:end -->
