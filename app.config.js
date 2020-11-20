import "dotenv/config";

export default {
  name: "Ebay Profit",
  version: "1.0.0",
  extra: {
    EBAY_ENDPOINT: process.env.EBAY_ENDPOINT,
    EBAY_APPLICATION_OAUTH_KEY: process.env.EBAY_APPLICATION_OAUTH_KEY,
  },
};
