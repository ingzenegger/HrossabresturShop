import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AttributeManager from "./AttributeManager";
import type { ProductAttribute } from "@/shared/types/product";

// Mock the query client so we can assert invalidateQueries was called,
// without needing a real TanStack Query provider wrapping the component.
const mockInvalidateQueries = vi.hoisted(() => vi.fn());
vi.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({ invalidateQueries: mockInvalidateQueries }),
}));

// Mock the two API calls so no real network/Supabase request happens.
const mockAddAttribute = vi.hoisted(() => vi.fn());
vi.mock("../api/addAttribute", () => ({
  addAttribute: mockAddAttribute,
}));

const mockUpdateAttribute = vi.hoisted(() => vi.fn());
vi.mock("../api/updateAttribute", () => ({
  updateAttribute: mockUpdateAttribute,
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const productId = "3fa85f64-5717-4562-b3fc-2c963f66afa6";

describe("AttributeManager", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows an empty state and the add button when there are no attributes", () => {
    render(<AttributeManager productId={productId} attributes={[]} />);

    expect(screen.getByText("No attributes yet.")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "+ Add attribute" }),
    ).toBeInTheDocument();
  });

  it("adds a new attribute and closes the form on success", async () => {
    mockAddAttribute.mockResolvedValueOnce(undefined);

    render(<AttributeManager productId={productId} attributes={[]} />);

    await userEvent.click(
      screen.getByRole("button", { name: "+ Add attribute" }),
    );
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(screen.getByRole("option", { name: "Category" }));
    await userEvent.type(screen.getByLabelText("Value (Icelandic)"), "Teppi");
    await userEvent.type(screen.getByLabelText("Value (English)"), "Blanket");
    await userEvent.click(
      screen.getByRole("button", { name: "Add attribute" }),
    );

    expect(mockAddAttribute).toHaveBeenCalledWith(
      expect.objectContaining({
        product_id: productId,
        key: "category",
        value: { en: "Blanket", is: "Teppi" },
      }),
    );
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: ["adminProducts"],
    });
    expect(
      screen.queryByRole("button", { name: "Add attribute" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "+ Add attribute" }),
    ).toBeInTheDocument();
  });

  it("edits an existing attribute and calls updateAttribute", async () => {
    mockUpdateAttribute.mockResolvedValueOnce(undefined);

    const attribute: ProductAttribute = {
      id: "attr-1",
      product_id: productId,
      key: "category",
      value: { is: "Teppi", en: "Blanket" },
      created_at: "2024-01-01",
    };

    render(<AttributeManager productId={productId} attributes={[attribute]} />);

    await userEvent.click(screen.getByRole("button", { name: "Edit" }));

    expect(screen.getByLabelText("Value (Icelandic)")).toHaveValue("Teppi");
    expect(screen.getByLabelText("Value (English)")).toHaveValue("Blanket");

    await userEvent.clear(screen.getByLabelText("Value (English)"));
    await userEvent.type(
      screen.getByLabelText("Value (English)"),
      "Warm blanket",
    );
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(mockUpdateAttribute).toHaveBeenCalledWith(
      "attr-1",
      expect.objectContaining({
        key: "category",
        value: { en: "Warm blanket", is: "Teppi" },
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
    render(<AttributeManager productId={productId} attributes={[]} />);

    await userEvent.click(
      screen.getByRole("button", { name: "+ Add attribute" }),
    );
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(mockAddAttribute).not.toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: "+ Add attribute" }),
    ).toBeInTheDocument();
  });

  it("shows an error and does not call the API when the payload fails validation", async () => {
    render(<AttributeManager productId="not-a-uuid" attributes={[]} />);

    await userEvent.click(
      screen.getByRole("button", { name: "+ Add attribute" }),
    );
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(screen.getByRole("option", { name: "Category" }));
    await userEvent.click(
      screen.getByRole("button", { name: "Add attribute" }),
    );

    expect(
      screen.getByText(
        "Please check the form - something isn't filled in correctly.",
      ),
    ).toBeInTheDocument();
    expect(mockAddAttribute).not.toHaveBeenCalled();
  });
});
