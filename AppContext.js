import React, { createContext, useState } from 'react';

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [chattingWith, setChattingWith] = useState(null);
  return (
    <AppContext.Provider
      value={{
        userData,
        setUserData, 
        chattingWith,
        setChattingWith
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };