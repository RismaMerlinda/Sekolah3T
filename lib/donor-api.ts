/**
 * DONOR API UTILITIES
 * 
 * This module contains ALL API calls for the donor (public) side.
 * - Read-only operations for viewing campaigns
 * - Donation simulation (no actual payment processing)
 * 
 * ⚠️ IMPORTANT: This is CONSUMER-ONLY, NOT admin or school logic
 * ✅ Can use: GET (campaigns, details, reports)
 * ❌ Cannot use: Admin/School authentication, campaign management, verification
 */

import axios from '@/lib/axios';

// ============================================
// CAMPAIGN ENDPOINTS
// ============================================

/**
 * Fetch all campaigns (public READ-ONLY)
 * @returns List of all active campaigns
 */
export const getDonorCampaigns = async () => {
  try {
    const response = await axios.get('/api/donor/campaigns');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    throw error;
  }
};

/**
 * Fetch single campaign details (public READ-ONLY)
 * @param campaignId - The campaign ID
 * @returns Campaign details with full description, timeline, fund allocation
 */
export const getDonorCampaignDetail = async (campaignId: string) => {
  try {
    const response = await axios.get(`/api/donor/campaigns/${campaignId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching campaign ${campaignId}:`, error);
    throw error;
  }
};

/**
 * Search campaigns by keywords (public READ-ONLY)
 * @param query - Search query (school name, location, title)
 * @param filters - Optional filters (category, status)
 * @returns Filtered campaigns
 */
export const searchDonorCampaigns = async (
  query: string,
  filters?: {
    category?: string;
    status?: 'active' | 'completed' | 'closed';
  }
) => {
  try {
    const response = await axios.get('/api/donor/campaigns/search', {
      params: {
        q: query,
        ...filters,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching campaigns:', error);
    throw error;
  }
};

// ============================================
// TRANSPARENCY & REPORTS ENDPOINTS
// ============================================

/**
 * Get transparency report for a campaign (public READ-ONLY)
 * Shows fund usage breakdown and progress
 * @param campaignId - Campaign ID
 * @returns Transparency report data
 */
export const getCampaignTransparencyReport = async (campaignId: string) => {
  try {
    const response = await axios.get(`/api/donor/campaigns/${campaignId}/reports`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transparency report:', error);
    throw error;
  }
};

/**
 * Get platform-wide transparency stats (public READ-ONLY)
 * Shows total funds, number of donors, supported schools, etc.
 * @returns Platform statistics
 */
export const getPlatformTransparencyStats = async () => {
  try {
    const response = await axios.get('/api/donor/stats');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching transparency stats:', error);
    throw error;
  }
};

/**
 * Get all verified schools (public READ-ONLY)
 * Shows list of verified schools and their verification status
 * @returns List of verified schools
 */
export const getVerifiedSchools = async () => {
  try {
    const response = await axios.get('/api/donor/schools');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching verified schools:', error);
    throw error;
  }
};

// ============================================
// DONATION SIMULATION ENDPOINTS
// ============================================

/**
 * Submit donation simulation (WRITE - for donors only)
 * 
 * ⚠️ IMPORTANT: This is a SIMULATION ONLY
 * - No actual payment processing
 * - Saves as commitment/pledge
 * - Data stored in temporary or commitment collection
 * 
 * @param campaignId - Campaign ID
 * @param donorName - Name of donor
 * @param amount - Donation amount in IDR
 * @param email - Optional donor email for updates
 * @returns Donation confirmation
 */
export const submitDonationSimulation = async (
  campaignId: string,
  donorName: string,
  amount: number,
  email?: string
) => {
  try {
    const response = await axios.post('/api/donor/donations/simulate', {
      campaignId,
      donorName,
      amount,
      email,
      timestamp: new Date().toISOString(),
      // Add no real payment data - this is simulation only
      isSimulation: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting donation simulation:', error);
    throw error;
  }
};

/**
 * Get donation history/list for a campaign (public READ-ONLY)
 * Shows list of donations/commitments (anonymized or with permission)
 * @param campaignId - Campaign ID
 * @returns List of recent donations
 */
export const getCampaignDonations = async (campaignId: string) => {
  try {
    const response = await axios.get(`/api/donor/campaigns/${campaignId}/donations`);
    return response.data;
  } catch (error) {
    console.error('Error fetching campaign donations:', error);
    throw error;
  }
};

/**
 * Get top donors/commitments for a campaign (public READ-ONLY)
 * Shows top donors (anonymized - first name + initial only)
 * @param campaignId - Campaign ID
 * @param limit - Number of top donors to return
 * @returns Top donors list
 */
export const getTopDonors = async (campaignId: string, limit: number = 10) => {
  try {
    const response = await axios.get(`/api/donor/campaigns/${campaignId}/top-donors`, {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching top donors:', error);
    throw error;
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Format currency for display
 * @param value - Amount in IDR
 * @returns Formatted string
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};

/**
 * Calculate funding percentage
 * @param collected - Collected amount
 * @param target - Target amount
 * @returns Percentage as number
 */
export const calculateFundingPercentage = (collected: number, target: number): number => {
  return Math.min((collected / target) * 100, 100);
};

/**
 * Check if campaign is still active
 * @param campaign - Campaign object with status
 * @returns Boolean
 */
export const isCampaignActive = (campaign: any): boolean => {
  return campaign.status === 'active' && campaign.targetAmount > campaign.collectedAmount;
};

// ============================================
// ERROR HANDLING
// ============================================

/**
 * Donor API error handler
 * Provides user-friendly error messages
 */
export const handleDonorAPIError = (error: any): string => {
  if (error.response?.status === 404) {
    return 'Kampanye tidak ditemukan';
  }
  if (error.response?.status === 400) {
    return 'Data tidak valid. Silakan coba lagi.';
  }
  if (error.response?.status === 500) {
    return 'Terjadi kesalahan server. Silakan coba lagi nanti.';
  }
  return 'Terjadi kesalahan. Silakan coba lagi.';
};
