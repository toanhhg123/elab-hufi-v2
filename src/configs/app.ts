type Config = {
  isProd: boolean;
  production: {
    api_endpoint: string;
  };
  development: {
    api_endpoint: string;
  };
};

const config: Config = {
  isProd: process.env.REACT_APP_NODE_ENV === "production",
  production: {
    api_endpoint: process.env.REACT_APP_PRODUCTION_API_ENDPOINT || "",
  },
  development: {
    api_endpoint: process.env.REACT_APP_DEVELOPMENT_API_ENDPOINT || "",
  },
};
export default config;
