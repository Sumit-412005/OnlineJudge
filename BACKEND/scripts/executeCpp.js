const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const outputPath = path.join(__dirname, "../outputs");

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

// Remove internal backend paths from compiler/runtime messages
const sanitizeErrorMessage = (message, filePath) => {
    if (!message) {
        return "";
    }

    return message
        .replaceAll(filePath, path.basename(filePath))
        .trim();
};

const executeCpp = (filePath, inputFilePath, timeout = 10000) => {
    const jobId = path.basename(filePath).split(".")[0];
    const outPath = path.join(outputPath, `${jobId}.out`);

    return new Promise((resolve, reject) => {

        // Step 1: Compile the C++ program
        const compileCommand = `g++ "${filePath}" -o "${outPath}"`;

        exec(compileCommand, { timeout }, (compileError, stdout, stderr) => {

            if (compileError) {
                const compilationMessage =
                    sanitizeErrorMessage(stderr, filePath) ||
                    sanitizeErrorMessage(compileError.message, filePath) ||
                    "Compilation failed.";

                return reject({
                    type: "Compilation Error",
                    message: compilationMessage,
                });
            }

            // Step 2: Execute the compiled program
            const runCommand = `"${outPath}" < "${inputFilePath}"`;

            exec(runCommand, { timeout }, (runtimeError, stdout, stderr) => {

                if (runtimeError) {
                    if (runtimeError.killed) {
                        return reject({
                            type: "Time Limit Exceeded",
                            message: "Program exceeded the execution time limit.",
                        });
                    }

                    let runtimeMessage = stderr?.trim();

                    if (!runtimeMessage && runtimeError.signal) {
                        runtimeMessage =
                            `Process terminated by ${runtimeError.signal}.`;
                    }

                    if (!runtimeMessage && runtimeError.code !== undefined) {
                        runtimeMessage =
                            `Process exited with code ${runtimeError.code}.`;
                    }

                    if (!runtimeMessage) {
                        runtimeMessage =
                            "Program terminated unexpectedly during execution.";
                    }

                    return reject({
                        type: "Runtime Error",
                        message: runtimeMessage,
                    });
                }

                resolve(stdout);
            });
        });
    });
};

module.exports = {
    executeCpp,
};