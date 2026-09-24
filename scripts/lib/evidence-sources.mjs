import { docRelative } from "./config.mjs";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join, posix } from "node:path";
// Source files imported by the evidence tools plus their fixed data/build inputs.
// Generated harness output and selected edition output are deliberately absent.
// Package indexes load their complete export graphs; these are explicit files.
const commonSources = [
  "package-lock.json",
  "package.json",
  "packages/compiler/package.json",
  "packages/compiler/src/artifact-identity.ts",
  "packages/compiler/src/attribution.mjs",
  "packages/compiler/src/authority.ts",
  "packages/compiler/src/compile.ts",
  "packages/compiler/src/feedback.ts",
  "packages/compiler/src/harness.ts",
  "packages/compiler/src/codex-continuation.mjs",
  "packages/compiler/src/index.ts",
  "packages/compiler/src/normalize.ts",
  "packages/compiler/src/operator-control.mjs",
  "packages/compiler/src/presence-schema.ts",
  "packages/compiler/src/presence.ts",
  "packages/compiler/src/render.ts",
  "packages/compiler/src/seiri.ts",
  "packages/compiler/src/senses.ts",
  "packages/compiler/src/types.ts",
  "packages/compiler/src/verification.ts",
  "packages/compiler/src/views.ts",
  "packages/compiler/tsconfig.json",
  "packages/kernel/package.json",
  "packages/kernel/src/continuation.ts",
  // The kernel package every host imports as `@dotln/kernel` (WO-157).
  "packages/kernel/src/core.ts",
  "packages/kernel/src/index.ts",
  "packages/kernel/src/store.ts",
  "packages/kernel/src/types.ts",
  "packages/kernel/tsconfig.json",
  "packages/skeleton/package.json",
  "packages/skeleton/src/evidence-editions.mjs",
  "packages/skeleton/src/version.ts",
  "packages/skeleton/src/execution-environment.ts",
  "packages/skeleton/src/source-change-environment.ts",
  "packages/skeleton/src/source-change-command.ts",
  "packages/skeleton/src/source-change-host.ts",
  "packages/skeleton/src/source-change-state.ts",
  "packages/skeleton/src/source-change-worktree.ts",
  "packages/skeleton/src/reactor.ts",
  "packages/skeleton/src/repair.ts",
  "packages/skeleton/src/repair-host.ts",
  "packages/skeleton/src/resident-state.ts",
  "packages/skeleton/src/presence-signals.ts",
  "packages/skeleton/src/presence-heartbeat.ts",
  "packages/skeleton/src/resident-store.ts",
  "packages/skeleton/src/worker-store.ts",
  "packages/skeleton/src/verification-protocol.ts",
  "packages/skeleton/src/plan-refutation-protocol.ts",
  // Request protocols the registered transports import (WO-157 item 12).
  "packages/skeleton/src/entropy-review-protocol.ts",
  "packages/skeleton/src/mission-check-protocol.ts",
  // Runtime siblings the registered hosts and protocols import (WO-157).
  "packages/skeleton/src/artifact-identity.ts",
  "packages/skeleton/src/beacon-perception.ts",
  "packages/skeleton/src/control-codebook.mjs",
  "packages/skeleton/src/gate-deadlines.mjs",
  "packages/skeleton/src/loadouts/entropy-reducer.ts",
  "packages/skeleton/src/scenario.ts",
  "packages/skeleton/src/verification-host.ts",
  "packages/skeleton/src/verification-worktree.ts",
  "packages/skeleton/src/worker-status.ts",
  "packages/skeleton/src/worker-transport.ts",
  "packages/skeleton/src/beacon-codebook.mjs",
  "packages/skeleton/src/beacon-v3-codebook.mjs",
  "packages/skeleton/src/control-beacon.ts",
  "packages/skeleton/src/live-reactor-driver.ts",
  "packages/skeleton/src/loadouts/feedback.ts",
  "packages/skeleton/src/usage-observation.mjs",
  "packages/skeleton/src/verification.ts",
  "packages/skeleton/src/worker-protocol.ts",
  "packages/skeleton/src/presence-machine.ts",
  "packages/skeleton/src/actor-catalog.ts",
  "packages/skeleton/src/actor-contract.ts",
  "packages/skeleton/src/cli-actor-contract.ts",
  "packages/skeleton/src/cli-actor.ts",
  "packages/skeleton/src/cli-episode.ts",
  "packages/skeleton/src/handoff-contract.ts",
  "packages/skeleton/src/handoff-actor.ts",
  "packages/skeleton/src/work-candidate.ts",
  "packages/skeleton/src/script-episode.ts",
  "packages/skeleton/src/discovery-sandbox.ts",
  "packages/skeleton/src/discovery-actor.ts",
  "packages/skeleton/src/discovery-cli.ts",
  "packages/skeleton/src/discovery.ts",
  "packages/skeleton/src/sha256.ts",
  "packages/skeleton/src/portfolio.ts",
  "packages/skeleton/src/portfolio-actor.ts",
  "packages/skeleton/src/portfolio-host.ts",
  "packages/skeleton/tsconfig.json",
  "scripts/build.mjs",
  "scripts/lib/evidence-sources.mjs",
  "tsconfig.json",
];

