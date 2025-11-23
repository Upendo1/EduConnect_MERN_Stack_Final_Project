const express = require("express");
const {
  getAdminStats,
  getAdminRecentActivity,
} = require("../controllers/adminController");

const router = express.Router();

router.get("/stats", getAdminStats);
router.get("/activity", getAdminRecentActivity);

module.exports = router;
