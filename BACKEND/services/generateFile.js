const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const dirCodes = path.join(__dirname, '../codes');

const createLanguageDirs = () => {
    const languages = ['cpp', 'java', 'python'];
    languages.forEach(lang => {
        const langPath = path.join(dirCodes, lang);
        if (!fs.existsSync(langPath)) {
            fs.mkdirSync(langPath, { recursive: true });
            console.log(`Directory created: ${langPath}`);
        }
    });
};

createLanguageDirs();

const generateFile = (language, code) => {
    const jobId = uuid();
    let filePath;

    if (language === 'java') {
        // A Java public class must be named "Main", so every submission gets its own
        // directory to avoid concurrent submissions overwriting each other's Main.java.
        const jobDir = path.join(dirCodes, 'java', jobId);
        fs.mkdirSync(jobDir, { recursive: true });
        filePath = path.join(jobDir, 'Main.java');
    } else {
        const langDir = path.join(dirCodes, language);
        if (!fs.existsSync(langDir)) {
            fs.mkdirSync(langDir, { recursive: true });
        }
        filePath = path.join(langDir, `${jobId}.${language}`);
    }

    fs.writeFileSync(filePath, code);
    return filePath;
};

module.exports = {
    generateFile,
};
