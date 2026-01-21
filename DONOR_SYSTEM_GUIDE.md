# SAHABAT3T - DONOR SYSTEM ARCHITECTURE & IMPLEMENTATION GUIDE

## 📋 PROJECT OVERVIEW

This document outlines the complete implementation of the **DONOR-ONLY** landing page and systems for SAHABAT3T, a crowdfunding platform for schools in remote areas (3T).

**Key Principle**: The donor system is completely isolated and read-only. Donors can ONLY view campaigns and submit donation simulations.

---

## 🎯 SCOPE & BOUNDARIES

### ✅ DONOR CAN:
- View all active campaigns
- View campaign details, progress, and timeline
- View transparency reports
- View verified schools
- Submit donation commitments (simulation only, no payment)
- Search and filter campaigns

### ❌ DONOR CANNOT:
- Create or edit campaigns
- Upload reports
- Verify schools
- Access admin features
- Access school management features
- Make real payments
- Delete or modify campaigns

---

## 📁 FOLDER STRUCTURE (IMPLEMENTED)

### Frontend (Next.js)
```
app/donor/
├── layout.tsx              # Donor-specific layout with header & footer
├── page.tsx               # Landing page (hero, trust, featured campaigns)
└── campaigns/
    ├── page.tsx           # Campaign list with search & filters
    └── [id]/
        └── page.tsx       # Campaign detail with timeline & donation form

components/donor/
├── Header.tsx             # Navigation header with donor branding
├── CampaignCard.tsx       # Reusable campaign card component
├── ProgressBar.tsx        # Funding progress visualization
├── VerificationBadge.tsx  # Verified school indicator
├── TimelineComponent.tsx  # Campaign timeline display
├── DonationForm.tsx       # Donation simulation form
└── TrustSection.tsx       # Trust & transparency section

lib/
└── donor-api.ts          # All donor-facing API calls (GET & POST simulation)
```

### Backend (Node.js + Express)
```
backend/
├── routes/
│   └── donor.routes.js            # Public donor routes (READ-ONLY + simulation)
├── controllers/
│   └── donor.controller.js        # Donor logic (no admin/school operations)
└── models/
    ├── Campaign.js                # Existing (not modified)
    ├── School.js                  # Existing (not modified)
    ├── Donation.js                # For donation simulation records
    └── User.js                    # Existing (not modified)
```

---

## 🎨 DESIGN SYSTEM - SAHABAT3T COLOR PALETTE

All colors are defined in `/app/globals.css` and available globally via Tailwind:

### Primary Colors (CTAs & Highlights)
- `from-[#40E0D0]` - Primary Turquoise (vibrant, trust-building)
- `to-[#2CB1A6]` - Primary Darker (hover states)
- `to-[#1E8F86]` - Primary Darkest (active states)

### Secondary Colors (Backgrounds & Accents)
- `bg-[#E6FFFA]` - Mint Light (soft backgrounds)
- `bg-[#CCFBF1]` - Mint Soft (card backgrounds)
- `border-[#B2F5EA]` - Mint Border (subtle borders)

### Neutral/Text
- `text-[#0F2F2E]` - Text Dark (headings)
- `text-[#4A6F6C]` - Text Body (body text)
- `text-[#6B8E8B]` - Text Muted (secondary text)
- `text-white` - White text

### Status Colors
- `text-green-700` / `bg-green-50` - Success/Verified
- `text-blue-700` / `bg-blue-50` - Info
- `text-red-700` - Error

---

## 🔗 API ENDPOINTS

### Public Read-Only Endpoints

#### Campaigns
```
GET  /api/donor/campaigns                    # List all active campaigns
GET  /api/donor/campaigns/:id                # Get campaign details
GET  /api/donor/campaigns/search             # Search campaigns (q, category, status)
```

#### Transparency & Reports
```
GET  /api/donor/campaigns/:id/reports        # Get fund allocation breakdown
GET  /api/donor/transparency/stats           # Platform-wide stats
GET  /api/donor/schools/verified             # List verified schools
```

#### Donations & Commitments
```
POST /api/donor/donations/simulate           # Submit donation simulation (WRITE)
GET  /api/donor/campaigns/:id/donations      # Get recent donations (anonymized)
GET  /api/donor/campaigns/:id/top-donors     # Get top donors (anonymized)
```

