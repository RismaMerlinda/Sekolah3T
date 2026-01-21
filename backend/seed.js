const mongoose = require('mongoose');
require('dotenv').config();

// Load models
const Campaign = require('./models/Campaign');
const School = require('./models/School');

async function seedData() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected!');

        // 1. Create a dummy school
        console.log('Creating dummy school...');
        const school = await School.create({
            schoolName: 'SDN 01 Harapan Bangsa',
            npsn: '12345678',
            email: 'info@sdn01harapan.sch.id',
            password: 'hashed_password_example',
            isVerified: true
        });

        // 2. Create a dummy campaign
        console.log('Creating dummy campaign...');
        await Campaign.create({
            title: 'Pembangunan Laboratorium Komputer',
            description: 'Membantu siswa di Jayawijaya mendapatkan akses teknologi pertama mereka.',
            schoolId: school._id,
            schoolName: school.schoolName,
            location: 'Jayawijaya, Papua',
            targetAmount: 50000000,
            collectedAmount: 15000000,
            donorsCount: 15,
            category: 'teknologi',
            status: 'active',
            verified: true
        });

        console.log('✅ SEEDING BERHASIL! Silakan cek website Anda.');
        process.exit();
    } catch (error) {
        console.error('❌ Seeding gagal:', error);
        process.exit(1);
    }
}

seedData();
