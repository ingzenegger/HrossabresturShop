import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router";
import ProductsList from "./ProductsList";

const mockUseAdminProducts = vi.hoisted(() => vi.fn());
vi.mock("../hooks/useAdminProducts", () => ({
  useAdminProducts: mockUseAdminProducts,
}));

const { mockStore } = vi.hoisted(() => {
  const mockStore = { language: "en" as "en" | "is" };
  return { mockStore };
});
vi.mock("@/shared/store/appStore", () => {
  const useAppStore = (selector: (state: typeof mockStore) => unknown) =>
    selector(mockStore);
  return { useAppStore };
});

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

function renderList() {
  return render(
    <MemoryRouter>
      <ProductsList />
    </MemoryRouter>,
  );
}

describe("ProductsList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStore.language = "en";
  });

  it("shows a loading message while products are loading", () => {
    mockUseAdminProducts.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    renderList();

    expect(screen.getByText("Loading products...")).toBeInTheDocument();
  });

  it("shows an error message when products fail to load", () => {
    mockUseAdminProducts.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("failed"),
    });

    renderList();

    expect(
      screen.getByText("Something went wrong loading products."),
    ).toBeInTheDocument();
  });

  it("shows an empty state when there are no products", () => {
    mockUseAdminProducts.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    renderList();

    expect(screen.getByText("No products yet.")).toBeInTheDocument();
  });

  it("renders the product name in the current language", () => {
    mockStore.language = "is";
    mockUseAdminProducts.mockReturnValue({
      data: [baseProduct],
      isLoading: false,
      error: null,
    });

    renderList();

    expect(screen.getByText("Bláir vettlingar")).toBeInTheDocument();
  });

  it("shows stock quantity and active status for a product with no variants", () => {
    mockUseAdminProducts.mockReturnValue({
      data: [baseProduct],
      isLoading: false,
      error: null,
    });

    renderList();

    expect(screen.getByText(/Stock: 5 · Active/)).toBeInTheDocument();
  });

  it("shows the variant count and inactive status for a product with variants", () => {
    const productWithVariants = {
      ...baseProduct,
      is_active: false,
      product_variants: [
        {
          id: "v1",
          product_id: "product-1",
          name: { is: "Blár", en: "Blue" },
          price: 2500,
          stock_quantity: 3,
          created_at: "2024-01-01",
        },
        {
          id: "v2",
          product_id: "product-1",
          name: { is: "Rauður", en: "Red" },
          price: 2500,
          stock_quantity: 2,
          created_at: "2024-01-01",
        },
      ],
    };
    mockUseAdminProducts.mockReturnValue({
      data: [productWithVariants],
      isLoading: false,
      error: null,
    });

    renderList();

    expect(screen.getByText(/2 variants · Inactive/)).toBeInTheDocument();
  });

  it("links to the product's view page and edit page", () => {
    mockUseAdminProducts.mockReturnValue({
      data: [baseProduct],
      isLoading: false,
      error: null,
    });

    renderList();

    expect(screen.getByRole("link", { name: "Blue Mittens" })).toHaveAttribute(
      "href",
      "/admin/products/product-1",
    );
    expect(screen.getByRole("link", { name: "Edit" })).toHaveAttribute(
      "href",
      "/admin/products/product-1/edit",
    );
  });
});
