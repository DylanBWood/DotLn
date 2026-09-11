import {
  constants,
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  realpathSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join, resolve, sep } from "node:path";
import { runGitPathList } from "./git.mjs";

const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
function contained(root, path) {
  const base = realpathSync(root),
    absolute = resolve(root, path);
  if (!absolute.startsWith(base + sep))
    throw new Error("Intake destination must remain within its main checkout");
  let parent = existsSync(absolute) ? absolute : dirname(absolute);
  while (!existsSync(parent)) parent = dirname(parent);
  const physical = realpathSync(parent);
  if (physical !== base && !physical.startsWith(base + sep))
    throw new Error("Intake reconciliation refuses a symlink escape");
  if (
    existsSync(absolute) &&
    (!lstatSync(absolute).isFile() || lstatSync(absolute).isSymbolicLink())
  )
    throw new Error("Intake destination is not a regular file");
  return absolute;
}

/** Copy ignored single-copy intake into main, retaining source until teardown.
 * Existing bytes win their path. Collisions preserve both under a stable suffix.
 * Planning and dry runs do no mkdir, Git mutation or file write.
 */
export function reconcileIntake(
  source,
  main,
  workOrder,
  { dryRun = false } = {},
) {
  if (!/^WO-\d{3}$/.test(workOrder))
    throw new Error("Intake reconciliation needs its work order");
  source = realpathSync(source);
  main = realpathSync(main);
  if (source === main) return { workOrder, dryRun, files: [], bytes: 0 };
  const paths = runGitPathList(source, [
    "ls-files",
    "-z",
    "--others",
    "--ignored",
    "--exclude-standard",
    "--",
    "docs/intake",
  ]);
  const used = new Map();
  const files = paths.map((path) => {
    const from = contained(source, path),
      bytes = readFileSync(from),
      sha256 = digest(bytes);
    let destination = path,
      ordinal = 0;
    for (;;) {
      const target = contained(main, destination);
      const reserved = used.get(destination);
      if (
        (!reserved && !existsSync(target)) ||
        reserved === sha256 ||
        (existsSync(target) && readFileSync(target).equals(bytes))
      )
        break;
      destination = `${path}.from-${workOrder}${ordinal ? `-${sha256.slice(0, 16)}${ordinal > 1 ? `-${ordinal}` : ""}` : ""}`;
      ordinal++;
    }
    used.set(destination, sha256);
    return {
      source: path,
      destination,
      bytes: bytes.length,
      sha256,
      disposition: existsSync(join(main, destination))
        ? "identical"
        : destination === path
          ? "copied"
          : "collision-preserved",
    };
  });
  if (!dryRun)
    for (const row of files) {
      const from = contained(source, row.source),
        to = contained(main, row.destination);
      if (digest(readFileSync(from)) !== row.sha256)
        throw new Error(
          "Intake changed during reconciliation; source retained",
        );
      if (!existsSync(to)) {
        mkdirSync(dirname(to), { recursive: true });
        copyFileSync(from, to, constants.COPYFILE_EXCL);
      }
      if (!readFileSync(from).equals(readFileSync(to)))
        throw new Error(
          "Intake reconciliation byte proof failed; source retained",
        );
    }
  return {
    workOrder,
    dryRun,
    files,
    bytes: files.reduce((sum, row) => sum + row.bytes, 0),
  };
}

export function renderIntakeReconciliation(receipt) {
  return (
    [
      `Intake reconciliation${receipt.dryRun ? " preview" : " receipt"}: ${receipt.files.length} files, ${receipt.bytes} bytes; source retained until worktree removal.`,
      ...receipt.files.map(
        (row) =>
          `  ${row.source} -> ${row.destination}: ${row.disposition}, ${row.bytes} bytes, sha256:${row.sha256}`,
      ),
    ].join("\n") + "\n"
  );
}
