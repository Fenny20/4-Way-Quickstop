import './style.css';
import { fetchStoreData, populateDOM, fetchFoodData } from './utils/dataFetcher.js';

// Theme Toggle Logic
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  const darkIcon = document.getElementById('theme-toggle-dark-icon');
  const lightIcon = document.getElementById('theme-toggle-light-icon');
  
  if (!toggleBtn || !darkIcon || !lightIcon) return;

  // On page load or when changing themes, best to add inline in `head` to avoid FOUC
  // For simplicity, handle here.
  if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    lightIcon.classList.remove('hidden');
  } else {
    document.documentElement.classList.remove('dark');
    darkIcon.classList.remove('hidden');
  }

  toggleBtn.addEventListener('click', function() {
    darkIcon.classList.toggle('hidden');
    lightIcon.classList.toggle('hidden');

    if (localStorage.getItem('color-theme')) {
      if (localStorage.getItem('color-theme') === 'light') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('color-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('color-theme', 'light');
      }
    } else {
      if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('color-theme', 'light');
      } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('color-theme', 'dark');
      }
    }
  });
}

let currentData = null;

// Routing & Call Logic
function setupActionButtons(data) {
  const address = "14255 AL-69, Joppa, AL 35087"; // From user
  const phone = data.phone || "";
  
  document.querySelectorAll('[data-action="route"]').forEach(btn => {
    btn.href = `https://maps.google.com/?q=${encodeURIComponent(address)}`;
  });

  document.querySelectorAll('[data-action="call"]').forEach(btn => {
    btn.href = `tel:${phone.replace(/[^0-9]/g, '')}`;
  });
}

// Weather Widget Logic
async function fetchWeather() {
  const tempEl = document.getElementById('weather-temp');
  const iconEl = document.getElementById('weather-icon');
  const descEl = document.getElementById('weather-desc');
  
  if (!tempEl) return; // Not on landing page
  
  try {
    // Joppa, AL approximate coordinates
    const lat = 34.2981;
    const lon = -86.5592;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit`;
    
    const res = await fetch(url);
    if (!res.ok) throw new Error("Weather fetch failed");
    
    const data = await res.json();
    const temp = Math.round(data.current_weather.temperature);
    const code = data.current_weather.weathercode;
    
    tempEl.innerHTML = `${temp}&deg;`;
    
    // Basic WMO weather code mapping
    let icon = "☀️";
    let desc = "Clear Skies";
    if (code > 0 && code <= 3) { icon = "⛅"; desc = "Partly Cloudy"; }
    else if (code >= 45 && code <= 48) { icon = "🌫️"; desc = "Foggy"; }
    else if (code >= 51 && code <= 67) { icon = "🌧️"; desc = "Rainy"; }
    else if (code >= 71 && code <= 82) { icon = "❄️"; desc = "Snow"; }
    else if (code >= 95) { icon = "⛈️"; desc = "Thunderstorms"; }
    
    iconEl.textContent = icon;
    descEl.textContent = desc;
  } catch (error) {
    console.warn("Could not load weather", error);
    descEl.textContent = "Weather unavailable";
  }
}

// Initialization and Live Sync
async function initApp() {
  initTheme();
  
  try {
    currentData = await fetchStoreData();
    populateDOM(currentData);
    setupActionButtons(currentData);
    
    fetchWeather();
    
    const foodContainer = document.getElementById('food-container');
    if (foodContainer) {
      const foodItems = await fetchFoodData();
      
      foodContainer.innerHTML = ''; // Clear loading state
      const images = ['/images/sandwich.png', '/images/tenders.png', '/images/burger.png'];
      
      foodItems.forEach((item, index) => {
        const imgSrc = images[index % images.length];
        const cardHtml = `
          <div class="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-700 flex flex-col transition-all transform hover:-translate-y-2 hover:shadow-2xl animate-fade-in-up" style="animation-delay: ${index * 0.1}s">
            <div class="h-56 overflow-hidden relative">
              <img src="${imgSrc}" alt="${item.title}" class="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
            </div>
            <div class="p-6 flex-grow flex flex-col">
              <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">${item.title}</h3>
              <p class="text-slate-600 dark:text-slate-300 mb-6 flex-grow leading-relaxed">${item.desc}</p>
              <div class="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <span class="font-extrabold text-3xl text-orange-600">${item.price}</span>
              </div>
            </div>
          </div>
        `;
        foodContainer.insertAdjacentHTML('beforeend', cardHtml);
      });
    }
    
    // Live Sync: Background refresh every 60 seconds
    setInterval(async () => {
      console.log("Live Sync: Fetching latest data...");
      const newData = await fetchStoreData();
      populateDOM(newData);
      setupActionButtons(newData);
    }, 60000);
    
  } catch (error) {
    console.error('Failed to initialize app:', error);
  }
}

document.addEventListener('DOMContentLoaded', initApp);
