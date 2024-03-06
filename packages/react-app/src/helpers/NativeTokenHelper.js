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
