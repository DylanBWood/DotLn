// Retain the canonical rows before an isolated live fixture removes its trees.
export function drivenObservation(record, isRunning) {
  if (!record) return null;
  const worker = record.worker;
  return {
    recordedRunning: record.running === true,
    observedDriverAlive: isRunning(record.driverPid),
    completedAttempts: record.attempts?.length ?? 0,
    stop: record.stop ?? null,
    incomplete: record.incomplete ?? {},
    refused: Boolean(record.refused),
    writerConflict: record.writerConflict ?? null,
    // A declined close and the admitted host change, as the record keeps them
    // (WO-247): the declined item's shape and printed reason, no narrative.
    awaitingClose: record.awaitingClose ?? null,
    hostChange: record.hostChange ?? null,
    currentWorker: worker
      ? {
          id: worker.id ?? null,
          sessionId: worker.sessionId ?? null,
          role: worker.role,
          action: worker.action,
          timeoutMs: worker.timeoutMs ?? null,
          recordedRunning: worker.running === true,
          observedAlive: isRunning(worker.pid),
          lastCommand: worker.lastCommand ?? null,
          commandFailures: (worker.commandFailures ?? []).slice(-16),
        }
      : null,
  };
}

export function drivenCompletions(events) {
  return events
    .filter((row) =>
      [
        "ImplementationReady",
        "RepairCompleted",
        "VerificationCompleted",
        "FinalReviewCompleted",
      ].includes(row.type),
    )
    .map(({ type, verdict, actor, evidence }) => ({
      type,
      verdict,
      actor,
      targetGate: evidence?.targetGate ?? null,
      documentGate: evidence?.documentGate ?? null,
    }));
}

export function requireDrivenGates(completions) {
  for (const row of completions) {
    if (
      !["ImplementationReady", "RepairCompleted"].includes(row.type) &&
      row.verdict !== "pass"
    )
      continue;
    if (
      !row.targetGate?.evidenceRef ||
      !row.targetGate.treeHash ||
      !row.targetGate.repositoryId
    )
      throw new Error(`${row.type} lacks consumed target gate evidence`);
    if (
      !row.documentGate?.evidenceRef ||
      !row.documentGate.treeHash ||
      !row.documentGate.codeIdentity ||
      row.documentGate.executed !== true ||
      row.documentGate.exitCode !== 0
    )
      throw new Error(
        `${row.type} lacks consumed passing document gate evidence`,
      );
  }
}

export function requireDrivenResearch(attempts) {
  const observations = attempts.flatMap(
    (row) => row.result?.commandResults ?? row.commandResults ?? [],
  );
  for (const kind of [
    "context7-library",
    "context7-docs",
    "github-search",
    "github-read",
    "public-web",
  ])
    if (
      !observations.some(
        (row) =>
          row.kind === kind &&
          row.status === "completed" &&
          (row.exitCode === null || row.exitCode === 0),
      )
    )
      throw new Error(
        `Native research qualification lacks a successful ${kind} observation`,
      );
}

/** The source identity a live receipt carries, compared at completion with the
 * handoff identity: `source` is the authoring checkout's gate code identity at
 * the export the fixture ran, and `fixtureTrees` are the fixture checkouts'
 * own hashes, provenance that never equals the source's (WO-247). */
export function receiptCodeIdentity({ source, fixtureTrees }) {
  if (typeof source?.codeIdentity !== "string" || !source.codeIdentity)
    throw new Error("a live receipt's source code identity must be recorded");
  return {
    schemaVersion: 1,
    source: {
      codeIdentity: source.codeIdentity,
      head: source.head ?? null,
      root: "authoring-checkout",
      observedAt: source.observedAt,
      method:
        "gateCodeIdentity of the authoring checkout at the export the fixture ran: tracked and untracked source bytes, excluding documents, reports and generated projections",
    },
    fixtureTrees: fixtureTrees ?? null,
  };
}
