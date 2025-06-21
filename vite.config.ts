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

  // Always use the GitHub Pages base path for consistency
  const base = '/testBettingUI';
  // For local development without the base path, you can uncomment this:
  // const isProd = process.env.NODE_ENV === 'production';
  // const base = isProd ? '/testBettingUI' : '';

  const plugins: PluginOption[] = [
    react({
      // Only apply Emotion in development if we need it
      jsxImportSource: mode === 'development' ? '@emotion/react' : undefined,
      babel: {
        plugins: mode === 'development' ? ['@emotion/babel-plugin'] : [],
      },
    }),
    ...devPlugins
  ];

  // Always add HTML base tag injection for GitHub Pages
  plugins.push({
    name: 'html-inject-base',
    transformIndexHtml(html: string) {
      // Only inject if not already present
      if (!html.includes('<base href=')) {
        return html.replace(
          /<head>/,
          `<head>\n    <base href="${base}/">`
        );
      }
      return html;
    },
  });

  return {
    plugins,
    // Base URL for GitHub Pages deployment
    base,
    // Ensure public directory is properly set
    publicDir: 'public',
    // Ensure proper handling of environment variables
    define: {
      'import.meta.env.BASE_URL': JSON.stringify(base),
    },
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
      sourcemap: !isProduction,
      minify: isProduction ? 'esbuild' : false,
      assetsDir: 'assets',
      emptyOutDir: true,
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
          },
        },
      },
    },
    server: {
      port: 3000,
      strictPort: true,
      historyApiFallback: {
        index: base,
        disableDotRule: true,
      },
      fs: {
        strict: true,
        allow: ['..'],
      },
    },
    preview: {
      port: 3000,
      strictPort: true,
      historyApiFallback: true,
    },
  };
});
