import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  STORY_RULE_PATTERNS,
  STORY_STATEMENT_CLASSES,
  compileStoryContract,
  copyCriterion,
  decodeSourceBundle,
  resolveSourceSpan,
  revise,
  verificationLine,
  type SourceBundle,
  type SourceSpan,
  type StoryContract,
  type StoryInference,
  type StoryStatementClass,
} from "../src/index.js";

interface Case {
  bundle: SourceBundle;
  inferences: StoryInference[];
  expected: [string, StoryStatementClass, "rule" | "inferred"][];
}
const fixture = JSON.parse(
  await readFile(
    new URL("../../fixtures/wo061-story-contracts.json", import.meta.url),
    "utf8",
  ),
) as {
  allowedHosts: string[];
  core: Case;
  thread: Case;
  taxonomy: Case;
  revision: Case;
};
const sourceFixture = JSON.parse(
  await readFile(
    new URL("../../fixtures/wo060-source-bundles.json", import.meta.url),
    "utf8",
  ),
) as {
  allowedHosts: string[];
  valid: { name: string; bundle: SourceBundle }[];
};
const decode = (
  bundle: SourceBundle,
  allowedHosts = fixture.allowedHosts,
): SourceBundle => {
  const result = decodeSourceBundle(bundle, { allowedHosts });
  if (!result.ok) assert.fail(JSON.stringify(result));
  return result.bundle;
};
const owner = (span: SourceSpan): string =>
  "sectionId" in span ? span.sectionId : span.entryId;
const byteLength = (text: string) => Buffer.byteLength(text, "utf8");
const spanFor = (
  bundle: SourceBundle,
  id: string,
  selected?: string,
): SourceSpan => {
  const unit = [...bundle.sections, ...bundle.discussion].find(
    (item) => item.id === id,
  )!;
  if (selected === undefined) return { ...unit.span };
  const index = unit.text.indexOf(selected);
  assert.ok(index >= 0);
  const start = byteLength(unit.text.slice(0, index));
  return "sectionId" in unit.span
    ? { sectionId: id, start, end: start + byteLength(selected) }
    : { entryId: id, start, end: start + byteLength(selected) };
};
const classification = (
  bundle: SourceBundle,
  id: string,
  text?: string,
): StoryInference => ({
  span: spanFor(bundle, id, text),
  class: "requirement",
  rationale: "A synthetic requirement supplied by the fixture double.",
});
const projection = (contract: StoryContract) =>
  contract.statements.map((item) => [
    owner(item.span),
    item.class,
    item.origin,
  ]);
const wholeText = (text: string): SourceBundle => ({
  bundleId: "synthetic-boundary",
  sourceKind: "synthetic-issue",
  revisionId: "r1",
  sections: [
    {
      id: "s-body",
      text,
      span: { sectionId: "s-body", start: 0, end: byteLength(text) },
    },
  ],
  discussion: [],
  images: [],
  revisions: [],
});
const freeze = <T>(value: T): T => {
  if (value && typeof value === "object") {
    for (const child of Object.values(value)) freeze(child);
    Object.freeze(value);
  }
  return value;
};

test("WO-061 criterion 1: pinned rules and inferred classes resolve in UTF-8 and compile byte-identically", () => {
  for (const scenario of [fixture.core, fixture.thread, fixture.taxonomy]) {
    const bundle = decode(scenario.bundle);
    const input = freeze(structuredClone(scenario.inferences));
    const before = JSON.stringify({ bundle, input });
    const first = compileStoryContract(bundle, input);
    assert.deepEqual(projection(first), scenario.expected);
    assert.equal(
      JSON.stringify(first),
      JSON.stringify(compileStoryContract(bundle, input)),
    );
    assert.equal(
      JSON.stringify(first),
      JSON.stringify(compileStoryContract(bundle, [...input].reverse())),
    );
    for (const statement of first.statements)
      assert.equal(resolveSourceSpan(bundle, statement.span), statement.text);
    assert.equal(JSON.stringify({ bundle, input }), before, "inputs unchanged");
    assert.ok(Object.isFrozen(first) && Object.isFrozen(first.statements[0]));
  }
  assert.equal(STORY_STATEMENT_CLASSES.length, 12);
  assert.ok(
    Object.isFrozen(STORY_RULE_PATTERNS) &&
      Object.isFrozen(STORY_RULE_PATTERNS.struck),
  );
  const classes = new Set(
    [fixture.core, fixture.thread, fixture.taxonomy].flatMap((scenario) =>
      compileStoryContract(
        decode(scenario.bundle),
        scenario.inferences,
      ).statements.map((item) => item.class),
    ),
  );
  assert.deepEqual([...classes].sort(), [...STORY_STATEMENT_CLASSES].sort());
});

