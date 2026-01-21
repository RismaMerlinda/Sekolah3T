const mongoose = require('mongoose');

const DonorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, default: null },
    city: { type: String, default: null },
    totalDonated: { type: Number, default: 0 },
    donationHistory: [
      {
        campaignId: mongoose.Schema.Types.ObjectId,
        amount: Number,
        date: { type: Date, default: Date.now },
        status: { type: String, enum: ['committed', 'completed'], default: 'committed' },
        isSimulation: { type: Boolean, default: true },
      },
    ],
    isAnonymous: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Donor', DonorSchema);
