#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { docPath, findLaunchpad } from "./lib/config.mjs";
import { isMainModule } from "./lib/paths.mjs";
import { json } from "./lib/helpers.mjs";
import {
  generatedArtifacts,
  checkArtifact,
  runArtifactCommand,
} from "./lib/generated-artifacts.mjs";
import { currentEvidence } from "../packages/skeleton/src/evidence-editions.mjs";

function publicationLocks(root, run) {
  const result = run(
    [process.execPath, "scripts/check-publication.mjs", "--print-locks"],
    root,
    30_000,
  );
  if (result.exitCode !== 0) return result;
  const locks = [
    ...result.output.matchAll(/^LOCK ([\w.-]+): sha256:([a-f0-9]{64})$/gmu),
  ];
  if (!locks.length)
    return {
      exitCode: 1,
      output:
        "Publication locks unavailable; repair the publication check before regenerating.",
    };
  const writes = locks.map(([, file, digest]) => {
    const path = docPath(root, "publication", file);
    const text = readFileSync(path, "utf8");
    if ((text.match(/^Source lock:.*$/gm) ?? []).length !== 1)
      throw new Error(
        `Publication lock needs one existing Source lock line: ${file}`,
      );
    return [
      path,
      text.replace(/^Source lock:.*$/m, `Source lock: \`sha256:${digest}\``),
    ];
  });
  for (const [path, text] of writes)
    if (readFileSync(path, "utf8") !== text) writeFileSync(path, text);
  return {
    exitCode: 0,
    output: "Updated the printed publication source locks.",
  };
}

async function remint(row, root, run) {
  const { readControl, branchWorkOrder, selectWorkOrder } =
    await import("./lib/control-store.mjs");
  const workOrder = selectWorkOrder(readControl(root), {
    branch: branchWorkOrder(root),
  });
  if (!workOrder)
    return {
      exitCode: 1,
      output:
        "A new evidence edition needs the selected work order; activate its authorized worktree first.",
    };
  const previous = currentEvidence(root, row.kind);
  let revision = 1,
    selection;
  do {
    selection = currentEvidence(root, row.kind, {
      workOrder,
      revision: String(revision++).padStart(3, "0"),
    });
  } while (existsSync(join(root, selection.directory)) && revision <= 1000);
  if (revision > 1000) throw new Error("No unused evidence revision remains");
  const flags = ["--edition", workOrder, "--revision", selection.revision];
  const mode =
    row.kind === "feedback" ? ["--carry", previous.directory] : ["--write"];
  const written = run(
    [process.execPath, row.file, ...mode, ...flags],
    root,
    120_000,
  );
  if (written.exitCode !== 0)
    return {
      ...written,
      output:
        (row.kind === "feedback"
          ? `Feedback carry refused. Changed judged sources require the authorized live feedback episode and a new edition.\n${written.output}`
          : written.output) +
        (existsSync(join(root, selection.directory))
          ? `\nUnselected orphan evidence revision retained: ${selection.directory}`
          : ""),
    };
  const checked = run(
    [process.execPath, row.file, "--check", ...flags],
    root,
    120_000,
  );
  if (checked.exitCode !== 0)
    return {
      ...checked,
      output: `${checked.output}\nUnselected orphan evidence revision retained: ${selection.directory}`,
    };
  const manifestPath = docPath(root, "evidence", "current.json");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  manifest.editions[row.kind] = { workOrder, revision: selection.revision };
  writeFileSync(manifestPath, json(manifest));
  return {
    exitCode: 0,
    output: `Selected ${row.kind} ${selection.label}; retained the previous edition.`,
  };
}

export async function syncArtifacts(
  root,
  {
    artifacts = generatedArtifacts(root),
    run = runArtifactCommand,
    mint = remint,
    locks = publicationLocks,
  } = {},
) {
  const inventory = [
    {
      name: "format",
      check: ["npm", "run", "format:check", "--silent"],
      write: ["npm", "run", "format", "--silent"],
      timeoutMs: 120_000,
    },
    ...artifacts,
  ];
  const rows = [];
  for (const artifact of inventory) {
    const before = checkArtifact(artifact, root, run);
    // A check that timed out read nothing: the artifact is unknown, not
    // stale, and no writer runs on an unread check.
    if (before.timedOut) {
      rows.push({
        artifact: artifact.name,
        before: "unknown",
        after: "unknown",
        action: "refused",
        reason:
          `check timed out; rerun the check before regenerating\n${before.output ?? ""}`.trim(),
      });
      continue;
    }
    if (before.exitCode === 0) {
      rows.push({
        artifact: artifact.name,
        before: "current",
        after: "current",
        action: "none",
      });
      continue;
    }
    if (!before.stale) {
      rows.push({
        artifact: artifact.name,
        before: "unknown",
        after: "unknown",
        action: "refused",
        reason:
          `check did not report stale; repair the check before regenerating\n${artifact.route ?? ""}\n${before.output ?? ""}`.trim(),
      });
      continue;
    }
    let changed;
    try {
      changed = artifact.regenerate
        ? artifact.regenerate(root, run)
        : artifact.write
          ? run(artifact.write, root, 120_000)
          : artifact.kind
            ? await mint(artifact, root, run)
            : artifact.publication
              ? locks(root, run)
              : {
                  exitCode: 1,
                  output:
                    artifact.route ??
                    "No policy-authorized writer; repair the named check.",
                };
    } catch (error) {
      changed = { exitCode: 1, output: error.message };
    }
    const after =
      changed.exitCode === 0 ? checkArtifact(artifact, root, run) : changed;
    rows.push({
      artifact: artifact.name,
      before: "stale",
      after: after.exitCode === 0 ? "current" : "stale",
      action: after.exitCode === 0 ? "regenerated" : "refused",
      ...(after.exitCode !== 0
        ? {
            reason:
              `${artifact.route ?? ""}\n${after.output || before.output}`.trim(),
          }
        : {}),
    });
  }
  return {
    exitCode: rows.some((row) => row.after !== "current") ? 1 : 0,
    rows,
  };
}

if (isMainModule(import.meta.url)) {
  try {
    if (process.argv.length !== 2) throw new Error("usage: npm run sync");
    const result = await syncArtifacts(findLaunchpad());
    console.log("artifact | before | after | action");
    for (const row of result.rows)
      console.log(
        `${row.artifact} | ${row.before} | ${row.after} | ${row.action}${row.reason ? `: ${row.reason.replace(/\s+/gu, " ")}` : ""}`,
      );
    process.exitCode = result.exitCode;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
