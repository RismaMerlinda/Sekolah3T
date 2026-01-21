const express = require("express");
const router = express.Router();
const donorController = require("../controllers/donor.controller");

// GET endpoints (read-only)
router.get("/campaigns", donorController.getAllCampaigns);
router.get("/campaigns/:id", donorController.getCampaignDetail);
router.get("/campaigns/:id/donations", donorController.getCampaignDonations);
router.get("/stats", donorController.getPlatformStats);
router.get("/schools", donorController.getVerifiedSchools);

// POST endpoints (simulation only)
router.post("/donations/simulate", donorController.submitDonationSimulation);

module.exports = router;
