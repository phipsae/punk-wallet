import React, { useState, useEffect, useRef } from "react";
import { LiFi } from "@lifi/sdk";
import { ethers } from "ethers";
import axios from "axios";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { SelectExchangeToken } from "./SelectExchangeToken";
import { route1 } from "./Route";

export const SwapLIFISDK = ({ targetNetwork, address, userProvider }) => {
  const [fromToken, setFromToken] = useState();
  const [toToken, setToToken] = useState();
  const [fromTokenModal, setFromTokenModal] = useState(false);
  const [toTokenModal, setToTokenModal] = useState(false);
  const [allRoutes, setAllRoutes] = useState([{}]);
  const [route0, setRoute0] = useState();
  const [inputAmount, setInputAmount] = useState();
  const [warningMessage, setWarningMessage] = useState("");
  const [disableExchangeButton, setDisableExchangeButton] = useState(true);
  const [disableInputNumber, setDisableInputNumber] = useState(true);
  const [userBalanceNativeToken, setUserBalanceNativeToken] = useState();
  const [gasPriceNativeToken, setGasPriceNativeToken] = useState();
  const [tokenCheckMessage, setTokenCheckMessage] = useState("loading");

  // const [loadingExchange, setLoadingExchange] = useState(false);

  const timeoutRef = useRef(null);

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

  const checkIfTokens = async () => {
    try {
      if (Object.values(supportedNetworks).includes(targetNetwork.chainId)) {
        const allTokensPromise = getTokens([targetNetwork.chainId]);
        const allTokensFul = await allTokensPromise;

        const balances = lifi.getTokenBalancesForChains(address, allTokensFul.tokens);
        const balancesFul = await balances;

        const balancesFullSort = balancesFul[targetNetwork.chainId].filter(item => item.amount > 0);

        if (balancesFullSort.length > 0) {
          setTokenCheckMessage("");
        } else {
          console.log("No tokens");
          setTokenCheckMessage("No tokens");
        }

        console.log(balancesFullSort);
      } else {
        setTokenCheckMessage("Network not supported");
      }
    } catch (error) {
      console.error("Failed to fetch from blockchain:", error);
    }
  };

  const switchTokens = () => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
  };

  const createRouteRequest = () => {
    const routesRequestInput = {
      fromAddress: address,
      fromChainId: targetNetwork.chainId,
      fromAmount: fromToken ? String(inputAmount * 10 ** fromToken.decimals) : "",
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
    return routesRequestInput;
  };

  const getRoutesLiFi = async _routesRequest => {
    try {
      const result = await lifi.getRoutes(_routesRequest);
      setAllRoutes(result.routes);
      if (result.routes.length > 0) {
        setRoute0(result.routes[0]);
        console.log("ChosenRoute", result.routes[0]);
      } else {
        console.log("No routes found");
        setWarningMessage("No routes available");
      }
      console.log("in here");
    } catch (error) {
      console.error("Error fetching routes:", error);
      setWarningMessage("Failed to fetch routes: " + error.message);
    }
  };

  useEffect(() => {
    setFromToken();
    setToToken();
  }, [targetNetwork]);

  useEffect(() => {
    if (address) {
      checkIfTokens();
    }
  }, [address]);

  useEffect(() => {
    if (fromToken && toToken && fromToken.address === toToken.address) {
      setWarningMessage("Pls don't select same token");
      setDisableExchangeButton(true);
      setDisableInputNumber(true);
    } else {
      setWarningMessage("");
    }
  }, [fromToken, toToken]);

  // useEffect(() => {
  //   if (fromToken && toToken && inputAmount > 0 && fromToken.address !== toToken.address) {
  //     getRoutesLiFi(createRouteRequest());
  //   }
  // }, [fromToken, toToken, inputAmount]);

  useEffect(() => {
    // Function to call getRoutesLiFi with throttling
    const handleGetRoutes = () => {
      if (fromToken && toToken && inputAmount > 0 && fromToken.address !== toToken.address) {
        // Clear the existing timeout if it exists
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Set a new timeout
        timeoutRef.current = setTimeout(() => {
          getRoutesLiFi(createRouteRequest());
        }, 1000); // Delay the function call by 1000 milliseconds (1 second)
      }
    };

    // Call the throttled function
    handleGetRoutes();

    // Cleanup function to clear the timeout when the component unmounts or dependencies change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [fromToken, toToken, inputAmount]); // Dependencies array

  const provider = new ethers.providers.JsonRpcProvider(targetNetwork.rpcUrl, targetNetwork.chainId);
  const walletWithProvider = new ethers.Wallet(localStorage.metaPrivateKey, provider);

  const getInputAmount = event => {
    const value = event.target.value;
    const cleanValue = value.replace(/[^0-9.]/g, ""); // Remove non-numeric characters except the decimal point

    // Allow only one decimal point
    const parts = cleanValue.split(".");
    if (parts.length > 2) {
      // More than one decimal point
      setInputAmount(parts[0] + "." + parts[1].slice(0)); // Include only first decimal section
    } else {
      setInputAmount(cleanValue); // Set cleaned value
    }

    // Convert to number only when necessary for validation
    const numericValue = parseFloat(value);

    if (value === "") {
      setWarningMessage("Please enter an amount.");
      setDisableExchangeButton(true);
    } else if (Number.isNaN(numericValue) && value !== "." && value !== "") {
      setWarningMessage("Please enter a valid number.");
      setDisableExchangeButton(true);
    } else if (fromToken && numericValue > parseFloat(fromToken.amount)) {
      setWarningMessage("Not enough funds.");
      setDisableExchangeButton(true);
    } else if (numericValue > 0) {
      setWarningMessage("");
      setDisableExchangeButton(false);
    } else {
      setWarningMessage("Input a positive number.");
      setDisableExchangeButton(true);
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
      getRoutesLiFi(createRouteRequest());
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

  return (
    <>
      {/* <button type="button" onClick={() => testRun()}>
        getTokens
      </button> */}
      <button type="button" onClick={() => console.log(address)}>
        Get UserBalance
      </button>
      <button type="button" onClick={() => switchTokens()}>
        Switch
      </button>
      <button
        type="button"
        onClick={() => console.log(ethers.utils.formatEther(route1.steps[0].estimate.gasCosts[0].amount))}
      >
        Native Token Gas Cost
      </button>
      <br />
      {/* <br />
      <InputNumber addonBefore={<>💵 USD 🔀</>} disabled style={{ width: "100%" }} />
      <br /> */}
      <br />

      {tokenCheckMessage && <div>{tokenCheckMessage}</div>}

      {!tokenCheckMessage && Object.values(supportedNetworks).includes(targetNetwork.chainId) && (
        <div className="d-flex col">
          <div className="col">
            <div className="d-flex" style={{ justifyContent: "space-between", alignItems: "center", width: "100%" }}>
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
              <button
                type="button"
                onClick={() => switchTokens()}
                style={{
                  width: "40px", // Makes the button square which will become a circle with borderRadius
                  height: "40px",
                  lineHeight: "40px", // Vertically centers the text/icon in the button
                  borderRadius: "50%", // This makes the square a circle
                  backgroundColor: "#808080", // Example: using a Bootstrap-like blue color
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <ArrowRightOutlined />
              </button>
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
            </div>

            <div>
              <Input
                value={inputAmount}
                placeholder="Enter amount"
                prefix={
                  fromToken ? (
                    <img
                      src={fromToken.logoURI}
                      alt="n/a"
                      style={{ width: "20px", marginRight: "10px", verticalAlign: "middle" }}
                    />
                  ) : (
                    <span> </span>
                  )
                }
                disabled={disableInputNumber}
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
      )}
    </>
  );
};
