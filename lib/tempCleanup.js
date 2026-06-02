const fs = require('fs');
const path = require('path');

function cleanupTempFolder(folderPath, maxAgeHours = 3) {
    if (!fs.existsSync(folderPath)) return;
    
    const now = Date.now();
    const maxAge = maxAgeHours * 60 * 60 * 1000;
    
    fs.readdir(folderPath, (err, files) => {
        if (err) return;
        
        for (const file of files) {
            const filePath = path.join(folderPath, file);
            fs.stat(filePath, (err, stats) => {
                if (err) return;
                
                if (now - stats.mtimeMs > maxAge) {
                    fs.unlink(filePath, () => {});
                }
            });
        }
    });
}

function startCleanupScheduler(folderPath, intervalHours = 3) {
    setInterval(() => {
        cleanupTempFolder(folderPath);
        console.log('🧹 Temp folder cleaned');
    }, intervalHours * 60 * 60 * 1000);
}

module.exports = { cleanupTempFolder, startCleanupScheduler };