const mongoose = require('mongoose');
require('dotenv').config();

// Load models
const Campaign = require('./models/Campaign');
const School = require('./models/School');
const Donation = require('./models/Donation');

async function clearData() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected!');

        console.log('Cleaning up collections...');
        await Campaign.deleteMany({});
        await School.deleteMany({});
        await Donation.deleteMany({});

        console.log('✅ DATABASE BERHASIL DIKOSONGKAN!');
        process.exit();
    } catch (error) {
        console.error('❌ Gagal mengosongkan database:', error);
        process.exit(1);
    }
}

clearData();
