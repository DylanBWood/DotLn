import { COMPILER_PACKAGE_VERSION } from "./artifact-identity.js";
import { operatorControl } from "./operator-control.mjs";
import { codexContinuation } from "./codex-continuation.mjs";
import {
  assertCompiledFeedback,
  compileFeedbackUnits,
  type CompiledFeedback,
  type FeedbackHandler,
} from "./feedback.js";
import { canonicalStringify, fnv1a64, semanticHash } from "./normalize.js";
import type {
  AuthorityEnvelope,
  AuthorityGrant,
  CompiledProgram,
} from "./types.js";
import { repositoryPath, verificationLine } from "./verification.js";

/** Pure output policy; the host supplies its atomic marker operation.
 * Observation failures show the message; they never alter a permission decision.
 */
export function showHarnessAdvisory(
  sessionId: string | undefined,
  event: string,
  cause: string,
  claimMarker: (key: string) => boolean,
): boolean {
  if (event === "PostToolUse") return false;
  if (!sessionId) return true;
  try {
    return claimMarker(JSON.stringify([sessionId, cause]));
  } catch {
    return true;
  }
}

export type HarnessEvent =
  "PreToolUse" | "PostToolUse" | "Stop" | "UserPromptSubmit";
export interface HarnessObservation {
  readonly available: boolean;
  readonly evidence: string;
  readonly reason?: string;
}
export interface HarnessProfile {
  readonly kind?: "contributor-v1" | "target-worker-v1";
  readonly profileId: string;
  readonly harness: "claude-code" | "codex-cli" | "copilot-cli";
  readonly observedVersion: string;
  readonly tools?: Readonly<
    Record<
      string,
      "read" | "write" | "shell" | "spawn" | "stop" | "interaction"
    >
  >;
  readonly events: Readonly<Record<HarnessEvent, HarnessObservation>>;
  /** Separately witnessed native compaction hooks; never enables Claude hooks. */
  readonly codexContinuation?: HarnessObservation & {
    readonly observedVersion: string;
  };
  readonly skills: HarnessObservation & { readonly root: string };
  readonly settings: HarnessObservation & {
    readonly path: string;
    readonly deny: boolean;
    readonly allow: boolean;
  };
  readonly instruction: HarnessObservation & { readonly path: string };
  readonly refusal: "claude-command-json-v1" | "unavailable";
  readonly runtime: {
    readonly skeletonVersion: string;
    readonly boundaryContract: "feedback-v1";
    readonly snapshot?: string;
    /** Emit-time launchpad path; never serialized into a manifest or config. */
    readonly importRoot?: string;
    readonly targetId?: string;
    readonly files?: readonly {
      readonly path: string;
      readonly hash: string;
    }[];
  };
}
/** Harness target authority; deliberately outside the loadout-v1/kernel IR. */
export type OutsideWriteGrant = {
  readonly source: string;
} & (
  | {
      readonly kind:
        "system-temp" | "session-scratch" | "host-scratchpad" | "main-intake";
    }
  | { readonly kind: "operator-root"; readonly root: string }
);
export interface RoleOutsideWriteGrants {
  readonly role: string;
  readonly grants: readonly (OutsideWriteGrant & {
    readonly originId: string;
    readonly authorityGrantId: string;
  })[];
}
export interface HarnessRole {
  readonly facetId: string;
  readonly name: string;
  readonly description: string;
  readonly intents: readonly string[];
  readonly procedure: readonly string[];
  readonly feedbackHandlers: readonly FeedbackHandler[];
  readonly outsideWriteGrants?: readonly OutsideWriteGrant[];
}
export type HarnessFacet =
  | {
      readonly facetId: string;
      readonly kind: "permission-guard";
      readonly matchers: readonly {
        readonly effect: string;
        readonly deny: string;
      }[];
    }
  | {
      readonly facetId: string;
      readonly kind: "prompt-fragment";
      readonly text: string;
    }
  | ({
      readonly facetId: string;
      readonly kind: "role-procedure";
      readonly text: string;
      readonly outsideWriteGrants?: readonly OutsideWriteGrant[];
    } & (
      | { readonly roleName: string; readonly roleNames?: never }
      | { readonly roleNames: readonly string[]; readonly roleName?: never }
    ));

const procedureRoles = (
  facet: Extract<HarnessFacet, { kind: "role-procedure" }>,
): readonly string[] =>
  Array.isArray(facet.roleNames)
    ? facet.roleNames
    : typeof facet.roleName === "string"
      ? [facet.roleName]
      : [];
/** Separate target input. It never extends or changes the loadout-v1 preimage. */
export interface HarnessProgram {
  readonly contractVersion: "harness-v1";
  readonly loadout: CompiledProgram;
  readonly roles: readonly HarnessRole[];
  readonly facets: readonly HarnessFacet[];
  readonly correctionToken: string | null;
}
export interface HarnessOrigin {
  readonly ids: readonly string[];
  readonly loadoutId: string;
  readonly semanticHash: string;
}
export interface HarnessFile {
  readonly path: string;
  readonly contents: string;
  readonly origin: HarnessOrigin;
  readonly rung: number;
}
export interface HarnessResidue {
  readonly originId: string;
  readonly reason: string;
  readonly missingCapabilities: readonly string[];
  readonly text?: string;
}
export interface HarnessBundle {
  readonly contractVersion: "harness-v1";
  readonly files: readonly HarnessFile[];
  readonly manifest: {
    readonly contractVersion: "harness-v1";
    readonly compilerPackageVersion: string;
    readonly feedbackPolicyHash: string;
    readonly grants: readonly AuthorityGrant[];
    readonly outsideWriteGrants?: readonly RoleOutsideWriteGrants[];
    readonly authorityGrantRegistryHash: string | null;
    readonly profile: HarnessProfile;
    readonly loadout: {
      readonly id: string;
      readonly semanticHash: string;
      readonly targetHash: string;
    };
    readonly files: readonly {
      readonly path: string;
      readonly hash: string;
      readonly origin: HarnessOrigin;
      readonly rung: number;
    }[];
    readonly origin: HarnessOrigin;
  };
  readonly residue: {
    readonly items: readonly HarnessResidue[];
    readonly bytes: number;
    readonly fragment: string;
  };
}
const ensure: (ok: unknown, reason: string) => asserts ok = (ok, reason) => {
  if (!ok) throw new Error(`harness contract: ${reason}`);
};

