import * as core from '@actions/core';
import * as fs from 'fs';
import * as path from 'path';
import { parseIssueTitle } from './functions';

export function run() {
  try {

    let issueTitle = <string>core.getInput('issue_title');
    let issueUrl = <string>core.getInput('issue_url');
    let issueAction = <string>core.getInput('issue_action');

    if (!["opened", "closed", "reopened"].includes(issueAction)) {
      throw new Error("Unsupported issue action");
    }

    core.info("Parsing issue title...");

    let parsedIssueTitle = parseIssueTitle(issueTitle);
    let bundleDir = parsedIssueTitle.bundleDir;
    let issueSummary = parsedIssueTitle.issueSummary;

    core.info("Bundle directory is: " + bundleDir);
    core.info("Issue summary is: " + issueSummary);

    let workspacePath = <string>process.env.GITHUB_WORKSPACE;
    let wd = path.join(workspacePath, bundleDir);
    let porterManifest = path.join(wd, "porter.yaml");

    if (!fs.existsSync(porterManifest)){
      throw new Error(`No bundle found at: ${bundleDir}`);
    }

    let issuesFile = path.join(wd, "ISSUES.md");
    let issueLine = `[${issueSummary}](${issueUrl})`;

    if (issueAction == "opened") {
      core.info("Adding issue to issues file...");
      fs.appendFileSync(issuesFile, "\n- ");
      fs.appendFileSync(issuesFile, issueLine);
    } else if (issueAction == "closed") {
      core.info("Adding strikethrough to issue in issues file...");
      let contents = fs.readFileSync(issuesFile, "utf8");
      contents = contents.replace(issueLine, `~~${issueLine}~~`);
      fs.writeFileSync(issuesFile, contents);
    } else if (issueAction == "reopened") {
      core.info("Removing strikethrough from issue in issues file...");
      let contents = fs.readFileSync(issuesFile, "utf8");
      contents = contents.replace(`~~${issueLine}~~`, issueLine);
      fs.writeFileSync(issuesFile, contents);
    }

    core.setOutput("quickstart_solution_path", bundleDir);

  } catch (error) {
    core.setFailed(error.message)
  }
}

run();