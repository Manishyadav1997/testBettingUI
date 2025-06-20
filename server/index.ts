import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { registerRoutes } from "./routes";
import { setupVite } from "./vite";
import { WebSocketServer } from 'ws';
import fs from 'fs/promises';
import { nanoid } from 'nanoid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple logger
function log(message: string, context = 'express') {
  const timestamp = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
  console.log(`${timestamp} [${context}] ${message}`);
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Handle static files and client-side routing
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    // In production, serve static files from the dist directory
    const distPath = path.resolve(process.cwd(), 'dist');
    const basePath = '/testBettingUI';
    log(`Serving static files from: ${distPath}`);
    
    try {
      // Log the files in the dist directory for debugging
      const files = await fs.readdir(distPath);
      log(`Files in dist directory: ${files.join(', ')}`);
      
      // Create a router for the base path
      const router = express.Router();
      
      // Serve static files with proper base path handling
      router.use(express.static(distPath, {
        index: false, // Disable automatic index.html serving
        maxAge: '1y',
        etag: true,
        lastModified: true,
        setHeaders: (res, filePath) => {
          if (filePath.endsWith('.html')) {
            // Disable caching for HTML files
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
          }
        },
      }));
      
      // Serve index.html for the root path and any other non-API routes
      router.get(['/', '/*'], (req, res, next) => {
        // Skip API routes
        if (req.path.startsWith('/api')) {
          return next();
        }
        
        log(`Serving index.html for route: ${req.path}`);
        res.sendFile(path.join(distPath, 'index.html'), (err) => {
          if (err) {
            log(`Error serving index.html: ${err.message}`, 'error');
            res.status(500).send('Error loading the application');
          }
        });
      });
      
      // Mount the router at the base path
      app.use(basePath, router);
      
      // Also serve at the root for local development
      if (process.env.NODE_ENV !== 'production') {
        app.use(express.static(distPath));
        app.get('*', (req, res) => {
          res.sendFile(path.join(distPath, 'index.html'));
        });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      log(`Error setting up static file serving: ${errorMessage}`, 'error');
      process.exit(1);
    }
  }

  // Serve the app on port 3000 for development
  const port = 3000;
  server.listen(port, '127.0.0.1', () => {
    log(`Server running at http://127.0.0.1:${port}`);
  });
})();
