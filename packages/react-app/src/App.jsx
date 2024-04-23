// Import necessary parts from react-router-dom
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React, { useEffect, useState, useCallback } from "react";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useAppContext } from "./contexts/AppContext";
import { INFURA_ID, NETWORKS } from "./constants";
import WalletPage from "./pages/WalletPage";
import SwapPage from "./pages/SwapPage";
import Header from "./components/Header";
import { useUserAddress } from "eth-hooks";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { Web3Provider } from "@ethersproject/providers";

import { NETWORK_SETTINGS_STORAGE_KEY, getNetworkWithSettings } from "./helpers/NetworkSettingsHelper";

import { SettingsHelper } from "./helpers/SettingsHelper";

import { useLocalStorage, useUserProvider } from "./hooks";

function App({ subgraphUri }) {
  const networks = Object.values(NETWORKS);

  const { blockExplorer, priceContext, injectedProvider, setInjectedProvider } = useAppContext();

  const [networkSettings, setNetworkSettings] = useLocalStorage(NETWORK_SETTINGS_STORAGE_KEY, {});
  const networkSettingsHelper = new SettingsHelper(
    NETWORK_SETTINGS_STORAGE_KEY,
    networks,
    networkSettings,
    setNetworkSettings,
    getNetworkWithSettings,
  );

  const [targetNetwork, setTargetNetwork] = useState(() => networkSettingsHelper.getSelectedItem(true));

  const [localProvider, setLocalProvider] = useState(() => new StaticJsonRpcProvider(targetNetwork.rpcUrl));
  useEffect(() => {
    setLocalProvider(prevProvider =>
      localProvider?.connection?.url == targetNetwork.rpcUrl
        ? prevProvider
        : new StaticJsonRpcProvider(targetNetwork.rpcUrl),
    );
  }, [targetNetwork]);

  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProvider = useUserProvider(injectedProvider, localProvider);

  const mainnetProvider = new StaticJsonRpcProvider(NETWORKS.ethereum.rpcUrl);

  const address = useUserAddress(userProvider);

  /*
  Web3 modal helps us "connect" external wallets:
*/
  const web3Modal = new Web3Modal({
    // network: "mainnet", // optional
    cacheProvider: true, // optional
    providerOptions: {
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: INFURA_ID,
          rpc: {
            10: "https://mainnet.optimism.io", // xDai
            100: "https://rpc.gnosischain.com", // xDai
            137: "https://polygon-rpc.com",
            280: "https://zksync2-testnet.zksync.dev", // zksync alpha tesnet
            31337: "http://localhost:8545",
            42161: "https://arb1.arbitrum.io/rpc",
            80001: "https://rpc-mumbai.maticvigil.com",
            80216: "https://chain.buidlguidl.com:8545",
          },
        },
      },
    },
  });

  /* eslint-disable */
  window.ethereum &&
    window.ethereum.on("chainChanged", chainId => {
      web3Modal.cachedProvider &&
        setTimeout(() => {
          window.location.reload();
        }, 3000);
    });

  window.ethereum &&
    window.ethereum.on("accountsChanged", accounts => {
      web3Modal.cachedProvider &&
        setTimeout(() => {
          window.location.reload();
        }, 1);
    });
  /* eslint-enable */

  return (
    <Router>
      <div className="site-page-header-ghost-wrapper">
        <Header
          extraProps={{
            address,
            mainnetProvider,
            blockExplorer,
            localProvider,
            userProvider,
            networkSettingsHelper,
            setTargetNetwork,
            priceContext,
            web3Modal,
          }}
        />
      </div>
      <Switch>
        <Route
          exact
          path="/"
          render={() => (
            <WalletPage
              subgraphUri={subgraphUri}
              targetNetwork={targetNetwork}
              setTargetNetwork={setTargetNetwork}
              networkSettingsHelper={networkSettingsHelper}
              setLocalProvider={setLocalProvider}
              localProvider={localProvider}
              userProvider={userProvider}
              address={address}
              mainnetProvider={mainnetProvider}
              web3Modal={web3Modal}
            />
          )}
        />
        <Route path="/swap" render={() => <SwapPage targetNetwork={targetNetwork} web3Modal={web3Modal} />} />
      </Switch>
    </Router>
  );
}

export default App;
