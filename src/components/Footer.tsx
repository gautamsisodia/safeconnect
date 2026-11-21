import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-16 border-t border-[#78aaff]/10 bg-[#020617]">
      {/* Contact Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Contact SafeConnect
          </h2>
          <p className="text-xs sm:text-sm text-[#9fb0d6] mt-2 max-w-2xl mx-auto">
            Questions, academic feedback or emergency partnership ideas? We'd like to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Email */}
          <div className="glass p-6 rounded-2xl bg-[#111a36]/60 border border-[#78aaff]/15 text-center hover:border-[#27d3ff]/30 transition-all">
            <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-[#0d2257] flex items-center justify-center">
              <Mail className="w-5 h-5 text-[#27d3ff]" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Email</h3>
            <p className="text-xs text-[#9fb0d6] break-all">
              safeconnect.project2026@gmail.com
            </p>
          </div>

          {/* Emergency Desk */}
          <div className="glass p-6 rounded-2xl bg-[#111a36]/60 border border-[#78aaff]/15 text-center hover:border-[#27d3ff]/30 transition-all">
            <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-[#0d2257] flex items-center justify-center">
              <Phone className="w-5 h-5 text-[#27d3ff]" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Emergency Desk</h3>
            <p className="text-xs text-[#9fb0d6] leading-relaxed">
              Gautam Sisodia: 8920383501<br />
              Piyush Das: 7678159776
            </p>
          </div>

          {/* Department */}
          <div className="glass p-6 rounded-2xl bg-[#111a36]/60 border border-[#78aaff]/15 text-center hover:border-[#27d3ff]/30 transition-all">
            <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-[#0d2257] flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#27d3ff]" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Department</h3>
            <p className="text-xs text-[#9fb0d6]">
              University of Delhi, New Delhi, India
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#78aaff]/10 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-white flex items-center gap-2 shadow-[0_0_15px_rgba(47,123,255,0.3)]">
            <img
              src="/logo.png"
              alt="SafeConnect Logo"
              className="h-6 object-contain"
            />
          </div>
          <div className="text-center">
            <p className="text-[11px] sm:text-xs text-[#8ea0c7]">
              © 2026 SafeConnect | Developed by Gautam & Piyush | University of Delhi.
            </p>
            <p className="text-[10px] text-[#5a6b9a] mt-1">
              Emergency Alert and Safety Management System | Academic Demonstration Architecture (PHP / MySQL)
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};