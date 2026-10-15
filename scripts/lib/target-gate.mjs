import { createHash, randomUUID } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { loadConfig, docPath } from "./config.mjs";
import { runGit } from "./git.mjs";
import { HOST_GIT_READ } from "./github-repository.mjs";
import {
  targetGateCommand,
  targetWorktreeForOrder,
} from "./target-worktrees.mjs";
import {
  checksPath,
  gateTreeHash,
  recordGateChecks,
  readGateChecks,
} from "./gate-evidence.mjs";

export function targetGateDeclaration(root, state) {
  const repository = loadConfig(root).repositories[state.repositoryId];
  if (!repository?.gate)
    throw new Error(
      `repositories.${state.repositoryId}.gate is missing; declare the target's commands, plain and review selections`,
    );
  const entry = targetWorktreeForOrder(root, state.workOrderId);
  if (
    !entry ||
    entry.repositoryId !== state.repositoryId ||
    entry.baseCommit !== state.baseCommit
  )
    throw new Error(
      `${state.workOrderId}: target worktree registry differs from the activation`,
    );
  return { repository, entry, gate: repository.gate };
}

const head = (target) =>
  runGit(target, [...HOST_GIT_READ, "rev-parse", "HEAD"]);
export const gateCommandsHash = (gate, names) =>
  createHash("sha256")
    .update(JSON.stringify(names.map((name) => [name, gate.commands[name]])))
    .digest("hex");
const fields = (row, commit) => ({
  repositoryId: row.repositoryId,
  commit,
  treeHash: row.treeHash,
  selection: row.selection,
  names: row.names,
  durationMs: row.durationMs,
  evidenceRef: row.evidenceRef,
  recordedAt: row.recordedAt,
});

// The one printer of the launchpad-qualified gate command, shared with the
// briefings, so every rerun remedy reads the same.
const rerunCommand = (root, state, selection) =>
  targetGateCommand(root, state.workOrderId, selection);

/**
 * Every row in the launchpad's gate index and its check-history archives. A
 * file there that cannot be read or parsed, or that holds anything but a list
 * of row objects, refuses naming the index: the runner records through the
 * same read, so the damaged file is moved aside before the gate runs again.
 */
function indexedRows(root, state, selection) {
  const index = relative(root, checksPath(root));
  // check-history mirrors the archive directory gate-evidence.mjs owns beside
  // the index; that module does not export its path.
  const refusal = () =>
    new Error(
      `${state.repositoryId} ${selection} target gate index cannot be read: ${index} or an archive in ${dirname(index)}/check-history is unreadable or malformed; move the damaged file aside, then run ${rerunCommand(root, state, selection)}`,
    );
  let rows;
  try {
    rows = readGateChecks(root);
  } catch {
    // readGateChecks's own read and parse errors name no launchpad-relative
    // path.
    throw refusal();
  }
  if (
    !rows.every(
      (row) => row !== null && typeof row === "object" && !Array.isArray(row),
    )
  )
    throw refusal();
  return rows;
}

/** A newer failed run at the same bytes defeats an older passing run. */
export function targetGateEvidence(root, state, selection = "plain", commit) {
  const { gate, entry } = targetGateDeclaration(root, state);
  const treeHash = gateTreeHash(entry.target);
  const rows = indexedRows(root, state, selection).filter(
    (row) =>
      row.checkId === `target:${state.repositoryId}` &&
      row.repositoryId === state.repositoryId &&
      (selection !== "review" || row.selection === "review") &&
      Array.isArray(row.names) &&
      row.commandsHash === gateCommandsHash(gate, row.names) &&
      gate[selection].every((name) => row.names.includes(name)),
  );
  const row = rows
    .filter((candidate) => candidate.treeHash === treeHash)
    .at(-1);
  const cause = !row
    ? rows.length
      ? "stale"
      : "missing"
    : row.executed !== true || row.exitCode !== 0
      ? "failed"
      : undefined;
  if (cause)
    throw new Error(
      `${state.repositoryId} ${selection} target gate is ${cause} at tree ${treeHash}; run ${rerunCommand(root, state, selection)}`,
    );
  return fields(row, commit ?? head(entry.target));
}

export async function runTargetGate(
  root,
  state,
  selection = "plain",
  { log = console.log } = {},
) {
  const { repository, entry, gate } = targetGateDeclaration(root, state);
  if (!["plain", "review"].includes(selection))
    throw new Error(`unknown target gate selection ${selection}`);
  const { boundedCommand } = await import("./bounded-command.mjs");
  const treeHash = gateTreeHash(entry.target),
    commit = head(entry.target);
  const names = [...gate[selection]],
    rows = [],
    runId = randomUUID();
  for (const name of names) {
    const command = gate.commands[name];
    const commandTree = gateTreeHash(entry.target),
      commandCommit = head(entry.target);
    const result = await boundedCommand(["--", ...command.argv], root, {
      cwd: entry.target,
      timeoutMs: command.timeoutMs,
      report: () => {},
      output: () => {},
    });
    const changed =
      gateTreeHash(entry.target) !== commandTree ||
      head(entry.target) !== commandCommit;
    const row = {
      checkId: `target:${repository.id}:${name}`,
      repositoryId: repository.id,
      treeHash: commandTree,
      commit: commandCommit,
      selection,
      names: [name],
      commandsHash: gateCommandsHash(gate, [name]),
      executed: result.executed,
      exitCode: changed ? 1 : (result.exitCode ?? 1),
      durationMs: result.durationMs,
      evidenceRef: `target-gate:${runId}:${name}`,
      recordedAt: new Date().toISOString(),
    };
    if (result.output) {
      const hash = createHash("sha256").update(result.output).digest("hex");
      const file = docPath(
        root,
        "control",
        "local/harness/check-output",
        `${hash}.log`,
      );
      mkdirSync(dirname(file), { recursive: true, mode: 0o700 });
      writeFileSync(file, result.output, { mode: 0o600 });
      row.outputRef = relative(root, file);
    }
    rows.push(row);
    log(
      `${row.exitCode === 0 && row.executed ? "PASS" : "FAIL"} target ${repository.id} ${name} (${row.durationMs} ms)${changed ? ": command changed target bytes or HEAD" : ""}${row.exitCode !== 0 || !row.executed ? `; ${row.outputRef ? `output: ${join(root, row.outputRef)}` : "command produced no output"}` : ""}`,
    );
  }
  const passed =
    rows.every((row) => row.executed && row.exitCode === 0) &&
    gateTreeHash(entry.target) === treeHash &&
    head(entry.target) === commit;
  const row = {
    checkId: `target:${repository.id}`,
    repositoryId: repository.id,
    treeHash,
    commit,
    selection,
    names,
    commandsHash: gateCommandsHash(gate, names),
    executed: rows.every((row) => row.executed),
    exitCode: passed ? 0 : 1,
    durationMs: rows.reduce((sum, row) => sum + row.durationMs, 0),
    evidenceRef: `target-gate:${runId}`,
    recordedAt: new Date().toISOString(),
  };
  recordGateChecks(root, [...rows, row]);
  log(
    `${passed ? "PASS" : "FAIL"} target ${repository.id} ${selection} at ${commit} (${row.durationMs} ms)`,
  );
  return row;
}
