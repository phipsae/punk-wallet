import axios from "axios";
import { usePoller } from "eth-hooks";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { ETHERSCAN_KEY } from "../constants";
import "dotenv/config";

require("dotenv").config();

export default function useGasPrice(targetNetwork, speed, providerToAsk) {
  const [gasPrice, setGasPrice] = useState();

  const loadGasPrice = async () => {
    if (targetNetwork.gasPrice) {
      // console.log("TargetNetwork Gasprice", targetNetwork.gasPrice);
      // setGasPrice(targetNetwork.gasPrice);
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
    console.log("Suggested gas fees from getGasPriceInfura function:", data);
    return data[speed];
  } catch (error) {
    console.log("Server responded with:", error);
    return error;
  }
};
