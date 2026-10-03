import { canonicalStringify, fnv1a64 } from "./normalize.js";
import {
  resolveSourceSpan,
  sourceBundleHash,
  type SourceBundle,
  type SourceSpan,
} from "./source-bundle.js";
import {
  repositoryPath,
  verificationLine,
  type AcceptanceCriterion,
} from "./verification.js";

/** StoryContract v1 (WO-061) consumes an already decoded SourceBundle.
 * No model, clock, IO or ambient policy is consulted. Classification rules
 * decide only the declared markup; every other semantic choice is supplied
 * and remains inferred, or open. IDs are equality receipts, not authentication.
 * Criteria are drafts: WO-124 supplies actual surfaces and checks.
 */
export const STORY_CONTRACT_VERSION = "story-contract-v1";
export const STORY_STATEMENT_CLASSES = Object.freeze([
  "requirement",
  "non-requirement",
  "struck",
  "example",
  "question",
  "answer",
  "visual annotation",
  "current-behavior observation",
  "inference",
  "assumption",
  "contradiction",
  "open decision",
] as const);
export type StoryStatementClass = (typeof STORY_STATEMENT_CLASSES)[number];

/** Specific strike/image spans precede section/question backgrounds. The
 * question pattern declares only a discussion entry ending in '?'. Its follows
 * fact uses the first later entry by another role as its source and the
 * question as its target. An image
 * declared by the bundle is an annotation even without Markdown syntax.
 * [image:<id>] explicitly refers to that bundle image from a requirement.
 */
export const STORY_RULE_PATTERNS = Object.freeze({
  struck: Object.freeze({ pattern: String.raw`~~[^~]+~~`, flags: "gu" }),
  image: Object.freeze({
    pattern: String.raw`!\[[^\]\r\n]*\]\([^\s)]+\)`,
    flags: "gu",
  }),
  outOfScope: Object.freeze({
    pattern: String.raw`^(?:out[ -]of[ -]scope|non[ -]goals?|not in scope)(?:\s*:.*)?$`,
    flags: "iu",
  }),
  question: Object.freeze({ pattern: String.raw`\?\s*$`, flags: "u" }),
  visualReference: Object.freeze({
    pattern: String.raw`\[image:([^\]\r\n]+)\]`,
    flags: "gu",
  }),
});
type Rule = "struck" | "image" | "outOfScope" | "question";
export interface StoryClassInference {
  readonly span: SourceSpan;
  readonly class: StoryStatementClass;
  readonly rationale: string;
}
export interface StoryRelationInference {
  readonly span: SourceSpan;
  readonly relation: "answers" | "supersedes";
  readonly target: SourceSpan;
  readonly evidence: readonly SourceSpan[];
  readonly rationale: string;
}
export type StoryInference = StoryClassInference | StoryRelationInference;
export interface StoryStatement {
  readonly statementId: string;
  readonly span: SourceSpan;
  readonly text: string;
  readonly class: StoryStatementClass;
  readonly origin: "rule" | "inferred";
  readonly rule?: Rule;
  readonly rationale?: string;
  readonly status: "active" | "superseded";
}
export interface StoryCriterionDraft extends Pick<
  AcceptanceCriterion,
  "criterionId" | "description" | "claimType" | "evidenceSource"
> {
  readonly statementId: string;
  readonly span: SourceSpan;
  readonly status: "active" | "superseded";
}
export interface StoryRelation {
  readonly relationId: string;
  readonly span: SourceSpan;
  readonly relation: "follows" | "answers" | "supersedes";
  readonly target: SourceSpan;
  readonly origin: "rule" | "inferred";
  readonly evidence: readonly SourceSpan[];
  readonly rationale?: string;
  readonly status: "active" | "invalidated";
}
export interface StoryOpenDecision {
  readonly decisionId: string;
  readonly statementId: string;
  readonly span: SourceSpan;
  readonly reason: "unclassified" | "unanswered" | "criterion-description";
}
export interface StorySourceUnit {
  readonly span: SourceSpan;
  readonly fingerprint: string;
}
export interface StoryContract {
  readonly contractVersion: typeof STORY_CONTRACT_VERSION;
  readonly contractId: string;
  readonly bundleId: string;
  readonly bundleHash: string;
  readonly revisionId: string;
  readonly statements: readonly StoryStatement[];
  readonly criteria: readonly StoryCriterionDraft[];
  readonly relations: readonly StoryRelation[];
  readonly openDecisions: readonly StoryOpenDecision[];
  /** Whole-unit equality receipts, independent of document/thread position. */
  readonly sourceUnits: readonly StorySourceUnit[];
  /** The supplied choices, copied and canonically ordered, never promoted. */
  readonly inferences: readonly StoryInference[];
}
export interface StoryContractRevision {
  readonly contract: StoryContract;
  /** IDs from the previous contract; an invalidated ID may reappear with a
   * changed status or claim type. */
  readonly invalidated: {
    readonly statements: readonly string[];
    readonly criteria: readonly string[];
    readonly relations: readonly string[];
    readonly openDecisions: readonly string[];
  };
}