export function assertOutsideWriteGrants(
  value: unknown,
): asserts value is readonly OutsideWriteGrant[] {
  ensure(Array.isArray(value), "outside-write grants must be an array");
  for (const grant of value) {
    ensure(
      grant &&
        typeof grant === "object" &&
        typeof grant.source === "string" &&
        verificationLine(grant.source) &&
        [
          "system-temp",
          "session-scratch",
          "host-scratchpad",
          "main-intake",
          "operator-root",
        ].includes(grant.kind) &&
        (grant.kind === "operator-root"
          ? typeof grant.root === "string" &&
            /^\//.test(grant.root) &&
            !/[\u0000-\u001f\u007f]/.test(grant.root)
          : !Object.hasOwn(grant, "root")),
      "outside-write grant needs a closed kind, source and operator absolute root",
    );
  }
}

/** Exact effects keep the existing envelope's GRANTS projection authoritative. */
export const outsideWriteEffect = (grant: OutsideWriteGrant): string =>
  `outside.write:${grant.kind}${grant.kind === "operator-root" ? `:${encodeURIComponent(grant.root).replaceAll("*", "%2A")}` : ""}`;

function outsideWriteGrantsFor(
  program: HarnessProgram,
): RoleOutsideWriteGrants[] {
  return program.roles.map((role) => ({
    role: role.name,
    grants: [
      ...(role.outsideWriteGrants ?? []).map((grant) => ({
        ...grant,
        originId: role.facetId,
      })),
      ...program.facets.flatMap((facet) =>
        facet.kind === "role-procedure" &&
        procedureRoles(facet).includes(role.name)
          ? (facet.outsideWriteGrants ?? []).map((grant) => ({
              ...grant,
              originId: facet.facetId,
            }))
          : [],
      ),
    ].map((grant) => {
      const effect = outsideWriteEffect(grant);
      const authority = program.loadout.grants?.find((candidate) =>
        candidate.effects.includes(effect),
      );
      const envelope = program.loadout.authorityEnvelope;
      ensure(
        authority &&
          program.loadout.trace.authorityGrants?.registryHash &&
          program.loadout.trace.authorityGrants.applied.some(
            (entry) =>
              canonicalStringify(entry) === canonicalStringify(authority),
          ) &&
          envelope.allowedEffects.includes(effect) &&
          !envelope.deniedEffects.some(
            (denied) =>
              denied === effect ||
              (denied.endsWith("*") && effect.startsWith(denied.slice(0, -1))),
          ),
        "outside-write root requires an admitted provenance-bearing grant in the effective envelope",
      );
      return { ...grant, authorityGrantId: authority.grantId };
    }),
  }));
}
const id = (value: string) => /^[a-z][a-z0-9.-]{0,99}$/.test(value);
const hash = (text: string) => `fnv1a64:${fnv1a64(text)}`;
const json = (value: unknown) => JSON.stringify(value, null, 2) + "\n";
const heartbeatHook = (event: HarnessEvent, runtimeURL: string) => `try {
const { text } = await import("node:stream/consumers");
const input = JSON.parse(await text(process.stdin));
const { recordHarnessHeartbeat } = await import(${JSON.stringify(runtimeURL)});
await recordHarnessHeartbeat(${JSON.stringify(event)}, input);
} catch { process.stderr.write("DotLn advisory: presence heartbeat unavailable\\n"); }
process.stdout.write("{}");
`;
const events: readonly HarnessEvent[] = [
  "PreToolUse",
  "PostToolUse",
  "Stop",
  "UserPromptSubmit",
];
const hookFor: Partial<Record<FeedbackHandler, HarnessEvent>> = {
  attribution: "PreToolUse",
  "writer-isolation": "PreToolUse",
  "suppression-diff": "PostToolUse",
  "application-evidence": "Stop",
  "complete-scope": "Stop",
  "output-review": "Stop",
  "semantic-correction": "UserPromptSubmit",
};
export const HARNESS_START = "<!-- dotln-harness:start -->";
export const HARNESS_END = "<!-- dotln-harness:end -->";

