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
          {showMyTokens ? (
            <div>
              From Token - {selectedItem && selectedItem.coinKey} - {selectedItem && selectedItem.amount}
            </div>
          ) : (
            <div>
              To Token - {selectedItem && selectedItem.coinKey} - {selectedItem && selectedItem.amount}
            </div>
          )}
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
