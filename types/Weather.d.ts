// NOTE: define only the necessary types
type ChanceOfRain = `${number | "--"}%`;

export interface Weather {
  title: string;
  publicTimeFormatted: string;
  description: {
    text: string;
  };
  forecasts: Forecast[];
}

export interface Forecast {
  date: string;
  dateLabel: "今日" | "明日" | "明後日";
  telop: string;
  detail: {
    weather: string;
    wind: string;
    wave: string;
  };
  temperature: {
    min: {
      celsius: string | null;
      fahrenheit: string | null;
    };
    max: {
      celsius: string | null;
      fahrenheit: string | null;
    };
  };
  chanceOfRain: {
    T00_06: ChanceOfRain;
    T06_12: ChanceOfRain;
    T12_18: ChanceOfRain;
    T18_24: ChanceOfRain;
  };
  image: {
    title: string;
    url: string;
  };
}
