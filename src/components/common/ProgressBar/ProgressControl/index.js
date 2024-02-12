import React from "react";
import PropTypes from "prop-types";
import StyledButton from "../../StyledButton";

export const ProgressContolTypes = {
  BACK: "BACK",
  FORWARD: "FORWARD",
};

const ProgressControl = ({
  type,
  activeSection,
  demoProgressStatus,
  stateSwitchOptions,
}) => {
  const getIsDisabled = (currentType) => {
    switch (currentType) {
      case ProgressContolTypes.BACK: {
        return activeSection === demoProgressStatus.purchasing;
      }
      case ProgressContolTypes.FORWARD: {
        return activeSection === demoProgressStatus.displayingResponse;
      }
      default: {
        return;
      }
    }
  };

  const computeActionToBeCalled = (currentType) => {
    switch (currentType) {
      case ProgressContolTypes.BACK: {
        return getActionToBeCalledOnBackClicked(activeSection);
      }
      case ProgressContolTypes.FORWARD: {
        return getActionToBeCalledOnForwardClicked(activeSection);
      }
      default: {
        return;
      }
    }
  };

  const getActionToBeCalledOnBackClicked = (currentState) => {
    switch (currentState) {
      case demoProgressStatus.executingAIservice: {
        return stateSwitchOptions.setResetActiveSection;
      }
      case demoProgressStatus.displayingResponse: {
        console.log("setPurchaseCompleted");
        return stateSwitchOptions.setPurchaseCompleted;
      }
      default: {
        return;
      }
    }
  };

  const getActionToBeCalledOnForwardClicked = (currentState) => {
    switch (currentState) {
      case demoProgressStatus.purchasing: {
        return stateSwitchOptions.setPurchaseCompleted;
      }
      case demoProgressStatus.executingAIservice: {
        return stateSwitchOptions.setServiceExecutionCompleted;
      }
      default: {
        return;
      }
    }
  };

  switch (type) {
    case ProgressContolTypes.BACK: {
      return (
        <StyledButton
          btnText={type}
          disabled={getIsDisabled(type)}
          onClick={computeActionToBeCalled(type)}
        />
      );
    }
    case ProgressContolTypes.FORWARD: {
      return (
        <StyledButton
          btnText={type}
          disabled={getIsDisabled(type)}
          onClick={computeActionToBeCalled(type)}
        />
      );
    }
    default: {
      return <></>;
    }
  }
};

ProgressControl.propTypes = {
  type: PropTypes.string,
  activeSection: PropTypes.number,
  demoProgressStatus: PropTypes.object,
  stateSwitchOptions: PropTypes.objectOf(PropTypes.func),
};

export default ProgressControl;