test("WO-061 criterion 1: WO-060's six valid bundles have pinned rule expectations", () => {
  const expected: Record<string, string[][]> = {
    "feature-request": [
      ["s-behavior", "struck"],
      ["s-out-of-scope", "non-requirement"],
      ["e-101-2", "question"],
    ],
    "bug-report-with-screenshot": [
      ["s-actual", "visual annotation"],
      ["e-102-2", "question"],
      ["e-102-3", "visual annotation"],
    ],
    "multibyte-text": [
      ["e-103-1", "visual annotation"],
      ["e-103-2", "question"],
    ],
    "one-section": [],
    "one-entry": [],
    "revised-with-supersession": [["e-106-2", "question"]],
  };
  assert.equal(sourceFixture.valid.length, 6);
  for (const { name, bundle: raw } of sourceFixture.valid) {
    const bundle = decode(raw, sourceFixture.allowedHosts);
    const contract = compileStoryContract(bundle);
    assert.deepEqual(
      contract.statements
        .filter((statement) => statement.class !== "open decision")
        .map((statement) => [owner(statement.span), statement.class]),
      expected[name],
    );
    assert.equal(
      JSON.stringify(contract),
      JSON.stringify(compileStoryContract(bundle)),
    );
    for (const statement of contract.statements)
      assert.equal(resolveSourceSpan(bundle, statement.span), statement.text);
    assert.equal(
      contract.criteria.length,
      0,
      "prose alone is not a requirement classification",
    );
    assert.ok(
      contract.relations.every((relation) => relation.relation === "follows"),
    );
  }
});

test("WO-061 criterion 2: even one overlapping byte refuses and names both spans; touching is allowed", () => {
  const bundle = decode(fixture.core.bundle);
  const contract = compileStoryContract(bundle, fixture.core.inferences);
  for (const statement of contract.statements.filter(
    (item) => item.rule !== undefined,
  )) {
    const span = { ...statement.span, end: statement.span.start + 1 };
    // Every rule fixture starts with ASCII; this deliberately overlaps one byte.
    assert.throws(
      () =>
        compileStoryContract(bundle, [
          { span, class: "requirement", rationale: "Try to overwrite a rule." },
        ]),
      (error: Error) => {
        assert.match(error.message, /overlaps rule span/u);
        assert.ok(
          error.message.includes(JSON.stringify(span)) ||
            error.message.includes(`"start":${span.start}`),
        );
        assert.ok(error.message.includes(`"end":${statement.span.end}`));
        return true;
      },
    );
  }
  const text = "~~Old~~New requirement.";
  const touching = decode(wholeText(text));
  const compiled = compileStoryContract(touching, [
    classification(touching, "s-body", "New requirement."),
  ]);
  assert.deepEqual(
    compiled.statements.map((item) => [item.class, item.origin]),
    [
      ["struck", "rule"],
      ["requirement", "inferred"],
    ],
  );
  assert.throws(
    () =>
      compileStoryContract(touching, [
        {
          span: { sectionId: "s-body", start: 6, end: 10 },
          class: "requirement",
          rationale: "Cross the boundary.",
        },
      ]),
    /overlaps rule span/u,
  );
});

