const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function uploadToTelegraph(buffer) {
    try {
        const formData = new FormData();
        formData.append('file', buffer, { filename: 'image.jpg' });
        
        const response = await axios.post('https://telegra.ph/upload', formData, {
            headers: formData.getHeaders()
        });
        
        if (response.data && response.data[0]) {
            return 'https://telegra.ph' + response.data[0].src;
        }
        return null;
    } catch (error) {
        console.error('Error uploading to Telegraph:', error);
        return null;
    }
}

async function uploadToCatbox(buffer, filename) {
    try {
        const formData = new FormData();
        formData.append('fileToUpload', buffer, filename);
        formData.append('reqtype', 'fileupload');
        
        const response = await axios.post('https://catbox.moe/user/api.php', formData, {
            headers: formData.getHeaders()
        });
        
        return response.data;
    } catch (error) {
        console.error('Error uploading to Catbox:', error);
        return null;
    }
}

module.exports = { uploadToTelegraph, uploadToCatbox };