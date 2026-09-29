const express = require("express");
const { login } = require("../controllers/adminAuthController");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

const router = express.Router();

router.post("/login", login);


module.exports = router;