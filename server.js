const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

require("./config/db");

const app = express();

// Middleware
app.use(express.json());
app.use("/api/admin/auth", require("./routes/adminAuthRoutes"));
app.use("/api/admin/machines", require("./routes/machineRoutes"));



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});