export function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  
  // Reject if it contains any whitespace
  for (const char of email) {
    if (char === ' ' || char === '\t' || char === '\n' || char === '\r') {
      return false;
    }
  }

  const atIndex = email.indexOf('@');
  
  // Verify exactly one '@'
  if (atIndex === -1 || atIndex !== email.lastIndexOf('@')) {
    return false;
  }

  const localPart = email.slice(0, atIndex);
  const domainPart = email.slice(atIndex + 1);

  // Local part and domain part must not be empty
  if (localPart.length === 0 || domainPart.length === 0) {
    return false;
  }

  const dotIndex = domainPart.indexOf('.');
  
  // Domain must contain a '.' but not at the start or end
  if (dotIndex <= 0 || dotIndex === domainPart.length - 1) {
    return false;
  }

  return true;
}
