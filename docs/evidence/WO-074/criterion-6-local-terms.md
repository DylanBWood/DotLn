# WO-074 criterion 6: the export against the launchpad that holds the operator's local-terms list

The order stays uncommitted until final review, so this worktree's HEAD (28d32e26, equal to main) lacks scripts/launchpad.mjs and scripts/kit/, and an export from it refuses by name (D002; the step 5 observation below). Step 10 therefore runs from a committed bounded copy of this work tree (the fixtures' shape: scripts/, packages/beacons, the build-free modules, package.json, package-lock.json, the license files, .gitignore and the three documents), with DOTLN_LAUNCHPAD naming the main checkout, which holds the operator's list. The list's contents are never read or printed.

- Kit source: the committed copy at 91e4a6be8da1fa37dc3884cb79c5a98fbe8754b4 (TOOL_ROOT of the command), built from this worktree after its last kit edit.
- The copy's scripts/launchpad.mjs as exported: sha256 067cd50407532ed51779c3827c5d3cbe0a65644add7ba443243f198543c149ff (KIT-MANIFEST.json); the work tree's scripts/launchpad.mjs: sha256 067cd50407532ed51779c3827c5d3cbe0a65644add7ba443243f198543c149ff.
- Launchpad: /Users/dylanwood/Projects/DotLn at 28d32e26fade7b7d2fe6ed00c43707ad58b87f70 (tag v0.69.2), the holder of docs/control/local/terms.txt.
- Observed 2026-10-09T05:04:26Z.

Command:

    DOTLN_LAUNCHPAD=/Users/dylanwood/Projects/DotLn node <committed-copy>/scripts/launchpad.mjs export <session-scratch>/kit-main

Observed:

    Exported the DotLn kit of 91e4a6be8da1fa37dc3884cb79c5a98fbe8754b4 (untagged) to <session-scratch>/kit-main: 282 kit files in KIT-MANIFEST.json, 23 instance seeds.
    local-terms list: present (305 texts checked)
    exit status: 0

Step 5 as written, from this worktree at HEAD 28d32e26:

    npm run launchpad -- export "$(mktemp -d)/kit"

    error: kit file is absent at 28d32e26fade: scripts/kit/AI-HARNESS-SECURITY.template.md
    exit status: 1 (refused by name: the templates are not at HEAD until final review commits them; the fixture suite runs the same check from the committed copy)
