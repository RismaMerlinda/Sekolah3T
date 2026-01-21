'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export const DonorHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b-2 border-[#B2F5EA] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/donor" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-[#40E0D0] to-[#2CB1A6] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">S3T</span>
          </div>
          <span className="text-lg font-bold text-[#0F2F2E] hidden sm:inline-block group-hover:text-[#40E0D0] transition-colors">
            SAHABAT3T
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/donor"
            className="text-[#4A6F6C] hover:text-[#40E0D0] font-semibold transition-colors"
          >
            Beranda
          </Link>
          <Link
            href="/donor/campaigns"
            className="text-[#4A6F6C] hover:text-[#40E0D0] font-semibold transition-colors"
          >
            Kampanye
          </Link>
          <Link
            href="/tentang-kami"
            className="text-[#4A6F6C] hover:text-[#40E0D0] font-semibold transition-colors"
          >
            Tentang Kami
          </Link>
          <Link
            href="/transparansi"
            className="text-[#4A6F6C] hover:text-[#40E0D0] font-semibold transition-colors"
          >
            Transparansi
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 hover:bg-[#E6FFFA] rounded-lg transition-colors"
        >
          <svg
            className="w-6 h-6 text-[#0F2F2E]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-[#E6FFFA] border-t-2 border-[#B2F5EA] px-4 py-3 space-y-2">
          <Link
            href="/donor"
            className="block px-3 py-2 text-[#0F2F2E] font-semibold hover:bg-white rounded-lg transition-colors"
          >
            Beranda
          </Link>
          <Link
            href="/donor/campaigns"
            className="block px-3 py-2 text-[#0F2F2E] font-semibold hover:bg-white rounded-lg transition-colors"
          >
            Kampanye
          </Link>
          <Link
            href="/tentang-kami"
            className="block px-3 py-2 text-[#0F2F2E] font-semibold hover:bg-white rounded-lg transition-colors"
          >
            Tentang Kami
          </Link>
          <Link
            href="/transparansi"
            className="block px-3 py-2 text-[#0F2F2E] font-semibold hover:bg-white rounded-lg transition-colors"
          >
            Transparansi
          </Link>
        </nav>
      )}
    </header>
  );
};

export const DonorFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0F2F2E] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-8 md:gap-12 mb-12">
          {/* About */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#40E0D0]">SAHABAT3T</h3>
            <p className="text-gray-300 leading-relaxed max-w-sm">
              Platform crowdfunding yang mendedikasikan diri untuk meningkatkan kualitas
              pendidikan di daerah terpencil, tertinggal, dan terdepan (3T).
            </p>
          </div>

          {/* Menu Matches Header */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#40E0D0]">Menu</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/donor" className="text-gray-300 hover:text-[#40E0D0] transition-colors block w-fit">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/donor/campaigns" className="text-gray-300 hover:text-[#40E0D0] transition-colors block w-fit">
                  Kampanye
                </Link>
              </li>
              <li>
                <Link href="/tentang-kami" className="text-gray-300 hover:text-[#40E0D0] transition-colors block w-fit">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/transparansi" className="text-gray-300 hover:text-[#40E0D0] transition-colors block w-fit">
                  Transparansi
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#40E0D0]">Hubungi Kami</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center gap-3">
                <span className="w-6">📧</span> support@sahabat3t.id
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6">📱</span> +62 (21) 1234 5678
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6">📍</span> Jakarta, Indonesia
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700/50 pt-8 text-center md:text-left">
          <p className="text-gray-400 text-sm">
            © {currentYear} SAHABAT3T. Semua hak dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
};
