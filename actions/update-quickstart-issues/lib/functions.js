"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function parseIssueTitle(issueTitle) {
    // Example input:
    // [porter/hello-world] An issue
    //
    // Groups:
    // 1: porter/hello-world
    // 2: An issue
    let issueTitleRegex = /(?<=\[)(.*?)(?=\])] (.*)/;
    let result = issueTitle.match(issueTitleRegex);
    if (result == null) {
        throw "Issue title was not in a valid format";
    }
    let bundleDir = result[1];
    let issueSummary = result[2];
    return {
        bundleDir: bundleDir,
        issueSummary: issueSummary
    };
}
exports.parseIssueTitle = parseIssueTitle;