const encoder = new TextEncoder();
const receipt = (prefix: string, value: unknown): string =>
  `${prefix}:${fnv1a64(canonicalStringify(value))}`;
const freeze = <T>(value: T): T => {
  if (value !== null && typeof value === "object") {
    for (const child of Object.values(value)) freeze(child);
    Object.freeze(value);
  }
  return value;
};
const unitKey = (span: SourceSpan): string =>
  "sectionId" in span ? `section:${span.sectionId}` : `entry:${span.entryId}`;
const overlaps = (a: SourceSpan, b: SourceSpan): boolean =>
  unitKey(a) === unitKey(b) && a.start < b.end && b.start < a.end;
const range = (owner: SourceSpan, start: number, end: number): SourceSpan =>
  "sectionId" in owner
    ? { sectionId: owner.sectionId, start, end }
    : { entryId: owner.entryId, start, end };
const exact = (
  value: unknown,
  fields: readonly string[],
): value is Record<string, unknown> =>
  value !== null &&
  typeof value === "object" &&
  !Array.isArray(value) &&
  Object.keys(value).every((key) => fields.includes(key));
const requireValue: (value: unknown, reason: string) => asserts value = (
  value,
  reason,
) => {
  if (!value) throw new Error(`story contract: ${reason}`);
};
function copySpan(bundle: SourceBundle, value: SourceSpan): SourceSpan {
  requireValue(
    exact(value, ["sectionId", "entryId", "start", "end"]) &&
      (("sectionId" in value &&
        typeof value.sectionId === "string" &&
        !Object.hasOwn(value, "entryId")) ||
        ("entryId" in value &&
          typeof value.entryId === "string" &&
          !Object.hasOwn(value, "sectionId"))),
    "span must name exactly one section or entry",
  );
  const span = range(value, value.start, value.end);
  requireValue(
    resolveSourceSpan(bundle, span).trim().length > 0,
    "span must resolve to nonempty text",
  );
  return span;
}
function copyInference(
  bundle: SourceBundle,
  value: StoryInference,
): StoryInference {
  requireValue(
    value && typeof value === "object",
    "inference must be an object",
  );
  requireValue(
    typeof value.rationale === "string" && value.rationale.trim().length > 0,
    "inference needs a rationale",
  );
  const span = copySpan(bundle, value.span);
  if ("class" in value) {
    requireValue(
      exact(value, ["span", "class", "rationale"]) &&
        STORY_STATEMENT_CLASSES.includes(value.class),
      "class inference shape or class",
    );
    return { span, class: value.class, rationale: value.rationale };
  }
  requireValue(
    exact(value, ["span", "relation", "target", "evidence", "rationale"]) &&
      ["answers", "supersedes"].includes(value.relation),
    "relation inference shape or relation",
  );
  requireValue(
    Array.isArray(value.evidence) && value.evidence.length > 0,
    "relation needs evidence spans",
  );
  return {
    span,
    relation: value.relation,
    target: copySpan(bundle, value.target),
    evidence: value.evidence.map((item) => copySpan(bundle, item)),
    rationale: value.rationale,
  };
}
const dependencies = (inference: StoryInference): readonly SourceSpan[] =>
  "class" in inference
    ? [inference.span]
    : [inference.span, inference.target, ...inference.evidence];
const sourceUnits = (bundle: SourceBundle): StorySourceUnit[] =>
  [...bundle.sections, ...bundle.discussion].map((unit) => ({
    span: { ...unit.span },
    fingerprint: receipt("unit", {
      unit,
      images: bundle.images.filter(
        (image) => unitKey(image.referencedBy) === unitKey(unit.span),
      ),
    }),
  }));
