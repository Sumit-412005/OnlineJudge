const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const outputPath = path.join(__dirname, "../outputs");

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executeJava = (filePath, inputFilePath, timeout = 10000) => {
    const dir = path.dirname(filePath);
    const className = path.basename(filePath, ".java");

    return new Promise((resolve, reject) => {

        // Step 1: Compile the Java program
        const compileCommand = `javac "${filePath}"`;

        exec(compileCommand, { timeout }, (compileError, stdout, stderr) => {

            if (compileError) {
                return reject({
                    type: "Compilation Error",
                    message: stderr || compileError.message,
                });
            }

            // Step 2: Execute the compiled Java program
            const runCommand =
                `java -cp "${dir}" ${className} < "${inputFilePath}"`;

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
                        runtimeMessage = `Process terminated by ${runtimeError.signal}.`;
                    }

                    if (!runtimeMessage && runtimeError.code !== undefined) {
                        runtimeMessage = `Process exited with code ${runtimeError.code}.`;
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
    executeJava,
};