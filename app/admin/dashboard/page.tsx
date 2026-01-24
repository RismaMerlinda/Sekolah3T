"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { showConfirm } from "@/lib/swal";
import { Trash2, AlertTriangle, X, Check, Search, Globe, MapPin, School, Clock } from "lucide-react";

// Types
type Proposal = {
  _id: string;
  schoolName: string;
  npsn: string;
  region: string;
  status: "approved" | "pending" | "rejected";
  title: string;
};

export default function AdminDashboardPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  // Search NPSN State
  const [npsn, setNpsn] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState<boolean | null>(null);
  const [officialName, setOfficialName] = useState("");

  // Delete State
  const [isDeleting, setIsDeleting] = useState(false);

  // Guard login
  useEffect(() => {
    const ok = localStorage.getItem("admin_auth") === "true";
    if (!ok) window.location.href = "/admin";

    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const res = await api.get('/proposals/admin/all');
      if (Array.isArray(res.data)) {
        setProposals(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
      toast.error("Gagal memuat data dashboard");
    } finally {
      setLoading(false);
    }
  }

  // Stats
  const stats = useMemo(() => {
    const total = proposals.length;
    const approved = proposals.filter((p) => p.status === "approved").length;
    const pending = proposals.filter((p) => p.status === "pending").length;
    const rejected = proposals.filter((p) => p.status === "rejected").length;
    return { total, approved, pending, rejected };
  }, [proposals]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return proposals;
    return proposals.filter(p =>
      (p.schoolName || "").toLowerCase().includes(q) ||
      (p.region || "").toLowerCase().includes(q) ||
      (p.npsn || "").toLowerCase().includes(q)
    );
  }, [proposals, query]);

  async function openDeleteModal(id: string) {
    const isConfirmed = await showConfirm({
      title: 'Hapus Permanen?',
      text: 'Apakah Anda yakin ingin menghapus data sekolah ini? Tindakan ini tidak dapat dibatalkan.',
      icon: 'warning',
      confirmButtonText: 'Ya, Hapus',
      confirmButtonColor: '#EF4444',
    });

    if (!isConfirmed) return;

    setIsDeleting(true);
    try {
      await api.delete(`/proposals/admin/${id}`);
      toast.success("Data berhasil dihapus");
      setProposals(prev => prev.filter(p => p._id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus data");
    } finally {
      setIsDeleting(false);
    }
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

  return (
    <div className="flex flex-col h-full animate-fade-in relative">
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
                <Search size={18} />
              </div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari sekolah atau lokasi..."
                className="w-full rounded-2xl border border-[#B2F5EA] bg-white/50 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#40E0D0] focus:bg-white focus:ring-4 focus:ring-[#40E0D0]/10 transition-all font-medium text-[#0F2F2E] placeholder:text-[#6B8E8B]/70"
              />
            </div>
          </div>
        </div>

        {/* VERIFIKASI NPSN */}
        <div className="border-t border-[#B2F5EA] bg-[#E6FFFA]/30 px-4 sm:px-6 lg:px-8 py-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 rounded-xl bg-white border border-[#B2F5EA] pl-3 pr-1 py-1 shadow-sm w-full sm:w-auto">
              <div className="text-[#6B8E8B] font-bold px-2 text-xs">NPSN</div>
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
                {verifying ? <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></div> : <Check size={16} />}
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
        <div className="flex flex-wrap justify-center gap-6">
          <StatCard
            label="Total Sekolah"
            value={stats.total}
            icon={<School size={24} />}
            bgClass="bg-[#0F2F2E]"
            textClass="text-white"
            gradient="from-[#1E8F86] to-[#0F2F2E]"
          />
          <StatCard
            label="Terverifikasi"
            value={stats.approved}
            icon={<Check size={24} />}
            bgClass="bg-[#059669]"
            textClass="text-white"
            gradient="from-[#10B981] to-[#059669]"
          />
          <StatCard
            label="Menunggu"
            value={stats.pending}
            icon={<Clock size={24} />}
            bgClass="bg-[#D97706]"
            textClass="text-white"
            gradient="from-[#F59E0B] to-[#D97706]"
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
                {proposals.length} Data
              </span>
            </div>
          </div>

          <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#E6FFFA]/50 text-[#0F2F2E] text-xs uppercase tracking-wider font-bold border-b border-[#B2F5EA]">
                  <th className="px-6 py-4 w-16 text-center">No</th>
                  <th className="px-6 py-4">Nama Sekolah</th>
                  <th className="px-6 py-4">NPSN</th>
                  <th className="px-6 py-4">Lokasi</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#B2F5EA]/30 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-[#40E0D0] font-medium animate-pulse">
                      Memuat data...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-[#6B8E8B] font-medium">
                      Belum ada data sekolah.
                    </td>
                  </tr>
                ) : (
                  filtered.map((s, idx) => (
                    <tr
                      key={s._id}
                      className="group hover:bg-[#E6FFFA]/40 transition duration-200"
                    >
                      <td className="px-6 py-4 text-center text-[#6B8E8B] font-medium">{idx + 1}</td>
                      <td className="px-6 py-4 font-bold text-[#0F2F2E]">
                        {s.schoolName}
                        {s.status === 'approved' && (
                          <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#22C55E]/10 text-[#15803D] border border-[#22C55E]/20">
                            Valid
                          </span>
                        )}
                        <div className="text-[10px] font-normal text-[#6B8E8B]">{s.title}</div>
                      </td>
                      <td className="px-6 py-4 text-[#4A6F6C] font-mono text-xs">
                        {s.npsn}
                      </td>
                      <td className="px-6 py-4 text-[#4A6F6C]">
                        {s.region || "Indonesia"}
                      </td>
                      <td className="px-6 py-4">
                        {s.status === "approved" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#22C55E]/10 text-[#15803D] border border-[#22C55E]/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                            Terverifikasi
                          </span>
                        ) : s.status === "rejected" ? (
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
                            onClick={() => openDeleteModal(s._id)}
                            className="p-2 rounded-lg bg-white border border-[#B2F5EA] text-[#EF4444] hover:bg-[#EF4444] hover:text-white hover:border-[#EF4444] shadow-sm transition"
                            title="Hapus"
                          >
                            <Trash2 size={16} />
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

// Stats Component
function StatCard({ label, value, icon, bgClass, textClass, gradient }: any) {
  return (
    <div className={`relative overflow-hidden rounded-[1.5rem] border border-white/20 shadow-2xl transition-all duration-500 hover:scale-[1.04] hover:-translate-y-1.5 group ${bgClass} ${textClass} w-full sm:w-64 px-6 py-5`}>

      {/* Deep Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-95 transition-opacity duration-500 group-hover:opacity-100`} />

      {/* Glass Reflection Top Edge */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-60" />

      {/* Dynamic Glowing Orb */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-3xl transition-all duration-1000 group-hover:scale-150 group-hover:bg-white/30" />
      <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-black/10 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-700" />

      {/* Content Layout */}
      <div className="relative z-10 flex items-center justify-between">
        {/* Left Side: Labels & Number */}
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 mb-1 group-hover:text-white group-hover:tracking-[0.25em] transition-all duration-300">
            {label}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black text-white tracking-tighter drop-shadow-2xl group-hover:scale-110 transition-transform duration-500 origin-left">
              {value}
            </span>
            <span className="text-[10px] font-bold opacity-0 group-hover:opacity-60 transition-opacity duration-500">Unit</span>
          </div>
        </div>

        {/* Right Side: Floating Icon */}
        <div className="relative">
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-[inset_0_0_15px_rgba(255,255,255,0.1)] group-hover:bg-white/20 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
            <div className="text-white drop-shadow-lg">{icon}</div>
          </div>
          {/* Aura behind icon */}
          <div className="absolute inset-0 bg-white/20 blur-xl rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
        </div>
      </div>

      {/* Interactive Bottom Shine */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Thin Inner Border Glow */}
      <div className="absolute inset-0 border-2 border-white/0 rounded-[1.5rem] group-hover:border-white/10 transition-all duration-500" />
    </div>
  );
}
