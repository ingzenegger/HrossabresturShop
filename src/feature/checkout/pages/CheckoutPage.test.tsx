//test empty card fields stopper
//test that end user can never see the checkoutpage if they are not signed in and or have no cart or cart items
//test what happens if checkout fails
//test that page navigates on success
// things that need mocking: appStore, cartTotals, checkout and useNavigate

import { render, screen } from "@testing-library/react";
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

// Helper to fill card fields with valid values.
async function fillCardForm() {
  await userEvent.type(screen.getByLabelText("Name on card"), "Jon Jonsson");
  await userEvent.type(
    screen.getByLabelText("Card number"),
    "1234 5678 9012 3456",
  );
  await userEvent.type(screen.getByLabelText("Expiry"), "12/27");
  await userEvent.type(screen.getByLabelText("CVV"), "123");
}

//actual tests
describe("CheckoutPage form validation", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    await i18n.changeLanguage("en");
  });

  it("shows an error when card fields are empty and form is submitted", async () => {
    render(<CheckoutPage />);

    await userEvent.click(screen.getByRole("button", { name: /pay/i }));

    expect(
      screen.getByText("Please fill in all card fields."),
    ).toBeInTheDocument();
  });

  it("shows an error when cart is empty even if card fields are filled", async () => {
    // Override cartItems to be empty for this test only
    mockStore.cartItems = [];

    render(<CheckoutPage />);
    await fillCardForm();
    await userEvent.click(screen.getByRole("button", { name: /pay/i }));

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

    render(<CheckoutPage />);
    await fillCardForm();
    await userEvent.click(screen.getByRole("button", { name: /pay/i }));

    expect(
      screen.getByText(
        "Something went wrong placing your order. Please try again.",
      ),
    ).toBeInTheDocument();
  });

  it("navigates to confirmation page when checkout succeeds", async () => {
    mockCheckout.mockResolvedValueOnce("order-123");

    render(<CheckoutPage />);
    await fillCardForm();
    await userEvent.click(screen.getByRole("button", { name: /pay/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/order-confirmation/order-123");
  });
});
