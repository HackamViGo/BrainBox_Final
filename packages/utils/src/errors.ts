/**
 * BrainBox V2 Error Codes
 */
export enum ErrorCode {
  // Auth (1000-1999)
  AUTH_UNAUTHORIZED = 1001,
  AUTH_INVALID_CREDENTIALS = 1002,
  AUTH_SESSION_EXPIRED = 1003,

  // Library/Prompts (2000-2999)
  LIBRARY_FOLDER_NOT_FOUND = 2001,
  LIBRARY_ITEM_NOT_FOUND = 2002,
  LIBRARY_VALIDATION_ERROR = 2003,

  // Sync/Extension (5000-5999)
  SYNC_INVALID_DATA = 5001,
  SYNC_CONNECTION_FAILED = 5002,

  // System (9000-9999)
  SYSTEM_INTERNAL_ERROR = 9001,
  SYSTEM_UNEXPECTED = 9999,
}

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    public metadata: Record<string, any> = {},
    message?: string
  ) {
    super(message || `Error [${code}]`);
    this.name = 'AppError';
  }
}
