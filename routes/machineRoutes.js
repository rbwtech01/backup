
const express = require("express");

const router = express.Router();

const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

const {
  createMachine,
  getMachines,
  getMachine,
  updateMachine,
  deleteMachine
} = require("../controllers/machineController");

// All routes require admin authentication
router.use(adminAuthMiddleware);

router.post("/", createMachine);
router.get("/", getMachines);
router.get("/:id", getMachine);
router.put("/:id", updateMachine);
router.delete("/:id", deleteMachine);

module.exports = router;