export function assertHarnessProfile(profile: HarnessProfile): void {
  ensure(profile && id(profile.profileId), "profile identity");
  ensure(
    ["claude-code", "codex-cli", "copilot-cli"].includes(profile.harness) &&
      verificationLine(profile.observedVersion),
    "observed harness version",
  );
  for (const capability of [
    ...events.map((event) => profile.events[event]),
    profile.skills,
    profile.settings,
    profile.instruction,
    ...(profile.codexContinuation ? [profile.codexContinuation] : []),
  ]) {
    ensure(
      capability &&
        typeof capability.available === "boolean" &&
        verificationLine(capability.evidence),
      "capability observation",
    );
    ensure(
      repositoryPath(capability.evidence.split("#")[0]) &&
        !capability.evidence.startsWith("docs/intake/"),
      "public observation reference",
    );
    ensure(
      capability.available || verificationLine(capability.reason ?? ""),
      "unavailable capability must explain why",
    );
  }
  ensure(
    repositoryPath(profile.skills.root) &&
      repositoryPath(profile.settings.path) &&
      repositoryPath(profile.instruction.path),
    "contained profile paths",
  );
  ensure(
    profile.skills.root ===
      (profile.harness === "claude-code" ? ".claude/skills" : ".agents/skills"),
    "observed skills root",
  );
  ensure(
    profile.settings.path === ".claude/settings.json" &&
      profile.instruction.path ===
        (profile.kind === "target-worker-v1"
          ? "CLAUDE.local.md"
          : profile.harness === "claude-code"
            ? "CLAUDE.md"
            : "AGENTS.md"),
    "project-only profile surfaces",
  );
  ensure(
    !profile.settings.allow,
    "allow entries have no observed local contract",
  );
  if (profile.codexContinuation)
    ensure(
      profile.harness === "codex-cli" &&
        profile.kind !== "target-worker-v1" &&
        verificationLine(profile.codexContinuation.observedVersion),
      "Codex contributor continuation observation",
    );
  ensure(
    profile.kind === undefined ||
      ["contributor-v1", "target-worker-v1"].includes(profile.kind),
    "profile kind",
  );
  ensure(
    profile.runtime.importRoot === undefined ||
      (profile.kind === "target-worker-v1" &&
        profile.runtime.importRoot.startsWith("/") &&
        !profile.runtime.importRoot.includes("\\") &&
        !profile.runtime.importRoot
          .split("/")
          .some((part) => part === ".." || part === ".") &&
        !/[\u0000-\u001f\u007f]/.test(profile.runtime.importRoot)),
    "absolute target import root",
  );
  if (profile.kind === "target-worker-v1") {
    ensure(
      profile.harness !== "copilot-cli",
      "Copilot is operator-launched only",
    );
    ensure(
      Boolean(profile.runtime.importRoot && profile.runtime.snapshot) &&
        /^[a-f0-9]{64}$/.test(profile.runtime.targetId ?? ""),
      "target runtime binding",
    );
    ensure(
      !profile.skills.available &&
        !profile.events.PostToolUse.available &&
        !profile.events.Stop.available &&
        !profile.events.UserPromptSubmit.available,
      "target profile has PreToolUse only and no skills",
    );
  }
  ensure(
    !events.some((event) => profile.events[event].available) ||
      (["claude-code", "copilot-cli"].includes(profile.harness) &&
        profile.refusal === "claude-command-json-v1" &&
        profile.settings.available),
    "observed refusal protocol required",
  );
  ensure(
    profile.runtime.boundaryContract === "feedback-v1" &&
      /^\d+\.\d+\.\d+$/.test(profile.runtime.skeletonVersion),
    "pinned runtime",
  );
  ensure(
    profile.runtime.snapshot === undefined ||
      /^\.runtime\/harness\/[a-f0-9]{16}$/.test(profile.runtime.snapshot),
    "contained immutable runtime snapshot",
  );
  ensure(
    (profile.runtime.files ?? []).every(
      (file) =>
        /^packages\/(?:compiler|skeleton)\/dist\/src\/[a-z-]+\.(?:js|mjs)$/.test(
          file.path,
        ) && /^fnv1a64:[a-f0-9]{16}$/.test(file.hash),
    ),
    "runtime artifact bindings",
  );
  if (events.some((event) => profile.events[event].available))
    ensure(
      [
        "packages/compiler/dist/src/feedback.js",
        "packages/skeleton/dist/src/feedback-boundary.js",
        "packages/skeleton/dist/src/feedback-source-comments.js",
        "packages/skeleton/dist/src/harness-host.js",
        "packages/skeleton/dist/src/reactor.js",
      ].every((path) =>
        profile.runtime.files?.some((file) => file.path === path),
      ),
      "observed hooks require all pinned runtime artifacts",
    );
}

