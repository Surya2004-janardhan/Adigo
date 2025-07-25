import React, { createContext, useContext } from "react";

// Change this to your backend's IP if not running on the same device
const BASE_URL = "http://192.168.67.53:3000";

const ApiContext = createContext({ baseUrl: BASE_URL });

export const ApiProvider = ({ children }) => (
  <ApiContext.Provider value={{ baseUrl: BASE_URL }}>
    {children}
  </ApiContext.Provider>
);

export const useApi = () => useContext(ApiContext);
