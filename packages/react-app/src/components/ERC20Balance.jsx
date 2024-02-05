import React, { useEffect, useState } from "react";

import { Spin } from "antd";

import { getTokenBalance, getInverseDecimalCorrectedAmountNumber } from "../helpers/ERC20Helper";

import { getTokenPrice } from "../helpers/LiFiTokenPriceHelper";

const { BigNumber } = require("ethers");

export default function ERC20Balance({
  targetNetwork,
  token,
  rpcURL,
  size,
  address,
  dollarMode,
  setDollarMode,
  balance,
  setBalance,
  price,
  setPrice,
}) {
  const [displayedNumber, setDisplayedNumber] = useState();

  useEffect(() => {
    if (!balance || !price) {
      return;
    }

    let displayNumber;

    let decimals = 2;
    const balanceNumber = getInverseDecimalCorrectedAmountNumber(BigNumber.from(balance), token.decimals);

    if (!dollarMode) {
      displayNumber = balanceNumber;

      if (balanceNumber < 1) {
        decimals = 4;
      }      
    }
    else {
      displayNumber = balanceNumber * price;
    }

    setDisplayedNumber(displayNumber.toFixed(decimals));
  }, [balance, price, dollarMode]);

  // ToDo: Update balance after we hit Send

  // ToDo: Get rid of the error (when switching networks qickly):
  // Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
  // https://medium.com/doctolib/react-stop-checking-if-your-component-is-mounted-3bb2568a4934

  useEffect(() => {
    async function getPrice() {
      setPrice(await getTokenPrice(targetNetwork.chainId, token.address));
    }

    getPrice();
  }, [targetNetwork, token]);

  useEffect(() => {
    async function getBalance() {
      if (!address) {
        return;
      }

      try {
        const balanceBigNumber = await getTokenBalance(token, rpcURL, address, price);

        setBalance(balanceBigNumber.toHexString());
      } catch (error) {
        console.error("Coudn't fetch balance", error);
      }
    }

    getBalance();
  }, [address, token, rpcURL, price]);

  return (
    <div>
      <span
        style={{ verticalAlign: "middle", fontSize: size ? size : 24, padding: 8, cursor: "pointer" }}
        onClick={() => {
          setDollarMode(!dollarMode);
        }}
      >
        {!displayedNumber ? <Spin /> : <Display displayedNumber={displayedNumber} dollarMode={dollarMode} />}
      </span>
    </div>
  );
}

const Display = ({ displayedNumber, dollarMode }) => {
  if (dollarMode) {
    return "$" + displayedNumber;
  }
  else {
    return displayedNumber;
  }
};
