import { Input } from "antd";
import React, { useEffect, useState } from "react";
import AmountDollarSwitch from "./AmountDollarSwitch";

import { calculateGasCostTransaction, hexToString } from "../helpers/NativeTokenHelper";

const { ethers, utils } = require("ethers");

export default function EtherInput({ setAmount, amount, price, dollarMode, setDollarMode, provider, balance }) {
  /// userValue in token amount
  const [userValueToken, setUserValueToken] = useState();
  /// displayed value can be token or usd
  const [displayValue, setDisplayValue] = useState();

  const [gasCost, setGasCost] = useState();

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
    if (gasCost) {
      const userBalance = hexToString(balance);
      const txGasCost = hexToString(gasCost);
      if (userValueToken > userBalance) {
        console.log("You don't have enough funds");
        setAmount(undefined);
        return;
      }
      console.log(Number(userValueToken) + Number(txGasCost));
      console.log("Here", typeof userValueToken);
      if (Number(userValueToken) + Number(txGasCost) > userBalance) {
        console.log("With gas it is more than you have");
        setAmount(String(Number(userValueToken) - Number(txGasCost)));
        return;
      }
    }

    setAmount(userValueToken);
  }, [displayValue]);

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

  const getGasCost = async () => {
    const gas = await calculateGasCostTransaction(provider);
    setGasCost(gas);
  };

  useEffect(() => {
    // if (Number.isNaN(displayValue) || !(displayValue > 0)) {
    //   console.log("Not a valid amount", displayValue);
    //   return;
    // }
    getGasCost();
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
          console.log("UserValueToken", userValueToken);
          console.log("Display Value", displayValue);
          console.log("Amount", typeof amount);
          console.log("GasCost", hexToString(gasCost));
          console.log("Balance", balance);
          console.log("Hextostring", hexToString(balance));
          // console.log(handleMax(setValue, props.balance, props.dollarMode, props.price));
        }}
      >
        Click Me
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
