'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { CampaignCard } from '@/components/donor/CampaignCard';
import { getDonorCampaigns } from '@/lib/donor-api';

interface Campaign {
  id: string;
  _id?: string;
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

type SortBy = 'newest' | 'highest-funded' | 'most-donors' | 'ending-soon';
type FilterCategory = 'all' | 'infrastruktur' | 'beasiswa' | 'teknologi' | 'kesehatan';

export default function CampaignsListPage() {
  const [sortBy, setSortBy] = useState<SortBy>('newest');
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [allCampaigns, setAllCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await getDonorCampaigns();
        const mapped = data.map((c: any) => ({
          ...c,
          id: c._id || c.id
        }));
        setAllCampaigns(mapped);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  // Filter and sort campaigns
  const filteredAndSortedCampaigns = useMemo(() => {
    let filtered = allCampaigns;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          c.schoolName.toLowerCase().includes(query) ||
          c.location.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter((c) => c.category === filterCategory);
    }

    // Sort
    const sorted = [...filtered];
    switch (sortBy) {
      case 'highest-funded':
        sorted.sort((a, b) => b.collectedAmount - a.collectedAmount);
        break;
      case 'most-donors':
        sorted.sort((a, b) => (b.donorsCount || 0) - (a.donorsCount || 0));
        break;
      case 'ending-soon':
        sorted.reverse();
        break;
      case 'newest':
      default:
        break;
    }

    return sorted;
  }, [searchQuery, filterCategory, sortBy]);

  const categories: { value: FilterCategory; label: string }[] = [
    { value: 'all', label: 'Semua Kategori' },
    { value: 'infrastruktur', label: 'Infrastruktur' },
    { value: 'beasiswa', label: 'Beasiswa' },
    { value: 'teknologi', label: 'Teknologi' },
    { value: 'kesehatan', label: 'Kesehatan' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#E6FFFA]">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-[#40E0D0] to-[#2CB1A6] text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Semua Kampanye</h1>
          <p className="text-lg opacity-90">
            Temukan kampanye yang ingin Anda dukung dan buat perbedaan nyata.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border-2 border-[#B2F5EA] p-6 sticky top-24">
              <h3 className="text-lg font-bold text-[#0F2F2E] mb-4">Filter</h3>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#0F2F2E] mb-2">
                  Cari Kampanye
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nama, sekolah, lokasi..."
                  className="w-full px-3 py-2 border border-[#B2F5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40E0D0] text-sm"
                />
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#0F2F2E] mb-2">
                  Kategori
                </label>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setFilterCategory(cat.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${filterCategory === cat.value
                        ? 'bg-[#40E0D0] text-white'
                        : 'bg-[#E6FFFA] text-[#0F2F2E] hover:bg-[#CCFBF1]'
                        }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-semibold text-[#0F2F2E] mb-2">
                  Urutkan
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortBy)}
                  className="w-full px-3 py-2 border border-[#B2F5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40E0D0] text-sm bg-white"
                >
                  <option value="newest">Terbaru</option>
                  <option value="highest-funded">Dana Terbanyak</option>
                  <option value="most-donors">Pendonor Terbanyak</option>
                  <option value="ending-soon">Berakhir Segera</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Category Info Banner */}
            {filterCategory !== 'all' && (
              <div className="bg-white rounded-lg border-2 border-[#B2F5EA] p-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#40E0D0] to-[#2CB1A6] rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-2xl font-bold">
                      {filterCategory === 'infrastruktur' && '🏗️'}
                      {filterCategory === 'beasiswa' && '🎓'}
                      {filterCategory === 'teknologi' && '💻'}
                      {filterCategory === 'kesehatan' && '🏥'}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#0F2F2E] mb-2">
                      {filterCategory === 'infrastruktur' && 'Infrastruktur Pendidikan'}
                      {filterCategory === 'beasiswa' && 'Program Beasiswa'}
                      {filterCategory === 'teknologi' && 'Teknologi Pendidikan'}
                      {filterCategory === 'kesehatan' && 'Kesehatan Sekolah'}
                    </h2>
                    <p className="text-[#4A6F6C] leading-relaxed">
                      {filterCategory === 'infrastruktur' &&
                        'Kampanye untuk membangun dan memperbaiki fasilitas fisik sekolah seperti ruang kelas, perpustakaan, laboratorium, dan infrastruktur pendukung lainnya di daerah 3T.'}
                      {filterCategory === 'beasiswa' &&
                        'Program bantuan pendidikan untuk siswa berprestasi dari keluarga kurang mampu, termasuk beasiswa penuh, bantuan seragam, buku pelajaran, dan kebutuhan sekolah lainnya.'}
                      {filterCategory === 'teknologi' &&
                        'Kampanye untuk menyediakan perangkat teknologi modern seperti komputer, internet, platform e-learning, dan pelatihan digital untuk meningkatkan kualitas pembelajaran.'}
                      {filterCategory === 'kesehatan' &&
                        'Program kesehatan sekolah termasuk pembangunan klinik, pemeriksaan kesehatan berkala, penyediaan obat-obatan, dan edukasi kesehatan untuk siswa di daerah terpencil.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Results Summary */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-[#4A6F6C]">
                Menampilkan <span className="font-bold text-[#0F2F2E]">{filteredAndSortedCampaigns.length}</span> kampanye
                {filterCategory !== 'all' && (
                  <span className="ml-1">
                    untuk kategori <span className="font-bold text-[#40E0D0]">
                      {categories.find(c => c.value === filterCategory)?.label}
                    </span>
                  </span>
                )}
              </p>
            </div>

            {/* Campaigns Grid */}
            {filteredAndSortedCampaigns.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredAndSortedCampaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border-2 border-[#B2F5EA] p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-[#0F2F2E] mb-2">Tidak Ada Kampanye</h3>
                <p className="text-[#4A6F6C]">
                  Tidak ditemukan kampanye yang sesuai dengan filter Anda.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
