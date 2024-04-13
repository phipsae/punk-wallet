import React from "react";
import MainWallet from "../MainWallet";

function WalletPage({
  subgraphUri,
  targetNetwork,
  setTargetNetwork,
  networkSettingsHelper,
  setLocalProvider,
  localProvider,
  userProvider,
  address,
  mainnetProvider,
}) {
  return (
    <MainWallet
      subgraphUri={subgraphUri}
      targetNetwork={targetNetwork}
      setTargetNetwork={setTargetNetwork}
      networkSettingsHelper={networkSettingsHelper}
      localProvider={localProvider}
      setLocalProvider={setLocalProvider}
      userProvider={userProvider}
      address={address}
      mainnetProvider={mainnetProvider}
    />
  );
}

export default WalletPage;
