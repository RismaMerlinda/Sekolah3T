"use client";

import { useEffect, useMemo, useState } from "react";

type SchoolStatus = "approved" | "pending" | "rejected";

type School = {
  id: string;
  namaSekolah: string;
  npsn: string;
  lokasi: string;
  status: SchoolStatus;
  createdAt: string;
};

const LS_KEY = "school_submissions";

export default function AdminVerifikasiPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [search, setSearch] = useState("");

  // ✅ Guard login
  useEffect(() => {
    const ok = localStorage.getItem("admin_auth") === "true";
    if (!ok) window.location.href = "/admin";
  }, []);

  // ✅ Load data
  useEffect(() => {
    loadSchools();
    const onFocus = () => loadSchools();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  function loadSchools() {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return setSchools([]);
    try {
      const parsed = JSON.parse(raw);
      setSchools(Array.isArray(parsed) ? parsed : []);
    } catch {
      setSchools([]);
    }
  }

  function updateStatus(id: string, status: SchoolStatus) {
    const next = schools.map((s) => (s.id === id ? { ...s, status } : s));
    setSchools(next);
    localStorage.setItem(LS_KEY, JSON.stringify(next));
  }

  const pendingList = useMemo(() => {
    const q = search.trim().toLowerCase();
    const base = schools.filter((s) => s.status === "pending");
    if (!q) return base;

    return base.filter((s) => {
      return (
        s.namaSekolah.toLowerCase().includes(q) ||
        s.npsn.toLowerCase().includes(q) ||
        s.lokasi.toLowerCase().includes(q)
      );
    });
  }, [schools, search]);

  return (
    <div className="flex flex-col min-h-screen animate-fade-in">
      {/* TOPBAR */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-[#B2F5EA]">
        <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-xs font-bold text-[#6B8E8B] uppercase tracking-wider">Verifikasi</div>
            <h1 className="text-2xl font-extrabold text-[#0F2F2E] tracking-tight">
              Verifikasi Sekolah
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
                placeholder="Cari nama / NPSN / lokasi..."
                className="w-full rounded-2xl border border-[#B2F5EA] bg-white/50 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#40E0D0] focus:bg-white focus:ring-4 focus:ring-[#40E0D0]/10 transition-all font-medium text-[#0F2F2E] placeholder:text-[#6B8E8B]/70"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-[1600px] mx-auto w-full">
        <div className="rounded-[2.5rem] bg-white/60 backdrop-blur-xl border border-[#B2F5EA] shadow-xl shadow-[#40E0D0]/5 overflow-hidden flex flex-col min-h-[400px]">
          <div className="px-8 py-6 border-b border-[#B2F5EA]/50">
            <h2 className="text-lg font-extrabold text-[#0F2F2E]">
              Antrian Verifikasi
            </h2>
            <p className="text-sm text-[#6B8E8B] font-medium mt-1">
              Verifikasi Sekolah <span className="font-bold text-[#0F2F2E]">Menunggu</span> Adanya Pengajuan Pengalanggan Dana.
            </p>
          </div>

          <div className="flex-1">
            {pendingList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#E6FFFA] flex items-center justify-center text-[#40E0D0] mb-4">
                  <InboxIcon />
                </div>
                <div className="text-lg font-bold text-[#0F2F2E]">
                  Belum ada antrian
                </div>
                <p className="mt-2 text-sm text-[#6B8E8B] max-w-sm">
                  Saat sekolah mengajukan penggalangan dana, data akan muncul di halaman ini.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#E6FFFA]/50 text-[#0F2F2E] text-xs uppercase tracking-wider font-bold border-b border-[#B2F5EA]">
                      <th className="px-6 py-4 w-16 text-center">No</th>
                      <th className="px-6 py-4">Nama Sekolah</th>
                      <th className="px-6 py-4">NPSN</th>
                      <th className="px-6 py-4">Lokasi</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#B2F5EA]/30 text-sm">
                    {pendingList.map((s, idx) => (
                      <tr
                        key={s.id}
                        className="hover:bg-[#E6FFFA]/40 transition group"
                      >
                        <td className="px-6 py-4 text-center text-[#6B8E8B] font-medium">{idx + 1}</td>

                        <td className="px-6 py-4 font-bold text-[#0F2F2E]">
                          {s.namaSekolah}
                        </td>

                        <td className="px-6 py-4 font-mono text-[#4A6F6C]">{s.npsn}</td>

                        <td className="px-6 py-4 text-[#4A6F6C]">
                          {s.lokasi}
                        </td>

                        <td className="px-6 py-4">
                          <StatusPill status="pending" />
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => updateStatus(s.id, "approved")}
                              className="rounded-xl px-3 py-1.5 text-xs font-bold
                                         bg-[#22C55E] text-white shadow-lg shadow-[#22C55E]/20
                                         hover:scale-105 transition"
                              type="button"
                            >
                              Setujui
                            </button>
                            <button
                              onClick={() => updateStatus(s.id, "rejected")}
                              className="rounded-xl px-3 py-1.5 text-xs font-bold
                                         bg-white border border-[#EF4444] text-[#EF4444]
                                         hover:bg-[#EF4444] hover:text-white transition"
                              type="button"
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

          <div className="px-8 py-4 bg-[#FAFAFA] border-t border-[#B2F5EA]/50 text-xs text-[#6B8E8B] font-medium">
            Data local: <code className="px-1.5 py-0.5 rounded bg-white border border-[#B2F5EA]">{LS_KEY}</code>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ===== UI Components ===== */

function StatusPill({ status }: { status: SchoolStatus }) {
  const map: Record<SchoolStatus, { label: string; cls: string }> = {
    approved: { label: "Disetujui", cls: "bg-[#22C55E]/10 border-[#22C55E]/25 text-[#15803D]" },
    pending: { label: "Menunggu", cls: "bg-[#F59E0B]/10 border-[#F59E0B]/25 text-[#B45309]" },
    rejected: { label: "Ditolak", cls: "bg-[#EF4444]/10 border-[#EF4444]/25 text-[#B91C1C]" },
  };
  const v = map[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border ${v.cls}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'pending' ? 'bg-[#F59E0B]' : status === 'approved' ? 'bg-[#22C55E]' : 'bg-[#EF4444]'}`} />
      {v.label}
    </span>
  );
}

/* ===== Icons ===== */

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