interface RuleSpan {
  readonly span: SourceSpan;
  readonly class: StoryStatementClass;
  readonly rule: Rule;
}
/** Remove an already occupied half-open range without changing byte offsets. */
function subtract(
  span: SourceSpan,
  occupied: readonly SourceSpan[],
): SourceSpan[] {
  let parts = [span];
  for (const used of occupied)
    parts = parts.flatMap((part) =>
      !overlaps(part, used)
        ? [part]
        : [
            ...(part.start < used.start
              ? [range(part, part.start, used.start)]
              : []),
            ...(used.end < part.end ? [range(part, used.end, part.end)] : []),
          ],
    );
  return parts;
}
function ruleSpans(bundle: SourceBundle): RuleSpan[] {
  const result: RuleSpan[] = [];
  for (const unit of [...bundle.sections, ...bundle.discussion]) {
    const candidates: RuleSpan[] = [];
    for (const rule of ["struck", "image"] as const)
      for (const match of unit.text.matchAll(
        new RegExp(
          STORY_RULE_PATTERNS[rule].pattern,
          STORY_RULE_PATTERNS[rule].flags,
        ),
      )) {
        const start = encoder.encode(unit.text.slice(0, match.index)).length;
        candidates.push({
          span: range(
            unit.span,
            start,
            start + encoder.encode(match[0]).length,
          ),
          class: rule === "struck" ? "struck" : "visual annotation",
          rule,
        });
      }
    for (const image of bundle.images)
      if (
        unitKey(image.referencedBy) === unitKey(unit.span) &&
        resolveSourceSpan(bundle, image.referencedBy).trim()
      )
        candidates.push({
          span: copySpan(bundle, image.referencedBy),
          class: "visual annotation",
          rule: "image",
        });
    if (
      "heading" in unit &&
      unit.heading !== undefined &&
      new RegExp(
        STORY_RULE_PATTERNS.outOfScope.pattern,
        STORY_RULE_PATTERNS.outOfScope.flags,
      ).test(unit.heading.trim())
    )
      candidates.push({
        span: unit.span,
        class: "non-requirement",
        rule: "outOfScope",
      });
    if (
      "author" in unit &&
      new RegExp(
        STORY_RULE_PATTERNS.question.pattern,
        STORY_RULE_PATTERNS.question.flags,
      ).test(unit.text)
    )
      candidates.push({ span: unit.span, class: "question", rule: "question" });
    // Candidates are ordered by specificity above. Remove duplicate/nested
    // coverage so callers can never overwrite even one rule-decided byte.
    for (const candidate of candidates)
      for (const span of subtract(
        candidate.span,
        result.map((item) => item.span),
      ))
        result.push({ ...candidate, span });
  }
  return result;
}
function trimmedSpan(
  bundle: SourceBundle,
  span: SourceSpan,
): SourceSpan | undefined {
  const text = resolveSourceSpan(bundle, span);
  if (!text.trim()) return undefined;
  const start =
    span.start +
    encoder.encode(text.slice(0, text.length - text.trimStart().length)).length;
  return range(span, start, start + encoder.encode(text.trim()).length);
}

