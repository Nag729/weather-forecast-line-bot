import { ScheduledHandler } from "aws-lambda";
import axios from "axios";
import { Weather } from "types/Weather";
import { FlexMessage } from "types/FlexMessage";
import { generateWeatherAdvice } from "../../domain/generateWeatherAdvice";
import { buildWeatherFlexMessage } from "../../domain/buildWeatherFlexMessage";

const handler: ScheduledHandler = async () => {
  const weather = await fetchWeather();
  console.info("[Done] fetchWeather");

  const forecast = weather.forecasts.find((f) => f.dateLabel === "今日");
  if (!forecast) {
    throw new Error("Today's forecast not found");
  }

  const advice = await generateWeatherAdvice(weather, forecast);
  console.info("[Done] generateWeatherAdvice");

  const flexMessage = buildWeatherFlexMessage({
    title: weather.title,
    forecast,
    advice,
  });
  console.info("[Done] buildWeatherFlexMessage");
  console.info("flexMessage:", JSON.stringify(flexMessage, null, 2));

  await sendToLINE(flexMessage);
  console.info("[Done] sendToLINE");
};

async function fetchWeather(): Promise<Weather> {
  const url = "https://weather.tsukumijima.net/api/forecast/city/230010";
  const res = await axios.get<Weather>(url);
  return res.data;
}

async function sendToLINE(message: FlexMessage): Promise<void> {
  const url = "https://api.line.me/v2/bot/message/broadcast";

  try {
    await axios.post(
      url,
      { messages: [message] },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
        },
      }
    );
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("LINE API error:", err.response?.data ?? err.message);
    }
    throw err;
  }
}

export const main = handler;