const authoritySources = (root) => [
  ...commonSources,
  docRelative(root, "evidence", "WO-042/artifact-identity/audit.json"),
  docRelative(
    root,
    "evidence",
    "WO-042/artifact-identity/negative-transcripts.json",
  ),
  docRelative(root, "evidence", "WO-042/artifact-identity/scenario.jsonl"),
  docRelative(
    root,
    "evidence",
    "WO-042/artifact-identity/semantic-hash-inventory.json",
  ),
  docRelative(root, "evidence", "WO-042/authority-baseline.json"),
  docRelative(root, "evidence", "WO-042/authority.json"),
  docRelative(root, "evidence", "WO-042/bundle-diff.json"),
  docRelative(root, "evidence", "WO-042/verification/events.jsonl"),
  docRelative(root, "evidence", "WO-042/verification/matrix.json"),
  docRelative(root, "evidence", "WO-042/verification/stale-status.json"),
  docRelative(root, "evidence", "WO-042/verification/stale-status.txt"),
  "packages/compiler/fixtures/wo029-entropy-reducer.json",
  "packages/compiler/fixtures/wo029-identities.json",
  "packages/compiler/test/authority-fixture.ts",
  "packages/kernel/src/core.ts",
  "packages/kernel/src/index.ts",
  "packages/kernel/src/store.ts",
  "packages/kernel/src/types.ts",
  "packages/skeleton/fixtures/wo003-decision-traces.json",
  "packages/skeleton/src/feedback-boundary.ts",
  "packages/skeleton/src/feedback-source-comments.ts",
  "packages/skeleton/src/gate-deadlines.mjs",
  "packages/skeleton/src/gate-evidence.mjs",
  "packages/skeleton/src/harness-command.ts",
  "packages/skeleton/src/harness-host.ts",
  "packages/skeleton/src/subagent-budget.ts",
  "packages/skeleton/src/observed-facts.ts",
  "packages/skeleton/src/correction-observation.mjs",
  "packages/skeleton/src/loadouts/contributor.ts",
  "packages/skeleton/src/loadouts/entropy-reducer.ts",
  "packages/skeleton/src/loadouts/executor-supports.ts",
  "packages/skeleton/src/loadouts/feedback.ts",
  "packages/skeleton/src/loadouts/goal-alignment.ts",
  "packages/skeleton/src/loadouts/plan-refuter.ts",
  "packages/skeleton/src/loadouts/process-cost.ts",
  "packages/skeleton/src/loadouts/prompt-support.ts",
  "packages/skeleton/src/plan-refutation-protocol.ts",
  "packages/skeleton/src/usage-observation.mjs",
  "packages/skeleton/src/worker-protocol.ts",
  "packages/skeleton/src/writer-teardown.mjs",
  "scripts/authority-evidence.mjs",
  "scripts/lib/harness.mjs",
  "scripts/lib/paths.mjs",
  "scripts/lib/terms.mjs",
];

