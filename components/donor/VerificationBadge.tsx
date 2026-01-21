'use client';

import React from 'react';

interface VerificationBadgeProps {
  verified: boolean;
  verificationDate?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  verified,
  verificationDate,
  size = 'md',
}) => {
  if (!verified) return null;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <div
      className={`${sizeClasses[size]} bg-green-50 border border-green-200 rounded-full flex items-center gap-2 w-fit`}
    >
      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
      <span className="font-semibold text-green-700">Terverifikasi</span>
      {verificationDate && (
        <span className="text-xs text-green-600 ml-1">({verificationDate})</span>
      )}
    </div>
  );
};
