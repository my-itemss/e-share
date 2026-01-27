const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs-extra");
const path = require("path");

const router = express.Router();

const UPLOAD_DIR = path.join(__dirname, "../uploads");
const DATA_FILE = path.join(__dirname, "../data/files.json");

fs.ensureDirSync(UPLOAD_DIR);
fs.ensureFileSync(DATA_FILE);

const readFiles = () => fs.readJsonSync(DATA_FILE, { throws: false }) || [];
const writeFiles = (data) => fs.writeJsonSync(DATA_FILE, data);


const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOAD_DIR),
  filename: (_, file, cb) => {
    const name =
      crypto.randomBytes(12).toString("hex") + path.extname(file.originalname);
    cb(null, name);
  },
});


const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 * 1024, 
  },
});


router.post("/upload", upload.single("file"), (req, res) => {
  const id = crypto.randomBytes(8).toString("hex");

  const files = readFiles();
  files.push({
    id,
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24h
  });

  writeFiles(files);

  res.json({
    success: true,
    link: `http://localhost:3000/api/download/${id}`,
    sizeMB: (req.file.size / 1024 / 1024).toFixed(2),
  });
});


router.get("/download/:id", (req, res) => {
  const files = readFiles();
  const file = files.find(f => f.id === req.params.id);

  if (!file) return res.status(404).json({ error: "File not found" });
  if (Date.now() > file.expiresAt)
    return res.status(410).json({ error: "Link expired" });

  const filePath = path.join(UPLOAD_DIR, file.filename);

  res.setHeader("Content-Disposition", `attachment; filename="${file.originalName}"`);
  res.setHeader("Content-Type", "application/octet-stream");

  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
});

module.exports = router;
