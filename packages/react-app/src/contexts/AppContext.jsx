// Create a context file, e.g., AppContext.js
import React, { createContext, useContext, useState } from "react";

const AppContext = createContext();

export function useAppContext() {
  return useContext(AppContext);
}

export const AppProvider = ({ children }) => {
  const [web3Modal, setWeb3Modal] = useState();
  const [blockExplorer, setBlockExplorer] = useState();
  const [priceContext, setPriceContext] = useState();
  const [injectedProvider, setInjectedProvider] = useState();

  const value = {
    web3Modal,
    setWeb3Modal,
    blockExplorer,
    setBlockExplorer,
    priceContext,
    setPriceContext,
    injectedProvider,
    setInjectedProvider,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
