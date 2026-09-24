#!/usr/bin/env node
import { findLaunchpad } from "./lib/config.mjs";
import { isMainModule } from "./lib/paths.mjs";
import { runGit } from "./lib/git.mjs";
import {
  beginEntropyRefutation,
  beginEntropyReview,
  checkEntropyReceipts,
  discardDispatch,
  disposeEntropyFinding,
  entropySubject,
  fileEntropyRefutation,
  fileEntropyReview,
  readReceipt,
} from "./lib/entropy-review.mjs";

const toolRoot = findLaunchpad();
const usage = [
  "entropy review [<commit>] [--transport claude-cli-print|codex-cli-exec|fake] [--model <model>] [--effort <level>] [--source <source>] [--account-label <label>] [--concern '<hypothesis>']",
  "entropy receipt <result.json> --statement <statement.txt>",
  "entropy refute <REVIEW-NNN> [--transport <name>] [--model <model>] [--effort <level>] [--source <source>] [--account-label <label>]",
  "entropy refutation-receipt <attempts.json> [--statement <statement.txt> (accepted, not recorded)]",
  "entropy dispose <REVIEW-NNN> <id> accept|defer|dismiss '<reason>'",
  "entropy subject",
  "entropy discard review|refutation",
  "entropy check",
].join("\n  ");

const options = (args, allowed) => {
  const out = {};
  for (let index = 0; index < args.length; index++) {
    const key = args[index];
    if (!allowed.includes(key) || key in out) throw new Error(usage);
    const value = args[++index];
    if (value === undefined || value.startsWith("--")) throw new Error(usage);
    out[key] = value;
  }
  return out;
};

const ACTOR_FLAGS = [
  "--transport",
  "--model",
  "--effort",
  "--source",
  "--account-label",
];
const actor = (opt) => ({
  transport: opt["--transport"] ?? null,
  ...(opt["--model"] ? { model: opt["--model"] } : {}),
  ...(opt["--effort"] ? { effort: opt["--effort"] } : {}),
  ...(opt["--source"] ? { source: opt["--source"] } : {}),
  ...(opt["--account-label"] ? { accountLabel: opt["--account-label"] } : {}),
});

export async function main(args = process.argv.slice(2), root = toolRoot) {
  if (runGit(root, ["rev-parse", "--show-toplevel"]) !== root)
    throw new Error("entropy command must use its Git root");
  const [command, ...rest] = args;

  if (command === "review") {
    const revision = rest[0] && !rest[0].startsWith("--") ? rest[0] : "HEAD";
    const opt = options(revision === "HEAD" ? rest : rest.slice(1), [
      ...ACTOR_FLAGS,
      "--concern",
    ]);
    return beginEntropyReview(root, {
      revision,
      ...actor(opt),
      concern: opt["--concern"] ?? null,
    });
  }

  if (command === "receipt") {
    const [result, ...flags] = rest;
    const opt = options(flags, ["--statement"]);
    if (!result || !opt["--statement"])
      throw new Error(
        "usage: entropy receipt <result.json> --statement <statement.txt>",
      );
    return fileEntropyReview(root, result, opt["--statement"]);
  }

  if (command === "refute") {
    const [receiptId, ...flags] = rest;
    if (!receiptId) throw new Error("usage: entropy refute <REVIEW-NNN>");
    return beginEntropyRefutation(
      root,
      receiptId,
      actor(options(flags, ACTOR_FLAGS)),
    );
  }

  if (command === "refutation-receipt") {
    const [attempts, ...flags] = rest;
    const opt = options(flags, ["--statement"]);
    if (!attempts)
      throw new Error(
        "usage: entropy refutation-receipt <attempts.json> [--statement <statement.txt> (accepted, not recorded)]",
      );
    return fileEntropyRefutation(root, attempts, opt["--statement"] ?? null);
  }

  if (command === "dispose") {
    const [receiptId, id, disposition, reason] = rest;
    if (rest.length !== 4)
      throw new Error(
        "usage: entropy dispose <REVIEW-NNN> <id> accept|defer|dismiss '<reason>'",
      );
    return disposeEntropyFinding(root, { receiptId, id, disposition, reason });
  }

  if (command === "discard") {
    if (rest.length !== 1 || !["review", "refutation"].includes(rest[0]))
      throw new Error("usage: entropy discard review|refutation");
    return discardDispatch(root, rest[0]);
  }

  if (command === "show") {
    if (rest.length !== 1) throw new Error("usage: entropy show <receipt-id>");
    return readReceipt(root, rest[0]);
  }

  if (command === "subject" && !rest.length) return entropySubject(root);

  if (command === "check" && !rest.length) return checkEntropyReceipts(root);

  throw new Error(`usage:\n  ${usage}`);
}

if (isMainModule(import.meta.url)) {
  main()
    .then((result) =>
      process.stdout.write(
        `${typeof result === "string" ? result : JSON.stringify(result, null, 2)}\n`,
      ),
    )
    .catch((error) => {
      // Worker failures carry sanitized codes, never raw model or CLI output.
      process.stderr.write(
        `${error instanceof Error ? error.message : "entropy command failed"}\n`,
      );
      process.exitCode = 1;
    });
}
