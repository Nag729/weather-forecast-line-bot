import { Forecast } from "types/Weather";
import { FlexBubble, FlexBox, FlexMessage, FlexText } from "types/FlexMessage";

export interface WeatherFlexMessageParams {
  title: string;
  forecast: Forecast;
  advice: string;
}

export function buildWeatherFlexMessage(
  params: WeatherFlexMessageParams
): FlexMessage {
  const { title, forecast, advice } = params;

  return {
    type: "flex",
    altText: `${forecast.telop} - ${advice.split("\n")[0]}`,
    contents: buildBubble(title, forecast, advice),
  };
}

function buildBubble(
  title: string,
  forecast: Forecast,
  advice: string
): FlexBubble {
  return {
    type: "bubble",
    size: "mega",
    header: buildHeader(title),
    body: buildBody(forecast),
    footer: buildFooter(advice),
    styles: {
      header: { backgroundColor: getHeaderColor(forecast.telop) },
      footer: { backgroundColor: "#F5F5F5" },
    },
  };
}

function buildHeader(title: string): FlexBox {
  const today = new Date();
  const dayOfWeek = ["日", "月", "火", "水", "木", "金", "土"][today.getDay()];
  const dateStr = `${today.getMonth() + 1}/${today.getDate()}（${dayOfWeek}）`;
  const location = title.replace("愛知県 ", "").replace(" の天気", "");

  return {
    type: "box",
    layout: "vertical",
    contents: [
      {
        type: "text",
        text: `${dateStr} ${location}`,
        size: "sm",
        color: "#FFFFFF",
        weight: "bold",
      },
    ],
    paddingAll: "15px",
  };
}

function buildBody(forecast: Forecast): FlexBox {
  const { telop, temperature, chanceOfRain } = forecast;

  return {
    type: "box",
    layout: "vertical",
    contents: [
      {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: `${getWeatherEmoji(telop)} ${telop}`,
            size: "xl",
            weight: "bold",
            align: "center",
          },
          {
            type: "text",
            text: formatTemperature(temperature),
            size: "md",
            color: "#666666",
            align: "center",
            margin: "sm",
          },
        ],
      },
      { type: "separator", margin: "lg" },
      {
        type: "box",
        layout: "vertical",
        contents: formatChanceOfRain(chanceOfRain),
        margin: "lg",
        spacing: "xs",
      },
    ],
    paddingAll: "15px",
  };
}

function buildFooter(advice: string): FlexBox {
  const lines = advice.split("\n").filter((line) => line.trim());

  return {
    type: "box",
    layout: "vertical",
    contents: lines.map(
      (line): FlexText => ({
        type: "text",
        text: line,
        size: "sm",
        color: "#555555",
        wrap: true,
      })
    ),
    paddingAll: "15px",
    spacing: "xs",
  };
}

function getHeaderColor(telop: string): string {
  if (telop.includes("晴")) return "#4A90D9";
  if (telop.includes("雨")) return "#5C6BC0";
  if (telop.includes("雪")) return "#78909C";
  if (telop.includes("曇")) return "#78909C";
  return "#4A90D9";
}

function getWeatherEmoji(telop: string): string {
  if (telop.includes("雪")) return "❄️";
  if (telop.includes("雨")) return "☔";
  if (telop.includes("曇") && telop.includes("晴")) return "⛅";
  if (telop.includes("曇")) return "☁️";
  if (telop.includes("晴")) return "☀️";
  return "⛅";
}

function formatTemperature(temperature: {
  min: { celsius: string | null };
  max: { celsius: string | null };
}): string {
  const { min, max } = temperature;

  if (max.celsius && min.celsius) return `${max.celsius}℃ / ${min.celsius}℃`;
  if (max.celsius) return `最高 ${max.celsius}℃`;
  if (min.celsius) return `最低 ${min.celsius}℃`;
  return "";
}

function formatChanceOfRain(chanceOfRain: {
  T00_06: string;
  T06_12: string;
  T12_18: string;
  T18_24: string;
}): FlexText[] {
  const slots = [
    { label: "06-12", value: chanceOfRain.T06_12 },
    { label: "12-18", value: chanceOfRain.T12_18 },
    { label: "18-24", value: chanceOfRain.T18_24 },
  ];

  const validSlots = slots.filter((s) => s.value !== "--%");

  if (validSlots.length === 0) {
    return [{ type: "text", text: "☂️ 降水確率: --", size: "sm", color: "#666666" }];
  }

  const rainText = validSlots.map((s) => `${s.label}: ${s.value}`).join(" | ");
  return [{ type: "text", text: `☂️ ${rainText}`, size: "sm", color: "#666666" }];
}
