import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Phone,
  Trash2,
  CheckCircle2,
  ArrowLeft,
  MessageSquare,
} from 'lucide-react';
import { User, TrustedContact, getStoredContacts, saveStoredContacts } from '../services/storageService.ts';

interface TrustedContactsScreenProps {
  user: User;
  onNavigate: (screen: string) => void;
}

export const TrustedContactsScreen: React.FC<TrustedContactsScreenProps> = ({
  user,
  onNavigate,
}) => {
  const [contacts, setContacts] = useState<TrustedContact[]>(() =>
    getStoredContacts(user.email)
  );

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('Parent');
  const [isAdding, setIsAdding] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !relationship) return;

    const newContact: TrustedContact = {
      contact_id: Date.now(),
      user_email: user.email,
      contact_name: name.trim(),
      contact_phone: phone.trim(),
      relationship: relationship.trim(),
      created_at: new Date().toISOString(),
    };

    const updated = [...contacts, newContact];
    setContacts(updated);
    saveStoredContacts(updated);
    setName('');
    setPhone('');
    setRelationship('Parent');
    setIsAdding(false);
    setStatusMsg('Trusted contact added successfully.');
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleDelete = (id: number) => {
    const updated = contacts.filter(c => c.contact_id !== id);
    setContacts(updated);
    saveStoredContacts(updated);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-20">
      {/* Header */}
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
            <Users className="w-8 h-8 text-[#27d3ff]" />
            <span>Trusted Contacts</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#9fb0d6] mt-1">
            Contacts who receive instant alerts when SOS is activated.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="btn py-2.5 px-5 text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-[0_0_15px_rgba(47,123,255,0.4)]"
        >
          <UserPlus className="w-4 h-4" />
          <span>{isAdding ? 'Cancel' : 'Add Contact'}</span>
        </button>
      </div>

      {/* Messages */}
      {statusMsg && (
        <div className="mb-6 p-3.5 rounded-xl text-xs flex items-center gap-2 border bg-green-500/15 border-green-500/40 text-green-300">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Add Contact Modal / Form */}
      {isAdding && (
        <div className="glass p-6 sm:p-8 mb-8 border border-[#27d3ff]/40 shadow-[0_0_30px_rgba(39,211,255,0.15)] animate-rise">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[#27d3ff]" />
            <span>Add Emergency Contact</span>
          </h2>
          <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#9fb0d6] mb-1.5">
                Contact Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className="text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#9fb0d6] mb-1.5">
                Contact Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#9fb0d6] mb-1.5">
                Relationship
              </label>
              <select
                value={relationship}
                onChange={e => setRelationship(e.target.value)}
                className="text-xs bg-[#050b1f] text-white border border-[#78aaff]/30 rounded-xl p-3 focus:border-[#27d3ff]"
              >
                <option value="Parent">Parent / Guardian</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Sibling">Sibling</option>
                <option value="Spouse">Spouse / Partner</option>
                <option value="Friend">Friend / Roommate</option>
                <option value="Hostel Warden">Hostel Warden / Security</option>
              </select>
            </div>

            <div className="sm:col-span-3 flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="btn-secondary py-2 px-5 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn py-2 px-6 text-xs font-semibold cursor-pointer"
              >
                Save Contact
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Contacts List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contacts.length === 0 ? (
          <div className="col-span-full glass p-12 text-center">
            <Users className="w-12 h-12 text-[#6479a6] mx-auto mb-3" />
            <p className="text-base font-semibold text-white">No Trusted Contacts Added Yet</p>
            <p className="text-xs text-[#9fb0d6] mt-1 mb-4">
              Add trusted contacts who can respond immediately when an emergency alert is triggered.
            </p>
            <button
              onClick={() => setIsAdding(true)}
              className="btn py-2 px-6 text-xs font-semibold"
            >
              Add First Contact
            </button>
          </div>
        ) : (
          contacts.map(c => (
            <div
              key={c.contact_id}
              className="glass p-6 flex flex-col justify-between interactive-card"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#2f7bff] to-[#27d3ff] flex items-center justify-center font-bold text-white text-base shadow-[0_0_15px_rgba(47,123,255,0.4)]">
                    {c.contact_name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-[10px] uppercase font-bold text-[#27d3ff] px-2.5 py-0.5 rounded-full bg-[#2f7bff]/20 border border-[#2f7bff]/40">
                    {c.relationship}
                  </span>
                </div>

                <h2 className="text-base font-bold text-white">{c.contact_name}</h2>
                <p className="text-xs font-mono text-[#27d3ff] mt-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{c.contact_phone}</span>
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-[#78aaff]/15 flex items-center justify-between">
                <span className="text-[11px] text-[#9fb0d6]">Emergency Notification Active</span>
                <button
                  onClick={() => handleDelete(c.contact_id)}
                  className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/25 text-[#ff8a96] border border-red-500/30 transition"
                  title="Delete Contact"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
