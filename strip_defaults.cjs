const fs = require('fs');
const path = require('path');

const files = ['index.html', 'fuel.html', 'store.html', 'location.html', 'food.html'];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace anything between <tag data-bind="xyz"> and </tag> with empty space or '...'
  // But wait, some tags like <a> have data-bind but also other attributes.
  // Better regex: /(data-bind="[^"]+"[^>]*>)(.*?)(<\/[a-z]+>)/g
  
  // To avoid breaking layout, we can replace the inner text with an empty span with a fixed height or just '...'
  content = content.replace(/(data-bind="[^"]+"[^>]*>)(.*?)(<\/[a-zA-Z0-9]+>)/g, (match, p1, p2, p3) => {
    // If it's a price, let's just use '...' 
    // If it's a businessName, '...' 
    // But let's be careful not to strip nested HTML if there is any, although there shouldn't be.
    return p1 + '...' + p3;
  });
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file}`);
});
