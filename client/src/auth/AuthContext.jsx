import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api';

// 1) Create a Context object. Think of it as a "wire" you can plug into anywhere.
const AuthContext = createContext(null);

// 2) Tiny hook so consumers can read the context easily.
export const useAuth = () => useContext(AuthContext);

/**
 * 3) The provider component that lives high in your tree (in App.js).
 *    It holds the auth state and exposes helpers (login, logout).
 */
export function AuthProvider({ children }) {
  // 4) Who is logged in? null means "not logged in".
  const [user, setUser] = useState(null);

  // 5) Are we still *checking* the session (e.g., on first load)?
  const [loading, setLoading] = useState(true);

  /**
   * 6) On first render, try to restore a session:
   *    - If there's a token in localStorage, call /auth/me.
   *    - If it's valid, set user; if not, clear the token.
   *    - Then mark loading=false so the app can render normally.
   */
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }

    api.get('/auth/me')
      .then(res => setUser(res.data))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  /**
   * 7) login() calls your backend, stores the token, and saves the user in state.
   *    We return the user so callers can redirect based on role if they want.
   */
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  /**
   * 8) logout() is simple in a stateless JWT flow:
   *    remove the token and clear user state.
   */
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  /**
   * 9) useMemo so the context value is stable unless user/loading changes.
   *    This avoids unnecessary re-renders in consumers.
   */
  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading]);

  // 10) Provide the value to any child component under this provider.
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
