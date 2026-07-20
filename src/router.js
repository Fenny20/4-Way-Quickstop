export function initRouter(initAppCallback) {
  // Add a transition class to the body for smooth fading
  document.body.classList.add('transition-opacity', 'duration-300');

  document.addEventListener('click', async (e) => {
    // Find the closest anchor tag
    const anchor = e.target.closest('a');
    
    // Ignore if not an anchor, or if it has a target="_blank", or specific data actions
    if (!anchor) return;
    if (anchor.target === '_blank') return;
    if (anchor.hasAttribute('data-action')) return;
    
    // Only intercept same-origin navigation
    const href = anchor.getAttribute('href');
    if (!href) return;
    if (href.startsWith('http') && new URL(href).origin !== window.location.origin) return;
    
    // Ignore anchor links (like #section)
    if (href.startsWith('#')) return;

    // It's a valid internal link. Prevent default navigation.
    e.preventDefault();
    
    const url = anchor.href; // absolute URL resolved by browser
    if (url === window.location.href) return; // Already on this page

    // 1. Fade out current body
    document.body.classList.add('opacity-0');
    
    try {
      // 2. Fetch new page HTML
      const response = await fetch(url);
      if (!response.ok) throw new Error('Page not found');
      const htmlText = await response.text();
      
      // 3. Parse HTML
      const parser = new DOMParser();
      const newDoc = parser.parseFromString(htmlText, 'text/html');
      
      // Wait a short moment for the fade-out animation to complete (300ms)
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 4. Clean up old observers (prevent memory leaks)
      if (window.scrollObserver) {
        window.scrollObserver.disconnect();
        window.scrollObserver = null;
      }
      
      // 5. Replace content
      document.title = newDoc.title;
      document.body.className = newDoc.body.className;
      
      // Re-add transition classes to the new body
      document.body.classList.add('transition-opacity', 'duration-300', 'opacity-0');
      
      // Replace innerHTML
      document.body.innerHTML = newDoc.body.innerHTML;
      
      // 6. Update History API
      window.history.pushState({}, '', url);
      
      // 7. Re-initialize the app logic (data fetching, theme, events)
      // We pass false for isInitial because we don't want to show the global loader overlay again
      if (typeof initAppCallback === 'function') {
        initAppCallback(false);
      }
      
      // 8. Force a small reflow, then fade in
      void document.body.offsetWidth;
      document.body.classList.remove('opacity-0');
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'instant' });
      
    } catch (error) {
      console.error('Routing failed:', error);
      // Fallback to standard navigation if fetch fails
      window.location.href = url;
    }
  });

  // Handle browser back/forward buttons
  window.addEventListener('popstate', async () => {
    document.body.classList.add('opacity-0');
    try {
      const response = await fetch(window.location.href);
      const htmlText = await response.text();
      const parser = new DOMParser();
      const newDoc = parser.parseFromString(htmlText, 'text/html');
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (window.scrollObserver) {
        window.scrollObserver.disconnect();
        window.scrollObserver = null;
      }
      
      document.title = newDoc.title;
      document.body.className = newDoc.body.className;
      document.body.classList.add('transition-opacity', 'duration-300', 'opacity-0');
      document.body.innerHTML = newDoc.body.innerHTML;
      
      if (typeof initAppCallback === 'function') {
        initAppCallback(false);
      }
      
      void document.body.offsetWidth;
      document.body.classList.remove('opacity-0');
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch (error) {
      window.location.reload();
    }
  });
}
