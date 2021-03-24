import Hello from "../../src/functions/hello/Hello";

test("hello", async () => {
  const hello = new Hello();
  expect(hello.greet("Tom")).toBe(`Welcome Tom! Enjoy Serverless!`);
});
