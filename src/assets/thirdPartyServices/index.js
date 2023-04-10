import React, { lazy } from "react";
import AlertBox from "../../components/common/AlertBox";

//EXAMPLE
//const SERVICE_COMPONENT = = lazy(() => import("./path/to/service/folder));

const ExampleService = lazy(() => import("./naint/example_service"));

class ThirdPartyCustomUIComponents {
  constructor() {
    this.customUIComponents = {};
  }

  addCustomUIComponent = (ordId, serviceId, CustomUIComponent) => {
    const key = this._generateUniqueID(ordId, serviceId);
    this.customUIComponents[key] = CustomUIComponent;
  };

  componentFor = (orgId, serviceId) => {
    const CustomUIComponent = this.customUIComponents[
      this._generateUniqueID(orgId, serviceId)
    ];
    if (!CustomUIComponent) {
      return () => (
        <AlertBox
          type="error"
          message="No Component matched. Please check the orgId and serviceId"
        />
      );
    }
    return CustomUIComponent;
  };

  _generateUniqueID = (ordId, serviceId) => `${ordId}__$%^^%$__${serviceId}`;
}

const thirdPartyCustomUIComponents = new ThirdPartyCustomUIComponents();

//EXAMPLE
// thirdPartyCustomUIComponents.addCustomUIComponent(
//   [ORG_ID],
//   [SERVICE_ID],
//   [SERVICE_COMPONENT]
// );

thirdPartyCustomUIComponents.addCustomUIComponent(
  "naint",
  "example_service",
  ExampleService
);

export default thirdPartyCustomUIComponents;
