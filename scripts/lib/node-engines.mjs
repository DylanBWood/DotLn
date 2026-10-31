import { readFileSync } from "node:fs";
import { join } from "node:path";
import { TOOL_ROOT } from "./config.mjs";

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
