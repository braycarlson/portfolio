import path from "node:path";

import tailwindcss from "@tailwindcss/postcss";
import vue from "@vitejs/plugin-vue";
import autoprefixer from "autoprefixer";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [vue()],
    css: {
        postcss: {
            plugins: [tailwindcss(), autoprefixer()],
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        host: '0.0.0.0',
        port: 5173,
        proxy: {
            '/api': {
                target: process.env.API_URL || 'http://localhost:8080',
                changeOrigin: true,
            },
        },
        watch: {
            usePolling: true,
        },
    },
});
