import { isValidEmail } from '../utils/validation';

describe('isValidEmail', () => {
  it('returns false for non-string types', () => {
    expect(isValidEmail(null)).toBe(false);
    expect(isValidEmail(undefined)).toBe(false);
    expect(isValidEmail(123)).toBe(false);
  });

  it('returns false if email contains whitespace', () => {
    expect(isValidEmail('user @example.com')).toBe(false);
    expect(isValidEmail('user\texample@example.com')).toBe(false);
    expect(isValidEmail('user\n@example.com')).toBe(false);
    expect(isValidEmail('user\r@example.com')).toBe(false);
  });

  it('returns false if there is not exactly one @', () => {
    expect(isValidEmail('userexample.com')).toBe(false);
    expect(isValidEmail('user@@example.com')).toBe(false);
  });

  it('returns false if local part or domain part is empty', () => {
    expect(isValidEmail('@example.com')).toBe(false);
    expect(isValidEmail('user@')).toBe(false);
  });

  it('returns false if domain part does not contain a dot in a valid position', () => {
    expect(isValidEmail('user@example')).toBe(false); // No dot
    expect(isValidEmail('user@.com')).toBe(false); // Dot at start
    expect(isValidEmail('user@example.')).toBe(false); // Dot at end
  });

  it('returns true for valid email formats', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('test.user@example.com')).toBe(true);
    expect(isValidEmail('user+tag@example.com')).toBe(true);
  });
});
