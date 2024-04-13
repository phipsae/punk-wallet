import React from "react";
import axios from "axios";

import { Contract, ethers } from "ethers";
import { ERC20_ABI } from "./ERC_ABI";

export const Swap = ({ userProvider, targetNetwork }) => {
  const API_URL = "https://li.quest/v1";
  const wallet = userProvider.getSigner();

  const getQuote = async (_fromChain, _toChain, _fromToken, _toToken, _fromAmount, _fromAddress) => {
    try {
      const result = await axios.get(`${API_URL}/quote`, {
        params: {
          fromChain: _fromChain,
          toChain: _toChain,
          fromToken: _fromToken,
          toToken: _toToken,
          fromAmount: _fromAmount,
          fromAddress: _fromAddress,
        },
      });
      return result.data;
    } catch (error) {
      console.error(error.response.data.message);
      return null;
    }
  };

  const checkAndSetAllowance = async (_wallet, _tokenAddress, _approvalAddress, _amount) => {
    // Transactions with the native token don't need approval
    console.log("here");
    console.log(_tokenAddress, ethers.constants.AddressZero);
    if (_tokenAddress === ethers.constants.AddressZero) {
      return;
    }

    const erc20 = new Contract(_tokenAddress, ERC20_ABI, _wallet);
    const allowance = await erc20.allowance(await _wallet.getAddress(), _approvalAddress);

    console.log(allowance);
    console.log(erc20);

    if (allowance.lt(_amount)) {
      const approveTx = await erc20.approve(_approvalAddress, _amount);
      await approveTx.wait();
      console.log(approveTx);
    }
  };

  const fromChain = "ARB";
  const fromToken = "ETH";
  const toChain = "ARB";
  const toToken = "ARB";
  const fromAmount = "1100000";
  const fromAddress = "0x0D2c2935569E2A213c82262A789Fc0Ccc59a4D3C";

  // Set up your wallet

  const run = async () => {
    // const tx = await wallet.sendTransaction({
    //   to: "0x059E31Ea8A88b62FE1603CCE134eF7c1cC557395",
    //   value: ethers.utils.parseUnits("0.001", "ether"),
    //   chainId: targetNetwork.chainId,
    // });
    // console.log(tx);
    // console.log(wallet);
    // console.log(targetNetwork.chainId);

    const quote = await getQuote(fromChain, toChain, fromToken, toToken, fromAmount, fromAddress);
    console.log(quote);
    await checkAndSetAllowance(
      wallet,
      quote.action.fromToken.address,
      quote.estimate.approvalAddress,
      quote.action.fromAmount,
    );

    // // const tx = await wallet.sendTransaction(quote.transactionRequest);
    // console.log(quote);
    // // await tx.wait();
    // if (fromChain !== toChain) {
    //   let result;
    //   do {
    //     // result = await getStatus(quote.tool, fromChain, toChain, tx.hash);
    //   } while (result.status !== "DONE" && result.status !== "FAILED");
    // }
  };

  return (
    <div>
      <h1>Swap</h1>
      <button type="button" onClick={run}>
        Click Me to run
      </button>
    </div>
  );
};
