const { uploadToTelegraph } = require('./uploader');
const fs = require('fs');

async function uploadImage(buffer) {
    try {
        const url = await uploadToTelegraph(buffer);
        return url;
    } catch (error) {
        console.error('Error uploading image:', error);
        return null;
    }
}

async function uploadImageFromFile(filePath) {
    try {
        const buffer = fs.readFileSync(filePath);
        return await uploadImage(buffer);
    } catch (error) {
        console.error('Error uploading image from file:', error);
        return null;
    }
}

module.exports = { uploadImage, uploadImageFromFile };