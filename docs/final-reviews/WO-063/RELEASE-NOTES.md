## Release overview

Outward branch names, commit messages and pull-request text can now be checked through a pure function or stdin CLI before a publishing host uses them.

## Read before upgrading

The CLI exits with status 2 when the local-terms list is absent, so unavailable coverage cannot be mistaken for a pass. Publication integration remains assigned to WO-064.

## Substantive changes

- A fixed conventional subject and branch profile returns named rules and spans.
- Public vocabulary and the existing local-terms checker run independently; local findings expose only line locations and counts.
- The public vocabulary and conventional type set follow the configured control root.

## Progressive polish

Focused fixtures cover invalid shapes, normalized public vocabulary, private diagnostics, unavailable lists, configuration relocation and executable CLI behavior.

## Evidence and compatibility

This is an application patch with no runtime package, schema or dependency change. The implementation receipt records executable validation; independent verification and final review remain separate lifecycle steps.
