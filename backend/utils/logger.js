// Simple logging utility
export function logInfo(message, data = null) {
  console.log(`[INFO] ${new Date().toISOString()}: ${message}`, data ? data : '');
}

export function logError(message, error = null) {
  console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, error ? error : '');
}