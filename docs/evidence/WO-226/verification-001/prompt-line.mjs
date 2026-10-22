import {
  harnessPromptLine,
  harnessPromptIntent,
} from "/Users/dylanwood/Projects/DotLn-wo226/packages/compiler/dist/src/harness.js";
const cases = [
  ["fence+blank", "\n```\n\nplanning: refute\n```"],
  ["fence info", "```text\nresume: verify\n```"],
  ["fence info is a prefix", "```planning: refute\nbody"],
  ["four backticks", "````\nresume: verify\n````"],
  ["tilde fence", "~~~\nresume: verify\n~~~"],
  ["crlf fence", "```\r\nresume: verify fable\r\n```"],
  [
    "pasted_content tag",
    '<pasted_content id="1">\nplanning: refute\n</pasted_content>',
  ],
  ["override inside fence", "```\noperator override: recovery\n```"],
  ["later prefix", "notes\nresume: verify"],
  ["verify fable 5.1", "resume: verify fable 5.1"],
  ["verify fable 5.2", "resume: verify fable 5.2"],
  ["verify fablex", "resume: verify fablex"],
  ["verify fable; direction", "resume: verify fable; do x"],
  ["refute full fable", "planning: refute full fable 5.1; scope"],
  ["blank only", "\n\n"],
  ["empty", ""],
];
for (const [name, prompt] of cases) {
  const line = harnessPromptLine(prompt);
  console.log(
    JSON.stringify({
      name,
      index: line.index,
      text: line.text,
      intent: harnessPromptIntent(prompt),
    }),
  );
}
