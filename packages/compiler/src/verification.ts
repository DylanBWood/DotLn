import { COMPILER_PACKAGE_VERSION } from "./artifact-identity.js";
import { canonicalStringify, fnv1a64 } from "./normalize.js";
import type { WorkOrder } from "./types.js";

export type ClaimType = "state" | "behavior";
export type EvidenceSource = "synthetic-fixture" | "live";
export interface AcceptanceCriterion {
  readonly criterionId: string;
  readonly description: string;
  readonly claimType: ClaimType;
  readonly evidenceSource: EvidenceSource;
  /** Includes dependencies whose substantive change requires another check. */
  readonly codeSurfaces: readonly string[];
  readonly requiredChecks: readonly string[];
}
export interface VerificationEvidence {
  readonly evidenceId: string;
  readonly criterionId: string;
  readonly checkId: string;
  readonly claimType: ClaimType;
  readonly source: EvidenceSource;
  readonly subjectRevision: string;
  readonly codeSurfaces: readonly string[];
  readonly automatedTest: string | null;
  readonly observed: string;
  readonly expected: string;
  readonly outcome: "pass" | "fail" | "unavailable";
  readonly reproductionSteps: readonly string[];
}
export interface VerificationFinding {
  readonly findingId: string;
  readonly criterionId: string;
  readonly severity: "blocking" | "major" | "minor";
  readonly observed: string;
  readonly expected: string;
  readonly reproductionSteps: readonly string[];
  readonly evidenceRefs: readonly string[];
  readonly likelySurface: readonly string[];
}
export interface Evaluation {
  readonly criterionId: string;
  readonly claimType: ClaimType;
  readonly verdict: "pass" | "fail" | "unverified";
  readonly evidenceRefs: readonly string[];
  /** Reserved, explicitly empty until their comparison consumers arrive. */
  readonly exemplarRefs: readonly string[];
  readonly dissentRefs: readonly string[];
}
export interface RepositoryFile {
  readonly path: string;
  readonly contents: string;
}
export interface VerificationSubject {
  readonly repo: string;
  readonly baseCommit: string;
  readonly revision: string;
  readonly diff: string;
  /** Explicit host-read repository projection; no transcript or result prose. */
  readonly files: readonly RepositoryFile[];
  readonly evidence: readonly VerificationEvidence[];
}
export interface VerificationTask {
  readonly contractVersion: "verification-v1";
  readonly compilerPackageVersion: string;
  readonly inputHash: string;
  readonly role: "verifier" | "repairer";
  readonly workOrder: WorkOrder;
  readonly criteria: readonly AcceptanceCriterion[];
  readonly subject: VerificationSubject;
  readonly finding: VerificationFinding | null;
}

export const verificationLine = (value: unknown): value is string =>
  typeof value === "string" &&
  value.length > 0 &&
  value.length <= 2000 &&
  !/[\u0000-\u001f\u007f\u2028\u2029]/u.test(value);
export const repositoryPath = (value: unknown): value is string =>
  verificationLine(value) &&
  value.length <= 256 &&
  !value.startsWith("/") &&
  !value.includes("\\") &&
  value
    .split("/")
    .every(
      (part) => part !== "" && part !== "." && part !== ".." && part !== ".git",
    );
const requireValue: (valid: unknown, detail: string) => asserts valid = (
  valid,
  detail,
) => {
  if (!valid) throw new Error(`verification contract: ${detail}`);
};
const lines = (
  values: readonly string[],
  name: string,
  nonempty = true,
): string[] => {
  requireValue(
    Array.isArray(values) &&
      (!nonempty || values.length > 0) &&
      values.length <= 100 &&
      values.every(verificationLine),
    name,
  );
  requireValue(new Set(values).size === values.length, `duplicate ${name}`);
  return [...values];
};

