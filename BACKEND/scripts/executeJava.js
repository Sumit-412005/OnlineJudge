// executeJava.js
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const outputPath = path.join(__dirname, '../outputs');

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executeJava = (filePath, inputFilePath, timeout = 10000) => {
    const dir = path.dirname(filePath);
    const filename = path.basename(filePath);

    return new Promise((resolve, reject) => {
        const command = `javac "${filePath}" && java -cp "${dir}" ${filename.replace('.java', '')} < "${inputFilePath}"`;
        console.log("Executing command:", command);
        exec(command, { timeout }, (error, stdout, stderr) => {
            // Only a compile/runtime failure or timeout (which sets `error`) counts as a failure;
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
    executeJava,
};
