import React, { useState, useEffect } from "react";
import { RedoOutlined } from "@ant-design/icons";
import axios from "axios";
import { LiFi } from "@lifi/sdk";
import "./ScrollableTable.css";
import { TokenTable } from "./TokenTable";
import SelectorWithSettings from "../SelectorWithSettings";
import NetworkDisplay from "../NetworkDisplay";

export const TokenBalance = ({ targetNetwork, setTargetNetwork, networkSettingsHelper, address }) => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [allTokensBalances, setAllTokensBalances] = useState();
  const [setNetworkSettingsModalOpen] = useState(false);

  const chainId = targetNetwork.chainId;

  const lifi = new LiFi({
    integrator: "PunkWallet",
  });

  const getTokens = async _chain => {
    const optionalFilter = _chain; // Both numeric and mnemonic can be used
    /// chainTypes can be of type SVM and EVM. By default, only EVM tokens will be returned
    const optionalChainTypes = "EVM";
    const result = await axios.get("https://li.quest/v1/tokens", {
      params: {
        chains: optionalFilter.join(","),
        chainTypes: optionalChainTypes,
      },
    });
    return result.data;
  };

  const run = async onlyBalance => {
    setLoading(true);
    const allTokensPromise = getTokens([targetNetwork.chainId]);
    const allTokensFul = await allTokensPromise;

    const balances = lifi.getTokenBalancesForChains(address, allTokensFul.tokens);
    const balancesFul = await balances;

    let balancesFullSort = balancesFul[chainId].sort(
      (a, b) => parseFloat(b.amount * b.priceUSD) - parseFloat(a.amount * a.priceUSD),
    );
    if (onlyBalance) {
      balancesFullSort = balancesFullSort.filter(item => item.amount > 0);
    }

    if (searchTerm && balancesFullSort) {
      console.log("searchTerm", searchTerm.toLowerCase());
      const filteredItems = balancesFullSort.filter(
        item => item.coinKey && item.coinKey.toLowerCase() === searchTerm.toLowerCase(),
      );
      setAllTokensBalances(filteredItems);
      setLoading(false);
      return;
    }
    setAllTokensBalances(balancesFullSort);
    setLoading(false);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      run(false);
    }, 500); // Delay the run function by 500 ms

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, targetNetwork, address]);

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          console.log(address);
        }}
      >
        {" "}
        Click Me
      </button>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="row navbar navbar-light bg-light justify-content-between">
              <div className="col-7" style={{ marginLeft: "20px" }}>
                <SelectorWithSettings
                  settingsHelper={networkSettingsHelper}
                  settingsModalOpen={setNetworkSettingsModalOpen}
                  itemCoreDisplay={network => <NetworkDisplay network={network} />}
                  onChange={() => {
                    setTargetNetwork(networkSettingsHelper.getSelectedItem(true));
                  }}
                  optionStyle={{ lineHeight: 1.1 }}
                />
                <div>
                  <button type="button" className="btn btn-primary" data-bs-toggle="button" autoComplete="off">
                    Toggle button
                  </button>
                  <button type="button" className="btn btn-primary" disabled data-bs-toggle="button" autoComplete="off">
                    Disabled toggle button
                  </button>
                </div>
              </div>
              <div className="col-4">
                <div className="row align-items-center">
                  <div className="col-9">
                    {/* <form className="form-inline"> */}
                    <input
                      className="form-control mr-sm-2"
                      type="search"
                      placeholder="Search..."
                      aria-label="Search"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                    {/* </form> */}
                  </div>
                  <div className="col-2">
                    <button
                      type="button"
                      onClick={run}
                      style={{
                        background: "none",
                        border: "none",
                        color: "inherit",
                        padding: 0,
                        cursor: "pointer",
                        outline: "none",
                      }}
                    >
                      {loading ? (
                        <RedoOutlined spin style={{ fontSize: "24px", fontWeight: "bold" }} />
                      ) : (
                        <RedoOutlined style={{ fontSize: "24px", fontWeight: "bold" }} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: "20px" }}>
          <TokenTable items={allTokensBalances} loading={loading} />
        </div>
      </div>
    </div>
  );
};
