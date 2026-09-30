import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  assertVerificationTask,
  compileVerificationTask,
  type AcceptanceCriterion,
  type VerificationSubject,
  type VerificationWitness,
} from "../src/index.js";

const fixture = JSON.parse(
  readFileSync(
    new URL("../../fixtures/wo058-verification.json", import.meta.url),
    "utf8",
  ),
) as {
  criteria: AcceptanceCriterion[];
  subject: VerificationSubject;
  witnesses: Record<string, VerificationWitness>;
};
const compile = (subject = fixture.subject, criteria = fixture.criteria) =>
  compileVerificationTask("WO-058-fixture", criteria, subject);

test("WO-058 all five witness kinds lower as immutable plain data and bind the capsule hash", () => {
  for (const witness of Object.values(fixture.witnesses)) {
    const subject = {
      ...fixture.subject,
      evidence: [
        {
          ...fixture.subject.evidence[0]!,
          witness,
          outcome:
            witness.kind === "console-capture" &&
            witness.entries.some((entry) => entry.level === "error")
              ? ("fail" as const)
              : ("pass" as const),
        },
      ],
    };
    const before = JSON.stringify(subject);
    const task = compile(subject);
    assert.deepEqual(task.subject.evidence[0]!.witness, witness);
    assert.notEqual(task.subject.evidence[0]!.witness, witness);
    assertVerificationTask(task);
    assert.equal(JSON.stringify(subject), before);
    assert.notEqual(
      task.inputHash,
      compile({
        ...subject,
        evidence: [
          {
            ...subject.evidence[0]!,
            witness: { ...witness, contentHash: `sha256:${"2".repeat(64)}` },
          },
        ],
      }).inputHash,
    );
  }
});

test("WO-058 undeclared claim types and witness kinds refuse at their decode paths", () => {
  assert.throws(
    () =>
      compile(fixture.subject, [
        {
          ...fixture.criteria[0]!,
          claimType: "evidence",
        } as unknown as AcceptanceCriterion,
      ]),
    /\$\.criteria\[0\]\.claimType/u,
  );
  const malformed = (witness: unknown, outcome = "pass") =>
    ({
      ...fixture.subject,
      evidence: [{ ...fixture.subject.evidence[0]!, witness, outcome }],
    }) as VerificationSubject;
  for (const [witness, field] of [
    [{ ...fixture.witnesses.screenshot, kind: "ocr" }, "kind"],
    [
      { ...fixture.witnesses.screenshot, contentHash: "not-a-hash" },
      "contentHash",
    ],
    [
      { ...fixture.witnesses.screenshot, criterionId: "network" },
      "criterionId",
    ],
    [
      { ...fixture.witnesses.dom, narrative: "not a witness field" },
      "narrative",
    ],
    [null, ""],
  ] as const)
    assert.throws(
      () => compile(malformed(witness)),
      (error: unknown) => {
        assert.ok(error instanceof Error);
        assert.ok(
          error.message.includes(
            `$.subject.evidence[0].witness${field ? `.${field}` : ""}`,
          ),
        );
        return true;
      },
    );
  assert.throws(
    () => compile(malformed(fixture.witnesses.consoleError)),
    /\$\.subject\.evidence\[0\]\.outcome: console error requires fail/u,
  );
  assert.throws(
    () =>
      compile(
        malformed({
          ...fixture.witnesses.trace,
          request: { method: "GET", url: "fixture", bodyHash: "wrong" },
        }),
      ),
    /\.request\.bodyHash/u,
  );
  assert.throws(
    () =>
      compile(
        malformed({
          ...fixture.witnesses.trace,
          response: { status: 600, bodyHash: null },
        }),
      ),
    /\.response\.status/u,
  );
});

test("WO-058 absent optional witnesses preserve legacy construction bytes", () => {
  const legacy = {
    ...fixture.subject,
    evidence: fixture.subject.evidence.map(({ witness, ...entry }) => ({
      ...entry,
      claimType: "behavior" as const,
    })),
  };
  const criteria = fixture.criteria.map((criterion) => ({
    ...criterion,
    claimType: "behavior" as const,
  }));
  const task = compile(legacy, criteria);
  assert.deepEqual(task.subject, legacy);
  assert.ok(
    task.subject.evidence.every((entry) => !Object.hasOwn(entry, "witness")),
  );
  assert.equal(task.contractVersion, "verification-v1");
  assertVerificationTask(task);
});
