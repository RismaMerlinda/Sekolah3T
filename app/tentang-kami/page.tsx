"use client";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CheckCircle, Globe, Award, Users, Heart, Target } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { DonorFooter } from "@/components/donor/Header";

export default function TentangKamiPage() {
    const stats = [
        { label: "Provinsi Dijangkau", value: "0", icon: <Globe className="w-6 h-6" /> },
        { label: "Relawan Aktif", value: "0", icon: <Users className="w-6 h-6" /> },
        { label: "Sekolah Dibantu", value: "0", icon: <Heart className="w-6 h-6" /> },
        { label: "Penghargaan", value: "0", icon: <Award className="w-6 h-6" /> },
    ];

    return (
        <div className="min-h-screen bg-white font-sans">
            <Navbar />

            {/* Header */}
            <section className="pt-32 pb-16 bg-gradient-to-b from-secondary-bg to-white text-center">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-bold text-neutral-heading mb-6">
                        Mengenal Sahabat<span className="text-primary">3T</span>
                    </h1>
                    <p className="text-xl text-neutral-body max-w-2xl mx-auto leading-relaxed">
                        Gerakan sosial yang menghubungkan kebaikan hati donatur dengan mimpi anak-anak di daerah Terdepan, Terluar, dan Tertinggal.
                    </p>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-16">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="flex-1">
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500">
                                <div className="bg-gray-200 h-[400px] w-full flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000&auto=format&fit=crop")' }}>
                                    {/* Fallback if image fails */}
                                    <span className="sr-only">Anak-anak sekolah</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 space-y-6">
                            <h2 className="text-3xl font-bold text-neutral-heading">Misi Kami Sederhana: <br /><span className="text-primary">Pemerataan Pendidikan</span></h2>
                            <p className="text-neutral-body text-lg leading-relaxed">
                                Di balik keindahan alam Indonesia, masih banyak sekolah di pelosok yang berjuang dengan fasilitas minim. Atap bocor, buku yang kurang, dan akses digital yang nihil.
                            </p>
                            <p className="text-neutral-body text-lg leading-relaxed">
                                <strong className="text-neutral-heading">Sahabat3T</strong> lahir dari keresahan ini. Kami membangun platform teknologi yang memungkinkan sekolah di daerah 3T untuk mengajukan kebutuhan nyata mereka, dan memungkinkan Anda untuk membantu secara langsung dengan transparansi penuh.
                            </p>

                            <div className="flex flex-col gap-4 border-l-4 border-primary pl-6 py-2 bg-secondary-bg/30 rounded-r-xl">
                                <h4 className="font-bold text-neutral-heading">Nilai Inti Kami</h4>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2"><CheckCircle className="text-primary w-5 h-5" /> Transparansi tanpa kompromi</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="text-primary w-5 h-5" /> Dampak langsung ke penerima</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="text-primary w-5 h-5" /> Keberlanjutan jangka panjang</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-24 bg-primary">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, i) => (
                            <div key={i} className="text-center p-8 bg-white rounded-2xl shadow-xl hover:-translate-y-2 transition-transform duration-300">
                                <div className="flex justify-center mb-6 text-primary scale-110 transform">{stat.icon}</div>
                                <div className="text-4xl font-bold mb-3 text-[#0F2F2E]">{stat.value}</div>
                                <div className="text-sm font-medium text-gray-600 uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>



            {/* Footer */}
            <DonorFooter />
        </div>
    );
}
