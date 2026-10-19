import { chmodSync, mkdirSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

/** Local forge transport shared by session and exported-instance fixtures. */
export function installTargetPublicationFixture(base, env, repositories) {
  const bin = join(base, "forge-bin");
  mkdirSync(bin);
  const realGit = spawnSync("sh", ["-c", "command -v git"], {
    encoding: "utf8",
  }).stdout.trim();
  const log = join(base, "forge-calls.jsonl"),
    body = join(base, "forge-body.md"),
    state = join(base, "forge-state.json");
  const global = join(base, "forge-gitconfig");
  writeFileSync(
    global,
    repositories
      .map(({ url, origin }) => `[url "${origin}"]\n\tinsteadOf = ${url}\n`)
      .join(""),
  );
  writeFileSync(
    join(bin, "git"),
    `#!${process.execPath}
import { spawnSync } from 'node:child_process';
const original = process.argv.slice(2), args = [...original];
let root;
if (args[0] === '-C') { root = args[1]; args.splice(0, 2); }
while (args[0] === '-c') args.splice(0, 2);
if (root && args[0] === 'remote' && args[1] === 'get-url') {
  const key = args.includes('--push') ? 'remote.origin.pushurl' : 'remote.origin.url';
  let result = spawnSync(${JSON.stringify(realGit)}, ['-C', root, 'config', '--get-all', key], { encoding: 'utf8' });
  if (result.status && key.endsWith('pushurl')) result = spawnSync(${JSON.stringify(realGit)}, ['-C', root, 'config', '--get-all', 'remote.origin.url'], { encoding: 'utf8' });
  process.stdout.write(result.stdout); process.exit(result.status ?? 1);
}
const result = spawnSync(${JSON.stringify(realGit)}, original, { stdio: 'inherit' }); process.exit(result.status ?? 1);
`,
  );
  writeFileSync(
    join(bin, "gh"),
    `#!${process.execPath}
import { appendFileSync, copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
const args = process.argv.slice(2);
appendFileSync(${JSON.stringify(log)}, JSON.stringify(args) + '\\n');
if (process.env.GH_REPO || process.env.GH_HOST) process.exit(65);
if (args[0] === '--version' || args[0] === 'auth') process.exit(0);
// The forge's state: one pull request and the releases, as the kit's draft,
// reuse and target-release routes read them back (WO-221).
const statePath = ${JSON.stringify(state)};
const read = () => existsSync(statePath) ? JSON.parse(readFileSync(statePath, 'utf8')) : { pulls: {}, releases: {} };
const save = (value) => writeFileSync(statePath, JSON.stringify(value));
const flag = (name) => args.includes(name) ? args[args.indexOf(name) + 1] : undefined;
if (args[0] === 'pr' && args[1] === 'create') {
  copyFileSync(flag('--body-file'), ${JSON.stringify(body)});
  const forge = read();
  const number = 7 + Object.keys(forge.pulls).length;
  forge.pulls[number] = { number, draft: args.includes('--draft'), head: flag('--head'), base: flag('--base'), title: flag('--title'), body: readFileSync(flag('--body-file'), 'utf8'), ready: !args.includes('--draft') };
  save(forge);
  console.log('https://' + flag('--repo') + '/pull/' + number); process.exit(0);
}
if (args[0] === 'pr' && (args[1] === 'edit' || args[1] === 'ready')) {
  const forge = read();
  const pull = forge.pulls[args[2]];
  if (!pull) { console.error('no pull request ' + args[2]); process.exit(1); }
  if (args[1] === 'edit') {
    if (flag('--title') !== undefined) pull.title = flag('--title');
    if (flag('--body-file') !== undefined) { pull.body = readFileSync(flag('--body-file'), 'utf8'); copyFileSync(flag('--body-file'), ${JSON.stringify(body)}); }
  } else { pull.draft = false; pull.ready = true; }
  save(forge);
  console.log('https://' + flag('--repo') + '/pull/' + pull.number); process.exit(0);
}
if (args[0] === 'release' && args[1] === 'view') {
  const release = read().releases[args[2]];
  if (!release) { console.error('release not found'); process.exit(1); }
  console.log(JSON.stringify({ body: release.body, name: release.name, isDraft: false, isPrerelease: false, assets: [] })); process.exit(0);
}
if (args[0] === 'release' && args[1] === 'create') {
  const forge = read();
  forge.releases[args[2]] = { name: flag('--title'), body: readFileSync(flag('--notes-file'), 'utf8'), repo: flag('--repo') };
  save(forge);
  console.log('https://' + flag('--repo') + '/releases/tag/' + args[2]); process.exit(0);
}
process.exit(64);
`,
  );
  for (const name of ["git", "gh"]) chmodSync(join(bin, name), 0o755);
  Object.assign(env, {
    PATH: `${bin}:${env.PATH}`,
    GIT_CONFIG_GLOBAL: global,
    GIT_CONFIG_NOSYSTEM: "1",
  });
  return { log, body, bin, state };
}

export const publicationVocabulary = {
  types: [
    "build",
    "chore",
    "ci",
    "docs",
    "feat",
    "fix",
    "perf",
    "refactor",
    "revert",
    "style",
    "test",
  ],
  terms: ["DotLn", "launchpad", "gem", "gems", "mask", "masks"],
};
export const publicationGrant = {
  grantId: "operator.target-publish",
  version: 1,
  grantedBy: "operator",
  repo: "target",
  effects: ["repo.push", "pr.open"],
  operations: ["repo.push", "pr.open"],
  reason: "Operator grant for synthetic fixture publication",
};
