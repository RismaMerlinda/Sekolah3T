'use client';

import { useEffect, useState } from 'react';
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
    Image as ImageIcon,
    PlusCircle,
    CheckCircle,
    XCircle,
    Menu,
    X,
    Bell,
    Download,
    File,
    ChevronRight,
    AlertCircle,
    Timer,
    Loader2
} from 'lucide-react';

/* ================= TOP NAVBAR ================= */
function TopNavbar({ user, onMenu }: any) {
    const avatarLetter =
        typeof user?.schoolName === 'string'
            ? user.schoolName.charAt(0).toUpperCase()
            : 'S';

    return (
        <div className="h-16 bg-white px-4 md:px-8 flex items-center justify-between border-b border-[#B2F5EA] sticky top-0 z-40 shadow-sm">
            <button
                onClick={onMenu}
                className="lg:hidden mr-4 text-[#1E8F86] hover:text-[#176F68] transition"
            >
                <Menu size={24} />
            </button>

            <div className="hidden sm:flex flex-1 justify-start">
                <div className="relative w-full max-w-md">
                    <input
                        type="text"
                        placeholder="Cari kampanye atau laporan..."
                        className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] rounded-full text-sm outline-none focus:ring-2 focus:ring-[#40E0D0] border border-transparent focus:border-[#B2F5EA] transition"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B8E8B]">
                        🔍
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="relative text-[#6B8E8B] hover:text-[#1E8F86] transition">
                    <Bell size={20} />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#EF4444] rounded-full border-2 border-white"></span>
                </button>

                <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => (window.location.href = '/profil')}
                >
                    <div className="w-9 h-9 bg-[#40E0D0] text-white rounded-full flex items-center justify-center font-semibold shadow-sm">
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
        </div>
    );
}

