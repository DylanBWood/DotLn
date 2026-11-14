#!/usr/bin/env node
// The host report's entry: `node scripts/doctor.mjs [--json]`. It prints one
// row for each assumption the kit makes of this host and exits 1 where a row
// is unmet; it reads and refuses nothing, and it runs before any install.
//
// The running Node is judged here before any other module of the kit is
// loaded, with nothing but Node's own modules, so that a Node too old to load
// one still prints its row with the floor. The rows themselves come from
// scripts/lib/host-doctor.mjs, which judges Node again with the kit's own
// function; this file's judgment is what stands if that module cannot load.
import { readFileSync, realpathSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

/** The kit's package.json, by this file's own address. The entry derives no
 * root: scripts/lib/config.mjs owns that derivation, and this entry may not
 * load a module of the kit before it has judged Node. Every other path of the
 * report comes from the library, whose root is the configuration module's,
 * and a case holds this address to the file at that root. */
export const KIT_PACKAGE = new URL("../package.json", import.meta.url);

/** The Node row from package.json alone: `engines.node` as alternatives of
 * `^major.minor.patch`, the form the kit declares, read without a module of
 * the kit. A range it cannot read is reported unknown. `root` is a test's;
 * without one the kit's own package.json is read. */
export function nodeRowAlone(version, root) {
  var assumption =
    "Node is inside the range package.json engines.node declares";
  var dependsOn = "every script of the kit, the gate and the hooks";
  var range;
  try {
    range = JSON.parse(
      readFileSync(
        root ? join(root, "package.json") : KIT_PACKAGE,
        "utf8",
      ).replace(/^\uFEFF/, ""),
    ).engines.node;
  } catch (error) {
    range = undefined;
  }
  // A prerelease or a build of a version is read, and no range of the
  // declared form admits one, as the kit's own judge holds.
  var running = /^v?(\d+)\.(\d+)\.(\d+)([-+].+)?$/.exec(String(version));
  var floors =
    typeof range === "string"
      ? range.split("||").map(function (part) {
          return /^\s*\^(\d+)\.(\d+)\.(\d+)\s*$/.exec(part);
        })
      : [];
  if (!running || !floors.length || floors.indexOf(null) >= 0)
    return {
      id: "node",
      assumption: assumption,
      observed: "Node " + version,
      verdict: "unknown",
      dependsOn: dependsOn,
      remedy:
        typeof range === "string"
          ? "package.json engines.node reads " +
            range +
            "; run under a Node it admits"
          : "package.json declares no engines.node this entry can read",
    };
  var admitted = floors.some(function (floor) {
    return (
      !running[4] &&
      Number(running[1]) === Number(floor[1]) &&
      (Number(running[2]) > Number(floor[2]) ||
        (Number(running[2]) === Number(floor[2]) &&
          Number(running[3]) >= Number(floor[3])))
    );
  });
  return {
    id: "node",
    assumption: assumption,
    observed: "Node " + version,
    verdict: admitted ? "met" : "unmet",
    dependsOn: dependsOn,
    remedy: admitted
      ? "none"
      : "Node " +
        version +
        " is outside package.json engines.node " +
        range +
        ". Run under a Node that range admits.",
  };
}

/** Runs the report. `options` lets a test stand in for the running Node, the
 * root, the loader of the library and the host's facts; without a root the
 * library reports on the configuration module's. Returns the exit code and
 * writes the table, or the rows as JSON, through `write`. */
export async function doctor(argv, options) {
  var given = options || {};
  var root = given.root;
  var nodeVersion = given.nodeVersion || process.version;
  var write = given.write || console.log;
  var json = argv.indexOf("--json") >= 0;
  if (
    argv.some(function (arg) {
      return arg !== "--json";
    })
  ) {
    write("usage: node scripts/doctor.mjs [--json]");
    return 2;
  }
  // First, with Node's own modules alone.
  var alone = nodeRowAlone(nodeVersion, root);
  var library;
  try {
    library = await (given.load
      ? given.load()
      : import("./lib/host-doctor.mjs"));
  } catch (error) {
    var rows = [
      alone,
      {
        id: "modules",
        assumption: "this Node can load the kit's own modules",
        observed: "the host report's module did not load",
        verdict: "unknown",
        dependsOn: "the rest of this report",
        remedy:
          alone.verdict === "unmet"
            ? "run under a Node the range admits, then run this again"
            : "run node scripts/bootstrap.mjs, then run this again",
      },
    ];
    write(
      json
        ? JSON.stringify(rows, null, 2)
        : rows
            .map(function (row) {
              return (
                row.assumption +
                ": " +
                row.verdict +
                " (" +
                row.observed +
                "); remedy: " +
                row.remedy
              );
            })
            .join("\n"),
    );
    return alone.verdict === "unmet" ? 1 : 0;
  }
  var facts = given.facts || library.hostFacts(root);
  if (given.nodeVersion)
    facts = Object.assign({}, facts, { nodeVersion: nodeVersion });
  var report = library.hostReport(root, facts);
  write(
    json ? JSON.stringify(report, null, 2) : library.renderHostReport(report),
  );
  return library.reportExitCode(report);
}

/** Whether Node was started on this file. Node gives a module its real
 * address and keeps the command line's path as it was typed, so a clone
 * reached through a symbolic link is compared by real paths. */
function startedHere() {
  try {
    return (
      Boolean(process.argv[1]) &&
      realpathSync(process.argv[1]) ===
        realpathSync(fileURLToPath(import.meta.url))
    );
  } catch (error) {
    return false;
  }
}

if (startedHere())
  doctor(process.argv.slice(2)).then(
    function (code) {
      process.exitCode = code;
    },
    function (error) {
      console.error(error && error.message ? error.message : String(error));
      process.exitCode = 2;
    },
  );
