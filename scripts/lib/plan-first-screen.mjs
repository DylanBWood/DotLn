import { appendFileSync, existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { docPath } from "./config.mjs";
import { checkLocalTerms } from "./terms.mjs";
import { lintOutwardArtifact } from "./outward-lint.mjs";
import { planFirstContext } from "./plan-first.mjs";
import { containedRegularFile } from "./paths.mjs";

export function screenPlanPassage(root, state, text, name = "carried passage") {
  let localTerms;
  try {
    localTerms = checkLocalTerms(root, [{ name, text }]);
  } catch (error) {
    const prefix = "local-terms list present; refused ";
    if (!error.message.startsWith(prefix))
      throw new Error("plan-first terms input unavailable");
    const findings = JSON.parse(error.message.slice(prefix.length));
    localTerms = {
      status: findings.some((row) => row.mode === "refuse")
        ? "refused"
        : "review",
      findings,
    };
  }
  const vocabularyPath = docPath(root, "control", "outward-vocabulary.json");
  const vocabulary = existsSync(vocabularyPath)
    ? JSON.parse(readFileSync(vocabularyPath, "utf8"))
    : undefined;
  const result = lintOutwardArtifact({
    kind: "release-body",
    text,
    target: Boolean(state.repositoryId),
    localTerms,
    vocabulary,
  });
  // No private input or matched spelling reaches the diagnostic.
  return {
    name,
    status: result.status,
    findings: result.findings.map(({ rule, span, mode }) => ({
      rule,
      line: span.line,
      ...(mode ? { mode } : {}),
    })),
  };
}
export function screenPlanFirst(root, state, passage) {
  const context = planFirstContext(root, state);
  const results = context.documents
    .filter((doc) => doc.name !== "conversation.md" || !state.repositoryId)
    .map((doc) => {
      if (!containedRegularFile(doc.path, context.codeRoot))
        throw new Error(`missing plan-first document: ${doc.name}`);
      return screenPlanPassage(
        root,
        state,
        readFileSync(doc.path, "utf8"),
        doc.name,
      );
    });
  if (passage !== undefined)
    results.push(screenPlanPassage(root, state, passage));
  return {
    status: results.some((row) => row.status === "refused")
      ? "refused"
      : results.some((row) => row.status === "review")
        ? "review"
        : results.some((row) => row.status === "unavailable")
          ? "unavailable"
          : "pass",
    results,
  };
}
/** Announce before the caller carries the transformed text anywhere else.
 * `from` is an entry label, never a quotation of sensitive original words. */
export function announcePlanTransformation(
  root,
  state,
  { from, to, surface, at = new Date().toISOString() },
) {
  const screen = screenPlanPassage(root, state, `${from}\n${to}\n${surface}`);
  if (screen.status === "refused")
    throw new Error("plan-first transformed passage is refused");
  if (!from || !to || !surface || !Number.isFinite(Date.parse(at)))
    throw new Error("invalid transformation");
  const entry = { at, from, to, surface };
  appendFileSync(
    join(planFirstContext(root, state).directory, "conversation.md"),
    `\n### ${at} — Agent\n\nAnnounced transformation (${from}, for ${surface}):\n\n${to}\n`,
  );
  return entry;
}
export function checkPublicPlanConversations(root) {
  const evidence = docPath(root, "evidence");
  if (!existsSync(evidence)) return;
  const surfaces = readdirSync(evidence)
    .filter((name) => /^WO-\d{3}$/.test(name))
    .map((name) => join(evidence, name, "plan-first/conversation.md"))
    .filter((file) => existsSync(file))
    .map((file) => {
      if (!containedRegularFile(file, root))
        throw new Error(
          "public plan-first conversation must be a contained regular file",
        );
      return { name: relative(root, file), text: readFileSync(file, "utf8") };
    });
  if (surfaces.length) checkLocalTerms(root, surfaces);
}