export function compileStoryContract(
  bundle: SourceBundle,
  inferences: readonly StoryInference[] = [],
): StoryContract {
  requireValue(Array.isArray(inferences), "inferences must be an array");
  const relationKeys = new Set<string>();
  const supplied = inferences
    .map((item) => copyInference(bundle, item))
    .filter((item) => {
      if ("class" in item) return true;
      const key = canonicalStringify(item);
      if (relationKeys.has(key)) return false;
      relationKeys.add(key);
      return true;
    })
    .sort((a, b) => {
      const left = canonicalStringify(a),
        right = canonicalStringify(b);
      return left < right ? -1 : left > right ? 1 : 0;
    });
  const rules = ruleSpans(bundle);
  const classes = supplied.filter(
    (item): item is StoryClassInference => "class" in item,
  );
  for (const [i, item] of classes.entries()) {
    const conflicting = rules.find((rule) => overlaps(item.span, rule.span));
    requireValue(
      !conflicting,
      `inferred span ${canonicalStringify(item.span)} overlaps rule span ${canonicalStringify(conflicting?.span)}`,
    );
    const other = classes
      .slice(0, i)
      .find((earlier) => overlaps(item.span, earlier.span));
    requireValue(
      !other,
      `inferred span ${canonicalStringify(item.span)} overlaps inferred span ${canonicalStringify(other?.span)}`,
    );
  }
  const units = sourceUnits(bundle);
  const fingerprints = new Map(
    units.map((unit) => [unitKey(unit.span), unit.fingerprint]),
  );
  const stamp = (spans: readonly SourceSpan[]) =>
    spans.map((span) => ({ span, unit: fingerprints.get(unitKey(span)) }));
  const statements: StoryStatement[] = [];
  const addStatement = (
    span: SourceSpan,
    classification: StoryStatementClass,
    origin: StoryStatement["origin"],
    detail: { rule?: Rule; rationale?: string } = {},
  ) => {
    const meaningful = trimmedSpan(bundle, span);
    if (!meaningful) return;
    const body = {
      span: meaningful,
      text: resolveSourceSpan(bundle, meaningful),
      class: classification,
      origin,
      ...detail,
    };
    statements.push({
      statementId: receipt("statement", {
        ...body,
        source: stamp([meaningful]),
      }),
      ...body,
      status: "active",
    });
  };
  for (const unit of [...bundle.sections, ...bundle.discussion]) {
    const occupied: SourceSpan[] = [];
    for (const item of rules.filter(
      (rule) => unitKey(rule.span) === unitKey(unit.span),
    )) {
      addStatement(item.span, item.class, "rule", { rule: item.rule });
      occupied.push(item.span);
    }
    for (const item of classes.filter(
      (entry) => unitKey(entry.span) === unitKey(unit.span),
    )) {
      addStatement(item.span, item.class, "inferred", {
        rationale: item.rationale,
      });
      occupied.push(item.span);
    }
    for (const gap of subtract(unit.span, occupied))
      addStatement(gap, "open decision", "rule");
  }
  const positions = new Map(units.map((unit, i) => [unitKey(unit.span), i]));
  statements.sort(
    (a, b) =>
      positions.get(unitKey(a.span))! - positions.get(unitKey(b.span))! ||
      a.span.start - b.span.start,
  );
  const relations: StoryRelation[] = [];
  const addRelation = (body: Omit<StoryRelation, "relationId" | "status">) => {
    relations.push({
      relationId: receipt("relation", {
        ...body,
        source: stamp([body.span, body.target, ...body.evidence]),
      }),
      ...body,
      status: "active",
    });
  };
  for (const [i, entry] of bundle.discussion.entries()) {
    if (
      !rules.some(
        (rule) =>
          rule.rule === "question" &&
          unitKey(rule.span) === unitKey(entry.span),
      )
    )
      continue;
    const next = bundle.discussion.find(
      (candidate, index) => index > i && candidate.author !== entry.author,
    );
    if (next)
      addRelation({
        span: { ...next.span },
        target: { ...entry.span },
        relation: "follows",
        origin: "rule",
        evidence: [],
      });
  }
  for (const item of supplied)
    if ("relation" in item) {
      requireValue(
        statements.some((statement) => overlaps(statement.span, item.target)),
        "relation target names no statement",
      );
      if (item.relation === "answers")
        requireValue(
          statements.some(
            (statement) =>
              overlaps(statement.span, item.target) &&
              statement.class === "question",
          ),
          "answers target must name a question",
        );
      addRelation({ ...item, origin: "inferred" });
    }
  const superseded = statements.filter((statement) =>
    relations.some(
      (relation) =>
        relation.relation === "supersedes" &&
        overlaps(relation.target, statement.span),
    ),
  );
  const supersededIds = new Set(
    superseded.map((statement) => statement.statementId),
  );
  const currentStatements = statements.map((statement): StoryStatement =>
    supersededIds.has(statement.statementId)
      ? { ...statement, status: "superseded" }
      : statement,
  );
  // A supersedes edge is the retained cause of retirement. Other semantic
  // relations depending on a retired statement cannot remain current claims.
  const currentRelations = relations.map((relation): StoryRelation =>
    relation.origin === "inferred" &&
    relation.relation !== "supersedes" &&
    superseded.some((statement) =>
      [relation.span, relation.target, ...relation.evidence].some((span) =>
        overlaps(span, statement.span),
      ),
    )
      ? { ...relation, status: "invalidated" }
      : relation,
  );
  const criteria: StoryCriterionDraft[] = [];
  const openDecisions: StoryOpenDecision[] = [];
  const open = (
    statement: StoryStatement,
    reason: StoryOpenDecision["reason"],
  ) => {
    if (statement.status === "active")
      openDecisions.push({
        decisionId: receipt("decision", {
          statementId: statement.statementId,
          reason,
        }),
        statementId: statement.statementId,
        span: { ...statement.span },
        reason,
      });
  };
  for (const statement of currentStatements) {
    if (statement.class === "open decision") open(statement, "unclassified");
    if (
      statement.class === "question" &&
      !currentRelations.some(
        (relation) =>
          relation.relation === "answers" &&
          relation.status === "active" &&
          overlaps(relation.target, statement.span),
      )
    )
      open(statement, "unanswered");
    if (statement.class !== "requirement") continue;
    const description = statement.text.replace(
      /\r\n|[\r\n\u2028\u2029]/gu,
      " ",
    );
    if (!verificationLine(description)) {
      open(statement, "criterion-description");
      continue;
    }
    const references = [
      ...statement.text.matchAll(
        new RegExp(
          STORY_RULE_PATTERNS.visualReference.pattern,
          STORY_RULE_PATTERNS.visualReference.flags,
        ),
      ),
    ];
    criteria.push({
      criterionId: receipt("criterion", statement.statementId),
      statementId: statement.statementId,
      span: { ...statement.span },
      description,
      claimType: references.some((reference) =>
        bundle.images.some((image) => image.id === reference[1]),
      )
        ? "visual"
        : "behavior",
      evidenceSource: "live",
      status: statement.status,
    });
  }
  const bundleHash = sourceBundleHash(bundle);
  return freeze({
    contractVersion: STORY_CONTRACT_VERSION,
    contractId: receipt("contract", {
      version: STORY_CONTRACT_VERSION,
      bundleHash,
      inferences: supplied,
    }),
    bundleId: bundle.bundleId,
    bundleHash,
    revisionId: bundle.revisionId,
    statements: currentStatements,
    criteria,
    relations: currentRelations,
    openDecisions,
    sourceUnits: units,
    inferences: supplied,
  });
}

