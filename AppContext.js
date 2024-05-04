import React, { createContext, useState } from 'react';

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  return (
    <AppContext.Provider
      value={{
        userData,
        setUserData, 
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };