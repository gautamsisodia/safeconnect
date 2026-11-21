import React from 'react';
import {
  LogOut,
  Phone,
  Users,
  Clock,
  Home,
  BookOpen,
} from 'lucide-react';
import { User } from '../services/storageService.ts';

interface NavbarProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  currentUser: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  currentUser,
  onLogout,
}) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050b1f]/85 backdrop-blur-md border-b border-[#78aaff]/20 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 sm:h-20">
        <button
          onClick={() => onNavigate(currentUser ? 'dashboard' : 'landing')}
          className="flex items-center gap-2 sm:gap-3 text-left group bg-transparent border-none cursor-pointer p-0"
          title="SafeConnect Home"
        >
          <div className="plate px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-white flex items-center gap-2 shadow-[0_0_20px_rgba(47,123,255,0.4)]">
            <img
              src="/logo.png"
              alt="SafeConnect Logo"
              className="h-7 sm:h-9 object-contain"
            />
          </div>
          <div className="hidden lg:flex flex-col">
            <span className="text-xs uppercase tracking-widest text-[#27d3ff] font-semibold">
              Emergency System
            </span>
            <span className="text-[11px] text-[#9fb0d6]">One Tap To Safety</span>
          </div>
        </button>

        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          {!currentUser ? (
            <>
              <button
                onClick={() => onNavigate('landing')}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition ${
                  currentScreen === 'landing'
                    ? 'text-white bg-[#2f7bff]/20 border border-[#2f7bff]/40 shadow-[0_0_12px_rgba(47,123,255,0.3)]'
                    : 'text-[#9fb0d6] hover:text-white hover:bg-white/5'
                }`}
              >
                About &amp; Features
              </button>
              <button
                onClick={() => onNavigate('helplines')}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition ${
                  currentScreen === 'helplines'
                    ? 'text-white bg-[#2f7bff]/20 border border-[#2f7bff]/40 shadow-[0_0_12px_rgba(47,123,255,0.3)]'
                    : 'text-[#9fb0d6] hover:text-white hover:bg-white/5'
                }`}
              >
                Helplines
              </button>
              <button
                onClick={() => onNavigate('login')}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition ${
                  currentScreen === 'login'
                    ? 'text-white bg-[#2f7bff]/20 border border-[#2f7bff]/40'
                    : 'text-[#9fb0d6] hover:text-white hover:bg-white/5'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="btn py-2 px-5 text-xs sm:text-sm font-semibold tracking-wide ml-2"
              >
                Register
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onNavigate('dashboard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  currentScreen === 'dashboard'
                    ? 'text-white bg-[#2f7bff]/25 border border-[#27d3ff]/50 shadow-[0_0_15px_rgba(39,211,255,0.3)]'
                    : 'text-[#9fb0d6] hover:text-white hover:bg-white/5'
                }`}
              >
                <Home className="w-4 h-4 text-[#27d3ff]" />
                Dashboard
              </button>

              <button
                onClick={() => onNavigate('alerts')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  currentScreen === 'alerts'
                    ? 'text-white bg-[#2f7bff]/25 border border-[#27d3ff]/50 shadow-[0_0_15px_rgba(39,211,255,0.3)]'
                    : 'text-[#9fb0d6] hover:text-white hover:bg-white/5'
                }`}
              >
                <BookOpen className="w-4 h-4 text-[#27d3ff]" />
                Emergency Guide
              </button>

              <button
                onClick={() => onNavigate('contacts')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  currentScreen === 'contacts'
                    ? 'text-white bg-[#2f7bff]/25 border border-[#27d3ff]/50'
                    : 'text-[#9fb0d6] hover:text-white hover:bg-white/5'
                }`}
              >
                <Users className="w-4 h-4 text-[#27d3ff]" />
                Contacts
              </button>

              <button
                onClick={() => onNavigate('helplines')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  currentScreen === 'helplines'
                    ? 'text-white bg-[#2f7bff]/25 border border-[#27d3ff]/50'
                    : 'text-[#9fb0d6] hover:text-white hover:bg-white/5'
                }`}
              >
                <Phone className="w-4 h-4 text-[#27d3ff]" />
                Helplines
              </button>

              <button
                onClick={() => onNavigate('history')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  currentScreen === 'history'
                    ? 'text-white bg-[#2f7bff]/25 border border-[#27d3ff]/50'
                    : 'text-[#9fb0d6] hover:text-white hover:bg-white/5'
                }`}
              >
                <Clock className="w-4 h-4 text-[#27d3ff]" />
                History
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2 pl-2">
              <button
                onClick={() => onNavigate('profile')}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs sm:text-sm text-left transition border border-transparent hover:border-[#27d3ff]/40"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#2f7bff] to-[#27d3ff] flex items-center justify-center font-bold text-white text-xs">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden xl:flex flex-col">
                  <span className="font-medium text-[#e8eefc] leading-tight max-w-[100px] truncate">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold">Active</span>
                </div>
              </button>

              <button
                onClick={onLogout}
                className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-[#ff8a96] border border-red-500/30 transition"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('login')}
                className="px-4 py-2 rounded-xl bg-[#2f7bff]/20 hover:bg-[#2f7bff]/30 border border-[#2f7bff]/40 text-xs sm:text-sm font-semibold text-[#27d3ff] transition"
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="btn py-2 px-4 text-xs sm:text-sm font-semibold"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};