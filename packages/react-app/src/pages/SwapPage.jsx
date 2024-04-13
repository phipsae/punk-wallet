import React from "react";
import { Swap } from "../components/Swap/Swap";
// import { useAppContext } from "../contexts/AppContext";

function SwapPage({ targetNetwork, userProvider }) {
  // const { web3ModalInstance, localProviderContext, userAddress } = useAppContext();
  return (
    <div>
      <h1>Here you can swap soon</h1>
      <button
        type="button"
        onClick={() => {
          console.log(targetNetwork);
        }}
      >
        {" "}
        Click Me
      </button>
      <Swap userProvider={userProvider} targetNetwork={targetNetwork} />
    </div>
  );
}

export default SwapPage;
