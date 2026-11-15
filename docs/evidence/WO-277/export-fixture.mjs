// Builds the launchpad suite's export fixture and records what a person
// meets in a fresh export: the first paragraph of its front page and of its
// kit guide, and the page that `node scripts/launchpad.mjs commands` prints
// there. Run it from the repository's root under the bounded wrapper, with
// `node --test` and this file's path. It writes export-commands.txt (the
// printed page, byte for byte) and export-fixture.json beside this file.
import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { kit, ok, run } from "../../../scripts/lib/launchpad-fixture.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repository = join(here, "../../..");
const sha256 = (text) => createHash("sha256").update(text).digest("hex");
// A document's first paragraph: the text under its title, up to the next
// blank line.
const firstParagraph = (path) =>
  readFileSync(join(kit, path), "utf8").split(/\n[ \t]*\n/u)[1];

test("the export's front page, kit guide and printed commands are recorded", () => {
  const printed = ok(
    run(process.execPath, ["scripts/launchpad.mjs", "commands"], { cwd: kit }),
    "launchpad commands in the export",
  ).stdout;
  // The export prints the page this checkout holds.
  const page = readFileSync(join(repository, "docs/OPERATOR.md"), "utf8");
  assert.equal(printed, page);
  const stepOne = printed.split(/^## \d+\. /mu)[1];
  writeFileSync(join(here, "export-commands.txt"), printed);
  writeFileSync(
    join(here, "export-fixture.json"),
    `${JSON.stringify(
      {
        recordedAt: new Date().toISOString(),
        command: "node scripts/launchpad.mjs commands, run in the export",
        printedBytes: Buffer.byteLength(printed),
        printedSha256: sha256(printed),
        checkoutPageSha256: sha256(page),
        printedEqualsCheckoutPage: printed === page,
        stepOneHoldsTermsBlockAfterCloneRecipe:
          stepOne.indexOf("\ngit clone --no-tags ") >= 0 &&
          stepOne.indexOf("\ngit clone --no-tags ") <
            stepOne.indexOf(
              "```sh\nmkdir -p docs/control/local\ncp scripts/kit/terms.example.txt docs/control/local/terms.txt\nnpm run terms -- check CLAUDE.md README.md\n```\n",
            ),
        frontPageFirstParagraph: firstParagraph("README.md"),
        kitGuideFirstParagraph: firstParagraph("docs/KIT.md"),
      },
      null,
      2,
    )}\n`,
  );
});
