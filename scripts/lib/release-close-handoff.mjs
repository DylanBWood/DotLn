// What a release close does for the order it names, stated in the handoff the
// operator and a host's reviewer read (WO-247-D007). Each kind states the
// close's actual effect: a target kind follows the registration's release
// policy as the close resolves it, and a self kind follows the comparison the
// close makes, the order's version against the latest release the remote
// holds, through the one function both share.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { loadConfig } from "./config.mjs";
import {
  compareVersions,
  headingVersion,
  latestTagVersion,
  originTags,
} from "./release-tags.mjs";

/** A registered target's release policy as release close resolves it:
 * `declared`, or `no-release` when the registration declares none. */
export const targetReleasePolicy = (root, repositoryId) =>
  loadConfig(root).repositories[repositoryId]?.release?.policy ?? "no-release";

/** A self order's close kind from its version and the latest release the
 * remote holds: above it, or with no release yet, the close publishes the
 * tag and its Release; below it, the close records a no-release close; equal
 * to it, the close verifies and reconciles the existing release. */
export function selfCloseKind(version, latest) {
  if (version == null) return "self-undecided";
  if (latest == null) return "self-release";
  const order = compareVersions(version, latest);
  if (order > 0) return "self-release";
  return order < 0 ? "self-no-release" : "self-existing-release";
}

const REMOTE_TAGS_TIMEOUT_MS = 20000;

/** The close's kind for the order: `target-release`, `target-no-release`, a
 * self kind read as the close reads it, the order's heading and the origin's
 * tags under the checkout's own Git configuration, or `self-undecided` when
 * that reading cannot settle it (a heading without one version, an unreadable
 * authority, no origin or an unreachable remote). */
export function releaseCloseKind(
  root,
  state,
  { timeoutMs = REMOTE_TAGS_TIMEOUT_MS } = {},
) {
  if (state.repositoryId)
    return {
      kind:
        targetReleasePolicy(root, state.repositoryId) === "declared"
          ? "target-release"
          : "target-no-release",
    };
  let version = null;
  let latest = null;
  try {
    version = headingVersion(
      readFileSync(join(root, state.workOrderPath), "utf8").split("\n", 1)[0],
    );
    latest = latestTagVersion(originTags(root, { timeoutMs }));
  } catch {
    // An unreadable authority or an unreachable remote leaves the kind
    // undecided; the handoff then states the rule the close applies.
    return { kind: "self-undecided", version: null, latest: null };
  }
  return { kind: selfCloseKind(version, latest), version, latest };
}

const ONCE_WITH_TAG =
  "Run the printed --publish command once; --dry-run is optional when a prerequisite such as reachability or a foreign tag is in doubt.";
const ONCE =
  "Run the printed --publish command once; --dry-run is optional when a prerequisite such as reachability is in doubt.";

/** The handoff's effect and egress sentences for one close kind. */
export function releaseCloseHandoff({ kind, version = null, latest = null }) {
  switch (kind) {
    case "target-release":
      return {
        effect:
          "This narrowly authorizes the target's annotated tag and its matching GitHub Release; the launchpad publishes no tag, and never push main.",
        egress: `The helper needs network egress to the launchpad's and the target's remote hosts for fetch, ls-remote, the target's tag push and its Release: run it in an authorized session with egress and host approval. ${ONCE_WITH_TAG}`,
      };
    case "target-no-release":
      return {
        effect:
          "This close publishes no tag and no GitHub Release: the target's policy is no-release and the launchpad records branch records none. It fetches both bases to verify the merges, records the no-release close and removes the merged order worktree, its branch and the target worktree; never push main.",
        egress: `The helper needs network egress to the launchpad's and the target's remote hosts for fetch and ls-remote only: run it in an authorized session with egress and host approval. ${ONCE}`,
      };
    case "self-release":
      return {
        effect: `This narrowly authorizes the annotated tag ${version} and its matching GitHub Release${latest === null ? ", the first release" : `, above the latest release ${latest} the remote holds`}; never push main.`,
        egress: `The helper needs network egress to the GitHub host for fetch, ls-remote, the tag push and the Release: run it in an authorized session with egress and host approval. ${ONCE_WITH_TAG}`,
      };
    case "self-no-release":
      return {
        effect: `This close publishes no tag and no GitHub Release: the order's version ${version} is below the latest release ${latest} the remote holds, so the close records a no-release close and removes the merged order worktree and its branch; never push main.`,
        egress: `The helper needs network egress to the GitHub host for fetch and ls-remote only: run it in an authorized session with egress and host approval. ${ONCE}`,
      };
    case "self-existing-release":
      return {
        effect: `This close publishes no new tag and no new GitHub Release: the remote already holds ${version}, which the close verifies against this commit and its generated manifest and whose Release it reconciles, then removes the merged order worktree and its branch; never push main.`,
        egress: `The helper needs network egress to the GitHub host for fetch, ls-remote and the Release it reconciles: run it in an authorized session with egress and host approval. ${ONCE_WITH_TAG}`,
      };
    case "self-undecided":
      return {
        effect:
          "This close publishes the order's annotated tag and its matching GitHub Release only when that version stands above the latest release the remote holds; at or below it, the close records a no-release close or reconciles the existing release and publishes nothing new. Either way it removes the merged order worktree and its branch; never push main.",
        egress: `The helper needs network egress to the GitHub host for fetch and ls-remote, and for the tag push and the Release when one is due: run it in an authorized session with egress and host approval. ${ONCE_WITH_TAG}`,
      };
    default:
      throw new Error(`unknown release close kind: ${kind}`);
  }
}
