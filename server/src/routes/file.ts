import { Hono } from "hono";
import { files } from "../db/memory";
import { deleteFile } from "../services/storage";

export const fileRoute = new Hono();

fileRoute.get("/:token", (c) => {
  const token = c.req.param("token");
  const meta = files.get(token);

  if (!meta) return c.text("Invalid link", 404);

  if (Date.now() > meta.expiresAt) {
    deleteFile(meta.path);
    files.delete(token);
    return c.text("Expired", 410);
  }

  return new Response(Bun.file(meta.path), {
    headers: {
      "Content-Disposition": `attachment; filename="${meta.name}"`,
    },
  });
});
