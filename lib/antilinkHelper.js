// Helper functions for antilink detection
function extractDomain(url) {
    try {
        const domain = url.replace(/(https?:\/\/)?(www\.)?/i, '').split('/')[0];
        return domain.toLowerCase();
    } catch (error) {
        return null;
    }
}

function isBlacklistedDomain(domain, blacklist) {
    return blacklist.some(blocked => domain.includes(blocked));
}

const commonBlacklist = [
    'bit.ly', 'tinyurl', 'shorturl', 'rb.gy', 'cutt.ly',
    'ow.ly', 'buff.ly', 'adf.ly', 'shorte.st', 'goo.gl'
];

module.exports = { extractDomain, isBlacklistedDomain, commonBlacklist };