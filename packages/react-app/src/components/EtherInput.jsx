import { Input } from "antd";
import React, { useEffect, useState } from "react";
import AmountDollarSwitch from "./AmountDollarSwitch";

import { hexToEther, formatDisplayValue } from "../helpers/NativeTokenHelper";
import { getGasPriceInfura, estimateTotalGasCostOptimism, getGasLimit, totalGasCalc } from "../hooks/GasPrice";

export default function EtherInput({
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
  displayValue,
  setDisplayValue,
  txSpeed,
  gasLimit,
  setGasLimit,
  setShowTxDetailsButton,
}) {
  /// userValue in token amount
  const [userValueToken, setUserValueToken] = useState();
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

  const getSuggestedMaxFeePerGas = async _txSpeed => {
    const maxFeePerGas = await getGasPriceInfura(provider, _txSpeed);
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

  const calcAmount = (_sendAmount, _userBalance, _totalGasCost) => {
    if (_sendAmount > _userBalance) {
      setSendWarning("⚠️ You don't have enough funds");
      setAmount(undefined);
    } else if (_totalGasCost > _userBalance) {
      setSendWarning("⚠️ Gas cost is higher than your balance");
      setAmount(undefined);
    } else if (Number(_sendAmount) + Number(_totalGasCost) > _userBalance) {
      setAmount(String(Number(_sendAmount) - Number(_totalGasCost)));
      setSendWarning("");
    } else if (_totalGasCost !== undefined) {
      setAmount(_sendAmount);
      setSendWarning("");
    } else {
      setAmount(_sendAmount);
      setSendWarning("⚠️ estimate of gas cost not available");
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
      const userBalance = hexToEther(balance);
      const totalGasCost = totalGasCalc(network.chainId, gasLimit, suggestedMaxFeePerGas, totalGasOP);
      // console.log("Total Gas Cost", totalGasCost);
      // console.log("userBalance", userBalance);
      calcAmount(userValueToken, userBalance, totalGasCost);
    }
  }, [displayValue, userValueToken, provider, max, suggestedMaxFeePerGas, totalGasOP, txSpeed]);

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
      if (network.chainId === 1 || network.chainId === 137 || network.chainId === 11155111) {
        getSuggestedMaxFeePerGas(txSpeed);
        getGasLimitEstimated();
        setShowTxDetailsButton(true);
        setMaxButton(true);
        return;
      }
      if (network.chainId === 10 || network.chainId === 8453) {
        getSuggestedMaxFeePerGas(txSpeed);
        getGasLimitEstimated();
        getEstimateTotalGasCostOptimism();
        setShowTxDetailsButton(false);
        setMaxButton(true);
        return;
      }
    }
    setMaxButton(false);
    setSuggestedMaxFeePerGas(undefined);
    setShowTxDetailsButton(false);
  }, [providerFull, userValueToken, displayValue, max, txSpeed]);

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

  const nativeTokenName = network && network.nativeToken && network.nativeToken.name ? network.nativeToken.name : "ETH";

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
            marginTop: "-5px",
            width: "50px",
            height: "30px",
          }}
        />
      )}
      <Input
        placeholder={"amount in " + (dollarMode ? "USD" : nativeTokenName)}
        prefix={<Prefix dollarMode={dollarMode} />}
        value={displayValue}
        addonAfter={
          <AmountDollarSwitch
            nativeToken
            dollarMode={dollarMode}
            setDollarMode={setDollarMode}
            nativeTokenName={nativeTokenName}
          />
        }
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
