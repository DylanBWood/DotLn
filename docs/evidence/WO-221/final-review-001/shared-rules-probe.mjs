// FINAL-001 probe: rule ownership under the literal fallback when two target
// orders of one registered repository are in flight at once. It writes only
// under a fresh directory in the system temporary root and removes it.
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const lib = await import(
  new URL("../../../../scripts/lib/target-worktrees.mjs", import.meta.url)
);
const main = mkdtempSync(join(tmpdir(), "dotln-shared-rules-"));
try {
  execFileSync("git", ["init", "-q", main]);
  const selector = "github.com/dotln-fixture/target";
  const entry = (workOrderId, suffix) => ({
    target: join(main, "..", `Targets/target-wo${suffix}`),
    clone: join(main, "..", "clone"),
    branch: `wo-${suffix}`,
    workOrderId,
    repositoryId: "target",
  });
  lib.writeOrderHostRules(main, entry("WO-001", "001"), selector);
  lib.writeOrderHostRules(main, entry("WO-002", "002"), selector);
  const allow = () =>
    JSON.parse(readFileSync(join(main, ".claude/settings.local.json"), "utf8"))
      .permissions.allow;
  const sidecar = (workOrderId) =>
    JSON.parse(
      readFileSync(
        join(main, "docs/control/local/host-rules", `${workOrderId}.json`),
        "utf8",
      ),
    ).claude;
  const before = allow();
  const second = sidecar("WO-002");
  lib.removeOrderHostRules(main, "WO-001");
  const after = allow();
  const gh = (rules) => rules.filter((rule) => rule.startsWith("Bash(gh pr"));
  console.log(
    JSON.stringify(
      {
        rulesBefore: before.length,
        ghRulesBefore: gh(before).length,
        secondSidecarRules: second.length,
        secondSidecarHoldsGhRules: gh(second).length > 0,
        rulesAfterFirstClose: after.length,
        ghRulesAfterFirstClose: gh(after).length,
        secondOrderPushRulesRemain: after.filter((rule) =>
          rule.includes("target-wo002"),
        ).length,
      },
      null,
      2,
    ),
  );
} finally {
  rmSync(main, { recursive: true, force: true });
}
