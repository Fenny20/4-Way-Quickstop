const fs = require('fs');
const path = require('path');

const files = ['index.html', 'fuel.html', 'store.html', 'location.html', 'food.html'];

const bottomNavHtml = `
    <!-- Mobile Bottom Navigation -->
    <nav class="md:hidden fixed bottom-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-50 pb-safe">
      <div class="flex justify-around items-center h-16">
        <a href="/" class="flex flex-col items-center justify-center w-full h-full text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
          <span class="text-xl mb-1">🏠</span>
          <span class="text-[10px] font-bold uppercase tracking-wider">Home</span>
        </a>
        <a href="/fuel.html" class="flex flex-col items-center justify-center w-full h-full text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
          <span class="text-xl mb-1">⛽</span>
          <span class="text-[10px] font-bold uppercase tracking-wider">Fuel</span>
        </a>
        <a href="/store.html" class="flex flex-col items-center justify-center w-full h-full text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
          <span class="text-xl mb-1">🏪</span>
          <span class="text-[10px] font-bold uppercase tracking-wider">Store</span>
        </a>
        <a href="/food.html" class="flex flex-col items-center justify-center w-full h-full text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
          <span class="text-xl mb-1">🍔</span>
          <span class="text-[10px] font-bold uppercase tracking-wider">Food</span>
        </a>
        <a href="#" data-action="route" class="flex flex-col items-center justify-center w-full h-full text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
          <span class="text-xl mb-1">📍</span>
          <span class="text-[10px] font-bold uppercase tracking-wider">Route</span>
        </a>
      </div>
    </nav>
`;

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes('Mobile Bottom Navigation')) {
    content = content.replace(/(<script type="module" src="\/src\/main\.js"><\/script>)/i, `${bottomNavHtml}\n    $1`);
    
    // Add padding to body to prevent content from hiding behind the navbar
    content = content.replace(/(<body class="[^"]*)(")/i, '$1 pb-16 md:pb-0$2');
    
    fs.writeFileSync(filePath, content);
    console.log(`Injected bottom nav in ${file}`);
  }
});
