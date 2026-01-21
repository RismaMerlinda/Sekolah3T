"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

/* ================= TYPES ================= */

type School = {
  id: string;
  schoolName: string;
  npsn: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
};

type OfficialSchool = {
  npsn?: string;
  nama?: string;
  namaSekolah?: string;
  satuanPendidikan?: string;
  alamat?: string;
  kabupaten?: string;
  kota?: string;
  provinsi?: string;
  kecamatan?: string;
};

const API_BASE = "http://localhost:5000";

/* ================= PAGE ================= */

export default function AdminDashboardPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [query, setQuery] = useState("");

  // ✅ SEARCH NPSN API
  const [npsn, setNpsn] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState<boolean | null>(null);
  const [officialSchool, setOfficialSchool] = useState<OfficialSchool | null>(
    null
  );

  // ✅ CRUD modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<School | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    schoolName: "",
    npsn: "",
    email: "",
    isVerified: false,
  });

  // ✅ Guard login
  useEffect(() => {
    const ok = localStorage.getItem("admin_auth") === "true";
    if (!ok) window.location.href = "/admin";
  }, []);

  // ✅ Load data
  useEffect(() => {
    fetchSchools();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchSchools() {
    try {
      const res = await fetch(`${API_BASE}/api/schools`, { cache: "no-store" });
      if (!res.ok) throw new Error("Gagal ambil data");
      const data = await res.json();
      const mapped: School[] = (Array.isArray(data) ? data : []).map(
        (x: any) => ({
          id: x._id,
          schoolName: x.schoolName,
          npsn: x.npsn,
          email: x.email,
          isVerified: Boolean(x.isVerified),
          createdAt: x.createdAt,
        })
      );
      setSchools(mapped);
    } catch {
      setSchools([]);
    }
  }

  /* ================= CRUD HANDLERS ================= */

  function openEdit(s: School) {
    setSelected(s);
    setForm({
      schoolName: s.schoolName,
      npsn: s.npsn,
      email: s.email,
      isVerified: s.isVerified,
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setSelected(null);
  }

  async function updateSchool() {
    if (!selected) return;
    if (!form.schoolName.trim() || !form.npsn.trim() || !form.email.trim()) {
      alert("Wajib diisi semua.");
      return;
    }
    setSaving(true);
    try {
      await fetch(`${API_BASE}/api/schools/${selected.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      closeModal();
      await fetchSchools();
    } catch {
      alert("Gagal update");
    } finally {
      setSaving(false);
    }
  }

  async function deleteSchool(id: string) {
    if (!confirm("Yakin hapus?")) return;
    try {
      await fetch(`${API_BASE}/api/schools/${id}`, { method: "DELETE" });
      await fetchSchools();
    } catch {
      alert("Gagal hapus");
    }
  }

  /* ================= VERIFICATION API ================= */

  const verifySchool = async (npsnValue: string) => {
    const clean = (npsnValue || "").trim();
    if (!clean) {
      setVerified(null);
      return;
    }
    setVerifying(true);
    setVerified(null);
    setOfficialSchool(null);
    try {
      const res = await fetch(
        `https://api.fazriansyah.eu.org/v1/sekolah?npsn=${encodeURIComponent(
          clean
        )}`
      );
      const json = await res.json();
      if (json?.data?.satuanPendidikan) {
        setVerified(true);
        setOfficialSchool({
          satuanPendidikan:
            json.data.satuanPendidikan?.nama ??
            json.data.satuanPendidikan?.namaSekolah,
          npsn: json.data.satuanPendidikan?.npsn ?? clean,
          alamat: json.data.satuanPendidikan?.alamat,
          kecamatan: json.data.satuanPendidikan?.kecamatan,
          kabupaten: json.data.satuanPendidikan?.kabupaten,
          kota: json.data.satuanPendidikan?.kota,
          provinsi: json.data.satuanPendidikan?.provinsi,
          nama: json.data.satuanPendidikan?.nama,
          namaSekolah: json.data.satuanPendidikan?.namaSekolah,
        });
      } else {
        setVerified(false);
      }
    } catch {
      setVerified(false);
    } finally {
      setVerifying(false);
    }
  };

  /* ================= COMPUTED ================= */

  const stats = useMemo(() => {
    const verifiedCount = schools.filter((s) => s.isVerified).length;
    const pendingCount = schools.filter((s) => !s.isVerified).length;
    const total = schools.length;
    return { verifiedCount, pendingCount, total };
  }, [schools]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return schools;
    return schools.filter((s) => {
      return (
        s.schoolName.toLowerCase().includes(q) ||
        s.npsn.toLowerCase().includes(q)
        // s.email.toLowerCase().includes(q)
      );
    });
  }, [schools, query]);

  const officialName =
    officialSchool?.satuanPendidikan ||
    officialSchool?.namaSekolah ||
    officialSchool?.nama ||
    "-";

  const officialLocation = [
    officialSchool?.kecamatan,
    officialSchool?.kabupaten || officialSchool?.kota,
    officialSchool?.provinsi,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="flex flex-col h-full">
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

        {/* VERIFIKASI NPSN (Optional Bar) */}
        <div className="border-t border-[#B2F5EA] bg-[#E6FFFA]/30 px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
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
      <main className="p-4 sm:p-6 lg:p-8 flex-1 space-y-6 animate-fade-in">

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          <StatCard
            title="Total Sekolah"
            value={stats.total}
            icon={<SchoolIcon />}
            gradient="from-[#0F2F2E] to-[#1A4D4A]"
          />
          <StatCard
            title="Terverifikasi"
            value={stats.verifiedCount}
            icon={<CheckCircleIcon />}
            gradient="from-[#22C55E] to-[#16A34A]" // Green
          />
          <StatCard
            title="Menunggu"
            value={stats.pendingCount}
            icon={<ClockIcon />}
            gradient="from-[#F59E0B] to-[#D97706]" // Orange
          />
        </div>

        {/* Table Card */}
        <div className="rounded-[2.5rem] bg-white/60 backdrop-blur-xl border border-[#B2F5EA] shadow-xl shadow-[#40E0D0]/5 overflow-hidden flex flex-col">
          <div className="px-8 py-6 border-b border-[#B2F5EA]/50 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-extrabold text-[#0F2F2E]">Data Sekolah</h2>
              <p className="text-sm text-[#6B8E8B] font-medium">Berdasarkan data yang masuk</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            {schools.length === 0 ? (
              <div className="p-12 text-center">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-[#E6FFFA] flex items-center justify-center text-[#40E0D0] mb-4">
                  <InboxIcon />
                </div>
                <div className="text-lg font-bold text-[#0F2F2E]">Belum ada data</div>
                <p className="text-[#6B8E8B]">Data sekolah yang masuk akan muncul di sini.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#E6FFFA]/50 text-[#0F2F2E] text-xs uppercase tracking-wider font-bold border-b border-[#B2F5EA]">
                    <th className="px-6 py-4 w-16 text-center">No</th>
                    <th className="px-6 py-4">Nama Sekolah</th>
                    <th className="px-6 py-4">NPSN</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#B2F5EA]/30 text-sm">
                  {filtered.map((s, i) => (
                    <tr key={s.id} className="hover:bg-[#E6FFFA]/40 transition group">
                      <td className="px-6 py-4 text-center text-[#6B8E8B] font-medium">{i + 1}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#0F2F2E]">{s.schoolName}</div>
                        <div className="text-xs text-[#6B8E8B]">{s.email}</div>
                      </td>
                      <td className="px-6 py-4 font-mono text-[#4A6F6C]">{s.npsn}</td>
                      <td className="px-6 py-4">
                        {s.isVerified ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E6FFFA] text-[#0F2F2E] border border-[#B2F5EA]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#40E0D0]" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => openEdit(s)}
                          className="text-[#6B8E8B] hover:text-[#0F2F2E] font-bold text-xs bg-white border border-[#B2F5EA] px-3 py-2 rounded-xl hover:shadow-sm transition mr-2"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </main>

      {/* EDIT MODAL */}
      {modalOpen && selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0F2F2E]/40 backdrop-blur-sm animate-fade-in" onClick={closeModal} />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-slide-down">
            <div className="px-8 py-6 border-b border-[#F3F4F6] bg-[#FAFAFA]">
              <h3 className="text-xl font-extrabold text-[#0F2F2E]">Edit Data</h3>
              <p className="text-sm text-[#6B8E8B]">Perbarui informasi sekolah.</p>
            </div>

            <div className="p-8 space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#6B8E8B] mb-1.5 uppercase">Nama Sekolah</label>
                <input
                  value={form.schoolName}
                  onChange={e => setForm({ ...form, schoolName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white font-medium text-[#0F2F2E] focus:ring-2 focus:ring-[#40E0D0] outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#6B8E8B] mb-1.5 uppercase">NPSN</label>
                  <input
                    value={form.npsn}
                    onChange={e => setForm({ ...form, npsn: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white font-medium text-[#0F2F2E] focus:ring-2 focus:ring-[#40E0D0] outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#6B8E8B] mb-1.5 uppercase">Status</label>
                  <label className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#E5E7EB] cursor-pointer hover:bg-[#FAFAFA] transition">
                    <input
                      type="checkbox"
                      checked={form.isVerified}
                      onChange={e => setForm({ ...form, isVerified: e.target.checked })}
                      className="w-5 h-5 accent-[#0F2F2E] rounded"
                    />
                    <span className="text-sm font-bold text-[#0F2F2E]">Verified</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6B8E8B] mb-1.5 uppercase">Email</label>
                <input
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white font-medium text-[#0F2F2E] focus:ring-2 focus:ring-[#40E0D0] outline-none transition"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 py-3.5 rounded-xl font-bold text-[#6B8E8B] hover:bg-[#F3F4F6] transition"
                >
                  Batal
                </button>
                <button
                  onClick={updateSchool}
                  disabled={saving}
                  className="flex-1 py-3.5 rounded-xl font-bold text-white bg-[#0F2F2E] hover:bg-[#1A4D4A] shadow-lg shadow-[#0F2F2E]/20 transition disabled:opacity-70"
                >
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

/* ================= COMPONENT ================= */

function StatCard({ title, value, icon, gradient }: any) {
  return (
    <div className={`relative overflow-hidden rounded-[2rem] p-6 text-white shadow-xl shadow-gray-200/50 bg-gradient-to-br ${gradient}`}>
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <div className="text-white/80 font-bold text-sm mb-1">{title}</div>
          <div className="text-4xl font-black tracking-tight">{value}</div>
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

/* ================= ICONS ================= */

function SearchIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
}
function NpsnIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4" /><path d="M14 2v6h6" /><path d="M3 15h6" /><path d="M3 18h6" /><path d="M3 12h6" /></svg>
}
function CheckIconSmall() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
}
function SpinnerIcon() {
  return <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
}
function SchoolIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m4 6 8-4 8 4" /><path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2" /><path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4" /><path d="M18 5v17" /><path d="M6 5v17" /></svg>
}
function CheckCircleIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
}
function ClockIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
}
function InboxIcon() {
  return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></svg>
}
