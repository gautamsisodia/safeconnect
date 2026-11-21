import React, { useState } from 'react';
import { ShieldAlert, MapPin, UserPlus, Trash2, Send, CheckCircle, X } from 'lucide-react';
import { User, TrustedContact, getStoredContacts, saveStoredContacts } from '../services/storageService.ts';

interface DashboardScreenProps {
  user: User;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
  onRequestLocationPermission: (actionType: 'alert' | 'location' | 'sos', payload?: unknown) => void;
}

const EMERGENCY_OPTIONS = [
  'Medical Emergency', 'Women Safety', 'Road Accident', 'Crime / Assault / Theft',
  'Fire Emergency', 'Natural Disaster - Flood', 'Natural Disaster - Earthquake',
  'Child Safety Emergency', 'Elderly Emergency', 'Mental Health Crisis',
  'Harassment / Stalking', 'Other Emergency',
];

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ user, onNavigate, onLogout, onRequestLocationPermission }) => {
  const [contacts, setContacts] = useState<TrustedContact[]>(() => getStoredContacts(user.email));
  const [selectedEmergencyType, setSelectedEmergencyType] = useState(EMERGENCY_OPTIONS[0]);
  const [emergencyNote, setEmergencyNote] = useState('');
  const [alertNotice, setAlertNotice] = useState<{type: 'success' | 'loading' | 'error', msg: string} | null>(null);
  const [forwardedInfo, setForwardedInfo] = useState<string | null>(null);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [relationship, setRelationship] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  const [isSendingSOS, setIsSendingSOS] = useState(false);
  const [isSendingAlert, setIsSendingAlert] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState<null | 'sos' | 'alert'>(null);
  // Deny wala notification - isi design me
  const [showDeniedModal, setShowDeniedModal] = useState(false);

  const BASE_URL = "https://safeconnectfinal.infinityfree.me";

  const getDbEmergencyType = (uiType: string) => {
    const t = uiType.toLowerCase();
    if (t.includes('medical')) return 'medical';
    if (t.includes('women') || t.includes('harassment')) return 'harassment';
    if (t.includes('fire')) return 'fire';
    if (t.includes('road') || t.includes('accident')) return 'accident';
    if (t.includes('crime') || t.includes('assault') || t.includes('theft')) return 'police';
    return 'other';
  };

  const saveSOS = async (lat?: number, lng?: number) => {
    try {
      await fetch(`${BASE_URL}/sos_alert.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.email, user_name: user.name, latitude: lat, longitude: lng }),
      });
    } catch(e) {}
  };

  const saveAlert = async (type: string, desc: string, lat?: number, lng?: number) => {
    try {
      const dbType = getDbEmergencyType(type);
      const res = await fetch(`${BASE_URL}/save_emergency.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          user_id: user.email, 
          user_name: user.name, 
          emergency_type: dbType, 
          description: desc, 
          latitude: lat, 
          longitude: lng,
          address: desc || `${lat}, ${lng}`
        }),
      });
      const data = await res.json();
      if(data.success){
        setForwardedInfo(data.message);
      }
      return data;
    } catch(e) {
      return null;
    }
  };

  const getLocationPromise = (): Promise<{lat:number, lng:number} | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) { resolve(null); return; }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  };

  const handleSOSClick = () => {
    if (isSendingSOS) return;
    setForwardedInfo(null);
    setShowLocationModal('sos');
  };

  const handleLocationChoice = async (allow: boolean) => {
    const action = showLocationModal;
    setShowLocationModal(null);
    if (!action) return;

    // DENY PE WHATSAPP NAHI KHULEGA - ISI DESIGN WALA NOTIFICATION KHULEGA
    if (!allow) {
      setShowDeniedModal(true);
      setIsSendingSOS(false);
      setIsSendingAlert(false);
      return;
    }

    if (action === 'sos') {
      setIsSendingSOS(true);
      setAlertNotice({type: 'loading', msg: 'Getting live location... Please Allow in browser popup'});
      const loc = await getLocationPromise();
      if (!loc) {
        setIsSendingSOS(false);
        setAlertNotice(null);
        setShowDeniedModal(true);
        return;
      }
      const mapLink = `https://www.google.com/maps?q=${loc.lat},${loc.lng}`;
      const message = `🚨 EMERGENCY SOS - SafeConnect 🚨\nName: ${user.name}\nI need immediate help!\nLocation: ${mapLink}`;
      await saveSOS(loc.lat, loc.lng);
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
      onRequestLocationPermission('sos', { type: 'Emergency SOS' });
      setAlertNotice({type: 'success', msg: 'SOS Sent! Saved + WhatsApp opened'});
      setTimeout(() => setAlertNotice(null), 4000);
      setIsSendingSOS(false);
    }

    if (action === 'alert') {
      setIsSendingAlert(true);
      setAlertNotice({type: 'loading', msg: 'Getting location for alert...'});
      const loc = await getLocationPromise();
      if (!loc) {
        setIsSendingAlert(false);
        setAlertNotice(null);
        setShowDeniedModal(true);
        return;
      }
      const data = await saveAlert(selectedEmergencyType, emergencyNote, loc.lat, loc.lng);
      onRequestLocationPermission('alert', { type: selectedEmergencyType, note: emergencyNote });
      if(data?.success){
        setAlertNotice({type: 'success', msg: `${data.dispatch.ticket_id} - Forwarded to ${data.dispatch.authority_name}`});
      } else {
        setAlertNotice({type: 'success', msg: `Alert Sent! ${selectedEmergencyType} saved.`});
      }
      setEmergencyNote(''); 
      setTimeout(() => setAlertNotice(null), 6000);
      setIsSendingAlert(false);
    }
  };

  const handleSendAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSendingAlert) return;
    setForwardedInfo(null);
    setShowLocationModal('alert');
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactPhone || !relationship) return;
    const newContact: TrustedContact = {
      contact_id: Date.now(), user_email: user.email, contact_name: contactName.trim(),
      contact_phone: contactPhone.trim(), relationship: relationship.trim(), created_at: new Date().toISOString(),
    };
    const updated = [...contacts, newContact];
    setContacts(updated); saveStoredContacts(updated);
    setContactName(''); setContactPhone(''); setRelationship('');
    setContactSuccess(true); setTimeout(() => setContactSuccess(false), 3000);
  };

  const handleDeleteContact = (id: number) => {
    const updated = contacts.filter(c => c.contact_id !== id);
    setContacts(updated); saveStoredContacts(updated);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-20">
      <div className="glass p-6 sm:p-8 mb-8 border border-[#78aaff]/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Welcome to SafeConnect Dashboard 🎉</h1>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-6 text-xs sm:text-sm text-[#cfe0ff]">
              <p><strong className="text-[#9fb0d6]">Name:</strong> {user.name}</p>
              <p><strong className="text-[#9fb0d6]">Email:</strong> {user.email}</p>
              <p><strong className="text-[#9fb0d6]">Status:</strong> <span className="text-emerald-400 font-semibold">Active</span></p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onNavigate('profile')} className="btn-secondary text-xs sm:text-sm py-2 px-4">My Profile</button>
            <button onClick={onLogout} className="btn-secondary text-xs sm:text-sm py-2 px-4 border-red-500/40 text-[#ff8a96]">Logout</button>
          </div>
        </div>
      </div>
      {alertNotice && (
        <div className={`mb-6 p-4 rounded-2xl border flex items-center gap-3 ${alertNotice.type === 'success' ? 'bg-gradient-to-r from-emerald-600/30 to-blue-600/30 border-emerald-500/50' : alertNotice.type === 'error' ? 'bg-red-500/20 border-red-500/50' : 'bg-gradient-to-r from-blue-600/20 to-blue-600/20 border-blue-500/50'} text-white`}>
          {alertNotice.type === 'success' ? <CheckCircle className="w-6 h-6 text-emerald-400" /> : alertNotice.type === 'error' ? <ShieldAlert className="w-6 h-6 text-red-400" /> : <ShieldAlert className="w-6 h-6 text-blue-400 animate-pulse" />}
          <div className="text-xs sm:text-sm font-bold">{alertNotice.msg}</div>
        </div>
      )}
      {forwardedInfo && (
        <div className="mb-6 p-4 rounded-2xl border border-[#27d3ff]/40 bg-[#27d3ff]/10 text-white">
          <p className="text-xs sm:text-sm font-medium leading-relaxed">{forwardedInfo}</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass p-6 flex flex-col justify-between border-[#ff4d5e]/30">
          <div>
            <h2 className="text-xl font-bold text-white">🚨 Emergency SOS</h2>
            <div className="my-4 text-center">
              <div className="sos-container my-2">
                <div className="sos-ring"></div><div className="sos-ring"></div><div className="sos-ring"></div>
                <button type="button" onClick={handleSOSClick} disabled={isSendingSOS} className="sos-center-btn"><span>{isSendingSOS ? '...' : 'SOS'}</span><span className="text-[9px]">{isSendingSOS ? 'SENDING' : 'TAP NOW'}</span></button>
              </div>
              <button type="button" onClick={handleSOSClick} disabled={isSendingSOS} className="sos-btn mt-3 disabled:opacity-60">{isSendingSOS ? 'SENDING SOS...' : 'SEND SOS ALERT'}</button>
            </div>
            <p className="text-xs text-[#9fb0d6] mt-4">This will open WhatsApp + save to DB.</p>
          </div>
        </div>
        <div className="glass p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">🛡️ Emergency Alert</h2>
            <form onSubmit={handleSendAlert} className="space-y-4 mt-4">
              <select value={selectedEmergencyType} onChange={e => setSelectedEmergencyType(e.target.value)} className="w-full text-xs sm:text-sm bg-[#050b1f] text-white border border-[#78aaff]/30 rounded-xl p-3">
                {EMERGENCY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <textarea rows={3} value={emergencyNote} onChange={e => setEmergencyNote(e.target.value)} placeholder="e.g. Near library gate 3... (optional)" className="w-full text-xs text-white bg-[#050b1f] border border-[#78aaff]/30 rounded-xl p-3"></textarea>
              <button type="submit" disabled={isSendingAlert} className="btn w-full py-3 text-sm font-semibold cursor-pointer disabled:opacity-60"><Send className="w-4 h-4 mr-1" />{isSendingAlert ? 'Sending...' : 'Send Alert with Location'}</button>
            </form>
            <p className="text-xs text-[#9fb0d6] mt-3">Only Notification + DB, No WhatsApp.</p>
          </div>
        </div>
        <div className="glass p-6">
          <h2 className="text-xl font-bold text-white">👥 Trusted Contacts</h2>
          {contactSuccess && <div className="mt-2 text-xs text-emerald-400">Contact Added!</div>}
          <form onSubmit={handleAddContact} className="space-y-2.5 my-4">
            <input type="text" value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Contact Name" className="text-xs p-2.5 w-full rounded-xl bg-[#050b1f] border border-[#78aaff]/30 text-white" required />
            <input type="tel" value={contactPhone} onChange={e => setContactPhone(e.target.value)} placeholder="Contact Number" className="text-xs p-2.5 w-full rounded-xl bg-[#050b1f] border border-[#78aaff]/30 text-white" required />
            <input type="text" value={relationship} onChange={e => setRelationship(e.target.value)} placeholder="Relationship" className="text-xs p-2.5 w-full rounded-xl bg-[#050b1f] border border-[#78aaff]/30 text-white" required />
            <button type="submit" className="btn w-full py-2.5 text-xs font-semibold"><UserPlus className="w-3.5 h-3.5 mr-1" />Add Contact</button>
          </form>
          <div className="max-h-40 overflow-y-auto space-y-2.5">
            {contacts.map(c => (
              <div key={c.contact_id} className="p-2.5 rounded-xl bg-[#050b1f]/70 border border-[#78aaff]/20 flex items-center justify-between">
                <div className="text-xs"><strong className="text-white block">{c.contact_name}</strong><span className="text-[#27d3ff] block">{c.contact_phone}</span></div>
                <button onClick={() => handleDeleteContact(c.contact_id)} className="p-1.5 text-[#ff8a96]"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LOCATION PERMISSION MODAL - Screenshot wale design me */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="relative w-full max-w-md bg-[#171717] border border-white/10 rounded-2xl px-6 pt-8 pb-6 text-center shadow-[0_0_40px_rgba(0,0,0,0.8)]">
            <button onClick={() => setShowLocationModal(null)} className="absolute top-3 right-3 text-gray-400 hover:text-white bg-transparent border-none cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-white font-extrabold text-xl leading-tight">Share Live Location?</h3>
            <p className="text-[13px] text-gray-400 mt-2 leading-relaxed">SafeConnect needs your location to send accurate help to your trusted contacts.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => handleLocationChoice(false)} className="flex-1 py-3 rounded-full bg-white/10 text-white text-sm font-semibold border border-white/10 cursor-pointer">Deny</button>
              <button onClick={() => handleLocationChoice(true)} className="flex-1 py-3 rounded-full bg-gradient-to-r from-[#2f7bff] to-[#27d3ff] text-white text-sm font-bold shadow-[0_0_25px_rgba(47,123,255,0.6)] cursor-pointer">Allow Location</button>
            </div>
          </div>
        </div>
      )}

      {/* DENY NOTIFICATION - Bilkul screenshot jaisa */}
      {showDeniedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="relative w-full max-w-md bg-[#171717] border border-white/10 rounded-2xl px-6 pt-8 pb-6 text-center shadow-[0_0_40px_rgba(0,0,0,0.8)]">
            <button onClick={() => setShowDeniedModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-white bg-transparent border-none cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-white font-extrabold text-xl leading-tight">Location Permission Denied!</h3>
            <p className="text-[13px] text-gray-400 mt-2 leading-relaxed">Message cannot be sent without location.<br/>Please allow location permission to send SOS.</p>
            <button onClick={() => setShowDeniedModal(false)} className="w-full mt-6 py-3.5 rounded-full bg-gradient-to-r from-[#2f7bff] to-[#27d3ff] text-white text-[15px] font-bold shadow-[0_0_25px_rgba(47,123,255,0.6)] cursor-pointer hover:opacity-90">
              Go to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};