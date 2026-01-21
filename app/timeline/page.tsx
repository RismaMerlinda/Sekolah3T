'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  ClipboardList,
  BarChart2,
  FileText,
  Clock,
  TrendingUp,
  User,
  LogOut,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  FileText as FileIcon,
  Menu,
  X,
  UploadCloud,
  Eye,
  Pencil,
  Trash2,
} from 'lucide-react';

/* ================= TOP NAVBAR ================= */
function TopNavbar({ user, onMenu }: any) {
  const avatarLetter =
    typeof user?.schoolName === 'string'
      ? user.schoolName.charAt(0).toUpperCase()
      : 'S';

  return (
    <div className="h-16 bg-white px-4 md:px-8 flex items-center justify-between border-b border-[#B2F5EA]">
      {/* MOBILE MENU BUTTON */}
      <button
        onClick={onMenu}
        className="lg:hidden mr-4 text-[#1E8F86] hover:text-[#176F68] transition"
      >
        <Menu size={24} />
      </button>

      {/* SEARCH */}
      <div className="hidden sm:flex flex-1 justify-start">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search for something"
            className="w-full pl-10 pr-4 py-2 bg-[#E6FFFA] rounded-full text-sm outline-none focus:ring-2 focus:ring-[#40E0D0]"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B8E8B]">
            🔍
          </span>
        </div>
      </div>

      {/* PROFILE */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => (window.location.href = '/profil')}
      >
        <div className="w-9 h-9 bg-[#40E0D0] text-white rounded-full flex items-center justify-center font-semibold">
          {avatarLetter}
        </div>

        <div className="hidden sm:block text-right leading-tight">
          <p className="text-sm font-medium text-[#0F2F2E] truncate max-w-[140px]">
            {user?.schoolName}
          </p>
          <p className="text-xs text-[#6B8E8B] truncate max-w-[140px]">
            {user?.email}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================= PAGE ================= */
export default function TimelinePage() {
  const pathname = usePathname();

  const [user, setUser] = useState<any>(null);
  const [officialSchool, setOfficialSchool] = useState<any>(null);
  const [verified, setVerified] = useState<boolean | null>(null);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [files, setFiles] = useState<any[]>([]);

  // Refs for adding interaction
  const addInputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      window.location.href = '/login';
      return;
    }

    const parsed = JSON.parse(stored);
    setUser(parsed);

    if (!parsed.npsn) {
      setVerified(false);
      return;
    }

    fetch(`https://api.fazriansyah.eu.org/v1/sekolah?npsn=${parsed.npsn}`)
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
  }, []);

  /* --- FILE HANDLING LOGIC --- */

  // 1. ADD: Handle new upload
  const handleAddFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
        fileObj: file, // Keep raw file for objectURL
        name: file.name,
        type: file.type,
        size: (file.size / 1024).toFixed(0) + ' KB',
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  // 2. REPL. : Handle replace file
  const handleEditFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && editIndex !== null) {
      const file = e.target.files[0];
      const updatedFile = {
        fileObj: file,
        name: file.name,
        type: file.type,
        size: (file.size / 1024).toFixed(0) + ' KB',
      };

      setFiles(prev => {
        const newArr = [...prev];
        newArr[editIndex] = updatedFile;
        return newArr;
      });
      setEditIndex(null);
    }
  };

  // 3. READ: Open file in new tab
  const handleReadFile = (fileObj: File) => {
    if (!fileObj) return;
    const url = URL.createObjectURL(fileObj);
    window.open(url, '_blank');
  };

  // 4. DELETE: Remove file with confirm
  const handleDeleteFile = (index: number) => {
    if (confirm('Hapus dokumen ini?')) {
      setFiles(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Trigger Inputs
  const triggerAdd = () => addInputRef.current?.click();

  const triggerEdit = (index: number) => {
    setEditIndex(index);
    // Timeout to ensure state is set before click (React 18 usually batches this fine but safety first)
    setTimeout(() => {
      editInputRef.current?.click();
    }, 0);
  };

  if (!user) {
    return (
      <div className="p-10 text-sm text-[#6B8E8B]">
        Memuat data akun...
      </div>
    );
  }

  const schoolName =
    officialSchool?.nama || user.schoolName || 'Sekolah';

  return (
    <div className="min-h-screen flex bg-[#E6FFFA]">

      {/* BACKDROP MOBILE */}
      {openSidebar && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpenSidebar(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white px-6 py-6 flex flex-col justify-between border-r border-[#B2F5EA] transition-transform duration-300 lg:static lg:translate-x-0 ${openSidebar ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <button
          onClick={() => setOpenSidebar(false)}
          className="absolute top-4 right-4 lg:hidden text-[#6B8E8B] hover:text-[#EF4444]"
        >
          <X size={24} />
        </button>

        <div>
          <div className="mb-10">
            <h1 className="text-lg font-bold text-[#1E8F86] truncate">
              {schoolName}
            </h1>

            {verified === null && (
              <p className="text-xs text-[#6B8E8B]">
                memeriksa verifikasi...
              </p>
            )}

            {verified === true && (
              <p className="text-xs text-[#22C55E] flex items-center gap-1">
                <CheckCircle size={14} />
                Terverifikasi Kemendikbud
              </p>
            )}

            {verified === false && (
              <p className="text-xs text-[#EF4444] flex items-center gap-1">
                <XCircle size={14} />
                Belum Terverifikasi
              </p>
            )}
          </div>

          <nav className="space-y-2 text-sm">
            <MenuLink href="/dashboard" icon={<Home size={18} />} label="Dashboard" active={pathname === '/dashboard'} onClick={() => setOpenSidebar(false)} />
            <MenuLink href="/pengajuan" icon={<ClipboardList size={18} />} label="Pengajuan" active={pathname === '/pengajuan'} onClick={() => setOpenSidebar(false)} />
            <MenuLink href="/ringkasan" icon={<BarChart2 size={18} />} label="Ringkasan" active={pathname === '/ringkasan'} onClick={() => setOpenSidebar(false)} />
            <MenuLink href="/laporan" icon={<FileText size={18} />} label="Laporan" active={pathname === '/laporan'} onClick={() => setOpenSidebar(false)} />
            <MenuLink href="/timeline" icon={<Clock size={18} />} label="Timeline" active={pathname === '/timeline'} onClick={() => setOpenSidebar(false)} />
            <MenuLink href="/progress" icon={<TrendingUp size={18} />} label="Progress" active={pathname === '/progress'} onClick={() => setOpenSidebar(false)} />
            <MenuLink href="/profil" icon={<User size={18} />} label="Profil" active={pathname === '/profil'} onClick={() => setOpenSidebar(false)} />
          </nav>
        </div>

        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}
          className="flex items-center gap-2 text-sm text-[#6B8E8B] hover:text-[#EF4444]"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* ================= MAIN ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar user={user} onMenu={() => setOpenSidebar(true)} />

        <main className="flex-1 p-4 md:p-6 lg:p-10">
          <div className="max-w-5xl mx-auto">

            <h1 className="text-2xl md:text-3xl font-bold text-[#0F2F2E] mb-8 md:mb-10">Timeline Kegiatan</h1>

            {/* EMPTY TIMELINE */}
            <div className="flex gap-4 md:gap-8">

              {/* LINE */}
              <div className="flex flex-col items-center pt-2">
                <div className="w-3 h-3 rounded-full bg-[#40E0D0]" />
                <div className="flex-1 w-px bg-[#B2F5EA]" />
              </div>

              {/* CARD */}
              <div className="flex-1">
                <div className="bg-white rounded-2xl shadow-sm border border-[#B2F5EA] p-6 md:p-8 text-center">
                  <p className="text-sm text-[#6B8E8B] mb-6">
                    Laporan kegiatan
                  </p>

                  <div className="bg-[#FAFAFA] rounded-xl p-4 md:p-6 space-y-4 border border-dashed border-[#B2F5EA]">
                    {/* Placeholder Images */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="h-20 md:h-24 bg-[#CCFBF1] rounded-lg flex items-center justify-center">
                        <ImageIcon className="text-[#1E8F86]" />
                      </div>
                      <div className="h-20 md:h-24 bg-[#CCFBF1] rounded-lg flex items-center justify-center">
                        <ImageIcon className="text-[#1E8F86]" />
                      </div>
                      <div className="h-20 md:h-24 bg-[#CCFBF1] rounded-lg flex items-center justify-center">
                        <ImageIcon className="text-[#1E8F86]" />
                      </div>
                    </div>

                    {/* UPLOAD BUTTON AREA */}
                    <div className="mt-4">
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
                        className="w-full flex items-center justify-center gap-2 bg-[#40E0D0] hover:bg-[#2CB1A6] text-white px-5 py-3 rounded-xl transition shadow-md shadow-[#40E0D0]/20 font-medium"
                      >
                        <UploadCloud size={20} />
                        Upload Dokumen Kegiatan
                      </button>
                    </div>

                    {/* UPLOADED FILES GRID */}
                    {files.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 text-left">
                        {files.map((file, idx) => (
                          <div key={idx} className="bg-white p-4 rounded-2xl border border-[#B2F5EA] shadow-sm flex flex-col justify-between">
                            <div className="flex items-start gap-3 mb-4">
                              <div className="p-2 bg-[#CCFBF1] rounded-lg text-[#1E8F86] shrink-0">
                                {file.type.includes('image') ? <ImageIcon size={20} /> : <FileIcon size={20} />}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-[#0F2F2E] truncate" title={file.name}>
                                  {file.name}
                                </p>
                                <p className="text-xs text-[#6B8E8B]">
                                  {file.size} • {file.type.split('/')[1]?.toUpperCase() || 'FILE'}
                                </p>
                                <p className="text-[10px] text-[#22C55E] mt-1 font-medium bg-[#E6FFFA] inline-block px-1.5 py-0.5 rounded">
                                  Berhasil diunggah
                                </p>
                              </div>
                            </div>

                            {/* ACTIONS */}
                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F0FDFA]">
                              <button
                                onClick={() => handleReadFile(file.fileObj)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#1E8F86] hover:bg-[#E6FFFA] transition"
                              >
                                <Eye size={14} /> Lihat
                              </button>
                              <button
                                onClick={() => triggerEdit(idx)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#2CB1A6] hover:bg-[#CCFBF1] transition"
                              >
                                <Pencil size={14} /> Ganti
                              </button>
                              <button
                                onClick={() => handleDeleteFile(idx)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#EF4444] hover:bg-[#FEE2E2] transition"
                              >
                                <Trash2 size={14} /> Hapus
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>

                  <p className="text-xs text-[#6B8E8B] mt-6">
                    Data akan muncul setelah laporan dikirim
                  </p>
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

/* ================= COMPONENT ================= */

function MenuLink({ href, icon, label, active, onClick }: any) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition
        ${active
          ? 'bg-[#CCFBF1] text-[#1E8F86] font-medium'
          : 'text-[#4A6F6C] hover:bg-[#E6FFFA] hover:text-[#40E0D0]'
        }`}
    >
      {icon}
      {label}
    </Link>
  );
}
