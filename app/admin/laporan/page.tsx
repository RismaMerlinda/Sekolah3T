"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

/* ================= TYPES ================= */

type UsageItem = {
  tanggal: string;
  kategori: string;
  deskripsi: string;
  jumlah: number;
  buktiUrl?: string;
};

type UsageReport = {
  id: string;
  schoolId: string;
  namaSekolah: string;
  npsn: string;
  lokasi: string;
  submittedAt: string;
  items: UsageItem[];
};

/* ================= CONFIG ================= */

// ✅ Default: KOSONG (backend belum jalan)
const USE_LOCAL_STORAGE = false;

// localStorage key (kalau nanti mau test)
const LS_USAGE_KEY = "school_usage_reports";

/* ================= PAGE ================= */

export default function AdminLaporanPage() {
  const router = useRouter();

  const [reports, setReports] = useState<UsageReport[]>([]);
  const [query, setQuery] = useState("");

  // ✅ Guard login
  useEffect(() => {
    const ok = localStorage.getItem("admin_auth") === "true";
    if (!ok) window.location.href = "/admin";
  }, []);

  // ✅ Load laporan
  useEffect(() => {
    loadReports();
    const onFocus = () => loadReports();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function loadReports() {
    // ✅ default kosong dulu sampai backend ada
    if (!USE_LOCAL_STORAGE) {
      setReports([]);
      return;
    }

    // --- kalau mau test localStorage, set USE_LOCAL_STORAGE = true ---
    const raw = localStorage.getItem(LS_USAGE_KEY);
    if (!raw) return setReports([]);

    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return setReports([]);

      const cleaned: UsageReport[] = parsed
        .map((x: any) => ({
          id: String(x?.id ?? ""),
          schoolId: String(x?.schoolId ?? ""),
          namaSekolah: String(x?.namaSekolah ?? ""),
          npsn: String(x?.npsn ?? ""),
          lokasi: String(x?.lokasi ?? ""),
          submittedAt: String(x?.submittedAt ?? ""),
          items: Array.isArray(x?.items) ? x.items : [],
        }))
        .filter((x) => x.id);

      setReports(cleaned);
    } catch {
      setReports([]);
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return reports;
    return reports.filter((r) => {
      return (
        r.namaSekolah.toLowerCase().includes(q) ||
        r.npsn.toLowerCase().includes(q) ||
        r.lokasi.toLowerCase().includes(q)
      );
    });
  }, [reports, query]);

  return (
    <div className="flex flex-col min-h-screen animate-fade-in">
      {/* TOPBAR */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-[#B2F5EA]">
        <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-xs font-bold text-[#6B8E8B] uppercase tracking-wider">Laporan</div>
            <h1 className="text-2xl font-extrabold text-[#0F2F2E] tracking-tight">
              Laporan Penggunaan Dana
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
                placeholder="Cari sekolah / NPSN / lokasi..."
                className="w-full rounded-2xl border border-[#B2F5EA] bg-white/50 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#40E0D0] focus:bg-white focus:ring-4 focus:ring-[#40E0D0]/10 transition-all font-medium text-[#0F2F2E] placeholder:text-[#6B8E8B]/70"
              />
            </div>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-[1600px] mx-auto w-full">
        <div className="rounded-[2.5rem] bg-white/60 backdrop-blur-xl border border-[#B2F5EA] shadow-xl shadow-[#40E0D0]/5 overflow-hidden flex flex-col min-h-[400px]">
          <div className="px-8 py-6 border-b border-[#B2F5EA]/50">
            <h2 className="text-lg font-extrabold text-[#0F2F2E]">
              Daftar Laporan Masuk
            </h2>
            <p className="text-sm text-[#6B8E8B] font-medium mt-1">
              Kelola dan tinjau laporan penggunaan dana dari sekolah-sekolah
            </p>
          </div>

          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#E6FFFA] flex items-center justify-center text-[#40E0D0] mb-4">
                  <InboxIcon />
                </div>
                <div className="text-lg font-bold text-[#0F2F2E]">
                  Belum ada laporan
                </div>
                <p className="mt-2 text-sm text-[#6B8E8B] max-w-sm">
                  Laporan penggunaan dana yang dikirim sekolah akan muncul di sini.
                </p>
                <button
                  className="mt-6 rounded-xl px-6 py-3 text-sm font-bold
                               bg-[#0F2F2E] text-white/50 cursor-not-allowed"
                  type="button"
                  disabled
                >
                  Menunggu Data Masuk
                </button>
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
                      <th className="px-6 py-4">Rincian</th>
                      <th className="px-6 py-4">Total</th>
                      <th className="px-6 py-4">Tanggal</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#B2F5EA]/30 text-sm">
                    {filtered.map((r, idx) => {
                      const total = r.items.reduce((a, b) => a + (b.jumlah || 0), 0);
                      return (
                        <tr
                          key={r.id}
                          className="hover:bg-[#E6FFFA]/40 transition group"
                        >
                          <td className="px-6 py-4 text-center text-[#6B8E8B] font-medium">{idx + 1}</td>
                          <td className="px-6 py-4 font-bold text-[#0F2F2E]">
                            {r.namaSekolah}
                          </td>
                          <td className="px-6 py-4 font-mono text-[#4A6F6C]">{r.npsn}</td>
                          <td className="px-6 py-4 text-[#4A6F6C]">{r.lokasi}</td>
                          <td className="px-6 py-4 font-medium">{r.items.length} item</td>
                          <td className="px-6 py-4 font-bold text-[#0F2F2E]">
                            {formatRupiah(total)}
                          </td>
                          <td className="px-6 py-4 text-[#4A6F6C]">
                            {formatDateTime(r.submittedAt)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              type="button"
                              onClick={() =>
                                router.push(`/admin/detail?id=${encodeURIComponent(r.id)}`)
                              }
                              className="rounded-xl px-3 py-1.5 text-xs font-bold
                                          bg-[#E6FFFA] text-[#0F2F2E]
                                          border border-[#B2F5EA] hover:shadow-md transition"
                            >
                              Detail
                            </button>
                          </td>
                        </tr>
                      );
                    })}
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

/* ================= HELPERS ================= */

function formatRupiah(n: number) {
  if (!Number.isFinite(n)) return "Rp0";
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

/* ================= ICONS ================= */

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
