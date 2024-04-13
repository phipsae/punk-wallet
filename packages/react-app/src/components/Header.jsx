import { Link } from "react-router-dom";
import { PageHeader, Menu, Dropdown } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import Address from "./Address";
import Reload from "./Reload";
import Account from "./Account";
import Wallet from "./Wallet";

export default function Header({ extraProps }) {
  const {
    address,
    mainnetProvider,
    blockExplorer,
    localProvider,
    userProvider,
    networkSettingsHelper,
    setTargetNetwork,
    price,
    web3Modal,
    loadWeb3Modal,
    logoutOfWeb3Modal,
  } = extraProps || {};

  const [isMobile, setIsMobile] = useState(window.innerWidth < 850);

  const walletDisplay =
    web3Modal && web3Modal.cachedProvider ? (
      ""
    ) : (
      <Wallet key="wallet" address={address} provider={userProvider} ensProvider={mainnetProvider} price={price} />
    );

  const dropdownMenu = (
    <Menu>
      {/* <Menu.Item key="1">
        <Link to="/">🪪 Wallet</Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="/swap">🔁 Swap</Link>
      </Menu.Item> */}
      <Menu.Item key="3">
        <a href="https://github.com/scaffold-eth/punk-wallet" target="_blank" rel="noopener noreferrer">
          ℹ️ Docs
        </a>
      </Menu.Item>
    </Menu>
  );

  const menuButton = (
    <Dropdown key="menu" overlay={dropdownMenu} trigger={["click"]}>
      <button
        className="ant-dropdown-link"
        onClick={e => e.preventDefault()}
        type="button"
        style={{ fontSize: "20px", background: "none", border: "none", margin: "0 10px 0 0", fontWeight: "bold" }}
      >
        <MenuOutlined />
      </button>
    </Dropdown>
  );

  const navigationButtons = [
    // <Link key="nav1" to="/" style={{ margin: "0 10px", fontSize: "14px", color: "black" }}>
    //   🪪 Wallet
    // </Link>,
    // <Link key="nav2" to="/swap" style={{ margin: "0 10px", fontSize: "14px", color: "black" }}>
    //   🔁 Swap
    // </Link>,
    <a
      key="nav3"
      href="https://github.com/scaffold-eth/punk-wallet"
      target="_blank"
      rel="noopener noreferrer"
      style={{ margin: "100px 40px 100px 10px", fontSize: "14px", color: "black" }}
    >
      ℹ️ Docs
    </a>,
  ];

  const extraComponents = [
    <Address
      key="address"
      fontSize={32}
      address={address}
      ensProvider={mainnetProvider}
      blockExplorer={blockExplorer}
    />,
    walletDisplay,

    <Reload
      key="checkBalances"
      currentPunkAddress={address}
      localProvider={localProvider}
      networkSettingsHelper={networkSettingsHelper}
      setTargetNetwork={setTargetNetwork}
    />,
    <Account
      key="account"
      address={address}
      localProvider={localProvider}
      userProvider={userProvider}
      mainnetProvider={mainnetProvider}
      price={price}
      web3Modal={web3Modal}
      loadWeb3Modal={loadWeb3Modal}
      logoutOfWeb3Modal={logoutOfWeb3Modal}
      blockExplorer={blockExplorer}
    />,
  ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 850);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <PageHeader
        title={<a href="https://punkwallet.io">{window.innerWidth < 850 ? "🧑‍🎤" : "🧑‍🎤  PunkWallet.io"}</a>}
        style={{ cursor: "pointer", fontSize: 32 }}
        extra={isMobile ? [menuButton, ...extraComponents] : [...navigationButtons, ...extraComponents]}
      />
    </>
  );
}
