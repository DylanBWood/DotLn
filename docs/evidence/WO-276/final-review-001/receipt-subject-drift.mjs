// Final review of WO-276: does a planning receipt filed before this release
// still validate after it? A receipt binds the planning subject, and its
// validation rebuilds that subject from the committed text at the receipt's
// revision and requires the two to be equal. The rebuild now reads with the
// parser, so a document the two readers read differently leaves a filed
// receipt unequal to its rebuild.
//
// Each case is a minimal committed planning root under the scratch
// directory given as argv[2]: one order, a sequence, and no vision, roles
// or capability table (what an instance holds). The base's subject builder
// (a clean checkout of the base commit under argv[3], with its dependencies
// installed) is run beside the candidate's, and a receipt that carries the
// base-built subject is handed to each validation.
// Run from the repository root: node <this file> <scratch> <base>
// Adapted from the review worker's probes of the same claim.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
const [scratch, base] = process.argv.slice(2).map((value) => resolve(value));
const load = (from, module) =>
  import(pathToFileURL(join(from, "scripts/lib", module)).href);
const sides = {
  base: {
    subject: await load(base, "plan-subject.mjs"),
    receipts: await load(base, "plan-receipts.mjs"),
  },
  candidate: {
    subject: await load(process.cwd(), "plan-subject.mjs"),
    receipts: await load(process.cwd(), "plan-receipts.mjs"),
  },
};
const order = `# WO-001 — First order (version assigned at activation)

**Release classification:** patch.

**Objective:** Make it work.

**Acceptance criteria (all required):**

1. It works.
2. It stays working.

**Non-goals:** none.
`;
const cases = {
  "an order of the usual shape": order,
  "a paragraph that opens with bold words and is no label, after the criteria":
    order.replace(
      "\n**Non-goals:**",
      "\n**Note** the second follows the first.\n\n**Non-goals:**",
    ),
  "the same kind of paragraph after the non-goals": `${order}\n**Steps** follow in the plan below.\n`,
  "a criterion wrapped onto a line that opens with three backticks":
    order.replace(
      "2. It stays working.",
      "2. The page holds one\n   ```json block and stays working.",
    ),
};
const stable = (value) =>
  JSON.stringify(value, (_key, item) =>
    item && typeof item === "object" && !Array.isArray(item)
      ? Object.fromEntries(
          Object.keys(item)
            .sort()
            .map((key) => [key, item[key]]),
        )
      : item,
  );
const first = (error) => String(error.message).split("\n")[0].slice(0, 160);
const result = {};
let number = 0;
for (const [label, text] of Object.entries(cases)) {
  const root = join(scratch, `receipt-subject-drift-${number++}`);
  rmSync(root, { recursive: true, force: true });
  const put = (path, body) => {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), body);
  };
  // A kit root, as an instance is: the subject then names an absent vision,
  // roles page and capability table as unavailable.
  put("KIT-MANIFEST.json", "{}\n");
  put("docs/work-orders/WO-001-first-order.md", text);
  put(
    "docs/planning/work-order-map.md",
    "# Map\n\n<!-- dotln-work-order-sequence:start -->\n\n- WO-001 — First order\n\n<!-- dotln-work-order-sequence:end -->\n",
  );
  const git = (...args) =>
    execFileSync("git", ["-C", root, ...args], { encoding: "utf8" });
  git("init", "-q");
  git("config", "user.email", "probe@example.invalid");
  git("config", "user.name", "probe");
  git("config", "commit.gpgsign", "false");
  git("add", "-A");
  git("commit", "-q", "-m", "fixture");
  const built = {};
  for (const [name, side] of Object.entries(sides)) {
    try {
      built[name] = side.subject.buildPlanSubject(root, "HEAD");
    } catch (error) {
      built[name] = { threw: first(error) };
    }
  }
  const entry = {
    subjectsEqual: stable(built.base) === stable(built.candidate),
    baseOrder: built.base.threw ?? built.base.orders?.[0],
    candidateOrder: built.candidate.threw ?? built.candidate.orders?.[0],
  };
  // A receipt as the base would have stored it over this commit. Both
  // validations stop at their first failing check; the probe's result is
  // empty on purpose, so a validation that passes the subject comparison
  // stops at the result's.
  if (!built.base.threw) {
    const heading = "2026-11-13 planning pass";
    const payload = {
      schemaVersion: "plan-refutation-receipt-v1",
      receiptId: "2026-11-13-planning-probe-001",
      pass: {
        id: sides.base.subject.planningPasses(`## ${heading}`)[0].id,
        kind: "planning",
        heading,
      },
      ordinal: 1,
      previousReceiptHash: null,
      subject: built.base,
      episode: {},
      result: {},
      holds: [],
      dispositions: [],
      localTerms: "absent",
    };
    const receipt = {
      ...payload,
      receiptHash: `sha256:${createHash("sha256").update(JSON.stringify(payload)).digest("hex")}`,
    };
    entry.validationOfABaseFiledReceipt = {};
    for (const [name, side] of Object.entries(sides)) {
      try {
        await side.receipts.validateReceipt(root, structuredClone(receipt));
        entry.validationOfABaseFiledReceipt[name] = "valid";
      } catch (error) {
        entry.validationOfABaseFiledReceipt[name] = first(error);
      }
    }
  }
  result[label] = entry;
}
console.log(JSON.stringify(result, null, 2));
