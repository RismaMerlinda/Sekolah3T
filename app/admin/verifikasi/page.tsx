"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

type SchoolStatus = "approved" | "pending" | "rejected";

// Updated type to match Backend Proposal model
type Proposal = {
  _id: string; // MongoDB ID
  schoolName: string;
  npsn: string;
  region: string; // or 'lokasi' if backend sends that
  status: SchoolStatus;
  title: string; // Campaign title
  targetAmount: number;
  createdAt: string;
};

export default function AdminVerifikasiPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Guard login
  useEffect(() => {
    const ok = localStorage.getItem("admin_auth") === "true";
    if (!ok) window.location.href = "/admin";
    fetchProposals();
  }, []);

  async function fetchProposals() {
    try {
      setLoading(true);
      // Fetch all proposals (pending + others)
      // Note: URL is absolute or proxied. Next.js rewriting /api to localhost:5000 usually
      // But here we might need full URL if proxy not set for admin path? 
      // Let's try direct fetch to backend port if client-side or use relative if proxy works.
      // Assuming /api/proposals/admin/all works relative to Next.js if rewrites exist, 
      // OR we use the direct backend URL if we know it.
      // Let's use relative first, assuming next.config.js rewrites /api -> backend.
      // If not, we might need a helper. existing files use `api` helper or direct fetch.
      // Let's try direct fetch to port 5000 to be safe or check if we can use the `api` helper.

      const res = await fetch('http://localhost:5000/api/proposals/admin/all');
      const data = await res.json();

      if (Array.isArray(data)) {
        setProposals(data);
      }
    } catch (err) {
      console.error("Failed to fetch proposals", err);
      toast.error("Gagal mengambil data pengajuan");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: SchoolStatus) {
    if (!confirm(`Yakin ingin mengubah status menjadi ${status}?`)) return;

    try {
      const res = await fetch(`http://localhost:5000/api/proposals/admin/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        toast.success(`Status berhasil diubah: ${status}`);
        fetchProposals(); // Refresh list
      } else {
        throw new Error("Gagal update");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat update status");
    }
  }

  const pendingList = useMemo(() => {
    const q = search.trim().toLowerCase();
    // Filter: Show PENDING at top or just show all? 
    // Requirement usually is "Verifikasi" -> implies Checking Pending items.
    // But showing history is good too. Let's filter just Pending for the "Antrian" list?
    // Or just show all and let user filter? 
    // The UI says "Antrian Verifikasi", implying pending.

    // Let's show ONLY Pending by default for "Antrian". 
    // But maybe we want to see approved ones too? 
    // Let's keep existing logic: users verify "Pending".

    let base = proposals.filter((s) => s.status === "pending");

    // Safety check if response structure is different
    if (!base) base = [];

    if (!q) return base;

    return base.filter((s) => {
      return (
        (s.schoolName || "").toLowerCase().includes(q) ||
        (s.npsn || "").toLowerCase().includes(q) ||
        (s.title || "").toLowerCase().includes(q)
      );
    });
  }, [proposals, search]);

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* HEADER */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-[#B2F5EA]">
        <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-xs font-bold text-[#6B8E8B] uppercase tracking-wider">Verifikasi</div>
            <h1 className="text-2xl font-extrabold text-[#0F2F2E] tracking-tight">
              Verifikasi Pengajuan
            </h1>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative group w-full lg:w-80">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B8E8B] transition group-focus-within:text-[#40E0D0]">
                <SearchIcon />
              </div>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari sekolah, NPSN, pengajuan..."
                className="w-full rounded-2xl border border-[#B2F5EA] bg-white/50 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#40E0D0] focus:bg-white focus:ring-4 focus:ring-[#40E0D0]/10 transition-all font-medium text-[#0F2F2E] placeholder:text-[#6B8E8B]/70"
              />
            </div>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="p-4 sm:p-6 lg:p-8 flex-1 space-y-6 max-w-[1600px] mx-auto w-full">

        {/* Card Container */}
        <div className="rounded-[2.5rem] bg-white/60 backdrop-blur-xl border border-[#B2F5EA] shadow-xl shadow-[#40E0D0]/5 overflow-hidden flex flex-col min-h-[400px]">
          <div className="px-8 py-6 border-b border-[#B2F5EA]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-[#0F2F2E]">
                Antrian Pengajuan
              </h2>
              <p className="text-sm text-[#6B8E8B] font-medium mt-1">
                Daftar pengajuan kampanye sekolah yang menunggu persetujuan.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#F59E0B]/10 rounded-lg text-xs font-bold text-[#D97706] border border-[#F59E0B]/20">
                {pendingList.length} Menunggu
              </span>
            </div>
          </div>

          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-40 text-[#6B8E8B]">Memuat data...</div>
            ) : pendingList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#E6FFFA] flex items-center justify-center text-[#40E0D0] mb-4">
                  <InboxIcon />
                </div>
                <div className="text-lg font-bold text-[#0F2F2E]">
                  Tidak ada antrian
                </div>
                <p className="mt-2 text-sm text-[#6B8E8B]">
                  Semua pengajuan telah diproses atau belum ada data baru.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#E6FFFA]/50 text-[#0F2F2E] text-xs uppercase tracking-wider font-bold border-b border-[#B2F5EA]">
                      <th className="px-6 py-4 w-16 text-center">No</th>
                      <th className="px-6 py-4">Nama Sekolah</th>
                      <th className="px-6 py-4">Judul Kampanye</th>
                      <th className="px-6 py-4">Dana Target</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#B2F5EA]/30 text-sm">
                    {pendingList.map((s, idx) => (
                      <tr
                        key={s._id}
                        className="hover:bg-[#E6FFFA]/40 transition group"
                      >
                        <td className="px-6 py-4 text-center text-[#6B8E8B] font-medium">{idx + 1}</td>
                        <td className="px-6 py-4 font-bold text-[#0F2F2E]">
                          {s.schoolName}
                          <div className="text-xs font-normal text-[#6B8E8B] font-mono mt-0.5">{s.npsn}</div>
                        </td>
                        <td className="px-6 py-4 text-[#4A6F6C]">
                          {s.title}
                        </td>
                        <td className="px-6 py-4 text-[#4A6F6C] font-mono">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(s.targetAmount || 0)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <StatusPill status="pending" />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => updateStatus(s._id, "approved")}
                              className="px-3 py-1.5 rounded-lg bg-[#22C55E] text-white text-xs font-bold shadow-md shadow-[#22C55E]/20 hover:scale-105 active:scale-95 transition"
                            >
                              Terima
                            </button>
                            <button
                              onClick={() => updateStatus(s._id, "rejected")}
                              className="px-3 py-1.5 rounded-lg bg-white border border-[#EF4444]/30 text-[#EF4444] text-xs font-bold hover:bg-[#EF4444] hover:text-white transition"
                            >
                              Tolak
                            </button>
                          </div>
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

function StatusPill({ status }: { status: SchoolStatus }) {
  const map: Record<SchoolStatus, { label: string; cls: string }> = {
    approved: { label: "Disetujui", cls: "bg-[#22C55E]/10 border-[#22C55E]/25 text-[#15803D]" },
    pending: { label: "Menunggu", cls: "bg-[#F59E0B]/10 border-[#F59E0B]/25 text-[#B45309]" },
    rejected: { label: "Ditolak", cls: "bg-[#EF4444]/10 border-[#EF4444]/25 text-[#B91C1C]" },
  };
  const v = map[status] || map.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border ${v.cls}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'approved' ? 'bg-[#22C55E]' : status === 'pending' ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}`} />
      {v.label}
    </span>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
  );
}

function InboxIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></svg>
  );
}
