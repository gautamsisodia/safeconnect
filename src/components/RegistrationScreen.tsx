import React, { useState } from 'react';
import {
  Shield,
  User as UserIcon,
  Phone,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { getStoredUsers, saveStoredUsers } from '../services/storageService.ts';

const BASE_URL = "https://safeconnectfinal.infinityfree.me";

interface RegistrationScreenProps {
  onNavigate: (screen: string) => void;
  onRegistered: (data: { email: string; name: string; phone: string; otp?: string }) => void;
}

export const RegistrationScreen: React.FC<RegistrationScreenProps> = ({
  onNavigate,
  onRegistered,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 10) {
      setErrorMsg('Please enter a valid phone number (at least 10 digits).');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!formData.password || formData.password.length < 8) {
      setErrorMsg('Password must be at least 8 characters.');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await fetch(`${BASE_URL}/register.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const rawText = await res.text();
      console.log('RAW SERVER RESPONSE:', rawText);
      let data: any;
      try {
        data = JSON.parse(rawText);
      } catch (jsonError) {
        setErrorMsg('Backend Error: ' + rawText.substring(0, 400));
        setIsLoading(false);
        return;
      }
      if (data.success) {
        if (data.demo_otp) {
          sessionStorage.setItem('demo_otp', String(data.demo_otp));
          console.log('DEMO OTP SAVED:', data.demo_otp);
        }
        try {
          const newUserForLocal = {
            user_id: Date.now(),
            name: formData.name,
            email: formData.email.toLowerCase().trim(),
            phone: formData.phone,
            password: formData.password,
            is_verified: true,
            registered_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
          } as any;
          const existing = getStoredUsers();
          const filtered = existing.filter((u: any) => u.email.toLowerCase() !== newUserForLocal.email.toLowerCase());
          saveStoredUsers([...filtered, newUserForLocal]);
        } catch {}
        setSuccessMsg(data.message || 'OTP sent!');
        setTimeout(() => {
          onRegistered({
            email: formData.email,
            name: formData.name,
            phone: formData.phone,
            otp: data.demo_otp || data.otp_debug || data.otp,
          });
        }, 800);
      } else {
        setErrorMsg(data.message || 'Registration failed');
      }
    } catch (err) {
      setErrorMsg('Network Error: Backend not reachable. Check server.');
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span className="plate px-4 py-2 rounded-xl bg-white shadow-[0_0_20px_rgba(47,123,255,0.4)] mb-4 inline-block">
            <img src="/logo.png" alt="SafeConnect Logo" className="h-8 object-contain" />
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            Create your SafeConnect account
          </h1>
          <p className="text-sm sm:text-base text-[#9fb0d6] mt-2">
            It takes less than a minute. Register once, verify with OTP, and you are protected.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-5 glass p-6 sm:p-8 bg-gradient-to-br from-[#1b4fd8]/40 to-[#0a1a3f]/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-6 h-6 text-[#27d3ff]" />
                <h2 className="text-xl font-bold text-white">Why register?</h2>
              </div>
              <p className="text-xs sm:text-sm text-[#cfe0ff] leading-relaxed mb-6">
                Your account is what lets SafeConnect reach the right trusted contacts and emergency responders the moment you need help.
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="lg:col-span-7 glass p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-[#ff8a96] text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="p-3 rounded-xl bg-green-500/15 border border-green-500/40 text-green-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-[#9fb0d6] mb-1.5">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#6479a6] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Aarav Sharma" style={{ paddingLeft: '44px' }} className="w-full bg-[#0f2040] border border-[#2a3f6d] rounded-xl py-3 pr-4 text-white text-sm outline-none" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#9fb0d6] mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#6479a6] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" style={{ paddingLeft: '44px' }} className="w-full bg-[#0f2040] border border-[#2a3f6d] rounded-xl py-3 pr-4 text-white text-sm outline-none" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#9fb0d6] mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#6479a6] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" style={{ paddingLeft: '44px' }} className="w-full bg-[#0f2040] border border-[#2a3f6d] rounded-xl py-3 pr-4 text-white text-sm outline-none" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#9fb0d6] mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#6479a6] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="At least 8 characters" style={{ paddingLeft: '44px' }} className="w-full bg-[#0f2040] border border-[#2a3f6d] rounded-xl py-3 pr-4 text-white text-sm outline-none" minLength={8} required />
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4">
              <button type="submit" disabled={isLoading} className="w-full py-3.5 text-base font-semibold bg-[#2f7bff] text-white rounded-xl flex items-center justify-center gap-2 disabled:opacity-60">
                {isLoading ? 'Processing...' : 'Register Now'}
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
              <div className="text-center mt-4">
                <p className="text-xs text-[#9fb0d6]">
                  Already have an account?{' '}
                  <button type="button" onClick={() => onNavigate('login')} className="text-[#27d3ff] hover:underline font-semibold bg-transparent border-none cursor-pointer">
                    Login Here
                  </button>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};