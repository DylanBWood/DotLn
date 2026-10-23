import { createHash } from "node:crypto";

// The reviewer confirms a publication's review items by naming the digest of
// the composed text a refusal printed: `--confirm-terms sha256:<64 hex>`.
export const CONFIRM_TERMS = /^sha256:[0-9a-f]{64}$/u;

/** The digest the confirmation names, over the text's UTF-8 bytes. */
export const digestOf = (text) =>
  `sha256:${createHash("sha256").update(text).digest("hex")}`;

/** Read `--confirm-terms <value>` out of a command's arguments, in place, so
 * the route's own argument check sees the arguments it always saw. A missing
 * or malformed value refuses here, before any effect. */
export const takeConfirmTerms = (args) => {
  const at = args.indexOf("--confirm-terms");
  if (at < 0) return undefined;
  const [, value] = args.splice(at, 2);
  if (!CONFIRM_TERMS.test(value ?? ""))
    throw new Error(
      "usage: --confirm-terms sha256:<64 hex digits>, the composed body's digest a refusal prints",
    );
  return value;
};