test("WO-061 criteria 2 and 4: supplied relations attach to ruled questions with evidence and stay inferred", () => {
  const bundle = decode(fixture.thread.bundle);
  const inferred: StoryInference = {
    span: spanFor(bundle, "e-q2"),
    relation: "answers",
    target: spanFor(bundle, "e-q1"),
    evidence: [spanFor(bundle, "e-q2")],
    rationale:
      "The fixture supplies this semantic relation independently of position.",
  };
  const contract = compileStoryContract(bundle, [inferred]);
  const relation = contract.relations.find(
    (item) => item.relation === "answers",
  )!;
  assert.equal(relation.origin, "inferred");
  assert.deepEqual(
    relation.evidence,
    "evidence" in inferred ? inferred.evidence : [],
  );
  assert.equal(relation.rationale, inferred.rationale);
  assert.equal(
    contract.statements.find((item) => owner(item.span) === "e-q2")!.origin,
    "rule",
    "the rule statement itself is not reclassified",
  );
  for (const statement of compileStoryContract(
    bundle,
    fixture.thread.inferences,
  ).statements.filter((item) => item.origin === "inferred"))
    assert.ok(statement.rationale);
  assert.throws(
    () => compileStoryContract(bundle, [{ ...inferred, evidence: [] }]),
    /needs evidence/u,
  );
});

test("WO-061 criterion 3: one edited section invalidates all its statements/drafts and nothing in unchanged units", () => {
  const base = decode(fixture.revision.bundle);
  const original = compileStoryContract(base, fixture.revision.inferences);
  const text = "Keep data safely.\nPreserve logs.";
  const changed: SourceBundle = {
    ...fixture.revision.bundle,
    revisionId: "r2",
    sections: fixture.revision.bundle.sections.map((section) =>
      section.id === "s-change"
        ? { ...section, text, span: { ...section.span, end: byteLength(text) } }
        : section,
    ),
  };
  const raw: SourceBundle = {
    ...changed,
    revisions: [
      {
        revisionId: "r2",
        changedSpans: [spanFor(changed, "s-change", "safely")],
      },
    ],
  };
  const newBundle = decode(raw);
  const revised = revise(original, newBundle, [
    classification(newBundle, "s-change", "Keep data safely."),
    classification(newBundle, "s-change", "Preserve logs."),
  ]);
  assert.deepEqual(
    revised.invalidated.statements,
    original.statements
      .filter((item) => owner(item.span) === "s-change")
      .map((item) => item.statementId),
  );
  assert.deepEqual(
    revised.invalidated.criteria,
    original.criteria
      .filter((item) => owner(item.span) === "s-change")
      .map((item) => item.criterionId),
  );
  assert.deepEqual(revised.invalidated.relations, []);
  assert.deepEqual(revised.invalidated.openDecisions, []);
  assert.deepEqual(
    revised.contract.statements.filter(
      (item) => owner(item.span) !== "s-change",
    ),
    original.statements.filter((item) => owner(item.span) !== "s-change"),
  );
  assert.deepEqual(
    revised.contract.criteria.filter((item) => owner(item.span) !== "s-change"),
    original.criteria.filter((item) => owner(item.span) !== "s-change"),
  );
  const noNewChoices = revise(original, newBundle);
  assert.ok(
    noNewChoices.contract.statements
      .filter((item) => owner(item.span) === "s-change")
      .every((item) => item.class === "open decision"),
  );
  assert.equal(original.revisionId, "r1");
  // Metadata-only revision preserves every item; heading bytes belong to the unit.
  assert.deepEqual(
    revise(original, decode({ ...fixture.revision.bundle, revisionId: "r2" }))
      .invalidated,
    { statements: [], criteria: [], relations: [], openDecisions: [] },
  );
  const heading = {
    ...fixture.revision.bundle,
    sections: fixture.revision.bundle.sections.map((section) =>
      section.id === "s-change"
        ? { ...section, heading: "Changed heading" }
        : section,
    ),
  };
  assert.deepEqual(
    revise(original, decode(heading)).invalidated.statements,
    revised.invalidated.statements,
  );
});

