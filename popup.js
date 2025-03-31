// Get DOM elements
const siteList = document.getElementById('siteList');
const newSiteInput = document.getElementById('newSite');
const addSiteButton = document.getElementById('addSite');
const commonSites = document.getElementById('commonSites');
const blockedCount = document.getElementById('blockedCount');

// Common sites from background script
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

// Load blocked sites
async function loadBlockedSites() {
  const response = await chrome.runtime.sendMessage({ type: 'GET_BLOCKED_SITES' });
  const blockedSites = response.blockedSites || [];
  
  // Update blocked sites list
  siteList.innerHTML = blockedSites.map(site => `
    <div class="site-item">
      <span>${site.domain}</span>
      <button class="remove-site" data-domain="${site.domain}">×</button>
    </div>
  `).join('');

  // Update common sites checkboxes
  commonSites.innerHTML = COMMON_SITES.map(site => `
    <label class="checkbox-item">
      <input type="checkbox" 
             ${blockedSites.some(s => s.domain === site.domain) ? 'checked' : ''}
             data-domain="${site.domain}">
      ${site.name}
    </label>
  `).join('');

  // Update blocked count
  blockedCount.textContent = `Sites Blocked: ${blockedSites.length}`;

  // Add event listeners
  addEventListeners();
}

// Add event listeners
function addEventListeners() {
  // Add new site
  addSiteButton.addEventListener('click', async () => {
    const domain = newSiteInput.value.trim().toLowerCase();
    if (!domain) return;

    const response = await chrome.runtime.sendMessage({ type: 'GET_BLOCKED_SITES' });
    const blockedSites = response.blockedSites || [];
    
    if (!blockedSites.some(site => site.domain === domain)) {
      blockedSites.push({ domain });
      await chrome.runtime.sendMessage({ 
        type: 'UPDATE_BLOCKED_SITES', 
        sites: blockedSites 
      });
      newSiteInput.value = '';
      loadBlockedSites();
    }
  });

  // Remove site
  document.querySelectorAll('.remove-site').forEach(button => {
    button.addEventListener('click', async () => {
      const domain = button.dataset.domain;
      const response = await chrome.runtime.sendMessage({ type: 'GET_BLOCKED_SITES' });
      const blockedSites = response.blockedSites.filter(site => site.domain !== domain);
      await chrome.runtime.sendMessage({ 
        type: 'UPDATE_BLOCKED_SITES', 
        sites: blockedSites 
      });
      loadBlockedSites();
    });
  });

  // Common sites checkboxes
  document.querySelectorAll('.checkbox-item input').forEach(checkbox => {
    checkbox.addEventListener('change', async () => {
      const domain = checkbox.dataset.domain;
      const response = await chrome.runtime.sendMessage({ type: 'GET_BLOCKED_SITES' });
      let blockedSites = response.blockedSites || [];

      if (checkbox.checked) {
        if (!blockedSites.some(site => site.domain === domain)) {
          blockedSites.push({ domain });
        }
      } else {
        blockedSites = blockedSites.filter(site => site.domain !== domain);
      }

      await chrome.runtime.sendMessage({ 
        type: 'UPDATE_BLOCKED_SITES', 
        sites: blockedSites 
      });
      loadBlockedSites();
    });
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', loadBlockedSites); 