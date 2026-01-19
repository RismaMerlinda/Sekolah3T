'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      alert('akun belum terdaftar');
      return;
    }

    const user = JSON.parse(storedUser);

    if (form.email === user.email) {
      alert('login berhasil');
      window.location.href = '/dashboard';
    } else {
      alert('email tidak terdaftar');
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#EDF2F7]">

      {/* LEFT SECTION */}
      <div className="px-8 py-12 md:p-16 flex flex-col justify-between">
        <div className="bg-white px-6 py-3 rounded-full w-fit shadow font-semibold">
          ★ LOGO
        </div>

        <div className="mt-12">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight text-gray-800">
            Selamat Datang di Platform <br />
            Crowdfunding Sekolah 3T
          </h1>

          <p className="text-gray-600 mt-4 max-w-md">
            Platform transparan untuk membantu sekolah di wilayah 3T
            membangun fasilitas pendidikan secara berkelanjutan.
          </p>

          <div className="mt-10 w-64 h-40 bg-white rounded-xl shadow flex items-center justify-center text-gray-400">
            📷 Ilustrasi
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center justify-center px-6 py-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-5"
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Masuk ke Akun Anda
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Bersama, Hadirkan Harapan untuk Pendidikan
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              E-mail
            </label>
            <input
              name="email"
              type="email"
              onChange={handleChange}
              placeholder="Masukkan E-mail Anda"
              required
              className="w-full mt-2 px-4 py-3 rounded-xl bg-[#EDF2F7] text-sm
                         focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Kata Sandi
            </label>
            <input
              name="password"
              type="password"
              onChange={handleChange}
              placeholder="Masukkan Password Anda"
              className="w-full mt-2 px-4 py-3 rounded-xl bg-[#EDF2F7] text-sm
                         focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-3 rounded-full
                       font-semibold hover:bg-gray-800 transition"
          >
            Masuk
          </button>

          <p className="text-center text-sm text-gray-600 pt-4">
            Belum punya akun?{' '}
            <a
              href="/register"
              className="font-semibold text-gray-900 hover:underline"
            >
              Daftar
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
