import React from "react";

export default function TokenDisplay({
  token = null,
  divStyle,
  spanStyle,
  optionalEnding,
  showName = true,
  nativeToken = false,
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: token.name === "" ? "center" : "space-evenly",
        ...divStyle,
      }}
    >
      {!nativeToken && token.imgSrc && (
        <img style={{ height: "1em", width: "1em" }} src={token.imgSrc} alt="Token Icon" />
      )}
      <span style={{ ...spanStyle }}>
        {nativeToken && "Ξ"}
        {!nativeToken && showName && token.name} {optionalEnding}
      </span>
    </div>
  );
}
