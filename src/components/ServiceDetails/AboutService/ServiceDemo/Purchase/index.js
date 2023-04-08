import React from "react";

import ActiveSession from "./ActiveSession";

const Purchase = ({
  handleComplete,
  freeCallsRemaining,
  freeCallsAllowed,
  wallet,
  groupInfo,
  handlePurchaseError,
  isServiceAvailable,
}) => {
  console.log(freeCallsRemaining, freeCallsAllowed);
  return (
    <ActiveSession
      freeCallsRemaining={freeCallsRemaining}
      freeCallsAllowed={freeCallsAllowed}
      handleComplete={handleComplete}
      isServiceAvailable={isServiceAvailable}
    />
  );
};

export default Purchase;
