/**
 * SERVER SETUP - INTEGRATION GUIDE
 * 
 * Add this to your backend/server.js or main Express app file
 * 
 * ⚠️ CRITICAL: This integrates DONOR routes in a COMPLETELY ISOLATED way
 * ✅ Donor routes are PUBLIC and READ-ONLY (except simulation)
 * ✅ Admin and School routes remain PRIVATE and UNCHANGED
 */

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// ============================================
// MIDDLEWARE
// ============================================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// DATABASE CONNECTION
// ============================================

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sahabat3t')
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection failed:', err));

// ============================================
// ROUTES SETUP - STRICT SEPARATION
// ============================================

// 1️⃣ DONOR ROUTES (PUBLIC - READ-ONLY + SIMULATION)
// Location: /backend/routes/donor.routes.js
// No authentication required
// Prefix: /api/donor/*
const donorRoutes = require('./routes/donor.routes');
app.use('/api/donor', donorRoutes);

// 2️⃣ ADMIN ROUTES (PRIVATE - ADMIN ONLY)
// Location: /backend/routes/admin.routes.js (existing)
// Requires: Admin authentication middleware
// Prefix: /api/admin/*
// ⚠️ DO NOT MODIFY - Already exists
const adminRoutes = require('./routes/admin.routes');
const adminAuthMiddleware = require('./middleware/adminAuth'); // Your existing auth
app.use('/api/admin', adminAuthMiddleware, adminRoutes);

// 3️⃣ SCHOOL ROUTES (PRIVATE - SCHOOL ONLY)
// Location: /backend/routes/school.routes.js (existing)
// Requires: School authentication middleware
// Prefix: /api/school/*
// ⚠️ DO NOT MODIFY - Already exists
const schoolRoutes = require('./routes/school.routes');
const schoolAuthMiddleware = require('./middleware/schoolAuth'); // Your existing auth
app.use('/api/school', schoolAuthMiddleware, schoolRoutes);

// 4️⃣ AUTH ROUTES (PUBLIC - for login)
// Location: /backend/routes/auth.routes.js (existing)
// Prefix: /api/auth/*
// ⚠️ DO NOT MODIFY - Already exists
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint not found: ${req.method} ${req.path}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('✅ Server running on port', PORT);
  console.log('');
  console.log('📍 Available Routes:');
  console.log('   🌐 Donor (PUBLIC):   GET  /api/donor/*');
  console.log('   🔐 Admin (PRIVATE):  /api/admin/*');
  console.log('   🔐 School (PRIVATE): /api/school/*');
  console.log('   🔓 Auth:             POST /api/auth/login');
  console.log('');
});

module.exports = app;

/**
 * ============================================
 * ROUTE STRUCTURE OVERVIEW
 * ============================================
 * 
 * 🌐 PUBLIC DONOR ROUTES (No Auth)
 * ├── GET  /api/donor/campaigns
 * ├── GET  /api/donor/campaigns/:id
 * ├── GET  /api/donor/campaigns/search
 * ├── GET  /api/donor/campaigns/:id/reports
 * ├── GET  /api/donor/transparency/stats
 * ├── GET  /api/donor/schools/verified
 * ├── POST /api/donor/donations/simulate
 * ├── GET  /api/donor/campaigns/:id/donations
 * └── GET  /api/donor/campaigns/:id/top-donors
 * 
 * 🔐 ADMIN ROUTES (Admin Auth Required)
 * ├── POST   /api/admin/campaigns
 * ├── PUT    /api/admin/campaigns/:id
 * ├── DELETE /api/admin/campaigns/:id
 * ├── GET    /api/admin/campaigns (with filters)
 * ├── POST   /api/admin/schools/verify
 * ├── GET    /api/admin/reports
 * └── ... (other admin operations)
 * 
 * 🔐 SCHOOL ROUTES (School Auth Required)
 * ├── GET    /api/school/profile
 * ├── PUT    /api/school/profile
 * ├── POST   /api/school/campaigns/:id/reports
 * ├── GET    /api/school/campaigns
 * └── ... (other school operations)
 * 
 * 🔓 AUTH ROUTES (Public)
 * ├── POST /api/auth/login
 * ├── POST /api/auth/register
 * └── POST /api/auth/logout
 * 
 * ============================================
 * SECURITY RULES - DO NOT BREAK THESE
 * ============================================
 * 
 * ✅ DO:
 * - Keep donor routes separate from admin/school
 * - Mark donations as simulation with isSimulation: true
 * - Anonymize donor names in public responses
 * - Exclude admin fields from donor responses
 * - Test role boundaries
 * - Log access to sensitive endpoints
 * 
 * ❌ DON'T:
 * - Mix donor logic with admin logic
 * - Add authentication to donor routes
 * - Expose admin/school endpoints to donors
 * - Modify campaign.collectedAmount for simulations
 * - Return admin fields in donor responses
 * - Remove role separation middleware
 */
