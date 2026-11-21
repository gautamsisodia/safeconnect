import React, { useState, useEffect } from 'react';
import { Key, Mail, CheckCircle2, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { User } from '../services/storageService.ts';

const BASE_URL = "https://safeconnectfinal.infinityfree.me";

interface OtpVerificationScreenProps {
  email: string;
  name: string;
  phone?: string;
  onOtpVerified: (user: User) => void;
  onNavigate: (screen: string) => void;
}

export const OtpVerificationScreen: React.FC<OtpVerificationScreenProps> = ({
  email,
  name,
  phone = '',
  onOtpVerified,
}) => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(`OTP sent to ${email}. Please check your inbox.`);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [demoOtp, setDemoOtp] = useState<string | null>(() => sessionStorage.getItem('demo_otp'));

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => setResendCooldown(p => p - 1), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setErrorMsg('Please enter 6 digit OTP');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`${BASE_URL}/verify_otp.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp })
      });
      const rawText = await res.text();
      console.log('VERIFY RAW:', rawText);
      let data: any;
      try { data = JSON.parse(rawText); } catch { setErrorMsg('Backend Error: ' + rawText.substring(0, 400)); setIsLoading(false); return; }
      if (data.success) {
        sessionStorage.removeItem('demo_otp');
        setSuccessMsg('Verified! Opening Dashboard...');
        setTimeout(() => onOtpVerified(data.user as User), 800);
      } else {
        setErrorMsg(data.message || 'Invalid OTP');
      }
    } catch { setErrorMsg('Server error, check BASE_URL / Server is running'); }
    setIsLoading(false);
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`${BASE_URL}/register.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, phone, resend: true })
      });
      const rawText = await res.text();
      const data = JSON.parse(rawText);
      if (data.success) {
        if (data.demo_otp) {
          sessionStorage.setItem('demo_otp', String(data.demo_otp));
          setDemoOtp(String(data.demo_otp));
        }
        setSuccessMsg(`New OTP sent to ${email}. Please check your inbox.`);
      } else { setErrorMsg(data.message); }
    } catch { setErrorMsg('Resend failed, check server'); }
    setIsLoading(false);
    setResendCooldown(30);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md mx-auto">
        <div className="glass p-6 sm:p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#2f7bff] to-[#27d3ff] flex items-center justify-center mx-auto mb-4">
            <Key className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">OTP Verification</h1>
          <p className="text-xs text-[#9fb0d6] mt-2">We have sent a 6-digit code to</p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-2 rounded-full bg-[#0d2257] border border-[#2f7bff]/30 text-xs text-[#27d3ff]">
            <Mail className="w-3.5 h-3.5" />{email}
          </div>
          {demoOtp && (
            <div className="mt-4 p-3 rounded-xl bg-[#0d2257] border border-[#2f7bff]/40 text-center">
              <p className="text-xs text-[#9fb0d6]">Didn't receive OTP in mail?</p>
              <button
                type="button"
                onClick={() => setOtp(demoOtp)}
                className="mt-2 text-xs bg-yellow-400 text-black px-4 py-2 rounded-full font-bold hover:bg-yellow-300 cursor-pointer"
              >
                Auto Fill OTP
              </button>
            </div>
          )}
          {successMsg && (
            <div className="mt-4 p-3 rounded-xl bg-green-500/15 border border-green-500/40 text-green-300 text-xs flex items-center gap-2 text-left">
              <CheckCircle2 className="w-4 h-4" />{successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="mt-4 p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-[#ff8a96] text-xs flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4" />{errorMsg}
            </div>
          )}
          <form onSubmit={handleVerify} className="mt-6 space-y-4">
            <div className="text-left">
              <label className="block text-xs text-[#9fb0d6] mb-2">Enter OTP sent to your email</label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="------"
                className="text-center font-mono text-2xl tracking-[0.5em] py-3.5 font-bold text-[#27d3ff] bg-[#050b1f]/90 border border-[#78aaff]/30 w-full rounded-xl outline-none"
                autoFocus
                required
              />
            </div>
            <button type="submit" disabled={isLoading || otp.length < 6} className="btn w-full py-3.5 font-semibold flex items-center justify-center gap-2">
              {isLoading ? 'Verifying...' : 'Verify & Go to Dashboard'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          <div className="mt-6 flex items-center justify-between text-xs text-[#9fb0d6] border-t border-[#78aaff]/15 pt-4">
            <span>Didn't get mail? Check spam also</span>
            <button onClick={handleResend} disabled={resendCooldown > 0} className="text-[#27d3ff] bg-transparent border-none flex items-center gap-1 disabled:opacity-40">
              <RefreshCw className="w-3 h-3" />{resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};