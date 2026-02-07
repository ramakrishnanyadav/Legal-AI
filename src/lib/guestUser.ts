// src/lib/guestUser.ts

interface GuestUser {
  id: string;
  name: string;
  createdAt: string;
}

const GUEST_USER_KEY = 'legalai_guest_user';

/**
 * Get or create guest user
 * Creates a unique ID per browser for demo purposes
 */
export const getGuestUser = (): GuestUser => {
  const stored = localStorage.getItem(GUEST_USER_KEY);
  
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // If corrupted, create new
    }
  }
  
  // Create new guest user
  const guestUser: GuestUser = {
    id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: 'Guest User',
    createdAt: new Date().toISOString(),
  };
  
  localStorage.setItem(GUEST_USER_KEY, JSON.stringify(guestUser));
  return guestUser;
};

/**
 * Update guest user name
 */
export const updateGuestUserName = (name: string): void => {
  const user = getGuestUser();
  user.name = name;
  localStorage.setItem(GUEST_USER_KEY, JSON.stringify(user));
};

/**
 * Clear guest data (for reset/testing)
 */
export const clearGuestUser = (): void => {
  localStorage.removeItem(GUEST_USER_KEY);
};

/**
 * Check if user ID is a guest
 */
export const isGuestUser = (userId: string): boolean => {
  return userId.startsWith('guest_');
};