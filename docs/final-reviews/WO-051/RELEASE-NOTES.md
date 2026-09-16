## Release overview

Workers can now be launched to change source. A second transport profile, `source-change-v1`, runs Claude Code or Codex CLI inside one declared Git worktree with a fixed tool allowlist, and the host records whether a commit actually landed and how many tool requests were denied. It is the first runnable path for the `repo.write` effect and the transport that the source-change host (WO-052) and the live proof (WO-053) build on. The inspection and Beacon profiles are unchanged.

## Read before upgrading

No migration is required. Writer result envelopes gain two optional host-observed fields, `observedCommit` and `observedDenials`; inspection envelopes and stored inspection results are unaffected. The profile grants no authority: a dispatching host must supply a compiled WorkOrder and authority envelope that allow `repo.write` and `git.local` and deny every remote, credential, settings, sandbox, transport and package-publish effect, or the request refuses before launch. Security and privacy: the harness sandbox is not the containment boundary (the record observed sibling writes under both harnesses), so worktree governance and host diff checks remain required and are proven later; the Claude writer launch does not pass `--settings '{"autoMemoryEnabled":false}'` as the inspection launch does, and the Codex writer keeps `shell_environment_policy.inherit="none"` with the shell enabled; both are untested until WO-053's live smoke. No live writer was launched in this release. `@dotln/skeleton` moves to 0.20.0; kernel and compiler versions are unchanged.

## Substantive changes

Worker protocol: a `WriterRequest` kind (`source-change`) with its own validator, prompt, result schema, wire parser and stored-result parser beside the untouched inspection request. The validator checks the WorkOrder and authority together, requires one exact test command with no shell metacharacters and a canonical message path inside the mount, and refuses conflicting or remote allowances.

Execution environment: a `SourceChangeProfile` with one read-write mount joins the profile union; a separate host module validates that the mount is a canonical Git worktree root strictly inside the configured parent and disjoint from the launchpad, that the message file exists inside it, and that construction never claims the record's ambiguous or unavailable rows (C-W1, X-U2, X-W3).

Transports: both CLI adapters dispatch on the request kind. Claude Code launches with `--tools Bash,Read,Edit,Write`, an exact `--allowedTools` list of Edit, Write, Read and three Bash patterns, no permission prompts, project and local settings, no session persistence, strict empty MCP, no browser, a budget cap and `stream-json` with hook events. Codex launches with approval `never`, ephemeral exec, the `dotln-writer` named permission profile (minimal read, workspace-roots write, network disabled) and the retained hardening overrides. The host reads `HEAD` before launch and after exit to derive the commit observation, and decodes Claude's denial count from the terminal result.

Worker store: the strict receipt decoder admits the two host-observed fields on writer envelopes and keeps the request key stable across physical retries.

Documentation: 03 §Ports describes the second profile and states that the sandbox is not the containment boundary; the harness security runbook records the posture; the skeleton README carries a runbook for the process-double proof. Planning: the ideation breakout files two document-only candidates, local-model usefulness experiments (06) and guided operator work orders (07), with ledger entries and a receipt.

## Progressive polish

Four fixtures: the inspection activation baseline, the pinned writer arrays with row ids, a synthetic wire tape in the recorded field shapes, and a Node process double that edits, tests and optionally commits. Regenerated harness bundle and manifest for skeleton 0.20.0, a fresh authority evidence edition and a fresh feedback edition over the final source identity, refreshed work-order and decisions indexes and publication locks, and one wording correction in 03 §Ports at final review.

## Evidence and compatibility

Target v0.24.0 under the order's minor classification. The annotated tag and its release manifest will identify the exact merged source and the reviewer product-gate row. [VER-001](../../verifications/WO-051/VER-001.md) passed all six criteria independently, including a removed-line census of the two transport sources and live probes of the environment and request key. [FINAL-001](FINAL-001.md) records 25 passing reviewer suites in the product gate, 17 passing document suites, the disposition of the verifier's findings and the WO-052 and WO-053 handoffs. Process doubles and a synthetic tape establish arguments, refusals, parser strictness and real Git observations; they establish nothing about model behavior under the profile or about confinement.
