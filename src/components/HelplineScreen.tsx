import React, { useState } from 'react';
import {
  Phone,
  Search,
  Shield,
  ArrowLeft,
  Copy,
  Check,
} from 'lucide-react';
import { HelplineItem, filterHelplines } from '../utils/safetyLogic.ts';
import { ApiService } from '../services/apiService.ts';

interface HelplineScreenProps {
  onNavigate: (screen: string) => void;
}

export const HelplineScreen: React.FC<HelplineScreenProps> = ({ onNavigate }) => {
  const [helplines] = useState<HelplineItem[]>(() => ApiService.getHelplines());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  const categories = ['All', 'National', 'Police & Crime', 'Women & Child', 'Medical & Health', 'Disaster'];

  const filtered = filterHelplines(helplines, searchQuery, selectedCategory);

  const handleCopy = (num: string) => {
    navigator.clipboard?.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2500);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-20">
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
            <Phone className="w-8 h-8 text-[#27d3ff]" />
            <span>Emergency Helplines</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#9fb0d6] mt-1">
            24/7 National and local emergency response hotlines.
          </p>
        </div>

        <div className="text-xs text-[#9fb0d6] bg-[#0d2257]/80 border border-[#2f7bff]/30 px-3 py-2 rounded-xl">
          National Emergency: <strong className="text-white font-mono text-sm ml-1 text-[#27d3ff]">112</strong>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="glass p-4 sm:p-5 mb-8 space-y-4">
        {/* FIXED SEARCH BAR - Absolute hataya, Flex lagaya, overlap impossible */}
        <div className="flex items-center gap-3 w-full bg-[#050b1f] border border-[#78aaff]/20 rounded-xl px-4 py-3.5 focus-within:border-[#27d3ff]/50 transition">
          <Search className="w-[18px] h-[18px] text-[#6479a6] shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search helpline by name or number (e.g. 100, Police, Ambulance)..."
            className="flex-1 min-w-0 bg-transparent border-none outline-none text-white text-xs sm:text-sm placeholder:text-[#6479a6] p-0 m-0"
            style={{ paddingLeft: 0, boxShadow: 'none' }}
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition border ${
                selectedCategory === cat
                  ? 'bg-[#2f7bff] border-[#27d3ff] text-white shadow-[0_0_12px_rgba(47,123,255,0.4)]'
                  : 'bg-[#050b1f] border-[#78aaff]/25 text-[#9fb0d6] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Helplines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full glass p-10 text-center">
            <p className="text-sm text-[#9fb0d6]">No emergency helplines match your search query.</p>
          </div>
        ) : (
          filtered.map(item => (
            <div
              key={item.id}
              className="glass p-6 flex flex-col justify-between interactive-card"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase font-bold text-[#27d3ff] px-2.5 py-0.5 rounded-full bg-[#2f7bff]/20 border border-[#2f7bff]/40">
                    {item.category}
                  </span>
                  {item.isAvailable247 && (
                    <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      24/7 Available
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white mb-1">{item.name}</h3>
                <p className="text-xs text-[#9fb0d6] leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#78aaff]/15 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-2xl font-black text-[#27d3ff] tracking-wider">
                    {item.number}
                  </span>
                  <button
                    onClick={() => handleCopy(item.number)}
                    className="p-1 text-[#9fb0d6] hover:text-white rounded-lg transition"
                    title="Copy number"
                  >
                    {copiedNumber === item.number ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <a
                  href={`tel:${item.number}`}
                  className="btn py-2 px-4 text-xs font-semibold cursor-pointer"
                >
                  <Phone className="w-3 h-3 mr-1" />
                  Call {item.number}
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};