import { handlerPath } from "@libs/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      schedule: "cron(0 0 * * ? *)", // Run at 00:00 am (UTC) every day
    },
  ],
};
