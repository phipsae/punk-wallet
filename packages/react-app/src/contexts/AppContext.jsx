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
  const [networkSettingsHelper, setNetworkSettingsHelper] = useState();
  const [networkSettingsHelperContext, setNetworkSettingsHelperContext] = useState();
  const [targetNetwork, setTargetNetwork] = useState();
  const [priceContext, setPriceContext] = useState();

  useEffect(() => {
    if (networkSettingsHelper) {
      const selectedNetwork = networkSettingsHelper.getSelectedItem(true);
      setTargetNetwork(selectedNetwork);
    }
  }, [networkSettingsHelper]);

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
    networkSettingsHelper,
    setNetworkSettingsHelper,
    networkSettingsHelperContext,
    setNetworkSettingsHelperContext,
    targetNetwork,
    setTargetNetwork,
    priceContext,
    setPriceContext,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