const artifactIdentitySources = (root) => [
  ...commonSources,
  "packages/compiler/fixtures/wo029-entropy-reducer.json",
  "packages/compiler/fixtures/wo029-identities.json",
  "corpus/harness/id-corpus-lib.mjs",
  "corpus/harness/wo101-support.mjs",
  docRelative(root, "evidence", "WO-029/baseline.json"),
  "packages/kernel/src/core.ts",
  "packages/kernel/src/index.ts",
  "packages/kernel/src/store.ts",
  "packages/kernel/src/types.ts",
  "packages/skeleton/fixtures/repo-tree.json",
  "packages/skeleton/fixtures/wo003-decision-traces.json",
  "packages/skeleton/fixtures/wo029-legacy-scenario.jsonl",
  "packages/skeleton/src/artifact-audit.ts",
  "packages/skeleton/src/artifact-identity.ts",
  "packages/skeleton/src/audit.ts",
  "packages/skeleton/src/beacon-codebook.mjs",
  "packages/skeleton/src/beacon-perception.ts",
  "packages/skeleton/src/beacon-v3-codebook.mjs",
  "packages/skeleton/src/control-beacon.ts",
  "packages/skeleton/src/control-codebook.mjs",
  "packages/skeleton/src/loadouts/entropy-reducer.ts",
  "packages/skeleton/src/plan-refutation-protocol.ts",
  "packages/skeleton/src/scenario.ts",
  "packages/skeleton/src/live-reactor-driver.ts",
  "packages/skeleton/src/verification-protocol.ts",
  "packages/skeleton/src/worker-protocol.ts",
  "scripts/artifact-identity-evidence.mjs",
];

const verificationSources = (root) => [
  ...commonSources,
  "packages/kernel/src/core.ts",
  "packages/kernel/src/index.ts",
  "packages/kernel/src/store.ts",
  "packages/kernel/src/types.ts",
  "packages/skeleton/src/artifact-identity.ts",
  "packages/skeleton/src/beacon-codebook.mjs",
  "packages/skeleton/src/beacon-perception.ts",
  "packages/skeleton/src/beacon-v3-codebook.mjs",
  "packages/skeleton/src/control-codebook.mjs",
  "packages/skeleton/src/gate-deadlines.mjs",
  "packages/skeleton/src/plan-refutation-protocol.ts",
  "packages/skeleton/src/verification-demo.ts",
  "packages/skeleton/src/verification-fake.ts",
  "packages/skeleton/src/verification-host.ts",
  "packages/skeleton/src/verification-worktree.ts",
  "packages/skeleton/src/verification-protocol.ts",
  "packages/skeleton/src/verification.ts",
  "packages/skeleton/src/worker-protocol.ts",
  "packages/skeleton/src/worker-status.ts",
  "packages/skeleton/src/worker-store.ts",
  "packages/skeleton/src/worker-worktree.ts",
  "scripts/verification-evidence.mjs",
];

const feedbackSources = (root) => [
  ...commonSources,
  docRelative(root, "discovery", "environment.json"),
  "packages/kernel/src/core.ts",
  "packages/kernel/src/index.ts",
  "packages/kernel/src/store.ts",
  "packages/kernel/src/types.ts",
  "packages/skeleton/src/artifact-identity.ts",
  "packages/skeleton/src/beacon-codebook.mjs",
  "packages/skeleton/src/beacon-perception.ts",
  "packages/skeleton/src/beacon-v3-codebook.mjs",
  "packages/skeleton/src/control-codebook.mjs",
  "packages/skeleton/src/feedback-audit.ts",
  "packages/skeleton/src/feedback-boundary.ts",
  "packages/skeleton/src/feedback-selfhost.ts",
  "packages/skeleton/src/feedback-source-comments.ts",
  "packages/skeleton/src/gate-deadlines.mjs",
  "packages/skeleton/src/gate-evidence.mjs",
  "packages/skeleton/src/harness-command.ts",
  "packages/skeleton/src/harness-host.ts",
  "packages/skeleton/src/subagent-budget.ts",
  "packages/skeleton/src/observed-facts.ts",
  "packages/skeleton/src/correction-observation.mjs",
  "packages/skeleton/src/loadouts/contributor.ts",
  "packages/skeleton/src/loadouts/executor-supports.ts",
  "packages/skeleton/src/loadouts/feedback.ts",
  "packages/skeleton/src/loadouts/goal-alignment.ts",
  "packages/skeleton/src/loadouts/process-cost.ts",
  "packages/skeleton/src/loadouts/prompt-support.ts",
  "packages/skeleton/src/plan-refutation-protocol.ts",
  "packages/skeleton/src/usage-observation.mjs",
  "packages/skeleton/src/verification-host.ts",
  "packages/skeleton/src/verification-worktree.ts",
  "packages/skeleton/src/verification-protocol.ts",
  "packages/skeleton/src/verification.ts",
  "packages/skeleton/src/worker-protocol.ts",
  "packages/skeleton/src/worker-store.ts",
  "packages/skeleton/src/worker-transport.ts",
  "packages/skeleton/src/writer-teardown.mjs",
  "packages/skeleton/test/feedback-audit-source.test.ts",
  "packages/skeleton/test/feedback-fixtures.test.ts",
  "packages/skeleton/test/feedback-v2.test.ts",
  "scripts/feedback-commit-msg.mjs",
  "scripts/feedback-evidence.mjs",
];

