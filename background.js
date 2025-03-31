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

// Initialize data from storage
chrome.runtime.onInstalled.addListener(async () => {
  const { blockedSites = [], focusTask = '' } = await chrome.storage.local.get(['blockedSites', 'focusTask']);
  await chrome.storage.local.set({ blockedSites, focusTask });
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
  if (request.type === 'GET_DATA') {
    chrome.storage.local.get(['blockedSites', 'focusTask'], (result) => {
      sendResponse({ 
        blockedSites: result.blockedSites || [],
        focusTask: result.focusTask || ''
      });
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

  if (request.type === 'UPDATE_FOCUS_TASK') {
    chrome.storage.local.set({ focusTask: request.focusTask }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
}); 