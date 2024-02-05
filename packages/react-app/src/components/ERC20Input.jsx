import React, { useState, useEffect } from "react";

import { Input } from "antd";

import AmountDollarSwitch from "./AmountDollarSwitch";
import TokenDisplay from "./TokenDisplay";

// ToDo: add check if enough balance is available, otherwise don't allow user to send
// ToDo: address check if valid

export default function ERC20Input({ token, balance, dollarMode, setDollarMode, price, setAmount }) {
  const [display, setDisplay] = useState();

  const [value, setValue] = useState();

  const amountCalculation = _value => {
    if (dollarMode) {
      const numericValue = parseFloat(_value);
      const amountToken = numericValue / price;
      setAmount(amountToken);
    } else {
      setAmount(_value);
    }
  };
  // for tokenswitch so that switch to usd can be disabled
  if (price === 0 && !dollarMode) {
    setDollarMode(false);
  }

  return (
    <div>
      <span
        style={{ cursor: "pointer", color: "red", float: "right", marginTop: "-5px" }}
        onClick={() => {
          setAmount(balance);
          amountCalculation(balance);
        }}
      >
        max
      </span>
      <Input
        value={display}
        placeholder={"amount in " + (dollarMode ? "USD" : token.name)}
        prefix={<Prefix dollarMode={dollarMode} token={token} />}
        addonAfter={
          <AmountDollarSwitch
            token={token}
            dollarMode={dollarMode}
            setDollarMode={setDollarMode}
          />
        }
        onChange={async e => {
          amountCalculation(e.target.value);
          setValue(e.target.value);
          setDisplay(e.target.value);
        }}
      />
    </div>
  );
}

const Prefix = ({ dollarMode, token }) => {
  if (dollarMode) {
    return "$";
  }

  return <TokenDisplay token={token} showName={false} />;
};
