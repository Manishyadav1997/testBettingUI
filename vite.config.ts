import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from 'url';
import type { PluginOption } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Only import dev plugins in development
const devPlugins: Promise<PluginOption>[] = [];

if (process.env.NODE_ENV !== 'production') {
  // Using dynamic import to avoid top-level await
  const runtimeErrorOverlay = import("@replit/vite-plugin-runtime-error-modal")
    .then(module => module.default());
  devPlugins.push(runtimeErrorOverlay);
  
  if (process.env.REPL_ID) {
    const cartographer = import("@replit/vite-plugin-cartographer")
      .then(module => module.cartographer());
    devPlugins.push(cartographer);
  }
}

export default defineConfig(async () => {
  const plugins = [
    react(),
    ...(await Promise.all(devPlugins))
  ];

  return {
    base: process.env.NODE_ENV === 'production' ? '/' : '/',
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
    },
    root: path.resolve(__dirname, "client"),
    build: {
      outDir: path.resolve(__dirname, "dist/client"),
      emptyOutDir: true,
      sourcemap: true,
    },
    server: {
      port: 3000,
      strictPort: true,
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
  };
});
