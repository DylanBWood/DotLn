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
    body = join(base, "forge-body.md");
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
import { appendFileSync, copyFileSync } from 'node:fs';
const args = process.argv.slice(2);
appendFileSync(${JSON.stringify(log)}, JSON.stringify(args) + '\\n');
if (process.env.GH_REPO || process.env.GH_HOST) process.exit(65);
if (args[0] === '--version' || args[0] === 'auth') process.exit(0);
if (args[0] === 'pr' && args[1] === 'create') {
  copyFileSync(args[args.indexOf('--body-file') + 1], ${JSON.stringify(body)});
  console.log('https://' + args[args.indexOf('--repo') + 1] + '/pull/7'); process.exit(0);
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
  return { log, body, bin };
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
