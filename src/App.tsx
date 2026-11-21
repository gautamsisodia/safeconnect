import React, { useState, useEffect } from 'react';
import {
  getCurrentUser,
  setCurrentUser,
  User,
} from './services/storageService.ts';
import { Navbar } from './components/Navbar.tsx';
import { MobileBottomNav } from './components/MobileBottomNav.tsx';
import { RegistrationScreen } from './components/RegistrationScreen.tsx';
import { OtpVerificationScreen } from './components/OtpVerificationScreen.tsx';
import { LoginScreen } from './components/LoginScreen.tsx';
import { DashboardScreen } from './components/DashboardScreen.tsx';
import { TrustedContactsScreen } from './components/TrustedContactsScreen.tsx';
import { EmergencyAlertScreen } from './components/EmergencyAlertScreen.tsx';
import { HelplineScreen } from './components/HelplineScreen.tsx';
import { ProfileScreen } from './components/ProfileScreen.tsx';
import { EmergencyHistoryScreen } from './components/EmergencyHistoryScreen.tsx';
import { LandingScreen } from './components/LandingScreen.tsx';
import { Footer } from './components/Footer.tsx';
import { MapPin, CheckCircle2, X } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrUser] = useState<User | null>(null);
  const [currentScreen, setCurrentScreen] = useState<string>('landing');

  const [pendingRegistration, setPendingRegistration] = useState<{
    email: string; name: string; phone: string; otp?: string;
  } | null>(null);

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [pendingLocationAction, setPendingLocationAction] = useState<any>(null);
  const [locationStatusNotice, setLocationStatusNotice] = useState<string | null>(null);
  const [isLocationAllowed, setIsLocationAllowed] = useState(false);
  const [showSosModal, setShowSosModal] = useState(false);

  useEffect(() => {
    const saved = getCurrentUser();
    if (saved) {
      setCurrUser(saved);
    }
    setCurrentScreen('landing');
  }, []);

  const handleLogout = () => {
  localStorage.removeItem('safeconnect_current_user_v1');
  localStorage.removeItem('safeconnect_is_logged_in');
  localStorage.removeItem('safeconnect_current_user');
  setCurrentUser(null);
  setCurrUser(null);
  setCurrentScreen('landing');
  };

  const handleRegistered = (data: any) => {
    setPendingRegistration(data);
    setCurrentScreen('otp');
  };

  const handleOtpVerified = (verifiedUser: User) => {
    setCurrentUser(verifiedUser);
    setCurrUser(verifiedUser);
    setPendingRegistration(null);
    setCurrentScreen('dashboard');
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrUser(user);
    setCurrentScreen('dashboard');
  };

  const handleRequestLocationPermission = (actionType: any, payload?: any) => {
    setPendingLocationAction({ actionType, payload });
    setShowLocationModal(true);
  };

  const handleAllowLocation = () => {
    setIsLocationAllowed(true);
    setShowLocationModal(false);
    if (pendingLocationAction?.actionType === 'sos') setShowSosModal(true);
    setLocationStatusNotice('Location shared.');
    setTimeout(() => setLocationStatusNotice(null), 4000);
  };
  const handleDenyLocation = () => {
    setShowLocationModal(false);
    if (pendingLocationAction?.actionType === 'sos') setShowSosModal(true);
    setLocationStatusNotice('Location denied.');
    setTimeout(() => setLocationStatusNotice(null), 4000);
  };

  const renderScreenContent = () => {
    const protectedScreens = ['dashboard', 'alerts', 'contacts', 'helplines', 'profile', 'history'];
    
    if (protectedScreens.includes(currentScreen) && !currentUser) {
      return <LoginScreen onNavigate={setCurrentScreen} onLoginSuccess={handleLoginSuccess} />;
    }

    switch (currentScreen) {
      case 'login':
        return <LoginScreen onNavigate={setCurrentScreen} onLoginSuccess={handleLoginSuccess} />;
      case 'register':
        return <RegistrationScreen onNavigate={setCurrentScreen} onRegistered={handleRegistered} />;
      case 'otp':
        return <OtpVerificationScreen email={pendingRegistration?.email || ''} name={pendingRegistration?.name || ''} phone={pendingRegistration?.phone || ''} onOtpVerified={handleOtpVerified} onNavigate={setCurrentScreen} />;
      case 'dashboard':
        return <DashboardScreen user={currentUser!} onNavigate={setCurrentScreen} onLogout={handleLogout} onRequestLocationPermission={handleRequestLocationPermission} />;
      case 'alerts':
        return <EmergencyAlertScreen user={currentUser!} onNavigate={setCurrentScreen} onRequestLocationPermission={handleRequestLocationPermission} />;
      case 'contacts':
        return <TrustedContactsScreen user={currentUser!} onNavigate={setCurrentScreen} />;
      case 'helplines':
        return <HelplineScreen onNavigate={setCurrentScreen} />;
      case 'profile':
        return <ProfileScreen user={currentUser!} onNavigate={setCurrentScreen} onUpdateUser={setCurrUser} />;
      case 'history':
        return <EmergencyHistoryScreen user={currentUser!} onNavigate={setCurrentScreen} />;
      case 'landing':
        return <LandingScreen onNavigate={setCurrentScreen} onTriggerSosDemo={() => handleRequestLocationPermission('sos', { type: 'Emergency SOS' })} />;
      default:
        return <LoginScreen onNavigate={setCurrentScreen} onLoginSuccess={handleLoginSuccess} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050b1f] text-[#e8eefc] flex flex-col">
      <Navbar currentScreen={currentScreen} onNavigate={setCurrentScreen} currentUser={currentUser} onLogout={handleLogout} />
      {locationStatusNotice && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl glass border border-[#27d3ff]/40 flex items-center gap-3 max-w-md w-[90%]">
          <CheckCircle2 className="w-5 h-5 text-[#27d3ff]" />
          <p className="text-xs sm:text-sm font-medium text-white">{locationStatusNotice}</p>
        </div>
      )}
      <main className="flex-1 flex flex-col pb-16 md:pb-0">
        {renderScreenContent()}
        <Footer />
      </main>
      <MobileBottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} isLoggedIn={!!currentUser} />
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-sm glass p-6 text-center rounded-3xl">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#2f7bff] to-[#27d3ff] flex items-center justify-center mx-auto mb-4"><MapPin className="w-7 h-7" /></div>
            <h3 className="text-lg font-bold text-white mb-2">SafeConnect wants to access your current location.</h3>
            <div className="flex gap-3 mt-6"><button onClick={handleAllowLocation} className="btn w-full py-3">Allow</button><button onClick={handleDenyLocation} className="w-full py-3 rounded-full border bg-white/5">Deny</button></div>
          </div>
        </div>
      )}
      {showSosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md glass p-6 text-center rounded-3xl border-[#ff4d5e]/50 relative">
            <button onClick={() => setShowSosModal(false)} className="absolute top-4 right-4 text-[#9fb0d6]"><X className="w-5 h-5" /></button>
            <h3 className="text-xl font-extrabold text-white mt-4">Emergency SOS Alert Broadcasted!</h3>
            <button onClick={() => { setShowSosModal(false); setCurrentScreen('dashboard'); }} className="btn w-full py-3 mt-6">Go to Dashboard</button>
          </div>
        </div>
      )}
    </div>
  );
}