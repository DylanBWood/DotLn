import { resolveOrderWorktrees } from "./order-worktrees.mjs";

// The order comes from a recorded session or branch, never a spawn prompt.
export function orderWorktreeGrants(root, order) {
  if (!/^WO-\d{3}$/.test(order ?? "")) return [];
  return resolveOrderWorktrees(root, order, { allowNoMain: true }).roots;
}
