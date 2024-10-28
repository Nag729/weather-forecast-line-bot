import { Weather } from "types/Weather";

export default class WeatherMessageCreator {
  public createNotifyMessage(weather: Weather): string {
    const lines: string[] = [];
    const maxChanceOfRain = this.calculateMaxChanceOfRain(weather);

    lines.push("# Today's Weather");
    lines.push("");
    lines.push("## Summary");
    lines.push(this.formatText(weather.description.text));
    lines.push("");
    lines.push("## Is it raining?");
    lines.push(this.createRainMessage(maxChanceOfRain));
    lines.push(`(最大降水確率: ${maxChanceOfRain}%)`);

    return lines.join("\n");
  }

  private formatText(text: string): string {
    return text.replace(/　/g, "");
  }

  private calculateMaxChanceOfRain(weather: Weather): number {
    const forecast = weather.forecasts.find((f) => f.dateLabel === "今日");
    if (!forecast) {
      throw new Error("Failed to find today's forecast.");
    }

    const chanceOfRains = Object.values(forecast.chanceOfRain)
      .map((v) => v.replace("%", ""))
      .map((v) => v.replace("--", "0"))
      .map((v) => parseInt(v))
      .map((v) => (isNaN(v) ? 0 : v));

    return Math.max(...chanceOfRains);
  }

  private createRainMessage(maxPop: number): string {
    if (maxPop < 10) {
      return `今日は晴れだから散歩日和だよ☀️`;
    } else if (10 <= maxPop && maxPop < 30) {
      return `たぶん晴れだけどもしかしたら雨かも☁️`;
    } else if (30 <= maxPop && maxPop < 70) {
      return `雨が降るっぽいから傘持っていった方がいいよ☂️`;
    } else {
      return `今日は雨なので諦めておうちで過ごそう☔️`;
    }
  }
}