/** Retain choices only when all their whole-unit dependencies are unchanged.
 * New choices (especially a new decision's supersedes edge) must be supplied;
 * text position never creates them. The previous contract is never mutated.
 */
export function revise(
  contract: StoryContract,
  newBundle: SourceBundle,
  inferences: readonly StoryInference[] = [],
): StoryContractRevision {
  requireValue(
    contract.contractVersion === STORY_CONTRACT_VERSION &&
      contract.bundleId === newBundle.bundleId,
    "revision must use the same contract version and bundle identity",
  );
  const previous = new Map(
    contract.sourceUnits.map((unit) => [unitKey(unit.span), unit.fingerprint]),
  );
  const current = new Map(
    sourceUnits(newBundle).map((unit) => [
      unitKey(unit.span),
      unit.fingerprint,
    ]),
  );
  const retained = contract.inferences.filter((item) =>
    dependencies(item).every(
      (span) => previous.get(unitKey(span)) === current.get(unitKey(span)),
    ),
  );
  const unique = [
    ...new Map(
      [...retained, ...inferences].map((item) => [
        canonicalStringify(item),
        item,
      ]),
    ).values(),
  ];
  const next = compileStoryContract(newBundle, unique);
  const changed = <T>(
    old: readonly T[],
    fresh: readonly T[],
    id: (value: T) => string,
  ): string[] => {
    const byId = new Map(
      fresh.map((value) => [id(value), canonicalStringify(value)]),
    );
    return old
      .filter((value) => byId.get(id(value)) !== canonicalStringify(value))
      .map(id);
  };
  return freeze({
    contract: next,
    invalidated: {
      statements: changed(
        contract.statements,
        next.statements,
        (value) => value.statementId,
      ),
      criteria: changed(
        contract.criteria,
        next.criteria,
        (value) => value.criterionId,
      ),
      relations: changed(
        contract.relations,
        next.relations,
        (value) => value.relationId,
      ),
      openDecisions: changed(
        contract.openDecisions,
        next.openDecisions,
        (value) => value.decisionId,
      ),
    },
  });
}

/** WO-124's typed input, independent of the future role-loaded profile document.
 * Directories are repository-relative; '.' explicitly covers the snapshot root.
 * Commands are selected verbatim, never interpreted or executed here.
 */
export interface RepoSurfaceProfile {
  readonly architecture: readonly {
    readonly noun: string;
    readonly directories: readonly string[];
  }[];
  readonly commands: readonly {
    readonly command: string;
    readonly directories: readonly string[];
  }[];
}
export interface SnapshotIndexEntry {
  readonly path: string;
  /** UTF-8 byte length, not character count. */
  readonly size: number;
  /** Lowercase SHA-256 of the file's bytes; an equality receipt. */
  readonly hash: string;
}
export type SnapshotIndex = readonly SnapshotIndexEntry[];
export interface SurfaceInference {
  readonly statementId: string;
  readonly path: string;
  readonly rationale: string;
}
export type SurfaceOrigin =
  | {
      readonly origin: "rule";
      readonly rule: "named-path" | "architecture";
      readonly statementId: string;
      readonly reference: string;
    }
  | {
      readonly origin: "inferred";
      readonly statementId: string;
      readonly rationale: string;
    };
