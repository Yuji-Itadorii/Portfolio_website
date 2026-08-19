// @ts-check
import { defineConfig, envField } from "astro/config";
import tailwind from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";

export default defineConfig({
  site: "https://abhay-rawat.onrender.com",
  outDir: "./dist",
  trailingSlash: "never",
  build: {
    // "auto" left two small stylesheets external, and they render-blocked for
    // ~480ms on throttled mobile. The whole bundle is ~13 KB — cheaper inline.
    inlineStylesheets: "always",
    format: "file",
  },
  integrations: [sitemap(), icon()],
  vite: {
    plugins: [tailwind()],
  },
  env: {
    schema: {
      // Public by design: Web3Forms access keys are meant to ship in the client
      // bundle. The real protections are the honeypot + the domain allowlist
      // configured in the Web3Forms dashboard.
      //
      // Optional with an empty default so a key-less build succeeds and the
      // contact form renders its mailto fallback instead of failing the build.
      PUBLIC_WEB3FORMS_KEY: envField.string({
        context: "client",
        access: "public",
        optional: true,
        default: "",
      }),
    },
  },
});
