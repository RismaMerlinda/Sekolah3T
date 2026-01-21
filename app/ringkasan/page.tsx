'use client';

import { useEffect, useState } from 'react';
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
  Menu,
  X,
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

export default function RingkasanPage() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [verified, setVerified] = useState<boolean | null>(null);
  const [officialSchool, setOfficialSchool] = useState<any>(null);
  const [openSidebar, setOpenSidebar] = useState(false);

  const [summary, setSummary] = useState({
    totalDonatur: 0,
    sisaHari: 0,
    targetDana: 0,
    danaTerkumpul: 0,
    danaTerpakai: 0,
    status: 'Draft',
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      window.location.href = '/login';
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    if (parsedUser.npsn) {
      verifySchool(parsedUser.npsn);
    }

    setSummary({
      totalDonatur: 0,
      sisaHari: 0,
      targetDana: 0,
      danaTerkumpul: 0,
      danaTerpakai: 0,
      status: 'Draft',
    });
  }, []);

  const verifySchool = async (npsn: string) => {
    try {
      const res = await fetch(`https://api.fazriansyah.eu.org/v1/sekolah?npsn=${npsn}`);
      const json = await res.json();

      if (json?.data?.satuanPendidikan) {
        setVerified(true);
        setOfficialSchool(json.data.satuanPendidikan);
      } else {
        setVerified(false);
      }
    } catch {
      setVerified(false);
    }
  };

  if (!user) {
    return (
      <div className="p-10 text-sm text-[#6B8E8B]">
        Memuat data akun...
      </div>
    );
  }

  const schoolName = officialSchool?.nama || user.schoolName || 'Sekolah';

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

      {/* ================= MAIN ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar user={user} onMenu={() => setOpenSidebar(true)} />

        <main className="flex-1 p-4 md:p-6 lg:p-10">
          <div className="max-w-6xl mx-auto space-y-8">
            <div>
              <h1 className="text-2xl font-bold text-[#0F2F2E]">Ringkasan Kampanye</h1>
              <p className="text-sm text-[#4A6F6C]">Pemantauan data transaksi kampanye</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SummaryCard title="Jumlah Donatur" value={summary.totalDonatur} suffix="Donatur" />
              <SummaryCard title="Sisa Hari Kampanye" value={summary.sisaHari} suffix="Hari" />
              <SummaryCard title="Target Dana" value={`Rp ${summary.targetDana.toLocaleString('id-ID')}`} />
              <SummaryCard title="Total Dana Terkumpul" value={`Rp ${summary.danaTerkumpul.toLocaleString('id-ID')}`} />
              <SummaryCard title="Dana Terpakai" value={`Rp ${summary.danaTerpakai.toLocaleString('id-ID')}`} />
              <StatusCard status={summary.status} />
            </div>

            <Card title="Grafik Progress Dana">
              <div className="h-48 flex items-center justify-center text-[#6B8E8B] text-sm">
                Grafik akan muncul setelah terdapat transaksi dana
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

function MenuLink({ href, icon, label, active, onClick }: any) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${active
          ? 'bg-[#CCFBF1] text-[#1E8F86] font-medium'
          : 'text-[#4A6F6C] hover:bg-[#E6FFFA] hover:text-[#40E0D0]'
        }`}
    >
      {icon}
      {label}
    </Link>
  );
}

function SummaryCard({ title, value, suffix }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-[#B2F5EA]">
      <p className="text-sm text-[#4A6F6C]">{title}</p>
      <p className="text-3xl font-bold text-[#0F2F2E] mt-2">
        {value} {suffix && <span className="text-base">{suffix}</span>}
      </p>
    </div>
  );
}

function StatusCard({ status }: any) {
  const map: any = {
    Draft: 'text-[#6B8E8B]',
    Ditinjau: 'text-[#F59E0B]',
    Publik: 'text-[#22C55E]',
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-[#B2F5EA]">
      <p className="text-sm text-[#4A6F6C] mb-4">Status Kampanye</p>
      <div className="flex items-center justify-center h-24">
        <span className={`text-lg font-semibold ${map[status]}`}>{status}</span>
      </div>
      <div className="flex justify-center gap-4 text-xs text-[#6B8E8B]">
        <span>Draft</span>
        <span>Ditinjau</span>
        <span>Publik</span>
      </div>
    </div>
  );
}

function Card({ title, children }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-[#B2F5EA]">
      <h2 className="font-semibold text-[#0F2F2E] mb-4">{title}</h2>
      {children}
    </div>
  );
}
