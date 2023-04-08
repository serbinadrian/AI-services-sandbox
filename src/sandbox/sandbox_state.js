export default {
  userReducer: {
    login: {
      isLoggedIn: true,
    },
  },
  serviceReducer: {
    serviceMethodExecution: {
      isComplete: false,
    },
    services: [],
  },
  serviceDetailsReducer: {
    details: {
      url: process.env.REACT_APP_SANDBOX_IKTINA_URL,
      org_id: process.env.REACT_APP_SANDBOX_ORG_ID,
      service_id: process.env.REACT_APP_SANDBOX_SERVICE_ID,
      display_name: "Sandbox",
      is_available: 1,
      groups: [
        {
          pricing: [
            {
              default: true,
              price_model: "fixed_price",
              price_in_cogs: 1,
            },
          ],
          endpoints: [
            {
              endpoint: process.env.REACT_APP_SANDBOX_SERVICE_ENDPOINT,
              is_available: 1,
            },
          ],
        },
      ],
    },
    freeCalls: {
      allowed: 10,
      remaining: "UNLIMITED",
    },
  },
};
