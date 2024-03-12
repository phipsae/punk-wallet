import React from "react";
import TokenDisplay from "./TokenDisplay";

// toggle functionality for switching between ERC20 token and USD
export default function AmountDollarSwitch({
  token = null,
  dollarMode,
  setDollarMode,
  nativeToken = false,
  nativeTokenName,
}) {
  return (
    <div
      onClick={() => {
        setDollarMode(!dollarMode);
      }}
    >
      {!nativeToken ? (
        <Switch dollarMode={dollarMode} token={token} />
      ) : (
        <SwitchNative dollarMode={dollarMode} nativeTokenName={nativeTokenName} />
      )}
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

const SwitchNative = ({ dollarMode, nativeTokenName }) => {
  return dollarMode ? (
    <>💵 USD 🔀</>
  ) : (
    <>
      <span>
        Ξ {nativeTokenName} {!nativeTokenName && "ETH"} 🔀
      </span>
    </>
  );
};
