import { mkdirSync, cpSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { runGit } from "./lib/git.mjs";
import { write } from "./lib/helpers.mjs";
import { main as index } from "./work-orders.mjs";
import { recordRepositoryClone } from "./lib/target-worktrees.mjs";
import { TOOL_ROOT } from "./lib/config.mjs";
import { installBeaconFixture } from "./test-beacon-fixture.mjs";

export const fixtureCommit = (root, label) => {
  runGit(root, ["add", "."]);
  runGit(root, ["-c", "maintenance.auto=false", "commit", "-qm", label], {
    env: {
      ...process.env,
      GIT_AUTHOR_DATE: "2020-01-02T00:00:00Z",
      GIT_COMMITTER_DATE: "2020-01-02T00:00:00Z",
    },
  });
  return runGit(root, ["rev-parse", "HEAD"]);
};
export const fixtureRepository = (root) => {
  mkdirSync(root, { recursive: true });
  runGit(root, ["init", "-q", "-b", "main"]);
  runGit(root, ["config", "user.name", "Workstream Fixture"]);
  runGit(root, ["config", "user.email", "test@example.invalid"]);
};
export const streamAuthority = (id, stream, repository) =>
  `# ${id} — Synthetic member (version assigned at activation)\n\n**Model:** fixture\n**Effort:** executor xhigh+; verifier xhigh+; reviewer any.\n${repository ? `**Repository:** ${repository.id} @ ${repository.base}\n` : ""}**Workstream:** ${stream}\n**Depends on:** nothing\n\n**Objective:** Synthetic workstream member.\n`;
export const streamDocument = (stream) =>
  `# ${stream.id} — Synthetic outcome\n\n<!-- dotln-workstream:start -->\n${JSON.stringify(stream)}\n<!-- dotln-workstream:end -->\n`;
export const streamSequence = (ids) =>
  `# Plan\n\n<!-- dotln-work-order-sequence:start -->\n${ids.map((id) => `- ${id} — Synthetic member`).join("\n")}\n<!-- dotln-work-order-sequence:end -->\n`;
export const streamRepositoryProfile = () => ({
  automationLogins: [],
  linkHosts: [],
  baseBranch: "main",
  worktreeParent: "../target-worktrees",
  repositoryClass: "fixture",
  authorityProfile: {
    authorityEnvelopeId: "fixture.workstream",
    allowedEffects: ["repo.read"],
    deniedEffects: ["repo.delete"],
    resourceLimits: {},
    requiredEvidence: ["registered-target"],
    expiresAt: Number.MAX_SAFE_INTEGER,
    revocationEventTypes: [],
  },
});
export const streamSnapshot = (text) =>
  JSON.parse(
    text
      .split("\n")
      .find((line) => line.startsWith("<!-- dotln-workstreams: "))
      .slice("<!-- dotln-workstreams: ".length, -4),
  );

/** One deterministic real-Git fixture is both the index assertion subject
 * and the source of the board's pinned input. Local clone paths stay ignored. */
export const createWorkstreamIndexFixture = (root) => {
  const launchpad = join(root, "launchpad");
  const service = join(root, "service");
  const client = join(root, "client");
  for (const target of [service, client]) fixtureRepository(target);
  write(service, "contract.json", '{"field":"optional"}\n');
  const serviceBase = fixtureCommit(service, "Service contract");
  write(service, "change.txt", "Compatible addition\n");
  const serviceTip = fixtureCommit(service, "Service addition");
  write(client, "contract.json", '{"field":"optional"}\n');
  const clientBase = fixtureCommit(client, "Client contract");
  fixtureRepository(launchpad);
  cpSync(join(TOOL_ROOT, "scripts/lib"), join(launchpad, "scripts/lib"), {
    recursive: true,
  });
  cpSync(
    join(TOOL_ROOT, "scripts/work-orders.mjs"),
    join(launchpad, "scripts/work-orders.mjs"),
  );
  installBeaconFixture(launchpad);
  write(launchpad, ".gitignore", "docs/control/local/\n");
  write(
    launchpad,
    "dotln.config.json",
    JSON.stringify({
      version: 1,
      classes: { fixture: { checks: [], supports: [] } },
      repositories: {
        service: streamRepositoryProfile(),
        client: streamRepositoryProfile(),
      },
    }),
  );
  const members = [
    { workOrderId: "WO-301", repositoryId: "service" },
    { workOrderId: "WO-302", repositoryId: "client" },
    { workOrderId: "WO-303", repositoryId: "client" },
  ];
  for (const member of members)
    write(
      launchpad,
      `docs/work-orders/${member.workOrderId}-fixture.md`,
      streamAuthority(member.workOrderId, "WS-001", {
        id: member.repositoryId,
        base: member.repositoryId === "service" ? serviceBase : clientBase,
      }),
    );
  write(
    launchpad,
    "docs/workstreams/WS-001-fixture.md",
    streamDocument({
      id: "WS-001",
      members,
      edges: [{ from: "WO-302", to: "WO-301", relation: "hard" }],
    }),
  );
  write(
    launchpad,
    "docs/planning/sequence.md",
    streamSequence(members.map((member) => member.workOrderId)),
  );
  write(launchpad, "docs/control/resume.jsonl", "");
  recordRepositoryClone(launchpad, "service", service);
  recordRepositoryClone(launchpad, "client", client);
  fixtureCommit(launchpad, "Launchpad fixture");
  index(["index"], launchpad);
  return {
    launchpad,
    service,
    client,
    serviceBase,
    serviceTip,
    clientBase,
    readme: () =>
      readFileSync(join(launchpad, "docs/work-orders/README.md"), "utf8"),
  };
};
