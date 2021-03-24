const axios = require("axios");
const dayjs = require("dayjs");
require("dayjs/locale/ja");
const utc = require("dayjs/plugin/utc");
dayjs.locale("ja");
dayjs.extend(utc);
export default class Weather {
    async receive(apiKey, latitude, longitude) {
        const url = "https://api.openweathermap.org/data/2.5/onecall";
        const params = {
            appid: apiKey,
            lat: latitude,
            lon: longitude,
            exclude: "current,minutely,daily,alerts",
            units: "metric",
            lang: "ja",
        };
        const res = await axios.get(url, {
            params: params,
        });
        const data = res.data;
        const hourly = data.hourly;
        const arrangedHourly = hourly.map((h) => {
            const localTime = dayjs.utc(h.dt).local();
            return {
                dt: localTime,
                temp: h.temp,
                pop: h.pop,
            };
        });
        data.hourly = arrangedHourly;
        return data;
    }
}
//# sourceMappingURL=Weather.js.map