### Request/Response Examples

**POST /api/donor/donations/simulate**
```json
{
  "campaignId": "64d1e2f3a4b5c6d7e8f9g0h1",
  "donorName": "Budi Santoso",
  "amount": 100000,
  "email": "budi@example.com" // optional
}

Response:
{
  "success": true,
  "message": "Donation commitment recorded successfully",
  "data": {
    "donationId": "64d1e2f3a4b5c6d7e8f9g0h2",
    "campaignId": "64d1e2f3a4b5c6d7e8f9g0h1",
    "amount": 100000,
    "donorName": "Budi Santoso",
    "status": "committed",
    "isSimulation": true,
    "timestamp": "2026-01-21T10:30:00Z"
  }
}
```

---

## 🚀 FEATURES IMPLEMENTED

### 1. Landing Page (`/donor`)
- **Hero Section**
  - Emotional headline
  - Supporting paragraph
  - Primary CTA button
  - Visual placeholder

- **Statistics Section**
  - Total funds raised
  - Total active donors
  - Number of active campaigns
  - Number of supported schools

- **Trust & Transparency Section**
  - Verified schools badge
  - 100% transparency guarantee
  - Zero platform fee
  - Regular reports

- **Featured Campaigns**
  - Display 4 featured campaigns
  - Campaign cards with progress bars
  - Verification badges
  - Quick "View Details" links

- **Call-to-Action Section**
  - Final push to explore campaigns

- **Footer**
  - About platform
  - Quick links
  - Contact information
  - Social media

### 2. Campaign List (`/donor/campaigns`)
- **Responsive Grid Layout**
  - 1 column mobile
  - 2 columns tablet
  - 2-column main + 1-column sidebar desktop

- **Sidebar Filters**
  - Search by keyword (title, school, location)
  - Category filter (infrastruktur, beasiswa, teknologi, kesehatan)
  - Sort options (newest, highest-funded, most donors, ending soon)

- **Campaign Cards**
  - School logo/image
  - Campaign title & description
  - Verification badge
  - Progress bar
  - Donor count
  - Quick view link

- **Empty State**
  - Helpful message when no results found

### 3. Campaign Detail (`/donor/campaigns/[id]`)
- **Header Section**
  - Campaign title
  - Verification badge
  - Category badge
  - Status badge

- **Progress Visualization**
  - Large progress bar
  - Funding percentage
  - Days remaining
  - Donor count

- **Campaign Information**
  - Full description
  - Fund allocation breakdown with percentages
  - Timeline of activities (completed, ongoing, upcoming)
  - School information
  - Address & contact

- **Donation Simulation Form**
  - Donor name input
  - Predefined donation amounts
  - Custom amount input
  - Form validation
  - Success message

- **Sidebar with Trust Indicators**
  - Verified school checkbox
  - Transparency guarantee
  - Zero fees badge

### 4. Components Library

#### CampaignCard.tsx
- Displays campaign preview
- Shows progress bar
- Verification badge
- Link to detail page

#### ProgressBar.tsx
- Visual funding progress
- Current vs target amounts
- Percentage display
- Formatted currency

#### VerificationBadge.tsx
- Shows school verification status
- Verification date
- Multiple size options

#### DonationForm.tsx
- Form validation
- Predefined amounts
- Custom amount input
- Success confirmation
- Error handling

#### TimelineComponent.tsx
- Visual timeline of activities
- Status indicators (completed, ongoing, upcoming)
- Date and description for each event

#### TrustSection.tsx
- 4-column trust indicators
- Icons and descriptions
- Responsive design

#### Header.tsx
- Fixed navigation
- Logo & branding
- Desktop & mobile navigation
- Responsive menu

---

## 🔐 SECURITY & ROLE BOUNDARIES

### API Layer Security

