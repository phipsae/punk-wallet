import React from "react";
import { LiFi } from "@lifi/sdk";
import { ethers } from "ethers";

export const SwapLIFISDK = ({ targetNetwork }) => {
  const lifi = new LiFi({
    integrator: "PunkWallet",
  });

  const provider = new ethers.providers.JsonRpcProvider(targetNetwork.rpcUrl, targetNetwork.chainId);
  const walletWithProvider = new ethers.Wallet(localStorage.metaPrivateKey, provider);

  const routeOptions = {
    slippage: 3 / 100, // 3%
    order: "RECOMMENDED",
  };

  const routesRequest = {
    fromChainId: 42161,
    fromAmount: "10000", // 1USDT
    fromTokenAddress: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", // ARB USDT
    toChainId: 42161,
    toTokenAddress: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9", // ARB USDC
    options: routeOptions,
  };

  const run = async () => {
    const result = await lifi.getRoutes(routesRequest);
    const routes = result.routes;
    const chosenRoute = routes[1];
    console.log(chosenRoute);
    const updateCallback = updatedRoute => {
      console.log("Ping! Everytime a status update is made!", updatedRoute);
    };

    // executing a route
    try {
      const route = await lifi.executeRoute(walletWithProvider, chosenRoute, { updateCallback });
      console.log(route);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div>
        <h1>Swap LIFI SDK</h1>
        <button type="button" onClick={run}>
          Click Me to run
        </button>
        <button
          type="button"
          onClick={() => {
            console.log(walletWithProvider);
          }}
        >
          RPC Provider
        </button>
      </div>
    </>
  );
};
