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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core = __importStar(require("@actions/core"));
var github = __importStar(require("@actions/github"));
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var inValue, time, context, contextPayloadJson, github_token, octokit_restClient, pr, prJson, refFQ, updateRef, error_1, updateRefJson, newComment, newCommentJson, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 11, , 12]);
                    core.info("*** MY INFO LOGS *** Input-Output");
                    inValue = core.getInput('in-value');
                    core.info(inValue);
                    time = (new Date()).toTimeString();
                    core.info(time);
                    core.setOutput('out-value', time);
                    context = github.context;
                    if (!context.payload.issue || !context.payload.issue.pull_request) {
                        core.setFailed('No pull request found in context');
                        contextPayloadJson = JSON.stringify(context.payload, undefined, 2);
                        core.error(contextPayloadJson);
                        return [2 /*return*/];
                    }
                    github_token = core.getInput('GITHUB_TOKEN');
                    octokit_restClient = new github.GitHub(github_token);
                    core.info("*** MY INFO LOGS *** Get Pull Request");
                    return [4 /*yield*/, octokit_restClient.pulls.get({
                            owner: context.repo.owner,
                            repo: context.repo.repo,
                            pull_number: context.payload.issue.number
                        })];
                case 1:
                    pr = _a.sent();
                    core.info("*** MY INFO LOGS *** Get Pull Request response");
                    prJson = JSON.stringify(pr.data, undefined, 2);
                    core.info(prJson);
                    refFQ = "heads/" + pr.data.base.ref;
                    core.info("*** MY INFO LOGS *** Update Ref Request");
                    core.info("\nRef: " + refFQ +
                        "\nSha: " + pr.data.head.sha);
                    updateRef = void 0;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 9]);
                    return [4 /*yield*/, octokit_restClient.git.updateRef({
                            owner: context.repo.owner,
                            repo: context.repo.repo,
                            ref: refFQ,
                            sha: pr.data.head.sha,
                            force: false
                        })];
                case 3:
                    updateRef = _a.sent();
                    return [3 /*break*/, 9];
                case 4:
                    error_1 = _a.sent();
                    if (!error_1.message.includes("Update is not a fast forward")) return [3 /*break*/, 7];
                    return [4 /*yield*/, octokit_restClient.issues.createComment({
                            owner: context.repo.owner,
                            repo: context.repo.repo,
                            issue_number: context.payload.issue.number,
                            body: "Failed!  Cannot do a fast forward!" +
                                //For this example, you would check out the experiment branch, and then rebase it onto the master branch as follows:
                                "\n1) Pleasy try to checkout head (source) branch, and then rebase it onto base (target) branch, and recreate the Pull Request." +
                                "\n2) Or merge using 'Merge pull request' button. Then delete head (source) branch, and recreate from merged base (target) branch."
                        })];
                case 5:
                    _a.sent();
                    core.info("*** MY INFO LOGS *** Close Pull Request");
                    return [4 /*yield*/, octokit_restClient.pulls.update({
                            owner: context.repo.owner,
                            repo: context.repo.repo,
                            pull_number: context.payload.issue.number,
                            state: "closed"
                        })];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
                case 7:
                    core.setFailed(error_1.message);
                    return [2 /*return*/];
                case 8: return [3 /*break*/, 9];
                case 9:
                    core.info("*** MY INFO LOGS *** Update Ref Response");
                    updateRefJson = JSON.stringify(updateRef.data, undefined, 2);
                    core.info(updateRefJson);
                    return [4 /*yield*/, octokit_restClient.issues.createComment({
                            owner: context.repo.owner,
                            repo: context.repo.repo,
                            issue_number: context.payload.issue.number,
                            body: "Success! Fast Forward action executed!"
                        })];
                case 10:
                    newComment = _a.sent();
                    core.info("*** MY INFO LOGS *** Create Comment Response");
                    newCommentJson = JSON.stringify(newComment.data, undefined, 2);
                    core.info(newCommentJson);
                    return [3 /*break*/, 12];
                case 11:
                    error_2 = _a.sent();
                    core.error(error_2.message);
                    return [3 /*break*/, 12];
                case 12: return [2 /*return*/];
            }
        });
    });
}
;
run();
