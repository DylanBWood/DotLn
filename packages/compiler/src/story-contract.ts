import { canonicalStringify, fnv1a64 } from "./normalize.js";
import {
  resolveSourceSpan,
  sourceBundleHash,
  type SourceBundle,
  type SourceSpan,
} from "./source-bundle.js";
import { verificationLine, type AcceptanceCriterion } from "./verification.js";

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
 * question pattern declares only a discussion entry ending in '?'. An image
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
  /** IDs from the previous contract; replacement items have fresh IDs. */
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
      if (unitKey(image.referencedBy) === unitKey(unit.span))
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
  const supplied = inferences
    .map((item) => copyInference(bundle, item))
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
    const next = bundle.discussion[i + 1];
    if (
      next &&
      next.author !== entry.author &&
      rules.some(
        (rule) =>
          rule.rule === "question" &&
          unitKey(rule.span) === unitKey(entry.span),
      )
    )
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
