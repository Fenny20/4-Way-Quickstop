const fs = require('fs');
const path = require('path');

const files = ['index.html', 'pages/fuel.html', 'pages/store.html', 'pages/location.html', 'pages/food.html', 'pages/deals.html'];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 1. Add Deals to top header nav
  if (!content.includes('<a href="/pages/deals.html" class="text-slate-300 hover:text-white transition-colors font-semibold">Deals</a>')) {
    content = content.replace(
      /(<a href="\/pages\/food\.html" class="text-slate-300 hover:text-white transition-colors font-semibold">Food<\/a>)/i,
      '$1\n            <a href="/pages/deals.html" class="text-slate-300 hover:text-white transition-colors font-semibold text-orange-400">Deals</a>'
    );
  }
  
  // 2. Add Deals to bottom mobile nav (maybe replace Route with Deals, or add Deals next to Route)
  // The bottom nav has 5 icons right now. Let's add Deals before Route.
  if (!content.includes('<span class="text-[10px] font-bold uppercase tracking-wider">Deals</span>')) {
    const dealsNavHtml = `
        <a href="/pages/deals.html" class="flex flex-col items-center justify-center w-full h-full text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
          <span class="text-xl mb-1">🔥</span>
          <span class="text-[10px] font-bold uppercase tracking-wider">Deals</span>
        </a>`;
    content = content.replace(
      /(<a href="\/pages\/food\.html" class="flex flex-col items-center justify-center w-full h-full text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">[\s\S]*?<\/a>)/i,
      `$1${dealsNavHtml}`
    );
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`Injected deals nav links in ${file}`);
});
