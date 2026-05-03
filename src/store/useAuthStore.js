import { create } from "zustand";

const getStoredAuth = () => {
  const token = localStorage.getItem("authToken");
  const user = localStorage.getItem("user");

  return {
    token: token || null,
    user: user ? JSON.parse(user) : null,
    isAuthenticated: !!token,
  };
};

export const useAuthStore = create((set) => ({
  ...getStoredAuth(),

  login: ({ token, user }) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(user));

    set({
      token,
      user,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    set({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  },
}));