// backend/src/infrastructure/server/app.ts
import express from "express";
import path from "path";
import cors from "cors";
import fs from "fs";
import { routeRouter } from "../../adapters/inbound/http/routeController";
import { bankingRouter } from "../../adapters/inbound/http/bankingController";
import { poolsRouter } from "../../adapters/inbound/http/poolsController";
import { complianceRouter } from "../../adapters/inbound/http/complianceController";

export function createApp() {
  const app = express();
  app.use(express.json());

  // --- Enable CORS (allow frontend on localhost:3000 during dev) ---
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // --- Chrome DevTools lookup handler (avoids CSP console noise) ---
  app.get("/.well-known/appspecific/com.chrome.devtools.json", (_req, res) => {
    res.status(204).end(); // empty response = fine
  });

  // --- Root health/info route ---
  app.get("/", (_req, res) => {
    res.json({
      service: "fueleu-backend",
      status: "ok",
      availableRoutes: ["/health", "/routes", "/banking", "/pools"],
    });
  });

  // --- Main API routers ---
  app.use("/routes", routeRouter);
  app.use("/banking", bankingRouter);
  app.use("/pools", poolsRouter);
  app.use("/compliance", complianceRouter);

  // --- Health endpoint ---
  app.get("/health", (_req, res) => res.json({ status: "ok" }));

  // --- Serve built frontend (for production) ---
  const frontendPaths = [
    path.join(process.cwd(), "../frontend/dist"),
    path.join(process.cwd(), "../frontend/build"),
    path.join(process.cwd(), "frontend/dist"),
    path.join(process.cwd(), "frontend/build"),
  ];

  for (const buildPath of frontendPaths) {
    if (fs.existsSync(buildPath)) {
      console.log(`✅ Serving frontend from: ${buildPath}`);
      app.use(express.static(buildPath));

      // For any route not starting with API prefixes, serve index.html
      app.get("*", (req, res, next) => {
        if (
          req.path.startsWith("/routes") ||
          req.path.startsWith("/banking") ||
          req.path.startsWith("/pools") ||
          req.path.startsWith("/health") ||
          req.path.startsWith("/.well-known")
        ) {
          return next();
        }
        res.sendFile(path.join(buildPath, "index.html"));
      });
      break;
    }
  }

  // --- Global error handler ---
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: any, _req: express.Request, res: express.Response, _next: any) => {
    console.error("❌ Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  });

  return app;
}
