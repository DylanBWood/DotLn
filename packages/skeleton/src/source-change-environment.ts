import { realpathSync, statSync } from "node:fs";
import { isAbsolute, relative, resolve, sep } from "node:path";
import { observedExecFileSync as execFileSync } from "./gate-deadlines.mjs";

import type { SourceChangeProfile } from "./execution-environment.js";

const inside = (parent: string, path: string): boolean => {
  const child = relative(parent, path);
  return (
    child !== "" &&
    child !== ".." &&
    !child.startsWith(`..${sep}`) &&
    !isAbsolute(child)
  );
};
const canonicalPath = (path: string): string => {
  if (
    !isAbsolute(path) ||
    resolve(path) !== path ||
    realpathSync(path) !== path
  )
    throw new Error("source-change environment requires canonical paths");
  return path;
};

/** Host preflight, not an OS security boundary. The host owns these paths. */
export function validateSourceChangeEnvironment(
  profile: SourceChangeProfile,
  cwd: string,
  commitMessagePath: string,
): void {
  const mount = canonicalPath(cwd);
  const parent = canonicalPath(profile.worktreeParent);
  const launchpad = canonicalPath(profile.launchpadCheckout);
  if (
    profile.profileId !== "source-change-v1" ||
    profile.mounts.length !== 1 ||
    profile.mounts[0]?.path !== mount ||
    profile.mounts[0]?.access !== "read-write" ||
    profile.writableSurfaces.length !== 1 ||
    profile.writableSurfaces[0] !== mount ||
    !statSync(mount).isDirectory() ||
    !statSync(parent).isDirectory() ||
    !statSync(launchpad).isDirectory() ||
    !inside(parent, mount) ||
    mount === launchpad ||
    inside(mount, launchpad) ||
    inside(launchpad, mount)
  )
    throw new Error("source-change worktree refused");
  const top = execFileSync("git", ["rev-parse", "--show-toplevel"], {
    cwd: mount,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout: 5_000,
  }).trim();
  if (top !== mount)
    throw new Error("source-change mount must be a Git worktree root");
  const message = canonicalPath(commitMessagePath);
  if (!inside(mount, message) || !statSync(message).isFile())
    throw new Error("source-change message must be a file inside the worktree");
}

/** Refuse unsupported native variants by their actual discovery row. */
export function sourceChangeProfile(
  input: {
    readonly worktree: string;
    readonly worktreeParent: string;
    readonly launchpadCheckout: string;
    readonly commitMessagePath: string;
  },
  requested: {
    readonly claudeTools?: "exact-allowlist" | "tools-only";
    readonly codexApproval?: "never" | "on-request";
    readonly codexHooks?: boolean;
  } = {},
): SourceChangeProfile {
  if (
    requested.claudeTools !== undefined &&
    requested.claudeTools !== "exact-allowlist"
  )
    throw new Error("source-change profile refused: C-W1 ambiguous");
  if (
    requested.codexApproval !== undefined &&
    requested.codexApproval !== "never"
  )
    throw new Error("source-change profile refused: X-U2 ambiguous");
  if (requested.codexHooks !== undefined && requested.codexHooks !== false)
    throw new Error("source-change profile refused: X-W3 unavailable");
  const profile: SourceChangeProfile = {
    profileId: "source-change-v1",
    mounts: [{ path: input.worktree, access: "read-write" }],
    writableSurfaces: [input.worktree],
    worktreeParent: input.worktreeParent,
    launchpadCheckout: input.launchpadCheckout,
  };
  validateSourceChangeEnvironment(
    profile,
    input.worktree,
    input.commitMessagePath,
  );
  return profile;
}