**File**: `/backend/routes/donor.routes.js`
```javascript
// ✅ Public routes (no auth required)
router.get('/campaigns', ...)
router.get('/campaigns/:id', ...)
router.get('/campaigns/search', ...)

// ✅ Public simulation (no auth, simulation only)
router.post('/donations/simulate', ...)

// ❌ Never added (admin only)
// router.post('/campaigns', ...)          // Create campaign
// router.put('/campaigns/:id', ...)       // Edit campaign
// router.delete('/campaigns/:id', ...)    // Delete campaign
```

### Controller Security

**File**: `/backend/controllers/donor.controller.js`

```javascript
// Only returns non-admin fields
const campaigns = await Campaign.find({...})
  .select('-adminNotes -internalFlags')  // Exclude admin fields

// Donations are marked as simulation
const donation = new Donation({
  ...data,
  isSimulation: true,        // Mark as simulation
  status: 'committed',       // Not actual donation
});

// Donor names are anonymized
const anonymized = donations.map(d => {
  // Budi Santoso → Budi S.
  return `${first} ${last.charAt(0)}.`;
});
```

### Frontend Security

**File**: `/lib/donor-api.ts`
```typescript
// Only GET and POST simulation
export const getDonorCampaigns = () => axios.get('/api/donor/campaigns')
export const submitDonationSimulation = () => axios.post('/api/donor/donations/simulate')

// No PUT, DELETE, or admin calls
```

---

## 🌐 ROLE SEPARATION RULES (CRITICAL)

### ✅ DONOR ROUTES - Completely Separate
- Location: `/backend/routes/donor.routes.js`
- Exports: `read-only GET` + `simulation POST`
- No authentication required
- No admin fields exposed

### ❌ ADMIN ROUTES - Never Modified
- Location: `/backend/routes/admin.routes.js` (existing)
- Contains: Campaign creation, verification, reports
- Requires: Admin authentication
- Not imported in donor system

### ❌ SCHOOL ROUTES - Never Modified
- Location: `/backend/routes/school.routes.js` (existing)
- Contains: School profile, report uploads
- Requires: School authentication
- Not imported in donor system

### 🚀 Server Setup
```javascript
// In server.js or main app file
app.use('/api/donor', donorRoutes);      // ✅ Public
app.use('/api/admin', adminRoutes);      // ❌ Admin only
app.use('/api/school', schoolRoutes);    // ❌ School only
```

---

## 📊 DATA MODELS

### Campaign Model (Existing)
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  fullDescription: String,
  schoolId: ObjectId, // Reference to School
  targetAmount: Number,
  collectedAmount: Number,
  imageUrl: String,
  category: String,
  status: 'active' | 'completed' | 'closed',
  timelineEvents: Array,
  fundAllocation: Array,
  adminNotes: String,        // ❌ NOT exposed to donors
  internalFlags: Object,     // ❌ NOT exposed to donors
  createdAt: Date,
  updatedAt: Date
}
```

### Donation Model (New for Simulation)
```javascript
{
  _id: ObjectId,
  campaignId: ObjectId,      // Reference to Campaign
  donorName: String,
  email: String,
  amount: Number,
  isSimulation: true,        // Always true for donor submissions
  status: 'committed',       // Always 'committed', never 'completed'
  createdAt: Date
}
```

---

## 🔄 Integration Checklist

### Backend Setup
- [ ] Create `/backend/controllers/donor.controller.js`
- [ ] Create `/backend/routes/donor.routes.js`
- [ ] Create `Donation` model for simulation records
- [ ] Add donor routes to main server file: `app.use('/api/donor', donorRoutes)`
- [ ] Test all GET endpoints
- [ ] Test POST donation simulation

### Frontend Setup
- [ ] Create `/app/donor/` folder structure
- [ ] Create `/components/donor/` components
- [ ] Create `/lib/donor-api.ts` utilities
- [ ] Update navigation to link to `/donor`
- [ ] Test all pages and forms
- [ ] Verify Tailwind colors are working

### Testing
- [ ] Test campaign list page (load & filter)
- [ ] Test campaign detail page
- [ ] Test donation form submission
- [ ] Verify donor data doesn't show admin fields
- [ ] Test search functionality
- [ ] Test responsive design (mobile, tablet, desktop)
- [ ] Test error handling

---

## 🎯 BEST PRACTICES FOR DEPLOYMENT

### 1. Never Mix Roles
```javascript
// ❌ WRONG - Mixing donor and admin logic
router.get('/campaigns/:id', (req, res) => {
  if (req.isAdmin) {
    // return full data with admin fields
  } else {
    // return limited data
  }
});

