const fs = require('fs');
const path = require('path');

const storeFile = './data/store.json';
let store = {
    messages: new Map(),
    contacts: new Map(),
    groups: new Map()
};

function readFromFile() {
    try {
        if (fs.existsSync(storeFile)) {
            const data = JSON.parse(fs.readFileSync(storeFile));
            store.messages = new Map(Object.entries(data.messages || {}));
            store.contacts = new Map(Object.entries(data.contacts || {}));
            store.groups = new Map(Object.entries(data.groups || {}));
        }
    } catch (error) {
        console.error('Error reading store:', error);
    }
}

function writeToFile() {
    try {
        const data = {
            messages: Object.fromEntries(store.messages),
            contacts: Object.fromEntries(store.contacts),
            groups: Object.fromEntries(store.groups)
        };
        fs.writeFileSync(storeFile, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error writing store:', error);
    }
}

function bind(ev) {
    ev.on('messages.upsert', ({ messages }) => {
        for (const msg of messages) {
            const key = msg.key.remoteJid + '_' + msg.key.id;
            store.messages.set(key, msg);
        }
    });
    
    ev.on('contacts.update', (updates) => {
        for (const update of updates) {
            store.contacts.set(update.id, update);
        }
    });
    
    ev.on('groups.update', (updates) => {
        for (const update of updates) {
            store.groups.set(update.id, update);
        }
    });
}

async function loadMessage(jid, id) {
    const key = jid + '_' + id;
    return store.messages.get(key);
}

module.exports = { readFromFile, writeToFile, bind, loadMessage };