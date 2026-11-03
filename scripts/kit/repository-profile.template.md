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

A profile is a standing document: it states the repository as it is at the
commit its `Current at:` field names. When the repository changes, replace the
sentences that are now wrong and move `Current at:` forward; the history of how
the repository got there lives in the orders and decisions that changed it.

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
~~~
