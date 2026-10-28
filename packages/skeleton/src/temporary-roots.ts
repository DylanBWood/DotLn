// Runtime and source scripts share one record format and implementation.
import * as records from "./temporary-root-records.mjs";
export function createFixtureRoot(prefix: string): string {
  return records.createFixtureRoot(prefix);
}
export function createWorkerCapture(prefix: string): string {
  return records.createWorkerCapture(prefix);
}
export function createScratchRoot(prefix: string): string {
  return records.createScratchRoot(prefix);
}
export function removeTemporaryPath(
  path: import("node:fs").PathLike,
  options?: import("node:fs").RmOptions,
): void {
  records.removeTemporaryPath(path, options);
}
export * from "./temporary-root-records.mjs";
