module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current",
        },
      },
    ],
    "@babel/preset-typescript",
  ],
  plugins: [
    [
      "module-resolver",
      {
        alias: {
          "@usecase": "./src/application/usecase/",
          "@domain": "./src/application/domain/",
          "@gateway": "./src/gateway/",
          "@routes": "./src/framework/routes/",
          "@middleware": "./src/framework/middleware/",
        },
      },
    ],
  ],
  ignore: ["**/*.spec.ts"],
};
