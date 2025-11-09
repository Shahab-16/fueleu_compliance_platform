import { createApp } from "./app";
import dotenv from "dotenv";

dotenv.config();

const app = createApp();
const port = Number(process.env.PORT || 4000);

app.listen(port, () => {
  console.log(`Dev server running on http://localhost:${port}`);
});
