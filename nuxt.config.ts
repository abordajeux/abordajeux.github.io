// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'path'
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
    ssr: false, // ensures full static SPA behavior (optional but safest)

  nitro: {
    preset: 'github_pages'
  },

  app: {
    baseURL: '/',}, // IMPORTANT (remove later if using custom domain)
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@pinia/nuxt'],
  alias: {
          '@': resolve(__dirname, 'app'),

  },
    css: ['@/assets/css/main.css'],
    ui: {
    colorMode: false
  },
    vite: {
    plugins: [
      tailwindcss(),
    ],}
})
