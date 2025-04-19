/**
 * Helper functions for safely working with Prisma and BigInt
 */

/**
 * Safely convert a value to BigInt, handling different input types
 */
export function toBigInt(value: string | number | bigint | null | undefined): bigint | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  try {
    if (typeof value === 'bigint') {
      return value;
    }

    // Convert string to number if it's numeric
    if (typeof value === 'string') {
      // Remove any trailing 'n' that might be present
      const cleanValue = value.replace(/n$/, '');
      return BigInt(cleanValue);
    }

    return BigInt(value);
  } catch (error) {
    console.error(`Failed to convert value to BigInt: ${value}`, error);
    return undefined;
  }
}

/**
 * Helper to safely build where condition for BigInt ID
 */
export function idFilter(id: string | number | bigint | null | undefined) {
  const bigIntId = toBigInt(id);

  if (bigIntId === undefined) {
    // Return impossible condition if ID is invalid
    return { id: -1n };
  }

  return { id: bigIntId };
}

/**
 * Helper to safely build userId filters
 */
export function userIdFilter(userId: string | number | bigint | null | undefined) {
  const bigIntId = toBigInt(userId);

  if (bigIntId === undefined) {
    // Return impossible condition if ID is invalid
    return { userId: -1n };
  }

  return { userId: bigIntId };
}
