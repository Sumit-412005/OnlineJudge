const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const outputPath = path.join(__dirname, '../outputs');

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executePython = (filePath, inputFilePath, timeout = 10000) => {
    return new Promise((resolve, reject) => {
        const command = `python3 "${filePath}" < "${inputFilePath}"`;
        console.log("Executing command:", command);
        exec(command, { timeout }, (error, stdout, stderr) => {
            // Only a runtime failure or timeout (which sets `error`) counts as a failure;
            // stderr alone (e.g. warnings) is not treated as an error.
            if (error) {
                console.error("Error:", error.message);
                return reject({ error: error.message, stderr });
            }
            console.log("Execution result:", stdout);
            resolve(stdout);
        });
    });
};

module.exports = {
    executePython,
};
