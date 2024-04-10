import React from "react";
// import { getSession, signOut } from "next-auth/react";
// import Moralis from "moralis";
import { useState } from "react";
import { Wallet, constants, Contract, utils } from "ethers";
import axios from "axios";
import { ERC20_ABI } from "./ERC20Abi";
// import { useSendTransaction } from "wagmi";
//
interface SwapProps {
  user: any;
  userProvider: any;
  //   balance: any;
}

export const Swap = ({ user, userProvider }: SwapProps) => {
  // const [fromToken] = useState("0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed"); // Degen Token
  // const [toToken, setToToken] = useState("0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"); //USDC ERC20 Contract
  // const [value, setValue] = useState("1000000000000000000");
  // const [valueExchanged, setValueExchanged] = useState("");
  // const [valueExchangedDecimals, setValueExchangedDecimals] = useState(1e18);
  // const [to, setTo] = useState("");
  // const [txData, setTxData] = useState("");

  // //   const { data, isLoading, isSuccess, sendTransaction } = useSendTransaction({
  // //     request: {
  // //       from: user.address,
  // //       to: String(to),
  // //       data: String(txData),
  // //       value: String(value),
  // //     },
  // //   });

  // function changeToToken(e: any) {
  //   setToToken(e.target.value);
  //   setValueExchanged("");
  // }

  // function changeValue(e: any) {
  //   setValue(String(e.target.value * 1e18));
  //   setValueExchanged("");
  // }

  // async function get1inchSwap() {
  //   const tx = await axios.get(
  //     `https://apiv5.paraswap.io/prices?srcToken=${fromToken}&srcDecimals=18&destToken=${toToken}&destDecimals=6&amount=100&side=SELL&network=8453`,
  //     //   `https://api.1inch.io/v4.0/137/swap?fromTokenAddress=${fromToken}&toTokenAddress=${toToken}&amount=${value}&fromAddress=${user}&slippage=5`,
  //   );
  //   console.log(tx.data);
  //   // setTo(tx.data.tx.to);
  //   // setTxData(tx.data.tx.data);
  //   // setValueExchangedDecimals(Number(`1E${tx.data.toToken.decimals}`));
  //   // setValueExchanged(tx.data.toTokenAmount);
  // }

  const storedData = localStorage;

  const API_URL = "https://li.quest/v1";

  const fromChain = "137";
  const fromToken = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
  const toChain = "137";
  const toToken = "BUSD";
  const fromAmount = "10000000";
  const fromAddress = user;
  const chainTypes = "EVM";
  // const wallet = userProvider.getSigner();
  const [quote, setQuote] = useState();

  const walletPrivateKey = new Wallet(localStorage.metaPrivateKey);
  const walletConnected = walletPrivateKey.connect(userProvider);

  // const getConnections = async (
  //   fromChain: string,
  //   toChain: string,
  //   fromToken: string,
  //   toToken: string,
  //   chainTypes: any,
  // ) => {
  //   const result = await axios.get("https://li.quest/v1/connections", {
  //     params: {
  //       fromChain,
  //       toChain,
  //       fromToken,
  //       toToken,
  //       chainTypes,
  //     },
  //   });
  //   return result.data;
  // };

  const getQuote = async (
    fromChain: string,
    toChain: string,
    fromToken: string,
    toToken: string,
    fromAmount: string,
    fromAddress: string,
  ) => {
    console.log("in Quote");
    const result = await axios.get(`${API_URL}/quote`, {
      params: {
        fromChain,
        toChain,
        fromToken,
        toToken,
        fromAmount,
        fromAddress,
      },
    });
    console.log("in Quote!!!");
    return result.data;
  };

  const getStatus = async (bridge: any, fromChain: any, toChain: any, txHash: any) => {
    const result = await axios.get(`${API_URL}/status`, {
      params: {
        bridge,
        fromChain,
        toChain,
        txHash,
      },
    });
    return result.data;
  };

  // Get the current allowance and update it if needed
  const checkAndSetAllowance = async (wallet: any, tokenAddress: string, approvalAddress: string, amount: any) => {
    // Transactions with the native token don't need approval
    if (tokenAddress === constants.AddressZero) {
      return;
    }
    const erc20 = new Contract(tokenAddress, ERC20_ABI, wallet);
    const allowance = await erc20.allowance(await wallet.getAddress(), approvalAddress);
    console.log("Allowance for swap", allowance);
    if (allowance.lt(amount)) {
      try {
        const approveTx = await erc20.approve(approvalAddress, amount);
        console.log(`Transaction Hash: ${approveTx.hash}`);

        // Wait for the transaction to be mined
        const receipt = await approveTx.wait();
        console.log(`Transaction was mined in block ${receipt.blockNumber}`);
      } catch (error) {
        console.error(`Error in approving tokens: ${error}`);
      }
      const txOptions = {
        // Base fee per gas + priority fee per gas
        maxPriorityFeePerGas: utils.parseUnits("10", "gwei"), // Tip for the miner
        maxFeePerGas: utils.parseUnits("100", "gwei"), // Max total fee per gas
      };
      const approveTx = await erc20.approve(approvalAddress, amount, txOptions);
      // console.log(approveTx);
      // await approveTx.wait();
    }
  };

  const run = async () => {
    console.log("get Quote");
    const quote = await getQuote(fromChain, toChain, fromToken, toToken, fromAmount, fromAddress);
    // const connections = await getConnections(fromChain, toChain, fromToken, toToken, chainTypes);
    setQuote(quote);
    console.log("Quote set");
    await checkAndSetAllowance(
      walletConnected,
      quote.action.fromToken.address,
      quote.estimate.approvalAddress,
      fromAmount,
    );
    // return connections;
    // console.log(quote);
    // const tx = await walletConnected.sendTransaction(quote.transactionRequest);
    // console.log(tx);

    // await tx.wait();

    // /// Only needed for cross chain transfers
    // if (fromChain !== toChain) {
    //   let result;
    //   do {
    //     result = await getStatus(quote.tool, fromChain, toChain, tx.hash);
    //   } while (result.status !== "DONE" && result.status !== "FAILED");
    // }
  };

  return (
    <div>
      <div>User: {user}</div>
      {/* <div>Your Matic Balance: {(balance.balance / 1e18).toFixed(3)}</div> */}
      {/* <select>
        <option value="0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE">MATIC</option>
      </select> */}
      {/* <input
        onChange={e => changeValue(e)}
        value={Number(value) / 1e18}
        type="number"
        min={0}
        // max={balance.balance / 1e18}
      ></input> */}
      <br />
      <br />
      {/* <select name="toToken" value={toToken} onChange={e => changeToToken(e)}>
        <option value="0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619">WETH</option>
        <option value="0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174">USDC</option>
      </select> */}
      {/* <input
        value={!valueExchanged ? "" : (Number(valueExchanged) / valueExchangedDecimals).toFixed(5)}
        disabled={true}
      ></input> */}
      <br />
      <br />
      <button onClick={() => run()}>Click</button>
      <button onClick={() => console.log(walletConnected)}>Quote</button>
      <button onClick={() => console.log(walletPrivateKey)}>Signer</button>
      {/* <button
        disabled={!valueExchanged}
        onClick={
          // sendTransaction
          () => console.log("Swap")
        }
      >
        Swap Tokens
      </button> */}
      {/* {isLoading && <div>Check Wallet</div>} */}
      {/* {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>} */}
      <br />
      <br />
      {/* <button onClick={() => signOut({ redirect: "/signin" })}>Sign out</button> */}
    </div>
  );
};

// export async function getServerSideProps(context: any) {
//   const session = await getSession(context);

//   if (!session) {
//     return {
//       redirect: {
//         destination: "/signin",
//         permanent: false,
//       },
//     };
//   }

//     await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

//     const response = await Moralis.EvmApi.account.getNativeBalance({
//       address: session.user.address,
//       chain: 0x89,
//     });

//     return {
//       props: { user: session.user, balance: response.raw },
//     };
// }
