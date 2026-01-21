'use client';

import React, { useState } from 'react';

interface DonationFormProps {
  campaignId: string;
  campaignTitle: string;
  onSubmit?: (amount: number) => void;
  isLoading?: boolean;
}

type PaymentMethod = 'qris' | 'bank' | 'gopay' | 'ovo' | 'dana' | null;

import { submitDonationSimulation } from '@/lib/donor-api';

export const DonationForm: React.FC<DonationFormProps> = ({
  campaignId,
  campaignTitle,
  onSubmit,
  isLoading: propLoading = false,
}) => {
  const [amount, setAmount] = useState<string>('');
  const [donorName, setDonorName] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string>('');
  const [isInternalLoading, setIsInternalLoading] = useState(false);

  const isLoading = propLoading || isInternalLoading;

  const predefinedAmounts = [50000, 100000, 250000, 500000, 1000000];

  const paymentMethods = [
    { id: 'qris' as PaymentMethod, name: 'QRIS' },
    { id: 'bank' as PaymentMethod, name: 'Transfer Bank' },
    { id: 'gopay' as PaymentMethod, name: 'GoPay' },
    { id: 'ovo' as PaymentMethod, name: 'OVO' },
    { id: 'dana' as PaymentMethod, name: 'DANA' },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setAmount(value);
    setError('');
  };

  const handlePredefinedAmount = (value: number) => {
    setAmount(value.toString());
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!donorName.trim()) {
      setError('Nama pendonor harus diisi');
      return;
    }

    if (!amount || parseInt(amount) <= 0) {
      setError('Jumlah donasi harus lebih dari 0');
      return;
    }

    if (parseInt(amount) < 10000) {
      setError('Jumlah donasi minimal Rp 10.000');
      return;
    }

    if (!paymentMethod) {
      setError('Pilih metode pembayaran');
      return;
    }

    setIsInternalLoading(true);

    try {
      await submitDonationSimulation(campaignId, donorName, parseInt(amount));

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      onSubmit?.(parseInt(amount));

      // Reset form after 4 seconds
      setTimeout(() => {
        setAmount('');
        setDonorName('');
        setPaymentMethod(null);
        setSubmitted(false);
      }, 4000);
    } catch (err: any) {
      setError(err.message || 'Gagal mengirim donasi. Silakan coba lagi.');
    } finally {
      setIsInternalLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-[#E6FFFA] border-2 border-green-200 rounded-lg p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <h3 className="text-xl font-bold text-green-700 mb-2">
          Pembayaran Berhasil! 🎉
        </h3>
        <p className="text-green-600 mb-3">
          Donasi Anda sebesar{' '}
          <span className="font-bold text-lg">{formatCurrency(parseInt(amount))}</span>
        </p>
        <p className="text-sm text-green-600 mb-2">
          telah berhasil diproses melalui <span className="font-semibold">{paymentMethods.find(m => m.id === paymentMethod)?.name}</span>
        </p>
        <p className="text-xs text-green-600">
          Terima kasih telah mendukung pendidikan di daerah 3T! ❤️
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border-2 border-[#B2F5EA] p-6 shadow-lg">
      <h3 className="text-xl font-bold text-[#0F2F2E] mb-6">Donasi Sekarang</h3>

      {/* Donor Name */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-[#0F2F2E] mb-2">
          Nama Pendonor
        </label>
        <input
          type="text"
          value={donorName}
          onChange={(e) => setDonorName(e.target.value)}
          placeholder="Masukkan nama Anda"
          className="w-full px-4 py-3 border-2 border-[#B2F5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40E0D0] focus:border-transparent transition-all"
          disabled={isLoading}
        />
      </div>

      {/* Predefined Amounts */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-[#0F2F2E] mb-2">
          Pilih Jumlah Donasi
        </label>
        <div className="grid grid-cols-2 gap-2">
          {predefinedAmounts.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handlePredefinedAmount(preset)}
              className={`p-3 rounded-lg font-semibold text-sm transition-all ${amount === preset.toString()
                ? 'bg-gradient-to-r from-[#40E0D0] to-[#2CB1A6] text-white shadow-lg scale-105'
                : 'bg-[#E6FFFA] text-[#2CB1A6] hover:bg-[#CCFBF1] hover:scale-105'
                }`}
              disabled={isLoading}
            >
              {formatCurrency(preset)}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Amount */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-[#0F2F2E] mb-2">
          Atau Masukkan Jumlah Lain
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#4A6F6C] font-semibold">
            Rp
          </span>
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="0"
            className="w-full pl-12 pr-4 py-3 border-2 border-[#B2F5EA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40E0D0] focus:border-transparent transition-all text-lg font-semibold"
            disabled={isLoading}
          />
        </div>
        {amount && (
          <p className="mt-2 text-sm text-[#4A6F6C]">
            Total: <span className="font-bold text-[#40E0D0] text-lg">{formatCurrency(parseInt(amount) || 0)}</span>
          </p>
        )}
      </div>

      {/* Payment Method Selection */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-[#0F2F2E] mb-2">
          Metode Pembayaran
        </label>
        <div className="grid grid-cols-2 gap-2">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => setPaymentMethod(method.id)}
              className={`p-3 rounded-lg font-semibold text-sm transition-all ${paymentMethod === method.id
                ? 'bg-gradient-to-r from-[#40E0D0] to-[#2CB1A6] text-white shadow-lg scale-105'
                : 'bg-[#E6FFFA] text-[#2CB1A6] hover:bg-[#CCFBF1] hover:scale-105'
                }`}
              disabled={isLoading}
            >
              <span>{method.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border-2 border-red-200 rounded-lg flex gap-2">
          <span className="text-red-600 text-sm flex items-center">
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              />
            </svg>
            {error}
          </span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 bg-gradient-to-r from-[#40E0D0] to-[#2CB1A6] text-white font-bold rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
      >
        {isLoading ? 'Memproses...' : '💳 Lanjutkan Pembayaran'}
      </button>
    </form>
  );
};
