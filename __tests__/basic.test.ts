import { Unicorn } from "../src/unicorn";

test("Unicorn", () => {
  // Given
  const unicorn = new Unicorn();

  // When
  const hello = unicorn.sayHelloTo("Carl");

  // Then
  expect(hello).toBe("🦄 Hello Carl !");
});
