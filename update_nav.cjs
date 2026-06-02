const fs = require('fs');
const path = require('path');

const files = ['index.html', 'fuel.html', 'store.html', 'location.html', 'food.html'];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace the Get Directions button in the header to have data-action="route"
  content = content.replace(
    /<a href="\/location\.html" class="([^"]*bg-orange-600[^"]*)">\s*Get Directions\s*<\/a>/i,
    '<a href="#" data-action="route" class="$1">\n              Get Directions\n            </a>'
  );
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated Get Directions button in header of ${file}`);
});
