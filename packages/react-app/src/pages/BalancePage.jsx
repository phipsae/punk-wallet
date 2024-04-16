import React from "react";
import { TokenBalance } from "../components/Swap/TokenBalance";

function BalancePage({ targetNetwork, setTargetNetwork, networkSettingsHelper, address }) {
  return (
    <div style={{ marginTop: "50px" }}>
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
