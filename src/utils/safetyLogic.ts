/**
 * SafeConnect – Core Safety & Validation Logic
 * Decoupled pure functions for data validation, OTP handling, and emergency processing.
 */

export interface RegistrationInput {
  name: string;
  phone: string;
  email: string;
  password: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface TrustedContactInput {
  contactName: string;
  contactPhone: string;
  relationship: string;
}

export interface EmergencyRecord {
  emergency_id: number;
  user_id: number;
  user_name: string;
  emergency_type: string;
  created_at: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  status: 'Dispatched (Demo)' | 'Acknowledged' | 'Resolved';
  note?: string;
}

export interface HelplineItem {
  id: number;
  name: string;
  number: string;
  category: 'National' | 'Police & Crime' | 'Women & Child' | 'Medical & Health' | 'Disaster';
  description: string;
  isAvailable247: boolean;
}

/**
 * Validate user registration details
 */
export function validateRegistration(input: RegistrationInput): ValidationResult {
  if (!input.name || input.name.trim().length < 2) {
    return { isValid: false, error: 'Please enter a valid full name (at least 2 characters).' };
  }

  // Basic international/national phone check (at least 10 digits)
  const phoneDigits = input.phone.replace(/\D/g, '');
  if (phoneDigits.length < 10) {
    return { isValid: false, error: 'Please enter a valid phone number (at least 10 digits).' };
  }

  // Standard email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(input.email.trim())) {
    return { isValid: false, error: 'Please enter a valid email address.' };
  }

  // Password requirement (at least 8 chars)
  if (!input.password || input.password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long.' };
  }

  return { isValid: true };
}

/**
 * Generate a 6-digit numeric OTP
 */
export function generateOTP(): string {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < 6; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

/**
 * Verify an input OTP
 */
export function verifyOTP(
  inputOtp: string,
  actualOtp: string,
  expiresAt?: number
): { success: boolean; message: string } {
  if (!inputOtp || inputOtp.trim().length !== 6) {
    return { success: false, message: 'OTP must be exactly 6 digits.' };
  }

  if (expiresAt && Date.now() > expiresAt) {
    return { success: false, message: 'OTP has expired. Please request a new code.' };
  }

  if (inputOtp.trim() !== actualOtp.trim()) {
    return { success: false, message: 'Invalid OTP code. Please try again.' };
  }

  return { success: true, message: 'OTP verified successfully.' };
}

/**
 * Validate a trusted contact
 */
export function validateTrustedContact(contact: TrustedContactInput): ValidationResult {
  if (!contact.contactName || contact.contactName.trim().length < 2) {
    return { isValid: false, error: 'Contact name is required (minimum 2 characters).' };
  }

  const phoneDigits = contact.contactPhone.replace(/\D/g, '');
  if (phoneDigits.length < 10) {
    return { isValid: false, error: 'Contact phone must have at least 10 digits.' };
  }

  if (!contact.relationship || contact.relationship.trim().length < 2) {
    return { isValid: false, error: 'Relationship is required (e.g., Parent, Friend, Spouse).' };
  }

  return { isValid: true };
}

/**
 * Format timestamp in MySQL style: YYYY-MM-DD HH:MM:SS
 */
export function formatMySQLTimestamp(date: Date = new Date()): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Create emergency record
 */
export function createEmergencyRecord(params: {
  emergencyId?: number;
  userId: number;
  userName: string;
  emergencyType: string;
  location?: { latitude: number; longitude: number; address?: string };
  note?: string;
}): EmergencyRecord {
  return {
    emergency_id: params.emergencyId || Math.floor(100000 + Math.random() * 900000),
    user_id: params.userId,
    user_name: params.userName,
    emergency_type: params.emergencyType,
    created_at: formatMySQLTimestamp(),
    location: params.location,
    status: 'Dispatched (Demo)',
    note: params.note || 'Academic Project Demo: Alert logged safely without contacting real authorities.',
  };
}

/**
 * Filter emergency helplines
 */
export function filterHelplines(
  helplines: HelplineItem[],
  query: string,
  categoryFilter?: string
): HelplineItem[] {
  const q = query.toLowerCase().trim();
  return helplines.filter(item => {
    const matchesQuery =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.number.includes(q) ||
      item.description.toLowerCase().includes(q);

    const matchesCategory =
      !categoryFilter || categoryFilter === 'All' || item.category === categoryFilter;

    return matchesQuery && matchesCategory;
  });
}
