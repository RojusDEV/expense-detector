import { describe, expect, test } from "vitest";
import SubscriptonsPage from "./SubscriptonsPage";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

describe("Subscriptions page", () => {
  // TC01 Page load
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  test("Should render a subscriptions page", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SubscriptonsPage />
      </QueryClientProvider>,
    );
    await waitFor(() => {
      expect(screen.getByText("Prenumeratos")).toBeInTheDocument();
    });

    expect(
      screen.getByText("Automatiškai aptiktos pasikartojančios transakcijos"),
    ).toBeInTheDocument();
  });

  // TC02 Amount calculation

  test("Calculated amount should match the actual amount", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SubscriptonsPage />
      </QueryClientProvider>,
    );
    await waitFor(() => {
      expect(screen.getByText("€132.29")).toBeInTheDocument();
    });
  });
});
