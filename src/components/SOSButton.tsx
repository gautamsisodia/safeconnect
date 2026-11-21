import { useState } from 'react';

export default function SOSButton() {
  const [showModal, setShowModal] = useState(false);
  const [showDenied, setShowDenied] = useState(false);
  const [sending, setSending] = useState(false);

  const getLocation = (): Promise<{lat:number, lng:number} | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) { resolve(null); return; }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  };

  const handleChoice = async (allow: boolean) => {
    setShowModal(false);
    if (!allow) {
      setShowDenied(true); // WhatsApp nahi khulega
      return;
    }
    setSending(true);
    const loc = await getLocation();
    if (!loc) {
      setSending(false);
      setShowDenied(true);
      return;
    }
    let message = "🚨 EMERGENCY SOS from SafeConnect - I need immediate help!";
    message += `\nLocation: https://www.google.com/maps?q=${loc.lat},${loc.lng}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
    setSending(false);
  };

  // Screenshot wala common style
  const overlayStyle: React.CSSProperties = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 16, backdropFilter: "blur(4px)" };
  const cardStyle: React.CSSProperties = { position: "relative", background: "#171717", border: "1px solid rgba(255,255,255,0.1)", padding: "32px 24px 24px", borderRadius: 16, maxWidth: 400, width: "100%", textAlign: "center", color: "white", boxShadow: "0 0 40px rgba(0,0,0,0.8)" };
  const blueBtnStyle: React.CSSProperties = { width: "100%", padding: "14px", borderRadius: 999, background: "linear-gradient(to right, #2f7bff, #27d3ff)", color: "white", border: "none", fontWeight: "bold", fontSize: 15, cursor: "pointer", boxShadow: "0 0 25px rgba(47,123,255,0.6)" };
  const closeStyle: React.CSSProperties = { position: "absolute", top: 12, right: 12, background: "transparent", border: "none", color: "#9ca3af", fontSize: 20, cursor: "pointer" };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        disabled={sending}
        style={{ background: "#ef4444", color: "white", padding: "20px 30px", borderRadius: "50%", border: "none", fontWeight: "bold", cursor: "pointer", boxShadow: "0 0 25px rgba(239,68,68,0.6)" }}
      >
        {sending ? "SENDING..." : "SOS"}
      </button>

      {/* LOCATION PERMISSION - Screenshot design */}
      {showModal && (
        <div style={overlayStyle}>
          <div style={cardStyle}>
            <button onClick={() => setShowModal(false)} style={closeStyle}>✕</button>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Share Live Location?</h3>
            <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 8 }}>SafeConnect needs your location to send accurate help.</p>
            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <button onClick={() => handleChoice(false)} style={{ flex: 1, padding: 12, borderRadius: 999, background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.1)", fontWeight: 600, cursor: "pointer" }}>Deny</button>
              <button onClick={() => handleChoice(true)} style={{ flex: 1, padding: 12, borderRadius: 999, background: "linear-gradient(to right, #2f7bff, #27d3ff)", color: "white", border: "none", fontWeight: "bold", cursor: "pointer", boxShadow: "0 0 25px rgba(47,123,255,0.6)" }}>Allow Location</button>
            </div>
          </div>
        </div>
      )}

      {/* DENY NOTIFICATION - Bilkul screenshot jaisa */}
      {showDenied && (
        <div style={overlayStyle}>
          <div style={cardStyle}>
            <button onClick={() => setShowDenied(false)} style={closeStyle}>✕</button>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Location Permission Denied!</h3>
            <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 8 }}>Message cannot be sent without location.<br/>Please allow location permission to send SOS.</p>
            <button onClick={() => setShowDenied(false)} style={{ ...blueBtnStyle, marginTop: 24 }}>Go to Dashboard</button>
          </div>
        </div>
      )}
    </>
  );
}