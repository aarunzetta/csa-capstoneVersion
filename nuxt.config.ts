// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/eslint",
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@nuxt/fonts",
    "@nuxt/image",
    "@nuxt/icon",
  ],
  fonts: {
    families: [
      { name: "Inter", provider: "google" },
      { name: "JetBrains Mono", provider: "google" },
    ],
  },
  css: ["./assets/css/global.css"],
});