export interface DerivedSurface {
  readonly path: string;
  /** Retain every distinct proof, including inferred/rule overlap. */
  readonly origins: readonly SurfaceOrigin[];
}
export interface SurfaceCandidate {
  readonly path: string | null;
  readonly statementId: string;
  readonly reason: "not-in-snapshot" | "unmapped-requirement";
  readonly provenance: SurfaceOrigin | null;
}
export interface DerivedSurfaceTest {
  readonly command: string;
  readonly origin: "rule";
  readonly surfaces: readonly string[];
}
export interface SurfaceDerivationOptions {
  readonly threshold?: number;
  /** Supplied model choices; fixtures use a labeled double. */
  readonly inferences?: readonly SurfaceInference[];
}
interface SurfaceDerivationBody {
  readonly surfaces: readonly DerivedSurface[];
  readonly tests: readonly DerivedSurfaceTest[];
  readonly candidates: readonly SurfaceCandidate[];
  readonly confidence: number;
  readonly threshold: number;
  readonly uncoveredStatementIds: readonly string[];
}
export type SurfaceDerivation = SurfaceDerivationBody &
  (
    | { readonly kind: "DerivedSurfaces" }
    | { readonly kind: "NeedsHuman"; readonly reason: string }
  );

/** These are declared syntax, not a general language/path parser. Quote root
 * filenames with backticks. Bare paths contain a slash; final prose punctuation
 * is removed. Nouns match literal text, case-insensitively; Unicode letters,
 * numbers, underscores and hyphens are boundary characters that prevent a
 * match inside a larger token. Directory references expand only to indexed files.
 */
export const SURFACE_RULE_PATTERNS = Object.freeze({
  quotedPath: Object.freeze({
    pattern: String.raw`\x60([^\x60\r\n]+)\x60`,
    flags: "gu",
  }),
  barePath: Object.freeze({
    pattern: String.raw`(?<![\p{L}\p{N}_./-])[A-Za-z0-9_.-]+(?:/[A-Za-z0-9_.-]+)+/?`,
    flags: "gu",
  }),
  noun: Object.freeze({
    match: "case-insensitive-literal",
    boundary: String.raw`[\p{L}\p{N}_-]`,
    flags: "iu",
  }),
});
export const SURFACE_SNAPSHOT_BOUND =
  "snapshot unavailable: requires 1 to 100 regular UTF-8 files, at most 100,000 bytes each; symlinks, submodules and binary files are unsupported";
const surfaceRefuse = (field: string, reason: string): never => {
  throw new Error(`surface derivation: ${field}: ${reason}`);
};
const surfaceObject = (
  value: unknown,
  fields: readonly string[],
  field: string,
): Record<string, unknown> => {
  if (!value || typeof value !== "object" || Array.isArray(value))
    return surfaceRefuse(field, "expected an object");
  const record = value as Record<string, unknown>;
  for (const key of Object.keys(record))
    if (!fields.includes(key))
      surfaceRefuse(`${field}.${key}`, "unknown field");
  return record;
};
const surfaceList = (value: unknown, field: string): unknown[] => {
  if (!Array.isArray(value)) return surfaceRefuse(field, "expected an array");
  // Mapping a sparse array skips its absent positions; validate each slot.
  return Array.from(value);
};
const surfaceDirectory = (value: unknown): value is string =>
  value === "." || repositoryPath(value);
const surfaceDirectories = (value: unknown, field: string): string[] => {
  const values = surfaceList(value, field);
  if (!values.length) surfaceRefuse(field, "expected at least one directory");
  const seen = new Set<string>();
  return values
    .map((directory, i) => {
      if (!surfaceDirectory(directory))
        return surfaceRefuse(
          `${field}[${i}]`,
          "expected a repository directory",
        );
      if (seen.has(directory))
        surfaceRefuse(`${field}[${i}]`, "duplicate directory");
      seen.add(directory);
      return directory;
    })
    .sort();
};

export function decodeRepoSurfaceProfile(value: unknown): RepoSurfaceProfile {
  const root = surfaceObject(value, ["architecture", "commands"], "$.profile");
  const nouns = new Set<string>(),
    commands = new Set<string>();
  return freeze({
    architecture: surfaceList(root.architecture, "$.profile.architecture").map(
      (entry, i) => {
        const field = `$.profile.architecture[${i}]`;
        const row = surfaceObject(entry, ["noun", "directories"], field);
        if (!verificationLine(row.noun) || !row.noun.trim())
          return surfaceRefuse(
            `${field}.noun`,
            "expected a nonempty single-line noun",
          );
        const noun = row.noun.trim();
        if (nouns.has(noun.toLowerCase()))
          surfaceRefuse(`${field}.noun`, "duplicate noun");
        nouns.add(noun.toLowerCase());
        return {
          noun,
          directories: surfaceDirectories(
            row.directories,
            `${field}.directories`,
          ),
        };
      },
    ),
    commands: surfaceList(root.commands, "$.profile.commands").map(
      (entry, i) => {
        const field = `$.profile.commands[${i}]`;
        const row = surfaceObject(entry, ["command", "directories"], field);
        if (!verificationLine(row.command) || !row.command.trim())
          return surfaceRefuse(
            `${field}.command`,
            "expected a nonempty single-line command",
          );
        if (commands.has(row.command))
          surfaceRefuse(`${field}.command`, "duplicate command");
        commands.add(row.command);
        return {
          command: row.command,
          directories: surfaceDirectories(
            row.directories,
            `${field}.directories`,
          ),
        };
      },
    ),
  });
}

