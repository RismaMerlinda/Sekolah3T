'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Home,
    ClipboardList,
    BarChart2,
    FileText,
    Clock,
    TrendingUp,
    User,
    LogOut,
    Menu,
    X,
    Upload,
    CheckCircle,
    XCircle,
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
            <div className="hidden sm:flex flex-1 justify-center">
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
export default function PengajuanPage() {
    const pathname = usePathname();
    const router = useRouter();

    const [user, setUser] = useState<any>(null);
    const [officialSchool, setOfficialSchool] = useState<any>(null);
    const [verified, setVerified] = useState<boolean | null>(null);
    const [openSidebar, setOpenSidebar] = useState(false);

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

    if (!user) {
        return (
            <div className="p-6 text-sm text-[#6B8E8B]">
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
                        <MenuLink href="/progress" icon={<TrendingUp size={18} />} label="Progress" active={pathname === '/progres'} onClick={() => setOpenSidebar(false)} />
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

                <main className="flex-1 p-4 md:p-10">
                    <div className="max-w-5xl mx-auto space-y-8">

                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl md:text-3xl font-bold text-[#0F2F2E]">
                                Form Pengajuan
                            </h1>
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="px-4 py-2 bg-[#CCFBF1] text-[#1E8F86] rounded-lg hover:bg-[#bbf0e5] font-medium text-sm transition"
                            >
                                Kembali
                            </button>
                        </div>

                        <Section title="Informasi Umum">
                            <TwoCol>
                                <AutoField label="Nama Kampanye" placeholder="Contoh: Perbaikan Atap Kelas" />
                                <AutoField label="Kategori Kebutuhan" placeholder="Contoh: Infrastruktur, Buku, dll" />
                                <AutoField label="Wilayah Sekolah" placeholder="Contoh: Desa Suka Maju" />
                                <AutoField label="Ringkasan Kampanye" placeholder="Jelaskan secara singkat..." />
                            </TwoCol>
                        </Section>

                        <Section title="Informasi Sekolah">
                            <TwoCol>
                                <AutoField label="Nama Sekolah" value={schoolName} disabled />
                                <AutoField label="Kontak Penanggung Jawab" placeholder="0812..." />
                                <AutoField label="NPSN" value={user.npsn} disabled />
                                <AutoField label="Nama Penanggung Jawab" placeholder="Nama Lengkap" />
                                <AutoField label="Alamat Sekolah" placeholder="Alamat Lengkap Sekolah" />
                                <AutoField label="Alamat Penanggung Jawab" placeholder="Alamat Lengkap" />
                            </TwoCol>
                        </Section>

                        <Section title="Kondisi Awal">
                            <TwoCol>
                                <AutoField label="Latar Belakang" placeholder="Mengapa bantuan ini diperlukan?" />
                                <UploadBox label="Surat Keterangan Sekolah" />
                                <AutoField label="Tujuan Penggalangan Dana" placeholder="Apa yang ingin dicapai?" />
                                <UploadBox label="Proposal Pengajuan" />
                                <AutoField label="Manfaat yang Diharapkan" placeholder="Dampak positif bagi siswa" />
                                <UploadBox label="Foto Kondisi Sekolah" />
                            </TwoCol>
                        </Section>

                        <Section title="Rencana Dana & Waktu">
                            <TwoCol>
                                <AutoField label="Target Dana" placeholder="Contoh: 5000000" />
                                <DateField label="Tanggal Mulai Kegiatan" />
                                <UploadBox label="Rincian Penggunaan Dana" />
                                <DateField label="Tanggal Selesai Kegiatan" />
                            </TwoCol>
                        </Section>

                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                            <button className="px-6 py-2.5 bg-[#CCFBF1] text-[#1E8F86] font-medium rounded-lg hover:bg-[#bbf0e5] transition">
                                Simpan Draft
                            </button>
                            <button className="px-6 py-2.5 bg-[#40E0D0] text-white font-medium rounded-lg hover:bg-[#2CB1A6] transition shadow-lg shadow-[#40E0D0]/20">
                                Kirim Laporan
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
        <div className="bg-white p-6 rounded-xl border border-[#B2F5EA]">
            <h2 className="text-lg font-bold text-[#1E8F86] mb-4">{title}</h2>
            {children}
        </div>
    );
}

function TwoCol({ children }: any) {
    return <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">{children}</div>;
}

function AutoField({ label, value, disabled, placeholder }: any) {
    return (
        <div>
            <label className="text-sm font-medium text-[#0F2F2E] mb-1 block">{label}</label>
            <input
                type="text"
                defaultValue={value}
                disabled={disabled}
                placeholder={placeholder}
                className={`w-full px-4 py-2 rounded-lg outline-none border transition
          ${disabled
                        ? 'bg-gray-50 text-[#6B8E8B] border-gray-200 cursor-not-allowed'
                        : 'bg-[#E6FFFA] text-[#0F2F2E] border-transparent focus:border-[#40E0D0] focus:bg-white focus:ring-2 focus:ring-[#CCFBF1]'
                    }
        `}
            />
        </div>
    );
}

function DateField({ label }: any) {
    return (
        <div>
            <label className="text-sm font-medium text-[#0F2F2E] mb-1 block">{label}</label>
            <input
                type="date"
                className="w-full px-4 py-2 bg-[#E6FFFA] text-[#0F2F2E] rounded-lg outline-none border border-transparent focus:border-[#40E0D0] focus:bg-white focus:ring-2 focus:ring-[#CCFBF1] transition"
            />
        </div>
    );
}

function UploadBox({ label }: any) {
    const ref = useRef<HTMLInputElement>(null);

    return (
        <div>
            <label className="text-sm font-medium text-[#0F2F2E] mb-1 block">{label}</label>
            <div
                onClick={() => ref.current?.click()}
                className="w-full h-[42px] bg-[#E6FFFA] rounded-lg flex items-center gap-3 px-4 cursor-pointer hover:bg-[#CCFBF1] border border-dashed border-[#40E0D0] transition group"
            >
                <Upload size={18} className="text-[#1E8F86] group-hover:scale-110 transition-transform" />
                <span className="text-sm text-[#4A6F6C]">
                    Upload file (JPG, PNG, PDF)
                </span>
            </div>

            <input ref={ref} type="file" hidden />
        </div>
    );
}
