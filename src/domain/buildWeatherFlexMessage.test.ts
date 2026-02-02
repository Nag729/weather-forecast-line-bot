import { buildWeatherFlexMessage } from "./buildWeatherFlexMessage";
import { Forecast } from "types/Weather";

const createForecast = (overrides: Partial<Forecast> = {}): Forecast => ({
  date: "2024-10-28",
  dateLabel: "明日",
  telop: "晴れ",
  detail: {
    weather: "晴れ　時々　くもり",
    wind: "北の風　後　南の風",
    wave: "0.5メートル",
  },
  temperature: {
    min: { celsius: "12", fahrenheit: "54" },
    max: { celsius: "22", fahrenheit: "72" },
  },
  chanceOfRain: {
    T00_06: "--%",
    T06_12: "10%",
    T12_18: "20%",
    T18_24: "30%",
  },
  image: {
    title: "晴れ",
    url: "https://www.jma.go.jp/bosai/forecast/img/100.svg",
  },
  ...overrides,
});

describe("buildWeatherFlexMessage", () => {
  test("should return FlexMessage with correct structure", () => {
    // Given
    const forecast = createForecast();
    const advice = "👕 薄手の上着で\n🧺 洗濯日和！\n💡 水分補給を";

    // When
    const result = buildWeatherFlexMessage({
      title: "愛知県 名古屋 の天気",
      forecast,
      advice,
    });

    // Then
    expect(result.type).toBe("flex");
    expect(result.altText).toContain("晴れ");
    expect(result.contents.type).toBe("bubble");
  });

  test("should include weather info in body", () => {
    // Given
    const forecast = createForecast({ telop: "曇りのち雨" });

    // When
    const result = buildWeatherFlexMessage({
      title: "テスト",
      forecast,
      advice: "テスト",
    });

    // Then
    const bodyJson = JSON.stringify(result.contents.body);
    expect(bodyJson).toContain("曇りのち雨");
  });

  test("should set header color based on weather", () => {
    // Given
    const sunnyForecast = createForecast({ telop: "晴れ" });
    const rainyForecast = createForecast({ telop: "雨" });

    // When
    const sunnyResult = buildWeatherFlexMessage({
      title: "テスト",
      forecast: sunnyForecast,
      advice: "テスト",
    });
    const rainyResult = buildWeatherFlexMessage({
      title: "テスト",
      forecast: rainyForecast,
      advice: "テスト",
    });

    // Then
    expect(sunnyResult.contents.styles?.header?.backgroundColor).toBe("#4A90D9");
    expect(rainyResult.contents.styles?.header?.backgroundColor).toBe("#5C6BC0");
  });

  test("should format temperature correctly", () => {
    // Given
    const forecast = createForecast({
      temperature: {
        min: { celsius: "5", fahrenheit: "41" },
        max: { celsius: "15", fahrenheit: "59" },
      },
    });

    // When
    const result = buildWeatherFlexMessage({
      title: "テスト",
      forecast,
      advice: "テスト",
    });

    // Then
    const bodyJson = JSON.stringify(result.contents.body);
    expect(bodyJson).toContain("15℃ / 5℃");
  });
});
