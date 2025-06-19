import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from 'url';
import type { PluginOption } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';
  
  // Only import dev plugins in development
  const devPlugins: PluginOption[] = [];
  
  if (!isProduction) {
    // Using dynamic import to avoid top-level await
    import("@replit/vite-plugin-runtime-error-modal")
      .then(module => devPlugins.push(module.default()));
    
    if (env.REPL_ID) {
      import("@replit/vite-plugin-cartographer")
        .then(module => devPlugins.push(module.cartographer()));
    }
  }

  return {
    plugins: [
      react({
        // Only apply Emotion in development if we need it
        jsxImportSource: mode === 'development' ? '@emotion/react' : undefined,
        babel: {
          plugins: mode === 'development' ? ['@emotion/babel-plugin'] : [],
        },
      }),
      ...devPlugins
    ],
    base: isProduction ? '/testBettingUI/' : '/',
    publicDir: 'public',
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
    },
    root: path.resolve(__dirname, "client"),
    build: {
      outDir: path.resolve(__dirname, "dist"),
      emptyOutDir: true,
      sourcemap: isProduction ? false : true,
      minify: isProduction ? 'esbuild' : false,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
          },
        },
      },
    },
    server: {
      port: 3000,
      strictPort: true,
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
    preview: {
      port: 3000,
      strictPort: true,
    },
  };
});