const harnessSources = (root) => [
  ...commonSources,
  docRelative(root, "control", "budgets.json"),
  docRelative(root, "discovery", "harness-smoke-2026-09-07.json"),
  docRelative(root, "discovery", "harness-smoke-2026-09-07.md"),
  docRelative(root, "discovery", "harness-smoke-2026-09-07/claude-bare.json"),
  docRelative(root, "discovery", "harness-smoke-2026-09-07/claude.json"),
  docRelative(root, "discovery", "harness-smoke-2026-09-07/codex.json"),
  docRelative(root, "evidence", "WO-042/harness-context.json"),
  docRelative(root, "evidence", "WO-042/harness-live/executor-001.json"),
  docRelative(root, "evidence", "WO-042/harness-live/executor-002.json"),
  docRelative(root, "evidence", "WO-042/harness-live/executor-003.json"),
  docRelative(root, "evidence", "WO-042/harness-live/release-close-001.json"),
  docRelative(root, "evidence", "WO-042/harness-live/release-close-002.json"),
  docRelative(root, "evidence", "WO-042/harness-live/reviewer-001.json"),
  docRelative(root, "evidence", "WO-042/harness-live/reviewer-002.json"),
  docRelative(root, "evidence", "WO-042/harness-live/reviewer-003.json"),
  docRelative(root, "evidence", "WO-042/harness-live/verifier-001.json"),
  docRelative(root, "evidence", "WO-042/harness-live/verifier-002.json"),
  docRelative(
    root,
    "evidence",
    "WO-042/harness-live/writer-foreign-dead-001.json",
  ),
  docRelative(
    root,
    "evidence",
    "WO-042/harness-live/writer-foreign-dead-002.json",
  ),
  docRelative(
    root,
    "evidence",
    "WO-042/harness-live/writer-foreign-live-001.json",
  ),
  docRelative(
    root,
    "evidence",
    "WO-042/harness-live/writer-foreign-live-002.json",
  ),
  "packages/skeleton/src/feedback-boundary.ts",
  "packages/skeleton/src/feedback-source-comments.ts",
  "packages/skeleton/src/gate-deadlines.mjs",
  "packages/skeleton/src/gate-evidence.mjs",
  "packages/skeleton/src/harness-command.ts",
  "packages/skeleton/src/harness-host.ts",
  "packages/skeleton/src/subagent-budget.ts",
  "packages/skeleton/src/observed-facts.ts",
  "packages/skeleton/src/correction-observation.mjs",
  "packages/skeleton/src/loadouts/contributor.ts",
  "packages/skeleton/src/loadouts/executor-supports.ts",
  "packages/skeleton/src/loadouts/feedback.ts",
  "packages/skeleton/src/loadouts/goal-alignment.ts",
  "packages/skeleton/src/loadouts/process-cost.ts",
  "packages/skeleton/src/loadouts/prompt-support.ts",
  "packages/skeleton/src/usage-observation.mjs",
  "packages/skeleton/src/writer-teardown.mjs",
  "scripts/harness-context.mjs",
  "scripts/harness-evidence.mjs",
  "scripts/lib/harness-context.mjs",
  "scripts/lib/harness.mjs",
  "scripts/lib/paths.mjs",
  "scripts/lib/process-budget.mjs",
  "scripts/lib/terms.mjs",
  "scripts/terms.mjs",
];

