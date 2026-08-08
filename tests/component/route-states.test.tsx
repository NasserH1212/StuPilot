import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  RouteError,
  RouteLoading,
  RouteNotFound,
} from "@/src/modules/foundation/presentation/route-state";

const mockedRoute = vi.hoisted(() => ({ locale: "en" }));

vi.mock("next/navigation", () => ({
  useParams: () => ({ locale: mockedRoute.locale }),
}));

describe("localized route states", () => {
  it("announces loading without presenting a fake feature", () => {
    render(<RouteLoading />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading the shell");
  });

  it("renders the error boundary and retries", () => {
    const retry = vi.fn();
    render(<RouteError retry={retry} />);
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(retry).toHaveBeenCalledOnce();
  });

  it("renders a safe localized not-found state", () => {
    render(<RouteNotFound />);
    expect(screen.getByRole("heading", { name: "Page not found" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Return home" })).toHaveAttribute(
      "href",
      "/en",
    );
  });
});
