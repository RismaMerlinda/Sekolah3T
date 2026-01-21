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
  Upload,
  Menu,
  X
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
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-[#40E0D0] text-white rounded-full flex items-center justify-center font-semibold">
          {avatarLetter}
        </div>
        <div className="hidden sm:block text-right">
          <p className="text-sm font-medium text-[#0F2F2E]">{user?.schoolName}</p>
          <p className="text-xs text-[#6B8E8B]">{user?.email}</p>
        </div>
      </div>
    </div>
  );
}

/* ================= PAGE ================= */
export default function ProfilPage() {
  const pathname = usePathname();

  const [user, setUser] = useState<any>(null);
  const [officialSchool, setOfficialSchool] = useState<any>(null);
  const [verified, setVerified] = useState<boolean | null>(null);
  const [openSidebar, setOpenSidebar] = useState(false);

  const [form, setForm] = useState<any>({
    schoolName: '',
    npsn: '',
    jenjang: '',
    provinsi: '',
    jalan: '',
    detail: '',
    kepala: '',
    phone: '',
    email: '',
    deskripsi: '',
    kebutuhan: '',
  });

  /* ===== LOAD USER & AUTO FILL ===== */
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      window.location.href = '/login';
      return;
    }

    const parsed = JSON.parse(stored);
    setUser(parsed);

    setForm({
      schoolName: parsed.schoolName || '',
      npsn: parsed.npsn || '',
      jenjang: parsed.jenjang || '',
      provinsi: parsed.alamat?.provinsi || '',
      jalan: parsed.alamat?.jalan || '',
      detail: parsed.alamat?.detail || '',
      kepala: parsed.kepala || '',
      phone: parsed.phone || '',
      email: parsed.email || '',
      deskripsi: parsed.deskripsi || '',
      kebutuhan: parsed.kebutuhan || '',
    });

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

  if (!user) {
    return (
      <div className="p-10 text-sm text-[#6B8E8B]">
        Memuat data akun...
      </div>
    );
  }

  const schoolName =
    officialSchool?.nama || form.schoolName || 'Sekolah';

  /* ================= RENDER ================= */
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

      {/* ===== MAIN ===== */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar user={user} onMenu={() => setOpenSidebar(true)} />

        <main className="flex-1 p-4 md:p-6 lg:p-10">
          <div className="max-w-4xl mx-auto space-y-8">

            <h1 className="text-2xl md:text-3xl font-bold text-[#0F2F2E]">Profil Sekolah</h1>

            {/* ===== FOTO PROFIL ===== */}
            <Section title="Profil Sekolah">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-24 h-24 shrink-0 rounded-full bg-[#E6FFFA] flex items-center justify-center border border-[#B2F5EA]">
                  <Upload size={32} className="text-[#1E8F86]" />
                </div>

                <div className="flex-1 space-y-2">
                  <p className="text-sm font-medium text-[#0F2F2E]">Upload Foto Profil Sekolah</p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-[#FAFAFA] px-4 py-3 rounded-lg border border-[#B2F5EA]">
                    <label className="bg-[#40E0D0] hover:bg-[#2CB1A6] text-white px-4 py-2 rounded-lg text-sm cursor-pointer transition shadow-sm">
                      Pilih File
                      <input type="file" hidden />
                    </label>
                    <span className="text-sm text-[#6B8E8B]">
                      Tidak ada file yang terpilih
                    </span>
                  </div>
                  <p className="text-xs text-[#6B8E8B]">
                    Format JPG, PNG, JPEG. Maks 2MB.
                  </p>
                </div>
              </div>
            </Section>

            {/* ===== INFORMASI ===== */}
            <Section title="Informasi Akun">
              <TwoCol>
                <Input label="Nama Sekolah" value={schoolName} disabled />
                <Input label="NPSN" value={form.npsn} disabled />
                <Input label="Jenjang Pendidikan" value={form.jenjang} />
                <PhoneInput value={form.phone} setForm={setForm} />
                <Input label="Email Sekolah" value={form.email} />
              </TwoCol>
            </Section>

            <Section title="Alamat Sekolah">
              <TwoCol>
                <Input label="Provinsi/Kota" value={form.provinsi} />
                <Input label="Alamat Jalan" value={form.jalan} />
                <Input label="Detail Lainnya" value={form.detail} />
              </TwoCol>
            </Section>

            <Section title="Gambaran Singkat">
              <Textarea label="Deskripsi Singkat Kondisi Sekolah" value={form.deskripsi} />
              <Textarea label="Kebutuhan Sekolah" value={form.kebutuhan} />
            </Section>

            <div className="flex justify-end">
              <button className="px-6 py-2.5 bg-[#40E0D0] hover:bg-[#2CB1A6] text-white rounded-lg transition shadow-md shadow-[#40E0D0]/20 font-medium">
                Simpan Perubahan
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

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

function Section({ title, children }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#B2F5EA] space-y-4">
      <h2 className="font-bold text-[#1E8F86] text-lg">{title}</h2>
      {children}
    </div>
  );
}

function TwoCol({ children }: any) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{children}</div>;
}

function Input({ label, value, disabled }: any) {
  return (
    <div>
      <label className="text-sm font-medium text-[#0F2F2E] mb-1 block">{label}</label>
      <input
        value={value}
        disabled={disabled}
        className={`w-full px-4 py-2 rounded-lg outline-none border transition
          ${disabled
            ? 'bg-[#CCFBF1] text-[#6B8E8B] border-[#B2F5EA] cursor-not-allowed'
            : 'bg-[#E6FFFA] text-[#0F2F2E] border-transparent focus:border-[#40E0D0] focus:bg-white focus:ring-2 focus:ring-[#CCFBF1]'
          }`}
      />
    </div>
  );
}

function Textarea({ label, value }: any) {
  return (
    <div>
      <label className="text-sm font-medium text-[#0F2F2E] mb-1 block">{label}</label>
      <textarea
        rows={4}
        value={value}
        className="w-full px-4 py-2 bg-[#E6FFFA] text-[#0F2F2E] rounded-lg outline-none border border-transparent focus:border-[#40E0D0] focus:bg-white focus:ring-2 focus:ring-[#CCFBF1] transition"
      />
    </div>
  );
}

function PhoneInput({ value, setForm }: any) {
  const [error, setError] = useState('');

  const handleChange = (e: any) => {
    const num = e.target.value.replace(/\D/g, '');

    if (num.length < 11) setError('Minimal 11 digit');
    else if (num.length > 15) setError('Maksimal 15 digit');
    else setError('');

    setForm((prev: any) => ({ ...prev, phone: num }));
  };

  return (
    <div>
      <label className="text-sm font-medium text-[#0F2F2E] mb-1 block">Telepon Sekolah</label>
      <input
        value={value}
        onChange={handleChange}
        className={`w-full px-4 py-2 rounded-lg outline-none border transition
          ${error
            ? 'border-[#EF4444] bg-[#FEF2F2] focus:ring-[#EF4444]'
            : 'bg-[#E6FFFA] border-transparent focus:border-[#40E0D0] focus:bg-white focus:ring-2 focus:ring-[#CCFBF1]'
          }`}
      />
      {error && <p className="text-xs text-[#EF4444] mt-1">{error}</p>}
    </div>
  );
}
