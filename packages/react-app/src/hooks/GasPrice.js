import axios from "axios";
import { usePoller } from "eth-hooks";
import { useEffect, useState } from "react";
import { ethers, utils } from "ethers";
import { ETHERSCAN_KEY } from "../constants";
import "dotenv/config";
import { estimateTotalGasCost, estimateL1GasCost } from "@eth-optimism/sdk";
import { calcGasCostInEther } from "../helpers/NativeTokenHelper";

require("dotenv").config();

export default function useGasPrice(targetNetwork, speed, providerToAsk) {
  const [gasPrice, setGasPrice] = useState();

  const loadGasPrice = async () => {
    if (targetNetwork.gasPrice) {
      console.log("TargetNetwork Gasprice", targetNetwork.gasPrice);
      setGasPrice(targetNetwork.gasPrice);
    } else {
      if (providerToAsk) {
        try {
          /// ethers.js gasEstimate here
          const gasPriceResult = await providerToAsk.getGasPrice();
          if (gasPriceResult) setGasPrice(gasPriceResult);
        } catch (e) {
          console.log("error getting gas", e);
        }
      } else {
        axios
          .get("https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=" + ETHERSCAN_KEY)
          .then(response => {
            const newGasPrice = ethers.utils.parseUnits(response.data.result["ProposeGasPrice"], "gwei");
            if (newGasPrice !== gasPrice) {
              setGasPrice(newGasPrice);
            }
          })
          .catch(error => console.log(error));
      }
    }
  };

  useEffect(() => {
    setGasPrice();
    loadGasPrice();
  }, [targetNetwork]);

  usePoller(loadGasPrice, 4200);
  return gasPrice;
}

const Auth = Buffer.from(
  process.env.REACT_APP_INFURA_API_KEY + ":" + process.env.REACT_APP_INFURA_API_KEY_SECRET,
).toString("base64");

/// speed can be low, medium, high
export const getGasPriceInfura = async (provider, speed) => {
  try {
    const chainId = provider._network.chainId;
    const { data } = await axios.get(`https://gas.api.infura.io/networks/${chainId}/suggestedGasFees`, {
      headers: { Authorization: `Basic ${Auth}` },
    });
    console.log("Suggested gas fees from getGasPriceInfura function from GasPrice.js:", data);
    return data[speed];
  } catch (error) {
    console.log("Server responded with:", error);
    return error;
  }
};

const tx = {
  to: "0xD042799bADfc032db4860b7Ee0fc28371332eBc2",
  value: utils.parseEther("0.01"),
  data: "0x",
  // value: "0.00001",
  type: 2,
  // maxFeePerGas: 2e9,
};

/// https://sdk.optimism.io/
export const estimateTotalGasCostOptimism = async provider => {
  return estimateTotalGasCost(provider, tx);
};

const totalGasCost = async (_gasPrice, _gasLimit, _totalGasOP, _chainId) => {
  let gasCost;
  /// mainnet, polygon, sepolia
  if (_chainId === 1 || _chainId === 137 || _chainId === 11155111) {
    gasCost = calcGasCostInEther(_gasLimit, _gasPrice);
  }
  /// optimism, base
  else if (_chainId === 10 || _chainId === 8453) {
    gasCost = _totalGasOP;
    console.log("OP", gasCost);
  }
  /// all the other networks w/o gasEstimate
  else {
    console.log("not able to estimate gas cost");
  }
  return gasCost;
};
