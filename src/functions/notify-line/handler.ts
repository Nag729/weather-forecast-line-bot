import axios from "axios";
import "source-map-support/register";
import { middyfy } from "../../libs/lambda"; // TODO: `@libs` で参照できない問題
import Weather from "../Weather";
import { Hourly } from "./../../../types/Weather";

const weather = new Weather();

const handler = async (event) => {
  // convert value from DynamoDB stream.
  const records = event.Records;
  const newImages: Hourly[] = records
    .filter((record) => record.eventName === "INSERT")
    .map((record) => record.dynamodb.NewImage)
    .map((image) => {
      // convert type of value.
      const columns = {};
      for (const [key, value] of Object.entries(image)) {
        if (value.hasOwnProperty("N")) columns[key] = Number(value["N"]);
        else columns[key] = value["S"];
      }
      return columns;
    });

  if (!newImages || newImages.length === 0) {
    return `DynamoDB stream does not contain assumed INSERT data.`;
  }

  // judge if you notify LINE.
  const maxPop = weather.calcMaxPop(newImages);
  const notifyMessage = weather.createNotifyMessage(maxPop);

  // sending message to LINE.
  await pushMessageToLINE(notifyMessage);
  return `notifyLine - completed.`;
};

const pushMessageToLINE = async (notifyMessage: string): Promise<void> => {
  const messages = [
    {
      type: "text",
      text: notifyMessage,
    },
  ];
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + process.env.LINE_CHANNEL_ACCESS_TOKEN,
  };

  // sending message to all friends using broadcast.
  await axios
    .request({
      method: "post",
      headers: headers,
      url: "https://api.line.me/v2/bot/message/broadcast",
      data: {
        messages: messages,
      },
    })
    .catch((err) => {
      console.log(`Error has occured when sending message to LINE.`);
      console.log(err.message);
    });
};

export const main = middyfy(handler);
