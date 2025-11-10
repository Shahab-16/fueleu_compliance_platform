// backend/src/infrastructure/server/dev.ts
import { createApp } from "./app";
import dotenv from "dotenv";

dotenv.config();

const app = createApp();
const port = Number(process.env.PORT) || 4000;

app.listen(port, () => {
  console.log(`🚀 Backend server running at: http://localhost:${port}`);
  console.log("CORS Origin:", process.env.CORS_ORIGIN || "http://localhost:4000");
});
