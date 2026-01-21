"use client";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/Button";
import { Search } from "lucide-react";

export default function ProgramPage() {
    return (
        <div className="min-h-screen bg-secondary-bg font-sans">
            <Navbar />

            <section className="pt-32 pb-16 text-center container mx-auto px-6">
                <h1 className="text-4xl font-bold text-neutral-heading mb-6">Program Bantuan</h1>
                <p className="text-xl text-neutral-body max-w-2xl mx-auto mb-8">
                    Temukan berbagai inisiatif kami untuk memajukan pendidikan di daerah 3T.
                </p>

                <div className="max-w-md mx-auto relative cursor-pointer">
                    <input
                        type="text"
                        placeholder="Cari program sekolah..."
                        className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
            </section>

            <div className="container mx-auto px-6 pb-20 text-center text-gray-500">
                <p>Belum ada program yang ditampilkan saat ini.</p>
            </div>
        </div>
    );
}
