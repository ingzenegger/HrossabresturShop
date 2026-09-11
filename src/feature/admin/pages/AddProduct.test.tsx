import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AddProduct from "./AddProduct";

const mockNavigate = vi.hoisted(() => vi.fn());
vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));

const mockInvalidateQueries = vi.hoisted(() => vi.fn());
vi.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({ invalidateQueries: mockInvalidateQueries }),
}));

const mockAddProduct = vi.hoisted(() => vi.fn());
vi.mock("../api/addProduct", () => ({
  addProduct: mockAddProduct,
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

describe("AddProduct", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("adds a product and navigates to its view page on success", async () => {
    mockAddProduct.mockResolvedValueOnce({
      id: "new-product-id",
      name: { en: "Blue Mittens", is: "Bláir vettlingar" },
    });

    render(<AddProduct />);

    await userEvent.type(
      screen.getByLabelText("Name (Icelandic)"),
      "Bláir vettlingar",
    );
    await userEvent.type(
      screen.getByLabelText("Name (English)"),
      "Blue Mittens",
    );
    await userEvent.type(
      screen.getByLabelText("Description (Icelandic)"),
      "Hlýtt",
    );
    await userEvent.type(
      screen.getByLabelText("Description (English)"),
      "Warm",
    );
    await userEvent.type(screen.getByLabelText("Price (ISK)"), "4500");
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(screen.getByRole("option", { name: "Handmade" }));
    await userEvent.click(screen.getByRole("button", { name: "Add product" }));

    expect(mockAddProduct).toHaveBeenCalledWith(
      expect.objectContaining({
        name: { en: "Blue Mittens", is: "Bláir vettlingar" },
        price: 4500,
        currency: "ISK",
        product_type: "handmade",
      }),
    );
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ["adminProducts"],
    });
    expect(mockNavigate).toHaveBeenCalledWith("/admin/products/new-product-id");
  });

  it("shows an error and does not navigate when the payload fails validation", async () => {
    render(<AddProduct />);

    // Submitting without picking a product type leaves it as an empty
    // string, which fails NewProductSchema's validation.
    await userEvent.click(screen.getByRole("button", { name: "Add product" }));

    expect(
      screen.getByText(
        "Please check the form - something isn't filled in correctly.",
      ),
    ).toBeInTheDocument();
    expect(mockAddProduct).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