test("WO-061 criterion 3: a new explicit supersession retires an unedited requirement and its dependent claims", () => {
  const base = decode(fixture.revision.bundle);
  const original = compileStoryContract(base, fixture.revision.inferences);
  const text = "Decision: retire the window requirement.";
  const raw: SourceBundle = {
    ...fixture.revision.bundle,
    revisionId: "r2",
    discussion: [
      ...fixture.revision.bundle.discussion,
      {
        id: "e-decision",
        author: "automation",
        text,
        span: { entryId: "e-decision", start: 0, end: byteLength(text) },
        createdAt: "2026-10-01T00:01:00Z",
      },
    ],
  };
  const next = decode(raw);
  const supersedes: StoryInference = {
    span: spanFor(next, "e-decision"),
    relation: "supersedes",
    target: spanFor(next, "s-keep"),
    evidence: [spanFor(next, "e-decision")],
    rationale: "The fixture explicitly retires this earlier requirement.",
  };
  const revised = revise(original, next, [supersedes]);
  const target = original.statements.find(
    (item) => owner(item.span) === "s-keep",
  )!;
  const criterion = original.criteria.find(
    (item) => item.statementId === target.statementId,
  )!;
  assert.deepEqual(revised.invalidated.statements, [target.statementId]);
  assert.deepEqual(revised.invalidated.criteria, [criterion.criterionId]);
  assert.deepEqual(
    revised.invalidated.relations,
    original.relations
      .filter((item) => item.relation === "answers")
      .map((item) => item.relationId),
  );
  assert.equal(
    revised.contract.statements.find(
      (item) => item.statementId === target.statementId,
    )!.status,
    "superseded",
  );
  assert.equal(
    revised.contract.criteria.find(
      (item) => item.criterionId === criterion.criterionId,
    )!.status,
    "superseded",
  );
  assert.ok(
    revised.contract.openDecisions.some(
      (item) => item.reason === "unanswered" && owner(item.span) === "e-q",
    ),
  );
  assert.equal(
    revise(original, next).contract.statements.find(
      (item) => item.statementId === target.statementId,
    )!.status,
    "active",
    "decision text alone never creates supersession",
  );
  assert.equal(
    JSON.stringify(revised),
    JSON.stringify(revise(original, next, [supersedes])),
  );
  // Same source and target, changed evidence unit: drop the old semantic claim.
  const evidenceEdit = {
    ...fixture.revision.bundle,
    sections: fixture.revision.bundle.sections.map((section) =>
      section.id === "s-keep"
        ? { ...section, heading: "Reconsidered" }
        : section,
    ),
  };
  const edited = revise(original, decode(evidenceEdit));
  assert.deepEqual(
    edited.invalidated.relations,
    original.relations
      .filter((item) => item.relation === "answers")
      .map((item) => item.relationId),
  );
  assert.equal(
    edited.contract.relations.filter((item) => item.relation === "answers")
      .length,
    0,
  );
});

test("WO-061 criterion 4: interleaving, quotations, reversal and unanswered questions have pinned structural facts", () => {
  const bundle = decode(fixture.thread.bundle);
  const contract = compileStoryContract(bundle, fixture.thread.inferences);
  assert.deepEqual(projection(contract), fixture.thread.expected);
  assert.deepEqual(
    contract.relations.map((item) => [
      owner(item.span),
      item.relation,
      owner(item.target),
      item.origin,
    ]),
    [
      ["e-q2", "follows", "e-q1", "rule"],
      ["e-a1", "follows", "e-q2", "rule"],
      ["e-a1", "answers", "e-q1", "inferred"],
      ["e-decision", "supersedes", "s-earlier", "inferred"],
    ],
  );
  assert.deepEqual(
    contract.openDecisions
      .filter((item) => item.reason === "unanswered")
      .map((item) => owner(item.span)),
    ["e-q2", "e-unanswered"],
  );
  assert.equal(
    contract.statements.find((item) => owner(item.span) === "s-earlier")!
      .status,
    "superseded",
  );
  const noRelations = compileStoryContract(
    bundle,
    fixture.thread.inferences.filter((item) => "class" in item),
  );
  assert.ok(noRelations.relations.every((item) => item.relation === "follows"));
  assert.equal(
    noRelations.openDecisions.filter((item) => item.reason === "unanswered")
      .length,
    3,
  );
  const unknown = compileStoryContract(
    decode(fixture.core.bundle),
    fixture.core.inferences,
  );
  assert.ok(
    unknown.openDecisions.some(
      (item) =>
        owner(item.span) === "s-unknown" && item.reason === "unclassified",
    ),
  );
  // Same role immediately after a question establishes no follows edge.
  const sameRole = {
    ...fixture.thread.bundle,
    discussion: fixture.thread.bundle.discussion.map((entry, i) =>
      i === 1 ? { ...entry, author: "reporter" as const } : entry,
    ),
  };
  assert.ok(
    !compileStoryContract(decode(sameRole)).relations.some(
      (item) => owner(item.span) === "e-q2",
    ),
  );
});

