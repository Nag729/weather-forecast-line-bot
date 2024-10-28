import WeatherMessageCreator from "../src/functions/WeatherMessageCreator";
import { Weather } from "../types/Weather";

const DUMMY_RESPONSE = {
  title: "愛知県 名古屋 の天気",
  publicTimeFormatted: "2024/10/28 17:00:00",
  description: {
    text: "　東海地方は、湿った空気の影響を受けています。\n\n　東海地方は、おおむね曇りで、雨の降っている所があります。\n\n　２８日の東海地方は、湿った空気の影響によりおおむね曇りで、雨の降る所があるでしょう。\n\n　２９日の東海地方は、湿った空気や気圧の谷の影響により曇りで、朝から次第に雨となる見込みです。",
  },
  forecasts: [
    {
      dateLabel: "今日",
      chanceOfRain: {
        T00_06: "--%",
        T06_12: "--%",
        T12_18: "--%",
        T18_24: "10%",
      },
    },
    {
      dateLabel: "明日",
      chanceOfRain: {
        T00_06: "20%",
        T06_12: "40%",
        T12_18: "80%",
        T18_24: "90%",
      },
    },
    {
      dateLabel: "明後日",
      chanceOfRain: {
        T00_06: "70%",
        T06_12: "70%",
        T12_18: "70%",
        T18_24: "70%",
      },
    },
  ],
} as const satisfies Weather;

describe("WeatherMessageCreator", () => {
  describe("createNotifyMessage", () => {
    test("should return message", () => {
      // Given
      const creator = new WeatherMessageCreator();

      // When
      const message = creator.createNotifyMessage(DUMMY_RESPONSE);

      // Then
      console.log(message);
      expect(message).toContain("# Today's Weather");
    });
  });
});
