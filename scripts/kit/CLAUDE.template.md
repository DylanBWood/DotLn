# Launchpad

Every session reads this contract; `AGENTS.md` symlinks here. The instance owns
the hand-written floor: edit it here; kit updates change it only through
explicitly opted-in instance actions.

Export generates the kit provenance block below; `node scripts/harness.mjs emit`
generates the harness block, which `harness check` verifies.

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

Whole `resume:` phrases select skills through canonical status
(`npm run resume -- status --json`). `@skills`: `.claude/skills` in Claude,
`.agents/skills` in Codex.

Expand skill read/review selectors from order/report paths. Read cited sections;
name new inputs. A session that cannot load skills runs the
`npm run resume -- <action>` commands itself.

Always admit `analysis:` (pause for diagnosis or direction) and
`operator override:` (suspend gates for authorized recovery), despite repo or
harness failures. Preserve work; invent no dispatch or pass. Exit: either prefix
plus `off`. Codex: `node scripts/operator-control.mjs analysis|override|off|status`.
Host permissions apply.

Verify in a session-launched browser: structured state, then DOM and
accessibility tree via the Playwright MCP snapshot, then network/event data,
then a screenshot read as an image; or use project browser tests. Desktop
control and the operator's own browser sessions require
`features.desktop-control` in `dotln.config.json` (off by default) and the
operator's explicit request in this session.

<!-- dotln-kit:start -->
Kit provenance (commit, tag, remote): UPSTREAM.md. Kit files and their hashes: KIT-MANIFEST.json. How to start: README.md.
Document roots: dotln.config.json, default docs/; see dotln.config.example.json.
The export carries the compiled runtime in packages/<name>/dist/ (KIT-MANIFEST.json hashes) and its emitted Contributor harness bundle. node scripts/harness.mjs check verifies every generated surface and pinned runtime snapshot. Hooks import .runtime/harness/ (ignored). Fresh clones run node scripts/bootstrap.mjs once: npm ci, then emit installs the snapshot. Until then, hooks report snapshot-missing once per session; host permissions decide.
<!-- dotln-kit:end -->
