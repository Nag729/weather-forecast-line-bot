import Anthropic from "@anthropic-ai/sdk";
import dayjs from "dayjs";
import { Forecast, Weather } from "types/Weather";

const anthropic = new Anthropic();

export async function generateWeatherAdvice(
  weather: Weather,
  forecast: Forecast
): Promise<string> {
  try {
    const prompt = buildPrompt(weather, forecast);

    const response = await anthropic.messages.create({
      model: "claude-opus-4-20250514",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.content[0];
    if (content.type === "text") {
      return content.text.trim();
    }
    return getFallbackAdvice(forecast.telop);
  } catch (error) {
    console.error("Claude API error:", error);
    return getFallbackAdvice(forecast.telop);
  }
}

function buildPrompt(weather: Weather, forecast: Forecast): string {
  const rainInfo = formatRainProbability(forecast);

  const today = dayjs();
  const dateStr = today.format("M月D日");

  return `あなたは毎朝の天気予報を届ける親しみやすいアシスタントです。
以下の天気情報を分析し、4行のアドバイスを教えてください。

## 天気データ
- 日付: ${dateStr}
- 地域: ${weather.title}
- 天気: ${forecast.telop}
- 詳細: ${forecast.detail.weather}
- 最高気温: ${forecast.temperature.max.celsius ?? "不明"}℃
- 最低気温: ${forecast.temperature.min.celsius ?? "不明"}℃
- 降水確率: ${rainInfo}
- 風: ${forecast.detail.wind}

## 気象概況
${weather.description.text}

## 出力ルール
- 1行目: 👕 服装アドバイス（気温・天気変化を考慮）
- 2行目: 🧺 洗濯アドバイス（降水確率・時間帯を考慮）
- 3行目: 🏃 今日の天気に合ったおすすめ行動（具体的に）
- 4行目: 📚 季節・暦・雑学などの豆知識（今日の日付や季節に関連）

各行は25文字以内で、親しみやすい口調で。絵文字は行頭のみ使用。`;
}

function formatRainProbability(forecast: Forecast): string {
  const slots = [
    { time: "00-06時", value: forecast.chanceOfRain.T00_06 },
    { time: "06-12時", value: forecast.chanceOfRain.T06_12 },
    { time: "12-18時", value: forecast.chanceOfRain.T12_18 },
    { time: "18-24時", value: forecast.chanceOfRain.T18_24 },
  ];

  const validSlots = slots.filter((s) => s.value !== "--%");
  if (validSlots.length === 0) return "データなし";

  return validSlots.map((s) => `${s.time}: ${s.value}`).join(", ");
}

function getFallbackAdvice(telop: string): string {
  if (telop.includes("雨") || telop.includes("雪")) {
    return "👕 防水・防寒対策をしっかりと\n🧺 今日は部屋干しがおすすめ\n🏃 おうちでストレッチがおすすめ\n📚 雨の日は読書がはかどる";
  }
  if (telop.includes("曇")) {
    return "👕 羽織れるものがあると安心\n🧺 午前中の洗濯がおすすめ\n🏃 カフェでゆっくり過ごすのも◎\n📚 曇りの日は集中力が上がるらしい";
  }
  return "👕 気温に合わせた服装で\n🧺 洗濯日和かも！\n🏃 散歩や外出にぴったりの日\n📚 晴れの日はビタミンD生成のチャンス";
}
