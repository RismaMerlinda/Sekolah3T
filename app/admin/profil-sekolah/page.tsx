"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/* ================= TYPES ================= */

type SchoolSubmission = {
  // ini bisa kamu sesuaikan nanti sama response backend
  npsn: string;
  namaSekolah?: string;
  jenjang?: string; // SD/SMP/SMA/SMK
  statusSekolah?: string; // Negeri/Swasta
  alamat?: string;
  provinsi?: string;
  kabupaten?: string;
  kecamatan?: string;

  kepalaSekolah?: string;
  email?: string;
  telp?: string;

  // dokumen pendukung (opsional)
  dokumenUrl?: string;

  submittedAt?: string; // ISO
};

type VerifyStatus = "menunggu" | "terverifikasi" | "ditolak";

/* ================= PAGE ================= */

export default function AdminVerifikasiSekolahDetailPage() {
  const router = useRouter();
  const sp = useSearchParams();

  // route contoh: /admin/profil-sekolah/detail?npsn=222140
  const npsnFromUrl = (sp.get("npsn") || "").trim();

  const [loading, setLoading] = useState(false);

  // data pengajuan (kosong dulu, nanti backend)
  const [submission, setSubmission] = useState<SchoolSubmission | null>(null);

  // verifikasi admin
  const [status, setStatus] = useState<VerifyStatus>("menunggu");
  const [catatan, setCatatan] = useState("");

  // hasil cek NPSN (nanti backend)
  const [npsnCheck, setNpsnCheck] = useState<
    | { state: "idle" }
    | { state: "checking" }
    | { state: "found"; message: string }
    | { state: "not_found"; message: string }
    | { state: "error"; message: string }
  >({ state: "idle" });

  /* ================= EFFECTS ================= */

  // ✅ Guard login
  useEffect(() => {
    const ok = localStorage.getItem("admin_auth") === "true";
    if (!ok) window.location.href = "/admin";
  }, []);

  // ✅ load data pengajuan (sementara kosong, nanti backend)
  useEffect(() => {
    if (!npsnFromUrl) return;

    // TODO BACKEND:
    // fetch(`/api/admin/verifikasi-sekolah?npsn=${encodeURIComponent(npsnFromUrl)}`)
    //  -> setSubmission(data)
    //  -> setStatus(data.verifyStatus) dll

    // sementara: kosong (tidak pakai dummy)
    setSubmission(null);
    setStatus("menunggu");
    setCatatan("");
  }, [npsnFromUrl]);

  /* ================= HANDLERS ================= */

  async function checkNpsn() {
    if (!npsnFromUrl) return;
    setNpsnCheck({ state: "checking" });

    try {
      // TODO BACKEND:
      // const res = await fetch(`/api/admin/cek-npsn?npsn=${encodeURIComponent(npsnFromUrl)}`);
      // const json = await res.json();
      // if (json.exists) setNpsnCheck({ state: "found", message: "NPSN terdaftar." })
      // else setNpsnCheck({ state: "not_found", message: "NPSN tidak ditemukan." })

      // sementara: belum backend
      await new Promise((r) => setTimeout(r, 300));
      setNpsnCheck({
        state: "error",
        message: "Backend belum terhubung. Nanti tombol ini akan cek NPSN beneran.",
      });
    } catch {
      setNpsnCheck({ state: "error", message: "Gagal cek NPSN. Coba lagi." });
    }
  }

  async function saveVerification(next: VerifyStatus) {
    if (!npsnFromUrl) return;
    setLoading(true);
    try {
      // TODO BACKEND:
      // await fetch("/api/admin/verifikasi-sekolah", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ npsn: npsnFromUrl, status: next, catatan }),
      // });

      // sementara: cuma set state (tanpa dummy storage)
      await new Promise((r) => setTimeout(r, 300));
      setStatus(next);
    } finally {
      setLoading(false);
    }
  }

  const statusLabel = useMemo(() => {
    if (status === "menunggu") return "Menunggu Verifikasi";
    if (status === "terverifikasi") return "Terverifikasi";
    return "Ditolak";
  }, [status]);

  const statusPillClass = useMemo(() => {
    if (status === "menunggu")
      return "bg-[#F59E0B]/10 text-[#B45309] border-[#F59E0B]/25"; // Orange
    if (status === "terverifikasi")
      return "bg-[#22C55E]/10 text-[#15803D] border-[#22C55E]/25"; // Green
    return "bg-[#EF4444]/10 text-[#B91C1C] border-[#EF4444]/25"; // Red
  }, [status]);

  /* ================= GUARDS ================= */

  if (!npsnFromUrl) {
    return (
      <div className="min-h-screen p-6 animate-fade-in">
        <div className="max-w-xl mx-auto rounded-[2rem] bg-white/80 backdrop-blur-xl border border-[#B2F5EA] p-8 text-center shadow-xl shadow-[#40E0D0]/5">
          <div className="text-xl font-extrabold text-[#0F2F2E] mb-2">
            NPSN belum dipilih
          </div>
          <p className="text-sm text-[#6B8E8B] mb-6">
            Silakan kembali ke halaman Verifikasi dan pilih sekolah yang ingin di cek.
          </p>
          <button
            onClick={() => router.push("/admin/verifikasi")}
            className="rounded-xl px-6 py-3 text-sm font-bold bg-[#0F2F2E] text-white hover:bg-[#1A4D4A] transition shadow-lg shadow-[#0F2F2E]/20"
            type="button"
          >
            Kembali ke Verifikasi
          </button>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="flex flex-col min-h-screen animate-fade-in">
      {/* TOPBAR */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-[#B2F5EA]">
        <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-[#6B8E8B] uppercase tracking-wider">Verifikasi</div>
            <h1 className="text-2xl font-extrabold text-[#0F2F2E] tracking-tight">
              Detail Verifikasi Sekolah
            </h1>
          </div>

          <button
            onClick={() => router.push("/admin/verifikasi")}
            className="rounded-xl px-4 py-2.5 text-sm font-bold
                        border border-[#B2F5EA] bg-white text-[#0F2F2E] hover:bg-[#E6FFFA] transition"
            type="button"
          >
            Kembali
          </button>
        </div>
      </header>

      {/* CONTENT */}
      <main className="p-4 sm:p-6 lg:p-8 flex-1 space-y-6 max-w-[1600px] mx-auto w-full">
        {/* Header card */}
        <div className="rounded-[2.5rem] bg-white/60 backdrop-blur-xl border border-[#B2F5EA] shadow-xl shadow-[#40E0D0]/5 p-8">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-[#6B8E8B] mb-1">
                NPSN
              </div>
              <div className="text-3xl font-black text-[#0F2F2E] tracking-tight">
                {npsnFromUrl}
              </div>
              <div className="mt-2 text-lg font-medium text-[#4A6F6C]">
                {submission?.namaSekolah ? submission.namaSekolah : "(Nama sekolah akan muncul)"}
              </div>
            </div>

            <div className="flex flex-col sm:items-end gap-3">
              <div
                className={`inline-flex items-center justify-center rounded-full px-4 py-1.5 text-sm font-bold border ${statusPillClass}`}
              >
                <span className={`w-2 h-2 rounded-full mr-2 ${status === 'menunggu' ? 'bg-[#F59E0B]' : status === 'terverifikasi' ? 'bg-[#22C55E]' : 'bg-[#EF4444]'}`} />
                {statusLabel}
              </div>

              <button
                type="button"
                onClick={checkNpsn}
                className="rounded-xl px-5 py-2.5 text-sm font-bold
                              bg-[#0F2F2E] text-white hover:bg-[#1A4D4A] transition shadow-lg shadow-[#0F2F2E]/20"
              >
                Cek Validitas NPSN
              </button>
            </div>
          </div>

          {npsnCheck.state !== "idle" && (
            <div className="mt-6">
              <div
                className={
                  "rounded-xl border px-4 py-3 text-sm font-medium inline-block " +
                  (npsnCheck.state === "found"
                    ? "bg-[#DCFCE7] border-[#22C55E]/30 text-[#166534]"
                    : npsnCheck.state === "not_found"
                      ? "bg-[#FEE2E2] border-[#EF4444]/30 text-[#991B1B]"
                      : "bg-white border-[#B2F5EA] text-[#4A6F6C]")
                }
              >
                {npsnCheck.state === "checking"
                  ? "Sedang mengecek NPSN..."
                  : npsnCheck.message}
              </div>
            </div>
          )}
        </div>

        {/* GRID */}
        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          {/* KIRI: Data Sekolah */}
          <div className="space-y-6">
            <SectionCard title="Data Sekolah">
              <div className="grid gap-6 sm:grid-cols-2 text-sm">
                <Info label="Nama Sekolah" value={submission?.namaSekolah} />
                <Info label="Jenjang" value={submission?.jenjang} />
                <Info label="Status Sekolah" value={submission?.statusSekolah} />
                <Info label="Alamat" value={submission?.alamat} wide />
                <Info label="Provinsi" value={submission?.provinsi} />
                <Info label="Kabupaten/Kota" value={submission?.kabupaten} />
                <Info label="Kecamatan" value={submission?.kecamatan} />
              </div>

              {!submission && (
                <EmptyNote text="Belum ada data sekolah ditampilkan. Nanti setelah backend jalan, isi dari API akan muncul di sini." />
              )}
            </SectionCard>

            <SectionCard title="Kontak & Penanggung Jawab">
              <div className="grid gap-6 sm:grid-cols-2 text-sm">
                <Info label="Kepala Sekolah" value={submission?.kepalaSekolah} />
                <Info label="Email" value={submission?.email} />
                <Info label="Telepon" value={submission?.telp} />
                <Info label="Dokumen Pendukung" value={submission?.dokumenUrl ? "Tersedia" : undefined} />
              </div>

              {submission?.dokumenUrl ? (
                <div className="mt-6">
                  <a
                    href={submission.dokumenUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold
                                border border-[#B2F5EA] bg-white text-[#0F2F2E] hover:bg-[#E6FFFA] transition"
                  >
                    <DocIcon />
                    Lihat Dokumen
                  </a>
                </div>
              ) : (
                <EmptyNote text="Dokumen pendukung belum ada." />
              )}
            </SectionCard>
          </div>

          {/* KANAN: Panel Verifikasi */}
          <div className="space-y-6">
            <div className="rounded-[2.5rem] bg-white/60 backdrop-blur-xl border border-[#B2F5EA] shadow-xl shadow-[#40E0D0]/5 overflow-hidden p-6 sticky top-24">
              <div className="mb-4">
                <h3 className="text-lg font-extrabold text-[#0F2F2E]">Keputusan</h3>
                <p className="text-xs text-[#6B8E8B]">Tentukan status verifikasi sekolah ini.</p>
              </div>

              <div className="bg-white/50 rounded-2xl p-4 border border-[#B2F5EA]/50 space-y-3">
                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${status === 'terverifikasi' ? 'bg-[#DCFCE7] border-[#22C55E] ring-1 ring-[#22C55E]' : 'bg-white border-[#E5E7EB] hover:border-[#B2F5EA]'}`}>
                  <input
                    type="radio"
                    name="verify"
                    className="accent-[#16A34A] w-4 h-4"
                    checked={status === "terverifikasi"}
                    onChange={() => setStatus("terverifikasi")}
                  />
                  <div className="flex-1">
                    <span className="block text-sm font-bold text-[#0F2F2E]">Terverifikasi</span>
                    <span className="block text-xs text-[#6B8E8B]">Data valid & lengkap</span>
                  </div>
                </label>

                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${status === 'ditolak' ? 'bg-[#FEE2E2] border-[#EF4444] ring-1 ring-[#EF4444]' : 'bg-white border-[#E5E7EB] hover:border-[#B2F5EA]'}`}>
                  <input
                    type="radio"
                    name="verify"
                    className="accent-[#DC2626] w-4 h-4"
                    checked={status === "ditolak"}
                    onChange={() => setStatus("ditolak")}
                  />
                  <div className="flex-1">
                    <span className="block text-sm font-bold text-[#0F2F2E]">Ditolak</span>
                    <span className="block text-xs text-[#6B8E8B]">Data tidak sesuai</span>
                  </div>
                </label>

                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${status === 'menunggu' ? 'bg-[#FEF3C7] border-[#F59E0B] ring-1 ring-[#F59E0B]' : 'bg-white border-[#E5E7EB] hover:border-[#B2F5EA]'}`}>
                  <input
                    type="radio"
                    name="verify"
                    className="accent-[#D97706] w-4 h-4"
                    checked={status === "menunggu"}
                    onChange={() => setStatus("menunggu")}
                  />
                  <div className="flex-1">
                    <span className="block text-sm font-bold text-[#0F2F2E]">Menunggu</span>
                    <span className="block text-xs text-[#6B8E8B]">Belum diputuskan</span>
                  </div>
                </label>
              </div>

              <div className="mt-6">
                <div className="text-sm font-bold text-[#0F2F2E] mb-2">
                  Catatan Admin
                </div>
                <textarea
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Tulis alasan atau catatan tambahan..."
                  className="w-full min-h-[120px] rounded-2xl border border-[#B2F5EA]
                              bg-white/80 p-4 text-sm outline-none focus:ring-2 focus:ring-[#40E0D0] transition"
                />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => saveVerification(status)}
                  className="col-span-2 rounded-xl py-3 text-sm font-bold
                              bg-[#0F2F2E] text-white hover:bg-[#1A4D4A] shadow-lg shadow-[#0F2F2E]/20 transition disabled:opacity-70"
                >
                  {loading ? "Menyimpan..." : "Simpan Keputusan"}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push("/admin/verifikasi")}
              className="w-full rounded-2xl px-4 py-4 text-sm font-bold text-[#6B8E8B]
                          hover:bg-[#E6FFFA] hover:text-[#0F2F2E] transition border border-dashed border-[#B2F5EA]"
            >
              Kembali ke List
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ================= UI PIECES ================= */

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[2.5rem] bg-white/60 backdrop-blur-xl border border-[#B2F5EA] shadow-xl shadow-[#40E0D0]/5 overflow-hidden">
      <div className="px-8 py-6 border-b border-[#B2F5EA]/50 bg-white/40">
        <div className="text-lg font-extrabold text-[#0F2F2E]">{title}</div>
      </div>
      <div className="p-8">{children}</div>
    </div>
  );
}

function Info({
  label,
  value,
  wide,
}: {
  label: string;
  value?: string | number;
  wide?: boolean;
}) {
  const isEmpty = value === undefined || value === null || value === "";
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <div className="text-xs font-bold text-[#6B8E8B] uppercase tracking-wider mb-2">{label}</div>
      <div className={"rounded-xl border px-4 py-3 text-sm font-medium transition " + (isEmpty
        ? "border-dashed border-[#B2F5EA] bg-transparent text-[#9CA3AF]"
        : "border-[#B2F5EA] bg-white text-[#0F2F2E]")}>
        {isEmpty ? "Belum diisi" : String(value)}
      </div>
    </div>
  );
}

function EmptyNote({ text }: { text: string }) {
  return (
    <div className="mt-2 rounded-2xl border border-dashed border-[#B2F5EA] bg-[#E6FFFA]/30 p-4 text-sm text-[#4A6F6C] font-medium text-center">
      {text}
    </div>
  );
}

/* ================= ICONS ================= */

function DocIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg>
  );
}
