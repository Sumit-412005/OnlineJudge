const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const outputPath = path.join(__dirname, '../outputs');

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filePath, inputFilePath, timeout = 10000) => {
    const jobId = path.basename(filePath).split(".")[0];
    const outputFilename = `${jobId}.out`;
    const outPath = path.join(outputPath, outputFilename);

    return new Promise((resolve, reject) => {
        const command = `g++ "${filePath}" -o "${outPath}" && "${outPath}" < "${inputFilePath}"`;
        exec(command, { timeout }, (error, stdout, stderr) => {
            // A compile/runtime failure or timeout sets `error`; stderr alone (e.g. warnings)
            // does not mean the program failed, so we only reject on a real error.
            if (error) {
                return reject({ error: error.message, stderr });
            }
            resolve(stdout);
        });
    });
};

module.exports = {
    executeCpp,
};
