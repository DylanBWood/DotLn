# For core

What this instance has learned that DotLn core should hear: what the kit
itself got wrong or made hard here. Each order's final review appends an entry
when it found anything during that order; each planning pass reads this file
at entry, appends its own entries and sets `answered` on those a release this
instance has taken answered. Nothing here leaves the instance on its own: the
operator paraphrases the entries they choose to a core planning pass, or sends
them.

An entry is appended, never rewritten; only its `answered` field changes, once.
Write it in generic words that name no private host, gateway, account,
repository or internal service: the local-terms and private-path screens judge
this file as they judge every document, and `node scripts/docs-check.mjs`
judges each entry's fields.

Every second-level heading below this text is an entry: the date, the order or
planning pass it came from, and one line. Directly under it is a `json` block
of three fields, then plain prose: what the kit did, what was expected, the
command and the message it printed, and the route used meanwhile.

- `kit`: the kit version the instance ran, `"vX.Y.Z"` as `UPSTREAM.md` names
  it.
- `stopsNextOrder`: `true` when it stops this instance's next order and no
  working route exists here, otherwise `false`.
- `answered`: `null`, or the version `"vX.Y.Z"` of the taken release that
  answered it.

For example:

````markdown
## 2026-11-09 — WO-002 — the update preview refused a path the kit had written

```json
{ "kit": "v0.123.0", "stopsNextOrder": false, "answered": null }
```

What the kit did, what was expected, the command and its message, and the
route used meanwhile.
````
