const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const outputPath = path.join(__dirname, "../outputs");

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

// Remove internal backend paths from Python error messages
const sanitizeErrorMessage = (message, filePath) => {
    if (!message) {
        return "";
    }

    return message
        .replaceAll(filePath, path.basename(filePath))
        .trim();
};

const executePython = (filePath, inputFilePath, timeout = 10000) => {
    return new Promise((resolve, reject) => {
        const command = `python3 "${filePath}" < "${inputFilePath}"`;

        exec(command, { timeout }, (error, stdout, stderr) => {

            if (error) {
                if (error.killed) {
                    return reject({
                        type: "Time Limit Exceeded",
                        message: "Program exceeded the execution time limit.",
                    });
                }

                const errorOutput = sanitizeErrorMessage(
                    stderr,
                    filePath
                );

                const isCompilationError =
                    /SyntaxError|IndentationError|TabError/.test(errorOutput);

                if (isCompilationError) {
                    return reject({
                        type: "Compilation Error",
                        message: errorOutput || "Compilation failed.",
                    });
                }

                let runtimeMessage = errorOutput;

                if (!runtimeMessage && error.code !== undefined) {
                    runtimeMessage = `Process exited with code ${error.code}.`;
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
};

module.exports = {
    executePython,
};