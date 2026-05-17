import { ApiError } from "../src/utils/ApiError.js";
import { calculateBookingCredits, ensureSufficientCredits } from "../src/services/creditService.js";

describe("credit service", () => {
  test("calculates credits from hourly rate and duration", () => {
    expect(calculateBookingCredits(4, 2)).toBe(8);
    expect(calculateBookingCredits("3", "5")).toBe(15);
  });

  test("allows booking when user has enough credits", () => {
    expect(() => ensureSufficientCredits({ credits: 10 }, 6)).not.toThrow();
  });

  test("throws clear API error when credits are insufficient", () => {
    expect(() => ensureSufficientCredits({ credits: 2 }, 6)).toThrow(ApiError);
    expect(() => ensureSufficientCredits({ credits: 2 }, 6)).toThrow("Not enough skill credits");
  });
});