/** The recorded source inventory for one launchpad: kit files keep their
 * repository-relative names and document inputs follow the configured roots. */
export const evidenceSources = (root) => ({
  authority: authoritySources(root),
  "artifact-identity": artifactIdentitySources(root),
  verification: verificationSources(root),
  feedback: feedbackSources(root),
  harness: harnessSources(root),
});

// ------------------------------------------------ the import closure (WO-157)

/** Registered siblings a registered source imports but an edition deliberately
 * does not record, each with its reason (WO-157 item 12, WO-151 D001). Every
 * other relative runtime import of a registered source must be registered. */
const BUILD_ONLY =
  "scripts/build.mjs loads it only after compiling, to preserve an installed harness runtime snapshot (harness.mjs) or to test for a main module (paths.mjs); compiled output does not depend on it. The authority and harness editions register it.";
export const evidenceImportExclusions = {
  "*": {
    "scripts/lib/config.mjs":
      "Resolves the launchpad and its configured document roots; each edition's inputs are registered by the path it resolves, and its repository and portfolio validation is outside every edition's recorded behaviour.",
    "packages/skeleton/src/local-model-actor.ts":
      "The local-model actor family (WO-110, WO-138), reached through actor-catalog.ts; no edition dispatches a local-model actor: the feedback self-host admits only claude-cli-print and codex-cli-exec, and verification records the fake transport.",
    "packages/skeleton/src/local-model-contract.ts":
      "The local-model actor contract, reached through actor-contract.ts; no edition dispatches a local-model actor.",
    "packages/skeleton/src/mission-check-host.ts":
      "The resident mission-check actor's host, reached through cli-actor.ts; no edition dispatches a mission check. Its request protocol is registered because the registered transports validate it.",
    "packages/skeleton/src/mission-check-source.ts":
      "The resident mission-check actor's source reader, reached through cli-actor.ts; no edition dispatches a mission check.",
    "packages/skeleton/src/runtime-status.ts":
      "The resident writes this disposable read-only UI projection after a durable event. The evidence editions judge worker, verification and feedback behavior from the log and do not consume the status file; its compiler-independent view contract is checked by WO-114 fixtures.",
  },
  authority: {},
  "artifact-identity": {
    "scripts/lib/harness.mjs": BUILD_ONLY,
    "scripts/lib/paths.mjs": BUILD_ONLY,
  },
  verification: {
    "scripts/lib/harness.mjs": BUILD_ONLY,
    "scripts/lib/paths.mjs": BUILD_ONLY,
  },
  feedback: {
    "scripts/lib/harness.mjs": BUILD_ONLY,
    "scripts/lib/paths.mjs": BUILD_ONLY,
  },
  harness: {},
};

// Imports are read from code tokens, not text (WO-157 VER-001 F4 and its
// repair review): TypeScript's own scanner (typescript/unstable/ast, the one
// feedback-source-comments.ts uses) skips comments and lexes strings,
// templates and regular expressions whole, so a quote, semicolon or `import`
// inside any of them is never read as syntax.
const require = createRequire(import.meta.url);
let typescriptAst;
const tokenKinds = () => {
  if (!typescriptAst) {
    if (require("typescript/package.json").version !== "7.0.2")
      throw new Error(
        "evidence import reader: typescript version drift; recheck the scanner rules",
      );
    typescriptAst = require("typescript/unstable/ast");
  }
  return typescriptAst;
};

/** Code tokens, trivia skipped. A `/` after a value is division, otherwise a
 * regular expression; a `}` closing `${` resumes its template. */
