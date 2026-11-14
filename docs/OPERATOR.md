# Operator commands

Generated from `docs/KIT.md` by `node scripts/lib/operator-commands.mjs`; edit the kit guide's marked blocks, never this page.

The lines an operator types through the cycle of the DotLn kit at `v1.0.0`, step by step: each step's sentence, then the command blocks [the kit guide](KIT.md) marks for it, byte for byte, in its order. `node scripts/launchpad.mjs commands` prints this page in an instance before any install. The kit guide's linked section says more about each block, and a release's Read before upgrading says what that release changed for an instance.

## 1. A new instance

Once per instance, clone the starter into a private repository with the starter kept as `upstream`, then install and check the runtime; the instance runs Claude Code alone, and its first order inspects no other host, until its `dotln.config.json` elects one.

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

## 2. The first planning pass

In a Claude Code session on the instance's clean `main`, type this phrase as a message of its own: the pass starts its planning branch, files the instance's orders and sequence, refutes them with one background worker and opens the pull request you merge with a merge commit.

In the kit guide: [Planning in this instance](KIT.md#planning-in-this-instance).

```text
planning: first pass
```

## 3. Running an order

From clean `main`, start each order in its own worktree with its id and its order's path (the first is `WO-001` at `docs/work-orders/WO-001-environment-truth.md`); in a session opened in that worktree, type each phase's phrase as a message of its own once the phase before it has completed, or type `drive: WO-NNN` in `main` to run the phases in fresh sessions until your merge (product 07's phrase table names each phase).

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

Merge the order's pull request with a merge commit, then type this phrase in a session in the instance's `main`: the close updates `main`, publishes the order's tag and Release and cleans up its worktree.

In the kit guide: [First steps](KIT.md#first-steps).

```text
resume: release close
```

## 5. Taking a release

On your word in a plain session in `main`, never in a planning pass, read the release's Read before upgrading, preview the starter's revision, take it on a `chore/` branch through its own pull request, merge that with a merge commit and finish in `main`.

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

A planning pass files the registration order (the repository under `repositories` in `dotln.config.json`, its profile, the outward vocabulary and the operator's grant); its executor records the clone, you merge that order before any target order starts, and each target order then runs like any other.

In the kit guide: [First steps](KIT.md#first-steps).

```sh
npm run worktree -- clone <id> <absolute-path>
```

## 7. Telling core

Read the instance's `FOR-CORE.md`, which its final reviews and planning passes write, and paraphrase the entries you choose to a core planning pass or send them yourself; nothing leaves the instance unless you carry it.

In the kit guide: [Planning in this instance](KIT.md#planning-in-this-instance).

```sh
cat FOR-CORE.md
```
