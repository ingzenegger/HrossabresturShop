import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ProductForm from "./ProductForm";
import { slugify } from "@/shared/lib/slugify";

const emptyValues = {
  nameIs: "",
  nameEn: "",
  slug: "",
  descriptionIs: "",
  descriptionEn: "",
  price: "",
  productType: "",
  isActive: false,
};

describe("ProductForm", () => {
  it("pre-fills the fields from initialValues", () => {
    render(
      <ProductForm
        initialValues={{
          nameIs: "Blá vettlingur",
          nameEn: "Blue Mitten",
          slug: "blue-mitten",
          descriptionIs: "Hlýr vettlingur",
          descriptionEn: "A warm mitten",
          price: "4500",
          productType: "handmade",
          isActive: true,
        }}
        submitLabel="Save"
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Name (Icelandic)")).toHaveValue("Blá vettlingur");
    expect(screen.getByLabelText("Name (English)")).toHaveValue("Blue Mitten");
    expect(screen.getByLabelText("Slug")).toHaveValue("blue-mitten");
    expect(screen.getByLabelText("Description (Icelandic)")).toHaveValue("Hlýr vettlingur");
    expect(screen.getByLabelText("Description (English)")).toHaveValue("A warm mitten");
    expect(screen.getByLabelText("Price (ISK)")).toHaveValue(4500);
    expect(screen.getByRole("combobox")).toHaveTextContent("Handmade");
    expect(screen.getByLabelText("Active (visible in shop)")).toBeChecked();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("auto-generates the slug from the English name until the slug is edited by hand", async () => {
    render(
      <ProductForm initialValues={emptyValues} submitLabel="Add product" onSubmit={vi.fn()} />,
    );

    await userEvent.type(screen.getByLabelText("Name (English)"), "Blue Wool Mittens");

    expect(screen.getByLabelText("Slug")).toHaveValue(slugify("Blue Wool Mittens"));
  });

  it("stops auto-generating the slug once the user edits it directly", async () => {
    render(
      <ProductForm initialValues={emptyValues} submitLabel="Add product" onSubmit={vi.fn()} />,
    );

    await userEvent.type(screen.getByLabelText("Name (English)"), "Blue Mittens");
    await userEvent.clear(screen.getByLabelText("Slug"));
    await userEvent.type(screen.getByLabelText("Slug"), "custom-slug");
    await userEvent.type(screen.getByLabelText("Name (English)"), " Extra");

    expect(screen.getByLabelText("Slug")).toHaveValue("custom-slug");
  });

  it("calls onSubmit with the current field values when submitted", async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <ProductForm initialValues={emptyValues} submitLabel="Add product" onSubmit={handleSubmit} />,
    );

    await userEvent.type(screen.getByLabelText("Name (Icelandic)"), "Blá vettlingur");
    await userEvent.type(screen.getByLabelText("Name (English)"), "Blue Mittens");
    await userEvent.type(screen.getByLabelText("Description (Icelandic)"), "Hlýr");
    await userEvent.type(screen.getByLabelText("Description (English)"), "Warm");
    await userEvent.type(screen.getByLabelText("Price (ISK)"), "4500");
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(screen.getByRole("option", { name: "Handmade" }));
    await userEvent.click(screen.getByLabelText("Active (visible in shop)"));
    await userEvent.click(screen.getByRole("button", { name: "Add product" }));

    expect(handleSubmit).toHaveBeenCalledWith({
      nameIs: "Blá vettlingur",
      nameEn: "Blue Mittens",
      slug: slugify("Blue Mittens"),
      descriptionIs: "Hlýr",
      descriptionEn: "Warm",
      price: "4500",
      productType: "handmade",
      isActive: true,
    });
  });

  it("shows an error message when onSubmit throws", async () => {
    const handleSubmit = vi.fn().mockRejectedValue(new Error("Slug is already taken."));
    render(
      <ProductForm initialValues={emptyValues} submitLabel="Add product" onSubmit={handleSubmit} />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Add product" }));

    expect(screen.getByText("Slug is already taken.")).toBeInTheDocument();
  });

  it("falls back to a generic error message when onSubmit throws a non-Error value", async () => {
    const handleSubmit = vi.fn().mockRejectedValue("network blew up");
    render(
      <ProductForm initialValues={emptyValues} submitLabel="Add product" onSubmit={handleSubmit} />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Add product" }));

    expect(
      screen.getByText("something went wrong. Try again."),
    ).toBeInTheDocument();
  });
});