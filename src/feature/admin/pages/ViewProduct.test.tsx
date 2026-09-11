import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router";
import ViewProduct from "./ViewProduct";

// Keep the real Link/MemoryRouter (ViewProduct renders a real <Link>), but
// override just useParams so we control which product id is "in the URL".
const mockParams = vi.hoisted(() => ({ id: "product-1" }));
vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    useParams: () => mockParams,
  };
});

const mockUseAdminProducts = vi.hoisted(() => vi.fn());
vi.mock("../hooks/useAdminProducts", () => ({
  useAdminProducts: mockUseAdminProducts,
}));

// Replace the three managers entirely — their own behavior is already
// covered by their own test files, so here we only care what props
// ViewProduct passes them.
const mockAttributeManager = vi.hoisted(() => vi.fn((_props: unknown) => null));
vi.mock("../components/AttributeManager", () => ({
  default: mockAttributeManager,
}));

const mockVariantManager = vi.hoisted(() => vi.fn((_props: unknown) => null));
vi.mock("../components/VariantManager", () => ({
  default: mockVariantManager,
}));

const mockAssetManager = vi.hoisted(() => vi.fn((_props: unknown) => null));
vi.mock("../components/AssetManager", () => ({
  default: mockAssetManager,
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
  product_assets: [{ id: "asset-1" }],
  product_variants: [{ id: "variant-1" }],
  product_attributes: [{ id: "attr-1" }],
};

function renderPage() {
  return render(
    <MemoryRouter>
      <ViewProduct />
    </MemoryRouter>,
  );
}

describe("ViewProduct", () => {
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

    renderPage();

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows an error message when products fail to load", () => {
    mockUseAdminProducts.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("failed"),
    });

    renderPage();

    expect(
      screen.getByText("Something went wrong loading the product."),
    ).toBeInTheDocument();
  });

  it("shows 'Product not found.' when no product matches the id", () => {
    mockParams.id = "missing-id";
    mockUseAdminProducts.mockReturnValue({
      data: [baseProduct],
      isLoading: false,
      error: null,
    });

    renderPage();

    expect(screen.getByText("Product not found.")).toBeInTheDocument();
  });

  it("renders the product summary and edit link", () => {
    mockUseAdminProducts.mockReturnValue({
      data: [baseProduct],
      isLoading: false,
      error: null,
    });

    renderPage();

    expect(
      screen.getByRole("heading", { name: "Bláir vettlingar" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Blue Mittens")).toBeInTheDocument();
    expect(screen.getByText("blue-mittens")).toBeInTheDocument();
    expect(screen.getByText("handmade")).toBeInTheDocument();
    expect(screen.getByText("4500 ISK")).toBeInTheDocument();
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("Hlýtt")).toBeInTheDocument();
    expect(screen.getByText("Warm")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Edit product" })).toHaveAttribute(
      "href",
      "/admin/products/product-1/edit",
    );
  });

  it("passes the correct props to each manager", () => {
    mockUseAdminProducts.mockReturnValue({
      data: [baseProduct],
      isLoading: false,
      error: null,
    });

    renderPage();

    expect(mockAttributeManager.mock.calls[0][0]).toEqual({
      productId: "product-1",
      attributes: baseProduct.product_attributes,
    });
    expect(mockVariantManager.mock.calls[0][0]).toEqual({
      productId: "product-1",
      variants: baseProduct.product_variants,
      currency: "ISK",
    });
    expect(mockAssetManager.mock.calls[0][0]).toEqual({
      productId: "product-1",
      variants: baseProduct.product_variants,
      assets: baseProduct.product_assets,
    });
  });
});