function codeTokens(text) {
  const { SyntaxKind: K, LanguageVariant, createScanner } = tokenKinds();
  const endsValue = (kind) =>
    [
      K.Identifier,
      K.PrivateIdentifier,
      K.StringLiteral,
      K.NumericLiteral,
      K.BigIntLiteral,
      K.NoSubstitutionTemplateLiteral,
      K.TemplateTail,
      K.RegularExpressionLiteral,
      K.CloseParenToken,
      K.CloseBracketToken,
      K.CloseBraceToken,
      K.ThisKeyword,
      K.SuperKeyword,
      K.NullKeyword,
      K.TrueKeyword,
      K.FalseKeyword,
      K.PlusPlusToken,
      K.MinusMinusToken,
    ].includes(kind) ||
    (kind >= K.FirstContextualKeyword &&
      kind <= K.LastContextualKeyword &&
      kind !== K.AwaitKeyword &&
      kind !== K.OfKeyword);
  const scanner = createScanner(true, LanguageVariant.Standard);
  scanner.setText(text);
  const tokens = [];
  const braces = [];
  for (let kind = scanner.scan(); kind !== K.EndOfFile; kind = scanner.scan()) {
    if (
      (kind === K.SlashToken || kind === K.SlashEqualsToken) &&
      !endsValue(tokens.at(-1)?.kind)
    )
      kind = scanner.reScanSlashToken();
    else if (kind === K.OpenBraceToken) braces.push(false);
    else if (kind === K.TemplateHead) braces.push(true);
    else if (kind === K.CloseBraceToken && braces.pop()) {
      kind = scanner.reScanTemplateToken(false);
      if (kind === K.TemplateMiddle) braces.push(true);
    }
    tokens.push({
      kind,
      text: scanner.getTokenText(),
      value: scanner.getTokenValue(),
    });
  }
  return tokens;
}

const IDENTIFIER = /^[\p{ID_Start}$_][\p{ID_Continue}$\u200c\u200d]*$/u;
/** The index after the brace group opened at `start`, or -1. */
const afterGroup = (tokens, start, K) => {
  for (let j = start, depth = 0; j < tokens.length; j++) {
    if (tokens[j].kind === K.OpenBraceToken) depth++;
    else if (tokens[j].kind === K.CloseBraceToken && --depth === 0)
      return j + 1;
  }
  return -1;
};
/** The specifier ending a static import clause that begins at `start`: names,
 * commas, `*`, `as` and brace groups, then `from "x"`, or `= require("x")`. */
function importClauseSource(tokens, start, K) {
  for (let j = start; j > -1 && j < tokens.length;) {
    const token = tokens[j];
    if (
      j > start &&
      token.text === "from" &&
      tokens[j + 1]?.kind === K.StringLiteral
    )
      return tokens[j + 1].value;
    if (token.kind === K.EqualsToken)
      return tokens[j + 1]?.text === "require" &&
        tokens[j + 2]?.kind === K.OpenParenToken &&
        tokens[j + 3]?.kind === K.StringLiteral
        ? tokens[j + 3].value
        : undefined;
    if (token.kind === K.OpenBraceToken) j = afterGroup(tokens, j, K);
    else if (
      token.kind === K.CommaToken ||
      token.kind === K.AsteriskToken ||
      (IDENTIFIER.test(token.text) &&
        token.kind !== K.ImportKeyword &&
        token.kind !== K.ExportKeyword)
    )
      j++;
    else return undefined;
  }
  return undefined;
}

/** Module specifiers a source loads at run time. Skipped: `import type`,
 * `export type`, a type reference `import("x").T` (in code; JSDoc types are
 * comments), and computed specifiers, which name no file. */