export function decodeSnapshotIndex(value: unknown): SnapshotIndex {
  const rows = surfaceList(value, "$.snapshotIndex");
  if (!rows.length || rows.length > 100)
    surfaceRefuse(
      "$.snapshotIndex",
      "expected 1 to 100 files; unavailable snapshots use null",
    );
  const paths = new Set<string>();
  return freeze(
    rows
      .map((entry, i) => {
        const field = `$.snapshotIndex[${i}]`;
        const row = surfaceObject(entry, ["path", "size", "hash"], field);
        if (!repositoryPath(row.path))
          return surfaceRefuse(
            `${field}.path`,
            "expected a repository file path",
          );
        if (paths.has(row.path))
          surfaceRefuse(`${field}.path`, "duplicate file path");
        paths.add(row.path);
        if (
          typeof row.size !== "number" ||
          !Number.isSafeInteger(row.size) ||
          row.size < 0 ||
          row.size > 100_000
        )
          return surfaceRefuse(
            `${field}.size`,
            "expected 0 to 100,000 UTF-8 bytes",
          );
        if (typeof row.hash !== "string" || !/^[a-f0-9]{64}$/u.test(row.hash))
          return surfaceRefuse(
            `${field}.hash`,
            "expected a lowercase SHA-256 digest",
          );
        return { path: row.path, size: row.size, hash: row.hash };
      })
      .sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0)),
  );
}
const surfaceWithin = (directory: string, path: string): boolean =>
  directory === "." || path === directory || path.startsWith(`${directory}/`);
const surfaceCanonicalOrder = <T>(values: readonly T[]): T[] =>
  [
    ...new Map(
      values.map((value) => [canonicalStringify(value), value]),
    ).entries(),
  ]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([, value]) => value);

/** Pure proposal, not an authority grant. Confidence is rule coverage,
 * not a probability that a model's scope is correct. Missing explicit paths stay
 * candidates even when another rule covers that same requirement. A caller's
 * lower threshold deliberately admits uncovered requirements, never those paths.
 */
