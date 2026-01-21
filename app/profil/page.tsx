'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
<<<<<<< HEAD
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Sidebar from '@/app/components/Sidebar';
import Header from '@/app/components/Header';
import {
  Edit3, Save, MapPin, Phone, Mail, CheckCircle, XCircle
} from 'lucide-react';

/* ================= PAGE CONTENT ================= */
=======
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
>>>>>>> 77e6c2b176af517e26347389d6172186670b99c9
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
<<<<<<< HEAD
=======
    kepala: '',
>>>>>>> 77e6c2b176af517e26347389d6172186670b99c9
    phone: '',
    email: '',
    deskripsi: '',
    kebutuhan: '',
  });

<<<<<<< HEAD
  const [isEditing, setIsEditing] = useState(false);

=======
  /* ===== LOAD USER & AUTO FILL ===== */
>>>>>>> 77e6c2b176af517e26347389d6172186670b99c9
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      window.location.href = '/login';
      return;
    }

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

            // Auto fill from Kemendikbud if available
            setForm((prev: any) => ({
              ...prev,
              schoolName: json.data.satuanPendidikan.nama,
              npsn: json.data.satuanPendidikan.npsn,
              jalan: json.data.satuanPendidikan.alamat_jalan,
              provinsi: "Indonesia", // Default for now
            }));

          } else {
            setVerified(false);
          }
        })
        .catch(() => setVerified(false));
    } else {
      setVerified(false);
    }

    // Initialize with local data if available
    setForm((prev: any) => ({
      ...prev,
      schoolName: parsed.schoolName || prev.schoolName,
      npsn: parsed.npsn || prev.npsn,
      email: parsed.email || prev.email,
    }));

  }, []);

  const handleSave = () => {
    // Mock Save
    toast.success("Perubahan profil berhasil disimpan (Mock)");
    setIsEditing(false);
  }

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
          title="Profil Sekolah"
        />

        <main className="p-4 md:p-8 max-w-5xl mx-auto w-full space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#0F2F2E]">Profil Sekolah</h1>
              <p className="text-sm text-[#6B8E8B]">Kelola informasi sekolah dan data verifikasi.</p>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-[#CCFBF1] text-[#1E8F86] px-5 py-2.5 rounded-xl font-bold hover:bg-[#bbf0e5] transition flex items-center gap-2 text-sm"
              >
                <Edit3 size={18} /> Edit Profil
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-white text-[#6B8E8B] border border-[#B2F5EA] px-5 py-2.5 rounded-xl font-bold hover:bg-gray-50 transition text-sm"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  className="bg-[#40E0D0] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#2CB1A6] transition shadow-lg shadow-[#40E0D0]/20 flex items-center gap-2 text-sm"
                >
                  <Save size={18} /> Simpan
                </button>
              </div>
            )}
          </div>

          {/* CARD 1: HERO & PHOTO (Improved Layout) */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#B2F5EA] overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-[#ccfbf1] to-[#99f6e4]"></div>

            <div className="px-8 pb-8">
              <div className="relative flex flex-col md:flex-row gap-6 items-end -mt-12">
                <div className="w-32 h-32 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center shrink-0 z-10">
                  <div className="w-full h-full bg-[#E6FFFA] rounded-xl flex items-center justify-center text-[#40E0D0] text-5xl font-bold">
                    {officialSchool?.nama?.charAt(0) || user.schoolName?.charAt(0) || 'S'}
                  </div>
                </div>

                <div className="flex-1 pb-2 space-y-1 w-full text-center md:text-left">
                  <h2 className="text-2xl font-bold text-[#0F2F2E] leading-tight">
                    {officialSchool?.nama || user.schoolName}
                  </h2>
                  <div className="flex flex-col md:flex-row items-center gap-3 text-[#6B8E8B] text-sm md:justify-start justify-center">
                    <span className="flex items-center gap-2 font-medium bg-gray-50 px-2 py-1 rounded-lg">
                      <Mail size={14} /> {user.email}
                    </span>

                    {verified && (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-bold border border-green-200 flex items-center gap-1">
                        <CheckCircle size={12} /> Terverifikasi
                      </span>
                    )}
                    {!verified && (
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded-lg text-xs font-bold border border-red-200 flex items-center gap-1">
                        <XCircle size={12} /> Belum Terverifikasi
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: FORM */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#B2F5EA]">
            <h3 className="text-lg font-bold text-[#0F2F2E] mb-6 border-b border-[#F1F5F9] pb-4">Informasi Detail</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Nama Sekolah"
                value={form.schoolName}
                onChange={(val: string) => setForm({ ...form, schoolName: val })}
                disabled={!isEditing}
              />
              <InputField
                label="NPSN"
                value={form.npsn}
                onChange={(val: string) => setForm({ ...form, npsn: val })}
                disabled // NPSN always disabled
              />
              <InputField
                label="Alamat / Jalan"
                value={form.jalan}
                onChange={(val: string) => setForm({ ...form, jalan: val })}
                disabled={!isEditing}
                icon={<MapPin size={16} className="text-[#6B8E8B]" />}
              />
              <InputField
                label="Nomor Telepon"
                value={form.phone}
                onChange={(val: string) => setForm({ ...form, phone: val })}
                disabled={!isEditing}
                icon={<Phone size={16} className="text-[#6B8E8B]" />}
              />
              <InputField
                label="Email Resmi"
                value={form.email}
                onChange={(val: string) => setForm({ ...form, email: val })}
                disabled={!isEditing}
                icon={<Mail size={16} className="text-[#6B8E8B]" />}
              />
            </div>

            <div className="mt-6">
              <label className="text-sm font-bold text-[#0F2F2E] mb-2 block">Deskripsi Sekolah</label>
              <textarea
                className={`w-full p-4 rounded-xl border ${!isEditing ? 'bg-[#F8FAFC] border-transparent text-[#64748B]' : 'bg-white border-[#B2F5EA] text-[#0F2F2E] focus:ring-2 focus:ring-[#CCFBF1]'} outline-none transition h-32 resize-none`}
                value={form.deskripsi}
                onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                disabled={!isEditing}
                placeholder={isEditing ? "Tuliskan deskripsi singkat sekolah..." : "Belum ada deskripsi"}
              />
            </div>
          </div>

=======
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
>>>>>>> 77e6c2b176af517e26347389d6172186670b99c9
        </main>
      </div>
    </div>
  );
}

<<<<<<< HEAD
function InputField({ label, value, onChange, disabled, icon }: any) {
  return (
    <div>
      <label className="text-sm font-bold text-[#0F2F2E] mb-2 block">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange && onChange(e.target.value)}
          disabled={disabled}
          className={`w-full px-4 py-3 rounded-xl border outline-none transition font-medium text-sm
                        ${icon ? 'pl-10' : ''}
                        ${disabled
              ? 'bg-[#F8FAFC] border-transparent text-[#64748B] cursor-not-allowed'
              : 'bg-white border-[#B2F5EA] text-[#0F2F2E] focus:border-[#40E0D0] focus:ring-2 focus:ring-[#CCFBF1]'
            }
                    `}
        />
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
=======
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
>>>>>>> 77e6c2b176af517e26347389d6172186670b99c9
}
