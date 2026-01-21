"use client";

import { useEffect, useMemo, useState } from "react";

/* ================= TYPES ================= */

type Donor = {
    id: string;
    name: string;
    email: string;
    amount: number;
    schoolName: string;
    date: string; // ISO
    status: "success" | "pending" | "failed";
};

/* ================= MOCK DATA ================= */
// Placeholder until backend is ready
const MOCK_DONORS: Donor[] = [
    { id: "1", name: "Hamba Allah", email: "-", amount: 500000, schoolName: "SDN 1 Tertinggal", date: "2025-01-20T10:30:00Z", status: "success" },
    { id: "2", name: "Hamba Allah", email: "-", amount: 150000, schoolName: "SMP Terbuka Jauh", date: "2025-01-19T14:20:00Z", status: "success" },
    { id: "3", name: "Hamba Allah", email: "-", amount: 1000000, schoolName: "SMA Perbatasan", date: "2025-01-19T09:15:00Z", status: "pending" },
    { id: "4", name: "Hamba Allah", email: "-", amount: 50000, schoolName: "SDN 1 Tertinggal", date: "2025-01-18T16:00:00Z", status: "success" },
    { id: "5", name: "Hamba Allah", email: "-", amount: 2500000, schoolName: "SMK Kelautan", date: "2025-01-18T08:00:00Z", status: "success" },
    { id: "6", name: "Hamba Allah", email: "-", amount: 750000, schoolName: "SMP Terbuka Jauh", date: "2025-01-17T11:45:00Z", status: "failed" },
];