/** Pure, deterministic target lowering. Hook predicates stay in feedbackBoundary. */
export function lowerToHarness(
  program: HarnessProgram,
  feedback: CompiledFeedback,
  envelope: AuthorityEnvelope,
  profile: HarnessProfile,
): HarnessBundle {
  assertHarnessProfile(profile);
  assertCompiledFeedback(feedback);
  // Copilot loads the AGENTS.md symlink; shared hooks observe its canonical file.
  const instructionFile =
    profile.harness === "copilot-cli" ? "CLAUDE.md" : profile.instruction.path;
  ensure(program.contractVersion === "harness-v1", "target version");
  ensure(
    canonicalStringify(envelope) ===
      canonicalStringify(program.loadout.authorityEnvelope),
    "envelope must be the compiled build envelope",
  );
  ensure(
    program.correctionToken === null ||
      /^[a-z][a-z-]*:$/.test(program.correctionToken),
    "exact correction token",
  );
  const ids = [
    ...program.roles.map((role) => role.facetId),
    ...program.facets.map((facet) => facet.facetId),
    ...feedback.units.map((unit) => unit.unitId),
  ];
  ensure(
    ids.every(id) && new Set(ids).size === ids.length,
    "unique safe origin identifiers",
  );
  const seenIntents = new Set<string>();
  for (const facet of program.facets) {
    ensure(
      ["permission-guard", "prompt-fragment", "role-procedure"].includes(
        facet.kind,
      ),
      "supported facet adapter",
    );
    if (facet.kind === "permission-guard")
      ensure(
        facet.matchers.length > 0 &&
          facet.matchers.every(
            (matcher) =>
              envelope.deniedEffects.includes(matcher.effect) &&
              /^Bash\([a-zA-Z0-9 ._/*:-]+\)$/.test(matcher.deny),
          ),
        "deny matchers must name a denied build effect and the observed Bash shape",
      );
    if (facet.kind === "role-procedure") {
      assertOutsideWriteGrants(facet.outsideWriteGrants ?? []);
      const targets = procedureRoles(facet);
      const component = program.loadout.componentManifest.find(
        (entry) => entry.componentId === facet.facetId,
      );
      ensure(
        component?.componentKind === "support-facet" &&
          component.mechanismTypes.length === 1 &&
          component.mechanismTypes[0] === "prompt-fragment" &&
          verificationLine(facet.text) &&
          program.loadout.promptFragments.includes(facet.text) &&
          Object.hasOwn(facet, "roleName") !==
            Object.hasOwn(facet, "roleNames") &&
          targets.length > 0 &&
          new Set(targets).size === targets.length &&
          targets.every((name) =>
            program.roles.some(
              (role) =>
                role.name === name && role.procedure.includes(facet.text),
            ),
          ),
        "role procedure must carry an equipped prompt support's compiled fragment",
      );
    }
  }
  for (const role of program.roles) {
    assertOutsideWriteGrants(role.outsideWriteGrants ?? []);
    ensure(
      id(role.name) &&
        verificationLine(role.description) &&
        role.procedure.length > 0 &&
        role.intents.length > 0,
      "role contract",
    );
    for (const intent of role.intents) {
      ensure(
        verificationLine(intent) && !seenIntents.has(intent),
        "unique exact intent binding",
      );
      seenIntents.add(intent);
    }
    ensure(role.procedure.every(verificationLine), "role procedure lines");
  }
  const semantic = semanticHash(program.loadout);
  const origin = (names: readonly string[]): HarnessOrigin => ({
    ids: [...new Set(names)].sort(),
    loadoutId: program.loadout.loadoutId,
    semanticHash: semantic,
  });
  const targetHash = hash(canonicalStringify(program));
  const outsideWriteGrants = outsideWriteGrantsFor(program);
  if (profile.kind === "target-worker-v1")
    return lowerTargetWorker(
      program,
      feedback,
      envelope,
      profile,
      semantic,
      targetHash,
    );
  const files: HarnessFile[] = [];
  const residue: HarnessResidue[] = [];
  for (const component of program.loadout.componentManifest) {
    if (
      !program.facets.some((facet) => facet.facetId === component.componentId)
    )
      residue.push({
        originId: component.componentId,
        reason: "The compiled component has no declared harness facet adapter.",
        missingCapabilities: component.mechanismTypes.map(
          (mechanism) => `lowering.${mechanism}`,
        ),
      });
  }
  const hookPaths = new Map<HarnessEvent | "SessionStart", string[]>();
  const hookRoot = ".claude/hooks";
  const emit = (
    path: string,
    contents: string,
    names: readonly string[],
    rung: number,
  ) => {
    ensure(
      repositoryPath(path) && !files.some((file) => file.path === path),
      "unique contained output path",
    );
    files.push({ path, contents, origin: origin(names), rung });
  };
  const hook = (
    name: string,
    event: HarnessEvent,
    config: unknown,
    names: readonly string[],
    rung: number,
  ) => {
    const path = `${hookRoot}/${name}.mjs`;
    const origins = [
      ...names,
      ...outsideWriteGrants.flatMap((row) =>
        row.grants.map((grant) => grant.originId),
      ),
    ];
    const header = `// Origin: ${canonicalStringify(origin(origins))}\n`;
    // The same session file handles startup diagnostics and prompt dispatch.
    const eventExpression =
      name === "session"
        ? `(input?.hook_event_name === "SessionStart" ? "SessionStart" : "UserPromptSubmit")`
        : JSON.stringify(event);
    // WO-144: the fallback's root is this hook's own project, two levels above
    // its file. The session's directory may be a subdirectory or another
    // repository, and a marker or journal row must never land there.
    const fallback = `const fs = await import("node:fs");
const { join } = await import("node:path");
const { createHash } = await import("node:crypto");
const { fileURLToPath } = await import("node:url");
const root = fileURLToPath(new URL("../../", import.meta.url));
const snapshot = ${JSON.stringify(profile.runtime.snapshot ?? null)};
let cause = snapshot && !fs.existsSync(join(root, snapshot)) ? "snapshot-missing" : "runtime-unavailable";
try {
  const hash = ${fnv1a64.toString()};
  for (const file of ${JSON.stringify(profile.runtime.files ?? [])}) {
    if (fs.existsSync(join(root, file.path)) && "fnv1a64:" + hash(fs.readFileSync(join(root, file.path), "utf8")) !== file.hash) {
      cause = "pins-differ";
      break;
    }
    if (snapshot) {
      const saved = join(root, snapshot, file.path);
      if (!fs.existsSync(saved)) cause = "snapshot-missing";
      else if ("fnv1a64:" + hash(fs.readFileSync(saved, "utf8")) !== file.hash) {
        cause = "pins-differ";
        break;
      }
    }
  }
} catch {}
const advisory = "DotLn advisory: " + cause + ": built adapter unavailable; run node scripts/bootstrap.mjs to prepare this worktree; host permissions decide.";
const response = (${showHarnessAdvisory.toString()})(input?.session_id, ${eventExpression}, cause, (key) => {
  const directory = join(root, "docs/control/local/harness");
  fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
  const marker = join(directory, createHash("sha256").update(key).digest("hex") + ".advisory");
  try { fs.writeFileSync(marker, JSON.stringify({ sessionKey: createHash("sha256").update(String(input?.session_id)).digest("hex") }) + "\\n", { flag: "wx", mode: 0o600 }); }
  catch (error) {
    if (error?.code === "EEXIST") return !fs.lstatSync(marker).isFile();
    throw error;
  }
  return true;
}) ? { systemMessage: advisory } : {};
try {
  const directory = join(root, "docs/control/local/harness");
  const key = createHash("sha256").update(String(input?.session_id ?? "unknown")).digest("hex");
  const path = join(directory, key + ".jsonl");
  fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
  if (!fs.existsSync(path) || fs.lstatSync(path).isFile())
    fs.appendFileSync(path, JSON.stringify({ recordedAt: new Date().toISOString(), event: ${eventExpression}, advisory, delegated: true }) + "\\n", { mode: 0o600 });
} catch {}
process.stdout.write(JSON.stringify(response));`;

    emit(
      path,
      `${header}let input, control;\ntry {\nconst { text } = await import("node:stream/consumers");\nconst rawInput = await text(process.stdin);\ntry { input = JSON.parse(rawInput); } catch {}\nconst event = ${eventExpression};\nconst recoveryInput = input !== null && typeof input === "object" && !Array.isArray(input) && (input.prompt === undefined || typeof input.prompt === "string") && (typeof input.session_id === "string" || (event === "UserPromptSubmit" && /^(analysis|operator override):(?:\\s|$)/i.test((input.prompt ?? "").trim())));\ncontrol = recoveryInput ? await (${operatorControl.toString()})({ ...input, session_id: typeof input.session_id === "string" ? input.session_id : undefined }, event) : null;\nif (control && !control.overrideExit) { process.stdout.write(JSON.stringify(control)); } else {\nconst { feedbackBoundary } = await import("../../${profile.runtime.snapshot ? `${profile.runtime.snapshot}/` : ""}packages/skeleton/dist/src/feedback-boundary.js");\nconst { runHarnessHook } = await import("../../${profile.runtime.snapshot ? `${profile.runtime.snapshot}/` : ""}packages/skeleton/dist/src/harness-host.js");\nawait runHarnessHook(${json({ compilerPackageVersion: COMPILER_PACKAGE_VERSION, runtime: profile.runtime, event, tools: profile.tools, envelope, grants: program.loadout.grants ?? [], outsideWriteGrants, ...(config as object) }).trim()}, feedbackBoundary, input, rawInput, control);\n}\n} catch { if (control?.overrideExit) { const { overrideExit, ...exited } = control; const advisory = "DotLn advisory: the pinned runtime is unavailable, so OperatorOverrideRecorded was not appended. " + overrideExit.advisory; process.stdout.write(JSON.stringify({ systemMessage: exited.systemMessage + " " + advisory, hookSpecificOutput: { hookEventName: "UserPromptSubmit", additionalContext: advisory } })); } else { ${fallback} } }\n`,
      origins,
      rung,
    );
    hookPaths.set(event, [...(hookPaths.get(event) ?? []), path]);
  };
  for (const unit of feedback.units) {
    if (unit.mechanism.kind === "prose") continue;
    const event = hookFor[unit.trigger];
    // The finalizer carries every Stop unit. Do not install unused per-unit
    // files that would still be hashed, pinned and counted as live hooks.
    if (event === "Stop" && profile.events.Stop.available) continue;
    if (
      event &&
      profile.events[event].available &&
      (unit.trigger !== "semantic-correction" ||
        program.correctionToken !== null)
    ) {
      hook(
        unit.unitId,
        event,
        {
          kind: "feedback",
          policy: compileFeedbackUnits([unit]),
          correctionToken: program.correctionToken,
          ...(unit.trigger === "semantic-correction" ? { envelope } : {}),
        },
        [unit.unitId],
        event === "Stop"
          ? 6
          : event === "PostToolUse"
            ? 1
            : event === "UserPromptSubmit"
              ? 3
              : 2,
      );
      if (unit.trigger === "attribution") {
        emit(
          `${hookRoot}/commit-msg.mjs`,
          `// Origin: ${canonicalStringify(origin([unit.unitId]))}\nconst { runCommitMessageHook } = await import("../../${profile.runtime.snapshot ? `${profile.runtime.snapshot}/` : ""}packages/skeleton/dist/src/harness-host.js");\nconst { feedbackBoundary } = await import("../../${profile.runtime.snapshot ? `${profile.runtime.snapshot}/` : ""}packages/skeleton/dist/src/feedback-boundary.js");\nawait runCommitMessageHook(${json({ compilerPackageVersion: COMPILER_PACKAGE_VERSION, runtime: profile.runtime, policy: compileFeedbackUnits([unit]) }).trim()}, feedbackBoundary);\n`,
          [unit.unitId],
          1,
        );
      }
    } else if (event) {
      const missing =
        unit.trigger === "semantic-correction" &&
        program.correctionToken === null
          ? "operator.correction-token.confirmed"
          : `hooks.${event}`;
      residue.push({
        originId: unit.unitId,
        reason:
          missing === "operator.correction-token.confirmed"
            ? "Exact operator token is unconfirmed; typed correction procedure is carried by the role skill."
            : `${profile.events[event].reason}; the role skill carries the remaining duty.`,
        missingCapabilities: [missing],
      });
    }
    if (
      !event &&
      program.roles.some((role) => role.feedbackHandlers.includes(unit.trigger))
    ) {
      residue.push({
        originId: unit.unitId,
        reason:
          "The harness exposes no admitted semantic judgment facts; the role skill carries procedure, and the equipped feedback host retains the hard boundary.",
        missingCapabilities: [`facts.${unit.trigger}`],
      });
    } else if (
      !program.roles.some((role) =>
        role.feedbackHandlers.includes(unit.trigger),
      ) &&
      !event
    ) {
      residue.push({
        originId: unit.unitId,
        reason: "No role facet carries this unit.",
        missingCapabilities: ["role.feedback-handler"],
        text: unit.proseEquivalent,
      });
    }
  }
  const permissions = program.facets.filter(
    (facet): facet is Extract<HarnessFacet, { kind: "permission-guard" }> =>
      facet.kind === "permission-guard",
  );
  if (permissions.length) {
    if (profile.events.PreToolUse.available)
      hook(
        "permissions",
        "PreToolUse",
        { kind: "permission", envelope, facets: permissions },
        permissions.map((facet) => facet.facetId),
        2,
      );
    else
      for (const facet of permissions)
        residue.push({
          originId: facet.facetId,
          reason:
            "Pre-effect envelope checks unavailable in this harness; native sandbox and approval remain host controls.",
          missingCapabilities: ["hooks.PreToolUse", "settings.permissions"],
        });
  }
  if (profile.events.PreToolUse.available)
    hook(
      "write-observer",
      "PreToolUse",
      { kind: "observe" },
      ["read-your-own-output"],
      1,
    );
  if (profile.events.PostToolUse.available)
    hook(
      "read-observer",
      "PostToolUse",
      {
        kind: "observe",
        roles: program.roles.map(({ facetId, name, intents }) => ({
          facetId,
          name,
          intents,
        })),
        instructionFile,
      },
      [
        ...program.roles.map((role) => role.facetId),
        ...feedback.units
          .filter((unit) =>
            ["output-review", "application-evidence"].includes(unit.trigger),
          )
          .map((unit) => unit.unitId),
      ],
      1,
    );
  if (profile.events.UserPromptSubmit.available)
    hook(
      "session",
      "UserPromptSubmit",
      {
        kind: "session",
        roles: program.roles.map(({ facetId, name, intents }) => ({
          facetId,
          name,
          intents,
        })),
        instructionFile,
      },
      program.roles.map((role) => role.facetId),
      1,
    );
  if (profile.events.UserPromptSubmit.available)
    hookPaths.set("SessionStart", [`${hookRoot}/session.mjs`]);
  if (profile.events.Stop.available)
    hook(
      "finish",
      "Stop",
      { kind: "finish", policy: feedback },
      [
        ...program.roles.map((role) => role.facetId),
        ...feedback.units.map((unit) => unit.unitId),
      ],
      6,
    );
  for (const event of events) {
    if (!profile.events[event].available) continue;
    const path = `${hookRoot}/presence-${event.toLowerCase()}.mjs`;
    emit(
      path,
      `// Origin: ${canonicalStringify(origin([]))}\n` +
        heartbeatHook(
          event,
          `../../${profile.runtime.snapshot ? `${profile.runtime.snapshot}/` : ""}packages/skeleton/dist/src/presence-heartbeat.js`,
        ),
      [],
      1,
    );
    hookPaths.set(event, [...(hookPaths.get(event) ?? []), path]);
  }
  for (const role of program.roles) {
    const supportIds = program.facets.flatMap((facet) =>
      facet.kind === "role-procedure" &&
      procedureRoles(facet).includes(role.name)
        ? [facet.facetId]
        : [],
    );
    // Both harnesses receive the same duties. Hooks are a host capability,
    // not a reason to hide a rule or its commands from either role.
    const units = feedback.units.filter((unit) =>
      role.feedbackHandlers.includes(unit.trigger),
    );
    const name = `dotln-${role.name}`;
    if (!profile.skills.available) {
      residue.push({
        originId: role.facetId,
        reason: profile.skills.reason!,
        missingCapabilities: ["skills.project-root"],
        text: role.procedure.join(" "),
      });
      continue;
    }
    const body = [
      "---",
      `name: ${name}`,
      `description: ${JSON.stringify(role.description)}`,
      "---",
      "",
      `<!-- Origin: ${canonicalStringify(origin([role.facetId, ...supportIds, ...units.map((unit) => unit.unitId)]))} -->`,
      "",
      ...role.procedure,
      "",
      `Outside-write grants for ${role.name}: ${
        outsideWriteGrants
          .find((row) => row.role === role.name)!
          .grants.map((grant) =>
            grant.kind === "operator-root"
              ? `${grant.kind} ${grant.root}`
              : grant.kind,
          )
          .join(", ") || "none"
      }; system-temp is os.tmpdir(); host-scratchpad is only the scratchpad Claude Code prints for this session; use the DotLn scratch path printed at role dispatch (Codex: node scripts/harness.mjs scratch). Native scratch and /tmp need a separate grant when outside system-temp. Sources are in the manifest. Literal /dev/null redirects discard output; other device mutations need grants.`,
      "",
      HARNESS_BOUNDARIES,
      "",
      ...units.map((unit) => `${unit.unitId}: ${unit.desiredBehavior}`),
      "",
    ].join("\n");
    emit(
      `${profile.skills.root}/${name}/SKILL.md`,
      body,
      [role.facetId, ...supportIds, ...units.map((unit) => unit.unitId)],
      7,
    );
  }
  for (const facet of program.facets)
    if (facet.kind === "prompt-fragment") {
      ensure(verificationLine(facet.text), "one-line residue");
      ensure(
        !program.roles.some((role) =>
          role.procedure.some(
            (line) =>
              line === facet.text ||
              line.includes(facet.text) ||
              facet.text.includes(line),
          ),
        ),
        "residue duplicates role procedure",
      );
      residue.push({
        originId: facet.facetId,
        reason: "No lower declared mechanism carries this fragment.",
        missingCapabilities: ["facet.lower-mechanism"],
        text: facet.text,
      });
    }
  if (profile.settings.available) {
    const deny = permissions.flatMap((facet) =>
      facet.matchers
        .filter((matcher) => envelope.deniedEffects.includes(matcher.effect))
        .map((matcher) => matcher.deny),
    );
    const settings = {
      $schema: "https://json.schemastore.org/claude-code-settings.json",
      autoMemoryEnabled: false,
      ...(feedback.units.some((unit) => unit.trigger === "attribution")
        ? { attribution: { commit: "", pr: "", sessionUrl: false } }
        : {}),
      permissions: { deny: [...new Set(deny)].sort() },
      hooks: Object.fromEntries(
        [...hookPaths].map(([event, paths]) => [
          event,
          [
            {
              ...(event.includes("Tool") ? { matcher: ".*" } : {}),
              hooks: paths.map((path) => ({
                type: "command",
                command: `node \"$CLAUDE_PROJECT_DIR/${path}\"`,
                timeout: 15,
              })),
            },
          ],
        ]),
      ),
    };
    emit(profile.settings.path, json(settings), ids, 2);
  }
  if (profile.codexContinuation?.available) {
    const path = ".codex/hooks/continuation.mjs";
    const names = program.roles.map((role) => role.facetId);
    emit(
      path,
      `// Origin: ${canonicalStringify(origin(names))}\n` +
        `const { text } = await import("node:stream/consumers");\n` +
        `try {\nconst source = await text(process.stdin);\n` +
        `if (Buffer.byteLength(source) > 1048576) throw new Error("oversized hook input");\n` +
        `const output = await (${codexContinuation.toString()})(JSON.parse(source), ${operatorControl.toString()});\n` +
        `process.stdout.write(JSON.stringify(output));\n` +
        `} catch { process.stdout.write(JSON.stringify({systemMessage:"DotLn Codex continuation input unavailable; native stopping remains available."})); }\n`,
      names,
      1,
    );
    emit(
      ".codex/config.toml",
      "# DotLn project layer. Continuation hooks are in hooks.json; review them with /hooks.\n",
      names,
      1,
    );
    emit(
      ".codex/hooks.json",
      json({
        description:
          "DotLn: restore an owned unfinished task after compaction; one premature-stop continuation per compacted turn.",
        hooks: Object.fromEntries(
          ["PostCompact", "SessionStart", "Stop", "UserPromptSubmit"].map(
            (event) => [
              event,
              [
                {
                  ...(event === "SessionStart" ? { matcher: "^compact$" } : {}),
                  hooks: [
                    {
                      type: "command",
                      command: `node \"$(git rev-parse --show-toplevel)/${path}\"`,
                      timeout: 30,
                    },
                  ],
                },
              ],
            ],
          ),
        ),
      }),
      names,
      1,
    );
  }
  const lines = residue.map(
    (item) =>
      `${item.originId}: ${item.text ?? `unavailable ${item.missingCapabilities.join(", ")}.`}`,
  );
  const residueText = lines.join("\n");
  const bytes = new TextEncoder().encode(residueText).length;
  const fragment = `${HARNESS_START}\n<!-- Origin: ${canonicalStringify(origin(residue.map((item) => item.originId)))} -->\nResidue: ${bytes} UTF-8 bytes.\n${residueText}${lines.length ? "\n" : ""}${HARNESS_END}\n`;
  emit(
    profile.instruction.path,
    fragment,
    residue.map((item) => item.originId),
    8,
  );
  files.sort((a, b) => (a.path < b.path ? -1 : 1));
  const manifest = {
    contractVersion: "harness-v1" as const,
    compilerPackageVersion: COMPILER_PACKAGE_VERSION,
    feedbackPolicyHash: feedback.policyHash,
    grants: program.loadout.grants ?? [],
    outsideWriteGrants,
    authorityGrantRegistryHash:
      program.loadout.trace.authorityGrants?.registryHash ?? null,
    profile: JSON.parse(canonicalStringify(profile)) as HarnessProfile,
    loadout: {
      id: program.loadout.loadoutId,
      semanticHash: semantic,
      targetHash,
    },
    files: files.map(({ path, contents, origin, rung }) => ({
      path,
      hash: hash(contents),
      origin,
      rung,
    })),
    origin: origin(ids),
  };
  return {
    contractVersion: "harness-v1",
    files,
    manifest,
    residue: { items: residue, bytes, fragment },
  };
}

export function verifyHarnessBundle(bundle: HarnessBundle): boolean {
  return (
    bundle.files.length === bundle.manifest.files.length &&
    bundle.files.every((file, index) => {
      const entry = bundle.manifest.files[index];
      return (
        entry?.path === file.path &&
        entry.hash === hash(file.contents) &&
        canonicalStringify(entry.origin) === canonicalStringify(file.origin) &&
        entry.rung === file.rung
      );
    })
  );
}

/** WO-144 adds declared outside-write roots to the existing four refusals. */
const HARNESS_BOUNDARIES =
  "DotLn has five refusals (WO-135, WO-139, WO-144): it reserves one writer per worktree on any branch, including main; refuses writes to gate inputs or the success record during a live npm test; on planning/ branches refuses repository writes outside docs/ and root Markdown; refuses observable subagent admissions beyond docs/control/budgets.json subagentCap (default 20; null disables); and refuses known outside-project write destinations without a containing root granted by the active role or equipped support. Literal redirects are judged on any program; expansions such as $PWD and a program's own effects remain unobserved under host permissions; grant failures admit with one advisory and preserve the other refusals. Descendants count at their first attributable tool call; unresolved direct/child overlap is a reported minimum, and unobserved agents remain unknown. Inspect the writer with node scripts/harness.mjs writer --show; stop this session's gate with node scripts/harness.mjs evidence --stop; use operator override: for authorized recovery. Claude hooks enforce these five refusals at observed boundaries; Codex carries the duties and grants as role text without automatic enforcement. Copilot reuses the Claude registration: scripted denials hold with allow-all; missing tool-call and child identity leave subagent accounting advisory; WO-146 evidence records interactive qualification. Other tool and completion judgments are advisory and host permissions decide. The separate Codex compaction adapter restores an owned unfinished task and permits one continuation after premature stopping; it never dispatches a role or changes writer ownership.";

/** The shared instruction symlink contains all profile-qualified residue. */
export function mergeHarnessFragments(
  bundles: readonly HarnessBundle[],
): string {
  ensure(bundles.length > 0, "profile manifest required");
  const lines = [
    ...new Set(
      bundles.flatMap((bundle) =>
        bundle.residue.items.map(
          (item) =>
            `${bundle.manifest.profile.profileId}: ${item.originId}: ${item.text ?? item.reason}`,
        ),
      ),
    ),
  ];
  return `${HARNESS_START}\nCapabilities and residue: .claude/harness-manifest.json; planning: refute[ full] selects dotln-refuter.\n${HARNESS_BOUNDARIES}\n${lines.join("\n")}${lines.length ? "\n" : ""}${HARNESS_END}\n`;
}

/** Reduced worker projection. Contributor generation above remains independent. */
function lowerTargetWorker(
  program: HarnessProgram,
  feedback: CompiledFeedback,
  envelope: AuthorityEnvelope,
  profile: HarnessProfile,
  semantic: string,
  targetHash: string,
): HarnessBundle {
  const { importRoot, ...runtime } = profile.runtime;
  const publicProfile = { ...profile, runtime };
  const units = feedback.units.filter(
    (unit) =>
      ["writer-isolation", "attribution"].includes(unit.trigger) &&
      unit.mechanism.kind !== "prose",
  );
  const permissions = program.facets.filter(
    (facet): facet is Extract<HarnessFacet, { kind: "permission-guard" }> =>
      facet.kind === "permission-guard",
  );
  ensure(
    permissions.length > 0 &&
      units.some((unit) => unit.trigger === "writer-isolation") &&
      units.some((unit) => unit.trigger === "attribution"),
    "target guards required",
  );
  const names = [
    ...permissions.map((facet) => facet.facetId),
    ...units.map((unit) => unit.unitId),
  ].sort();
  const origin: HarnessOrigin = {
    ids: names,
    loadoutId: program.loadout.loadoutId,
    semanticHash: semantic,
  };
  const files: HarnessFile[] = [];
  const emit = (path: string, contents: string, rung: number) =>
    files.push({ path, contents, origin, rung });
  const importURL = (file: string) =>
    "file://" +
    `${importRoot!.replace(/\/$/, "")}/${runtime.snapshot}/${file}`
      .split("/")
      .map(encodeURIComponent)
      .join("/");
  const hooks: string[] = [];
  if (profile.events.PreToolUse.available) {
    const heartbeatPath = ".claude/hooks/presence-pretooluse.mjs";
    hooks.push(heartbeatPath);
    emit(
      heartbeatPath,
      `// Origin: ${canonicalStringify(origin)}\n` +
        heartbeatHook(
          "PreToolUse",
          importURL("packages/skeleton/dist/src/presence-heartbeat.js"),
        ),
      1,
    );
    const configs = [
      { name: "permissions", kind: "permission", envelope },
      ...units.map((unit) => ({
        name: unit.unitId,
        kind: "feedback",
        policy: compileFeedbackUnits([unit]),
      })),
    ];
    for (const { name, ...guard } of configs) {
      const path = `.claude/hooks/${name}.mjs`;
      hooks.push(path);
      const config = {
        compilerPackageVersion: COMPILER_PACKAGE_VERSION,
        runtime,
        event: "PreToolUse",
        tools: profile.tools,
        ...guard,
      };
      emit(
        path,
        `// Origin: ${canonicalStringify(origin)}
try {
const { feedbackBoundary } = await import(new URL(${JSON.stringify(importURL("packages/skeleton/dist/src/feedback-boundary.js"))}));
const { runTargetHarnessHook } = await import(new URL(${JSON.stringify(importURL("packages/skeleton/dist/src/harness-host.js"))}));
await runTargetHarnessHook(${json(config).trim()}, feedbackBoundary);
} catch {
process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: "DOTLN_TARGET_RUNTIME_REFUSED: pinned launchpad runtime unavailable" } }));
}
`,
        2,
      );
    }
  }
  if (profile.settings.available)
    emit(
      profile.settings.path,
      json({
        autoMemoryEnabled: false,
        attribution: { commit: "", pr: "", sessionUrl: false },
        permissions: {
          deny: [
            ...new Set(
              permissions.flatMap((facet) =>
                facet.matchers
                  .filter((matcher) =>
                    envelope.deniedEffects.includes(matcher.effect),
                  )
                  .map((matcher) => matcher.deny),
              ),
            ),
          ].sort(),
        },
        hooks: {
          PreToolUse: [
            {
              matcher: ".*",
              hooks: hooks.map((path) => ({
                type: "command",
                command: `node "$CLAUDE_PROJECT_DIR/${path}"`,
                timeout: 15,
              })),
            },
          ],
        },
      }),
      2,
    );
  const instruction = `${HARNESS_START}
Target worker: perform only the assigned work in this Git worktree. Keep one writer per worktree. Never commit generated local harness files or expose credentials, private identifiers or employer material. Never guess: check evidence before claims and identify unknowns. Do not add AI attribution to commits or pull requests.
Allowed effects: ${envelope.allowedEffects.join(", ")}.
Denied effects: ${envelope.deniedEffects.join(", ")}.
Applied explicit grants: ${(program.loadout.grants ?? []).length}; provenance remains in the launchpad receipt.
Claude Code uses PreToolUse permission, writer and attribution guards; unavailable runtime refuses the tool. Codex has no observed hook event; its launch profile and host diff checks supply governance. Read this local block explicitly when the harness does not load it automatically. Preserve the local bundle and its exclude entries.
${HARNESS_END}
`;
  emit(profile.instruction.path, instruction, 8);
  files.sort((a, b) => a.path.localeCompare(b.path, "en"));
  return {
    contractVersion: "harness-v1",
    files,
    manifest: {
      contractVersion: "harness-v1",
      compilerPackageVersion: COMPILER_PACKAGE_VERSION,
      feedbackPolicyHash: feedback.policyHash,
      grants: program.loadout.grants ?? [],
      authorityGrantRegistryHash:
        program.loadout.trace.authorityGrants?.registryHash ?? null,
      profile: publicProfile,
      loadout: {
        id: program.loadout.loadoutId,
        semanticHash: semantic,
        targetHash,
      },
      files: files.map(({ path, contents, origin, rung }) => ({
        path,
        hash: hash(contents),
        origin,
        rung,
      })),
      origin,
    },
    residue: { items: [], bytes: 0, fragment: instruction },
  };
}
