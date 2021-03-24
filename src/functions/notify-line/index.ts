import { handlerPath } from "@libs/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      stream: {
        type: "dynamodb",
        arn: {
          "Fn::GetAtt": ["usersTable", "StreamArn"],
        },
        batchSize: 50,
        batchWindow: 10, // wait 10 seconds before execute.
        startingPosition: "LATEST",
      },
    },
  ],
};
