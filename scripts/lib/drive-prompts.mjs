import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { drivenHelperScripts } from "../../packages/skeleton/dist/src/harness-command.js";
import { docPath } from "./config.mjs";
import { shellQuote } from "./git.mjs";
import { coldStartPaths } from "./process-budget.mjs";

// Everything a phase worker is told beyond its generated role skill. Someone
// editing that text in contributor.ts finds the rest here, and each host's
// launch reads the same sentences.

const PUBLIC_RESEARCH_NOTE =
  "\nPublic documentation research is available through the host's web tools, the ctx7 CLI (resolve with npx ctx7@latest library before docs), and public GitHub reads through gh or unauthenticated curl GETs to api.github.com/search/repositories?q=...&per_page=1 and api.github.com/repos/owner/repo (use exactly curl --disable --fail --silent --show-error --max-time 60 followed by the quoted URL). npm uses this order's ignored cache; no user cache write is needed. Use only task-relevant public sources within this role's authority. These adapters may be unavailable or quota-limited; report the observed limitation and use another declared source. Network access grants no publication or account-setting authority. The launcher does not inherit unrelated MCP connections.\n";

/** The launchpad forms the target lane admits, as drivenCommandEffect judges
 * them (packages/skeleton/src/harness-command.ts): the worker note is written
 * from this list and scripts/test-drive.mjs checks each row against that
 * judge, for the roles named. `WO-NNN` stands for the worker's own order. */
const PHASE_ROLES = Object.freeze(["executor", "verifier", "reviewer"]);
export const targetLaneForms = Object.freeze([
  ...drivenHelperScripts.map((script) => ({
    script,
    args: [],
    roles: PHASE_ROLES,
  })),
  ...["status", "briefing", "times", "usage"].map((action) => ({
    script: "resume",
    args: [action],
    roles: PHASE_ROLES,
  })),
  { script: "release", args: ["prepare", "--local"], roles: PHASE_ROLES },
  {
    script: "worktree",
    args: ["integrate", "WO-NNN"],
    roles: Object.freeze(["executor", "reviewer"]),
  },
  { script: "refute-plan", args: ["followups", "--sync"], roles: PHASE_ROLES },
  { script: "target-gate", args: ["WO-NNN"], roles: PHASE_ROLES },
  { script: "target-gate", args: ["WO-NNN", "--review"], roles: PHASE_ROLES },
  { script: "test-runner", args: ["--document"], roles: PHASE_ROLES },
  ...["usage", "scratch", "delivered", "read-output"].map((action) => ({
    script: "harness",
    args: [action],
    roles: PHASE_ROLES,
  })),
  { script: "harness", args: ["evidence", "--wait"], roles: PHASE_ROLES },
  { script: "harness", args: ["writer", "--show"], roles: PHASE_ROLES },
]);
const listed = (items) =>
  items.length > 1
    ? `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`
    : items.join("");
const FORM_NOTES = {
  resume: "beside this role's own lifecycle actions",
  "refute-plan": "(for npm run plan -- followups --sync)",
  "target-gate": "(--review when the criterion names the review gate)",
};
const roleSet = (roles) => [...roles].sort().join(",");
/** The forms clause of the worker note, rendered from targetLaneForms so that
 * a row cannot go missing from the note: the helpers by name, then each other
 * script with its admitted arguments, its role limit and its note. */
export const targetLaneClause = () => {
  // One clause per script and role set, so a row with its own role limit is
  // never folded into another row's.
  const groups = new Map();
  for (const row of targetLaneForms) {
    const key = `${row.script}\u0000${roleSet(row.roles)}`;
    groups.set(key, [...(groups.get(key) ?? []), row]);
  }
  const clauses = [
    `${listed([...drivenHelperScripts])} with their ordinary arguments`,
  ];
  for (const rows of groups.values()) {
    const { script, roles } = rows[0];
    if (drivenHelperScripts.includes(script)) continue;
    const forms = listed([...new Set(rows.map(({ args }) => args.join(" ")))]);
    const limit =
      roleSet(roles) === roleSet(PHASE_ROLES)
        ? ""
        : `, for ${listed(roles.map((role) => `the ${role}`))}`;
    const note = FORM_NOTES[script] ? ` ${FORM_NOTES[script]}` : "";
    clauses.push(`${script} ${forms}${limit}${note}`);
  }
  return clauses.join("; ");
};
const launchpadHelpersNote = (launchpad) => {
  const scripts = [...new Set(targetLaneForms.map(({ script }) => script))];
  const qualified = scripts
    .map((name) => `node ${shellQuote(join(launchpad, `scripts/${name}.mjs`))}`)
    .join("; ");
  return `\nRun launchpad helpers directly from your existing cwd through these qualified scripts: ${qualified}. From a target worktree the lane admits these forms: ${targetLaneClause()}. Other forms are refused. The sync helper includes launchpad formatting. In a target worktree, use these helpers for launchpad duties; npm run would select the target's own package.json. Use the briefing's qualified target and document gates.\n`;
};

/** The notes appended to a phase or review worker's generated definition. */
export const phaseWorkerNotes = (launchpad) =>
  PUBLIC_RESEARCH_NOTE + launchpadHelpersNote(launchpad);

// What a Codex phase is told about its Git-metadata writes follows the sandbox
// election it launches under (WO-247-D006): under the host's own policy each
// write is one approval request the host's review judges; under full access
// there is no approval step to request.
const GIT_METADATA_NOTE =
  "State-changing lifecycle commands write Git metadata, including completion's intent-to-add check. ";
