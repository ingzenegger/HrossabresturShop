//test that the right next-step info shows for each payment/delivery combination
// things that need mocking: useParams/useNavigate, appStore, and the supabase client

import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import OrderConfirmationPage from "./OrderConfirmationPage";
import i18n from "@/shared/i18n/i18n";

vi.mock("react-router", () => ({
  useParams: () => ({ orderId: "abcd1234-0000-4000-8000-000000000000" }),
  useNavigate: () => vi.fn(),
}));

// i18n reads the store with getState(), so the mock needs that too
vi.mock("@/shared/store/appStore", () => {
  const state = { language: "en" };
  const useAppStore = (selector: (s: typeof state) => unknown) =>
    selector(state);
  useAppStore.getState = () => state;
  return { useAppStore };
});

// the order that the mocked supabase query returns; each test sets it
const mockSingle = vi.hoisted(() => vi.fn());
vi.mock("@/shared/lib/client", () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({ single: mockSingle }),
      }),
    }),
  }),
}));

const baseOrder = {
  id: "abcd1234-0000-4000-8000-000000000000",
  status: "pending",
  total: 50000,
  submitted_at: "2026-09-24T12:00:00Z",
  order_items: [],
  payment_method: "bank_transfer",
  delivery_method: "pickup",
  shipping_cost: 0,
  shipping_name: null,
  shipping_street: null,
  shipping_postcode: null,
  shipping_city: null,
};

function renderPage() {
  // a fresh client per test so cached orders don't leak between tests
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={queryClient}>
      <OrderConfirmationPage />
    </QueryClientProvider>,
  );
}

describe("OrderConfirmationPage", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    await i18n.changeLanguage("en");
  });

  it("shows bank details and a short reference for bank transfer", async () => {
    mockSingle.mockResolvedValueOnce({ data: baseOrder, error: null });

    renderPage();

    expect(await screen.findByText("Account number")).toBeInTheDocument();
    expect(screen.getByText("ABCD1234")).toBeInTheDocument();
    expect(
      screen.getByText(/arrange a time to pick up your order/),
    ).toBeInTheDocument();
  });

  it("shows pay-on-pickup info and no bank details", async () => {
    mockSingle.mockResolvedValueOnce({
      data: { ...baseOrder, payment_method: "pay_on_pickup" },
      error: null,
    });

    renderPage();

    expect(
      await screen.findByText("You pay when you pick up your order."),
    ).toBeInTheDocument();
    expect(screen.queryByText("Account number")).not.toBeInTheDocument();
  });

  it("shows the shipping address for posted orders", async () => {
    mockSingle.mockResolvedValueOnce({
      data: {
        ...baseOrder,
        delivery_method: "post",
        total: 51500,
        shipping_cost: 1500,
        shipping_name: "Jón Jónsson",
        shipping_street: "Laugavegur 1",
        shipping_postcode: "101",
        shipping_city: "Reykjavík",
      },
      error: null,
    });

    renderPage();

    expect(
      await screen.findByText("Your order will be sent by post to:"),
    ).toBeInTheDocument();
    expect(screen.getByText(/Laugavegur 1/)).toBeInTheDocument();
    expect(screen.getByText(/101 Reykjavík/)).toBeInTheDocument();
    expect(screen.getByText("Shipping")).toBeInTheDocument();
    expect(screen.getByText("ISK 1,500")).toBeInTheDocument();
  });

  it("shows no shipping line for pickup orders", async () => {
    mockSingle.mockResolvedValueOnce({ data: baseOrder, error: null });

    renderPage();

    expect(await screen.findByText("Next steps")).toBeInTheDocument();
    expect(screen.queryByText("Shipping")).not.toBeInTheDocument();
  });
});
