import { existsSync } from "node:fs";
import { parseWorktrees, primaryWorktree, runGit } from "./git.mjs";
import {
  directoryIdentity,
  targetWorktreeForOrder,
} from "./target-worktrees.mjs";

// A target worktree's reservation lives under the runtime its hooks load;
// every other checkout keeps its own.
export const runtimeOf = (checkout, trees) =>
  trees.present && trees.target && checkout === trees.cwd
    ? trees.target.runtimeRoot
    : checkout;

// A phase writes in its launchpad and, for a target order, the target worktree.
export const phaseRoots = ({ launchpad, cwd }, trees) =>
  [...new Set([launchpad, cwd])].map((checkout) => [
    checkout,
    runtimeOf(checkout, trees),
  ]);

// Routing and grants share the same physical registry binding. Missing paths
// are metadata so status can still recognize a completed release close.
export function resolveOrderWorktrees(
  root,
  id,
  { allowNoMain = false, worktrees = parseWorktrees(root) } = {},
) {
  if (!/^WO-\d{3}$/.test(id ?? "")) throw new Error("drive requires WO-NNN");
  let main;
  try {
    const entry = worktrees.find((row) => row.branch === "refs/heads/main");
    if (!entry?.worktree)
      throw new Error("no main-branch control-plane worktree found");
    main = directoryIdentity(entry.worktree);
  } catch (error) {
    if (!allowNoMain) throw error;
    main = directoryIdentity(primaryWorktree(root));
  }
  const branch = `wo-${id.slice(3)}`;
  const registered = worktrees.find(
    (row) => row.branch === `refs/heads/${branch}`,
  )?.worktree;
  const launchpad =
    registered && existsSync(registered) ? directoryIdentity(registered) : main;
  const target =
    targetWorktreeForOrder(launchpad, id) ?? targetWorktreeForOrder(main, id);
  if (
    target &&
    ((registered && directoryIdentity(target.launchpad) !== launchpad) ||
      target.branch !== branch)
  )
    throw new Error(
      "target registry names a different order launchpad or branch",
    );
  const present = Boolean(
    registered &&
    existsSync(registered) &&
    (!target || existsSync(target.target)),
  );
  const cwd = present && target ? directoryIdentity(target.target) : launchpad;
  if (
    present &&
    target &&
    runGit(cwd, ["symbolic-ref", "--short", "HEAD"]) !== branch
  )
    throw new Error("target worktree branch differs from its registry");
  return {
    main,
    launchpad,
    cwd,
    target,
    present,
    roots: present ? [...new Set([launchpad, cwd])] : [],
  };
}
