import { runGit } from "./git.mjs";
import { loadConfig } from "./config.mjs";

// An instance declares its exemption in repository data. Missing data grants
// no exemption; the publishing user's mutable Git identity never decides it.

export const contributionSignoffRules = (root) => {
  const operatorAuthor = loadConfig(root).contributions?.operatorAuthor;
  const base = runGit(root, [
    "rev-parse",
    "--verify",
    "refs/remotes/origin/main^{commit}",
  ]);
  const commits = runGit(root, ["rev-list", "--reverse", `${base}..HEAD`])
    .split("\n")
    .filter(Boolean);
  return commits.map((commit) => {
    const [name, email, message] = runGit(
      root,
      ["show", "-s", "--format=%an%x00%ae%x00%B", commit],
      { trim: false },
    ).split("\0");
    const author = `${name} <${email}>`;
    const exempt = author === operatorAuthor;
    const trailers = runGit(root, ["interpret-trailers", "--parse"], {
      input: message,
    });
    const signed = trailers
      .split("\n")
      .some(
        (line) =>
          /^Signed-off-by:[ \t]+/i.test(line) &&
          line
            .replace(/^[^:]+:[ \t]+/, "")
            .replace(
              /<([^<>]+)>$/,
              (_match, address) => `<${address.toLowerCase()}>`,
            ) === `${name} <${email.toLowerCase()}>`,
      );
    const pass = exempt || signed;
    // Commit IDs identify findings without repeating contributors' identities.
    return {
      pass,
      line: `${pass ? "PASS" : "FAIL"} contribution-signoff ${commit.slice(0, 12)}: observed ${exempt ? "operator author" : signed ? "matching author sign-off" : "outside author without matching sign-off"}; expected ${exempt ? "operator exemption (no sign-off required)" : "Signed-off-by trailer matching the commit author (DCO 1.1); add it with git commit --amend --signoff after reviewing the DCO"}`,
    };
  });
};
