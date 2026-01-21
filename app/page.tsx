'use client';

import React from 'react';
import Link from 'next/link';
import { School, Heart, ArrowRight, ShieldCheck, Globe } from 'lucide-react';

export default function RootLandingPage() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-[#40E0D0] selection:text-white overflow-x-hidden">
            {/* Navigation / Logo Area */}
            <nav className="absolute top-0 left-0 right-0 p-6 md:p-8 z-50">
                <div className="max-w-7xl mx-auto flex justify-center md:justify-start items-center">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#0F2F2E] to-[#2CB1A6] rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500">
                            <span className="text-white font-black text-lg md:text-xl">S3T</span>
                        </div>
                        <span className="text-xl md:text-2xl font-black tracking-tighter text-[#0F2F2E]">
                            SAHABAT<span className="text-[#40E0D0]">3T</span>
                        </span>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative min-h-screen flex flex-col items-center justify-center px-4 md:px-6 pt-24 pb-12 overflow-hidden">
                {/* Abstract Background Elements */}
                <div className="absolute top-[-10%] left-[-10%] w-[30%] md:w-[40%] h-[30%] md:h-[40%] bg-[#40E0D0] opacity-10 rounded-full blur-[80px] md:blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] md:w-[40%] h-[30%] md:h-[40%] bg-[#0F2F2E] opacity-10 rounded-full blur-[80px] md:blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

                <div className="max-w-5xl w-full text-center mb-12 md:mb-16 relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md border border-gray-100 rounded-full mb-6 md:mb-8 shadow-sm">
                        <span className="relative flex h-2 w-2 md:h-3 md:w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#40E0D0] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 md:h-3 md:w-3 bg-[#40E0D0]"></span>
                        </span>
                        <span className="text-[10px] md:text-sm font-bold text-[#0F2F2E] uppercase tracking-wider">Membangun Masa Depan Pendidikan Indonesia</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-[#0F2F2E] mb-6 md:mb-8 leading-[1.2] md:leading-[1.1] tracking-tight">
                        Satu Platform, <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#40E0D0] via-[#2CB1A6] to-[#0F2F2E]">
                            Berjuta Harapan.
                        </span>
                    </h1>

                    <p className="text-base md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed px-4">
                        Menghubungkan sekolah di daerah 3T dengan kepedulian Anda. Pilih peran Anda untuk perubahan nyata.
                    </p>
                </div>

                {/* Action Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full max-w-6xl relative z-10 px-2 sm:px-4">
                    {/* Submission Card (FOR SCHOOLS) */}
                    <Link href="/register" className="group">
                        <div className="h-full bg-white rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 hover:border-[#40E0D0] hover:shadow-[0_30px_60px_rgba(64,224,208,0.15)] transition-all duration-500 relative overflow-hidden flex flex-col justify-between">
                            <div className="absolute -top-12 -right-12 md:-top-24 md:-right-24 w-48 md:w-64 h-48 md:h-64 bg-[#F0FDF4] rounded-full group-hover:scale-150 transition-transform duration-700"></div>

                            <div className="relative">
                                <div className="w-14 h-14 md:w-16 md:h-16 bg-[#F0FDF4] rounded-xl md:rounded-2xl flex items-center justify-center text-green-600 mb-6 md:mb-8 border border-green-100 group-hover:rotate-6 transition-transform">
                                    <School className="w-7 h-7 md:w-8 md:h-8" />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-black text-[#0F2F2E] mb-3 md:mb-4">Pengajuan Bantuan</h3>
                                <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-6 md:mb-8">
                                    Daftarkan sekolah Anda untuk mendapatkan dukungan renovasi atau alat belajar.
                                </p>
                            </div>

                            <div className="relative inline-flex items-center gap-2 text-green-600 font-bold text-lg md:text-xl group-hover:gap-4 transition-all">
                                Daftar Sekolah <ArrowRight className="w-5 h-5" />
                            </div>
                        </div>
                    </Link>

                    {/* Donor Card (FOR DONORS) */}
                    <Link href="/donor" className="group">
                        <div className="h-full bg-[#0F2F2E] rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(15,47,46,0.2)] hover:shadow-[0_30px_60px_rgba(64,224,208,0.2)] transition-all duration-500 relative overflow-hidden flex flex-col justify-between">
                            <div className="absolute -top-12 -right-12 md:-top-24 md:-right-24 w-48 md:w-64 h-48 md:h-64 bg-[#1a4a49] rounded-full group-hover:scale-150 transition-transform duration-700"></div>

                            <div className="relative">
                                <div className="w-14 h-14 md:w-16 md:h-16 bg-[#1a4a49] rounded-xl md:rounded-2xl flex items-center justify-center text-[#40E0D0] mb-6 md:mb-8 border border-[#2CB1A6]/30 group-hover:rotate-6 transition-transform">
                                    <Heart className="w-7 h-7 md:w-8 md:h-8" />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-black text-white mb-3 md:mb-4">Mulai Berdonasi</h3>
                                <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6 md:mb-8">
                                    Lihat ribuan kampanye transparan dari sekolah-sekolah di pelosok negeri.
                                </p>
                            </div>

                            <div className="relative inline-flex items-center gap-2 text-[#40E0D0] font-bold text-lg md:text-xl group-hover:gap-4 transition-all">
                                Jelajahi Kampanye <ArrowRight className="w-5 h-5" />
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Trust Markers */}
                <div className="mt-16 md:mt-24 w-full max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 opacity-60 relative z-10 px-4">
                    <div className="flex items-center sm:flex-col justify-center gap-3 sm:gap-0">
                        <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 mb-0 sm:mb-2 text-[#0F2F2E]" />
                        <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-[#0F2F2E]">100% Aman</span>
                    </div>
                    <div className="flex items-center sm:flex-col justify-center gap-3 sm:gap-0">
                        <Globe className="w-5 h-5 md:w-6 md:h-6 mb-0 sm:mb-2 text-[#0F2F2E]" />
                        <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-[#0F2F2E]">Wilayah 3T</span>
                    </div>
                    <div className="flex items-center sm:flex-col justify-center gap-3 sm:gap-0">
                        <Heart className="w-5 h-5 md:w-6 md:h-6 mb-0 sm:mb-2 text-[#0F2F2E]" />
                        <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-[#0F2F2E]">Transparan</span>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-6 md:py-8 text-center border-t border-gray-100 bg-white/50 backdrop-blur-sm">
                <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest px-4">
                    © 2026 SAHABAT3T — Bersama Membangun Negeri
                </p>
            </footer>
        </div>
    );
}
