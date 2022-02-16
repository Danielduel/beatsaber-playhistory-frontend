// @ts-nocheck
// TODO: Check if there is an option to switch that to .ts file.
const fs = require("fs");
try {
  fs.accessSync("./secret.env");
} catch (err) {
  // file doesn't exists, copy template
  fs.copyFileSync("./secret.env.template", "./secret.env");
}

const dotenv = require("dotenv");
dotenv.config({
  path: "secret.env"
});

const overrides = {
  devServer: (configFunction) => {
    function configure(proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost);
      const backendUrl = process.env.BACKEND_TYPE === "local"
        ? process.env.BACKEND_LOCAL
        : process.env.BACKEND_REMOTE;

      config.proxy = {
        [process.env.BACKEND_PREFIX]: {
          target: backendUrl,
          router: () => backendUrl,
          logLevel: "debug"
        }
      };

      return config;
    }

    return configure;
  }
}

module.exports = overrides;

