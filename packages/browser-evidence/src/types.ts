/** Structural WO-058 data: this adapter has no compiler or skeleton dependency.
 * The browser fixture admits these exact outputs through the real compiler/host. */
export type ClaimType = "state" | "behavior" | "visual" | "network";
export type ConsoleEntry = {
  level: "debug" | "log" | "info" | "warn" | "error";
  message: string;
};
export type NetworkEntry = {
  request: { method: string; url: string; bodyHash: string | null };
  response: { status: number; bodyHash: string | null };
};
export type Witness =
  | { kind: "screenshot"; contentHash: string; criterionId: string }
  | { kind: "dom-snapshot" | "accessibility-snapshot"; contentHash: string }
  | ({ kind: "network-trace"; contentHash: string } & NetworkEntry)
  | { kind: "console-capture"; contentHash: string; entries: ConsoleEntry[] };
export interface ScenarioCriterion {
  criterionId: string;
  claimType: ClaimType;
  checkId: string;
  codeSurfaces: string[];
}
export type ScenarioStep =
  | { action: "navigate"; path: string }
  | { action: "fill"; selector: string; value: string }
  | { action: "click"; selector: string }
  | { action: "assertText"; selector: string; value: string }
  | { action: "assertResponse"; path: string; status: number }
  | { action: "wait"; milliseconds: number };
export interface BrowserScenario {
  schemaVersion: 1;
  scenarioId: string;
  criteria: ScenarioCriterion[];
  steps: ScenarioStep[];
}
export interface ScenarioEnvironment {
  /** Caller-selected subject identity; preparation precedes VerificationOpened. */
  subjectRevision: string;
  /** New directory in a host-granted root. Raw artifacts are retained here. */
  directory: string;
  /** Interrupted output directory whose recorded owner must have exited. */
  recoverFrom?: string;
}
export interface BrowserEvidence {
  evidenceId: string;
  criterionId: string;
  checkId: string;
  claimType: ClaimType;
  source: "synthetic-fixture";
  subjectRevision: string;
  codeSurfaces: string[];
  automatedTest: string | null;
  observed: string;
  expected: string;
  outcome: "pass" | "fail" | "unavailable";
  reproductionSteps: string[];
  witness?: Witness;
}
export interface ProcessIdentity {
  pid: number;
  parentPid: number;
  startedAt: string;
  command: string;
}
export interface ProcessRecord {
  schemaVersion: 1;
  owner: ProcessIdentity;
  browserPid: number | null;
  processes: ProcessIdentity[];
  closed: boolean;
}
export interface ScenarioResult {
  availability: "available" | "unavailable";
  reason: string | null;
  evidence: BrowserEvidence[];
  directory: string;
  recoveredPids: number[];
  remainingPids: number[];
}
