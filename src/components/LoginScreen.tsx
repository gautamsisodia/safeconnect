import React, { useState } from 'react';
import {
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { setCurrentUser, getStoredUsers, User } from '../services/storageService.ts';

interface LoginScreenProps {
  onNavigate: (screen: string) => void;
  onLoginSuccess: (user: User) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onNavigate,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const allUsers = getStoredUsers();
    const foundUser = allUsers.find(
      (u: any) => u.email?.toLowerCase() === email.toLowerCase().trim() && u.password === password
    );

    setTimeout(() => {
      setIsLoading(false);
      if (foundUser) {
        setSuccessMsg('Login successful! Opening Dashboard...');
        setCurrentUser(foundUser);
        setTimeout(() => {
          onLoginSuccess(foundUser);
        }, 800);
      } else {
        setErrorMsg('Invalid Email or Password!');
      }
    }, 600);
  };

  const handleDemoFill = () => {
    setEmail('demo@safeconnect.com');
    setPassword('Demo@1234');
    setErrorMsg('');
    setSuccessMsg('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md mx-auto">
        <div className="glass p-6 sm:p-8 text-center relative">
          <div className="mb-6">
            <span className="plate px-4 py-2 rounded-xl bg-white shadow-[0_0_20px_rgba(47,123,255,0.4)] inline-block">
              <img src="/logo.png" alt="SafeConnect Logo" className="h-8 object-contain" />
            </span>
          </div>

          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#2f7bff] to-[#27d3ff] flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(47,123,255,0.6)]">
            <Lock className="w-7 h-7 text-white" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            User Login
          </h1>
          <p className="text-xs sm:text-sm text-[#9fb0d6] mt-2">
            Sign in to access your SafeConnect emergency dashboard
          </p>

          {errorMsg && (
            <div className="mt-4 p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-[#ff8a96] text-xs flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mt-4 p-3 rounded-xl bg-green-500/15 border border-green-500/40 text-green-300 text-xs flex items-center gap-2 text-left">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
            <div>
              <label className="block text-xs font-medium text-[#9fb0d6] mb-1.5">
                Email
              </label>
              {/* FIXED: Absolute hataya, Flex lagaya */}
              <div className="flex items-center gap-3 w-full bg-[#050b1f] border border-[#78aaff]/20 rounded-xl px-4 py-3.5 focus-within:border-[#27d3ff]/60 transition">
                <Mail className="w-4 h-4 text-[#6479a6] shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 min-w-0 bg-transparent border-none outline-none text-white text-sm placeholder:text-[#6479a6] p-0 m-0"
                  style={{ paddingLeft: 0, boxShadow: 'none' }}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#9fb0d6] mb-1.5">
                Password
              </label>
              {/* FIXED: Absolute hataya, Flex lagaya */}
              <div className="flex items-center gap-3 w-full bg-[#050b1f] border border-[#78aaff]/20 rounded-xl px-4 py-3.5 focus-within:border-[#27d3ff]/60 transition">
                <Lock className="w-4 h-4 text-[#6479a6] shrink-0" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="flex-1 min-w-0 bg-transparent border-none outline-none text-white text-sm placeholder:text-[#6479a6] p-0 m-0"
                  style={{ paddingLeft: 0, boxShadow: 'none' }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn w-full py-3.5 text-base font-semibold shadow-[0_0_20px_rgba(47,123,255,0.6)] cursor-pointer mt-2"
            >
              {isLoading ? 'Verifying...' : 'Login'}
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleDemoFill}
              className="text-xs text-[#27d3ff] hover:underline bg-transparent border-none cursor-pointer"
            >
              Fill Sample Credentials
            </button>
          </div>

          <div className="mt-5 pt-4 border-t border-[#78aaff]/15 text-center">
            <p className="text-xs text-[#9fb0d6]">
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => onNavigate('register')}
                className="text-[#27d3ff] hover:underline font-semibold bg-transparent border-none cursor-pointer"
              >
                Register Now
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};