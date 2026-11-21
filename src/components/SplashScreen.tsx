import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
  appName?: string;
  tagline?: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  appName = 'SafeConnect',
  tagline = 'One Tap To Safety',
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 12;
      });
    }, 120);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const finishTimer = setTimeout(() => {
        onComplete();
      }, 300);
      return () => clearTimeout(finishTimer);
    }
  }, [progress, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 bg-[#050b1f] text-[#e8eefc] overflow-hidden select-none">
      {/* Background Orbs */}
      <div className="orb o1"></div>
      <div className="orb o2"></div>
      <div className="orb o3"></div>
      <div className="grid-bg"></div>

      {/* Top spacing */}
      <div className="relative z-10 w-full max-w-md pt-4 flex items-center justify-center">
        <span className="text-[11px] font-semibold tracking-wider text-[#27d3ff] bg-[#2f7bff]/20 border border-[#2f7bff]/40 px-3.5 py-1 rounded-full uppercase">
          SafeConnect Emergency Protection
        </span>
      </div>

      {/* Center Branding & Logo */}
      <div className="relative z-10 flex flex-col items-center text-center my-auto animate-rise max-w-sm">
        {/* Logo in Glowing White Plate */}
        <div className="plate lg mb-6 shadow-[0_0_35px_rgba(47,123,255,0.7)] hover:shadow-[0_0_50px_rgba(39,211,255,0.9)] transition-all">
          <img
            src="/logo.png"
            alt="SafeConnect Logo"
            className="w-48 sm:w-64 h-auto object-contain filter drop-shadow-md"
          />
        </div>

        {/* SOS Center Siren Animation */}
        <div className="sos-container mb-4">
          <div className="sos-ring"></div>
          <div className="sos-ring"></div>
          <div className="sos-ring"></div>
          <div className="sos-center-btn">
            <span>SOS</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-[#9cc4ff] to-[#27d3ff] bg-clip-text text-transparent">
          {appName}
        </h1>
        <h2 className="text-sm sm:text-base font-medium tracking-[0.25em] text-[#9fb0d6] uppercase mt-2">
          {tagline}
        </h2>

        {/* Target Users */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-5">
          {['Students', 'Women', 'Senior Citizens', 'General Public'].map((tag, i) => (
            <span
              key={i}
              className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#0d2257]/80 text-[#bcd4ff] border border-[#2f7bff]/30"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Progress & Skip Button */}
      <div className="relative z-10 w-full max-w-sm pb-6 flex flex-col items-center gap-3">
        {/* Loading Progress Bar */}
        <div className="w-full bg-[#0d2257] h-1.5 rounded-full overflow-hidden border border-[#78aaff]/30">
          <div
            className="bg-gradient-to-r from-[#2f7bff] to-[#27d3ff] h-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="w-full flex items-center justify-between text-xs text-[#9fb0d6]">
          <span>Initializing SafeConnect System...</span>
          <span className="font-mono text-[#27d3ff]">{progress}%</span>
        </div>

        <button
          onClick={onComplete}
          className="mt-1 flex items-center gap-2 text-xs font-semibold text-[#27d3ff] hover:text-white transition px-4 py-1.5 rounded-full hover:bg-white/5 cursor-pointer"
        >
          <span>Continue to Login</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
