import "source-map-support/register";
import { middyfy } from "../../libs/lambda";
import Weather from "./../Weather";
const weather = new Weather();
const handler = async () => {
    const apiKey = process.env.ONE_CALL_API_KEY;
    const lat = process.env.MEASUREMENT_LATITUDE;
    const lon = process.env.MEASUREMENT_LONGITUDE;
    const data = await weather.receive(apiKey, lat, lon);
    return data;
};
export const main = middyfy(handler);
//# sourceMappingURL=handler.js.map