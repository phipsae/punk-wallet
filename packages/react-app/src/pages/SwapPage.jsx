import React from "react";
// import { useAppContext } from "../contexts/AppContext";

function SwapPage({ targetNetwork }) {
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
    </div>
  );
}

export default SwapPage;
