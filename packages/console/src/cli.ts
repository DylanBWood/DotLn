#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { collectSources } from "./collect.js";
import { projectBoard } from "./board.js";
import { renderHtml, renderTerminal } from "./render.js";
import type { BoardSources } from "./types.js";
import { object } from "./values.js";
import { statusCli } from "./runtime-status.js";
import { readConsoleConnection } from "./console-client-node.js";
import { invokeConsoleCommand, readConsoleContract } from "./console-client.js";

const usage =
  "usage: console board [--json | --html <new.html>] [--store <directory>] [--sources <recorded-sources.json>] | console status --store <directory> [--json] [--watch] | console commands --store <directory> | console invoke --store <directory> <command> [args...]";
try {
  const args = process.argv.slice(2);
  const action = args.shift();
  if (action === "status") {
    statusCli(args);
  } else if (action === "commands" || action === "invoke") {
    if (args.shift() !== "--store") throw new Error(usage);
    const directory = args.shift();
    if (!directory || directory.startsWith("--")) throw new Error(usage);
    const command = action === "invoke" ? args.shift() : undefined;
    if (action === "invoke" ? !command : args.length) throw new Error(usage);
    try {
      const connection = readConsoleConnection(directory);
      if (command === undefined)
        process.stdout.write(
          JSON.stringify(await readConsoleContract(connection), null, 2) + "\n",
        );
      else {
        const result = await invokeConsoleCommand(connection, {
          version: 1,
          command,
          args,
        });
        process.stdout.write(Buffer.from(result.stdoutBase64, "base64"));
        process.stderr.write(Buffer.from(result.stderrBase64, "base64"));
        process.exitCode = result.exitCode;
      }
    } catch (error) {
      // The client's own messages name no path or token; a failed fetch may.
      process.stderr.write(
        `console refused: ${
          error instanceof Error &&
          /^(?:no running resident console|console |invalid (?:local )?console )/u.test(
            error.message,
          )
            ? error.message
            : "the resident console is unreachable"
        }\n`,
      );
      process.exitCode = 1;
    }
  } else {
    if (action !== "board") throw new Error(usage);
    let mode: "terminal" | "json" | "html" = "terminal";
    let htmlPath: string | undefined, sourcePath: string | undefined;
    const stores: string[] = [];
    while (args.length) {
      const flag = args.shift();
      if (flag === "--json") {
        if (mode !== "terminal") throw new Error(usage);
        mode = "json";
      } else if (["--html", "--sources", "--store"].includes(flag ?? "")) {
        const value = args.shift();
        if (!value || value.startsWith("--")) throw new Error(usage);
        if (flag === "--html") {
          if (mode !== "terminal" || extname(value).toLowerCase() !== ".html")
            throw new Error(usage);
          mode = "html";
          htmlPath = value;
        } else if (flag === "--sources") {
          if (sourcePath) throw new Error(usage);
          sourcePath = value;
        } else stores.push(value);
      } else throw new Error(usage);
    }
    if (sourcePath && stores.length) throw new Error(usage);
    const root = fileURLToPath(new URL("../../../../", import.meta.url));
    const sources: BoardSources = sourcePath
      ? (object(
          JSON.parse(readFileSync(resolve(sourcePath), "utf8")),
        ) as BoardSources)
      : await collectSources(root, stores);
    const board = projectBoard(sources);
    if (mode === "html") {
      writeFileSync(resolve(htmlPath!), renderHtml(board), {
        flag: "wx",
        mode: 0o600,
      });
      process.stdout.write("Actor board written.\n");
    } else
      process.stdout.write(
        mode === "json"
          ? JSON.stringify(board, null, 2) + "\n"
          : renderTerminal(board),
      );
  }
} catch (error) {
  process.stderr.write(
    error instanceof Error && error.message.startsWith("usage: console")
      ? `${error.message}\n`
      : "console refused: input could not be projected or output could not be created (existing files are preserved).\n",
  );
  process.exitCode = 1;
}
