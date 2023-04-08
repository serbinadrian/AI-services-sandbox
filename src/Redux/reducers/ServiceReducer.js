import { serviceActions } from "../actionCreators";
const InitialServiceList = {
  serviceMethodExecution: {
    response: {},
    isComplete: false,
  },
};

const serviceReducer = (state = InitialServiceList, action) => {
  switch (action.type) {
    case serviceActions.UPDATE_SERVICE_EXECUTION_RESPONSE: {
      return { ...state, serviceMethodExecution: { ...state.serviceMethodExecution, ...action.payload } };
    }
    case serviceActions.RESET_SERVICE_EXECUTION: {
      return { ...state, serviceMethodExecution: { ...InitialServiceList.serviceMethodExecution } };
    }
    case serviceActions.UPDATE_SPEC_DETAILS: {
      return {
        ...state,
        serviceMethodExecution: {
          ...state.serviceMethodExecution,
          serviceSpecJSON: action.payload.serviceSpecJSON,
          protoSpec: action.payload.protoSpec,
        },
      };
    }
    default: {
      return state;
    }
  }
};

export default serviceReducer;
