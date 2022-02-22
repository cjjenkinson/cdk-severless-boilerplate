// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

module.exports = {
  setupFilesAfterEnv: [path.join(__dirname, "/jest-setup.ts")],
  testMatch: ["**/*.integration.{js,ts}"],
  rootDir: "../test/integration",
  bail: 1,
  verbose: true,
};
