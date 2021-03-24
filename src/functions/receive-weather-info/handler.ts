import { middyfy } from "@libs/lambda";
import "source-map-support/register";
import Weather from "./../Weather";

const AWS = require("aws-sdk");
AWS.config.update({ region: process.env.MY_AWS_REGION });
const docCLI = new AWS.DynamoDB.DocumentClient();

const weather = new Weather();

const handler = async () => {
  const apiKey = process.env.ONE_CALL_API_KEY;
  const lat = process.env.MEASUREMENT_LATITUDE;
  const lon = process.env.MEASUREMENT_LONGITUDE;

  const data = await weather.receive(apiKey, lat, lon);
  const hourly = data.hourly;

  // put WeatherHourly to DynamoDB
  const reqArr = hourly.map((h) => {
    return {
      PutRequest: {
        Item: h,
      },
    };
  });
  const params = {
    RequestItems: {
      weatherHourlyTable: reqArr,
    },
  };

  docCLI.batchWrite(params, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`DynamoDB batchWrite success.`);
      console.log(data);
    }
  });

  return `receiveWeatherInfo - completed.`;
};

export const main = middyfy(handler);
