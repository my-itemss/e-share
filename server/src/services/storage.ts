import { existsSync, mkdirSync, unlinkSync } from "fs";
import { createWriteStream } from "fs";
import { join } from "path";
import { UPLOAD_DIR } from "../config";

if (!existsSync(UPLOAD_DIR)) mkdirSync(UPLOAD_DIR);

export const saveFile = async (token: string, file: File) => {
  const filepath = join(UPLOAD_DIR, token + "-" + file.name);

  const stream = createWriteStream(filepath);
  stream.write(Buffer.from(await file.arrayBuffer()));
  stream.end();

  return filepath;
};

export const deleteFile = (path: string) => {
  try {
    unlinkSync(path);
  } catch {}
};
