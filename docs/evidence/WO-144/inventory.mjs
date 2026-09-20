// Read-only inventory. Never print raw journal rows, commands or local paths.
import { execFileSync } from "node:child_process";
import { readFileSync, realpathSync } from "node:fs";
import { basename, dirname, isAbsolute, join, relative, sep } from "node:path";
import { tmpdir } from "node:os";
import { shellWriteTargets } from "../../../packages/skeleton/dist/src/harness-command.js";
import { prospectiveRealpath } from "../../../packages/skeleton/src/gate-evidence.mjs";

const git = (...args) => execFileSync("git", args, { encoding: "utf8" }).trim();
const root = realpathSync(process.cwd());
if (root !== realpathSync(git("rev-parse", "--show-toplevel")))
  throw new Error("Run from the verified project root");
const main = git("worktree", "list", "--porcelain", "-z")
  .split("\0")[0]
  .slice("worktree ".length);
const contains = (base, path) => {
  const local = relative(base, path);
  return local !== ".." && !local.startsWith(`..${sep}`) && !isAbsolute(local);
};
const observations = [];
for (const [index, checkout] of [...new Set([main, root])].entries()) {
  const files = execFileSync(
    "rg",
    [
      "--files",
      "--hidden",
      "--no-ignore",
      join(checkout, "docs/control/local"),
    ],
    { encoding: "utf8" },
  )
    .split("\n")
    .filter((path) => /\/harness\/[^/]+\.jsonl$/.test(path));
  const summary = {
    checkout: index === 0 ? "main" : "worktree",
    journals: files.length,
    rows: 0,
    malformed: 0,
    commandFields: 0,
    toolDestinationFields: 0,
    unobservedCommands: 0,
    outsideDestinations: 0,
    unresolvedDestinations: 0,
    roleRows: {},
    byRoleAndRootKind: {},
    outsideWriteRows: 0,
    judgmentsByRoleRootAndStatus: {},
    // FINAL-001 F1: judgments made, and hooks stood down, away from the root.
    movedDirectoryJudgmentRows: 0,
    rootStandDownAdvisoryRows: 0,
  };
  for (const file of files)
    for (const line of readFileSync(file, "utf8").split("\n").filter(Boolean)) {
      let row;
      try {
        row = JSON.parse(line);
      } catch {
        summary.malformed++;
        continue;
      }
      summary.rows++;
      const role = row.role ?? "unknown";
      summary.roleRows[role] = (summary.roleRows[role] ?? 0) + 1;
      if (
        typeof row.advisory === "string" &&
        /Harness requires the verified worktree root|Hook and worktree roots disagree/.test(
          row.advisory,
        )
      )
        summary.rootStandDownAdvisoryRows++;
      if (row.outsideWrite && typeof row.outsideWrite === "object") {
        const judgment = row.outsideWrite;
        summary.outsideWriteRows++;
        if (judgment.workingDirectory === "moved")
          summary.movedDirectoryJudgmentRows++;
        // Count recorded judgments, not successful writes or unique calls.
        // Historical hooks recorded duplicates without a stable call identity.
        // Read only closed labels; never publish destinations or arbitrary input.
        const judgedRole = [
          "executor",
          "verifier",
          "reviewer",
          "release-close",
          "planner",
          "refuter",
        ].includes(judgment.role)
          ? judgment.role
          : "unknown";
        const status = ["granted", "refused", "unobserved"].includes(
          judgment.status,
        )
          ? judgment.status
          : "unknown";
        const kind = [
          "system-temp",
          "session-scratch",
          "main-intake",
          "operator-root",
        ].includes(judgment.kind)
          ? judgment.kind
          : "unclassified";
        const key = `${judgedRole}/${kind}/${status}`;
        summary.judgmentsByRoleRootAndStatus[key] =
          (summary.judgmentsByRoleRootAndStatus[key] ?? 0) + 1;
      }
      const args = row.tool_input ?? {};
      const command = args.command ?? args.cmd ?? row.command;
      let targets = [];
      if (typeof command === "string") {
        summary.commandFields++;
        targets = shellWriteTargets(command);
        if (!targets) {
          summary.unobservedCommands++;
          continue;
        }
      } else if (typeof (args.file_path ?? args.notebook_path) === "string") {
        summary.toolDestinationFields++;
        targets = [
          {
            path: args.file_path ?? args.notebook_path,
            followFinalSymlink: true,
          },
        ];
      }
      for (const target of targets) {
        // Without original cwd, a historical relative destination is unknown.
        if (!isAbsolute(target.path)) {
          summary.unresolvedDestinations++;
          continue;
        }
        let physical;
        try {
          physical =
            target.followFinalSymlink || target.path.endsWith(sep)
              ? prospectiveRealpath(target.path)
              : join(
                  prospectiveRealpath(dirname(target.path)),
                  basename(target.path),
                );
        } catch {
          summary.unresolvedDestinations++;
          continue;
        }
        if (contains(checkout, physical)) continue;
        summary.outsideDestinations++;
        const kind = contains(prospectiveRealpath(tmpdir()), physical)
          ? "system-temp"
          : contains(join(main, "docs/intake"), physical)
            ? "main-intake"
            : "ungranted";
        const key = `${role}/${kind}`;
        summary.byRoleAndRootKind[key] =
          (summary.byRoleAndRootKind[key] ?? 0) + 1;
      }
    }
  observations.push(summary);
}
console.log(
  JSON.stringify(
    {
      cutoff: new Date().toISOString(),
      scope: "retained hook journals in current and main checkout local state",
      observations,
      limitation:
        "Absent command and tool-input fields cannot establish historical destinations or effects; zero extractable targets is not zero writes. Outside-write counts are journal rows, not unique calls or executed effects; historical duplicates are retained, not guessed away.",
    },
    null,
    2,
  ),
);
