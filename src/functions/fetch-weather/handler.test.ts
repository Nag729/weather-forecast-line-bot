import axios from "axios";
import { Forecast, Weather } from "types/Weather";
import { generateWeatherAdvice } from "../../domain/generateWeatherAdvice";
import { main } from "./handler";

jest.mock("axios");
jest.mock("../../domain/generateWeatherAdvice");

const mockedAxios = jest.mocked(axios);
const mockedGenerateWeatherAdvice = jest.mocked(generateWeatherAdvice);

const createForecast = (dateLabel: "今日" | "明日" | "明後日"): Forecast => ({
  date: "2026-02-03",
  dateLabel,
  telop: "晴れ",
  detail: {
    weather: "晴れ　時々　くもり",
    wind: "北の風",
    wave: "0.5メートル",
  },
  temperature: {
    min: { celsius: "2", fahrenheit: "36" },
    max: { celsius: "10", fahrenheit: "50" },
  },
  chanceOfRain: {
    T00_06: "10%",
    T06_12: "10%",
    T12_18: "20%",
    T18_24: "10%",
  },
  image: {
    title: "晴れ",
    url: "https://example.com/sunny.svg",
  },
});

const mockWeatherResponse: Weather = {
  title: "千葉県 千葉 の天気",
  publicTimeFormatted: "2026/02/02 17:00:00",
  description: {
    text: "関東地方は晴れています。",
  },
  forecasts: [
    createForecast("今日"),
    createForecast("明日"),
    createForecast("明後日"),
  ],
};

describe("handler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.LINE_CHANNEL_ACCESS_TOKEN = "test-token";
  });

  test("should fetch tomorrow's forecast and send LINE message", async () => {
    // Given
    mockedAxios.get.mockResolvedValue({ data: mockWeatherResponse });
    mockedAxios.post.mockResolvedValue({ data: {} });
    mockedGenerateWeatherAdvice.mockResolvedValue(
      "👕 暖かくしてね\n🧺 洗濯日和！\n🎯 散歩にいい天気\n💭 明日も頑張ろう"
    );

    // When
    await main({} as any, {} as any, () => {});

    // Then
    // 天気APIが呼ばれること
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "https://weather.tsukumijima.net/api/forecast/city/120010"
    );

    // 「明日」の予報でアドバイス生成が呼ばれること
    expect(mockedGenerateWeatherAdvice).toHaveBeenCalledWith(
      mockWeatherResponse,
      mockWeatherResponse.forecasts[1] // 明日の予報
    );

    // LINE APIが呼ばれること
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      "https://api.line.me/v2/bot/message/broadcast",
      expect.objectContaining({
        messages: expect.arrayContaining([
          expect.objectContaining({
            type: "flex",
            altText: expect.stringContaining("晴れ"),
          }),
        ]),
      }),
      expect.objectContaining({
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test-token",
        },
      })
    );
  });

  test("should throw error when tomorrow's forecast is not found", async () => {
    // Given
    const weatherWithoutTomorrow: Weather = {
      ...mockWeatherResponse,
      forecasts: [createForecast("今日")], // 明日がない
    };
    mockedAxios.get.mockResolvedValue({ data: weatherWithoutTomorrow });

    // When & Then
    await expect(main({} as any, {} as any, () => {})).rejects.toThrow(
      "Tomorrow's forecast not found"
    );
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });

  test("should include temperature in flex message", async () => {
    // Given
    mockedAxios.get.mockResolvedValue({ data: mockWeatherResponse });
    mockedAxios.post.mockResolvedValue({ data: {} });
    mockedGenerateWeatherAdvice.mockResolvedValue(
      "👕 テスト\n🧺 テスト\n🎯 テスト\n💭 テスト"
    );

    // When
    await main({} as any, {} as any, () => {});

    // Then
    const postCall = mockedAxios.post.mock.calls[0];
    const body = postCall[1] as { messages: Array<{ contents: unknown }> };
    const messageJson = JSON.stringify(body.messages[0].contents);

    expect(messageJson).toContain("10℃ / 2℃");
  });
});
