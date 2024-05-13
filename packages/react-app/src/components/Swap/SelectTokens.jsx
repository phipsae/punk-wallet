import React, { useEffect, useState } from "react";
import { ArrowRightOutlined, BackwardOutlined } from "@ant-design/icons";
import { TokenBalance } from "./TokenBalance";
import { ShowToken } from "./ShowToken";

export const SelectTokens = ({
  targetNetwork,
  address,
  fromToken,
  setFromToken,
  toToken,
  setToToken,
  setShowTokenModal,
  showTokenModal,
}) => {
  /// myTokens: I mean that in the tokenbalance only tokens with a balance are shown
  const [showMyTokens, setShowMyTokens] = useState(true);

  const switchTokens = () => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
  };

  const closeTokenModal = () => {
    setShowTokenModal(false);
  };

  useEffect(() => {
    closeTokenModal();
  }, [toToken, fromToken]);

  return (
    <>
      {!showTokenModal ? (
        <div className="d-flex" style={{ justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <div onClick={() => setShowMyTokens(true)}>
            <ShowToken from selectedItem={fromToken} setShowTokenModal={setShowTokenModal} />
          </div>
          <button
            type="button"
            onClick={() => switchTokens()}
            style={{
              width: "40px",
              height: "40px",
              lineHeight: "40px",
              borderRadius: "50%",
              backgroundColor: "#808080",
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "none",
              cursor: "pointer",
            }}
          >
            <ArrowRightOutlined />
          </button>
          <div onClick={() => setShowMyTokens(false)}>
            <ShowToken from={false} selectedItem={toToken} setShowTokenModal={setShowTokenModal} />
          </div>
        </div>
      ) : (
        <div className="d-flex">
          <div className="col">
            <button
              type="button"
              className="btn btn-light"
              onClick={closeTokenModal}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BackwardOutlined style={{ marginRight: "5px", marginTop: "3px", fontSize: "24px" }} /> Back
            </button>
            <div
              style={{
                marginTop: "3px",
                marginBottom: "10px",
                fontSize: "24px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {showMyTokens ? "Select From Token" : "Select To Token"}
            </div>
            <TokenBalance
              targetNetwork={targetNetwork}
              address={address}
              showMyTokens={showMyTokens}
              setSelectedItem={showMyTokens ? setFromToken : setToToken}
              // excludeToken={fromToken || null}
            />
          </div>
        </div>
      )}
    </>
  );
};
