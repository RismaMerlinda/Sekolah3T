'use client';

import { useEffect, useState, useRef } from 'react';
<<<<<<< HEAD
import Link from 'next/link';
=======
>>>>>>> 867073c80623d0846536643ea41bc6c560e1e392
import { usePathname, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import Sidebar from '@/app/components/Sidebar';
import Header from '@/app/components/Header';
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
  Pencil
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
  const [files, setFiles] = useState<any[]>([]);
  const addInputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      window.location.href = '/login';
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      setUser(parsed);

<<<<<<< HEAD
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

      // Check Proposals
      api.get('/proposals')
        .then(res => {
          const approved = res.data.some((p: any) => p.status === 'approved');
          setHasApprovedProposal(approved);
=======
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
>>>>>>> 867073c80623d0846536643ea41bc6c560e1e392
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));

    } catch (e) {
      console.error("Failed to parse user", e);
      window.location.href = '/login';
    }
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    }).format(date);
  };

  const todayStr = formatDate(new Date());

  /* --- FILE LOGIC --- */
  const handleAddFile = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file: any) => ({
        fileObj: file,
        name: file.name,
        type: file.type,
        size: (file.size / 1024).toFixed(0) + ' KB',
        date: formatDate(new Date())
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleEditFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && editIndex !== null) {
      const file = e.target.files[0];
      const updatedFile = {
        fileObj: file,
        name: file.name,
        type: file.type,
        size: (file.size / 1024).toFixed(0) + ' KB',
        date: formatDate(new Date())
      };

      setFiles(prev => {
        const newArr = [...prev];
        newArr[editIndex] = updatedFile;
        return newArr;
      });
      setEditIndex(null);
    }
  };

  const handleReadFile = (fileObj: File) => {
    if (!fileObj) return;
    const url = URL.createObjectURL(fileObj);
    window.open(url, '_blank');
  };

  const handleDeleteFile = (index: number) => {
    if (confirm('Hapus dokumen ini?')) {
      setFiles(prev => prev.filter((_, i) => i !== index));
    }
  };

  const triggerAdd = () => addInputRef.current?.click();
<<<<<<< HEAD

=======
>>>>>>> 867073c80623d0846536643ea41bc6c560e1e392
  const triggerEdit = (index: number) => {
    setEditIndex(index);
    setTimeout(() => {
      editInputRef.current?.click();
    }, 0);
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

          {/* TIMELINE */}
          <div className="relative pl-8 border-l-2 border-[#B2F5EA] space-y-12 ml-4">
            {/* ITEM 1: Upload Documents */}
            {hasApprovedProposal ? (
              <TimelineItem
                date={todayStr}
                title="Dokumentasi Pelaksanaan"
                description="Upload foto dan dokumen terkait pelaksanaan kegiatan hari ini."
                icon={<UploadCloud size={18} className="text-white" />}
                active
              >
                <div className="mt-4 bg-[#F8FAFC] rounded-2xl p-6 border border-dashed border-[#B2F5EA]">
                  <div className="flex justify-center mb-6">
                    {/* Hidden Input for Adding */}
                    <input
                      type="file"
                      multiple
                      hidden
                      ref={addInputRef}
                      onChange={handleAddFile}
                      accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                    />

                    {/* Hidden Input for Editing */}
                    <input
                      type="file"
                      hidden
                      ref={editInputRef}
                      onChange={handleEditFile}
                      accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                    />

                    <button
                      onClick={triggerAdd}
                      className="flex items-center gap-2 bg-[#CCFBF1] text-[#1E8F86] px-6 py-3 rounded-xl hover:bg-[#bbf0e5] transition font-semibold text-sm"
                    >
                      <UploadCloud size={20} />
                      Upload Dokumen
                    </button>
<<<<<<< HEAD
=======
                    <input type="file" multiple hidden ref={addInputRef} onChange={handleAddFile} accept=".jpg,.jpeg,.png,.pdf" />
                    <input type="file" hidden ref={editInputRef} onChange={handleEditFile} accept=".jpg,.jpeg,.png,.pdf" />
>>>>>>> 867073c80623d0846536643ea41bc6c560e1e392
                  </div>

                  {files.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {files.map((file, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-xl border border-[#E2E8F0] flex flex-col gap-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#F1F5F9] rounded-lg text-[#64748B]">
                              {file.type.includes('image') ? <ImageIcon size={18} /> : <FileIcon size={18} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-[#0F2F2E] truncate">{file.name}</p>
                              <p className="text-[10px] text-[#6B8E8B]">{file.date} &bull; {file.size}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1F5F9]">
                            <button onClick={() => handleReadFile(file.fileObj)} className="text-[#1E8F86] hover:bg-[#E6FFFA] p-1.5 rounded-lg transition">
                              <Eye size={16} />
                            </button>
                            <button onClick={() => triggerEdit(idx)} className="text-[#2CB1A6] hover:bg-[#CCFBF1] p-1.5 rounded-lg transition">
                              <Pencil size={16} />
                            </button>
                            <button onClick={() => handleDeleteFile(idx)} className="text-[#EF4444] hover:bg-[#FEE2E2] p-1.5 rounded-lg transition">
                              <Trash2 size={16} />
                            </button>
                          </div>
<<<<<<< HEAD
=======
                          <div className="flex gap-1">
                            <button onClick={() => triggerEdit(idx)} className="text-[#1E8F86] hover:bg-[#E6FFFA] p-1.5 rounded-lg transition">
                              <Pencil size={14} />
                            </button>
                            <button onClick={() => handleDeleteFile(idx)} className="text-[#EF4444] hover:bg-[#FEE2E2] p-1.5 rounded-lg transition">
                              <Trash2 size={16} />
                            </button>
                          </div>
>>>>>>> 867073c80623d0846536643ea41bc6c560e1e392
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TimelineItem>
            ) : (
              <TimelineItem
                date={todayStr}
                title="Kegiatan Belum Dimulai"
                description="Anda dapat mengupload dokumentasi kegiatan setelah proposal Anda disetujui (ACC)."
                icon={<Lock size={18} className="text-white" />}
                color="bg-gray-300"
                active={false}
              />
            )}

            {hasApprovedProposal && (
              <TimelineItem
                date={formatDate(new Date(Date.now() - 86400000))}
                title="Pengajuan Disetujui"
                description="Proposal Anda telah disetujui oleh Admin."
                icon={<CheckCircle size={18} className="text-white" />}
                color="bg-green-500"
              />
            )}

            <TimelineItem
              date={formatDate(new Date(Date.now() - 172800000))}
              title="Akun Terdaftar"
              description="Selamat datang di Sahabat3T!"
              icon={<User size={18} className="text-white" />}
              color="bg-[#40E0D0]"
              last
            />

          </div>
        </main>
      </div>
    </div>
  );
}

<<<<<<< HEAD
=======
/* ================= HELPERS ================= */

>>>>>>> 867073c80623d0846536643ea41bc6c560e1e392
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
