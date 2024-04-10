import React from "react";
import { Swap } from "../components/Swap/Swap";
// import { useAppContext } from "../contexts/AppContext";

interface SwapPageProps {
  targetNetwork: any;
  user: string;
  userProvider: any;
}

function SwapPage({ targetNetwork, user, userProvider }: SwapPageProps) {
  // const { web3ModalInstance, localProviderContext, userAddress } = useAppContext();
  return (
    <div>
      <h1>Here you can swap soon</h1>
      {/* <button
        type="button"
        onClick={() => {
          console.log(user);
        }}
      >
        {" "}
        Click Me from SwapPage
      </button> */}
      <Swap user={user} userProvider={userProvider} />
    </div>
  );
}

export default SwapPage;
