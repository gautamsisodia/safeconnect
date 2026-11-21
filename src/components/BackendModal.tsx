import React, { useState, useEffect } from 'react';
import { Key, Mail, CheckCircle2, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { User } from '../services/storageService.ts';

const BACKEND_URL = "https://safeconnectfinal.infinityfree.me";

interface OtpVerificationScreenProps {
  email: string;
  name: string;
  generatedOtp?: string;
  onOtpVerified: (user: User) => void;
  onNavigate: (screen: string) => void;
}

export const OtpVerificationScreen: React.FC<OtpVerificationScreenProps> = ({
  email,
  name,
  onOtpVerified,
  onNavigate,
}) => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [resendCooldown, setResendCooldown] = useState(30);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => setResendCooldown(prev => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!otp || otp.length < 6) {
      setErrorMsg('Please enter all 6 digits');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await fetch(`${BACKEND_URL}/verify_otp.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, otp: otp })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Verified! Opening Dashboard...');
        setTimeout(() => {
          onOtpVerified(data.user);
        }, 800);
      } else {
        setErrorMsg(data.message || 'Invalid OTP');
      }
    } catch (err) {
      setErrorMsg("Server Error - Please try again");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setIsLoading(true);
    try{
      const res = await fetch(`${BACKEND_URL}/register.php`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({email, name, resend:true})
      });
      const data = await res.json();
      if(data.success){
        setSuccessMsg('New OTP sent! Check Inbox + Spam');
      } else {
        setErrorMsg(data.message);
      }
    } catch{
      setErrorMsg("Resend failed - Please check network");
    }
    setIsLoading(false);
    setResendCooldown(30);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md mx-auto">
        <div className="glass p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="mb-5">
            <span className="plate px-3.5 py-1.5 rounded-xl bg-white shadow-sm inline-block">
              <img src="/logo.png" alt="SafeConnect" className="h-7 object-contain" />
            </span>
          </div>
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#2f7bff] to-[#27d3ff] flex items-center justify-center mx-auto mb-4 shadow-[0_0_25px_rgba(47,123,255,0.7)]">
            <Key className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">OTP Verification</h1>
          <p className="text-xs sm:text-sm text-[#9fb0d6] mt-2 leading-relaxed">Please enter the 6-digit OTP sent to:</p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-2 rounded-full bg-[#0d2257] border border-[#2f7bff]/30 text-xs font-medium text-[#27d3ff]">
            <Mail className="w-3.5 h-3.5" /><span>{email}</span>
          </div>
          {errorMsg && (
            <div className="mt-4 p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-[#ff8a96] text-xs flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /><span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="mt-4 p-3 rounded-xl bg-green-500/15 border border-green-500/40 text-green-300 text-xs flex items-center gap-2 text-left">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" /><span>{successMsg}</span>
            </div>
          )}
          <form onSubmit={handleVerify} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#9fb0d6] mb-2 text-left">Enter 6-Digit Code</label>
              <input type="text" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} placeholder="• • • • • •" className="text-center font-mono text-2xl tracking-[0.5em] py-3.5 font-bold text-[#27d3ff] bg-[#050b1f]/90 border border-[#78aaff]/30 focus:border-[#27d3ff]" autoFocus required />
            </div>
            <button type="submit" disabled={isLoading || otp.length < 6} className="btn w-full py-3.5 text-base font-semibold shadow-[0_0_20px_rgba(47,123,255,0.6)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
              {isLoading ? 'Verifying...' : 'Verify OTP'}<ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </form>
          <div className="mt-6 flex items-center justify-between text-xs text-[#9fb0d6] border-t border-[#78aaff]/15 pt-4">
            <span>Didn't receive code?</span>
            <button type="button" onClick={handleResend} disabled={resendCooldown > 0} className="text-[#27d3ff] hover:text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed bg-transparent border-none cursor-pointer flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /><span>{resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}</span>
            </button>
          </div>
          <div className="mt-4 text-center">
            <button type="button" onClick={() => onNavigate('register')} className="text-[11px] text-[#6479a6] hover:text-[#9fb0d6] bg-transparent border-none cursor-pointer">Back to Registration</button>
          </div>
        </div>
      </div>
    </div>
  );
};