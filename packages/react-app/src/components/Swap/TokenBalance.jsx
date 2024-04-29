import React, { useState, useEffect } from "react";
import { RedoOutlined } from "@ant-design/icons";
import axios from "axios";
import { LiFi } from "@lifi/sdk";
import "./ScrollableTable.css";
import { TokenTable } from "./TokenTable";

export const TokenBalance = ({ targetNetwork, address, showMyTokens, setSelectedItem, excludeToken }) => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [allTokensBalances, setAllTokensBalances] = useState();
  const [message, setMessage] = useState("");

  const chainId = targetNetwork.chainId;

  const lifi = new LiFi({
    integrator: "PunkWallet",
  });

  const getTokens = async _chain => {
    try {
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
    } catch (error) {
      return error;
    }
  };

  // const onChange = checked => {
  //   console.log(`switch to ${checked}`);
  //   setShowMyTokens(!showMyTokens);
  // };

  const supportedNetworks = {
    mainnet: 1,
    optimism: 10,
    gnosis: 100,
    polygon: 137,
    arbitrum: 42161,
    base: 8453,
    scroll: 534352,
    zksync: 324,
  };

  const run = async _onlyBalance => {
    try {
      if (Object.values(supportedNetworks).includes(targetNetwork.chainId)) {
        setMessage("");
        setLoading(true);
        const allTokensPromise = getTokens([targetNetwork.chainId]);
        const allTokensFul = await allTokensPromise;

        const balances = lifi.getTokenBalancesForChains(address, allTokensFul.tokens);
        const balancesFul = await balances;

        let balancesFullSort = balancesFul[chainId].sort(
          (a, b) => parseFloat(b.amount * b.priceUSD) - parseFloat(a.amount * a.priceUSD),
        );
        if (_onlyBalance) {
          balancesFullSort = balancesFullSort.filter(item => item.amount > 0);
        }

        /// to ensure that same token I want to swap from is not displyed in the toToken
        if (excludeToken != null) {
          balancesFullSort = balancesFullSort.filter(item => item.coinKey !== excludeToken.coinKey);
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
      } else {
        setAllTokensBalances();
        setMessage("Unsupported network");
      }
    } catch (error) {
      console.error("Failed to fetch from blockchain:", error);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      run(showMyTokens);
    }, 500); // Delay of 500 ms

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, targetNetwork, address, showMyTokens]);

  return (
    <div>
      <div className="row navbar navbar-light bg-light justify-content-between">
        <div className="row align-items-center d-flex justify-content-center">
          <div className="col">
            <input
              className="form-control mr-sm-2"
              type="search"
              placeholder="Search by token symbol..."
              aria-label="Search"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-2 d-flex justify-content-end">
            <button
              type="button"
              onClick={() => run(showMyTokens)}
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
      <div style={{ marginTop: "20px" }}>
        <TokenTable items={allTokensBalances} loading={loading} message={message} setSelectedItem={setSelectedItem} />
      </div>
    </div>
  );
};
