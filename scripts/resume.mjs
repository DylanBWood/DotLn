#!/usr/bin/env node
import { existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, realpathSync, renameSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const logPath = join(repoRoot, "docs/control/resume.jsonl");
const currentPath = join(repoRoot, "docs/control/current.md");
const containedRegularFile = (path, root) => {
  if (!existsSync(path) || !lstatSync(path).isFile()) return false;
  return realpathSync(path).startsWith(`${realpathSync(root)}${sep}`);
};

const readEvents = () => existsSync(logPath) ? readFileSync(logPath, "utf8").trim().split("\n").filter(Boolean).map((line, index) => {
  try { return JSON.parse(line); } catch { throw new Error(`invalid control event at line ${index + 1}`); }
}) : [];

const fold = events => {
  const state = { workOrderId: undefined, workOrderPath: undefined, phase: "none", latestVerificationId: undefined, latestVerificationPath: undefined, latestVerdict: undefined, finalReviewId: undefined, finalReviewPath: undefined, failureSourceId: undefined, failureSourcePath: undefined };
  for (const event of events) {
    switch (event.type) {
      case "WorkOrderActivated": Object.assign(state, { workOrderId: event.workOrderId, workOrderPath: event.workOrderPath, phase: "active", latestVerificationId: undefined, latestVerificationPath: undefined, latestVerdict: undefined, finalReviewId: undefined, finalReviewPath: undefined, failureSourceId: undefined, failureSourcePath: undefined }); break;
      case "ImplementationReady": state.phase = "ready-to-verify"; break;
      case "VerificationRequested": Object.assign(state, { phase: "verifying", latestVerificationId: event.verificationId, latestVerificationPath: event.reportPath, latestVerdict: undefined }); break;
      case "VerificationCompleted": Object.assign(state, { phase: event.verdict === "pass" ? "verified" : "needs-fix", latestVerificationId: event.verificationId, latestVerificationPath: event.reportPath, latestVerdict: event.verdict, failureSourceId: event.verdict === "fail" ? event.verificationId : undefined, failureSourcePath: event.verdict === "fail" ? event.reportPath : undefined }); break;
      case "RepairRequested": state.phase = "repairing"; break;
      case "RepairCompleted": state.phase = "ready-to-verify"; break;
      case "FinalReviewRequested": Object.assign(state, { phase: "final-review", finalReviewId: event.finalReviewId, finalReviewPath: event.reportPath }); break;
      case "FinalReviewCompleted": Object.assign(state, { phase: event.verdict === "pass" ? "closed" : "needs-fix", failureSourceId: event.verdict === "fail" ? event.finalReviewId : undefined, failureSourcePath: event.verdict === "fail" ? event.reportPath : undefined }); break;
    }
  }
  return state;
};

const append = event => {
  mkdirSync(dirname(logPath), { recursive: true });
  const record = { schemaVersion: 1, ...event };
  writeFileSync(logPath, `${JSON.stringify(record)}\n`, { flag: "a", mode: 0o644 });
  return record;
};

const nextVerification = state => {
  const events = readEvents();
  const used = events.filter(event => event.workOrderId === state.workOrderId && typeof event.verificationId === "string").map(event => Number(event.verificationId.slice(4))).filter(Number.isInteger);
  const directory = join(repoRoot, "docs/verifications", state.workOrderId);
  if (existsSync(directory)) used.push(...readdirSync(directory).map(name => /^VER-(\d+)\.md$/.exec(name)).filter(Boolean).map(match => Number(match[1])));
  const number = Math.max(0, ...used) + 1;
  return `VER-${String(number).padStart(3, "0")}`;
};
const nextFinalReview = state => {
  const used = readEvents().filter(event => event.workOrderId === state.workOrderId && typeof event.finalReviewId === "string").map(event => Number(event.finalReviewId.slice(6))).filter(Number.isInteger);
  const directory = join(repoRoot, "docs/final-reviews", state.workOrderId);
  if (existsSync(directory)) used.push(...readdirSync(directory).map(name => /^FINAL-(\d+)\.md$/.exec(name)).filter(Boolean).map(match => Number(match[1])));
  return `FINAL-${String(Math.max(0, ...used) + 1).padStart(3, "0")}`;
};

const legalActions = state => ({
  "none": ["activate"], active: ["implementation-ready"], "ready-to-verify": ["verify"], verifying: ["verification-result"], "needs-fix": ["fix"], repairing: ["repair-complete"], verified: ["final-review"], "final-review": ["final-review-result"], closed: ["next"],
}[state.phase] ?? []);

const render = state => `# Current control state

- Work order: ${state.workOrderId ?? "none"}
- Work-order path: ${state.workOrderPath ?? "none"}
- Phase: ${state.phase}
- Latest verification: ${state.latestVerificationId ?? "none"}
- Verification path: ${state.latestVerificationPath ?? "none"}
- Latest verdict: ${state.latestVerdict ?? "none"}
- Final review: ${state.finalReviewId ?? "none"}
- Final-review path: ${state.finalReviewPath ?? "none"}
- Legal next actions: ${legalActions(state).join(", ") || "none"}

Generated from the append-only \`docs/control/resume.jsonl\`; do not edit this projection manually.
`;

const project = state => {
  mkdirSync(dirname(currentPath), { recursive: true });
  const temporary = `${currentPath}.tmp`;
  writeFileSync(temporary, render(state));
  renameSync(temporary, currentPath);
};

const requirePhase = (state, ...phases) => { if (!phases.includes(state.phase)) throw new Error(`cannot perform action in phase ${state.phase}; legal actions: ${legalActions(state).join(", ") || "none"}`); };
const [action = "status", ...args] = process.argv.slice(2);
let state = fold(readEvents());
let message;

switch (action) {
  case "status": message = render(state); break;
  case "activate": {
    requirePhase(state, "none", "closed");
    const [workOrderId, workOrderPath] = args;
    if (!/^WO-\d{3}$/.test(workOrderId ?? "") || !workOrderPath) throw new Error("usage: resume activate WO-NNN docs/work-orders/<file>.md");
    const expectedRoot = join(repoRoot, "docs/work-orders");
    const authorityPath = resolve(repoRoot, workOrderPath);
    if (!authorityPath.startsWith(`${expectedRoot}${sep}`) || !containedRegularFile(authorityPath, expectedRoot) || !basename(authorityPath).startsWith(`${workOrderId}-`)) throw new Error(`invalid work-order authority path for ${workOrderId}: ${workOrderPath}`);
    append({ type: "WorkOrderActivated", workOrderId, workOrderPath });
    message = `Activated ${workOrderId}.`;
    break;
  }
  case "implementation-ready": requirePhase(state, "active"); append({ type: "ImplementationReady", workOrderId: state.workOrderId }); message = `${state.workOrderId} is ready for verification.`; break;
  case "verify": {
    requirePhase(state, "ready-to-verify");
    const verificationId = nextVerification(state);
    const reportPath = `docs/verifications/${state.workOrderId}/${verificationId}.md`;
    append({ type: "VerificationRequested", workOrderId: state.workOrderId, verificationId, reportPath });
    message = `Verify ${state.workOrderPath}; write the immutable report to ${reportPath}.`;
    break;
  }
  case "verification-result": {
    requirePhase(state, "verifying");
    const [verdict] = args;
    if (verdict !== "pass" && verdict !== "fail") throw new Error("usage: resume verification-result pass|fail");
    const verificationRoot = join(repoRoot, "docs/verifications", state.workOrderId);
    if (!state.latestVerificationPath || !containedRegularFile(join(repoRoot, state.latestVerificationPath), verificationRoot)) throw new Error(`verification report is not a contained regular file: ${state.latestVerificationPath}`);
    append({ type: "VerificationCompleted", workOrderId: state.workOrderId, verificationId: state.latestVerificationId, reportPath: state.latestVerificationPath, verdict });
    message = `Recorded ${state.latestVerificationId}: ${verdict}.`;
    break;
  }
  case "fix": requirePhase(state, "needs-fix"); append({ type: "RepairRequested", workOrderId: state.workOrderId, sourceFindingId: state.failureSourceId, sourceReportPath: state.failureSourcePath }); message = `Repair ${state.workOrderPath} using ${state.failureSourcePath}; read both artifacts.`; break;
  case "repair-complete": requirePhase(state, "repairing"); append({ type: "RepairCompleted", workOrderId: state.workOrderId, sourceVerificationId: state.latestVerificationId }); message = `${state.workOrderId} repair is ready for re-verification.`; break;
  case "final-review": {
    requirePhase(state, "verified");
    const finalReviewId = nextFinalReview(state);
    const reportPath = `docs/final-reviews/${state.workOrderId}/${finalReviewId}.md`;
    append({ type: "FinalReviewRequested", workOrderId: state.workOrderId, throughVerificationId: state.latestVerificationId, finalReviewId, reportPath });
    message = `Final-review ${state.workOrderPath}, the complete verification sequence, and ideation receipt; write ${reportPath}.`;
    break;
  }
  case "final-review-result": {
    requirePhase(state, "final-review");
    const [verdict] = args;
    if (verdict !== "pass" && verdict !== "fail") throw new Error("usage: resume final-review-result pass|fail");
    const finalReviewRoot = join(repoRoot, "docs/final-reviews", state.workOrderId);
    if (!state.finalReviewPath || !containedRegularFile(join(repoRoot, state.finalReviewPath), finalReviewRoot)) throw new Error(`final-review report is not a contained regular file: ${state.finalReviewPath}`);
    append({ type: "FinalReviewCompleted", workOrderId: state.workOrderId, finalReviewId: state.finalReviewId, reportPath: state.finalReviewPath, verdict }); message = verdict === "pass" ? "Recorded final review pass; commit the reviewed state, then publish its PR." : "Recorded final review failure; return to bounded repair."; break;
  }
  case "next": requirePhase(state, "closed"); message = "Current work order is closed. Resolve the next planned WO, then run resume activate WO-NNN <path>."; break;
  default: throw new Error(`unknown resume action: ${action}`);
}

state = fold(readEvents());
if (action !== "status") project(state);
process.stdout.write(`${message}\n`);
