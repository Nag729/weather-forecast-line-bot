import axios from "axios";
import mock from "../../src/functions/receive-weather-info/mock.json";
import Weather from "../../src/functions/Weather";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const weather = new Weather();

test("weather : connection check", async () => {
  const res = { data: mock };
  mockedAxios.get.mockResolvedValue(res);

  const dummy = "dummyStr";
  const data = await weather.receive(dummy, dummy, dummy);

  const expected = {
    hourly: [
      { dt: "2021/03/28_01:00", pop: 0, temp: 15.16 },
      { dt: "2021/03/28_02:00", pop: 0, temp: 15.22 },
      { dt: "2021/03/28_03:00", pop: 20, temp: 15.33 },
      { dt: "2021/03/28_04:00", pop: 0, temp: 15.39 },
      { dt: "2021/03/28_05:00", pop: 0, temp: 15.49 },
      { dt: "2021/03/28_06:00", pop: 2, temp: 15.65 },
      { dt: "2021/03/28_07:00", pop: 6, temp: 16.03 },
      { dt: "2021/03/28_08:00", pop: 6, temp: 16.27 },
      { dt: "2021/03/28_09:00", pop: 8, temp: 16.46 },
      { dt: "2021/03/28_10:00", pop: 32, temp: 16.59 },
      { dt: "2021/03/28_11:00", pop: 32, temp: 16.45 },
      { dt: "2021/03/28_12:00", pop: 48, temp: 15.53 },
      { dt: "2021/03/28_13:00", pop: 54, temp: 15.5 },
      { dt: "2021/03/28_14:00", pop: 75, temp: 16.7 },
      { dt: "2021/03/28_15:00", pop: 71, temp: 17.59 },
    ],
    lat: 35.6291,
    lon: 139.7388,
    timezone: "Asia/Tokyo",
    timezone_offset: 32400,
  };

  expect(data).toEqual(expected);
});
