const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function extractWebpInfo(buffer) {
    // Extract WebP information
    const tempFile = path.join(__dirname, '../temp', `${Date.now()}.webp`);
    fs.writeFileSync(tempFile, buffer);
    
    // Use ffmpeg to convert
    const outputFile = path.join(__dirname, '../temp', `${Date.now()}.png`);
    
    try {
        await execPromise(`ffmpeg -i "${tempFile}" "${outputFile}" -y`);
        const imageBuffer = fs.readFileSync(outputFile);
        fs.unlinkSync(tempFile);
        fs.unlinkSync(outputFile);
        return imageBuffer;
    } catch (error) {
        fs.unlinkSync(tempFile);
        throw error;
    }
}

async function convertToMp4(inputPath, outputPath) {
    await execPromise(`ffmpeg -i "${inputPath}" -c:v libx264 -preset fast "${outputPath}" -y`);
}

module.exports = { extractWebpInfo, convertToMp4 };