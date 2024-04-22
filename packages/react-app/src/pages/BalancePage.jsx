import React, { useState } from "react";
import { Switch } from "antd";
import { TokenBalance } from "../components/Swap/TokenBalance";
import SelectorWithSettings from "../components/SelectorWithSettings";
import NetworkDisplay from "../components/NetworkDisplay";

function BalancePage({ targetNetwork, setTargetNetwork, networkSettingsHelper, address }) {
  const [setNetworkSettingsModalOpen] = useState(false);
  const [showMyTokens, setShowMyTokens] = useState(false);

  const onChange = checked => {
    console.log(`switch to ${checked}`);
    setShowMyTokens(!showMyTokens);
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8" style={{ marginTop: "50px" }}>
          <div className="row d-flex flex-row">
            <div
              className="d-flex flex-row align-items-center justify-content-between"
              style={{ marginBottom: "10px" }}
            >
              <SelectorWithSettings
                settingsHelper={networkSettingsHelper}
                settingsModalOpen={setNetworkSettingsModalOpen}
                itemCoreDisplay={network => <NetworkDisplay network={network} />}
                onChange={() => {
                  setTargetNetwork(networkSettingsHelper.getSelectedItem(true));
                }}
                optionStyle={{ lineHeight: 1.1 }}
              />
              <div
                className="col-4 d-flex flex-row align-items-center justify-content-end"
                style={{ marginRight: "5px" }}
              >
                <span className="text-small" style={{ fontSize: "8px", marginRight: "10px" }}>
                  (all tokens)
                </span>
                <Switch defaultChecked onChange={onChange} />
              </div>
            </div>
          </div>

          <TokenBalance targetNetwork={targetNetwork} address={address} showMyTokens={showMyTokens} />
        </div>
      </div>
    </div>
  );
}

export default BalancePage;
