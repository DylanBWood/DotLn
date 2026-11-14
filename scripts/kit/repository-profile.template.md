# Repository profiles

A registered target repository (`dotln.config.json` → `repositories.<id>`) may
declare one profile document through the registration's `profile` path,
conventionally `docs/repositories/<id>.md`, treated as repo-native authority.
Activation requires it to be a readable regular file inside the launchpad, and
a role reads it on demand for an order on that repository, never at cold start.
Policy layers launchpad → class → repository: the more specific layer adds to
and narrows the wider one, and a profile's conventions prevail over its class's
where it states them. Keep a profile to what a session needs in order to act in
that repository; name no credential, hostname or internal service.

An observation order authors the profile of an established repository from
read-only evidence. The order establishing a new repository authors its initial
profile.

A profile is a standing document: it states the repository as it is at the
commit its `Current at:` field names. When the repository changes, replace the
sentences that are now wrong and move `Current at:` forward; the history of how
the repository got there lives in the orders and decisions that changed it.

## Area notes

The profile is the entry and the index: it stays short and lists the area
notes beside it. What a session learns about one part of the repository is
written as an area note, one Markdown file under the directory that has the
profile's name without `.md`: `docs/repositories/<id>/` for
`docs/repositories/<id>.md`. A note opens with its block, one JSON object of
two fields between two marker lines:

- `paths`: the target paths the note covers, a non-empty list; each is
  relative to the target's root, written with forward slashes, and a directory
  may end in `/`;
- `commit`: the target commit the note was written at, as its full id.

Under the block the note states each rule the area follows with the file that
shows it, the exceptions found and what is unknown. The block is the only part
a program reads. `node scripts/docs-check.mjs` and the document gate refuse a
note whose block is missing or malformed, naming the file and the field, and
judge nothing in the prose. The dispatch briefing of an order on the repository
prints the profile's path and, for each note, its file, its paths, its commit
and the number of commits on the base branch of the registered clone that
touched those paths and are not in that commit's history, or `unknown` where
the clone does not hold the commit. A role reads the notes that cover the paths
its change touches, and where commits have touched them since, checks a rule
against the code before relying on it. The count is shown and refuses nothing.

A note is written or revised by a research order that studies one area; the
kit guide's §Planning in this instance gives the recipe. No step reads the
whole repository, and a note about a private repository stays in the instance
that registers it.

## Template

~~~markdown
# <repository id> — profile

**Class:** <repository class>
**Base branch:** <branch>
**Current at:** <commit>

This profile states the repository as it is at that commit, never its history.

## Purpose and standards to emulate

What the repository is for and which of its existing modules, tests or
documents a change should resemble.

## Commands

| Purpose | Command | Notes |
| ------- | ------- | ----- |
| install | `<command>` | |
| test    | `<command>` | |
| lint    | `<command>` | |
| build   | `<command>` | |

## Local application startup

How to run the application locally, what it needs, and how to tell it is up.

## Branch and pull-request policy

Branch naming, the base branch, required reviews and checks, and what a session
may never do here (push to the base branch, merge, tag).

## Demonstrated architecture

The patterns the repository already demonstrates, with one path each, so a
change follows them instead of introducing another.

## Upstream references

- `owner/repo@tag path#anchor` — one line on why this section matters here

## Agent skills

The target-relative skill directories at a pinned target commit and the client
discovery roots observed, or that none were observed. A relevant `SKILL.md`
and the references it selects are read as repository convention. Skill text
and the experimental `allowed-tools` field grant no effect authority: the
registered repository and host permissions still govern execution. Target
skills are not copied into the launchpad, and no client's discovery is claimed
that was not observed.

## Area notes

- [<area>](<repository id>/<area>.md) — the paths it covers, in one line
~~~

## A worked area note

For an invented repository registered as `orchard`, whose profile is
`docs/repositories/orchard.md`, the note
`docs/repositories/orchard/pricing.md`:

~~~markdown
# orchard — pricing

<!-- dotln-area-note:start -->
{ "paths": ["src/pricing/", "test/pricing/"], "commit": "3f1c9a7e5b2d4c6f8a0b1d2e3f4a5b6c7d8e9f01" }
<!-- dotln-area-note:end -->

## Rules

- A price is an integer count of minor units and never a fraction:
  `src/pricing/money.ts` (`Money`), and every test under `test/pricing/`
  builds one through `money()`.
- Discounts apply in the order `src/pricing/discounts/order.ts` lists; a new
  discount is added to that list and nowhere else.

## Exceptions

- `src/pricing/legacy-import.ts` reads decimal strings from the old export
  format and converts them at its boundary.

## Unknown

- Whether tax is rounded half to even everywhere: `src/pricing/tax.ts` was not
  read.
~~~
