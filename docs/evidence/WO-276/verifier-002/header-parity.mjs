import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import {
  readWorkOrder,
  readWorkOrderHeader,
} from "../../../../scripts/lib/work-order-document.mjs";
const cases = [
  {
    name: "standalone-inline-code",
    source:
      "# WO-999 — Fixture\n\n`Example\n**Objective:** quoted inside code\nend`\n\n**Track:** machinery\n\n**Objective:** real\n",
  },
  {
    name: "ordinary",
    source:
      "# WO-999 — Fixture\n\n**Model:** capable\n**Track:** machinery\n\n**Objective:** real\n",
  },
  {
    name: "multiline-inline-code",
    source:
      "# WO-999 — Fixture\n\n**Model:** capable `example\n**Objective:** quoted inside code\nend`\n**Track:** machinery\n\n**Objective:** real\n",
  },
  {
    name: "fenced-example",
    source:
      "# WO-999 — Fixture\n\n**Model:** capable\n\n```text\n**Objective:** quoted inside code\n```\n\n**Track:** machinery\n\n**Objective:** real\n",
  },
  {
    name: "quoted-example",
    source:
      "# WO-999 — Fixture\n\n**Model:** capable\n\n> **Objective:** quoted\n\n**Track:** machinery\n\n**Objective:** real\n",
  },
];
const fields = (order) =>
  order.header.map(({ label, value }) => ({ label, value }));
const result = cases.map(({ name, source }) => ({
  name,
  full: fields(readWorkOrder(source)),
  headerOnly: fields(readWorkOrderHeader(source)),
}));
assert.deepEqual(result[1].full, result[1].headerOnly);
assert.notDeepEqual(result[2].full, result[2].headerOnly);
assert.ok(result[2].full.some((x) => x.label === "Track"));
assert.ok(!result[2].headerOnly.some((x) => x.label === "Track"));
assert.ok(result[0].full.some((x) => x.label === "Track"));
assert.ok(!result[0].headerOnly.some((x) => x.label === "Track"));
writeFileSync(process.argv[2], JSON.stringify(result, null, 2) + "\n");
