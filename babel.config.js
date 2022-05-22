"use strict";

const appMode = process.env.environment || "development";

module.exports = {
  presets: [
    "@babel/preset-env",
    [
      "@babel/preset-react",
      {
        throwIfNamespace: true,
        development: appMode === "development",
      },
    ]
  ],
  "plugins": [
    ["@babel/transform-runtime"]
  ]
};
