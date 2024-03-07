import React from "react";
import TokenDisplay from "./TokenDisplay";

// toggle functionality for switching between ERC20 token and USD
export default function AmountDollarSwitch({ token = null, dollarMode, setDollarMode, nativeToken = false }) {
  return (
    <div
      onClick={() => {
        setDollarMode(!dollarMode);
      }}
    >
      {!nativeToken ? <Switch dollarMode={dollarMode} token={token} /> : <SwitchNative dollarMode={dollarMode} />}
    </div>
  );
}

const Switch = ({ dollarMode, token }) => {
  return dollarMode ? (
    <>💵 USD 🔀</>
  ) : (
    <>
      <TokenDisplay token={token} spanStyle={{ paddingLeft: "0.2em" }} optionalEnding="🔀" />
    </>
  );
};

const SwitchNative = ({ dollarMode }) => {
  return dollarMode ? (
    <>💵 USD 🔀</>
  ) : (
    <>
      {/* <TokenDisplay spanStyle={{ paddingLeft: "0.2em" }} optionalEnding="🔀" nativeToken /> */}
      <span>Ξ ETH 🔀</span>
    </>
  );
};
