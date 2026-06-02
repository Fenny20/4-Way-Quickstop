const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.join(__dirname, 'index.html');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// Use simple regex to extract sections
// We'll extract:
// 1. Everything before Hero -> header
// 2. Footer and beyond -> footer
// 3. The specific sections

function extractSection(html, startComment, endComment) {
    const startIndex = html.indexOf(startComment);
    if (startIndex === -1) return null;
    const endStartIndex = html.indexOf('<!--', startIndex + startComment.length);
    let sectionEnd = endStartIndex;
    
    // If it's the last section (FAQ), the end is the footer
    if (endStartIndex === -1 || startComment.includes('Component G')) {
        sectionEnd = html.indexOf('<footer');
    }
    
    return html.substring(startIndex, sectionEnd);
}

const headerPart = indexHtml.substring(0, indexHtml.indexOf('<!-- Component B: Hero Value Section -->'));
const footerPart = indexHtml.substring(indexHtml.indexOf('<footer'));

const heroSection = extractSection(indexHtml, '<!-- Component B: Hero Value Section -->');
const fuelSection = extractSection(indexHtml, '<!-- Component C: Live Fuel Rates Matrix -->');
const storeSection = extractSection(indexHtml, '<!-- Component D: Convenience Store Directory -->');
const foodSection = extractSection(indexHtml, '<!-- Component E: Fresh Food Court Menu Grid -->');
const locationSection = extractSection(indexHtml, '<!-- Component F: Location, Maps & Hours Dashboard -->');
const faqSection = extractSection(indexHtml, '<!-- Component G: Structured FAQ & Semantic Global Footer -->');

function createPage(filename, content) {
    const fullContent = headerPart + content + '\n    ' + footerPart;
    fs.writeFileSync(path.join(__dirname, filename), fullContent);
}

// 1. fuel.html
createPage('fuel.html', fuelSection);

// 2. store.html
createPage('store.html', storeSection);

// 3. food.html
createPage('food.html', foodSection);

// 4. location.html
createPage('location.html', locationSection);

// 5. Re-write index.html to only have Hero + FAQ
const newIndexHtml = headerPart + heroSection + faqSection + '    ' + footerPart;
fs.writeFileSync(indexHtmlPath, newIndexHtml);

console.log('Pages split successfully!');
