import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import EditProduct from "./EditProduct";

const mockNavigate = vi.hoisted(() => vi.fn());
const mockParams = vi.hoisted(() => ({ id: "product-1" }));
vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
  useParams: () => mockParams,
}));

const mockUseAdminProducts = vi.hoisted(() => vi.fn());
vi.mock("../hooks/useAdminProducts", () => ({
  useAdminProducts: mockUseAdminProducts,
}));

const mockInvalidateQueries = vi.hoisted(() => vi.fn());
vi.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({ invalidateQueries: mockInvalidateQueries }),
}));

const mockUpdateProduct = vi.hoisted(() => vi.fn());
vi.mock("../api/updateProduct", () => ({
  updateProduct: mockUpdateProduct,
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const baseProduct = {
  id: "product-1",
  name: { is: "Bláir vettlingar", en: "Blue Mittens" },
  slug: "blue-mittens",
  description: { is: "Hlýtt", en: "Warm" },
  price: 4500,
  currency: "ISK",
  stock_quantity: 5,
  is_active: true,
  created_at: "2024-01-01",
  updated_at: "2024-01-01",
  product_type: "handmade",
  product_assets: [],
  product_variants: [],
  product_attributes: [],
};

describe("EditProduct", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockParams.id = "product-1";
  });

  it("shows a loading message while products are loading", () => {
    mockUseAdminProducts.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    render(<EditProduct />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows an error message when the products fail to load", () => {
    mockUseAdminProducts.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("failed"),
    });

    render(<EditProduct />);

    expect(
      screen.getByText("Something went wrong loading the product."),
    ).toBeInTheDocument();
  });

  it("shows 'Product not found' when no product matches the id", () => {
    mockParams.id = "missing-id";
    mockUseAdminProducts.mockReturnValue({
      data: [baseProduct],
      isLoading: false,
      error: null,
    });

    render(<EditProduct />);

    expect(screen.getByText("Product not found")).toBeInTheDocument();
  });

  it("pre-fills the form with the product's existing values", () => {
    mockUseAdminProducts.mockReturnValue({
      data: [baseProduct],
      isLoading: false,
      error: null,
    });

    render(<EditProduct />);

    expect(
      screen.getByRole("heading", { name: "Edit Product: Blue Mittens" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Name (Icelandic)")).toHaveValue(
      "Bláir vettlingar",
    );
    expect(screen.getByLabelText("Name (English)")).toHaveValue("Blue Mittens");
    expect(screen.getByLabelText("Slug")).toHaveValue("blue-mittens");
    expect(screen.getByLabelText("Price (ISK)")).toHaveValue(4500);
    expect(screen.getByRole("combobox")).toHaveTextContent("Handmade");
    expect(screen.getByLabelText("Active (visible in shop)")).toBeChecked();
  });

  it("shows the variant price warning when the product has variants", () => {
    mockUseAdminProducts.mockReturnValue({
      data: [
        {
          ...baseProduct,
          product_variants: [
            {
              id: "variant-1",
              product_id: "product-1",
              name: { is: "Blár", en: "Blue" },
              price: 2500,
              stock_quantity: 10,
              created_at: "2024-01-01",
            },
          ],
        },
      ],
      isLoading: false,
      error: null,
    });

    render(<EditProduct />);

    expect(
      screen.getByText(
        "This product has variants with their own prices. The price field below only changes the base product.",
      ),
    ).toBeInTheDocument();
  });

  it("does not show the variant price warning when the product has no variants", () => {
    mockUseAdminProducts.mockReturnValue({
      data: [baseProduct],
      isLoading: false,
      error: null,
    });

    render(<EditProduct />);

    expect(
      screen.queryByText(
        "This product has variants with their own prices. The price field below only changes the base product.",
      ),
    ).not.toBeInTheDocument();
  });

  it("updates the product and navigates to its view page on success", async () => {
    mockUseAdminProducts.mockReturnValue({
      data: [baseProduct],
      isLoading: false,
      error: null,
    });
    mockUpdateProduct.mockResolvedValueOnce(undefined);

    render(<EditProduct />);

    await userEvent.clear(screen.getByLabelText("Price (ISK)"));
    await userEvent.type(screen.getByLabelText("Price (ISK)"), "5000");
    await userEvent.click(screen.getByRole("button", { name: "Save changes" }));

    expect(mockUpdateProduct).toHaveBeenCalledWith(
      "product-1",
      expect.objectContaining({
        price: 5000,
        name: { en: "Blue Mittens", is: "Bláir vettlingar" },
      }),
    );
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ["adminProducts"],
    });
    expect(mockNavigate).toHaveBeenCalledWith("/admin/products/product-1");
  });

  it("shows an error and does not navigate when the payload fails validation", async () => {
    mockUseAdminProducts.mockReturnValue({
      data: [{ ...baseProduct, product_type: "" }],
      isLoading: false,
      error: null,
    });

    render(<EditProduct />);

    await userEvent.click(screen.getByRole("button", { name: "Save changes" }));

    expect(
      screen.getByText(
        "Please check the form - something isn't filled in correctly.",
      ),
    ).toBeInTheDocument();
    expect(mockUpdateProduct).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
