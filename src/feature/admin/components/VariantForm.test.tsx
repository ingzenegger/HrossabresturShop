import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import VariantForm from "./VariantForm";

const emptyValues = { nameIs: "", nameEn: "", price: "", stockQuantity: "" };

describe("VariantForm", () => {
  it("pre-fills the fields from initialValues", () => {
    render(
      <VariantForm
        initialValues={{
          nameIs: "Blár",
          nameEn: "Blue",
          price: "2500",
          stockQuantity: "10",
        }}
        submitLabel="Save"
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Name (Icelandic)")).toHaveValue("Blár");
    expect(screen.getByLabelText("Name (English)")).toHaveValue("Blue");
    expect(screen.getByLabelText("Price (ISK)")).toHaveValue(2500);
    expect(screen.getByLabelText("Stock quantity")).toHaveValue(10);
    expect(
      screen.getByRole("button", { name: "Save" }),
    ).toBeInTheDocument();
  });

  it("calls onSubmit with the current field values when submitted", async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <VariantForm
        initialValues={emptyValues}
        submitLabel="Add variant"
        onSubmit={handleSubmit}
      />,
    );

    await userEvent.type(screen.getByLabelText("Name (Icelandic)"), "Rauður");
    await userEvent.type(screen.getByLabelText("Name (English)"), "Red");
    await userEvent.type(screen.getByLabelText("Price (ISK)"), "3000");
    await userEvent.type(screen.getByLabelText("Stock quantity"), "5");
    await userEvent.click(screen.getByRole("button", { name: "Add variant" }));

    expect(handleSubmit).toHaveBeenCalledWith({
      nameIs: "Rauður",
      nameEn: "Red",
      price: "3000",
      stockQuantity: "5",
    });
  });

  it("shows an error message when onSubmit throws", async () => {
    const handleSubmit = vi
      .fn()
      .mockRejectedValue(new Error("Stock quantity must be a number."));
    render(
      <VariantForm
        initialValues={emptyValues}
        submitLabel="Add variant"
        onSubmit={handleSubmit}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Add variant" }));

    expect(
      screen.getByText("Stock quantity must be a number."),
    ).toBeInTheDocument();
  });

  it("falls back to a generic error message when onSubmit throws a non-Error value", async () => {
    const handleSubmit = vi.fn().mockRejectedValue("network blew up");
    render(
      <VariantForm
        initialValues={emptyValues}
        submitLabel="Add variant"
        onSubmit={handleSubmit}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Add variant" }));

    expect(
      screen.getByText("something went wrong. Try again."),
    ).toBeInTheDocument();
  });
});
