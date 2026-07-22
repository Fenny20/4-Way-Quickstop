const fs = require('fs');
const path = require('path');

const files = ['index.html', 'pages/fuel.html', 'pages/store.html', 'pages/location.html', 'pages/food.html', 'pages/deals.html'];

files.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${file}, not found.`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove old manifest
  content = content.replace(/<link rel="manifest" href="\/manifest\.json">\s*/gi, '');
  
  // Replace old icon
  content = content.replace(/<link rel="icon" type="image\/svg\+xml" href="\/vite\.svg" \/>/gi, '<link rel="icon" type="image/png" href="/images/burger.png" />');
  
  fs.writeFileSync(filePath, content);
  console.log(`Fixed 404 links in ${file}`);
});
