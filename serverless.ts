import hello from "@functions/hello";
import notifyLine from "@functions/notify-line";
import receiveWeatherInfo from "@functions/receive-weather-info";
import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "weather-forecast-line-bot",
  frameworkVersion: "2",
  // custom
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true,
    },
  },
  // plugins
  plugins: ["serverless-webpack"],
  // provider
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    region: "ap-northeast-1", // Tokyo
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    iam: {
      role:
        "arn:aws:iam::435415521124:role/lambda-weather-forecast-line-bot-role",
    },
    environment: {
      TZ: "Asia/Tokyo",
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      MY_AWS_REGION: "ap-northeast-1",
      ONE_CALL_API_KEY: "82db215e674bdd250b933ebf63f827f7",
      LINE_CHANNEL_ACCESS_TOKEN:
        "9BtOdCQ0rvijwAUUNDZRsM+AZqwH7dyJKs+aw1l0ZaEHQOAkLTNdDCSv+7yZUTin8PQ9vZ5lFMtiFWhAcaVY1DBbA9KJ3txpa965tun6PO9luUd/qjW4H5Umz2+0ITq8aVI12pDkFCg4YOTQq8R9OAdB04t89/1O/w1cDnyilFU=",
      MEASUREMENT_LATITUDE: "35.62913147168608", // latitude of Shinagawa-Station
      MEASUREMENT_LONGITUDE: "139.73877832237912", // longitude of Shinagawa-Station
    },
    lambdaHashingVersion: "20201221",
  },
  // functions
  functions: { hello, notifyLine, receiveWeatherInfo },
  // resources
  resources: {
    Resources: {
      usersTable: {
        // DynamoDB for weatherHourlyInfo
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "weatherHourlyTable",
          AttributeDefinitions: [
            {
              AttributeName: "dt",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            {
              AttributeName: "dt",
              KeyType: "HASH",
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
          StreamSpecification: {
            StreamViewType: "NEW_IMAGE",
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
