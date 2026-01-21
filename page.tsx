'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CampaignCard } from '@/components/donor/CampaignCard';
import { TrustSection } from '@/components/donor/TrustSection';

import { getDonorCampaigns, getPlatformTransparencyStats } from '@/lib/donor-api';

interface Campaign {
  id: string;
  _id?: string; // MongoDB ID
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
}

export default function DonorHomePage() {
  const [featuredCampaigns, setFeaturedCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState({
    totalFundsRaised: 0,
    totalDonors: 0,
    activeCampaigns: 0,
    supportedSchools: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [campaignsData, statsData] = await Promise.all([
          getDonorCampaigns(),
          getPlatformTransparencyStats()
        ]);

        // Fix ID mapping for MongoDB
        const mappedCampaigns = campaignsData.map((c: any) => ({
          ...c,
          id: c._id || c.id
        }));

        setFeaturedCampaigns(mappedCampaigns.slice(0, 4));

        if (statsData) {
          setStats({
            totalFundsRaised: statsData.totalDonationAmount || 0,
            totalDonors: statsData.totalDonors || 0,
            activeCampaigns: statsData.activeCampaigns || 0,
            supportedSchools: statsData.verifiedSchools || 0,
          });
        }
      } catch (error) {
        console.error('Error fetching data from backend:', error);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return (value / 1000000000).toFixed(1) + 'M';
    } else if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'Jt';
    }
    return value.toString();
  };

  return (
    <div className="bg-white">
      {/* HERO SECTION */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E6FFFA] via-white to-[#CCFBF1]"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#40E0D0] opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2CB1A6] opacity-10 rounded-full blur-3xl"></div>

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-block mb-4 px-4 py-2 bg-[#E6FFFA] border border-[#40E0D0] rounded-full">
                <span className="text-sm font-semibold text-[#2CB1A6]">
                  🌟 Mengubah Pendidikan di Daerah 3T
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-[#0F2F2E] mb-6 leading-tight">
                Setiap Donasi Adalah Investasi untuk{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#40E0D0] to-[#2CB1A6]">
                  Masa Depan Cerah
                </span>
              </h1>

              <p className="text-lg text-[#4A6F6C] mb-8 leading-relaxed">
                Bergabunglah dengan ribuan pendonor yang telah mengubah kehidupan ribuan
                siswa di daerah terpencil, tertinggal, dan terdepan. Bersama kita wujudkan
                pendidikan berkualitas untuk semua.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/donor/campaigns"
                  className="px-8 py-3 bg-gradient-to-r from-[#40E0D0] to-[#2CB1A6] text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300 text-center"
                >
                  Jelajahi Kampanye
                </Link>
                <Link
                  href="/tentang-kami"
                  className="px-8 py-3 border-2 border-[#40E0D0] text-[#40E0D0] font-bold rounded-lg hover:bg-[#E6FFFA] transition-all duration-300 text-center"
                >
                  Tentang Kami
                </Link>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative h-80 lg:h-96">
              <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/donor_hero_education_1768991479531.png"
                  alt="Siswa di daerah 3T belajar dengan semangat"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="bg-[#0F2F2E] text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-[#40E0D0] mb-2">
                {formatCurrency(stats.totalFundsRaised)}
              </div>
              <p className="text-gray-400">Dana Terkumpul</p>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-[#40E0D0] mb-2">
                {stats.totalDonors.toLocaleString('id-ID')}
              </div>
              <p className="text-gray-400">Pendonor Aktif</p>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-[#40E0D0] mb-2">
                {stats.activeCampaigns}
              </div>
              <p className="text-gray-400">Kampanye Aktif</p>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-[#40E0D0] mb-2">
                {stats.supportedSchools}
              </div>
              <p className="text-gray-400">Sekolah Terbantu</p>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <TrustSection />

      {/* FEATURED CAMPAIGNS */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-[#0F2F2E] mb-2">Kampanye Unggulan</h2>
              <p className="text-[#4A6F6C]">Kampanye terpopuler yang membutuhkan dukungan Anda</p>
            </div>
            <Link
              href="/donor/campaigns"
              className="mt-4 sm:mt-0 px-6 py-2 text-[#40E0D0] font-semibold hover:text-[#2CB1A6] transition-colors"
            >
              Lihat Semua →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 bg-gradient-to-r from-[#40E0D0] to-[#2CB1A6]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Siap Membuat Perbedaan?
          </h2>
          <p className="text-lg text-white opacity-90 mb-8">
            Bergabunglah dengan gerakan perubahan pendidikan di Indonesia. Setiap donasi,
            sekecil apapun, membuat dampak besar bagi siswa di daerah 3T.
          </p>
          <Link
            href="/donor/campaigns"
            className="inline-block px-8 py-4 bg-white text-[#2CB1A6] font-bold rounded-lg hover:shadow-lg transition-all duration-300"
          >
            Mulai Berdonasi Sekarang
          </Link>
        </div>
      </section>
    </div>
  );
}
