"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import toast from "react-hot-toast";

/* ================= TYPES ================= */

type Proposal = {
  _id: string;
  title: string;
  category: string;
  schoolName: string;
  npsn: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  targetAmount: number;
  createdAt: string;
};

export default function AdminLaporanPage() {
  const router = useRouter();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  // Guard login
  useEffect(() => {
    const ok = localStorage.getItem("admin_auth") === "true";
    if (!ok) window.location.href = "/admin";
    loadProposals();
  }, []);

  async function loadProposals() {
    setLoading(true);
    try {
      // Fetch all proposals (Admin view)
      const res = await api.get("/proposals/admin/all");
      // Filter out drafts if needed, but usually admin wants to see submitted (pending/approved/rejected)
      const list = Array.isArray(res.data) ? res.data : [];
      setProposals(list.filter((p: any) => p.status !== 'draft'));
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data pengajuan");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateStatus(id: string, status: 'approved' | 'rejected') {
    if (!confirm(`Yakin ingin mengubah status menjadi ${status.toUpperCase()}?`)) return;
    try {
      await api.put(`/proposals/admin/${id}/status`, { status });
      toast.success(`Pengajuan ${status === 'approved' ? 'Disetujui' : 'Ditolak'}`);
      loadProposals();
    } catch (error) {
      toast.error("Gagal update status");
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return proposals;
    return proposals.filter((p) => {
      return (
        p.schoolName.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.npsn.toLowerCase().includes(q)
      );
    });
  }, [proposals, query]);

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* HEADER */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-[#B2F5EA]">
        <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-xs font-bold text-[#6B8E8B] uppercase tracking-wider">Laporan</div>
            <h1 className="text-2xl font-extrabold text-[#0F2F2E] tracking-tight">
              Daftar Pengajuan Kampanye
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
                placeholder="Cari sekolah, judul, NPSN..."
                className="w-full rounded-2xl border border-[#B2F5EA] bg-white/50 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#40E0D0] focus:bg-white focus:ring-4 focus:ring-[#40E0D0]/10 transition-all font-medium text-[#0F2F2E] placeholder:text-[#6B8E8B]/70"
              />
            </div>
            <button
              onClick={loadProposals}
              className="p-2.5 rounded-xl border border-[#B2F5EA] bg-white text-[#1E8F86] hover:bg-[#E6FFFA] transition"
            >
              <RefreshIcon />
            </button>
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
                Daftar Masuk
              </h2>
              <p className="text-sm text-[#6B8E8B] font-medium mt-1">
                Moderasi pengajuan kampanye bantuan dari sekolah-sekolah Sahabat3T.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#E6FFFA] rounded-lg text-xs font-bold text-[#40E0D0] border border-[#B2F5EA]">
                {filtered.length} Pengajuan
              </span>
            </div>
          </div>

          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center py-20 text-[#40E0D0]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#E6FFFA] flex items-center justify-center text-[#40E0D0] mb-4">
                  <InboxIcon />
                </div>
                <div className="text-lg font-bold text-[#0F2F2E]">
                  Tidak ada pengajuan
                </div>
                <p className="mt-2 text-sm text-[#6B8E8B]">
                  Belum ada pengajuan masuk yang membutuhkan moderasi.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#E6FFFA]/50 text-[#0F2F2E] text-xs uppercase tracking-wider font-bold border-b border-[#B2F5EA]">
                      <th className="px-6 py-4 w-16 text-center">No</th>
                      <th className="px-6 py-4">Informasi Kampanye</th>
                      <th className="px-6 py-4">Sekolah</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Target Dana</th>
                      <th className="px-6 py-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#B2F5EA]/30 text-sm">
                    {filtered.map((p, idx) => (
                      <tr
                        key={p._id}
                        className="hover:bg-[#E6FFFA]/40 transition group"
                      >
                        <td className="px-6 py-4 text-center text-[#6B8E8B] font-medium">{idx + 1}</td>
                        <td className="px-6 py-4 font-bold text-[#0F2F2E]">
                          <div className="max-w-xs overflow-hidden text-ellipsis">{p.title}</div>
                          <div className="text-[10px] text-[#6B8E8B] mt-0.5 uppercase tracking-wide">{p.category}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-[#0F2F2E]">{p.schoolName}</div>
                          <div className="text-xs text-[#6B8E8B] font-mono">{p.npsn}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${p.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                            p.status === 'approved' ? 'bg-green-100 text-green-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-[#0F2F2E]">
                          {formatRupiah(p.targetAmount || 0)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => router.push(`/admin/detail?id=${p._id}`)}
                              className="px-3 py-1.5 rounded-lg bg-white border border-[#B2F5EA] text-[#0F2F2E] text-xs font-bold hover:shadow-md transition"
                            >
                              Detail
                            </button>
                            {p.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleUpdateStatus(p._id, 'approved')}
                                  className="px-3 py-1.5 rounded-lg bg-[#40E0D0] text-white text-xs font-bold hover:shadow-md transition"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(p._id, 'rejected')}
                                  className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-bold hover:shadow-md transition"
                                >
                                  Reject
                                </button>
                              </>
                            )}
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

function formatRupiah(n: number) {
  if (!n) return "Rp 0";
  return "Rp " + new Intl.NumberFormat("id-ID").format(n);
}

// ICONS
function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /></svg>
  );
}

function InboxIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></svg>
  );
}
