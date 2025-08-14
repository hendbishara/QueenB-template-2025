import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
        const fetchUser = async () => {
          try {
            const response = await axios.get("/api/users/mentee/profile");
            setUser({
              name: response.data.first_name,
              role: response.data.role,
              isLoggedIn: true,
            });
          } catch (error) {
            setUser({ isLoggedIn: false });
          } finally {
            setLoading(false);
          }
        };
    
        fetchUser();
      }, []);
      return (
        <UserContext.Provider value={{ user, loading }}>
          {children}
        </UserContext.Provider>
      );
    };
