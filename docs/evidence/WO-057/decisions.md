# WO-057 decisions

Dispatch: `resume: next`. Session readback: Codex CLI `0.159.2`, `gpt-6.1-sol`, effort `max`, source `codex-session-readback`. This is the executor's host observation, not independent verification.

## WO-057-D001 — Pin a disposable browser probe and retain the native boundary

```json
{
  "id": "WO-057-D001",
  "date": "2026-09-30",
  "dispatch": "resume: next; WO-057",
  "decision": "Probe exactly pinned Playwright 1.63.0 with Chromium headless shell in system-temp scratch, using the unchanged discoverySandbox profile and verification host environment for the confined launch. Keep all package and browser installation outside the workspace. Record the absent filtering-proxy row as unavailable.",
  "evidence": [
    "docs/work-orders/WO-057-browser-runtime-truth.md: Design and acceptance criteria",
    "npm view playwright version license engines --json --registry https://registry.npmjs.org returned 1.63.0, Apache-2.0 and node >=20 on 2026-09-30",
    "Context7 /microsoft/playwright/v1.63.0; official docs/src/browsers.md documents --only-shell and PLAYWRIGHT_BROWSERS_PATH",
    "packages/skeleton/src/discovery-sandbox.ts and verification-worktree.ts witnessTest: deny network and outside writes; PATH, HOME and TMPDIR are supplied explicitly",
    "detectHostConfinement reported inForce false; proxy environment-name projection empty; scutil --proxy had no enabled proxy; npm proxy and https-proxy configuration were both absent"
  ],
  "rejected": [
    {
      "option": "Add Playwright to a workspace package now",
      "reason": "The order authorizes discovery only; WO-059 owns adapter implementation and its dependency."
    },
    {
      "option": "Drive the harness connected server",
      "reason": "It would not establish the standalone product runtime required by the order."
    },
    {
      "option": "Relax the discovery profile or use an unconfined launch as a substitute",
      "reason": "The observed boundary must be the one the verification host actually supplies; a refusal is useful truth."
    },
    {
      "option": "Configure a filtering proxy or use existing per-user browser binaries",
      "reason": "Proxy configuration is outside scope; an isolated download gives this pin an attributable browser inventory."
    }
  ],
  "reopenWhen": "Rerun when the host confinement, Playwright/browser pin or verification host profile changes; run the warmed-cache proxy row when a filtering proxy is actually available."
}
```

Goal and critical path: the evidence enables WO-059's independently runnable browser VerificationAdapter without adding a dependency to the pure kernel or compiler. NoOp leaves its install, confinement and cleanup assumptions unknown. The smallest useful intervention is this disposable probe and dated write-backs.

System traps: policy resistance is bounded by using the real profile; commons cost is one pinned scratch package and browser, with measured commands and retained results; drift to low performance is avoided by recording refused launches without promoting them to success; escalation is bounded by no proxy setup or confinement rewrite; success to the successful is countered by declining the existing connected server as proof; shifting the burden is reduced by an explicit rerun prerequisite for WO-059; rule beating is prevented by process-table evidence and blocked dependent rows; seeking the wrong goal is checked against the adapter's standalone runtime rather than installation success alone. Naive Interventionism: preserve existing source, dependency and licensing boundaries, avoid settings changes, and retain recoverable scratch evidence.

## Economy opportunity

Question: would reinstalling the exact package and browser for each launch row establish useful cost savings or stronger evidence than reusing one pinned scratch install? Alternatives are repeated fresh installs or one lockfile-pinned install with separate launch processes. The deciding observation is whether identical package/browser identities suffice for these rows; the order asks for two page renders, not two downloads. Budget: 600 seconds including preparation and recording. Decline the extra timing comparison and keep the single-install method: a repeated download adds no required claim, and this one discovery order cannot establish a recurring per-order saving. The measured declined-experiment receipt follows before probing.

## WO-057-D002 — Keep the single-install method

