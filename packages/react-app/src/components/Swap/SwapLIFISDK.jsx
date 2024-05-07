import React, { useState, useEffect } from "react";
import { LiFi } from "@lifi/sdk";
import { ethers } from "ethers";
import { InputNumber } from "antd";
import { SelectExchangeToken } from "./SelectExchangeToken";
import { route1 } from "./Route";

export const SwapLIFISDK = ({ targetNetwork, address, userProvider }) => {
  const [fromToken, setFromToken] = useState();
  const [toToken, setToToken] = useState();
  const [fromTokenModal, setFromTokenModal] = useState(false);
  const [toTokenModal, setToTokenModal] = useState(false);
  const [allRoutes, setAllRoutes] = useState([{}]);
  const [route0, setRoute0] = useState();
  const [inputAmount, setInputAmount] = useState(0);
  const [warningMessage, setWarningMessage] = useState("");
  const [disableExchangeButton, setDisableExchangeButton] = useState(true);
  const [disableInputNumber, setDisableInputNumber] = useState(true);
  const [userBalanceNativeToken, setUserBalanceNativeToken] = useState();
  const [gasPriceNativeToken, setGasPriceNativeToken] = useState();
  // const [loadingExchange, setLoadingExchange] = useState(false);

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
    const result = await lifi.getRoutes(_routesRequest);
    const routes = result.routes;
    setAllRoutes(routes);
    const chosenRoute = routes[0];
    setRoute0(chosenRoute);
    console.log("ChosenRoute", chosenRoute);
  };

  useEffect(() => {
    setFromToken();
    setToToken();
  }, [targetNetwork]);

  useEffect(() => {
    if (fromToken && toToken && fromToken.address === toToken.address) {
      setWarningMessage("pls don't select same token");
      setDisableExchangeButton(true);
      setDisableInputNumber(true);
    } else {
      console.log("HERE", fromToken, toToken, fromToken === toToken);
      setWarningMessage("");
    }
  }, [fromToken, toToken]);

  useEffect(() => {
    if (fromToken && toToken && inputAmount > 0 && fromToken.address !== toToken.address) {
      getRoutesLiFi(routesRequestInput);
    }
  }, [fromToken, toToken, inputAmount]);

  const provider = new ethers.providers.JsonRpcProvider(targetNetwork.rpcUrl, targetNetwork.chainId);
  const walletWithProvider = new ethers.Wallet(localStorage.metaPrivateKey, provider);

  const getInputAmount = value => {
    // console.log(value);
    if (fromToken.address !== toToken.address) {
      if (value < fromToken.amount) {
        setInputAmount(value);
        setWarningMessage("");
        setDisableExchangeButton(false);
      } else {
        setWarningMessage("not enough funds");
        setDisableExchangeButton(true);
      }
    }
  };

  const exchangeTokens = async _route => {
    const updateCallback = updatedRoute => {
      console.log("Ping! Everytime a status update is made!", updatedRoute);
    };

    /// executing a route
    try {
      setWarningMessage("");
      const route = await lifi.executeRoute(walletWithProvider, _route, { updateCallback });
      console.log("fromExchange Token", route);
      // setInputAmount(0);
    } catch (error) {
      console.log(error);
      getRoutesLiFi(routesRequestInput);
      setWarningMessage(error.message);
    }
  };

  useEffect(() => {
    if (fromToken && toToken) {
      setDisableInputNumber(false);
    }
  }, [fromToken, toToken]);

  /// set gas price for transcation
  useEffect(() => {
    if (route0) {
      setGasPriceNativeToken(ethers.utils.formatEther(route0.steps[0].estimate.gasCosts[0].amount));
    }
  }, [route0]);

  /// check if enough gas for swap/bridge
  useEffect(() => {
    if (gasPriceNativeToken) {
      if (gasPriceNativeToken > userBalanceNativeToken) {
        setWarningMessage("not enough Gas");
        setDisableExchangeButton(true);
      } else {
        setWarningMessage("");
        setDisableExchangeButton(false);
      }
    }
  }, [gasPriceNativeToken]);

  /// set UserBalance of nativeToken
  const getUserBalanceNativeToken = async () => {
    const balanceNativeToken = await userProvider.getBalance(address);
    const result = ethers.utils.formatEther(balanceNativeToken);
    setUserBalanceNativeToken(result);
  };

  useEffect(() => {
    if (userProvider && fromToken) {
      getUserBalanceNativeToken();
    }
  }, [fromToken]);

  // useEffect(() => {
  //   // Reset the input amount to 0 whenever fromToken changes
  //   console.log("Resetting input amount because fromToken changed:", fromToken);
  //   setInputAmount(0);
  //   // Also, handle any other updates required when fromToken changes, e.g., resetting warnings or disabling buttons
  //   setWarningMessage("");
  //   setDisableExchangeButton(true); // Assume the button should be disabled initially until valid input is provided
  // }, [fromToken]);

  return (
    <>
      <button type="button" onClick={() => console.log(gasPriceNativeToken)}>
        UserBalance
      </button>
      <button type="button" onClick={() => console.log(userBalanceNativeToken)}>
        Get UserBalance
      </button>
      <button
        type="button"
        onClick={() => console.log(ethers.utils.formatEther(route1.steps[0].estimate.gasCosts[0].amount))}
      >
        Native Token Gas Cost
      </button>
      <br />
      <br />
      <InputNumber addonBefore={<>💵 USD 🔀</>} disabled style={{ width: "100%" }} />
      <br />
      <br />

      {Object.values(supportedNetworks).includes(targetNetwork.chainId) ? (
        <div className="d-flex col">
          <div className="col">
            <div>
              <SelectExchangeToken
                targetNetwork={targetNetwork}
                address={address}
                showMyTokens
                selectedItem={fromToken}
                setSelectedItem={setFromToken}
                showTokenModal={fromTokenModal}
                setShowTokenModal={setFromTokenModal}
              />
            </div>
            <div>
              <SelectExchangeToken
                targetNetwork={targetNetwork}
                address={address}
                showMyTokens={false}
                selectedItem={toToken}
                setSelectedItem={setToToken}
                showTokenModal={toTokenModal}
                setShowTokenModal={setToTokenModal}
                excludeToken={fromToken || null}
              />
            </div>
            <div>
              <InputNumber
                status="error"
                min={0}
                precision={6}
                prefix="￥"
                disabled={disableInputNumber}
                // defaultValue={0}
                value={inputAmount}
                onChange={getInputAmount}
              />
              {warningMessage}
            </div>
            <div>
              <button
                type="button"
                className="btn btn-light"
                disabled={disableExchangeButton}
                onClick={() => exchangeTokens(allRoutes[0])}
              >
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
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>Network not supported</>
      )}
    </>
  );
};
