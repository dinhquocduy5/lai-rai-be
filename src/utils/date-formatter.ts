/**
 * Format date to local Vietnam timezone ISO string
 * Converts UTC timestamp to Asia/Ho_Chi_Minh timezone
 */
export function formatToLocalTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  // Convert to Vietnam timezone (UTC+7)
  const vietnamTime = new Date(d.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
  
  return vietnamTime.toISOString();
}

/**
 * Format timestamp string to local time
 */
export function formatTimestamp(timestamp: string | null): string | null {
  if (!timestamp) return null;
  return formatToLocalTime(timestamp);
}

/**
 * Transform object with timestamp fields to local time
 */
export function transformTimestamps<T extends Record<string, any>>(
  obj: T,
  fields: (keyof T)[] = ['check_in', 'check_out', 'created_at', 'paid_at'] as (keyof T)[],
): T {
  const result = { ...obj };
  
  for (const field of fields) {
    if (result[field] && typeof result[field] === 'string') {
      result[field] = formatTimestamp(result[field] as string) as T[keyof T];
    }
  }
  
  return result;
}