const approvalText = (sandbox) =>
  sandbox === "off"
    ? `${GIT_METADATA_NOTE}This launch runs with full access and no approval step: after the role's required command and source inspection, run each exact authorized lifecycle command or other Git-metadata write directly, once. If the host refuses one, stop without retrying or using an alternative command.\n`
    : `${GIT_METADATA_NOTE}After the role's required command and source inspection, request the host's normal one-invocation outside-sandbox approval for each exact authorized lifecycle command or other Git-metadata write. Do not persist an allow rule. If the host denies the request, stop without retrying or using an alternative command. Operations needing no added permission retain the native sandbox.\n`;

// The launch-time difference between a router and a phase worker, computed once.
export function nativeProfile({
  launchpad,
  role,
  phrase,
  cwd,
  worker,
  definition,
  sandbox = "host",
}) {
  const router = role === "router";
  const routerCommand = router
    ? `node scripts/drive.mjs ${phrase.slice("drive: ".length)}`
    : null;
  const lifecycle = router
    ? ""
    : `For every lifecycle command, use node ${shellQuote(join(launchpad, "scripts/resume.mjs"))} followed by the action and arguments, including when the shared skill spells npm run resume. Run it as its own direct command so its refusal can be attributed to this launchpad. Preserve already-recorded dispatches; read briefing instead of replaying them.\n`;
  const entry = router
    ? `Begin the router record without a writer by running node ${shellQuote(join(launchpad, "scripts/harness.mjs"))} begin "$CODEX_THREAD_ID" router ${phrase.slice("drive: ".length)}. Then use the router skill.\n`
    : `Before any phase work, run node ${shellQuote(join(launchpad, "scripts/drive.mjs"))} worker-entry. It begins this native session and reserves only this order's worktrees; on refusal stop.\n${approvalText(sandbox)}`;
  const selection = `The launcher supplied model ${definition.model} and reasoning effort ${definition.effort}. These are selected values, not effective readback; preserve them with the role's supplied-value attestation when native readback is unavailable.\n`;
  const tools = `Read,Write,Edit,Bash,Grep,Glob,Agent,TaskOutput,Skill${router ? "" : ",WebSearch,WebFetch"}`;
  const claudeAppendix = router
    ? `The generated router skill's literal driver command in this cwd is ${routerCommand}. This native router's session identifier is ${worker}; its exact usage command is node scripts/harness.mjs usage ${shellQuote(worker)}. Follow that skill's host-permission request and refusal rules.`
    : cwd !== launchpad
      ? `This registered target has tool hooks, but no UserPromptSubmit lifecycle dispatch. Its bounded shell adapter requires separate commands. Your first Bash call must be exactly pwd -P; your second exactly git rev-parse --show-toplevel. Do not combine startup commands, environment reads, status, or file discovery into one shell line. Then use the qualified status command below. The launchpad is ${launchpad}. Use node ${shellQuote(join(launchpad, "scripts/resume.mjs"))} status --json to read the selected phase, then perform the received lifecycle phrase's dispatch through that same qualified script. If already dispatched, read briefing instead. The target-order clauses take precedence over the generic statement that Claude hooks dispatch automatically. Keep DOTLN_LAUNCHPAD from the environment and run each qualified command directly from this target cwd.`
      : lifecycle;
  // The sentences this module adds at launch on each host, measured beside the
  // installed root as the driven-start figure (WO-192-D095, WO-247-D005).
  const codexLaunch = entry + selection + lifecycle;
  return {
    router,
    routerCommand,
    tools,
    launchText: { codex: codexLaunch, claude: claudeAppendix },
    webSearch: router ? "disabled" : "live",
    nativeLauncher: router
      ? "generated-skill-command-subject-to-host-permissions"
      : "own-host-sandbox",
    env: router
      ? {}
      : {
          npm_config_cache: docPath(
            launchpad,
            "control",
            "local/native-tools/npm-cache",
          ),
          NODE_USE_ENV_PROXY: "1",
        },
    codexInstructions: codexLaunch + definition.prompt,
    claudeAppendix,
  };
}

/** The bytes a driven worker starts with on `host`: the installed root the
 * cold-start meter measures (CLAUDE.md plus the role skill under the host's
 * skills root) and the launch text this module adds beyond it, the worker
 * notes included for a phase worker. Recorded on every launched role and
 * read beside the cold-start metric; not bounded (WO-192-D095). */
export function drivenStartBytes({ launchpad, host, role, profile }) {
  const skillsRoot = host === "codex" ? ".agents/skills" : ".claude/skills";
  const bytesOf = (path) =>
    existsSync(join(launchpad, path))
      ? readFileSync(join(launchpad, path)).length
      : null;
  const installed = coldStartPaths(skillsRoot, role).map(bytesOf);
  const installedBytes = installed.includes(null)
    ? null
    : installed.reduce((sum, bytes) => sum + bytes, 0);
  const launchTextBytes =
    Buffer.byteLength(profile.launchText[host]) +
    (profile.router ? 0 : Buffer.byteLength(phaseWorkerNotes(launchpad)));
  return {
    role,
    host,
    bytes: installedBytes === null ? null : installedBytes + launchTextBytes,
    installedBytes,
    launchTextBytes,
    method:
      "installed CLAUDE.md plus the host's installed role skill, as the cold-start meter counts them, plus the launch sentences of scripts/lib/drive-prompts.mjs; recorded, not bounded",
  };
}
