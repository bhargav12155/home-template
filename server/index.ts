import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import { registerRoutes } from "./routes";
// ...existing code...
// Do NOT import setupVite or serveStatic here!
import { db } from "./db";
import { templates } from "@shared/schema";
import { loadTemplate, TemplateRequest } from "./template-middleware";
import { authRoutes } from "./auth-routes";
import { uploadRoutes } from "./upload-routes";
import { optionalAuth } from "./auth-middleware";

// __dirname is not available in native ESM; recreate it for our module.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); // Parse cookies for authentication

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

      console.log(logLine);
    }
  });

  next();
});

// Add optional authentication middleware (adds user if authenticated)
app.use(optionalAuth);

// Add template middleware
app.use(loadTemplate);

// Authentication routes
app.use("/api/auth", authRoutes);

// File upload routes
app.use("/api/upload", uploadRoutes);

(async () => {
  const server = await registerRoutes(app);

  // Only run Vite in non-production; this condition is build-time optimized by esbuild define
  if (process.env.NODE_ENV !== "production") {
    const { setupVite } = await import("./vite");
    await setupVite(app, server);
  } else {
    // In production, serve pre-built static files (NO vite dependency at runtime)
    // dist/index.js lives in /var/app/current/dist on EB, and assets are in dist/public
    const publicDir = path.join(__dirname, "public"); // dist/public
    app.use(express.static(publicDir));
    // SPA fallback to index.html for client-side routing (after API & static middleware)
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api")) return next();
      res.sendFile(path.join(publicDir, "index.html"));
    });
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  // Use PORT env var if provided, otherwise default to 8081 for AWS, 5080 for local
  const port = parseInt(
    process.env.PORT ||
      (process.env.NODE_ENV === "production" ? "8080" : "5080"),
    10
  );
  server.listen(port, "0.0.0.0", () => {
    console.log(`serving on port ${port}`);

    // Quick async DB connectivity check (non-blocking)
    (async () => {
      if (!db) {
        console.log(
          "DB: no database object initialized (likely development / missing DATABASE_URL)"
        );
        return;
      }
      try {
        // Perform lightweight query; drizzle select limit 1
        const result: any = await db.execute(`SELECT NOW() as now`);
        const now = Array.isArray(result) ? result[0]?.now : undefined;
        const [tpl] = await db.select().from(templates).limit(1);
        console.log(
          `DB: connected. NOW()=${now}. templates.count=${tpl ? 1 : 0}`
        );
      } catch (err) {
        console.log(`DB: connection/query failed: ${(err as Error).message}`);
      }
    })();
  });

  // Simple health probe for DB status
  app.get("/api/db-health", async (_req: Request, res: Response) => {
    if (!db) {
      return res
        .status(503)
        .json({ ok: false, message: "No db instance (likely not configured)" });
    }
    try {
      const result: any = await db.execute(`SELECT NOW() as now`);
      const now = Array.isArray(result) ? result[0]?.now : undefined;
      const [tpl] = await db.select().from(templates).limit(1);
      res.json({ ok: true, now, hasTemplate: !!tpl });
    } catch (err) {
      res.status(500).json({ ok: false, error: (err as Error).message });
    }
  });
})();
