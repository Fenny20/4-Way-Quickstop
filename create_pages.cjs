const fs = require('fs');
const path = require('path');

const fullHtml = `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Express Roadside Stop</title>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
  </head>
  <body class="bg-slate-50 text-slate-900 font-sans antialiased">
    <!-- Component A: Sticky Global Header -->
    <header class="sticky top-0 z-50 bg-slate-900 text-white shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex-shrink-0 flex items-center">
            <a href="/" class="font-extrabold text-xl tracking-tight" data-bind="businessName">Express Roadside Stop</a>
          </div>
          <nav class="hidden md:flex space-x-8">
            <a href="/fuel.html" class="text-slate-300 hover:text-white transition-colors font-semibold">Fuel</a>
            <a href="/store.html" class="text-slate-300 hover:text-white transition-colors font-semibold">Store</a>
            <a href="/food.html" class="text-slate-300 hover:text-white transition-colors font-semibold">Food</a>
            <a href="/location.html" class="text-slate-300 hover:text-white transition-colors font-semibold">Location</a>
          </nav>
          <div class="flex items-center">
            <a href="/location.html" class="bg-orange-600 hover:bg-orange-500 text-white px-5 py-2 rounded-md font-bold transition-colors shadow-sm">
              Get Directions
            </a>
          </div>
        </div>
      </div>
    </header>

    <!-- Content Area Placeholder -->
    {{CONTENT}}

    <footer class="bg-slate-900 pt-12 pb-8 border-t border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-center mb-8">
          <div class="mb-4 md:mb-0">
            <span class="font-extrabold text-xl tracking-tight text-white" data-bind="businessName">Express Roadside Stop</span>
            <p class="text-slate-400 mt-2 text-sm max-w-sm" data-bind="address">100 Interstate Highway 10, Houston, TX 77001</p>
          </div>
        </div>
        <div class="border-t border-slate-800 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center">
          <p class="text-slate-500 text-sm">
            &copy; <span data-bind="currentYear">2024</span> <span data-bind="businessName">Express Roadside Stop</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>`;

const fuelContent = `
    <!-- Component C: Live Fuel Rates Matrix -->
    <section id="fuel" class="py-16 bg-white border-b border-slate-200 min-h-[calc(100vh-200px)]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Current Fuel Services</h2>
          <p class="mt-4 text-lg text-slate-600">Premium grades for all vehicle types.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <!-- Regular -->
          <div class="bg-slate-50 rounded-xl p-8 border border-slate-200 text-center shadow-sm">
            <h3 class="text-xl font-bold text-slate-800 uppercase tracking-wide mb-2">Regular</h3>
            <p class="text-sm text-slate-500 mb-6">87 Octane</p>
            <div class="text-5xl font-extrabold text-slate-900" data-bind="fuel.regular">$3.39</div>
          </div>
          <!-- Premium -->
          <div class="bg-slate-900 rounded-xl p-8 border-2 border-orange-500 text-center shadow-xl transform md:-translate-y-2">
            <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-orange-600 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
              Top Tier
            </div>
            <h3 class="text-xl font-bold text-white uppercase tracking-wide mb-2 mt-2">Premium</h3>
            <p class="text-sm text-slate-400 mb-6">93 Octane</p>
            <div class="text-5xl font-extrabold text-white" data-bind="fuel.premium">$3.84</div>
          </div>
          <!-- Diesel -->
          <div class="bg-slate-50 rounded-xl p-8 border border-slate-200 text-center shadow-sm">
            <h3 class="text-xl font-bold text-slate-800 uppercase tracking-wide mb-2">Diesel</h3>
            <p class="text-sm text-slate-500 mb-6">Ultra-Low Sulfur</p>
            <div class="text-5xl font-extrabold text-slate-900" data-bind="fuel.diesel">$3.99</div>
          </div>
        </div>
      </div>
    </section>
`;

