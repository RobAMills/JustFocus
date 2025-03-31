document.addEventListener('DOMContentLoaded', async () => {
  // Get blocked site from URL
  const urlParams = new URLSearchParams(window.location.search);
  const blockedSite = urlParams.get('site');
  
  // Display blocked site
  const blockedSiteElement = document.getElementById('blockedSite');
  if (blockedSite) {
    blockedSiteElement.textContent = `Blocked site: ${blockedSite}`;
  }

  // Get and display focus task
  const response = await chrome.runtime.sendMessage({ type: 'GET_DATA' });
  const focusTaskElement = document.getElementById('focusTask');
  if (response.focusTask) {
    focusTaskElement.textContent = `Your focus task:\n${response.focusTask}`;
  } else {
    focusTaskElement.textContent = 'No focus task set. Open the extension to set your task.';
  }
}); 