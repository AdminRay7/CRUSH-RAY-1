const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { proto } = require("@whiskeysockets/baileys");

function smsg(sock, m, store) {
    if (!m) return m;
    let M = proto.WebMessageInfo;
    if (m.key) {
        m.id = m.key.id;
        m.isBaileys = m.id.startsWith('BAE5') && m.id.length === 16;
        m.chat = m.key.remoteJid;
        m.fromMe = m.key.fromMe;
        m.isGroup = m.chat.endsWith('@g.us');
        m.sender = m.key.participant || m.key.remoteJid;
    }
    return m;
}

function isUrl(url) {
    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'));
}

async function getBuffer(url, options) {
    try {
        const response = await axios({
            method: 'get',
            url,
            responseType: 'arraybuffer',
            ...options
        });
        return response.data;
    } catch (error) {
        console.error('Error getting buffer:', error);
        return null;
    }
}

function generateMessageTag() {
    return Math.random().toString(36).substring(2, 12);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function delay(ms) {
    return sleep(ms);
}

function getSizeMedia(size) {
    if (size < 1024) return size + ' B';
    if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB';
    if (size < 1024 * 1024 * 1024) return (size / (1024 * 1024)).toFixed(2) + ' MB';
    return (size / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}

module.exports = { smsg, isUrl, getBuffer, generateMessageTag, sleep, delay, getSizeMedia };