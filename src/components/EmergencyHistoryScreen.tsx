import React, { useState } from 'react';
import {
  Clock,
  ShieldAlert,
  Calendar,
  Filter,
  ArrowLeft,
} from 'lucide-react';
import { User } from '../services/storageService.ts';

interface EmergencyHistoryScreenProps {
  user: User;
  onNavigate: (screen: string) => void;
}

export const EmergencyHistoryScreen: React.FC<EmergencyHistoryScreenProps> = ({
  user,
  onNavigate,
}) => {
  const [filterType, setFilterType] = useState('All');

  const [historyItems] = useState([
    {
      id: 1,
      type: 'High Priority Emergency SOS',
      date: '2026-10-27',
      time: '10:48 AM',
      status: 'Active',
      note: 'Immediate emergency alert dispatched to responders and contacts.',
    },
    {
      id: 2,
      type: 'Medical Emergency',
      date: '2026-10-24',
      time: '02:30 PM',
      status: 'Resolved',
      note: 'Paramedic assistance requested.',
    },
    {
      id: 3,
      type: 'Women Safety',
      date: '2026-10-18',
      time: '08:45 PM',
      status: 'Resolved',
      note: 'Travel distress alert.',
    },
    {
      id: 4,
      type: 'Road Accident',
      date: '2026-10-12',
      time: '11:15 AM',
      status: 'Resolved',
      note: 'Highway assistance alert.',
    },
  ]);

  const types = ['All', 'Emergency SOS', 'Medical Emergency', 'Women Safety', 'Road Accident', 'Crime / Assault', 'Fire Emergency'];

  const filteredAlerts = historyItems.filter(a => {
    if (filterType === 'All') return true;
    if (filterType === 'Emergency SOS') return a.type.includes('SOS');
    return a.type === filterType;
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-1.5 text-xs text-[#27d3ff] hover:underline mb-2 bg-transparent border-none cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <Clock className="w-8 h-8 text-[#27d3ff]" />
            <span>Emergency History</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#9fb0d6] mt-1">
            Log of previously dispatched emergency alerts.
          </p>
        </div>

        <button
          onClick={() => onNavigate('alerts')}
          className="btn py-2 px-5 text-xs sm:text-sm font-semibold flex items-center gap-1.5"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>New Emergency Alert</span>
        </button>
      </div>

      {/* Filter Chips */}
      <div className="glass p-4 mb-6 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <Filter className="w-4 h-4 text-[#27d3ff] flex-shrink-0 mr-1" />
        {types.map(t => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition border ${
              filterType === t
                ? 'bg-[#2f7bff] border-[#27d3ff] text-white shadow-[0_0_12px_rgba(47,123,255,0.4)]'
                : 'bg-[#050b1f] border-[#78aaff]/25 text-[#9fb0d6] hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Timeline List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="glass p-12 text-center">
            <Clock className="w-12 h-12 text-[#6479a6] mx-auto mb-3" />
            <p className="text-base font-semibold text-white">No Emergency Records Found</p>
            <p className="text-xs text-[#9fb0d6] mt-1">
              Any alerts or SOS signals triggered from the app will appear here with dates and times.
            </p>
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <div
              key={alert.id}
              className="glass p-6 border border-[#78aaff]/25 hover:border-[#27d3ff]/50 transition interactive-card"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-[#ff4d5e] animate-pulse"></span>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {alert.type}
                  </h3>
                </div>

                <div className="flex items-center gap-3 text-xs text-[#9fb0d6]">
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-[#27d3ff]" />
                    Date: {alert.date} &bull; Time: {alert.time}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-semibold">
                    {alert.status}
                  </span>
                </div>
              </div>

              {alert.note && (
                <p className="text-xs text-[#cfe0ff] bg-[#050b1f]/60 p-3 rounded-xl border border-[#78aaff]/15">
                  {alert.note}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
