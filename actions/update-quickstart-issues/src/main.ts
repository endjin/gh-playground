import * as core from '@actions/core';
import * as fs from 'fs';
import * as path from 'path';

export async function run() {
  try {

    let issueTitle = <string>core.getInput('issue_title');
    let issueUrl = <string>core.getInput('issue_url');
    let issueAction = <string>core.getInput('issue_action');

    if (!["opened", "closed", "reopened"].includes(issueAction)) {
      throw "Unsupported issue action"
    }

    let issueTitleRegex = new RegExp('(?<=\[)(.*?)(?=\])] (.*)');

    if (!issueTitleRegex.test(issueTitle)) {
      throw "Issue title was not in a valid format"
    }

    let matches = [...issueTitle.matchAll(issueTitleRegex)];

    let bundleDir = matches[0].values[0];
    let issueSummary = matches[1].values[0];

    let workspacePath = <string>process.env.GITHUB_WORKSPACE;
    let wd = path.join(workspacePath, bundleDir);
    let porterManifest = path.join(wd, "porter.yaml");

    if (!fs.existsSync(porterManifest)){
      throw `No bundle found at: ${bundleDir} `
    }

    let issuesFile = path.join(wd, "ISSUES.md");
    let issueLine = `- [${issueSummary}](${issueUrl})`;

    if (issueAction == "opened"){
      fs.appendFileSync(issuesFile, "\n");
      fs.appendFileSync(issuesFile, issueLine);
    } else if (issueAction == "closed") {
      let contents = fs.readFileSync(issuesFile, "utf8");
      contents = contents.replace(issueLine, `~~${issueLine}~~`);
      fs.writeFileSync(issuesFile, contents);
    } else if (issueAction == "reopened") {
      let contents = fs.readFileSync(issuesFile, "utf8");
      contents = contents.replace(`~~${issueLine}~~`, issueLine);
      fs.writeFileSync(issuesFile, contents);
    }

    core.setOutput("quickstart_solution_path", bundleDir);

  } catch (error) {
    throw error;
  }
}

run().catch(error => core.setFailed(error.message));