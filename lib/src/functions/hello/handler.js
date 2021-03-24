import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import "source-map-support/register";
import Hello from "./Hello";
const hello = new Hello();
const handler = async (event) => {
    return formatJSONResponse({
        message: hello.greet(event.body.name),
        event,
    });
};
export const main = middyfy(handler);
//# sourceMappingURL=handler.js.map