export function copyCriterion(value: AcceptanceCriterion): AcceptanceCriterion {
  requireValue(
    verificationLine(value.criterionId) && verificationLine(value.description),
    "criterion identity",
  );
  requireValue(["state", "behavior"].includes(value.claimType), "claim type");
  requireValue(
    ["synthetic-fixture", "live"].includes(value.evidenceSource),
    "evidence source",
  );
  const codeSurfaces = lines(value.codeSurfaces, "criterion surfaces");
  requireValue(codeSurfaces.every(repositoryPath), "criterion paths");
  return {
    criterionId: value.criterionId,
    description: value.description,
    claimType: value.claimType,
    evidenceSource: value.evidenceSource,
    codeSurfaces,
    requiredChecks: lines(value.requiredChecks, "required checks"),
  };
}
export function copyFinding(value: VerificationFinding): VerificationFinding {
  requireValue(
    verificationLine(value.findingId) &&
      verificationLine(value.criterionId) &&
      verificationLine(value.observed) &&
      verificationLine(value.expected),
    "finding fields",
  );
  requireValue(
    ["blocking", "major", "minor"].includes(value.severity),
    "finding severity",
  );
  const likelySurface = lines(value.likelySurface, "likely surfaces");
  requireValue(likelySurface.every(repositoryPath), "finding paths");
  return {
    findingId: value.findingId,
    criterionId: value.criterionId,
    severity: value.severity,
    observed: value.observed,
    expected: value.expected,
    reproductionSteps: lines(value.reproductionSteps, "reproduction steps"),
    evidenceRefs: lines(value.evidenceRefs, "finding evidence"),
    likelySurface,
  };
}
export function copySubject(value: VerificationSubject): VerificationSubject {
  requireValue(
    verificationLine(value.repo) &&
      verificationLine(value.baseCommit) &&
      verificationLine(value.revision),
    "subject identity",
  );
  requireValue(
    typeof value.diff === "string" && value.diff.length <= 100_000,
    "subject diff",
  );
  requireValue(
    Array.isArray(value.files) &&
      value.files.length > 0 &&
      value.files.length <= 100,
    "repository snapshot",
  );
  const files = value.files.map((file) => {
    requireValue(
      repositoryPath(file.path) &&
        typeof file.contents === "string" &&
        file.contents.length <= 100_000,
      "repository file",
    );
    return { path: file.path, contents: file.contents };
  });
  requireValue(
    new Set(files.map((file) => file.path)).size === files.length,
    "duplicate repository file",
  );
  requireValue(
    Array.isArray(value.evidence) && value.evidence.length <= 100,
    "subject evidence",
  );
  const evidence = value.evidence.map((item): VerificationEvidence => {
    requireValue(
      verificationLine(item.evidenceId) &&
        verificationLine(item.criterionId) &&
        verificationLine(item.checkId) &&
        verificationLine(item.observed) &&
        verificationLine(item.expected),
      "evidence fields",
    );
    requireValue(
      item.subjectRevision === value.revision &&
        ["state", "behavior"].includes(item.claimType) &&
        ["synthetic-fixture", "live"].includes(item.source) &&
        ["pass", "fail", "unavailable"].includes(item.outcome),
      "evidence provenance",
    );
    requireValue(
      item.automatedTest === null || verificationLine(item.automatedTest),
      "automated test",
    );
    const codeSurfaces = lines(item.codeSurfaces, "evidence surfaces");
    requireValue(codeSurfaces.every(repositoryPath), "evidence paths");
    return {
      evidenceId: item.evidenceId,
      criterionId: item.criterionId,
      checkId: item.checkId,
      claimType: item.claimType,
      source: item.source,
      subjectRevision: item.subjectRevision,
      codeSurfaces,
      automatedTest: item.automatedTest,
      observed: item.observed,
      expected: item.expected,
      outcome: item.outcome,
      reproductionSteps: lines(item.reproductionSteps, "evidence reproduction"),
    };
  });
  requireValue(
    new Set(evidence.map((item) => item.evidenceId)).size === evidence.length,
    "duplicate evidence id",
  );
  return {
    repo: value.repo,
    baseCommit: value.baseCommit,
    revision: value.revision,
    diff: value.diff,
    files,
    evidence,
  };
}

