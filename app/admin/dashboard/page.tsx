"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

// Types
type SchoolStatus = "approved" | "pending" | "rejected";
type School = {
  id: string;
  nama: string; // Changed from namaSekolah to match updated usage
  npsn?: string;
  kecamatan?: string;
  kabupaten?: string;
  provinsi?: string;
  status_verifikasi?: "verified" | "pending" | "rejected"; // Changed from status to match updated usage
  is_verified?: boolean;
};

const LS_KEY = "school_submissions";

export default function AdminDashboardPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [query, setQuery] = useState("");

  // Search NPSN State
  const [npsn, setNpsn] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState<boolean | null>(null);
  const [officialName, setOfficialName] = useState("");

  // Guard login
  useEffect(() => {
    const ok = localStorage.getItem("admin_auth") === "true";
    if (!ok) window.location.href = "/admin";
    loadSchools();
  }, []);

  function loadSchools() {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return setSchools([]);
    try {
      const parsed = JSON.parse(raw);
      // Map old format to new if needed, or just use as is
      setSchools(Array.isArray(parsed) ? parsed : []);
    } catch {
      setSchools([]);
    }
  }

  function deleteSchool(id: string) {
    if (!confirm("Yakin ingin menghapus sekolah ini?")) return;
    const next = schools.filter((s) => s.id !== id);
    setSchools(next);
    localStorage.setItem(LS_KEY, JSON.stringify(next));
  }

  const verifySchool = async (npsnValue: string) => {
    const clean = (npsnValue || "").trim();
    if (!clean) {
      setVerified(null);
      return;
    }
    setVerifying(true);
    setVerified(null);
    try {
      const res = await fetch(`https://api.fazriansyah.eu.org/v1/sekolah?npsn=${encodeURIComponent(clean)}`);
      const json = await res.json();
      if (json?.data?.satuanPendidikan) {
        setVerified(true);
        setOfficialName(json.data.satuanPendidikan.nama);
      } else {
        setVerified(false);
      }
    } catch {
      setVerified(false);
    } finally {
      setVerifying(false);
    }
  };

  // Stats
  const stats = useMemo(() => {
    const totalSchools = schools.length;
    const verifiedSchools = schools.filter((s) => s.status_verifikasi === "verified").length;
    const pendingSchools = schools.filter((s) => !s.status_verifikasi || s.status_verifikasi === "pending").length;
    return { totalSchools, verifiedSchools, pendingSchools };
  }, [schools]);

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* HEADER */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-[#B2F5EA]">
        <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-xs font-bold text-[#6B8E8B] uppercase tracking-wider">
              Dashboard
            </div>
            <h1 className="text-2xl font-extrabold text-[#0F2F2E] tracking-tight">
              Ringkasan Data
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
                placeholder="Cari sekolah atau NPSN..."
                className="w-full rounded-2xl border border-[#B2F5EA] bg-white/50 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#40E0D0] focus:bg-white focus:ring-4 focus:ring-[#40E0D0]/10 transition-all font-medium text-[#0F2F2E] placeholder:text-[#6B8E8B]/70"
              />
            </div>
          </div>
        </div>

        {/* VERIFIKASI NPSN */}
        <div className="border-t border-[#B2F5EA] bg-[#E6FFFA]/30 px-4 sm:px-6 lg:px-8 py-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 rounded-xl bg-white border border-[#B2F5EA] pl-3 pr-1 py-1 shadow-sm w-full sm:w-auto">
              <div className="text-[#6B8E8B]"><NpsnIcon /></div>
              <input
                value={npsn}
                onChange={(e) => setNpsn(e.target.value)}
                placeholder="Cek Validitas NPSN"
                className="bg-transparent text-sm font-medium outline-none w-full sm:w-48 text-[#0F2F2E]"
              />
              <button
                onClick={() => verifySchool(npsn)}
                disabled={verifying}
                className="rounded-lg bg-[#0F2F2E] p-2 text-white hover:bg-[#1A4D4A] transition disabled:opacity-50"
                title="Cek ke Kemdikbud"
              >
                {verifying ? <SpinnerIcon /> : <CheckIconSmall />}
              </button>
            </div>

            {verified === true && (
              <div className="flex items-center gap-2 text-sm text-[#0F2F2E] bg-[#22C55E]/10 px-3 py-1.5 rounded-lg border border-[#22C55E]/20">
                <span className="font-bold text-[#15803D]">Valid:</span> {officialName}
              </div>
            )}
            {verified === false && (
              <div className="flex items-center gap-2 text-sm text-[#991B1B] bg-[#EF4444]/10 px-3 py-1.5 rounded-lg border border-[#EF4444]/20">
                <span className="font-bold">Tidak ditemukan</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="p-4 sm:p-6 lg:p-8 flex-1 space-y-6">

        {/* Stats Grid */}
        <div className="flex flex-wrap justify-center gap-4">
          <StatCard
            label="Total Sekolah"
            value={stats.totalSchools}
            icon={<SchoolIcon />}
            bgClass="bg-[#0F2F2E]" // Fallback
            textClass="text-white"
            gradient="from-[#0F2F2E] to-[#0A3F3A]"
          />
          <StatCard
            label="Terverifikasi"
            value={stats.verifiedSchools}
            icon={<CheckIcon />}
            bgClass="bg-[#059669]" // Fallback
            textClass="text-white"
            gradient="from-[#059669] to-[#047857]"
          />
          <StatCard
            label="Menunggu"
            value={stats.pendingSchools}
            icon={<ClockIcon />}
            bgClass="bg-[#D97706]" // Fallback
            textClass="text-white"
            gradient="from-[#D97706] to-[#B45309]"
          />
        </div>

        {/* Table Card */}
        <div className="rounded-[2.5rem] bg-white/60 backdrop-blur-xl border border-[#B2F5EA] shadow-xl shadow-[#40E0D0]/5 overflow-hidden flex flex-col">
          <div className="px-8 py-6 border-b border-[#B2F5EA]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-[#0F2F2E]">
                Daftar Sekolah
              </h2>
              <p className="text-sm text-[#6B8E8B] font-medium mt-1">
                Data Sekolah yang Mengajukan
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#E6FFFA] rounded-lg text-xs font-bold text-[#40E0D0] border border-[#B2F5EA]">
                {schools.length} Data
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#E6FFFA]/50 text-[#0F2F2E] text-xs uppercase tracking-wider font-bold border-b border-[#B2F5EA]">
                  <th className="px-6 py-4 w-16 text-center">No</th>
                  <th className="px-6 py-4">Nama Sekolah</th>
                  <th className="px-6 py-4">Lokasi</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#B2F5EA]/30 text-sm">
                {schools.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-[#6B8E8B] font-medium">
                      Belum ada data sekolah.
                    </td>
                  </tr>
                ) : (
                  schools.map((s, idx) => (
                    <tr
                      key={s.id}
                      className="group hover:bg-[#E6FFFA]/40 transition duration-200"
                    >
                      <td className="px-6 py-4 text-center text-[#6B8E8B] font-medium">{idx + 1}</td>
                      <td className="px-6 py-4 font-bold text-[#0F2F2E]">
                        {s.nama}
                        {s.is_verified && (
                          <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#22C55E]/10 text-[#15803D] border border-[#22C55E]/20">
                            Valid
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-[#4A6F6C]">
                        {[s.kecamatan, s.kabupaten, s.provinsi].filter(Boolean).join(", ")}
                      </td>
                      <td className="px-6 py-4">
                        {s.status_verifikasi === "verified" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#22C55E]/10 text-[#15803D] border border-[#22C55E]/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                            Terverifikasi
                          </span>
                        ) : s.status_verifikasi === "rejected" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EF4444]/10 text-[#B91C1C] border border-[#EF4444]/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#B91C1C]" />
                            Ditolak
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F59E0B]/10 text-[#B45309] border border-[#F59E0B]/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#B45309]" />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => deleteSchool(s.id)}
                            className="p-2 rounded-lg bg-white border border-[#B2F5EA] text-[#EF4444] hover:bg-[#EF4444] hover:text-white hover:border-[#EF4444] shadow-sm transition"
                            title="Hapus"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

// COMPONENTS & ICONS

function StatCard({ label, value, icon, bgClass, textClass, gradient }: any) {
  return (
    <div className={`relative overflow-hidden rounded-xl border border-white/20 shadow-lg transition-all hover:scale-[1.02] hover:shadow-2xl ${bgClass} ${textClass} flex-1 h-40 flex flex-col items-center justify-center p-2`}>

      {/* Background Gradient & Glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90`} />
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute top-1/2 -left-10 w-24 h-24 bg-black/10 rounded-full blur-2xl opacity-30 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-2 mt-4">
        <div className="absolute top-2 left-2 text-xl">{icon}</div>
        <div className="text-xs font-bold uppercase tracking-wider opacity-90">{label}</div>
        <div className="text-2xl font-black tracking-tight drop-shadow-sm">{value}</div>
      </div>

      {/* Bottom Pattern */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-50" />
    </div>
  );
}

function SearchIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
}
function SpinnerIcon() {
  return (
    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
  )
}
function NpsnIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4" /><polyline points="14 2 14 8 20 8" /><path d="M2 12h12" /><path d="M2 16h12" /><path d="M2 20h12" /></svg>
}
function CheckIconSmall() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
}
function SchoolIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m4 6 8-4 8 4" /><path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2" /><path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4" /><path d="M18 5v17" /><path d="M6 5v17" /></svg>
}
function CheckIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></svg>
}
function ClockIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
}
function TrashIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
}
function ArrowRightIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
}
