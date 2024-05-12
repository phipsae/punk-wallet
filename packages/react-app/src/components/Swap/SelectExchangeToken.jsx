import React, { useEffect } from "react";
import { TokenBalance } from "./TokenBalance";

export const SelectExchangeToken = ({
  targetNetwork,
  address,
  showMyTokens,
  selectedItem,
  setSelectedItem,
  showTokenModal,
  setShowTokenModal,
  excludeToken,
}) => {
  const openTokenModal = () => {
    console.log("click");
    setShowTokenModal(true);
  };
  const closeTokenModal = () => {
    setShowTokenModal(false);
  };

  useEffect(() => {
    closeTokenModal();
  }, [selectedItem]);

  return (
    <>
      {!showTokenModal ? (
        <button type="button" className="btn btn-light" onClick={openTokenModal}>
          <div style={{ width: "150px" }}>
            <div style={{ textAlign: "left", fontWeight: "bold" }}> {showMyTokens ? "From" : "To"} </div>
            <div className="d-flex" style={{ alignItems: "center", marginTop: "10px" }}>
              <div>
                {selectedItem ? (
                  <img
                    src={selectedItem.logoURI}
                    alt={selectedItem.coinKey || "n/a"}
                    style={{ width: "30px", height: "30px", marginRight: "10px" }}
                  />
                ) : (
                  <div
                    style={{
                      width: "30px",
                      height: "30px",
                      backgroundColor: "grey",
                      borderRadius: "50%",
                      marginRight: "10px",
                    }}
                  />
                )}
              </div>
              <div style={{ textAlign: "left", marginLeft: "10px" }}>
                <div>{selectedItem ? selectedItem.coinKey : "-"}</div>
                <div>{selectedItem ? Number(selectedItem.amount).toFixed(4) : "-"}</div>
              </div>
            </div>
          </div>
        </button>
      ) : (
        <div>
          <button type="button" className="btn btn-light" onClick={closeTokenModal}>
            Back
          </button>
          <TokenBalance
            targetNetwork={targetNetwork}
            address={address}
            showMyTokens={showMyTokens}
            setSelectedItem={setSelectedItem}
            excludeToken={excludeToken}
          />
        </div>
      )}
    </>
  );
};
