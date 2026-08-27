const fs = require("fs");
const path = require("path");
const { generateFile } = require("../services/generateFile");
const { executeCpp } = require("../scripts/executeCpp");
const { executePython } = require("../scripts/executePython");
const { executeJava } = require("../scripts/executeJava");
const Solution = require("../models/Solution");
const Problem = require("../models/Problem");

const TIMEOUT_MS = 10000; // 10 seconds

// Best-effort removal of the generated source file / compiled artifacts for a submission.
const cleanupArtifacts = (filePath, language) => {
    if (!filePath) return;

    // Remove the generated source code (Java lives in its own per-submission directory).
    try {
        if (language === "java") {
            fs.rmSync(path.dirname(filePath), { recursive: true, force: true });
        } else if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    } catch (error) {
        console.error("Cleanup (source file) failed:", error.message);
    }

    // Remove the compiled C++ binary (outputs/<jobId>.out), if any.
    try {
        const jobId = path.basename(filePath, path.extname(filePath));
        const outFile = path.join(__dirname, "../outputs", `${jobId}.out`);
        if (fs.existsSync(outFile)) {
            fs.unlinkSync(outFile);
        }
    } catch (error) {
        console.error("Cleanup (output file) failed:", error.message);
    }
};

const submitSolution = async (req, res) => {
    const { language, code } = req.body;
    let filePath;

    try {
        const { id: problemId } = req.params;
        const userId = req.user.id;

        if (!code || !language) {
            return res.status(400).json({
                success: false,
                error: "Code or language is missing",
            });
        }

        const problem = await Problem.findById(problemId).populate("testCases");
        if (!problem) {
            return res.status(404).json({
                success: false,
                error: "Problem not found",
            });
        }

        filePath = generateFile(language, code);

        // Unique identifier for this submission, used to name per-testcase input files
        // so that concurrent submissions never collide.
        const jobId = language === "java"
            ? path.basename(path.dirname(filePath)) // the unique sub-directory name
            : path.basename(filePath, `.${language}`);

        const inputOutputPairs = problem.testCases.map((testCase) => ({
            input: testCase.input,
            output: testCase.output,
        }));

        const inputDirectory = path.join(__dirname, "../testcases/inputs");
        if (!fs.existsSync(inputDirectory)) {
            fs.mkdirSync(inputDirectory, { recursive: true });
        }

        const results = [];
        let finalVerdict = "Accepted";
        let failedTestCase = null;

        for (const [index, { input, output }] of inputOutputPairs.entries()) {
            const inputFilePath = path.join(inputDirectory, `${jobId}_${index}.txt`);
            fs.writeFileSync(inputFilePath, input);

            try {
                let execResult;
                switch (language) {
                    case "cpp":
                        execResult = await executeCpp(filePath, inputFilePath, TIMEOUT_MS);
                        break;
                    case "python":
                        execResult = await executePython(filePath, inputFilePath, TIMEOUT_MS);
                        break;
                    case "java":
                        execResult = await executeJava(filePath, inputFilePath, TIMEOUT_MS);
                        break;
                    default:
                        throw new Error("Unsupported language");
                }

                execResult = execResult.trim();
                const verdict = execResult === output.trim() ? "Accepted" : "Wrong Answer";
                results.push({ input, expectedOutput: output, actualOutput: execResult, verdict });

                if (verdict !== "Accepted") {
                    finalVerdict = verdict;
                    failedTestCase = index + 1;
                    break;
                }
            } catch (error) {
                finalVerdict = "Incorrect Code";
                failedTestCase = index + 1;
                results.push({
                    input,
                    expectedOutput: output,
                    actualOutput: error.error || error.stderr || error.message || "Error",
                    verdict: "Incorrect Code",
                });
                break;
            } finally {
                if (fs.existsSync(inputFilePath)) {
                    fs.unlinkSync(inputFilePath);
                }
            }
        }

        // Persist the submission so that submission history and the "solved" status work.
        try {
            await Solution.create({
                user: userId,
                problem: problemId,
                code,
                verdict: finalVerdict,
            });
        } catch (saveError) {
            console.error("Failed to save solution:", saveError.message);
        }

        return res.json({ success: true, finalVerdict, failedTestCase, results });
    } catch (error) {
        console.error("Error submitting solution:", error);
        return res.status(500).json({
            success: false,
            error: "Something went wrong",
        });
    } finally {
        cleanupArtifacts(filePath, language);
    }
};

module.exports = {
    submitSolution,
};
