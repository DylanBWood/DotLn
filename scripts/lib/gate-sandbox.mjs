import { closeSync, openSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { isAbsolute, join, resolve } from "node:path";
import { randomUUID } from "node:crypto";

/** The suite declaration an environmental, outside-only cause carries. */
export const OUTSIDE_SANDBOX = "outside-sandbox";
/** A partial run never shares the product gate's identity. */
export const INSIDE_SANDBOX_CHECK = "npm test -- --inside-sandbox";

const gitDirectory = (repo) => {
  const run = spawnSync("git", ["rev-parse", "--git-dir"], {
    cwd: repo,
    encoding: "utf8",
  });
  const path = run.status === 0 ? run.stdout.trim() : "";
  return path ? (isAbsolute(path) ? path : resolve(repo, path)) : null;
};

// A marker names the harness that launched the run. `CLAUDECODE` reaches
// sandboxed and unsandboxed commands alike and `CODEX_SANDBOX` marks a
// Seatbelt-spawned process, so neither establishes a sandbox in force by
// itself: the denied write to the path each sandbox protects decides.
export const sandboxMarkers = [
  {
    id: "claude-code",
    env: "CLAUDECODE",
    deniedDirectory: (repo) => join(repo, ".claude/hooks"),
  },
  {
    id: "codex-cli",
    env: "CODEX_SANDBOX",
    deniedDirectory: gitDirectory,
  },
];

/** Seatbelt answers EPERM, a mode or ACL EACCES, a read-only bind mount EROFS. */
export const deniedWriteCode = (code) =>
  ["EPERM", "EACCES", "EROFS"].includes(code);

/**
 * One exclusive create in the named directory; a created file is removed.
 * Every other outcome, including a removal the host refuses, is not a denial.
 */
export function probeDeniedWrite(directory, { open = openSync } = {}) {
  if (!directory) return { path: null, denied: false, code: "no-path" };
  const path = join(directory, `.dotln-sandbox-probe-${randomUUID()}`);
  try {
    closeSync(open(path, "wx", 0o600));
  } catch (error) {
    return {
      path: directory,
      denied: deniedWriteCode(error.code),
      code: error.code ?? "unknown",
    };
  }
  try {
    rmSync(path, { force: true });
  } catch {
    return {
      path: directory,
      denied: false,
      code: "written-unremoved",
      left: path,
    };
  }
  return { path: directory, denied: false, code: "written" };
}

/**
 * An unrecognized sandbox fails open: no marker, a missing probe directory, a
 * write that succeeds and a probe that throws all report a sandbox that is not
 * in force. Every marker present is probed, because one harness can inherit
 * another's marker; the first denied probe is the one reported.
 */
export function detectGateSandbox(
  repo,
  { env = process.env, markers = sandboxMarkers } = {},
) {
  try {
    const probes = markers
      .filter((row) => env[row.env])
      .map((row) => ({
        marker: row.id,
        probe: probeDeniedWrite(row.deniedDirectory(repo)),
      }));
    if (!probes.length) return { marker: null, inForce: false };
    const observed = probes.find((row) => row.probe.denied) ?? probes[0];
    return { ...observed, inForce: observed.probe.denied };
  } catch (error) {
    return {
      marker: null,
      inForce: false,
      probe: { path: null, denied: false, code: error.code ?? "probe-failed" },
    };
  }
}

export const outsideOnly = (selected) =>
  selected.filter((row) => row.needs === OUTSIDE_SANDBOX);

/** `insideCommand` is omitted when the selection leaves nothing to run inside. */
export function sandboxRefusal(sandbox, suites, outsideCommand, insideCommand) {
  const names = suites.map((row) => row.name).join(", ");
  return `Refused before any suite ran: this run carries the ${sandbox.marker} marker and a write to ${sandbox.probe.path} is denied (${sandbox.probe.code}), so it is inside a harness sandbox, and ${names} ${suites.length === 1 ? "needs" : "need"} the outside (needs: ${OUTSIDE_SANDBOX}). Run outside the sandbox: ${outsideCommand}.${insideCommand ? ` To run only the remaining suites here as a partial result that is never product-gate evidence: ${insideCommand}` : ""}`;
}
