import adapter from '@sveltejs/adapter-vercel'; // Make sure it's adapter-vercel, not adapter-auto
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      runtime: 'nodejs20.x', // Explicitly set Node version
      split: false // Set to false unless you need function splitting
    })
  }
};

export default config;