import { handlerPath } from "@libs/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  timeout: 60,
  events: [
    {
      schedule: "cron(0 13 * * ? *)", // Run at 22:00 JST (13:00 UTC) every day
    },
  ],
};