```json
{
  "id": "WO-057-D002",
  "kind": "experiment",
  "date": "2026-09-30",
  "dispatch": "resume: next; WO-057 economy opportunity",
  "decision": "Keep one pinned scratch installation and decline a separate repeated-download timing comparison.",
  "question": "Does repeated installation for each launch provide stronger evidence or a measurable recurring saving?",
  "alternatives": [
    "Reinstall the exact package and browser for each launch row",
    "Reuse one pinned install and launch separate browser processes"
  ],
  "observation": "The work order requires installation from a pinned lockfile and separate renders, not separate downloads; no recurring-order sample exists.",
  "budget": {
    "wallSeconds": 600
  },
  "execution": "declined",
  "reason": "A repeated download adds no required claim and this one discovery order cannot establish recurring savings.",
  "cost": {
    "wallSeconds": 215.591,
    "tokens": null,
    "commands": [
      "npm run resume -- next",
      "Read discoverySandbox, witnessTest, the work order, experiment schema and official Playwright install docs",
      "Scratch preparation and bounded proxy configuration projection",
      "Write this declined-experiment receipt"
    ],
    "source": "Conservative measured interval covering entry, preparation and receipt construction: 2026-09-30T01:38:36.474Z through 2026-09-30T01:42:12.065Z. Experiment-only tokens are unavailable; dispatch counters include all order work."
  },
  "effect": {
    "wallSecondsPerOrder": null,
    "tokensPerOrder": null,
    "commands": [
      "Decision inspection; no paired install timing was run"
    ],
    "summary": "Current single-install method retained. No improvement or saving claimed."
  },
  "outcome": "kept-current",
  "regression": "unknown",
  "history": {
    "lastAdoptedImprovementAt": null,
    "experimentsSinceAdoption": null
  },
  "evidence": [
    "WO-057-D001 and the economy question above",
    "Scratch preparation.json records isolated roots and absent npm proxy settings"
  ],
  "rejected": [
    {
      "option": "Run a paired repeated-install benchmark",
      "reason": "It adds downloads and cannot establish a recurring-order benefit here."
    }
  ],
  "reopenWhen": "A repeated browser discovery workload has measured install cost and requires independent installs for a claim."
}
```

## WO-057-D003 — Correct the scratch executable selection

```json
{
  "id": "WO-057-D003",
  "kind": "correction",
  "date": "2026-09-30",
  "dispatch": "resume: next; WO-057 scratch launch setup",
  "decision": "Use the executable filename observed in the downloaded browser inventory before invoking the native sandbox.",
  "misread": "The scratch setup assumed the historical headless_shell executable filename without inspecting this download.",
  "meant": "The probe must run the binary actually installed by the pinned Playwright version.",
  "changed": "Checked the downloaded file tree and changed only the scratch executable selection to chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell. No native launch had run and no confinement/profile was changed.",
  "evidence": [
    "Scratch setup exited with installed executable shape differs from expected package inventory before invoking sandbox-exec",
    "Downloaded browser file tree contains chrome-headless-shell and LICENSE.headless_shell"
  ],
  "rejected": [
    {
      "option": "Treat the setup failure as a browser confinement failure",
      "reason": "No browser or sandbox launch had occurred."
    }
  ],
  "reopenWhen": "The pinned browser download layout changes; inspect its executable inventory before rerunning."
}
```

## WO-057-D004 — Record the adapter consumer and bounded results

```json
{
  "id": "WO-057-D004",
  "date": "2026-09-30",
  "dispatch": "resume: next; WO-057 acceptance criteria 4 and 5",
  "decision": "Record the successful standalone native-confined Playwright 1.63.0 observation and name WO-059's planned packages/browser-evidence package as its future runtime consumer, outside the kernel and compiler. Keep proxy installation unavailable and preserve the existing third-party distribution duty.",
  "evidence": [
    "docs/discovery/browser-runtime-2026-09-30.md",
    "docs/discovery/browser-runtime-2026-09-30.json",
    "New input: docs/work-orders/WO-059-playwright-evidence-adapter.md, Cost and Design name packages/browser-evidence, independently of skeleton/kernel/compiler imports",
    "docs/decisions/0002-kernel-first-agentic-core.md Decision 3 and dependency-posture amendments",
    "docs/LEGAL.md Current state and Decision — 2026-09-06",
    "Protected-surfaces hashes confirm workspace manifests, lockfile, environment.json and the three legal declarations unchanged"
  ],
  "rejected": [
    {
      "option": "Treat same screenshot hashes as a general visual-comparison guarantee",
      "reason": "Only one static original fixture on one pinned browser and host was observed."
    },
    {
      "option": "Claim filtering-proxy support or unconditional parent cleanup",
      "reason": "No configured proxy endpoint existed; cleanup is one SIGKILL trial with two process snapshots."
    },
    {
      "option": "Install a workspace dependency or edit NOTICE now",
      "reason": "WO-059 owns implementation; NOTICE and license declarations remain pinned and no bundled distribution occurs."
    },
    {
      "option": "Name the skeleton as the consumer",
      "reason": "The newly read WO-059 Design selects a separate packages/browser-evidence workspace package and leaves skeleton imports unchanged."
    }
  ],
  "reopenWhen": "A different runtime pin, host/profile, real filtering proxy, screenshot variance, surviving child, or bundled distribution requires a new observation and inventory decision."
}
```

