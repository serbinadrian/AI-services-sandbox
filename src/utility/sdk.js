import SnetSDK, { WebServiceClient as ServiceClient } from "snet-sdk-web";

const DEFAULT_GAS_PRICE = 4700000;
const DEFAULT_GAS_LIMIT = 210000;

let sdk;
let web3Provider;

export const callTypes = {
  FREE: "FREE",
  REGULAR: "REGULAR",
};

export const parseSignature = hexSignature => {
  const signatureBuffer = Buffer.from(hexSignature.slice(2), "hex");
  return signatureBuffer.toString("base64");
};

export const decodeGroupId = encodedGroupId => {
  const groupIdBuffer = Buffer.from(encodedGroupId, "base64");
  return `0x${groupIdBuffer.toString("hex")}`;
};

const generateOptions = () => {
  const defaultOptions = { concurrency: false };
  return {
    ...defaultOptions,
    endpoint: process.env.REACT_APP_SANDBOX_SERVICE_ENDPOINT,
    disableBlockchainOperations: true,
  };
};

class PaypalIdentity {
  constructor(address, web3) {
    this._web3 = web3;
    this._web3.eth.defaultAccount = address;
  }

  getAddress() {
    return this._web3.eth.defaultAccount;
  }
}

class PaypalSDK extends SnetSDK {
  constructor(address, ...args) {
    super(...args);
    this._address = address;
  }

  _createIdentity() {
    return new PaypalIdentity(this._address, this._web3);
  }
}

export const initSdk = async address => {
  const updateSDK = async () => {
    const chainIdHex = web3Provider.chainId;
    const networkId = parseInt(chainIdHex);

    const config = {
      networkId,
      web3Provider,
      defaultGasPrice: DEFAULT_GAS_PRICE,
      defaultGasLimit: DEFAULT_GAS_LIMIT,
    };

    sdk = new SnetSDK(config);
    await sdk.setupAccount();
  };

  if (sdk && address) {
    const currentAddress = await sdk.account.getAddress();
    if (currentAddress.toLowerCase() !== address.toLowerCase()) {
      await updateSDK();
    }
    return Promise.resolve(sdk);
  }

  if (sdk && !(sdk instanceof PaypalSDK)) {
    return Promise.resolve(sdk);
  }
  return Promise.resolve(sdk);
};

const getMethodNames = service => {
  const ownProperties = Object.getOwnPropertyNames(service);
  return ownProperties.filter(property => {
    if (service[property] && typeof service[property] === typeof {}) {
      return !!service[property].methodName;
    }
    return null;
  });
};

export const createServiceClient = (
  org_id,
  service_id,
  groupInfo,
  serviceRequestStartHandler,
  serviceRequestCompleteHandler,
  serviceRequestErrorHandler,
  callType,
  wallet
) => {
  const options = generateOptions(callType, wallet, serviceRequestErrorHandler, groupInfo, org_id, service_id);
  const serviceClient = new ServiceClient(
    sdk,
    org_id,
    service_id,
    sdk && sdk._mpeContract,
    {},
    {},
    {},
    options
  );

  const onEnd = props => (...args) => {
    try {
      const { status, statusMessage } = args[0];
      if (status !== 0) {
        serviceRequestErrorHandler(statusMessage);
        return;
      }
      props.onEnd(...args);
      if (serviceRequestCompleteHandler) {
        serviceRequestCompleteHandler();
      }
    } catch (error) {
      serviceRequestErrorHandler(error);
    }
  };

  const requestStartHandler = () => {
    if (serviceRequestStartHandler) {
      serviceRequestStartHandler();
    }
  };
  try {
    return {
      invoke(methodDescriptor, props) {
        requestStartHandler();
        serviceClient.invoke(methodDescriptor, { ...props, onEnd: onEnd(props) });
      },
      unary(methodDescriptor, props) {
        requestStartHandler();
        serviceClient.unary(methodDescriptor, { ...props, onEnd: onEnd(props) });
      },
      getMethodNames,
    };
  } catch (error) {
    serviceRequestErrorHandler(error);
  }
};

export default sdk;
