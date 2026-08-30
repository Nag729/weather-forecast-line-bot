import Anthropic from "@anthropic-ai/sdk";
import dayjs from "dayjs";
import { Forecast, Weather } from "types/Weather";

const MODEL = "claude-opus-5";

const UNAVAILABLE_MESSAGE = "⚠️ アドバイスを取得できませんでした";

/** SDK v0.122 は生成時に認証情報を解決するため、実行時まで遅延させる */
let client: Anthropic | undefined;

function getClient(): Anthropic {
  return (client ??= new Anthropic());
}

export async function generateWeatherAdvice(
  weather: Weather,
  forecast: Forecast
): Promise<string> {
  try {
    const prompt = buildPrompt(weather, forecast);

    const response = await getClient().messages.create({
      model: MODEL,
      max_tokens: 300,
      temperature: 1,
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      console.error("Unexpected Claude response block type:", content.type);
      return UNAVAILABLE_MESSAGE;
    }

    const advice = content.text.trim();
    if (!advice) {
      console.error("Claude returned an empty advice text");
      return UNAVAILABLE_MESSAGE;
    }

    return advice;
  } catch (error) {
    console.error("Claude API error:", error);
    return UNAVAILABLE_MESSAGE;
  }
}

function buildPrompt(weather: Weather, forecast: Forecast): string {
  const rainInfo = formatRainProbability(forecast);

  const tomorrow = dayjs().add(1, "day");
  const dateStr = tomorrow.format("M月D日");

  return `あなたは夜に明日の天気予報を届けるゆるく親しみやすいアシスタントです。
以下の天気情報を分析し、4行のアドバイスを教えてください。

## 天気データ
- 日付: ${dateStr}（明日）
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
- 1行目: 👕 服装アドバイス（実用的）
- 2行目: 🧺 洗濯アドバイス（実用的）
- 3行目: 🎯 明日のゆるい提案（天気に合わせた癒し系の提案）
- 4行目: 💭 ひとこと（豆知識・小ネタ・ゆるいツッコミなど。クスッと笑えるユーモアを）

## 3-4行目のネタの方向性（明日のデータに合わせて選んで）
- ${dateStr}に関連する記念日・イベント
- 今の季節の食べ物・風物詩
- 明日の天気・気温あるある
- ゆるい人生観・哲学っぽいひとこと

## 表現のルール
- 各行は25文字以内。絵文字は行頭のみ使用。
- 定型句や毎回言いがちな言い回しは避け、今日ならではの言葉を選ぶこと。
- 前置きや解説は不要。4行だけを出力すること。`;
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
