'use client';

import React from 'react';
import Link from 'next/link';
import { School, Heart, ArrowRight, ShieldCheck, Globe, Users } from 'lucide-react';

export default function RootLandingPage() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-[#40E0D0] selection:text-white">
            {/* Navigation / Logo Area */}
            <nav className="absolute top-0 left-0 right-0 p-8 z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#0F2F2E] to-[#2CB1A6] rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500">
                            <span className="text-white font-black text-xl">S3T</span>
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-[#0F2F2E]">
                            SAHABAT<span className="text-[#40E0D0]">3T</span>
                        </span>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
                {/* Abstract Background Elements */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#40E0D0] opacity-10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#0F2F2E] opacity-10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

                <div className="max-w-5xl w-full text-center mb-16 relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md border border-gray-200 rounded-full mb-8 shadow-sm animate-fade-in">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#40E0D0] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#40E0D0]"></span>
                        </span>
                        <span className="text-sm font-bold text-[#0F2F2E] uppercase tracking-wider">Membangun Masa Depan Pendidikan Indonesia</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-[#0F2F2E] mb-8 leading-[1.1] tracking-tight">
                        Satu Platform, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#40E0D0] via-[#2CB1A6] to-[#0F2F2E]">
                            Berjuta Harapan Anak Negeri.
                        </span>
                    </h1>

                    <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        Menghubungkan sekolah di daerah Terluar, Terpencil, dan Tertinggal dengan kepedulian Anda. Pilih peran Anda untuk perubahan nyata hari ini.
                    </p>
                </div>

                {/* Action Grid */}
                <div className="grid md:grid-cols-2 gap-8 w-full max-w-6xl relative z-10">
                    {/* Submission Card (FOR SCHOOLS) */}
                    <Link href="/register" className="group">
                        <div className="h-full bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 hover:border-[#40E0D0] hover:shadow-[0_30px_60px_rgba(64,224,208,0.15)] transition-all duration-500 relative overflow-hidden flex flex-col justify-between">
                            {/* Decorative background for card */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#F0FDF4] rounded-full group-hover:scale-150 transition-transform duration-700"></div>

                            <div className="relative">
                                <div className="w-16 h-16 bg-[#F0FDF4] rounded-2xl flex items-center justify-center text-green-600 mb-8 border border-green-100 group-hover:rotate-6 transition-transform">
                                    <School className="w-8 h-8" />
                                </div>
                                <h3 className="text-3xl font-black text-[#0F2F2E] mb-4">Pengajuan Bantuan</h3>
                                <p className="text-gray-500 text-lg leading-relaxed mb-8">
                                    Daftarkan sekolah Anda untuk mendapatkan dukungan renovasi, alat belajar, atau kebutuhan mendesak lainnya. Kami di sini untuk mendengarkan.
                                </p>
                            </div>

                            <div className="relative inline-flex items-center gap-3 text-green-600 font-black text-xl group-hover:gap-5 transition-all">
                                Daftar Sekolah Sekarang <ArrowRight className="w-6 h-6" />
                            </div>
                        </div>
                    </Link>

                    {/* Donor Card (FOR DONORS) */}
                    <Link href="/donor" className="group">
                        <div className="h-full bg-[#0F2F2E] rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(15,47,46,0.2)] hover:shadow-[0_30px_60px_rgba(64,224,208,0.2)] transition-all duration-500 relative overflow-hidden flex flex-col justify-between">
                            {/* Decorative background for card */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#1a4a49] rounded-full group-hover:scale-150 transition-transform duration-700"></div>

                            <div className="relative">
                                <div className="w-16 h-16 bg-[#1a4a49] rounded-2xl flex items-center justify-center text-[#40E0D0] mb-8 border border-[#2CB1A6]/30 group-hover:rotate-6 transition-transform">
                                    <Heart className="w-8 h-8" />
                                </div>
                                <h3 className="text-3xl font-black text-white mb-4">Mulai Berdonasi</h3>
                                <p className="text-gray-300 text-lg leading-relaxed mb-8">
                                    Lihat ribuan kampanye transparan dari sekolah-sekolah di pelosok negeri. Setiap rupiah Anda adalah investasi masa depan mereka.
                                </p>
                            </div>

                            <div className="relative inline-flex items-center gap-3 text-[#40E0D0] font-black text-xl group-hover:gap-5 transition-all">
                                Jelajahi Kampanye <ArrowRight className="w-6 h-6" />
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Trust Markers */}
                <div className="mt-24 w-full max-w-3xl grid grid-cols-1 md:grid-cols-3 gap-8 opacity-50 relative z-10">
                    <div className="flex flex-col items-center">
                        <ShieldCheck className="w-6 h-6 mb-2 text-[#0F2F2E]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0F2F2E]">100% Aman</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <Globe className="w-6 h-6 mb-2 text-[#0F2F2E]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0F2F2E]">Wilayah 3T</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <Heart className="w-6 h-6 mb-2 text-[#0F2F2E]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0F2F2E]">Donasi Transparan</span>
                    </div>
                </div>
            </main>

            {/* Footer minimal */}
            <footer className="py-8 text-center border-t border-gray-100">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                    © 2026 SAHABAT3T — Bersama Membangun Negeri
                </p>
            </footer>
        </div>
    );
}
