import { Input } from "antd";
import React, { useEffect, useState } from "react";
import AmountDollarSwitch from "./AmountDollarSwitch";

import { calcGasCostInEther, getGasLimit, hexToString } from "../helpers/NativeTokenHelper";
import { getGasPriceInfura } from "../hooks/GasPrice";

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
}) {
  /// userValue in token amount
  const [userValueToken, setUserValueToken] = useState();
  /// displayed value can be token or usd
  const [displayValue, setDisplayValue] = useState();

  const [gasLimit, setGasLimit] = useState();
  // const [suggestedMaxFeePerGas, setSuggestedMaxFeePerGas] = useState();
  // const [gasCost, setGasCost] = useState();

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
    if (gasLimit && suggestedMaxFeePerGas) {
      const userBalance = hexToString(balance);
      const txGasCostInEther = calcGasCostInEther(gasLimit, suggestedMaxFeePerGas);
      console.log("UserBalance", userBalance);
      console.log("TxGasCost", txGasCostInEther);
      if (userValueToken > userBalance) {
        console.log("You don't have enough funds");
        setAmount(undefined);
        return;
      }
      if (Number(userValueToken) + Number(txGasCostInEther) > userBalance) {
        console.log("With gas it is more than you have");
        console.log("Amount less Gas Cost", Number(userValueToken) - Number(txGasCostInEther));
        setAmount(String(Number(userValueToken) - Number(txGasCostInEther)));
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
      getSuggestedMaxFeePerGas();
      getGasLimitEstimated();
    }
  }, [userValueToken, provider, displayValue]);

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
          console.log("suggestedMaxFeePerGas from click", suggestedMaxFeePerGas);
          console.log("gasLimit", gasLimit);
          console.log("provider", provider._network.chainId);
          console.log("amount", amount);
          // console.log(handleMax(setValue, props.balance, props.dollarMode, props.price));
        }}
      >
        Click Me
      </button>
      <button
        type="button"
        onClick={async () => {
          console.log("CalcGasCost", calcGasCostInEther(gasLimit, suggestedMaxFeePerGas));
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
