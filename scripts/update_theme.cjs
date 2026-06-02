const fs = require('fs');
const path = require('path');

const files = ['index.html', 'fuel.html', 'store.html', 'location.html', 'food.html'];

const toggleBtnHtml = `
          <div class="flex items-center space-x-4">
            <button id="theme-toggle" class="p-2 rounded-full hover:bg-slate-700 transition-colors focus:outline-none" aria-label="Toggle Dark Mode">
              <svg id="theme-toggle-dark-icon" class="hidden w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
              </svg>
              <svg id="theme-toggle-light-icon" class="hidden w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 4.22a1 1 0 011.415 0l.708.708a1 1 0 01-1.414 1.414l-.708-.708a1 1 0 010-1.414zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zm-4.22 4.22a1 1 0 010 1.415l-.708.708a1 1 0 01-1.414-1.414l.708-.708a1 1 0 011.415 0zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4.22-4.22a1 1 0 010-1.415l-.708-.708a1 1 0 01-1.414 1.414l.708.708a1 1 0 011.415 0zM2 10a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zm4.22-4.22a1 1 0 011.415 0l.708.708a1 1 0 01-1.414 1.414l-.708-.708a1 1 0 010-1.414zM10 5a5 5 0 100 10 5 5 0 000-10z" fill-rule="evenodd" clip-rule="evenodd"></path>
              </svg>
            </button>
            <a href="/location.html" class="bg-orange-600 hover:bg-orange-500 text-white px-5 py-2 rounded-md font-bold transition-colors shadow-sm">
              Get Directions
            </a>
          </div>
`;

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace the old Get Directions button div with the new toggle button div
  const oldBtnRegex = /<div class="flex items-center">\s*<a href="\/location\.html" class="bg-orange-600[^>]+>\s*Get Directions\s*<\/a>\s*<\/div>/g;
  content = content.replace(oldBtnRegex, toggleBtnHtml.trim());
  
  // Add dark mode classes to body
  content = content.replace(/<body class="bg-slate-50 text-slate-900 font-sans antialiased">/g, '<body class="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans antialiased transition-colors duration-300">');
  
  // Cleanup neon-text and pulse-glow from index and fuel
  content = content.replace(/ neon-text/g, '');
  content = content.replace(/ animate-pulse-glow/g, '');
  content = content.replace(/ style="text-shadow:[^"]+"/g, '');
  
  // Clean up inline styles for text-shadow that might not match exact regex
  content = content.replace(/style="text-shadow: 0 0 10px rgba\(74,222,128,0\.6\);"/g, '');
  content = content.replace(/style="text-shadow: 0 0 10px rgba\(96,165,250,0\.6\);"/g, '');
  
  // Update index.html hero image animation and text colors
  if (file === 'index.html') {
    content = content.replace(/class="w-full h-full object-cover opacity-80"/g, 'class="w-full h-full object-cover opacity-80 animate-slow-zoom"');
    // Ensure dark text is legible in light mode in the glass panel
    content = content.replace(/text-slate-200/g, 'text-slate-700 dark:text-slate-200');
    // For the h1 in index.html hero
    content = content.replace(/<h1 class="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight drop-shadow-md">/g, '<h1 class="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight drop-shadow-md">');
  }
  
  // Update store.html bg colors for cards to support dark mode
  if (file === 'store.html') {
    content = content.replace(/bg-white rounded-2xl/g, 'bg-white dark:bg-slate-800 rounded-2xl');
    content = content.replace(/text-slate-600/g, 'text-slate-600 dark:text-slate-300');
  }
  
  // Update food.html layout to support dark mode container
  if (file === 'food.html') {
    content = content.replace(/bg-white border-b/g, 'bg-slate-50 dark:bg-slate-900 border-b');
    content = content.replace(/text-slate-900/g, 'text-slate-900 dark:text-white');
    content = content.replace(/text-slate-600/g, 'text-slate-600 dark:text-slate-300');
  }

  // Update location.html
  if (file === 'location.html') {
    // nothing specific required
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated theme classes for ${file}`);
});