function runtimeSpecifiers(text) {
  const { SyntaxKind: K } = tokenKinds();
  const tokens = codeTokens(text);
  const string = (token) =>
    token?.kind === K.StringLiteral ||
    token?.kind === K.NoSubstitutionTemplateLiteral;
  const found = [];
  for (let i = 0; i < tokens.length; i++) {
    const { kind } = tokens[i];
    if (kind !== K.ImportKeyword && kind !== K.ExportKeyword) continue;
    // A member or property named import or export is not a declaration.
    const before = tokens[i - 1]?.kind;
    if (before === K.DotToken || before === K.QuestionDotToken) continue;
    const next = tokens[i + 1];
    if (!next || next.kind === K.ColonToken) continue;
    if (kind === K.ImportKeyword) {
      if (next.kind === K.OpenParenToken) {
        const [, , specifier, after, member, name] = tokens.slice(i);
        if (!string(specifier)) continue;
        if (after?.kind === K.CommaToken) found.push(specifier.value);
        else if (
          after?.kind === K.CloseParenToken &&
          !(
            member?.kind === K.DotToken &&
            !["then", "catch", "finally"].includes(name?.text)
          )
        )
          found.push(specifier.value);
        continue;
      }
      if (next.kind === K.DotToken) continue; // import.meta
      if (next.kind === K.StringLiteral) {
        found.push(next.value);
        continue;
      }
      const third = tokens[i + 2];
      // `import type` unless `type` is the default binding's name.
      const typeOnly =
        next.text === "type" &&
        !(
          third?.kind === K.CommaToken ||
          third?.kind === K.EqualsToken ||
          (third?.text === "from" && tokens[i + 3]?.kind === K.StringLiteral)
        );
      const specifier = importClauseSource(tokens, i + 1, K);
      if (specifier !== undefined && !typeOnly) found.push(specifier);
      continue;
    }
    // Re-exports: `export * [as name] from "x"` or `export {...} from "x"`.
    const typeOnly = next.text === "type";
    let j = typeOnly ? i + 2 : i + 1;
    if (tokens[j]?.kind === K.OpenBraceToken) j = afterGroup(tokens, j, K);
    else if (tokens[j]?.kind === K.AsteriskToken) {
      j++;
      if (tokens[j]?.text === "as") j += 2;
    } else continue;
    if (
      j > 0 &&
      tokens[j]?.text === "from" &&
      tokens[j + 1]?.kind === K.StringLiteral &&
      !typeOnly
    )
      found.push(tokens[j + 1].value);
  }
  return found;
}

/** Repository paths a source imports at run time: relative imports, and a
 * bare `@dotln/<package>` import as that package's `src/index.ts`. A compiled
 * `dist/(src|test)/x.js` target names its source file; other bare packages
 * are dependencies outside the repository. */
export function relativeImports(root, path) {
  const text = readFileSync(join(root, path), "utf8");
  const found = new Set();
  for (const spec of runtimeSpecifiers(text)) {
    const workspace = /^@dotln\/([^/]+)$/u.exec(spec);
    if (workspace) {
      const index = `packages/${workspace[1]}/src/index.ts`;
      if (existsSync(join(root, index))) found.add(index);
      continue;
    }
    if (!spec.startsWith(".")) continue;
    let target = posix.normalize(posix.join(posix.dirname(path), spec));
    const built = /^packages\/([^/]+)\/dist\/(src|test)\/(.+)\.js$/u.exec(
      target,
    );
    if (built) {
      const stem = `packages/${built[1]}/${built[2]}/${built[3]}`;
      target =
        [".ts", ".mjs"]
          .map((extension) => stem + extension)
          .find((file) => existsSync(join(root, file))) ?? target;
    } else if (
      target.endsWith(".js") &&
      existsSync(join(root, target.replace(/\.js$/u, ".ts")))
    )
      target = target.replace(/\.js$/u, ".ts");
    found.add(target);
  }
  return [...found].sort();
}

/** `importer imports target` for every relative runtime import of a
 * registered source that the edition neither registers nor excludes. */
export function unregisteredEvidenceImports(root, kind) {
  const sources = evidenceSources(root)[kind];
  if (!sources) throw new Error(`unknown evidence edition: ${kind}`);
  const registered = new Set(sources);
  const excluded = {
    ...evidenceImportExclusions["*"],
    ...evidenceImportExclusions[kind],
  };
  const findings = [];
  for (const source of sources.filter((path) =>
    /\.(?:ts|mjs|js|cjs)$/u.test(path),
  ))
    for (const target of relativeImports(root, source))
      if (!registered.has(target) && !Object.hasOwn(excluded, target))
        findings.push(`${source} imports ${target}`);
  return findings;
}

/** Run by every edition script before it writes or checks anything. */
export function checkEvidenceImports(root, kind) {
  const findings = unregisteredEvidenceImports(root, kind);
  if (findings.length)
    throw new Error(
      `${findings.map((finding) => `unregistered ${kind} evidence import: ${finding}`).join("\n")}; register it in scripts/lib/evidence-sources.mjs or exclude it there with a reason`,
    );
}
