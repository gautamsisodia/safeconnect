import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateRegistration,
  generateOTP,
  verifyOTP,
  validateTrustedContact,
  formatMySQLTimestamp,
  createEmergencyRecord,
  filterHelplines,
  HelplineItem,
} from './safetyLogic.ts';

test('validateRegistration accepts valid user inputs', () => {
  const result = validateRegistration({
    name: 'Aarav Sharma',
    phone: '+91 98765 43210',
    email: 'aarav@example.com',
    password: 'securePassword123',
  });
  assert.equal(result.isValid, true);
  assert.equal(result.error, undefined);
});

test('validateRegistration rejects password with less than 8 chars', () => {
  const result = validateRegistration({
    name: 'Aarav Sharma',
    phone: '9876543210',
    email: 'aarav@example.com',
    password: 'short',
  });
  assert.equal(result.isValid, false);
  assert.match(result.error || '', /8 characters/);
});

test('validateRegistration rejects invalid email format', () => {
  const result = validateRegistration({
    name: 'Aarav Sharma',
    phone: '9876543210',
    email: 'not-an-email',
    password: 'validPassword123',
  });
  assert.equal(result.isValid, false);
  assert.match(result.error || '', /valid email/);
});

test('generateOTP produces 6 numeric digits', () => {
  const otp = generateOTP();
  assert.equal(otp.length, 6);
  assert.match(otp, /^\d{6}$/);
});

test('verifyOTP checks matching code and expiry', () => {
  const valid = verifyOTP('123456', '123456', Date.now() + 60000);
  assert.equal(valid.success, true);

  const invalid = verifyOTP('123456', '654321', Date.now() + 60000);
  assert.equal(invalid.success, false);

  const expired = verifyOTP('123456', '123456', Date.now() - 1000);
  assert.equal(expired.success, false);
  assert.match(expired.message, /expired/);
});

test('validateTrustedContact validates required contact fields', () => {
  const valid = validateTrustedContact({
    contactName: 'Rohit Verma',
    contactPhone: '9876543210',
    relationship: 'Brother',
  });
  assert.equal(valid.isValid, true);

  const invalid = validateTrustedContact({
    contactName: '',
    contactPhone: '123',
    relationship: '',
  });
  assert.equal(invalid.isValid, false);
});

test('formatMySQLTimestamp returns standard YYYY-MM-DD HH:MM:SS format', () => {
  const ts = formatMySQLTimestamp(new Date('2026-10-27T10:30:00Z'));
  assert.match(ts, /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
});

test('createEmergencyRecord stores alert data with academic disclaimer', () => {
  const record = createEmergencyRecord({
    userId: 101,
    userName: 'Gautam Sisodia',
    emergencyType: 'Medical Emergency',
    location: { latitude: 28.7041, longitude: 77.1025, address: 'Delhi, India' },
  });
  assert.equal(record.user_id, 101);
  assert.equal(record.user_name, 'Gautam Sisodia');
  assert.equal(record.emergency_type, 'Medical Emergency');
  assert.match(record.note || '', /Academic Project Demo/);
});

test('filterHelplines filters correctly by query and category', () => {
  const sample: HelplineItem[] = [
    { id: 1, name: 'Police Helpline', number: '100', category: 'Police & Crime', description: 'Immediate police response', isAvailable247: true },
    { id: 2, name: 'Ambulance Service', number: '108', category: 'Medical & Health', description: 'Emergency ambulance', isAvailable247: true },
    { id: 3, name: 'Women Helpline', number: '1091', category: 'Women & Child', description: '24/7 Women distress helpline', isAvailable247: true },
  ];

  const filteredQuery = filterHelplines(sample, 'police', 'All');
  assert.equal(filteredQuery.length, 1);
  assert.equal(filteredQuery[0].name, 'Police Helpline');

  const filteredCategory = filterHelplines(sample, '', 'Women & Child');
  assert.equal(filteredCategory.length, 1);
  assert.equal(filteredCategory[0].number, '1091');
});
