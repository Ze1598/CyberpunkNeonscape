import express, { type Express } from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer, createLogger } from "vite";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: {
      middlewareMode: true,
      hmr: { server },
      fs: {
        strict: false,
        allow: [
          path.resolve(__dirname, '..', 'client'),
          path.resolve(__dirname, '..', 'node_modules')
        ]
      }
    },
    appType: "spa",
  });

  // Serve static files from the client/public directory
  app.use(express.static(path.resolve(__dirname, '..', 'client', 'public')));

  // Add route for minimal test page
  app.get('/minimal', (req, res) => {
    try {
      const minimalHtmlPath = path.resolve(__dirname, '..', 'client', 'minimal.html');
      if (fs.existsSync(minimalHtmlPath)) {
        const html = fs.readFileSync(minimalHtmlPath, 'utf-8');
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } else {
        res.status(404).send('Minimal test page not found');
      }
    } catch (e) {
      console.error('Error serving minimal page:', e);
      res.status(500).send('Error serving minimal test page');
    }
  });

  // Add route for debug page
  app.get('/debug', (req, res) => {
    try {
      const debugHtmlPath = path.resolve(__dirname, '..', 'client', 'debug.html');
      if (fs.existsSync(debugHtmlPath)) {
        const html = fs.readFileSync(debugHtmlPath, 'utf-8');
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } else {
        res.status(404).send('Debug page not found');
      }
    } catch (e) {
      console.error('Error serving debug page:', e);
      res.status(500).send('Error serving debug page');
    }
  });

  // Add route for 3D mode (original app, might not work)
  app.get('/3d', async (req, res, next) => {
    try {
      // Read index.html
      let template = fs.readFileSync(
        path.resolve(__dirname, "..", "client", "index.html"),
        "utf-8"
      );

      // Apply Vite HTML transforms
      template = await vite.transformIndexHtml(req.originalUrl, template);

      res.status(200).set({ "Content-Type": "text/html" }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });

  // Use vite's connect instance as middleware for non-root routes
  app.use(vite.middlewares);

  // Default to our static HTML file for the main route
  app.get('/', (req, res) => {
    try {
      const indexPath = path.resolve(__dirname, '..', 'client', 'public', 'index.html');
      res.sendFile(indexPath);
    } catch (e) {
      console.error('Error serving root page:', e);
      res.status(500).send('Error serving page');
    }
  });

  // Catch-all route
  app.use("*", async (req, res) => {
    res.redirect('/');
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // Add route for minimal test page in production too
  app.get('/minimal', (req, res) => {
    try {
      const minimalHtmlPath = path.resolve(__dirname, '..', 'client', 'minimal.html');
      if (fs.existsSync(minimalHtmlPath)) {
        const html = fs.readFileSync(minimalHtmlPath, 'utf-8');
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } else {
        res.status(404).send('Minimal test page not found');
      }
    } catch (e) {
      console.error('Error serving minimal page:', e);
      res.status(500).send('Error serving minimal test page');
    }
  });

  // Add route for debug page in production too
  app.get('/debug', (req, res) => {
    try {
      const debugHtmlPath = path.resolve(__dirname, '..', 'client', 'debug.html');
      if (fs.existsSync(debugHtmlPath)) {
        const html = fs.readFileSync(debugHtmlPath, 'utf-8');
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } else {
        res.status(404).send('Debug page not found');
      }
    } catch (e) {
      console.error('Error serving debug page:', e);
      res.status(500).send('Error serving debug page');
    }
  });

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
