// src/infrastructure/server/app.ts
import express from "express";
import path from "path";
import { routeRouter } from "../../adapters/inbound/http/routeController";
import { bankingRouter } from "../../adapters/inbound/http/bankingController";
import { poolsRouter } from "../../adapters/inbound/http/poolsController";

export function createApp() {
  const app = express();
  app.use(express.json());

  // --- quick handler to satisfy Chrome DevTools lookup (avoids CSP console noise) ---
  app.get("/.well-known/appspecific/com.chrome.devtools.json", (_req, res) => {
    // respond with 204 No Content or an empty JSON object
    res.status(204).end();
    // or: res.json({});  // if you prefer JSON 200
  });

  // --- optional root endpoint so visiting / shows a friendly response instead of "Cannot GET /" ---
  app.get("/", (_req, res) => {
    res.json({ service: "fueleu-backend", status: "ok", docs: ["/health", "/routes"] });
  });

  // API routers
  app.use("/routes", routeRouter);
  app.use("/banking", bankingRouter);
  app.use("/pools", poolsRouter);

  // health
  app.get("/health", (_req, res) => res.json({ status: "ok" }));

  // error handler
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: any, _req: express.Request, res: express.Response, _next: any) => {
    console.error(err);
    res.status(500).json({ error: "internal server error" });
  });

  return app;
}