const storeContent = `
    <!-- Component D: Convenience Store Directory -->
    <section id="store" class="py-16 bg-slate-50 border-b border-slate-200 min-h-[calc(100vh-200px)]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Fully Stocked Convenience Essentials</h2>
          <p class="mt-4 text-lg text-slate-600">Everything you need for the road ahead.</p>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div class="bg-white p-6 rounded-lg shadow-sm border border-slate-200 text-center flex flex-col items-center justify-center">
            <span class="text-3xl mb-3">🥤</span><h4 class="font-bold text-slate-800">Cold Beverages</h4>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm border border-slate-200 text-center flex flex-col items-center justify-center">
            <span class="text-3xl mb-3">🥨</span><h4 class="font-bold text-slate-800">Salty Snacks</h4>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm border border-slate-200 text-center flex flex-col items-center justify-center">
            <span class="text-3xl mb-3">☕</span><h4 class="font-bold text-slate-800">Premium Coffee</h4>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm border border-slate-200 text-center flex flex-col items-center justify-center">
            <span class="text-3xl mb-3">🧊</span><h4 class="font-bold text-slate-800">Bagged Ice</h4>
          </div>
        </div>
      </div>
    </section>
`;

const foodContent = `
    <!-- Component E: Fresh Food Court Menu Grid -->
    <section id="food" class="py-16 bg-white border-b border-slate-200 relative min-h-[calc(100vh-200px)]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Fresh Kitchen Menu</h2>
            <p class="mt-2 text-lg text-slate-600">Loading menu directly from Google Sheets...</p>
          </div>
          <div class="mt-4 md:mt-0 inline-block bg-orange-100 text-orange-800 border border-orange-200 px-4 py-2 rounded-full font-bold shadow-sm">
            Kitchen Hours: <span data-bind="foodHours">6:00 AM - 9:00 PM</span>
          </div>
        </div>
        <div id="food-container" class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Food cards injected dynamically here -->
        </div>
      </div>
    </section>
`;

const locationContent = `
    <!-- Component F: Location -->
    <section id="location" class="py-16 bg-slate-900 text-white min-h-[calc(100vh-200px)]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-3xl font-extrabold tracking-tight mb-8 text-orange-500">Visit Us Today</h2>
            <div class="mb-8">
              <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Location</h3>
              <p class="text-2xl font-bold leading-tight" data-bind="address">Houston, TX</p>
            </div>
            <div class="grid grid-cols-2 gap-6 mb-8">
              <div>
                <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Store Hours</h3>
                <p class="text-xl font-semibold" data-bind="storeHours">24 Hours</p>
              </div>
              <div>
                <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Kitchen Hours</h3>
                <p class="text-xl font-semibold" data-bind="foodHours">6AM - 9PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
`;

const heroContent = `
    <!-- Component B: Hero -->
    <section class="relative bg-slate-900 text-white py-20 lg:py-32 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center lg:text-left flex flex-col lg:flex-row items-center">
        <div class="lg:w-1/2 lg:pr-8">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Fuel Up.<br>
            <span class="text-orange-500">Grab Snacks.</span><br>
            Eat Fresh.
          </h1>
          <p class="text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl mx-auto lg:mx-0">
            Welcome to <span data-bind="businessName" class="font-semibold text-white">Express Roadside Stop</span>.
          </p>
          <div class="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-10">
            <a href="/location.html" class="bg-orange-600 hover:bg-orange-500 text-white px-8 py-4 rounded-md font-bold text-lg shadow-lg">Find Us</a>
            <a href="/food.html" class="bg-slate-700 hover:bg-slate-600 text-white px-8 py-4 rounded-md font-bold text-lg shadow-md">View Food Menu</a>
          </div>
        </div>
      </div>
    </section>
`;

fs.writeFileSync(path.join(__dirname, 'fuel.html'), fullHtml.replace('{{CONTENT}}', fuelContent));
fs.writeFileSync(path.join(__dirname, 'store.html'), fullHtml.replace('{{CONTENT}}', storeContent));
fs.writeFileSync(path.join(__dirname, 'food.html'), fullHtml.replace('{{CONTENT}}', foodContent));
fs.writeFileSync(path.join(__dirname, 'location.html'), fullHtml.replace('{{CONTENT}}', locationContent));
fs.writeFileSync(path.join(__dirname, 'index.html'), fullHtml.replace('{{CONTENT}}', heroContent));

console.log('Successfully recreated pages.');
