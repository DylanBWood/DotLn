#!/usr/bin/env node
// Prints the structure of each named authored Markdown document as JSON, or
// the error code that kept it unread. The console's collector runs this
// command and projects what it prints.
import { documentStructures } from "./lib/markdown-structure.mjs";
import { isMainModule } from "./lib/paths.mjs";

if (isMainModule(import.meta.url)) {
  const paths = process.argv.slice(2);
  if (!paths.length) {
    process.stderr.write("usage: markdown-structure.mjs <path>...\n");
    process.exitCode = 1;
  } else process.stdout.write(`${JSON.stringify(documentStructures(paths))}\n`);
}
