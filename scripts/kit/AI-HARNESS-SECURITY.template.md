# AI harness security baseline

A sanitized template, seeded once by the kit export and owned by this
instance. Record here the operator's dated posture for each AI coding harness
used with this launchpad. The repository does not install or enforce these
settings; the record is what a session and a reviewer check against. Re-check
vendor documentation and local behavior after upgrades, because names,
defaults, precedence and sandbox boundaries change.

**Current operating note:** `<date>`; `<harness> <version>` checked locally.

## Invariant

Discovering a credential, host, open port, connector or capable tool is not
authority to use it. Repository exploration stays inside the requested project
unless the operator explicitly expands scope. Sandbox controls are a backstop
for that judgment rule, not a replacement for it.

## Harnesses in use

| Harness  | Provider | Version checked | Roles using it | Sandbox and approval mode              |
| -------- | -------- | --------------- | -------------- | -------------------------------------- |
| `<name>` | `<name>` | `<version>`     | `<roles>`      | `<mode; operator-attested or observed>` |

Model names are not additional harnesses; they inherit the permissions of the
harness that launches them. Browser, web-search, plugin, app, MCP and other
connectors can have separate permission and network boundaries that neither a
shell sandbox nor this record governs automatically.

## Settings locations

| Harness  | User settings | Project settings | Local, ignored settings |
| -------- | ------------- | ---------------- | ----------------------- |
| `<name>` | `<path>`      | `<path>`         | `<path>`                |

Record which layer each harness actually loaded, as observed, and which wins
when two disagree.

## What stays out of this file

No credentials, hostnames, account identifiers, internal service names, or
policy text copied from an employer or a managed host. Describe the posture a
session runs under; do not describe infrastructure.

## Re-check log

| Date     | Harness  | Version     | What was re-checked | Result     |
| -------- | -------- | ----------- | ------------------- | ---------- |
| `<date>` | `<name>` | `<version>` | `<scope>`           | `<result>` |
