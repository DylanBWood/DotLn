import { readFileSync } from "node:fs";
import { join } from "node:path";
import { TOOL_ROOT } from "./config.mjs";
import { spawnGit } from "./git.mjs";

// The grammar the kit declares: `^major.minor.patch` alternatives joined by
// `||`. A caret at major 1 or above admits that major from the named floor.
// Any other range is refused by name, because a reader this small must not
// guess at semantics it does not implement.
const ALTERNATIVE = /^\^([1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/u;
// `process.version`'s shape. A prerelease tail parses so its refusal can name
// the range. It never satisfies a caret here, because the field names lines a
// gate has passed on; npm's looser engine check admits 24.16.0-rc.1.
const VERSION =
  /^v?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(-[0-9A-Za-z.-]+)?$/u;

/** A package.json's `engines.node`. A missing or null field is undefined, which
 * npm also reads as no constraint, and so is a missing file, which declares
 * nothing; a file that cannot be read is null, which the judgment refuses,
 * because it is no claim that nothing is declared. A leading byte-order mark
 * is skipped, as npm skips it. */
export function declaredNodeRange(root) {
  try {
    const text = readFileSync(join(root, "package.json"), "utf8");
    return JSON.parse(text.replace(/^\uFEFF/u, "")).engines?.node ?? undefined;
  } catch (error) {
    return error.code === "ENOENT" ? undefined : null;
  }
}

/** Judges a Node version string against a declared range. `message` names both
 * the range and the version it read, so the refusal alone says what to change. */
export function judgeNodeRuntime(version, range) {
  if (range === undefined)
    return {
      admitted: true,
      message:
        "Node runtime not judged: package.json declares no engines.node.",
    };
  const unaffected = "node scripts/bootstrap.mjs is unaffected.";
  if (range === null)
    return {
      admitted: false,
      message: `package.json could not be read, so Node ${JSON.stringify(version)} cannot be judged against its engines.node. Repair the file; ${unaffected}`,
    };
  const alternatives =
    typeof range === "string"
      ? range.split("||").map((word) => ALTERNATIVE.exec(word.trim()))
      : [null];
  if (alternatives.includes(null))
    return {
      admitted: false,
      message: `package.json engines.node reads ${JSON.stringify(range)}, which is not ^major.minor.patch alternatives joined by ||, so Node ${JSON.stringify(version)} cannot be judged. Declare the range in that form; ${unaffected}`,
    };
  const running = VERSION.exec(version);
  if (!running)
    return {
      admitted: false,
      message: `Node version ${JSON.stringify(version)} cannot be read as major.minor.patch, so it cannot be judged against package.json engines.node ${range}. Run under a Node that range admits; ${unaffected}`,
    };
  const [major, minor, patch] = running.slice(1, 4).map(Number);
  const admitted =
    !running[4] &&
    alternatives.some((alternative) => {
      const [floorMajor, floorMinor, floorPatch] = alternative
        .slice(1, 4)
        .map(Number);
      return (
        major === floorMajor &&
        (minor > floorMinor || (minor === floorMinor && patch >= floorPatch))
      );
    });
  return admitted
    ? {
        admitted,
        message: `Node runtime ${version} is inside package.json engines.node ${range}.`,
      }
    : {
        admitted,
        message: `Node runtime ${version} is outside package.json engines.node ${range}. Run under a Node that range admits; ${unaffected}`,
      };
}

/** The running Node judged against the checkout whose scripts are running: a
 * target's or another launchpad's package.json does not govern these scripts. */
export const judgeRunningNode = (version = process.version, root = TOOL_ROOT) =>
  judgeNodeRuntime(version, declaredNodeRange(root));

// The Git floor's one admitted form, `>=major.minor.patch`: the oldest Git
// the kit runs on. Git 2.31.0 rests on two forms the scripts use that it
// introduced, `rev-parse --path-format` and the environment's configuration
// pairs (GIT_CONFIG_COUNT with its KEY and VALUE variables); below it they
// fail with words that name neither the floor nor the version. Git's own
// version string carries a platform tail (`2.39.3 (Apple Git-146)`,
// `2.31.0.windows.1`), read past here.
const GIT_FLOOR = /^>=(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/u;
const GIT_VERSION = /^git version (\d+)\.(\d+)\.(\d+)/u;

/** A package.json's `engines.git`, read as `declaredNodeRange` reads Node's:
 * undefined when nothing is declared, null when the file cannot be read. */
export function declaredGitFloor(root) {
  try {
    const text = readFileSync(join(root, "package.json"), "utf8");
    return JSON.parse(text.replace(/^﻿/u, "")).engines?.git ?? undefined;
  } catch (error) {
    return error.code === "ENOENT" ? undefined : null;
  }
}

/** The first line `git --version` prints, or null when Git cannot be run. */
export function readGitVersion() {
  const result = spawnGit(["--version"], {
    encoding: "utf8",
    timeout: 10_000,
  });
  return result.status === 0 ? result.stdout.split("\n")[0].trim() : null;
}

/** Judges `git --version`'s output against the declared floor. `message`
 * names the floor and the version read, so the refusal says what to change. */
export function judgeGitRuntime(version, floor) {
  if (floor === undefined)
    return {
      admitted: true,
      message: "Git runtime not judged: package.json declares no engines.git.",
    };
  const unaffected = "node scripts/bootstrap.mjs is unaffected.";
  if (floor === null)
    return {
      admitted: false,
      message: `package.json could not be read, so Git cannot be judged against its engines.git. Repair the file; ${unaffected}`,
    };
  const declared = typeof floor === "string" ? GIT_FLOOR.exec(floor) : null;
  if (!declared)
    return {
      admitted: false,
      message: `package.json engines.git reads ${JSON.stringify(floor)}, which is not >=major.minor.patch, so Git cannot be judged. Declare the floor in that form; ${unaffected}`,
    };
  const running =
    typeof version === "string" ? GIT_VERSION.exec(version) : null;
  if (!running)
    return {
      admitted: false,
      message: `Git's version could not be read (git --version printed ${version === null ? "nothing: Git did not run" : JSON.stringify(version)}), so it cannot be judged against package.json engines.git ${floor}. Put a Git at or above that floor first on PATH; ${unaffected}`,
    };
  const [major, minor, patch] = running.slice(1, 4).map(Number);
  const [floorMajor, floorMinor, floorPatch] = declared.slice(1, 4).map(Number);
  const read = `${major}.${minor}.${patch}`;
  const admitted =
    major > floorMajor ||
    (major === floorMajor &&
      (minor > floorMinor || (minor === floorMinor && patch >= floorPatch)));
  return admitted
    ? {
        admitted,
        message: `Git ${read} is at or above package.json engines.git ${floor}.`,
      }
    : {
        admitted,
        message: `Git ${read} (git --version) is below package.json engines.git ${floor}. Put a Git at or above that floor first on PATH; ${unaffected}`,
      };
}

/** The Git on PATH judged against the checkout whose scripts are running. One
 * `git --version` spawn per call. */
export const judgeRunningGit = (root = TOOL_ROOT, version = readGitVersion()) =>
  judgeGitRuntime(version, declaredGitFloor(root));
