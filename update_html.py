import os
import glob
import re

seo_meta = '''
    <!-- SEO & PWA -->
    <meta name="description" content="4-Way Quick Stop - Your express roadside stop for fuel, food, snacks, and great deals in Joppa, AL.">
    <meta property="og:title" content="4-Way Quick Stop">
    <meta property="og:description" content="Your express roadside stop for fuel, food, snacks, and great deals in Joppa, AL.">
    <meta property="og:type" content="website">
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#f97316">
'''

skeleton_food = '''
          <div class="animate-pulse bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-700 flex flex-col h-96">
            <div class="h-56 bg-slate-200 dark:bg-slate-700"></div>
            <div class="p-6 flex-grow flex flex-col">
              <div class="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
              <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2"></div>
              <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6 mb-6"></div>
              <div class="mt-auto h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
            </div>
          </div>
''' * 3

files = ['index.html', 'pages/deals.html', 'pages/food.html', 'pages/fuel.html', 'pages/location.html', 'pages/store.html']

for fpath in files:
    if not os.path.exists(fpath): continue
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Inject SEO
    if 'name="description"' not in content:
        content = re.sub(r'(</head>)', rf'{seo_meta}\1', content)

    # Inject Skeletons
    if fpath == 'pages/food.html' and 'animate-pulse' not in content:
        content = re.sub(r'(id="food-container"[^>]*>)', rf'\1{skeleton_food}', content)
    elif fpath == 'pages/deals.html' and 'animate-pulse' not in content:
        content = re.sub(r'(id="deals-container"[^>]*>)', rf'\1{skeleton_food}', content)
    elif fpath == 'pages/store.html' and 'animate-pulse' not in content:
        content = re.sub(r'(id="store-products-container"[^>]*>)', rf'\1{skeleton_food}', content)

    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(content)
print("HTML update complete.")
