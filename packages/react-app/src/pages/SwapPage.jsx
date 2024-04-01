import React from "react";
import { useAppContext } from "../contexts/AppContext";

function SwapPage() {
  const { web3ModalInstance, localProviderContext, userAddress } = useAppContext();
  return (
    <div>
      <h1>Here you can swap</h1>
      <p>This is the info page of our application.</p>
      <button
        type="button"
        onClick={() => {
          console.log(localProviderContext);
        }}
      >
        {" "}
        Click Me
      </button>
    </div>
  );
}

export default SwapPage;
