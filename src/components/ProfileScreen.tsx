import React, { useState } from 'react';
import {
  User as UserIcon,
  Phone,
  Mail,
  ShieldCheck,
  HeartPulse,
  Calendar,
  Save,
  ArrowLeft,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { User, getStoredUsers, saveStoredUsers, setCurrentUser } from '../services/storageService.ts';

const BASE_URL = "https://safeconnectfinal.infinityfree.me";

interface ProfileScreenProps {
  user: User;
  onNavigate: (screen: string) => void;
  onUpdateUser: (updatedUser: User) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  onNavigate,
  onUpdateUser,
}) => {
  const [bloodGroup, setBloodGroup] = useState(user.blood_group || 'B+');
  const [emergencyNotes, setEmergencyNotes] = useState(
    user.emergency_notes || 'Example: Allergic to penicillin. Carries emergency inhaler.'
  );
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: User = {
      ...user,
      blood_group: bloodGroup,
      emergency_notes: emergencyNotes,
    };
    const allUsers = getStoredUsers();
    const idx = allUsers.findIndex(u => u.user_id === user.user_id);
    if (idx !== -1) {
      allUsers[idx] = updated;
      saveStoredUsers(allUsers);
    }
    setCurrentUser(updated);
    onUpdateUser(updated);
    try {
      await fetch(`${BASE_URL}/save_medical_profile.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.email,
          blood_group: bloodGroup,
          medical_notes: emergencyNotes,
        }),
      });
    } catch (err) {
      console.log("Backend save failed, but local saved", err);
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const formatRegisteredDate = (dateStr: string) => {
    if (!dateStr) return new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour:'2-digit', minute:'2-digit' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-1.5 text-xs text-[#27d3ff] hover:underline mb-2 bg-transparent border-none cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <UserIcon className="w-8 h-8 text-[#27d3ff]" />
            <span>User Profile &amp; Medical Safety</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#9fb0d6] mt-1">
            Personal identity and medical information.
          </p>
        </div>
        <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          <span>Active</span>
        </span>
      </div>
      {saveSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-green-500/20 border border-green-500/40 text-green-300 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>Profile and medical details updated successfully.</span>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 text-center flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#2f7bff] via-[#1b4fd8] to-[#27d3ff] flex items-center justify-center font-extrabold text-3xl text-white shadow-[0_0_25px_rgba(47,123,255,0.6)] mb-4">
            {user.name ? user.name.charAt(0).toUpperCase() : 'G'}
          </div>
          <h2 className="text-xl font-bold text-white">{user.name}</h2>
          <span className="text-xs text-emerald-400 font-medium mt-1">Active Account</span>
          <div className="w-full mt-6 space-y-3 text-left text-xs text-[#cfe0ff]">
            <div className="p-3 rounded-xl bg-[#050b1f]/80 border border-[#78aaff]/20 flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#27d3ff] flex-shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-[#9fb0d6] block">Email Address</span>
                <span className="font-mono">{user.email}</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#050b1f]/80 border border-[#78aaff]/20 flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#27d3ff] flex-shrink-0" />
              <div>
                <span className="text-[10px] text-[#9fb0d6] block">Phone Number</span>
                <span className="font-mono">{user.phone || '+91 Not Set'}</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#050b1f]/80 border border-[#78aaff]/20 flex items-center gap-3">
              <Calendar className="w-4 h-4 text-[#27d3ff] flex-shrink-0" />
              <div>
                <span className="text-[10px] text-[#9fb0d6] block">Registered On</span>
                <span>{formatRegisteredDate(user.registered_at)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="md:col-span-2 glass p-6 sm:p-8">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-rose-400" />
            <span>Emergency Medical Data</span>
          </h2>
          <p className="text-xs text-[#9fb0d6] mb-6">
            This information is attached to Medical Emergency alerts so first responders know critical details.
          </p>
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#cfe0ff] mb-2">
                Blood Group
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => setBloodGroup(bg)}
                    className={`py-2 rounded-xl text-xs font-bold transition border ${
                      bloodGroup === bg
                        ? 'bg-[#2f7bff] border-[#27d3ff] text-white shadow-[0_0_15px_rgba(47,123,255,0.5)]'
                        : 'bg-[#050b1f] border-[#78aaff]/25 text-[#9fb0d6] hover:text-white'
                    }`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#cfe0ff] mb-2">
                Allergies, Medications &amp; Emergency Notes
              </label>
              <textarea
                rows={4}
                value={emergencyNotes}
                onChange={e => setEmergencyNotes(e.target.value)}
                placeholder="List any drug allergies, asthma, conditions, or emergency medication..."
                className="w-full text-xs sm:text-sm bg-[#050b1f] border border-[#78aaff]/20 rounded-xl p-3 text-white outline-none"
              ></textarea>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0d2257]/40 border border-[#2f7bff]/30 text-xs text-[#cfe0ff] flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#27d3ff] flex-shrink-0" />
              <span>Stored securely for emergency situations</span>
            </div>
            <button
              type="submit"
              className="btn py-3 px-8 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-[0_0_20px_rgba(47,123,255,0.4)] cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Updates</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};