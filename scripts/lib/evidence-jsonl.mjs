import { readFileSync } from "node:fs";
import { join, posix } from "node:path";
import { docRelative } from "./config.mjs";
import { containedRegularFile } from "./paths.mjs";

// Declarations belong to one order's evidence, never to protocol/control logs.
export function evidenceJsonlDeclarations(root, paths) {
  const prefix = docRelative(root, "evidence") + "/";
  const declarations = new Map();
  for (const path of new Set(paths)) {
    if (
      !path.startsWith(prefix) ||
      !/^WO-\d{3}\/jsonl\.json$/u.test(path.slice(prefix.length))
    )
      continue;
    if (!containedRegularFile(join(root, path), root))
      throw new Error(`Invalid evidence JSONL declaration: ${path}`);
    const declaration = JSON.parse(readFileSync(join(root, path), "utf8"));
    if (
      declaration.schemaVersion !== 1 ||
      !declaration.nonEventPaths ||
      Array.isArray(declaration.nonEventPaths) ||
      typeof declaration.nonEventPaths !== "object" ||
      Object.keys(declaration).sort().join() !== "nonEventPaths,schemaVersion"
    )
      throw new Error(`Invalid evidence JSONL declaration: ${path}`);
    for (const [name, reason] of Object.entries(declaration.nonEventPaths)) {
      const target = posix.join(posix.dirname(path), name);
      if (
        !name.endsWith(".jsonl") ||
        posix.isAbsolute(name) ||
        name.includes("\\") ||
        name
          .split("/")
          .some((part) => !part || part === "." || part === "..") ||
        typeof reason !== "string" ||
        !reason.trim() ||
        !containedRegularFile(join(root, target), root) ||
        !paths.includes(target)
      )
        throw new Error(`Invalid evidence JSONL target ${name} in ${path}`);
      declarations.set(target, reason);
    }
  }
  return declarations;
}
