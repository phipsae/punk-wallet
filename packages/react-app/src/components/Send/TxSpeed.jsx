import React from "react";

export const TxSpeed = ({ txSpeed, setTxSpeed }) => {
  return (
    <>
      <h1>Speed</h1>
      <div>{txSpeed}</div>
      <div style={{ display: "inline-block", border: "1px solid #ccc", padding: "10px" }}>
        <button type="button" style={{ borderRight: "1px solid #ccc", flexGrow: 1 }} onClick={() => setTxSpeed("low")}>
          Low
        </button>
        <button
          type="button"
          style={{ borderRight: "1px solid #ccc", flexGrow: 1 }}
          onClick={() => setTxSpeed("medium")}
        >
          Medium
        </button>
        <button type="button" style={{ borderRight: "1px solid #ccc", flexGrow: 1 }} onClick={() => setTxSpeed("high")}>
          High
        </button>
      </div>
    </>
  );
};
