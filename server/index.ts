import { Hono } from "hono";
import { cors } from "hono/cors";
import { uploadRoute } from "./src/routes/upload";
import { fileRoute } from "./src/routes/file";
import { startCleanupJob } from "./src/services/expiry";

const app = new Hono();

app.use("*", cors());

app.route("/upload", uploadRoute);
app.route("/f", fileRoute);

app.get("/", (c) => c.text("File sharing API running"));

startCleanupJob();

Bun.serve({
  port: 7001,
  fetch: app.fetch,
});

console.log("Server running on http://localhost:7001");
