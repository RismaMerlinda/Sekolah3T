'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ProgressBar } from '@/components/donor/ProgressBar';
import { VerificationBadge } from '@/components/donor/VerificationBadge';
import { TimelineComponent } from '@/components/donor/TimelineComponent';
import { DonationForm } from '@/components/donor/DonationForm';

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  status: 'completed' | 'ongoing' | 'upcoming';
}

interface FundAllocation {
  name: string;
  percentage: number;
  amount: number;
  description: string;
}

interface Campaign {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
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
  timelineEvents?: TimelineEvent[];
  fundAllocation?: FundAllocation[];
  galleryImages?: string[];
  schoolAddress?: string;
  schoolEmail?: string;
}

const mockCampaignDetails: { [key: string]: Campaign } = {
  '1': {
    id: '1',
    title: 'Bangun Perpustakaan Sekolah Dasar',
    description: 'Membangun perpustakaan modern untuk meningkatkan literasi siswa di daerah terpencil.',
    fullDescription: `SD Negeri Harapan Jaya berlokasi di Kabupaten Gunung Kidul, Yogyakarta, 
    sebuah daerah dengan akses terbatas ke sumber pembelajaran. Saat ini, sekolah ini tidak memiliki 
    perpustakaan yang memadai. Dengan dana yang terkumpul, kami akan:
    
    1. Membangun gedung perpustakaan berstandar internasional
    2. Menyediakan koleksi buku pelajaran dan referensi lengkap (5000+ judul)
    3. Menginstal sistem manajemen perpustakaan digital
    4. Melatih staf dan siswa dalam literasi informasi
    5. Menyediakan area belajar bersama yang nyaman
    
    Target kami adalah menciptakan pusat pembelajaran yang tidak hanya melayani siswa SD Negeri Harapan Jaya, 
    tetapi juga masyarakat sekitar. Perpustakaan akan dibuka untuk umum pada sore hari.`,
    schoolName: 'SD Negeri Harapan Jaya',
    schoolAddress: 'Jl. Pendidikan No. 15, Kabupaten Gunung Kidul, Yogyakarta 55862',
    schoolEmail: 'sdnharapanjaya@example.com',
    location: 'Kabupaten Gunung Kidul, Yogyakarta',
    targetAmount: 100000000,
    collectedAmount: 45000000,
    verified: true,
    verificationDate: '15 Januari 2026',
    donorsCount: 312,
    category: 'infrastruktur',
    status: 'active',
    timelineEvents: [
      {
        id: '1',
        date: 'Januari 2026',
        title: 'Kampanye Dimulai',
        description: 'Peluncuran kampanye pengumpulan dana untuk perpustakaan.',
        status: 'completed',
      },
      {
        id: '2',
        date: 'Februari - Maret 2026',
        title: 'Pembelian Buku & Peralatan',
        description: 'Pengadaan koleksi buku dan peralatan perpustakaan.',
        status: 'ongoing',
      },
      {
        id: '3',
        date: 'April - Mei 2026',
        title: 'Konstruksi Bangunan',
        description: 'Pembangunan gedung perpustakaan.',
        status: 'upcoming',
      },
      {
        id: '4',
        date: 'Juni 2026',
        title: 'Pelatihan Staf',
        description: 'Pelatihan manajemen perpustakaan digital untuk staf dan siswa.',
        status: 'upcoming',
      },
      {
        id: '5',
        date: 'Juli 2026',
        title: 'Peresmian & Pembukaan',
        description: 'Peresmian perpustakaan dan dimulai operasional penuh.',
        status: 'upcoming',
      },
    ],
    fundAllocation: [
      {
        name: 'Konstruksi Bangunan',
        percentage: 40,
        amount: 40000000,
        description: 'Pembangunan gedung perpustakaan 200 m²',
      },
      {
        name: 'Koleksi Buku & Media',
        percentage: 30,
        amount: 30000000,
        description: 'Pembelian 5000+ judul buku dan materi referensi',
      },
      {
        name: 'Peralatan & Furniture',
        percentage: 20,
        amount: 20000000,
        description: 'Rak buku, meja, kursi, dan sistem komputer',
      },
      {
        name: 'Operasional & Pelatihan',
        percentage: 10,
        amount: 10000000,
        description: 'Pelatihan staf dan persiapan operasional',
      },
    ],
  },
  '2': {
    id: '2',
    title: 'Laboratorium Komputer untuk SMK',
    description: 'Menyediakan perangkat komputer modern untuk pembelajaran teknologi informasi.',
    fullDescription: `SMK Negeri 2 Manado membutuhkan laboratorium komputer yang memadai untuk mendukung pembelajaran teknologi informasi. Program ini akan menyediakan 40 unit komputer modern beserta infrastruktur pendukungnya.`,
    schoolName: 'SMK Negeri 2 Manado',
    schoolAddress: 'Jl. Teknologi No. 20, Kota Manado, Sulawesi Utara',
    schoolEmail: 'smkn2manado@example.com',
    location: 'Kota Manado, Sulawesi Utara',
    targetAmount: 250000000,
    collectedAmount: 180000000,
    verified: true,
    verificationDate: '10 Januari 2026',
    donorsCount: 568,
    category: 'teknologi',
    status: 'active',
  },
  '3': {
    id: '3',
    title: 'Beasiswa untuk Siswa Berprestasi',
    description: 'Program beasiswa penuh untuk siswa berprestasi dari keluarga tidak mampu.',
    fullDescription: `Program beasiswa ini akan memberikan bantuan pendidikan penuh untuk 50 siswa berprestasi dari keluarga kurang mampu di SMA Negeri 1 Kupang, mencakup biaya sekolah, seragam, buku, dan kebutuhan belajar lainnya.`,
    schoolName: 'SMA Negeri 1 Kupang',
    schoolAddress: 'Jl. Pendidikan No. 5, Kota Kupang, NTT',
    schoolEmail: 'sman1kupang@example.com',
    location: 'Kota Kupang, Nusa Tenggara Timur',
    targetAmount: 75000000,
    collectedAmount: 32000000,
    verified: true,
    verificationDate: '12 Januari 2026',
    donorsCount: 245,
    category: 'beasiswa',
    status: 'active',
  },
  '4': {
    id: '4',
    title: 'Infrastruktur Air Bersih Sekolah',
    description: 'Membangun sistem air bersih dan sanitasi untuk sekolah di daerah terpencil.',
    fullDescription: `SD Negeri Maju Sejahtera membutuhkan sistem air bersih dan sanitasi yang layak. Program ini akan membangun sumur bor, tangki air, dan fasilitas sanitasi modern untuk 300 siswa.`,
    schoolName: 'SD Negeri Maju Sejahtera',
    schoolAddress: 'Jl. Harapan No. 8, Kabupaten Sintang, Kalimantan Barat',
    schoolEmail: 'sdnmajusejahtera@example.com',
    location: 'Kabupaten Sintang, Kalimantan Barat',
    targetAmount: 85000000,
    collectedAmount: 58000000,
    verified: true,
    verificationDate: '8 Januari 2026',
    donorsCount: 189,
    category: 'infrastruktur',
    status: 'active',
  },
  '5': {
    id: '5',
    title: 'Seragam dan Buku Pelajaran Gratis',
    description: 'Menyediakan seragam dan buku pelajaran untuk 500 siswa baru SD.',
    fullDescription: `Program bantuan seragam dan buku pelajaran untuk 500 siswa baru di SD Negeri Cahaya Terang, Papua. Setiap siswa akan mendapatkan 3 stel seragam lengkap dan paket buku pelajaran untuk satu tahun ajaran.`,
    schoolName: 'SD Negeri Cahaya Terang',
    schoolAddress: 'Jl. Pendidikan No. 12, Kab. Kepulauan Yapen, Papua',
    schoolEmail: 'sdncahayaterang@example.com',
    location: 'Kabupaten Kepulauan Yapen, Papua',
    targetAmount: 50000000,
    collectedAmount: 28500000,
    verified: true,
    verificationDate: '14 Januari 2026',
    donorsCount: 156,
    category: 'beasiswa',
    status: 'active',
  },
  '6': {
    id: '6',
    title: 'Fasilitas Kesehatan Sekolah',
    description: 'Membangun klinik kesehatan dan program pemeriksaan kesehatan berkala untuk siswa.',
    fullDescription: `SMP Negeri 1 Sorong akan memiliki klinik kesehatan sekolah yang lengkap dengan tenaga medis profesional. Program ini juga mencakup pemeriksaan kesehatan rutin untuk semua siswa.`,
    schoolName: 'SMP Negeri 1 Sorong',
    schoolAddress: 'Jl. Kesehatan No. 3, Kota Sorong, Papua Barat',
    schoolEmail: 'smpn1sorong@example.com',
    location: 'Kota Sorong, Papua Barat',
    targetAmount: 120000000,
    collectedAmount: 95000000,
    verified: true,
    verificationDate: '9 Januari 2026',
    donorsCount: 410,
    category: 'kesehatan',
    status: 'active',
  },
  '7': {
    id: '7',
    title: 'Ruang Kelas dan Lab IPA Baru',
    description: 'Membangun tiga ruang kelas dan satu laboratorium IPA modern untuk sekolah yang overcrowded.',
    fullDescription: `SMA Negeri 2 Timika mengalami kekurangan ruang kelas. Program ini akan membangun 3 ruang kelas baru dan 1 laboratorium IPA lengkap untuk menampung 120 siswa tambahan.`,
    schoolName: 'SMA Negeri 2 Timika',
    schoolAddress: 'Jl. Pendidikan No. 25, Kota Timika, Papua',
    schoolEmail: 'sman2timika@example.com',
    location: 'Kota Timika, Papua',
    targetAmount: 300000000,
    collectedAmount: 210000000,
    verified: true,
    verificationDate: '7 Januari 2026',
    donorsCount: 780,
    category: 'infrastruktur',
    status: 'active',
  },
  '8': {
    id: '8',
    title: 'Internet dan Teknologi Pendidikan',
    description: 'Membangun koneksi internet berkecepatan tinggi dan platform e-learning untuk pembelajaran jarak jauh.',
    fullDescription: `SMK Negeri 3 Jayapura akan mendapatkan koneksi internet fiber optik dan platform e-learning modern. Program ini juga mencakup pelatihan guru dalam penggunaan teknologi pendidikan.`,
    schoolName: 'SMK Negeri 3 Jayapura',
    schoolAddress: 'Jl. Teknologi No. 18, Kota Jayapura, Papua',
    schoolEmail: 'smkn3jayapura@example.com',
    location: 'Kota Jayapura, Papua',
    targetAmount: 180000000,
    collectedAmount: 142000000,
    verified: true,
    verificationDate: '11 Januari 2026',
    donorsCount: 520,
    category: 'teknologi',
    status: 'active',
  },
};

