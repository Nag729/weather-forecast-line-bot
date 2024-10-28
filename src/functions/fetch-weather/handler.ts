import { middyfy } from "@libs/lambda";
import { ScheduledHandler } from "aws-lambda";
import axios from "axios";
import { Weather } from "types/Weather";
import WeatherMessageCreator from "../../domain/WeatherMessageCreator";

const weatherMessageCreator = new WeatherMessageCreator();

const handler: ScheduledHandler = async () => {
  // fetch weather.
  const weather = await fetchWeather();
  console.info(`[Done] fetchWeather`);
  console.info(weather);

  // create message for LINE.
  const notifyMessage = weatherMessageCreator.createNotifyMessage(weather);
  console.info(`[Done] createNotifyMessage`);
  console.info(notifyMessage);

  // sending message to LINE.
  await pushMessageToLINE(notifyMessage);
  console.info(`[Done] pushMessageToLINE`);

  console.info(`fetchWeather - completed.`);
};

const fetchWeather = async (): Promise<Weather> => {
  // https://weather.tsukumijima.net/
  const url = "https://weather.tsukumijima.net/api/forecast/city/230010";
  const res = await axios.get<Weather>(url);
  return res.data;
};

const pushMessageToLINE = async (notifyMessage: string): Promise<void> => {
  const messages = [{ type: "text", text: notifyMessage }];
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
      console.error(`Error has occured when sending message to LINE.`);
      console.error(err.message);
    });
};

export const main = middyfy(handler);
