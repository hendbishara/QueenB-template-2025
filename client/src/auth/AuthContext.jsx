
// import { createContext, useContext, useEffect, useMemo, useState } from 'react';
// import api from '../api';

// const AuthContext = createContext(null);

// export const useAuth = () => useContext(AuthContext);

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setLoading(false);
//       return;
//     }

//     try {
//       const base64Url = token.split('.')[1];
//       const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//       const payload = JSON.parse(atob(base64));
//       const role = payload.role;

//       const endpoint = role === "MENTOR"
//         ? "/users/mentor/profile"
//         : "/users/mentee/profile";

//       api.get(endpoint)
//         .then(res => {
//           setUser({ ...res.data, role });
//         })
//         .catch(() => {
//           localStorage.removeItem("token");
//         })
//         .finally(() => {
//           setLoading(false);
//         });

//     } catch (err) {
//       console.error("Error decoding token:", err);
//       localStorage.removeItem("token");
//       setLoading(false);
//     }
//   }, []);

//   const login = async (email, password) => {
//     const res = await api.post('/auth/login', { email, password });
//     localStorage.setItem('token', res.data.token);
//     setUser(res.data.user);
//     return res.data.user;
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setUser(null);
//   };

//   const value = useMemo(() => ({ user, loading, login, logout }), [user, loading]);

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }


//Hend

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// Safe JWT decoder (handles base64url + missing padding)
function decodeJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const pad = "=".repeat((4 - (base64.length % 4)) % 4);
    return JSON.parse(atob(base64 + pad));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);     // { id, role, ... }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1) Hydrate from storage immediately to avoid redirect flicker
    let stored = null;
    try {
      const raw = localStorage.getItem("auth"); // preferred: { token, user }
      if (raw) stored = JSON.parse(raw);
      else {
        // backward-compat: old code that stored just "token"
        const legacyToken = localStorage.getItem("token");
        if (legacyToken) stored = { token: legacyToken, user: null };
      }
    } catch {
      // ignore
    }

    if (stored?.user) setUser(stored.user);

    // 2) If no token at all → not logged in
    const token = stored?.token;
    if (!token) {
      setLoading(false);
      return;
    }

    // 3) Optional: honor exp claim if present
    const payload = decodeJwt(token);
    if (payload?.exp && Date.now() >= payload.exp * 1000) {
      localStorage.removeItem("auth");
      localStorage.removeItem("token"); // legacy clean-up
      setUser(null);
      setLoading(false);
      return;
    }

    // 4) Verify session with the server (role decides which endpoint to call)
    const role = (payload?.role || stored?.user?.role || "").toUpperCase();
    const endpoint =
      role === "MENTOR" ? "/users/mentor/profile" : "/users/mentee/profile";

    api
      .get(endpoint)
      .then((res) => {
        const freshUser = { ...res.data, role: role || res.data.role };
        setUser(freshUser);
        // keep storage in sync
        localStorage.setItem("auth", JSON.stringify({ token, user: freshUser }));
        // keep legacy key for any old code still reading it
        localStorage.setItem("token", token);
      })
      .catch((err) => {
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          // real auth error → clear session
          localStorage.removeItem("auth");
          localStorage.removeItem("token");
          setUser(null);
        } else {
          // transient/network/server error → keep local session
          // eslint-disable-next-line no-console
          console.warn("Profile fetch failed; keeping local session", err);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    const { token, user } = data;
    // persist both for reloads
    localStorage.setItem("auth", JSON.stringify({ token, user }));
    localStorage.setItem("token", token); // legacy compatibility
    setUser(user);
    return user; // so callers (e.g., Login.jsx) can redirect by role/id
  };

  const logout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("token"); // legacy clean-up
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

