import React from 'react';
import {
  Shield,
  UserCheck,
  Lock,
  Bell,
  MapPin,
  MessageSquare,
  Key,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface LandingScreenProps {
  onNavigate: (screen: string) => void;
  onTriggerSosDemo: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onNavigate,
  onTriggerSosDemo,
}) => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <header className="hero relative min-h-[90vh] flex items-center justify-center text-center px-4 pt-28 pb-16 overflow-hidden">
        <div className="grid-bg"></div>
        <div className="orb o1"></div>
        <div className="orb o2"></div>
        <div className="orb o3"></div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          {/* Hero Logo Plate */}
          <div className="heroLogo mb-6">
            <span className="plate lg shadow-[0_0_35px_rgba(47,123,255,0.6)]">
              <img
                src="/logo.png"
                alt="SafeConnect Logo"
                className="w-56 sm:w-72 h-auto object-contain"
              />
            </span>
          </div>

          {/* Interactive Concentric SOS Centerpiece */}
          <div
            onClick={onTriggerSosDemo}
            className="sos cursor-pointer group mb-6 transition-transform transform hover:scale-105"
            title="Click for Emergency SOS Demo"
          >
            <span></span>
            <span></span>
            <span></span>
            <b className="group-hover:shadow-[0_0_50px_#ff4d5e]">SOS</b>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-white via-[#9cc4ff] to-[#27d3ff] bg-clip-text text-transparent">
            SafeConnect
          </h1>
          <h2 className="text-base sm:text-xl font-normal text-[#9fb0d6] tracking-[0.25em] sm:tracking-[0.4em] uppercase mt-3 mb-8">
            One Tap to Safety
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('register')}
              className="btn px-8 py-3.5 text-base font-semibold shadow-[0_0_25px_rgba(47,123,255,0.6)]"
            >
              Get Started Free
            </button>
            <button
              onClick={() => onNavigate('login')}
              className="btn-secondary px-7 py-3 text-sm font-semibold"
            >
              Existing User Login
            </button>
          </div>

          {/* Key Stats Bar */}
          <div className="stats mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-3xl">
            <div className="stat glass p-4 text-center rounded-2xl">
              <strong className="text-2xl text-[#27d3ff] font-bold">1 Tap</strong>
              <small className="text-xs text-[#9fb0d6] block mt-0.5">Starts an alert</small>
            </div>
            <div className="stat glass p-4 text-center rounded-2xl">
              <strong className="text-2xl text-[#27d3ff] font-bold">Live</strong>
              <small className="text-xs text-[#9fb0d6] block mt-0.5">Location sharing</small>
            </div>
            <div className="stat glass p-4 text-center rounded-2xl">
              <strong className="text-2xl text-[#27d3ff] font-bold">OTP</strong>
              <small className="text-xs text-[#9fb0d6] block mt-0.5">Verified accounts</small>
            </div>
            <div className="stat glass p-4 text-center rounded-2xl">
              <strong className="text-2xl text-[#27d3ff] font-bold">24/7</strong>
              <small className="text-xs text-[#9fb0d6] block mt-0.5">Always available</small>
            </div>
          </div>
        </div>
      </header>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 relative max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center">About SafeConnect</h2>
        <p className="lead text-[#9fb0d6] text-center max-w-2xl mx-auto mt-3 mb-12">
          A centralized emergency alert system that connects you instantly with your trusted contacts and authorities.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="glass p-8 sm:p-10">
            <h3 className="text-2xl font-bold mb-4 text-[#e8eefc]">
              Help should never be more than a tap away
            </h3>
            <p className="text-[#9fb0d6] mb-4 text-sm sm:text-base leading-relaxed">
              In an emergency, every second counts. SafeConnect brings every channel of help into one place. A single tap sends your alert and live location to the people who can respond, so you don’t have to call, type, or explain while in danger.
            </p>
            <p className="text-[#9fb0d6] text-sm sm:text-base leading-relaxed">
              Every account is verified with a one-time password (OTP) via PHPMailer SMTP, ensuring alerts come from authentic users and reach real responders.
            </p>

            <div className="flex flex-wrap gap-2.5 mt-6">
              {['Trusted contacts', 'Authorities', 'Live location', 'Verified users', 'PHP & MySQL'].map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#2f7bff]/15 border border-[#2f7bff]/40 text-[#bcd4ff]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Network Graphic */}
          <div className="glass p-8 flex items-center justify-center">
            <svg
              viewBox="0 0 320 260"
              width="100%"
              className="max-w-[340px]"
              role="img"
              aria-label="You at the centre, linked to trusted contacts and authorities"
            >
              <defs>
                <radialGradient id="g">
                  <stop offset="0%" stopColor="#27d3ff" />
                  <stop offset="100%" stopColor="#2f7bff" />
                </radialGradient>
              </defs>
              <g stroke="#5b95ff" strokeWidth="1.5" strokeDasharray="4 5" opacity="0.8">
                <line x1="160" y1="130" x2="50" y2="50" />
                <line x1="160" y1="130" x2="270" y2="50" />
                <line x1="160" y1="130" x2="50" y2="210" />
                <line x1="160" y1="130" x2="270" y2="210" />
              </g>
              <circle cx="160" cy="130" r="46" fill="none" stroke="#27d3ff" opacity="0.35">
                <animate attributeName="r" values="40;75;40" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="160" cy="130" r="34" fill="url(#g)" />
              <text x="160" y="136" textAnchor="middle" fill="#fff" fontFamily="Poppins,sans-serif" fontWeight="700" fontSize="16">
                YOU
              </text>
              <g fill="#0d2257" stroke="#5b95ff" strokeWidth="1.5">
                <circle cx="50" cy="50" r="24" />
                <circle cx="270" cy="50" r="24" />
                <circle cx="50" cy="210" r="24" />
                <circle cx="270" cy="210" r="24" />
              </g>
              <g fill="#cfe0ff" fontFamily="Poppins,sans-serif" fontSize="10" textAnchor="middle">
                <text x="50" y="54">Family</text>
                <text x="270" y="54">Friends</text>
                <text x="50" y="214">Police</text>
                <text x="270" y="214">Medical</text>
              </g>
            </svg>
          </div>
        </div>

        {/* How It Works Steps */}
        <div className="mt-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                icon: <UserCheck className="w-6 h-6 text-white" />,
                title: 'Registration',
                desc: 'Create your account with your name, phone, and email.',
              },
              {
                icon: <Key className="w-6 h-6 text-white" />,
                title: 'OTP Verification',
                desc: 'Confirm your phone and email with a secure 6-digit OTP.',
              },
              {
                icon: <Bell className="w-6 h-6 text-white" />,
                title: 'Emergency Alert',
                desc: 'Tap once to log an alert with category and timestamp.',
              },
              {
                icon: <MapPin className="w-6 h-6 text-white" />,
                title: 'Location Sharing',
                desc: 'Share live GPS coordinates and local landmark address.',
              },
              {
                icon: <MessageSquare className="w-6 h-6 text-white" />,
                title: 'Instant Logs',
                desc: 'View recent activities stored securely in MySQL.',
              },
            ].map((step, i) => (
              <div
                key={i}
                className="glass p-6 text-center interactive-card flex flex-col items-center"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#2f7bff] to-[#27d3ff] flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(47,123,255,0.7)]">
                  {step.icon}
                </div>
                <h3 className="font-semibold text-base mb-2 text-[#e8eefc]">{step.title}</h3>
                <p className="text-xs text-[#9fb0d6] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 bg-[#0a1a3f]/40 relative border-t border-b border-[#78aaff]/15">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center">Built for the moments that matter</h2>
          <p className="lead text-[#9fb0d6] text-center max-w-2xl mx-auto mt-3 mb-12">
            Four core safety modules, engineered to work fast and reliably.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <article className="glass p-8 interactive-card">
              <div className="w-14 h-14 rounded-2xl bg-[#2f7bff]/20 border border-[#2f7bff]/50 flex items-center justify-center text-[#27d3ff] mb-6">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold mb-2">Secure Authentication</h3>
              <p className="text-xs sm:text-sm text-[#9fb0d6]">
                Verification by OTP and protected passwords keep every account genuine, safe, and private.
              </p>
            </article>

            <article className="glass p-8 interactive-card border-[#ff4d5e]/40 shadow-[0_0_30px_rgba(255,77,94,0.15)]">
              <div className="w-14 h-14 rounded-2xl bg-[#ff4d5e]/20 border border-[#ff4d5e]/50 flex items-center justify-center text-[#ff8a96] mb-6">
                <Bell className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">One-Tap Emergency Alert</h3>
              <p className="text-xs sm:text-sm text-[#9fb0d6]">
                One tap saves your alert category, user info, and time in the MySQL database.
              </p>
            </article>

            <article className="glass p-8 interactive-card">
              <div className="w-14 h-14 rounded-2xl bg-[#2f7bff]/20 border border-[#2f7bff]/50 flex items-center justify-center text-[#27d3ff] mb-6">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold mb-2">Location Sharing</h3>
              <p className="text-xs sm:text-sm text-[#9fb0d6]">
                Your live GPS position goes with every alert so responders can find you quickly.
              </p>
            </article>

            <article className="glass p-8 interactive-card">
              <div className="w-14 h-14 rounded-2xl bg-[#2f7bff]/20 border border-[#2f7bff]/50 flex items-center justify-center text-[#27d3ff] mb-6">
                <MessageSquare className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold mb-2">Trusted Contacts</h3>
              <p className="text-xs sm:text-sm text-[#9fb0d6]">
                Store family, guardians, or security warden contacts for rapid coordination.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Contact + Footer REMOVED - Ye ab App.tsx wale <Footer /> se aayega, isliye double nahi hoga */}
    </div>
  );
};