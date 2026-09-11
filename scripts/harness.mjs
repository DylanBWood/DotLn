#!/usr/bin/env node
import { mkdirSync, readFileSync, realpathSync } from "node:fs";
import { resolve } from "node:path";
import { emitHarness, checkHarness } from "./lib/harness.mjs";
import {
  harnessRoot,
  harnessOutputReadArgs,
  harnessWriterView,
  readHarnessOutput,
  releaseHarnessWriterByOperator,
  runHarnessEvidence,
  beginHarnessSession,
  observeHarnessSession,
  observeHarnessDelivery,
} from "../packages/skeleton/dist/src/harness-host.js";

const usage =
  "usage: harness emit|check [--loadout contributor] [--profile id] [--out dir] | harness evidence | harness read-output <path> [--offset <byte>] [--length <bytes>] | harness writer --show | harness writer --release [--force]";
try {
  const root = harnessRoot(process.cwd());
  const [action, ...args] = process.argv.slice(2);
  if (action === "begin") {
    const [session, role, flag, file] = args;
    if (
      !session ||
      !role ||
      (flag && !["--adopt-current", "--adopt-file"].includes(flag)) ||
      args.length > (flag === "--adopt-file" ? 4 : 3) ||
      (flag === "--adopt-file" && !file)
    )
      throw new Error(
        "usage: harness begin <session> <role> [--adopt-current|--adopt-file <authored-paths.json>]",
      );
    const adopted =
      flag === "--adopt-file"
        ? JSON.parse(readFileSync(resolve(root, file), "utf8"))
        : flag === "--adopt-current";
    if (flag === "--adopt-file" && !Array.isArray(adopted))
      throw new Error("Authorship adoption must be an explicit path array");
    console.log(
      JSON.stringify(beginHarnessSession(root, session, role, adopted)),
    );
  } else if (action === "observe") {
    if (args.length !== 1) throw new Error("usage: harness observe <session>");
    console.log(JSON.stringify(observeHarnessSession(root, args[0])));
  } else if (action === "delivered") {
    if (args.length !== 1)
      throw new Error(
        "usage: harness delivered <session> (actual reader stdout on stdin)",
      );
    observeHarnessDelivery(root, args[0], readFileSync(0, "utf8"));
    console.log("Recorded current-byte tool delivery");
  } else if (action === "read-output") {
    const request = harnessOutputReadArgs(args);
    console.log(
      JSON.stringify(
        readHarnessOutput(root, request.path, request.offset, request.length),
      ),
    );
  } else if (action === "writer") {
    // `--show` is a bounded metadata read; `--release` is an operator action
    // that a governed session's own writer guard still judges.
    const [mode, ...flags] = args;
    const force = flags.includes("--force");
    if (
      !["--show", "--release"].includes(mode) ||
      flags.some((flag) => flag !== "--force") ||
      (mode === "--show" && force)
    )
      throw new Error(usage);
    console.log(
      JSON.stringify(
        mode === "--show"
          ? harnessWriterView(root)
          : releaseHarnessWriterByOperator(root, force),
      ),
    );
  } else {
    const options = {};
    for (let index = 0; index < args.length; index += 2) {
      if (
        !["--loadout", "--profile", "--out"].includes(args[index]) ||
        !args[index + 1]
      )
        throw new Error(usage);
      options[args[index].slice(2)] = args[index + 1];
    }
    if (action === "evidence") {
      if (args.length) throw new Error("harness evidence accepts no overrides");
      const checks = runHarnessEvidence(root);
      console.log(JSON.stringify({ checks }));
      if (checks.some((check) => check.exitCode !== 0 || !check.executed))
        process.exitCode = 1;
    } else {
      if (!["emit", "check"].includes(action)) throw new Error(usage);
      const out = resolve(root, options.out ?? ".");
      if (action === "emit") mkdirSync(out, { recursive: true });
      options.termsRoot = root;
      options.instructionFloor = readFileSync(
        resolve(root, "CLAUDE.md"),
        "utf8",
      );
      const result =
        action === "emit"
          ? emitHarness(realpathSync(out), options)
          : checkHarness(realpathSync(out), options);
      console.log(
        `harness ${action}: ${result.files} generated surfaces; local-terms list: ${result.localTerms.status}`,
      );
    }
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
