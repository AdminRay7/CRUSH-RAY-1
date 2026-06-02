const isAdmin = require('./isAdmin');
const isBanned = require('./isBanned');
const isOwner = require('./isOwner');
const { smsg, getBuffer, isUrl, sleep, delay, generateMessageTag } = require('./myfunc');
const { imageToWebp, videoToWebp, writeExifImg } = require('./exif');
const { Antilink, handleAntilinkCommand } = require('./antilink');
const { handleAntiBadwordCommand, handleBadwordDetection } = require('./antibadword');

module.exports = {
    isAdmin,
    isBanned,
    isOwner,
    smsg,
    getBuffer,
    isUrl,
    sleep,
    delay,
    generateMessageTag,
    imageToWebp,
    videoToWebp,
    writeExifImg,
    Antilink,
    handleAntilinkCommand,
    handleAntiBadwordCommand,
    handleBadwordDetection
};