test("WO-061 criterion 5: completed behavior and visual drafts pass copyCriterion; long/control descriptions remain open", () => {
  const contracts = [fixture.core, fixture.thread, fixture.taxonomy].map(
    (scenario) =>
      compileStoryContract(decode(scenario.bundle), scenario.inferences),
  );
  let visual = 0;
  for (const contract of contracts)
    for (const draft of contract.criteria) {
      assert.ok(
        verificationLine(draft.criterionId) &&
          verificationLine(draft.description),
      );
      assert.equal(draft.evidenceSource, "live");
      assert.ok(
        !Object.hasOwn(draft, "codeSurfaces") &&
          !Object.hasOwn(draft, "requiredChecks"),
      );
      const completed = {
        criterionId: draft.criterionId,
        description: draft.description,
        claimType: draft.claimType,
        evidenceSource: draft.evidenceSource,
        codeSurfaces: ["fixture/panel.ts"],
        requiredChecks: ["fixture-check"],
      };
      assert.deepEqual(copyCriterion(completed), completed);
      if (draft.claimType === "visual") visual++;
    }
  assert.equal(visual, 1);
  assert.equal(
    contracts[0]!.criteria[0]!.description,
    "Preserve operator intent. Retain source provenance.",
  );
  for (const text of ["x".repeat(2001), "Requirement\twith a tab"]) {
    const bundle = decode(wholeText(text));
    const contract = compileStoryContract(bundle, [
      classification(bundle, "s-body"),
    ]);
    assert.equal(contract.criteria.length, 0);
    assert.deepEqual(
      contract.openDecisions.map((item) => item.reason),
      ["criterion-description"],
    );
    assert.equal(contract.statements[0]!.text, text, "never truncated");
  }
  const atLimit = decode(wholeText("x".repeat(2000)));
  assert.equal(
    compileStoryContract(atLimit, [classification(atLimit, "s-body")])
      .criteria[0]!.description.length,
    2000,
  );
  const lines = decode(
    wholeText("First\r\nSecond\rThird\nFourth\u2028Fifth\u2029Sixth"),
  );
  assert.equal(
    compileStoryContract(lines, [classification(lines, "s-body")]).criteria[0]!
      .description,
    "First Second Third Fourth Fifth Sixth",
  );
});

test("WO-061 pure boundary: unresolved/invalid inference spans refuse and ambient clocks/randomness are unused", () => {
  const bundle = decode(fixture.taxonomy.bundle);
  const good = fixture.taxonomy.inferences[0]!;
  assert.throws(
    () =>
      compileStoryContract(bundle, [
        { ...good, span: { sectionId: "missing", start: 0, end: 1 } },
      ]),
    /no section or entry/u,
  );
  const emojiSpan = spanFor(bundle, "s-0", "🙂");
  assert.throws(
    () =>
      compileStoryContract(bundle, [
        { ...good, span: { ...emojiSpan, start: emojiSpan.start + 1 } },
      ]),
    /UTF-8 character/u,
  );
  assert.throws(
    () => compileStoryContract(bundle, [good, good]),
    /overlaps inferred span/u,
  );
  assert.throws(
    () =>
      revise(compileStoryContract(bundle), {
        ...bundle,
        bundleId: "another-bundle",
      }),
    /bundle identity/u,
  );
  const now = Date.now,
    random = Math.random;
  Date.now = () => {
    throw new Error("ambient clock");
  };
  Math.random = () => {
    throw new Error("ambient randomness");
  };
  try {
    const contract = compileStoryContract(bundle, fixture.taxonomy.inferences);
    assert.deepEqual(revise(contract, bundle).invalidated, {
      statements: [],
      criteria: [],
      relations: [],
      openDecisions: [],
    });
  } finally {
    Date.now = now;
    Math.random = random;
  }
});
