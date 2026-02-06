export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      apiBase: import.meta.env.NUXT_PUBLIC_API_BASE,
    },
  },
  app: {
    head: {
      meta: [
        {
          name: "description",
          content: "Commuter Security App - Management and Admin System",
        },
        { name: "og:title", content: "Commuter Security App" },
        {
          name: "og:description",
          content: "Commuter Security App - Management and Admin System",
        },
        { name: "og:image", content: "/cma_logo.png" },
        { name: "og:type", content: "website" },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/cma_logo.ico" }],
    },
  },
  modules: [
    "@nuxt/eslint",
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@nuxt/fonts",
    "@nuxt/image",
  ],
  fonts: {
    families: [
      { name: "Inter", provider: "google" },
      { name: "JetBrains Mono", provider: "google" },
    ],
  },
  css: ["./assets/css/global.css"],
});
