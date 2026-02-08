import { files } from "../db/memory";
import { deleteFile } from "./storage";
import { CLEANUP_INTERVAL } from "../config";

export const startCleanupJob = () => {
  setInterval(() => {
    const now = Date.now();

    for (const [token, meta] of files) {
      if (now > meta.expiresAt) {
        deleteFile(meta.path);
        files.delete(token);
        console.log("Deleted expired:", token);
      }
    }
  }, CLEANUP_INTERVAL);
};
