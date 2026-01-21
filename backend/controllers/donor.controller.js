const Campaign = require("../models/Campaign");
const Donation = require("../models/Donation");
const School = require("../models/School");

// GET all campaigns (public, read-only)
exports.getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ status: "active" })
      .select("-adminNotes -internalFlags")
      .populate("schoolId", "name email verified");
    res.json({ success: true, data: campaigns });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET single campaign detail
exports.getCampaignDetail = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .select("-adminNotes -internalFlags")
      .populate("schoolId", "name email address phone");
    if (!campaign) return res.status(404).json({ success: false, message: "Campaign not found" });
    res.json({ success: true, data: campaign });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET campaign donations (anonymized)
exports.getCampaignDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ campaignId: req.params.id, isSimulation: true })
      .select("donorName amount createdAt isAnonymous")
      .sort({ createdAt: -1 });
    const anonymized = donations.map(d => ({
      ...d.toObject(),
      donorName: d.isAnonymous ? "Pendonar Anonim" : (d.donorName.split(" ")[0] + " L.")
    }));
    res.json({ success: true, data: anonymized });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST donation simulation
exports.submitDonationSimulation = async (req, res) => {
  try {
    const { campaignId, donorName, amount, isAnonymous } = req.body;
    if (!campaignId || !donorName || !amount) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    if (amount < 10000) {
      return res.status(400).json({ success: false, message: "Minimum donation is Rp 10,000" });
    }
    const donation = await Donation.create({
      campaignId,
      donorName,
      amount,
      isAnonymous: isAnonymous || false,
      isSimulation: true,
      status: "committed",
      paymentMethod: "simulation"
    });
    await Campaign.findByIdAndUpdate(campaignId, { $inc: { collectedAmount: amount, donorsCount: 1 } });
    res.status(201).json({ success: true, message: "Donation simulated successfully", data: donation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET platform transparency stats
exports.getPlatformStats = async (req, res) => {
  try {
    const totalCampaigns = await Campaign.countDocuments({ status: "active" });
    const totalDonations = await Donation.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]);
    const verifiedSchools = await School.countDocuments({ verified: true });
    res.json({
      success: true,
      data: {
        activeCampaigns: totalCampaigns,
        totalDonationAmount: totalDonations[0]?.total || 0,
        verifiedSchools: verifiedSchools
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET verified schools
exports.getVerifiedSchools = async (req, res) => {
  try {
    const schools = await School.find({ verified: true }).select("name email address city").limit(10);
    res.json({ success: true, data: schools });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