export default function CampaignDetailPage() {
  const params = useParams();
  const campaignId = params?.id as string;
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [donationSubmitted, setDonationSubmitted] = useState(false);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockCampaign = mockCampaignDetails[campaignId] || mockCampaignDetails['1'];
      setCampaign(mockCampaign);
      setIsLoading(false);
    }, 500);
  }, [campaignId]);

  const handleDonationSubmit = (amount: number) => {
    console.log(`Donation submitted: ${amount}`);
    setDonationSubmitted(true);
    // Here you would call the API to save the donation
    setTimeout(() => setDonationSubmitted(false), 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-[#E6FFFA]">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-[#B2F5EA] border-t-[#40E0D0] rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-[#4A6F6C] font-semibold">Memuat detail kampanye...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-[#E6FFFA]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#0F2F2E] mb-4">Kampanye Tidak Ditemukan</h1>
          <Link href="/donor/campaigns" className="text-[#40E0D0] font-semibold hover:text-[#2CB1A6]">
            Kembali ke Daftar Kampanye
          </Link>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const progressPercentage = (campaign.collectedAmount / campaign.targetAmount) * 100;
  const daysLeft = Math.ceil(Math.random() * 45) + 5; // Random days left for demo

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#E6FFFA]">
      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <Link
          href="/donor/campaigns"
          className="inline-flex items-center gap-2 text-[#40E0D0] hover:text-[#2CB1A6] font-semibold transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl lg:text-4xl font-bold text-[#0F2F2E]">
                  {campaign.title}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <VerificationBadge verified={campaign.verified} />
                {campaign.category && (
                  <span className="text-sm font-semibold px-3 py-1 bg-[#40E0D0] text-white rounded-full">
                    {campaign.category === 'infrastruktur' && 'Infrastruktur'}
                    {campaign.category === 'beasiswa' && 'Beasiswa'}
                    {campaign.category === 'teknologi' && 'Teknologi'}
                    {campaign.category === 'kesehatan' && 'Kesehatan'}
                  </span>
                )}
                <span className="text-sm font-semibold px-3 py-1 bg-green-500 text-white rounded-full">
                  {campaign.status === 'active' && 'Aktif'}
                  {campaign.status === 'completed' && 'Selesai'}
                  {campaign.status === 'closed' && 'Ditutup'}
                  {!campaign.status && 'Aktif'}
                </span>
              </div>

              <p className="text-lg text-[#4A6F6C] mb-4">{campaign.description}</p>

              <div className="flex flex-wrap gap-6 text-sm">
                <div>
                  <p className="text-[#6B8E8B] text-xs uppercase font-semibold">Sekolah</p>
                  <p className="text-[#0F2F2E] font-semibold">{campaign.schoolName}</p>
                </div>
                <div>
                  <p className="text-[#6B8E8B] text-xs uppercase font-semibold">Lokasi</p>
                  <p className="text-[#0F2F2E] font-semibold">{campaign.location}</p>
                </div>
                <div>
                  <p className="text-[#6B8E8B] text-xs uppercase font-semibold">Pendonar</p>
                  <p className="text-[#0F2F2E] font-semibold">{campaign.donorsCount || 0}</p>
                </div>
              </div>
            </div>

            {/* Image Placeholder */}
            <div className="w-full h-96 bg-gradient-to-br from-[#E6FFFA] to-[#CCFBF1] rounded-lg border-2 border-[#B2F5EA] flex items-center justify-center mb-8">
              <svg
                className="w-24 h-24 text-[#2CB1A6] opacity-40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>

            {/* Progress & Stats */}
            <div className="bg-white rounded-lg border-2 border-[#B2F5EA] p-6 mb-8">
              <ProgressBar
                current={campaign.collectedAmount}
                target={campaign.targetAmount}
                showLabel={true}
              />

              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#40E0D0]">
                    {Math.round(progressPercentage)}%
                  </p>
                  <p className="text-xs text-[#6B8E8B] uppercase font-semibold">Terkumpul</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#0F2F2E]">{daysLeft}</p>
                  <p className="text-xs text-[#6B8E8B] uppercase font-semibold">Hari Tersisa</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#0F2F2E]">
                    {campaign.donorsCount || 0}
                  </p>
                  <p className="text-xs text-[#6B8E8B] uppercase font-semibold">Pendonar</p>
                </div>
              </div>
            </div>

            {/* Full Description */}
            <div className="bg-white rounded-lg border-2 border-[#B2F5EA] p-6 mb-8">
              <h2 className="text-2xl font-bold text-[#0F2F2E] mb-4">Tentang Kampanye Ini</h2>
              <div className="space-y-4 text-[#4A6F6C] leading-relaxed whitespace-pre-line">
                {campaign.fullDescription}
              </div>
            </div>

            {/* Fund Allocation */}
            {campaign.fundAllocation && campaign.fundAllocation.length > 0 && (
              <div className="bg-white rounded-lg border-2 border-[#B2F5EA] p-6 mb-8">
                <h2 className="text-2xl font-bold text-[#0F2F2E] mb-6">
                  Alokasi Dana (Target: {formatCurrency(campaign.targetAmount)})
                </h2>
                <div className="space-y-6">
                  {campaign.fundAllocation.map((allocation, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-[#0F2F2E]">{allocation.name}</h3>
                          <p className="text-sm text-[#4A6F6C]">{allocation.description}</p>
                        </div>
                        <span className="text-lg font-bold text-[#40E0D0]">{allocation.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-[#40E0D0] to-[#2CB1A6] h-3 rounded-full"
                          style={{ width: `${allocation.percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-[#6B8E8B] mt-1">
                        {formatCurrency(allocation.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            {campaign.timelineEvents && campaign.timelineEvents.length > 0 && (
              <div className="bg-white rounded-lg border-2 border-[#B2F5EA] p-6 mb-8">
                <h2 className="text-2xl font-bold text-[#0F2F2E] mb-6">Timeline Kegiatan</h2>
                <TimelineComponent events={campaign.timelineEvents} />
              </div>
            )}

            {/* School Info */}
            <div className="bg-gradient-to-br from-[#E6FFFA] to-[#CCFBF1] rounded-lg border-2 border-[#B2F5EA] p-6">
              <h2 className="text-2xl font-bold text-[#0F2F2E] mb-4">Informasi Sekolah</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-[#6B8E8B] uppercase font-semibold">Nama Sekolah</p>
                  <p className="text-[#0F2F2E] font-semibold">{campaign.schoolName}</p>
                </div>
                {campaign.schoolAddress && (
                  <div>
                    <p className="text-xs text-[#6B8E8B] uppercase font-semibold">Alamat</p>
                    <p className="text-[#0F2F2E]">{campaign.schoolAddress}</p>
                  </div>
                )}
                {campaign.schoolEmail && (
                  <div>
                    <p className="text-xs text-[#6B8E8B] uppercase font-semibold">Email</p>
                    <p className="text-[#0F2F2E] break-all">{campaign.schoolEmail}</p>
                  </div>
                )}
                {campaign.verificationDate && (
                  <div>
                    <p className="text-xs text-[#6B8E8B] uppercase font-semibold">
                      Tanggal Verifikasi
                    </p>
                    <p className="text-[#0F2F2E]">{campaign.verificationDate}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Donation Form */}
          <div className="lg:col-span-1">
            <div>
              <DonationForm
                campaignId={campaign.id}
                campaignTitle={campaign.title}
                onSubmit={handleDonationSubmit}
              />

              {/* Additional Info */}
              <div className="mt-6 bg-white rounded-lg border-2 border-[#B2F5EA] p-4 text-sm text-[#4A6F6C]">
                <div className="flex items-start gap-3 mb-4">
                  <svg className="w-5 h-5 text-[#40E0D0] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold text-[#0F2F2E]">Sekolah Terverifikasi</p>
                    <p>Telah melalui verifikasi admin SAHABAT3T</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 mb-4">
                  <svg className="w-5 h-5 text-[#40E0D0] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6V4a1 1 0 10-2 0v1H4a1 1 0 000 2h1v1H4a1 1 0 100 2h1v1H4a1 1 0 000 2h2v1H6a1 1 0 100 2H4a2 2 0 01-2-2v-1H2a1 1 0 100-2h2v-1H2a1 1 0 110-2h2V5a1 1 0 000-2H2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2h-1a1 1 0 100 2h1v1h-1a1 1 0 110-2h1V4h-1a1 1 0 100-2h1a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold text-[#0F2F2E]">Transparansi 100%</p>
                    <p>Semua dana dilacak dan dilaporkan</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#40E0D0] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0015.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-[#0F2F2E]">Tanpa Biaya</p>
                    <p>Semua dana masuk untuk program</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
