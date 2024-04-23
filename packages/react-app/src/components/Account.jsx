import React, { useCallback, useEffect } from "react";
import { LoginOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Web3Provider } from "@ethersproject/providers";
import { useAppContext } from "../contexts/AppContext";

// import { useThemeSwitcher } from "react-css-theme-switcher";
// import Address from "./Address";
// import Balance from "./Balance";
// import Wallet from "./Wallet";

/*
  ~ What it does? ~

  Displays an Address, Balance, and Wallet as one Account component,
  also allows users to log in to existing accounts and log out

  ~ How can I use? ~

  <Account
    address={address}
    localProvider={localProvider}
    userProvider={userProvider}
    mainnetProvider={mainnetProvider}
    price={price}
    web3Modal={web3Modal}
    loadWeb3Modal={loadWeb3Modal}
    logoutOfWeb3Modal={logoutOfWeb3Modal}
    blockExplorer={blockExplorer}
  />

  ~ Features ~

  - Provide address={address} and get balance corresponding to the given address
  - Provide localProvider={localProvider} to access balance on local network
  - Provide userProvider={userProvider} to display a wallet
  - Provide mainnetProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth")
  - Provide price={price} of ether and get your balance converted to dollars
  - Provide web3Modal={web3Modal}, loadWeb3Modal={loadWeb3Modal}, logoutOfWeb3Modal={logoutOfWeb3Modal}
              to be able to log in/log out to/from existing accounts
  - Provide blockExplorer={blockExplorer}, click on address and get the link
              (ex. by default "https://etherscan.io/" or for xdai "https://blockscout.com/poa/xdai/")
         
*/

export default function Account({
  // address,
  // userProvider,
  // localProvider,
  // mainnetProvider,
  // price,
  // minimized,
  web3Modal,
  // logoutOfWeb3Modal,
  // loadWeb3Modal,
  // blockExplorer,
}) {
  const modalButtons = [];

  const { injectedProvider, setInjectedProvider } = useAppContext();

  const logoutOfWeb3Modal = async () => {
    web3Modal.clearCachedProvider();
    if (injectedProvider && injectedProvider.provider && injectedProvider.provider.disconnect) {
      await injectedProvider.provider.disconnect();
    }
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    provider.on("disconnect", () => {
      console.log("LOGOUT!");
      logoutOfWeb3Modal();
    });
    setInjectedProvider(new Web3Provider(provider));
  }, [web3Modal]);

  useEffect(() => {
    if (web3Modal && web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, []);

  if (web3Modal) {
    if (web3Modal.cachedProvider) {
      modalButtons.push(
        <span key="logoutbutton" style={{ verticalAlign: "middle", paddingLeft: 16, fontSize: 32 }}>
          {/* <Tooltip title="Disconnect Wallet"> */}
          <CloseCircleOutlined onClick={logoutOfWeb3Modal} style={{ color: "#1890ff" }} />
          {/* </Tooltip> */}
        </span>,
      );
    } else {
      modalButtons.push(
        <span key="loginbutton" style={{ verticalAlign: "middle", paddingLeft: 16, fontSize: 32 }}>
          {/* <Tooltip title="Connect Wallet"> */}
          <LoginOutlined onClick={loadWeb3Modal} style={{ color: "#1890ff" }} />
          {/* </Tooltip> */}
        </span>,
      );
    }
  }

  // const { currentTheme } = useThemeSwitcher();

  // const display = minimized ? (
  //   ""
  // ) : (
  //   <span>
  //     {address ? (
  //       <Address address={address} ensProvider={mainnetProvider} blockExplorer={blockExplorer} />
  //     ) : (
  //       "Connecting..."
  //     )}
  //     <Balance address={address} provider={localProvider} price={price} />
  //     <Wallet
  //       address={address}
  //       provider={userProvider}
  //       ensProvider={mainnetProvider}
  //       price={price}
  //       color={currentTheme == "light" ? "#1890ff" : "#2caad9"}
  //     />
  //   </span>
  // );

  return <>{modalButtons}</>;
}
