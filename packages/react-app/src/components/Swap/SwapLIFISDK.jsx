import React, { useState, useEffect } from "react";
import { LiFi } from "@lifi/sdk";
import { ethers } from "ethers";
import { InputNumber } from "antd";
import { SelectExchangeToken } from "./SelectExchangeToken";
import { from } from "apollo-boost";

export const SwapLIFISDK = ({ targetNetwork, address, userProvider }) => {
  const [fromToken, setFromToken] = useState();
  const [toToken, setToToken] = useState();
  const [fromTokenModal, setFromTokenModal] = useState(false);
  const [toTokenModal, setToTokenModal] = useState(false);
  const [allRoutes, setAllRoutes] = useState([{}]);
  const [inputAmount, setInputAmount] = useState(0);

  const lifi = new LiFi({
    integrator: "PunkWallet",
  });

  const supportedNetworks = {
    mainnet: 1,
    optimism: 10,
    // gnosis: 100,
    // polygon: 137,
    arbitrum: 42161,
    base: 8453,
    // scroll: 534352,
    // zksync: 324,
  };

  const routeOptions = {
    // slippage: 3 / 100, // 3%
    // order: "RECOMMENDED",
    // // exchanges: {
    // //   allow: ["1inch", "odos", "dodo"],
    // // },
    order: "CHEAPEST",
    slippage: 0.005,
    maxPriceImpact: 0.4,
    allowSwitchChain: true,
    insurance: false,
  };

  const routesRequestInput = {
    fromAddress: address,
    fromChainId: targetNetwork.chainId,
    fromAmount: fromToken ? String(inputAmount * 10 ** fromToken.decimals) : "", // 1USDT
    fromTokenAddress: fromToken ? fromToken.address : "", // OP OP
    toChainId: targetNetwork.chainId,
    toTokenAddress: toToken ? toToken.address : "", // OP USDCe
    options: {
      // integrator: "jumper.exchange",
      slippage: 3 / 100, // 3%
      order: "RECOMMENDED",
      // order: "CHEAPEST",
      // slippage: 0.005,
      maxPriceImpact: 0.4,
      allowSwitchChain: true,
      insurance: false,
    },
  };

  const getRoutesLiFi = async _routesRequest => {
    console.log("Request", _routesRequest);
    const result = await lifi.getRoutes(_routesRequest);
    const routes = result.routes;
    setAllRoutes(routes);
    console.log("All Routes", routes);
    const chosenRoute = routes[0];
    console.log("ChosenRoute", chosenRoute);
  };

  useEffect(() => {
    setFromToken();
    setToToken();
  }, [targetNetwork]);

  useEffect(() => {
    if (fromToken && toToken && inputAmount > 0) {
      getRoutesLiFi(routesRequestInput);
    }
  }, [fromToken, toToken, inputAmount]);

  const provider = new ethers.providers.JsonRpcProvider(targetNetwork.rpcUrl, targetNetwork.chainId);
  const walletWithProvider = new ethers.Wallet(localStorage.metaPrivateKey, provider);

  const getInputAmount = value => {
    // console.log(value);
    setInputAmount(value);
  };

  const exchangeTokens = async _route => {
    // const updateCallback = updatedRoute => {
    //   console.log("Ping! Everytime a status update is made!", updatedRoute);
    // };
    console.log(_route);

    /// executing a route
    try {
      const route = await lifi.executeRoute(walletWithProvider, _route);
      console.log(route);
    } catch (error) {
      console.log(error);
    }
  };

  const run = async _routesRequest => {
    console.log("Request", _routesRequest);
    const result = await lifi.getRoutes(_routesRequest);
    const routes = result.routes;
    setAllRoutes(routes);
    console.log("All Routes", routes);
    const chosenRoute = routes[0];
    console.log("ChosenRoute", chosenRoute);
    // const updateCallback = updatedRoute => {
    //   console.log("Ping! Everytime a status update is made!", updatedRoute);
    // };

    // // executing a route
    // try {
    //   const route = await lifi.executeRoute(userProvider, chosenRoute, { updateCallback });
    //   console.log(route);
    // } catch (error) {
    //   console.log(error);
    // }
  };

  // if (!Object.values(supportedNetworks).includes(targetNetwork.chainId)) {
  //   console.log("here");
  //   return <>Network not supported</>;
  // }

  return (
    <>
      <div>
        <button type="button" onClick={() => console.log(fromToken.decimals)}>
          From Token
        </button>
        <button type="button" onClick={() => run(routesRequestInput)}>
          Inputs
        </button>
        <br />
        <br />
        <br />
        <SelectExchangeToken
          targetNetwork={targetNetwork}
          address={address}
          showMyTokens
          selectedItem={fromToken}
          setSelectedItem={setFromToken}
          showTokenModal={fromTokenModal}
          setShowTokenModal={setFromTokenModal}
        />
        <SelectExchangeToken
          targetNetwork={targetNetwork}
          address={address}
          showMyTokens={false}
          selectedItem={toToken}
          setSelectedItem={setToToken}
          showTokenModal={toTokenModal}
          setShowTokenModal={setToTokenModal}
        />
      </div>
      <InputNumber defaultValue={0} onChange={getInputAmount} />
      <button type="button" className="btn btn-light" onClick={() => exchangeTokens(allRoutes[0])}>
        {!fromToken && !toToken && <div>no tokens set</div>}
        {fromToken &&
          toToken &&
          (allRoutes.length > 0 ? (
            <div>
              swap {fromToken.coinKey} to {toToken.coinKey}
              {allRoutes[0].gasCostUSD}
            </div>
          ) : (
            <div>no routes available</div>
          ))}
        {/* {fromToken && toToken && !allRoutes && allRoutes.length() === 0 && <div>no routes available</div>} */}
      </button>
    </>
  );
};
