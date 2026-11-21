import React from 'react';
import {
  Home,
  ShieldAlert,
  Users,
  Phone,
  User as UserIcon,
} from 'lucide-react';

interface MobileBottomNavProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  isLoggedIn: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentScreen,
  onNavigate,
  isLoggedIn,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#050b1f]/95 backdrop-blur-xl border-t border-[#78aaff]/25 px-2 py-1.5 flex items-center justify-around md:hidden shadow-[0_-5px_25px_rgba(0,0,0,0.6)]">
      <button
        onClick={() => onNavigate(isLoggedIn ? 'dashboard' : 'landing')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition ${
          currentScreen === 'dashboard' || currentScreen === 'landing'
            ? 'text-[#27d3ff]'
            : 'text-[#9fb0d6] hover:text-white'
        }`}
      >
        <Home className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] font-medium">{isLoggedIn ? 'Dashboard' : 'Home'}</span>
      </button>

      {isLoggedIn && (
        <button
          onClick={() => onNavigate('contacts')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition ${
            currentScreen === 'contacts'
              ? 'text-[#27d3ff]'
              : 'text-[#9fb0d6] hover:text-white'
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium">Contacts</span>
        </button>
      )}

      {/* Central SOS Quick Dispatch Button */}
      <button
        onClick={() => onNavigate('alerts')}
        className="relative -top-4 flex flex-col items-center group cursor-pointer focus:outline-none"
        title="Emergency Alert Dispatch"
      >
        <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#c1182c] via-[#ff4d5e] to-[#ff8a96] flex items-center justify-center shadow-[0_0_25px_rgba(255,77,94,0.8)] border-2 border-white/40 group-active:scale-95 transition-transform">
          <ShieldAlert className="w-7 h-7 text-white animate-pulse" />
        </div>
        <span className="text-[11px] font-bold text-[#ff4d5e] mt-0.5 tracking-wider">
          SOS
        </span>
      </button>

      <button
        onClick={() => onNavigate('helplines')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition ${
          currentScreen === 'helplines'
            ? 'text-[#27d3ff]'
            : 'text-[#9fb0d6] hover:text-white'
        }`}
      >
        <Phone className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] font-medium">Helplines</span>
      </button>

      <button
        onClick={() => onNavigate(isLoggedIn ? 'profile' : 'login')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition ${
          currentScreen === 'profile' || currentScreen === 'login'
            ? 'text-[#27d3ff]'
            : 'text-[#9fb0d6] hover:text-white'
        }`}
      >
        <UserIcon className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] font-medium">{isLoggedIn ? 'Profile' : 'Login'}</span>
      </button>
    </div>
  );
};
