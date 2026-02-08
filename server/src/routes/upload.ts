import { Hono } from "hono";
import {
  MAX_FILE_SIZE,
  DEFAULT_EXPIRY_HOURS,
  MAX_EXPIRY_HOURS,
} from "../config";
import { generateToken } from "../services/token";
import { saveFile } from "../services/storage";
import { files } from "../db/memory";

export const uploadRoute = new Hono();

uploadRoute.post("/", async (c) => {
  const body = await c.req.parseBody();

  const file = body["file"];
  if (!file || typeof file === "string") {
    return c.text("No file", 400);
  }

  if (file.size > MAX_FILE_SIZE) {
    return c.text("File too large", 400);
  }

  let expiryHours = Number(body["expiryHours"] || DEFAULT_EXPIRY_HOURS);

  if (isNaN(expiryHours) || expiryHours <= 0) {
    expiryHours = DEFAULT_EXPIRY_HOURS;
  }

  expiryHours = Math.min(expiryHours, MAX_EXPIRY_HOURS);

  const expiresAt = Date.now() + expiryHours * 60 * 60 * 1000;

  const token = generateToken();
  const path = await saveFile(token, file);

  files.set(token, {
    path,
    expiresAt,
    name: file.name,
  });

  return c.json({
    token,
    url: `/f/${token}`,
    expiresAt,
    expiryHours,
  });
});
