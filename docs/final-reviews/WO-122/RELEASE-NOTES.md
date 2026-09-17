## Release overview

DotLn's resident can launch a declared CLI worker while the operator is away and wait for a human decision without losing the question on restart. This extends the existing script catalog with inspection/writer requests and durable per-order handoffs.

## Read before upgrading

CLI declarations require a validated request; the host must prepare the source-change worktree and commit message. Human packets live under the resident store's `control/local/handoffs` directory, and `dotln handoff answer` records an explicit option. These are trusted local operator inputs, not authenticated remote messages. Existing script declarations remain supported; retain stores containing the new event kinds with this runtime because older versions do not understand them. A configuration change requires a fresh store under the existing resident contract.

## Substantive changes

CLI workers use the observed C-U1/X-U1 detached launch paths, carry resident origin stamps and return validated envelopes. Both phase and nested writer authority apply. Unavailable launch paths yield a named NoOp, and a worker's completion claim never advances a phase as independently verified. The Codex writer retains the native code-mode host needed by its tools; the inspection launch remains unchanged.

Human handoffs publish complete decision packets atomically and hold only the identified order. Invalid, repeated and mismatched answers are refused. An old-generation or expired answer records the decision and releases the hold without reviving old authority.

## Progressive polish

The resident runbook, architecture description, generated harness pins, source evidence, console selfhost fixtures, publication locks and administrative indexes reflect the integrated runtime. The recovery wording now distinguishes script/CLI loss from durable handoff recovery.

## Evidence and compatibility

Prepared application v0.29.0 and skeleton 0.25.0 over the published v0.28.0 base at `352ada5dbee7f5340bb303d18fbfaec19df7b50e`. Compiler 0.13.0, kernel 0.5.0 and console 0.1.6 are unchanged; no third-party dependency is added. The annotated release manifest will bind the eventual release source and consume the committed reviewer product-gate record. See [FINAL-001](FINAL-001.md), [VER-001](../../verifications/WO-122/VER-001.md) and the [integration decision](../../evidence/WO-122/decisions.md#wo-122-d005--integrate-the-published-sibling-and-retime-the-additive-release).

The 20 integrated actor/writer tests pass. The preserved [live row](../../evidence/WO-122/live.json) records an actual Codex launch and validated envelope. Its worker reported blocked because Node was unavailable in its tool environment; separate host checks observed the edit, passing test and commit. Authentication lifetime, hostile descendant containment and independently verified source-change completion are not established by that row. Fresh revision 003 evidence covers the integrated source; earlier editions and verification reports remain unchanged.
