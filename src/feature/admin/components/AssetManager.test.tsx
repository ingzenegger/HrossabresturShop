import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AssetManager from "./AssetManager";
import type { ProductAsset, ProductVariant } from "@/shared/types/product";

const mockInvalidateQueries = vi.hoisted(() => vi.fn());
vi.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({ invalidateQueries: mockInvalidateQueries }),
}));

const mockUploadAsset = vi.hoisted(() => vi.fn());
vi.mock("../api/uploadAsset", () => ({
  uploadAsset: mockUploadAsset,
}));

const mockAddAsset = vi.hoisted(() => vi.fn());
vi.mock("../api/addAsset", () => ({
  addAsset: mockAddAsset,
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const productId = "3fa85f64-5717-4562-b3fc-2c963f66afa6";

function makeFile(name = "photo.png") {
  return new File(["fake image content"], name, { type: "image/png" });
}

describe("AssetManager", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows an empty state and the add button when there are no assets", () => {
    render(<AssetManager productId={productId} assets={[]} variants={[]} />);

    expect(screen.getByText("No Images yet")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "+ Add Image" })).toBeInTheDocument();
  });

  it("shows each asset's variant name, or Product-level when it has none", () => {
    const variants: ProductVariant[] = [
      {
        id: "variant-1",
        product_id: productId,
        name: { en: "Blue", is: "Blár" },
        price: 2500,
        stock_quantity: 10,
        created_at: "2024-01-01",
      },
    ];
    const assets: ProductAsset[] = [
      {
        id: "asset-1",
        product_id: productId,
        asset_url: "https://example.com/blue.png",
        asset_type: "image",
        alt_text: "Blue mitten",
        sort_order: 0,
        created_at: "2024-01-01",
        variant_id: "variant-1",
      },
      {
        id: "asset-2",
        product_id: productId,
        asset_url: "https://example.com/general.png",
        asset_type: "image",
        alt_text: "General mitten photo",
        sort_order: 0,
        created_at: "2024-01-01",
        variant_id: null,
      },
    ];

    render(<AssetManager productId={productId} assets={assets} variants={variants} />);

    expect(screen.getByText("Blue")).toBeInTheDocument();
    expect(screen.getByText("Product-level")).toBeInTheDocument();
  });

  it("uploads a new asset with the correct computed sort order", async () => {
    mockUploadAsset.mockResolvedValueOnce("https://example.com/new.png");
    mockAddAsset.mockResolvedValueOnce(undefined);

    const existingAsset: ProductAsset = {
      id: "asset-1",
      product_id: productId,
      asset_url: "https://example.com/existing.png",
      asset_type: "image",
      alt_text: "Existing photo",
      sort_order: 0,
      created_at: "2024-01-01",
      variant_id: null,
    };

    render(
      <AssetManager productId={productId} assets={[existingAsset]} variants={[]} />,
    );

    await userEvent.click(screen.getByRole("button", { name: "+ Add Image" }));
    await userEvent.upload(screen.getByLabelText("Image"), makeFile());
    await userEvent.type(screen.getByLabelText("Alt text"), "A cozy mitten");
    await userEvent.click(screen.getByRole("button", { name: "Upload image" }));

    expect(mockUploadAsset).toHaveBeenCalledWith(expect.any(File), productId);
    expect(mockAddAsset).toHaveBeenCalledWith(
      expect.objectContaining({
        product_id: productId,
        variant_id: null,
        asset_url: "https://example.com/new.png",
        asset_type: "image",
        alt_text: "A cozy mitten",
        sort_order: 1, // one existing product-level asset already
      }),
    );
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ["adminProducts"],
    });
    // unlike the other managers, the form stays open after a successful upload
    expect(
      screen.getByRole("button", { name: "Upload image" }),
    ).toBeInTheDocument();
  });

  it("hides the form when Done is clicked, without uploading anything", async () => {
    render(<AssetManager productId={productId} assets={[]} variants={[]} />);

    await userEvent.click(screen.getByRole("button", { name: "+ Add Image" }));
    await userEvent.click(screen.getByRole("button", { name: "Done" }));

    expect(mockUploadAsset).not.toHaveBeenCalled();
    expect(mockAddAsset).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "+ Add Image" })).toBeInTheDocument();
  });

  it("shows an error and does not call addAsset when the payload fails validation", async () => {
    mockUploadAsset.mockResolvedValueOnce("https://example.com/new.png");

    render(<AssetManager productId="not-a-uuid" assets={[]} variants={[]} />);

    await userEvent.click(screen.getByRole("button", { name: "+ Add Image" }));
    await userEvent.upload(screen.getByLabelText("Image"), makeFile());
    await userEvent.click(screen.getByRole("button", { name: "Upload image" }));

    expect(mockUploadAsset).toHaveBeenCalled();
    expect(mockAddAsset).not.toHaveBeenCalled();
    expect(
      screen.getByText(
        "Please check the form - something isn't filled in correctly.",
      ),
    ).toBeInTheDocument();
  });
});