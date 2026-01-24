'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import Sidebar from '@/components/Sidebar';
import Header from '@/app/components/Header';
import toast from 'react-hot-toast';
import { showConfirm } from '@/lib/swal';
import {
  UploadCloud,
  CheckCircle,
  User,
  Clock,
  Trash2,
  Image as ImageIcon,
  FileText as FileIcon,
  Plus,
  Calendar,
  Lock,
  Eye,
  Pencil,
  X,
  Loader2
} from 'lucide-react';

/* ================= PAGE CONTENT ================= */

export default function TimelinePage() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [officialSchool, setOfficialSchool] = useState<any>(null);
  const [verified, setVerified] = useState<boolean | null>(null);
  const [openSidebar, setOpenSidebar] = useState(false);

  // Logic
  const [loading, setLoading] = useState(true);
  const [hasApprovedProposal, setHasApprovedProposal] = useState(false);
  const [proposalId, setProposalId] = useState<string | null>(null);
  const [timelines, setTimelines] = useState<any[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      window.location.href = '/login';
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      setUser(parsed);

      if (parsed.npsn) {
        fetch(`/api/verifikasi-sekolah?npsn=${parsed.npsn}`)
          .then(res => res.json())
          .then(json => {
            if (json?.data?.satuanPendidikan) {
              setVerified(true);
              setOfficialSchool(json.data.satuanPendidikan);
            } else {
              setVerified(false);
            }
          })
          .catch(() => setVerified(false));
      } else {
        setVerified(false);
      }

      // Check Proposals and Fetch Timelines
      checkProposalAndFetchTimelines();

    } catch (e) {
      console.error("Failed to parse user", e);
      window.location.href = '/login';
    }
  }, []);

  const checkProposalAndFetchTimelines = async () => {
    try {
      const res = await api.get('/proposals');
      // Find approved proposal
      const approved = res.data.find((p: any) => p.status === 'approved');

      if (approved) {
        setHasApprovedProposal(true);
        setProposalId(approved._id);
        fetchTimelines(approved._id);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchTimelines = async (propId: string) => {
    try {
      const res = await api.get(`/timeline?proposalId=${propId}`);
      setTimelines(res.data);
    } catch (error) {
      console.error("Failed to fetch timeline", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      // Filter images only
      const validFiles = files.filter(f => f.type.startsWith('image/'));
      if (validFiles.length !== files.length) {
        toast.error('Hanya file gambar yang diperbolehkan');
      }

      setSelectedFiles(prev => [...prev, ...validFiles]);

      // Generate previews
      const newPreviews = validFiles.map(f => URL.createObjectURL(f));
      setPreviewUrls(prev => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalId) return;

    setUploadLoading(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('date', formData.date);
    data.append('proposalId', proposalId);

    selectedFiles.forEach(file => {
      data.append('images', file);
    });

    try {
      await api.post('/timeline', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Kegiatan berhasil ditambahkan!');
      setIsModalOpen(false);
      // Reset form
      setFormData({ title: '', description: '', date: new Date().toISOString().split('T')[0] });
      setSelectedFiles([]);
      setPreviewUrls([]);

      fetchTimelines(proposalId);
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Gagal menambahkan kegiatan');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = await showConfirm({
      title: 'Hapus Kegiatan?',
      text: 'Hapus kegiatan ini?',
      icon: 'warning',
      confirmButtonText: 'Ya, Hapus',
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#1E8F86',
    });
    if (!isConfirmed) return;
    try {
      await api.delete(`/timeline/${id}`);
      toast.success('Kegiatan dihapus');
      if (proposalId) fetchTimelines(proposalId);
    } catch (error) {
      toast.error('Gagal menghapus');
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    }).format(new Date(dateString));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-[#E6FFFA]">
      <Sidebar
        user={user}
        open={openSidebar}
        setOpen={setOpenSidebar}
        pathname={pathname}
        verified={verified}
        officialName={officialSchool?.nama}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          user={user}
          setOpen={setOpenSidebar}
          officialName={officialSchool?.nama}
          title="Timeline Kegiatan"
        />

        <main className="p-4 md:p-8 max-w-5xl mx-auto w-full space-y-8">

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#0F2F2E]">Timeline Kegiatan</h1>
              <p className="text-sm text-[#6B8E8B]">Lacak milestone dan dokumentasi kegiatan sekolah.</p>
            </div>

            {hasApprovedProposal ? (
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#40E0D0] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#2CB1A6] transition shadow-lg shadow-[#40E0D0]/20 text-sm flex items-center gap-2"
              >
                <Plus size={18} /> Tambah Kegiatan
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-yellow-50 text-yellow-600 px-4 py-2 rounded-xl border border-yellow-200 text-xs font-semibold">
                <Lock size={14} /> Menunggu Persetujuan Proposal
              </div>
            )}
          </div>

          {/* TIMELINE LIST */}
          <div className="relative pl-8 border-l-2 border-[#B2F5EA] space-y-12 ml-4 pb-12">

            {loading ? (
              <div className="pl-4 text-[#6B8E8B] flex items-center gap-2">
                <Loader2 className="animate-spin" size={20} /> Memuat timeline...
              </div>
            ) : timelines.length > 0 ? (
              timelines.map((item) => (
                <TimelineItem
                  key={item._id}
                  date={formatDate(item.date)}
                  title={item.title}
                  description={item.description}
                  icon={<CheckCircle size={18} className="text-white" />}
                  active={true}
                >
                  {/* Display Images */}
                  {item.images && item.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {item.images.map((img: string, idx: number) => (
                        <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-[#E2E8F0] relative group">
                          <img src={img} alt="Bukti" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition cursor-pointer" onClick={() => window.open(img, '_blank')} />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-[#F1F5F9] flex justify-end">
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1"
                    >
                      <Trash2 size={12} /> Hapus
                    </button>
                  </div>
                </TimelineItem>
              ))
            ) : hasApprovedProposal ? (
              // Empty state if approved but no activities
              <TimelineItem
                date={formatDate(new Date().toISOString())}
                title="Belum Ada Kegiatan"
                description="Tambahkan kegiatan pertama Anda dengan klik tombol di atas."
                icon={<Clock size={18} className="text-white" />}
                color="bg-gray-300"
                active={false}
              />
            ) : (
              // Not approved yet
              <TimelineItem
                date={formatDate(new Date().toISOString())}
                title="Kegiatan Belum Dimulai"
                description="Anda dapat mengupload dokumentasi kegiatan setelah proposal Anda disetujui (ACC)."
                icon={<Lock size={18} className="text-white" />}
                color="bg-gray-300"
                active={false}
              />
            )}

            {/* System Milestones */}
            {hasApprovedProposal && (
              <TimelineItem
                date="Milestone System"
                title="Pengajuan Disetujui"
                description="Proposal Anda telah disetujui oleh Admin."
                icon={<CheckCircle size={18} className="text-white" />}
                color="bg-green-500"
              />
            )}

            <TimelineItem
              date="Milestone System"
              title="Akun Terdaftar"
              description="Selamat datang di Sahabat3T!"
              icon={<User size={18} className="text-white" />}
              color="bg-[#40E0D0]"
              last
            />

          </div>
        </main>
      </div>

      {/* MODAL TAMBAH KEGIATAN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-[#0F2F2E]">Tambah Kegiatan Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-full transition">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[#0F2F2E] mb-1">Nama Kegiatan</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#40E0D0]"
                    placeholder="Contoh: Pembelian Semen"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#0F2F2E] mb-1">Tanggal</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#40E0D0]"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#0F2F2E] mb-1">Keterangan / Deskripsi</label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#40E0D0] min-h-[100px]"
                    placeholder="Jelaskan detail kegiatan..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#0F2F2E] mb-2">Bukti Dokumentasi (Foto)</label>
                  <div
                    className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      hidden
                      multiple
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                    <UploadCloud className="text-[#40E0D0] mb-2" size={32} />
                    <p className="text-sm font-semibold text-gray-600">Klik untuk upload foto</p>
                    <p className="text-xs text-gray-400">Bisa upload lebih dari satu</p>
                  </div>

                  {/* Previews */}
                  {previewUrls.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-4">
                      {previewUrls.map((url, idx) => (
                        <div key={idx} className="aspect-square relative rounded-lg overflow-hidden border border-gray-200 group">
                          <img src={url} alt="Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeFile(idx)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50"
                    disabled={uploadLoading}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-[#1E8F86] text-white rounded-xl font-bold hover:bg-[#166E68] flex items-center justify-center gap-2"
                    disabled={uploadLoading}
                  >
                    {uploadLoading ? <Loader2 className="animate-spin" /> : 'Simpan Kegiatan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

/* ================= HELPERS ================= */
function TimelineItem({ date, title, description, children, icon, color = "bg-[#40E0D0]", active, last }: any) {
  return (
    <div className="relative">
      {/* Dot */}
      <div className={`absolute -left-[41px] top-0 w-6 h-6 rounded-full flex items-center justify-center border-4 border-[#E6FFFA] shadow-sm z-10 ${color}`}>
        {icon}
      </div>

      <div className={`bg-white p-6 rounded-2xl border ${active ? 'border-[#40E0D0] shadow-md ring-4 ring-[#CCFBF1]' : 'border-[#B2F5EA] shadow-sm'}`}>
        <div className="flex-wrap justify-between items-start gap-2 mb-2 flex">
          <h3 className="text-lg font-bold text-[#0F2F2E]">{title}</h3>
          <span className="text-xs font-medium bg-[#F1F5F9] text-[#64748B] px-3 py-1 rounded-full flex items-center gap-1">
            <Calendar size={12} /> {date}
          </span>
        </div>
        <p className="text-sm text-[#4A6F6C]">{description}</p>
        {children}
      </div>
    </div>
  );
}
