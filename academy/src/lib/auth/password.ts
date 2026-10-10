/**
 * Password rules shared by sign-up, reset and change-password flows (both
 * adapters). Kept tiny and dependency-free so it can also run client-side for
 * inline hints.
 */

export const PASSWORD_MIN_LENGTH = 8;

/**
 * Returns a warm, human message when the password is not acceptable, or null
 * when it is fine. Rule: at least 8 characters including a letter and a number.
 */
export function validatePassword(password: string): string | null {
  if (typeof password !== "string" || password.length === 0) {
    return "Please choose a password.";
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Please use at least ${PASSWORD_MIN_LENGTH} characters.`;
  }
  if (!/[A-Za-z]/.test(password)) {
    return "Please include at least one letter.";
  }
  if (!/\d/.test(password)) {
    return "Please include at least one number.";
  }
  if (password.length > 200) {
    return "That password is a little long — please keep it under 200 characters.";
  }
  return null;
}

export function isStrongEnough(password: string): boolean {
  return validatePassword(password) === null;
}
