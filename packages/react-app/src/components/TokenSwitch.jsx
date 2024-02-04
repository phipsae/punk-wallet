import React from "react";
import TokenDisplay from "./TokenDisplay";

// toggle functionality for switching between ERC20 token and USD
export const TokenSwitch = ({
  token,
  price,
  setDisplay,
  display,
  dollarMode,
  setDollarMode,
  value,
  setValue,
}) => {
  const toggleUSDERC20 = () => {
    if (dollarMode) {
      if (display) {
        setValue(value / price);
        setDisplay((value / price).toFixed(4));
      }
      setDollarMode(false);
    } else {
      if (display) {
        setValue(value * price);
        setDisplay((value * price).toFixed(2));
      }
      setDollarMode(true);
    }
  };

  return (
    <div
      onClick={() => {
        if (price !== 0) {
          toggleUSDERC20();
        } else {
          console.log("price not available");
        }
      }}
    >
      <Switch dollarMode={dollarMode} token={token}/>
    </div>
  );
};

const Switch = ({ dollarMode, token }) => {
  return dollarMode ? (
      <>💵 USD 🔀</>
    ) : (
      <>
        <TokenDisplay
          token={token}
          spanStyle={{ paddingLeft: "0.2em" }}
          optionalEnding="🔀"
        />
      </>
    );
};