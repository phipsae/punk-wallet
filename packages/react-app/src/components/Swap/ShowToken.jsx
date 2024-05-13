import React from "react";

export const ShowToken = ({ selectedItem, setShowTokenModal, from }) => {
  const openTokenModal = () => {
    console.log("click");
    setShowTokenModal(true);
  };

  return (
    <>
      <button type="button" className="btn btn-light" onClick={openTokenModal}>
        <div style={{ width: "150px" }}>
          <div style={{ textAlign: "left", fontWeight: "bold" }}> {from ? "From" : "To"} </div>
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
    </>
  );
};
