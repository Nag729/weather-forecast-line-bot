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

  return `あなたは毎朝の天気予報とひとことを届けるゆるく親しみやすいアシスタントです。
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
- 1行目: 👕 服装アドバイス（実用的）
- 2行目: 🧺 洗濯アドバイス（実用的）
- 3行目: 🎯 今日のゆるい提案（天気に合わせた癒し系の提案。毎日違う内容で）
- 4行目: 💭 ひとこと（豆知識・小ネタ・ゆるいツッコミなど。クスッと笑えるユーモアを）

## 3-4行目のネタの方向性（今日のデータに合わせて選んで）
- ${dateStr}に関連する記念日・イベント
- 今の季節の食べ物・風物詩
- 今日の天気・気温あるある
- ゆるい人生観・哲学っぽいひとこと

各行は25文字以内。絵文字は行頭のみ使用。`;
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
    return "👕 防水対策しっかりね\n🧺 部屋干しの日\n🎯 Netflixでゴロゴロが正解\n💭 雨の音って意外と落ち着くよね";
  }
  if (telop.includes("曇")) {
    return "👕 羽織れるものあると安心\n🧺 午前中に洗濯チャンス\n🎯 カフェでまったりもアリ\n💭 曇りの日のコーヒーは美味しい（気がする）";
  }
  return "👕 気温に合わせてね\n🧺 洗濯日和！\n🎯 散歩とか気持ちよさそう\n💭 晴れてるだけで何か勝ってる気がする";
}
