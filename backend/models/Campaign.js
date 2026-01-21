const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    fullDescription: { type: String, default: null },
    category: { type: String, enum: ['infrastruktur', 'beasiswa', 'kesehatan', 'teknologi', 'lainnya'], default: 'infrastruktur' },
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
    schoolName: { type: String, required: true },
    location: { type: String, required: true },
    imageUrl: { type: String, default: null },
    galleryImages: [{ type: String }],
    targetAmount: { type: Number, required: true, min: 1000000 },
    collectedAmount: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
    verificationDate: { type: Date, default: null },
    status: { type: String, enum: ['active', 'completed', 'closed'], default: 'active' },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: null },
    fundAllocation: [
      {
        name: String,
        percentage: Number,
        amount: Number,
        description: String,
      },
    ],
    timelineEvents: [
      {
        date: String,
        title: String,
        description: String,
        status: { type: String, enum: ['completed', 'ongoing', 'upcoming'], default: 'upcoming' },
      },
    ],
    donorsCount: { type: Number, default: 0 },
    adminNotes: { type: String, default: null },
    internalFlags: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Campaign', CampaignSchema);
