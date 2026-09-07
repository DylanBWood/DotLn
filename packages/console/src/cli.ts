#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { collectSources } from "./collect.js";
import { projectBoard } from "./board.js";
import { renderHtml, renderTerminal } from "./render.js";
import type { BoardSources } from "./types.js";
import { object } from "./values.js";

const usage =
  "usage: console board [--json | --html <new.html>] [--store <directory>] [--sources <recorded-sources.json>]";
try {
  const args = process.argv.slice(2);
  if (args.shift() !== "board") throw new Error(usage);
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
} catch (error) {
  process.stderr.write(
    error instanceof Error && error.message === usage
      ? `${usage}\n`
      : "console refused: input could not be projected or output could not be created (existing files are preserved).\n",
  );
  process.exitCode = 1;
}