/** Positive construction is the blinding boundary, including nested values. */
export function compileVerificationTask(
  workOrderId: string,
  criteriaInput: readonly AcceptanceCriterion[],
  subjectInput: VerificationSubject,
  findingInput: VerificationFinding | null = null,
): VerificationTask {
  requireValue(verificationLine(workOrderId), "work order id");
  requireValue(
    Array.isArray(criteriaInput) &&
      criteriaInput.length > 0 &&
      criteriaInput.length <= 100,
    "criteria",
  );
  const criteria = criteriaInput.map(copyCriterion);
  requireValue(
    new Set(criteria.map((value) => value.criterionId)).size ===
      criteria.length,
    "duplicate criterion id",
  );
  const subject = copySubject(subjectInput);
  const finding = findingInput === null ? null : copyFinding(findingInput);
  requireValue(
    finding === null ||
      (finding.severity === "blocking" &&
        criteria.some(
          (criterion) => criterion.criterionId === finding.criterionId,
        )),
    "repair requires a blocking finding",
  );
  requireValue(
    criteria.every((criterion) =>
      criterion.codeSurfaces.every((path) =>
        subject.files.some((file) => file.path === path),
      ),
    ),
    "criterion outside repository snapshot",
  );
  requireValue(
    finding === null ||
      finding.likelySurface.every((path) =>
        criteria.some((criterion) => criterion.codeSurfaces.includes(path)),
      ),
    "repair outside criterion surfaces",
  );
  const role = finding === null ? "verifier" : "repairer";
  const workOrder: WorkOrder = {
    workOrderId,
    objective:
      finding === null
        ? "Independently verify the supplied acceptance criteria against the pinned repository and witnessed evidence."
        : `Repair ${finding.findingId}: ${finding.expected}`,
    acceptanceCriteria: criteria.map(
      (criterion) => `${criterion.criterionId}: ${criterion.description}`,
    ),
    knownFacts: [
      "Repository access is the explicit host-read snapshot in this capsule.",
    ],
    decisions: [],
    constraints: [
      "Evidence source and claim type must match each criterion.",
      "Worker completion is a self-report; only host-admitted verifier evidence updates acceptance.",
    ],
    nonGoals: [
      "Independent code review",
      "Unrelated changes",
      "Live-integration claims from synthetic fixtures",
    ],
    repo: subject.repo,
    baseCommit: subject.revision,
    allowedOperations: [
      finding === null ? "verification.evaluate" : "repair.propose",
    ],
    prohibitedOperations: [
      "repo.write",
      "repo.delete",
      "network",
      "transcript.read",
      "self.certify",
    ],
    requiredEvidence: criteria.flatMap((criterion) => criterion.requiredChecks),
    outputContract: {
      type: finding === null ? "verification-result-v1" : "repair-proposal-v1",
    },
  };
  const contents: Omit<VerificationTask, "inputHash"> = {
    contractVersion: "verification-v1" as const,
    compilerPackageVersion: COMPILER_PACKAGE_VERSION,
    role,
    workOrder,
    criteria,
    subject,
    finding,
  };
  return {
    ...contents,
    inputHash: `fnv1a64:${fnv1a64(canonicalStringify(contents))}`,
  };
}

export function assertVerificationTask(task: VerificationTask): void {
  const expected = compileVerificationTask(
    task.workOrder.workOrderId,
    task.criteria,
    task.subject,
    task.finding,
  );
  requireValue(
    canonicalStringify(task) === canonicalStringify(expected),
    "compiled capsule drift",
  );
}

/** Semantic repair policy: exact source bytes, including dependency surfaces. */
export function changedVerificationSurfaces(
  before: VerificationSubject,
  after: VerificationSubject,
): readonly string[] {
  const paths = new Set(
    [...before.files, ...after.files].map((file) => file.path),
  );
  return [...paths]
    .filter(
      (path) =>
        before.files.find((file) => file.path === path)?.contents !==
        after.files.find((file) => file.path === path)?.contents,
    )
    .sort();
}

export function affectedVerificationCriteria(
  criteria: readonly AcceptanceCriterion[],
  changed: readonly string[],
): readonly string[] {
  // An undeclared dependency is uncertainty, not permission to retain evidence.
  const unknown = changed.some(
    (path) =>
      !criteria.some((criterion) => criterion.codeSurfaces.includes(path)),
  );
  return criteria
    .filter(
      (criterion) =>
        unknown ||
        criterion.codeSurfaces.some((path) => changed.includes(path)),
    )
    .map((criterion) => criterion.criterionId);
}
