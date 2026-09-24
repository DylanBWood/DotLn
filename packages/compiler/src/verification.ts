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
  readonly hostTest?: {
    readonly kind: "host-run-test";
    readonly origin: "host";
    readonly snapshotHash: string;
    readonly command: string;
    readonly exitCode: number | null;
    readonly signal: string | null;
    readonly stdout: string;
    readonly stderr: string;
  };
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
  readonly mode?: "100644" | "100755";
}
/** Contract facts selected by the caller, never a worker result or transcript. */
export type WorktreeVerificationContract = Pick<
  WorkOrder,
  | "workOrderId"
  | "objective"
  | "acceptanceCriteria"
  | "constraints"
  | "nonGoals"
  | "requiredEvidence"
>;
export interface NamedVerificationTest {
  readonly criterionId: string;
  readonly checkId: string;
  readonly command: string;
}
export interface WorktreeSnapshot {
  readonly profile: "worktree-snapshot";
  readonly observedCommit: string;
  readonly snapshotHash: string;
  readonly contract: WorktreeVerificationContract;
  readonly tests: readonly NamedVerificationTest[];
}
export interface VerificationSubject {
  readonly snapshot?: WorktreeSnapshot;
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

const exactFields = (value: object, keys: readonly string[], path: string) => {
  requireValue(
    value && typeof value === "object" && !Array.isArray(value),
    path,
  );
  for (const key of Object.keys(value))
    requireValue(keys.includes(key), `unexpected field ${path}.${key}`);
};
export const verificationTestCommand = (value: unknown): value is string =>
  verificationLine(value) &&
  !value.startsWith("-") &&
  /^[a-zA-Z0-9_./-]+(?: [a-zA-Z0-9_./=-]+)*$/u.test(value);

/** Equality seal, not authentication. Evidence is bound separately by inputHash. */
export function verificationSnapshotHash(
  subject: Pick<
    VerificationSubject,
    "baseCommit" | "revision" | "diff" | "files"
  >,
  snapshot: Omit<WorktreeSnapshot, "snapshotHash">,
): string {
  return `fnv1a64:${fnv1a64(
    canonicalStringify({
      baseCommit: subject.baseCommit,
      revision: subject.revision,
      diff: subject.diff,
      files: subject.files,
      profile: snapshot.profile,
      observedCommit: snapshot.observedCommit,
      contract: snapshot.contract,
      tests: snapshot.tests,
    }),
  )}`;
}

function copySnapshot(value: WorktreeSnapshot): WorktreeSnapshot {
  exactFields(
    value,
    ["profile", "observedCommit", "snapshotHash", "contract", "tests"],
    "$.subject.snapshot",
  );
  requireValue(
    value.profile === "worktree-snapshot" &&
      /^[a-f0-9]{40}$/u.test(value.observedCommit),
    "snapshot profile or commit",
  );
  const c = value.contract;
  exactFields(
    c,
    [
      "workOrderId",
      "objective",
      "acceptanceCriteria",
      "constraints",
      "nonGoals",
      "requiredEvidence",
    ],
    "$.subject.snapshot.contract",
  );
  requireValue(
    verificationLine(c.workOrderId) && verificationLine(c.objective),
    "snapshot contract identity",
  );
  const contract = {
    workOrderId: c.workOrderId,
    objective: c.objective,
    acceptanceCriteria: lines(c.acceptanceCriteria, "contract criteria"),
    constraints: lines(c.constraints, "contract constraints", false),
    nonGoals: lines(c.nonGoals, "contract non-goals", false),
    requiredEvidence: lines(c.requiredEvidence, "contract named tests"),
  };
  requireValue(
    Array.isArray(value.tests) &&
      value.tests.length > 0 &&
      value.tests.length <= 100,
    "snapshot tests",
  );
  const tests = value.tests.map((test, i) => {
    exactFields(
      test,
      ["criterionId", "checkId", "command"],
      `$.subject.snapshot.tests[${i}]`,
    );
    requireValue(
      verificationLine(test.criterionId) &&
        verificationLine(test.checkId) &&
        verificationTestCommand(test.command),
      "named test",
    );
    requireValue(
      contract.requiredEvidence.includes(test.command),
      "test absent from contract requiredEvidence",
    );
    return {
      criterionId: test.criterionId,
      checkId: test.checkId,
      command: test.command,
    };
  });
  requireValue(
    new Set(tests.map((test) => `${test.criterionId}\0${test.checkId}`))
      .size === tests.length &&
      contract.requiredEvidence.every((command) =>
        tests.some((test) => test.command === command),
      ),
    "duplicate or missing named tests",
  );
  return {
    profile: value.profile,
    observedCommit: value.observedCommit,
    snapshotHash: value.snapshotHash,
    contract,
    tests,
  };
}

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
  const snapshot =
    value.snapshot === undefined ? undefined : copySnapshot(value.snapshot);
  if (snapshot)
    exactFields(
      value,
      [
        "repo",
        "baseCommit",
        "revision",
        "diff",
        "files",
        "evidence",
        "snapshot",
      ],
      "$.subject",
    );
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
  const files = value.files.map((file, i) => {
    if (snapshot) {
      exactFields(file, ["path", "contents", "mode"], `$.subject.files[${i}]`);
      requireValue(
        file.mode === "100644" || file.mode === "100755",
        "snapshot file mode",
      );
    }
    requireValue(
      repositoryPath(file.path) &&
        typeof file.contents === "string" &&
        file.contents.length <= 100_000,
      "repository file",
    );
    return {
      path: file.path,
      contents: file.contents,
      ...(snapshot ? { mode: file.mode } : {}),
    };
  });
  requireValue(
    new Set(files.map((file) => file.path)).size === files.length,
    "duplicate repository file",
  );
  requireValue(
    Array.isArray(value.evidence) && value.evidence.length <= 100,
    "subject evidence",
  );
  const evidence = value.evidence.map((item, i): VerificationEvidence => {
    if (snapshot)
      exactFields(
        item,
        [
          "evidenceId",
          "criterionId",
          "checkId",
          "claimType",
          "source",
          "subjectRevision",
          "codeSurfaces",
          "automatedTest",
          "observed",
          "expected",
          "outcome",
          "reproductionSteps",
          "hostTest",
        ],
        `$.subject.evidence[${i}]`,
      );
    let hostTest: VerificationEvidence["hostTest"];
    if (item.hostTest !== undefined) {
      const h = item.hostTest;
      exactFields(
        h,
        [
          "kind",
          "origin",
          "snapshotHash",
          "command",
          "exitCode",
          "signal",
          "stdout",
          "stderr",
        ],
        `$.subject.evidence[${i}].hostTest`,
      );
      requireValue(
        snapshot &&
          h.kind === "host-run-test" &&
          h.origin === "host" &&
          h.snapshotHash === snapshot.snapshotHash &&
          item.source === "live" &&
          item.claimType === "behavior" &&
          item.automatedTest === h.command &&
          snapshot.tests.some(
            (test) =>
              test.criterionId === item.criterionId &&
              test.checkId === item.checkId &&
              test.command === h.command,
          ),
        "host test provenance",
      );
      requireValue(
        (h.exitCode === null ||
          (Number.isInteger(h.exitCode) &&
            h.exitCode >= 0 &&
            h.exitCode <= 255)) &&
          (h.signal === null || verificationLine(h.signal)) &&
          typeof h.stdout === "string" &&
          h.stdout.length <= 65536 &&
          typeof h.stderr === "string" &&
          h.stderr.length <= 65536,
        "host test result",
      );
      const outcome =
        h.signal !== null || h.exitCode === null
          ? "unavailable"
          : h.exitCode === 0
            ? "pass"
            : "fail";
      requireValue(
        item.outcome === outcome &&
          item.expected === "exit 0" &&
          item.observed ===
            (outcome === "unavailable"
              ? "test execution unavailable"
              : `exit ${h.exitCode}`),
        "host test outcome",
      );
      hostTest = {
        kind: h.kind,
        origin: h.origin,
        snapshotHash: h.snapshotHash,
        command: h.command,
        exitCode: h.exitCode,
        signal: h.signal,
        stdout: h.stdout,
        stderr: h.stderr,
      };
    }
    requireValue(
      !snapshot || hostTest !== undefined,
      "snapshot evidence requires a host-run test",
    );
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
      ...(hostTest ? { hostTest } : {}),
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
  if (snapshot) {
    requireValue(
      value.revision === snapshot.observedCommit &&
        /^[a-f0-9]{40}$/u.test(value.baseCommit),
      "snapshot subject commits",
    );
    requireValue(
      files.every((file, i) => i === 0 || files[i - 1]!.path < file.path),
      "snapshot files must be sorted",
    );
    requireValue(
      snapshot.snapshotHash ===
        verificationSnapshotHash({ ...value, files }, snapshot),
      "snapshot hash drift",
    );
  }
  return {
    ...(snapshot ? { snapshot } : {}),
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
  return lowerVerificationTask(
    workOrderId,
    criteriaInput,
    subjectInput,
    findingInput,
    COMPILER_PACKAGE_VERSION,
  );
}
function lowerVerificationTask(
  workOrderId: string,
  criteriaInput: readonly AcceptanceCriterion[],
  subjectInput: VerificationSubject,
  findingInput: VerificationFinding | null,
  compilerPackageVersion: string,
): VerificationTask {
  requireValue(verificationLine(workOrderId), "work order id");
  requireValue(
    Array.isArray(criteriaInput) &&
      criteriaInput.length > 0 &&
      criteriaInput.length <= 100,
    "criteria",
  );
  const criteria = criteriaInput.map(copyCriterion);
  if (subjectInput.snapshot)
    criteriaInput.forEach((criterion, i) =>
      exactFields(
        criterion,
        [
          "criterionId",
          "description",
          "claimType",
          "evidenceSource",
          "codeSurfaces",
          "requiredChecks",
        ],
        `$.criteria[${i}]`,
      ),
    );
  requireValue(
    new Set(criteria.map((value) => value.criterionId)).size ===
      criteria.length,
    "duplicate criterion id",
  );
  const subject = copySubject(subjectInput);
  if (subject.snapshot && findingInput !== null)
    exactFields(
      findingInput,
      [
        "findingId",
        "criterionId",
        "severity",
        "observed",
        "expected",
        "reproductionSteps",
        "evidenceRefs",
        "likelySurface",
      ],
      "$.finding",
    );
  if (subject.snapshot) {
    const { contract, tests } = subject.snapshot;
    requireValue(
      criteria.every(
        (criterion) =>
          criterion.claimType === "behavior" &&
          criterion.evidenceSource === "live" &&
          contract.acceptanceCriteria.includes(criterion.description) &&
          criterion.requiredChecks.every((checkId) =>
            tests.some(
              (test) =>
                test.criterionId === criterion.criterionId &&
                test.checkId === checkId,
            ),
          ),
      ),
      "snapshot criterion contract or named checks",
    );
    requireValue(
      findingInput !== null ||
        tests.every((test) =>
          criteria.some(
            (criterion) =>
              criterion.criterionId === test.criterionId &&
              criterion.requiredChecks.includes(test.checkId),
          ),
        ),
      "test outside snapshot criteria",
    );
    requireValue(
      findingInput !== null ||
        contract.acceptanceCriteria.every((description) =>
          criteria.some((criterion) => criterion.description === description),
        ),
      "snapshot contract criterion coverage",
    );
  }
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
    compilerPackageVersion,
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

/** A compiler release label, as a recorded program or capsule names it. */
export const isCompilerRelease = (value: unknown): value is string =>
  typeof value === "string" &&
  /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/u.test(value);

/** A recorded capsule keeps the compiler release it names; everything else
 * must be this compiler's lowering, so a stream recorded before a
 * release-only bump still replays and any other drift fails (WO-154). */
export function assertVerificationTask(task: VerificationTask): void {
  requireValue(
    isCompilerRelease(task.compilerPackageVersion),
    "compiled capsule release",
  );
  const expected = lowerVerificationTask(
    task.workOrder.workOrderId,
    task.criteria,
    task.subject,
    task.finding,
    task.compilerPackageVersion,
  );
  requireValue(
    canonicalStringify(task) === canonicalStringify(expected),
    `compiled capsule drift${task.subject.snapshot ? ` at ${differencePath(task, expected)}` : ""}`,
  );
}

function differencePath(
  actual: unknown,
  expected: unknown,
  path = "$",
): string {
  if (
    actual &&
    expected &&
    typeof actual === "object" &&
    typeof expected === "object"
  ) {
    const a = actual as Record<string, unknown>,
      b = expected as Record<string, unknown>;
    for (const key of new Set([...Object.keys(a), ...Object.keys(b)]))
      if (
        canonicalStringify(a[key] ?? null) !==
          canonicalStringify(b[key] ?? null) ||
        !(key in a) ||
        !(key in b)
      )
        return differencePath(
          a[key],
          b[key],
          Array.isArray(actual) ? `${path}[${key}]` : `${path}.${key}`,
        );
  }
  return path;
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
