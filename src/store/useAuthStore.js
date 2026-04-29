import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null, // Stores { name, role: 'admin' | 'member' }
  isAuthenticated: false,
  
  login: (userData) => set({ user: userData, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));