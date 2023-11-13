export enum ErrorSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  FATAL = 'FATAL',
}

export interface BackendError {
  title?: string;
  message: string;
  severity: ErrorSeverity;
  code: string;
}
