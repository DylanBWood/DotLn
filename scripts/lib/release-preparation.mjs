import { docRelative } from "./config.mjs";
import {
  lstatSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, sep } from "node:path";
import { runGit, runGitPathList } from "./git.mjs";
import { json } from "./helpers.mjs";
import { containedRegularFile, workOrderAuthorityPath } from "./paths.mjs";
import {
  compareVersions,
  semver,
  strictVersionsIn,
} from "./release-records.mjs";

// The heading an order carries until its target is assigned.
export const activationPlaceholder = "(version assigned at activation)";

const dispatches = {
  active: "next",
  "ready-to-verify": "verify",
  verifying: "verify",
  "needs-fix": "fix",
  repairing: "fix",
  verified: "final review",
  "final-review": "final review",
};

// Git reports the record unmerged, or an authored resolution kept a marker
// line: an opening, closing or diff3 base marker alone is a conflict too. A
// lone ======= line is a setext heading underline, never a marker here.
// `worktree integrate`'s decision stub applies the same test.
export const decisionsConflicted = (root, path, text) =>
  runGitPathList(root, [
    "diff",
    "--name-only",
    "--diff-filter=U",
    "-z",
    "--",
    path,
  ]).length > 0 ||
  (text !== undefined && /^(?:<{7}|>{7}|\|{7})(?: |$)/m.test(text));

// Once the integration's decision stub is written, or a saved release outcome
// waits for that stub, a hand-run `prepare --integration` would retime the
// order and record it nowhere; only `worktree integrate` passes the flag in
// the states it admits. Returns the reason to refuse, or null.
export function integrationPreparationRefusal(root, workOrderId, receipt) {
  if (typeof receipt?.checkpointRef !== "string" || !receipt.checkpointRef)
    return "its pending integration names no checkpoint";
  let stubbed = false;
  try {
    stubbed = readFileSync(
      join(root, docRelative(root, "evidence", `${workOrderId}/decisions.md`)),
      "utf8",
    ).includes(`<!-- integration ${receipt.checkpointRef} -->`);
  } catch {
    // An absent or unreadable record holds no stub; the plan judges the path.
  }
  if (stubbed) return "the integration decision stub is already written";
  if (typeof receipt.release === "string" && receipt.release.trim())
    return "a saved release outcome waits for its integration decision stub";
  return null;
}

// A dangling symlink is present too: nothing is written through one.
const present = (path) => {
  try {
    lstatSync(path);
    return true;
  } catch {
    return false;
  }
};

function appendDecision(before, workOrderId, row) {
  const used = [
    ...before.matchAll(new RegExp(`${workOrderId}-D(\\d{3})`, "g")),
  ].map((match) => Number(match[1]));
  const id = `${workOrderId}-D${String(Math.max(0, ...used) + 1).padStart(3, "0")}`;
  return {
    id,
    text: `${before.trimEnd()}\n\n## ${id}\n\n\`\`\`json\n${json({ id, ...row })}\`\`\`\n`,
  };
}

