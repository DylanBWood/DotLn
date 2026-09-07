import { readFileSync, realpathSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { runGit } from "./git.mjs";
import { containedRegularFile, workOrderAuthorityPath } from "./paths.mjs";
import {
  compareVersions,
  semver,
  strictVersionsIn,
} from "./release-records.mjs";

// All inputs are checked before any edit. No lifecycle or publication writes.
export function planReleasePreparation(root, state, latest, date) {
  if (
    realpathSync(runGit(root, ["rev-parse", "--show-toplevel"])) !==
    realpathSync(root)
  )
    throw new Error("release prepare requires the Git root");
  if (
    !/^WO-\d{3}$/.test(state.workOrderId ?? "") ||
    runGit(root, ["branch", "--show-current"]) !==
      state.workOrderId.toLowerCase()
  )
    throw new Error("release prepare requires the selected wo-NNN worktree");
  if (
    ![
      "active",
      "ready-to-verify",
      "verifying",
      "needs-fix",
      "repairing",
      "verified",
      "final-review",
    ].includes(state.phase)
  )
    throw new Error("release prepare requires an unpublished, open work order");
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    new Date(date).toISOString().slice(0, 10) !== date
  )
    throw new Error("release prepare requires a valid UTC date");
  if (latest !== undefined && !semver(latest))
    throw new Error("release prepare requires a strict latest tag version");
  const authorityPath = workOrderAuthorityPath(
    root,
    state.workOrderId,
    state.workOrderPath,
  );
  const paths = [
    authorityPath,
    join(root, "README.md"),
    join(root, "docs/product/06-roadmap.md"),
  ];
  for (const path of paths)
    if (!containedRegularFile(path, root) || realpathSync(path) !== path)
      throw new Error(
        "release prepare requires contained regular source files",
      );
  const [authority, readme, roadmap] = paths.map((path) =>
    readFileSync(path, "utf8"),
  );
  const heading = authority.split("\n", 1)[0];
  const versions = strictVersionsIn(heading);
  if (versions.length !== 1 || !semver(versions[0]))
    throw new Error(
      "release prepare requires exactly one strict version in the work-order heading",
    );
  const previous = versions[0];
  const declarations = [
    ...authority.matchAll(/^\*\*Release classification:\*\*[^\n]*$/gm),
  ];
  const declared = declarations[0]?.[0].match(
    /^\*\*Release classification:\*\*\s*(patch|minor|major)\./,
  );
  if (declarations.length !== 1 || !declared)
    throw new Error(
      "release prepare requires one explicit patch, minor, or major Release classification",
    );
  const classification = declared[1];
  const begin = "<!-- DOTLN-RELEASE-BEGIN -->";
  const end = "<!-- DOTLN-RELEASE-END -->";
  const lines = readme.split("\n");
  const markers = lines.filter((line) =>
    /DOTLN-RELEASE-(?:BEGIN|END)/.test(line),
  );
  if (markers.length !== 2 || markers[0] !== begin || markers[1] !== end)
    throw new Error(
      "release prepare requires one exact ordered README release block",
    );
  const start = lines.indexOf(begin) + 1;
  const finish = lines.indexOf(end);
  const block = lines.slice(start, finish).join("\n");
  const claims = strictVersionsIn(block);
  if (claims.length !== 1 || claims[0] !== previous)
    throw new Error(
      "release prepare requires one README version matching the work-order target",
    );
  if (!/^## Release boundary$/m.test(roadmap))
    throw new Error(
      "release prepare requires the roadmap Release boundary section",
    );
  if (!latest || compareVersions(previous, latest) > 0)
    return { previous, target: previous, classification, latest, edits: [] };

  const parts = semver(latest);
  const axis = { major: 0, minor: 1, patch: 2 }[classification];
  parts[axis]++;
  for (let index = axis + 1; index < parts.length; index++) parts[index] = 0;
  const target = `v${parts.join(".")}`;
  if (!semver(target))
    throw new Error(
      "release prepare version exceeds the supported integer range",
    );
  const versionPattern = new RegExp(
    `(?<![A-Za-z0-9._+\\-])${previous.replaceAll(".", "\\.")}(?![A-Za-z0-9._+\\-])`,
    "u",
  );
  const newHeading = heading.replace(versionPattern, target);
  lines.splice(start, finish - start, block.replace(versionPattern, target));
  const note = `**${state.workOrderId} collision retiming (${date}):** unpublished target \`${previous}\` is superseded by \`${target}\` under the existing ${classification} classification because the observed release baseline is \`${latest}\`. Scope, acceptance, component versions, and published tags are unchanged by this retiming.\n`;
  const activation = new RegExp(
    `^\\*\\*${state.workOrderId} activation completion[^\\n]*(?:\\n(?!\\n)[^\\n]+)*\\n?`,
    "m",
  ).exec(roadmap);
  const newRoadmap = activation
    ? roadmap.slice(0, activation.index + activation[0].length).trimEnd() +
      "\n\n" +
      note +
      roadmap.slice(activation.index + activation[0].length)
    : roadmap.replace(
        /^## Release boundary\n/m,
        `## Release boundary\n\n${note}`,
      );
  const contents = [
    newHeading + authority.slice(heading.length),
    lines.join("\n"),
    newRoadmap,
  ];
  return {
    previous,
    target,
    classification,
    latest,
    edits: paths.map((path, index) => ({
      path,
      before: [authority, readme, roadmap][index],
      after: contents[index],
    })),
  };
}

export function applyReleasePreparation(plan, write = writeFileSync) {
  for (const edit of plan.edits)
    if (readFileSync(edit.path, "utf8") !== edit.before)
      throw new Error(
        "release preparation source changed before write; rerun preparation",
      );
  const written = [];
  try {
    for (const edit of plan.edits) {
      // Include the current file in recovery if a writer fails after truncation.
      written.push(edit);
      write(edit.path, edit.after);
    }
  } catch (error) {
    for (const edit of written.reverse()) writeFileSync(edit.path, edit.before);
    throw error;
  }
}
