import crypto from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * Generates a secure random string for use as a JWT secret
 * @param length Length of the secret
 * @returns A secure random string
 */
export function generateSecureSecret(length = 64): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Get or generate a secure JWT secret
 * If JWT_SECRET is defined in environment variables, use that
 * Otherwise, try to read from a secret file
 * If the secret file doesn't exist, generate a new secret and save it
 * @returns The JWT secret
 */
export async function getJwtSecret(): Promise<string> {
  // If JWT_SECRET is defined in environment variables, use that
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }

  const secretFilePath = path.join(process.cwd(), '.jwt-secret');

  try {
    // Try to read from the secret file
    const secret = await fs.readFile(secretFilePath, 'utf-8');
    if (secret && secret.length >= 32) {
      return secret.trim();
    }
  } catch (error) {
    // If the file doesn't exist or can't be read, we'll generate a new secret
    console.log('JWT secret file not found or invalid, generating a new one...');
  }

  // Generate a new secret
  const newSecret = generateSecureSecret();

  try {
    // Save the new secret to the file
    await fs.writeFile(secretFilePath, newSecret, { mode: 0o600 }); // Only readable by owner
    console.log('Generated and saved new JWT secret');
    return newSecret;
  } catch (error) {
    console.warn('Failed to save JWT secret to file, using in-memory secret');
    // If we can't save the file, just return the generated secret
    // This will be regenerated on the next restart
    return newSecret;
  }
}

/**
 * Strong password validation
 * @param password The password to validate
 * @returns Object containing validity and any error messages
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  message?: string;
} {
  if (password.length < 8) {
    return {
      isValid: false,
      message: 'Password must be at least 8 characters long',
    };
  }

  // Require at least one uppercase letter, one lowercase letter, and one number
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (!hasUppercase || !hasLowercase || !hasNumber) {
    return {
      isValid: false,
      message:
        'Password must include at least one uppercase letter, one lowercase letter, and one number',
    };
  }

  return { isValid: true };
}

/**
 * Check if a password has been compromised using a hash prefix
 * This implementation uses the "Have I Been Pwned" API with k-anonymity
 * Only the first 5 characters of the SHA-1 hash are sent to the API
 * @param password The password to check
 * @returns True if the password appears in known breaches
 */
export async function isPasswordCompromised(password: string): Promise<boolean> {
  try {
    // Create SHA-1 hash of the password
    const sha1 = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();

    // Take the first 5 characters of the hash
    const prefix = sha1.substring(0, 5);

    // Rest of the hash to compare with the API response
    const suffix = sha1.substring(5);

    // Query the API
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);

    if (!response.ok) {
      // If the API request fails, we assume the password is not compromised
      return false;
    }

    // Parse the response
    const text = await response.text();
    const hashes = text.split('\n');

    // Check if our hash suffix is in the response
    for (const hash of hashes) {
      const [hashSuffix] = hash.split(':');
      if (hashSuffix.trim() === suffix) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('Error checking password compromise status:', error);
    // In case of error, we assume the password is not compromised
    return false;
  }
}
