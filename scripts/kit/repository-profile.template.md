# Repository profiles

A registered target repository (`dotln.config.json` → `repositories.<id>`) may
declare one profile document here, `docs/repositories/<id>.md`, treated as
repo-native authority. Once core's WO-073 lands, the role skill loads it on
demand for the active order, never at cold start; this kit revision's scripts
do not yet read it. Policy layers launchpad → class → repository: the more
specific layer adds to and narrows the wider one, and a profile's conventions
prevail over its class's where it states them. Keep a profile to what a session
needs in order to act in that repository; name no credential, hostname or
internal service. The convention is defined by core's WO-073; a later kit
revision carries its final text and this file is replaced with it.

## Template

~~~markdown
# <repository id> — profile

**Class:** <repository class>
**Base branch:** <branch>
**Checked:** <date or commit this profile was last checked against the repository>

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
