import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("/node_modules/@firebase/auth/") || id.includes("/node_modules/firebase/auth/")) {
            return "firebase-auth";
          }
          if (id.includes("/node_modules/@firebase/firestore/") || id.includes("/node_modules/firebase/firestore/")) {
            return "firebase-firestore";
          }
          if (id.includes("/node_modules/@firebase/storage/") || id.includes("/node_modules/firebase/storage/")) {
            return "firebase-storage";
          }
          if (id.includes("/node_modules/@firebase/functions/") || id.includes("/node_modules/firebase/functions/")) {
            return "firebase-functions";
          }
          if (id.includes("/node_modules/@firebase/analytics/") || id.includes("/node_modules/firebase/analytics/")) {
            return "firebase-analytics";
          }
          if (id.includes("/node_modules/@firebase/") || id.includes("/node_modules/firebase/")) {
            return "firebase-vendor";
          }
          if (id.includes("/node_modules/recharts/") || id.includes("/node_modules/d3-")) {
            return "charts-vendor";
          }
          if (/\/node_modules\/(react|react-dom|react-router|react-router-dom)\//.test(id)) {
            return "react-vendor";
          }
        },
      },
    },
  },
});
