import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useApi } from "./ApiContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { baseUrl } = useApi();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        try {
          const res = await axios.get(`${baseUrl}/user/profile`, {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          setUser(res.data.user);
        } catch {
          setUser(null);
        }
      }
      setLoading(false);
    };
    load();
  }, [baseUrl]);

  const login = async (form) => {
    const res = await axios.post(`${baseUrl}/auth/login`, form);
    const login = async (form) => {
      const res = await axios.post(`${baseUrl}/auth/login`, form);

      const { token, user } = res.data;

      if (token && user) {
        setToken(token); // ✅ store in context
        await AsyncStorage.setItem("token", token); // ✅ persist
        setUser(user); // ✅ triggers navigation
      }

      return res;
    };

    const { token, user } = res.data;

    if (token && user) {
      setToken(token); // ✅ store in context
      await AsyncStorage.setItem("token", token); // ✅ persist
      setUser(user); // ✅ triggers navigation
    }

    return res;
  };


  const signup = async (form) => {
    const res = await axios.post(`${baseUrl}/auth/register`, form);
    // console.log(res.data.token)
    if (res.data.token) {
      setToken(res.data.token);
      await AsyncStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      // if res.data
    }
    return res;
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
