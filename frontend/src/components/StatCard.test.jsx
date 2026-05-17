import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import StatCard from "./StatCard.jsx";

describe("StatCard", () => {
  test("renders metric label and value", () => {
    render(<StatCard label="Available credits" value={12} />);
    expect(screen.getByText("Available credits")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });
});
