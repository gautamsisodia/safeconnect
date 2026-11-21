/**
 * SafeConnect – API Service Adapter
 * Communicates with either a remote PHP backend (e.g., http://localhost/safeconnect/)
 * or the built-in MySQL-compatible client simulation engine.
 */

import {
  RegistrationInput,
  ValidationResult,
  validateRegistration,
  generateOTP,
  verifyOTP,
  validateTrustedContact,
  TrustedContactInput,
  EmergencyRecord,
} from '../utils/safetyLogic.ts';

import {
  User,
  TrustedContact,
  getStoredUsers,
  saveStoredUsers,
  getCurrentUser,
  setCurrentUser,
  getStoredContacts,
  saveStoredContacts,
  getStoredAlerts,
  addEmergencyAlert,
  DEFAULT_HELPLINES,
} from './storageService.ts';

export interface EmailNotification {
  id: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  otpCode: string;
  timestamp: string;
  htmlBody: string;
}

// In-memory or localStorage buffer for recent simulated PHPMailer dispatches
let lastDispatchedEmail: EmailNotification | null = null;
const emailListeners: ((email: EmailNotification) => void)[] = [];

export function subscribeToEmailDispatches(callback: (email: EmailNotification) => void) {
  emailListeners.push(callback);
  if (lastDispatchedEmail) callback(lastDispatchedEmail);
  return () => {
    const idx = emailListeners.indexOf(callback);
    if (idx !== -1) emailListeners.splice(idx, 1);
  };
}

export function getLastDispatchedEmail(): EmailNotification | null {
  return lastDispatchedEmail;
}

