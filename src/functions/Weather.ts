const axios = require("axios");
const dayjs = require("dayjs");
const ja = require("dayjs/locale/ja");
const timezone = require("dayjs/plugin/timezone");
const utc = require("dayjs/plugin/utc");
const cloneDeep = require("lodash.clonedeep");

// setting for dayjs
dayjs.locale(ja);
dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.tz.setDefault("Asia/Tokyo");

import { Hourly, WeatherInfo } from "./../../types/Weather";

export default class Weather {
  /**
   * receive weather info from One Call API.
   */
  public async receive(
    apiKey: string,
    latitude: string,
    longitude: string
  ): Promise<WeatherInfo> {
    // receive weather information from OpenWeather One Call API.
    // https://openweathermap.org/api/one-call-api
    const url = "https://api.openweathermap.org/data/2.5/onecall";
    const params = {
      appid: apiKey,
      lat: latitude,
      lon: longitude,
      exclude: "current,minutely,daily,alerts", // exclude unnecessary data
      units: "metric",
      lang: "ja",
    };

    const res = await axios.get(url, {
      params: params,
    });
    const data: WeatherInfo = res.data;

    // format response.
    const weatherInfo: WeatherInfo = this.format(data);
    return weatherInfo;
  }

  /**
   * format WeatherInfo for forecast.
   */
  private format(data: WeatherInfo): WeatherInfo {
    const _data = cloneDeep(data);
    const hourly = _data.hourly;

    // arrange hourly response.
    // only use first 15 data to forecast today's weather.
    const arrangedHourly = hourly.slice(0, 15).map((h) => {
      // parse UTC to local datetime.
      const localTime = dayjs
        .unix(h.dt)
        .utc()
        .local()
        .format("YYYY/MM/DD_HH:mm");
      // concert pop to percent.
      const popPercent = h.pop * 100;

      return {
        dt: localTime,
        temp: h.temp,
        pop: popPercent, // rainy percent
      };
    });

    _data.hourly = arrangedHourly;
    return _data;
  }

  /**
   * calc max pop from Hourly data.
   */
  public calcMaxPop(hourly: Hourly[]): number {
    const _hourly = cloneDeep(hourly);

    // calc max pop.
    const maxPop = _hourly.sort(this.comparePop)[0]["pop"];
    return maxPop;
  }

  /**
   * compare function for Hourly pop.
   */
  private comparePop(x, y) {
    const popX = x.pop;
    const popY = y.pop;

    if (popX > popY) {
      return -1;
    } else if (popX < popY) {
      return 1;
    }
    return 0;
  }

  /**
   * create LINE notify message from maxPop.
   */
  public createNotifyMessage(maxPop: number): string {
    let notifyMessage = "";

    if (maxPop < 10) {
      notifyMessage = `今日は晴れだから散歩日和だよ☀️`;
    } else if (10 <= maxPop && maxPop < 30) {
      notifyMessage = `たぶん晴れだけどもしかしたら雨かも☁️`;
    } else if (30 <= maxPop && maxPop < 70) {
      notifyMessage = `雨が降るっぽいから傘持っていった方がいいよ☂️`;
    } else {
      notifyMessage = `今日は雨なので諦めておうちで過ごそう☔️`;
    }

    notifyMessage += ` #最大降水確率は ${maxPop} %`;
    return notifyMessage;
  }
}
