const fs = require('fs');
const path = require('path');
const { imageToWebp, videoToWebp, writeExifImg } = require('./exif');

async function createSticker(buffer, isVideo, packname, author) {
    try {
        let stickerBuffer;
        if (isVideo) {
            stickerBuffer = await videoToWebp(buffer);
        } else {
            stickerBuffer = await imageToWebp(buffer);
        }
        
        const stickerWithExif = await writeExifImg(stickerBuffer, { packname, author });
        return stickerWithExif;
    } catch (error) {
        console.error('Error creating sticker:', error);
        throw error;
    }
}

module.exports = { createSticker };