export const ApiService = {
  /**
   * User Registration -> Generates OTP -> "Sends OTP via Email"
   */
  async register(input: RegistrationInput): Promise<{
    status: 'success' | 'error';
    message: string;
    email?: string;
    otp?: string;
  }> {
    const validation: ValidationResult = validateRegistration(input);
    if (!validation.isValid) {
      return { status: 'error', message: validation.error || 'Invalid form input.' };
    }

    const users = getStoredUsers();
    const existing = users.find(u => u.email.toLowerCase() === input.email.trim().toLowerCase());
    if (existing && existing.is_verified) {
      return { status: 'error', message: 'An account with this email address already exists. Please login.' };
    }

    const otp = generateOTP();
    const newUser: User = {
      user_id: existing ? existing.user_id : users.length + 1,
      name: input.name.trim(),
      phone: input.phone.trim(),
      email: input.email.trim().toLowerCase(),
      password: input.password,
      otp,
      is_verified: false,
      blood_group: 'B+',
      emergency_notes: 'SafeConnect emergency account active.',
      registered_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    // Update users array
    const filtered = users.filter(u => u.email.toLowerCase() !== newUser.email);
    saveStoredUsers([...filtered, newUser]);

    // Dispatch simulated PHPMailer email
    const emailNotice: EmailNotification = {
      id: Math.random().toString(36).substring(2, 9),
      recipientEmail: newUser.email,
      recipientName: newUser.name,
      subject: `SafeConnect OTP Verification: ${otp}`,
      otpCode: otp,
      timestamp: new Date().toLocaleTimeString(),
      htmlBody: `Your SafeConnect verification code is: ${otp}. Valid for 10 minutes.`,
    };
    lastDispatchedEmail = emailNotice;
    emailListeners.forEach(listener => listener(emailNotice));

    return {
      status: 'success',
      message: 'Account created. Verification OTP has been sent to your email via PHPMailer SMTP.',
      email: newUser.email,
      otp,
    };
  },

  /**
   * Resend OTP
   */
  async resendOTP(email: string): Promise<{ status: 'success' | 'error'; message: string; otp?: string }> {
    const users = getStoredUsers();
    const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      return { status: 'error', message: 'User not found.' };
    }

    const newOtp = generateOTP();
    user.otp = newOtp;
    saveStoredUsers(users);

    const emailNotice: EmailNotification = {
      id: Math.random().toString(36).substring(2, 9),
      recipientEmail: user.email,
      recipientName: user.name,
      subject: `New SafeConnect OTP Code: ${newOtp}`,
      otpCode: newOtp,
      timestamp: new Date().toLocaleTimeString(),
      htmlBody: `Your new SafeConnect verification code is: ${newOtp}.`,
    };
    lastDispatchedEmail = emailNotice;
    emailListeners.forEach(listener => listener(emailNotice));

    return {
      status: 'success',
      message: `New OTP dispatched to ${user.email}.`,
      otp: newOtp,
    };
  },

  /**
   * Verify OTP
   * CRITICAL REQUIREMENT:
   * "Do NOT redirect newly registered users to Login Page after OTP Verification.
   * After successful OTP verification: Open Dashboard directly."
   */
  async verifyOTP(email: string, otp: string): Promise<{
    status: 'success' | 'error';
    message: string;
    user?: User;
  }> {
    const users = getStoredUsers();
    const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      return { status: 'error', message: 'Registration record not found.' };
    }

    const verification = verifyOTP(otp, user.otp || '');
    if (!verification.success) {
      return { status: 'error', message: verification.message };
    }

    // Mark as verified & clear OTP
    user.is_verified = true;
    user.otp = null;
    saveStoredUsers(users);
    setCurrentUser(user);

    return {
      status: 'success',
      message: 'Account verified! Welcome to SafeConnect Dashboard.',
      user,
    };
  },

  /**
   * User Login
   */
  async login(email: string, password: string): Promise<{
    status: 'success' | 'error';
    message: string;
    user?: User;
  }> {
    const users = getStoredUsers();
    const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      return { status: 'error', message: 'No registered account found with this email address.' };
    }

    // In demo environment, allow login with password or demo password
    if (user.password && user.password !== password && password !== 'SafeConnect@123') {
      return { status: 'error', message: 'Incorrect password. Please verify and try again.' };
    }

    setCurrentUser(user);
    return {
      status: 'success',
      message: 'Login successful. Redirecting to Dashboard...',
      user,
    };
  },

  /**
   * Logout
   */
  async logout(): Promise<void> {
    setCurrentUser(null);
  },

  /**
   * Send Emergency SOS / Alert
   */
  async sendEmergencyAlert(params: {
    userId: number;
    userName: string;
    emergencyType: string;
    location?: { latitude: number; longitude: number; address?: string };
    note?: string;
  }): Promise<EmergencyRecord> {
    return addEmergencyAlert(params);
  },

  /**
   * Add Trusted Contact
   */
  async addContact(userEmail: string, contact: TrustedContactInput): Promise<{
    status: 'success' | 'error';
    message: string;
    contact?: TrustedContact;
  }> {
    const validation = validateTrustedContact(contact);
    if (!validation.isValid) {
      return { status: 'error', message: validation.error || 'Invalid contact information.' };
    }

    const contacts = getStoredContacts();
    const newContact: TrustedContact = {
      contact_id: Math.floor(1000 + Math.random() * 9000),
      user_email: userEmail,
      contact_name: contact.contactName.trim(),
      contact_phone: contact.contactPhone.trim(),
      relationship: contact.relationship.trim(),
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    saveStoredContacts([...contacts, newContact]);
    return {
      status: 'success',
      message: 'Trusted contact added successfully.',
      contact: newContact,
    };
  },

  /**
   * Delete Trusted Contact
   */
  async deleteContact(contactId: number): Promise<boolean> {
    const contacts = getStoredContacts();
    const filtered = contacts.filter(c => c.contact_id !== contactId);
    saveStoredContacts(filtered);
    return true;
  },

  /**
   * Get Helplines
   */
  getHelplines() {
    return DEFAULT_HELPLINES;
  },
};
