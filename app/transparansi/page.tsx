"use client";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DollarSign, ShieldCheck, Download, ExternalLink, School, BookOpen, Search } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { DonorFooter } from "@/components/donor/Header";

// Helper for formatting IDR
const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num || 0);
};

export default function TransparansiPage() {
    const [stats, setStats] = useState<any>(null);
    const [schools, setSchools] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch platform stats
                const statsRes = await api.get('/api/donor/stats');
                setStats(statsRes.data.data);

                // Fetch schools list
                const schoolsRes = await api.get('/api/donor/schools');
                setSchools(schoolsRes.data.data);
            } catch (error) {
                console.error("Failed to fetch transparency data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-24 pb-32 bg-[#0F2F2E] text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="inline-block p-2 bg-white/10 rounded-full mb-4 px-6 border border-white/20 backdrop-blur-md">
                        <span className="flex items-center gap-2 text-sm font-semibold tracking-wider uppercase text-[#40E0D0]">
                            <ShieldCheck className="w-4 h-4" /> Laporan Terbuka
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Transparansi <span className="text-[#40E0D0]">Tanpa Batas</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
                        Setiap rupiah yang Anda donasikan tercatat, dapat dilacak, dan dipertanggungjawabkan. Kami percaya kepercayaan adalah mata uang termahal.
                    </p>
                </div>
            </section>

            {/* Key Stats Cards */}
            <section className="-mt-16 pb-20 relative z-20">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center text-center group hover:-translate-y-1 transition-transform">
                            <div className="w-16 h-16 bg-[#E6FFFA] rounded-full flex items-center justify-center text-[#40E0D0] mb-4 group-hover:scale-110 transition-transform">
                                <DollarSign className="w-8 h-8" />
                            </div>
                            <p className="text-gray-500 font-medium uppercase tracking-wide text-xs mb-1">Total Donasi Tersalurkan</p>
                            <h3 className="text-3xl font-bold text-[#0F2F2E]">
                                {loading ? "..." : formatIDR(stats?.totalDonationAmount || 0)}
                            </h3>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center text-center group hover:-translate-y-1 transition-transform">
                            <div className="w-16 h-16 bg-[#E6FFFA] rounded-full flex items-center justify-center text-[#40E0D0] mb-4 group-hover:scale-110 transition-transform">
                                <School className="w-8 h-8" />
                            </div>
                            <p className="text-gray-500 font-medium uppercase tracking-wide text-xs mb-1">Sekolah Terverifikasi</p>
                            <h3 className="text-3xl font-bold text-[#0F2F2E]">
                                {loading ? "..." : (stats?.verifiedSchools || 0)}
                            </h3>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center text-center group hover:-translate-y-1 transition-transform">
                            <div className="w-16 h-16 bg-[#E6FFFA] rounded-full flex items-center justify-center text-[#40E0D0] mb-4 group-hover:scale-110 transition-transform">
                                <BookOpen className="w-8 h-8" />
                            </div>
                            <p className="text-gray-500 font-medium uppercase tracking-wide text-xs mb-1">Kampanye Aktif</p>
                            <h3 className="text-3xl font-bold text-[#0F2F2E]">
                                {loading ? "..." : (stats?.activeCampaigns || 0)}
                            </h3>
                        </div>
                    </div>
                </div>
            </section>

            {/* Flow of Funds */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-neutral-heading mb-4">Kemana Uang Anda Pergi?</h2>
                        <p className="text-neutral-body max-w-2xl mx-auto">Kami menerapkan kebijakan 100% Penyaluran untuk donasi program sekolah (biaya operasional platform ditanggung oleh mitra korporat dan donasi sukarela "tips" terpisah).</p>
                    </div>

                    <div className="flex justify-center max-w-3xl mx-auto">
                        <Card className="w-full border-2 border-green-100 bg-green-50/50 p-8 text-center">
                            <div className="text-2xl font-bold text-green-700 mb-2">100% Program</div>
                            <p className="text-sm text-gray-600">Seluruh dana donasi digunakan sepenuhnya untuk pembelian barang, renovasi, dan kebutuhan siswa sesuai RAB yang diajukan sekolah.</p>
                            <div className="w-full bg-gray-200 h-4 rounded-full mt-4 overflow-hidden">
                                <div className="bg-green-500 h-full w-full"></div>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>



            {/* Footer */}
            <DonorFooter />
        </div>
    );
}
