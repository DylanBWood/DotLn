# DotLn implementation overlay template

Use this reviewed Markdown template to add one implementation's facts to the
[base outline](base-outline.md). An overlay narrows and qualifies shared claims;
it does not copy, rewrite, or silently override them. Delete the instructional
text when filling the template, but retain explicit unknowns and exclusions.

## Identity and compatibility

- **Implementation name:** `<name>`
- **Overlay revision:** `<immutable revision>`
- **Source base revision:** `<full Git commit>`
- **Applicable implementation version:** `<version or unknown>`
- **Compatibility status:**
  `<exact | adapted | lossy | emulated | blocked | unverified>`
- **Audience extensions and local vocabulary:** `<links or none>`

Link compatibility claims to reviewed definitions, code, tests, and evidence. Do
not infer support from package presence alone.

## Installed shape

| Surface                      | Local selection | Status                       | Reviewed source | Evidence            |
| ---------------------------- | --------------- | ---------------------------- | --------------- | ------------------- |
| components and definitions   | `<value>`       | `<fixed publication status>` | `<link>`        | `<link or unknown>` |
| runtime targets and adapters | `<value>`       | `<fixed publication status>` | `<link>`        | `<link or unknown>` |
| integrations and ports       | `<value>`       | `<fixed publication status>` | `<link>`        | `<link or unknown>` |
| deployment and persistence   | `<value>`       | `<fixed publication status>` | `<link>`        | `<link or unknown>` |
| projections and UI hosts     | `<value>`       | `<fixed publication status>` | `<link>`        | `<link or unknown>` |

The status cells must use `vision`, `specified`, `planned`, `implemented`,
`verified`, `blocked`, or `deprecated`. Unknown evidence remains `unknown` in
the evidence cell; it is not promoted to `verified`.

## Local workflows and roles

Describe implementation-specific workstreams, roles, handoffs, continuations,
and operating procedures. For each consequential workflow, link its local
source, authority envelope, expected evidence, recovery path, and owner.

## Authority, security, and records

| Decision                   | Local rule | Source   | Verification        |
| -------------------------- | ---------- | -------- | ------------------- |
| allowed and denied effects | `<rule>`   | `<link>` | `<link or unknown>` |
| identity and delegation    | `<rule>`   | `<link>` | `<link or unknown>` |
| audit and logging          | `<rule>`   | `<link>` | `<link or unknown>` |
| retention and deletion     | `<rule>`   | `<link>` | `<link or unknown>` |
| backup and recovery        | `<rule>`   | `<link>` | `<link or unknown>` |
| incident response          | `<rule>`   | `<link>` | `<link or unknown>` |

Never include credentials, private configuration, unrestricted raw events, or
implementation secrets in an exportable overlay.

## Examples and operating evidence

For each local example or procedure, record its audience, source revision,
applicable version, status, evidence link, last verification, and known
limitations. Synthetic examples must be labeled synthetic.

## Exclusions and redaction

- **Confidential sections omitted:** `<list or none>`
- **Export/redaction policy:** `<reviewed link>`
- **Known coverage gaps:** `<list, including unknowns>`
- **Material limitations inherited unchanged from the base:** `<links>`

## Compilation receipt

Record the base revision, overlay revision, audience outline, output revision,
checker command, checker result, reviewer, and review date. A receipt proves
which inputs were used; it does not itself prove the output's claims.
