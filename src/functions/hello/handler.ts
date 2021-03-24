import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import "source-map-support/register";
import Hello from "./Hello";
import schema from "./schema";
const hello = new Hello();

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  return formatJSONResponse({
    message: hello.greet(event.body.name),
    event,
  });
};

export const main = middyfy(handler);
