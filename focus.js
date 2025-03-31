document.addEventListener('DOMContentLoaded', () => {
  // Get blocked site from URL
  const urlParams = new URLSearchParams(window.location.search);
  const blockedSite = urlParams.get('site');
  
  // Display blocked site
  const blockedSiteElement = document.getElementById('blockedSite');
  if (blockedSite) {
    blockedSiteElement.textContent = `Blocked site: ${blockedSite}`;
  }
}); 