import { COMPILER_PACKAGE_VERSION } from "./artifact-identity.js";
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

export type HarnessEvent =
  "PreToolUse" | "PostToolUse" | "Stop" | "UserPromptSubmit";
export interface HarnessObservation {
  readonly available: boolean;
  readonly evidence: string;
  readonly reason?: string;
}
export interface HarnessProfile {
  readonly profileId: string;
  readonly harness: "claude-code" | "codex-cli";
  readonly observedVersion: string;
  readonly tools?: Readonly<
    Record<string, "read" | "write" | "shell" | "spawn" | "interaction">
  >;
  readonly events: Readonly<Record<HarnessEvent, HarnessObservation>>;
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
    readonly files?: readonly {
      readonly path: string;
      readonly hash: string;
    }[];
  };
}
export interface HarnessRole {
  readonly facetId: string;
  readonly name: string;
  readonly description: string;
  readonly intents: readonly string[];
  readonly procedure: readonly string[];
  readonly feedbackHandlers: readonly FeedbackHandler[];
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
const id = (value: string) => /^[a-z][a-z0-9.-]{0,99}$/.test(value);
const hash = (text: string) => `fnv1a64:${fnv1a64(text)}`;
const json = (value: unknown) => JSON.stringify(value, null, 2) + "\n";
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
    ["claude-code", "codex-cli"].includes(profile.harness) &&
      verificationLine(profile.observedVersion),
    "observed harness version",
  );
  for (const capability of [
    ...events.map((event) => profile.events[event]),
    profile.skills,
    profile.settings,
    profile.instruction,
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
        (profile.harness === "claude-code" ? "CLAUDE.md" : "AGENTS.md"),
    "project-only profile surfaces",
  );
  ensure(
    !profile.settings.allow,
    "allow entries have no observed local contract",
  );
  ensure(
    !events.some((event) => profile.events[event].available) ||
      (profile.harness === "claude-code" &&
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
  const hookPaths = new Map<HarnessEvent, string[]>();
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
    const header = `// Origin: ${canonicalStringify(origin(names))}\n`;
    const unavailable =
      event === "PreToolUse"
        ? {
            hookSpecificOutput: {
              hookEventName: event,
              permissionDecision: "deny",
              permissionDecisionReason:
                "DOTLN_HARNESS_REFUSED: built adapter unavailable",
            },
          }
        : event === "Stop"
          ? {
              systemMessage:
                "DotLn: built adapter unavailable; lifecycle evidence remains required.",
            }
          : {
              decision: "block",
              reason: "DOTLN_HARNESS_REFUSED: built adapter unavailable",
            };
    emit(
      path,
      `${header}try {\nconst { feedbackBoundary } = await import("../../${profile.runtime.snapshot ? `${profile.runtime.snapshot}/` : ""}packages/skeleton/dist/src/feedback-boundary.js");\nconst { runHarnessHook } = await import("../../${profile.runtime.snapshot ? `${profile.runtime.snapshot}/` : ""}packages/skeleton/dist/src/harness-host.js");\nawait runHarnessHook(${json({ compilerPackageVersion: COMPILER_PACKAGE_VERSION, runtime: profile.runtime, event, tools: profile.tools, ...(config as object) }).trim()}, feedbackBoundary);\n} catch { process.stdout.write(${JSON.stringify(JSON.stringify(unavailable))}); }\n`,
      names,
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
        instructionFile: profile.instruction.path,
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
        instructionFile: profile.instruction.path,
      },
      program.roles.map((role) => role.facetId),
      1,
    );
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
  for (const role of program.roles) {
    const supportIds = program.facets.flatMap((facet) =>
      facet.kind === "role-procedure" &&
      procedureRoles(facet).includes(role.name)
        ? [facet.facetId]
        : [],
    );
    const units = feedback.units.filter((unit) => {
      const event = hookFor[unit.trigger];
      const carriedByHook =
        unit.mechanism.kind !== "prose" &&
        event &&
        profile.events[event].available &&
        (unit.trigger !== "semantic-correction" ||
          program.correctionToken !== null);
      return role.feedbackHandlers.includes(unit.trigger) && !carriedByHook;
    });
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

/** The shared instruction symlink has one block containing profile-qualified residue. */
export function mergeHarnessFragments(
  bundles: readonly HarnessBundle[],
): string {
  ensure(bundles.length > 0, "profile manifest required");
  return `${HARNESS_START}\nCapabilities and residue: .claude/harness-manifest.json; planning: refute[ full] selects dotln-refuter.\n${HARNESS_END}\n`;
}
