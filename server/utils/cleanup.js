const fs = require("fs-extra");
const path = require("path");

const DATA_FILE = path.join(__dirname, "../data/files.json");
const UPLOAD_DIR = path.join(__dirname, "../uploads");

module.exports = function startCleanup() {
  setInterval(() => {
    const files = fs.readJsonSync(DATA_FILE, { throws: false }) || [];
    const now = Date.now();

    const valid = [];

    files.forEach(file => {
      if (file.expiresAt < now) {
        fs.remove(path.join(UPLOAD_DIR, file.filename));
      } else {
        valid.push(file);
      }
    });

    fs.writeJsonSync(DATA_FILE, valid);
  }, 60 * 60 * 1000); 
};
