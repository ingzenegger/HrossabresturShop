import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import VariantManager from "./VariantManager";
import type { ProductVariant } from "@/shared/types/product";

const mockInvalidateQueries = vi.hoisted(() => vi.fn());
vi.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({ invalidateQueries: mockInvalidateQueries }),
}));

const mockAddVariant = vi.hoisted(() => vi.fn());
vi.mock("../api/addVariant", () => ({
  addVariant: mockAddVariant,
}));

const mockUpdateVariant = vi.hoisted(() => vi.fn());
vi.mock("../api/updateVariant", () => ({
  updateVariant: mockUpdateVariant,
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const productId = "3fa85f64-5717-4562-b3fc-2c963f66afa6";

describe("VariantManager", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows an empty state and the add button when there are no variants", () => {
    render(
      <VariantManager productId={productId} variants={[]} currency="ISK" />,
    );

    expect(screen.getByText("No variants yet.")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "+ Add variant" }),
    ).toBeInTheDocument();
  });

  it("adds a new variant and closes the form on success", async () => {
    mockAddVariant.mockResolvedValueOnce(undefined);

    render(
      <VariantManager productId={productId} variants={[]} currency="ISK" />,
    );

    await userEvent.click(
      screen.getByRole("button", { name: "+ Add variant" }),
    );
    await userEvent.type(screen.getByLabelText("Name (Icelandic)"), "Blár");
    await userEvent.type(screen.getByLabelText("Name (English)"), "Blue");
    await userEvent.type(screen.getByLabelText("Price (ISK)"), "3200");
    await userEvent.type(screen.getByLabelText("Stock quantity"), "8");
    await userEvent.click(screen.getByRole("button", { name: "Add variant" }));

    expect(mockAddVariant).toHaveBeenCalledWith(
      expect.objectContaining({
        product_id: productId,
        name: { en: "Blue", is: "Blár" },
        price: 3200,
        stock_quantity: 8,
      }),
    );
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ["adminProducts"],
    });
    expect(
      screen.queryByRole("button", { name: "Add variant" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "+ Add variant" }),
    ).toBeInTheDocument();
  });

  it("edits an existing variant and calls updateVariant", async () => {
    mockUpdateVariant.mockResolvedValueOnce(undefined);

    const variant: ProductVariant = {
      id: "variant-1",
      product_id: productId,
      name: { is: "Blár", en: "Blue" },
      price: 2500,
      stock_quantity: 10,
      created_at: "2024-01-01",
    };

    render(
      <VariantManager
        productId={productId}
        variants={[variant]}
        currency="ISK"
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Edit" }));

    expect(screen.getByLabelText("Name (Icelandic)")).toHaveValue("Blár");
    expect(screen.getByLabelText("Price (ISK)")).toHaveValue(2500);
    expect(screen.getByLabelText("Stock quantity")).toHaveValue(10);

    await userEvent.clear(screen.getByLabelText("Price (ISK)"));
    await userEvent.type(screen.getByLabelText("Price (ISK)"), "2700");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(mockUpdateVariant).toHaveBeenCalledWith(
      "variant-1",
      expect.objectContaining({
        name: { en: "Blue", is: "Blár" },
        price: 2700,
        stock_quantity: 10,
      }),
    );
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ["adminProducts"],
    });
    expect(
      screen.queryByRole("button", { name: "Save" }),
    ).not.toBeInTheDocument();
  });

  it("cancels adding without calling the API", async () => {
    render(
      <VariantManager productId={productId} variants={[]} currency="ISK" />,
    );

    await userEvent.click(
      screen.getByRole("button", { name: "+ Add variant" }),
    );
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(mockAddVariant).not.toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: "+ Add variant" }),
    ).toBeInTheDocument();
  });

  it("shows an error and does not call the API when the payload fails validation", async () => {
    render(
      <VariantManager productId="not-a-uuid" variants={[]} currency="ISK" />,
    );

    await userEvent.click(
      screen.getByRole("button", { name: "+ Add variant" }),
    );
    await userEvent.click(screen.getByRole("button", { name: "Add variant" }));

    expect(
      screen.getByText(
        "Please check the form - something isn't filled in correctly.",
      ),
    ).toBeInTheDocument();
    expect(mockAddVariant).not.toHaveBeenCalled();
  });
});
