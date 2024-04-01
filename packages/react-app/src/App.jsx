// Import necessary parts from react-router-dom
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React, { useEffect } from "react";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useAppContext } from "./contexts/AppContext";
import { INFURA_ID } from "./constants";
import WalletPage from "./pages/WalletPage";
import SwapPage from "./pages/SwapPage";

function App({ subgraphUri }) {
  /*
  Web3 modal helps us "connect" external wallets:
*/
  const web3ModalInstance = new Web3Modal({
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

  const { setWeb3Modal } = useAppContext();

  useEffect(() => {
    setWeb3Modal(web3ModalInstance);
  }, []);

  return (
    <Router>
      <Switch>
        <Route exact path="/" render={() => <WalletPage subgraphUri={subgraphUri} web3Modal={web3ModalInstance} />} />
        <Route path="/swap" component={SwapPage} />
        {/* Define other routes as needed */}
      </Switch>
    </Router>
  );
}

export default App;
