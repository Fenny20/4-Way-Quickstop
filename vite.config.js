import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        fuel: resolve(__dirname, 'fuel.html'),
        store: resolve(__dirname, 'store.html'),
        food: resolve(__dirname, 'food.html'),
        location: resolve(__dirname, 'location.html')
      }
    }
  }
});
