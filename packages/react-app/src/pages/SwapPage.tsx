import React from "react";
// import { useAppContext } from "../contexts/AppContext";

interface SwapPageProps {
  targetNetwork: any;
}

function SwapPage({ targetNetwork }: SwapPageProps) {
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
