# Operator commands

Generated from `docs/KIT.md` by `node scripts/lib/operator-commands.mjs`; edit the kit guide's marked blocks, never this page.

The lines an operator types through the cycle of the DotLn kit at `v1.1.0`, step by step: each step's sentence, then the command blocks [the kit guide](KIT.md) marks for it, byte for byte, in its order. `node scripts/launchpad.mjs commands` prints this page in an instance before any install. The kit guide's linked section says more about each block, and a release's Read before upgrading says what that release changed for an instance.

## 1. A new instance

Once per instance. The first block makes your private repository from the starter, keeps the starter as the `upstream` remote, and installs and checks the kit. The second registers the private terms list, a file Git ignores, and it comes before any session publishes: while the list is absent a planning pass's publish refuses, and the files an order's branch changes are not screened. Look for one row from `node scripts/doctor.mjs` for each thing the kit needs of the machine (it refuses nothing, so read the rows), and for `local-terms list: unavailable` from `node scripts/harness.mjs check`, which is expected until the second block has run. After the copy, replace the example's entries with your own, one a line: under `refuse:` every name that must never reach a commit, under `context:` names that are also ordinary words. Then run the last line again; it prints `local-terms list: present` with your counts. If a `doctor` row reads `unmet`, apply the remedy it names and run it again; if the terms check prints `FAIL`, reword the line it names. The instance runs Claude Code alone until its `dotln.config.json` elects another host.

In the kit guide: [First steps](KIT.md#first-steps).

```sh
gh repo create <org>/<name> --private
git clone --no-tags <starter url> <name>
cd <name>
node scripts/doctor.mjs
git remote rename origin upstream
git config remote.upstream.tagOpt --no-tags
git remote add origin <private url>
git push -u origin main
node scripts/bootstrap.mjs
node scripts/harness.mjs check
```

```sh
mkdir -p docs/control/local
cp scripts/kit/terms.example.txt docs/control/local/terms.txt
npm run terms -- check CLAUDE.md README.md
```

## 2. The first planning pass

In a Claude Code session on the instance's clean `main`, type this phrase as a message of its own, with nothing else in it. The pass starts its planning branch, files the instance's orders and sequence, has one background worker refute them, and opens a pull request that you merge with a merge commit. `WO-001`, environment truth, is already the one entry of the starter's sequence, so it can run before this pass (step 3). Look for the pull request's URL when the pass ends. If its publish refuses because the terms list is absent, register the list as step 1 says, with your own entries in place of the example's, and ask the session to publish again; if it refuses on a line, it names the file and the line and never the entry, so ask the session to reword that line. A pass never takes a starter update: only your word in a plain session does (step 5).

In the kit guide: [Planning in this instance](KIT.md#planning-in-this-instance).

```text
planning: first pass
```

## 3. Running an order

From clean `main`, the first block starts an order in its own worktree, a sibling folder named `<name>-woNNN`, and prepares it; the first order is `WO-001` at `docs/work-orders/WO-001-environment-truth.md`. Open a Claude Code session in that folder and type the three phrases one at a time, each as a message of its own in a fresh session once the phase before it has finished: `resume: next` does the work, `resume: verify` checks it independently, and `resume: final review` reviews it and opens its pull request. Or type `drive: WO-NNN` in a session in `main`, which runs the phases in fresh sessions and stops for your merge. Look for `Carried the local-terms list into` in the start's output, which says the order's worktree holds your list; if it prints `No local-terms list` instead, register the list as step 1 says, in `main` and in the new folder, before the order publishes. Each phase ends by saying what it recorded. If a verification or a final review fails, type `resume: fix` in the worktree, then `resume: verify` and `resume: final review` again. `resume: status` says where an order stands at any time (product 07's phrase table names each phrase).

In the kit guide: [First steps](KIT.md#first-steps).

```sh
npm run worktree -- start WO-NNN docs/work-orders/WO-NNN-<slug>.md
```

```text
resume: next
resume: verify
resume: final review
```

## 4. Closing it

Merge the order's pull request with a merge commit, never a squash or a rebase: the close needs the order's branch in the history of `main`, which either rewrites. Then type this phrase as a message of its own in a session in the instance's `main`. The close updates `main`, publishes the order's tag and Release, and removes the order's worktree and branch. Look for the tag and the Release on the repository, and for the sibling folder to be gone. If the close stops, it names what it found; mend that and type the phrase again, since the close checks a Release that already exists and never publishes one twice.

In the kit guide: [First steps](KIT.md#first-steps).

```text
resume: release close
```

## 5. Taking a release

Take a release on your own word, never in a planning pass, and read its Read before upgrading first: tell a plain session in `main` to take the starter update, or type these lines yourself, one at a time. The first block previews the starter's revision and changes nothing: read its rows, above all each `both changed:` file and each `refused` kit file. The second takes the update on a `chore/` branch, regenerates what this instance generates and opens the update's pull request, which you merge with a merge commit; the third finishes in `main`. Stop after the `git merge` line. For each `both changed:` file, whether or not the merge stopped on it, run `git checkout main -- <path>` to keep this instance's bytes; where that checkout says the path did not match any file known to Git, this instance deleted the file, so run `git rm <path>` to keep it deleted. If the merge stops on `.claude/harness-manifest.json`, as it can where this instance has a host the starter lacks, run `git checkout main -- .claude/harness-manifest.json`, which the next line's emit rewrites. Then go on from the emit. If the publish refuses, the refusal says what to do; if the finish refuses, it names the fact, and past its time bound it prints the lines that finish by hand.

In the kit guide: [Taking upstream updates](KIT.md#taking-upstream-updates).

```sh
git config remote.upstream.tagOpt --no-tags
git fetch --no-tags upstream
git worktree add --detach .runtime/upstream-preview upstream/main
node .runtime/upstream-preview/scripts/launchpad.mjs preview --from upstream/main
git worktree remove .runtime/upstream-preview
```

```sh
git switch -c chore/starter-update
git merge upstream/main
node scripts/harness.mjs emit
node scripts/lineage.mjs index
npm run sync
git add -A
git commit -m "Take the starter update"
node scripts/launchpad.mjs update --publish --from upstream/main --title "<title>" --body-file <path>
```

```sh
git switch main
node scripts/launchpad.mjs update --finish
```

## 6. Registering a repository

To work on another repository, ask a planning pass to file its registration order from the values you state: the repository under `repositories` in `dotln.config.json`, its profile, the outward vocabulary and your grant. For a team's application repository ask for `"records": "instance"`, so that no order's record is committed into the team's repository. The order's executor records the clone with this command; you merge that order before any target order starts, and each target order then runs like any other (step 3). Look for the registration order's pull request, and merge it first. If a plan check, a document gate or `node scripts/bootstrap.mjs` names a repository whose clone is not recorded, run this command with the repository's id and the clone's absolute path.

In the kit guide: [First steps](KIT.md#first-steps).

```sh
npm run worktree -- clone <id> <absolute-path>
```

## 7. Telling core

Read the instance's `FOR-CORE.md`, where its final reviews and planning passes write what the kit got wrong or made hard. Each entry says which kit version it met, whether it stops the instance's next order and whether a release has answered it. Paraphrase the entries you choose into a core planning pass, or send them yourself: nothing leaves the instance unless you carry it. A file that holds only the form of an entry has nothing to send. If the document gate refuses the file, it names the entry and the field to mend.

In the kit guide: [Planning in this instance](KIT.md#planning-in-this-instance).

```sh
cat FOR-CORE.md
```
