import { handlerPath } from "@libs/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  timeout: 60,
  events: [
    {
      schedule: "cron(30 0 * * ? *)", // Run at 09:30 JST (00:30 UTC) every day
    },
  ],
};
