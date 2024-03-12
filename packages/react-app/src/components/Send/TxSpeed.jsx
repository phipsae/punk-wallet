import React, { useState } from "react";
import { calcGasCostInEther } from "../../hooks/GasPrice";

export const TxSpeed = ({ txSpeed, setTxSpeed, gasLimit, suggestedMaxFeePerGas, price, targetNetwork }) => {
  const [selectedSpeed, setSelectedSpeed] = useState(txSpeed);
  let txFee;
  if (suggestedMaxFeePerGas) {
    txFee = calcGasCostInEther(gasLimit, suggestedMaxFeePerGas);
  }

  // Function to handle speed selection
  const handleSpeedSelection = speed => {
    setTxSpeed(speed);
    setSelectedSpeed(speed);
  };

  // Function to determine button style
  const getButtonStyle = speed => ({
    flex: 1,
    fontSize: "12px",
    marginRight: speed === "high" ? "0" : "5px", // Remove marginRight for the last button
    border: "none",
    padding: "8px 16px",
    cursor: "pointer",
    backgroundColor: selectedSpeed === speed ? "#d4d4d4" : "#e7e7e7", // Change background if selected
    borderRadius: "5px",
  });

  const nativeTokenName =
    targetNetwork && targetNetwork.nativeToken && targetNetwork.nativeToken.name
      ? targetNetwork.nativeToken.name
      : "ETH";

  return (
    <>
      <div
        style={{
          display: "block",
          border: "1px solid #ccc",
          borderRadius: "5px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          backgroundColor: "#f9f9f9",
          padding: "10px",
          textAlign: "center",
        }}
      >
        <h4>Determine transaction speed</h4>
        <div style={{ marginBottom: "10px", display: "flex" }}>
          <button type="button" style={getButtonStyle("low")} onClick={() => handleSpeedSelection("low")}>
            🐢 Low
          </button>
          <button type="button" style={getButtonStyle("medium")} onClick={() => handleSpeedSelection("medium")}>
            🚙 Medium
          </button>
          <button type="button" style={getButtonStyle("high")} onClick={() => handleSpeedSelection("high")}>
            🏎️ High
          </button>
        </div>

        {suggestedMaxFeePerGas && (
          <div
            style={{
              fontSize: "12px",
              padding: "8px",
              borderRadius: "5px",
            }}
          >
            Estimated fees: {txFee.toFixed(4)} {nativeTokenName} ($ {(txFee * price).toFixed(2)})
          </div>
        )}
      </div>
    </>
  );
};
