'use client';

import React from 'react';

const TRUST_POINTS = [
  {
    icon: '✓',
    title: 'Sekolah Terverifikasi',
    description: 'Semua sekolah telah melalui verifikasi menyeluruh dari admin kami.',
  },
  {
    icon: '📊',
    title: 'Transparansi 100%',
    description:
      'Setiap donasi dilacak dan dilaporkan secara transparan kepada pendonor.',
  },
  {
    icon: '💰',
    title: 'Tanpa Biaya Platform',
    description: 'Semua dana Anda langsung masuk untuk program pendidikan.',
  },
  {
    icon: '📱',
    title: 'Laporan Berkala',
    description:
      'Terima update rutin tentang perkembangan dan dampak donasi Anda.',
  },
];

export const TrustSection: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-[#E6FFFA]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#0F2F2E] mb-4">
            Mengapa Percaya SAHABAT3T?
          </h2>
          <p className="text-lg text-[#4A6F6C] max-w-2xl mx-auto">
            Kami berkomitmen pada transparansi penuh dan akuntabilitas untuk memastikan
            setiap donasi Anda benar-benar membantu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_POINTS.map((point, idx) => (
            <div
              key={idx}
              className="p-6 bg-white rounded-lg border-2 border-[#B2F5EA] hover:shadow-lg hover:border-[#40E0D0] transition-all duration-300"
            >
              <div className="text-4xl mb-4">{point.icon}</div>
              <h3 className="text-lg font-bold text-[#0F2F2E] mb-2">
                {point.title}
              </h3>
              <p className="text-sm text-[#4A6F6C]">{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
