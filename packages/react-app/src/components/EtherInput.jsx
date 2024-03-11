import { Input } from "antd";
import React, { useEffect, useState } from "react";
import AmountDollarSwitch from "./AmountDollarSwitch";

import { calcGasCostInEther, getGasLimit, hexToEther, formatDisplayValue } from "../helpers/NativeTokenHelper";
import { getGasPriceInfura, estimateTotalGasCostOptimism } from "../hooks/GasPrice";

export default function EtherInput({
  amount,
  setAmount,
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
  /// displayValue can be token or usd
  const [displayValue, setDisplayValue] = useState();

  const [gasLimit, setGasLimit] = useState();
  const [totalGasOP, setTotalGasOP] = useState();
  const [maxButton, setMaxButton] = useState(false);
  const [providerFull, setProviderFull] = useState();

  /// resolve provider for gas calc in useEffect
  const getProvider = async () => {
    setProviderFull(provider);
  };

  /// L1 gas calc
  const getGasLimitEstimated = async () => {
    const limit = await getGasLimit(provider);
    setGasLimit(limit);
  };

  const getSuggestedMaxFeePerGas = async () => {
    const maxFeePerGas = await getGasPriceInfura(provider, "high");
    setSuggestedMaxFeePerGas(maxFeePerGas.suggestedMaxFeePerGas);
  };

  /// L2 OP gas calc
  const getEstimateTotalGasCostOptimism = async () => {
    const totalGas = await estimateTotalGasCostOptimism(provider);
    setTotalGasOP(totalGas);
  };

  const [max, setMax] = useState();

  const handleMax = () => {
    const userBalance = hexToEther(balance);
    setMax(!max);
    setSendWarning("");
    setUserValueToken(userBalance);
    if (!dollarMode) {
      setDisplayValue(formatDisplayValue(userBalance, dollarMode));
    }
    if (dollarMode) {
      setDisplayValue(formatDisplayValue(userBalance * price, dollarMode));
    }
  };

  const totalGasCalc = networkId => {
    let totalGasCost;
    if (gasLimit && suggestedMaxFeePerGas && (networkId === 1 || networkId === 137 || networkId === 11155111)) {
      totalGasCost = calcGasCostInEther(gasLimit, suggestedMaxFeePerGas);
      console.log("ETHEREUM totalGasCost", totalGasCost);
    }
    /// optimism, base
    else if (totalGasOP && (networkId === 10 || networkId === 8453)) {
      totalGasCost = hexToEther(totalGasOP);
      console.log("OP totalGasCost", totalGasCost);
    }
    /// all the other networks w/o gasEstimate
    else {
      console.log("gas calculation not possible");
    }
    return totalGasCost;
  };

  const calcAmount = (_sendAmount, _userBalance, _totalGasCost) => {
    console.log("IN HEREEEE", _userBalance, _totalGasCost);
    if (_sendAmount > _userBalance) {
      console.log("CASE1");
      setSendWarning("⚠️ You don't have enough funds");
      setAmount(undefined);
    } else if (_totalGasCost > _userBalance) {
      console.log("CASE2");
      setSendWarning("⚠️ Gas cost is higher than your balance");
      setAmount(undefined);
    } else if (Number(_sendAmount) + Number(_totalGasCost) > _userBalance) {
      setAmount(String(Number(_sendAmount) - Number(_totalGasCost)));
      setSendWarning("");
    } else {
      setAmount(_sendAmount);
      setSendWarning("");
    }
  };

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

    if (providerFull && balance) {
      console.log("In here?");
      const userBalance = hexToEther(balance);
      const totalGasCost = totalGasCalc(network.chainId);
      console.log("Total Gas Cost", totalGasCost);
      console.log("userBalance", userBalance);
      calcAmount(userValueToken, userBalance, totalGasCost);
    }
  }, [displayValue, userValueToken, provider, max, suggestedMaxFeePerGas, totalGasOP]);

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

  useEffect(() => {
    getProvider();
  }, [provider]);

  useEffect(() => {
    if (providerFull) {
      getSuggestedMaxFeePerGas();
      getGasLimitEstimated();
      if (network.chainId === 1 || network.chainId === 137 || network.chainId === 11155111) {
        setMaxButton(true);

        return;
      }
      if (network.chainId === 10 || network.chainId === 8453) {
        console.log("OP GAS ESTIMATE", totalGasOP);
        getEstimateTotalGasCostOptimism();
        setMaxButton(true);
        return;
      }
    }
    setMaxButton(false);
  }, [providerFull, userValueToken, displayValue, max]);

  useEffect(() => {
    if (userValueToken !== undefined && userValueToken !== null) {
      if (dollarMode) {
        const newValue = formatDisplayValue(userValueToken * price, dollarMode);
        setDisplayValue(newValue);
      } else {
        const newValue = formatDisplayValue(userValueToken, dollarMode);
        setDisplayValue(newValue);
      }
    }
  }, [dollarMode]);

  return (
    <div>
      {maxButton ? (
        <button
          type="button"
          style={{
            cursor: "pointer",
            color: "red",
            float: "right",
            marginTop: "-5px",
            border: "none",
            backgroundColor: "transparent",
            width: "50px",
            height: "30px",
          }}
          onClick={() => {
            handleMax(setAmount, balance, dollarMode, price);
          }}
        >
          max
        </button>
      ) : (
        <span
          style={{
            display: "inline-block",
            float: "right",
            marginTop: "-5px",
            width: "50px",
            height: "30px",
          }}
        />
      )}
      <Input
        placeholder={"amount in " + (dollarMode ? "USD" : "ETH")}
        prefix={<Prefix dollarMode={dollarMode} />}
        value={displayValue}
        addonAfter={<AmountDollarSwitch nativeToken dollarMode={dollarMode} setDollarMode={setDollarMode} />}
        onChange={e => {
          setSendWarning(" ");
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
