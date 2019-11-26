import * as core from '@actions/core';
import * as github from '@actions/github';

export async function run() {
  try {
    const token = <string>process.env.GITHUB_TOKEN;

    const octokit = new github.GitHub(token);

    let ownerAndRepoName = <string>process.env.GITHUB_REPOSITORY;
    let repoSplits = splitWithRemainder(ownerAndRepoName, "/", 1);
    let owner = repoSplits[0];
    let repo = repoSplits[1];

    let ref = "refs/head/forks/" + <string>process.env.GITHUB_HEAD_REF
    let sha = <string>process.env.GITHUB_SHA

    await octokit.git.createRef({
      owner: owner,
      repo: repo,
      ref: ref,
      sha: sha,
    });

  } catch (error) {
    throw error;
  }
}

function splitWithRemainder(input: string, separator: string, limit: number) {
  let splits = input.split(separator);

  let result: string[];
  if (splits.length > limit) {
      result = splits.splice(0, limit);
      result.push(splits.join(separator));
  } else {
      result = splits;
  }

  return result;
}

run().catch(error => core.setFailed(error.message));