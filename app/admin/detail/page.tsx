"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import {
  ArrowLeft, Check, X, FileText, Image as ImageIcon,
  MapPin, Phone, User as UserIcon, Calendar, DollarSign, Tag, Info,
  AlertCircle, ExternalLink
} from "lucide-react";

/* ================= TYPES ================= */

type Proposal = {
  _id: string;
  title: string;
  category: string;
  region: string;
  description: string;
  schoolName: string;
  npsn: string;
  contactPhone: string;
  principalName: string;
  schoolAddress: string;
  principalAddress: string;
  background: string;
  purpose: string;
  benefits: string;
  targetAmount: number;
  startDate: string;
  endDate: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  files?: {
    schoolCertificate?: string;
    proposalDoc?: string;
    schoolPhoto?: string[];
    budgetPlan?: string;
  };
};

/* ================= PAGE ================= */

export default function AdminDetailPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const id = sp.get("id");

  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);

  // Guard login
  useEffect(() => {
    const ok = localStorage.getItem("admin_auth") === "true";
    if (!ok) window.location.href = "/admin";
  }, []);

  // Load Proposal by ID
  useEffect(() => {
    if (!id) return;
    fetchProposal();
  }, [id]);

  async function fetchProposal() {
    setLoading(true);
    try {
      const res = await api.get(`/proposals/admin/${id}`);
      setProposal(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat detail pengajuan");
    } finally {
      setLoading(false);
    }
  }

  async function updateProposalStatus(nextStatus: 'approved' | 'rejected') {
    if (!id) return;
    const action = nextStatus === 'approved' ? 'menyetujui' : 'menolak';
    if (!confirm(`Yakin ingin ${action} pengajuan ini?`)) return;

    try {
      await api.put(`/proposals/admin/${id}/status`, { status: nextStatus });
      toast.success(`Pengajuan ${nextStatus === 'approved' ? 'Disetujui' : 'Ditolak'}`);
      fetchProposal();
    } catch (error) {
      toast.error("Gagal update status");
    }
  }

  if (!id) {
    return (
      <div className="p-6">
        <div className="rounded-2xl bg-white border border-[#B2F5EA] p-12 text-center shadow-lg">
          <AlertCircle className="mx-auto w-12 h-12 text-red-400 mb-4" />
          <h1 className="text-xl font-bold text-[#0F2F2E]">ID Pengajuan Tidak Ditemukan</h1>
          <button onClick={() => router.push("/admin/laporan")} className="mt-6 px-6 py-2 bg-[#0F2F2E] text-white rounded-xl font-bold hover:bg-black transition">
            Kembali ke Daftar
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#B2F5EA] border-t-[#40E0D0]"></div>
        <p className="mt-4 text-[#6B8E8B] font-medium">Memuat Detail Pengajuan...</p>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="p-6">
        <div className="text-center bg-white p-12 rounded-3xl border border-[#B2F5EA] shadow-xl">
          <h1 className="text-2xl font-bold text-[#0F2F2E]">Data tidak ditemukan</h1>
          <button onClick={() => router.push("/admin/laporan")} className="mt-4 px-6 py-2 bg-[#0F2F2E] text-white rounded-xl font-bold">
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* HEADER */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-[#B2F5EA]">
        <div className="px-4 sm:px-6 lg:px-8 py-4 lg:py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/admin/laporan")}
              className="p-2 rounded-xl border border-[#B2F5EA] bg-white text-[#0F2F2E] hover:bg-[#E6FFFA] transition shadow-sm flex items-center justify-center"
              title="Kembali"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="text-[10px] font-bold text-[#6B8E8B] uppercase tracking-widest">Detail Modul</div>
              <h1 className="text-xl font-black text-[#0F2F2E] tracking-tight truncate max-w-[150px] sm:max-w-md">
                {proposal.title}
              </h1>
            </div>
          </div>

          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border shadow-sm
            ${proposal.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-200' :
              proposal.status === 'approved' ? 'bg-green-50 text-green-600 border-green-200' :
                'bg-red-50 text-red-600 border-red-200'}
          `}>
            Status: {proposal.status === 'pending' ? 'Menunggu' : proposal.status === 'approved' ? 'Disetujui' : 'Ditolak'}
          </div>
        </div>
      </header>

      <main className="p-4 sm:p-6 lg:p-8 flex-1 space-y-8 max-w-[1400px]">
        {/* TOP SUMMARY BAR */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard
            icon={<DollarSign className="text-emerald-500" />}
            label="Target Dana"
            value={formatRupiah(proposal.targetAmount)}
            color="bg-emerald-50"
          />
          <SummaryCard
            icon={<Tag className="text-blue-500" />}
            label="Kategori"
            value={proposal.category}
            color="bg-blue-50"
          />
          <SummaryCard
            icon={<Calendar className="text-purple-500" />}
            label="Estimasi Waktu"
            value={`${formatDate(proposal.startDate)} - ${formatDate(proposal.endDate)}`}
            color="bg-purple-50"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* LEFT: CONTENT */}
          <div className="space-y-8">
            {/* 1. INFORMASI SEKOLAH */}
            <DetailSection title="Informasi Sekolah" icon={<MapPin size={18} />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                <InfoItem label="Nama Sekolah" value={proposal.schoolName} icon={<UserIcon size={14} />} />
                <InfoItem label="NPSN" value={proposal.npsn} icon={<Tag size={14} />} />
                <InfoItem label="Kepala Sekolah" value={proposal.principalName} icon={<UserIcon size={14} />} />
                <InfoItem label="Kontak Person" value={proposal.contactPhone} icon={<Phone size={14} />} />
                <div className="sm:col-span-2">
                  <InfoItem label="Alamat Lengkap" value={proposal.schoolAddress} icon={<MapPin size={14} />} />
                </div>
              </div>
            </DetailSection>

            {/* 2. NARASI PENGAJUAN */}
            <DetailSection title="Narasi & Latar Belakang" icon={<FileText size={18} />}>
              <div className="space-y-6">
                <div className="prose prose-sm max-w-none">
                  <h4 className="text-xs font-bold text-[#1E8F86] uppercase mb-2">Latar Belakang Masalah</h4>
                  <p className="text-sm text-[#4A6F6C] leading-relaxed bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
                    {proposal.background}
                  </p>
                </div>
                <div className="prose prose-sm max-w-none">
                  <h4 className="text-xs font-bold text-[#1E8F86] uppercase mb-2">Tujuan & Harapan</h4>
                  <p className="text-sm text-[#4A6F6C] leading-relaxed bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
                    {proposal.purpose}
                  </p>
                </div>
                <div className="prose prose-sm max-w-none">
                  <h4 className="text-xs font-bold text-[#1E8F86] uppercase mb-2">Manfaat Strategis</h4>
                  <p className="text-sm text-[#4A6F6C] font-medium italic">
                    "{proposal.benefits}"
                  </p>
                </div>
              </div>
            </DetailSection>

            {/* 3. DOKUMEN PENDUKUNG */}
            <DetailSection title="Dokumen & Foto" icon={<ImageIcon size={18} />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <FileCard label="Proposal Lengkap" url={proposal.files?.proposalDoc} />
                <FileCard label="Rencana Anggaran (RAB)" url={proposal.files?.budgetPlan} />
                <FileCard label="Sertifikat Sekolah" url={proposal.files?.schoolCertificate} />
              </div>

              {proposal.files?.schoolPhoto && proposal.files.schoolPhoto.length > 0 && (
                <div className="mt-6 border-t border-[#F1F5F9] pt-6">
                  <h4 className="text-xs font-bold text-[#6B8E8B] uppercase mb-4">Galeri Kondisi Lapangan</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {proposal.files.schoolPhoto.map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noreferrer" className="group relative aspect-video rounded-2xl overflow-hidden bg-gray-100 border border-[#B2F5EA] hover:shadow-lg transition">
                        <img src={url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                          <ExternalLink size={20} className="text-white" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </DetailSection>
          </div>

          {/* RIGHT: MODERATION ACTION */}
          <div className="space-y-5">
            <div className="sticky top-24 bg-[#0F2F2E] rounded-[1.5rem] p-6 text-white shadow-xl overflow-hidden">
              {/* Shine Effect */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-3xl rounded-full translate-x-5 -translate-y-5" />
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-[#40E0D0]/10 blur-2xl rounded-full -translate-x-5 translate-y-5" />

              <div className="relative z-10">
                <h3 className="text-base font-black tracking-tight mb-1">Moderasi Panel</h3>
                <p className="text-white/50 text-[10px] leading-relaxed mb-6">Tinjau semua informasi sebelum keputusan akhir.</p>

                <div className="space-y-5">
                  <div className="p-3.5 bg-white/5 rounded-xl border border-white/10">
                    <div className="text-[9px] font-bold text-white/30 uppercase mb-0.5">ID Transaksi</div>
                    <div className="text-[10px] font-mono opacity-80 truncate">{proposal._id}</div>
                  </div>

                  {proposal.status === 'pending' ? (
                    <div className="grid grid-cols-1 gap-2.5">
                      <button
                        onClick={() => updateProposalStatus('approved')}
                        className="w-full py-3.5 bg-[#40E0D0] text-[#0F2F2E] text-xs font-black rounded-xl hover:scale-[1.02] active:scale-95 transition shadow-lg flex items-center justify-center gap-2"
                      >
                        <Check size={16} /> SETUJUI
                      </button>
                      <button
                        onClick={() => updateProposalStatus('rejected')}
                        className="w-full py-3 bg-transparent border border-white/20 text-white text-xs font-bold rounded-xl hover:bg-red-500/10 hover:border-red-500/30 transition flex items-center justify-center gap-2"
                      >
                        <X size={16} /> TOLAK
                      </button>
                    </div>
                  ) : (
                    <div className={`p-5 rounded-xl text-center border font-bold text-xs
                        ${proposal.status === 'approved' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}
                      `}>
                      {proposal.status === 'approved' ? 'Telah Disetujui' : 'Telah Ditolak'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* QUICK TIPS */}
            <div className="p-5 rounded-[1.5rem] bg-white border border-[#B2F5EA] shadow-sm">
              <h4 className="flex items-center gap-2 text-xs font-bold text-[#0F2F2E] mb-3">
                <Info size={14} className="text-[#40E0D0]" /> Petunjuk
              </h4>
              <ul className="space-y-2.5">
                <Tip text="NPSN harus valid Kemdikbud" />
                <Tip text="Cek kewajaran RAB" />
                <Tip text="Verifikasi foto lapangan" />
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ================= HELPER COMPONENTS ================= */

function SummaryCard({ icon, label, value, color }: any) {
  return (
    <div className={`p-4 rounded-2xl ${color} border border-white flex flex-col gap-2.5 shadow-sm`}>
      <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <div>
        <div className="text-[9px] font-bold text-[#6B8E8B] uppercase mb-0.5 tracking-wider">{label}</div>
        <div className="text-xs font-black text-[#0F2F2E] truncate">{value}</div>
      </div>
    </div>
  );
}

function DetailSection({ title, icon, children }: any) {
  return (
    <div className="bg-white rounded-[1.5rem] border border-[#B2F5EA] shadow-xl shadow-emerald-900/5 overflow-hidden">
      <div className="px-6 py-4 border-b border-[#F1F5F9] flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-[#E6FFFA] flex items-center justify-center text-[#1E8F86]">
          {icon}
        </div>
        <h3 className="text-xs font-black text-[#0F2F2E] uppercase tracking-wide">{title}</h3>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function InfoItem({ label, value, icon }: any) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 flex-shrink-0 text-[#1E8F86] opacity-30">{icon}</div>
      <div>
        <div className="text-[9px] font-bold text-[#6B8E8B] uppercase tracking-wider mb-0.5">{label}</div>
        <div className="text-[13px] font-bold text-[#0F2F2E] leading-snug">{value || '-'}</div>
      </div>
    </div>
  );
}

function FileCard({ label, url }: any) {
  if (!url) return (
    <div className="flex items-center gap-3 p-3 rounded-2xl border border-dashed border-[#E2E8F0] bg-gray-50/50 opacity-60">
      <X size={16} className="text-gray-400" />
      <span className="text-xs font-semibold text-gray-500 italic">{label} (Tidak Ada)</span>
    </div>
  );

  return (
    <a
      href={url} target="_blank" rel="noreferrer"
      className="flex items-center justify-between p-3 rounded-2xl border border-[#B2F5EA] bg-white group hover:bg-[#F0FDFA] hover:-translate-y-0.5 transition duration-200"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-[#0F2F2E] flex items-center justify-center text-white group-hover:bg-[#40E0D0] group-hover:text-[#0F2F2E] transition">
          <FileText size={16} />
        </div>
        <span className="text-xs font-bold text-[#0F2F2E]">{label}</span>
      </div>
      <div className="text-[10px] font-black text-[#40E0D0] uppercase tracking-tight">Buka</div>
    </a>
  );
}

function Tip({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-xs text-[#6B8E8B] leading-relaxed">
      <div className="mt-1 w-1 h-1 rounded-full bg-[#40E0D0] flex-shrink-0" />
      {text}
    </li>
  );
}

function formatRupiah(n: number) {
  if (!n) return "Rp 0";
  return "Rp " + new Intl.NumberFormat("id-ID").format(n);
}

function formatDate(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso || "-";
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(d);
}