export default function DashboardPage() {
    const pathname = usePathname();
    const router = useRouter();

    const [user, setUser] = useState<any>(null);
    const [verified, setVerified] = useState<boolean | null>(null);
    const [officialSchool, setOfficialSchool] = useState<any>(null);
    const [openSidebar, setOpenSidebar] = useState(false);

    // DASHBOARD STATES
    const [isLoading, setIsLoading] = useState(true);
    const [dashboardState, setDashboardState] = useState<'empty' | 'pending' | 'approved' | 'error'>('empty');
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!storedUser || !token) {
            window.location.href = '/login';
            return;
        }

        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        if (parsedUser.npsn) {
            verifySchool(parsedUser.npsn);
        }

        fetchDashboardData(token);
    }, []);

    const verifySchool = async (npsn: string) => {
        try {
            const res = await fetch(
                `https://api.fazriansyah.eu.org/v1/sekolah?npsn=${npsn}`
            );
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

    const fetchDashboardData = async (token: string) => {
        try {
            setIsLoading(true);
            const res = await fetch('http://localhost:5000/api/dashboard', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) {
                throw new Error('Failed to fetch data');
            }

            const json = await res.json();

            // Backend returns { state: 'empty' | 'pending' | 'approved', ...data }
            setDashboardState(json.state || 'empty');
            setData(json);

        } catch (error) {
            console.error('Error fetching dashboard:', error);
            setDashboardState('error');
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return null;

    const schoolName = officialSchool?.nama || user.schoolName || 'Sekolah';

    /* ============ RENDER LOGIC ============ */

    // Loading State
    if (isLoading) {
        return (
            <div className="min-h-screen flex bg-[#F8FAFC]">
                {/* SIDEBAR PLACEHOLDER */}
                <aside className="hidden lg:block w-64 bg-white border-r border-[#B2F5EA]"></aside>
                <div className="flex-1 flex flex-col">
                    <TopNavbar user={user} onMenu={() => setOpenSidebar(true)} />
                    <div className="flex-1 flex justify-center items-center">
                        <div className="flex flex-col items-center gap-3 text-[#6B8E8B]">
                            <Loader2 className="animate-spin text-[#40E0D0]" size={32} />
                            <p className="text-sm">Memuat Dashboard...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Helper for currency formatting
    const formatIDR = (num: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num || 0);
    };

    return (
        <div className="min-h-screen flex bg-[#F8FAFC]">
            {/* BACKDROP MOBILE */}
            {openSidebar && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setOpenSidebar(false)}
                />
            )}

            {/* ================= SIDEBAR ================= */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white px-6 py-6 flex flex-col justify-between border-r border-[#B2F5EA] transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${openSidebar ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <button
                    onClick={() => setOpenSidebar(false)}
                    className="absolute top-4 right-4 lg:hidden text-[#6B8E8B] hover:text-[#EF4444]"
                >
                    <X size={24} />
                </button>

                <div>
                    <div className="mb-10 px-2">
                        <h1 className="text-xl font-bold text-[#1E8F86] truncate tracking-tight">
                            {schoolName}
                        </h1>

                        {verified === true && (
                            <p className="text-xs text-[#22C55E] flex items-center gap-1 mt-1 font-medium">
                                <CheckCircle size={14} /> Terverifikasi Kemendikbud
                            </p>
                        )}
                        {verified === false && (
                            <p className="text-xs text-[#EF4444] flex items-center gap-1 mt-1 font-medium">
                                <XCircle size={14} /> Belum Terverifikasi
                            </p>
                        )}
                    </div>

                    <nav className="space-y-1.5 text-sm">
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
                    className="flex items-center gap-2 text-sm text-[#6B8E8B] hover:text-[#EF4444] px-4 py-2 transition"
                >
                    <LogOut size={18} /> Logout
                </button>
            </aside>

            {/* ================= MAIN CONTENT ================= */}
            <div className="flex-1 flex flex-col min-w-0">
                <TopNavbar user={user} onMenu={() => setOpenSidebar(true)} />

                <main className="flex-1 p-4 md:p-8 max-w-[1600px] mx-auto w-full">

                    {/* STATS ROW */}
                    {/* Always visible but values depend on state */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <StatCard
                            title="Target Dana"
                            value={dashboardState === 'approved' ? formatIDR(data?.pengajuan?.targetDana) : "Rp 0"}
                            color="primary"
                        />
                        <StatCard
                            title="Dana Terkumpul"
                            value={dashboardState === 'approved' ? formatIDR(0) : "Rp 0"} // Backend summary not ready yet, default 0
                            color="primary"
                            highlight={dashboardState === 'approved'}
                        />
                        <StatCard
                            title="Dana Digunakan"
                            value="Rp 0"
                            color="primary"
                        />
                        <StatCard
                            title="Status Kampanye"
                            value={dashboardState === 'approved' ? 'Aktif' : (dashboardState === 'pending' ? 'Menunggu' : 'Belum Ada')}
                            badge={dashboardState === 'approved' ? 'Publik' : (dashboardState === 'pending' ? 'Pending' : null)}
                            color="gray"
                        />
                    </div>

                    {/* 1. EMPTY STATE */}
                    {dashboardState === 'empty' && (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-[#B2F5EA] text-center shadow-sm">
                            <div className="p-4 bg-[#E6FFFA] rounded-full mb-6">
                                <PlusCircle size={48} className="text-[#1E8F86]" />
                            </div>
                            <h2 className="text-xl font-bold text-[#0F2F2E] mb-2">Belum Ada Kegiatan</h2>
                            <p className="text-[#6B8E8B] max-w-md mb-8 leading-relaxed">
                                Anda belum mengajukan kegiatan apa pun. Silakan ajukan kegiatan terlebih dahulu untuk memulai kampanye bantuan.
                            </p>
                            <button
                                onClick={() => router.push('/pengajuan')}
                                className="px-8 py-3 bg-[#40E0D0] hover:bg-[#2CB1A6] text-white font-semibold rounded-xl transition shadow-lg shadow-[#40E0D0]/20 flex items-center gap-2"
                            >
                                <PlusCircle size={20} /> Ajukan Kegiatan
                            </button>
                        </div>
                    )}

                    {/* 2. PENDING STATE */}
                    {dashboardState === 'pending' && (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-[#B2F5EA] text-center shadow-sm">
                            <div className="p-4 bg-[#FEF3C7] rounded-full mb-6 animate-pulse">
                                <Timer size={48} className="text-[#D97706]" />
                            </div>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 bg-[#FEF3C7] text-[#D97706] rounded-full text-xs font-bold uppercase tracking-wider">
                                <AlertCircle size={14} /> Menunggu Verifikasi Admin
                            </div>
                            <h2 className="text-xl font-bold text-[#0F2F2E] mb-2">Pengajuan Sedang Diverifikasi</h2>
                            <p className="text-[#6B8E8B] max-w-md mb-8 leading-relaxed">
                                Pengajuan <strong>"{data?.status ? 'Kegiatan Baru' : 'Kegiatan'}"</strong> Anda sedang ditinjau. Dashboard akan aktif secara otomatis setelah disetujui.
                            </p>
                            <div className="w-full max-w-sm h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                                <div className="h-full bg-[#D97706] w-2/3 rounded-full animate-[shimmer_1s_infinite]"></div>
                            </div>
                            <p className="text-xs text-[#94A3B8] mt-3">Mohon periksa status secara berkala</p>
                        </div>
                    )}

                    {/* 3. APPROVED / ERROR STATE */}
                    {(dashboardState === 'approved') && (
                        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-[1.8fr_2.4fr_1.3fr] gap-6 items-start">

                            {/* LEFT COLUMN */}
                            <div className="space-y-6 flex flex-col">
                                <Card title="Kampanye Aktif" action="Detail">
                                    <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#B2F5EA]">
                                        <div className="h-32 bg-[#E2E8F0] rounded-lg mb-4 flex items-center justify-center text-[#6B8E8B]">
                                            <ImageIcon size={32} />
                                        </div>
                                        <h3 className="font-bold text-[#0F2F2E] mb-1">{data?.pengajuan?.judul || 'Judul Kegiatan'}</h3>
                                        <p className="text-xs text-[#6B8E8B] mb-3 line-clamp-2">{data?.pengajuan?.deskripsi || 'Tidak ada deskripsi'}</p>

                                        <div className="w-full bg-[#E2E8F0] rounded-full h-2 mb-2">
                                            <div className="bg-[#40E0D0] h-2 rounded-full w-[0%]"></div>
                                        </div>
                                        <div className="flex justify-between text-xs font-medium">
                                            <span className="text-[#40E0D0]">0% Terkumpul</span>
                                            <span className="text-[#6B8E8B]">0 / {formatIDR(data?.pengajuan?.targetDana)}</span>
                                        </div>
                                    </div>
                                </Card>

                                <Card title="Galeri & Dokumen" action="Lihat Semua">
                                    {data?.documents && data?.documents.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-3">
                                            {data.documents.slice(0, 4).map((doc: any, i: number) => (
                                                <div key={i} className="aspect-square bg-[#E6FFFA] rounded-xl flex items-center justify-center border border-[#CCFBF1] relative group cursor-pointer overflow-hidden">
                                                    <FileText className="text-[#2CB1A6]" size={24} />
                                                    <span className="absolute bottom-2 text-[10px] text-[#1E8F86] bg-white/80 px-2 py-0.5 rounded-full">{doc.fileType?.split('/')[1] || 'FILE'}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-8 text-center text-sm text-[#6B8E8B] bg-[#F8FAFC] rounded-xl border border-dashed border-[#B2F5EA]">
                                            Belum ada dokumen
                                        </div>
                                    )}
                                    <button
                                        className="w-full mt-4 py-2 text-sm text-[#1E8F86] font-medium bg-[#E6FFFA] rounded-lg hover:bg-[#CCFBF1] transition"
                                        onClick={() => router.push('/timeline')}
                                    >
                                        Upload Dokumentasi
                                    </button>
                                </Card>
                            </div>

                            {/* CENTER COLUMN: TIMELINE */}
                            <div className="lg:col-span-1 space-y-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="font-bold text-lg text-[#0F2F2E]">Timeline Kegiatan</h2>
                                    <button
                                        onClick={() => router.push('/timeline')}
                                        className="text-sm text-[#40E0D0] font-medium hover:underline flex items-center gap-1"
                                    >
                                        Lihat Semua <ChevronRight size={16} />
                                    </button>
                                </div>

                                <div className="space-y-6 relative pl-2 min-h-[200px]">
                                    {data?.timeline && data.timeline.length > 0 ? (
                                        <>
                                            <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-[#B2F5EA] z-0"></div>
                                            {data.timeline.map((act: any, idx: number) => (
                                                <div key={idx} className="relative z-10 pl-8">
                                                    <div className="absolute left-[13px] top-1.5 w-3.5 h-3.5 bg-[#40E0D0] rounded-full border-2 border-white shadow-sm"></div>

                                                    <div className="bg-white p-5 rounded-2xl border border-[#B2F5EA] shadow-sm hover:shadow-md transition">
                                                        <div className="flex justify-between items-start mb-3">
                                                            <div>
                                                                <span className="text-xs font-semibold text-[#6B8E8B] bg-[#F1F5F9] px-2 py-1 rounded inline-block mb-1.5">
                                                                    {new Date(act.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                                                </span>
                                                                <h3 className="font-bold text-[#0F2F2E] text-base leading-tight">
                                                                    {act.kegiatan}
                                                                </h3>
                                                            </div>
                                                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border 
                                                                ${act.disetujui
                                                                    ? 'bg-[#E6FFFA] text-[#1E8F86] border-[#B2F5EA]'
                                                                    : 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]'
                                                                }`}
                                                            >
                                                                {act.disetujui ? 'Disetujui' : 'Menunggu'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        <div className="py-10 text-center text-sm text-[#6B8E8B] bg-white rounded-xl border border-dashed border-[#B2F5EA]">
                                            Belum ada timeline kegiatan
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* RIGHT COLUMN: WIDGETS */}
                            <div className="space-y-6 lg:sticky lg:top-[88px]">
                                <Card title="Transparansi Dana">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-sm border-b border-[#F1F5F9] pb-3">
                                            <span className="text-[#6B8E8B]">Terkumpul</span>
                                            <span className="font-bold text-[#1E8F86]">+ Rp 0</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm border-b border-[#F1F5F9] pb-3">
                                            <span className="text-[#6B8E8B]">Terpakai</span>
                                            <span className="font-bold text-[#EF4444]">- Rp 0</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm pt-1">
                                            <span className="font-semibold text-[#0F2F2E]">Sisa Dana</span>
                                            <span className="font-bold text-[#0F2F2E]">Rp 0</span>
                                        </div>
                                    </div>
                                    <button className="w-full mt-5 py-2 text-xs font-bold text-white bg-[#40E0D0] rounded-lg hover:bg-[#2CB1A6] transition shadow-md shadow-[#40E0D0]/20">
                                        Unduh Laporan Keuangan
                                    </button>
                                </Card>

                                <Card title="Notifikasi" className="max-h-[400px] overflow-y-auto">
                                    {data.notifications && data.notifications.length > 0 ? (
                                        <div className="space-y-4">
                                            {data.notifications.map((notif: any, i: number) => (
                                                <div key={i} className="flex gap-3 items-start pb-3 border-b border-[#F1F5F9] last:border-0 last:pb-0">
                                                    <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${notif.type === 'success' ? 'bg-[#22C55E]' : 'bg-[#3B82F6]'}`}></div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-[#0F2F2E] leading-tight mb-0.5">{notif.title}</p>
                                                        <p className="text-[10px] text-[#94A3B8]">{notif.time}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-[#6B8E8B] text-center py-4">Belum ada notifikasi</p>
                                    )}
                                </Card>
                            </div>

                        </div>
                    )}

                    {/* 4. ERROR STATE */}
                    {dashboardState === 'error' && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <XCircle size={48} className="text-[#EF4444] mb-4" />
                            <h2 className="text-lg font-bold text-[#0F2F2E]">Gagal Memuat Dashboard</h2>
                            <p className="text-[#6B8E8B] mb-4">Terjadi kesalahan saat menghubungi server.</p>
                            <button onClick={() => window.location.reload()} className="text-[#40E0D0] hover:underline">Muat Ulang</button>
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
}

/* ================= COMPONENT HELPERS ================= */

function MenuLink({ href, icon, label, active, onClick }: any) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-sm
      ${active
                    ? 'bg-[#E6FFFA] text-[#1E8F86]'
                    : 'text-[#6B8E8B] hover:bg-[#F1F5F9] hover:text-[#40E0D0]'
                }`}
        >
            {icon}
            {label}
        </Link>
    );
}


function StatCard({ title, value, badge, color, highlight }: any) {
    return (
        <div className={`p-5 rounded-2xl border transition hover:shadow-md
            ${highlight ? 'bg-[#40E0D0] border-[#40E0D0] text-white' : 'bg-white border-[#B2F5EA]'}
        `}>
            <p className={`text-xs font-medium mb-1 ${highlight ? 'text-white/80' : 'text-[#6B8E8B]'}`}>
                {title}
            </p>
            <div className="flex items-center justify-between">
                <p className={`text-lg font-bold ${highlight ? 'text-white' : 'text-[#0F2F2E]'}`}>
                    {value}
                </p>
                {badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#64748B]">
                        {badge}
                    </span>
                )}
            </div>
        </div>
    );
}

function Card({ title, children, action, className }: any) {
    return (
        <div className={`bg-white p-5 rounded-2xl border border-[#B2F5EA] shadow-sm ${className}`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-[#1E8F86] text-base">{title}</h3>
                {action && <button className="text-xs text-[#6B8E8B] hover:text-[#40E0D0] font-medium transition">{action}</button>}
            </div>
            {children}
        </div>
    );
}
