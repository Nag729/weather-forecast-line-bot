export interface WeatherInfo {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  hourly: Hourly[];
}

export interface Hourly {
  dt: string;
  temp: number;
  pop: number;
}
