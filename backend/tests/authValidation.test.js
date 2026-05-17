import { validationResult } from "express-validator";
import { registerValidator } from "../src/validators/authValidators.js";

const runValidators = async (body) => {
  const req = { body };
  for (const validator of registerValidator) {
    await validator.run(req);
  }
  return validationResult(req);
};

describe("auth validators", () => {
  test("accepts a valid registration payload", async () => {
    const result = await runValidators({
      name: "Asha Kumar",
      email: "asha@example.com",
      password: "secret123"
    });

    expect(result.isEmpty()).toBe(true);
  });

  test("rejects weak registration payloads", async () => {
    const result = await runValidators({
      name: "A",
      email: "not-an-email",
      password: "123"
    });

    expect(result.isEmpty()).toBe(false);
    expect(result.array().map((error) => error.msg)).toEqual(
      expect.arrayContaining([
        "Name must be at least 2 characters",
        "Valid email is required",
        "Password must be at least 6 characters"
      ])
    );
  });
});
