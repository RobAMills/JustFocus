// Common distracting sites
const COMMON_SITES = [
  { domain: 'facebook.com', name: 'Facebook' },
  { domain: 'instagram.com', name: 'Instagram' },
  { domain: 'twitter.com', name: 'Twitter' },
  { domain: 'reddit.com', name: 'Reddit' },
  { domain: 'youtube.com', name: 'YouTube' },
  { domain: 'tiktok.com', name: 'TikTok' },
  { domain: 'netflix.com', name: 'Netflix' },
  { domain: 'amazon.com', name: 'Amazon' }
];

// Initialize blocked sites from storage
chrome.runtime.onInstalled.addListener(async () => {
  const { blockedSites = [] } = await chrome.storage.local.get('blockedSites');
  await chrome.storage.local.set({ blockedSites });
  updateBlockingRules(blockedSites);
});

// Update blocking rules when sites are added/removed
async function updateBlockingRules(blockedSites) {
  // Remove existing rules
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1]
  });

  if (blockedSites.length > 0) {
    // Create new rule with all blocked sites
    const urlFilter = blockedSites.map(site => `*://*.${site.domain}/*`).join('|');
    
    await chrome.declarativeNetRequest.updateDynamicRules({
      addRules: [{
        id: 1,
        priority: 1,
        action: {
          type: 'redirect',
          redirect: {
            extensionPath: '/focus.html'
          }
        },
        condition: {
          urlFilter: urlFilter,
          resourceTypes: ['main_frame']
        }
      }]
    });
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_BLOCKED_SITES') {
    chrome.storage.local.get('blockedSites', (result) => {
      sendResponse({ blockedSites: result.blockedSites || [] });
    });
    return true;
  }
  
  if (request.type === 'UPDATE_BLOCKED_SITES') {
    chrome.storage.local.set({ blockedSites: request.sites }, () => {
      updateBlockingRules(request.sites);
      sendResponse({ success: true });
    });
    return true;
  }
}); 