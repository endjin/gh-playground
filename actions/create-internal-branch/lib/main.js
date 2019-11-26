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
const github = __importStar(require("@actions/github"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = process.env.GITHUB_TOKEN;
            const octokit = new github.GitHub(token);
            let ownerAndRepoName = process.env.GITHUB_REPO;
            let repoSplits = splitWithRemainder(ownerAndRepoName, "/", 1);
            let owner = repoSplits[0];
            let repo = repoSplits[1];
            let ref = "refs/head/forks/" + process.env.GITHUB_HEAD_REF;
            let sha = process.env.GITHUB_SHA;
            yield octokit.git.createRef({
                owner: owner,
                repo: repo,
                ref: ref,
                sha: sha,
            });
        }
        catch (error) {
            throw error;
        }
    });
}
exports.run = run;
function splitWithRemainder(input, separator, limit) {
    let splits = input.split(separator);
    let result;
    if (splits.length > limit) {
        result = splits.splice(0, limit);
        result.push(splits.join(separator));
    }
    else {
        result = splits;
    }
    return result;
}
run().catch(error => core.setFailed(error.message));
