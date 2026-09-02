#!/usr/bin/env node
import { isMain, runGenerator } from "./generator-runtime.mjs";

if (isMain(import.meta.url)) {
  runGenerator("program", process.argv.slice(2)).catch((error) => {
    process.stderr.write(
      `${error instanceof Error ? (error.stack ?? error.message) : String(error)}\n`,
    );
    process.exitCode = 1;
  });
}
