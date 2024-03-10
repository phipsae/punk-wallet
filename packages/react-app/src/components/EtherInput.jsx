import { Input } from "antd";
import React, { useEffect, useState } from "react";
import AmountDollarSwitch from "./AmountDollarSwitch";

import { calcGasCostInEther, getGasLimit, hexToEther } from "../helpers/NativeTokenHelper";
import { getGasPriceInfura, estimateTotalGasCostOptimism } from "../hooks/GasPrice";

const { ethers, utils } = require("ethers");

export default function EtherInput({
  setAmount,
  amount,
  price,
  dollarMode,
  setDollarMode,
  provider,
  balance,
  suggestedMaxFeePerGas,
  setSuggestedMaxFeePerGas,
  network,
  setSendWarning,
}) {
  /// userValue in token amount
  const [userValueToken, setUserValueToken] = useState();
  /// displayed value can be token or usd
  const [displayValue, setDisplayValue] = useState();

  const [gasLimit, setGasLimit] = useState();
  const [totalGasOP, setTotalGasOP] = useState();

  useEffect(() => {
    if (Number.isNaN(userValueToken) || !(userValueToken > 0)) {
      console.log("Not a valid amount", userValueToken);
      setAmount(undefined);
      return;
    }
    if (Number.isNaN(displayValue) || !(displayValue > 0)) {
      console.log("Not a valid amount", displayValue);
      return;
    }
    let totalGasCost;
    const userBalance = hexToEther(balance);
    if (provider) {
      if (
        gasLimit &&
        suggestedMaxFeePerGas &&
        (network.chainId === 1 || network.chainId === 137 || network.chainId === 11155111)
      ) {
        totalGasCost = calcGasCostInEther(gasLimit, suggestedMaxFeePerGas);
        console.log("ETHEREUM totalGasCost", totalGasCost);
      }
      /// optimism, base
      else if (totalGasOP && (network.chainId === 10 || network.chainId === 8453)) {
        totalGasCost = hexToEther(totalGasOP);
        console.log("OP totalGasCost", totalGasCost);
      }
      /// all the other networks w/o gasEstimate
      else {
        console.log("not able to estimate gas cost");
        setSendWarning("⚠️ not able to estimate gas cost");
      }
      console.log("UserBalance", userBalance);
      console.log("TxGasCost", totalGasCost);
      if (userValueToken > userBalance) {
        console.log("You don't have enough funds");
        setSendWarning("⚠️ You don't have enough funds");
        setAmount(undefined);
        return;
      }
      if (Number(userValueToken) + Number(totalGasCost) > userBalance) {
        console.log("With gas it is more than you have");
        setSendWarning("⚠️ With gas it is more than you have");
        console.log("Amount less Gas Cost", Number(userValueToken) - Number(totalGasCost));
        setAmount(String(Number(userValueToken) - Number(totalGasCost)));
      }
    } else {
      setAmount(userValueToken);
      console.log("could not retrieve gasCost");
    }

    // setAmount(userValueToken);
  }, [displayValue, userValueToken, provider]);

  useEffect(() => {
    if (userValueToken === 0 || userValueToken === undefined) {
      return;
    }

    if (dollarMode) {
      setDisplayValue(displayValue * price);
    } else {
      setDisplayValue(displayValue / price);
    }
  }, [dollarMode]);

  const getGasLimitEstimated = async () => {
    const limit = await getGasLimit(provider);
    setGasLimit(limit);
  };

  const getEstimateTotalGasCostOptimism = async () => {
    const totalGas = await estimateTotalGasCostOptimism(provider);
    setTotalGasOP(totalGas);
  };

  const getSuggestedMaxFeePerGas = async () => {
    const maxFeePerGas = await getGasPriceInfura(provider, "high");
    setSuggestedMaxFeePerGas(maxFeePerGas.suggestedMaxFeePerGas);
  };

  useEffect(() => {
    if (Number.isNaN(displayValue) || !(displayValue > 0)) {
      console.log("Not a valid amount", displayValue);
      return;
    }

    if (provider) {
      if (network.chainId === 1 || network.chainId === 137 || network.chainId === 11155111) {
        getSuggestedMaxFeePerGas();
        getGasLimitEstimated();
      }
      if (network.chainId === 10) {
        console.log("OP GAS ESTIMATE", totalGasOP);
        getEstimateTotalGasCostOptimism();
      }
    }
  }, [userValueToken, provider, displayValue, network]);

  // const handleMax = (setAmount, balance, dollarMode, price) => {
  //   const gasCost = calculateGasCostTransaction(value, props.provider, props.toAddress);
  //   console.log("Gascost", gasCost);
  //   console.log("Balance", props.balance._hex);
  //   // setAmount(balance);

  //   // setDisplayValue(calcDisplayValue(token, balance, dollarMode, price));
  //   // setUserValue(0);
  // };

  // const balance = useBalance(props.provider, props.address, 1000);
  // let floatBalance = parseFloat("0.00");
  // let usingBalance = balance;

  // if (usingBalance) {
  //   if (props.gasPrice) {
  //     // gasCost = (parseInt(props.gasPrice, 10) * 150000) / 10 ** 18;
  //   }
  //   if (value) {
  //     gasCost = calculateGasCostTransaction(value, props.provider, props.toAddress);
  //     console.log(gasCost);
  //   }

  //   const etherBalance = utils.formatEther(usingBalance);
  //   parseFloat(etherBalance).toFixed(2);
  //   floatBalance = parseFloat(etherBalance - gasCost);
  //   if (floatBalance < 0) {
  //     floatBalance = 0;
  //   }
  // }

  // let displayBalance = floatBalance.toFixed(4);

  // const price = props.price;

  // function getBalance(_mode) {
  //   setValue(floatBalance);
  //   if (_mode === "USD") {
  //     displayBalance = (floatBalance * price).toFixed(2);
  //   } else {
  //     displayBalance = floatBalance.toFixed(4);
  //   }
  //   return displayBalance;
  // }

  // useEffect(() => {
  //   if (!currentValue && !displayMax) {
  //     setDisplay("");
  //   }
  // }, [currentValue]);

  return (
    <div>
      <button
        type="button"
        onClick={async () => {
          // console.log("suggestedMaxFeePerGas from click", suggestedMaxFeePerGas);
          // console.log("gasLimit", gasLimit);
          // console.log("provider", provider._network.chainId);
          // console.log("amount", amount);
          // console.log("totalGas", hexToString(totalGasOP));
          console.log("ChainID", network.chainId);
          // console.log(handleMax(setValue, props.balance, props.dollarMode, props.price));
        }}
      >
        Click Me
      </button>
      <button
        type="button"
        onClick={async () => {
          console.log("FROM BUTTON", suggestedMaxFeePerGas);
        }}
      >
        Calc GasCost
      </button>
      {/* <span
        style={{ cursor: "pointer", color: "red", float: "right", marginTop: "-5px" }}
        onClick={() => {
          setDisplay(getBalance(mode));
          setDisplayMax(true);
          if (typeof props.onChange === "function") {
            props.onChange(floatBalance);
          }
        }}
      >
        max
      </span> */}
      <Input
        placeholder={"amount in " + (dollarMode ? "USD" : "ETH")}
        // autoFocus={props.autoFocus}
        prefix={<Prefix dollarMode={dollarMode} />}
        value={displayValue}
        addonAfter={<AmountDollarSwitch nativeToken dollarMode={dollarMode} setDollarMode={setDollarMode} />}
        onChange={e => {
          setDisplayValue(e.target.value);
          if (!dollarMode) {
            setUserValueToken(e.target.value);
          }
          if (dollarMode) {
            setUserValueToken(e.target.value / price);
          }
        }}
      />
    </div>
  );
}

const Prefix = ({ dollarMode }) => {
  if (dollarMode) {
    return "$";
  }

  return <span>Ξ</span>;
};
