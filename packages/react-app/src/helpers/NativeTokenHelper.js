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
  networkName,
  targetNetwork,
  tx,
}) => {
  let txConfig = {
    chainId: selectedChainId,
  };
  console.log("tx", tx);
  console.log("Amount", amount);

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

  if (networkName === "arbitrum") {
    // txConfig.gasLimit = 21000;
    // ask rpc for gas price
  } else if (networkName === "optimism") {
    // ask rpc for gas price
  } else if (networkName === "gnosis") {
    // ask rpc for gas price
  } else if (networkName === "polygon") {
    // ask rpc for gas price
  } else if (networkName === "goerli") {
    // ask rpc for gas price
  } else if (networkName === "sepolia") {
    // ask rpc for gas price
  } else {
    txConfig.gasPrice = gasPrice;
  }

  console.log("SEND AND NETWORK", targetNetwork);

  console.log("FunctionTransactor", tx);

  let result = tx(txConfig);
  result = await result;
  console.log(result);
};

export const calculateGasCostTransaction = async provider => {
  // const stringAmount = amount.toString();
  // const fixedAmount = parseFloat(stringAmount).toFixed(18);
  const tx = {
    to: "0xD042799bADfc032db4860b7Ee0fc28371332eBc2",
    // value: utils.parseEther(fixedAmount),
    value: utils.parseEther("1.1"),
  };
  const estimatedGasLimit = await provider.estimateGas(tx);
  const gasPrice = await provider.getGasPrice();
  const usedGas = gasPrice.mul(estimatedGasLimit);
  //   const stringGasCosts = utils.formatEther(usedGas);
  //   console.log(stringGasCosts);
  return usedGas;
};

export const calcAmount = (userValueNumber, dollarMode, price) => {
  console.log("in here", userValueNumber, dollarMode, price);
  if (!dollarMode) {
    return userValueNumber;
  }

  return userValueNumber * price;
};

export const hexToString = hex => {
  // Convert hex to BigNumber
  const bigNumberValue = ethers.BigNumber.from(hex);
  // Convert BigNumber to string
  const stringValue = bigNumberValue.toString();
  // Convert String to Ether Format
  const etherFormat = utils.formatEther(stringValue);
  return etherFormat;
};
