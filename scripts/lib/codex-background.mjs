// Codex's command line starts a background server of its own (a daemon, the
// server it keeps and the server's helpers) and leaves it running when the
// session that started it ends. On a host where Codex is run through this
// kit's sessions, what an ended session leaves behind is the kit's to close:
// nothing else does, and the operator should not have to. The kit closes it
// where a worker it launched on Codex ends and, for a launch that ended
// some other way, at the next lifecycle dispatch from another host; and
// only when no Codex process of any other kind is alive, since any of those
// may be using the server.
import { execFileSync } from "node:child_process";
import { lstatSync, realpathSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { dirname, join, resolve, sep } from "node:path";

/** The name of the record every temporary root the kit makes holds; the
 * temporary-root module owns it, and a case holds the two equal. This
 * module is loaded by the lifecycle command in fixtures that copy the
 * scripts alone, so it imports nothing from a package. */
export const TEMPORARY_ROOT_RECORD = ".dotln-owner.json";

/** Whether a directory stands in a temporary root: under a directory that
 * holds the kit's temporary-root record, or under the system's temporary
 * directory. A fixture's repository does and a project's checkout does
 * not, and that is what keeps a fixture's dispatch, which runs with the
 * session's variables removed, from reaching the host's processes.
 * @param {string} directory @param {string} [temporary] */
export function inTemporaryRoot(directory, temporary = tmpdir()) {
  const real = (path) => {
    try {
      return realpathSync(path);
    } catch {
      return resolve(path);
    }
  };
  const at = real(directory);
  const base = real(temporary);
  if (at === base || at.startsWith(base.endsWith(sep) ? base : `${base}${sep}`))
    return true;
  for (let current = at; ; current = dirname(current)) {
    try {
      if (lstatSync(join(current, TEMPORARY_ROOT_RECORD))) return true;
    } catch {
      // No record here, or a directory that cannot be read: look higher.
    }
    if (dirname(current) === current) return false;
  }
}

/** The process table as `{pid, ppid, command}` rows, or none where it cannot
 * be read. `command` is the whole command line.
 * @returns {{pid: number, ppid: number, command: string}[]} */
export function processCommands({ execFile = execFileSync } = {}) {
  let output;
  try {
    // The command line is last: ps cuts it short when a column follows.
    output = execFile("ps", ["-A", "-o", "pid=,ppid=,command="], {
      encoding: "utf8",
      timeout: 3000,
      maxBuffer: 16 * 1024 * 1024,
    });
  } catch {
    return [];
  }
  return output.split("\n").flatMap((line) => {
    const match = /^\s*(\d+)\s+(\d+)\s+(.+)$/u.exec(line);
    return match
      ? [{ pid: Number(match[1]), ppid: Number(match[2]), command: match[3] }]
      : [];
  });
}

/** The recognized Codex background-server processes under an orphaned
 * daemon, the daemon first, given that no other Codex process is alive.
 * An installation supplies both servers and live command lines: its
 * location alone never establishes a process's role. Unrecognized roles
 * or parent chains inside that installation stop cleanup too.
 * @param {{pid: number, ppid: number, command: string}[]} rows
 * @param {string} [home] */
export function leftoverCodexServers(rows, home = homedir()) {
  const packages = `${join(home, ".codex/packages/app-server-daemon")}/`;
  const installed = rows.filter((row) => row.command.startsWith(packages));
  if (!installed.length) return [];
  // These are the three observed background roles. ps prints a command
  // line, not shell source; anything outside these literal forms stays
  // unclassified. In particular, an interactive command, exec, a new
  // subcommand or a helper started by a live CLI is not a leftover.
  const roles = installed.map((row) => {
    const match =
      /^(releases\/[^/\s]+\/bin\/)(codex|codex-code-mode-host) (.+)$/u.exec(
        row.command.slice(packages.length),
      );
    const [, release, executable, args] = match ?? [];
    const role =
      executable === "codex" && args === "app-server daemon pid-update-loop"
        ? "daemon"
        : executable === "codex" &&
            /^app-server --listen unix:\/\/\S*(?: --analytics-default-enabled)?$/u.test(
              args,
            )
          ? "server"
          : executable === "codex-code-mode-host" &&
              args === "--listen grpc+stdio://"
            ? "helper"
            : undefined;
    return { row, role, release };
  });
  const daemons = roles.filter(
    ({ row, role }) => role === "daemon" && row.ppid === 1,
  );
  const childrenOf = (role, parents) =>
    roles.filter(
      (child) =>
        child.role === role &&
        parents.some(
          (parent) =>
            parent.row.pid === child.row.ppid &&
            parent.release === child.release,
        ),
    );
  const servers = childrenOf("server", daemons);
  const helpers = childrenOf("helper", servers);
  const recognized = new Set(
    [...daemons, ...servers, ...helpers].map(({ row }) => row),
  );
  if (installed.some((row) => !recognized.has(row))) return [];
  // The program is the command line up to its first argument. A Codex
  // program is one named codex, or codex and a suffix, in any case; the
  // Codex application's own programs stand inside its bundle.
  const isCodex = (command) =>
    /(?:^|\/)codex(?:-[\w-]+)?(?: |$)/iu.test(command) ||
    /\/Codex[^/]*\.app\//u.test(command);
  const others = rows.filter(
    (row) => !row.command.startsWith(packages) && isCodex(row.command),
  );
  if (others.length) return [];
  // The daemon is the one no other server process started; ending it first
  // keeps it from starting the server again.
  return [
    ...daemons.map(({ row }) => row),
    ...installed.filter((row) => row.ppid !== 1),
  ];
}

/** Ends each leftover Codex background-server process and says what was
 * ended, as one line for a dispatch's briefing, or nothing where there was
 * none. It does nothing for a repository in a temporary root or inside a
 * gate or a gate's child: fixtures dispatch constantly and must not reach
 * the host's processes. It does nothing under a Codex host, whose own
 * session is using the server. It never throws: a dispatch or a worker's
 * return does not fail on a process that could not be ended.
 * @param {{repository?: string, env?: NodeJS.ProcessEnv, rows?: {pid: number, ppid: number, command: string}[], home?: string, temporary?: string, kill?: (pid: number) => void}} [options] */
export function closeLeftoverCodexServers({
  repository = process.cwd(),
  env = process.env,
  rows,
  home = homedir(),
  temporary = tmpdir(),
  kill = (pid) => process.kill(pid, "SIGTERM"),
} = {}) {
  try {
    if (env.CODEX_THREAD_ID || env.DOTLN_GATE_CHILD || env.DOTLN_TEMP_GATE)
      return "";
    if (inTemporaryRoot(repository, temporary)) return "";
    const closed = [];
    for (const row of leftoverCodexServers(rows ?? processCommands(), home)) {
      try {
        kill(row.pid);
        closed.push(row.pid);
      } catch {
        // Already gone, or not this user's to end: nothing to report.
      }
    }
    return closed.length
      ? `Closed ${closed.length} Codex background-server process${closed.length === 1 ? "" : "es"} that an ended Codex session left running (${closed.join(", ")}); no Codex session was alive to use ${closed.length === 1 ? "it" : "them"}.`
      : "";
  } catch {
    return "";
  }
}
