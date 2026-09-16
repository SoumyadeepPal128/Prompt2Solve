import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, loginUser, logoutUser, registerUser } from "../api/auth.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while checking existing session on load

  // On first app load, check if a valid session cookie already exists
  // (e.g. the user logged in previously and hasn't logged out).
  useEffect(() => {
    getCurrentUser()
      .then((data) => setUser(data))
      .catch(() => setUser(null)) // no valid session - just means guest, not an error to show
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const data = await loginUser(email, password);
    setUser(data.user);
  }

  async function register(email, username, password) {
    await registerUser(email, username, password);
    // Registration doesn't log the user in automatically on the backend -
    // log them in right after for a smoother experience.
    await login(email, password);
  }

  async function logout() {
    await logoutUser();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}