import request from "supertest";
import app from "../src/app.js";

describe("health endpoint", () => {
  test("responds with service status", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok", service: "skillswap-api" });
  });
});