Handoff comparison: the probe removed the standalone-runtime unknown for WO-059 on this host and pin. One download/install was retained across the disconnect; all launch claims were observed under the actual profile. The filtering-proxy unknown remains explicit. No gate, new runtime dependency, profile relaxation or operator rescue requirement was introduced.

## WO-057-D005

```json
{
  "id": "WO-057-D005",
  "date": "2026-09-30",
  "dispatch": "resume: next; release prepare",
  "decision": "Assign application target v0.56.4, the next patch above the observed release baseline v0.56.3, to the heading and the README version claim.",
  "evidence": [
    "release baseline v0.56.3 (local tags)",
    "patch classification declared in docs/work-orders/WO-057-browser-runtime-truth.md"
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

## WO-057-D006 — Distinguish runtime availability from an MCP architecture choice

```json
{
  "id": "WO-057-D006",
  "date": "2026-09-30",
  "dispatch": "resume: next; operator question about Playwright MCP",
  "decision": "Keep the completed probe as evidence of this pinned runtime under the actual native profile, without treating success as a comparison with or rejection of Playwright MCP.",
  "evidence": [
    "Operator questioned the package-level probe and reported successful everyday Playwright MCP use; no workplace material or configuration was inspected or copied",
    "WO-057 Objective explicitly requires execution without the harness connected browser server",
    "docs/discovery/browser-runtime-2026-09-30.json records only direct-runtime observations; it contains no comparative MCP experiment",
    "WO-059 Design currently names packages/browser-evidence and its pinned runtime dependency"
  ],
  "rejected": [
    {
      "option": "Present the host probe as proof that a direct API is preferable to MCP",
      "reason": "No architecture comparison was run; host availability cannot establish superiority."
    },
    {
      "option": "Substitute the harness connected server for the declared independent-runtime probe",
      "reason": "That would not discharge WO-057's explicit tested requirement."
    },
    {
      "option": "Change WO-059 architecture during this discovery order",
      "reason": "The operator asked for an explanation; no new architecture implementation or order amendment was authorized."
    }
  ],
  "reopenWhen": "The operator selects an MCP-based adapter design or authorizes revisiting WO-059; judge the resulting consumer and standalone-service requirements from a separately scoped comparison."
}
```

## WO-057-D007 — State the no-server row's removed names as a projection

```json
{
  "id": "WO-057-D007",
  "kind": "correction",
  "date": "2026-09-30",
  "dispatch": "resume: final review",
  "decision": "Add one reviewer-marked sentence to the browser-runtime record's no-server section: the four removed names, and the JSON's removedVariables, are the executor session's names matching the probe's prefix filter, while the removal itself is the env -i policy. The JSON packet, the observation and every label stay unchanged.",
  "misread": "The record called the four Codex names 'the harness-related names actually present and removed' without stating the prefix filter that selected them, so a reader could take the list as the complete set of connected-server variables the row removed.",
  "meant": "env -i removed every inherited variable. The list is the executor session's names matching ^(CODEX|CLAUDE|MCP|PLAYWRIGHT|PW_TEST|VSCODE); WO-059 criterion 5, which consumes 'the variables WO-057's no-server row removed', is met by the same whole-environment removal, not by removing four Codex names under another harness.",
  "changed": "docs/discovery/browser-runtime-2026-09-30.md gains the clarification sentence in its no-server section, citing VER-001 and this decision. No other byte of the record, the JSON packet, the addendum, ADR-0002 or LEGAL changed.",
  "evidence": [
    "The executor's retained scratch lifecycle.mjs line 48 builds removedVariables as Object.keys(process.env) filtered by /^(CODEX|CLAUDE|MCP|PLAYWRIGHT|PW_TEST|VSCODE)/; its observation object carries environmentPolicy 'env -i removes all inherited environment, then supplies only PATH, HOME and TMPDIR'.",
    "docs/discovery/browser-runtime-2026-09-30.json launch-without-connected-server: removedVariables lists four CODEX names; result.environmentNames is HOME, PATH, TMPDIR and __CF_USER_TEXT_ENCODING.",
    "docs/verifications/WO-057/VER-001.md, Limits and disposition: the same filter, and ten CLAUDE* names in the verifier's Claude Code session that the filter would select.",
    "docs/work-orders/WO-059-playwright-evidence-adapter.md criterion 5 reads 'a process with the variables WO-057's no-server row removed also removed'."
  ],
  "rejected": [
    { "option": "Leave the observation only in VER-001 for WO-059's reader", "reason": "WO-059 cites WO-057's row, not the verification report, and a report sentence is not a boarded defect." },
    { "option": "Rewrite removedVariables in the JSON packet to list every inherited name", "reason": "The packet is the executor's machine evidence and no longer holds that session's full name set; rewriting it would change recorded evidence rather than state its selection." },
    { "option": "Return the order through repair and a fresh verification", "reason": "The sentence changes no observation, label, criterion or contract; VER-001 already established the filter and judged criterion 3 met with it." }
  ],
  "reopenWhen": "A later run of the no-server row, or WO-059's criterion 5 evidence, relies on a removed-name list rather than the env -i policy."
}
```

## WO-057-D008 — Final review passes; the touching rows are textual matches

```json
{
  "id": "WO-057-D008",
  "date": "2026-09-30",
  "dispatch": "resume: final review",
  "decision": "Pass WO-057 on all six criteria against the original order. Correct the record's one unstated selection within the adjacent-cleanup bound (D007) and board nothing. Leave the five pending follow-up rows the touching list matched as they are: each matched a shared file or this order's evidence by text, and none names a seam this change opened.",
  "evidence": [
    "The subject's authored bytes equal the verifier's checkpoint refs/dotln/checkpoint/WO-057/4 except the control log and generated projections; VER-001's SHA-256 recomputes to the logged reportHash 6b017203...d4ca0. Base 1674ea5e equals local main, origin/main and the remote main ref, so no integration ran; tags end at v0.56.3, so target v0.56.4 is free.",
    "The JSON packet's fixture string hashes to its recorded c0bca658...77f4fd. All eight protected surfaces hash to the packet's values. LICENSE, LICENSE-docs and NOTICE hash to the three LEGAL declarations. git diff against the base is empty for package.json, package-lock.json, packages/, scripts/ and docs/discovery/environment.json.",
    "The executor's retained scratch lifecycle.mjs builds removedVariables with a prefix filter (D007); the row's env -i policy and the four-name child environment establish complete removal, so criterion 3 stands.",
    "npm test -- --review: 29 passed, 0 failed, 460.06 s, 73 fresh tasks, at code identity aa0c11ebec1f7a23acf17afdc3fe716228c803e63b9490734459c86fc7758409 (the executor's and verifier's). npm run test:docs, npm run publication:check and git diff --check are recorded in FINAL-001.",
    "npm run plan -- followups --touching lists five pending rows (FUP-71fc2efc208f597a, FUP-b7a66e7a4fa7ad20, FUP-50cda1c03ecd8ea8, FUP-acfe4bfda716d8fb, FUP-fd05316b6030ef73), matched on decisions.md, the decisions index, meta.json, current.md, README.md and the work-order index. D006's dispatch field and evidence paraphrase the operator's question rather than retaining chat."
  ],
  "rationale": "The rows WO-059 inherits are observed twice, by independent installs, under the verification host's real boundary. The ADR amendment and legal observation apply the existing dependency posture without adding a dependency. The one imprecision a downstream criterion would consume is now stated where WO-059 reads it.",
  "goalAlignment": "Mission and critical path: WO-059's browser VerificationAdapter can pin a runtime on observed install, confinement, cleanup and standalone rows instead of an assumption. Rule beating: the no-server list could let WO-059 criterion 5 pass by removing four Codex names under another harness; D007 states the env -i policy as the requirement. Seeking the wrong goal: the record claims availability of one pin on one host, not an MCP comparison (D006). Drift to low performance: the proxy row stays unavailable rather than being promoted. Policy resistance and escalation: no gate, tool or profile relaxation added. Commons: no third live reproduction; VER-001's independent one stands, and this review spent a fresh product gate only because --review selects it. Shifting the burden: the rerun recipe and reopening conditions are in the record. Success to the successful: driving the harness's connected server was declined on the order's own requirement, not on investment. Naive Interventionism: one sentence added; the JSON packet, labels and every other surface unchanged. NoOp (passing without D007) leaves the list's selection only in a verification report WO-059 does not cite.",
  "rejected": [
    { "option": "Run a third live install and lifecycle reproduction", "reason": "VER-001 reinstalled from nothing and reran every live row with its own scripts; a third run adds a download and no claim the criteria need." },
    { "option": "Fail or return the order through repair for the removed-name list", "reason": "Criterion 3 is met by the recorded env -i removal and child environment; the gap is a stated selection, correctable without changing evidence." },
    { "option": "Re-dispose the five matched rows with this order", "reason": "Each is a textual match on a shared or generated file; none of their seams (verbatim operator chat, release hardening, usage pruning, usage attribution, standing writer text) is touched." }
  ],
  "reopenWhen": "A later run of any WO-057 row on the same pin, host and profile disagrees with the record, or WO-059 finds the recorded consumer boundary or inventory duty insufficient."
}
```
