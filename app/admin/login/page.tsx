"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function AdminLoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Reset error when user types
    if (error) setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // ✅ DEMO ADMIN (hardcoded)
    const ADMIN = {
      email: "admin@sahabat3t.id",
      password: "admin123",
    };

    if (
      form.email.trim().toLowerCase() === ADMIN.email &&
      form.password === ADMIN.password
    ) {
      // ✅ SUCCESS FLOW
      setSuccess(true);
      localStorage.setItem("admin_auth", "true");

      // Delay redirect to show the nice toast
      setTimeout(() => {
        window.location.href = "/admin/dashboard";
      }, 1500);
    } else {
      // ❌ ERROR FLOW
      setError("Email atau password admin salah");
    }
  };

  return (
    <div className="min-h-screen bg-[#E6FFFA] relative">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-[#40E0D0]/25 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-[#2CB1A6]/25 blur-3xl" />
      </div>

      {/* ✅ SUCCESS TOAST NOTIFICATION */}
      {success && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-slide-down">
          <div className="flex items-center gap-4 rounded-2xl bg-[#0F2F2E] px-6 py-4 text-white shadow-2xl border border-[#40E0D0]/40">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#22C55E]/20 text-[#22C55E] ring-1 ring-[#22C55E]/40">
              <CheckIcon />
            </div>
            <div>
              <div className="text-base font-bold text-white">Login Berhasil</div>
              <div className="text-xs text-[#B2F5EA]/80 mt-0.5">
                Mengalihkan ke dashboard...
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT */}
        <aside className="relative overflow-hidden border-b lg:border-b-0 lg:border-r border-[#B2F5EA]">
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-[#E6FFFA] to-[#CCFBF1]" />

          <div className="relative px-6 sm:px-10 py-10 lg:py-14 h-full flex flex-col justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-white/80
                         border border-[#B2F5EA] px-4 py-2 shadow-sm
                         hover:shadow-md transition"
            >
              <span className="h-2 w-2 rounded-full bg-[#40E0D0]" />
              <span className="font-extrabold text-[#0F2F2E] tracking-tight">
                Sahabat<span className="text-[#2CB1A6]">3T</span>
                <span className="ml-2 text-xs font-bold text-[#1E8F86]">
                  Admin
                </span>
              </span>
            </Link>

            <div className="mt-10 max-w-lg">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F2F2E] leading-tight">
                Admin Portal
              </h1>
              <p className="mt-3 text-sm sm:text-base text-[#4A6F6C]">
                Kelola data dan aktivitas platform.
              </p>

              <div className="mt-8 max-w-sm">
                <Image
                  src="/assets/LoginAdmin.png"
                  alt="Ilustrasi admin"
                  width={420}
                  height={320}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>

            <p className="text-xs text-[#4A6F6C]">
              Akses terbatas untuk administrator.
            </p>
          </div>
        </aside>

        {/* RIGHT */}
        <main className="flex items-center justify-center px-4 sm:px-6 py-10 lg:py-14">
          <div className="w-full max-w-md">
            <div
              className="rounded-3xl bg-white/75 border border-[#B2F5EA]
                         shadow-xl shadow-[#40E0D0]/15 overflow-hidden"
            >
              <div className="h-2 bg-gradient-to-r from-[#40E0D0] via-[#2CB1A6] to-[#1E8F86]" />

              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F2F2E]">
                    Masuk Admin
                  </h2>
                  <p className="mt-1 text-sm text-[#4A6F6C]">
                    Gunakan kredensial admin.
                  </p>
                </div>

                {/* ERROR ALERT */}
                {error && (
                  <div className="rounded-xl bg-[#FEF2F2] border border-[#FECACA] p-3 flex items-start gap-3 animate-fade-in">
                    <div className="text-[#EF4444] mt-0.5"><AlertCircleIcon /></div>
                    <div className="text-sm font-semibold text-[#B91C1C]">{error}</div>
                  </div>
                )}

                {/* EMAIL */}
                <div>
                  <label className="text-sm font-semibold text-[#0F2F2E]">
                    E-mail
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Masukkan e-mail"
                    className="
                      w-full mt-1 rounded-xl bg-white/90
                      px-4 py-3 text-sm
                      border border-[#B2F5EA]
                      focus:outline-none focus:ring-4 focus:ring-[#40E0D0]/25
                      transition hover:border-[#40E0D0]
                    "
                  />
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="text-sm font-semibold text-[#0F2F2E]">Password</label>

                  <div className="relative mt-1">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}  // showPassword=true => terlihat
                      required
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Masukkan password"
                      className="
                        w-full rounded-xl bg-white/90
                        px-4 py-3 pr-12 text-sm
                        border border-[#B2F5EA]
                        focus:outline-none focus:ring-4 focus:ring-[#40E0D0]/25
                        transition hover:border-[#40E0D0]
                    "
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="
                        absolute right-3 top-1/2 -translate-y-1/2
                        rounded-lg p-2
                        text-[#6B8E8B] hover:text-[#0F2F2E]
                        hover:bg-black/5 transition
                    "
                      aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                    >
                      {/* hidden -> EyeOpen, visible -> EyeSlash */}
                      {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={success} // prevent double submit
                  className="
                    w-full rounded-full py-3 font-semibold text-white
                    bg-gradient-to-r from-[#40E0D0] to-[#2CB1A6]
                    shadow-lg shadow-[#40E0D0]/35
                    hover:scale-[1.02] active:scale-95 transition
                    disabled:opacity-80 disabled:cursor-not-allowed
                  "
                >
                  {success ? "Memproses..." : "Masuk"}
                </button>

                <p className="text-center text-xs text-[#6B8E8B]">
                  Akses admin terbatas.
                </p>

              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ICONS */

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M12 15a3 3 0 1 0-3-3 3 3 0 0 0 3 3Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 3l18 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 2.4-4.4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M6.1 6.3C3.4 8.2 2 12 2 12s3.5 7 10 7c2 0 3.7-.6 5.1-1.4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9.9 5.3A10.6 10.6 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
  );
}

function AlertCircleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
  );
}
