#!/usr/bin/env node
import { existsSync, lstatSync, readFileSync, realpathSync } from "node:fs";
import { basename, dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const run = (cwd, ...args) => {
  const result = spawnSync("git", ["-C", cwd, ...args], { encoding: "utf8" });
  if (result.status !== 0) throw new Error((result.stderr || result.stdout || `git ${args.join(" ")} failed`).trim());
  return result.stdout.trim();
};
const shellQuote = value => `'${value.replaceAll("'", `'\\''`)}'`;
const ensureClean = path => { if (run(path, "status", "--porcelain") !== "") throw new Error(`worktree is not clean: ${path}`); };
const ensureCommand = (command, guidance) => {
  const checked = spawnSync(command, ["--version"], { encoding: "utf8" });
  if (checked.status !== 0) throw new Error(`${command} is required before any remote mutation; ${guidance}`);
};
const ensureNoIgnoredMaterial = path => {
  const disposable = candidate => candidate.split("/").some(segment => segment === "node_modules" || segment === "dist") || basename(candidate) === ".DS_Store" || candidate.endsWith(".tsbuildinfo");
  const ignored = run(path, "ls-files", "--others", "--ignored", "--exclude-standard").split("\n").filter(Boolean).filter(candidate => !disposable(candidate));
  if (ignored.length > 0) throw new Error(`worktree contains ignored material and will not be removed: ${ignored[0]} (run npm run backup:intake or move it, then retry)`);
};
const containedRegularFile = (path, root) => existsSync(path) && lstatSync(path).isFile() && realpathSync(path).startsWith(`${realpathSync(root)}${sep}`);
const worktrees = () => {
  const records = run(repoRoot, "worktree", "list", "--porcelain").split("\n\n");
  return records.map(record => Object.fromEntries(record.split("\n").map(line => { const at = line.indexOf(" "); return at < 0 ? [line, true] : [line.slice(0, at), line.slice(at + 1)]; })));
};
const main = () => {
const mainItem = worktrees().find(item => item.branch === "refs/heads/main");
if (!mainItem?.worktree) throw new Error("no main-branch control-plane worktree found");
const mainPath = resolve(mainItem.worktree);

const [action, workOrderId, ...actionArgs] = process.argv.slice(2);
const workOrderPath = actionArgs[0];
if (!/^WO-[0-9]{3}$/.test(workOrderId ?? "")) throw new Error("work order id must look like WO-003");
const suffix = workOrderId.slice(workOrderId.indexOf("-") + 1);
const branch = `wo-${suffix}`;
const target = join(dirname(mainPath), `${basename(mainPath)}-wo${suffix}`);

if (action === "start") {
  if (repoRoot !== mainPath) throw new Error(`run start from the main control-plane checkout: ${mainPath}`);
  if (!workOrderPath) throw new Error("usage: worktree start WO-NNN docs/work-orders/<file>.md");
  const authorityRoot = join(mainPath, "docs/work-orders");
  const authorityPath = resolve(mainPath, workOrderPath);
  if (!authorityPath.startsWith(`${authorityRoot}${sep}`) || !containedRegularFile(authorityPath, authorityRoot) || !basename(authorityPath).startsWith(`${workOrderId}-`)) throw new Error(`invalid work-order authority path: ${workOrderPath}`);
  ensureClean(mainPath);
  if (existsSync(target)) throw new Error(`target already exists: ${target}`);
  if (run(mainPath, "branch", "--list", branch) !== "") throw new Error(`branch already exists: ${branch}`);
  run(mainPath, "fetch", "origin", "main");
  run(mainPath, "merge", "--ff-only", "origin/main");
  run(mainPath, "worktree", "add", target, "-b", branch, "origin/main");
  const activated = spawnSync("node", [join(target, "scripts/resume.mjs"), "activate", workOrderId, workOrderPath], { cwd: target, encoding: "utf8" });
  if (activated.status !== 0) throw new Error(`worktree created but resume activation failed: ${(activated.stderr || activated.stdout).trim()}`);
  process.stdout.write(`Created ${target} on ${branch}.\n${activated.stdout}Phase: active.\nNext (run manually):\n  cd ${shellQuote(target)}\n  codex\n  enter: resume: next\n`);
} else if (action === "publish") {
  const item = worktrees().find(candidate => candidate.branch === `refs/heads/${branch}`);
  if (!item?.worktree) throw new Error(`no worktree found for ${branch}`);
  const subject = resolve(item.worktree);
  ensureClean(subject);
  const status = spawnSync("node", [join(subject, "scripts/resume.mjs"), "status"], { cwd: subject, encoding: "utf8" });
  if (status.status !== 0 || !status.stdout.includes("- Phase: closed")) throw new Error(`${workOrderId} has not passed final review`);
  const titleAt = actionArgs.indexOf("--title");
  const bodyAt = actionArgs.indexOf("--body-file");
  const title = titleAt >= 0 ? actionArgs[titleAt + 1] : undefined;
  const bodyFile = bodyAt >= 0 ? actionArgs[bodyAt + 1] : undefined;
  const bodyPath = bodyFile ? resolve(subject, bodyFile) : undefined;
  if (!title || !bodyPath || !bodyPath.startsWith(`${subject}${sep}`) || !containedRegularFile(bodyPath, subject)) throw new Error("usage: worktree publish WO-NNN --title <title> --body-file <contained regular-file path>");
  const mainPackage = JSON.parse(readFileSync(join(mainPath, "package.json"), "utf8"));
  const mainHasReleaseCommand = existsSync(join(mainPath, "scripts/release.mjs")) && typeof mainPackage.scripts?.release === "string";
  ensureCommand("gh", "install and authenticate GitHub CLI, then retry publish");
  run(subject, "push", "--no-follow-tags", "-u", "origin", branch);
  const opened = spawnSync("gh", ["pr", "create", "--head", branch, "--base", "main", "--title", title, "--body-file", bodyFile], { cwd: subject, encoding: "utf8" });
  if (opened.status !== 0) throw new Error(`branch pushed but PR creation failed: ${(opened.stderr || opened.stdout).trim()}`);
  const releaseHandoff = mainHasReleaseCommand
    ? `  cd ${shellQuote(mainPath)}\n  npm run release -- close ${workOrderId} --publish`
    : `  cd ${shellQuote(mainPath)}\n  ${shellQuote(process.execPath)} ${shellQuote(join(subject, "scripts/release.mjs"))} close ${workOrderId} --publish`;
  process.stdout.write(`Pushed ${branch} and opened ${opened.stdout.trim()}\nAfter the operator merges the PR and authorizes resume: release close, run:\n${releaseHandoff}\n`);
} else if (action === "finish") {
  if (repoRoot !== mainPath) throw new Error(`run finish from the main control-plane checkout: ${mainPath}`);
  const item = worktrees().find(candidate => candidate.branch === `refs/heads/${branch}`);
  if (!item?.worktree) throw new Error(`no worktree found for ${branch}`);
  const subject = resolve(item.worktree);
  ensureClean(mainPath);
  ensureClean(subject);
  ensureNoIgnoredMaterial(subject);
  const status = spawnSync("node", [join(subject, "scripts/resume.mjs"), "status"], { cwd: subject, encoding: "utf8" });
  if (status.status !== 0 || !status.stdout.includes("- Phase: closed")) throw new Error(`${workOrderId} has not passed final review and closed`);
  run(mainPath, "fetch", "origin", "main");
  run(mainPath, "merge", "--ff-only", "origin/main");
  const merged = spawnSync("git", ["-C", mainPath, "merge-base", "--is-ancestor", branch, "origin/main"]);
  if (merged.status !== 0) throw new Error(`${branch} is not merged into origin/main; merge the PR first`);
  run(mainPath, "worktree", "remove", subject);
  const upstream = spawnSync("git", ["-C", mainPath, "rev-parse", "--verify", `${branch}@{upstream}`], { encoding: "utf8" });
  if (upstream.status === 0) run(mainPath, "branch", "--unset-upstream", branch);
  run(mainPath, "branch", "-d", branch);
  process.stdout.write(`Updated main and removed merged ${branch} worktree/branch.\n`);
} else {
  throw new Error("usage: worktree start WO-NNN <work-order-path> | worktree publish WO-NNN --title <title> --body-file <path> | worktree finish WO-NNN");
}
};

try {
  main();
} catch (error) {
  process.stderr.write(`error: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}
