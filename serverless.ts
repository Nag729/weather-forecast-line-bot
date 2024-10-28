import fetchWeather from "@functions/fetch-weather";
import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "weather-forecast-line-bot",
  frameworkVersion: "3",
  useDotenv: true,
  // custom
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true,
    },
  },
  // plugins
  plugins: ["serverless-webpack", "serverless-dotenv-plugin"],
  // provider
  provider: {
    name: "aws",
    runtime: "nodejs20.x",
    region: "ap-northeast-1", // Tokyo
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    iam: {
      role: "arn:aws:iam::435415521124:role/lambda-weather-forecast-line-bot-role",
    },
    lambdaHashingVersion: "20201221",
  },
  // functions
  functions: {
    fetchWeather,
  },
};

module.exports = serverlessConfiguration;
