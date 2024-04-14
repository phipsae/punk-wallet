import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table } from "antd";
import { LiFi } from "@lifi/sdk";

export const TokenBalance = ({ userProvider, targetNetwork }) => {
  const [token, setToken] = useState();
  const [allTokens, setAllTokens] = useState();
  const [allTokensBalances, setAllTokensBalances] = useState();

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

  const getToken = async (chain, token) => {
    const result = await axios.get("https://li.quest/v1/token", {
      params: {
        chain,
        token,
      },
    });
    return result.data;
  };

  const run = async () => {
    // Log and retrieve the token asynchronously
    const token1Promise = getToken(targetNetwork.chainId, "USDC");
    console.log(token1Promise); // This will log the promise itself

    const allTokensPromise = getTokens([targetNetwork.chainId]);
    const allTokensFul = await allTokensPromise;

    const balances = lifi.getTokenBalancesForChains("0x0D2c2935569E2A213c82262A789Fc0Ccc59a4D3C", allTokensFul.tokens);
    const balancesFul = await balances;
    const balancesFullSort = balancesFul[chainId].sort(
      (a, b) => parseFloat(b.amount * b.priceUSD) - parseFloat(a.amount * a.priceUSD),
    );

    setAllTokensBalances(balancesFullSort);

    setAllTokens(allTokensFul);

    console.log(allTokens);
  };

  const dataSource = [
    {
      key: "1",
      name: "Mike",
      age: 32,
      address: "10 Downing Street",
    },
    {
      key: "2",
      name: "John",
      age: 42,
      address: "10 Downing Street",
    },
  ];

  const columns = [
    {
      title: "Asset",
      dataIndex: "coinkey",
      key: "coinkey",
    },
    {
      title: "Price",
      dataIndex: "priceUSD",
      key: "priceUSD",
    },
    {
      title: "Balance",
      dataIndex: "amount",
      key: "amount",
    },
  ];

  useEffect(() => {
    run();
  }, []);

  //   useEffect(() => {
  //     if (allTokens) {
  //       const balances = lifi.getTokenBalancesForChains("0x0D2c2935569E2A213c82262A789Fc0Ccc59a4D3C", allTokens.tokens);
  //       setAllTokensBalances(balances);
  //     }
  //   }, [allTokens]);

  return (
    <>
      <div>
        <h1>Token Balance</h1>
        <button
          type="button"
          onClick={() => {
            console.log("huhu");
          }}
        >
          Click Me to run
        </button>
        <button type="button" onClick={() => run()}>
          RUn script
        </button>
        <button
          type="button"
          onClick={() => {
            console.log(allTokensBalances);
            console.log(typeof allTokens.tokens);
          }}
        >
          AllTokens
        </button>
        <button
          type="button"
          onClick={() => {
            const token2 = lifi.getTokenBalancesForChains(
              "0x0D2c2935569E2A213c82262A789Fc0Ccc59a4D3C",
              allTokens.tokens,
            );
            console.log(token2);
          }}
        >
          GetBalance Tokens
        </button>
        <button
          type="button"
          onClick={() => {
            const allTokensFul = getTokens();
            console.log(allTokensFul);
          }}
        >
          Get all Token
        </button>
        {allTokens &&
          allTokensBalances.slice(0, 10).map(t => (
            <div key={t.name}>
              <p>Token Name: {t.name}</p>
              <p>Token Symbol: {t.symbol}</p>
              <p>Token Balance: {t.amount}</p>
              <p>Value in USD: {t.amount * t.priceUSD}</p>
            </div>
          ))}
      </div>
      <Table dataSource={allTokensBalances} columns={columns} />;
    </>
  );
};
