import React from "react";
import { TokenBalance } from "../components/Swap/TokenBalance";
// import { useAppContext } from "../contexts/AppContext";

function BalancePage({ targetNetwork, setTargetNetwork, networkSettingsHelper, address }) {
  // const { web3ModalInstance, localProviderContext, userAddress } = useAppContext();
  return (
    <div style={{ marginTop: "50px" }}>
      {/* <h1 className="text-center">Token Balance</h1> */}
      <TokenBalance
        targetNetwork={targetNetwork}
        setTargetNetwork={setTargetNetwork}
        networkSettingsHelper={networkSettingsHelper}
        address={address}
      />
    </div>
  );
}

export default BalancePage;
