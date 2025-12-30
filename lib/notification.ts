// Notification utility for showing success and error messages
// This provides helper functions that can be used with notification systems

export type NotificationType = 'success' | 'error';

export interface Notification {
  message: string;
  type: NotificationType;
}

// Create a success notification
export function createSuccessNotification(message: string): Notification {
  return { message, type: 'success' };
}

// Create an error notification
export function createErrorNotification(message: string): Notification {
  return { message, type: 'error' };
}

// Helper functions that match the expected interface
export function showSuccess(message: string): Notification {
  return createSuccessNotification(message);
}

export function showError(message: string): Notification {
  return createErrorNotification(message);
}

