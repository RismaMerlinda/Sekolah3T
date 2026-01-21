const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema(
  {
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor', default: null },
    donorName: { type: String, required: true },
    amount: { type: Number, required: true, min: 10000 },
    status: { type: String, enum: ['committed', 'completed', 'failed', 'refunded'], default: 'committed' },
    isSimulation: { type: Boolean, default: true },
    paymentMethod: { type: String, enum: ['simulation', 'bank_transfer', 'e_wallet', 'card'], default: 'simulation' },
    description: { type: String, default: null },
    isAnonymous: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Donation', DonationSchema);
