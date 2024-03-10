const { ethers, BigNumber, utils } = require("ethers");

export const getNativeTokenBalance = async (provider, address) => {
  const balanceBigNumber = await provider.getBalance(address);
  return balanceBigNumber;
};
export const sendTokenTransaction = async ({
  selectedChainId,
  selectedErc20Token,
  amount,
  toAddress,
  gasPrice,
  suggestedMaxFeePerGas,
  tx,
}) => {
  let txConfig = {
    chainId: selectedChainId,
  };
  console.log("tx", tx);
  console.log("Amount from sendTokenTransaction", amount);

  if (!selectedErc20Token) {
    let value;
    try {
      console.log("PARSE ETHER", amount);
      value = utils.parseEther("" + amount);
      console.log("PARSEDVALUE", value);
    } catch (e) {
      const floatVal = parseFloat(amount).toFixed(8);

      console.log("floatVal", floatVal);
      // failed to parseEther, try something else
      value = utils.parseEther("" + floatVal);
      console.log("PARSEDfloatVALUE", value);
    }

    txConfig.to = toAddress;
    txConfig.value = value;
  } else {
    txConfig.erc20 = {
      token: selectedErc20Token,
      to: toAddress,
      amount,
    };
  }

  txConfig.gasPrice = ethers.utils.parseUnits(suggestedMaxFeePerGas, "gwei");
  console.log("suggestedMaxFeePerGas form Send Transaction", ethers.utils.parseUnits(suggestedMaxFeePerGas, "gwei"));
  console.log("gasPrice", gasPrice);
  txConfig.gasLimit = ethers.utils.hexlify(55000);

  // ethers.utils.parseUnits(suggestedMaxFeePerGas, "gwei");

  // console.log("SEND AND NETWORK", targetNetwork);

  // console.log("FunctionTransactor", tx);

  let result = tx(txConfig);
  result = await result;
  console.log(result);
};

export const getGasLimit = async () => {
  // const stringAmount = amount.toString();
  // const fixedAmount = parseFloat(stringAmount).toFixed(18);
  // const tx = {
  //   to: "0xD042799bADfc032db4860b7Ee0fc28371332eBc2",
  //   // value: utils.parseEther(fixedAmount),
  //   value: utils.parseEther("0.01"),
  // };
  // const estimatedGasLimit = await provider.estimateGas(tx);
  const estimatedGasLimit = ethers.utils.hexlify(55000);
  return estimatedGasLimit;
};
// export const hexToString = hex => {
//   // Convert hex to BigNumber
//   const bigNumberValue = ethers.BigNumber.from(hex);
//   // Convert BigNumber to string
//   const stringValue = bigNumberValue.toString();
//   // Convert String to Ether Format
//   const etherFormat = utils.formatEther(stringValue);
//   return etherFormat;
// };

export const hexToEther = hex => {
  // Convert hex to BigNumber
  const bigNumberValue = ethers.BigNumber.from(hex);
  // Convert BigNumber to string
  const stringValue = bigNumberValue.toString();
  // Convert String to Ether Format
  const etherFormat = utils.formatEther(stringValue);
  return etherFormat;
};

export const hexToString = hex => {
  // Convert hex to BigNumber
  const bigNumberValue = ethers.BigNumber.from(hex);
  // Convert BigNumber to string
  const stringValue = bigNumberValue.toString();
  return stringValue;
};

export const calcGasCostInEther = (gasLimit, gasPrice) => {
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

// export const calcAmount = (userValueNumber, dollarMode, price) => {
//   console.log("in here", userValueNumber, dollarMode, price);
//   if (!dollarMode) {
//     return userValueNumber;
//   }

//   return userValueNumber * price;
// };
