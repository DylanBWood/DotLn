# Repository profiles

The launchpad that registers a repository owns its profile. Set the
registration's optional `profile` to a relative normalized POSIX path,
conventionally `docs/repositories/<repository-id>.md`. The configurable
`repositoryProfiles` root defaults here; a relocated root still needs the
registration to name its actual path. Activation requires a readable regular
file contained in the launchpad and refuses symlinks, directories, absent or
unreadable files and paths outside it. It does not parse or approve content.
An undeclared profile produces one advisory and permits activation.

An observation order authors the profile of an established repository from
read-only evidence. The order establishing a new repository authors its initial
profile. Target applications' profiles belong in their owning launchpads or
forks, never in this reference repository. Keep the clean-room floor: use public
sources and generic descriptions, with no credentials, private identifiers,
internal services or employer material.

Use these sections, recording unknowns and the evidence needed to resolve them:

- Purpose and standards to emulate: what the repository does and which observed
  implementations establish its conventions.
- Commands: installation, build, focused and full checks, with their contexts.
- Local application startup: command, prerequisites and an observable readiness
  check.
- Branch and pull-request policy: naming, review expectations and the
  registration's permitted effects; prose grants no additional authority.
- Demonstrated architecture: paths and examples that substantiate the patterns
  new work should follow.
- Upstream references: pinned `owner/repo@tag path#anchor` entries, each with one
  line explaining why that section matters.
- Discovery conventions: an optional fenced `dotln-discovery` JSON block in the
  existing discovery producer's conventions shape. If that producer is given a
  Markdown profile, it requires exactly one such block and retains its existing
  target-relative path and resource checks; registration does not copy or
  transport a launchpad profile into a target.

A target executor reads the declared profile on demand for the active order's
`Repository:` id. Profiles are repo-native convention authority, with explicit
repository conventions prevailing over class conventions. Machine policy still
composes launchpad → class → repository: checks and supports add, authority
narrows, and only an exact registered-repository grant permits the existing
profile widening route. No layer can remove a class check.

Declare classes in `dotln.config.json` as an id-keyed `classes` object. Each
entry has `checks` and `supports` arrays. A check names evidence already declared
in the launchpad's active WorkOrder, authority envelope or support definitions;
a support names a definition in its loadout. An empty declaration preserves a
previous class name without adding equipment. The registration's
`automationLogins` and `linkHosts` arrays default to empty: they classify named
machine accounts and admit additional link hosts for automation, while every
item still goes through the existing source screen, triage and verification.