// ✅ RIGHT - Complete separation
// /routes/donor.routes.js
router.get('/campaigns/:id', donorController.getCampaignDetail);

// /routes/admin.routes.js
router.get('/campaigns/:id', adminController.getCampaignDetail);
```

### 2. Always Anonymize Donor Data
```javascript
// ✅ Anonymize names: Budi Santoso → Budi S.
const anonymizeName = (fullName) => {
  const parts = fullName.split(' ');
  return parts.length > 1 
    ? `${parts[0]} ${parts[parts.length-1].charAt(0)}.`
    : parts[0];
};
```

### 3. Mark Simulations Clearly
```javascript
// ✅ Always mark donations as simulation
const donation = new Donation({
  ...data,
  isSimulation: true,
  status: 'committed', // Not 'completed'
});
```

### 4. Exclude Admin Fields
```javascript
// ✅ Exclude admin-only fields from donor responses
.select('-adminNotes -internalFlags -schoolAuthToken')
```

### 5. Error Handling for Donors
```javascript
// ✅ Provide helpful messages
if (!campaign) {
  return res.status(404).json({
    success: false,
    message: 'Kampanye tidak ditemukan'
  });
}
```

---

## 🔄 Future Enhancements

1. **Email Notifications**
   - Send confirmation email when donation is simulated
   - Send campaign updates to committed donors

2. **Donor Dashboard**
   - View history of commitments
   - Track impact of donations
   - Receive reports on fund usage

3. **Advanced Filters**
   - Filter by funding goal
   - Filter by days remaining
   - Filter by location

4. **Photo Gallery**
   - Show campaign progress photos
   - Before/after images
   - Impact photos

5. **Community Features**
   - Donor comments/testimonials
   - Social sharing
   - Campaign updates/news

6. **Real Payment Integration** (Future Phase)
   - Add actual payment gateway
   - Convert from simulation to real donations
   - Payment history

---

## 📞 SUPPORT & TROUBLESHOOTING

### Common Issues

**Q: Why can't donors edit campaigns?**
A: By design, donors are read-only users. Only admins can create/edit campaigns.

**Q: Where are real donations stored?**
A: Currently, this is simulation only. Donations are stored in the `Donation` model with `isSimulation: true`.

**Q: How do I migrate from simulation to real payments?**
A: Add a payment gateway (Stripe, PayPal) and update the donation endpoint to process real transactions.

**Q: Can donors access admin pages?**
A: No. The `/donor` routes are completely separated from `/admin` routes.

---

## 📄 FILES SUMMARY

| File | Purpose | Type |
|------|---------|------|
| `app/donor/page.tsx` | Landing page | Page |
| `app/donor/layout.tsx` | Donor layout wrapper | Layout |
| `app/donor/campaigns/page.tsx` | Campaign list | Page |
| `app/donor/campaigns/[id]/page.tsx` | Campaign detail | Page |
| `components/donor/Header.tsx` | Navigation | Component |
| `components/donor/CampaignCard.tsx` | Campaign card | Component |
| `components/donor/ProgressBar.tsx` | Progress display | Component |
| `components/donor/VerificationBadge.tsx` | Verified badge | Component |
| `components/donor/DonationForm.tsx` | Donation form | Component |
| `components/donor/TimelineComponent.tsx` | Timeline | Component |
| `components/donor/TrustSection.tsx` | Trust section | Component |
| `lib/donor-api.ts` | API utilities | Utility |
| `backend/routes/donor.routes.js` | API routes | Route |
| `backend/controllers/donor.controller.js` | Business logic | Controller |

---

## ✅ COMPLETION STATUS

- ✅ Frontend landing page
- ✅ Campaign list page
- ✅ Campaign detail page
- ✅ Donation simulation form
- ✅ All reusable components
- ✅ API utilities
- ✅ Backend routes
- ✅ Backend controller
- ✅ Tailwind styling
- ✅ Role separation
- ✅ Documentation

**System is ready for integration and testing!**