export function deriveSurfaces(
  contract: StoryContract,
  profile: RepoSurfaceProfile,
  snapshotIndex: SnapshotIndex | null,
  options: SurfaceDerivationOptions = {},
): SurfaceDerivation {
  const decoded = decodeRepoSurfaceProfile(profile);
  const files =
    snapshotIndex === null ? [] : decodeSnapshotIndex(snapshotIndex);
  surfaceObject(options, ["threshold", "inferences"], "$.options");
  const threshold = options.threshold === undefined ? 1 : options.threshold;
  if (
    typeof threshold !== "number" ||
    !Number.isFinite(threshold) ||
    threshold < 0 ||
    threshold > 1
  )
    surfaceRefuse("$.options.threshold", "expected a confidence from 0 to 1");
  const requirements = contract.statements.filter(
    (statement) =>
      statement.class === "requirement" && statement.status === "active",
  );
  const byId = new Map(
    requirements.map((statement) => [statement.statementId, statement]),
  );
  const origins = new Map<string, SurfaceOrigin[]>();
  const covered = new Set<string>();
  const candidates: SurfaceCandidate[] = [];
  const add = (path: string, provenance: SurfaceOrigin) => {
    const matches = files.filter((file) => surfaceWithin(path, file.path));
    if (!matches.length) {
      candidates.push({
        path,
        statementId: provenance.statementId,
        reason: "not-in-snapshot",
        provenance,
      });
      return;
    }
    if (provenance.origin === "rule") covered.add(provenance.statementId);
    for (const file of matches)
      origins.set(file.path, [...(origins.get(file.path) ?? []), provenance]);
  };
  for (const statement of requirements) {
    const named = new Set<string>();
    // Strip quoted regions before the bare scan so quoted punctuation is exact.
    const unquoted = statement.text.replace(
      new RegExp(
        SURFACE_RULE_PATTERNS.quotedPath.pattern,
        SURFACE_RULE_PATTERNS.quotedPath.flags,
      ),
      (_whole, path: string) => {
        named.add(path.endsWith("/") ? path.slice(0, -1) : path);
        return " ";
      },
    );
    const nounText = unquoted.replace(
      new RegExp(
        SURFACE_RULE_PATTERNS.barePath.pattern,
        SURFACE_RULE_PATTERNS.barePath.flags,
      ),
      (path) => {
        named.add(path.replace(/[.,;:!?]+$/u, "").replace(/\/$/u, ""));
        return " ";
      },
    );
    for (const path of named)
      if (repositoryPath(path))
        add(path, {
          origin: "rule",
          rule: "named-path",
          statementId: statement.statementId,
          reference: path,
        });
      else
        candidates.push({
          path,
          statementId: statement.statementId,
          reason: "not-in-snapshot",
          provenance: {
            origin: "rule",
            rule: "named-path",
            statementId: statement.statementId,
            reference: path,
          },
        });
    for (const mapping of decoded.architecture) {
      const escaped = mapping.noun.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
      const boundary = SURFACE_RULE_PATTERNS.noun.boundary;
      if (
        new RegExp(
          `(?<!${boundary})${escaped}(?!${boundary})`,
          SURFACE_RULE_PATTERNS.noun.flags,
        ).test(nounText)
      )
        for (const directory of mapping.directories)
          add(directory, {
            origin: "rule",
            rule: "architecture",
            statementId: statement.statementId,
            reference: mapping.noun,
          });
    }
  }
  for (const [i, value] of surfaceList(
    options.inferences === undefined ? [] : options.inferences,
    "$.options.inferences",
  ).entries()) {
    const field = `$.options.inferences[${i}]`;
    const entry = surfaceObject(
      value,
      ["statementId", "path", "rationale"],
      field,
    );
    if (typeof entry.statementId !== "string" || !byId.has(entry.statementId))
      surfaceRefuse(
        `${field}.statementId`,
        "expected an active requirement statement",
      );
    if (!repositoryPath(entry.path))
      surfaceRefuse(`${field}.path`, "expected a repository path");
    if (!verificationLine(entry.rationale) || !entry.rationale.trim())
      surfaceRefuse(
        `${field}.rationale`,
        "expected a nonempty single-line rationale",
      );
    add(entry.path as string, {
      origin: "inferred",
      statementId: entry.statementId as string,
      rationale: entry.rationale as string,
    });
  }
  const surfaces = [...origins]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([path, provenance]) => ({
      path,
      origins: surfaceCanonicalOrder(provenance),
    }));
  const tests = decoded.commands
    .flatMap(({ command, directories }) => {
      const selected = surfaces
        .filter((surface) =>
          directories.some((directory) =>
            surfaceWithin(directory, surface.path),
          ),
        )
        .map((surface) => surface.path);
      return selected.length
        ? [{ command, origin: "rule" as const, surfaces: selected }]
        : [];
    })
    .sort((a, b) =>
      a.command < b.command ? -1 : a.command > b.command ? 1 : 0,
    );
  const uncoveredStatementIds = requirements
    .filter((statement) => !covered.has(statement.statementId))
    .map((statement) => statement.statementId)
    .sort();
  for (const statementId of uncoveredStatementIds) {
    for (const surface of surfaces)
      for (const provenance of surface.origins)
        if (
          provenance.statementId === statementId &&
          provenance.origin === "inferred"
        )
          candidates.push({
            path: surface.path,
            statementId,
            reason: "unmapped-requirement",
            provenance,
          });
    if (!candidates.some((candidate) => candidate.statementId === statementId))
      candidates.push({
        path: null,
        statementId,
        reason: "unmapped-requirement",
        provenance: null,
      });
  }
  const confidence = requirements.length
    ? covered.size / requirements.length
    : 0;
  const body = {
    surfaces,
    tests,
    candidates: surfaceCanonicalOrder(candidates),
    confidence,
    threshold,
    uncoveredStatementIds,
  };
  return freeze(
    snapshotIndex === null
      ? { ...body, kind: "NeedsHuman", reason: SURFACE_SNAPSHOT_BOUND }
      : !requirements.length
        ? {
            ...body,
            kind: "NeedsHuman",
            reason: "no active requirement statements",
          }
        : !surfaces.length
          ? {
              ...body,
              kind: "NeedsHuman",
              reason: "no derived surfaces",
            }
          : confidence < threshold
            ? {
                ...body,
                kind: "NeedsHuman",
                reason:
                  "requirement coverage below declared confidence threshold",
              }
            : { ...body, kind: "DerivedSurfaces" },
  );
}
