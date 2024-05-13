import React from "react";

export const TokenTable = ({ items, loading, message, setSelectedItem }) => {
  const handleRowClick = item => {
    setSelectedItem(prevItem => {
      console.log("Previous Item:", prevItem); // Debugging the previous state
      console.log("Current Clicked Item:", item); // Debugging the clicked item
      return prevItem === item ? null : item;
    });
  };

  return (
    <>
      <div className="table-responsive sticky-header">
        <table
          className="table"
          style={{ borderBottom: "2px solid #dee2e6", borderLeft: "none", borderRight: "none", borderTop: "none" }}
        >
          <thead>
            <tr className="">
              <th
                className="col-4 text-start"
                style={{
                  borderBottom: "2px solid #dee2e6",
                  borderLeft: "none",
                  borderRight: "none",
                  borderTop: "none",
                }}
              >
                Asset
              </th>
              <th
                className="col-2-6 text-end"
                style={{
                  borderBottom: "2px solid #dee2e6",
                  borderLeft: "none",
                  borderRight: "none",
                  borderTop: "none",
                }}
              >
                Price
              </th>
              <th
                className="col-2-6 text-end"
                style={{
                  borderBottom: "2px solid #dee2e6",
                  borderLeft: "none",
                  borderRight: "none",
                  borderTop: "none",
                }}
              >
                Balance
              </th>
              <th
                className="col-2-6 text-end"
                style={{
                  borderBottom: "2px solid #dee2e6",
                  borderLeft: "none",
                  borderRight: "none",
                  borderTop: "none",
                }}
              >
                Value
              </th>
            </tr>
          </thead>
        </table>
      </div>
      {!loading ? (
        <div className="table-responsive scrollable-body">
          <table className="table">
            {/* prettier-ignore */}
            <tbody>
              {items ? items.map(item => (
                <tr
                  key={item.address}
                  onClick={() => handleRowClick(item)}
                  style={{
                    height: "70px",
                    overflow: "hidden",
                    verticalAlign: "middle",
                  }}
                >
                  <td className="col-4"  style={{ borderBottom: "2px solid #dee2e6", borderLeft: "none", borderRight: "none", borderTop: "none" }}>
                    <div className="row">
                      <img
                        src={item.logoURI}
                        alt="n/a"
                        style={{ width: "50px", marginRight: "10px", verticalAlign: "middle" }}
                      />
                      {item.coinKey}
                    </div>
                  </td>
                  <td className="col-2-6 text-end col-price"  style={{ borderBottom: "2px solid #dee2e6", borderLeft: "none", borderRight: "none", borderTop: "none" }}>${(item.priceUSD * 1).toFixed(2)}</td>
                  <td className="col-2-6 text-end"  style={{ borderBottom: "2px solid #dee2e6", borderLeft: "none", borderRight: "none", borderTop: "none" }}>{(item.amount * 1).toFixed(4)}</td>
                  <td className="col-2-6 text-end" style={{ borderBottom: "2px solid #dee2e6", borderLeft: "none", borderRight: "none", borderTop: "none" }} >${(item.priceUSD * item.amount).toFixed(2)}</td>
                </tr>
              )) : null }
          {items && items.length === 0 && (
            <tr>
              {/* prettier-ignore */}
              <td colSpan="4" className="message text-center">No assets</td>
            </tr>
          )}
          {message ? (
            <tr>
              {/* prettier-ignore */}
              <td colSpan="4" className="message text-center">{message}</td>
            </tr>
          ) : null}

          </tbody>
          </table>
        </div>
      ) : (
        <div className="d-flex justify-content-center align-items-center" stryle={{ height: "300px" }}>
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </>
  );
};
