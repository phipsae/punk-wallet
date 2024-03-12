import axios from "axios";
import { usePoller } from "eth-hooks";
import { useEffect, useState } from "react";
import { ethers, utils } from "ethers";
// import { estimateTotalGasCost, estimateL1GasCost } from "@eth-optimism/sdk";
import { estimateTotalGasCost } from "@eth-optimism/sdk";
import { ETHERSCAN_KEY } from "../constants";
import "dotenv/config";
import { hexToEther } from "../helpers/NativeTokenHelper";

require("dotenv").config();

const Auth = Buffer.from(
  process.env.REACT_APP_INFURA_API_KEY + ":" + process.env.REACT_APP_INFURA_API_KEY_SECRET,
).toString("base64");

export const useGasPrice = (targetNetwork, speed, providerToAsk) => {
  const [gasPrice, setGasPrice] = useState();

  const loadGasPrice = async () => {
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
          const newGasPrice = ethers.utils.parseUnits(response.data.result.ProposeGasPrice, "gwei");
          if (newGasPrice !== gasPrice) {
            setGasPrice(newGasPrice);
          }
        })
        .catch(error => console.log(error));
    }
  };

  useEffect(() => {
    setGasPrice();
    loadGasPrice();
  }, [targetNetwork]);

  usePoller(loadGasPrice, 4200);
  return gasPrice;
};

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

const txL2 = {
  to: "0xD042799bADfc032db4860b7Ee0fc28371332eBc2",
  value: utils.parseEther("0.01"),
  data: "0x",
  // value: "0.00001",
  type: 2,
  // maxFeePerGas: 2e9,
};

/// https://sdk.optimism.io/
export const estimateTotalGasCostOptimism = async provider => {
  return estimateTotalGasCost(provider, txL2);
};

export const getGasLimit = async provider => {
  // const fixedAmount = parseFloat(stringAmount).toFixed(18);
  const tx = {
    to: "0xD042799bADfc032db4860b7Ee0fc28371332eBc2",
    // value: utils.parseEther(fixedAmount),
    value: utils.parseEther("0.01"),
  };
  const estimatedGasLimit = await provider.estimateGas(tx);
  return estimatedGasLimit;
};

const calcGasCostInEther = (gasLimit, gasPrice) => {
  // Convert hex to BigNumber
  const bigNumberValue = ethers.BigNumber.from(gasLimit);
  // Convert BigNumber to string
  const txGasLimit = bigNumberValue.toString();

  const gasPriceInWei = ethers.utils.parseUnits(gasPrice, "gwei");
  console.log(gasPriceInWei, "gasPriceInWei");
  console.log(txGasLimit, "txGasLimit");

  const gasPriceInEther = hexToEther(gasPriceInWei);
  console.log("GasCost in Ether", Number(gasPriceInEther) * Number(txGasLimit));
  const gasCost = Number(gasPriceInEther) * Number(txGasLimit);
  return gasCost;
};

export const totalGasCalc = (_networkId, _gasLimit, _suggestedMaxFeePerGas, _totalGasOp) => {
  let totalGasCost;
  if (_gasLimit && _suggestedMaxFeePerGas && (_networkId === 1 || _networkId === 137 || _networkId === 11155111)) {
    /// an additional 1% for the gas cost to make sure it not overshoots
    totalGasCost = calcGasCostInEther(_gasLimit, _suggestedMaxFeePerGas) * 1.01;
    console.log("ETHEREUM totalGasCost", totalGasCost);
  }
  /// optimism, base
  else if (_totalGasOp && (_networkId === 10 || _networkId === 8453)) {
    totalGasCost = hexToEther(_totalGasOp);
    console.log("OP totalGasCost", totalGasCost);
  }
  /// all the other networks w/o gasEstimate
  else {
    console.log("gas calculation not possible");
  }
  return totalGasCost;
};

// export const useGasPrice = (targetNetwork, speed, providerToAsk) => {
//   const [gasPrice, setGasPrice] = useState();

//   const loadGasPrice = async () => {
//     if (providerToAsk) {
//       try {
//         const chainId = targetNetwork.chainId;
//         const { data } = await axios.get(`https://gas.api.infura.io/networks/${chainId}/suggestedGasFees`, {
//           headers: { Authorization: `Basic ${Auth}` },
//         });
//         // console.log("Suggested gas fees from getGasPriceInfura function from GasPrice.js:", data);
//         console.log("from gasCalc with  Infura", data[speed].suggestedMaxFeePerGas);
//         const gasPriceInHexInGwei = ethers.utils.hexlify(data[speed].suggestedMaxFeePerGas);
//         const gasPriceInHexInWei = ethers.utils.parseUnits(gasPriceInHexInGwei, "gwei");
//         setGasPrice(gasPriceInHexInWei);
//         setGasPrice();
//       } catch (error) {
//         console.log("Error fetching gas with infura:", error);
//         try {
//           /// ethers.js gasEstimate here as fallback if Infura key not available
//           console.log("Ethers.js gas");
//           const gasPriceResult = await providerToAsk.getGasPrice();
//           if (gasPriceResult) setGasPrice(gasPriceResult);
//         } catch (e) {
//           console.log("error getting gas", e);
//         }
//       }
//     } else {
//       axios
//         .get("https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=" + ETHERSCAN_KEY)
//         .then(response => {
//           const newGasPrice = ethers.utils.parseUnits(response.data.result.ProposeGasPrice, "gwei");
//           if (newGasPrice !== gasPrice) {
//             setGasPrice(newGasPrice);
//           }
//         })
//         .catch(error => console.log(error));
//     }
//     // }
//   };

//   useEffect(() => {
//     setGasPrice();
//     loadGasPrice();
//   }, [targetNetwork]);

//   usePoller(loadGasPrice, 4200);
//   return gasPrice;
// };
