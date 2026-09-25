//test that end user can never see the checkoutpage if they are not signed in and or have no cart or cart items
//test what happens if checkout fails
//test that page navigates on success
//test that delivery/payment choices reach checkout()
// things that need mocking: appStore, cartTotals, checkout and useNavigate

import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CheckoutPage from "./CheckoutPage";
import i18n from "@/shared/i18n/i18n";

// Mockidy mock:
const mockNavigate = vi.hoisted(() => vi.fn());
vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));
// replace the react query hook with mock
vi.mock("@/feature/cart/hooks/useCartTotals", () => ({
  useCartTotals: () => ({ data: { total: 50000 } }),
}));

// Mock checkout so it doesn't go to Supabase
const mockCheckout = vi.hoisted(() => vi.fn());
vi.mock("@/feature/checkout/api/checkoutApi", () => ({
  checkout: mockCheckout,
}));

// Mock the shipping price so it doesn't go to Supabase
vi.mock("@/feature/checkout/api/shopSettingsApi", () => ({
  getShippingPrice: () => Promise.resolve(1500),
}));

// Mock Zustand store
const { mockStore } = vi.hoisted(() => {
  const mockSetCartItems = vi.fn();
  const mockSetCartId = vi.fn();
  const mockStore = {
    language: "en",
    cartId: "cart-1",
    customerId: "customer-1",
    cartItems: [
      {
        id: "item-1",
        quantity: 2,
        product: {
          name: { en: "Handmade Thingy", is: "handgert dót" },
          price: 25000,
        },
        variant: { name: "Blue", price: 25000 },
      },
    ],
    setCartItems: mockSetCartItems,
    setCartId: mockSetCartId,
  };
  return { mockStore };
});

vi.mock("@/shared/store/appStore", () => {
  const useAppStore = (selector: (state: typeof mockStore) => unknown) =>
    selector(mockStore);
  useAppStore.getState = () => mockStore;
  return { useAppStore };
});

// CheckoutPage uses React Query now, so it needs a QueryClientProvider
function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={queryClient}>
      <CheckoutPage />
    </QueryClientProvider>,
  );
}

//actual tests
describe("CheckoutPage", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    await i18n.changeLanguage("en");
  });

  it("shows an error when cart is empty", async () => {
    // Override cartItems to be empty for this test only
    mockStore.cartItems = [];

    renderPage();
    await userEvent.click(screen.getByRole("button", { name: /place order/i }));

    expect(
      screen.getByText("Your cart is empty or you are not signed in."),
    ).toBeInTheDocument();

    // Restore for other tests
    mockStore.cartItems = [
      {
        id: "item-1",
        quantity: 2,
        product: {
          name: { en: "Handmade Thingy", is: "handgert dót" },
          price: 25000,
        },
        variant: { name: "Blue", price: 25000 },
      },
    ];
  });

  it("shows an error when checkout API fails", async () => {
    // checkout returns null to simulate a failure
    mockCheckout.mockResolvedValueOnce(null);

    renderPage();
    await userEvent.click(screen.getByRole("button", { name: /place order/i }));

    expect(
      screen.getByText(
        "Something went wrong placing your order. Please try again.",
      ),
    ).toBeInTheDocument();
  });

  it("navigates to confirmation page when checkout succeeds", async () => {
    mockCheckout.mockResolvedValueOnce("order-123");

    renderPage();
    await userEvent.click(screen.getByRole("button", { name: /place order/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/order-confirmation/order-123");
  });

  it("sends pickup and bank transfer by default", async () => {
    mockCheckout.mockResolvedValueOnce("order-123");

    renderPage();
    await userEvent.click(screen.getByRole("button", { name: /place order/i }));

    expect(mockCheckout).toHaveBeenCalledWith(
      expect.objectContaining({
        deliveryMethod: "pickup",
        paymentMethod: "bank_transfer",
        shippingAddress: null,
      }),
    );
  });

  it("sends the methods the customer chose", async () => {
    mockCheckout.mockResolvedValueOnce("order-123");

    renderPage();
    await userEvent.click(screen.getByLabelText(/pay on pickup/i));
    await userEvent.click(screen.getByRole("button", { name: /place order/i }));

    expect(mockCheckout).toHaveBeenCalledWith(
      expect.objectContaining({
        deliveryMethod: "pickup",
        paymentMethod: "pay_on_pickup",
      }),
    );
  });

  it("switches away from pay on pickup when post is chosen", async () => {
    renderPage();

    await userEvent.click(screen.getByLabelText(/pay on pickup/i));
    await userEvent.click(screen.getByLabelText(/^post/i));

    expect(screen.getByLabelText(/pay on pickup/i)).toBeDisabled();
    expect(screen.getByLabelText(/bank transfer/i)).toBeChecked();
  });

  it("shows address fields only when post is chosen", async () => {
    renderPage();

    expect(screen.queryByLabelText("Street address")).not.toBeInTheDocument();

    await userEvent.click(screen.getByLabelText(/^post/i));

    expect(screen.getByLabelText("Street address")).toBeInTheDocument();
  });

  it("does not place a posted order without an address", async () => {
    renderPage();
    await userEvent.click(screen.getByLabelText(/^post/i));
    await userEvent.click(screen.getByRole("button", { name: /place order/i }));

    expect(
      screen.getByText("Please fill in the shipping address."),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Required")).toHaveLength(3);
    expect(screen.getByText("Postcode must be 3 digits")).toBeInTheDocument();
    expect(mockCheckout).not.toHaveBeenCalled();
  });

  it("sends the trimmed address for posted orders", async () => {
    mockCheckout.mockResolvedValueOnce("order-123");

    renderPage();
    await userEvent.click(screen.getByLabelText(/^post/i));
    await userEvent.type(
      screen.getByLabelText("Recipient name"),
      " Jón Jónsson ",
    );
    await userEvent.type(
      screen.getByLabelText("Street address"),
      "Laugavegur 1",
    );
    await userEvent.type(screen.getByLabelText("Postcode"), "101");
    await userEvent.type(screen.getByLabelText("Town"), "Reykjavík");
    await userEvent.click(screen.getByRole("button", { name: /place order/i }));

    expect(mockCheckout).toHaveBeenCalledWith(
      expect.objectContaining({
        deliveryMethod: "post",
        shippingAddress: {
          name: "Jón Jónsson",
          street: "Laugavegur 1",
          postcode: "101",
          city: "Reykjavík",
        },
      }),
    );
  });
  it("adds the shipping price to the total when post is chosen", async () => {
    renderPage();

    // pickup: no shipping line, total is just the items
    expect(screen.queryByText("Shipping")).not.toBeInTheDocument();

    await userEvent.click(screen.getByLabelText(/^post/i));

    expect(await screen.findByText("Shipping")).toBeInTheDocument();
    expect(screen.getByText("ISK 1,500")).toBeInTheDocument();
    expect(screen.getByText("ISK 51,500")).toBeInTheDocument();
  });
});
