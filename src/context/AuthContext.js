import { createContext, useContext, useState, useEffect } from "react";
import { set, get, del } from "idb-keyval"; // Import IndexedDB helper

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await get("syncuser");
      if (storedUser) {
        setUser(storedUser);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (userData) => {
    setUser((prev) => {
      const updatedUser = {
        ...prev,
        ...userData
      };
      set("syncuser", updatedUser);
      return updatedUser;
    });
  };

  const logout = async () => {
    setUser(null);
    await del("syncuser");
  };

  const setUserLocation = async (locationName, latitude, longitude) => {
    setUser((prev) => {
      const updatedUser = {
        ...prev, 
        location: {
          name: locationName,
          lat: latitude,
          lng: longitude,
        },
      };
      set("syncuser", updatedUser); 
      return updatedUser;
    });
  };

  const setLegalAgeVerified = async (legalAgeVerified) => {
    setUser((prev) => {
      const updatedUser = {
        ...prev, 
        legalAgeVerified: legalAgeVerified,
      };
      set("syncuser", updatedUser); 
      return updatedUser;
    });
  };

  const setFavourites = async (favourites) => {
    setUser((prev) => {
      const updatedUser = {
        ...prev, 
        favourites: favourites,
      };
      set("syncuser", updatedUser); 
      return updatedUser;
    });
  };
  
  const setHomeTheme = async (theme) => {
    setUser((prev) => {
      const updatedUser = {
        ...prev, 
        hometheme: theme,
      };
      set("syncuser", updatedUser); 
      return updatedUser;
    });
  };

  const setToken = async (token) => {
    setUser((prev) => {
      const updatedUser = {
        ...prev, 
        token: token,
      };
      set("syncuser", updatedUser); 
      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setHomeTheme, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
