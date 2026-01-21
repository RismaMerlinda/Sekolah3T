'use client';

import React from 'react';

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  status: 'completed' | 'ongoing' | 'upcoming';
}

interface TimelineComponentProps {
  events: TimelineEvent[];
}

export const TimelineComponent: React.FC<TimelineComponentProps> = ({ events }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'ongoing':
        return 'bg-blue-100 text-blue-700';
      case 'upcoming':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Selesai';
      case 'ongoing':
        return 'Berlangsung';
      case 'upcoming':
        return 'Mendatang';
      default:
        return status;
    }
  };

  const getDotColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'ongoing':
        return 'bg-blue-500';
      case 'upcoming':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {events.length === 0 ? (
        <p className="text-center text-[#6B8E8B] py-8">
          Belum ada timeline kegiatan untuk kampanye ini.
        </p>
      ) : (
        events.map((event, index) => (
          <div key={event.id} className="relative flex gap-4">
            {/* Timeline Line */}
            {index !== events.length - 1 && (
              <div className="absolute left-6 top-12 w-0.5 h-16 bg-gradient-to-b from-[#40E0D0] to-[#B2F5EA]"></div>
            )}

            {/* Timeline Dot */}
            <div className={`w-4 h-4 rounded-full ${getDotColor(event.status)} mt-2 flex-shrink-0 border-4 border-white shadow-md`}></div>

            {/* Content */}
            <div className="flex-1 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-[#6B8E8B] font-semibold uppercase">
                    {event.date}
                  </p>
                  <h4 className="text-base font-bold text-[#0F2F2E] mt-1">
                    {event.title}
                  </h4>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(
                    event.status
                  )}`}
                >
                  {getStatusLabel(event.status)}
                </span>
              </div>
              <p className="text-sm text-[#4A6F6C] mt-2">{event.description}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
