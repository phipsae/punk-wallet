import React, { useState } from "react";

import { SwapLIFISDK } from "../components/Swap/SwapLIFISDK";
import SelectorWithSettings from "../components/SelectorWithSettings";
import NetworkDisplay from "../components/NetworkDisplay";
// import { useAppContext } from "../contexts/AppContext";

function SwapPage({ targetNetwork, setTargetNetwork, address, networkSettingsHelper, userProvider }) {
  const [setNetworkSettingsModalOpen] = useState(false);
  return (
    <div className="container">
      <div className="col-md-8 flex" style={{ marginTop: "50px" }}>
        <h1>Here you can swap soon</h1>
        <button
          type="button"
          onClick={() => {
            console.log(address, userProvider);
          }}
        >
          Click Me
        </button>
        <div>
          <SelectorWithSettings
            settingsHelper={networkSettingsHelper}
            settingsModalOpen={setNetworkSettingsModalOpen}
            itemCoreDisplay={network => <NetworkDisplay network={network} />}
            onChange={() => {
              setTargetNetwork(networkSettingsHelper.getSelectedItem(true));
            }}
            optionStyle={{ lineHeight: 1.1 }}
          />
        </div>

        <SwapLIFISDK targetNetwork={targetNetwork} address={address} userProvider={userProvider} />
      </div>
    </div>
  );
}

export default SwapPage;
