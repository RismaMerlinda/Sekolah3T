'use client';

import React from 'react';

interface ProgressBarProps {
  current: number;
  target: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  target,
  showLabel = true,
  size = 'md',
}) => {
  const percentage = (current / target) * 100;
  const displayPercentage = Math.min(percentage, 100);

  const heightClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          {formatCurrency(current)}
        </span>
        <span className="text-sm text-gray-500">{Math.round(displayPercentage)}%</span>
      </div>
      <div
        className={`${heightClasses[size]} bg-gray-200 rounded-full overflow-hidden`}
      >
        <div
          className="bg-gradient-to-r from-[#40E0D0] to-[#2CB1A6] h-full rounded-full transition-all duration-500"
          style={{ width: `${displayPercentage}%` }}
        ></div>
      </div>
      {showLabel && (
        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
          <span>Target: {formatCurrency(target)}</span>
          <span>Terkumpul: {formatCurrency(current)}</span>
        </div>
      )}
    </div>
  );
};
