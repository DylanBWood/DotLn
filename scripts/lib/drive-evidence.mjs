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