export default function AdminDonaturPage() {
    const [donors, setDonors] = useState<Donor[]>([]);
    const [query, setQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "success" | "pending" | "failed">("all");

    // ✅ Guard login
    useEffect(() => {
        const ok = localStorage.getItem("admin_auth") === "true";
        if (!ok) window.location.href = "/admin";

        // Load data (simulate API)
        setDonors(MOCK_DONORS);
    }, []);

    // Filter Logic
    const filtered = useMemo(() => {
        return donors.filter(d => {
            const matchQuery =
                d.name.toLowerCase().includes(query.toLowerCase()) ||
                d.schoolName.toLowerCase().includes(query.toLowerCase()) ||
                d.email.toLowerCase().includes(query.toLowerCase());

            const matchStatus = filterStatus === "all" || d.status === filterStatus;

            return matchQuery && matchStatus;
        });
    }, [donors, query, filterStatus]);

    // Stats
    const stats = useMemo(() => {
        const totalAmount = donors
            .filter(d => d.status === 'success')
            .reduce((sum, d) => sum + d.amount, 0);
        const totalDonors = donors.length;
        const pendingCount = donors.filter(d => d.status === 'pending').length;
        return { totalAmount, totalDonors, pendingCount };
    }, [donors]);

    return (
        <div className="flex flex-col h-full animate-fade-in">
            {/* HEADER */}
            <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-[#B2F5EA]">
                <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="text-xs font-bold text-[#6B8E8B] uppercase tracking-wider">Donasi</div>
                        <h1 className="text-2xl font-extrabold text-[#0F2F2E] tracking-tight">
                            Data Donatur
                        </h1>
                    </div>

                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <div className="relative group w-full lg:w-80">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B8E8B] transition group-focus-within:text-[#40E0D0]">
                                <SearchIcon />
                            </div>
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Cari nama, email, sekolah..."
                                className="w-full rounded-2xl border border-[#B2F5EA] bg-white/50 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#40E0D0] focus:bg-white focus:ring-4 focus:ring-[#40E0D0]/10 transition-all font-medium text-[#0F2F2E] placeholder:text-[#6B8E8B]/70"
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* CONTENT */}
            <main className="p-4 sm:p-6 lg:p-8 flex-1 space-y-6 max-w-[1600px] mx-auto w-full">

                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                    <StatCard
                        title="Total Donasi Masuk"
                        value={formatRupiah(stats.totalAmount)}
                        icon={<WalletIcon />}
                        gradient="from-[#0F2F2E] to-[#1A4D4A]"
                    />
                    <StatCard
                        title="Total Transaksi"
                        value={stats.totalDonors}
                        icon={<ReceiptIcon />}
                        gradient="from-[#0284C7] to-[#0369A1]" // Blue
                    />
                    <StatCard
                        title="Menunggu Konfirmasi"
                        value={stats.pendingCount}
                        icon={<ClockIcon />}
                        gradient="from-[#F59E0B] to-[#D97706]" // Orange
                    />
                </div>

                {/* Table Card */}
                <div className="rounded-[2.5rem] bg-white/60 backdrop-blur-xl border border-[#B2F5EA] shadow-xl shadow-[#40E0D0]/5 overflow-hidden flex flex-col min-h-[400px]">
                    <div className="px-8 py-6 border-b border-[#B2F5EA]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-extrabold text-[#0F2F2E]">
                                Riwayat Transaksi
                            </h2>
                            <p className="text-sm text-[#6B8E8B] font-medium mt-1">
                                Daftar lengkap donasi yang masuk ke sistem.
                            </p>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex p-1 rounded-xl bg-[#E6FFFA]/50 border border-[#B2F5EA]">
                            {(['all', 'success', 'pending', 'failed'] as const).map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setFilterStatus(s)}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${filterStatus === s
                                        ? 'bg-white text-[#0F2F2E] shadow-sm'
                                        : 'text-[#6B8E8B] hover:text-[#0F2F2E]'
                                        }`}
                                >
                                    {s === 'all' ? 'Semua' : s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1">
                        {filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                                <div className="w-16 h-16 rounded-2xl bg-[#E6FFFA] flex items-center justify-center text-[#40E0D0] mb-4">
                                    <InboxIcon />
                                </div>
                                <div className="text-lg font-bold text-[#0F2F2E]">
                                    Tidak ada data ditemukan
                                </div>
                                <p className="mt-2 text-sm text-[#6B8E8B]">
                                    Coba ubah kata kunci pencarian atau filter status.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-[#E6FFFA]/50 text-[#0F2F2E] text-xs uppercase tracking-wider font-bold border-b border-[#B2F5EA]">
                                            <th className="px-6 py-4 w-16 text-center">No</th>
                                            <th className="px-6 py-4">Donatur</th>
                                            <th className="px-6 py-4">Sekolah Tujuan</th>
                                            <th className="px-6 py-4">Nominal</th>
                                            <th className="px-6 py-4">Tanggal</th>
                                            <th className="px-6 py-4 text-right">Status</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-[#B2F5EA]/30 text-sm">
                                        {filtered.map((d, idx) => (
                                            <tr
                                                key={d.id}
                                                className="hover:bg-[#E6FFFA]/40 transition group"
                                            >
                                                <td className="px-6 py-4 text-center text-[#6B8E8B] font-medium">{idx + 1}</td>
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-[#0F2F2E]">{d.name}</div>
                                                    <div className="text-xs text-[#6B8E8B]">{d.email}</div>
                                                </td>
                                                <td className="px-6 py-4 font-medium text-[#4A6F6C]">{d.schoolName}</td>
                                                <td className="px-6 py-4 font-bold text-[#0F2F2E]">
                                                    {formatRupiah(d.amount)}
                                                </td>
                                                <td className="px-6 py-4 text-[#6B8E8B] text-xs">
                                                    {formatDateTime(d.date)}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <StatusPill status={d.status} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

/* ===== UI Components ===== */

function StatCard({ title, value, icon, gradient }: any) {
    return (
        <div className={`relative overflow-hidden rounded-[2rem] p-6 text-white shadow-xl shadow-gray-200/50 bg-gradient-to-br ${gradient}`}>
            <div className="relative z-10 flex justify-between items-start">
                <div>
                    <div className="text-white/80 font-bold text-sm mb-1">{title}</div>
                    <div className="text-3xl font-black tracking-tight">{value}</div>
                </div>
                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                    {icon}
                </div>
            </div>
            {/* Decor pattern */}
            <div className="absolute -right-4 -bottom-12 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        </div>
    )
}

function StatusPill({ status }: { status: string }) {
    const map: Record<string, { label: string; cls: string }> = {
        success: { label: "Berhasil", cls: "bg-[#22C55E]/10 border-[#22C55E]/25 text-[#15803D]" },
        pending: { label: "Pending", cls: "bg-[#F59E0B]/10 border-[#F59E0B]/25 text-[#B45309]" },
        failed: { label: "Gagal", cls: "bg-[#EF4444]/10 border-[#EF4444]/25 text-[#B91C1C]" },
    };
    const v = map[status] || map.pending;
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border ${v.cls}`}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${status === 'success' ? 'bg-[#22C55E]' : status === 'pending' ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}`} />
            {v.label}
        </span>
    );
}

/* ===== Helpers ===== */
function formatRupiah(n: number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(n);
}

function formatDateTime(iso: string) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(d);
}

/* ===== Icons ===== */
function SearchIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
    );
}
function WalletIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7h-7" /><path d="M14 21V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2Z" /><path d="M8 7v14" /><rect width="20" height="14" x="2" y="7" rx="2" ry="2" fill="none" stroke="none" /><path d="M16 7v0a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1" /></svg>
    );
}
function ReceiptIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 17V7" /></svg>
    );
}
function ClockIcon() {
    return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
}
function InboxIcon() {
    return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></svg>
    );
}
