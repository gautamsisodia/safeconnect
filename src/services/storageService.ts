import {
  EmergencyRecord,
  HelplineItem,
  formatMySQLTimestamp,
} from '../utils/safetyLogic.ts';

export interface User {
  user_id: number;
  name: string;
  phone: string;
  email: string;
  password?: string;
  otp?: string | null;
  is_verified: boolean;
  blood_group?: string;
  emergency_notes?: string;
  registered_at: string;
}

export interface TrustedContact {
  contact_id: number;
  user_email: string;
  contact_name: string;
  contact_phone: string;
  relationship: string;
  created_at: string;
}

const STORAGE_KEYS = {
  USERS: 'safeconnect_users_v2',
  CURRENT_USER: 'safeconnect_current_user_v2',
  CONTACTS: 'safeconnect_contacts_v2',
  ALERTS: 'safeconnect_alerts_v2',
  BACKEND_CONFIG: 'safeconnect_backend_config_v1',
};

// Default seed helplines
export const DEFAULT_HELPLINES: HelplineItem[] = [
  {
    id: 1,
    name: 'National Emergency Number',
    number: '112',
    category: 'National',
    description: 'Unified 24/7 all-in-one emergency service across India (Police, Fire, Medical)',
    isAvailable247: true,
  },
  {
    id: 2,
    name: 'Police Control Room',
    number: '100',
    category: 'Police & Crime',
    description: 'Immediate police patrol response and crime intervention',
    isAvailable247: true,
  },
  {
    id: 3,
    name: 'Ambulance & Medical Emergency',
    number: '108',
    category: 'Medical & Health',
    description: 'Rapid paramedic and emergency ambulance dispatch',
    isAvailable247: true,
  },
  {
    id: 4,
    name: 'Women Safety & Distress Helpline',
    number: '1091',
    category: 'Women & Child',
    description: 'Dedicated national helpline for women safety, distress, and anti-harassment',
    isAvailable247: true,
  },
  {
    id: 5,
    name: 'Fire Brigade Rescue',
    number: '101',
    category: 'Disaster',
    description: 'Fire suppression, building rescue, and hazardous material response',
    isAvailable247: true,
  },
  {
    id: 6,
    name: 'Child Helpline',
    number: '1098',
    category: 'Women & Child',
    description: 'Toll-free emergency phone service for children in need of aid and protection',
    isAvailable247: true,
  },
  {
    id: 7,
    name: 'Senior Citizen Helpline',
    number: '14567',
    category: 'National',
    description: 'Elder line for grievance redressal, emergency assistance, and elder care',
    isAvailable247: true,
  },
  {
    id: 8,
    name: 'Cyber Crime Emergency Reporting',
    number: '1930',
    category: 'Police & Crime',
    description: 'Immediate financial fraud freezing and cyber crime support',
    isAvailable247: true,
  },
  {
    id: 9,
    name: 'National Highway Accident Relief',
    number: '1033',
    category: 'Medical & Health',
    description: 'Road accident rescue and highway ambulance emergency response',
    isAvailable247: true,
  },
  {
    id: 10,
    name: 'Disaster Management Unit',
    number: '1070',
    category: 'Disaster',
    description: 'Natural disaster relief, earthquake, flood, and civil defense rescue',
    isAvailable247: true,
  },
];

// FIXED: No default demo user - site will open logged-out
const DEFAULT_USERS: User[] = [];

const DEFAULT_CONTACTS: TrustedContact[] = [];

// FIXED: No demo alerts with Gautam name
const DEFAULT_ALERTS: EmergencyRecord[] = [];

// Helper functions for LocalStorage
export function getStoredUsers(): User[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_USERS;
  }
}

export function saveStoredUsers(users: User[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users:', e);
  }
}

export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) {
      // FIXED: Never auto-login any demo user. Return null = show Landing / Login page
      return null;
    }
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User | null) {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  } catch (e) {
    console.error('Failed to set current user:', e);
  }
}

export function getStoredContacts(userEmail?: string): TrustedContact[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONTACTS);
    const contacts: TrustedContact[] = raw ? JSON.parse(raw) : DEFAULT_CONTACTS;
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(DEFAULT_CONTACTS));
    }
    if (userEmail) {
      return contacts.filter(c => c.user_email.toLowerCase() === userEmail.toLowerCase());
    }
    return contacts;
  } catch {
    return DEFAULT_CONTACTS;
  }
}

export function saveStoredContacts(contacts: TrustedContact[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
  } catch (e) {
    console.error('Failed to save contacts:', e);
  }
}

export function getStoredAlerts(userId?: number): EmergencyRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ALERTS);
    const alerts: EmergencyRecord[] = raw ? JSON.parse(raw) : DEFAULT_ALERTS;
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(DEFAULT_ALERTS));
    }
    if (userId !== undefined) {
      return alerts.filter(a => a.user_id === userId);
    }
    return alerts;
  } catch {
    return DEFAULT_ALERTS;
  }
}

export function saveStoredAlerts(alerts: EmergencyRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
  } catch (e) {
    console.error('Failed to save alerts:', e);
  }
}

export function addEmergencyAlert(params: {
  userId: number;
  userName: string;
  emergencyType: string;
  location?: { latitude: number; longitude: number; address?: string };
  note?: string;
}): EmergencyRecord {
  const currentAlerts = getStoredAlerts();
  const newRecord: EmergencyRecord = {
    emergency_id: Math.floor(100000 + Math.random() * 900000),
    user_id: params.userId,
    user_name: params.userName,
    emergency_type: params.emergencyType,
    created_at: formatMySQLTimestamp(),
    location: params.location,
    status: 'Dispatched (Demo)',
    note: params.note || 'Academic Project Demo: SOS Alert recorded safely without contacting real authorities.',
  };
  const updated = [newRecord, ...currentAlerts];
  saveStoredAlerts(updated);
  return newRecord;
}