import { createHash } from "node:crypto";
import { readFileSync, realpathSync } from "node:fs";
import { observedExecFileSync as execFileSync } from "./gate-deadlines.mjs";
import {
  evaluateFeedback,
  type CompiledFeedback,
  type FeedbackRequest,
  type FeedbackVerdict,
} from "@dotln/compiler";
import { feedbackSourceComments } from "./feedback-source-comments.js";

export type FeedbackBoundaryRequest =
  | Exclude<FeedbackRequest, { readonly kind: "suppression-diff" }>
  | {
      readonly kind: "suppression-diff";
      readonly files: readonly {
        readonly path: string;
        readonly before: string;
        readonly after: string;
      }[];
    };

export class FeedbackRefused extends Error {
  constructor(readonly verdict: FeedbackVerdict) {
    super(
      verdict.violations
        .map((item) => `${item.unitId}: ${item.reason}`)
        .join("; "),
    );
  }
}
/** Only host-derived facts enter here. A model cannot call this with self-authored evidence. */
export function feedbackBoundary<T>(
  program: CompiledFeedback,
  facts: FeedbackBoundaryRequest,
  effect: () => T,
): T {
  const request: FeedbackRequest =
    facts.kind === "suppression-diff"
      ? {
          kind: facts.kind,
          files: facts.files.map((file) => ({
            path: file.path,
            beforeComments: feedbackSourceComments(file.path, file.before),
            afterComments: feedbackSourceComments(file.path, file.after),
          })),
        }
      : facts;
  const verdict = evaluateFeedback(program, request);
  if (!verdict.allowed) throw new FeedbackRefused(verdict);
  return effect();
}
export const feedbackContentHash = (bytes: string | Uint8Array): string =>
  `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
export function feedbackReadOutput(path: string, evidenceRef: string) {
  const contents = readFileSync(path);
  return {
    contents,
    receipt: {
      path: realpathSync(path),
      hash: feedbackContentHash(contents),
      evidenceRef,
    },
  };
}
/** Caller owns a reservation lock spanning this observation and writable dispatch. */
export function feedbackWriterFacts(
  cwd: string,
  actorId: string,
  writers: readonly { readonly actorId: string; readonly worktree: string }[],
): Extract<FeedbackRequest, { readonly kind: "writer-isolation" }> {
  const physical = realpathSync(cwd);
  const git = (...args: string[]) =>
    execFileSync("git", args, {
      cwd: physical,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      timeout: 5000,
    }).trim();
  const gitRoot = realpathSync(git("rev-parse", "--show-toplevel"));
  return {
    kind: "writer-isolation",
    actorId,
    cwd: physical,
    gitRoot,
    worktree: gitRoot,
    branch: git("rev-parse", "--abbrev-ref", "HEAD"),
    writable: true,
    writers: writers.map((writer) => ({
      actorId: writer.actorId,
      worktree: realpathSync(writer.worktree),
    })),
  };
}
