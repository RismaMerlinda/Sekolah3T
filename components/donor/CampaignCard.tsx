'use client';

import React from 'react';
import Link from 'next/link';
import { VerificationBadge } from './VerificationBadge';
import { ProgressBar } from './ProgressBar';

interface Campaign {
  id: string;
  title: string;
  description: string;
  schoolName: string;
  location: string;
  targetAmount: number;
  collectedAmount: number;
  imageUrl?: string;
  verified: boolean;
  verificationDate?: string;
  donorsCount?: number;
  category?: string;
  status?: 'active' | 'completed' | 'closed';
}

interface CampaignCardProps {
  campaign: Campaign;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getCategoryLabel = (category?: string) => {
    const labels: Record<string, string> = {
      infrastruktur: 'Infrastruktur',
      beasiswa: 'Beasiswa',
      teknologi: 'Teknologi',
      kesehatan: 'Kesehatan',
    };
    return category ? labels[category] || category : '';
  };

  const getStatusLabel = (status?: string) => {
    const labels: Record<string, string> = {
      active: 'Aktif',
      completed: 'Selesai',
      closed: 'Ditutup',
    };
    return status ? labels[status] || status : 'Aktif';
  };

  return (
    <Link href={`/donor/campaigns/${campaign.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden hover:scale-105 cursor-pointer">
        {/* Image Section */}
        <div className="relative h-48 bg-gradient-to-br from-[#E6FFFA] to-[#CCFBF1] overflow-hidden">
          {campaign.imageUrl ? (
            <img
              src={campaign.imageUrl}
              alt={campaign.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#2CB1A6]">
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start gap-2">
            <div className="flex flex-wrap gap-2">
              <VerificationBadge verified={campaign.verified} size="sm" />
              {campaign.category && (
                <span className="px-2 py-1 bg-[#40E0D0] text-white text-xs font-semibold rounded-full">
                  {getCategoryLabel(campaign.category)}
                </span>
              )}
              <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                {getStatusLabel(campaign.status)}
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* School Info */}
          <div className="mb-2">
            <p className="text-xs text-[#6B8E8B] font-medium uppercase tracking-wide">
              {campaign.location}
            </p>
            <h3 className="font-bold text-[#0F2F2E] text-lg line-clamp-2">
              {campaign.title}
            </h3>
            <p className="text-sm text-[#4A6F6C] font-semibold">
              {campaign.schoolName}
            </p>
          </div>

          {/* Description */}
          <p className="text-sm text-[#4A6F6C] mb-4 line-clamp-2">
            {campaign.description}
          </p>

          {/* Progress */}
          <ProgressBar
            current={campaign.collectedAmount}
            target={campaign.targetAmount}
            showLabel={false}
            size="sm"
          />

          {/* Amount Info */}
          <div className="mt-3 flex justify-between items-center">
            <span className="text-sm font-bold text-[#0F2F2E]">
              {formatCurrency(campaign.collectedAmount)} / {formatCurrency(campaign.targetAmount)}
            </span>
            {campaign.donorsCount !== undefined && (
              <span className="text-xs text-[#6B8E8B]">
                {campaign.donorsCount} pendonor
              </span>
            )}
          </div>

          {/* CTA Button */}
          <button className="w-full mt-4 py-2 bg-gradient-to-r from-[#40E0D0] to-[#2CB1A6] text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300">
            Lihat Detail
          </button>
        </div>
      </div>
    </Link>
  );
};
