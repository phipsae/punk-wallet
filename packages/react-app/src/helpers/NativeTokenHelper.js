const { ethers, utils } = require("ethers");

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
  tx,
}) => {
  const txConfig = {
    chainId: selectedChainId,
  };

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

  // txConfig.gasPrice = ethers.utils.parseUnits(suggestedMaxFeePerGas, "gwei");
  txConfig.gasPrice = gasPrice;
  // console.log("suggestedMaxFeePerGas form Send Transaction", ethers.utils.parseUnits(suggestedMaxFeePerGas, "gwei"));
  console.log("gasPrice", gasPrice);
  txConfig.gasLimit = ethers.utils.hexlify(21000);

  // console.log("SEND AND NETWORK", targetNetwork);

  // console.log("FunctionTransactor", tx);

  console.log("Value for tx in Amount", txConfig);

  let result = tx(txConfig);
  result = await result;
  console.log(result);
};

// export const getGasLimit = async provider => {
//   // const fixedAmount = parseFloat(stringAmount).toFixed(18);
//   const tx = {
//     to: "0xD042799bADfc032db4860b7Ee0fc28371332eBc2",
//     // value: utils.parseEther(fixedAmount),
//     value: utils.parseEther("0.01"),
//   };
//   const estimatedGasLimit = await provider.estimateGas(tx);
//   return estimatedGasLimit;
// };

export const hexToEther = hex => {
  // Convert hex to BigNumber
  console.log("HEX", hex);
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

export const formatNumberWithDecimals = (number, decimalPlaces) => {
  return Number(number).toFixed(decimalPlaces);
};

export const formatDisplayValue = (value, dollarMode) => {
  return dollarMode ? formatNumberWithDecimals(value, 2) : formatNumberWithDecimals(value, 4);
};
