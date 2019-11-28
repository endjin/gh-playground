"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let issueTitle = core.getInput('issue_title');
            let issueUrl = core.getInput('issue_url');
            let issueAction = core.getInput('issue_action');
            if (!["opened", "closed", "reopened"].includes(issueAction)) {
                throw "Unsupported issue action";
            }
            let issueTitleRegex = new RegExp('(?<=\[)(.*?)(?=\])] (.*)');
            if (!issueTitleRegex.test(issueTitle)) {
                throw "Issue title was not in a valid format";
            }
            let matches = [...issueTitle.matchAll(issueTitleRegex)];
            let bundleDir = matches[0].values[0];
            let issueSummary = matches[1].values[0];
            let workspacePath = process.env.GITHUB_WORKSPACE;
            let wd = path.join(workspacePath, bundleDir);
            let porterManifest = path.join(wd, "porter.yaml");
            if (!fs.existsSync(porterManifest)) {
                throw `No bundle found at: ${bundleDir} `;
            }
            let issuesFile = path.join(wd, "ISSUES.md");
            let issueLine = `- [${issueSummary}](${issueUrl})`;
            if (issueAction == "opened") {
                fs.appendFileSync(issuesFile, "\n");
                fs.appendFileSync(issuesFile, issueLine);
            }
            else if (issueAction == "closed") {
                let contents = fs.readFileSync(issuesFile, "utf8");
                contents = contents.replace(issueLine, `~~${issueLine}~~`);
                fs.writeFileSync(issuesFile, contents);
            }
            else if (issueAction == "reopened") {
                let contents = fs.readFileSync(issuesFile, "utf8");
                contents = contents.replace(`~~${issueLine}~~`, issueLine);
                fs.writeFileSync(issuesFile, contents);
            }
            core.setOutput("quickstart_solution_path", bundleDir);
        }
        catch (error) {
            throw error;
        }
    });
}
exports.run = run;
run().catch(error => core.setFailed(error.message));
