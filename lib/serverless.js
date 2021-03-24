import hello from "@functions/hello";
import receiveWeatherInfo from "@functions/receive-weather-info";
const serverlessConfiguration = {
    service: "weather-forecast-line-bot",
    frameworkVersion: "2",
    custom: {
        webpack: {
            webpackConfig: "./webpack.config.js",
            includeModules: true,
        },
    },
    plugins: ["serverless-webpack"],
    provider: {
        name: "aws",
        runtime: "nodejs14.x",
        region: "ap-northeast-1",
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
            ONE_CALL_API_KEY: "82db215e674bdd250b933ebf63f827f7",
            MEASUREMENT_LATITUDE: "35.62913147168608",
            MEASUREMENT_LONGITUDE: "139.73877832237912",
        },
        lambdaHashingVersion: "20201221",
    },
    functions: { hello, receiveWeatherInfo },
};
module.exports = serverlessConfiguration;
//# sourceMappingURL=serverless.js.map