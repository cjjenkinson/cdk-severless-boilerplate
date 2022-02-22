module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverage: true,
  roots: ["<rootDir>/src/"],
  coverageDirectory: ".coverage",
  coverageThreshold: {
    global: {
      lines: 70
    }
  },
  coverageReporters: ["json", "lcovonly", "text", "clover"],
  coveragePathIgnorePatterns: [".webpack/", "cdk.out"]
};
