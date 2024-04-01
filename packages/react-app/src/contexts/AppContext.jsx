// Create a context file, e.g., AppContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export function useAppContext() {
  return useContext(AppContext);
}

export const AppProvider = ({ children }) => {
  const [web3Modal, setWeb3Modal] = useState();
  const [userAddress, setUserAddress] = useState();
  const [mainnetProviderContext, setMainnetProviderContext] = useState();
  const [blockExplorer, setBlockExplorer] = useState();
  const [localProviderContext, setLocalProviderContext] = useState();
  const [userProviderContext, setUserProviderContext] = useState();
  const [priceContext, setPriceContext] = useState();
  const [injectedProvider, setInjectedProvider] = useState();

  const value = {
    web3Modal,
    setWeb3Modal,
    userAddress,
    setUserAddress,
    mainnetProviderContext,
    setMainnetProviderContext,
    blockExplorer,
    setBlockExplorer,
    localProviderContext,
    setLocalProviderContext,
    userProviderContext,
    setUserProviderContext,
    priceContext,
    setPriceContext,
    injectedProvider,
    setInjectedProvider,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
