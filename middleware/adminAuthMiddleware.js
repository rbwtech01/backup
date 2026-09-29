const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");

const adminAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Token is required."
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.adminId || decoded.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Invalid admin token."
      });
    }

    const admin = await Admin.findById(decoded.adminId);

    if (!admin || !admin.isActive || admin.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Admin account not found or inactive."
      });
    }

    req.admin = admin;

    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token."
      });
    }

    console.error("Admin authentication error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  }
};

module.exports = adminAuthMiddleware;