// All inputs are checked before any edit. No lifecycle or publication writes.
// A missing target is assigned and a collision retimed in the heading and the
// README version claim only; the order's decisions record says why (WO-086).
// Under `integration`, `worktree integrate` records a collision in its own
// integration decision, so none is appended here.
export function planReleasePreparation(
  root,
  state,
  latest,
  date,
  { integration = false, observation = "local tags" } = {},
) {
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
  if (!Object.hasOwn(dispatches, state.phase))
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
  const paths = [authorityPath, join(root, "README.md")];
  for (const path of paths)
    if (!containedRegularFile(path, root) || realpathSync(path) !== path)
      throw new Error(
        "release prepare requires contained regular source files",
      );
  const [authority, readme] = paths.map((path) => readFileSync(path, "utf8"));
  const heading = authority.split("\n", 1)[0];
  const versions = strictVersionsIn(heading);
  const unassigned =
    versions.length === 0 && heading.trimEnd().endsWith(activationPlaceholder);
  if (!unassigned && (versions.length !== 1 || !semver(versions[0])))
    throw new Error(
      `release prepare requires exactly one strict version in the work-order heading, or the ${activationPlaceholder} placeholder`,
    );
  const previous = unassigned ? undefined : versions[0];
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
  if (claims.length !== 1 || (!unassigned && claims[0] !== previous))
    throw new Error(
      unassigned
        ? "release prepare requires one README version claim to replace"
        : "release prepare requires one README version matching the work-order target",
    );
  if (unassigned && !latest)
    throw new Error(
      "release prepare cannot assign a target without an observed release tag; assign the heading and README claim by hand",
    );
  // The order's decisions record holds any assignment or collision this
  // command records (WO-086). It is refused while conflicted in every mode,
  // since the meter reads it too, and a record created here must land
  // inside the repository.
  const decisionsPath = docRelative(
    root,
    "evidence",
    `${state.workOrderId}/decisions.md`,
  );
  const decisionsFile = join(root, decisionsPath);
  let ancestor = dirname(decisionsFile);
  while (!present(ancestor)) ancestor = dirname(ancestor);
  const contained = () => {
    try {
      const inside = realpathSync(ancestor);
      return inside.startsWith(`${realpathSync(root)}${sep}`);
    } catch {
      return false;
    }
  };
  if (
    present(decisionsFile)
      ? !containedRegularFile(decisionsFile, root)
      : !contained()
  )
    throw new Error(
      `release prepare requires ${decisionsPath} to be a contained regular file`,
    );
  // The heading's realpath rule holds for the record too: no component is a
  // symlink, so nothing is written behind a link inside the repository.
  const throughLink = () => {
    try {
      return present(decisionsFile)
        ? realpathSync(decisionsFile) !== decisionsFile
        : realpathSync(ancestor) !== ancestor;
    } catch {
      return true;
    }
  };
  if (throughLink())
    throw new Error(
      `release prepare requires ${decisionsPath} to be a contained regular file reached through no symlink`,
    );
  const recorded = present(decisionsFile)
    ? readFileSync(decisionsFile, "utf8")
    : undefined;
  if (decisionsConflicted(root, decisionsPath, recorded))
    throw new Error(
      `release prepare refuses while ${decisionsPath} has an authored conflict; resolve it, stage it with git add -- ${decisionsPath}, then rerun ${integration ? `npm run worktree -- integrate ${state.workOrderId} --continue` : "npm run release -- prepare"}. Nothing was written.`,
    );
  if (!unassigned && (!latest || compareVersions(previous, latest) > 0))
    return {
      previous,
      target: previous,
      classification,
      latest,
      assigned: false,
      decision: null,
      edits: [],
    };

  const parts = semver(latest);
  const axis = { major: 0, minor: 1, patch: 2 }[classification];
  parts[axis]++;
  for (let index = axis + 1; index < parts.length; index++) parts[index] = 0;
  const target = `v${parts.join(".")}`;
  if (!semver(target))
    throw new Error(
      "release prepare version exceeds the supported integer range",
    );
  const boundary = (version) =>
    new RegExp(
      `(?<![A-Za-z0-9._+\\-])${version.replaceAll(".", "\\.")}(?![A-Za-z0-9._+\\-])`,
      "u",
    );
  const newHeading = unassigned
    ? `${heading.trimEnd().slice(0, -activationPlaceholder.length)}(${target})`
    : heading.replace(boundary(previous), target);
  lines.splice(
    start,
    finish - start,
    block.replace(boundary(claims[0]), target),
  );

  // The one record of an assignment or a collision: a decision in the
  // order's evidence, never a product-document or README paragraph.
  const reason = unassigned
    ? {
        decision: `Assign application target ${target}, the next ${classification} above the observed release baseline ${latest}, to the heading and the README version claim.`,
        evidence: [
          `release baseline ${latest} (${observation})`,
          `${classification} classification declared in ${state.workOrderPath}`,
        ],
        rejected: [
          {
            option: "An activation-completion paragraph in the roadmap",
            reason:
              "The tag is the record and the roadmap's release history is generated from tags (WO-086); this decision keeps the base and the classification.",
          },
        ],
        reopenWhen:
          "The observed baseline or the classification changes before publication; a later collision is recorded as its own decision.",
      }
    : {
        decision: `Retime unpublished application target ${previous} to ${target}, the next ${classification} above the observed release baseline ${latest}, in the heading and the README version claim. Scope, acceptance, component versions and published tags are unchanged.`,
        evidence: [
          `release baseline ${latest} (${observation})`,
          `superseded target ${previous}`,
          `new target ${target}`,
        ],
        rejected: [
          {
            option: "A dated roadmap or README paragraph",
            reason:
              "A version collision is recorded once, as this decision (WO-086); product documents and the README carry only the version claim.",
          },
        ],
        reopenWhen:
          "A collision changes scope, acceptance, component versions or a published tag, or needs a hand step beyond this record.",
      };
  const decision =
    integration && !unassigned
      ? null
      : appendDecision(
          recorded ?? `# ${state.workOrderId} decisions\n`,
          state.workOrderId,
          {
            date,
            dispatch: `resume: ${dispatches[state.phase]}; release prepare`,
            ...reason,
          },
        );
  const edits = [
    {
      path: authorityPath,
      before: authority,
      after: newHeading + authority.slice(heading.length),
    },
    { path: paths[1], before: readme, after: lines.join("\n") },
  ];
  if (decision)
    edits.push({ path: decisionsFile, before: recorded, after: decision.text });
  return {
    previous,
    target,
    classification,
    latest,
    assigned: unassigned,
    decision: decision?.id ?? null,
    edits,
  };
}

// An edit whose `before` is undefined creates its file; it must still be absent.
export function applyReleasePreparation(plan, write = writeFileSync) {
  for (const edit of plan.edits)
    if (
      edit.before === undefined
        ? present(edit.path)
        : readFileSync(edit.path, "utf8") !== edit.before
    )
      throw new Error(
        "release preparation source changed before write; rerun preparation",
      );
  const written = [];
  try {
    for (const edit of plan.edits) {
      // Include the current file in recovery if a writer fails after truncation.
      written.push(edit);
      if (edit.before === undefined)
        mkdirSync(dirname(edit.path), { recursive: true });
      write(edit.path, edit.after);
    }
  } catch (error) {
    for (const edit of written.reverse())
      if (edit.before === undefined) rmSync(edit.path, { force: true });
      else writeFileSync(edit.path, edit.before);
    throw error;
  }
  return written.map((edit) => edit.path);
}
