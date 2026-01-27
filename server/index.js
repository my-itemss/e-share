const express = require("express");
const cors = require("cors");
const fileRoutes = require("./routes/fileRoutes");
const startCleanup = require("./utils/cleanup");

const app = express();

app.use(cors());
app.use("/api", fileRoutes);

app.listen(3000, () => {
  console.log(" Server running on http://localhost:3000");
});

startCleanup();
