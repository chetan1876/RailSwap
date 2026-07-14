import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  /**
   * Initialise from localStorage so the session survives page refreshes.
   * If parsing fails (corrupt data), start unauthenticated.
   */
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("railswap_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("railswap_token") || null;
  });

  /**
   * Call after a successful login / register API response.
   * Stores the user profile and JWT access token in state and localStorage.
   *
   * @param {object} userData   - User profile object returned by the backend
   * @param {string} accessToken - JWT access token
   */
  const login = (userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem("railswap_user", JSON.stringify(userData));
    if (accessToken) {
      localStorage.setItem("railswap_token", accessToken);
    }
  };

  /** Clear session state and localStorage on logout. */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("railswap_user");
    localStorage.removeItem("railswap_token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);