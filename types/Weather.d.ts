// NOTE: define only the necessary types
type ChanceOfRain = `${number | "--"}%`;

export interface Weather {
  title: string;
  publicTimeFormatted: string;
  description: {
    text: string;
  };
  forecasts: {
    dateLabel: "今日" | "明日" | "明後日";
    chanceOfRain: {
      T00_06: ChanceOfRain;
      T06_12: ChanceOfRain;
      T12_18: ChanceOfRain;
      T18_24: ChanceOfRain;
    };
  }[];
}
