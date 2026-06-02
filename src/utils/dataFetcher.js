import { fallbackData } from '../data/fallback.js';

// To connect your Google Sheet:
// 1. Create a Google Sheet with 2 columns: "Key" and "Value"
const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR8bHmJoODN-pbhILPam22A13yAaf325A74K4XxPanCbWFfqAOPfVFCPPgLrjGwmIy1uLZvfjicumSz/pub?output=csv'; // For General Store Data

// Paste the published CSV link for your new Food Menu sheet here:
export const GOOGLE_SHEET_FOOD_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTGO64k_feo47mC1u-Tp94ZTnvZAjJZQTE69uNZQVc1M7Vs8oNYWe0wpc8BCx6nDZ2fcgP_EtCRVu2B/pub?output=csv';

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (inQuotes) {
      if (char === '"') {
        // Escaped quote
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
  }
  result.push(current);
  return result.map(s => s.trim().replace(/^"|"$/g, ''));
}

export async function fetchFoodData() {
  const fallbackFood = [
    { title: "Breakfast Sandwich Combo", desc: "Fresh eggs, bacon or sausage on toasted biscuits. Served with a side of hash browns.", price: "$5.99" },
    { title: "Hand-Tossed Crispy Chicken Tenders", desc: "Double-battered white meat fried crisp to perfection. Includes your choice of dipping sauce.", price: "$8.49" },
    { title: "Roadside Meal Basket", desc: "Value combo including our signature burger, crispy golden fries, and a large fountain drink.", price: "$10.99" }
  ];

  if (!GOOGLE_SHEET_FOOD_CSV_URL) {
    console.log('No Google Sheet URL provided for Food. Using local fallback data.');
    return fallbackFood;
  }

  try {
    const timestamp = new Date().getTime();
    const fetchUrl = `${GOOGLE_SHEET_FOOD_CSV_URL}&t=${timestamp}`;
    const response = await fetch(fetchUrl, { cache: 'no-store' });
    if (!response.ok) throw new Error('Failed to fetch Food Google Sheet');
    
    const csvText = await response.text();
    const rows = csvText.split('\n');
    const foodItems = [];
    
    for (let i = 0; i < rows.length; i++) {
      const rowStr = rows[i].trim();
      if (!rowStr) continue;
      
      const parts = parseCSVLine(rowStr);
      if (parts.length < 3) continue;
      
      const title = parts[0];
      const desc = parts[1];
      let price = parts[2];
      
      if (title.toLowerCase() === 'title' || title === '') continue;
      
      if (!price.startsWith('$')) price = '$' + price;
      
      foodItems.push({ title, desc, price });
    }
    
    return foodItems.length > 0 ? foodItems : fallbackFood;
  } catch (error) {
    console.warn('Error fetching Food Google Sheet. Falling back to local data.', error);
    return fallbackFood;
  }
}

export async function fetchStoreData() {
  if (!GOOGLE_SHEET_CSV_URL) {
    console.log('No Google Sheet URL provided. Using local fallback data.');
    return fallbackData;
  }

  try {
    const timestamp = new Date().getTime();
    const fetchUrl = `${GOOGLE_SHEET_CSV_URL}&t=${timestamp}`;
    const response = await fetch(fetchUrl, { cache: 'no-store' });
    if (!response.ok) throw new Error('Failed to fetch Google Sheet');
    
    const csvText = await response.text();
    const parsedData = parseCSV(csvText);
    
    console.log('Successfully fetched and parsed data from Google Sheet.');
    return parsedData;
  } catch (error) {
    console.warn('Error fetching Google Sheet. Falling back to local data.', error);
    return fallbackData;
  }
}

function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) current[keys[i]] = {};
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
}

// Simple CSV parser that reads Key-Value pairs and overrides the fallback data
function parseCSV(csvText) {
  // Start with a copy of the fallback data so missing fields are still populated
  const data = JSON.parse(JSON.stringify(fallbackData));
  
  // Split into rows and process
  const rows = csvText.split('\n');
  
  for (let i = 0; i < rows.length; i++) {
    const columns = rows[i].split(',');
    if (columns.length < 2) continue;
    
    let key = columns[0].trim();
    const value = columns.slice(1).join(',').trim(); // Re-join in case value had commas
    
    // Automatically fix common typos like "fuel.premiun" -> "fuel.premium"
    if (key === 'fuel.premiun') key = 'fuel.premium';
    
    if (key) {
      setNestedValue(data, key, value);
    }
  }
  
  return data;
}

function getNestedValue(obj, path) {
  const keys = path.split('.');
  let current = obj;
  for (const k of keys) {
    if (current == null) return undefined;
    current = current[k];
  }
  return current;
}

export function populateDOM(data) {
  const announcementBar = document.getElementById('announcement-bar');
  if (announcementBar) {
    if (data.announcement && data.announcement.trim() !== '') {
      announcementBar.classList.remove('hidden');
    } else {
      announcementBar.classList.add('hidden');
    }
  }

  const elements = document.querySelectorAll('[data-bind]');
  
  elements.forEach(el => {
    const bindKey = el.getAttribute('data-bind');
    
    if (bindKey === 'currentYear') {
      el.textContent = new Date().getFullYear();
      return;
    }
    
    const value = getNestedValue(data, bindKey);
    if (value !== undefined && value !== null) {
      if (el.tagName === 'A' && bindKey === 'phone') {
        el.textContent = value;
        el.href = `tel:${value.replace(/[^0-9]/g, '')}`;
      } else if (bindKey.startsWith('fuel.') || bindKey.endsWith('.price')) {
        // Automatically ensure currency format for prices
        el.textContent = value.startsWith('$') ? value : `$${value}`;
      } else {
        el.textContent = value;
      }
    }
  });
}
